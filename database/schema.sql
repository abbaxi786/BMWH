-- ============================================================
-- BMWH HOSPITAL
-- PostgreSQL Database Schema
--
-- Based on the current Neon database structure.
--
-- Safe for a new/empty database.
-- ============================================================


-- ============================================================
-- 1. DEPARTMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    slug VARCHAR NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. DEPARTMENT SERVICES
-- ============================================================

CREATE TABLE IF NOT EXISTS department_services (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_service_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. DIAGNOSTIC SERVICES
-- ============================================================

CREATE TABLE IF NOT EXISTS diagnostic_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. DOCTORS
-- ============================================================

CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    doctor_type VARCHAR,
    designation VARCHAR,
    specialty VARCHAR,
    qualifications TEXT,
    biography TEXT,
    expertise TEXT,
    photo_url TEXT,
    profile_link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_doctor_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 5. DOCTOR SCHEDULES
-- ============================================================

CREATE TABLE IF NOT EXISTS doctor_schedules (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    day_of_week VARCHAR NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR,
    is_available BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_schedule_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 6. EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR,
    cover_image_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 7. EVENT GUESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS event_guests (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    designation VARCHAR,
    organization VARCHAR,
    photo_url TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT event_guests_event_id_fkey
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 8. EVENT GALLERY
-- ============================================================

CREATE TABLE IF NOT EXISTS event_gallery (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    title VARCHAR,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT event_gallery_event_id_fkey
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 9. HEALTH PARTNERS
-- ============================================================

CREATE TABLE IF NOT EXISTS health_partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR,
    partnership_type VARCHAR,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 10. HOSPITAL FACILITIES
-- ============================================================

CREATE TABLE IF NOT EXISTS hospital_facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    category VARCHAR,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 11. NEWS / UPDATES
-- ============================================================

CREATE TABLE IF NOT EXISTS news_updates (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    slug VARCHAR NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    category VARCHAR,
    author_name VARCHAR,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMP,
    meta_title VARCHAR,
    meta_description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 12. SUCCESS STORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS success_stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    summary TEXT,
    content TEXT,
    image_url TEXT,
    patient_name VARCHAR,
    patient_age INTEGER,
    category VARCHAR,
    story_date DATE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 13. SUPPORTERS
-- ============================================================

CREATE TABLE IF NOT EXISTS supporters (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR,
    support_type VARCHAR,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 14. ACHIEVEMENTS & AWARDS
-- ============================================================

CREATE TABLE IF NOT EXISTS achievements_awards (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    description TEXT,
    image_url TEXT,
    award_date DATE,
    issuing_organization VARCHAR,
    website_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- EXISTING INDEXES
--
-- These are the indexes confirmed to exist in the Neon DB.
-- PostgreSQL automatically creates these through PRIMARY KEY
-- and UNIQUE constraints, so they do not need to be created
-- separately.
-- ============================================================

-- Primary key indexes are automatically created by PostgreSQL:
--
-- achievements_awards_pkey
-- department_services_pkey
-- departments_pkey
-- diagnostic_services_pkey
-- doctor_schedules_pkey
-- doctors_pkey
-- event_gallery_pkey
-- event_guests_pkey
-- events_pkey
-- health_partners_pkey
-- hospital_facilities_pkey
-- news_updates_pkey
-- success_stories_pkey
-- supporters_pkey
--
-- Unique indexes are automatically created by:
--
-- departments.slug UNIQUE
-- news_updates.slug UNIQUE


-- ============================================================
-- END OF BMWH DATABASE SCHEMA
-- ============================================================

