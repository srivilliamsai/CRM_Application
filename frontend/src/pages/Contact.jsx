import PageLayout from '../components/PageLayout';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function Contact() {
    return (
        <PageLayout title="Contact Us">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Have questions about UniQ CRM? We're here to help. Reach out to our team via email, phone, or the form below.
                    </p>

                    <div className="space-y-6 mb-12">
                        <ContactDetail icon={<Mail />} title="Email" content="hello@uniq-crm.com" />
                        <ContactDetail icon={<Phone />} title="Phone" content="+1 (555) 123-4567" />
                        <ContactDetail icon={<MapPin />} title="Office" content="123 Market Street, Suite 400, San Francisco, CA 94105" />
                    </div>

                    <div className="rounded-2xl overflow-hidden h-64 border border-gray-200 dark:border-gray-800">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.097746592285!2d-122.39999968468204!3d37.79155797975618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064bf26b389%3A0x6bd766bd7690180!2sSalesforce%20Tower!5e0!3m2!1sen!2sus!4v1633036481234!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-card p-8 rounded-3xl border border-gray-200 dark:border-gray-800">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-primary outline-none" placeholder="Jane" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-primary outline-none" placeholder="Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-primary outline-none" placeholder="jane@company.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-primary outline-none">
                                <option>Sales Inquiry</option>
                                <option>Support Request</option>
                                <option>Partnership Opportunity</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                            <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-primary outline-none" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                            Send Message <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </PageLayout>
    );
}

function ContactDetail({ icon, title, content }) {
    return (
        <div className="flex items-start">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-lg mb-1">{title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{content}</p>
            </div>
        </div>
    );
}
