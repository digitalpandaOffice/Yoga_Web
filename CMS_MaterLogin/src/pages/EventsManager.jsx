import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Calendar, MapPin, AlignLeft, Image as ImageIcon } from 'lucide-react';
import { endpoints } from '../config';

const EventsManager = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Event Form State
    const [formData, setFormData] = useState({
        title: '',
        event_date: '',
        location: '',
        description: '',
        image_url: '',
        type: 'other'
    });

    // Page Content State
    const [pageContent, setPageContent] = useState({
        hero: {
            title: '',
            subtitle: '',
            backgroundImage: ''
        }
    });

    useEffect(() => {
        fetchEvents();
        fetchPageContent();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(endpoints.eventsList);
            const data = await res.json();
            if (Array.isArray(data)) setEvents(data);
        } catch (err) { console.error(err); }
    };

    const fetchPageContent = async () => {
        try {
            const res = await fetch(endpoints.eventsContent);
            const data = await res.json();
            if (data && data.hero) {
                setPageContent({
                    hero: {
                        title: data.hero.title || '',
                        subtitle: data.hero.subtitle || '',
                        backgroundImage: data.hero.backgroundImage || ''
                    }
                });
            }
        } catch (err) { console.error(err); }
    };

    // --- Event Logic ---

    const resetForm = () => {
        setFormData({
            title: '',
            event_date: '',
            location: '',
            description: '',
            image_url: '',
            type: 'other'
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            event_date: event.event_date,
            location: event.location,
            description: event.description,
            image_url: event.image_url,
            type: event.type
        });
        setEditingId(event.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const url = editingId ? `${endpoints.eventsUpdate}?id=${editingId}` : endpoints.eventsCreate;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert(editingId ? 'Event Updated!' : 'Event Created!');
                fetchEvents();
                resetForm();
            } else {
                const err = await res.json();
                alert('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (err) { alert('Network error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await fetch(`${endpoints.eventsDelete}?id=${id}`, { method: 'POST' });
            fetchEvents();
        } catch (err) { console.error(err); }
    };

    // --- Content Logic ---

    const handleContentSave = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${endpoints.updateContent}?page=events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageContent)
            });
            alert('Page content updated!');
        } catch (err) { alert('Error updating content'); }
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Events Page Management</h1>
                    <p>Manage list of events and the main page content.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveTab('list')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'list' ? '#047a76ff' : '#f0f0f0', color: activeTab === 'list' ? '#fff' : '#333', cursor: 'pointer' }}
                >
                    Events List
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'content' ? '#047a76ff' : '#f0f0f0', color: activeTab === 'content' ? '#fff' : '#333', cursor: 'pointer' }}
                >
                    Page Content (Hero)
                </button>
            </div>

            {/* TAB: EVENTS LIST */}
            {activeTab === 'list' && (
                !showForm ? (
                    <div>
                        <button className="add-btn" onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
                            <Plus size={18} /> Add New Event
                        </button>

                        <div className="dynamic-list" style={{ display: 'grid', gap: '20px' }}>
                            {events.map(evt => (
                                <div key={evt.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', background: '#fff', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: '6px', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                                        {evt.image_url ?
                                            <img src={evt.image_url} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}><ImageIcon /></div>
                                        }
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{evt.title}</h3>
                                        <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {evt.event_date}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {evt.location}</span>
                                            <span style={{ background: '#e0f2f1', color: '#00796b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{evt.type}</span>
                                        </div>
                                        <p style={{ margin: 0, color: '#555', fontSize: '0.95rem' }}>{evt.description}</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <button className="icon-btn edit" onClick={() => handleEdit(evt)} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(evt.id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No events found. Create one!</p>}
                        </div>
                    </div>
                ) : (
                    <div className="form-section">
                        <h3>{editingId ? 'Edit Event' : 'New Event'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Event Title</label>
                                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div className="form-group">
                                    <label>Event Date</label>
                                    <input type="date" required value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} />
                                </div>

                                <div className="form-group">
                                    <label>Event Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="festival">Festival</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="exhibition">Exhibition</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group full-width">
                                    <label>Location</label>
                                    <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Main Auditorium" />
                                </div>

                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>

                                <div className="form-group full-width">
                                    <label>Image URL</label>
                                    <input type="text" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="save-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Event'}</button>
                            </div>
                        </form>
                    </div>
                )
            )}

            {/* TAB: PAGE CONTENT */}
            {activeTab === 'content' && (
                <form onSubmit={handleContentSave} className="form-section">
                    <div style={{ marginBottom: '30px' }}>
                        <h4>Hero Section</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Page Title</label>
                                <input type="text" value={pageContent.hero.title} onChange={e => setPageContent({ ...pageContent, hero: { ...pageContent.hero, title: e.target.value } })} />
                            </div>
                            <div className="form-group full-width">
                                <label>Subtitle</label>
                                <textarea rows="2" value={pageContent.hero.subtitle} onChange={e => setPageContent({ ...pageContent, hero: { ...pageContent.hero, subtitle: e.target.value } })}></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>Background Image URL</label>
                                <input type="text" value={pageContent.hero.backgroundImage} onChange={e => setPageContent({ ...pageContent, hero: { ...pageContent.hero, backgroundImage: e.target.value } })} />
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

export default EventsManager;
