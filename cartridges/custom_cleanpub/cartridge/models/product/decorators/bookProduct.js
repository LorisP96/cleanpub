'use strict';

module.exports = function (object, product) {
    Object.defineProperty(object, 'sku', {
        enumerable: true,
        value: product.sku
    });
    Object.defineProperty(object, 'minimumPrice', {
        enumerable: true,
        value: product.minimumPrice
    });
    Object.defineProperty(object, 'suggestedPrice', {
        enumerable: true,
        value: product.suggestedPrice
    });
    Object.defineProperty(object, 'fullfilment', {
        enumerable: true,
        value: product.fullfilment
    });
    Object.defineProperty(object, 'mainSku', {
        enumerable: true,
        value: product.mainSku
    });
    Object.defineProperty(object, 'url', {
        enumerable: true,
        value: product.url
    });
};

