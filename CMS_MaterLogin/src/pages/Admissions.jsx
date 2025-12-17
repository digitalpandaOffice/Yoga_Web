import React, { useState } from 'react';
import { Search, Filter, Check, X, Eye, UserPlus, Download, ChevronDown } from 'lucide-react';
import { endpoints } from '../config';

const Admissions = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filters for student list
    const [courseFilter, setCourseFilter] = useState('all');
    const [classFilter, setClassFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Data State
    const [applications, setApplications] = useState([]);
    const [students, setStudents] = useState([]); // Still mock for now or empty? default manual entry

    // Fetch Content
    // Fetch Content
    React.useEffect(() => {
        fetchApplications();
        fetchStudents();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch(endpoints.admissionList);
            const data = await response.json();
            if (data.status === 'success') {
                const mappedApps = data.data.map(item => ({
                    id: item.id,
                    refNo: item.reference_no,
                    name: item.applicant_name,
                    email: item.email,
                    phone: item.phone,
                    course: item.course_name,
                    date: item.submitted_at || 'N/A',
                    status: item.status || 'Pending',
                    details: 'Details from form...',
                    formData: item.form_data
                }));
                // Only showing Pending in the first tab
                setApplications(mappedApps.filter(app => !app.status || app.status.toLowerCase() === 'pending'));
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await fetch(endpoints.enrolledList);
            const data = await response.json();
            if (data.status === 'success') {
                const mappedStudents = data.data.map(item => ({
                    id: item.student_id, // Use generated ST-ID
                    dbId: item.id,
                    name: item.name,
                    course: item.course,
                    class: item.batch,
                    joinDate: item.joining_date,
                    status: item.status,
                    phone: item.phone,
                    email: item.email
                }));
                setStudents(mappedStudents);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    // Mock Data removed - using real data from fetchApplications
    // React.useEffect(() => { setStudents([...]); }, []);

    // State for modal
    const [allottedBatch, setAllottedBatch] = useState('');

    const handleViewApplication = (app) => {
        setAllottedBatch(''); // Reset batch selection
        setSelectedApplication(app);
        setShowModal(true);
    };

    const handleApprove = async (app) => {
        if (!allottedBatch) {
            alert("Please select a Class/Batch before approving.");
            return;
        }

        try {
            const response = await fetch(endpoints.admissionApprove, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: app.id,
                    batch: allottedBatch
                })
            });
            const result = await response.json();

            if (result.status === 'success') {
                // Move logic (Optional: Add to enrolled list via API later)
                alert(result.message || `Application for ${app.name} approved!`);
                setShowModal(false);
                setSelectedApplication(null);
                setAllottedBatch('');
                fetchApplications(); // Refresh list to remove approved item
                fetchStudents();
            } else {
                alert('Failed to approve: ' + (result.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Error approving application');
        }
    };

    const handleReject = async (appId) => {
        if (!window.confirm('Are you sure you want to reject this application?')) return;

        try {
            const response = await fetch(endpoints.admissionReject, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: appId })
            });
            const result = await response.json();

            if (result.status === 'success') {
                setShowModal(false);
                fetchApplications(); // Refresh list
            } else {
                alert('Failed to reject: ' + (result.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Error rejecting application');
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
                            {/* Professional Form Layout */}
                            <div className="form-preview-container">
                                {/* Section 0: Office Use */}
                                <div className="preview-section" style={{ background: '#fdfdfd', borderLeft: '4px solid var(--deep-blue)' }}>
                                    <h4 className="section-head">Office Use</h4>
                                    <div className="info-grid">
                                        <div className="field-group">
                                            <label>Sl. No.</label>
                                            <div className="field-value" style={{ fontWeight: 'bold' }}>{selectedApplication.id}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Date</label>
                                            <div className="field-value">{selectedApplication.date}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Reference No.</label>
                                            <div className="field-value">{selectedApplication.refNo}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 1: Personal Information */}
                                <div className="preview-section">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 className="section-head">Personal Information</h4>
                                        {selectedApplication.formData?.student_photo && (
                                            <img
                                                src={selectedApplication.formData.student_photo}
                                                alt="Student"
                                                style={{ width: '100px', height: '120px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                                            />
                                        )}
                                    </div>
                                    <div className="info-grid">
                                        <div className="field-group">
                                            <label>Full Name</label>
                                            <div className="field-value">{selectedApplication.formData?.full_name || selectedApplication.name}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Father's Name</label>
                                            <div className="field-value">{selectedApplication.formData?.father_name || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Mother's Name</label>
                                            <div className="field-value">{selectedApplication.formData?.mother_name || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Date of Birth</label>
                                            <div className="field-value">{selectedApplication.formData?.dob || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Gender</label>
                                            <div className="field-value">{selectedApplication.formData?.gender || '-'}</div>
                                        </div>
                                        <div class="field-group">
                                            <label>Nationality</label>
                                            <div className="field-value">{selectedApplication.formData?.nationality || 'Indian'}</div>
                                        </div>
                                        <div class="field-group">
                                            <label>Marital Status</label>
                                            <div className="field-value">{selectedApplication.formData?.marital_status || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Category</label>
                                            <div className="field-value">{selectedApplication.formData?.category || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Blood Group</label>
                                            <div className="field-value">{selectedApplication.formData?.blood_group || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Aadhaar No.</label>
                                            <div className="field-value">{selectedApplication.formData?.aadhaar || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Contact & Address */}
                                <div className="preview-section">
                                    <h4 className="section-head">Contact & Address</h4>
                                    <div className="info-grid">
                                        <div className="field-group">
                                            <label>Mobile No</label>
                                            <div className="field-value">{selectedApplication.formData?.mobile_no || selectedApplication.phone}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Email ID</label>
                                            <div className="field-value">{selectedApplication.formData?.email || selectedApplication.email}</div>
                                        </div>
                                    </div>
                                    <div className="address-grid">
                                        <div className="address-box">
                                            <h5>Correspondence Address</h5>
                                            <p>
                                                {selectedApplication.formData?.corr_street}, {selectedApplication.formData?.corr_po}<br />
                                                Dist: {selectedApplication.formData?.corr_dist}, {selectedApplication.formData?.corr_state} - {selectedApplication.formData?.corr_pin}
                                            </p>
                                        </div>
                                        <div className="address-box">
                                            <h5>Permanent Address</h5>
                                            <p>
                                                {selectedApplication.formData?.perm_street}, {selectedApplication.formData?.perm_po}<br />
                                                Dist: {selectedApplication.formData?.perm_dist}, {selectedApplication.formData?.perm_state} - {selectedApplication.formData?.perm_pin}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Academic & Course */}
                                <div className="preview-section">
                                    <h4 className="section-head">Academic & Course Details</h4>
                                    <div className="info-grid">
                                        <div className="field-group">
                                            <label>Highest Qualification</label>
                                            <div className="field-value">{selectedApplication.formData?.highest_qual || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Passing Year</label>
                                            <div className="field-value">{selectedApplication.formData?.passing_year || '-'}</div>
                                        </div>
                                        <div className="field-group full-width">
                                            <label>Institution/University</label>
                                            <div className="field-value">{selectedApplication.formData?.institution_name || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Selected Course</label>
                                            <div className="field-value highlight">{selectedApplication.formData?.course_name || selectedApplication.course}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Preferred Batch</label>
                                            <div className="field-value">{selectedApplication.formData?.batch || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Payment Info */}
                                <div className="preview-section">
                                    <h4 className="section-head">Payment Information</h4>
                                    <div className="info-grid">
                                        <div className="field-group">
                                            <label>Transaction ID</label>
                                            <div className="field-value">{selectedApplication.formData?.txn_id || '-'}</div>
                                        </div>
                                        <div className="field-group">
                                            <label>Amount</label>
                                            <div className="field-value">₹{selectedApplication.formData?.course_fee || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 5: Signatures */}
                                <div className="preview-section">
                                    <h4 className="section-head">Signatures</h4>
                                    <div className="info-grid">
                                        <div className="field-group">
                                            <label>Candidate Signature</label>
                                            <div className="field-value" style={{ border: 'none' }}>
                                                {selectedApplication.formData?.signature_candidate ? (
                                                    <img src={selectedApplication.formData.signature_candidate} alt="Candidate Signature" style={{ maxHeight: '60px', border: '1px dashed #ccc' }} />
                                                ) : <span className="text-muted">Not uploaded</span>}
                                            </div>
                                        </div>
                                        <div className="field-group">
                                            <label>Guardian Signature</label>
                                            <div className="field-value" style={{ border: 'none' }}>
                                                {selectedApplication.formData?.signature_guardian ? (
                                                    <img src={selectedApplication.formData.signature_guardian} alt="Guardian Signature" style={{ maxHeight: '60px', border: '1px dashed #ccc' }} />
                                                ) : <span className="text-muted">Not uploaded</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="allotment-section">
                                <h4>Admission Action</h4>
                                <div className="form-group">
                                    <label>
                                        Allot Class/Batch
                                        {selectedApplication.formData?.batch &&
                                            <span style={{ marginLeft: '10px', color: 'var(--deep-blue)', fontSize: '0.85rem' }}>
                                                (Preferred: {selectedApplication.formData.batch})
                                            </span>
                                        }
                                    </label>
                                    <select
                                        className="form-select"
                                        value={allottedBatch}
                                        onChange={(e) => setAllottedBatch(e.target.value)}
                                    >
                                        <option value="" disabled>Select Batch</option>
                                        <option value="Batch A (Morning)">Batch A (Morning)</option>
                                        <option value="Batch B (Evening)">Batch B (Evening)</option>
                                        <option value="Batch C (Weekend)">Batch C (Weekend)</option>
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
                    width: 700px;
                    max-width: 90%;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    height: 90vh; /* Fixed height 90% of viewport */
                    display: flex;
                    flex-direction: column;
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

                .modal-body { 
                    padding: 20px; 
                    flex: 1; /* Take remaining space */
                    overflow-y: auto; /* Enable scrolling */
                }

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

                /* New Detail Modal Styles */
                .form-preview-container {
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                }
                .preview-section {
                    margin-bottom: 25px;
                    background: #fff;
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
                }
                .preview-section:last-child { margin-bottom: 0; }
                .section-head {
                    margin: 0 0 15px 0;
                    font-size: 0.95rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--deep-blue);
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 8px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }
                .field-group {
                    display: flex;
                    flex-direction: column;
                }
                .field-group.full-width { grid-column: 1 / -1; }
                .field-group label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #888;
                    margin-bottom: 4px;
                    font-weight: 600;
                }
                .field-value {
                    font-size: 0.95rem;
                    color: #333;
                    font-weight: 500;
                    padding: 4px 0;
                    border-bottom: 1px dashed #eee;
                }
                .field-value.highlight {
                    color: var(--deep-blue);
                    font-weight: 700;
                }
                .address-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-top: 15px;
                }
                .address-box {
                    background: #fafafa;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                }
                .address-box h5 {
                    margin: 0 0 8px 0;
                    font-size: 0.85rem;
                    color: #666;
                }
                .address-box p {
                    margin: 0;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    color: #444;
                }
                .modal-content {
                    width: 700px; /* Wider modal for form details */
                }
            `}</style>
        </div>
    );
};

export default Admissions;
