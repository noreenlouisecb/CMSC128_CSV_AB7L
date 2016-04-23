'use strict';

const db        = require(__dirname + '/../lib/mysql');
const status    = require(__dirname + '/../lib/status');
const winston   = require('winston');


// Inserts a new lecture section
exports.post_lecture_section = (req, res, next) => {
    let response;

    const data = {
        faculty_user_id:    req.body.faculty_user_id,
        course_code:        req.body.course_code,
        name:               req.body.name,
    };

    function start () {
        db.query('CALL INSERT_LECTURE_SECTION(?, ?, ?);',
                [data.faculty_user_id, data.course_code, data.name],
                send_response);
    }


    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in inserting a lecture section', last_query);
            return next(err);
        }

        res.send(result[0][0]);
    }

    start();
};


// Updates a lecture section
exports.update_lecture_section = (req, res, next) => {
    let response;

    const data = {
        faculty_user_id:        req.body.faculty_user_id,
        course_code:            req.body.course_code,
        section_name:           req.body.section_name,
        new_section_name:       req.body.new_section_name
    };

    function start () {
        db.query('CALL UPDATE_LECTURE_SECTION(?, ?, ?, ?);',
                [data.faculty_user_id, data.course_code, data.section_name, data.new_section_name],
                send_response);
    }


    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in inserting a lecture section', last_query);
            return next(err);
        }

        res.send(result[0][0]);
    }

    start();
};