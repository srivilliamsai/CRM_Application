import PageLayout from '../components/PageLayout';
import { Users, Code, Zap, Globe, CheckCircle } from 'lucide-react';

export default function Partners() {
    return (
        <PageLayout title="Partner Program">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Join our partner ecosystem and help businesses grow with UniQ CRM. Whether you're an agency, consultant, or tech provider, we have a program for you.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="btn-primary">Become a Partner</button>
                    <button className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Find a Partner</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                <div className="p-10 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 relative overflow-hidden group">
                    <div className="relative z-10">
                        <Users className="text-primary mb-6" size={40} />
                        <h3 className="text-2xl font-bold mb-4">Solution Partners</h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            For agencies, SIs, and consultants who want to implement UniQ CRM for their clients. Unlock revenue share, dedicated support, and co-marketing opportunities.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-blue-500" /> <span>20% revenue share for 2 years</span></li>
                            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-blue-500" /> <span>Dedicated Partner Manager</span></li>
                            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-blue-500" /> <span>Certification training</span></li>
                        </ul>
                        <button className="btn-primary w-full bg-blue-600 hover:bg-blue-700">Apply to Solutions Program</button>
                    </div>
                </div>

                <div className="p-10 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 relative overflow-hidden group">
                    <div className="relative z-10">
                        <Code className="text-purple-600 mb-6" size={40} />
                        <h3 className="text-2xl font-bold mb-4">Technology Partners</h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            For SaaS companies and developers who want to integrate with UniQ CRM. Build extensions, get listed in our marketplace, and drive user adoption.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-purple-500" /> <span>Access to sandbox environment</span></li>
                            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-purple-500" /> <span>Marketplace listing</span></li>
                            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-purple-500" /> <span>Co-marketing webinars</span></li>
                        </ul>
                        <button className="bg-white dark:bg-card text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-bold py-2 px-4 rounded-xl w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Build Integration
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 dark:bg-white/5 rounded-3xl p-12 text-center text-white mb-20">
                <h2 className="text-3xl font-bold mb-8">Why Partner with UniQ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚀</div>
                        <h3 className="text-xl font-bold mb-2">Fastest Growing CRM</h3>
                        <p className="text-gray-400">Join a rocket ship. We're growing 300% YoY and need partners to help us scale.</p>
                    </div>
                    <div className="p-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤝</div>
                        <h3 className="text-xl font-bold mb-2">True Partnership</h3>
                        <p className="text-gray-400">We don't compete with our partners. We funnel leads to you for implementation.</p>
                    </div>
                    <div className="p-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🌍</div>
                        <h3 className="text-xl font-bold mb-2">Global Reach</h3>
                        <p className="text-gray-400">Serve customers in 50+ countries. Our platform is localized for global markets.</p>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-8 text-center">Our Trusted Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {['Salesforce', 'HubSpot', 'Slack', 'Google', 'Microsoft', 'AWS', 'Stripe', 'Twilio', 'Zapier', 'Zendesk', 'Intercom', 'Mailchimp'].map(partner => (
                    <div key={partner} className="h-16 flex items-center justify-center font-bold text-xl border border-gray-200 dark:border-gray-800 rounded-lg">
                        {partner}
                    </div>
                ))}
            </div>
        </PageLayout>
    );
}
