CREATE DATABASE IF NOT EXISTS company_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE company_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS service_required_systems;
DROP TABLE IF EXISTS qualifications;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS systems;
DROP TABLE IF EXISTS employees;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    role_title VARCHAR(255) NULL,
    department VARCHAR(255) NULL,
    location VARCHAR(255) NULL,
    availability_percent DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    active TINYINT(1) NOT NULL DEFAULT 1,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE systems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    system_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NULL,
    business_owner VARCHAR(255) NULL,
    technical_owner VARCHAR(255) NULL,
    environment ENUM('DEV', 'TEST', 'UAT', 'PROD', 'OTHER') NOT NULL DEFAULT 'PROD',
    sensitivity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    active TINYINT(1) NOT NULL DEFAULT 1,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NULL,
    criticality ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    min_qualified INT NOT NULL DEFAULT 1,
    preferred_qualified INT NOT NULL DEFAULT 2,
    active TINYINT(1) NOT NULL DEFAULT 1,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE qualifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    system_id INT NOT NULL,
    experience_score INT NOT NULL DEFAULT 0,
    certification_points INT NOT NULL DEFAULT 0,
    knowledge_score INT NOT NULL DEFAULT 0,
    total_score INT NOT NULL DEFAULT 0,
    qualification_level ENUM('NONE', 'BASIC', 'QUALIFIED', 'FULLY_CAPABLE', 'EXPERT') NOT NULL DEFAULT 'NONE',
    entry_date DATE NULL,
    review_due_date DATE NULL,
    is_reviewed TINYINT(1) NOT NULL DEFAULT 0,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_qualifications_employee_system UNIQUE (employee_id, system_id),

    CONSTRAINT fk_qualifications_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_qualifications_system
        FOREIGN KEY (system_id) REFERENCES systems(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE service_required_systems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    system_id INT NOT NULL,
    required_level ENUM('BASIC', 'QUALIFIED', 'FULLY_CAPABLE', 'EXPERT') NOT NULL DEFAULT 'QUALIFIED',
    min_score INT NOT NULL DEFAULT 0,
    is_critical TINYINT(1) NOT NULL DEFAULT 0,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_service_required_systems UNIQUE (service_id, system_id),

    CONSTRAINT fk_service_required_systems_service
        FOREIGN KEY (service_id) REFERENCES services(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_service_required_systems_system
        FOREIGN KEY (system_id) REFERENCES systems(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;