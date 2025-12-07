import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LandingNavigation } from '@/features/landing/components/LandingNavigation'
import { LogIn } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await login({ username, password })
      navigate('/workspaces')
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background-dark">
      <LandingNavigation />
      
      <main className="flex-1 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(245, 166, 35, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 166, 35, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative z-10 flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <LogIn className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h2 className="font-pixel text-3xl text-primary mb-2">
                Welcome Back
              </h2>
              <p className="text-white/60 text-sm">
                Sign in to access your workspaces
              </p>
            </div>
            
            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{error.message}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                    ID
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    className="w-full px-4 py-3 rounded-lg border !border-white/10 bg-background-dark text-white placeholder-white/40 focus:outline-none focus:!border-primary/50 focus:shadow-lg focus:shadow-primary/20 transition-all disabled:opacity-50 [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_rgb(23,23,23)] [&:-webkit-autofill]:![-webkit-text-fill-color:white] [&:-webkit-autofill]:!border-white/10 [&:-webkit-autofill]:!bg-background-dark [&:-webkit-autofill:hover]:!border-white/10 [&:-webkit-autofill:focus]:!border-primary/50"
                    placeholder="Enter your ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 rounded-lg border !border-white/10 bg-background-dark text-white placeholder-white/40 focus:outline-none focus:!border-primary/50 focus:shadow-lg focus:shadow-primary/20 transition-all disabled:opacity-50 [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_rgb(23,23,23)] [&:-webkit-autofill]:![-webkit-text-fill-color:white] [&:-webkit-autofill]:!border-white/10 [&:-webkit-autofill]:!bg-background-dark [&:-webkit-autofill:hover]:!border-white/10 [&:-webkit-autofill:focus]:!border-primary/50"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary text-background-dark font-medium hover:brightness-110 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-background-dark"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-white/60 hover:text-primary transition-colors text-sm"
                >
                  Don't have an account? <span className="text-primary font-medium">Sign up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
