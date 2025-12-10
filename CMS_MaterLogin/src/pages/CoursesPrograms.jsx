import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, Image, Tag, BookOpen, Clock, Layers, Loader2 } from 'lucide-react';
import { endpoints } from '../config';
import './CoursesPrograms.css';

const CoursesPrograms = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Form state for new/editing course
    const [formData, setFormData] = useState({
        title: '',
        category: 'art',
        level: 'beginner',
        duration: '',
        mode: '',
        description: '',
        details: '',
        image: '',
        tags: ''
    });

    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.content); // Fetches home content
            const data = await response.json();
            if (data && data.courses) {
                setCourses(data.courses);
            }
        } catch (err) {
            console.error("Failed to fetch courses:", err);
            setError("Failed to load courses.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (updatedCourses) => {
        setIsSaving(true);
        setError('');
        setShowSuccess(false);

        // We need to fetch existing content first to preserve other sections
        try {
            const response = await fetch(endpoints.content);
            const currentData = await response.json();

            const payload = {
                ...currentData,
                courses: updatedCourses
            };

            const saveResponse = await fetch(endpoints.updateContent, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (saveResponse.ok) {
                setShowSuccess(true);
                setCourses(updatedCourses);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                throw new Error('Failed to save');
            }
        } catch (err) {
            console.error("Error saving courses:", err);
            setError("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const MAX_COURSES = 11;

    const openForm = (course = null) => {
        if (!course && courses.length >= MAX_COURSES) {
            alert(`You can only add up to ${MAX_COURSES} courses.`);
            return;
        }

        if (course) {
            setEditingId(course.id);
            setFormData({
                ...course,
                tags: Array.isArray(course.tags) ? course.tags.join(', ') : course.tags // Convert array to string for input
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                category: 'art',
                level: 'beginner',
                duration: '',
                mode: '',
                description: '',
                details: '',
                image: '',
                tags: ''
            });
        }
        setIsFormOpen(true);
        // Scroll to form only if needed, or keeping it strictly below as requested
        setTimeout(() => {
            const formElement = document.querySelector('.cp-form-container');
            if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Process tags
        const processedTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        if (!editingId && courses.length >= MAX_COURSES) {
            setError(`Maximum of ${MAX_COURSES} courses allowed.`);
            return;
        }

        const newCourse = {
            ...formData,
            id: editingId || Date.now(),
            tags: processedTags
        };

        let updatedCourses;
        if (editingId) {
            updatedCourses = courses.map(c => c.id === editingId ? newCourse : c);
        } else {
            updatedCourses = [...courses, newCourse];
        }

        handleSave(updatedCourses);
        closeForm();
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            const updatedCourses = courses.filter(c => c.id !== id);
            handleSave(updatedCourses);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="courses-container">
            {/* Top Toolbar */}
            <div className="cp-toolbar">
                <div className="cp-header">
                    <h1>
                        <BookOpen size={24} />
                        Courses & Programs
                    </h1>
                    <p>Manage featured courses displayed on the homepage. <span style={{ fontWeight: 600, color: courses.length >= MAX_COURSES ? '#dc2626' : '#059669' }}>({courses.length}/{MAX_COURSES})</span></p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => openForm()}
                        className="btn-add-course"
                        disabled={courses.length >= MAX_COURSES}
                        style={{ opacity: courses.length >= MAX_COURSES ? 0.5 : 1, cursor: courses.length >= MAX_COURSES ? 'not-allowed' : 'pointer' }}
                        title={courses.length >= MAX_COURSES ? "Maximum limit reached" : "Add New Course"}
                    >
                        <Plus size={18} /> Add New Course
                    </button>
                )}
            </div>

            {error && (
                <div className="cp-error">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            {showSuccess && (
                <div className="cp-success">
                    <Save size={18} /> Changes saved successfully!
                </div>
            )}

            {/* Courses Grid */}
            <div className="cp-grid">
                {courses.length === 0 ? (
                    <div className="cp-col-full cp-empty-state">
                        <div className="cp-empty-icon">
                            <BookOpen size={32} />
                        </div>
                        <h3>No courses available</h3>
                        <p>Get started by adding your first course program to display on the homepage.</p>
                        <button
                            onClick={() => openForm()}
                            className="btn-empty-add"
                        >
                            <Plus size={16} /> Add Course
                        </button>
                    </div>
                ) : (
                    courses.map(course => (
                        <div key={course.id} className="course-card-cms group">
                            <div className="cc-image-wrapper">
                                <img
                                    src={course.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                                    alt={course.title}
                                />
                                <div className="cc-badges">
                                    <span className={`badge-level ${course.level}`}>
                                        {course.level}
                                    </span>
                                </div>
                                <div className="cc-actions">
                                    <button
                                        onClick={() => openForm(course)}
                                        className="btn-icon-action edit"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="btn-icon-action delete"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="cc-content">
                                <div>
                                    <span className="cc-category">
                                        {course.category}
                                    </span>
                                </div>

                                <h3 className="cc-title">
                                    {course.title}
                                </h3>

                                <div className="cc-meta">
                                    <span><Clock size={14} /> {course.duration}</span>
                                    <span><Layers size={14} /> {course.mode}</span>
                                </div>

                                <p className="cc-desc">
                                    {course.description}
                                </p>

                                <div className="cc-tags">
                                    {Array.isArray(course.tags) && course.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="cc-tag">
                                            #{tag}
                                        </span>
                                    ))}
                                    {Array.isArray(course.tags) && course.tags.length > 3 && (
                                        <span className="cc-tag-more">+{course.tags.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Editor Form - Moved Below Grid */}
            {isFormOpen && (
                <div className="cp-form-container" style={{ marginTop: '40px', borderTop: '4px solid #10b981' }}>
                    <div className="cp-form-header">
                        <h2>
                            {editingId ? <Edit2 size={20} className="text-blue-500" /> : <Plus size={20} className="text-emerald-500" />}
                            {editingId ? 'Edit Course' : 'Create New Course'}
                        </h2>
                        <button onClick={closeForm} className="btn-close">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="cp-form-grid">
                        <div className="cp-input-group cp-col-full">
                            <label>Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Diploma in Fine Arts"
                                required
                            />
                        </div>

                        <div className="cp-input-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="art">Fine Arts</option>
                                <option value="dance">Dance</option>
                                <option value="music">Music</option>
                                <option value="theatre">Theatre</option>
                            </select>
                        </div>

                        <div className="cp-input-group">
                            <label>Level</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleInputChange}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="cp-input-group">
                            <label>Duration <span className="helper-text">(e.g. 6 Months)</span></label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="6 months"
                                required
                            />
                        </div>

                        <div className="cp-input-group">
                            <label>Mode <span className="helper-text">(e.g. Online/Offline)</span></label>
                            <input
                                type="text"
                                name="mode"
                                value={formData.mode}
                                onChange={handleInputChange}
                                placeholder="Offline/Online"
                            />
                        </div>

                        <div className="cp-input-group cp-col-full">
                            <label>Short Description <span className="helper-text">(Card preview)</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="2"
                                placeholder="Brief overview of the course..."
                            ></textarea>
                        </div>

                        <div className="cp-input-group cp-col-full">
                            <label>Detailed Description <span className="helper-text">(For modal view)</span></label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Detailed curriculum information..."
                            ></textarea>
                        </div>

                        <div className="cp-input-group cp-col-full">
                            <label>Cover Image URL</label>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="helper-text" style={{ marginTop: '5px' }}>Recommended size: 800x600px</p>
                                </div>
                                {formData.image && (
                                    <div className="img-preview">
                                        <img src={formData.image} alt="Preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="cp-input-group cp-col-full">
                            <label>Tags <span className="helper-text">(Comma separated)</span></label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Sketching, Painting, Color Theory"
                                    style={{ paddingLeft: '16px' }}
                                />
                                <Tag size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                            </div>
                        </div>

                        <div className="cp-form-actions cp-col-full">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn-save"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {editingId ? 'Update Course' : 'Save Course'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CoursesPrograms;
