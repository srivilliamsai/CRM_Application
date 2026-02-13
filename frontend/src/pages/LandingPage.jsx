import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, BarChart3, Users, Zap, Shield, Mail, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div initial="initial" animate="animate" variants={fadeInUp}>
                        <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 backdrop-blur-sm mb-8 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">v2.0 is now live</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 pb-4 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            CRM re-imagined <br /> for growth.
                        </h1>

                        <p className="mt-4 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Stop wrestling with clunky software. Experience the first CRM that feels like it was designed for humans, not robots.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
                            <Link to="/signup" className="btn-primary text-lg px-10 py-4 rounded-full flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform">
                                Start Free Trial <ArrowRight size={20} />
                            </Link>
                            <Link to="/demo" className="px-10 py-4 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-lg flex items-center justify-center gap-2">
                                <span className="relative flex h-3 w-3 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                                Live Demo
                            </Link>
                        </div>
                    </motion.div>

                    {/* Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="relative mx-auto max-w-6xl"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 dark:opacity-40"></div>
                        <div className="relative glass-card p-2 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card">
                            <img
                                src="https://placehold.co/2400x1500/png?text=Dashboard+UI&font=inter"
                                // In production, replace with real screenshot
                                alt="Dashboard Preview"
                                className="rounded-2xl shadow-inner w-full border border-gray-100 dark:border-gray-800"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="py-10 border-y border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center mb-8">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Trusted by industry leaders</p>
                </div>

                <div className="relative flex overflow-x-hidden group">
                    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
                        {['Acme Corp', 'GlobalBank', 'Nebula', 'Quotient', 'Spherule', 'TechFlow', 'Circle', 'FoxRun'].map((brand, i) => (
                            <span key={i} className="text-2xl font-bold text-gray-600 dark:text-gray-500 mx-4">{brand}</span>
                        ))}
                        {['Acme Corp', 'GlobalBank', 'Nebula', 'Quotient', 'Spherule', 'TechFlow', 'Circle', 'FoxRun'].map((brand, i) => (
                            <span key={`dup-${i}`} className="text-2xl font-bold text-gray-600 dark:text-gray-500 mx-4">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-transparent scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">Everything you need to <span className="text-primary">scale</span></h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Powerful features packed into a clean, intuitive interface that your team will actually love using.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users className="text-white" size={24} />}
                            color="bg-blue-500"
                            title="Customer Management"
                            desc="360-degree view of your contacts with centralized data and activity tracking."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-white" size={24} />}
                            color="bg-purple-500"
                            title="Sales Pipeline"
                            desc="Visualize deals, forecast revenue, and close more sales with drag-and-drop pipelines."
                        />
                        <FeatureCard
                            icon={<Zap className="text-white" size={24} />}
                            color="bg-yellow-500"
                            title="Marketing Automation"
                            desc="Create campaigns, segments, and automate email sequences effortlessly."
                        />
                        <FeatureCard
                            icon={<Shield className="text-white" size={24} />}
                            color="bg-green-500"
                            title="Enterprise Security"
                            desc="Bank-grade encryption, role-based access, and comprehensive audit logs."
                        />
                        <FeatureCard
                            icon={<Mail className="text-white" size={24} />}
                            color="bg-pink-500"
                            title="Smart Inbox"
                            desc="Integrated email client that syncs with your CRM automatically."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-white" size={24} />}
                            color="bg-indigo-500"
                            title="Advanced Analytics"
                            desc="Real-time dashboards and custom reports to drive data-backed decisions."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section - NEW */}
            <section id="pricing" className="py-32 bg-transparent relative overflow-hidden scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">Simple, transparent pricing</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">No hidden fees. Cancel anytime.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <PricingCard title="Starter" price="$29" features={['5 Users', 'Basic CRM', 'Email Support']} />
                        <PricingCard title="Professional" price="$79" featured={true} features={['Unlimited Users', 'Advanced Analytics', 'Marketing Automation', 'Priority Support']} />
                        <PricingCard title="Enterprise" price="Custom" features={['Dedicated Account Manager', 'Custom Integrations', 'SLA', 'SSO & Security']} />
                    </div>
                </div>
            </section>

            {/* Testimonials Section - NEW */}
            <section id="about" className="py-32 bg-transparent scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Loved by thousands of businesses worldwide</h2>
                            <div className="flex gap-1 mb-8">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400" size={24} />)}
                            </div>
                            <blockquote className="text-2xl font-medium text-gray-900 dark:text-white leading-relaxed mb-6">
                                "UniQ CRM completely transformed how we manage our leads. The design is beautiful and the features are exactly what we needed without the bloat."
                            </blockquote>
                            <div>
                                <div className="font-bold text-lg">Sarah Johnson</div>
                                <div className="text-gray-500">VP of Sales, TechFlow</div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl rotate-3 opacity-20"></div>
                            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80" alt="Office" className="relative rounded-3xl shadow-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary dark:bg-blue-600"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to grow your business?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join over 10,000+ companies using UniQ to build better customer relationships.</p>
                    <Link to="/signup" className="inline-block bg-white text-primary font-bold text-lg px-10 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-2xl">
                        Get Started for Free
                    </Link>
                    <p className="mt-6 text-sm text-blue-200">No credit card required • 14-day free trial</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, color, title, desc }) {
    return (
        <div className="group p-8 rounded-3xl bg-gray-50 dark:bg-card border border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-[#2C2C2E] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`mb-6 ${color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}

function PricingCard({ title, price, features, featured = false }) {
    return (
        <div className={`relative p-8 rounded-3xl border ${featured ? 'border-primary shadow-2xl scale-105 bg-white dark:bg-card z-10' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-card shadow-sm'}`}>
            {featured && (
                <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4">{title}</h3>
            <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
                {price !== 'Custom' && <span className="text-gray-500 ml-2">/month</span>}
            </div>
            <ul className="space-y-4 mb-8">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                        <Check className="text-green-500 mr-3" size={18} />
                        {feature}
                    </li>
                ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${featured ? 'bg-primary text-white hover:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                Choose Plan
            </button>
        </div>
    );
}
