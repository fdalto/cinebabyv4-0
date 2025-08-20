
-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;

-- Atualizar bucket para vídeos com limite de 500MB
UPDATE storage.buckets 
SET 
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv']
WHERE id = 'videos';

-- Criar políticas de storage para permitir uploads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'videos');
