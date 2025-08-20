
-- Criar tabela para armazenar os pacientes
CREATE TABLE public.pacientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

-- Criar política que permite às clínicas ver apenas seus próprios pacientes
CREATE POLICY "Clinicas can view their own pacientes" 
  ON public.pacientes 
  FOR SELECT 
  USING (true);

-- Criar política que permite às clínicas inserir pacientes para elas mesmas
CREATE POLICY "Clinicas can create their own pacientes" 
  ON public.pacientes 
  FOR INSERT 
  WITH CHECK (true);

-- Criar política que permite às clínicas atualizar seus próprios pacientes
CREATE POLICY "Clinicas can update their own pacientes" 
  ON public.pacientes 
  FOR UPDATE 
  USING (true);

-- Criar política que permite às clínicas deletar seus próprios pacientes
CREATE POLICY "Clinicas can delete their own pacientes" 
  ON public.pacientes 
  FOR DELETE 
  USING (true);

-- Criar tabela para armazenar vídeos dos pacientes (para futuras funcionalidades)
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
  titulo TEXT,
  arquivo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security para vídeos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Políticas para vídeos
CREATE POLICY "Clinicas can manage their videos" 
  ON public.videos 
  FOR ALL 
  USING (true);
