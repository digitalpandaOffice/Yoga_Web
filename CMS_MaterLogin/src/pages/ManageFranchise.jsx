import React, { useState, useEffect } from 'react';
import {
    Table, Eye, CheckCircle, XCircle, Search, Filter,
    MoreHorizontal, FileText, Download, Loader2,
    LayoutDashboard, Users, CreditCard, Settings, Archive,
    Bell, Mail
} from 'lucide-react';
import { endpoints } from '../config';
import './ManageFranchise.css';

const ManageFranchise = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch(endpoints.franchiseGetAll);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    setApplications(data.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch franchise applications", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setIsUpdating(true);
        try {
            const res = await fetch(endpoints.franchiseUpdateStatus, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setApplications(prev => prev.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                ));
                if (selectedApp) setSelectedApp(null);
            }
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    // Calculate Stats
    const stats = {
        total: applications.length,
        active: applications.filter(a => a.status === 'Approved').length,
        pending: applications.filter(a => !a.status || a.status === 'Pending').length,
        revenue: '₹12,50,000' // Mock data
    };

    // --- Sub-Components for Tabs ---

    const DashboardTab = () => (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-header">
                    <div className="stat-icon-wrapper bg-blue-50 text-blue-600">
                        <Users size={24} />
                    </div>
                </div>
                <div className="stat-label">Total Applications</div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-trend trend-up">All Time</div>
            </div>
            <div className="stat-card">
                <div className="stat-header">
                    <div className="stat-icon-wrapper bg-yellow-50 text-yellow-600">
                        <FileText size={24} />
                    </div>
                </div>
                <div className="stat-label">Pending Review</div>
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-trend text-yellow-600">Needs Action</div>
            </div>
            <div className="stat-card">
                <div className="stat-header">
                    <div className="stat-icon-wrapper bg-green-50 text-green-600">
                        <CheckCircle size={24} />
                    </div>
                </div>
                <div className="stat-label">Active Franchises</div>
                <div className="stat-value">{stats.active}</div>
                <div className="stat-trend trend-up">Approved Partners</div>
            </div>
            <div className="stat-card">
                <div className="stat-header">
                    <div className="stat-icon-wrapper bg-indigo-50 text-indigo-600">
                        <CreditCard size={24} />
                    </div>
                </div>
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">{stats.revenue}</div>
                <div className="stat-trend text-gray-400">Estimated (Mock)</div>
            </div>
        </div>
    );

    const [activeFranchises, setActiveFranchises] = useState([]);
    const [loadingActive, setLoadingActive] = useState(false);

    useEffect(() => {
        if (activeTab === 'active') {
            fetchActiveFranchises();
        }
    }, [activeTab]);

    const fetchActiveFranchises = async () => {
        setLoadingActive(true);
        try {
            const res = await fetch(endpoints.franchiseGetActive);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    setActiveFranchises(data.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch active franchises", error);
        } finally {
            setLoadingActive(false);
        }
    }

    const ActiveFranchiseTable = () => {
        const filteredActive = activeFranchises.filter(app => {
            const matchesSearch =
                (app.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (app.franchise_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (app.city || '').toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });

        return (
            <div className="table-container">
                <table className="franchise-table">
                    <thead>
                        <tr>
                            <th>Franchise ID</th>
                            <th>Owner Name</th>
                            <th>City / Location</th>
                            <th>Contact Details</th>
                            <th>Joined Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingActive ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="animate-spin" size={20} /> Loading active franchises...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredActive.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-400">
                                    No active franchises found. Approve an application to see it here.
                                </td>
                            </tr>
                        ) : filteredActive.map((app) => (
                            <tr key={app.id}>
                                <td>
                                    <span className="ref-badge text-blue-700 bg-blue-50 border-blue-100">
                                        {app.franchise_code}
                                    </span>
                                </td>
                                <td className="applicant-name">{app.owner_name}</td>
                                <td>{app.city}</td>
                                <td className="contact-info">
                                    <div className="phone">{app.phone}</div>
                                    <div className="email">{app.email}</div>
                                </td>
                                <td>{new Date(app.joined_at).toLocaleDateString()}</td>
                                <td className="text-right">
                                    <button
                                        className="action-btn text-blue-600 hover:bg-blue-50"
                                        title="View Franchise Details"
                                        onClick={() => {
                                            // For now, allow viewing details if we can map back to application or show minimal info
                                            // The simplest way is to fetch the original app or just show what we have.
                                            // Since we don't have the full 'app' object here like in applications list,
                                            // we might need to adjust the modal or fetch details.
                                            // For this MVP step, we'll disabling the view or showing alerts.
                                            alert("Full details view for Active Franchises is coming soon!");
                                        }}
                                    >
                                        <LayoutDashboard size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const ApplicationTable = ({ filterOverride = null }) => {
        const filteredApps = applications.filter(app => {
            const matchesSearch =
                (app.applicant_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (app.reference_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (app.city || '').toLowerCase().includes(searchTerm.toLowerCase());

            // If filterOverride is set (e.g. 'Approved' for Active tab), use it. 
            // Otherwise use selected dropdown filter.
            const statusToCheck = filterOverride || filterStatus;
            const matchesStatus = statusToCheck === 'All' || app.status === statusToCheck;

            return matchesSearch && matchesStatus;
        });

        return (
            <>
                {/* Show filters only if NOT in "Active" tab (which implies Fixed Approved filter) */}
                {!filterOverride && (
                    <div className="filter-section">
                        <div className="search-wrapper">
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, ref no, or city..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="status-select-wrapper">
                            <Filter size={18} className="text-gray-400" />
                            <select
                                className="status-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="table-container">
                    <table className="franchise-table">
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Applicant</th>
                                <th>Location</th>
                                <th>Contact Info</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin" size={20} /> Loading records...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-400">
                                        No records found.
                                    </td>
                                </tr>
                            ) : filteredApps.map((app) => (
                                <tr key={app.id}>
                                    <td><span className="ref-badge">{app.reference_no}</span></td>
                                    <td className="applicant-name">{app.applicant_name}</td>
                                    <td>{app.city}</td>
                                    <td className="contact-info">
                                        <div className="phone">{app.phone}</div>
                                        <div className="email">{app.email}</div>
                                    </td>
                                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${(app.status || 'pending').toLowerCase()}`}>
                                            {app.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button onClick={() => setSelectedApp(app)} className="action-btn">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    const FinancialsTab = () => {
        const [payments, setPayments] = useState([]);
        const [loading, setLoading] = useState(true);
        const [showAdd, setShowAdd] = useState(false);
        const [newPayment, setNewPayment] = useState({
            franchise_id: '', transaction_id: '', description: '', amount: '', payment_date: '', status: 'Paid'
        });

        useEffect(() => {
            fetchPayments();
        }, []);

        const fetchPayments = async () => {
            try {
                const res = await fetch(endpoints.franchiseGetPayments);
                const data = await res.json();
                if (data.status === 'success') setPayments(data.data);
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };

        const handleAddPayment = async (e) => {
            e.preventDefault();
            try {
                const res = await fetch(endpoints.franchiseAddPayment, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPayment)
                });
                const data = await res.json();
                if (data.status === 'success') {
                    fetchPayments();
                    setShowAdd(false);
                    setNewPayment({ franchise_id: '', transaction_id: '', description: '', amount: '', payment_date: '', status: 'Paid' });
                }
            } catch (error) {
                console.error("Failed to add payment", error);
            }
        };

        return (
            <div className="space-y-4">
                <div className="action-header">
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className={showAdd ? "cancel-toggle-btn" : "add-payment-btn"}
                    >
                        {showAdd ? <XCircle size={18} /> : <CreditCard size={18} />}
                        {showAdd ? 'Cancel' : 'Record Payment'}
                    </button>
                </div>

                {showAdd && (
                    <div className="payment-form-card">
                        <h3 className="payment-form-header">Record New Transaction</h3>
                        <form onSubmit={handleAddPayment}>
                            <div className="payment-form-grid">
                                <div className="payment-form-group">
                                    <label className="payment-form-label">Franchise (ID)</label>
                                    <select
                                        className="payment-form-select"
                                        value={newPayment.franchise_id}
                                        onChange={e => setNewPayment({ ...newPayment, franchise_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Franchise...</option>
                                        {activeFranchises.map(f => (
                                            <option key={f.id} value={f.id}>{f.owner_name} ({f.franchise_code})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="payment-form-group">
                                    <label className="payment-form-label">Transaction ID</label>
                                    <input
                                        type="text"
                                        className="payment-form-input"
                                        value={newPayment.transaction_id}
                                        onChange={e => setNewPayment({ ...newPayment, transaction_id: e.target.value })}
                                        placeholder="e.g. TXN-123456"
                                        required
                                    />
                                </div>
                                <div className="payment-form-group full-width">
                                    <label className="payment-form-label">Description</label>
                                    <input
                                        type="text"
                                        className="payment-form-input"
                                        value={newPayment.description}
                                        onChange={e => setNewPayment({ ...newPayment, description: e.target.value })}
                                        placeholder="Brief description of the payment"
                                        required
                                    />
                                </div>
                                <div className="payment-form-group">
                                    <label className="payment-form-label">Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="payment-form-input"
                                        value={newPayment.amount}
                                        onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="payment-form-group">
                                    <label className="payment-form-label">Payment Date</label>
                                    <input
                                        type="date"
                                        className="payment-form-input"
                                        value={newPayment.payment_date}
                                        onChange={e => setNewPayment({ ...newPayment, payment_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="payment-form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowAdd(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="table-container">
                    <table className="franchise-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Franchise (Owner)</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Loading financials...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-400">No financial records found.</td></tr>
                            ) : payments.map(p => (
                                <tr key={p.id}>
                                    <td className="font-mono text-sm">{p.transaction_id}</td>
                                    <td>
                                        <div className="font-medium text-gray-900">{p.owner_name}</div>
                                        <div className="text-xs text-gray-500">{p.franchise_code}</div>
                                    </td>
                                    <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                                    <td>{p.description}</td>
                                    <td className="amount-positive font-bold">+ ₹{Number(p.amount).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${p.status === 'Paid' ? 'status-approved' : 'status-pending'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const ResourcesTab = () => {
        const [resources, setResources] = useState([]);
        const [loading, setLoading] = useState(true);
        const [uploading, setUploading] = useState(false);
        const [title, setTitle] = useState('');
        const [file, setFile] = useState(null);

        useEffect(() => {
            fetchResources();
        }, []);

        const fetchResources = async () => {
            try {
                const res = await fetch(endpoints.franchiseGetResources);
                const data = await res.json();
                if (data.status === 'success') setResources(data.data);
            } catch (error) {
                console.error("Failed to fetch resources", error);
            } finally {
                setLoading(false);
            }
        };

        const handleUpload = async (e) => {
            e.preventDefault();
            if (!file || !title) return;

            setUploading(true);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('file', file);

            try {
                const res = await fetch(endpoints.franchiseAddResource, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.status === 'success') {
                    fetchResources();
                    setTitle('');
                    setFile(null);
                    document.getElementById('file-upload').value = '';
                }
            } catch (error) {
                console.error("Upload failed", error);
            } finally {
                setUploading(false);
            }
        };

        return (
            <div className="max-w-5xl mx-auto">
                <div className="resource-upload-card">
                    <h3 className="resource-upload-header">
                        <Download size={22} className="text-teal-700" />
                        Upload New Resource
                    </h3>
                    <form onSubmit={handleUpload} className="upload-form-grid">
                        <div className="upload-input-group">
                            <label className="upload-label">Document Title</label>
                            <input
                                type="text"
                                className="upload-input"
                                placeholder="e.g. Franchise Agreement 2024"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="upload-input-group">
                            <label className="upload-label">File Attachment</label>
                            <div className="file-input-wrapper">
                                <input
                                    id="file-upload"
                                    type="file"
                                    onChange={e => setFile(e.target.files[0])}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="btn-upload"
                        >
                            {uploading ? <Loader2 size={18} className="animate-spin" /> : <MoreHorizontal size={18} />}
                            {uploading ? 'Uploading...' : 'Upload Resource'}
                        </button>
                    </form>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Loading resources...</p>
                    ) : resources.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No resources uploaded yet.</p>
                    ) : resources.map(res => (
                        <div key={res.id} className="resource-item group">
                            <div className="resource-icon bg-teal-50 text-teal-700 group-hover:bg-teal-100 transition-colors">
                                <FileText size={20} />
                            </div>
                            <div className="resource-info">
                                <div className="resource-name text-gray-800 group-hover:text-teal-800 transition-colors">
                                    {res.title}
                                </div>
                                <div className="resource-meta">
                                    Uploaded {new Date(res.uploaded_at).toLocaleDateString()} • {res.file_size || 'N/A'}
                                </div>
                            </div>
                            <a
                                href={`${endpoints.base}/${res.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn hover:bg-gray-100 p-2 rounded-full"
                                title="Download / View"
                            >
                                <Download size={20} className="text-gray-500 hover:text-teal-700" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const SettingsTab = () => {
        const [settings, setSettings] = useState({
            maintenance_mode: '0',
            notify_admin_new: '1',
            notify_applicant_received: '1',
            notify_applicant_approved: '1',
            admin_email: 'admin@edvayu.com',
            email_received_subject: 'Edvayu Franchise Application Received',
            email_received_body: 'Dear Applicant,\n\nThank you for applying for an Edvayu Franchise. We have received your application (Ref: {REF}) and our team will review it shortly.\n\nBest Regards,\nEdvayu Franchise Team',
            email_approved_subject: 'Congratulations! Your Edvayu Franchise is Approved',
            email_approved_body: 'Dear {NAME},\n\nWe are pleased to inform you that your franchise application has been approved. Your Franchise ID is {CODE}.\n\nPlease login to the partner portal to complete the onboarding.\n\nBest Regards,\nEdvayu Management'
        });
        const [saving, setSaving] = useState(false);
        const [msg, setMsg] = useState({ text: '', type: '' });

        useEffect(() => {
            fetchSettings();
        }, []);

        const fetchSettings = async () => {
            try {
                const res = await fetch(endpoints.franchiseGetSettings);
                const data = await res.json();
                if (data.status === 'success' && Object.keys(data.data).length > 0) {
                    setSettings(prev => ({ ...prev, ...data.data }));
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };

        const handleToggle = (key) => {
            setSettings(prev => ({
                ...prev,
                [key]: prev[key] === '1' ? '0' : '1'
            }));
        };

        const handleSave = async () => {
            setSaving(true);
            try {
                const res = await fetch(endpoints.franchiseSaveSettings, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings)
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setMsg({ text: 'Settings updated successfully!', type: 'success' });
                    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
                }
            } catch (error) {
                setMsg({ text: 'Failed to save settings.', type: 'error' });
            } finally {
                setSaving(false);
            }
        };

        return (
            <div className="max-w-4xl mx-auto settings-container">
                {/* General Configuration */}
                <div className="settings-card">
                    <h3 className="settings-section-title">
                        <Settings className="text-gray-500" size={20} /> General Configuration
                    </h3>
                    <div className="settings-row">
                        <div className="settings-info">
                            <span className="settings-label">Maintenance Mode</span>
                            <span className="settings-desc">Temporarily disable new franchise applications</span>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.maintenance_mode === '1'}
                                onChange={() => handleToggle('maintenance_mode')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settings-input-group">
                        <label className="settings-field-label">Admin Notification Email</label>
                        <input
                            type="email"
                            className="upload-input"
                            value={settings.admin_email}
                            onChange={e => setSettings({ ...settings, admin_email: e.target.value })}
                            placeholder="email@example.com"
                        />
                    </div>
                </div>

                {/* Automation & Notifications */}
                <div className="settings-card">
                    <h3 className="settings-section-title">
                        <Bell className="text-gray-500" size={20} /> Notifications & Automation
                    </h3>
                    <div className="settings-row">
                        <div className="settings-info">
                            <span className="settings-label">Admin Alerts</span>
                            <span className="settings-desc">Notify admin when a new application is submitted</span>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.notify_admin_new === '1'}
                                onChange={() => handleToggle('notify_admin_new')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settings-row">
                        <div className="settings-info">
                            <span className="settings-label">Auto-Reply (Submission)</span>
                            <span className="settings-desc">Send confirmation email to the applicant immediately</span>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.notify_applicant_received === '1'}
                                onChange={() => handleToggle('notify_applicant_received')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settings-row">
                        <div className="settings-info">
                            <span className="settings-label">Approval Notification</span>
                            <span className="settings-desc">Automatically email credentials when approved</span>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.notify_applicant_approved === '1'}
                                onChange={() => handleToggle('notify_applicant_approved')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                {/* Email Templates */}
                <div className="settings-card">
                    <h3 className="settings-section-title">
                        <Mail className="text-gray-500" size={20} /> Email Templates
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-teal-700 mb-3 border-b border-teal-50 pb-1">Application Received Template</h4>
                            <div className="space-y-3">
                                <div className="settings-input-group mt-0">
                                    <label className="settings-field-label">Subject Line</label>
                                    <input
                                        type="text"
                                        className="upload-input"
                                        value={settings.email_received_subject}
                                        onChange={e => setSettings({ ...settings, email_received_subject: e.target.value })}
                                    />
                                </div>
                                <div className="settings-input-group">
                                    <label className="settings-field-label">Email Body</label>
                                    <textarea
                                        className="settings-textarea"
                                        value={settings.email_received_body}
                                        onChange={e => setSettings({ ...settings, email_received_body: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Available tags: {'{REF}'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-teal-700 mb-3 border-b border-teal-50 pb-1">Approval Confirmation Template</h4>
                            <div className="space-y-3">
                                <div className="settings-input-group mt-0">
                                    <label className="settings-field-label">Subject Line</label>
                                    <input
                                        type="text"
                                        className="upload-input"
                                        value={settings.email_approved_subject}
                                        onChange={e => setSettings({ ...settings, email_approved_subject: e.target.value })}
                                    />
                                </div>
                                <div className="settings-input-group">
                                    <label className="settings-field-label">Email Body</label>
                                    <textarea
                                        className="settings-textarea"
                                        value={settings.email_approved_body}
                                        onChange={e => setSettings({ ...settings, email_approved_body: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Available tags: {'{NAME}, {CODE}'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Bar */}
                <div className="save-settings-bar">
                    <div className={`save-msg ${msg.type}`}>
                        {msg.text}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-upload"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="franchise-container">
            <div className="franchise-header">
                <div className="franchise-title">
                    <h1>Franchise Management</h1>
                    <p>Overview and management of franchise operations</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchApplications} className="refresh-btn" title="Refresh Data">
                        <Loader2 size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-nav">
                <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                    Dashboard
                </button>
                <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
                    Applications
                </button>
                <button className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                    Active Franchises
                </button>
                <button className={`tab-btn ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>
                    Financials
                </button>
                <button className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
                    Resources
                </button>
                <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                    Settings
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'applications' && <ApplicationTable />}
                {activeTab === 'active' && <ActiveFranchiseTable />}
                {activeTab === 'financials' && <FinancialsTab />}
                {activeTab === 'resources' && <ResourcesTab />}
                {activeTab === 'settings' && <SettingsTab />}
            </div>

            {/* Detail Modal (Shared) */}
            {selectedApp && (
                <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>Application Details</h2>
                                <p>Reference: {selectedApp.reference_no}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="close-modal-btn">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="details-grid">
                                <div className="detail-item">
                                    <label>Applicant Name</label>
                                    <p>{selectedApp.applicant_name}</p>
                                </div>
                                <div className="detail-item">
                                    <label>City / Location</label>
                                    <p>{selectedApp.city}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Email Address</label>
                                    <p>{selectedApp.email}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Phone Number</label>
                                    <p>{selectedApp.phone}</p>
                                </div>
                            </div>

                            <div className="form-data-section">
                                <div className="form-data-header">Full Application Data</div>
                                <div className="form-data-grid">
                                    {(() => {
                                        try {
                                            const formData = JSON.parse(selectedApp.form_data || '{}');
                                            return Object.entries(formData).map(([key, value]) => {
                                                const formattedLabel = key
                                                    .replace(/([A-Z])/g, ' $1')
                                                    .replace(/^./, str => str.toUpperCase())
                                                    .replace(/_/g, ' ');
                                                const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                                                return (
                                                    <div key={key} className="form-data-item">
                                                        <span className="form-data-label">{formattedLabel}</span>
                                                        <span className="form-data-value">{displayValue || '-'}</span>
                                                    </div>
                                                );
                                            });
                                        } catch (e) {
                                            return <p className="text-red-500 p-4">Error parsing form data</p>;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                                disabled={isUpdating}
                                className="btn-reject"
                            >
                                <XCircle size={18} /> Reject
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(selectedApp.id, 'Approved')}
                                disabled={isUpdating}
                                className="btn-approve"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                Approve Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFranchise;
