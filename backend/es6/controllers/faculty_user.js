'use strict';

const db        = require(__dirname + '/../lib/mysql');
const winston   = require('winston');


exports.register = (req, res, next) => {

    const data = {
        faculty_user_username:          req.body.faculty_user_username,
        faculty_user_password:          req.body.faculty_user_password,
        faculty_user_employee_id:       req.body.faculty_user_employee_id,
        faculty_user_classification:    req.body.faculty_user_classification,
        faculty_user_given_name:        req.body.faculty_user_given_name,
        faculty_user_middle_name:       req.body.faculty_user_middle_name,
        faculty_user_last_name:         req.body.faculty_user_last_name
    };


    function start () {
        db.query('CALL REGISTER(?, ?, ?, ?, ?, ?, ?)',
                 [data.faculty_user_username, data.faculty_user_password,
                  data.faculty_user_employee_id, data.faculty_user_classification,
                  data.faculty_user_given_name, data.faculty_user_middle_name,
                  data.faculty_user_last_name, data.faculty_user_username],
                  send_response);
    }


    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating faculty users', last_query);
            return next(err);
        }

        res.send(result[0][0]);
    }


    start();
};

exports.randomize = (req, res, next) => {

    const data = {
        user_id:                req.params.user_id,
        course_code:            req.params.course_code,
        section_name:           req.params.section_name,
        limit:                  req.params.limit  
    };

    function start () {
        db.query (
            'DROP VIEW IF EXISTS temporary_view;',
            create_view
        );
    }

    function create_view (err, result, args, last_query) {
        if (err) {
            winston.error('Error in dropping view', last_query);
            return next(err);
        }

        db.query (
            [
                'CREATE VIEW v AS SELECT',
                's.student_number,',
                'uc.uc_user_id,',
                'uc.uc_course_code,',
                'uc.uc_section_id,',
                'sect.section_name',
                'FROM',
                'student s,',
                'faculty_user_course_section uc,',
                'student_section ss,',
                'section sect',
                'WHERE',
                'uc.uc_user_id = ' + data.user_id + ' and',
                'uc.uc_course_code = "' + data.course_code + '" and',
                'sect.section_name like "' + data.section_name + '%" and',
                'ss.ss_section_id = uc.uc_section_id and ss.ss_section_id = sect.section_id and',
                's.student_number = ss.ss_student_number;'
            ].join(' '),
            randomize
        );
    }

    function randomize (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating view', last_query);
            return next(err);
        }
        db.query(
                'SELECT * FROM temporary_view ORDER BY rand() LIMIT '+ data.limit + ';',
                send_response
            );
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in randomizing students', last_query);
            return next(err);
        }
        res.send(result);
    }

    start();
};