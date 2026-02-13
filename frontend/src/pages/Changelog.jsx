import PageLayout from '../components/PageLayout';

export default function Changelog() {
    return (
        <PageLayout title="Changelog">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="lead text-xl text-gray-600 dark:text-gray-300">
                    New features, improvements, and fixes. We iterate fast to bring you the best CRM experience.
                </p>
                <div className="mt-6 flex justify-center">
                    <button className="flex items-center gap-2 text-primary hover:underline font-medium">
                        Subscribe to updates <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>

            <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-3 md:ml-6 space-y-16">
                <ChangelogEntry version="v2.2.0" date="October 24, 2025" title="Advanced Reporting & Dashboard Customization" badge="Feature">
                    <p className="mb-4">We've completely overhauled the reporting engine. You can now build custom dashboards with drag-and-drop widgets.</p>
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" alt="Dashboard" className="rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 my-4 w-full md:w-3/4" />
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Introduced 15+ new chart types.</li>
                        <li>Added ability to schedule automated email reports to your team.</li>
                        <li>Real-time data refresh for live leaderboards.</li>
                        <li>Fixed an issue where some charts were not rendering on mobile devices.</li>
                    </ul>
                </ChangelogEntry>

                <ChangelogEntry version="v2.0.5" date="October 10, 2025" title="Email Integation Improvements" badge="Improvement">
                    <p className="mb-4">Email sync is now 5x faster and supports more providers.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Two-way sync now supports Outlook calendars and contacts.</li>
                        <li>Improved email parsing for faster lead capture from web forms.</li>
                        <li>Added "Snooze" functionality to the Smart Inbox to handle emails later.</li>
                        <li>Fixed a bug where attachments >25MB were failing to sync.</li>
                    </ul>
                </ChangelogEntry>

                <ChangelogEntry version="v2.0.0" date="September 15, 2025" title="Major Release: Visual Automation Builder" badge="Major">
                    <p className="mb-4 text-gray-600 dark:text-gray-400">We are excited to announce the general availability of our visual workflow builder! Automate complex business logic without writing a single line of code.</p>
                    <img src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1000&q=80" alt="Workflow Builder" className="rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 my-4 w-full md:w-3/4" />
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Visual drag-and-drop workflow canvas.</li>
                        <li>Triggers for email opens, clicks, form submissions, and deal stage changes.</li>
                        <li>Pre-built templates for common sales scenarios (e.g., "New Lead Follow-up").</li>
                        <li>Complete UI redesign for a more modern and accessible experience.</li>
                    </ul>
                </ChangelogEntry>

                <ChangelogEntry version="v1.9.4" date="August 28, 2025" title="Mobile App Updates" badge="Update">
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Added offline mode support for accessing contacts and deals without internet.</li>
                        <li>Push notifications for new assignments and mentions.</li>
                        <li>Biometric login (FaceID/TouchID) support.</li>
                    </ul>
                </ChangelogEntry>
            </div>

            <div className="mt-16 text-center">
                <button className="btn-secondary px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">View Older Versions</button>
            </div>
        </PageLayout>
    );
}

function ChangelogEntry({ version, date, title, badge, children }) {
    const badgeColor = {
        'Feature': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        'Improvement': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        'Major': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        'Update': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        'Fix': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    }[badge] || 'bg-gray-100 text-gray-800';

    return (
        <div className="relative pl-8 md:pl-12">
            <span className="absolute -left-[9px] top-6 h-4 w-4 rounded-full bg-white dark:bg-black border-4 border-primary shadow-sm z-10 box-content"></span>

            <div className="md:flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-400 font-medium mb-1">{date}</span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${badgeColor}`}>{badge}</span>
                    <span className="font-mono text-sm text-gray-500">{version}</span>
                </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                {children}
            </div>
        </div>
    );
}
