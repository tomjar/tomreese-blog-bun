import express from "express";
import Blog from "../models/blog";
import Settings from "../models/settings";
const router = express.Router();

// about
router.get('/', (req, res, next) => {

  try {

    const result = Settings.getSettings();
    const aboutView = {
      'title': 'About',
      'about_section': result.about_section,
      yearAndBlogs: Blog.getAllArchived()
    };

    res.render('about', aboutView);
  } catch (error) {
    return next(error);
  }


});

export default router;