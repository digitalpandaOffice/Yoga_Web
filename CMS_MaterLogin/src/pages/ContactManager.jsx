import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { endpoints } from '../config';

const ContactManager = () => {
    const [isSaving, setIsSaving] = useState(false);

    // Messages State
    const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'messages'
    const [messages, setMessages] = useState([]);

    // Global Settings (Phone, Email, Address, Office Hours)
    const [settings, setSettings] = useState({
        contact_phone: '',
        contact_phone_2: '',
        contact_email: '',
        contact_email_2: '',
        address_line1: '',
        address_line2: '',
        address_state_zip: '',
        office_hours: ''
    });

    // Page Specific Content (Hero, Map, Intro)
    const [pageContent, setPageContent] = useState({
        hero: { title: '', subtitle: '' },
        info_intro: '',
        map_url: ''
    });

    useEffect(() => {
        fetchSettings();
        fetchPageContent();
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch(endpoints.messagesList);
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
        } catch (err) { console.error(err); }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch(endpoints.settings);
            const data = await res.json();
            if (data) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (err) { console.error(err); }
    };

    const fetchPageContent = async () => {
        try {
            const res = await fetch(endpoints.contactContent);
            const data = await res.json();
            if (data) {
                setPageContent({
                    hero: {
                        title: data.hero?.title || '',
                        subtitle: data.hero?.subtitle || ''
                    },
                    info_intro: data.info_intro || '',
                    map_url: data.map_url || ''
                });
            }
        } catch (err) { console.error(err); }
    };

    const handleSettingsChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleContentChange = (field, value) => {
        setPageContent(prev => ({ ...prev, [field]: value }));
    };

    const handleHeroChange = (field, value) => {
        setPageContent(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // 1. Update Settings
            const settingsRes = await fetch(endpoints.settings, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            // 2. Update Page Content
            const contentRes = await fetch(`${endpoints.updateContent}?page=contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageContent)
            });

            if (settingsRes.ok && contentRes.ok) {
                alert('Contact page updated successfully!');
            } else {
                alert('Some updates failed.');
            }
        } catch (err) {
            alert('Network error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const res = await fetch(`${endpoints.messagesDelete}?id=${id}`, { method: 'POST' });
            if (res.ok) {
                setMessages(messages.filter(m => m.id !== id));
            } else {
                alert("Failed to delete message");
            }
        } catch (err) { console.error(err); }
    };

    const handleMarkRead = async (id) => {
        try {
            await fetch(`${endpoints.messagesMarkRead}?id=${id}`, { method: 'POST' });
            setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: 1 } : m));
        } catch (err) { console.error(err); }
    };

    const MessageItem = ({ msg, onDelete, onRead }) => {
        const [expanded, setExpanded] = useState(false);

        const toggleExpand = () => {
            const newExpanded = !expanded;
            setExpanded(newExpanded);
            if (newExpanded && !msg.is_read) {
                onRead(msg.id);
            }
        };

        return (
            <div style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '20px',
                background: msg.is_read ? 'white' : '#f0f7ff',
                borderLeft: msg.is_read ? '1px solid #eee' : '4px solid #007bff'
            }}>
                <div
                    onClick={toggleExpand}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: expanded ? '15px' : '0',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h4 style={{ margin: 0, fontWeight: msg.is_read ? '600' : '700' }}>{msg.subject}</h4>
                            {!msg.is_read && <span style={{ fontSize: '0.7rem', background: '#007bff', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>New</span>}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                            From: <strong>{msg.name}</strong> ({msg.email})
                            <span style={{ marginLeft: '10px', color: '#999' }}>{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {expanded && (
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333' }}>
                            {msg.message}
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(msg.id); }}
                                style={{ color: '#dc3545', background: 'none', border: '1px solid #dc3545', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                                Delete Message
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Contact Page Management</h1>
                    <p>Manage contact details, page content, and view inquiries.</p>
                </div>
            </div>

            <div className="tabs" style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #ddd' }}>
                <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'settings' ? '2px solid #007bff' : 'none',
                        color: activeTab === 'settings' ? '#007bff' : '#666',
                        fontWeight: activeTab === 'settings' ? '600' : '400',
                        cursor: 'pointer'
                    }}
                >
                    Settings & Content
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'messages' ? '2px solid #007bff' : 'none',
                        color: activeTab === 'messages' ? '#007bff' : '#666',
                        fontWeight: activeTab === 'messages' ? '600' : '400',
                        cursor: 'pointer'
                    }}
                >
                    Inquiries ({messages.length})
                </button>
            </div>

            {activeTab === 'settings' ? (
                <form onSubmit={handleSubmit} className="form-section">

                    {/* SECTION 1: GLOBAL CONTACT INFO */}
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Contact Information</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>These details may be used across the website (Header, Footer, Contact Page).</p>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Primary Phone</label>
                                <input type="text" name="contact_phone" value={settings.contact_phone} onChange={handleSettingsChange} />
                            </div>
                            <div className="form-group">
                                <label>Secondary Phone</label>
                                <input type="text" name="contact_phone_2" value={settings.contact_phone_2} onChange={handleSettingsChange} />
                            </div>
                            <div className="form-group">
                                <label>Primary Email</label>
                                <input type="text" name="contact_email" value={settings.contact_email} onChange={handleSettingsChange} />
                            </div>
                            <div className="form-group">
                                <label>Secondary Email</label>
                                <input type="text" name="contact_email_2" value={settings.contact_email_2} onChange={handleSettingsChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Address Line 1</label>
                                <input type="text" name="address_line1" value={settings.address_line1} onChange={handleSettingsChange} />
                            </div>
                            <div className="form-group">
                                <label>Address Line 2 (City, Area)</label>
                                <input type="text" name="address_line2" value={settings.address_line2} onChange={handleSettingsChange} />
                            </div>
                            <div className="form-group">
                                <label>State, Zip</label>
                                <input type="text" name="address_state_zip" value={settings.address_state_zip} onChange={handleSettingsChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Office Hours</label>
                                <textarea rows="2" name="office_hours" value={settings.office_hours} onChange={handleSettingsChange} placeholder="e.g. Mon - Sat: 9:00 AM - 5:00 PM"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: PAGE CONTENT */}
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Page Content</h3>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Hero Title</label>
                                <input type="text" value={pageContent.hero.title} onChange={e => handleHeroChange('title', e.target.value)} />
                            </div>
                            <div className="form-group full-width">
                                <label>Hero Subtitle</label>
                                <textarea rows="2" value={pageContent.hero.subtitle} onChange={e => handleHeroChange('subtitle', e.target.value)}></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>Intro Text</label>
                                <input type="text" value={pageContent.info_intro} onChange={e => handleContentChange('info_intro', e.target.value)} />
                            </div>
                            <div className="form-group full-width">
                                <label>Google Map Embed URL</label>
                                <textarea rows="3" value={pageContent.map_url} onChange={e => handleContentChange('map_url', e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}></textarea>
                                <small style={{ color: '#666' }}>Paste the 'src' attribute from Google Maps Embed HTML.</small>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={isSaving}>
                            <Save size={18} style={{ marginRight: '8px' }} />
                            {isSaving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="messages-list" style={{ display: 'grid', gap: '20px' }}>
                    {messages.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No inquiries received yet.</p>
                    ) : (
                        messages.map(msg => (
                            <MessageItem key={msg.id} msg={msg} onDelete={handleDeleteMessage} onRead={handleMarkRead} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactManager;
