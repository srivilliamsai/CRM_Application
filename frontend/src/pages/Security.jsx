import PageLayout from '../components/PageLayout';
import { Shield, Lock, Server, Key, AlertTriangle, Eye, RefreshCw, FileCheck } from 'lucide-react';

export default function Security() {
    return (
        <PageLayout title="Security">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="lead text-xl text-gray-600 dark:text-gray-300">
                    Security is foundational to everything we build at UniQ CRM. We treat your data with the same level of care and vigilance as we treat our own.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <button className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium flex items-center gap-2">
                        <FileCheck size={18} /> Download Security Whitepaper
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-8">Compliance & Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div className="p-8 rounded-2xl bg-gray-50 dark:bg-card border border-gray-200 dark:border-gray-800 flex items-start">
                    <Shield className="text-primary mt-1 mr-6 flex-shrink-0" size={32} />
                    <div>
                        <h3 className="text-xl font-bold mb-2">SOC 2 Type II Compliant</h3>
                        <p className="text-gray-600 dark:text-gray-400">We are audited annually by independent third-party firms to ensure our security controls meet the highest industry standards for Security, Availability, and Confidentiality.</p>
                    </div>
                </div>
                <div className="p-8 rounded-2xl bg-gray-50 dark:bg-card border border-gray-200 dark:border-gray-800 flex items-start">
                    <Lock className="text-primary mt-1 mr-6 flex-shrink-0" size={32} />
                    <div>
                        <h3 className="text-xl font-bold mb-2">GDPR & CCPA Ready</h3>
                        <p className="text-gray-600 dark:text-gray-400">Our platform is designed to be fully compliant with GDPR and CCPA regulations, providing you with tools to manage data subject requests and privacy.</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-8 mt-16">Infrastructure & Network</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <SecurityFeature
                    icon={<Server size={24} />}
                    title="Cloud Infrastructure"
                    desc="Hosted on AWS with multi-zone redundancy, automated failover, and physical security controls."
                />
                <SecurityFeature
                    icon={<RefreshCw size={24} />}
                    title="Data Backup"
                    desc="Automated hourly backups with point-in-time recovery testing to ensure data integrity."
                />
                <SecurityFeature
                    icon={<Eye size={24} />}
                    title="24/7 Monitoring"
                    desc="Continuous monitoring of all systems with automated alerts for any suspicious activity."
                />
            </div>

            <h2 className="text-2xl font-bold mb-8">Application Security</h2>
            <div className="space-y-6">
                <AppSecRow title="Data Encryption" desc="All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption keys managed by AWS KMS." />
                <AppSecRow title="Authentication" desc="Support for SSO (SAML 2.0/OIDC), MFA enforcement, and strong password policies." />
                <AppSecRow title="Vulnerability Scanning" desc="Automated static and dynamic code analysis in CI/CD pipelines, plus regular penetration testing." />
                <AppSecRow title="Bug Bounty Program" desc="We maintain a private bug bounty program to incentivize security researchers to find and report vulnerabilities." />
            </div>

            <div className="mt-16 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                    <AlertTriangle className="text-red-500" size={24} />
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Reporting Vulnerabilities</h3>
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    We value the contributions of the security research community. If you believe you have found a security vulnerability in UniQ CRM, please let us know right away. We will investigate all reports and do our best to quickly fix valid issues.
                </p>
                <a href="mailto:security@uniq-crm.com" className="font-bold text-red-600 dark:text-red-400 hover:underline">
                    Report a vulnerability →
                </a>
            </div>
        </PageLayout>
    );
}

function SecurityFeature({ icon, title, desc }) {
    return (
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-card">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
        </div>
    );
}

function AppSecRow({ title, desc }) {
    return (
        <div className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{desc}</p>
        </div>
    );
}
