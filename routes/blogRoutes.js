import express from "express";
import Blog from "../models/blog";
import ToastrTypeEnum from "../enums/toastrtypeenum";

const router = express.Router();

// blogs/name
router.get('/:name', (req, res, next) => {
    const name = req.params.name;

    Promise.all([Blog.getAllArchived(), Blog.getBlogByName(name)])
        .then((result) => {

            if (result && result.length > 0 && result[0] && result[1]) {
                const viewmodel = {
                    title: result[1].header,
                    body: result[1].body,
                    imageUrl: `/images/${result[1].category}.png`,
                    createtimestamp: result[1].createtimestamp,
                    modifytimestamp: result[1].modifytimestamp,
                    yearAndBlogs: result[0],
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
        })
        .catch((err) => {
            return next(err);
        });
});

export default router;