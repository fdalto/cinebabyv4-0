
-- Criar tabela para armazenar as clínicas
CREATE TABLE public.clinicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cidade TEXT NOT NULL,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clinicas ENABLE ROW LEVEL SECURITY;

-- Criar política que permite ao administrador ler todas as clínicas
CREATE POLICY "Admin can view all clinicas" 
  ON public.clinicas 
  FOR SELECT 
  USING (true);

-- Criar política que permite ao administrador inserir clínicas
CREATE POLICY "Admin can create clinicas" 
  ON public.clinicas 
  FOR INSERT 
  WITH CHECK (true);

-- Criar política que permite ao administrador atualizar clínicas
CREATE POLICY "Admin can update clinicas" 
  ON public.clinicas 
  FOR UPDATE 
  USING (true);

-- Criar política que permite ao administrador deletar clínicas
CREATE POLICY "Admin can delete clinicas" 
  ON public.clinicas 
  FOR DELETE 
  USING (true);
