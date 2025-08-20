import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Heart, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Paciente {
  id: string;
  nome: string;
  clinica_id: string;
}

interface Video {
  id: string;
  titulo: string | null;
  arquivo_url: string | null;
  created_at: string;
}

interface Clinica {
  nome: string;
}

const PacientePublic = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [clinica, setClinica] = useState<Clinica | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [termoAceito, setTermoAceito] = useState(false);

  const fetchData = async () => {
    if (!pacienteId) return;

    try {
      // Buscar dados da paciente
      const { data: pacienteData, error: pacienteError } = await supabase
        .from('pacientes')
        .select('*, clinicas(nome)')
        .eq('id', pacienteId)
        .single();

      if (pacienteError) throw pacienteError;
      
      setPaciente(pacienteData);
      setClinica({ nome: pacienteData.clinicas?.nome || 'Clínica' });

      // Buscar vídeos da paciente
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('created_at', { ascending: false });

      if (videosError) throw videosError;
      setVideos(videosData || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pacienteId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinebaby-purple/5 via-white to-cinebaby-turquoise/5 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinebaby-purple/5 via-white to-cinebaby-turquoise/5 flex items-center justify-center">
        <div className="text-red-500">Paciente não encontrada</div>
      </div>
    );
  }

  // Se o termo não foi aceito, mostrar o termo de uso
  if (!termoAceito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinebaby-purple/5 via-white to-cinebaby-turquoise/5">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/11c646c5-83c3-4ae9-b5ca-83145f51532d.png" 
              alt="CineBaby Logo" 
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-cinebaby-purple mb-2">
              Termo de Uso e Consentimento
            </h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-cinebaby-purple flex items-center gap-2">
                <FileText className="w-6 h-6" />
                TERMO DE USO E CONSENTIMENTO PARA VISUALIZAÇÃO DE VÍDEO DE EXAME
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Ao prosseguir with a visualização do vídeo referente ao seu exame de ultrassom, você declara que leu, compreendeu e concorda com os termos abaixo:
              </p>

              <div>
                <h3 className="font-semibold text-cinebaby-purple mb-2">1. Finalidade do Vídeo</h3>
                <p>
                  O vídeo disponibilizado corresponde à gravação do seu exame de imagem, com a finalidade exclusiva de fornecer informações complementares ao seu atendimento médico. Ele é de uso pessoal e não substitui o laudo médico oficial.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-cinebaby-purple mb-2">2. Prazo de Armazenamento</h3>
                <p>
                  O vídeo ficará disponível por até 9 (nove) meses a partir da data de upload. Após esse período, será automaticamente excluído, sem possibilidade de recuperação.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-cinebaby-purple mb-2">3. Acesso e Compartilhamento</h3>
                <p className="mb-2">
                  O vídeo será enviado por meio de um link público, ou seja, qualquer pessoa que tiver acesso ao link poderá visualizar o conteúdo.
                </p>
                <p>
                  Após o envio do link à paciente, a responsabilidade por seu armazenamento, proteção e eventual compartilhamento é exclusivamente da paciente. A clínica não se responsabiliza por acessos indevidos decorrentes do uso ou repasse desse link a terceiros.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-cinebaby-purple mb-2">4. Tratamento de Dados Pessoais – LGPD</h3>
                <p className="mb-2">
                  Em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018):
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    Os dados pessoais e sensíveis utilizados na gravação serão tratados apenas para os fins previstos neste termo.
                  </li>
                  <li>
                    A clínica compromete-se a adotar medidas razoáveis de segurança para proteção dos dados enquanto estiverem sob sua guarda.
                  </li>
                  <li>
                    A paciente poderá solicitar a exclusão antecipada do vídeo, caso deseje, mediante solicitação expressa por meio dos canais de atendimento da clínica.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-cinebaby-purple mb-2">5. Consentimento Livre e Esclarecido</h3>
                <p className="mb-2">
                  Ao clicar em "Li e concordo com os termos", você consente livremente com a disponibilização do vídeo e declara estar ciente:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>do prazo de 9 meses para armazenamento,</li>
                  <li>da natureza pública do link,</li>
                  <li>da sua responsabilidade pelo controle do acesso após o envio,</li>
                  <li>e do tratamento dos seus dados conforme descrito neste termo.</li>
                </ul>
              </div>

              <div className="pt-6 border-t">
                <div className="text-center">
                  <Button
                    onClick={() => setTermoAceito(true)}
                    className="bg-cinebaby-purple hover:bg-cinebaby-purple/90 text-white px-8 py-3 text-lg"
                    size="lg"
                  >
                    ✅ Li e concordo com os termos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8 text-gray-500">
            <p>Powered by CineBaby - Momentos que ficam para sempre</p>
          </div>
        </div>
      </div>
    );
  }

  // Se o termo foi aceito, mostrar o conteúdo normal dos vídeos
  return (
    <div className="min-h-screen bg-gradient-to-br from-cinebaby-purple/5 via-white to-cinebaby-turquoise/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/11c646c5-83c3-4ae9-b5ca-83145f51532d.png" 
            alt="CineBaby Logo" 
            className="h-16 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-cinebaby-purple mb-2">
            Momentos Especiais
          </h1>
          <h2 className="text-2xl text-gray-700 mb-2">
            {paciente.nome}
          </h2>
          <p className="text-gray-600">
            Clínica: {clinica?.nome}
          </p>
        </div>

        <div className="text-center mb-8 p-6 bg-white/50 rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-pink-400 mb-4" />
          <p className="text-lg text-gray-700 italic">
            "Reviva esse momento mágico sempre que quiser. Ver seu bebê antes do nascimento 
            é um carinho que emociona para sempre."
          </p>
        </div>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Play className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                Ainda não há vídeos disponíveis para esta paciente.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video, index) => (
              <Card key={video.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-cinebaby-purple">
                    {video.titulo || `Ultrassom ${index + 1}`}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(video.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  {video.arquivo_url ? (
                    <div className="space-y-4">
                      <video 
                        controls 
                        className="w-full rounded-lg"
                        preload="metadata"
                      >
                        <source src={video.arquivo_url} type="video/mp4" />
                        Seu navegador não suporta vídeos.
                      </video>
                      <Button
                        onClick={() => window.open(video.arquivo_url!, '_blank')}
                        className="w-full bg-cinebaby-purple hover:bg-cinebaby-purple/90"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Abrir em Tela Cheia
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Vídeo não disponível</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-400">
            O vídeo permanece disponível por 9 meses para que você possa reviver esse momento com carinho.
          </p>
          <p className="text-gray-500">Powered by CineBaby - Momentos que ficam para sempre</p>
        </div>
      </div>
    </div>
  );
};

export default PacientePublic;
