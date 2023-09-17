import express from "express";
import Event from "../models/event";
const router = express.Router();

// events
router.get('/', (req, res, next) => {
    if (req.session.isauthenticated) {

        const result = Event.getAll();
        res.render('admin/events', {
            'title': 'Events',
            'isauthenticated': req.session.isauthenticated,
            'events': result
        });

    } else {
        res.redirect('../login');
    }
});

export default router;