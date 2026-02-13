import PageLayout from '../components/PageLayout';

export default function Blog() {
    return (
        <PageLayout title="Blog">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Insights, updates, and tutorials from the UniQ CRM team.
                </p>
                <div className="flex justify-center gap-2 overflow-x-auto pb-4">
                    <button className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium">All Posts</button>
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium whitespace-nowrap">Product Updates</button>
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium whitespace-nowrap">Sales Strategies</button>
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium whitespace-nowrap">Customer Succcess</button>
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium whitespace-nowrap">Engineering</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                {/* Featured Post */}
                <div className="lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-3xl h-[400px]">
                    <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=2000&q=80" alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 md:p-12 flex flex-col justify-end">
                        <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2">Featured</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Future of AI in Sales: Predictions for 2026</h2>
                        <p className="text-gray-200 text-lg max-w-2xl mb-6">How generative AI is moving from a novelty to a necessity in high-performing sales organizations.</p>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                            <span className="font-semibold text-white">Sarah Johnson</span>
                            <span>•</span>
                            <span>Oct 28, 2025</span>
                            <span>•</span>
                            <span>8 min read</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <BlogCard
                    title="Mastering Sales Pipelines"
                    excerpt="A comprehensive guide to managing your deals and forecasting revenue with precision."
                    date="Oct 18, 2025"
                    image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                    category="Tutorial"
                    author="Mike Chen"
                />
                <BlogCard
                    title="UniQ Raises Series B"
                    excerpt="We are thrilled to announce our latest funding round to accelerate product development."
                    date="Sep 30, 2025"
                    image="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1000&q=80"
                    category="Company"
                    author="David Williams"
                />
                <BlogCard
                    title="5 Email Templates that Convert"
                    excerpt="Boost your response rates with these proven email templates for cold outreach."
                    date="Sep 15, 2025"
                    image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80"
                    category="Growth"
                    author="Jessica Lee"
                />
                <BlogCard
                    title="Building Resilient Systems"
                    excerpt="Lessons learned from scaling our infrastructure to support 100k+ concurrent users."
                    date="Aug 22, 2025"
                    image="https://images.unsplash.com/photo-1558494949-ef526bca40fb?auto=format&fit=crop&w=1000&q=80"
                    category="Engineering"
                    author="Alex Turner"
                />
                <BlogCard
                    title="Customer Retention Strategies"
                    excerpt="Why churn happens and how to prevent it with proactive engagement."
                    date="Aug 10, 2025"
                    image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80"
                    category="Strategy"
                    author="Sarah Johnson"
                />
                <BlogCard
                    title="Q3 Product Update"
                    excerpt="New reporting tools, mobile app improvements, and more."
                    date="Jul 28, 2025"
                    image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"
                    category="Product"
                    author="David Williams"
                />
            </div>

            <div className="mt-20 text-center">
                <button className="btn-secondary px-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Load More Posts</button>
            </div>
        </PageLayout>
    );
}

function BlogCard({ title, excerpt, date, image, category, author }) {
    return (
        <div className="group cursor-pointer flex flex-col h-full">
            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video">
                <img src={image} alt={title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {category}
                </span>
            </div>
            <div className="flex-grow">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{date}</span>
                    <span>•</span>
                    <span>{author}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">{excerpt}</p>
            </div>
        </div>
    );
}
