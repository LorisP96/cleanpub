"use strict";

var Site = require('dw.system.Site');
var Svc = require('dw/svc');
var currentSite = Site.getCurrent();
var WETRANSFER_KEY = currentSite.getCustomPreferenceValue('wetransfer_key');
var token;

function weTransferAuthorization() {
    return Svc.LocalServiceRegistry.createService('WeTransfer.createLink',{
        createRequest: function(svc, URL) {
            svc.URL = URL + "/authorize"
            svc.setRequestMethod('POST');
            svc.addHeader("x-api-key", WETRANSFER_KEY)
            svc.addHeader("Content-Type", "application/json")
        },
        parseResponse: function(svc, client) {
            var response = parseResponse(svc, client);
            return response;
        }
    });
}

function weTransferTransfer(name, description) {
    return Svc.LocalServiceRegistry.createService('WeTransfer.createLink',{
        createRequest: function(svc, URL) {
            svc.URL = URL + "/transfer"
            svc.setRequestMethod('POST')
            svc.addHeader("x-api-key", WETRANSFER_KEY)
            svc.addHeader("Authorization", "Bearer" + token) 
            svc.addHeader("Content-Type", "application/json")
            var data = {
                name: name,
                description: description
            }
            return JSON.stringify(data)
        },
        parseResponse: function(svc, client) {
            var response = parseResponse(svc, client);
            return response;
        }
    })
}

function weTransferAddItemsToTransfer(transferId,file) {
    return Svc.LocalServiceRegistry.createService('WeTransfer.createLink', {
        createRequest: function(svc, URL) {
            svc.URL = URL + `/transfer/${transferId}/items`
            svc.setRequestMethod('POST')
            svc.addHeader("x-api-key", WETRANSFER_KEY)
            svc.addHeader("Authorization", "Bearer" + token) 
            svc.addHeader("Content-Type", "application/json")

            var urlObject = {
                items: [
                    {
                        url: file.getFullPath(),
                        content_identifier: "web_content",
                        local_identifier: file.getName(),
                        meta: {"title":`${file.getName()}`}
                    }
                ]
            }

            return JSON.stringify(urlObject)
        },
        parseResponse: function(svc, client) {
            var response = parseResponse(svc, client);
            return response;
        }
    })
}

function weTransferRequestUploadUrl(file_id, part_number, multipart_upload_id) {
    return Svc.LocalServiceRegistry.createService('WeTransfer.createLink', {
        createRequest: function(svc, URL) {
            svc.URL = URL + `/files/${file_id}/uploads/${part_number}/${multipart_upload_id}`
            svc.setRequestMethod('GET')
            svc.addHeader("x-api-key", WETRANSFER_KEY)
            svc.addHeader("Authorization", "Bearer" + token) 
            svc.addHeader("Content-Type", "application/json")
        },
        parseResponse: function(svc, client) {
            var response = parseResponse(svc, client);
            return response;
        }
    })
}

function weTransferFileUpload(signed_url) {
    return Svc.LocalServiceRegistry.createService('WeTransfer.createLink', {
        createRequest: function(svc, URL) {
            svc.URL = URL + `${signed_url}`
            svc.setRequestMethod('PUT')
        },
        parseResponse: function(svc, client) {
            var response = parseResponse(svc, client);
            return response;
        }
    })
}

function weTransferCompleteFileUpload(file_id) {
    return Svc.LocalServiceRegistry.createService('WeTransfer.createLink', {
        createRequest: function(svc, URL) {
            svc.URL = URL + `/files/${file_id}/uploads/complete`
            svc.setRequestMethod('POST')
            svc.addHeader("x-api-key", WETRANSFER_KEY)
            svc.addHeader("Authorization", "Bearer" + token) 
            svc.addHeader("Content-Type", "application/json")
        },
        parseResponse: function(svc, client) {
            var response = parseResponse(svc, client);
            return response;
        }
    })
}

function weTransfer(file) {
    weTransferAuthorization().then(
        (result) => {
            if(result.isError) {
                console.log(result.errorText)
                return;
            }
            token = result.responseObj.token
            weTransferTransfer(file.name, "file_description").then(
                (result) => {
                    if(result.isError) {
                        console.log(result.errorText)
                        return;
                    }
                    var shorted_url = result.responseObj.shorted_url
                    product.shorted_url = shorted_url
                    var transferId = result.responseObj.id
                    weTransferAddItemsToTransfer(transferId, file).then(
                        (result) => {
                            if(result.isError) {
                                console.log(result.errorText)
                                return;
                            }
                            var file_id = result.responseObj[0].id
                            var part_number = result.responseObj[0].meta[0]
                            var multipart_upload_id = result.responseObj[0].meta[1]
                            weTransferRequestUploadUrl(file_id, part_number, multipart_upload_id).then(
                                (result) => {
                                    if(result.isError) {
                                        console.log(result.errorText)
                                        return;
                                    }
                                    weTransferFileUpload(result.responseObj.upload_url).then(
                                        (result) => {
                                            if(result.isError) {
                                                console.log(result.errorText)
                                                return;
                                            }
                                            weTransferCompleteFileUpload(file.id)
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            )
        }
    )
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

module.exports = weTransferDownload();