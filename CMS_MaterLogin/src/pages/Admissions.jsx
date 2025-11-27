import React, { useState } from 'react';
import { Search, Filter, Check, X, Eye, UserPlus, Download, ChevronDown } from 'lucide-react';

const Admissions = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filters for student list
    const [courseFilter, setCourseFilter] = useState('all');
    const [classFilter, setClassFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data - Pending Applications
    const [applications, setApplications] = useState([
        { id: 101, name: 'Riya Sharma', email: 'riya.s@example.com', phone: '+91 98765 43210', course: 'Fine Arts Diploma', date: '2025-11-20', status: 'pending', details: 'Interested in painting and sketching. Has basic prior experience.' },
        { id: 102, name: 'Arjun Das', email: 'arjun.d@example.com', phone: '+91 98765 12345', course: 'Classical Dance', date: '2025-11-21', status: 'pending', details: 'Wants to learn Kathak. No prior formal training.' },
        { id: 103, name: 'Meera Patel', email: 'meera.p@example.com', phone: '+91 98765 67890', course: 'Indian Classical Music', date: '2025-11-22', status: 'pending', details: 'Vocal training requested. Has 2 years of experience.' },
    ]);

    // Mock Data - Enrolled Students
    const [students, setStudents] = useState([
        { id: 'ST-2025-001', name: 'Ananya Gupta', course: 'Fine Arts Diploma', class: 'Batch A', joinDate: '2025-01-15', status: 'active' },
        { id: 'ST-2025-002', name: 'Rahul Verma', course: 'Classical Dance', class: 'Batch B', joinDate: '2025-02-10', status: 'active' },
        { id: 'ST-2025-003', name: 'Sita Devi', course: 'Indian Classical Music', class: 'Batch A', joinDate: '2025-03-05', status: 'active' },
        { id: 'ST-2025-004', name: 'Vikram Singh', course: 'Theatre & Performance', class: 'Batch C', joinDate: '2025-04-20', status: 'active' },
        { id: 'ST-2025-005', name: 'Priya Nair', course: 'Fine Arts Diploma', class: 'Batch B', joinDate: '2025-05-12', status: 'active' },
    ]);

    const handleViewApplication = (app) => {
        setSelectedApplication(app);
        setShowModal(true);
    };

    const handleApprove = (app) => {
        // Move from applications to students
        const newStudent = {
            id: `ST-2025-${students.length + 100}`, // Generate mock ID
            name: app.name,
            course: app.course,
            class: 'Batch A', // Default assignment
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active'
        };

        setStudents([...students, newStudent]);
        setApplications(applications.filter(a => a.id !== app.id));
        setShowModal(false);
        setSelectedApplication(null);
        alert(`Application for ${app.name} approved! Student enrolled.`);
    };

    const handleReject = (appId) => {
        if (window.confirm('Are you sure you want to reject this application?')) {
            setApplications(applications.filter(a => a.id !== appId));
            setShowModal(false);
        }
    };

    // Filter logic
    const filteredStudents = students.filter(student => {
        const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
        const matchesClass = classFilter === 'all' || student.class === classFilter;
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCourse && matchesClass && matchesSearch;
    });

    const uniqueCourses = ['all', ...new Set(students.map(s => s.course))];
    const uniqueClasses = ['all', ...new Set(students.map(s => s.class))];

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Admission Management</h1>
                    <p>Manage applications, approve admissions, and view student lists.</p>
                </div>
                <div className="header-actions">
                    <button className="secondary-btn">
                        <Download size={18} /> Export List
                    </button>
                    <button className="save-btn">
                        <UserPlus size={18} /> Add Student
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-header">
                <button
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Applications
                    <span className="badge">{applications.length}</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enrolled')}
                >
                    Enrolled Students
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'pending' && (
                    <div className="applications-list">
                        {applications.length === 0 ? (
                            <div className="empty-state">No pending applications.</div>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Applicant Name</th>
                                            <th>Course Applied</th>
                                            <th>Date</th>
                                            <th>Contact</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <tr key={app.id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="avatar-sm">{app.name.charAt(0)}</div>
                                                        <div>
                                                            <div className="font-medium">{app.name}</div>
                                                            <div className="text-sm text-muted">{app.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{app.course}</td>
                                                <td>{app.date}</td>
                                                <td>{app.phone}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="icon-btn view"
                                                            title="View Details"
                                                            onClick={() => handleViewApplication(app)}
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            className="icon-btn approve"
                                                            title="Approve"
                                                            onClick={() => handleApprove(app)}
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            className="icon-btn reject"
                                                            title="Reject"
                                                            onClick={() => handleReject(app.id)}
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'enrolled' && (
                    <div className="students-list">
                        <div className="filters-bar">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="filter-group">
                                <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
                                    {uniqueCourses.map(c => (
                                        <option key={c} value={c}>{c === 'all' ? 'All Courses' : c}</option>
                                    ))}
                                </select>
                                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                                    {uniqueClasses.map(c => (
                                        <option key={c} value={c}>{c === 'all' ? 'All Classes' : c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Course</th>
                                        <th>Class/Batch</th>
                                        <th>Join Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map(student => (
                                        <tr key={student.id}>
                                            <td><span className="id-badge">{student.id}</span></td>
                                            <td>{student.name}</td>
                                            <td>{student.course}</td>
                                            <td>{student.class}</td>
                                            <td>{student.joinDate}</td>
                                            <td><span className="status-badge active">Active</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Application Details Modal */}
            {showModal && selectedApplication && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Application Details</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <label>Applicant Name:</label>
                                <span>{selectedApplication.name}</span>
                            </div>
                            <div className="detail-row">
                                <label>Email:</label>
                                <span>{selectedApplication.email}</span>
                            </div>
                            <div className="detail-row">
                                <label>Phone:</label>
                                <span>{selectedApplication.phone}</span>
                            </div>
                            <div className="detail-row">
                                <label>Course Applied:</label>
                                <span>{selectedApplication.course}</span>
                            </div>
                            <div className="detail-row">
                                <label>Application Date:</label>
                                <span>{selectedApplication.date}</span>
                            </div>
                            <div className="detail-row">
                                <label>Additional Details:</label>
                                <p>{selectedApplication.details}</p>
                            </div>

                            <div className="allotment-section">
                                <h4>Admission Action</h4>
                                <div className="form-group">
                                    <label>Allot Class/Batch</label>
                                    <select className="form-select">
                                        <option>Batch A (Morning)</option>
                                        <option>Batch B (Evening)</option>
                                        <option>Batch C (Weekend)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-outline" onClick={() => handleReject(selectedApplication.id)}>Reject</button>
                            <button className="btn-primary" onClick={() => handleApprove(selectedApplication)}>Approve & Admit</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .header-actions {
                    display: flex;
                    gap: 10px;
                }

                .secondary-btn {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background: #fff;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    color: var(--text-dark);
                }

                .tabs-header {
                    display: flex;
                    gap: 20px;
                    border-bottom: 1px solid #eee;
                    margin-bottom: 20px;
                }

                .tab-btn {
                    padding: 12px 20px;
                    background: none;
                    border: none;
                    border-bottom: 2px solid transparent;
                    cursor: pointer;
                    font-size: 1rem;
                    color: #666;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .tab-btn.active {
                    color: var(--deep-blue);
                    border-bottom-color: var(--deep-blue);
                    font-weight: 600;
                }

                .badge {
                    background: var(--terracotta);
                    color: #fff;
                    font-size: 0.75rem;
                    padding: 2px 8px;
                    border-radius: 10px;
                }

                .table-container {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    overflow: hidden;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    padding: 15px 20px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }

                th {
                    background: #f9fafb;
                    font-weight: 600;
                    color: #4b5563;
                    font-size: 0.9rem;
                }

                .user-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .avatar-sm {
                    width: 32px;
                    height: 32px;
                    background: var(--deep-blue);
                    color: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                }

                .text-muted { color: #6b7280; }
                .text-sm { font-size: 0.85rem; }
                .font-medium { font-weight: 500; }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .icon-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .icon-btn:hover { background: #f3f4f6; }
                .icon-btn.view { color: var(--deep-blue); }
                .icon-btn.approve { color: #10b981; border-color: #10b981; background: #ecfdf5; }
                .icon-btn.reject { color: #ef4444; border-color: #ef4444; background: #fef2f2; }

                .filters-bar {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .search-box {
                    position: relative;
                    width: 300px;
                }

                .search-box svg {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                }

                .search-box input {
                    width: 100%;
                    padding: 10px 10px 10px 36px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                }

                .filter-group {
                    display: flex;
                    gap: 10px;
                }

                .filter-group select {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: #fff;
                }

                .id-badge {
                    font-family: monospace;
                    background: #f3f4f6;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }

                .status-badge {
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }
                .status-badge.active { background: #d1fae5; color: #065f46; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: #fff;
                    border-radius: 12px;
                    width: 500px;
                    max-width: 90%;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                }

                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-header h3 { margin: 0; color: var(--deep-blue); }

                .close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6b7280;
                }

                .modal-body { padding: 20px; }

                .detail-row {
                    display: flex;
                    margin-bottom: 12px;
                }

                .detail-row label {
                    width: 140px;
                    font-weight: 600;
                    color: #4b5563;
                }

                .allotment-section {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                }

                .allotment-section h4 { margin: 0 0 15px; color: var(--deep-blue); }

                .form-group { margin-bottom: 15px; }
                .form-group label { display: block; margin-bottom: 6px; font-weight: 500; }
                .form-select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                }

                .modal-footer {
                    padding: 20px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .btn-outline {
                    padding: 8px 16px;
                    border: 1px solid #d1d5db;
                    background: #fff;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .btn-primary {
                    padding: 8px 16px;
                    background: var(--deep-blue);
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default Admissions;
