import React from 'react';
import { Users, BookOpen, Calendar, Award } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>
            <Icon size={24} />
        </div>
        <div className="stat-info">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    </div>
);

const DashboardHome = () => {
    return (
        <div className="dashboard-home">
            <div className="stats-grid">
                <StatCard icon={Users} label="Total Students" value="5,234" color="#184a55" />
                <StatCard icon={BookOpen} label="Active Courses" value="12" color="#d27f20" />
                <StatCard icon={Calendar} label="Upcoming Events" value="3" color="#c45a38" />
                <StatCard icon={Award} label="Certifications" value="156" color="#2ecc71" />
            </div>

            <div className="dashboard-sections">
                <div className="recent-activity">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <span className="activity-dot"></span>
                            <div className="activity-content">
                                <p><strong>New Student Registration</strong>: Rahul Sharma enrolled in Fine Arts.</p>
                                <span className="activity-time">2 hours ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot"></span>
                            <div className="activity-content">
                                <p><strong>Event Updated</strong>: Annual Dance Festival details modified.</p>
                                <span className="activity-time">5 hours ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot"></span>
                            <div className="activity-content">
                                <p><strong>New Inquiry</strong>: Message from Priya regarding Music Diploma.</p>
                                <span className="activity-time">1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                        <button className="action-btn">Add New Event</button>
                        <button className="action-btn">Update Course Syllabus</button>
                        <button className="action-btn">View New Applications</button>
                        <button className="action-btn">Manage Gallery</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
