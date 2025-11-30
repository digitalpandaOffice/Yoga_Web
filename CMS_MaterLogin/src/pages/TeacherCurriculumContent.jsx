import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Edit, Upload, X, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { endpoints } from '../config';

const TeacherCurriculumContent = () => {
    const [curriculumList, setCurriculumList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        discipline_name: '',
        icon: '📚',
        full_pdf_url: '',
        levels_data: [] // Array of { level: '', desc: '', link: '' }
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchCurriculum();
    }, []);

    const fetchCurriculum = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.curriculumList);
            const data = await response.json();
            if (Array.isArray(data)) {
                setCurriculumList(data);
            }
        } catch (err) {
            console.error("Failed to fetch curriculum:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            discipline_name: item.discipline_name,
            icon: item.icon,
            full_pdf_url: item.full_pdf_url,
            levels_data: item.levels_data || []
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this discipline?')) return;
        try {
            await fetch(`${endpoints.curriculumDelete}?id=${id}`, { method: 'POST' });
            fetchCurriculum();
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch(endpoints.curriculumSave, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowForm(false);
                fetchCurriculum();
                resetForm();
            } else {
                setError('Failed to save.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            discipline_name: '',
            icon: '📚',
            full_pdf_url: '',
            levels_data: []
        });
        setError('');
    };

    // Level Management
    const addLevel = () => {
        setFormData({
            ...formData,
            levels_data: [...formData.levels_data, { level: '', desc: '', link: '' }]
        });
    };

    const updateLevel = (index, field, value) => {
        const newLevels = [...formData.levels_data];
        newLevels[index][field] = value;
        setFormData({ ...formData, levels_data: newLevels });
    };

    const removeLevel = (index) => {
        const newLevels = formData.levels_data.filter((_, i) => i !== index);
        setFormData({ ...formData, levels_data: newLevels });
    };

    // File Upload for Full PDF
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch(endpoints.mediaUpload, { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok) {
                setFormData({ ...formData, full_pdf_url: data.file.url });
            }
        } catch (err) { alert('Upload failed'); }
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Teacher Curriculum</h1>
                    <p>Manage disciplines, levels, and syllabus links.</p>
                </div>
            </div>

            {!showForm ? (
                <div>
                    <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }} style={{ marginBottom: '20px' }}>
                        <Plus size={18} /> Add New Discipline
                    </button>

                    <div className="dynamic-list">
                        {curriculumList.map(item => (
                            <div key={item.id} className="list-item-card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{item.discipline_name}</h3>
                                            <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>
                                                {item.levels_data?.length || 0} Levels Defined
                                            </p>
                                            {item.full_pdf_url && (
                                                <a href={item.full_pdf_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--deep-blue)' }}>
                                                    View Full PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="icon-btn" onClick={() => handleEdit(item)} title="Edit">
                                            <Edit size={18} />
                                        </button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(item.id)} title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Levels */}
                                <div style={{ marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                                    {item.levels_data && item.levels_data.map((lvl, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                            <strong>{lvl.level}</strong>
                                            <span style={{ color: '#666' }}>{lvl.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>{formData.id ? 'Edit Discipline' : 'Add New Discipline'}</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                    </div>

                    <form onSubmit={handleSave}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Discipline Name</label>
                                <input type="text" required value={formData.discipline_name} onChange={(e) => setFormData({ ...formData, discipline_name: e.target.value })} placeholder="e.g. Fine Arts" />
                            </div>
                            <div className="form-group">
                                <label>Icon (Emoji)</label>
                                <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g. 🎨" />
                            </div>
                            <div className="form-group full-width">
                                <label>Full Syllabus PDF</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input type="text" value={formData.full_pdf_url} readOnly placeholder="Upload PDF..." style={{ flex: 1 }} />
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                                    <button type="button" className="save-btn" style={{ background: '#f0f9ff', color: '#000', border: '1px solid #ddd' }} onClick={() => fileInputRef.current.click()}>
                                        <Upload size={16} /> Upload
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4>Levels / Years</h4>
                                <button type="button" onClick={addLevel} style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    + Add Level
                                </button>
                            </div>

                            {formData.levels_data.map((lvl, index) => (
                                <div key={index} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: '600', color: '#64748b' }}>Level {index + 1}</span>
                                        <button type="button" onClick={() => removeLevel(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                    </div>
                                    <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr 1fr' }}>
                                        <div className="form-group">
                                            <input type="text" placeholder="Name (e.g. Year 1)" value={lvl.level} onChange={(e) => updateLevel(index, 'level', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <input type="text" placeholder="Description" value={lvl.desc} onChange={(e) => updateLevel(index, 'desc', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <input type="text" placeholder="Syllabus Link" value={lvl.link} onChange={(e) => updateLevel(index, 'link', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="save-btn" style={{ marginTop: '20px' }} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Discipline'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TeacherCurriculumContent;
