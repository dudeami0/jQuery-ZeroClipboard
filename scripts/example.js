jQuery(function () {
	$('#tester').zeroclipboard({
		text: 'Hahaha! You clicked me :)',
		hand: true,
		sizeMethod: 'outer'
	});
	$('#resizetest').zeroclipboard({
		text: 'Hahaha! You clicked me :)',
		hand: true,
		sizeMethod: 'inner'
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
		$('#destroyflash').zeroclipboard('destroy');
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
		'hand': true,
		sizeMethod: null
	}).mouseover(function () {
		$(this).css({'color': '#f00'});
	}).mouseout(function () {
		$(this).css({'color': '#000'});
	}).mousedown(function () {
		$(this).css('font-weight', 'bold');
	}).mouseup(function () {
		$(this).css('font-weight', 'normal');
	});
	
});