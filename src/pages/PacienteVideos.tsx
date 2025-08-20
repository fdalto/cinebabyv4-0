import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, QrCode, Printer, Play, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import QRCodeComponent from '@/components/QRCodeComponent';

interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  clinica_id: string;
}

interface Video {
  id: string;
  titulo: string | null;
  arquivo_url: string | null;
  created_at: string;
  paciente_id: string;
  clinica_id: string;
}

interface Clinica {
  nome: string;
}

const PacienteVideos = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, clinicaData, logout } = useAuth();
  
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [clinica, setClinica] = useState<Clinica | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [isRealAdmin, setIsRealAdmin] = useState(false);
  const [cameFromAdmin, setCameFromAdmin] = useState(false);

  // Verificar se é realmente admin logado
  const checkIfRealAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === 'admin@cinebaby.online') {
        setIsRealAdmin(true);
      }
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
    }
  };

  // Verificar se veio do admin
  const checkIfCameFromAdmin = () => {
    const fromAdmin = sessionStorage.getItem('fromAdmin');
    setCameFromAdmin(fromAdmin === 'true');
  };

  const fetchPacienteData = async () => {
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
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da paciente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !paciente) return;

    // Validar tamanho do arquivo (3GB = 3 * 1024 * 1024 * 1024 bytes)
    const maxSize = 3 * 1024 * 1024 * 1024; // 3GB
    if (uploadFile.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo 3GB. Arquivo atual: ${(uploadFile.size / 1024 / 1024 / 1024).toFixed(2)}GB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('Iniciando upload do arquivo:', uploadFile.name);
      console.log('Tamanho do arquivo:', uploadFile.size, 'bytes');
      console.log('Tipo do arquivo:', uploadFile.type);
      
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${paciente.id}/${Date.now()}.${fileExt}`;

      console.log('Nome do arquivo no storage:', fileName);

      // Upload do arquivo para o Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, uploadFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erro detalhado no upload:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('Upload realizado com sucesso:', uploadData);

      // Obter URL público do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      console.log('URL pública gerada:', publicUrl);

      // Salvar registro no banco
      const { data: videoData, error: dbError } = await supabase
        .from('videos')
        .insert({
          paciente_id: paciente.id,
          clinica_id: paciente.clinica_id,
          titulo: videoTitle || null,
          arquivo_url: publicUrl,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Erro ao salvar no banco:', dbError);
        throw new Error(`Erro ao salvar no banco: ${dbError.message}`);
      }

      console.log('Vídeo salvo no banco com sucesso:', videoData);

      toast({
        title: "Sucesso!",
        description: "Vídeo enviado com sucesso.",
      });

      setUploadFile(null);
      setVideoTitle('');
      
      // Limpar o input de arquivo
      const fileInput = document.getElementById('video') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      fetchPacienteData();
    } catch (error) {
      console.error('Erro completo no upload:', error);
      
      let errorMessage = "Erro ao enviar vídeo. Tente novamente.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = error.message as string;
        if (errorMsg.includes('bucket')) {
          errorMessage = "Erro no armazenamento. Verifique se o bucket existe.";
        } else if (errorMsg.includes('File size')) {
          errorMessage = "Arquivo muito grande. Limite máximo: 3GB.";
        } else if (errorMsg.includes('upload')) {
          errorMessage = `Erro no upload: ${errorMsg}`;
        } else if (errorMsg.includes('banco')) {
          errorMessage = `Erro ao salvar: ${errorMsg}`;
        } else {
          errorMessage = errorMsg;
        }
      }
      
      toast({
        title: "Erro no Upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string, fileName: string) => {
    try {
      // Extrair nome do arquivo da URL
      const urlParts = fileName.split('/');
      const fileNameInStorage = urlParts.slice(-2).join('/'); // paciente_id/timestamp.ext

      console.log('Deletando arquivo:', fileNameInStorage);

      // Deletar arquivo do Storage
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([fileNameInStorage]);

      if (storageError) {
        console.error('Erro ao deletar do storage:', storageError);
        throw storageError;
      }

      // Deletar registro do banco
      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (dbError) {
        console.error('Erro ao deletar do banco:', dbError);
        throw dbError;
      }

      toast({
        title: "Sucesso!",
        description: "Vídeo excluído com sucesso.",
      });

      fetchPacienteData();
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir vídeo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => {
    const fromAdmin = sessionStorage.getItem('fromAdmin');
    const adminClinicaId = sessionStorage.getItem('adminClinicaId');
    
    console.log('handleGoBack - fromAdmin:', fromAdmin);
    console.log('handleGoBack - adminClinicaId:', adminClinicaId);
    console.log('handleGoBack - paciente?.clinica_id:', paciente?.clinica_id);
    
    // Se veio do admin, sempre volta para a lista de pacientes da clínica
    if (fromAdmin === 'true') {
      if (adminClinicaId) {
        console.log('Admin navegando de volta para clínica via sessionStorage:', adminClinicaId);
        navigate(`/admin/clinica/${adminClinicaId}/pacientes`);
      } else if (paciente?.clinica_id) {
        console.log('Admin navegando de volta para clínica via paciente:', paciente.clinica_id);
        navigate(`/admin/clinica/${paciente.clinica_id}/pacientes`);
      } else {
        console.log('Admin voltando para dashboard principal');
        navigate('/admin/dashboard');
      }
    } else {
      // Se é usuário da clínica, volta para o dashboard da clínica
      console.log('Clínica voltando para dashboard');
      navigate('/clinica/dashboard');
    }
  };

  const handleLogout = () => {
    const fromAdmin = sessionStorage.getItem('fromAdmin');
    
    // Se veio do admin, apenas navega de volta sem fazer logout
    if (fromAdmin === 'true' && (isRealAdmin || isAdmin)) {
      handleGoBack();
      return;
    }
    
    // Só executa logout se for uma clínica realmente logada
    if (!isAdmin && !isRealAdmin && clinicaData) {
      logout();
    } else {
      // Fallback para navegação
      handleGoBack();
    }
  };

  const handlePrintCard = () => {
    const printWindow = window.open(`/print-card/${pacienteId}`, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  useEffect(() => {
    fetchPacienteData();
    checkIfRealAdmin();
    checkIfCameFromAdmin();
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

  const publicUrl = `${window.location.origin}/paciente/${pacienteId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinebaby-purple/5 via-white to-cinebaby-turquoise/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleGoBack}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            {/* Só mostra botão Sair se NÃO for admin navegando de dentro do dashboard admin */}
            {!cameFromAdmin && !isRealAdmin && !isAdmin && clinicaData && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/11c646c5-83c3-4ae9-b5ca-83145f51532d.png" 
                alt="CineBaby Logo" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-cinebaby-purple">
                  Vídeos de {paciente?.nome}
                </h1>
                <p className="text-gray-600">Gerencie os ultrassons da paciente</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-cinebaby-turquoise hover:bg-cinebaby-turquoise/90">
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>QR Code para {paciente?.nome}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <QRCodeComponent value={publicUrl} size={200} />
                    <p className="text-sm text-gray-600 text-center">
                      Este QR Code direciona para uma página pública com todos os vídeos da paciente.
                    </p>
                    <p className="text-xs text-gray-500 break-all">{publicUrl}</p>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button
                onClick={handlePrintCard}
                variant="outline"
                className="border-cinebaby-purple text-cinebaby-purple hover:bg-cinebaby-purple hover:text-white"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Cartão
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-cinebaby-purple">Upload de Vídeo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título (opcional)</Label>
                  <Input
                    id="titulo"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Ex: Ultrassom 20 semanas"
                  />
                </div>
                
                <div>
                  <Label htmlFor="video">Arquivo de Vídeo (máximo 3GB)</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                  {uploadFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Arquivo selecionado: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                
                <Button
                  onClick={handleFileUpload}
                  disabled={!uploadFile || isUploading}
                  className="w-full bg-cinebaby-purple hover:bg-cinebaby-purple/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Enviando...' : 'Enviar Vídeo'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-cinebaby-purple">
                  Vídeos Enviados ({videos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videos.length === 0 ? (
                  <div className="text-center py-8">
                    <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Nenhum vídeo enviado ainda.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {videos.map((video) => (
                        <TableRow key={video.id}>
                          <TableCell>
                            {video.titulo || 'Sem título'}
                          </TableCell>
                          <TableCell>
                            {new Date(video.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              {video.arquivo_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(video.arquivo_url!, '_blank')}
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir este vídeo? 
                                      Essa ação não poderá ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteVideo(video.id, video.arquivo_url || '')}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacienteVideos;
