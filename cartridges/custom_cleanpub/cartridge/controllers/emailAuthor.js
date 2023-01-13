'use strict';

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache')
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking')

server.get('New', cache.applyPromotionSensitiveCache, consentTracking.consent, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils')
    var authorHelpers = require('*/cartridge/scripts/helpers/authorHelpers')
    var authorId = req.querystring.authorId
    res.render('emailAuthor/emailAuthor.isml', {
        actionUrl: URLUtils.url('emailAuthor','authorId',authorId).toString(),
        authorName: authorHelpers.getName(authorId),
        productName: req.querystring.name
    });

    next();
});

server.post('EmailAuthor', cache.applyPromotionSensitiveCache, consentTracking.consent, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    var emailHelper = require('*/cartridge/scripts/helpers/emailHelpers');
    var hook;

    var myForm = req.form;
    var isValidEmailid = emailHelper.validateEmail(myForm.email);
    if (isValidEmailid) {
        var contactDetails = [myForm.authorId, myForm.email, myForm.message];
        HookMgr.callHook('app.sendEmailToAuthor.contactAuthor', 'contactAuthor', contactDetails, function () {});

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
