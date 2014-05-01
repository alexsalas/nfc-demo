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

// Page 6, Figure 5, (1)
// Relevant API: Bluetooth
// XXX: NFC hides the tech-discovery notification on the topmost WebNFC
//		so this only lists previously paired bluetooth devices
function paired_device_list() {
	var adapter;
	var btreq = bluetooth.getDefaultAdapter();
	btreq.onsuccess = function() {
		adapter = this.result;
		var pairedreq = adapter.getPairedDevices();
		pairedreq.onsuccess = function () {
			return this.result;
		}
		pairedreq.onerror = function () {
			console.warn(pairedreq.error.name);
			console.warn('Getting paired devices failed.');
		}
	}

	btreq.onerror = function() {
		console.warn(btreq.error.name);
		console.warn('Getting adapter failed.');
	}
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
