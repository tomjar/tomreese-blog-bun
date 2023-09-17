import Blog from "../models/blog";
import PostCategoryEnum from "../enums/postcategoryenum";
import ToastrTypeEnum from "../enums/toastrtypeenum";
import Event from "../models/event";
import Settings from "../models/settings";
import express from "express";
const router = express.Router();
 
 // index admin dashboard
router.get('/', (req, res, next) => {
  if (req.session.isauthenticated) {

      let viewmodel = {
          'title': 'admin dashboard',
          'isauthenticated': req.session.isauthenticated,
          toastr_messages: req.session.toastr_messages
      };

      res.render('admin/index', viewmodel);
  } else {
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
});

// // all blogs
router.get('/blogs', (req, res, next) => {
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
});

// add
router.get('/blog/add', (req, res, next) => {
    if (req.session.isauthenticated) {

        const categories = [
            { 'value': PostCategoryEnum.Bicycle.toLowerCase(), 'name': PostCategoryEnum.Bicycle.toLowerCase() },
            { 'value': PostCategoryEnum.Code.toLowerCase(), 'name': PostCategoryEnum.Code.toLowerCase() },
            { 'value': PostCategoryEnum.Gaming.toLowerCase(), 'name': PostCategoryEnum.Gaming.toLowerCase() },
            { 'value': PostCategoryEnum.Hardware.toLowerCase(), 'name': PostCategoryEnum.Hardware.toLowerCase() },
            { 'value': PostCategoryEnum.Life.toLowerCase(), 'name': PostCategoryEnum.Life.toLowerCase() },
            { 'value': PostCategoryEnum.Review.toLowerCase(), 'name': PostCategoryEnum.Review.toLowerCase() }
        ];

        res.render('admin/add', {
            'title': 'Add New Blog',
            'isauthenticated': req.session.isauthenticated,
            'categories': categories
        });
    } else {
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
}).post('/blog/add', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Blog.insertBlog(req.body.header, req.body.description, req.body.name, req.body.category, req.body.body);

        if (result) {
            req.session.toastr_messages = JSON.stringify(
                [
                    {
                        type: ToastrTypeEnum.Success,
                        msg: `The post ${result.name} was added!`
                    }
                ]
            );

            res.redirect('admin/blogs');
        }
    } else {
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
});

// update
router.get('/blog/update/:id', (req, res, next) => {
    if (req.session.isauthenticated) {

        if(!Number.isInteger(req.params.id)){

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

        const result = Blog.getBlogById(req.params.id);

        if(result){
            const categories = [
                { 'value': PostCategoryEnum.Bicycle.toLowerCase(), 'name': PostCategoryEnum.Bicycle.toLowerCase() },
                { 'value': PostCategoryEnum.Code.toLowerCase(), 'name': PostCategoryEnum.Code.toLowerCase() },
                { 'value': PostCategoryEnum.Gaming.toLowerCase(), 'name': PostCategoryEnum.Gaming.toLowerCase() },
                { 'value': PostCategoryEnum.Hardware.toLowerCase(), 'name': PostCategoryEnum.Hardware.toLowerCase() },
                { 'value': PostCategoryEnum.Life.toLowerCase(), 'name': PostCategoryEnum.Life.toLowerCase() },
                { 'value': PostCategoryEnum.Review.toLowerCase(), 'name': PostCategoryEnum.Review.toLowerCase() }
            ];

            const editBlogView = {
                'id': result.id,
                'header': result.header,
                'ispublished': result.ispublished,
                'description': result.description,
                'name': result.name,
                'category': result.category,
                'body': result.body,
                'categories': categories
            };

            res.render('admin/edit', {
                title: editBlogView.header,
                isauthenticated: req.session.isauthenticated,
                blog: editBlogView,
                toastr_messages: req.session.toastr_messages
            });
    }else{
        res.redirect('/');
    }

    } else {
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
}).post('/blog/update', (req, res, next) => {
    if (req.session.isauthenticated) {
        const result = Blog.updateBlog(req.body.category, req.body.header, req.body.ispublished, req.body.description, req.body.body, req.body.id);

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
});

// activate
router.get('/blog/activate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;

        const result = Blog.updateBlogPublished(true, req.params.id);
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
});

// deactivate
router.get('/blog/deactivate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Blog.updateBlogPublished(false, req.params.id);
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
    } else {
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
});

// delete permanently
router.get('/blog/delete/:id', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Blog.deleteBlogPermanently(req.params.id);

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
    } else {
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
});

// events
router.get('/events', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Event.getAll();
        res.render('admin/events', {
            'title': 'Events',
            'isauthenticated': req.session.isauthenticated,
            'events': result
        });

    } else {
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
});

// // settings
router.get('/settings', (req, res, next) => {
    if (req.session.isauthenticated) {

        const settingsViewModel = {
            'title': 'Settings',
            'isauthenticated': req.session.isauthenticated,
            'about_section': '',
            'archive_view': '',
            'archive_view_categories': [
                { 'value': 'category', 'name': 'category' },
                { 'value': 'date', 'name': 'date' }
            ],
            'toastr_messages': req.session.toastr_messages
        };

        const result = Settings.getSettings();

        try {

            settingsViewModel.about_section = result.about_section;
            settingsViewModel.archive_view = result.archive_view;

            req.session.toastr_messages = null;
            res.render('admin/settings', settingsViewModel);
        }
        catch {

            const insertDefaultSettingsResult = Settings.insertDefaultSettings();
            if (insertDefaultSettingsResult) {
                settingsViewModel.about_section = insertDefaultSettingsResult.about_section;
                settingsViewModel.archive_view = insertDefaultSettingsResult.archive_view;
            }
            req.session.toastr_messages = null;
            res.render('admin/settings', settingsViewModel);
        }


    } else {
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
}).post('/settings', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Settings.updateSettings(req.body.archiveView, req.body.about);
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
    } else {
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
});

export default router;