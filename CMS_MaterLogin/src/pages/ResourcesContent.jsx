import React, { useState, useEffect, useRef } from 'react';
import { Save, Image, List, Plus, Trash2, FileText, Video, Music, Upload, X } from 'lucide-react';
import { endpoints } from '../config';

const ResourcesContent = () => {
    const [activeTab, setActiveTab] = useState('resources');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Content State (Hero)
    const [heroData, setHeroData] = useState({
        title: 'Student Resources',
        subtitle: 'Access study materials, practice papers, and learning guides.',
        backgroundImage: ''
    });

    // Resources State
    const [resourcesList, setResourcesList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newResource, setNewResource] = useState({
        title: '',
        description: '',
        category: 'Study Notes',
        file_url: '',
        file_type: 'PDF',
        file_size: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchContent();
        fetchResources();
    }, []);

    const fetchContent = async () => {
        try {
            // Reusing a generic content endpoint if available, or we can create a specific one later
            // For now, we'll just manage the hero locally or add a specific endpoint if needed
            // Assuming 'resources' page content exists
            const response = await fetch(`${endpoints.content.replace('home', 'resources')}`);
            // Note: This might fail if the endpoint isn't explicitly defined in backend Content.php for 'resources'
            // But we can add it easily. For now, let's focus on the list.
        } catch (err) {
            console.log("Content fetch optional");
        }
    };

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.resourcesList);
            const data = await response.json();
            if (Array.isArray(data)) {
                setResourcesList(data);
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

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(endpoints.mediaUpload, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                setNewResource({
                    ...newResource,
                    file_url: data.file.url,
                    file_type: data.file.type === 'image' ? 'Image' : 'Document', // Simple mapping
                    file_size: data.file.size
                });
            } else {
                alert('File upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCreateResource = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            const response = await fetch(endpoints.resourcesCreate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newResource),
            });

            if (response.ok) {
                setSuccessMsg('Resource added successfully!');
                setShowAddForm(false);
                fetchResources();
                setNewResource({
                    title: '',
                    description: '',
                    category: 'Study Notes',
                    file_url: '',
                    file_type: 'PDF',
                    file_size: ''
                });
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setError('Failed to add resource.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteResource = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            const response = await fetch(`${endpoints.resourcesDelete}?id=${id}`, { method: 'POST' });
            if (response.ok) fetchResources();
        } catch (err) { console.error(err); }
    };

    const getIcon = (type) => {
        if (type === 'Video') return <Video size={20} />;
        if (type === 'Audio') return <Music size={20} />;
        return <FileText size={20} />;
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Student Resources</h1>
                    <p>Manage study materials and downloads.</p>
                </div>
            </div>

            {successMsg && <div className="success-banner">{successMsg}</div>}
            {error && <div className="error-banner" style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

            <div className="tabs-container">
                <div className="tabs-header">
                    <button className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
                        <List size={18} /> Resource List
                    </button>
                    {/* Hero tab can be added later if needed */}
                </div>

                <div className="tab-content">
                    {activeTab === 'resources' && (
                        <>
                            {!showAddForm ? (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <h3>All Resources ({resourcesList.length})</h3>
                                        <button className="add-btn" onClick={() => setShowAddForm(true)}>
                                            <Plus size={18} /> Add New Resource
                                        </button>
                                    </div>

                                    <div className="dynamic-list">
                                        {resourcesList.map(res => (
                                            <div key={res.id} className="list-item-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '8px', color: 'var(--deep-blue)' }}>
                                                    {getIcon(res.category)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: '0 0 5px 0' }}>{res.title}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                                                        {res.category} • {res.file_size}
                                                    </p>
                                                </div>
                                                <button className="remove-btn" onClick={() => handleDeleteResource(res.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {resourcesList.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No resources found.</p>}
                                    </div>
                                </div>
                            ) : (
                                <div className="form-section">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <h3>Add New Resource</h3>
                                        <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                                    </div>

                                    <form onSubmit={handleCreateResource}>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Title</label>
                                                <input type="text" required value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Description</label>
                                                <textarea rows="2" value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label>Category</label>
                                                <select value={newResource.category} onChange={(e) => setNewResource({ ...newResource, category: e.target.value })} className="form-control">
                                                    <option>Study Notes</option>
                                                    <option>Question Papers</option>
                                                    <option>Video Tutorials</option>
                                                    <option>Audio Tracks</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Upload File</label>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileUpload}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <button type="button" className="save-btn" style={{ background: '#f0f9ff', color: '#000', border: '1px solid #ddd' }} onClick={() => fileInputRef.current.click()}>
                                                        <Upload size={16} /> {isUploading ? 'Uploading...' : 'Choose File'}
                                                    </button>
                                                </div>
                                                {newResource.file_url && <p style={{ fontSize: '0.8rem', color: 'green', marginTop: '5px' }}>File attached: {newResource.file_url.split('/').pop()}</p>}
                                            </div>
                                        </div>
                                        <button type="submit" className="save-btn" style={{ marginTop: '20px' }} disabled={isSaving || !newResource.file_url}>
                                            {isSaving ? 'Saving...' : 'Add Resource'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourcesContent;
