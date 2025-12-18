-- ==========================================================
-- Smart Conference Management Database System (CMSDB)
-- Detailed SQL Schema with Comments for Presentation
-- ==========================================================

-- Drop database if it exists and create a fresh one
DROP DATABASE IF EXISTS cmsdb;
CREATE DATABASE cmsdb;
USE cmsdb;

-- ==========================================================
-- 1. USER TABLE
-- Stores user account details (authors, reviewers, organizers, etc.)
-- ==========================================================
CREATE TABLE user (
                      user_id BIGINT PRIMARY KEY AUTO_INCREMENT,           -- Unique user ID
                      email VARCHAR(255) NOT NULL UNIQUE,                  -- User's login email
                      password_hash VARCHAR(255) NOT NULL,                 -- Encrypted password
                      first_name VARCHAR(100),                             -- User's first name
                      last_name VARCHAR(100),                              -- User's last name
                      affiliation VARCHAR(255),                            -- University or company
                      country VARCHAR(100),                                -- User's country
                      category VARCHAR(32) NOT NULL DEFAULT 'other',        -- student|academic|staff|other
                      orcid VARCHAR(50),                                   -- ORCID identifier for researchers
                      profile_picture VARCHAR(255),                        -- Path to profile image
                      is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,     -- Email verification status
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- Account creation time
                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      CHECK (category IN ('student','academic','staff','other'))
) ENGINE=InnoDB;

-- ==========================================================
-- 2. ROLE TABLE
-- Defines system roles (Admin, Reviewer, Author, etc.)
-- ==========================================================
CREATE TABLE role (
                      role_id INT PRIMARY KEY AUTO_INCREMENT,
                      role_name VARCHAR(100) NOT NULL UNIQUE,              -- e.g., 'Admin', 'Reviewer'
                      description TEXT                                     -- Role purpose
) ENGINE=InnoDB;

-- ==========================================================
-- 3. USER_ROLE TABLE
-- Maps users to their roles (Many-to-Many relationship)
-- ==========================================================
CREATE TABLE user_role (
                           user_id BIGINT,
                           role_id INT,
                           assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- When role was assigned
                           PRIMARY KEY (user_id, role_id),
                           FOREIGN KEY (user_id) REFERENCES user(user_id),
                           FOREIGN KEY (role_id) REFERENCES role(role_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 4. CONFERENCE TABLE
-- Stores information about conferences
-- ==========================================================
CREATE TABLE conference (
                            conference_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            title VARCHAR(255) NOT NULL,                         -- Full conference name
                            acronym VARCHAR(50),                                 -- e.g., “ICML 2025”
                            start_date DATE NOT NULL,
                            end_date DATE NOT NULL,
                            location VARCHAR(255),
                            description TEXT,
                            website_url VARCHAR(255),
                            submission_deadline DATE,
                            review_deadline DATE,
                            rebuttal_deadline DATE,
                            camera_ready_deadline DATE,
                            registration_deadline DATE,
                            late_submission_deadline DATE,
                            status ENUM('upcoming','ongoing','completed') DEFAULT 'upcoming',
                            created_by BIGINT,                                   -- Organizer ID
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (created_by) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 5. TRACK TABLE
-- Represents a conference track (e.g., AI, Networks)
-- ==========================================================
CREATE TABLE track (
                       track_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       conference_id BIGINT NOT NULL,
                       name VARCHAR(255) NOT NULL,                          -- Track title
                       chair_id BIGINT,                                     -- Track chair (User)
                       description TEXT,
                       FOREIGN KEY (conference_id) REFERENCES conference(conference_id),
                       FOREIGN KEY (chair_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 6. PAPER TABLE
-- Stores submitted papers and related metadata
-- ==========================================================
CREATE TABLE paper (
                       paper_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       track_id BIGINT,
                       title VARCHAR(255) NOT NULL,
                       abstract TEXT,
                       submission_file VARCHAR(255),                        -- Uploaded file name/path
                       file_type VARCHAR(50),                               -- e.g., PDF, DOCX
                       version INT DEFAULT 1,                               -- Revision version
                       plagiarism_score DECIMAL(5,2),                       -- Plagiarism percentage
                       status ENUM('submitted','under_review','accepted','rejected') DEFAULT 'submitted',
                       submitted_by BIGINT,                                 -- Author who submitted
                       submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       FOREIGN KEY (track_id) REFERENCES track(track_id),
                       FOREIGN KEY (submitted_by) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 7. AUTHOR TABLE
-- Links papers to authors (supports multiple authors per paper)
-- ==========================================================
CREATE TABLE author (
                        author_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                        paper_id BIGINT NOT NULL,
                        user_id BIGINT,
                        author_order INT DEFAULT 1,                          -- Author sequence
                        is_corresponding BOOLEAN DEFAULT FALSE,              -- True if corresponding author
                        FOREIGN KEY (paper_id) REFERENCES paper(paper_id),
                        FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 8. REVIEWER TABLE
-- Stores reviewer profiles and expertise areas
-- ==========================================================
CREATE TABLE reviewer (
                          reviewer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          user_id BIGINT NOT NULL,
                          expertise_area VARCHAR(255),
                          max_papers INT DEFAULT 5,                            -- Max papers allowed to review
                          FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 9. REVIEW_ASSIGNMENT TABLE
-- Assigns papers to reviewers for evaluation
-- ==========================================================
CREATE TABLE review_assignment (
                                   assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                   paper_id BIGINT NOT NULL,
                                   reviewer_id BIGINT NOT NULL,
                                   assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   due_date DATE,
                                   status ENUM('pending','reviewed','conflict') DEFAULT 'pending',
                                   FOREIGN KEY (paper_id) REFERENCES paper(paper_id),
                                   FOREIGN KEY (reviewer_id) REFERENCES reviewer(reviewer_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 10. REVIEW TABLE
-- Stores detailed review feedback from reviewers
-- ==========================================================
CREATE TABLE review (
                        review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                        assignment_id BIGINT,
                        reviewer_id BIGINT,
                        overall_score DECIMAL(3,2),
                        comments_to_author TEXT,
                        comments_to_chair TEXT,
                        recommendation ENUM('accept','minor_revision','major_revision','reject'),
                        round_number INT DEFAULT 1,
                        due_date DATE,
                        attachment VARCHAR(255),
                        reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (assignment_id) REFERENCES review_assignment(assignment_id),
                        FOREIGN KEY (reviewer_id) REFERENCES reviewer(reviewer_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 11. SCORE_CRITERION TABLE
-- Defines the review scoring criteria (e.g., originality, clarity)
-- ==========================================================
CREATE TABLE score_criterion (
                                 criterion_id INT PRIMARY KEY AUTO_INCREMENT,
                                 name VARCHAR(100),
                                 description TEXT
) ENGINE=InnoDB;

-- ==========================================================
-- 12. REVIEW_SCORE TABLE
-- Stores numerical scores for each criterion per review
-- ==========================================================
CREATE TABLE review_score (
                              review_id BIGINT,
                              criterion_id INT,
                              score DECIMAL(3,2),
                              PRIMARY KEY (review_id, criterion_id),
                              FOREIGN KEY (review_id) REFERENCES review(review_id),
                              FOREIGN KEY (criterion_id) REFERENCES score_criterion(criterion_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 13. REBUTTAL TABLE
-- Allows authors to respond to reviewer comments
-- ==========================================================
CREATE TABLE rebuttal (
                          rebuttal_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          paper_id BIGINT NOT NULL,
                          author_id BIGINT NOT NULL,
                          review_round INT DEFAULT 1,
                          content TEXT,
                          submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (paper_id) REFERENCES paper(paper_id),
                          FOREIGN KEY (author_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 14. DISCUSSION TABLE
-- Enables discussion among reviewers or between authors and reviewers
-- ==========================================================
CREATE TABLE discussion (
                            discussion_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            paper_id BIGINT,
                            participant_id BIGINT,
                            message TEXT,
                            posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (paper_id) REFERENCES paper(paper_id),
                            FOREIGN KEY (participant_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 15. NOTIFICATION TABLE
-- Sends notifications to users (email or in-app)
-- ==========================================================
CREATE TABLE notification (
                              notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                              user_id BIGINT,
                              message TEXT,
                              type ENUM('email','system') DEFAULT 'system',
                              is_read BOOLEAN DEFAULT FALSE,
                              sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 16. EMAIL_LOG TABLE
-- Logs all sent emails for audit and troubleshooting
-- ==========================================================
CREATE TABLE email_log (
                           email_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                           recipient_id BIGINT,
                           recipient_email VARCHAR(255),
                           subject VARCHAR(255),
                           body TEXT,
                           status ENUM('sent','failed','queued') DEFAULT 'sent',
                           sent_by BIGINT,
                           sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           delivered_at TIMESTAMP NULL,
                           FOREIGN KEY (sent_by) REFERENCES user(user_id),
                           FOREIGN KEY (recipient_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 17. EVENT TABLE
-- Stores conference events (e.g., keynote sessions, workshops)
-- ==========================================================
CREATE TABLE event (
                       event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       conference_id BIGINT,
                       name VARCHAR(255),
                       start_time DATETIME,
                       end_time DATETIME,
                       location VARCHAR(255),
                       FOREIGN KEY (conference_id) REFERENCES conference(conference_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 18. SESSION TABLE
-- Defines smaller sessions within events (e.g., paper presentations)
-- ==========================================================
CREATE TABLE session (
                         session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                         event_id BIGINT,
                         title VARCHAR(255),
                         chair_id BIGINT,
                         start_time DATETIME,
                         end_time DATETIME,
                         FOREIGN KEY (event_id) REFERENCES event(event_id),
                         FOREIGN KEY (chair_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 19. ROOM TABLE
-- Manages conference rooms and capacities
-- ==========================================================
CREATE TABLE room (
                      room_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                      name VARCHAR(100),
                      capacity INT,
                      location VARCHAR(255)
) ENGINE=InnoDB;

-- ==========================================================
-- 20. SCHEDULE TABLE
-- Schedules sessions in specific rooms and time slots
-- ==========================================================
CREATE TABLE schedule (
                          schedule_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          session_id BIGINT,
                          room_id BIGINT,
                          start_time DATETIME,
                          end_time DATETIME,
                          FOREIGN KEY (session_id) REFERENCES session(session_id),
                          FOREIGN KEY (room_id) REFERENCES room(room_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 21. REGISTRATION TABLE
-- Stores attendee registration data
-- ==========================================================
CREATE TABLE registration (
                              registration_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                              user_id BIGINT NOT NULL,
                              conference_id BIGINT NOT NULL,
                              registration_type ENUM('author','attendee','student') DEFAULT 'attendee',
                              early_bird BOOLEAN DEFAULT FALSE,
                              payment_status ENUM('pending','paid','cancelled') DEFAULT 'pending',
                              registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (user_id) REFERENCES user(user_id),
                              FOREIGN KEY (conference_id) REFERENCES conference(conference_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 22. PAYMENT TABLE
-- Manages registration payments and receipts
-- ==========================================================
CREATE TABLE payment (
                         payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                         registration_id BIGINT NOT NULL,
                         amount DECIMAL(10,2),
                         currency VARCHAR(10) DEFAULT 'USD',
                         receipt_file VARCHAR(255),
                         status ENUM('pending','paid','failed') DEFAULT 'pending',
                         paid_at TIMESTAMP NULL,
                         FOREIGN KEY (registration_id) REFERENCES registration(registration_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 23. KEYWORD TABLE
-- Stores research keywords for classification
-- ==========================================================
CREATE TABLE keyword (
                         keyword_id INT PRIMARY KEY AUTO_INCREMENT,
                         keyword VARCHAR(100) UNIQUE
) ENGINE=InnoDB;

-- ==========================================================
-- 24. PAPER_KEYWORD TABLE
-- Links papers to their research keywords
-- ==========================================================
CREATE TABLE paper_keyword (
                               paper_id BIGINT,
                               keyword_id INT,
                               PRIMARY KEY (paper_id, keyword_id),
                               FOREIGN KEY (paper_id) REFERENCES paper(paper_id),
                               FOREIGN KEY (keyword_id) REFERENCES keyword(keyword_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 25. LOG_ACTIVITY TABLE
-- Tracks user activities such as login, logout, and submissions
-- ==========================================================
CREATE TABLE log_activity (
                              log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                              user_id BIGINT,
                              action VARCHAR(255),                 -- e.g., 'login', 'logout', 'submit_paper'
                              details TEXT,                        -- Optional details about the activity
                              login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Activity start time
                              logout_time TIMESTAMP NULL,                     -- Activity end time (null until logout)
                              FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;
