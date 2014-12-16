/* global $, ace, ColorPicker, Vue, window */
$(function () {
	var FaviColorPicker = Vue.extend({
		template: '#color-picker',
		data: function () {
			return {
				label: 'background',
				color: '#efefef'
			}
		},
		ready: function () {
			this.slider = $('.slider', this.$el)[0]
			this.picker = $('.picker', this.$el)[0]

			$('#picker').on('dragstart', function(event) {
				event.preventDefault()
			})

			var picker = ColorPicker(this.slider, this.picker, function(hex, hsv, rgb) {
				this.color = hex
				this.contrast = '#' + ('000000' + (('0xffffff' ^ '0x'+this.color.replace('#', '')).toString(16))).slice(-6)
			}.bind(this))

			this.$watch('color', function (val) {
				picker.setHex(val)
			})
		},
	})

	var Editor = Vue.extend({
		template: '#editor',
		data: function () {
			return {
				code: '// foo bar'
			}
		},
		ready: function () {
			this.editor = ace.edit($('.editor', this.$el)[0])
			this.editor.setTheme('ace/theme/chrome')
			this.editor.getSession().setMode('ace/mode/javascript')

			this.editor.on('change', function (e) {
				this.code = this.editor.getValue()
			}.bind(this))

			this.editor.commands.addCommand({
				name: "replace",
				bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
				exec: function(editor) {
					this.$emit('run')
				}.bind(this)
			})
		},
		methods: {
			getCode: function () {
				return this.editor.getValue()
			}
		}
	})

	var CodeGallery = Vue.extend({
		template: '#gallery',
		data: function () {
			return {
				code: '',
				images: [],
				contexts: [],
				sizes: [
					{width: 512, height: 512},
				],
				scale: window.devicePixelRatio
			}
		},
		ready: function () {
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

				this.images.push($canvas[0])
				this.contexts.push(context)
			}.bind(this))

			this.images.forEach(function (image) {
				$($('.gal', this.$el)).append(image)
			}.bind(this))
		},
		methods: {
			render: function () {
				var fn = new Function('width', 'height', this.code)
				this.contexts.forEach(function (ctx) {
					ctx.clearRect(0, 0, ctx.width, ctx.height)
					try {
						fn.call(ctx, ctx.canvas.width, ctx.canvas.height)
					} catch (e) {
						// do nothing, should probably alert user or something
					}
				})

				$('link[rel="shortcut icon"]')
					.attr('href', this.favicon.canvas.toDataURL('image/x-icon'));
			}
		}
	})

	var App = Vue.extend({
		data: function () {
			return {
				code: '// example\nvar centerX = this.width / 2;\nvar centerY = this.height / 2;\nvar pad = width >= 48 ? Math.round(this.width * 0.10) : 0;\nvar radius = (this.width - pad * 2) / 2;\nvar innerRadius = radius * (width >= 128 ? 0.9 : 1);\n\ndrawShell(this, centerX, centerY, innerRadius, 2);\nthis.fillStyle = \'#444\';\nthis.fill();\n\ndrawShell(this, centerX, centerY, radius, 1.25);\nthis.fillStyle = \'#17ACE7\';\nthis.fill();\n\nfunction drawShell(ctx, x, y, radius, scale) {\n    ctx.beginPath();\n    ctx.arc(x, y, radius, 0, scale * Math.PI, false);\n    ctx.closePath();\n}\n',
				background: '#ffffff',
				foreground: '#454545',
				sizes: [
					{width: 512, height: 512},
					{width: 256, height: 256},
					{width: 192, height: 192},
					{width: 180, height: 180},
					{width: 144, height: 144},
					{width: 128, height: 128},
					{width: 120, height: 120},
					{width: 90, height: 90},
					{width: 64, height: 64},
					{width: 48, height: 48},
					{width: 32, height: 32},
					{width: 16, height: 16},
				],
			}
		},
		ready: function () {
			this.$.editor.$on('run', function () {
				this.render()
			}.bind(this))

			this.$.editor.$watch('code', function (val) {
				this.code = val
			}.bind(this))

			this.$.colorPicker.$watch('color', function (val) {
				this.background = val
			}.bind(this))

			this.$.colorPicker.$watch('contrast', function (val) {
				this.foreground = val
			}.bind(this))

			this.render()
		},
		methods: {
			render: function () {
				this.$.gallery.render()
			}
		}
	})

	Vue.component('favi-color-picker', FaviColorPicker)
	Vue.component('favi-editor', Editor)
	Vue.component('favi-gallery', CodeGallery)


	window.app = new App({el: '#app'})
})
