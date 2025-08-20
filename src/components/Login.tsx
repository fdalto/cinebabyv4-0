
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, Heart } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@cinebaby.online' && password === 'admin123') {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo do CineBaby.",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinebaby-purple/10 via-white to-cinebaby-turquoise/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img 
                  src="/lovable-uploads/11c646c5-83c3-4ae9-b5ca-83145f51532d.png" 
                  alt="CineBaby Logo" 
                  className="h-16 w-auto object-contain"
                />
                <div className="absolute -bottom-2 -right-2 bg-cinebaby-turquoise rounded-full p-1">
                  <Heart className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-cinebaby-purple">
                  Administração CineBaby
                </h1>
                <p className="text-gray-600 text-sm mt-2">
                  Conectando momentos especiais através da tecnologia
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cinebaby-purple font-medium">
                  Email de acesso
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@cinebaby.online"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-cinebaby-turquoise focus:ring-cinebaby-turquoise"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-cinebaby-purple font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-cinebaby-turquoise focus:ring-cinebaby-turquoise"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-cinebaby-purple to-cinebaby-turquoise hover:from-cinebaby-purple/90 hover:to-cinebaby-turquoise/90 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar no Painel'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/clinica/login')}
                className="w-full border-cinebaby-purple text-cinebaby-purple hover:bg-cinebaby-purple hover:text-white"
              >
                Sou uma clínica - Fazer login
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 italic">
                "Reviva esse momento mágico sempre que quiser"
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Plataforma segura para clínicas de ultrassonografia
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
