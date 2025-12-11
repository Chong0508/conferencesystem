USE cmsdb;

-- ==========================================================
-- SAMPLE DATA INSERTION FOR SMART CONFERENCE MANAGEMENT SYSTEM
-- ==========================================================

-- ----------------------------
-- 1. Insert Users
-- ----------------------------
INSERT INTO user (email, password_hash, first_name, last_name, affiliation, country, category, orcid, is_email_verified)
VALUES
    ('admin@cms.com', 'hash_admin', 'Alice', 'Tan', 'UTM', 'Malaysia', 'staff', '0000-0001-1234-5678', TRUE),
    ('reviewer1@cms.com', 'hash_rev1', 'Bob', 'Lee', 'UM', 'Malaysia', 'academic', '0000-0002-1234-5678', TRUE),
    ('author1@cms.com', 'hash_auth1', 'Carmen', 'Lim', 'USM', 'Malaysia', 'student', '0000-0003-1234-5678', TRUE),
    ('author2@cms.com', 'hash_auth2', 'Daniel', 'Ng', 'Monash', 'Australia', 'academic', '0000-0004-1234-5678', TRUE),
    ('chair@cms.com', 'hash_chair', 'Evelyn', 'Wong', 'Taylor’s', 'Malaysia', 'staff', '0000-0005-1234-5678', TRUE);

-- ----------------------------
-- 2. Insert Roles
-- ----------------------------
INSERT INTO role (role_name, description)
VALUES
    ('Admin', 'System administrator with full access'),
    ('Reviewer', 'Reviews and scores submitted papers'),
    ('Author', 'Submits papers to conferences'),
    ('Chair', 'Manages tracks and reviews');

-- ----------------------------
-- 3. Assign User Roles
-- ----------------------------
INSERT INTO user_role (user_id, role_id) VALUES
                                             (1, 1), -- Alice is Admin
                                             (2, 2), -- Bob is Reviewer
                                             (3, 3), -- Carmen is Author
                                             (4, 3), -- Daniel is Author
                                             (5, 4); -- Evelyn is Chair

-- ----------------------------
-- 4. Insert Conference
-- ----------------------------
INSERT INTO conference (title, acronym, start_date, end_date, location, description, website_url, created_by)
VALUES
    ('International Conference on Smart Computing 2025', 'ICSC 2025', '2025-08-10', '2025-08-12', 'Kuala Lumpur, Malaysia',
     'A global conference for smart computing and AI innovations.', 'https://icsc2025.org', 1);

-- ----------------------------
-- 5. Insert Track
-- ----------------------------
INSERT INTO track (conference_id, name, chair_id, description)
VALUES
    (1, 'Artificial Intelligence', 5, 'Research in AI and machine learning applications.'),
    (1, 'Human-Computer Interaction', 5, 'Studies on user experience and interaction design.');

-- ----------------------------
-- 6. Insert Papers
-- ----------------------------
INSERT INTO paper (track_id, title, abstract, submission_file, file_type, plagiarism_score, status, submitted_by)
VALUES
    (1, 'Smart City Traffic Optimization', 'AI-powered traffic control using predictive modeling.', 'traffic_ai.pdf', 'PDF', 5.4, 'under_review', 3),
    (2, 'Emotion-Based UI Design', 'Improving user experience using emotion recognition.', 'emotion_ui.pdf', 'PDF', 3.2, 'submitted', 4);

-- ----------------------------
-- 7. Insert Authors
-- ----------------------------
INSERT INTO author (paper_id, user_id, author_order, is_corresponding)
VALUES
    (1, 3, 1, TRUE),   -- Carmen for paper 1
    (2, 4, 1, TRUE);   -- Daniel for paper 2

-- ----------------------------
-- 8. Insert Reviewer
-- ----------------------------
INSERT INTO reviewer (user_id, expertise_area, max_papers)
VALUES
    (2, 'Artificial Intelligence, Machine Learning', 5);

-- ----------------------------
-- 9. Assign Reviews
-- ----------------------------
INSERT INTO review_assignment (paper_id, reviewer_id, due_date)
VALUES
    (1, 1, '2025-06-15');

-- ----------------------------
-- 10. Insert Review
-- ----------------------------
INSERT INTO review (assignment_id, reviewer_id, overall_score, comments_to_author, comments_to_chair, recommendation)
VALUES
    (1, 1, 8.5, 'Well-written and innovative.', 'Promising research direction.', 'accept');

-- ----------------------------
-- 11. Insert Score Criteria
-- ----------------------------
INSERT INTO score_criterion (name, description)
VALUES
    ('Originality', 'Measures how unique and innovative the paper is.'),
    ('Technical Quality', 'Evaluates correctness and depth of methods.'),
    ('Clarity', 'Assesses writing and structure.'),
    ('Significance', 'Determines impact on the research community.');

-- ----------------------------
-- 12. Insert Review Scores
-- ----------------------------
INSERT INTO review_score (review_id, criterion_id, score)
VALUES
    (1, 1, 8.0),
    (1, 2, 8.5),
    (1, 3, 9.0),
    (1, 4, 8.0);

-- ----------------------------
-- 13. Insert Rebuttal
-- ----------------------------
INSERT INTO rebuttal (paper_id, author_id, content)
VALUES
    (1, 3, 'Thank you for your feedback. We will address all concerns in the next version.');

-- ----------------------------
-- 14. Insert Discussion
-- ----------------------------
INSERT INTO discussion (paper_id, participant_id, message)
VALUES
    (1, 2, 'I agree with the acceptance recommendation.'),
    (1, 5, 'Noted. Let’s finalize the decision soon.');

-- ----------------------------
-- 15. Insert Notification
-- ----------------------------
INSERT INTO notification (user_id, message, type)
VALUES
    (3, 'Your paper "Smart City Traffic Optimization" has been reviewed.', 'system'),
    (4, 'Paper submission deadline extended.', 'email');

-- ----------------------------
-- 16. Insert Email Log
-- ----------------------------
INSERT INTO email_log (recipient_id, recipient_email, subject, body, status, sent_by)
VALUES
    (3, 'author1@cms.com', 'Paper Review Completed', 'Your paper review is ready.', 'sent', 1),
    (4, 'author2@cms.com', 'Deadline Update', 'Submission deadline extended to 30 June.', 'sent', 1);

-- ----------------------------
-- 17. Insert Event
-- ----------------------------
INSERT INTO event (conference_id, name, start_time, end_time, location)
VALUES
    (1, 'Opening Ceremony', '2025-08-10 09:00:00', '2025-08-10 10:30:00', 'Main Hall'),
    (1, 'Keynote: Future of AI', '2025-08-10 11:00:00', '2025-08-10 12:30:00', 'Main Hall');

-- ----------------------------
-- 18. Insert Session
-- ----------------------------
INSERT INTO session (event_id, title, chair_id, start_time, end_time)
VALUES
    (2, 'AI and Smart Cities', 5, '2025-08-10 11:00:00', '2025-08-10 12:00:00');

-- ----------------------------
-- 19. Insert Room
-- ----------------------------
INSERT INTO room (name, capacity, location)
VALUES
    ('Main Hall', 500, 'Level 1'),
    ('Room A', 100, 'Level 2');

-- ----------------------------
-- 20. Insert Schedule
-- ----------------------------
INSERT INTO schedule (session_id, room_id, start_time, end_time)
VALUES
    (1, 1, '2025-08-10 11:00:00', '2025-08-10 12:00:00');

-- ----------------------------
-- 21. Insert Registration
-- ----------------------------
INSERT INTO registration (user_id, conference_id, registration_type, early_bird, payment_status)
VALUES
    (3, 1, 'author', TRUE, 'paid'),
    (4, 1, 'author', FALSE, 'pending'),
    (2, 1, 'attendee', TRUE, 'paid');

-- ----------------------------
-- 22. Insert Payment
-- ----------------------------
INSERT INTO payment (registration_id, amount, currency, status, paid_at)
VALUES
    (1, 450.00, 'USD', 'paid', '2025-05-01 09:00:00'),
    (3, 300.00, 'USD', 'paid', '2025-05-03 10:00:00');

-- ----------------------------
-- 23. Insert Keyword
-- ----------------------------
INSERT INTO keyword (keyword)
VALUES
    ('Artificial Intelligence'),
    ('Machine Learning'),
    ('Smart City'),
    ('User Interface');

-- ----------------------------
-- 24. Link Papers and Keywords
-- ----------------------------
INSERT INTO paper_keyword (paper_id, keyword_id)
VALUES
    (1, 1),
    (1, 3),
    (2, 4);

-- ----------------------------
-- 25. Insert Log Activity
-- ----------------------------
INSERT INTO log_activity (user_id, action, details, login_time, logout_time)
VALUES
    (3, 'login', 'Author logged into system', '2025-05-01 08:00:00', '2025-05-01 10:00:00'),
    (3, 'submit_paper', 'Submitted "Smart City Traffic Optimization"', '2025-05-01 09:00:00', NULL),
    (2, 'login', 'Reviewer accessed review dashboard', '2025-05-02 14:00:00', '2025-05-02 15:30:00'),
    (1, 'login', 'Admin accessed system settings', '2025-05-03 09:00:00', '2025-05-03 09:45:00');
