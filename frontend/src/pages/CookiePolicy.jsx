import PageLayout from '../components/PageLayout';

export default function CookiePolicy() {
    return (
        <PageLayout title="Cookie Policy">
            <div className="text-sm text-gray-500 mb-8">
                Last updated: October 26, 2025
            </div>
            <p className="lead text-xl mb-8">
                This Cookie Policy explains how UniQ CRM uses cookies and similar technologies to recognize you when you visit our website at uniq-crm.com. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>

            <h3>What are cookies?</h3>
            <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
            <p>
                Cookies set by the website owner (in this case, UniQ CRM) are called "first party cookies". Cookies set by parties other than the website owner are called "third party cookies". Third party cookies enable third party features or functionality to be provided on or through the website (e.g. like advertising, interactive content and analytics). The parties that set these third party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
            </p>

            <h3>Why do we use cookies?</h3>
            <p>
                We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics and other purposes.
            </p>

            <h3>Types of Cookies We Use</h3>
            <div className="space-y-6 my-8">
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50 dark:bg-card">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">Essential Cookies</h4>
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-medium">Always Active</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50 dark:bg-card">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">Performance and Functionality Cookies</h4>
                        <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full font-medium">Optional</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50 dark:bg-card">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">Analytics and Customization Cookies</h4>
                        <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full font-medium">Optional</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50 dark:bg-card">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">Advertising Cookies</h4>
                        <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full font-medium">Optional</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</p>
                </div>
            </div>

            <h3>How can I control cookies?</h3>
            <p>
                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
            <p>
                Specifically, you can exercise your cookie preferences by clicking on the "Cookie Settings" link in the footer of our website.
            </p>
        </PageLayout>
    );
}
