
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  created_at: string;
  clinica_id: string;
}

interface EditPacienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  paciente: Paciente | null;
}

const EditPacienteForm = ({ isOpen, onClose, onSuccess, paciente }: EditPacienteFormProps) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (paciente && isOpen) {
      setNome(paciente.nome);
      setTelefone(paciente.telefone);
    }
  }, [paciente, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paciente) return;
    
    if (!nome.trim() || !telefone.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('pacientes')
        .update({
          nome: nome.trim(),
          telefone: telefone.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', paciente.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Dados da paciente atualizados com sucesso.",
      });

      onSuccess();
      onClose();
      
      // Limpar formulário
      setNome('');
      setTelefone('');
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados da paciente. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setNome('');
    setTelefone('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-cinebaby-purple">Editar Paciente</DialogTitle>
          <DialogDescription>
            Altere os dados da paciente {paciente?.nome}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="edit-nome" className="text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <Input
              id="edit-nome"
              type="text"
              placeholder="Digite o nome completo da paciente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-telefone" className="text-sm font-medium text-gray-700">
              Telefone
            </label>
            <Input
              id="edit-telefone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-cinebaby-purple hover:bg-cinebaby-purple/90"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPacienteForm;
