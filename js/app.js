/* global $, ace, ColorPicker, window */
$(function () {
	var App = function (gallery, sizes) {
		this.canvases = []
		this.contexts = []
		this.editor = undefined
		this.favicon = []
		this.gallery = gallery
		this.sizes = sizes
		this.scale = window.devicePixelRatio

		this._initializeCanvases()
		this._initializeEditor()
		this._initializePicker()
	}

	App.prototype._initializeCanvases = function () {
		this.sizes.forEach(function (size) {
			var $canvas = $('<canvas />')
				.attr('id', 'icon-' + size.width)
				.attr('title', '' + size.width + ' x ' + size.height)
				.attr(size)
			var context = $canvas[0].getContext("2d")

			if (this.scale) {
				var width = $canvas.attr('width')
				var height = $canvas.attr('height')

				$canvas.attr({
					width: width,
					height: height,
				})

				$canvas.css({
					width: width / this.scale,
					height: height / this.scale,
				})

				context.scale(this.scale, this.scale)
				context.width = width / this.scale
				context.height = height / this.scale

				// select the correct context for the device's favicon
				if (context.width === 16) {
					this.favicon = context
				}
			}

			this.canvases.push($canvas[0])
			this.contexts.push(context)
		}.bind(this))
	}

	App.prototype._initializePicker = function () {
		$('#picker').on('dragstart', function(event) {
			event.preventDefault()
		})

		this.picker = ColorPicker($('#picker .slider')[0], $('#picker .picker')[0], function(hex, hsv, rgb) {
			this.setBackground(hex)
		}.bind(this))

		$('input[name="background"]').submit(function () {
			this.setBackground($('input[name="background"]').val())
		}.bind(this))
	}

	App.prototype._initializeEditor = function () {
		this.editor = ace.edit('code')
		this.editor.setTheme('ace/theme/chrome')
		this.editor.getSession().setMode('ace/mode/javascript')
	}

	App.prototype.draw = function () {
		var fn = new Function(this.editor.getValue())
		this.contexts.forEach(function (ctx) {
			ctx.clearRect(0, 0, ctx.width, ctx.height)
			try {
				fn.call(ctx)
			} catch (e) {
				// do nothing
			}
		})
	}

	App.prototype.setBackground = function (hex) {
		var color = hex.replace('#', '')
		var complement = ('000000' + (('0xffffff' ^ '0x'+color).toString(16))).slice(-6)
		$('input[name="background"]').val(hex)
		$('#top')
			.css('background-color', hex)
			.css('color', complement)
	}

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

	var app = new App('#gallery', sizes)
	app.canvases.forEach(function (canvas) {
		$(this.gallery).append(canvas)
	})

	$('#runner').click(draw)
	$('#saver').click(save)

	draw()

	function draw() {
		app.draw()
		updateFavicon()
	}

	function updateFavicon() {
		$('link[rel="shortcut icon"]')
			.attr('href', app.favicon.canvas.toDataURL('image/png'));
	}
	//
	function save() {
		window.open(contexts[0].canvas.toDataURL('image/png'), '_blank')
	}
})
