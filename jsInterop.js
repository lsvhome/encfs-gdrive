window.fileUtil = {

    checkFileApi: function () {
        // Проверяем поддержку File API 
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Работает

            window.requestFileSystem =
                window.requestFileSystem ||
                window.webkitRequestFileSystem;
            // window.requestFileSystem is undefined on Safari and mobile
            return true;
        } else {
            //debugger;
            //alert('File API не поддерживается данным браузером');
            console.error("error #38475630945 : File API doesn't supported");
            return false;
        }

    },

    initFileApi: function () {

        var promise = new Promise((resolve, reject) => {
            if (fileUtil.checkFileApi()) {
                if (window.File && window.FileReader && window.FileList && window.Blob) {

                    window.requestFileSystem =
                        window.requestFileSystem ||
                        window.webkitRequestFileSystem;
                    //// window.requestFileSystem is undefined on Safari and mobile

                    window.requestFileSystem(window.TEMPORARY,
                        0,
                        (data) => {
                            window.fileUtil.fs = data;
                            resolve(true);
                        },
                        (error) => {
                            console.error(error);
                            reject(false);
                        });
                }
            } else {
                console.error("error #873897439");
                reject(false);
            }
        });

        return promise;
    },


    createFile: function(fileName) {

        let promise = new Promise(function (resolve, reject) {

            function recreate(fs) {
                //debugger;
                fs.root.getFile(fileName,
                    { create: true, exclusive: true },
                    function (fileEntry) {
                        //debugger;
                        // fileEntry будет иметь следующие свойства
                        // fileEntry.isFile === true
                        // fileEntry.name == 'log.txt'
                        // fileEntry.fullPath == '/log.txt'
                        console.log("file was created");
                        resolve(fileEntry.toURL());
                    },
                    (error) => { reject(error); });
                //debugger;
            };

            let dirReader = window.fileUtil.fs.root.createReader();

            dirReader.readEntries(
                (results) =>  {

                    let found = false;

                    if (results.length > 0) {
                        
                        for (i = 0; i < results.length; i++) {
                            let g = results[i];
                            //debugger;
                            if (g.name == fileName) {
                                //debugger;
                                found = true;
                                g.remove((r) => {
                                        //debugger;
                                    recreate(window.fileUtil.fs);
                                    },
                                    (error) => {
                                        //debugger;
                                        reject(error);
                                    });
                            }
                        }
                    }

                    if (!found) {
                        recreate(window.fileUtil.fs);
                    }
                },
                (error) => { reject(error); });
        });

        return promise;
    },

    appendFile: function (filename, bytesBase64) {
        //debugger;
        let promise = new Promise(function(resolve, reject) {
            window.fileUtil.fs.root.getFile(
                filename,
                { create: false },
                (fileEntry) => {
                    //debugger;
                    fileEntry.createWriter(
                        (fileWriter) => {

                            fileWriter.seek(fileWriter.length); // Start write position at EOF.

                            let charArray = atob(bytesBase64);
                            let byteArray = Uint8Array.from(charArray, c => c.charCodeAt(0))
                            var blob = new Blob([byteArray], { type: 'application/octet-binary' });
                            fileWriter.write(blob);
                            resolve(fileEntry);
                        },
                        (error) => { reject(error); });


                },
                (error) => { reject(error); });
        });

        return promise;
    },

    saveLinkAs: function (url, filename) {
        let link = document.createElement('a');
        link.download = filename;
        link.href = url; // "data:application/octet-stream;base64," + bytesBase64;
        document.body.appendChild(link); // Needed for Firefox
        try {
            link.click();
        } catch (e) {
            console.error(e);
        } 
        document.body.removeChild(link);
    }
};

window.jsFunctions = {
    isChrome: function () {
        // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
        let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        return isChrome;
    },


    loadFile: function (inputFileElementRef) {
        console.log(inputFileElementRef + " 001");
        //debugger;
        const temporaryFileReader = new FileReader();
        console.log(temporaryFileReader);
        //temporaryFileReader.

        let tt = document.getElementById(inputFileElementRef);
        let file = tt.files[0];
        //let fileSize = file.size;

        var promise = new Promise((resolve, reject) => {
            console.log(inputFileElementRef + " 002");
            try {

                temporaryFileReader.onerror = () => {
                    console.log("rejected");
                    temporaryFileReader.abort();
                    reject(new DOMException("Problem parsing input file."));
                };
                temporaryFileReader.addEventListener("load", function (aaa) {
                    console.log("onload");
                    debugger;
                    var data = {
                        name: file.name,
                        content: temporaryFileReader.result.split(',')[1]
                    };
                    //var maxLength = 2095788; // base64 length of 1535K file
                    //if (data.content.length > maxLength)
                    //{
                    //    console.log("file size larger than 1535K: " + data.content.length);
                    //    reject("file size larger than 1535K: " + data.content.length);
                    //    return;
                    //}
                    console.log(data.content.length);

                    resolve(data);
                }, false);

                console.log(" 001-1 " + tt);

                console.log("AAA " + file);
                temporaryFileReader.readAsDataURL(file);

                console.log("BBB");
            } catch (e) {
                console.log("ERROR 9845629348");
                console.log(e);
            }

        });

        return promise;
    },

    getFileName: function (inputFileElementRef) {
        console.log(inputFileElementRef + " 001");
        //debugger;
        //temporaryFileReader.

        let tt = document.getElementById(inputFileElementRef);
        let file = tt.files[0];
        return file.name;
    },

    getFileSize: function (inputFileElementRef) {
        console.log(inputFileElementRef + " 001");
        //debugger;
        //temporaryFileReader.

        let tt = document.getElementById(inputFileElementRef);
        let file = tt.files[0];
        let fileSize = file.size;
        return fileSize;
    },

    loadFileChunk: function (inputFileElementRef, start, length) {
        console.debug(inputFileElementRef + " 000 " + start);
        //debugger;
        const temporaryFileReader = new FileReader();
        //console.log(temporaryFileReader);
        //temporaryFileReader.

        let tt = document.getElementById(inputFileElementRef);
        if (tt == null) throw "Error #8437502938";
        if (tt.files == null) throw "Error #238456209370";
        if (tt.files.length == 0) throw "Error #238450293";
        let file = tt.files[0];
        if (file == null) throw "Error #28935729";
        let fileSize = file.size;
        let stop = start + length - 1;
        console.debug("loadFileChunk   " + inputFileElementRef + " 001-1 " + fileSize + "  " + start + "  " + stop);
        if (start < 0) {
            throw "Error #76476456";
        }

        if (stop > file.size) {
            throw "Error #5650986  " + stop + "   " + fileSize;
        }
        let maxLength = 2095788; // base64 length of 1535K file
        if (length > maxLength) {
            throw "Error #51650986";
        }


        var blob = file.slice(start, stop + 1);
        console.debug(inputFileElementRef + " 001-2");
        //debugger;
        var promise = new Promise((resolve, reject) => {
            console.debug(inputFileElementRef + " 002");
            try {

                temporaryFileReader.onerror = () => {
                    console.debug("rejected");
                    temporaryFileReader.abort();
                    reject(new DOMException("Problem parsing input file."));
                };
                temporaryFileReader.addEventListener("load", function () {
                    console.debug("onload");
                    //debugger;
                    var data = {
                        name: file.name,
                        content: temporaryFileReader.result.split(',')[1]
                    };
                    if (data.content.length > maxLength) {
                        console.debug("file size larger than 1535K: " + data.content.length);
                        reject("file size larger than 1535K: " + data.content.length);
                        debugger;
                        return;
                    }

                    console.debug(data.content.length);

                    resolve(data);
                }, false);

                console.debug(" 001-1 " + tt);

                console.debug("AAA " + file.size);
                temporaryFileReader.readAsDataURL(blob);

                console.debug("BBB");
            } catch (e) {
                console.debug("ERROR 98456293148");
                console.error(e);
                debugger;
            }

        });

        return promise;
    },


    checkFileApi: function () {
        // Проверяем поддержку File API 
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Работает

            window.requestFileSystem =
                window.requestFileSystem ||
                window.webkitRequestFileSystem;
            // window.requestFileSystem is undefined on Safari and mobile
        } else {
            debugger;
            //alert('File API не поддерживается данным браузером');
        }

    },

    qq: function () {
        debugger;
        function toArray(list) {
            return Array.prototype.slice.call(list || [], 0);
        };

        function listResults(entries) {
            debugger;
            // Document fragments can improve performance since they're only appended
            // to the DOM once. Only one browser reflow occurs.
            //var fragment = document.createDocumentFragment();

            entries.forEach(function (entry, i) {
                console.log("AAAAAAAAAAAAAAAAAAA " + entry.name);
                //var img = entry.isDirectory ? '<img src="folder-icon.gif">' :
                //    '<img src="file-icon.gif">';
                //var li = document.createElement('li');
                //li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
                //fragment.appendChild(li);
            });

            //document.querySelector('#filelist').appendChild(fragment);
        };

        function onInitFs1(fs) {
            debugger;
            var dirReader = fs.root.createReader();
            var entries = [];

            // Call the reader.readEntries() until no more results are returned.
            var readEntries = function () {
                debugger;
                dirReader.readEntries(function (results) {
                    debugger;
                    if (!results.length) {
                        listResults(entries.sort());
                    } else {
                        entries = entries.concat(toArray(results));
                        readEntries();
                    }
                }, function (e) {
                    console.log(e);
                    debugger;
                });
            };

            readEntries(); // Start reading dirs.

        }
        debugger;
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024, onInitFs1, function (e) {
            console.log(e);
            debugger;
        });
        debugger;
    },
    saveAsFile2: function (filename, localname) {
        jsFunctions.checkFileApi();
        debugger;
        jsFunctions.qq();
        debugger;
        return;
        function errorHandlerAp(e) {
            debugger;
            var msg = '';

            switch (e.code) {
                case 22://FileError.QUOTA_EXCEEDED_ERR:22: //FileError.QUOTA_EXCEEDED_ERR:
                    msg = 'QUOTA_EXCEEDED_ERR';
                    debugger;
                    //window.webkitStorageInfo.requestQuota(PERSISTENT,
                    //    1024 * 1024,
                    //    function (grantedBytes) {
                    //        debugger;
                    //        window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler); errorHandlerAp);
                    //        //initFS(grantedBytes);
                    //    },
                    //    function (e) {
                    //        debugger;
                    //        console.log('Error', e);
                    //    });
                    break;
                //case FileError.NOT_FOUND_ERR:
                //    msg = 'NOT_FOUND_ERR';
                //    break;
                //case FileError.SECURITY_ERR:
                //    msg = 'SECURITY_ERR';
                //    break;
                //case FileError.INVALID_MODIFICATION_ERR:
                //    msg = 'INVALID_MODIFICATION_ERR';
                //    break;
                //case FileError.INVALID_STATE_ERR:
                //    msg = 'INVALID_STATE_ERR';
                //    break;
                default:
                    msg = 'Unknown Error: ' + e; //' + e;
                    break;
            };

            console.log('Error: ' + msg);
            reject(e);
        };
        function onInitFs(fs) {
            debugger;
            //link.href = "data:application/octet-stream;base64," + bytesBase64;
            fs.root.getFile(localname, { create: false }, function (fileEntry) {
                debugger;
                let url = fileEntry.toURL();

                console.log(url);
                var link = document.createElement('a');
                link.download = filename;
                link.href = url; // "data:application/octet-stream;base64," + bytesBase64;
                document.body.appendChild(link); // fileEntry.createWriter(functionNeeded for Firefox
                link.click();
                //console.log("saveAsFile 002 " + filename);
                document.body.removeChild(link);
                //console.log("saveAsFile 003 " + filename);
                //fileEntry.createWriter(function (fileWriter) {

                //    fileWriter.seek(fileWriter.length); // Start write position at EOF.

                //    var bb = new BlobBuilder();
                //    bb.append('Hello World');bb.append(bytesBase64);
                //    fileWriter.write(bb.getBlob('text/plain'));

                //            }, errorHandler);//}, jsFunctions.errorHandler);

                //            }, errorHandler);jsFunctions.errorHandler);

                //        }

                //        window.requestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, errorHandler);
                //}jsFunctions.errorHandler);

            }, errorHandlerAp);
        }

        window.requestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, errorHandlerAp);
    },

    saveAsFile: function (filename, bytesBase64) {
        //console.log("saveAsFile 001 " +filename);
        console.log(bytesBase64.length);
        var link = document.createElement('a');
        link.download = filename;
        link.href = "data:application/octet-stream;base64," + bytesBase64;
        document.body.appendChild(link); // Needed for Firefox
        link.click();
        //console.log("saveAsFile 002 " + filename);
        document.body.removeChild(link);
        //console.log("saveAsFile 003 " + filename);
    },
    /*
    showPrompt: function (text) {
        return prompt(text, 'Type your name here');
    },
    displayWelcome: function (welcomeMessage) {
        document.getElementById('welcome').innerText = welcomeMessage;
    },

*/
    showModalDialog: function (modalId) {
        //debugger;
        console.log(modalId);
        var promise = new Promise(function (resolve, reject) {
            try {

                let foundModals = $('#' + modalId);
                console.log(foundModals.length);
                foundModals[0].result = false;
                var handler = function (e) {

                    //alert('hidden');
                    foundModals.off("hidden.bs.modal", handler);
                    if (foundModals[0].result == true) {
                        resolve(true);
                    }
                    else if (foundModals[0].result == false) {
                        resolve(false);
                    }
                    else {
                        reject("Unknown result data type.");
                    }

                };
                foundModals.on('hidden.bs.modal', handler);

                //$('#myModal').on('dismiss.bs.modal', function (e) {
                //    alert('click.dismiss.bs.modal');
                //});
                //$('#bookTitleField').text("AAAAAAAAAAAAAAA");
                foundModals.modal('show');
                //debugger;
                //$('#myModal')[0].resolve = resolve;
                //$('#myModal')[0].reject = reject;
                //setTimeout(() => {
                //    $('#myModal').modal('hide');
                //    $('#myModal')[0].resolve(true);
                //    //resolve(true);

                //}, 5000);
            } catch (e) {
                reject("Exception: " + e);

            }

        });

        return promise;


        //return dotnetHelper.invokeMethodAsync('SayHello')
        //    .then(r => console.log(r));
    },
    /*
    returnArrayAsyncJs: function () {
        DotNet.invokeMethodAsync('BlazorSample', 'ReturnArrayAsync')
            .then(data => {
                data.push(4);
                console.log(data);
            })
    },
    sayHello: function (dotnetHelper) {
        return dotnetHelper.invokeMethodAsync('SayHello')
            .then(r => console.log(r));
    }
    */


    login: function (url001, redirecturl) {

        var result;
        var promise = new Promise(function (resolve, reject) {
            //debugger;
            var win = window.open(url001, "windowname1", 'width=800, height=800');

            var pollTimer = window.setInterval(function () {
                //console.log("pollTimer");
                try {

                    if (true == win.closed && result == undefined) {
                        //console.log("clearInterval 1");
                        result = false;
                        window.clearInterval(pollTimer);
                        reject();
                        return;
                    }

                    var url = "";
                    try {
                        url = win.document.URL;
                    } catch (e) {
                        // there we may got security error (CORs?)
                        return;
                    }

                    if (url.indexOf(redirecturl) != -1) {
                        //console.log("clearInterval 2");
                        window.clearInterval(pollTimer);
                        var acCode = jsFunctions.gup(url, 'code');
                        result = true;
                        win.close();

                        resolve(acCode);
                    }
                } catch (e) {
                    result = false;
                    reject(e);
                }
            }, 300);
        });

        return promise;
    },
    gup: function (url, name) {
        //console.log("gup1 " + url);
        //console.log("gup2 " + name);
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        //console.log("gup3 " + name);
        var regexS = "[\\#&\?]" + name + "=([^&]*)";
        //console.log("gup4 " + regexS);
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        //console.log("gup5 " + results);
        if (results == null) {
            //console.log("gup7 ");
            return "";
        }
        else {
            console.log("gup6 " + results[1]);
            return results[1];
        }
    },

    checkFileApi: function () {
        // Проверяем поддержку File API 
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Работает

            window.requestFileSystem =
                window.requestFileSystem ||
                window.webkitRequestFileSystem;
            // window.requestFileSystem is undefined on Safari and mobile
        } else {
            debugger;
            //alert('File API не поддерживается данным браузером');
        }

    },
    //readDirectory: function (directory) {
    //    let dirReader = directory.createReader();
    //    let entries = [];

    //    let getEntries = function () {
    //        dirReader.readEntries(function (results) {
    //            if (results.length) {
    //                entries = entries.concat(toArray(results));
    //                getEntries();
    //            }
    //        }, function (error) {
    //            /* handle error -- error is a FileError object */
    //        });
    //    };

    //    getEntries();
    //    return entries;
    //},
    errorHandler: function (e) {
        //debugger;
        var msg = '';

        switch (e.code) {
            case 22://FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                debugger;
                window.webkitStorageInfo.requestQuota(PERSISTENT, 1024 * 1024, function (grantedBytes) {
                    debugger;
                    window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, jsFunctions.errorHandler);
                    //initFS(grantedBytes);
                }, function (e) {
                    debugger;
                    console.log('Error', e);
                });
                break;
            //case FileError.NOT_FOUND_ERR:
            //    msg = 'NOT_FOUND_ERR';
            //    break;
            //case FileError.SECURITY_ERR:
            //    msg = 'SECURITY_ERR';
            //    break;
            //case FileError.INVALID_MODIFICATION_ERR:
            //    msg = 'INVALID_MODIFICATION_ERR';
            //    break;
            //case FileError.INVALID_STATE_ERR:
            //    msg = 'INVALID_STATE_ERR';
            //    break;
            default:
                msg = 'Unknown Error: ' + e;
                break;
        };

        console.log('Error: ' + msg);
    },
    createFile: function (fileName) {
        let promise = new Promise(function (resolve, reject) {
            jsFunctions.checkFileApi();

            function errorHandlerCr(e) {
                debugger;
                var msg = '';

                switch (e.code) {
                    case 22: //FileError.QUOTA_EXCEEDED_ERR:
                        msg = 'QUOTA_EXCEEDED_ERR';
                        debugger;
                        window.webkitStorageInfo.requestQuota(PERSISTENT,
                            1024 * 1024,
                            function (grantedBytes) {
                                debugger;
                                window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, jsFunctions.errorHandler);
                                //initFS(grantedBytes);
                            },
                            function (e) {
                                debugger;
                                console.log('Error', e);
                            });
                        break;
                    //case FileError.NOT_FOUND_ERR:
                    //    msg = 'NOT_FOUND_ERR';
                    //    break;
                    //case FileError.SECURITY_ERR:
                    //    msg = 'SECURITY_ERR';
                    //    break;
                    //case FileError.INVALID_MODIFICATION_ERR:
                    //    msg = 'INVALID_MODIFICATION_ERR';
                    //    break;
                    //case FileError.INVALID_STATE_ERR:
                    //    msg = 'INVALID_STATE_ERR';
                    //    break;
                    default:
                        msg = 'Unknown Error: ' + e;
                        break;
                };

                console.log('Error: ' + msg);
                reject(e);
            };

            function cr(fs) {
                //debugger;
                fs.root.getFile(fileName,
                    { create: true, exclusive: true },
                    function (fileEntry) {
                        //debugger;
                        // fileEntry будет иметь следующие свойства
                        // fileEntry.isFile === true
                        // fileEntry.name == 'log.txt'
                        // fileEntry.fullPath == '/log.txt'
                        console.log("file was created");
                        resolve(fileEntry);
                    },
                    errorHandlerCr);
                //debugger;
            };

            function onInitFs(fs) {
                //debugger;
                let dirReader = fs.root.createReader();


                dirReader.readEntries(function (results) {
                    //if (results.length) {
                    //entries = entries.concat(toArray(results));
                    //getEntries();

                    //let gg = jsFunctions.readDirectory(fs.root);
                    //console.log(gg);
                    if (results.length > 0) {
                        let found = false;
                        for (i = 0; i < results.length; i++) {
                            let g = results[i];
                            //debugger;
                            if (g.name == fileName) {
                                //debugger;
                                found = true;
                                g.remove((r) => {
                                    //debugger;
                                    cr(fs);
                                },
                                    (e) => {
                                        //debugger;
                                    });
                            }


                        }
                        if (!found) {
                            cr(fs);
                        }

                    }
                    else if (results.length == 0) {
                        //debugger;
                        cr(fs);
                        //debugger;
                    }


                    //}
                },
                    errorHandlerCr);

            };


            //debugger;
            ////window.requestFileSystem(window.TEMPORARY, 0, onInitFs, jsFunctions.errorHandler);
            window.requestFileSystem(window.TEMPORARY, 0, onInitFs, errorHandlerCr);
            //debugger;
        });

        return promise;
    },

    appendFile: function (filename, bytesBase64) {
        //debugger;
        let promise = new Promise(function (resolve, reject) {

            function errorHandlerAp(e) {
                debugger;
                var msg = '';

                switch (e.code) {
                    case 22: //FileError.QUOTA_EXCEEDED_ERR:
                        msg = 'QUOTA_EXCEEDED_ERR';
                        debugger;
                        window.webkitStorageInfo.requestQuota(PERSISTENT,
                            1024 * 1024,
                            function (grantedBytes) {
                                debugger;
                                window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandlerAp);
                                //initFS(grantedBytes);
                            },
                            function (e) {
                                debugger;
                                console.log('Error', e);
                            });
                        break;
                    //case FileError.NOT_FOUND_ERR:
                    //    msg = 'NOT_FOUND_ERR';
                    //    break;
                    //case FileError.SECURITY_ERR:
                    //    msg = 'SECURITY_ERR';
                    //    break;
                    //case FileError.INVALID_MODIFICATION_ERR:
                    //    msg = 'INVALID_MODIFICATION_ERR';
                    //    break;
                    //case FileError.INVALID_STATE_ERR:
                    //    msg = 'INVALID_STATE_ERR';
                    //    break;
                    default:
                        msg = 'Unknown Error: ' + e;
                        break;
                };

                console.log('Error: ' + msg);
                reject(e);
            };
            function onInitFs(fs) {
                //debugger;
                //link.href = "data:application/octet-stream;base64," + bytesBase64;
                fs.root.getFile(filename, { create: false }, function (fileEntry) {
                    //debugger;
                    fileEntry.createWriter(function (fileWriter) {

                        fileWriter.seek(fileWriter.length); // Start write position at EOF.

                        //var bb = new BlobBuilder();
                        //bb.append(bytesBase64);
                        //fileWriter.write(bb.getBlob('text/plain'));

                        //var blob = new Blob(['Lorem Ipsum'], { type: 'text/plain' });
                        //var blob = new Blob([bytesBase64], { type: 'text/plain' });
                        let hh = atob(bytesBase64);
                        let hj = Uint8Array.from(hh, c => c.charCodeAt(0))
                        //debugger;
                        //var blob = new Blob([hh], { type: 'application/octet-binary' });
                        var blob = new Blob([hj], { type: 'application/octet-binary' });
                        fileWriter.write(blob);
                        //debugger;
                        resolve(filename);
                    }, errorHandlerAp);

                }, errorHandlerAp);

            }

            window.requestFileSystem(window.TEMPORARY, 1024, onInitFs, errorHandlerAp);
        });

        return promise;
    },

    saveAs2: function (filename) {
        debugger;
        function onInitFs(fs) {
            //link.href = "data:application/octet-stream;base64," + bytesBase64;
            fs.root.getFile(filename, { create: false }, function (fileEntry) {
                let url = fileEntry.toURL();

                console.log(url);
                var link = document.createElement('a');
                link.download = filename;
                link.href = url;// "data:application/octet-stream;base64," + bytesBase64;
                document.body.appendChild(link); // Needed for Firefox
                link.click();
                //console.log("saveAsFile 002 " + filename);
                document.body.removeChild(link);
                //console.log("saveAsFile 003 " + filename);
                //fileEntry.createWriter(function (fileWriter) {

                //    fileWriter.seek(fileWriter.length); // Start write position at EOF.

                //    var bb = new BlobBuilder();
                //    bb.append(bytesBase64);
                //    fileWriter.write(bb.getBlob('text/plain'));

                //}, jsFunctions.errorHandler);

            }, jsFunctions.errorHandler);

        }

        window.requestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, jsFunctions.errorHandler);
    }
};