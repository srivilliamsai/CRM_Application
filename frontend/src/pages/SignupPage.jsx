import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import { register } from '../services/api';

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', companyName: '', email: '', password: '', role: 'ROLE_ADMIN' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const calculateStrength = (password) => {
        let strength = 0;
        if (password.length > 5) strength += 20;
        if (password.length > 8) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        return strength;
    };

    const strength = calculateStrength(formData.password);

    const getStrengthColor = (s) => {
        if (s <= 40) return 'bg-red-500';
        if (s <= 80) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = (s) => {
        if (s === 0) return '';
        if (s <= 40) return 'Weak';
        if (s <= 80) return 'Medium';
        return 'Strong';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Password Validation
        const pwd = formData.password;
        if (pwd.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }
        if (!/[A-Z]/.test(pwd)) {
            setError("Password must contain at least one uppercase letter.");
            setLoading(false);
            return;
        }
        if (!/[0-9]/.test(pwd)) {
            setError("Password must contain at least one number.");
            setLoading(false);
            return;
        }
        if (!/[^A-Za-z0-9]/.test(pwd)) {
            setError("Password must contain at least one special character.");
            setLoading(false);
            return;
        }

        try {
            // Call real auth-service: POST /api/auth/register
            const response = await register({
                username: formData.email,
                email: formData.email,
                password: formData.password,
                fullName: formData.name,
                companyName: formData.companyName,
                role: formData.role,
            });
            setSuccess(response.message || 'Account created successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const message = err.response?.data?.message
                || err.response?.data?.error
                || 'Registration failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-32 pb-24">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -z-10" />

                <div className="w-full max-w-lg space-y-4">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors pl-2">
                        <ArrowLeft size={16} className="mr-2" /> Back to Home
                    </Link>

                    <div className="glass p-10 rounded-3xl space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Start your 14-day free trial. No credit card required.
                            </p>
                        </div>

                        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-10"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-10"
                                    placeholder="Company Name"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-10"
                                    placeholder="Work Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Min 6 chars, 1 CAP, 1 Num, 1 Special Char"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {formData.password && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Password Strength:</span>
                                        <span className={`font-medium ${strength <= 40 ? 'text-red-500' :
                                            strength <= 80 ? 'text-yellow-500' : 'text-green-500'
                                            }`}>
                                            {getStrengthText(strength)}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                                            style={{ width: `${strength}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                {/* Role selection removed for public signup, defaults to ROLE_USER */}
                            </div>

                            {error && (
                                <div className="flex items-center text-danger text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                    <AlertCircle size={16} className="mr-2 flex-shrink-0" /> {error}
                                </div>
                            )}

                            {success && (
                                <div className="flex items-center text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                    <CheckCircle size={16} className="mr-2 flex-shrink-0" /> {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full btn-primary py-3 text-lg font-semibold shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            By signing up, you agree to our Terms of Service and Privacy Policy.
                        </p>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-blue-500">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
