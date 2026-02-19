import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}>
            <div className={`max-w-4xl mx-auto px-6 transition-all duration-300 ${scrolled ? 'bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl' : 'bg-transparent border border-transparent'} rounded-full`}>
                <div className="flex items-center justify-between h-14">

                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-primary">UniQ</span> CRM
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-1">
                            <NavLink to="/#features">Features</NavLink>
                            <NavLink to="/#pricing">Pricing</NavLink>
                            <NavLink to="/#about">About</NavLink>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                            Log in
                        </Link>
                        <Link to="/signup" className="bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg">
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none transition-colors"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-20 left-4 right-4 md:hidden bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            <MobileNavLink to="/#features" onClick={() => setIsOpen(false)}>Features</MobileNavLink>
                            <MobileNavLink to="/#pricing" onClick={() => setIsOpen(false)}>Pricing</MobileNavLink>
                            <MobileNavLink to="/#about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
                            <div className="h-px bg-white/10 my-4"></div>
                            <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>Log in</MobileNavLink>
                            <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center bg-white text-black font-bold px-3 py-3 rounded-xl mt-4 hover:bg-gray-200 transition-colors">
                                Sign Up Free
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-200"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ to, children, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="block text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 px-4 py-3 rounded-xl transition-colors"
        >
            {children}
        </Link>
    );
}
