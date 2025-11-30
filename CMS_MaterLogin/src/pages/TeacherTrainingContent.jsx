import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, MapPin, Clock, Tag } from 'lucide-react';
import { endpoints } from '../config';

const TeacherTrainingContent = () => {
    const [trainings, setTrainings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        training_date: '',
        duration: '',
        mode: 'Offline',
        location: '',
        description: '',
        tags: '',
        registration_link: ''
    });

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.trainingList);
            const data = await response.json();
            if (Array.isArray(data)) {
                setTrainings(data);
            }
        } catch (err) {
            console.error("Failed to fetch trainings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this training program?')) return;
        try {
            await fetch(`${endpoints.trainingDelete}?id=${id}`, { method: 'POST' });
            fetchTrainings();
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch(endpoints.trainingCreate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowForm(false);
                fetchTrainings();
                setFormData({
                    title: '', training_date: '', duration: '', mode: 'Offline',
                    location: '', description: '', tags: '', registration_link: ''
                });
            } else {
                setError('Failed to save training.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Teacher Training</h1>
                    <p>Manage workshops and certification programs.</p>
                </div>
            </div>

            {!showForm ? (
                <div>
                    <button className="add-btn" onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
                        <Plus size={18} /> Add New Workshop
                    </button>

                    <div className="dynamic-list">
                        {trainings.map(item => (
                            <div key={item.id} className="list-item-card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{item.title}</h3>
                                        <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {item.training_date}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {item.duration}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {item.mode} - {item.location}</span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '10px' }}>{item.description}</p>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            {item.tags.split(',').map((tag, i) => (
                                                <span key={i} style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                    {tag.trim()}
                                                </span>
                                            ))}
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
                    <h3>Add New Workshop</h3>
                    {error && <p className="error-msg">{error}</p>}
                    <form onSubmit={handleSave}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input type="date" required value={formData.training_date} onChange={e => setFormData({ ...formData, training_date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Duration</label>
                                <input type="text" placeholder="e.g. 3 Days" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Mode</label>
                                <select value={formData.mode} onChange={e => setFormData({ ...formData, mode: e.target.value })}>
                                    <option value="Offline">Offline</option>
                                    <option value="Online">Online</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" placeholder="e.g. Guwahati" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Tags (comma separated)</label>
                                <input type="text" placeholder="Pedagogy, Vocal Health" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>Registration Link</label>
                                <input type="text" placeholder="https://..." value={formData.registration_link} onChange={e => setFormData({ ...formData, registration_link: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="save-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Workshop'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TeacherTrainingContent;
