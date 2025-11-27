import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    GraduationCap,
    Calendar,
    Image,
    Briefcase,
    FileText,
    Users,
    MoreHorizontal,
    LogOut,
    Menu,
    X,
    Folder,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import logo from '../assets/images/AdvayuLogo.png';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real app, clear auth tokens here
        navigate('/');
    };

    const toggleSection = (label) => {
        setExpandedSections(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Home, label: 'Home Page', path: '/dashboard/home-content' },
        {
            icon: GraduationCap,
            label: 'Student Area',
            path: '/dashboard/student-area',
            subItems: [
                { label: 'Admissions', path: '/dashboard/student-area/admissions' },
                { label: 'Syllabus', path: '/dashboard/student-area/syllabus' },
                { label: 'Results', path: '/dashboard/student-area/results' },
                { label: 'Resources', path: '/dashboard/student-area/resources' },
            ]
        },
        {
            icon: Users,
            label: 'Teacher Area',
            path: '/dashboard/teacher-area',
            subItems: [
                { label: 'Login', path: '/dashboard/teacher-area/login' },
                { label: 'Curriculum', path: '/dashboard/teacher-area/curriculum' },
                { label: 'Training', path: '/dashboard/teacher-area/training' },
                { label: 'Resources', path: '/dashboard/teacher-area/resources' },
            ]
        },
        {
            icon: FileText,
            label: 'Diploma Exam',
            path: '/dashboard/diploma-exam',
            subItems: [
                { label: 'Exam Dates', path: '/dashboard/diploma-exam/dates' },
                { label: 'Eligibility', path: '/dashboard/diploma-exam/eligibility' },
                { label: 'Syllabus', path: '/dashboard/diploma-exam/syllabus' },
                { label: 'Applications', path: '/dashboard/diploma-exam/applications' },
            ]
        },
        {
            icon: Briefcase,
            label: 'Franchise',
            path: '/dashboard/franchise',
            subItems: [
                { label: 'Manage Franchise', path: '/dashboard/franchise/managefranchise' },
                { label: 'Benefits', path: '/dashboard/franchise/benefits' },
                { label: 'Process', path: '/dashboard/franchise/process' },
                { label: 'FAQs', path: '/dashboard/franchise/faqs' },
            ]
        },
        { icon: Image, label: 'Gallery', path: '/dashboard/gallery' },
        { icon: Calendar, label: 'Events', path: '/dashboard/events' },
        { icon: Folder, label: 'File Manager', path: '/dashboard/file-manager' },
        {
            icon: MoreHorizontal,
            label: 'Other',
            path: '/dashboard/other',
            subItems: [
                { label: 'Policies', path: '/dashboard/other/policies' },
                { label: 'Alumni', path: '/dashboard/other/alumni' },
                { label: 'Careers', path: '/dashboard/other/careers' },
                { label: 'Contact', path: '/dashboard/other/contact' },
            ]
        },
    ];

    const renderNavItem = (item) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedSections[item.label];
        const isActive = location.pathname === item.path || (hasSubItems && location.pathname.startsWith(item.path));

        return (
            <div key={item.label} className="nav-item-wrapper">
                <div
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                        if (hasSubItems) {
                            toggleSection(item.label);
                        } else {
                            navigate(item.path);
                            setIsSidebarOpen(false);
                        }
                    }}
                >
                    <div className="nav-item-content">
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </div>
                    {hasSubItems && (
                        <span className="nav-chevron">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                    )}
                </div>

                {hasSubItems && isExpanded && (
                    <div className="sub-nav">
                        {item.subItems.map((subItem) => (
                            <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`sub-nav-item ${location.pathname === subItem.path ? 'active' : ''}`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {subItem.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {/* Mobile Header */}
            <header className="mobile-header">
                <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <img src={logo} alt="Logo" className="header-logo" />
            </header>

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                    <div className="sidebar-title">
                        <h2>CMS Portal</h2>
                        <span>Edvayu Foundations</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(renderNavItem)}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <h2 className="page-title">
                        {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
                    </h2>
                    <div className="user-profile">
                        <div className="avatar">A</div>
                        <div className="user-info">
                            <span className="name">Admin User</span>
                            <span className="role">Administrator</span>
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    <Outlet />
                </div>
            </main>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default DashboardLayout;
