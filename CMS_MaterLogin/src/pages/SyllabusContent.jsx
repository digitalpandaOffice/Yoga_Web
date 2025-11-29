import React, { useState, useEffect } from 'react';
import { Save, Image, BookOpen, Plus, Trash2 } from 'lucide-react';
import { endpoints } from '../config';

const SyllabusContent = () => {
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    // Initial State
    const [heroData, setHeroData] = useState({
        title: 'Course Syllabus',
        subtitle: 'Comprehensive curriculum details for all our diploma and certificate programs.',
        backgroundImage: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=1600&q=80'
    });

    const [syllabusCards, setSyllabusCards] = useState([
        {
            id: 1,
            title: 'Fine Arts Diploma',
            description: 'Detailed syllabus covering sketching, oil painting, watercolours, and art history.',
            year: '2025',
            level: 'All Levels',
            downloadLink: '#'
        }
    ]);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.syllabusContent);
            const data = await response.json();

            if (data) {
                if (data.hero && Object.keys(data.hero).length > 0) setHeroData(data.hero);
                if (data.syllabus_cards && Array.isArray(data.syllabus_cards) && data.syllabus_cards.length > 0) {
                    setSyllabusCards(data.syllabus_cards);
                }
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
            syllabus_cards: syllabusCards
        };

        try {
            const response = await fetch(`${endpoints.updateContent}?page=syllabus`, {
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

    // Helper functions for dynamic lists
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

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Syllabus Page Content</h1>
                    <p>Manage the syllabus page hero section and course cards.</p>
                </div>
                <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {showSuccess && (
                <div className="success-banner">
                    Changes saved successfully!
                </div>
            )}

            {error && (
                <div className="error-banner" style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            <div className="tabs-container">
                <div className="tabs-header">
                    <button className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>
                        <Image size={18} /> Hero
                    </button>
                    <button className={`tab-btn ${activeTab === 'cards' ? 'active' : ''}`} onClick={() => setActiveTab('cards')}>
                        <BookOpen size={18} /> Syllabus Cards
                    </button>
                </div>

                <div className="tab-content">
                    {/* HERO SECTION */}
                    {activeTab === 'hero' && (
                        <>
                            <div className="form-section">
                                <h3>Hero Banner Configuration</h3>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Main Title</label>
                                        <input type="text" value={heroData.title} onChange={(e) => setHeroData({ ...heroData, title: e.target.value })} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Subtitle / Description</label>
                                        <textarea rows="3" value={heroData.subtitle} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}></textarea>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Background Image URL</label>
                                        <div className="url-input-group">
                                            <input type="text" value={heroData.backgroundImage} onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })} />
                                        </div>
                                        {heroData.backgroundImage && (
                                            <div className="image-preview-box">
                                                <p className="preview-label">Preview:</p>
                                                <img src={heroData.backgroundImage} alt="Hero Background" className="preview-img" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <style>{`
                                .url-input-group {
                                    display: flex;
                                    gap: 10px;
                                }
                                .url-input-group input {
                                    flex: 1;
                                }
                                .image-preview-box {
                                    margin-top: 15px;
                                    background: #f9f9f9;
                                    padding: 10px;
                                    border-radius: 8px;
                                    border: 1px solid #eee;
                                }
                                .preview-label {
                                    font-size: 0.8rem;
                                    color: #666;
                                    margin-bottom: 5px;
                                }
                                .preview-img {
                                    width: 100%;
                                    max-height: 200px;
                                    object-fit: cover;
                                    border-radius: 6px;
                                }
                            `}</style>
                        </>
                    )}

                    {/* SYLLABUS CARDS SECTION */}
                    {activeTab === 'cards' && (
                        <div className="form-section">
                            <h3>Course Syllabus Cards</h3>
                            <div className="dynamic-list">
                                {syllabusCards.map(item => (
                                    <div key={item.id} className="list-item-card">
                                        <button className="remove-btn" onClick={() => removeItem(setSyllabusCards, syllabusCards, item.id)}>
                                            <Trash2 size={14} /> Remove
                                        </button>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Course Title</label>
                                                <input type="text" value={item.title} onChange={(e) => updateItem(setSyllabusCards, syllabusCards, item.id, 'title', e.target.value)} />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Description</label>
                                                <textarea rows="2" value={item.description} onChange={(e) => updateItem(setSyllabusCards, syllabusCards, item.id, 'description', e.target.value)}></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label>Year</label>
                                                <input type="text" value={item.year} onChange={(e) => updateItem(setSyllabusCards, syllabusCards, item.id, 'year', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Level</label>
                                                <input type="text" value={item.level} onChange={(e) => updateItem(setSyllabusCards, syllabusCards, item.id, 'level', e.target.value)} />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Download Link (PDF URL)</label>
                                                <input type="text" value={item.downloadLink} onChange={(e) => updateItem(setSyllabusCards, syllabusCards, item.id, 'downloadLink', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addItem(setSyllabusCards, syllabusCards, { title: 'New Course', description: 'Description', year: '2025', level: 'Beginner', downloadLink: '#' })}>
                                    <Plus size={18} /> Add Syllabus Card
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SyllabusContent;
