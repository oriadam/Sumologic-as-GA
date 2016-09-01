SL_DEFAULT_COLLECTOR = 'https://endpoint1.collection.eu.sumologic.com/receiver/v1/http/abcdefg-abcdefgabcdefg==';
SL_DEFAULT_SAMPLERATE = 100;
SL_EVENTS = {
	'Page view': 'v',
	'Time on site': 't',
}

// Note: IE9 and below is not supported

/* sl_log(options) sends an event to sumologic collector
   Input options object:
	   sr: Sample rate - if set to 100 then only 1/100 messages will actually be sent to SL. default = SL_DEFAULT_SAMPLERATE
	   e: Event name
	   s: Subevent name
	   host: Domain name / host name. When set to boolean true, will use hostname of current page
	   url: Complete url of current page. When set to boolean true, will use url of current page
	   x1: Custom variable 1
	   x2: Custom variable 2
	   x3: Custom variable 3
	   x4: Custom variable 4
	   x5: Custom variable 5
	   x6: Custom variable 6
	   x7: Custom variable 7
	   x8: Custom variable 8
	   x9: Custom variable 9
	   collector: Collector url to use. Default = SL_DEFAULT_COLLECTOR
*/

function sl_log(options) {
	///////////////////////////////////////////////
	// Support short method: sl_log('event name')
	///////////////////////////////////////////////
	if (typeof options == 'string') {
		options = { e: options };
	}

	///////////////////////
	// Handle Samplerate
	///////////////////////
	var samplerate = options.sr || SL_DEFAULT_SAMPLERATE;
	if (Math.random() > (1 / samplerate))
		return;

	///////////////////////
	// Populate fields where needed
	///////////////////////
	if (SL_EVENTS[options.e])
		options.e = SL_EVENTS[options.e];

	if (options.host === true || options.host === 1)
		options.host = location.hostname;

	if (options.url === true || options.url === 1)
		options.url = location.href;

	///////////////
	// Replace the separator char with something else and make sure everything is url-safe
	///////////////
	Object.keys(options).forEach(function(k) {
		if (typeof options[k] == 'string') {
			options[k] = encodeURIComponent(options[k].replace(/~/g, '`'));
		}
	}); //foreach
	
	///////////////
	// Send data
	///////////////
	var img = new Image();
	img.src = (options.collector || SL_DEFAULT_COLLECTOR) +  // <-- endpoint url
	[
	'?!', // <-- query header
	samplerate, options.e, options.s, options.host, options.url, options.x1, options.x2, options.x3, options.x4, options.x5, options.x6, options.x7, options.x8, options.x9,  // <-- actual values
	'', '', '', '', '']	// <-- add a few extra ~~~ at the end to allow adding new fields in the future
	.join('~'); // <-- separator is ~
	// FER = 
	// parse "!~*~*~*~*~*~*~*~*~*~*~*~*~*~*~" as sr_,e,s,host,url,x1,x2,x3,x4,x5,x6,x7,x8,x9 nodrop | double(sr_) as sr
} //sl_log()

sl_log('Page view');
sl_log({e:'Time on site',x1:500});
