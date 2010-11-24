/**
 * File is created under the GPL.
 * Made by Kris aka DudeAmI
 * http://www.dudeami.com
 *
 * Code is based off of the original Javascript from the zeroclipboard.js
 */

var ZeroClipboard = {
	moviepath: 'scripts/ZeroClipboard/ZeroClipboard.swf',
	objects: [],
	// The pairs take the SWF id and match it back to the original element
	pairs: {},
	dispatch: function (id, eventName, args) {
		var eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		// console.log("Dispatch happened. string is " + eventName);
		switch (eventName) {
			case 'load':
				// movie claims it is ready, but in IE this isn't always the case...
				// bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
				var movie = document.getElementById('zeroclipboard_swf_' + id);
				if (!movie) {
					setTimeout( function() {ZeroClipboard.dispatch(id, 'load', null);}, 1 );
					return;
				}

				// firefox on pc needs a "kick" in order to set these in certain cases
				if (!$(ZeroClipboard.pairs[id]).data("zeroclipboard_ready") && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
					setTimeout( function() {ZeroClipboard.dispatch(id, 'load', null);}, 100 );
					$(this.pairs[id]).data("zeroclipboard_ready", true);
					return;
				}

				$(this.pairs[id]).data("zeroclipboard_ready", true);
				ZeroClipboard.update(id);
				break;
			case 'complete':

				break;
			case 'mouseover':
				$(this.pairs[id]).trigger('mouseover');
				break;
			case 'mouseout':
				$(this.pairs[id]).trigger('mouseout');
				// This is to cover up the bug of dragging the mouse out of the flash.
				// Mainly used when reseting css
				if ($(this.pairs[id]).data('zeroclipboard_downfix')) {
					$(this.pairs[id]).trigger('mouseup');
				}
				break;
			case 'mouseup':
				$(this.pairs[id]).trigger('mouseup');
				$(this.pairs[id]).data('zeroclipboard_downfix', false);
				break;
			case 'mousedown':
				$(this.pairs[id]).data('zeroclipboard_downfix', true);
				$(this.pairs[id]).trigger('mousedown');
				break;
		}
	},
	update: function (id) {
		// Take the ID, and find the main div.
		var original = this.pairs[id];
		if ($(original).data("zeroclipboard_ready")) {
			// console.log("Update Fired");
			var flash = document.getElementById('zeroclipboard_swf_' + id);
			if ($(original).data('zeroclipboard_resize')) {
				// console.log("Now resizing the flash element...");
				// Get all the details
				var elemWidth = $(original).outerWidth();
				var elemHeight = $(original).outerHeight();
				var elemPos = $(original).offset();
				$(flash)
					.attr('width', elemWidth)
					.attr('height', elemHeight);
				// Grab the flashes parent
				$(flash).parent().css({
					'width': elemWidth + 'px',
					'height': elemHeight + 'px',
					'top': elemPos.top,
					'left': elemPos.left
				});
				$(original).data('zeroclipboard_resize', false);
			}
			flash.setText($(original).data('zeroclipboard_text'));
			// console.log("Clipboard set, value is " + $(original).data('zeroclipboard_text'));
			flash.setHandCursor($(original).data('zeroclipboard_hand'));
		} else {
			// console.log("Update skipped, waiting for flash to fully load.");
		}
	}
};

(function ($) {(
	// Code borrowed from
	// http://stackoverflow.com/questions/2200494/jquery-trigger-event-when-an-element-is-removed-from-the-dom
	function() {
		var ev = new $.Event('remove'),
		orig = $.fn.remove;
		$.fn.remove = function() {
			$(this).trigger(ev);
			orig.apply(this, arguments);
		}
	})();

	// Setup a polling on displays of parent objects
	setInterval(function () {
		$.each(ZeroClipboard.pairs, function (id, contents) {
			$('#zeroclipboard_swf_' + id).parent().css('display', $(contents).is(':visible') ? 'block' : 'none');
		});
	}, 250);

	// Setup window resize event.
	$(window).resize(function () {
		$.each(ZeroClipboard.pairs, function (id, contents) {
			if (contents == null) return;
			$(contents).data('zeroclipboard_resize', true);
			ZeroClipboard.update(id);
		});
	});

	// Run the window resize anytime an element is removed
	$("*").bind('remove', function () {
		$(window).resize();
	});


	$.fn.zeroclipboarduid = function (fnoptions) {
		if ($(this).length < 1) return;
		var options = {
			'prefix': '',
			'length': 8,
			'chars': "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
		};
		if (typeof fnoptions != "undefined") {
			$.extend(options, fnoptions);
		}
		if (typeof prefix == "undefined") {
			prefix = "";
		}
		return this.each(function() {
			if ($(this).attr('id') != '') return $;
			var retrn = '';
			// This do-while will loop until we get a unique id!
			var id = '#';
			do {
				retrn = '';
				var first = true;
				for (var i=0; i<options.length; i++) {
					var rnum = Math.floor(Math.random() * options.chars.length);
					retrn += options.chars.substring(rnum,rnum+1);
				}
				id = '#' + retrn;
			} while ($('#' + retrn).length > 0 || retrn.match(/^[A-Za-z].*/) != retrn);
			// Note the above code makes it so it MUST start with a letter, as per HTML specs
			$(this).attr('id', retrn);
			return $;
		});
	}

	$.fn.zeroclipboard = function (fnoptions) {
		if ($(this).length < 1) return;
 		// console.time('zeroclipboard');
		// This will first test if we need an update
		var options = {
			'destroy': false
		};
		if (typeof fnoptions != "undefined") {
			$.extend(options, fnoptions);
		}
		var update = $(this).data('zeroclipboard_id');
		var id = null;
		if (!!update && options.destroy) {
			// We have a request to destroy the flash, and it appears we have made the flash object already.
			var id = $(this).data('zeroclipboard_id');
			// console.log("Attempting to remove flash for id #" + id);
			$('#zeroclipboard_swf_' + id).parent().remove();
			ZeroClipboard.pairs[id] = null;
		} else {
			// Grab our ID
			if (!update) {
				$(this).zeroclipboarduid();
				id = $(this).attr('id');
				$(this).data('zeroclipboard_ready', false)
					.data('zeroclipboard_text', "Set something to copy!")
					.data('zeroclipboard_resize', false)
					.data('zeroclipboard_hand', false);
				$(this).data('zeroclipboard_id', id);
				ZeroClipboard.pairs[id] = this;
				// Grab this elements size
				var elemWidth = $(this).outerWidth();
				var elemHeight = $(this).outerHeight();
				var elemPos = $(this).offset();
				// Create our clipboard and container
				var flashObj = null;
				// Create a temp div for the SWFObject
				$('<div></div>').attr('id', 'zeroclipboard_swf_' + id).appendTo('body');
				swfobject.embedSWF(ZeroClipboard.moviepath, 'zeroclipboard_swf_' + id, elemWidth, elemHeight, "9.0.0", "", {
					'id': id,
					'width': elemWidth,
					'height': elemHeight
				}, {
					wmode: 'transparent',
					bgcolor: '#ffffff',
					quality: 'best',
					loop: 'false',
					allowscriptaccess: 'always',
					allowfullscreen: 'false'
				});
				var flashCont = $('<div></div>')
					.css({
						'width': elemWidth + 'px',
						'height': elemHeight + 'px',
						'position': 'absolute',
						'left': elemPos.left,
						'top': elemPos.top
					})

				//$(flashCont).css('zIndex', ZeroClipboard.zindex)
				$('#zeroclipboard_swf_' + id).appendTo(flashCont);
				ZeroClipboard.zindex++;
				$(flashCont).appendTo('body');
				// We check for a resize event called on the element
				// Note! This only works with the jQuery Resize Event from Ben Alman
				// Url: http://benalman.com/projects/jquery-resize-plugin/
				$(this).resize(function () {
					$(this).data('zeroclipboard_resize', true);
					ZeroClipboard.update(id);
				});
				// Add an event to test when the element is destroyed to also destroy
				// the flash object paired with the element.
				$(this).bind('remove', function (event) {
					var id = $(this).data('zeroclipboard_id');
					// console.log("Attempting to remove flash for id #" + id);
					$('#zeroclipboard_swf_' + id).parent().remove();
					ZeroClipboard.pairs[id] = null;
				});
			} else {
				// Set our ID for update
				id = $(this).data('zeroclipboard_id');
			}
			// Update our options
			if (typeof options.text != "undefined") {
				// console.log("We got a new clip value for (#" + id + "). Value: " + options.text);
				$(this).data('zeroclipboard_text', options.text);
			}
			if (typeof options.hand != "undefined") {
				// console.log("We got a new hand value for (#" + id + "). Value: " + options.hand);
				$(this).data('zeroclipboard_hand', options.hand);
			}
			ZeroClipboard.update(id);
	 		// console.timeEnd('zeroclipboard');
 		}
		return this.each(function() {
			return $;
		});
	};

})(jQuery);