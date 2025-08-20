
import React from 'react';
import { Users, Plus, Trash2, Search, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  created_at: string;
  clinica_id: string;
}

interface PacientesTableProps {
  filteredPacientes: Paciente[];
  searchTerm: string;
  isLoading: boolean;
  onSearch: (term: string) => void;
  onAddPaciente: () => void;
  onEditPaciente: (paciente: Paciente) => void;
  onDeletePaciente: (id: string, nome: string) => void;
  onPacienteClick: (pacienteId: string) => void;
}

const PacientesTable = ({
  filteredPacientes,
  searchTerm,
  isLoading,
  onSearch,
  onAddPaciente,
  onEditPaciente,
  onDeletePaciente,
  onPacienteClick
}: PacientesTableProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl text-cinebaby-purple">
            Lista de Pacientes
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button
              onClick={onAddPaciente}
              className="bg-cinebaby-purple hover:bg-cinebaby-purple/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Paciente
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Carregando pacientes...</div>
          </div>
        ) : filteredPacientes.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Nenhuma paciente encontrada.' : 'Nenhuma paciente cadastrada ainda.'}
            </p>
            {!searchTerm && (
              <Button
                onClick={onAddPaciente}
                className="bg-cinebaby-purple hover:bg-cinebaby-purple/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeira Paciente
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPacientes.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-cinebaby-purple hover:text-cinebaby-purple/80"
                      onClick={() => onPacienteClick(paciente.id)}
                    >
                      {paciente.nome}
                    </Button>
                  </TableCell>
                  <TableCell>{paciente.telefone}</TableCell>
                  <TableCell>
                    {new Date(paciente.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => onEditPaciente(paciente)}
                        variant="outline"
                        size="sm"
                        className="border-cinebaby-turquoise text-cinebaby-turquoise hover:bg-cinebaby-turquoise hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a paciente "{paciente.nome}"? 
                              Essa ação não poderá ser desfeita e todos os vídeos relacionados também serão excluídos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeletePaciente(paciente.id, paciente.nome)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PacientesTable;
