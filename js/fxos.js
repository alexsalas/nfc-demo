// Methods that the front-end team needs
// Bug 949293
updateText('FXOS: API Loaded');

// Helper to update UI
function updateText(text) {
    console.log(text);
    $('#new_devices').append('<p>' + text + '</p>');
}

// Handles all incoming nfc activities
function nfc_activity_handler(activity) {
    var activity_name = activity.source.name;
    var data = activity.source.data;

    switch (activityName) {
        case 'nfc-ndef-discovered':
            updateText('FXOS: nfc ndef message records: ' +
                JSON.stringify(data.records));
            updateText('FXOS: Session Token: ' +
                JSON.stringify(data.sessionToken));
            updateText('FXOS: Technology Detected: ' +
                JSON.stringify(data.tech));

            // XXX: Handle NDEFs a little later
            //handle_ndef_discovered(data);
            break;
        }
}
// Need to find an appropriate place to set this message handler
window.navigator.mozSetMessageHandler('activity', nfc_activity_handler);

// First make sure that NFC and Bluetooth are available and then
// enable the appropriate settings
function configure_settings(callback) {
    if (!window.navigator.mozSettings)
        return 'FXOS: Cannot access settings';

    if (!window.navigator.mozNfc)
        return 'FXOS: NFC capabilities not available';

    if (!window.navigator.mozBluetooth)
        return 'FXOS: Bluetooth capabilities not available';

    callback();

    // XXX: Using the settings API gives me strange ASYNC errors with nfcd
    // var lock = window.navigator.mozSettings.createLock();
    // var result = lock.set({
    //     'nfc.enabled': true,
    //     'bluetooth.enabled': true
    // });
    // result.onsuccess = function() {
    //     updateText('FXOS: NFC and Bluetooth enabled');
    //     callback();
    // };

    // result.onerror = function() {
    //     return 'FXOS: Settings were not set correctly';
    // };
}

// Page 5, Figure 4 (1st one)
// Relevant API: WebNfc
// A way to toggle NFC into 'active' mode upon tapping 'NFC + Bluetooth' option
function nfc_activate() {
    console.log('FXOS: Activating NFC');

    // Access the settings API
    var setting_callback = function() {
        updateText('FXOS: Properly Set NFC Peer Handler');
        window.navigator.mozNfc.onpeerready = function(event) {
            var nfcPeer = window.navigator.mozNfc.getNFCPeer(event.detail);

            // Using the mozApps API to grab the app
            var app_req = window.navigator.mozApps.getSelf();
            app_req.onsuccess = function() {
                var app = app_req.result;
                if (app) {
                    updateText(app.manifest.name);
                    updateText(app.origin);
                    updateText(app.manifestURL);

                    for (x in window.navigator.mozApps.mgmt)
                        updateText(x);
                    // XXX: Need to apply Fabrice's patch for import export
                    var blob_req = window.navigator.mozApps.mgmt.export(app)
                    .then(function(blob) {
                        updateText('FXOS: Sending Blob');
                        var send = nfcPeer.sendFile(blob);
                        send.onsuccess = function() {
                            updateText('FXOS: Blob successfully transferred');
                        };
                        send.onerror = function() {
                            updateText('FXOS: Blob not successfully ' +
                                'transferred');
                        };
                    });
                }
            };
            app_req.onerror = function() {
                updateText('Error retrieving app information: ');
            };
        };
    };

    var error = configure_settings(setting_callback);
    if (error)
       updateText(error);
}

// Only using while testing. This should be called from the UI
nfc_activate();

// Page 5, Figure 4 (2nd one)
// Relevant API: DeviceStorage
// We need to glob the files into an email package
// XXX: Figuring out how to do this while preserving cryptographic signing, etc
//      Security concerns with installing random packages
function nfc_email_package() {
}

// Page 6, Figure 5
function getAppFile(filename, callback) {
    var apps = window.navigator.getDeviceStorage('apps');
    var req = apps.get(filename);
    req.onsuccess = function() {
        callback(req.result);
    };
    req.onerror = function() {
        console.error('Failed to get app file', filename);
    };
}

function BTSendApp(thisApp) {
    var origin = thisApp.origin.split('app://')[1];
    var manifestOrigin = thisApp.manifestURL.split('app://')[1];

    getAppFile('local/webapps/' + manifestOrigin, function(file) {
        var blobs = [file];
        var names = [file.name];
        console.log('File "' + file.name +
            '" successfully retrieved from the app storage area');
        getAppFile('local/webapps/' + origin + '/application.zip',
            function(file2) {
            blobs.push(file2);
            names.push(file2.name);
            console.log('File "' + file2.name +
                '" successfully retrieved from the app storage area');

            var a = new MozActivity({
                name: 'share',
                data: {
                    number: blobs.length,
                    blobs: blobs,
                    filenames: names,
                    filepaths: names
                }
            });
            a.onsuccess = function() {
                console.log('share activity success');
            };

            a.onerror = function(e) {
                console.warn('share activity error:', a.error.name);
                console.log(e);
            };
    });

    });
}

// developer.mozilla.org/en-US/docs/Web/API/Navigator.mozSetMessageHandler
// XXX: There are several message types that can be used to implement
// the following functions about the file transfer status

// Page 6, Figure 6 (1st)
// function transfer_heartbeat() {
// }

// Page 6, Figure 6 (2nd)
// function transfer_complete() {
// }

// Page 7, Figure 2
// function transfer_waiting() {
// }

// Page 9, Figure 2
// function transfer_interrupt() {
// }

// Page 9, Figures 3 and 4
// function transfer_cancelled() {
// }

// Page 11, Figure 1
// function open_transfer_prompt() {
// }

// Page 11, Figure 2, (1)
// Relevant API: DeviceStorage
function remaining_device_storage() {
    var apps = navigator.getDeviceStorage('apps');

    var request = apps.freeSpace();
    request.onsuccess = function() {
        // The result is expressed in bytes, let's turn it into Gigabytes
        var size = this.result / Math.pow(10, 9);
        updateText('You have ' + size.toFixed(2) +
            ' GB of free space for apps.');
    };
    request.onerror = function() {
        updateText('Unable to get the free space available for the SDCard: ' +
        this.error);
    };
}

// Page 11, Figure 2, (2)
// Relevant API: DeviceStorage
function application_size() {
}

// Page 11, Figure 2, (3)
// Page 14, Figure 2
// XXX: Might have to look in Bluetooth and DeviceStorage
//      Also show the amount that's been downloaded so far
// function transfer_complete_percentage() {
// }
