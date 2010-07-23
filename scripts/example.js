	$(document).ready(function () {
		$('#tester').zeroclipboard({
			text: 'Hahaha! You clicked me :)',
			hand: true
		});
		$('#resizetest').zeroclipboard({
			text: 'Hahaha! You clicked me :)',
			hand: true
		});
		$('#testerupdate').click(function () {
			$('#tester').css('width', '100px');
			$('#tester').zeroclipboard({
				'text': 'Updated from #testerupdate ;)',
				'hand': true
			});	
		});
		$('#destroyflash').zeroclipboard({
			'text': 'Copied from #destroyflash, now destroy the flash!',
			'hand': true
		});
		$('#destroyflasha').click(function () {
			$('#destroyflash').zeroclipboard({'destroy': true});
		});
		$('#destroywhole').zeroclipboard({
			'text': 'Copied from #destroywhole, now destroy me!',
			'hand': true
		});
		$('#destroywholea').click(function () {
			$('#destroywhole').remove();
		});
		$('#testercss').zeroclipboard({
			'text': 'Copied from #testercss',
			'hand': true
		}).mouseover(function () {
			$(this).css({'color': '#f00'}, 1000);
		}).mouseout(function () {
			$(this).css({'color': '#000'}, 1000);
		}).mousedown(function () {
			$(this).css('font-weight', 'bold');
		}).mouseup(function () {
			$(this).css('font-weight', 'normal');
		});
		
	});