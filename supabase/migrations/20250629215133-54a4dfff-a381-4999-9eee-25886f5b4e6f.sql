
-- Habilitar extensões necessárias para cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Criar o cron job para executar diariamente às 02:00 UTC
SELECT cron.schedule(
  'cleanup-old-videos',
  '0 2 * * *', -- Todo dia às 02:00 UTC
  $$
  SELECT
    net.http_post(
        url:='https://awgtczesvqdsqqvjyylj.supabase.co/functions/v1/cleanup-old-videos',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z3RjemVzdnFkc3Fxdmp5eWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDAxNjEsImV4cCI6MjA2NjAxNjE2MX0.ZbXuh83J7wfDc0Rbb0owO4Ds-BVXrCcr3wXypDhoOCo"}'::jsonb,
        body:='{"cleanup": true}'::jsonb
    ) as request_id;
  $$
);
