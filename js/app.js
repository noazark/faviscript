/* global $, jailed, window */
$(function () {
	var contexts = []
	var favicon
	var sizes = [
		{width: 512, height: 512},
		{width: 256, height: 256},
		{width: 192, height: 192},
		{width: 144, height: 144},
		{width: 128, height: 128},
		{width: 90, height: 90},
		{width: 64, height: 64},
		{width: 48, height: 48},
		{width: 32, height: 32},
		{width: 16, height: 16},
	]

	sizes.forEach(function (size) {
		var $canvas = $('<canvas />').attr('id', 'icon-' + size.width).attr(size)
		var context = $canvas[0].getContext("2d")

		if (window.devicePixelRatio) {
			var width = $canvas.attr('width')
			var height = $canvas.attr('height')

			$canvas.attr({
				width: width,
				height: height,
			})

			$canvas.css({
				width: width / window.devicePixelRatio,
				height: height / window.devicePixelRatio,
			})

			context.scale(window.devicePixelRatio, window.devicePixelRatio)
			context.width = width / window.devicePixelRatio
			context.height = height / window.devicePixelRatio

			// select the correct context for the device's favicon
			if (context.width === 16) {
				favicon = context
			}
		}


		$('#gallery').append($canvas)
		contexts.push(context)
	})

	$('#runner').click(draw)

	draw()

	function draw() {
		var fn = new Function($('#coder').val())
		contexts.forEach(function (ctx) {
			ctx.clearRect(0, 0, ctx.width, ctx.height)
			fn.call(ctx)
		})
		updateIcon()
	}

	function updateIcon() {
		$('link[rel="shortcut icon"]')
			.attr('href', favicon.canvas.toDataURL('image/png'));
	}
})
