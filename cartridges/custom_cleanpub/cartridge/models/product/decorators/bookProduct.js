'use strict';

var stringUtils = require('dw/util/StringUtils');

var Calendar = require('dw/util/Calendar');

/**
 * Convert API price to an object
 * @param {dw.value.Money} price - Price object returned from the API
 * @returns {Object} price formatted as a simple object
 */
function toPriceModel(price) {
    var value = price.available ? price.getDecimalValue().get() : null;
    var currency = price.available ? price.getCurrencyCode() : null;
    var formattedPrice = price.available ? stringUtils.formatMoney(price) : null;
    var decimalPrice;

    if (formattedPrice) { decimalPrice = price.getDecimalValue().toString(); }

    return {
        value: value,
        currency: currency,
        formatted: formattedPrice,
        decimalPrice: decimalPrice
    };
}

function lastUpdateDate(date) {
    var calendar = new Calendar(date)
    var lastUpdate = stringUtils.formatCalendar(calendar,"YYYY-MM--DD")
    return lastUpdate
}

module.exports = function (object, product) {
    Object.defineProperty(object, 'sku', {
        enumerable: true,
        value: product.custom.sku
    });
    Object.defineProperty(object, 'minimumPrice', {
        enumerable: true,
        value: toPriceModel(new Price(product.custom.minimumPrice,'USD'))
    });
    Object.defineProperty(object, 'suggestedPrice', {
        enumerable: true,
        value: toPriceModel(new Price(product.custom.suggestedPrice,'USD'))
    });
    Object.defineProperty(object, 'productReadiness', {
        enumerable: true,
        value: product.custom.productReadiness
    });
    Object.defineProperty(object, 'mainSku', {
        enumerable: true,
        value: product.custom.mainSku
    });
    Object.defineProperty(object, 'url', {
        enumerable: true,
        value: product.custom.url
    });
    Object.defineProperty(object, 'lastUpdate', {
        enumerable: true,
        value: lastUpdateDate(product.custom.lastUpdate)
    });
};

