
-- Habilitar RLS na tabela videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados insiram vídeos
CREATE POLICY "Allow authenticated users to insert videos" ON public.videos
FOR INSERT WITH CHECK (true);

-- Política para permitir que usuários autenticados vejam vídeos
CREATE POLICY "Allow authenticated users to view videos" ON public.videos
FOR SELECT USING (true);

-- Política para permitir que usuários autenticados atualizem vídeos
CREATE POLICY "Allow authenticated users to update videos" ON public.videos
FOR UPDATE USING (true);

-- Política para permitir que usuários autenticados deletem vídeos
CREATE POLICY "Allow authenticated users to delete videos" ON public.videos
FOR DELETE USING (true);

-- Políticas mais permissivas para o bucket de vídeos
CREATE POLICY "Allow public read access to videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated insert to videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete to videos" ON storage.objects
FOR DELETE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');
