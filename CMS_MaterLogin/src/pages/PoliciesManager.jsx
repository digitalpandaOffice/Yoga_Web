import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { endpoints } from '../config';

const PoliciesManager = () => {
    const [policies, setPolicies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await fetch(endpoints.policiesList);
            const data = await res.json();
            if (Array.isArray(data)) setPolicies(data);
        } catch (err) { console.error(err); }
    };

    const resetForm = () => {
        setFormData({ title: '', content: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (policy) => {
        setFormData({
            title: policy.title,
            content: policy.content
        });
        setEditingId(policy.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const url = editingId ? `${endpoints.policiesUpdate}?id=${editingId}` : endpoints.policiesCreate;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert(editingId ? 'Policy Updated!' : 'Policy Created!');
                fetchPolicies();
                resetForm();
            } else {
                const err = await res.json();
                alert('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (err) { alert('Network error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this policy?')) return;
        try {
            await fetch(`${endpoints.policiesDelete}?id=${id}`, { method: 'POST' });
            fetchPolicies();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Policies Management</h1>
                    <p>Manage institutional policies like Privacy, Terms, and Conduct.</p>
                </div>
            </div>

            {!showForm ? (
                <div>
                    <button className="add-btn" onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
                        <Plus size={18} /> Add New Policy
                    </button>

                    <div className="dynamic-list" style={{ display: 'grid', gap: '20px' }}>
                        {policies.map(policy => (
                            <div key={policy.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', background: '#fff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0 }}>{policy.title}</h3>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button className="icon-btn edit" onClick={() => handleEdit(policy)} style={{ color: '#007bff' }}><Edit size={18} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(policy.id)} style={{ color: '#dc3545' }}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666', maxHeight: '100px', overflow: 'hidden', borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
                                    {/* Strip HTML tags for preview */}
                                    {policy.content.replace(/<[^>]*>?/gm, '').substring(0, 200)}...
                                </div>
                            </div>
                        ))}
                        {policies.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No policies found.</p>}
                    </div>
                </div>
            ) : (
                <div className="form-section">
                    <h3>{editingId ? 'Edit Policy' : 'New Policy'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Policy Title</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Privacy Policy" />
                            </div>

                            <div className="form-group full-width">
                                <label>Content (HTML Supported)</label>
                                <textarea
                                    rows="15"
                                    required
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="<p>Enter policy content here...</p>"
                                    style={{ fontFamily: 'monospace' }}
                                ></textarea>
                                <small style={{ color: '#666' }}>You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;.</small>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                            <button type="submit" className="save-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Policy'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PoliciesManager;
