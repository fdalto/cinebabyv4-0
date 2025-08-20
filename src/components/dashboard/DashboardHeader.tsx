
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Edit } from 'lucide-react';

interface DashboardHeaderProps {
  currentClinicaName: string;
  isAdmin: boolean;
  clinicaId?: string;
  onBackToAdmin: () => void;
  onLogout: () => void;
  onEditClinica?: () => void;
}

const DashboardHeader = ({ 
  currentClinicaName, 
  isAdmin, 
  clinicaId, 
  onBackToAdmin, 
  onLogout,
  onEditClinica 
}: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/11c646c5-83c3-4ae9-b5ca-83145f51532d.png" 
            alt="CineBaby Logo" 
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-cinebaby-purple">
              Pacientes da {currentClinicaName}
              {isAdmin && clinicaId && (
                <span className="text-sm font-normal text-gray-500 ml-2">(Visualização Admin)</span>
              )}
            </h1>
            <p className="text-gray-600">Gerencie suas pacientes e seus ultrassons</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isAdmin && clinicaId && (
            <Button
              onClick={onBackToAdmin}
              variant="outline"
              className="border-cinebaby-turquoise text-cinebaby-turquoise hover:bg-cinebaby-turquoise hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Button>
          )}
          {!isAdmin && onEditClinica && (
            <Button
              onClick={onEditClinica}
              variant="outline"
              className="border-cinebaby-turquoise text-cinebaby-turquoise hover:bg-cinebaby-turquoise hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Dados
            </Button>
          )}
          {!isAdmin && (
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-cinebaby-purple text-cinebaby-purple hover:bg-cinebaby-purple hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
