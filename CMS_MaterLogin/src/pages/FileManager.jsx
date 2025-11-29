import React, { useState, useEffect, useRef } from 'react';
import { Folder, File, Image, Upload, Trash2, Search, Filter, MoreVertical, Copy, Check } from 'lucide-react';
import { endpoints } from '../config';

const FileManager = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.mediaList);
            const data = await response.json();
            if (Array.isArray(data)) {
                setFiles(data);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
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
                // Add new file to list
                setFiles([data.file, ...files]);
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed due to network error');
        } finally {
            setIsUploading(false);
            event.target.value = null; // Reset input
        }
    };

    const handleDelete = async (file) => {
        if (!window.confirm(`Are you sure you want to delete "${file.name}"?`)) return;

        try {
            const response = await fetch(endpoints.mediaDelete, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename: file.name })
            });

            if (response.ok) {
                setFiles(files.filter(f => f.id !== file.id));
            } else {
                const data = await response.json();
                alert(data.error || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Delete failed due to network error');
        }
    };

    const handleCopyLink = (file) => {
        navigator.clipboard.writeText(file.url).then(() => {
            setCopiedId(file.id);
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy link');
        });
    };

    const filteredFiles = files.filter(file => {
        const matchesFilter = activeFilter === 'all' || file.type === activeFilter;
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="content-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>File Manager</h1>
                    <p>Manage your uploaded assets and documents.</p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button
                    className="save-btn"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                >
                    <Upload size={18} />
                    {isUploading ? 'Uploading...' : 'Upload File'}
                </button>
            </div>

            <div className="file-manager-controls">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Files
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'image' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('image')}
                    >
                        Images
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'document' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('document')}
                    >
                        Documents
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading files...</div>
            ) : (
                <div className="files-grid">
                    {filteredFiles.map(file => (
                        <div key={file.id} className="file-card">
                            <div className="file-preview">
                                {file.type === 'image' ? (
                                    <img src={file.url} alt={file.name} />
                                ) : (
                                    <div className="doc-icon">
                                        <File size={48} />
                                    </div>
                                )}
                                <div className="file-actions">
                                    <button
                                        className="icon-btn copy"
                                        onClick={() => handleCopyLink(file)}
                                        title="Copy Link"
                                    >
                                        {copiedId === file.id ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                    <button
                                        className="icon-btn delete"
                                        onClick={() => handleDelete(file)}
                                        title="Delete File"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="file-info">
                                <div className="file-icon">
                                    {file.type === 'image' ? <Image size={16} /> : <File size={16} />}
                                </div>
                                <div className="file-details">
                                    <span className="file-name" title={file.name}>{file.name}</span>
                                    <span className="file-meta">{file.size} • {file.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredFiles.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999' }}>
                            No files found. Upload one to get started.
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .file-manager-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    background: #fff;
                    padding: 15px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .search-bar {
                    position: relative;
                    width: 300px;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                }

                .search-bar input {
                    width: 100%;
                    padding: 10px 10px 10px 40px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    font-size: 0.9rem;
                }

                .filter-tabs {
                    display: flex;
                    gap: 10px;
                }

                .filter-tab {
                    padding: 8px 16px;
                    border: 1px solid #eee;
                    background: transparent;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    color: #666;
                    transition: all 0.2s;
                }

                .filter-tab:hover {
                    background: #f5f5f5;
                }

                .filter-tab.active {
                    background: var(--deep-blue);
                    color: #fff;
                    border-color: var(--deep-blue);
                }

                .files-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }

                .file-card {
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transition: transform 0.2s;
                }

                .file-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }

                .file-preview {
                    height: 150px;
                    background: #f9f9f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .file-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .doc-icon {
                    color: var(--deep-blue);
                    opacity: 0.5;
                }

                .file-actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    opacity: 0;
                    transition: opacity 0.2s;
                    display: flex;
                    gap: 8px;
                }

                .file-card:hover .file-actions {
                    opacity: 1;
                }

                .icon-btn {
                    background: #fff;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                }

                .icon-btn:hover {
                    transform: scale(1.1);
                }

                .icon-btn.delete {
                    color: var(--error);
                }

                .icon-btn.delete:hover {
                    background: var(--error);
                    color: #fff;
                }

                .icon-btn.copy {
                    color: var(--deep-blue);
                }

                .icon-btn.copy:hover {
                    background: var(--deep-blue);
                    color: #fff;
                }

                .file-info {
                    padding: 15px;
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                }

                .file-icon {
                    color: var(--deep-blue);
                    margin-top: 2px;
                }

                .file-details {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .file-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-dark);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .file-meta {
                    font-size: 0.75rem;
                    color: #999;
                    margin-top: 2px;
                }
            `}</style>
        </div>
    );
};

export default FileManager;
