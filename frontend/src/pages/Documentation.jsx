import PageLayout from '../components/PageLayout';
import { Book, FileText, Code, Terminal, Shield, CreditCard } from 'lucide-react';

export default function Documentation() {
    return (
        <PageLayout title="Documentation">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Everything you need to know about UniQ CRM. Search our guides, API references, and tutorials.
                </p>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        className="w-full px-6 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-card focus:ring-2 focus:ring-primary outline-none shadow-sm text-lg"
                    />
                    <button className="absolute right-2 top-2 bg-primary text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                <DocCategory
                    icon={<Book size={32} />}
                    title="Getting Started"
                    desc="Account setup, data import, and basic configuration."
                    links={['Quick Start Guide', 'Importing Data', 'Inviting Team Members']}
                />
                <DocCategory
                    icon={<FileText size={32} />}
                    title="Core Features"
                    desc="Deep dive into Contacts, Deals, and Pipelines."
                    links={['Managing Contacts', 'Sales Pipeline 101', 'Email Integration']}
                />
                <DocCategory
                    icon={<Terminal size={32} />}
                    title="Developer API"
                    desc="Build custom integrations with our REST API."
                    links={['API Authentication', 'Endpoints Reference', 'Webhooks']}
                />
                <DocCategory
                    icon={<Code size={32} />}
                    title="Workflows"
                    desc="Automate your business logic and save time."
                    links={['Creating Automations', 'Triggers & Actions', 'Workflow Templates']}
                />
                <DocCategory
                    icon={<Shield size={32} />}
                    title="Security & Admin"
                    desc="Manage roles, permissions, and security settings."
                    links={['SSO Setup', 'Role-Based Access', 'Audit Logs']}
                />
                <DocCategory
                    icon={<CreditCard size={32} />}
                    title="Billing & Plans"
                    desc="Manage your subscription and payment methods."
                    links={['Upgrade Plan', 'Billing History', 'Payment Methods']}
                />
            </div>

            <div className="bg-gray-50 dark:bg-card rounded-3xl p-10 border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold mb-8">Popular Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ArticleLink title="How to import contacts from CSV" category="Getting Started" views="4.2k" />
                    <ArticleLink title="Setting up your first sales pipeline" category="Sales" views="3.8k" />
                    <ArticleLink title="Configuring email integration (Gmail/Outlook)" category="Integrations" views="3.5k" />
                    <ArticleLink title="Creating custom fields" category="Settings" views="2.9k" />
                    <ArticleLink title="User roles and permissions explained" category="Administration" views="2.1k" />
                    <ArticleLink title="Troubleshooting login issues" category="Support" views="1.5k" />
                </div>
            </div>

            <div className="mt-16 text-center">
                <h3 className="text-xl font-bold mb-4">Can't find what you're looking for?</h3>
                <div className="flex justify-center gap-4">
                    <button className="btn-primary">Contact Support</button>
                    <button className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Join Community</button>
                </div>
            </div>
        </PageLayout>
    );
}

function DocCategory({ icon, title, desc, links }) {
    return (
        <div className="p-8 rounded-3xl bg-white dark:bg-card border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{desc}</p>
            <ul className="space-y-3">
                {links.map(link => (
                    <li key={link} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary cursor-pointer group/link">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/link:bg-primary mr-2 transition-colors"></span>
                        {link}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ArticleLink({ title, category, views }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700/50 rounded-xl hover:border-primary transition-all cursor-pointer hover:shadow-md">
            <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
                <div className="text-xs text-gray-500">{category}</div>
            </div>
            <div className="flex items-center text-xs text-gray-400">
                <span className="mr-1">{views}</span> views
            </div>
        </div>
    );
}
