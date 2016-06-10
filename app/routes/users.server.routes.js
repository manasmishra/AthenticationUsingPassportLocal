var users = require('../../app/controllers/users.server.controller');
var passport = require('passport');
module.exports = function (app) {
     app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);
     app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local', {
          successRedirect: '/bookmeeting',
          failureRedirect: '/signin',
          failureFlash: true,
        }));
     app.get('/bookmeeting', users.bookmeeting);
     app.post('/bookmeeting', users.validatebookmeeting);
     app.post('/calendarId', users.bookCalendarId);
     app.get('/signout', users.signout);
   };
