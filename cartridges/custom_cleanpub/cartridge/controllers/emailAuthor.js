'use strict';

var server = require('server');

server.get('new', server.middleware.https, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    // prelevare authorid da query string
    res.render('emailAuthor/emailAuthor.isml', {
        actionUrl: URLUtils.url('emailAuthor').toString(),
        authorId: authorId
    });

    next();
});

server.post('post', server.middleware.https, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    var emailHelper = require('*/cartridge/scripts/helpers/emailHelpers');
    var hook;

    var myForm = req.form;
    var isValidEmailid = emailHelper.validateEmail(myForm.email);
    if (isValidEmailid) {
        var contactDetails = [myForm.email, myForm.message];
        // hooksHelper('app.sendEmailToAuthor.contactAuthor', 'contactAuthor', contactDetails, function () {});
        hooksHelper('app.sendEmailToAuthor.contactAuthor', 'contactAuthor', contactDetails, function () { });

        res.json({
            success: true,
            msg: Resource.msg('subscribe.to.contact.us.success', 'contactAuthor', null)
        });
    } else {
        res.json({
            error: true,
            msg: Resource.msg('subscribe.to.contact.us.email.invalid', 'contactAuthor', null)
        });
    }

    next();
});

module.exports = server.exports();
