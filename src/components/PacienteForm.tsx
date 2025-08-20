
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Phone } from 'lucide-react';

interface PacienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clinicaId: string;
}

const PacienteForm = ({ isOpen, onClose, onSuccess, clinicaId }: PacienteFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('pacientes')
        .insert([
          {
            nome: formData.nome,
            telefone: formData.telefone,
            clinica_id: clinicaId,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `Paciente "${formData.nome}" cadastrada com sucesso.`,
      });

      setFormData({ nome: '', telefone: '' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar paciente. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ nome: '', telefone: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-cinebaby-purple flex items-center">
            <User className="w-5 h-5 mr-2" />
            Cadastrar Nova Paciente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-cinebaby-purple font-medium">
                Nome Completo *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite o nome da paciente"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="pl-10 border-gray-200 focus:border-cinebaby-turquoise focus:ring-cinebaby-turquoise"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-cinebaby-purple font-medium">
                Telefone *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  className="pl-10 border-gray-200 focus:border-cinebaby-turquoise focus:ring-cinebaby-turquoise"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-cinebaby-purple to-cinebaby-turquoise hover:from-cinebaby-purple/90 hover:to-cinebaby-turquoise/90 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                'Cadastrar Paciente'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PacienteForm;
