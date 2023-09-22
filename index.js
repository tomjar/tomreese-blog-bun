import express from "express";
import session from "express-session";
import path from "path";
import errors from "http-errors";

import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import Utility from "./models/utility.js";
import CowSay from "cowsay";

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

// helpful seed logic to get up and running quickly
// await Utility.seedSqliteDb();

// view engine setup
app.set('views', path.join(import.meta.dir, 'views'));
app.set('view engine', 'vash');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(import.meta.dir, 'public')));
app.use('/stylesheets', express.static(import.meta.dir + '/node_modules/trumbowyg/dist/ui'));
app.use('/stylesheets', express.static(import.meta.dir + '/node_modules/toastr/build'));
app.use('/javascripts', express.static(import.meta.dir + '/node_modules/jquery/dist'));
app.use('/javascripts', express.static(import.meta.dir + '/node_modules/trumbowyg/dist'));
app.use('/javascripts', express.static(import.meta.dir + '/node_modules/toastr'));

app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);
app.use('/', indexRoutes);
app.use('/login', loginRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(errors(404));
});

// error handler
app.use(function (err, req, res, next) {
  const cowSayErr = CowSay.say({
    text: `${err.status}: ${err.message}`,
    e: "Oo",
  });

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = !isProduction ? err : {};
  res.locals.cowSayErr = cowSayErr;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});