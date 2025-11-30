import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, Search, Edit } from 'lucide-react';
import { endpoints } from '../config';

const AdmitCardManager = () => {
    const [activeTab, setActiveTab] = useState('cards');
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        student_name: '',
        father_name: '',
        registration_number: '',
        roll_number: '',
        dob: '',
        course_name: '',
        exam_session: '',
        exam_center: '',
        photo: null,
        subjects: [] // Array of { date, time, subject }
    });

    // Content State
    const [content, setContent] = useState({
        hero: { title: '', subtitle: '' },
        instructions: { title: '', note: '' }
    });

    useEffect(() => {
        fetchCards();
        fetchContent();
    }, []);

    const fetchCards = async () => {
        try {
            const res = await fetch(endpoints.admitCardsList);
            const data = await res.json();
            if (Array.isArray(data)) setCards(data);
        } catch (err) { console.error(err); }
    };

    const fetchContent = async () => {
        try {
            const res = await fetch(endpoints.admitCardContent);
            const data = await res.json();
            if (data) setContent({
                hero: { title: '', subtitle: '', ...data.hero },
                instructions: { title: '', note: '', ...data.instructions }
            });
        } catch (err) { console.error(err); }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, { date: '', time: '', subject: '' }]
        }));
    };

    const updateSubject = (index, field, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index][field] = value;
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const removeSubject = (index) => {
        const newSubjects = [...formData.subjects];
        newSubjects.splice(index, 1);
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const handleEdit = (card) => {
        setEditingId(card.id);
        let subjects = [];
        try {
            subjects = typeof card.subjects === 'string' ? JSON.parse(card.subjects) : card.subjects;
            if (!Array.isArray(subjects)) subjects = [];
        } catch (e) { subjects = []; }

        setFormData({
            student_name: card.student_name,
            father_name: card.father_name,
            registration_number: card.registration_number,
            roll_number: card.roll_number,
            dob: card.dob,
            course_name: card.course_name,
            exam_session: card.exam_session,
            exam_center: card.exam_center,
            photo: null,
            subjects: subjects
        });
        setShowForm(true);
    };

    const handleIssueCard = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        data.append('student_name', formData.student_name);
        data.append('father_name', formData.father_name);
        data.append('registration_number', formData.registration_number);
        data.append('roll_number', formData.roll_number);
        data.append('dob', formData.dob);
        data.append('course_name', formData.course_name);
        data.append('exam_session', formData.exam_session);
        data.append('exam_center', formData.exam_center);
        if (formData.photo) data.append('photo', formData.photo);
        data.append('subjects', JSON.stringify(formData.subjects));

        const url = editingId ? `${endpoints.admitCardsUpdate}?id=${editingId}` : endpoints.admitCardsCreate;

        try {
            const res = await fetch(url, {
                method: 'POST',
                body: data
            });
            if (res.ok) {
                alert(editingId ? 'Admit Card Updated!' : 'Admit Card Generated!');
                setShowForm(false);
                setEditingId(null);
                fetchCards();
                setFormData({
                    student_name: '', father_name: '', registration_number: '', roll_number: '',
                    dob: '', course_name: '', exam_session: '', exam_center: '', photo: null, subjects: []
                });
            } else {
                const err = await res.json();
                alert('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (err) { alert('Network error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this admit card?')) return;
        try {
            await fetch(`${endpoints.admitCardsDelete}?id=${id}`, { method: 'POST' });
            fetchCards();
        } catch (err) { console.error(err); }
    };

    const handleContentSave = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${endpoints.updateContent}?page=admit-card`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });
            alert('Content updated!');
        } catch (err) { alert('Error'); }
    };

    const updateSection = (section, field, value) => {
        setContent(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            student_name: '', father_name: '', registration_number: '', roll_number: '',
            dob: '', course_name: '', exam_session: '', exam_center: '', photo: null, subjects: []
        });
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Admit Card Management</h1>
                    <p>Generate automated admit cards and manage content.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveTab('cards')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'cards' ? '#047a76ff' : '#f0f0f0', color: activeTab === 'cards' ? '#fff' : '#333', cursor: 'pointer' }}
                >
                    Generated Cards
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'content' ? '#047a76ff' : '#f0f0f0', color: activeTab === 'content' ? '#fff' : '#333', cursor: 'pointer' }}
                >
                    Page Content
                </button>
            </div>

            {activeTab === 'cards' && (
                !showForm ? (
                    <div>
                        <button className="add-btn" onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
                            <Plus size={18} /> Generate New Admit Card
                        </button>

                        <div className="dynamic-list">
                            {cards.map(card => (
                                <div key={card.id} className="list-item-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <img src={card.student_photo} alt="Student" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0' }}>{card.student_name}</h4>
                                            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                                                Reg: {card.registration_number} • Roll: {card.roll_number}
                                            </p>
                                            <p style={{ fontSize: '0.85rem', color: '#888', margin: '5px 0 0 0' }}>
                                                {card.course_name} ({card.exam_session})
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="icon-btn edit" onClick={() => handleEdit(card)}><Edit size={18} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(card.id)}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                            {cards.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No admit cards generated yet.</p>}
                        </div>
                    </div>
                ) : (
                    <div className="form-section">
                        <h3>{editingId ? 'Edit Admit Card' : 'Generate Admit Card'}</h3>
                        <form onSubmit={handleIssueCard}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Student Name</label>
                                    <input type="text" required value={formData.student_name} onChange={e => setFormData({ ...formData, student_name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Father's Name</label>
                                    <input type="text" required value={formData.father_name} onChange={e => setFormData({ ...formData, father_name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Registration Number</label>
                                    <input type="text" required placeholder="e.g. REG/2025/001" value={formData.registration_number} onChange={e => setFormData({ ...formData, registration_number: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Roll Number</label>
                                    <input type="text" required placeholder="e.g. 2501001" value={formData.roll_number} onChange={e => setFormData({ ...formData, roll_number: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date" required value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Course Name</label>
                                    <input type="text" required value={formData.course_name} onChange={e => setFormData({ ...formData, course_name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Exam Session</label>
                                    <input type="text" required placeholder="e.g. Feb 2026" value={formData.exam_session} onChange={e => setFormData({ ...formData, exam_session: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Exam Center</label>
                                    <input type="text" required value={formData.exam_center} onChange={e => setFormData({ ...formData, exam_center: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Student Photo {editingId && '(Leave blank to keep current)'}</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} required={!editingId} />
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h4>Exam Subjects</h4>
                                    <button type="button" className="add-btn small" onClick={addSubject}><Plus size={14} /> Add Subject</button>
                                </div>
                                {formData.subjects.map((sub, index) => (
                                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '10px', marginBottom: '10px' }}>
                                        <input type="date" required value={sub.date} onChange={e => updateSubject(index, 'date', e.target.value)} />
                                        <input type="time" required value={sub.time} onChange={e => updateSubject(index, 'time', e.target.value)} />
                                        <input type="text" placeholder="Subject Name" required value={sub.subject} onChange={e => updateSubject(index, 'subject', e.target.value)} />
                                        <button type="button" className="icon-btn delete" onClick={() => removeSubject(index)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                <button type="submit" className="save-btn" disabled={isSaving}>{isSaving ? 'Saving...' : (editingId ? 'Update Admit Card' : 'Generate Admit Card')}</button>
                            </div>
                        </form>
                    </div>
                )
            )}

            {activeTab === 'content' && (
                <form onSubmit={handleContentSave} className="form-section">
                    <div style={{ marginBottom: '30px' }}>
                        <h4>Hero Section</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={content.hero.title} onChange={e => updateSection('hero', 'title', e.target.value)} />
                            </div>
                            <div className="form-group full-width">
                                <label>Subtitle</label>
                                <textarea rows="2" value={content.hero.subtitle} onChange={e => updateSection('hero', 'subtitle', e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h4>Instructions Section</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Form Title</label>
                                <input type="text" value={content.instructions.title} onChange={e => updateSection('instructions', 'title', e.target.value)} />
                            </div>
                            <div className="form-group full-width">
                                <label>Note Text</label>
                                <textarea rows="2" value={content.instructions.note} onChange={e => updateSection('instructions', 'note', e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn">Save Content</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdmitCardManager;
