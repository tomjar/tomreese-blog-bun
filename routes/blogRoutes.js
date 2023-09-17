import express from "express";
import Blog from "../models/blog";
import ToastrTypeEnum from "../enums/toastrtypeenum";

const router = express.Router();

// blogs/name
router.get('/:name', (req, res, next) => {
    const name = req.params.name;

    try {

        const result = Blog.getBlogByName(name);

        if (result) {

            const viewmodel = {
                title: result.header,
                body: result.body,
                imageUrl: `/images/${result.category}.png`,
                createtimestamp: result.createtimestamp,
                modifytimestamp: result.modifytimestamp,
                yearAndBlogs: Blog.getAllArchived(),
                isauthenticated: req.session.isauthenticated,
                toastr_messages: req.session.toastr_messages
            };

            res.render('blog', viewmodel);
        } else {

            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Error,
                        msg: `No blog with ${name} exists.`
                    }
                ]
            );
            res.redirect('/');
        }
    } catch (error) {
        return next(error);
    }

});

export default router;