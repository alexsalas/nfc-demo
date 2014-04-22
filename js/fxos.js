// Methods that the front-end team needs

// Relevant API: WebNfc
// A way to toggle NFC into 'active' mode upon tapping 'NFC + Bluetooth'
// We can just set the appropriate handler when we need it
function nfc_active() {
	window.navigator.mozNfc.onpeerready = function(event) {
		/* When the phones are brought together, this handler will fire */
	}
}

// Relevant API: DeviceStorage
// We need to glob the files into an email package
// XXX: Figuring out how to do this while preserving cryptographic signing, etc
//      Security concerns with installing random packages
function nfc_email_package() {
}

// Relevant API: Bluetooth
// XXX: NFC hides the tech-discovery notification on the topmost WebNFC
//		so this only lists previously paired bluetooth devices
function paired_device_list() {
}

// Relevant API: Bluetooth
// XXX: Again this isn't relevant with NFC so if we do something like this, it
//		would be through bluetooth
function nearby_device_list() {
}

function device_search() {
}

function transfer_heartbeat() {
}

function transfer_complete() {
}

function transfer_waiting() {
}

function transfer_interrupt() {
}

function transfer_cancelled() {
}

function open_transfer_prompt() {
}
