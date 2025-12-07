import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LandingNavigation } from '@/features/landing/components/LandingNavigation'
import { UserPlus } from 'lucide-react'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  // Username validation: lowercase letters and hyphens only
  const isValidUsername = (value: string) => {
    return /^[a-z][a-z0-9-]*$/.test(value) && !value.endsWith('-') && !value.includes('--')
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to lowercase and only allow valid characters
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setUsername(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // ID validation
    if (!username) {
      setValidationError('ID is required')
      return
    }

    if (!isValidUsername(username)) {
      setValidationError('ID must start with a letter, contain only lowercase letters, numbers, and hyphens (-)')
      return
    }

    if (username.length < 3) {
      setValidationError('ID must be at least 3 characters')
      return
    }

    // Name validation
    if (!name.trim()) {
      setValidationError('Display name is required')
      return
    }
    
    // Password validation
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return
    }
    
    try {
      await register({ username, name, password })
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
                  <UserPlus className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h2 className="font-pixel text-3xl text-primary mb-2">
                Create Account
              </h2>
              <p className="text-white/60 text-sm">
                Join Runna and start deploying functions
              </p>
            </div>
            
            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {(error || validationError) && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{error?.message || validationError}</p>
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
                    placeholder="my-id"
                    value={username}
                    onChange={handleUsernameChange}
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-white/40">Lowercase letters, numbers, and hyphens only</p>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                    Display Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-lg border !border-white/10 bg-background-dark text-white placeholder-white/40 focus:outline-none focus:!border-primary/50 focus:shadow-lg focus:shadow-primary/20 transition-all disabled:opacity-50 [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_rgb(23,23,23)] [&:-webkit-autofill]:![-webkit-text-fill-color:white] [&:-webkit-autofill]:!border-white/10 [&:-webkit-autofill]:!bg-background-dark [&:-webkit-autofill:hover]:!border-white/10 [&:-webkit-autofill:focus]:!border-primary/50"
                    placeholder="Your nickname"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-white/40">This will be displayed to others</p>
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
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-lg border !border-white/10 bg-background-dark text-white placeholder-white/40 focus:outline-none focus:!border-primary/50 focus:shadow-lg focus:shadow-primary/20 transition-all disabled:opacity-50 [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_rgb(23,23,23)] [&:-webkit-autofill]:![-webkit-text-fill-color:white] [&:-webkit-autofill]:!border-white/10 [&:-webkit-autofill]:!bg-background-dark [&:-webkit-autofill:hover]:!border-white/10 [&:-webkit-autofill:focus]:!border-primary/50"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-lg border !border-white/10 bg-background-dark text-white placeholder-white/40 focus:outline-none focus:!border-primary/50 focus:shadow-lg focus:shadow-primary/20 transition-all disabled:opacity-50 [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_rgb(23,23,23)] [&:-webkit-autofill]:![-webkit-text-fill-color:white] [&:-webkit-autofill]:!border-white/10 [&:-webkit-autofill]:!bg-background-dark [&:-webkit-autofill:hover]:!border-white/10 [&:-webkit-autofill:focus]:!border-primary/50"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-white/60 hover:text-primary transition-colors text-sm"
                >
                  Already have an account? <span className="text-primary font-medium">Sign in</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
