import { Search, Book, MessageCircle, FileText, ExternalLink, ChevronRight } from 'lucide-react';

export default function HelpPage() {
    return (
        <div className="space-y-6">
            <div className="text-center py-12 px-4 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">How can we help you?</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Search our knowledge base or browse categories below to find answers to your questions.
                </p>

                <div className="max-w-2xl mx-auto relative mt-8">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for articles, guides, and more..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HelpCard
                    icon={<Book size={24} className="text-blue-500" />}
                    title="Documentation"
                    description="Detailed guides and API references for developers."
                    link="Browse Docs"
                />
                <HelpCard
                    icon={<MessageCircle size={24} className="text-green-500" />}
                    title="Community Support"
                    description="Join the conversation and get help from other users."
                    link="Join Community"
                />
                <HelpCard
                    icon={<FileText size={24} className="text-purple-500" />}
                    title="Tutorials"
                    description="Step-by-step video tutorials to get you started."
                    link="Watch Tutorials"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Popular Articles</h3>
                    <div className="space-y-4">
                        <ArticleLink title="Getting Started with UniQ CRM" time="5 min read" />
                        <ArticleLink title="How to import leads from CSV" time="3 min read" />
                        <ArticleLink title="Setting up email integration" time="8 min read" />
                        <ArticleLink title="Managing user roles and permissions" time="4 min read" />
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Contact Support</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <button className="btn-primary w-full flex items-center justify-center gap-2">
                        <MessageCircle size={20} /> Start Live Chat
                    </button>
                    <div className="mt-4 text-center">
                        <a href="#" className="text-sm text-primary hover:underline">Or send us an email</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HelpCard({ icon, title, description, link }) {
    return (
        <div className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{description}</p>
            <div className="flex items-center text-primary font-medium text-sm group">
                {link} <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}

function ArticleLink({ title, time }) {
    return (
        <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
            <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-primary transition-colors">{title}</span>
            </div>
            <span className="text-xs text-gray-400">{time}</span>
        </a>
    );
}
