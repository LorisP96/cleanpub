'use strict';
//Fare il require di mail e lo assegna a Mail
var Mail = require('dw/net/Mail');

/**
 * Send contact form data to client
 * @param {Array} contactDetails  - The contact form data
 * @return void
 */
function contactAuthor(contactDetails) {

    //Creare una stringa content prendendo gli elementi di contactDetails
    var content = contactDetails[message];

    var mail = new Mail();
    mail.addTo(getAuthorEmail(authorId));
    mail.setFrom(contactDetails.contactEmail);
    mail.setSubject("INFORMATION");

    mail.setContent(content);
    mail.send();

    return;
}

function getAuthorEmail(authorId) {
    var queryString = "custom.authorId LIKE '".concat(authorId, "*'");
    var searchQuery = CustomObjectMgr.queryCustomObjects('authorEmail', queryString, null);
    var authorEmail = searchQuery.next();
    searchQuery.close();
    return authorEmail;
}

//facciamo l'export di contactAuthor
module.exports = {
    contactAuthor
}