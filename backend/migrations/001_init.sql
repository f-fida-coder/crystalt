-- Crystal Tech — initial schema.
-- Run once on your cPanel MySQL database (phpMyAdmin → Import → this file).
-- Safe to re-run: every table uses CREATE TABLE IF NOT EXISTS.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(254) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(120) NOT NULL,
    role            ENUM('client','admin') NOT NULL DEFAULT 'client',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    email       VARCHAR(254) NOT NULL,
    phone       VARCHAR(40)  DEFAULT NULL,
    subject     VARCHAR(200) NOT NULL,
    message     TEXT NOT NULL,
    status      ENUM('new','read','replied','archived') NOT NULL DEFAULT 'new',
    ip          VARCHAR(45) DEFAULT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_contact_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    author_name  VARCHAR(80)  NOT NULL,
    author_role  VARCHAR(120) DEFAULT NULL,
    service      VARCHAR(80)  DEFAULT NULL,
    rating       TINYINT UNSIGNED NOT NULL,
    content      VARCHAR(1500) NOT NULL,
    approved     TINYINT(1) NOT NULL DEFAULT 0,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_reviews_approved_created (approved, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       INT UNSIGNED NOT NULL,
    title         VARCHAR(200) NOT NULL,
    project_type  VARCHAR(40)  NOT NULL,
    description   TEXT NOT NULL,
    features      VARCHAR(1000) DEFAULT NULL,
    timeline      VARCHAR(60)   DEFAULT NULL,
    budget        VARCHAR(60)   DEFAULT NULL,
    status        ENUM('requested','in_review','scoping','in_progress','delivered','cancelled')
                  NOT NULL DEFAULT 'requested',
    progress      TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_projects_user_created (user_id, created_at),
    KEY idx_projects_status       (status),
    CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_updates (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id  INT UNSIGNED NOT NULL,
    message     VARCHAR(2000) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_pupdates_project_created (project_id, created_at),
    CONSTRAINT fk_pupdates_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: seed your first admin account. Replace email + run the line below.
-- Generate the hash locally:  php -r 'echo password_hash("YOUR_PASSWORD", PASSWORD_BCRYPT);'
-- INSERT INTO users (email, password_hash, full_name, role)
-- VALUES ('admin@crystaltechnologys.com', '$2y$10$REPLACE_WITH_HASH', 'Admin', 'admin');
