import React, { useState, useEffect } from 'react';
import { Save, Loader2, Type, Star, Briefcase, MousePointer, Plus, Trash2 } from 'lucide-react';
import { endpoints } from '../config';

const CareersContent = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    // State matching PHP structure
    const [heroData, setHeroData] = useState({ title: '', subtitle: '' });
    const [introData, setIntroData] = useState({ title: '', description: '' });
    const [scopesData, setScopesData] = useState([]);
    const [supportData, setSupportData] = useState([]);
    const [ctaData, setCtaData] = useState({ title: '', text: '', buttonText: '', buttonLink: '' });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.careersContent);
            const data = await response.json();

            if (data) {
                if (data.hero) setHeroData(data.hero);
                if (data.intro) setIntroData(data.intro);
                if (data.scopes) setScopesData(data.scopes);
                if (data.support) setSupportData(data.support);
                if (data.cta) setCtaData(data.cta);
            }
        } catch (err) {
            console.error("Failed to fetch content:", err);
            setError("Failed to load content. Using default values.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        setShowSuccess(false);

        const payload = {
            hero: heroData,
            intro: introData,
            scopes: scopesData,
            support: supportData,
            cta: ctaData
        };

        try {
            const response = await fetch(`${endpoints.updateContent}?page=careers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to save changes.');
            }
        } catch (err) {
            console.error("Save error:", err);
            setError("Network error. Failed to save.");
        } finally {
            setIsSaving(false);
        }
    };

    // Helper functions
    const updateItem = (setter, list, id, field, value) => {
        setter(list.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (setter, list, id) => {
        setter(list.filter(item => item.id !== id));
    };

    const addItem = (setter, list, template) => {
        const newId = Math.max(...list.map(i => i.id), 0) + 1;
        setter([...list, { ...template, id: newId }]);
    };

    if (isLoading) {
        return <div className="loading-state"><Loader2 className="animate-spin" /> Loading content...</div>;
    }

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Careers Page Content</h1>
                    <p>Manage the content for the Career Pathways page.</p>
                </div>
                <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {showSuccess && <div className="success-banner">Changes saved successfully!</div>}
            {error && <div className="error-banner">{error}</div>}

            <div className="tabs-container">
                <div className="tabs-header">
                    <button className={`tab-btn ${activeTab === 'intro' ? 'active' : ''}`} onClick={() => setActiveTab('intro')}>
                        <Type size={18} /> Header & Intro
                    </button>
                    <button className={`tab-btn ${activeTab === 'scopes' ? 'active' : ''}`} onClick={() => setActiveTab('scopes')}>
                        <Star size={18} /> Career Scopes
                    </button>
                    <button className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
                        <Briefcase size={18} /> Student Support
                    </button>
                    <button className={`tab-btn ${activeTab === 'cta' ? 'active' : ''}`} onClick={() => setActiveTab('cta')}>
                        <MousePointer size={18} /> CTA Section
                    </button>
                </div>

                <div className="tab-content">
                    {/* Header & Intro Tab */}
                    {activeTab === 'intro' && (
                        <div className="form-section">
                            <h3>Page Header</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Main Title</label>
                                    <input type="text" value={heroData.title} onChange={(e) => setHeroData({ ...heroData, title: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Subtitle / Description</label>
                                    <textarea rows="2" value={heroData.subtitle} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}></textarea>
                                </div>
                            </div>

                            <h3 style={{ marginTop: '20px' }}>Intro Section</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Intro Title</label>
                                    <input type="text" value={introData.title} onChange={(e) => setIntroData({ ...introData, title: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Intro Description</label>
                                    <textarea rows="3" value={introData.description} onChange={(e) => setIntroData({ ...introData, description: e.target.value })}></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Career Scopes Tab */}
                    {activeTab === 'scopes' && (
                        <div className="form-section">
                            <h3>Career Scopes (Perks Grid)</h3>
                            <div className="dynamic-list">
                                {scopesData.map(item => (
                                    <div key={item.id} className="list-item-card">
                                        <button className="remove-btn" onClick={() => removeItem(setScopesData, scopesData, item.id)}>
                                            <Trash2 size={14} /> Remove
                                        </button>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Icon (Emoji)</label>
                                                <input type="text" value={item.icon} onChange={(e) => updateItem(setScopesData, scopesData, item.id, 'icon', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Title</label>
                                                <input type="text" value={item.title} onChange={(e) => updateItem(setScopesData, scopesData, item.id, 'title', e.target.value)} />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Description</label>
                                                <textarea rows="2" value={item.desc} onChange={(e) => updateItem(setScopesData, scopesData, item.id, 'desc', e.target.value)}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addItem(setScopesData, scopesData, { icon: '✨', title: 'New Scope', desc: 'Description of the career path...' })}>
                                    <Plus size={18} /> Add Scope
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Support Tab */}
                    {activeTab === 'support' && (
                        <div className="form-section">
                            <h3>Student Support Services</h3>
                            <div className="dynamic-list">
                                {supportData.map(item => (
                                    <div key={item.id} className="list-item-card">
                                        <button className="remove-btn" onClick={() => removeItem(setSupportData, supportData, item.id)}>
                                            <Trash2 size={14} /> Remove
                                        </button>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Title</label>
                                                <input type="text" value={item.title} onChange={(e) => updateItem(setSupportData, supportData, item.id, 'title', e.target.value)} />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Description</label>
                                                <textarea rows="2" value={item.desc} onChange={(e) => updateItem(setSupportData, supportData, item.id, 'desc', e.target.value)}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addItem(setSupportData, supportData, { title: 'New Support Service', desc: 'Description...' })}>
                                    <Plus size={18} /> Add Service
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CTA Tab */}
                    {activeTab === 'cta' && (
                        <div className="form-section">
                            <h3>Call to Action Section</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>CTA Title</label>
                                    <input type="text" value={ctaData.title} onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>CTA Text</label>
                                    <textarea rows="2" value={ctaData.text} onChange={(e) => setCtaData({ ...ctaData, text: e.target.value })}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Button Text</label>
                                    <input type="text" value={ctaData.buttonText} onChange={(e) => setCtaData({ ...ctaData, buttonText: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Button Link</label>
                                    <input type="text" value={ctaData.buttonLink} onChange={(e) => setCtaData({ ...ctaData, buttonLink: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareersContent;
