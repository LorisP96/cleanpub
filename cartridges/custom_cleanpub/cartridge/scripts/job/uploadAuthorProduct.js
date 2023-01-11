"use strict";

var CSVStreamReader = require('dw/io/CSVStreamReader');
var File = require('dw/io/File');
var ProductMgr = require('dw/catalog/ProductMgr');

function execute() {

    var PATH = "/import/products/"
    var FULL_PATH = File.getFullPath(File.IMPEX, PATH)
    var authorsFolders = new File(FULL_PATH)
    var listFolders = authorsFolders.list()
    var UploadAuthorProductService = require('~/cartridge/scripts/services/productsService') 

    listFolders.forEach(folderAuthor => {

        folderAuthor = folderAuthor.replace("/", "") // pulisce /authorId per avere solo id senza '/'
        var openedProductsFile = new File(File.IMPEX + PATH + folderAuthor + "/products.csv")
        if (openedProductsFile.exist()) {      
            
            var csvFileReader = new CSVStreamReader(openedProductsFile, ',', '"', 1)
            var lineIterator = csvFileReader.readAll();

            while (lineIterator.hasNext()) {

                var line = lineIterator.next().Array()
                var sku = line[0]
                line.push(line[0] + "-" + folderAuthor)
                UploadAuthorProductService.call(line)
                // line[sku, name, description, minimumPrice, suggestedPrice, fullfilment, mainSku]
            }

            csvFileReader.close();
            openedProductsFile.remove()

        }
        
    });
    

}

module.exports = {
    execute: execute
};
