import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Trash2, FileText, Video, Music, File } from 'lucide-react';
import { endpoints } from '../config';

const TeacherResourcesContent = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Lesson Plans',
        file_url: '',
        file_type: '',
        file_size: ''
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.teacherResourcesList);
            const data = await response.json();
            if (Array.isArray(data)) {
                setResources(data);
            }
        } catch (err) {
            console.error("Failed to fetch resources:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch(endpoints.mediaUpload, { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok) {
                // Determine simple file type
                let simpleType = 'FILE';
                const nameParts = file.name.split('.');
                if (nameParts.length > 1) {
                    simpleType = nameParts.pop().toUpperCase();
                }

                setFormData({
                    ...formData,
                    file_url: data.file.url,
                    file_type: simpleType,
                    file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
                });
            } else {
                alert('Upload failed');
            }
        } catch (err) { alert('Upload failed'); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch(endpoints.teacherResourcesCreate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setSuccessMsg('Resource added successfully!');
                fetchResources();
                setShowForm(false);
                setFormData({ title: '', description: '', category: 'Lesson Plans', file_url: '', file_type: '', file_size: '' });
            } else {
                setError('Failed to add resource.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            await fetch(`${endpoints.teacherResourcesDelete}?id=${id}`, { method: 'POST' });
            fetchResources();
        } catch (err) { console.error(err); }
    };

    const getIcon = (type) => {
        if (['MP4', 'MOV', 'AVI'].includes(type)) return <Video size={20} />;
        if (['MP3', 'WAV'].includes(type)) return <Music size={20} />;
        if (['PDF', 'DOC', 'DOCX'].includes(type)) return <FileText size={20} />;
        return <File size={20} />;
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Teacher Resources</h1>
                    <p>Manage lesson plans, forms, and teaching aids.</p>
                </div>
            </div>

            {!showForm ? (
                <div>
                    <button className="add-btn" onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
                        <Plus size={18} /> Add New Resource
                    </button>

                    <div className="dynamic-list">
                        {resources.map(item => (
                            <div key={item.id} className="list-item-card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '8px', color: '#0284c7', height: 'fit-content' }}>
                                            {getIcon(item.file_type)}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0' }}>{item.title}</h3>
                                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>{item.description}</p>
                                            <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#888' }}>
                                                <span style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{item.category}</span>
                                                <span>{item.file_type} • {item.file_size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="icon-btn delete" onClick={() => handleDelete(item.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="form-section">
                    <h3>Add New Resource</h3>
                    {error && <p className="error-msg">{error}</p>}
                    <form onSubmit={handleSave}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option>Lesson Plans</option>
                                    <option>Admin Forms</option>
                                    <option>Assessment Tools</option>
                                    <option>Multimedia</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>File Upload</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input type="text" value={formData.file_url} readOnly placeholder="Upload file..." style={{ flex: 1 }} />
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                                    <button type="button" className="save-btn" style={{ background: '#f0f9ff', color: '#000', border: '1px solid #ddd' }} onClick={() => fileInputRef.current.click()}>
                                        <Upload size={16} /> Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="save-btn" disabled={isSaving || !formData.file_url}>{isSaving ? 'Saving...' : 'Save Resource'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TeacherResourcesContent;
