
import express from "express";
import Blog from "../models/blog";
import Auth from "../models/auth";
import Settings from "../models/settings";
import CowSay from "cowsay";
import ToastrTypeEnum from "../enums/toastrtypeenum";

const router = express.Router();
// home
router.get('/', (req, res, next) => {

      const viewmodel = {
        title: 'Welcome to tomreese.blog!',
        lastThirtyDaysBlogs: [],
        isauthenticated: req.session.isauthenticated,
        toastr_messages: req.session.toastr_messages,
        greeting: CowSay.say({
          text: "Check back later, website undergoing maintenence...",
          e: "Oo",
        })
      };

      res.render('index', viewmodel);
});

export default router;