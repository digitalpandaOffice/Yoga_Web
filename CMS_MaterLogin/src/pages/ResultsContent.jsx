import React, { useState, useEffect } from 'react';
import { Save, Image, List, Plus, Trash2, Search, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import { endpoints } from '../config';

const ResultsContent = () => {
    const [activeTab, setActiveTab] = useState('results');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Content State (Hero & Options)
    const [heroData, setHeroData] = useState({
        title: 'Examination Results',
        subtitle: 'Check your diploma and certificate course results online',
        backgroundImage: ''
    });

    const [formOptions, setFormOptions] = useState({
        courses: [],
        years: []
    });

    // Results Management State
    const [resultsList, setResultsList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newResult, setNewResult] = useState({
        student_name: '',
        roll_number: '',
        course_id: '',
        year: '',
        marks_data: [
            { subject: 'Theory', marks: '', max_marks: 100 },
            { subject: 'Practical', marks: '', max_marks: 100 },
            { subject: 'Viva', marks: '', max_marks: 50 }
        ]
    });

    useEffect(() => {
        fetchContent();
        fetchResults();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(endpoints.resultsContent);
            const data = await response.json();
            if (data) {
                if (data.hero) setHeroData(data.hero);
                if (data.form_options) setFormOptions(data.form_options);
            }
        } catch (err) {
            console.error("Failed to fetch page content:", err);
        }
    };

    const fetchResults = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.resultsList);
            const data = await response.json();
            if (Array.isArray(data)) {
                setResultsList(data);
            }
        } catch (err) {
            console.error("Failed to fetch results list:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveContent = async () => {
        setIsSaving(true);
        setError('');
        setSuccessMsg('');

        const payload = {
            hero: heroData,
            form_options: formOptions
        };

        try {
            const response = await fetch(`${endpoints.updateContent}?page=results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccessMsg('Page content saved successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setError('Failed to save content.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateResult = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            const response = await fetch(endpoints.resultsCreate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newResult),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMsg('Result uploaded successfully!');
                setShowAddForm(false);
                fetchResults(); // Refresh list
                // Reset form
                setNewResult({
                    student_name: '',
                    roll_number: '',
                    course_id: '',
                    year: '',
                    marks_data: [
                        { subject: 'Theory', marks: '', max_marks: 100 },
                        { subject: 'Practical', marks: '', max_marks: 100 },
                        { subject: 'Viva', marks: '', max_marks: 50 }
                    ]
                });
            } else {
                setError(data.error || 'Failed to upload result.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteResult = async (id) => {
        if (!window.confirm('Are you sure you want to delete this result?')) return;

        try {
            const response = await fetch(`${endpoints.resultsDelete}?id=${id}`, {
                method: 'POST'
            });
            if (response.ok) {
                fetchResults();
            } else {
                alert('Failed to delete result');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Helper functions for dynamic lists (Content)
    const updateListItem = (category, index, field, value) => {
        const newList = [...formOptions[category]];
        newList[index][field] = value;
        if (field === 'label') {
            newList[index].value = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        setFormOptions({ ...formOptions, [category]: newList });
    };

    const removeListItem = (category, index) => {
        const newList = formOptions[category].filter((_, i) => i !== index);
        setFormOptions({ ...formOptions, [category]: newList });
    };

    const addListItem = (category, template) => {
        const initialValue = template.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormOptions({ ...formOptions, [category]: [...formOptions[category], { ...template, value: initialValue }] });
    };

    // Helper for Result Form (Subjects)
    const updateSubject = (index, field, value) => {
        const newMarks = [...newResult.marks_data];
        newMarks[index][field] = value;
        setNewResult({ ...newResult, marks_data: newMarks });
    };

    const addSubject = () => {
        setNewResult({
            ...newResult,
            marks_data: [...newResult.marks_data, { subject: '', marks: '', max_marks: 100 }]
        });
    };

    const removeSubject = (index) => {
        const newMarks = newResult.marks_data.filter((_, i) => i !== index);
        setNewResult({ ...newResult, marks_data: newMarks });
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Results Management</h1>
                    <p>Upload student results and manage page content.</p>
                </div>
                {activeTab !== 'results' && (
                    <button className="save-btn" onClick={handleSaveContent} disabled={isSaving}>
                        <Save size={18} /> {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                )}
            </div>

            {successMsg && <div className="success-banner">{successMsg}</div>}
            {error && <div className="error-banner" style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

            <div className="tabs-container">
                <div className="tabs-header">
                    <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
                        <User size={18} /> Student Results
                    </button>
                    <button className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>
                        <Image size={18} /> Page Hero
                    </button>
                    <button className={`tab-btn ${activeTab === 'options' ? 'active' : ''}`} onClick={() => setActiveTab('options')}>
                        <List size={18} /> Dropdown Options
                    </button>
                </div>

                <div className="tab-content">
                    {/* RESULTS TAB */}
                    {activeTab === 'results' && (
                        <>
                            {!showAddForm ? (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <h3>All Results ({resultsList.length})</h3>
                                        <button className="add-btn" onClick={() => setShowAddForm(true)}>
                                            <Plus size={18} /> Upload New Result
                                        </button>
                                    </div>

                                    {isLoading ? <p>Loading results...</p> : (
                                        <div className="table-responsive">
                                            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                                        <th style={{ padding: '12px' }}>Roll No</th>
                                                        <th style={{ padding: '12px' }}>Name</th>
                                                        <th style={{ padding: '12px' }}>Course</th>
                                                        <th style={{ padding: '12px' }}>Year</th>
                                                        <th style={{ padding: '12px' }}>Status</th>
                                                        <th style={{ padding: '12px' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {resultsList.map(result => (
                                                        <tr key={result.id} style={{ borderBottom: '1px solid #eee' }}>
                                                            <td style={{ padding: '12px' }}>{result.roll_number}</td>
                                                            <td style={{ padding: '12px' }}>{result.student_name}</td>
                                                            <td style={{ padding: '12px' }}>{result.course_id}</td>
                                                            <td style={{ padding: '12px' }}>{result.year}</td>
                                                            <td style={{ padding: '12px' }}>
                                                                <span style={{
                                                                    padding: '4px 8px',
                                                                    borderRadius: '12px',
                                                                    background: result.status === 'PASS' ? '#dcfce7' : '#fee2e2',
                                                                    color: result.status === 'PASS' ? '#166534' : '#991b1b',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {result.status}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '12px' }}>
                                                                <button onClick={() => handleDeleteResult(result.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {resultsList.length === 0 && (
                                                        <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No results found. Upload one to get started.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="form-section">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <h3>Upload Student Result</h3>
                                        <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Cancel</button>
                                    </div>

                                    <form onSubmit={handleCreateResult}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Student Name</label>
                                                <input type="text" required value={newResult.student_name} onChange={(e) => setNewResult({ ...newResult, student_name: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Roll Number</label>
                                                <input type="text" required value={newResult.roll_number} onChange={(e) => setNewResult({ ...newResult, roll_number: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Course</label>
                                                <select required value={newResult.course_id} onChange={(e) => setNewResult({ ...newResult, course_id: e.target.value })} className="form-control">
                                                    <option value="">-- Select Course --</option>
                                                    {formOptions.courses.map((opt, i) => (
                                                        <option key={i} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Year/Session</label>
                                                <select required value={newResult.year} onChange={(e) => setNewResult({ ...newResult, year: e.target.value })} className="form-control">
                                                    <option value="">-- Select Year --</option>
                                                    {formOptions.years.map((opt, i) => (
                                                        <option key={i} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <h4>Marks Entry</h4>
                                            <div className="dynamic-list">
                                                {newResult.marks_data.map((subject, index) => (
                                                    <div key={index} className="list-item-card" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                                            <label style={{ fontSize: '0.8rem' }}>Subject Name</label>
                                                            <input type="text" required value={subject.subject} onChange={(e) => updateSubject(index, 'subject', e.target.value)} />
                                                        </div>
                                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                                            <label style={{ fontSize: '0.8rem' }}>Marks Obtained</label>
                                                            <input type="number" required value={subject.marks} onChange={(e) => updateSubject(index, 'marks', parseFloat(e.target.value))} />
                                                        </div>
                                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                                            <label style={{ fontSize: '0.8rem' }}>Max Marks</label>
                                                            <input type="number" required value={subject.max_marks} onChange={(e) => updateSubject(index, 'max_marks', parseFloat(e.target.value))} />
                                                        </div>
                                                        <button type="button" onClick={() => removeSubject(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button type="button" className="add-btn" onClick={addSubject}>
                                                    <Plus size={18} /> Add Subject
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                                            <button type="submit" className="save-btn" disabled={isSaving}>
                                                {isSaving ? 'Uploading...' : 'Upload Result'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    {/* HERO TAB */}
                    {activeTab === 'hero' && (
                        <div className="form-section">
                            <h3>Hero Banner Configuration</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Main Title</label>
                                    <input type="text" value={heroData.title} onChange={(e) => setHeroData({ ...heroData, title: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Subtitle / Description</label>
                                    <textarea rows="3" value={heroData.subtitle} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}></textarea>
                                </div>
                                <div className="form-group full-width">
                                    <label>Background Image URL</label>
                                    <input type="text" value={heroData.backgroundImage} onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OPTIONS TAB */}
                    {activeTab === 'options' && (
                        <>
                            <div className="form-section">
                                <h3>Course Dropdown Options</h3>
                                <div className="dynamic-list">
                                    {formOptions.courses.map((item, index) => (
                                        <div key={index} className="list-item-card">
                                            <button className="remove-btn" onClick={() => removeListItem('courses', index)}>
                                                <Trash2 size={14} /> Remove
                                            </button>
                                            <div className="form-grid">
                                                <div className="form-group full-width">
                                                    <label>Course Name</label>
                                                    <input type="text" value={item.label} onChange={(e) => updateListItem('courses', index, 'label', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="add-btn" onClick={() => addListItem('courses', { label: 'New Course' })}>
                                        <Plus size={18} /> Add Course Option
                                    </button>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Year/Session Dropdown Options</h3>
                                <div className="dynamic-list">
                                    {formOptions.years.map((item, index) => (
                                        <div key={index} className="list-item-card">
                                            <button className="remove-btn" onClick={() => removeListItem('years', index)}>
                                                <Trash2 size={14} /> Remove
                                            </button>
                                            <div className="form-grid">
                                                <div className="form-group full-width">
                                                    <label>Year/Session</label>
                                                    <input type="text" value={item.label} onChange={(e) => updateListItem('years', index, 'label', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="add-btn" onClick={() => addListItem('years', { label: '2025-2026' })}>
                                        <Plus size={18} /> Add Year Option
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsContent;
