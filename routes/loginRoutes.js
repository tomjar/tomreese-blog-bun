import express from "express";
import Auth from "../models/auth";
import Event from "../models/event";
import ToastrTypeEnum from "../enums/toastrtypeenum";
import EventCategoryEnum from "../enums/eventcategoryenum";

const router = express.Router();

// login
router.get('/', (req, res, next) => {
    if (req.session.lockout) {
        res.redirect('/');
    } else {

        req.session.toastr_messages = null;
        res.render('login',
            {
                title: 'login',
                toastr_messages: req.session.toastr_messages
            });
    }
}).post('/', (req, res, next) => {
    if (req.session.lockout) {
        res.redirect('/');
    } else {
        Promise.all([Auth.validatePassword(req.body.username, req.body.password)])
            .then((result) => {

                if (result && result.length > 0 && result[0].setpassword) {

                    req.session.setpassword = true;
                    res.render('resetpassword', {
                        username: req.body.username,
                        title: 'Reset Password',
                        toastr_messages: req.session.toastr_messages
                    })

                } else if (result[0].valid) {
                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: ToastrTypeEnum.Success,
                                msg: `Welcome ${req.body.username}`
                            }
                        ]
                    );

                    req.session.isauthenticated = true;
                    res.redirect('/');
                } else {
                    req.session.lockout = true;

                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: ToastrTypeEnum.Warning,
                                msg: 'This failed login attempt has been logged.'
                            }
                        ]
                    );

                    const description = `Failed Login! username: ${req.body.username}`;
                    const category = EventCategoryEnum.EventCategoryEnum.LoginFailure;
                    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

                    Event.insertEvent(ipAddress, category, description).then((result) => {
                        res.redirect('/');
                    });

                }
            })
    }
});

export default router;