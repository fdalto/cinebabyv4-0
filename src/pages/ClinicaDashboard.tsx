
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import PacientesTable from '@/components/dashboard/PacientesTable';
import PacienteForm from '@/components/PacienteForm';
import EditPacienteForm from '@/components/EditPacienteForm';
import EditClinicaForm from '@/components/EditClinicaForm';
import { useClinicaDashboard } from '@/hooks/useClinicaDashboard';

interface ClinicaDashboardProps {
  clinicaId?: string; // Para quando admin acessa pacientes de uma clínica específica
}

const ClinicaDashboard = ({ clinicaId }: ClinicaDashboardProps) => {
  const {
    pacientes,
    filteredPacientes,
    searchTerm,
    isLoading,
    isFormOpen,
    isEditFormOpen,
    selectedPaciente,
    currentClinicaId,
    currentClinicaName,
    isAdmin,
    isEditClinicaOpen,
    currentClinicaData,
    setIsFormOpen,
    setIsEditFormOpen,
    setIsEditClinicaOpen,
    handleSearch,
    handleEditPaciente,
    handleDeletePaciente,
    handlePacienteClick,
    handleLogout,
    handleBackToAdmin,
    fetchPacientes,
    handleEditClinica,
    handleClinicaEditSuccess
  } = useClinicaDashboard(clinicaId);

  if (!currentClinicaId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinebaby-purple/5 via-white to-cinebaby-turquoise/5 flex items-center justify-center">
        <div className="text-red-500">Erro: Clínica não identificada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinebaby-purple/5 via-white to-cinebaby-turquoise/5">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader
          currentClinicaName={currentClinicaName}
          isAdmin={isAdmin}
          clinicaId={clinicaId}
          onBackToAdmin={handleBackToAdmin}
          onLogout={handleLogout}
          onEditClinica={!isAdmin ? handleEditClinica : undefined}
        />

        <StatsCards pacientes={pacientes} />

        <PacientesTable
          filteredPacientes={filteredPacientes}
          searchTerm={searchTerm}
          isLoading={isLoading}
          onSearch={handleSearch}
          onAddPaciente={() => setIsFormOpen(true)}
          onEditPaciente={handleEditPaciente}
          onDeletePaciente={handleDeletePaciente}
          onPacienteClick={handlePacienteClick}
        />
      </div>

      <PacienteForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchPacientes}
        clinicaId={currentClinicaId}
      />

      <EditPacienteForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSuccess={fetchPacientes}
        paciente={selectedPaciente}
      />

      <EditClinicaForm
        isOpen={isEditClinicaOpen}
        onClose={() => setIsEditClinicaOpen(false)}
        onSuccess={handleClinicaEditSuccess}
        clinica={currentClinicaData}
        requireCurrentPasswordForPasswordChange={!isAdmin}
      />
    </div>
  );
};

export default ClinicaDashboard;
