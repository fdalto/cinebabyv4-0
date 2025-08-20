-- Atualizar o limite de tamanho do bucket "videos" para 3GB
UPDATE storage.buckets 
SET file_size_limit = 3221225472  -- 3GB em bytes (3 * 1024 * 1024 * 1024)
WHERE id = 'videos';