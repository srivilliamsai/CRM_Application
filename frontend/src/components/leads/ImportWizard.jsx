import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, ArrowRight, Check, X, FileText, AlertCircle } from 'lucide-react';
import { createLead, getUser } from '../../services/api';

export default function ImportWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [mapping, setMapping] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: ''
    });
    const [importOptions, setImportOptions] = useState({
        duplicateAction: 'SKIP', // SKIP, UPDATE, ALLOW
        assignTo: 'CURRENT_USER'
    });
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState({ success: 0, failed: 0, errors: [] });

    // CRM Fields to map to
    const crmFields = [
        { key: 'firstName', label: 'First Name', required: true },
        { key: 'lastName', label: 'Last Name', required: true },
        { key: 'email', label: 'Email', required: false },
        { key: 'phone', label: 'Phone', required: false },
        { key: 'company', label: 'Company', required: false },
        { key: 'source', label: 'Source', required: false },
        { key: 'status', label: 'Status', required: false },
    ];

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            Papa.parse(uploadedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setCsvData(results.data);
                    setHeaders(results.meta.fields || []);
                    // Auto-map if headers match loosely
                    const autoMap = {};
                    results.meta.fields.forEach(header => {
                        const lowerHeader = header.toLowerCase();
                        crmFields.forEach(field => {
                            if (lowerHeader.includes(field.key) || lowerHeader === field.label.toLowerCase()) {
                                autoMap[field.key] = header;
                            }
                        });
                    });
                    setMapping(prev => ({ ...prev, ...autoMap }));
                    setStep(2);
                },
                error: (err) => {
                    console.error("CSV Parse Error", err);
                    alert("Failed to parse CSV file.");
                }
            });
        }
    };

    const handleImport = async () => {
        setStep(4);
        setImporting(true);
        let successCount = 0;
        let failCount = 0;
        const errorLog = [];

        // Get current user for assignment
        const user = getUser();

        for (const row of csvData) {
            try {
                const leadData = {
                    firstName: row[mapping.firstName],
                    lastName: row[mapping.lastName],
                    email: mapping.email ? row[mapping.email] : '',
                    phone: mapping.phone ? row[mapping.phone] : '',
                    company: mapping.company ? row[mapping.company] : '',
                    source: mapping.source ? row[mapping.source] : 'IMPORT',
                    status: mapping.status ? row[mapping.status] : 'NEW',
                    score: 0,
                    assignedTo: importOptions.assignTo === 'CURRENT_USER' ? user?.id : null
                };

                // Basic validation
                if (!leadData.firstName || !leadData.lastName) {
                    throw new Error("Missing First or Last Name");
                }

                await createLead(leadData);
                successCount++;
            } catch (err) {
                failCount++;
                errorLog.push(`Row ${csvData.indexOf(row) + 1}: ${err.message || 'Failed'}`);
            }
            // Update progress (optional visual feedback)
        }

        setResults({ success: successCount, failed: failCount, errors: errorLog });
        setImporting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Import Leads</h2>
                        <p className="text-sm text-gray-500">Step {step} of 4</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Visual Stepper */}
                <div className="px-8 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between relative">
                        {['Import CSV', 'Map Fields', 'Actions', 'Summary'].map((label, idx) => {
                            const stepNum = idx + 1;
                            const isActive = step === stepNum;
                            const isCompleted = step > stepNum;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors ${isActive ? 'bg-primary text-white' :
                                        isCompleted ? 'bg-green-500 text-white' :
                                            'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}>
                                        {isCompleted ? <Check size={16} /> : stepNum}
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
                                </div>
                            );
                        })}
                        {/* Progress Bar Background */}
                        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>
                        {/* Active Progress */}
                        <div className="absolute top-4 left-0 h-0.5 bg-primary -z-0 transition-all duration-300"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {/* Step 1: Upload */}
                    {step === 1 && (
                        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                                <Upload size={32} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Click to upload CSV</h3>
                            <p className="text-sm text-gray-500">or drag and drop file here</p>
                        </div>
                    )}

                    {/* Step 2: Mapping */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 mb-4">
                                Map the columns from your CSV file to the CRM fields.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {crmFields.map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <select
                                            value={mapping[field.key] || ''}
                                            onChange={(e) => setMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                                        >
                                            <option value="">-- Ignore --</option>
                                            {headers.map(h => (
                                                <option key={h} value={h}>{h}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                    <FileText size={16} /> Preview (First Row)
                                </h4>
                                <div className="text-xs text-gray-600 dark:text-gray-400 font-mono space-y-1">
                                    {crmFields.map(f => (
                                        <div key={f.key} className="flex justify-between">
                                            <span>{f.label}:</span>
                                            <span className="font-bold">{csvData[0][mapping[f.key]] || '(empty)'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Actions */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Duplicate Handling</h3>
                                <div className="space-y-3">
                                    {['SKIP', 'UPDATE', 'ALLOW'].map((action) => (
                                        <label key={action} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${importOptions.duplicateAction === action
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="duplicateAction"
                                                value={action}
                                                checked={importOptions.duplicateAction === action}
                                                onChange={(e) => setImportOptions(prev => ({ ...prev, duplicateAction: e.target.value }))}
                                                className="mt-1"
                                            />
                                            <div>
                                                <span className="font-semibold text-gray-900 dark:text-white block">
                                                    {action === 'SKIP' ? 'Skip duplicates' :
                                                        action === 'UPDATE' ? 'Update existing records' : 'Allow duplicates'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {action === 'SKIP' ? 'Do not import records if the email already exists.' :
                                                        action === 'UPDATE' ? 'Overwrite existing records with new data.' :
                                                            'Create new records even if they already exist.'}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Assign To
                                </label>
                                <select
                                    value={importOptions.assignTo}
                                    onChange={(e) => setImportOptions(prev => ({ ...prev, assignTo: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="CURRENT_USER">Me (Current User)</option>
                                    <option value="UNASSIGNED">Unassigned</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Importing / Results */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            {importing ? (
                                <div className="space-y-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Importing Leads...</h3>
                                    <p className="text-gray-500">Please wait while we process your file.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 w-full">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                            <Check size={32} className="text-green-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Import Complete</h3>
                                        <div className="flex justify-center gap-8 text-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl max-w-sm mx-auto">
                                            <div>
                                                <div className="text-2xl font-bold text-green-600">{results.success}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">Success</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-red-500">{results.failed}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">Failed</div>
                                            </div>
                                        </div>
                                    </div>

                                    {results.failed > 0 && (
                                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl text-left max-h-40 overflow-y-auto w-full">
                                            <h4 className="font-bold text-red-600 text-sm mb-2 flex items-center gap-2">
                                                <AlertCircle size={14} /> Errors
                                            </h4>
                                            <ul className="text-xs text-red-600/80 space-y-1 list-disc pl-4">
                                                {results.errors.map((e, i) => <li key={i}>{e}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                    {step === 1 && (
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium">
                            Cancel
                        </button>
                    )}

                    {step === 2 && (
                        <>
                            <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium">
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!mapping.firstName || !mapping.lastName}
                                className="btn-primary px-6 py-2.5 flex items-center gap-2 disabled:opacity-50"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium">
                                Back
                            </button>
                            <button
                                onClick={handleImport}
                                className="btn-primary px-6 py-2.5 flex items-center gap-2"
                            >
                                Start Import <ArrowRight size={16} />
                            </button>
                        </>
                    )}

                    {step === 4 && !importing && (
                        <button onClick={() => { onComplete(); onClose(); }} className="btn-primary px-8 py-2.5">
                            Done
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
