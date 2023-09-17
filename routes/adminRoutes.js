import express from "express";
const router = express.Router();
 
 // index admin dashboard
router.get('/', (req, res, next) => {
  if (req.session.isauthenticated) {

      let viewmodel = {
          'title': 'admin dashboard',
          'isauthenticated': req.session.isauthenticated
      };

      res.render('admin/index', viewmodel);
  } else {
      res.redirect('../login');
  }
});

export default router;