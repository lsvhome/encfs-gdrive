window.jsFunctions = {



    loadFile: function (inputFileElementRef) {
        console.log(inputFileElementRef + " 001");
        //debugger;
        const temporaryFileReader = new FileReader();
        console.log(temporaryFileReader);
        //temporaryFileReader.

        var tt = document.getElementById(inputFileElementRef);

        var promise = new Promise((resolve, reject) => {
            console.log(inputFileElementRef + " 002");
            try {

                temporaryFileReader.onerror = () => {
                    console.log("rejected");
                    temporaryFileReader.abort();
                    reject(new DOMException("Problem parsing input file."));
                };
                temporaryFileReader.addEventListener("load", function () {
                    console.log("onload");
                    //debugger;
                    var data = {
                        name: tt.files[0].name,
                        content: temporaryFileReader.result.split(',')[1]
                    };
                    var maxLength = 2095788; // base64 length of 1535K file
                    if (data.content.length > maxLength)
                    {
                        console.log("file size larger than 1535K: " + data.content.length);
                        reject("file size larger than 1535K: " + data.content.length);
                        return;
                    }
                    console.log(data.content.length);

                    resolve(data);
                }, false);

                console.log(" 001-1 " + tt);

                console.log("AAA " + tt.files[0]);
                temporaryFileReader.readAsDataURL(tt.files[0]);

                console.log("BBB");
            } catch (e) {
                console.log("ERROR 9845629348");
                console.log(e);
            }

        });

        return promise;
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
};