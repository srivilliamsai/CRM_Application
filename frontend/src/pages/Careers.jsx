import PageLayout from '../components/PageLayout';
import { ArrowRight } from 'lucide-react';

export default function Careers() {
    return (
        <PageLayout title="Join our team">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    We're on a mission to redefine how businesses interact with their customers. We're looking for passionate problem solvers to join us.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="btn-primary">View Open Roles</button>
                    <button className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Read our Culture Code</button>
                </div>
            </div>

            <div className="mb-20">
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80"
                    alt="Team working together"
                    className="w-full h-[400px] object-cover rounded-3xl shadow-2xl mb-12"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
                    <h3 className="text-xl font-bold mb-3">Impact First</h3>
                    <p className="text-gray-600 dark:text-gray-400">We prioritize work that moves the needle. No busy work, just meaningful impact on our customers.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
                    <h3 className="text-xl font-bold mb-3">Remote Native</h3>
                    <p className="text-gray-600 dark:text-gray-400">Work from anywhere. We trust you to do your best work, whether that's in a cafe in Paris or your home office.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
                    <h3 className="text-xl font-bold mb-3">Continuous Growth</h3>
                    <p className="text-gray-600 dark:text-gray-400">We invest in your learning. Annual stipends for courses, books, and conferences.</p>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-card rounded-3xl p-10 md:p-16 mb-20">
                <h2 className="text-3xl font-bold mb-10 text-center">Benefits & Perks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Benefit icon="💰" title="Competitive Pay" />
                    <Benefit icon="⚕️" title="Full Health Coverage" />
                    <Benefit icon="🏝️" title="Unlimited PTO" />
                    <Benefit icon="🖥️" title="Home Office Setup" />
                    <Benefit icon="📚" title="Learning Stipend" />
                    <Benefit icon="🧘" title="Wellness Budget" />
                    <Benefit icon="🍼" title="Parental Leave" />
                    <Benefit icon="🎉" title="Company Retreats" />
                </div>
            </div>

            <div id="roles" className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
                <div className="space-y-4">
                    <JobCard
                        title="Senior Frontend Engineer"
                        department="Engineering"
                        location="Remote / San Francisco"
                        type="Full-time"
                    />
                    <JobCard
                        title="Backend Developer (Java/Spring)"
                        department="Engineering"
                        location="Remote"
                        type="Full-time"
                    />
                    <JobCard
                        title="Product Designer"
                        department="Design"
                        location="New York"
                        type="Full-time"
                    />
                    <JobCard
                        title="Growth Marketing Manager"
                        department="Marketing"
                        location="London"
                        type="Full-time"
                    />
                </div>
            </div>

            <div className="mt-20 bg-primary/5 rounded-3xl p-12 text-center">
                <h3 className="text-2xl font-bold mb-4">Don't see the right role?</h3>
                <p className="mb-6 max-w-xl mx-auto text-gray-600 dark:text-gray-400">We're always looking for talented individuals. If you share our values and want to make an impact, we want to hear from you.</p>
                <button className="btn-primary">Email us your resume</button>
            </div>
        </PageLayout>
    );
}

function Benefit({ icon, title }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-4">{icon}</div>
            <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
        </div>
    );
}

function JobCard({ title, department, location, type }) {
    return (
        <div className="group flex items-center justify-between p-6 bg-white dark:bg-card border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary transition-colors cursor-pointer">
            <div>
                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{title}</h4>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span>{department}</span>
                    <span>•</span>
                    <span>{location}</span>
                    <span>•</span>
                    <span>{type}</span>
                </div>
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-primary transition-colors" />
        </div>
    );
}
