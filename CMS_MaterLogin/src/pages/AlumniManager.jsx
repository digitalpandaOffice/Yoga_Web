import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { endpoints } from '../config';

const AlumniManager = () => {
    const [alumni, setAlumni] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        batch_year: '',
        achievement: '',
        image_url: '',
        testimonial: '',
        is_featured: false
    });

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            const res = await fetch(endpoints.alumniList);
            const data = await res.json();
            if (Array.isArray(data)) setAlumni(data);
        } catch (err) { console.error(err); }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            batch_year: '',
            achievement: '',
            image_url: '',
            testimonial: '',
            is_featured: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (alum) => {
        setFormData({
            name: alum.name,
            batch_year: alum.batch_year,
            achievement: alum.achievement,
            image_url: alum.image_url,
            testimonial: alum.testimonial,
            is_featured: alum.is_featured == 1 // Convert to boolean
        });
        setEditingId(alum.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const url = editingId ? `${endpoints.alumniUpdate}?id=${editingId}` : endpoints.alumniCreate;

        // Handle checkbox
        const dataToSend = { ...formData, is_featured: formData.is_featured ? 1 : 0 };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                alert(editingId ? 'Alumni Profile Updated!' : 'Alumni Profile Created!');
                fetchAlumni();
                resetForm();
            } else {
                const err = await res.json();
                alert('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (err) { alert('Network error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this profile?')) return;
        try {
            await fetch(`${endpoints.alumniDelete}?id=${id}`, { method: 'POST' });
            fetchAlumni();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Alumni Management</h1>
                    <p>Manage alumni profiles, achievements, and testimonials.</p>
                </div>
            </div>

            {!showForm ? (
                <div>
                    <button className="add-btn" onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
                        <Plus size={18} /> Add New Profile
                    </button>

                    <div className="dynamic-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {alumni.map(alum => (
                            <div key={alum.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                                        {alum.image_url ?
                                            <img src={alum.image_url} alt={alum.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}><ImageIcon size={20} /></div>
                                        }
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0', fontSize: '1.1rem' }}>{alum.name}</h3>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>Batch {alum.batch_year}</div>
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.9rem', color: '#444' }}>
                                    <strong>Role:</strong> {alum.achievement || 'N/A'}
                                </div>

                                <div style={{ flex: 1, fontSize: '0.85rem', fontStyle: 'italic', color: '#666' }}>
                                    "{alum.testimonial ? (alum.testimonial.length > 80 ? alum.testimonial.substring(0, 80) + '...' : alum.testimonial) : 'No testimonial'}"
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                    <button className="icon-btn edit" onClick={() => handleEdit(alum)} style={{ color: '#007bff' }}><Edit size={18} /></button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(alum.id)} style={{ color: '#dc3545' }}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                        {alumni.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>No alumni profiles found.</p>}
                    </div>
                </div>
            ) : (
                <div className="form-section">
                    <h3>{editingId ? 'Edit Profile' : 'New Profile'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Batch Year</label>
                                <input type="text" required value={formData.batch_year} onChange={e => setFormData({ ...formData, batch_year: e.target.value })} placeholder="e.g. 2018" />
                            </div>

                            <div className="form-group full-width">
                                <label>Designation / Achievement</label>
                                <input type="text" value={formData.achievement} onChange={e => setFormData({ ...formData, achievement: e.target.value })} placeholder="e.g. Classical Dancer & Choreographer" />
                            </div>

                            <div className="form-group full-width">
                                <label>Profile Image URL</label>
                                <input type="text" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                            </div>

                            <div className="form-group full-width">
                                <label>Bio / Testimonial</label>
                                <textarea rows="4" value={formData.testimonial} onChange={e => setFormData({ ...formData, testimonial: e.target.value })}></textarea>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} />
                                    Featured Alumni?
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                            <button type="submit" className="save-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Profile'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AlumniManager;
