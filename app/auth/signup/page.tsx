'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      
      // 1. Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
            phone: formData.phone || null
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        // 2. Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              company_name: formData.companyName,
              email: formData.email,
              phone: formData.phone || null,
              created_at: new Date().toISOString(),
              status: 'active'
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // User is created, profile might fail but we continue
        }

        // 3. Show success and redirect
        setSuccess(true);
        setTimeout(() => {
          // Redirect to dashboard after signup
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Create Your <span className="text-cyan-400">TextFlow AI</span> Account
          </h2>
          <p className="mt-2 text-gray-300">
            Enterprise AI platform starting at $125/month
          </p>
          <p className="text-sm text-gray-400 mt-1">
            $50 one-time setup fee + SMS credits billed separately
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-900/30 rounded-lg border border-green-700">
              <h3 className="text-xl font-semibold text-green-400">Account Created!</h3>
              <p className="text-green-300 mt-2">
                Welcome to TextFlow AI, {formData.fullName}!
              </p>
              <p className="text-sm text-green-200 mt-1">
                Redirecting to your dashboard...
              </p>
            </div>
            <p className="text-gray-300">
              Next step: Complete payment setup to activate your account.
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="John Smith"
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Acme Inc."
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Business Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="name@company.com"
                />
              </div>

              {/* Phone (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-xs text-gray-400 mt-1">
                  For SMS notifications and account recovery
                </p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="At least 8 characters"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-900/30 text-red-300 border border-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Creating Account...' : 'Create Account & Continue to Payment'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="text-xs text-gray-400 space-y-2">
                <p>
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                  .
                </p>
                <p>
                  <strong>Pricing:</strong> $125/month platform fee + $50 one-time setup + SMS credits at $0.0105/message
                </p>
                <p>
                  <strong>Next Step:</strong> After account creation, you'll complete payment setup to activate your TextFlow AI platform.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}