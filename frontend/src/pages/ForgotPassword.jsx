import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await forgotPassword(email);
            setSuccess(response.message);
        } catch (err) {
            setError('Failed to process request. Please try again.');
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
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors pl-2">
                        <ArrowLeft size={16} className="mr-2" /> Back to Login
                    </Link>

                    <div className="glass p-10 rounded-3xl space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Forgot Password?
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Enter your email and we'll send you instructions to reset your password.
                            </p>
                        </div>

                        {success ? (
                            <div className="text-center space-y-4">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {success}
                                </p>
                                <Link
                                    to="/login"
                                    className="block w-full btn-primary py-3 text-center text-lg font-semibold shadow-lg"
                                >
                                    Return to Login
                                </Link>
                            </div>
                        ) : (
                            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        required
                                        className="input-field pl-10"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center text-danger text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                        <AlertCircle size={16} className="mr-2 flex-shrink-0" /> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full btn-primary py-3 text-lg font-semibold shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
