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

    readFileBlock: function (inputFileElementRef, start, length) {
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
        console.debug("readFileBlock   " + inputFileElementRef + " 001-1 " + fileSize + "  " + start + "  " + stop);
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
    }
};

window.jsFunctions = {

    isChrome: function () {
        // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
        let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        return isChrome;
    },

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
};