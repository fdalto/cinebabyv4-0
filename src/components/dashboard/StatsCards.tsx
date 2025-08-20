
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  created_at: string;
  clinica_id: string;
}

interface StatsCardsProps {
  pacientes: Paciente[];
}

const StatsCards = ({ pacientes }: StatsCardsProps) => {
  const pacientesToday = pacientes.filter(p => {
    const today = new Date().toDateString();
    const pacienteDate = new Date(p.created_at).toDateString();
    return today === pacienteDate;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="border-l-4 border-cinebaby-purple shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total de Pacientes
          </CardTitle>
          <Users className="h-4 w-4 text-cinebaby-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cinebaby-purple">{pacientes.length}</div>
          <p className="text-xs text-gray-500">
            Gestantes cadastradas
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-cinebaby-turquoise shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Pacientes Hoje
          </CardTitle>
          <Users className="h-4 w-4 text-cinebaby-turquoise" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cinebaby-turquoise">
            {pacientesToday}
          </div>
          <p className="text-xs text-gray-500">
            Cadastradas hoje
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
