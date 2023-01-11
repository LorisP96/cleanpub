"use strict";

var CSVStreamReader = require('dw/io/CSVStreamReader');
var File = require('dw/io/File');
var SystemObjectMgr = require('dw.object.SystemObjectMgr');

function execute() {

    var PATH = "/import/products/"
    var FULL_PATH = File.getFullPath(File.IMPEX, PATH)
    var authorsFolders = new File(FULL_PATH)
    var listFolders = authorsFolders.list()

    listFolders.forEach(folderAuthor => {
        var openedProductsFile = new File(File.IMPEX + PATH + folderAuthor + "/products.csv")
        if (openedProductsFile.exist()) {      

            var queryString = "custom.authorId LIKE '".concat(folderAuthor, "*'");
            var productsAuthor = SystemObjectMgr.querySystemObjects("bookProduct",queryString,null);
            
            var csvFileReader = new CSVStreamReader(openedProductsFile)

            while (csvFileReader.hasNext()) {

                var line = csvFileReader.next()
                var sku = line[0]

                // se c'è è un Update
                if(sku in productsAuthor.sku){
                    // Dobbiamo andare a fare write di un file productsUpdate.xml 
                    // Va assegnato per che autore

                } else { //altrimenti crea un nuovo prodotto
                    // Dobbiamo andare a fare write di un file newProducts.xml 
                    // Va assegnato per autore
                }

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
