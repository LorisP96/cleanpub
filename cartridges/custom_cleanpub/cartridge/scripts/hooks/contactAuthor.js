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

    //creiamo una nuova mail e settiamo gli elementi addTo setFrom setSubject e setContent, infine inviamo la mail
    // var mail = new Mail();
    // mail.addTo(contactDetails[email]);
    // mail.setFrom();
    // mail.setSubject("CLEANPUB SITE CONTACT FORM");
    // SETTARE DINAMICAMENTE L'EMAIL DI DESTINAZIONE PRENDENDOLA DAL AUTHOR CUSTOM OBJ 

    mail.setContent(content);
    mail.send();

    return;
}

//facciamo l'export di contactAuthor
module.exports = {
    contactAuthor
}