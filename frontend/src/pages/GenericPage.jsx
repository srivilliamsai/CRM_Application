import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function GenericPage({ title, children }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                <div className="space-y-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white">
                        {title}
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        {children || (
                            <div className="space-y-6 text-gray-600 dark:text-gray-400">
                                <p>
                                    This is a placeholder page for <strong>{title}</strong>.
                                    The content for this section is currently under development.
                                </p>
                                <p>
                                    At UniQ CRM, we are constantly working to improve our platform and documentation.
                                    Please check back later for updates.
                                </p>
                                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 mt-8">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Need immediate assistance?</h3>
                                    <p>
                                        If you have specific questions about {title}, please don't hesitate to reach out to our support team at <a href="mailto:support@uniq-crm.com" className="text-primary hover:underline">support@uniq-crm.com</a>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
