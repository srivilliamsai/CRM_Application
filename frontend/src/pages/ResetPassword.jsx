import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { resetPassword } from '../services/api';

export default function ResetPassword() {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Token would normally come from URL query params
            const response = await resetPassword('dummy-token', formData.password);
            setSuccess(response.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-32 pb-24">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -z-10" />

                <div className="w-full max-w-md space-y-4">
                    <div className="glass p-10 rounded-3xl space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Reset Password
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Enter your new password below.
                            </p>
                        </div>

                        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    className="input-field pl-10 pr-10"
                                    placeholder="New Password"
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

                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Confirm New Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
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
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
