DROP DATABASE IF EXISTS reginyzr;
CREATE DATABASE reginyzr;
USE reginyzr;


-- Table 'admin'
DROP TABLE IF EXISTS admin;
CREATE TABLE admin(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    PRIMARY KEY(id)
);


-- Table 'faculty_user'
DROP TABLE IF EXISTS faculty_user;
CREATE TABLE faculty_user(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    employee_id VARCHAR(16) NOT NULL UNIQUE,
    classification VARCHAR(32) NOT NULL,
    given_name VARCHAR(64) NOT NULL,
    middle_name VARCHAR(32) NOT NULL,
    design_setting VARCHAR(32) NOT NULL DEFAULT 'index.css',
    last_name VARCHAR(32) NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    date_approved TIMESTAMP NULL,
    date_signed_up TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);


-- Table 'course'
DROP TABLE IF EXISTS course;
CREATE TABLE course(
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(16) NOT NULL,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(256) NOT NULL,
    PRIMARY KEY(id)
);


-- Table 'section' merged lecture_section and sub_section to section only, for the incrementing id.
DROP TABLE IF EXISTS section;
CREATE TABLE section(
    id INT NOT NULL AUTO_INCREMENT,
    course_id INT NOT NULL,
    name VARCHAR(8) NOT NULL,
    code VARCHAR(4),
    PRIMARY KEY(id),
    FOREIGN KEY(course_id) REFERENCES course(id)
);


-- Table 'student'
DROP TABLE IF EXISTS student;
CREATE TABLE student(
    id INT NOT NULL AUTO_INCREMENT,
    student_number VARCHAR(10) NOT NULL,
    given_name VARCHAR(64) NOT NULL,
    middle_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    degree VARCHAR(8) NOT NULL,
    classification ENUM('Freshman', 'Sophomore', 'Junior', 'Senior', 'Masteral', 'PhD') NOT NULL,
    college VARCHAR(8) NOT NULL,
    picture BLOB DEFAULT NULL,
    frequency INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);


-- Table 'student_section' separated the student table
DROP TABLE IF EXISTS student_section;
CREATE TABLE student_section(
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES student(id),
    FOREIGN KEY(section_id) REFERENCES section(id)
);


-- Table 'faculty_user_course'
DROP TABLE IF EXISTS faculty_user_course;
CREATE TABLE faculty_user_course(
    faculty_user_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY(faculty_user_id) REFERENCES faculty_user(id),
    FOREIGN KEY(course_id) REFERENCES course(id)
);


-- Table 'login_logs'
DROP TABLE IF EXISTS login_logs;
CREATE TABLE login_logs(
    faculty_user_id INT NOT NULL,
    date_login TIMESTAMP NOT NULL,
    FOREIGN KEY(faculty_user_id) REFERENCES faculty_user(id)
);


-- Table 'logout_logs'
DROP TABLE IF EXISTS logout_logs;
CREATE TABLE logout_logs(
    faculty_user_id INT NOT NULL,
    date_logout TIMESTAMP NOT NULL,
    FOREIGN KEY(faculty_user_id) REFERENCES faculty_user(id)
);


-- Table 'randomizer_logs'
DROP TABLE IF EXISTS randomizer_logs;
CREATE TABLE randomizer_logs(
    id INT NOT NULL AUTO_INCREMENT,
    date_randomized TIMESTAMP NOT NULL,
    faculty_user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(faculty_user_id) REFERENCES faculty_user(id)
);


-- Table 'randomizer_logs_students'
DROP TABLE IF EXISTS randomizer_logs_students;
CREATE TABLE randomizer_logs_students(
    randomizer_logs_id INT NOT NULL,
    student_id INT NOT NULL,
    FOREIGN KEY(randomizer_logs_id) REFERENCES randomizer_logs(id),
    FOREIGN KEY(student_id) REFERENCES student(id)
);
