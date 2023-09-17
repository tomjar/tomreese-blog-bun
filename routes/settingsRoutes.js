import express from "express";
import Settings from "../models/settings";
const router = express.Router();

// // settings
router.get('/', (req, res, next) => {
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
        res.redirect('../login');
    }
}).post('/update', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Settings.updateSettings(req.body.archiveView, req.body.aboutSection);
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
        res.redirect('../login');
    }
});

export default router;