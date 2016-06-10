var User = require('mongoose').model('User');
var passport = require('passport');
var http = require('http');
var getErrorMessage = function (err) {
  var message = '';
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message)
         message = err.errors[errName].message;
    }
  }

  return message;
};

exports.renderSignin = function (req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title: 'Sign-in Form',
      messages: req.flash('error') || req.flash('info'),
    });
  } else {
    return res.redirect('/');
  } };

exports.bookmeeting = function (req, res, next) {
  if (!req.user) {
    res.render('signin', {
        title: 'Sign-in Form',
        messages: req.flash('error') || req.flash('info'),
      });
  } else {
    res.render('bookmeeting', {
          title: 'Book Meeting Form',
          userFullName: req.user ? req.user.fullName : '',
          messages: req.flash('error') || req.flash('info'),
        });
  } };

var count = (function () {
  var seq = 0;
  return function () { return seq += 1; };
})();

exports.validatebookmeeting = function (req, res, next) {
  if (req) {
    var calendarJSON = {};
    var d = new Date();
    calendarJSON.calendarId = d.getYear().toString() + d.getMonth().toString();
    calendarJSON.calendarId += d.getDate().toString() + count();
    calendarJSON.StartDate = req.body.dateOfMeeting;
    calendarJSON.StartTime = req.body.timeOfMeeting;
    calendarJSON.Duration = req.body.durationOfMeeting;
    calendarJSON.subject = req.body.subjectOfMeeting;
    var optionsCalenderID = {
      host: 'http://localhost',
      port: 5000,
      path: '/calendarId',
      method: 'post',
      headers: { Accept: 'application/json' },
      body: calendarJSON,
    };
    http.request(optionsCalenderID, function (response) {
      if (response.statusCode === 200) {
        res.send('Meeting Booked');
      } else {
        res.send('Meeting Not Booked');
      }
    });
  }
};

exports.renderSignup = function (req, res, next) {
  if (!req.user) {
    res.render('signup', {
      title: 'Sign-up Form',
      messages: req.flash('error'),
    });
  } else {
    return res.redirect('/');
  }
};

exports.signup = function (req, res, next) {
  if (!req.user) {
    var user = new User(req.body);
    var message = null;
    user.provider = 'local';
    user.save(function (err) {
      if (err) {
        var message = getErrorMessage(err);
        req.flash('error', message);
        return res.redirect('/signup');
      }

      req.login(user, function (err) {
           if (err) return next(err);
           return res.redirect('/');
         });
    });
  } else {
    return res.redirect('/');
  }
};

exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};
