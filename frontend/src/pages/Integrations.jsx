import PageLayout from '../components/PageLayout';

export default function Integrations() {
    return (
        <PageLayout title="Integrations Marketplace">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <p className="lead text-xl mb-8">
                    Connect UniQ CRM with your favorite tools. Automate workflows and sync data across your entire stack.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="px-6 py-2 rounded-full bg-gray-900 text-white dark:bg-white dark:text-black font-semibold">All Apps</button>
                    <button className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Marketing</button>
                    <button className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Sales</button>
                    <button className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Productivity</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                <IntegrationCard name="Slack" category="Communication" icon="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/240px-Slack_icon_2019.svg.png" desc="Receive notifications and update deals directly from Slack." />
                <IntegrationCard name="Google Workspace" category="Productivity" icon="https://authjs.dev/img/providers/google.svg" desc="Sync Gmail, Calendar, and Drive files with your CRM records." />
                <IntegrationCard name="Microsoft 365" category="Productivity" icon="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/240px-Microsoft_logo.svg.png" desc="Seamless integration with Outlook, Excel, and Teams." />
                <IntegrationCard name="Zoom" category="Video Formatting" icon="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/240px-Zoom_Communications_Logo.svg.png" desc="Schedule and launch video meetings directly from contact profiles." />
                <IntegrationCard name="Stripe" category="Finance" icon="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/240px-Stripe_Logo%2C_revised_2016.svg.png" desc="View payment history and subscription status next to customer details." />
                <IntegrationCard name="Mailchimp" category="Marketing" icon="https://www.vectorlogo.zone/logos/mailchimp/mailchimp-icon.svg" desc="Sync contacts and segment audiences for email marketing campaigns." />
                <IntegrationCard name="Zapier" category="Automation" icon="https://www.vectorlogo.zone/logos/zapier/zapier-icon.svg" desc="Connect UniQ CRM to 5,000+ other apps with custom workflows." />
                <IntegrationCard name="HubSpot" category="Marketing" icon="https://www.vectorlogo.zone/logos/hubspot/hubspot-icon.svg" desc="Two-way sync with HubSpot for advanced marketing automation." />
                <IntegrationCard name="Shopify" category="E-commerce" icon="https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg" desc="See customer order history and lifetime value in the CRM." />
            </div>

            <div className="bg-primary/5 rounded-3xl p-12 text-center">
                <h3 className="text-2xl font-bold mb-4">Build your own integration</h3>
                <p className="mb-6 max-w-xl mx-auto text-gray-600 dark:text-gray-400">
                    Use our robust REST API and Webhooks to build custom integrations for your unique business needs.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="btn-primary">Read API Docs</button>
                    <button className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium whitespace-nowrap">Register App</button>
                </div>
            </div>
        </PageLayout>
    );
}

function IntegrationCard({ name, category, icon, desc }) {
    return (
        <div className="flex flex-col p-6 bg-white dark:bg-card border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary transition-colors cursor-pointer group shadow-sm hover:shadow-md h-full">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl mr-4 p-2">
                    <img src={icon} alt={name} className="w-8 h-8 object-contain" />
                </div>
                <div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">{name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{category}</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">{desc}</p>
        </div>
    );
}
