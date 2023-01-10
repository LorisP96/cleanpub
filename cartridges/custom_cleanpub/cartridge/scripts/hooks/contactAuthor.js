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
    mail.addTo(contactDetails.authorId);
    mail.setFrom(contactDetails.contactEmail);
    mail.setSubject("INFORMATION");

    mail.setContent(content);
    mail.send();

    return;
}

//facciamo l'export di contactAuthor
module.exports = {
    contactAuthor
}