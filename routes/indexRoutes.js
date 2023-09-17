
import express from "express";
import Blog from "../models/blog";
import Auth from "../models/auth";
import figlet from "figlet";
import Utility from "../models/utility";

const router = express.Router();
// home
router.get('/', (req, res, next) => {

  const homeViewModel = {
    title: 'Welcome to tomreese.blog!',
    lastThirtyDaysBlogs: Blog.getAllPublishedLastThirtyDays(),
    yearAndBlogs: Blog.getAllArchived(),
    isauthenticated: req.session.isauthenticated
  };

  try {
    res.render('index', homeViewModel);
  } catch (error) {
    return next(error);
  }

});

// resetpassword
router.get('/resetpassword', (req, res, next) => {

  const resetpasswordViewModel = {
    title: 'Reset Password',
    lastThirtyDaysBlogs: Blog.getAllPublishedLastThirtyDays(),
    yearAndBlogs: Blog.getAllArchived(),
    isauthenticated: req.session.isauthenticated
  };

  try {
    res.render('', resetpasswordViewModel);
  } catch (error) {
    return next(error);
  }

  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/');
    }
  });
}).post('/resetpassword', (req, res, next) => {

  if (req.session.lockout) {
    res.redirect('../');
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

          res.redirect('../');
        }
      });
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