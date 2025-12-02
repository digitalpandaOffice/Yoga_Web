import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { endpoints } from '../config';

const GalleryManager = () => {
    const [activeTab, setActiveTab] = useState('images');
    const [images, setImages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Events',
        image: null
    });

    // Content State
    const [content, setContent] = useState({
        hero: { title: '', subtitle: '' },
        stats: {
            stat1: { number: '', label: '' },
            stat2: { number: '', label: '' },
            stat3: { number: '', label: '' },
            stat4: { number: '', label: '' }
        },
        featured: {
            title: '',
            item1: { title: '', desc: '', image: '' },
            item2: { title: '', desc: '', image: '' },
            item3: { title: '', desc: '', image: '' }
        }
    });

    useEffect(() => {
        fetchImages();
        fetchContent();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch(endpoints.galleryList);
            const data = await res.json();
            if (Array.isArray(data)) setImages(data);
        } catch (err) { console.error(err); }
    };

    const fetchContent = async () => {
        try {
            const res = await fetch(endpoints.galleryContent);
            const data = await res.json();
            if (data) {
                setContent({
                    hero: { title: '', subtitle: '', ...data.hero },
                    stats: {
                        stat1: { number: '', label: '', ...data.stats?.stat1 },
                        stat2: { number: '', label: '', ...data.stats?.stat2 },
                        stat3: { number: '', label: '', ...data.stats?.stat3 },
                        stat4: { number: '', label: '', ...data.stats?.stat4 }
                    },
                    featured: {
                        title: data.featured?.title || '',
                        item1: { title: '', desc: '', image: '', ...data.featured?.item1 },
                        item2: { title: '', desc: '', image: '', ...data.featured?.item2 },
                        item3: { title: '', desc: '', image: '', ...data.featured?.item3 }
                    }
                });
            }
        } catch (err) { console.error(err); }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('image', formData.image);

        try {
            const res = await fetch(endpoints.galleryCreate, {
                method: 'POST',
                body: data
            });
            if (res.ok) {
                alert('Image Uploaded!');
                setShowForm(false);
                fetchImages();
                setFormData({ title: '', category: 'Events', image: null });
            } else {
                const err = await res.json();
                alert('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (err) { alert('Network error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await fetch(`${endpoints.galleryDelete}?id=${id}`, { method: 'POST' });
            fetchImages();
        } catch (err) { console.error(err); }
    };

    const handleContentSave = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${endpoints.updateContent}?page=gallery-section`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });
            alert('Content updated!');
        } catch (err) { alert('Error'); }
    };

    const updateNested = (section, key, field, value) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: { ...prev[section][key], [field]: value }
            }
        }));
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Gallery Management</h1>
                    <p>Manage gallery images and page content.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveTab('images')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'images' ? '#047a76ff' : '#f0f0f0', color: activeTab === 'images' ? '#fff' : '#333', cursor: 'pointer' }}
                >
                    Gallery Images
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'content' ? '#047a76ff' : '#f0f0f0', color: activeTab === 'content' ? '#fff' : '#333', cursor: 'pointer' }}
                >
                    Page Content
                </button>
            </div>

            {activeTab === 'images' && (
                !showForm ? (
                    <div>
                        <button className="add-btn" onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
                            <Plus size={18} /> Add New Image
                        </button>

                        <div className="dynamic-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {images.map(img => (
                                <div key={img.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                                    <img src={img.image_url} alt={img.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                    <div style={{ padding: '10px' }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{img.title}</h4>
                                        <span style={{ fontSize: '0.8rem', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>{img.category}</span>
                                        <button className="icon-btn delete" onClick={() => handleDelete(img.id)} style={{ float: 'right', color: 'red' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            {images.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>No images uploaded yet.</p>}
                        </div>
                    </div>
                ) : (
                    <div className="form-section">
                        <h3>Upload Image</h3>
                        <form onSubmit={handleUpload}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Title / Caption</label>
                                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="Events">Events</option>
                                        <option value="Campus">Campus</option>
                                        <option value="Workshops">Workshops</option>
                                        <option value="Students">Students</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Image File</label>
                                    <input type="file" required accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="save-btn" disabled={isSaving}>{isSaving ? 'Uploading...' : 'Upload Image'}</button>
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
                                <input type="text" value={content.hero.title} onChange={e => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} />
                            </div>
                            <div className="form-group full-width">
                                <label>Subtitle</label>
                                <textarea rows="2" value={content.hero.subtitle} onChange={e => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}></textarea>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h4>Stats Section</h4>
                        <div className="form-grid">
                            {['stat1', 'stat2', 'stat3', 'stat4'].map((stat, i) => (
                                <React.Fragment key={stat}>
                                    <div className="form-group">
                                        <label>Stat {i + 1} Number</label>
                                        <input type="text" value={content.stats[stat].number} onChange={e => updateNested('stats', stat, 'number', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Stat {i + 1} Label</label>
                                        <input type="text" value={content.stats[stat].label} onChange={e => updateNested('stats', stat, 'label', e.target.value)} />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h4>Featured Highlights</h4>
                        <div className="form-group">
                            <label>Section Title</label>
                            <input type="text" value={content.featured.title} onChange={e => setContent({ ...content, featured: { ...content.featured, title: e.target.value } })} />
                        </div>
                        <div className="form-grid">
                            {['item1', 'item2', 'item3'].map((item, i) => (
                                <React.Fragment key={item}>
                                    <div className="form-group">
                                        <label>Item {i + 1} Title</label>
                                        <input type="text" value={content.featured[item].title} onChange={e => updateNested('featured', item, 'title', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Item {i + 1} Description</label>
                                        <input type="text" value={content.featured[item].desc} onChange={e => updateNested('featured', item, 'desc', e.target.value)} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Item {i + 1} Image URL</label>
                                        <input type="text" value={content.featured[item].image} onChange={e => updateNested('featured', item, 'image', e.target.value)} />
                                    </div>
                                </React.Fragment>
                            ))}
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

export default GalleryManager;
