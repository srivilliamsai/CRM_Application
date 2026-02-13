import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PageLayout({ title, children }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                <div className="space-y-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white text-center">
                        {title}
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
