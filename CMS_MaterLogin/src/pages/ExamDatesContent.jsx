import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { endpoints } from '../config';

const ExamDatesContent = () => {
    const [activeTab, setActiveTab] = useState('schedules');
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [editId, setEditId] = useState(null);

    // Page Content State
    const [pageContent, setPageContent] = useState({
        hero: { title: '', subtitle: '' },
        schedule_header: { title: '', description: '' },
        download_section: { title: '', text: '', pdf_url: '' }
    });
    const [isSavingContent, setIsSavingContent] = useState(false);

    const [formData, setFormData] = useState({
        course_name: '',
        icon: '📅',
        description: '',
        batches_data: []
    });

    useEffect(() => {
        fetchSchedules();
        fetchPageContent();
    }, []);

    const fetchSchedules = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.examDatesList);
            const data = await response.json();
            if (Array.isArray(data)) {
                setSchedules(data);
            }
        } catch (err) {
            console.error("Failed to fetch schedules:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPageContent = async () => {
        try {
            const res = await fetch(endpoints.examDatesContent);
            const data = await res.json();
            if (data) {
                // Merge with defaults to avoid undefined errors
                setPageContent({
                    hero: { title: '', subtitle: '', ...data.hero },
                    schedule_header: { title: '', description: '', ...data.schedule_header },
                    download_section: { title: '', text: '', pdf_url: '', ...data.download_section }
                });
            }
        } catch (err) { console.error(err); }
    };

    const handleContentSave = async (e) => {
        e.preventDefault();
        setIsSavingContent(true);
        try {
            const response = await fetch(`${endpoints.updateContent}?page=exam-dates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageContent)
            });
            if (response.ok) alert('Page content updated successfully!');
            else alert('Failed to update content.');
        } catch (err) { alert('Network error'); }
        finally { setIsSavingContent(false); }
    };

    const handleEdit = (item) => {
        setFormData({
            course_name: item.course_name,
            icon: item.icon,
            description: item.description,
            batches_data: item.batches_data || []
        });
        setEditId(item.id);
        setShowForm(true);
        setActiveTab('schedules');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this exam schedule?')) return;
        try {
            await fetch(`${endpoints.examDatesDelete}?id=${id}`, { method: 'POST' });
            fetchSchedules();
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = { ...formData, id: editId };
            const response = await fetch(endpoints.examDatesSave, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                fetchSchedules();
                setShowForm(false);
                setEditId(null);
                setFormData({ course_name: '', icon: '📅', description: '', batches_data: [] });
            } else {
                setError('Failed to save schedule.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    // --- Batch & Exam Management ---
    const addBatch = () => {
        setFormData({
            ...formData,
            batches_data: [...formData.batches_data, { batch_name: '', status: 'Upcoming', exams: [] }]
        });
    };

    const removeBatch = (index) => {
        const newBatches = [...formData.batches_data];
        newBatches.splice(index, 1);
        setFormData({ ...formData, batches_data: newBatches });
    };

    const updateBatch = (index, field, value) => {
        const newBatches = [...formData.batches_data];
        newBatches[index][field] = value;
        setFormData({ ...formData, batches_data: newBatches });
    };

    const addExam = (batchIndex) => {
        const newBatches = [...formData.batches_data];
        newBatches[batchIndex].exams.push({ code: '', subject: '', date: '', time: '' });
        setFormData({ ...formData, batches_data: newBatches });
    };

    const removeExam = (batchIndex, examIndex) => {
        const newBatches = [...formData.batches_data];
        newBatches[batchIndex].exams.splice(examIndex, 1);
        setFormData({ ...formData, batches_data: newBatches });
    };

    const updateExam = (batchIndex, examIndex, field, value) => {
        const newBatches = [...formData.batches_data];
        newBatches[batchIndex].exams[examIndex][field] = value;
        setFormData({ ...formData, batches_data: newBatches });
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Exam Dates Management</h1>
                    <p>Manage examination schedules and page content.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveTab('schedules')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'schedules' ? '#000' : '#f0f0f0', color: activeTab === 'schedules' ? '#fff' : '#333', cursor: 'pointer' }}
                >
                    Exam Schedules
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'content' ? '#000' : '#f0f0f0', color: activeTab === 'content' ? '#fff' : '#333', cursor: 'pointer' }}
                >
                    Page Content
                </button>
            </div>

            {activeTab === 'schedules' && (
                !showForm ? (
                    <div>
                        <button className="add-btn" onClick={() => { setEditId(null); setFormData({ course_name: '', icon: '📅', description: '', batches_data: [] }); setShowForm(true); }} style={{ marginBottom: '20px' }}>
                            <Plus size={18} /> Add New Schedule
                        </button>

                        <div className="dynamic-list">
                            {schedules.map(item => (
                                <div key={item.id} className="list-item-card" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0' }}>{item.icon} {item.course_name}</h3>
                                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{item.description}</p>
                                            <div style={{ marginTop: '10px' }}>
                                                {item.batches_data && item.batches_data.map((batch, i) => (
                                                    <span key={i} style={{ background: '#f0f9ff', color: '#0284c7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '5px' }}>
                                                        {batch.batch_name} ({batch.exams ? batch.exams.length : 0} exams)
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="icon-btn edit" onClick={() => handleEdit(item)}><Edit2 size={18} /></button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="form-section">
                        <h3>{editId ? 'Edit Schedule' : 'Add New Schedule'}</h3>
                        {error && <p className="error-msg">{error}</p>}
                        <form onSubmit={handleSave}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Course Name</label>
                                    <input type="text" required value={formData.course_name} onChange={e => setFormData({ ...formData, course_name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Icon (Emoji)</label>
                                    <input type="text" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description (e.g. Theory & Practical • Feb 2026)</label>
                                    <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h4>Batches & Exams</h4>
                                    <button type="button" className="add-btn small" onClick={addBatch}><Plus size={14} /> Add Batch</button>
                                </div>

                                {formData.batches_data.map((batch, bIndex) => (
                                    <div key={bIndex} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '15px', background: '#fafafa' }}>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <input type="text" placeholder="Batch Name (e.g. 1st Year)" value={batch.batch_name} onChange={e => updateBatch(bIndex, 'batch_name', e.target.value)} style={{ flex: 2 }} />
                                            <select value={batch.status} onChange={e => updateBatch(bIndex, 'status', e.target.value)} style={{ flex: 1 }}>
                                                <option value="Upcoming">Upcoming</option>
                                                <option value="Active">Active</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <button type="button" className="icon-btn delete" onClick={() => removeBatch(bIndex)}><Trash2 size={16} /></button>
                                        </div>

                                        {/* Exams Table */}
                                        <div style={{ background: '#fff', padding: '10px', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Exams</span>
                                                <button type="button" style={{ fontSize: '0.8rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => addExam(bIndex)}>+ Add Exam</button>
                                            </div>
                                            {batch.exams.map((exam, eIndex) => (
                                                <div key={eIndex} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                                    <input type="text" placeholder="Code" value={exam.code} onChange={e => updateExam(bIndex, eIndex, 'code', e.target.value)} style={{ width: '80px' }} />
                                                    <input type="text" placeholder="Subject" value={exam.subject} onChange={e => updateExam(bIndex, eIndex, 'subject', e.target.value)} style={{ flex: 1 }} />
                                                    <input type="text" placeholder="Date" value={exam.date} onChange={e => updateExam(bIndex, eIndex, 'date', e.target.value)} style={{ width: '120px' }} />
                                                    <input type="text" placeholder="Time" value={exam.time} onChange={e => updateExam(bIndex, eIndex, 'time', e.target.value)} style={{ width: '120px' }} />
                                                    <button type="button" className="icon-btn delete" onClick={() => removeExam(bIndex, eIndex)}><Trash2 size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="save-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Schedule'}</button>
                            </div>
                        </form>
                    </div>
                )
            )}

            {activeTab === 'content' && (
                <div className="form-section">
                    <h3>Page Content Settings</h3>
                    <form onSubmit={handleContentSave}>
                        {/* Hero Section */}
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>Hero Section</h4>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Page Title</label>
                                    <input type="text" value={pageContent.hero.title} onChange={e => setPageContent({ ...pageContent, hero: { ...pageContent.hero, title: e.target.value } })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Subtitle</label>
                                    <textarea rows="2" value={pageContent.hero.subtitle} onChange={e => setPageContent({ ...pageContent, hero: { ...pageContent.hero, subtitle: e.target.value } })}></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Header */}
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>Schedule Header</h4>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Section Title</label>
                                    <input type="text" value={pageContent.schedule_header.title} onChange={e => setPageContent({ ...pageContent, schedule_header: { ...pageContent.schedule_header, title: e.target.value } })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea rows="2" value={pageContent.schedule_header.description} onChange={e => setPageContent({ ...pageContent, schedule_header: { ...pageContent.schedule_header, description: e.target.value } })}></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Download Section */}
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>Download Section</h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input type="text" value={pageContent.download_section.title} onChange={e => setPageContent({ ...pageContent, download_section: { ...pageContent.download_section, title: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>PDF URL</label>
                                    <input type="text" value={pageContent.download_section.pdf_url} onChange={e => setPageContent({ ...pageContent, download_section: { ...pageContent.download_section, pdf_url: e.target.value } })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Text</label>
                                    <textarea rows="2" value={pageContent.download_section.text} onChange={e => setPageContent({ ...pageContent, download_section: { ...pageContent.download_section, text: e.target.value } })}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={isSavingContent}>
                                <Save size={18} style={{ marginRight: '5px' }} /> {isSavingContent ? 'Saving...' : 'Save Content'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ExamDatesContent;
