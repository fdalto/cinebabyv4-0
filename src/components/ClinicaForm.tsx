
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClinicaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ClinicaForm = ({ isOpen, onClose, onSuccess }: ClinicaFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    cidade: '',
    endereco: '',
    telefone: '',
    email: '',
    senha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('clinicas')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Clínica cadastrada com sucesso.",
      });

      setFormData({
        nome: '',
        cidade: '',
        endereco: '',
        telefone: '',
        email: '',
        senha: ''
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar clínica:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar clínica. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-cinebaby-purple text-xl font-bold">
            Cadastrar Nova Clínica
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="nome" className="text-gray-700">Nome da Clínica*</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cidade" className="text-gray-700">Cidade*</Label>
              <Input
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="endereco" className="text-gray-700">Endereço*</Label>
              <Input
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="telefone" className="text-gray-700">Telefone*</Label>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700">Email (Login)*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="senha" className="text-gray-700">Senha*</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-cinebaby-purple hover:bg-cinebaby-purple/90"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Clínica'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicaForm;
