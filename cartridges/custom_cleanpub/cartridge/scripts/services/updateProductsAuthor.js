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
                sku: porduct.sku,
                name: product.name,
                description: product.description,
                minimumPrice: product.minimumPrice,
                suggestedPrice: product.suggestedPrice,
                fullfilment: product.fullfilment
            };
            return JSON.stringify(req);
        },
    })
}