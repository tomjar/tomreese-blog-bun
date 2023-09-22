
import express from "express";
import Blog from "../models/blog";
import Auth from "../models/auth";
import Settings from "../models/settings";
import CowSay from "cowsay";
import ToastrTypeEnum from "../enums/toastrtypeenum";

const router = express.Router();
// home
router.get('/', (req, res, next) => {

  Blog.getAllPublishedLastThirtyDays()
    .then((result) => {
      const viewmodel = {
        title: 'Welcome to tomreese.blog!',
        lastThirtyDaysBlogs: result,
        isauthenticated: req.session.isauthenticated,
        toastr_messages: req.session.toastr_messages,
        greeting: CowSay.say({
          text: "Its rather empty around here, check out the Archive for past blogs.",
          e: "Oo",
        })
      };

      res.render('index', viewmodel);
    })
    .catch((err) => {
      return next(err);
    });
});

// archive
router.get('/archive', (req, res, next) => {

  Blog.getAllArchived()
    .then((result) => {
      const model = {
        title: 'Welcome to tomreese.blog!',
        yearAndBlogs: result,
        isauthenticated: req.session.isauthenticated
      };

      res.render('archive', model);
    }).catch((err) => {
      next(err);
    });
});

// resetpassword
router.get('/resetpassword', (req, res, next) => {

  if (req.session.setpassword) {

    const viewmodel = {
      title: 'Reset Password',
      isauthenticated: true
    };
    res.render('resetpassword', viewmodel);

  } else {
    res.redirect('/');
  }

}).post('/resetpassword', (req, res, next) => {

  // TODO: figure out a secure way to reset the password
  // currently only setup for accounts that have not initalized
  if (!req.session.setpassword) {
    res.redirect('/');
  } else {

    Promise.all([Auth.initPassword(req.body.username, req.body.password, req.body.cnfpassword)])
      .then((result) => {

        if (result) {
          req.session.setpassword = false;
          req.session.isauthenticated = true;
          req.session.toastr_messages = JSON.stringify(
            [
              {
                type: ToastrTypeEnum.Success,
                msg: `Password successfully updated!`
              }
            ]
          );

          res.redirect('/');
        }
      })
      .catch((err) => {
        return next(err);
      });
  }
});

// about
router.get('/about', (req, res, next) => {

  Settings.getSettings()
    .then((result) => {
      const modelview = {
        'title': 'About',
        'about_section': result.about_section,
        toastr_messages: req.session.toastr_messages
      };

      res.render('about', modelview);
    }).catch((err) => {
      return next(err);
    });

});

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/');
    }
  });
});

export default router;