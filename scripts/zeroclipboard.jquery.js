/**
 * File is created under the GPL.
 * Made by Kris aka DudeAmI
 * http://www.dudeami.com
 *
 * Code is based off of the original Javascript from the zeroclipboard.js
 */

var ZeroClipboard = {
	moviepath: 'scripts/ZeroClipboard.swf',
	objects: [],
	// The pairs take the SWF id and match it back to the original element
	pairs: {},
	dispatch: function (id, eventName, args) {
		var eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		// console.log("Dispatch happened. string is " + eventName);
		switch (eventName) {
			case 'load':
				$(this.pairs[id]).data("zeroclipboard_ready", true);
				ZeroClipboard.update(id);
				break;
			case 'mouseover':
				$(this.pairs[id]).trigger('mouseover');
				break;
			case 'mouseout':
				$(this.pairs[id]).trigger('mouseout');
				// This is to cover up the bug of dragging the mouse out of the flash.
				// Mainly used when reseting css
				$(this.pairs[id]).trigger('mouseup');
				break;
			case 'mouseup':
				$(this.pairs[id]).trigger('mouseup');
				break;
			case 'mousedown':
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
				var elemPos = $(original).position();
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

	
	$.fn.zeroclipboarduid = function (fnoptions) {
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
	
	$.fn.zeroclipboard = function (fnoptions, config) {
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
				var elemPos = $(this).position();
				// Create our clipboard and container
				//<embed width="10" height="21"
				//flashvars="id=2&amp;width=10&amp;height=21"
				var flashObj = $('<embed></embed>')
				// Append some flash specific vars.
					.attr('pluginspage', 'http://www.macromedia.com/go/getflashplayer')
					.attr('type', 'application/x-shockwave-flash')
					.attr('allowfullscreen', 'false')
					.attr('allowscriptaccess', 'always')
					//.attr('swliveconnect', 'true')
					.attr('quality', 'best')
					.attr('align', 'middle')
					.attr('wmode', 'transparent')
					.attr('bgcolor', '#ffffff')
					.attr('menu', 'false')
					.attr('loop', 'false')
				// Now we set the source of the swf file
					.attr('src', ZeroClipboard.moviepath)
				// Set the ID of the movie
					.attr('id', 'zeroclipboard_swf_' + id)
					.attr('name', 'zeroclipboard_swf_' + id)
				// Then we set the dimensions and css properties
					.attr('width', elemWidth)
					.attr('height', elemHeight)
					.attr('flashvars', 'id=' + id + '&width=' + elemWidth + '&height=' + elemHeight);
				// Now thats done, we need to make a div to set this in.
				var flashCont = $('<div></div>')
					.css({
						'width': elemWidth + 'px',
						'height': elemHeight + 'px',
						'zIndex': ++ZeroClipboard.zindex,
						'position': 'absolute',
						'left': elemPos.left,
						'top': elemPos.top
					}).append(flashObj);
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