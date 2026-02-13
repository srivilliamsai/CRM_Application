import PageLayout from '../components/PageLayout';

export default function PrivacyPolicy() {
    return (
        <PageLayout title="Privacy Policy">
            <div className="text-sm text-gray-500 mb-8">
                Last updated: October 26, 2025
            </div>

            <p className="lead text-xl mb-8">
                Your privacy is critically important to us. At UniQ CRM, we have a few fundamental principles:
            </p>
            <ul className="list-disc pl-5 mb-8 space-y-2">
                <li>We don't ask you for personal information unless we truly need it.</li>
                <li>We don't share your personal information with anyone except to comply with the law, develop our products, or protect our rights.</li>
                <li>We don't store personal information on our servers unless required for the on-going operation of one of our services.</li>
            </ul>

            <h3>1. Information We Collect</h3>
            <p>
                UniQ CRM collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Our purpose in collecting non-personally identifying information is to better understand how UniQ CRM's visitors use its website.
            </p>
            <p>
                We also collect potentially personally-identifying information like Internet Protocol (IP) addresses for logged-in users and for users leaving comments on our blogs.
            </p>

            <h3>2. Gathering of Personally-Identifying Information</h3>
            <p>
                Certain visitors to UniQ CRM's websites choose to interact with UniQ CRM in ways that require UniQ CRM to gather personally-identifying information. The amount and type of information that UniQ CRM gathers depends on the nature of the interaction. For example, we ask visitors who sign up for a dashboard at uniq-crm.com to provide a username and email address.
            </p>

            <h3>3. Security</h3>
            <p>
                The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
            </p>

            <h3>4. Advertisements</h3>
            <p>
                Ads appearing on any of our websites may be delivered to users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This Privacy Policy covers the use of cookies by UniQ CRM and does not cover the use of cookies by any advertisers.
            </p>

            <h3>5. GDPR Compliance</h3>
            <p>
                If you are a resident of the European Economic Area (EEA), you have certain data protection rights. UniQ CRM aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
            </p>
            <p>
                If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
            </p>

            <h3>6. CCPA Compliance</h3>
            <p>
                This section provides additional details about the personal information we collect about California consumers and the rights afforded to them under the California Consumer Privacy Act or “CCPA.”
            </p>
            <p>
                Subject to certain limitations, the CCPA provides California consumers the right to request to know more details about the categories or specific pieces of personal information we collect (including how we use and disclose this information), to delete their personal information, to opt out of any “sales” that may be occurring, and to not be discriminated against for exercising these rights.
            </p>

            <h3>7. Contact Information</h3>
            <p>
                If you have any questions about this Privacy Policy, please contact us via <a href="mailto:privacy@uniq-crm.com" className="text-primary hover:underline">privacy@uniq-crm.com</a> or phone at +1 (555) 123-4567.
            </p>
        </PageLayout>
    );
}
