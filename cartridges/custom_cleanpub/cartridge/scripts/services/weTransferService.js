"use strict";

var Site = require('dw.system.Site');
var Svc = require('dw/svc');

function weTransferDownload(product) {
    var req;
    var currentSite = Site.getCurrent();

    return Svc.LocalServiceRegistry.createService('WeTransfer.createLink',{
        
    });
}

module.exports = weTransferDownload();