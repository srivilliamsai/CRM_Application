import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <span className="text-primary">UniQ</span> CRM
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                            The all-in-one platform to supercharge your sales, marketing, and support teams. Built for modern businesses.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink icon={<Twitter size={20} />} href="#" />
                            <SocialLink icon={<Facebook size={20} />} href="#" />
                            <SocialLink icon={<Instagram size={20} />} href="#" />
                            <SocialLink icon={<Linkedin size={20} />} href="#" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <FooterColumn
                        title="Product"
                        links={[
                            { label: 'Features', to: '/#features' },
                            { label: 'Pricing', to: '/#pricing' },
                            { label: 'Integrations', to: '/integrations' },
                            { label: 'Changelog', to: '/changelog' },
                            { label: 'Documentation', to: '/docs' },
                        ]}
                    />

                    <FooterColumn
                        title="Company"
                        links={[
                            { label: 'About Us', to: '/#about' },
                            { label: 'Careers', to: '/careers' },
                            { label: 'Blog', to: '/blog' },
                            { label: 'Contact', to: '/contact' },
                            { label: 'Partners', to: '/partners' },
                        ]}
                    />

                    <FooterColumn
                        title="Legal"
                        links={[
                            { label: 'Privacy Policy', to: '/privacy' },
                            { label: 'Terms of Service', to: '/terms' },
                            { label: 'Cookie Policy', to: '/cookies' },
                            { label: 'Security', to: '/security' },
                        ]}
                    />
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        © 2026 UniQ CRM Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <ThemeToggle />
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        All Systems Operational
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, links }) {
    return (
        <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
            <ul className="space-y-4">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            to={link.to}
                            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialLink({ icon, href }) {
    return (
        <a
            href={href}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
        >
            {icon}
        </a>
    );
}
