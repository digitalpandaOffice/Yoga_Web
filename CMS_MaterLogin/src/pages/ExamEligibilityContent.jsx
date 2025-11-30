import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { endpoints } from '../config';

const ExamEligibilityContent = () => {
    const [content, setContent] = useState({
        hero: { title: '', subtitle: '' },
        intro: { title: '', description: '' },
        criteria_cards: [],
        general_rules: []
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch(endpoints.examEligibilityContent);
            const data = await res.json();
            if (data) {
                // Ensure arrays exist and merge defaults
                setContent({
                    hero: { title: '', subtitle: '', ...data.hero },
                    intro: { title: '', description: '', ...data.intro },
                    criteria_cards: data.criteria_cards || [],
                    general_rules: data.general_rules || []
                });
            }
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`${endpoints.updateContent}?page=exam-eligibility`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });
            if (res.ok) alert('Content updated successfully!');
            else alert('Failed to update content.');
        } catch (err) { alert('Network error'); }
        finally { setIsSaving(false); }
    };

    // Helper to update nested state
    const updateSection = (section, field, value) => {
        setContent(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    // Criteria Cards Helpers
    const addCard = () => {
        setContent(prev => ({
            ...prev,
            criteria_cards: [...prev.criteria_cards, { icon: '📝', title: '', items: [] }]
        }));
    };

    const removeCard = (index) => {
        const newCards = [...content.criteria_cards];
        newCards.splice(index, 1);
        setContent(prev => ({ ...prev, criteria_cards: newCards }));
    };

    const updateCard = (index, field, value) => {
        const newCards = [...content.criteria_cards];
        newCards[index][field] = value;
        setContent(prev => ({ ...prev, criteria_cards: newCards }));
    };

    const updateCardItems = (index, value) => {
        // Value is a string from textarea, split by newline
        const items = value.split('\n');
        updateCard(index, 'items', items);
    };

    // General Rules Helpers
    const updateRules = (value) => {
        const rules = value.split('\n');
        setContent(prev => ({ ...prev, general_rules: rules }));
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Exam Eligibility Content</h1>
                    <p>Manage criteria and rules for examinations.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="form-section">
                {/* Hero */}
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>Hero Section</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={content.hero.title} onChange={e => updateSection('hero', 'title', e.target.value)} />
                        </div>
                        <div className="form-group full-width">
                            <label>Subtitle</label>
                            <textarea rows="2" value={content.hero.subtitle} onChange={e => updateSection('hero', 'subtitle', e.target.value)}></textarea>
                        </div>
                    </div>
                </div>

                {/* Intro */}
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>Intro Section</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={content.intro.title} onChange={e => updateSection('intro', 'title', e.target.value)} />
                        </div>
                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea rows="2" value={content.intro.description} onChange={e => updateSection('intro', 'description', e.target.value)}></textarea>
                        </div>
                    </div>
                </div>

                {/* Criteria Cards */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px', flex: 1 }}>Eligibility Criteria Cards</h4>
                        <button type="button" className="add-btn small" onClick={addCard}><Plus size={14} /> Add Card</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {content.criteria_cards.map((card, index) => (
                            <div key={index} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', background: '#fafafa' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="button" className="icon-btn delete" onClick={() => removeCard(index)}><Trash2 size={16} /></button>
                                </div>
                                <div className="form-group">
                                    <label>Icon (Emoji)</label>
                                    <input type="text" value={card.icon} onChange={e => updateCard(index, 'icon', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input type="text" value={card.title} onChange={e => updateCard(index, 'title', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Requirements (One per line)</label>
                                    <textarea rows="5" value={card.items.join('\n')} onChange={e => updateCardItems(index, e.target.value)}></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* General Rules */}
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>General Rules & Regulations</h4>
                    <div className="form-group full-width">
                        <label>Rules List (One per line)</label>
                        <textarea rows="8" value={content.general_rules.join('\n')} onChange={e => updateRules(e.target.value)}></textarea>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={isSaving}>
                        <Save size={18} style={{ marginRight: '5px' }} /> {isSaving ? 'Saving...' : 'Save Content'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExamEligibilityContent;
