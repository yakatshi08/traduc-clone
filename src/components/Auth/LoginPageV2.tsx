import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2,
  Chrome,
  Github,
  Shield,
  CheckCircle,
  Key
} from 'lucide-react';

interface LoginPageV2Props {
  onLogin: () => void;
}

const LoginPageV2: React.FC<LoginPageV2Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email === 'demo@traducxion.com' && password === 'demo123') {
        // Sauvegarder l'authentification
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Animation de succès
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMessage.innerHTML = '✓ Connexion réussie';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          document.body.removeChild(successMessage);
          onLogin();
        }, 1000);
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Login with ${provider}`);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authProvider', provider);
      onLogin();
    } catch (err) {
      setError('Erreur de connexion sociale');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-traduc-violet/20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-traduc-violet/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-traduc-indigo/20 rounded-full blur-3xl animate极ulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-traduc-violet to-traduc-indigo rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">TX</span>
            </div>
            <span className="text-3xl font-bold text-white">
              TraducXion
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bon retour !
          </h1>
          <p className="text-gray-400">
            Connectez-vous à votre compte professionnel
          </p>
        </div>

        {/* Security badge */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Connexion sécurisée SSL</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
            
            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 backdrop-blur border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {!showMFA ? (
              <>
                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse email professionnelle
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-traduc-violet backdrop-blur"
                      placeholder="vous@entreprise.com"
                      required
                      disabled={isLoading}
                    />
                    {email && email.includes('@') && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-traduc-violet backdrop-blur"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-traduc-violet bg-white/10 border-white/20 rounded"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      Rester connecté
                    </span>
                  </label>
                  <a href="#" className="text-sm text-traduc-violet hover:text-traduc-violet/80">
                    Mot de passe oublié ?
                  </a>
                </div>
              </>
            ) : (
              /* MFA Code */
              <div className="mb-6 text-center">
                <Key className="w-16 h-16 text-traduc-violet mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Vérification en deux étapes
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Entrez le code à 6 chiffres
                </p>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-traduc-violet to-traduc-indigo hover:from-traduc-violet/90 hover:to-traduc-indigo/90 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion sécurisée...
                </>
              ) : (
                <>
                  Se connecter
                  <Shield className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Demo account */}
            <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300 text-center">
                <strong className="text-blue-400">Compte démo :</strong> demo@traducxion.com / demo123
              </p>
            </div>
          </div>

          {/* Social login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-traduc-violet/20 text-gray-400">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="px-4 py-3 bg-white/5 backdrop-blur border border-white/20 rounded-lg hover:bg-white/10 transition-all transform hover:scale-105 disabled:opacity-50"
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5 text-gray-400 mx-auto" />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('microsoft')}
                className="px-4 py-3 bg-white/5 backdrop-blur border border-white/20 rounded-lg hover:bg-white/10 transition-all transform hover:scale-105 disabled:opacity-50"
                disabled={isLoading}
              >
                <span className="text-xl">🔷</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                className="px-4 py-3 bg-white/5 backdrop-blur border border-white/20 rounded-lg hover:bg-white/10 transition-all transform hover:scale-105 disabled:opacity-50"
                disabled={isLoading}
              >
                <Github className="w-5 h-5 text-gray-400 mx-auto" />
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-400">
            Pas encore de compte ?{' '}
            <a href="#" className="text-traduc-violet hover:text-traduc-violet/80 font-medium">
              Commencer l'essai gratuit
            </a>
          </p>
          
          <div className="text-xs text-gray-500">
            <p className="mb-2">
              Connexion sécurisée • Chiffrement AES-256 • Conforme RGPD
            </p>
            <div>
              En vous connectant, vous acceptez nos{' '}
              <a href="#" className="text-traduc-violet/70 hover:text-traduc-violet">
                Conditions
              </a>
              {' '}et notre{' '}
              <a href="#" className="text-traduc-violet/70 hover:text-traduc-violet">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageV2;