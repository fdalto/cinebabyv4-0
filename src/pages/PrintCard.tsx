import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import QRCodeComponent from '@/components/QRCodeComponent';

interface Paciente {
  id: string;
  nome: string;
  clinica_id: string;
}

interface Clinica {
  nome: string;
}

const PrintCard = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [clinica, setClinica] = useState<Clinica | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!pacienteId) return;

    try {
      const { data: pacienteData, error: pacienteError } = await supabase
        .from('pacientes')
        .select('*, clinicas(nome)')
        .eq('id', pacienteId)
        .single();

      if (pacienteError) throw pacienteError;
      
      setPaciente(pacienteData);
      setClinica({ nome: pacienteData.clinicas?.nome || 'Clínica' });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 500); // Espera meio segundo para o QR aparecer antes de imprimir
  };

  useEffect(() => {
    fetchData();
    
    // Auto print quando a página carregar
    const timer = setTimeout(() => {
      handlePrint();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pacienteId]);

  if (isLoading || !paciente) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/paciente/${pacienteId}`;

  return (
    <div className="min-h-screen bg-white p-8 print:p-0">
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
          .logo-cinebaby {
            height: 160px;
          }
        }
        
        @page {
          size: A4;
          margin: 2cm;
        }
      `}</style>
      
      <div className="max-w-lg mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/11c646c5-83c3-4ae9-b5ca-83145f51532d.png" 
            alt="CineBaby Logo" 
            className="h-20 w-auto object-contain mx-auto logo-cinebaby"
          />
        </div>

        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-cinebaby-purple mb-2">
            Momentos Especiais
          </h1>
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-pink-400 mr-2" />
            <span className="text-xl text-gray-700">{paciente.nome}</span>
            <Heart className="h-6 w-6 text-pink-400 ml-2" />
          </div>
          <p className="text-lg text-gray-600 mb-8">
            {clinica?.nome}
          </p>
        </div>

        {/* QR Code */}
        <div className="my-12">
          <QRCodeComponent value={publicUrl} size={250} />
        </div>

        {/* Frase */}
        <div className="bg-gradient-to-r from-cinebaby-purple/10 to-cinebaby-turquoise/10 p-6 rounded-lg">
          <p className="text-lg text-gray-700 italic leading-relaxed">
            "Reviva esse momento mágico sempre que quiser. Ver seu bebê antes do nascimento 
            é um carinho que emociona para sempre."
          </p>
        </div>

        {/* Instruções */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Escaneie o QR Code com seu celular para acessar os vídeos</p>
          <p className="mt-2">ou acesse: <span className="font-mono text-xs break-all">{publicUrl}</span></p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-400">
          <p>Powered by CineBaby - Momentos que ficam para sempre</p>
        </div>
      </div>
    </div>
  );
};

export default PrintCard;
