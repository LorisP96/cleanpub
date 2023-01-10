'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');

module.exports = function (object, product) {
    Object.defineProperty(object, 'authorId', {
        enumerable: true,
        value: product.custom.authorId
    });
};