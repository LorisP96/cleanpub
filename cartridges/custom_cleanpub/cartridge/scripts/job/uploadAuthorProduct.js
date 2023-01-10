"use strict";

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
// var logger = require('dw/system/Logger').getLogger('Emailblink', 'subscribe');

var CSVStreamReader = require('dw/io/CSVStreamReader');
var File = require('dw/io/File');

function execute() {


    // DA FARE, sistemare come ciclare tra le cartelle. #################################
    // NB non usare AUTHORID cicla dalle cartelle e prendi l'authorId per fare la query dalla stringa del path
    var PATH = "/import/products/"
    var AUTHORID = 10001
    var FULL_PATH = File.getFullPath(File.IMPEX, PATH)

    var AUTHORS_FOLDER_PATH = new File(FULL_PATH)
    var listFolders = authorsFolders.listFiles(AUTHORS_FOLDER_PATH)

    //Apriamo i files Update e initializeXML
    var indexFolder = 0

    while (listFolders[indexFolder + 1].exist()) { // DA FARE ciclare in modo pulito ###################

        var openedProductsFile = new File(File.IMPEX + PATH + AUTHORID + "/products.csv")
        if (openedProductsFile.exist()) {

            // Querystring per ricevere l'iteratore con i libri per autore. 
            var queryString = "custom.authorId LIKE'".concat(AUTHORID, "*'"); 
            var bookProductIterator = CustomObjectMgr.queryCustomObjects('bookProduct', queryString, null); 

            // i product sono dw.systemProduct  ################################
            // bisogna cancellare i customObj BookProduct e usare i systemProduct.
            var csvFileReader = new CSVStreamReader(openedProductsFile)

            while (csvFileReader.hasNext()) {

                var line = csvFileReader.next()
                var sku = line[0]

                // se c'è è un Update
                if(sku in bookProductIterator.sku){
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

        AUTHORID += 1
        indexFolder ++
    }

    

}

module.exports = {
    execute: execute
};
