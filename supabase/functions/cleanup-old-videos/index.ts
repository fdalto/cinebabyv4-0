
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🧹 Iniciando limpeza automática de vídeos antigos...');

    // Calcular a data limite (9 meses atrás)
    const nineMonthsAgo = new Date();
    nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);
    
    console.log(`📅 Buscando vídeos criados antes de: ${nineMonthsAgo.toISOString()}`);

    // Buscar vídeos com mais de 9 meses
    const { data: oldVideos, error: fetchError } = await supabase
      .from('videos')
      .select('id, arquivo_url, titulo, created_at')
      .lt('created_at', nineMonthsAgo.toISOString());

    if (fetchError) {
      console.error('❌ Erro ao buscar vídeos antigos:', fetchError);
      throw fetchError;
    }

    if (!oldVideos || oldVideos.length === 0) {
      console.log('✅ Nenhum vídeo antigo encontrado para exclusão');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Nenhum vídeo antigo encontrado',
        deletedCount: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`🗑️ Encontrados ${oldVideos.length} vídeos para exclusão`);

    let deletedFiles = 0;
    let deletedRecords = 0;
    const errors: string[] = [];

    // Processar cada vídeo
    for (const video of oldVideos) {
      try {
        console.log(`🔄 Processando vídeo: ${video.titulo || 'Sem título'} (ID: ${video.id})`);

        // Tentar remover arquivo do storage se existir
        if (video.arquivo_url) {
          try {
            // Extrair o caminho do arquivo da URL
            const filePath = video.arquivo_url.split('/').pop();
            if (filePath) {
              const { error: storageError } = await supabase.storage
                .from('videos')
                .remove([filePath]);

              if (storageError) {
                console.warn(`⚠️ Erro ao remover arquivo do storage: ${storageError.message}`);
                errors.push(`Storage error for ${video.id}: ${storageError.message}`);
              } else {
                deletedFiles++;
                console.log(`🗂️ Arquivo removido do storage: ${filePath}`);
              }
            }
          } catch (storageErr) {
            console.warn(`⚠️ Erro inesperado no storage para vídeo ${video.id}:`, storageErr);
            errors.push(`Unexpected storage error for ${video.id}: ${storageErr}`);
          }
        }

        // Remover registro da tabela
        const { error: deleteError } = await supabase
          .from('videos')
          .delete()
          .eq('id', video.id);

        if (deleteError) {
          console.error(`❌ Erro ao remover registro do vídeo ${video.id}:`, deleteError);
          errors.push(`Database error for ${video.id}: ${deleteError.message}`);
        } else {
          deletedRecords++;
          console.log(`🗃️ Registro removido da tabela: ${video.id}`);
        }

      } catch (videoError) {
        console.error(`❌ Erro ao processar vídeo ${video.id}:`, videoError);
        errors.push(`Processing error for ${video.id}: ${videoError}`);
      }
    }

    const result = {
      success: true,
      message: `Limpeza concluída. ${deletedRecords} registros e ${deletedFiles} arquivos removidos`,
      deletedRecords,
      deletedFiles,
      totalFound: oldVideos.length,
      errors: errors.length > 0 ? errors : undefined,
      cutoffDate: nineMonthsAgo.toISOString()
    };

    console.log('✅ Limpeza automática concluída:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Erro crítico na limpeza automática:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Erro desconhecido na limpeza automática' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
