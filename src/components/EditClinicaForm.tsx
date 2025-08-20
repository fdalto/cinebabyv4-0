
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Clinica {
  id: string;
  nome: string;
  cidade: string;
  endereco: string;
  telefone: string;
  email: string;
}

interface EditClinicaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clinica: Clinica | null;
  requireCurrentPasswordForPasswordChange?: boolean;
}

const EditClinicaForm = ({ isOpen, onClose, onSuccess, clinica, requireCurrentPasswordForPasswordChange = false }: EditClinicaFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    cidade: '',
    endereco: '',
    telefone: '',
    email: '',
    senha: '',
    senhaAtual: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (clinica) {
      setFormData({
        nome: clinica.nome,
        cidade: clinica.cidade,
        endereco: clinica.endereco,
        telefone: clinica.telefone,
        email: clinica.email,
        senha: '', // Never pre-fill password for security
        senhaAtual: ''
      });
    }
  }, [clinica]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinica) return;

    setIsLoading(true);

    try {
      // Prepare update data - only include password if it's not empty
      const updateData: any = {
        nome: formData.nome,
        cidade: formData.cidade,
        endereco: formData.endereco,
        telefone: formData.telefone,
        email: formData.email,
        updated_at: new Date().toISOString()
      };

      // Handle password update with current password validation if required
      if (formData.senha.trim() !== '') {
        if (requireCurrentPasswordForPasswordChange) {
          // For clinics: validate current password first, then update
          if (formData.senhaAtual.trim() === '') {
            toast({
              title: "Erro",
              description: "Informe a senha atual para alterar a senha.",
              variant: "destructive",
            });
            return;
          }
          
          // First update profile data
          const { error: profileError } = await supabase
            .from('clinicas')
            .update(updateData)
            .eq('id', clinica.id);

          if (profileError) throw profileError;

          // Then try to update password with current password validation
          const { error: passwordError } = await supabase
            .from('clinicas')
            .update({ senha: formData.senha, updated_at: new Date().toISOString() })
            .eq('id', clinica.id)
            .eq('senha', formData.senhaAtual);

          if (passwordError) {
            toast({
              title: "Dados atualizados",
              description: "Perfil atualizado, mas senha atual incorreta. Senha não foi alterada.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sucesso!",
              description: "Dados da clínica e senha atualizados com sucesso.",
            });
          }
        } else {
          // For admin: update password directly
          updateData.senha = formData.senha;
          const { error } = await supabase
            .from('clinicas')
            .update(updateData)
            .eq('id', clinica.id);

          if (error) throw error;
          
          toast({
            title: "Sucesso!",
            description: "Dados da clínica atualizados com sucesso.",
          });
        }
      } else {
        // No password change, just update profile
        const { error } = await supabase
          .from('clinicas')
          .update(updateData)
          .eq('id', clinica.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso!",
          description: "Dados da clínica atualizados com sucesso.",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar clínica:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados da clínica. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cinebaby-purple">
            Editar Clínica
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Clínica</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Nome da clínica"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
              placeholder="Cidade"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              placeholder="Endereço"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              placeholder="Telefone"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail/Login</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="E-mail"
              required
              className="w-full"
            />
          </div>

          {requireCurrentPasswordForPasswordChange && formData.senha.trim() !== '' && (
            <div className="space-y-2">
              <Label htmlFor="senhaAtual">Senha Atual</Label>
              <Input
                id="senhaAtual"
                type="password"
                value={formData.senhaAtual}
                onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
                placeholder="Informe sua senha atual"
                required
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="senha">Nova Senha (opcional)</Label>
            <Input
              id="senha"
              type="password"
              value={formData.senha}
              onChange={(e) => handleInputChange('senha', e.target.value)}
              placeholder="Deixe vazio para manter a senha atual"
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClinicaForm;
