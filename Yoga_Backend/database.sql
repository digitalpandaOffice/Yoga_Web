-- Database: edvayu_db

CREATE DATABASE IF NOT EXISTS edvayu_db;
USE edvayu_db;

-- ==========================================
-- 1. AUTHENTICATION & USERS
-- ==========================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'editor') DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. CORE ENTITIES (Existing)
-- ==========================================
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category ENUM('art', 'dance', 'music', 'theatre') NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    duration VARCHAR(50),
    mode VARCHAR(50),
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    location VARCHAR(100),
    description TEXT,
    image_url VARCHAR(255),
    type ENUM('festival', 'workshop', 'exhibition', 'other') DEFAULT 'other',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    message TEXT,
    type ENUM('new', 'update', 'alert') DEFAULT 'new',
    posted_date DATE DEFAULT (CURRENT_DATE),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    category VARCHAR(50),
    image_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS franchise_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(50),
    message TEXT,
    status ENUM('pending', 'reviewed', 'contacted', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_no VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    course_id INT,
    dob DATE,
    email VARCHAR(100),
    phone VARCHAR(20),
    status ENUM('active', 'graduated', 'dropped') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- ==========================================
-- 3. GLOBAL SETTINGS & PAGE CONTENT (New)
-- ==========================================

-- Stores global values like Site Title, Contact Phone, Address, Social Links
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'contact_email', 'facebook_url'
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores specific text blocks for pages (e.g., Home Hero Title, About Us Text)
CREATE TABLE IF NOT EXISTS page_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_slug VARCHAR(50) NOT NULL, -- e.g., 'home', 'about', 'contact'
    section_key VARCHAR(50) NOT NULL, -- e.g., 'hero_title', 'mission_text'
    content_value TEXT,
    image_url VARCHAR(255), -- Optional, if the section has a specific image
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_section (page_slug, section_key)
);

-- ==========================================
-- 4. SPECIFIC DYNAMIC PAGES (New)
-- ==========================================

CREATE TABLE IF NOT EXISTS alumni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    batch_year VARCHAR(20),
    achievement TEXT,
    image_url VARCHAR(255),
    testimonial TEXT,
    is_featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    job_type ENUM('full_time', 'part_time', 'contract') DEFAULT 'full_time',
    description TEXT,
    application_link VARCHAR(255), -- Or email to send CV
    posted_date DATE DEFAULT (CURRENT_DATE),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL, -- HTML content for the policy
    last_updated DATE DEFAULT (CURRENT_DATE)
);

-- Covers Syllabus, Student Resources, Teacher Resources
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category ENUM('syllabus', 'student_resource', 'teacher_resource', 'teacher_curriculum') NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_title VARCHAR(150) NOT NULL, -- e.g., "Diploma Exam 2024"
    exam_date DATE,
    file_url VARCHAR(255) NOT NULL, -- PDF of results
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. DEFAULT DATA (Seed)
-- ==========================================

-- Default Admin
INSERT IGNORE INTO admins (username, password, role) VALUES 
('admin', '$2y$10$8WkQ.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q', 'super_admin');

-- Default Site Settings
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES 
('site_title', 'Edvayu Educational Foundations'),
('contact_phone', '+91 98765 43210'),
('contact_email', 'contact@niac.edu.in'),
('address', 'Morigaon 782105, Assam, India');
