
-- Remover políticas restritivas existentes para o bucket videos
DROP POLICY IF EXISTS "Allow authenticated insert to videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete to videos" ON storage.objects;

-- Criar políticas mais permissivas para o bucket videos
CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Public Update" ON storage.objects
FOR UPDATE USING (bucket_id = 'videos');

CREATE POLICY "Public Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'videos');

-- Verificar se o bucket videos existe, se não existir, criar
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;
