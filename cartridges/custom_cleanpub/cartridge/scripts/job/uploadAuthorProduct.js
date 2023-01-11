"use strict";

var CSVStreamReader = require('dw/io/CSVStreamReader');
var File = require('dw/io/File');
var ProductMgr = require('dw/catalog/ProductMgr');

function execute() {

    var PATH = "/import/products/"
    var FULL_PATH = File.getFullPath(File.IMPEX, PATH)
    var authorsFolders = new File(FULL_PATH)
    var listFolders = authorsFolders.list()
    var UploadAuthorProductService = require('~/cartridge/scripts/services/uploadAuthorProduct') 

    listFolders.forEach(folderAuthor => {

        folderAuthor = folderAuthor.replace("/", "") // pulisce /authorId per avere solo id senza '/'
        var openedProductsFile = new File(File.IMPEX + PATH + folderAuthor + "/products.csv")
        if (openedProductsFile.exist()) {      

            // var queryString = "custom.authorId LIKE '".concat(folderAuthor, "*'");
            // var productsAuthor = SystemObjectMgr.querySystemObjects("bookProduct",queryString,null);
            
            var csvFileReader = new CSVStreamReader(openedProductsFile)

            while (csvFileReader.hasNext()) {

                var line = csvFileReader.next()
                var sku = line[0]
                line.push(line[0] + "-" + folderAuthor)
                UploadAuthorProductService.call(line)//non sono sicuro sia giusto

                // line[sku, name, description, minimumPrice, suggestedPrice, fullfilment, mainSku]

                // NON DOVREBBE SERVIRE PERCHè IL SERVIZIO NON FA DISTIZIONE SE DEVE CREARE O AGGIORNARE UN PRODOTTO
                // if(sku in productsAuthor.sku){
                   

                // } else { //altrimenti crea un nuovo prodotto
                //     // Dobbiamo andare a fare write di un file newProducts.xml 
                   
                // }

            }

            csvFileReader.close();

            //va cancellato il file PATH + AUTHOR + /products.csv
            openedProductsFile.remove()

        }
        
    });
    

}

module.exports = {
    execute: execute
};
