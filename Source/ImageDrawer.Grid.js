/*
---
description: It makes it to non-display by dividing the image into a small grid.

license: MIT-style

authors:
- Noritaka Horio

requires:
  core/1.2.4:
  - Core/Core
  - Core/Browser
  - Native/Array
  - Native/Function
  - Native/Number
  - Native/String
  - Native/Hash
  - Native/Event
  - Class/Class
  - Class/Class.Extras
  - Element/Element
  - Element/Element.Event
  - Element/Element.Style
  - Element/Element.Dimensions
  - Utilities/Selecter
  - Utilities/DomReady
  - Fx/Fx
  - Fx/Fx.Transitions

provides: [ImageDrawer, ImageDrawer.Grid, ImageDrawer.Slice]

...
*/


ImageDrawer.Grid = new Class({

	Extends: ImageDrawer,

	options: {
		'canvas': null,
		'source': null,
		'height': 50,
		'width': 50,
		'duration': 30
	},

	initialize: function(options) {
		this.parent(options);
	},

	onMotion: function(props) {
		var drawHeight = (props.height > 0) ? props.height : 0.01;
		var drawWidth  = (props.width > 0) ? props.width : 0.01;
		var left = (props.left > 0) ? props.left : 0.01;
		var top = (props.top > 0) ? props.top : 0.01;

		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.context.drawImage(this.source,
			left, top, drawWidth, drawHeight,
			left, top, drawWidth, drawHeight);
	},

	setupDrawer: function(canvas) {
		this.parent(canvas);
		this.cols = this.size.x / this.options.width; 
		this.rows = this.size.y / this.options.height;
		this.total = this.cols * this.rows;
	},

	getContext: function(x, y) {
		var options = this.options;
		return {
			"context": this.context,
			"source": this.source,
			"x": x, "y": y,
			"width": options.width,
			"height": options.height
		};		
	},

	draw: function(porps) {
		this.parent();

		var op = this.options;
		var duration = op.duration;

		this.drawing = true;
		this.drawers = [];		

		this.fireEvent("drawStart");
		porps.each(function(p, k) {
			var fx = new Fx.ImageDrawer({
				"transition": op.transition,
				"duration": duration,
				"link": "cancel",
				"fps": 30,
				"onMotion":	this.onMotion.bind(p),
				"onComplete": this.onProgress.bind(this)
			});

			fx.start({
				"height": [op.height, 0],
				"width": [op.width, 0],
				"top": [p.y, p.y + op.height / 2],
				"left": [p.x, p.x + op.width / 2]
			});
			duration = duration + op.interval;
			this.drawers.push(fx);
		}, this);
	},

	drawLeft: function() {
		var contexts = [];
		var options = this.options;
		for (var x = 0; x < this.cols; x++) {
			for (var y = 0; y < this.rows; y++) {
				var left = x * options.width;
				var top = y * options.height;
				contexts.push(this.getContext(left, top));
			}
		}
		this.draw(contexts);
	},

	drawRight: function() {
		var contexts = [];
		var options = this.options;
		for (var x = this.cols; x > 0; x--) {
			for (var y = 0; y < this.rows; y++) {
				var left = (x - 1) * options.width;
				var top = y * options.height;
				contexts.push(this.getContext(left, top));
			}
		}
		this.draw(contexts);
	},


	drawTop: function() {
		var contexts = [];
		var options = this.options;
		for (var y = 0; y < this.rows; y++) {
			for (var x = 0; x < this.cols; x++) {
				var left = x * options.width;
				var top = y * options.height;
				contexts.push(this.getContext(left, top));
			}
		}
		this.draw(contexts);
	},

	drawBottom: function() {
		var contexts = [];
		var options = this.options;
		for (var y = this.rows; y >= 0; y--) {
			for (var x = 0; x < this.cols; x++) {
				var left = x * options.width;
				var top = y * options.height;
				contexts.push(this.getContext(left, top));
			}
		}
		this.draw(contexts);
	}

});
