"use strict";

var Site = require('dw.system.Site');
var Svc = require('dw/svc');

function updateProductAuthor(product) {
    var req;
    var currentSite = Site.getCurrent();
    var URL = `https://hostname:port/dw/data/v23_1/products/${product.id}`;

    return Svc.LocalServiceRegistry.createService('data.api.create.product',{
        createRequest: function(svc, URL) {
            svc.URL = URL;
            svc.setRequestMethod('PUT');
            svc.addHeader("Authorization","Bearer" + currentSite.getCustomPreferenceValue('client_id'));
            req = {
                owning_catalog_id: 'WapiCatalog',
                sku: product[6],
                name: product[1],
                description: product[2],
                minimumPrice: product[3],
                suggestedPrice: product[4],
                fullfilment: product[5]
            };
            return JSON.stringify(req);
        },
        parseResponse: function(svc, client) {
            var response = parseResponse(svc, client);
            return response;
        }
    });
}

function isResponseJSON(client) {
    var contentTypeHeader = client.getResponseHeader('Content-Type');
    return(
        contentTypeHeader &&
        contentTypeHeader.split(';')[0].toLowerCase() === 'application/json'
    );
}

function parseResponse(svc,client) {
    var isJSON = isResponseJSON(client);
    var isError = client.statusCode != 201;
    var parsedBody;

    if(isJSON) {
        try {
            parsedBody = JSON.parse(client.text);
        } catch(e) {
            parsedBody = client.text;
        }
    } else {
        parsedBody = client.text;
    }

    return {
        isValidJSON: isJSON,
        isError: isError,
        responseObj: parsedBody,
        errorText: client.errorText,
    };
}

module.exports = updateProductAuthor();