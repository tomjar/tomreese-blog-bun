
import express from "express";
import Blog from "../models/blog";
import Auth from "../models/auth";
import Settings from "../models/settings";
import CowSay from "cowsay";

const router = express.Router();
// home
router.get('/', (req, res, next) => {

  const viewmodel = {
    title: 'Welcome to tomreese.blog!',
    lastThirtyDaysBlogs: Blog.getAllPublishedLastThirtyDays(),
    yearAndBlogs: Blog.getAllArchived(),
    isauthenticated: req.session.isauthenticated,
    toastr_messages: req.session.toastr_messages,
    greeting: CowSay.say({
      text: "Its rather empty around here, check out the Archive for past blogs.",
      e: "Oo",
    })
  };

  try {
    res.render('index', viewmodel);
  } catch (error) {
    return next(error);
  }

});

// archive
router.get('/archive', (req, res, next) => {

  const model = {
    title: 'Welcome to tomreese.blog!',
    lastThirtyDaysBlogs: Blog.getAllPublishedLastThirtyDays(),
    yearAndBlogs: Blog.getAllArchived(),
    isauthenticated: req.session.isauthenticated
  };

  try {
    res.render('archive', model);
  } catch (error) {
    return next(error);
  }

});

// resetpassword
router.get('/resetpassword', (req, res, next) => {

  const viewmodel = {
    title: 'Reset Password',
    isauthenticated: req.session.isauthenticated
  };

  try {
    res.render('resetpassword', viewmodel);
  } catch (error) {
    return next(error);
  }

}).post('/resetpassword', (req, res, next) => {

  if (req.session.lockout) {
    res.redirect('/');
  } else {

    Promise.all(Auth.initPassword(req.body.username, req.body.password, req.body.cnfpassword))
      .then((result) => {

        if (result) {
          req.session.toastr_messages = JSON.stringify(
            [
              {
                type: ToastrTypeEnum.Success,
                msg: `Password successfully update!`
              }
            ]
          );

          res.redirect('/');
        }
      });
  }
});

// about
router.get('/about', (req, res, next) => {

  try {

    const result = Settings.getSettings();
    const modelview = {
      'title': 'About',
      'about_section': result.about_section,
      toastr_messages: req.session.toastr_messages
    };

    res.render('about', modelview);
  } catch (error) {
    return next(error);
  }
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