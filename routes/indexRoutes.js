
import express from "express";
import Blog from "../models/blog";
import figlet from "figlet";
import Utility from "../models/utility";

const router = express.Router();
// home
router.get('/', (req, res, next) => {

  const homeViewModel = {
    title: Utility.generateFiglet("Welcome to tomreese.blog!"),
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

export default router;