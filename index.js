import express from "express";
import session from "express-session";
import path from "path";
import errors from "http-errors";

import aboutRoutes from "./routes/aboutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import SeedDb from "./seedDb.js";

const port = 8080;
const app = express();

const isProduction = process.env.ENVIRONMENT === 'production';

const sess = {
  secret: isProduction ? process.env.SESSION_SECRET : 'dev-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

if (isProduction) {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

// view engine setup
app.set('views', path.join(import.meta.dir, 'views'));
app.set('view engine', 'vash');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(import.meta.dir, 'public')));

app.use('/about', aboutRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);
app.use('/event', eventRoutes);
app.use('/', indexRoutes);
app.use('/settings', settingsRoutes);
app.use('/login', loginRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});