(function ($) {
	$.fn.stColorPicker = function (options) {
		function Point(x, y) {
			this.x = x;
			this.y = y;
		}

		function getDecTwoPoint(p1, p2) {
			return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
		}
		var _options = options;
		var target = $(this);

		target.append("<canvas id='colorWheel' ></canvas>");
		target.append(" <div class='footer vertical' > \
													<div class='st-dialog-datepicker-ok  btn' style='width:50%; height:100%;float:right'>Tamam</div> \
													<div class='st-dialog-datepicker-ok cancel btn' style='width:50%; height:100%;'>İptal</div> \
									  </div>");
		var colorWheel = target.find("#colorWheel");
		colorWheel.attr("width", "195");
		colorWheel.attr("height", "195");
		var canvas = target.find("#colorWheel")[0];
		var context = canvas.getContext('2d');
		var color, baseColor;
		var base_image = new Image();
		base_image.src = 'img/wheel.png';
		base_image.onload = function () {
			context.drawImage(base_image, 0, 0, 195, 195);
		}
		colorWheel.on("touchmove", onWheelTouchMove);
		colorWheel.on("touchstart", onWheelTouchStart);
		var btnSelect = target.find(".st-dialog-datepicker-ok");
		var btnCancel = target.find(".st-dialog-datepicker-ok.cancel");
		btnCancel.css("background-color","rgb(197, 211, 218)");
		function rgbToHex(r, g, b) {
			if (r > 255 || g > 255 || b > 255)
				throw "Invalid color component";
			return ((r << 16) | (g << 8) | b).toString(16);
		}


		function roundedRect(x, y, width, height, radius) {
			context.save(); // save the context so we don't mess up others
			context.beginPath();

			// draw top and top right corner
			context.moveTo(x + radius, y);
			context.arcTo(x + width, y, x + width, y + radius, radius);

			// draw right side and bottom right corner
			context.arcTo(x + width, y + height, x + width - radius, y + height, radius);

			// draw bottom and bottom left corner
			context.arcTo(x, y + height, x, y + height - radius, radius);

			// draw left and top left corner
			context.arcTo(x, y, x + radius, y, radius);

			context.fill();

			context.restore(); // restore context to what it was on entry
		}


		function draw(ctx, hue) {
			var grd;
			// Create gradient
			grd = context.createLinearGradient(0.000, 150.000, 300.000, 150.000);

			// Add colors
			grd.addColorStop(0.180, 'white');
			grd.addColorStop(0.350, "rgba(" + hue[0] + "," + hue[1] + "," + hue[2] + ", 1.000)");
			grd.addColorStop(0.470, 'black');

			// Fill with gradient
			context.fillStyle = grd;
			roundedRect(53, 53, 90, 90, 10);

		}

		function changeColor(color) {
			var p1 = new Point((target.width() / 2), (target.height() / 2));
			context.beginPath();
			context.arc(p1.x - 12, p1.y - 19, 70, 0, 2 * Math.PI, false);
			context.fillStyle = color;
			context.stroke = "none"
			context.fill();
			btnSelect.css("background-color", color);
			btnCancel.css("background-color","rgb(197, 211, 218 ");
			
		}
		
		function findColor(event)
		{
					var p1 = new Point((colorWheel.width() / 2), (colorWheel.height() / 2));
			var p2 = new Point(event.originalEvent.touches[0].clientX - colorWheel.offset().left,
				event.originalEvent.touches[0].clientY - colorWheel.offset().top);

			var dec = getDecTwoPoint(p1, p2);
			console.info(dec);
			if (dec > 70 && dec < 95) {
				baseColor = context.getImageData(event.originalEvent.touches[0].clientX - colorWheel.offset().left,
					event.originalEvent.touches[0].clientY - target.offset().top, 1, 1).data;
				color = baseColor;
				changeColor("rgb(" + baseColor[0] + "," + baseColor[1] + "," + baseColor[2] + ")");
				draw(context, baseColor);

			} else if (Math.abs(p2.x - p1.x) < 45 && Math.abs(p2.y - p1.y) < 45) {

				color = context.getImageData(event.originalEvent.touches[0].clientX - colorWheel.offset().left,
					event.originalEvent.touches[0].clientY - target.offset().top, 1, 1).data;

				changeColor("rgb(" + color[0] + "," + color[1] + "," + color[2] + ")");
				draw(context, baseColor);

			}
		}

		function onWheelTouchMove(event) {

			   event.stopPropagation();
				findColor(event)
		}
		
		function onWheelTouchStart(event) {

				findColor(event)
		}
		
		btnSelect.on("click", function (event) {
			var rgb ;
			if ($(event.target).hasClass("cancel")) {
				rgb = -1;
			} else {
				rgb = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
			}
			_options.onSelect.call(target, {
				data: rgb
			});
			target.html("");
		});
		return $(this);
	};


}(jQuery));