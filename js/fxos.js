// Methods that the front-end team needs

// Page 5, Figure 4 (1st one)
// Relevant API: WebNfc
// A way to toggle NFC into 'active' mode upon tapping 'NFC + Bluetooth'
// We can just set the appropriate handler when we need it
function nfc_active() {
	window.navigator.mozNfc.onpeerready = function(event) {
		/* When the phones are brought together, this handler will fire */
	}
}

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
        console.log('File "' + file.name + '" successfully retrieved from the app storage area');
        getAppFile('local/webapps/' + origin + '/application.zip', function(file2) {
            blobs.push(file2);
            names.push(file2.name);
            console.log('File "' + file2.name + '" successfully retrieved from the app storage area');

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
                console.log("share activity success");
            };

            a.onerror = function(e) {
                console.warn('share activity error:', a.error.name);
                console.log(e);
            };
    });

    });
}

// Page 6, Figure 6 (1st)
function transfer_heartbeat() {
}

// Page 6, Figure 6 (2nd)
function transfer_complete() {
}

// Page 7, Figure 2
function transfer_waiting() {
}

// Page 9, Figure 2
function transfer_interrupt() {
}

// Page 9, Figures 3 and 4
function transfer_cancelled() {
}

// Page 11, Figure 1
function open_transfer_prompt() {
}

// Page 11, Figure 2, (1)
// Relevant API: DeviceStorage
function remaining_device_storage() {
}

// Page 11, Figure 2, (2)
// Relevant API: DeviceStorage
function application_size() {
}

// Page 11, Figure 2, (3)
// Page 14, Figure 2
// XXX: Might have to look in Bluetooth and DeviceStorage
//		Also show the amount that's been downloaded so far
function transfer_complete_percentage() {
}
