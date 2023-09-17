import express from "express";
import Blog from "../models/blog";
import PostCategoryEnum from "../enums/postcategoryenum";
import ToastrTypeEnum from "../enums/toastrtypeenum";

const router = express.Router();

// blogs/name
router.get('/:name', (req, res, next) => {
    const name = req.params.name;

    try {

        const result = Blog.getBlogByName(name);
        // console.log(name);
        // console.log(result);

        const blogModel = {
            title: result.header,
            body: result.body,
            imageUrl: `/images/${result.category}.png`,
            createtimestamp: result.createtimestamp,
            modifytimestamp: result.modifytimestamp,
            yearAndBlogs: Blog.getAllArchived(),
            isauthenticated: req.session.isauthenticated
        };

        res.render('blog', blogModel);
    } catch (error) {
        return next(error);
    }

});

// // all blogs
router.get('/', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Blog.getAll();

        const allBlogsViewModel = {
            title: 'All Blogs',
            isauthenticated: req.session.isauthenticated,
            blogs: result,
            toastr_messages: req.session.toastr_messages
        };

        req.session.toastr_messages = null;
        res.render('admin/blogs', allBlogsViewModel);

    } else {
        res.redirect('../login');
    }
});

// add
router.get('/add', (req, res, next) => {
    if (req.session.isauthenticated) {
        res.render('admin/add', {
            'title': 'Add New Blog',
            'isauthenticated': req.session.isauthenticated,
            'categories': [
                { 'value': PostCategoryEnum.Bicycle.toLowerCase(), 'name': PostCategoryEnum.Bicycle.toLowerCase() },
                { 'value': PostCategoryEnum.Code.toLowerCase(), 'name': PostCategoryEnum.Code.toLowerCase() },
                { 'value': PostCategoryEnum.Gaming.toLowerCase(), 'name': PostCategoryEnum.Gaming.toLowerCase() },
                { 'value': PostCategoryEnum.Hardware.toLowerCase(), 'name': PostCategoryEnum.Hardware.toLowerCase() },
                { 'value': PostCategoryEnum.Life.toLowerCase(), 'name': PostCategoryEnum.Life.toLowerCase() },
                { 'value': PostCategoryEnum.Review.toLowerCase(), 'name': PostCategoryEnum.Review.toLowerCase() }
            ]
        });
    } else {
        res.redirect('../login');
    }
}).post('/add', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Blog.insertPost(req.body.header, req.body.description, req.body.name, req.body.category, req.body.body);

        if (result) {
            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Success,
                        msg: `The post ${result.name} was added!`
                    }
                ]
            );

            res.redirect('/admin/blogs');
        }
    } else {
        res.redirect('../login');
    }
});

// update
router.get('/update/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        const result = Blog.getPostById(req.params.id);
        const editBlogView = {
            'id': result.id,
            'header': result.header,
            'ispublished': result.ispublished,
            'description': result.description,
            'name': result.name,
            'category': result.category,
            'body': result.body,
            'categories': [
                { 'value': PostCategoryEnum.Bicycle.toLowerCase(), 'name': PostCategoryEnum.Bicycle.toLowerCase() },
                { 'value': PostCategoryEnum.Code.toLowerCase(), 'name': PostCategoryEnum.Code.toLowerCase() },
                { 'value': PostCategoryEnum.Gaming.toLowerCase(), 'name': PostCategoryEnum.Gaming.toLowerCase() },
                { 'value': PostCategoryEnum.Hardware.toLowerCase(), 'name': PostCategoryEnum.Hardware.toLowerCase() },
                { 'value': PostCategoryEnum.Life.toLowerCase(), 'name': PostCategoryEnum.Life.toLowerCase() },
                { 'value': PostCategoryEnum.Review.toLowerCase(), 'name': PostCategoryEnum.Review.toLowerCase() }
            ]
        };

        res.render('admin/edit', {
            title: editBlogView.header,
            isauthenticated: req.session.isauthenticated,
            post: editBlogView
        });

    } else {
        res.redirect('../login');
    }
}).post('/update', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Blog.updatePost(req.body.category, req.body.header, req.body.ispublished, req.description, req.body, req.id);

        if (result) {
            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Success,
                        msg: `The post ${result.id} was updated!`
                    }
                ]
            );

            res.redirect('/admin/blogs');
        }
    } else {
        res.redirect('../login');
    }
});

// activate
router.get('/activate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;

        const result = Blog.updatePostPublished(true, req.params.id);
        if (result) {
            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Success,
                        msg: `The post ${result.id} was activated!`
                    }
                ]
            );
            res.redirect('/admin/blogs');
        }
    } else {
        res.redirect('../login');
    }
});

// deactivate
router.get('/deactivate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Blog.updatePostPublished(false, req.params.id);
        if (result) {
            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Warning,
                        msg: `The post ${result.id} was deactivated!`
                    }
                ]
            );

            res.redirect('/admin/blogs');
        }
    } else {
        res.redirect('../login');
    }
});

// delete permanently
router.get('/delete/:id', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Blog.deletePostPermanently(req.params.id);

        if (result) {

            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Error,
                        msg: `The post ${result.id} was permanently deleted!`
                    }
                ]
            );

            res.redirect('/admin/blogs');
        }
    } else {
        res.redirect('../login');
    }
});

export default router;