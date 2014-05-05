// Methods that the front-end team needs
// Bug 949293
console.log('FXOS: API Loaded');

// Helper to update UI
function updateText(text) {
    $('#new_devices').append('<p>' + text + '</p>');
}

// Handles all incoming nfc activities
function nfc_activity_handler(activity) {
	var activity_name = activity.source.name;
	var data = activity.source.data;

	switch (activityName) {
		case 'nfc-ndef-discovered':
			console.log('FXOS: nfc ndef message records: ' +
					JSON.stringify(data.records));
			console.log('FXOS: Session Token: ' + JSON.stringify(data.sessionToken));
			console.log('FXOS: Technology Detected: ' + JSON.stringify(data.tech));

			// XXX: Handle NDEFs a little later
			//handle_ndef_discovered(data);
			break;
	}
}

// Page 5, Figure 4 (1st one)
// Relevant API: WebNfc
// A way to toggle NFC into 'active' mode upon tapping 'NFC + Bluetooth'
// We can just set the appropriate handler when we need it
function nfc_active() {
	console.log('FXOS: Activating NFC');

	// Access the settings API
	var settings = window.navigator.mozSettings;
	if (!settings) {
		console.log('FXOS: Cannot access settings');
		return;
	}

	// Have a way to turn on NFC
	if (!('mozNfc' in window.navigator)) {
		console.log('FXOS: NFC disabled');
		settings.createLock().set({'nfc.enabled': true});
	}

	// Have a way to turn on BT
	if (!('mozBluetooth' in window.navigator)) {
		console.log('FXOS: Bluetooth disabled');
		settings.createLock().set({'bluetooth.enabled': true});
	}

	// Settings API works via callbacks. Make synchronous?
	var req = settings.createLock().get('bluetooth.enabled');
	req.onsuccess = function() {
		console.log('bluetooth.enabled' + req['bluetooth.enabled']);
	}


	// Handler for receiving
	navigator.mozSetMessageHandler('activity', nfc_activity_handler);

	// Handler for sending
	window.navigator.mozNfc.onpeerready = function(event) {
		/* Bug 1003268 - have no way of knowing when the phones touch */
		/* Bug 998175 - simultaneous BT transfers are not possible */
		/* This handler fires when the user swipes up on the NFC interaction */
		var nfcPeer = window.navigator.mozNfc.getNFCPeer(event.detail);
		var records = new Array();

		var ndef = nfcText.createTextNdefRecord_Utf8('Dummy Text', 'en');
		records.push(ndef);

		// Bug 1002391 - bluetooth error for sending file, not NFC (blocker)
		// I think we need to use send_file
		var req = nfcPeer.sendNDEF(records);
		req.onsuccess = (function() {
			updateText('Sent file successfully');
		});
		req.onerror = (function() {
			updateText('Unable to send file');
		});
	}
}
nfc_active();

// Page 5, Figure 4 (2nd one)
// Relevant API: DeviceStorage
// We need to glob the files into an email package
// XXX: Figuring out how to do this while preserving cryptographic signing, etc
//      Security concerns with installing random packages
function nfc_email_package() {
}

// Page 6, Figure 5, (1)
// Relevant API: Bluetooth
// XXX: NFC hides the tech-discovery notification on the topmost WebNFC
//		so this only lists previously paired bluetooth devices
function paired_device_list() {
}

// Page 6, Figure 5, (2)
// Relevant API: Bluetooth
// XXX: Again this isn't relevant with NFC so if we do something like this, it
//		would be through bluetooth
function nearby_device_list() {
}

// Page 6, Figure 5, (3)
function device_search() {
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
