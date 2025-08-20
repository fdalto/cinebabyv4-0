
-- Criar bucket para armazenar vídeos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Criar políticas para o bucket de vídeos
CREATE POLICY "Allow public access to videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to upload videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete videos" ON storage.objects
FOR DELETE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Habilitar replica identity para realtime updates na tabela videos
ALTER TABLE public.videos REPLICA IDENTITY FULL;

-- Adicionar tabela videos à publicação do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.videos;
