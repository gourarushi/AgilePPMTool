CREATE DATABASE IF NOT EXISTS ppmtool
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ppmtool;

CREATE TABLE IF NOT EXISTS `user` (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NULL,
  full_name VARCHAR(255) NULL,
  password VARCHAR(255) NULL,
  create__at DATETIME(6) NULL,
  update__at DATETIME(6) NULL,
  PRIMARY KEY (id),
  CONSTRAINT uk_user_username UNIQUE (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project (
  id BIGINT NOT NULL AUTO_INCREMENT,
  project_name VARCHAR(255) NULL,
  project_identifier VARCHAR(255) NULL,
  description VARCHAR(255) NULL,
  start_date DATETIME(6) NULL,
  end_date DATETIME(6) NULL,
  created__at DATETIME(6) NULL,
  updated__at DATETIME(6) NULL,
  project_leader VARCHAR(255) NULL,
  user_id BIGINT NULL,
  PRIMARY KEY (id),
  CONSTRAINT uk_project_identifier UNIQUE (project_identifier),
  KEY idx_project_user_id (user_id),
  CONSTRAINT fk_project_user
    FOREIGN KEY (user_id) REFERENCES `user` (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS backlog (
  id BIGINT NOT NULL AUTO_INCREMENT,
  p_t_sequence INT NULL,
  project_identifier VARCHAR(255) NULL,
  project_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT uk_backlog_project UNIQUE (project_id),
  CONSTRAINT fk_backlog_project
    FOREIGN KEY (project_id) REFERENCES project (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project_task (
  id BIGINT NOT NULL AUTO_INCREMENT,
  project_sequence VARCHAR(255) NULL,
  summary VARCHAR(255) NULL,
  acceptance_criteria VARCHAR(255) NULL,
  due_date DATETIME(6) NULL,
  project_identifier VARCHAR(255) NULL,
  create__at DATETIME(6) NULL,
  update__at DATETIME(6) NULL,
  priority INT NULL,
  status VARCHAR(255) NULL,
  backlog_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT uk_project_task_sequence UNIQUE (project_sequence),
  KEY idx_project_task_backlog_id (backlog_id),
  CONSTRAINT fk_project_task_backlog
    FOREIGN KEY (backlog_id) REFERENCES backlog (id)
) ENGINE=InnoDB;
