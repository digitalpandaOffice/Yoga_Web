import React, { useState } from 'react';
import { Save, Image, Type, BarChart2, Star, Heart, Calendar, Layout, Plus, Trash2 } from 'lucide-react';

const HomeContent = () => {
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Initial State (Mock Data)
    const [heroData, setHeroData] = useState({
        title: 'Preserving Tradition. Inspiring Creativity.',
        subtitle: 'Diploma courses and training programs in Indian Art, Music & Culture — where heritage meets contemporary practice.',
        ctaText: 'Explore Courses',
        ctaLink: '/courses',
        backgroundImage: 'https://mapmygenome.in/cdn/shop/articles/The_Science_Behind_Yoga_and_Its_Benefits_for_Mental_Health.jpg'
    });

    const [aboutData, setAboutData] = useState({
        title: 'About Edvayu Educational Foundations',
        subtitle: 'Preserving Heritage, Nurturing Talent, Building Futures',
        story: 'Founded in 2005, Edvayu Educational Foundations has emerged as a premier institution dedicated to preserving and promoting India\'s rich cultural heritage.',
        vision: 'To be India\'s leading cultural education hub, fostering artistic excellence while preserving traditional knowledge for future generations.',
        mission: 'To provide world-class cultural education through innovative teaching methods, expert faculty, and state-of-the-art facilities.'
    });

    const [statsData, setStatsData] = useState({
        students: 5000,
        faculty: 150,
        years: 25,
        awards: 50
    });

    const [featuresData, setFeaturesData] = useState([
        { id: 1, icon: '🎭', title: 'Expert Faculty', description: 'Learn from renowned artists and cultural experts with decades of experience' },
        { id: 2, icon: '🏛️', title: 'Modern Facilities', description: 'State-of-the-art studios, performance halls, and practice rooms' },
        { id: 3, icon: '🌍', title: 'Global Recognition', description: 'Internationally recognized programs and certification' },
        { id: 4, icon: '🤝', title: 'Community Impact', description: 'Active participation in cultural preservation and community development' }
    ]);

    const [valuesData, setValuesData] = useState([
        { id: 1, icon: '🎨', title: 'Creativity', description: 'Fostering artistic expression and creative thinking in all our programs' },
        { id: 2, icon: '📚', title: 'Excellence', description: 'Maintaining the highest standards in education and cultural preservation' },
        { id: 3, icon: '🤝', title: 'Community', description: 'Building strong connections within our cultural community' },
        { id: 4, icon: '🌱', title: 'Growth', description: 'Encouraging continuous learning and personal development' }
    ]);

    const [highlightsData, setHighlightsData] = useState([
        { id: 1, title: 'Annual Dance Festival', date: 'March 2025', location: 'New Delhi', image: 'https://www.thepresidiumschool.com/common/images/gallery/pages/Events/Annual-Fest/annual-day-0001.jpg' },
        { id: 2, title: 'Student Art Exhibition', date: 'February 2025', location: 'Campus Gallery', image: 'https://govtcollegeofart.assam.gov.in/sites/default/files/swf_utility_folder/departments/artncraftcollege_medhassu_in_oid_8/this_comm/c41.JPG' }
    ]);

    const [footerData, setFooterData] = useState({
        address: 'Morigaon 782105, Assam, India',
        phone: '+91 98765 43210',
        email: 'contact@niac.edu.in',
        facebook: '#',
        instagram: '#',
        youtube: '#'
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Saved Data:', {
                heroData, aboutData, statsData, featuresData, valuesData, highlightsData, footerData
            });
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
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
                    <h1>Homepage Content</h1>
                    <p>Manage the content displayed on the main landing page.</p>
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
                    Changes saved successfully! (Mock)
                </div>
            )}

            <div className="tabs-container">
                <div className="tabs-header">
                    <button className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>
                        <Image size={18} /> Hero
                    </button>
                    <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
                        <Type size={18} /> About
                    </button>
                    <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
                        <BarChart2 size={18} /> Stats
                    </button>
                    <button className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`} onClick={() => setActiveTab('features')}>
                        <Star size={18} /> Features
                    </button>
                    <button className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`} onClick={() => setActiveTab('values')}>
                        <Heart size={18} /> Values
                    </button>
                    <button className={`tab-btn ${activeTab === 'highlights' ? 'active' : ''}`} onClick={() => setActiveTab('highlights')}>
                        <Calendar size={18} /> Highlights
                    </button>
                    <button className={`tab-btn ${activeTab === 'footer' ? 'active' : ''}`} onClick={() => setActiveTab('footer')}>
                        <Layout size={18} /> Footer
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
                                    <div className="form-group">
                                        <label>CTA Button Text</label>
                                        <input type="text" value={heroData.ctaText} onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>CTA Button Link</label>
                                        <input type="text" value={heroData.ctaLink} onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })} placeholder="/courses or https://..." />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Background Image URL</label>
                                        <div className="url-input-group">
                                            <input type="text" value={heroData.backgroundImage} onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })} />
                                            <button className="secondary-btn small">Update</button>
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
                                .secondary-btn.small {
                                    padding: 8px 16px;
                                    font-size: 0.85rem;
                                    background: var(--deep-blue);
                                    color: #fff;
                                    border: none;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    transition: background 0.2s;
                                }
                                .secondary-btn.small:hover {
                                    background: #1e3a8a;
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

                    {/* ABOUT SECTION */}
                    {activeTab === 'about' && (
                        <div className="form-section">
                            <h3>About Section Details</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Section Title</label>
                                    <input type="text" value={aboutData.title} onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Subtitle</label>
                                    <input type="text" value={aboutData.subtitle} onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Our Story</label>
                                    <textarea rows="4" value={aboutData.story} onChange={(e) => setAboutData({ ...aboutData, story: e.target.value })}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Vision Statement</label>
                                    <textarea rows="3" value={aboutData.vision} onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Mission Statement</label>
                                    <textarea rows="3" value={aboutData.mission} onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STATS SECTION */}
                    {activeTab === 'stats' && (
                        <div className="form-section">
                            <h3>Impact Statistics</h3>
                            <div className="form-grid four-col">
                                <div className="form-group">
                                    <label>Students Trained</label>
                                    <input type="number" value={statsData.students} onChange={(e) => setStatsData({ ...statsData, students: parseInt(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label>Expert Faculty</label>
                                    <input type="number" value={statsData.faculty} onChange={(e) => setStatsData({ ...statsData, faculty: parseInt(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label>Years of Excellence</label>
                                    <input type="number" value={statsData.years} onChange={(e) => setStatsData({ ...statsData, years: parseInt(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label>Awards Won</label>
                                    <input type="number" value={statsData.awards} onChange={(e) => setStatsData({ ...statsData, awards: parseInt(e.target.value) })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FEATURES SECTION */}
                    {activeTab === 'features' && (
                        <div className="form-section">
                            <h3>What Makes Us Special</h3>
                            <div className="dynamic-list">
                                {featuresData.map(item => (
                                    <div key={item.id} className="list-item-card">
                                        <button className="remove-btn" onClick={() => removeItem(setFeaturesData, featuresData, item.id)}>
                                            <Trash2 size={14} /> Remove
                                        </button>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Icon (Emoji)</label>
                                                <input type="text" value={item.icon} onChange={(e) => updateItem(setFeaturesData, featuresData, item.id, 'icon', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Title</label>
                                                <input type="text" value={item.title} onChange={(e) => updateItem(setFeaturesData, featuresData, item.id, 'title', e.target.value)} />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Description</label>
                                                <input type="text" value={item.description} onChange={(e) => updateItem(setFeaturesData, featuresData, item.id, 'description', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addItem(setFeaturesData, featuresData, { icon: '✨', title: 'New Feature', description: 'Description here' })}>
                                    <Plus size={18} /> Add Feature
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VALUES SECTION */}
                    {activeTab === 'values' && (
                        <div className="form-section">
                            <h3>Our Core Values</h3>
                            <div className="dynamic-list">
                                {valuesData.map(item => (
                                    <div key={item.id} className="list-item-card">
                                        <button className="remove-btn" onClick={() => removeItem(setValuesData, valuesData, item.id)}>
                                            <Trash2 size={14} /> Remove
                                        </button>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Icon (Emoji)</label>
                                                <input type="text" value={item.icon} onChange={(e) => updateItem(setValuesData, valuesData, item.id, 'icon', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Title</label>
                                                <input type="text" value={item.title} onChange={(e) => updateItem(setValuesData, valuesData, item.id, 'title', e.target.value)} />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Description</label>
                                                <input type="text" value={item.description} onChange={(e) => updateItem(setValuesData, valuesData, item.id, 'description', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addItem(setValuesData, valuesData, { icon: '🌟', title: 'New Value', description: 'Description here' })}>
                                    <Plus size={18} /> Add Value
                                </button>
                            </div>
                        </div>
                    )}

                    {/* HIGHLIGHTS SECTION */}
                    {activeTab === 'highlights' && (
                        <div className="form-section">
                            <h3>Cultural Highlights</h3>
                            <div className="dynamic-list">
                                {highlightsData.map(item => (
                                    <div key={item.id} className="list-item-card">
                                        <button className="remove-btn" onClick={() => removeItem(setHighlightsData, highlightsData, item.id)}>
                                            <Trash2 size={14} /> Remove
                                        </button>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Event Title</label>
                                                <input type="text" value={item.title} onChange={(e) => updateItem(setHighlightsData, highlightsData, item.id, 'title', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Date</label>
                                                <input type="text" value={item.date} onChange={(e) => updateItem(setHighlightsData, highlightsData, item.id, 'date', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Location</label>
                                                <input type="text" value={item.location} onChange={(e) => updateItem(setHighlightsData, highlightsData, item.id, 'location', e.target.value)} />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Image URL</label>
                                                <input type="text" value={item.image} onChange={(e) => updateItem(setHighlightsData, highlightsData, item.id, 'image', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-btn" onClick={() => addItem(setHighlightsData, highlightsData, { title: 'New Event', date: 'Date', location: 'Location', image: '' })}>
                                    <Plus size={18} /> Add Highlight
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FOOTER SECTION */}
                    {activeTab === 'footer' && (
                        <div className="form-section">
                            <h3>Footer Information</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Address</label>
                                    <textarea rows="2" value={footerData.address} onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" value={footerData.phone} onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="text" value={footerData.email} onChange={(e) => setFooterData({ ...footerData, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Facebook URL</label>
                                    <input type="text" value={footerData.facebook} onChange={(e) => setFooterData({ ...footerData, facebook: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Instagram URL</label>
                                    <input type="text" value={footerData.instagram} onChange={(e) => setFooterData({ ...footerData, instagram: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>YouTube URL</label>
                                    <input type="text" value={footerData.youtube} onChange={(e) => setFooterData({ ...footerData, youtube: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeContent;
