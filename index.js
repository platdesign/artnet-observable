'use strict';

const dgram = require('dgram');
const rx = require('rx');
const Hoek = require('hoek');
const parseArtnetPackage = require('./lib/parse-artnet-package');


// Default observable config
const defaultConfig = {
	port: 6454,
	host: '127.0.0.1'
};


/**
 * Creates a rx.Observable which emits parsed artnet-packages to subscribers.
 * @param  {Object} customConfig extends default config
 * @return {Object}              Observable instance
 */
module.exports = function createArtNetObservable(customConfig) {

	// Merge default config with custom passed config object
	const config = Hoek.applyToDefaults(defaultConfig, customConfig||{});


	// Create new observable
	return rx.Observable.create(function(observer) {

		// Init socket
		let socket = dgram.createSocket('udp4');

		// Bind socket to configured port
		socket.bind(config.port);

		// parse incoming messages on socket and push result to observer
		socket.on('message', (buffer, sender) => {

			let parsed = parseArtnetPackage(buffer);

			// if 'parsed' is empty the incoming message could not be parsed as Art-Net package
			if(!parsed) return;

			observer.onNext({
				sender: sender,
				artnet: parsed
			});

		});

		// complete observeable on close
		socket.on('close', () => observer.onCompleted());

		// send socket errors to observer
		socket.on('error', (err) => observer.onError(err));

		// close socket connection if no subscriber is available
		return function dispose() {
			socket.close();
		};

	})

	// share observable between subscribers to avoid multiple sockets
	.share();

};



