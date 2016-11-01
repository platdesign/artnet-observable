'use strict';


/**
 * Parses a given buffer into an object based on Art-Net specification
 * http://www.artisticlicence.com/WebSiteMaster/User%20Guides/art-net.pdf
 *
 * @param  {Buffer} buffer from incoming socket message
 * @return {Object}        Art-Net package based on opCode
 */
module.exports = function(buffer) {

	let protoPrefix = buffer.toString('utf8', 0, 7);

	if(protoPrefix !== 'Art-Net') return;


	let result = {
		id: protoPrefix,
		opCode: buffer.readUInt16LE(8),
		version: buffer.readUInt16BE(10)
	};



	// ArtPoll packet
	if(result.opCode === 0x2000) {

	}


	// ArtDmx packet
	if(result.opCode === 0x5000) {

		result.sequence = buffer.readUInt8(12);
		result.physical = buffer.readUInt8(13);
		result.universe = buffer.readUInt8(14);
		result.net = buffer.readUInt8(15);
		result.length = buffer.readUInt16BE(16);
		result.data = [];

		for(let i = 0; i < result.length; i++) {
			result.data.push( buffer.readUInt8(i+18) );
		}
	}


	return result;
}
