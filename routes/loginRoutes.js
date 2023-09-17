import express from "express";
import Auth from "../models/auth";
import Event from "../models/event";
import ToastrTypeEnum from "../enums/toastrtypeenum";
import EventCategoryEnum from "../enums/eventcategoryenum";

const router = express.Router();

// login
router.get('/', (req, res, next) => {
    if (req.session.lockout) {
        res.redirect('../');
    } else {
        let tstrmsgs = req.session.toastr_messages;
        req.session.toastr_messages = null;
        res.render('login',
            {
                title: 'login',

            });
    }
}).post('/', (req, res, next) => {
    if (req.session.lockout) {
        res.redirect('../');
    } else {
        Promise.all([Auth.validatePassword(req.body.username, req.body.password)])
            .then((result) => {

                console.log(result[0]);
                // valid: false,
                // setpassword: true

                if(result[0].setpassword){
                    
                    res.render('resetpassword', {
                        username: req.body.username,
                        title: 'Reset Password'
                    })

                }else if(result[0].valid){
                    // welcome valid user
                    req.session.isauthenticated = true;
                    res.redirect('../');
                }else{
                    req.session.lockout = true;

                    req.session.toastr_messages = JSON.stringify(
                        [
                            {
                                type: ToastrTypeEnum.Warning,
                                msg: 'This failed login attempt has been logged.'
                            }
                        ]
                    );

                    let description = 'It appears someone attempted to login to the website and failed.',
                        category = EventCategoryEnum.LoginFailure,
                        ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;


                    Event.insertEvent(ipAddress, category, description);
                    res.redirect('../');
                }
            })
    }
});



export default router;