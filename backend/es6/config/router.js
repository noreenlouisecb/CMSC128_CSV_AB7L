'use strict';

const $         = require(__dirname + '/../lib/session');
const importer  = require('anytv-node-importer');


module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.get ('/',                                                                         __.render_controller.index);

    router.post('/faculty_user/register/',                                                  __.faculty_user.register);
    router.post('/faculty_user/check_faculty_user_username/',                               __.faculty_user.check_faculty_user_username);
    router.post('/faculty_user/check_faculty_user_employee_id/',                            __.faculty_user.check_faculty_user_employee_id);
    router.post('/faculty_user/post_volunteer/',                        $('Faculty User'),  __.faculty_user.post_volunteer);
    router.get ('/faculty_user/volunteers',                             $('Faculty User'),  __.faculty_user.get_volunteers);
    router.put ('/faculty_user/volunteer/:user_id/:student_number',     $('Faculty User'),  __.faculty_user.update_volunteer);
    router.del ('/faculty_user/volunteer/',                             $('Faculty User'),  __.faculty_user.delete_volunteer);

    router.get ('/faculty_user/randomize',                              $('Faculty User'),  __.faculty_user.randomize);

    router.post('/authenticate/login/',                                                     __.authenticate.login);
    router.get ('/authenticate/logout',                                 $,                  __.authenticate.logout);

    router.get('/randomize_notuser',                                                        __.render_controller.randomize_notuser);
    router.get('/randomize',                                                                __.render_controller.randomize);
    router.get('/edit',                                                                     __.render_controller.edit);

    router.all('*', (req, res, next) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
