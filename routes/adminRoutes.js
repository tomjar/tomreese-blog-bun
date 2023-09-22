import Blog from "../models/blog";
import PostCategoryEnum from "../enums/postcategoryenum";
import ToastrTypeEnum from "../enums/toastrtypeenum";
import Event from "../models/event";
import Settings from "../models/settings";
import express from "express";
import eventcategoryenum from "../enums/eventcategoryenum";
const router = express.Router();

// index admin dashboard
router.get('/', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    let viewmodel = {
        'title': 'admin dashboard',
        'isauthenticated': req.session.isauthenticated,
        toastr_messages: req.session.toastr_messages
    };

    res.render('admin/index', viewmodel);
});

// // all blogs
router.get('/blogs', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    Blog.getAll().then((result) => {

        const allBlogsViewModel = {
            title: 'All Blogs',
            isauthenticated: req.session.isauthenticated,
            blogs: result,
            toastr_messages: req.session.toastr_messages
        };

        req.session.toastr_messages = null;
        res.render('admin/blogs', allBlogsViewModel);

    }).catch((err) => {
        next(err);
    });
});

// add
router.get('/blog/add', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    res.render('admin/add', {
        'title': 'Add New Blog',
        'isauthenticated': req.session.isauthenticated,
        'categories': PostCategoryEnum.NameValueEnumArr
    });

}).post('/blog/add', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    Blog.insertBlog(req.body.header, req.body.description, req.body.name, req.body.category, req.body.body)
        .then((result) => {
            if (result) {
                req.session.toastr_messages = JSON.stringify(
                    [
                        {
                            type: ToastrTypeEnum.Success,
                            msg: `The post ${req.body.name} was added!`
                        }
                    ]
                );

                res.redirect('admin/blogs');
            }
        })
        .catch((err) => {
            next(err);
        });
});

// update
router.get('/blog/update/:id', (req, res, next) => {
    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    const blogId = parseInt(req.params.id);
    if (!Number.isInteger(blogId)) {

        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Error,
                    msg: `No such blog!`
                }
            ]
        );
        res.redirect('/');
    }

    Blog.getBlogById(blogId).then((result) => {
        if (result) {

            const editBlogView = {
                'id': result.id,
                'header': result.header,
                'ispublished': result.ispublished,
                'description': result.description,
                'name': result.name,
                'category': result.category.toLowerCase(),
                'body': result.body,
                'categories': PostCategoryEnum.NameValueEnumArr
            };

            res.render('admin/edit', {
                title: editBlogView.header,
                isauthenticated: req.session.isauthenticated,
                blog: editBlogView,
                toastr_messages: req.session.toastr_messages
            });
        } else {
            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Error,
                        msg: `No such blog!`
                    }
                ]
            );
            res.redirect('/');
        }
    }).catch((err) => {
        next(err);
    });
}).post('/blog/update', (req, res, next) => {
    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    Blog.updateBlog(req.body.category, req.body.header, req.body.ispublished, req.body.description, req.body.body, req.body.id)
        .then((result) => {
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
        }).catch((err) => {
            next(err);
        });
});

// activate
router.get('/blog/activate/:id', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    const id = req.params.id;
    Blog.updateBlogPublished(true, id).then((result) => {
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
    }).catch((err) => {
        next(err);
    });
});

// deactivate
router.get('/blog/deactivate/:id', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    Blog.updateBlogPublished(false, req.params.id).then((result) => {
        if (result) {
            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Warning,
                        msg: `The post ${result.id} was deactivated!`
                    }
                ]
            );

            res.redirect('admin/blogs');
        }
    }).catch((err) => {
        next(err);
    });
});

// delete permanently
router.get('/blog/delete/:id', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    Blog.deleteBlogPermanently(req.params.id).then((result) => {
        if (result) {

            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Error,
                        msg: `The post ${result.id} was permanently deleted!`
                    }
                ]
            );

            res.redirect('admin/blogs');
        }
    }).catch((err) => {
        next(err);
    });
});

// events
router.get('/events', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    Event.getAll().then((result) => {
        res.render('admin/events', {
            'title': 'Events',
            'isauthenticated': req.session.isauthenticated,
            'events': result
        });
    }).catch((err) => {
        next(err);
    });
});

// // settings
router.get('/settings', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    const settingsViewModel = {
        'title': 'Settings',
        'isauthenticated': req.session.isauthenticated,
        'about_section': '',
        'archive_view': '',
        'archive_view_categories': eventcategoryenum.ValueNameEnumArray,
        'toastr_messages': req.session.toastr_messages
    };

    Settings.getSettings()
        .then((result) => {
            settingsViewModel.about_section = result.about_section;
            settingsViewModel.archive_view = result.archive_view;

            req.session.toastr_messages = null;
            res.render('admin/settings', settingsViewModel);
        }).catch((err) => {
            next(err);
        });

}).post('/settings', (req, res, next) => {

    if (!req.session.isauthenticated) {
        req.session.toastr_messages = JSON.stringify(
            [
                {
                    type: ToastrTypeEnum.Warning,
                    msg: `Please login.`
                }
            ]
        );
        res.redirect('/login');
    }

    Settings.updateSettings(req.body.archiveView, req.body.about).then((result) => {
        if (result) {
            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: tte.Success,
                        msg: 'The Settings were successfully updated!'
                    }
                ]
            );
        }
        res.redirect('/admin/settings');
    }).catch((err) => {
        next(err);
    })

});

export default router;