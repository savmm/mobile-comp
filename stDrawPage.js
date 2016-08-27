(function ($) {
	$.fn.stDrawPage = function (options) {
		var _target = $(this);
		
		var NS = "http://www.w3.org/2000/svg";
		/*TYPES*/
		function Point(x, y) {
			this.x = x;
			this.y = y;
		}

		function Size(width, height) {
			this.width = width;
			this.height = height;
		}

		function rotate(r, rx, ry) {
			this.rotate = r;
			this.rotateX = rx;
			this.rotateY = ry;
		}
		/*TYPES END*/
		
		/*INIT PAGE*/
		var _pageHtml ='<div class="st-draw-bar"> \
							<div class="color-pane"></div> \
							<div class="tool-bar"> \
								<button id="button_Brush" class="btn btn-success color st-icon-paintbrush st-icon-15x " style="margin-right:30px"></button> \
								<button class="btn btn-success pen st-icon-pen2 st-icon-15x st-tool-item" data-drawmode="freehand"></button> \
								<button class="btn btn-success text st-icon-text st-icon-15x st-tool-item" data-drawmode="text"></button> \
								<button class="btn btn-success shapes st-icon-shapes st-icon-15x"></button> \
							</div> \
						</div> \
						<div id="dialog_ColorPicker" class="st-dialog light" style="-webkit-animation-duration:300ms;"> \
						</div> \
						<div id="dialog_InputText" class="st-dialog light st-context" style="-webkit-animation-duration:300ms;"> \
							<div class="st-context"> \
							</div> \
						</div> \
						<div class="st-draw-page page"> \
							<svg id="stdrawpage" version="1.1" xmlns="http://www.w3.org/2000/svg" \
								xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%"> \
							</svg> \
						</div>';
		_target.append(_pageHtml);
		
	$("#dialog_ColorPicker").stDialog({
			dialogType: "ColorPicker",
			showTrigger: "#button_Brush",
			TriggerEvent: "click",
			inEffect: "zoomIn",
			outEffect: "zoomOut",
			parent:"#drawPage",
			onClose: function (data) {

				selectedColor = data.data;
				if (selectedColor != -1) {
					$(".color-pane").css("background-color", selectedColor);
					if ($(_curObject).attr("stroke")) {
						$(_curObject).attr("stroke", selectedColor);
					}

					if ($(_curObject).attr("fill") != "none") {
						$(_curObject).attr("fill", selectedColor);
					}
				}
			}
		});
		bindInputTextTab()

		function bindInputTextTab() {
			$("#dialog_InputText").stDialog({
				dialogType: "InputText",
				showTrigger: _curObject,
				TriggerEvent: "mouseheld",
				inEffect: "zoomIn",
				outEffect: "zoomOut",
				InputText: $(_curObject),
				getHtml: true,
				parent:"#drawPage",
				onClose: function (data) {
					$(_curObject[0]).html(data);
					showResizer();
				}
			});
		}
		/*INIT PAGE*/
		
		/*INIT BAR*/
		var drawBar = $(".st-draw-bar");
		var shapesPopupHtml = '<div class="shape-popup btn-group-vertical" role="group"  > \
 										<button class="btn btn-success  st-tool-item st-icon-rectangle st-icon-15x" data-drawmode="rectangle"></button> \
										<button class="btn btn-success  st-tool-item  st-icon-circle st-icon-15x" data-drawmode="circle"></button> \
										<button class="btn btn-success  st-tool-item  st-icon-trirect st-icon-15x" data-drawmode="triangle"></button> \
										<button class="btn btn-success  st-tool-item  st-icon-star st-icon-15x" data-drawmode="specialShape" data-shape="star">												</button> \
								</div>';
		drawBar.append(shapesPopupHtml);
		drawBar.find(".shape-popup").hide();

		drawBar.find(".shapes").on("click", function (event) {
			var target = $(event.target);
			var shapePopup = drawBar.find(".shape-popup");
			shapePopup.css("top", -5);
			shapePopup.css("left", target.offset().left-5);
			shapePopup.show();

		});

		drawBar.find(".st-tool-item").on("click", function (event) {
			drawMode = $(event.target).data("drawmode");
			specialShape = $(event.target).data("shape");
			drawBar.find(".shape-popup").hide();
			_ObjectHandle = false;

		});
		/*INIT BAR END*/
		
		/*BASE*/
		function getAngleAsRadian(degree) {
			return degree * Math.PI / 180;
		}

		function getPointByDecDegreeOrgin(degree, dec, orgin, pointSize) {
			return new Point(orgin.x + ((dec.width + pointSize.width) * Math.cos(getAngleAsRadian(degree))) -
				((dec.height + pointSize.height) * Math.sin(getAngleAsRadian(degree))),
				orgin.y + ((dec.width + pointSize.width) * Math.sin(getAngleAsRadian(degree))) +
				((dec.height + pointSize.height) * Math.cos(getAngleAsRadian(degree))));

		}

		function getAngleBetweenPoints(p1, p2) {
			return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
		}
		
		function getDecTwoPoint(p1, p2) {
			return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
		}

		/*END BASE*/
		
		/**Main Variables**/
		var page = $("#stdrawpage");
		var _curObject = null;
		var _startPoint = new Point();
		var _startSize = new Size();
		var _startScale = new Size();
		var _startLocation = new Point();
		var _offsetX = 0;
		var _offsetY = page.offset().top;
		var drawMode ="handle";
		var specialShape;
		var selectedColor = "blue";
		var grapHelper = new stGraphHelper();
		var resizerR = $(document.createElementNS(NS, "circle")).attr("class", "stresizer right");
		var resizerB = $(document.createElementNS(NS, "circle")).attr("class", "stresizer bottom");
		var rotater = $(document.createElementNS(NS, "circle")).attr("class", "stresizer rotate");
		var deleter = $(document.createElementNS(NS, "path")).attr("class", "stresizer delete");
		deleter.attr("d", grapHelper.getGraph("deleteShape").d);

		page.append(resizerR, resizerB, rotater, deleter);
		$(".stresizer").attr("r", 13);
		$(".stresizer").attr("transform", "translate(0,0) rotate(0,0,0) scale(1, 1)");
		$(".stresizer").on("touchstart", resizerTouchStart).hide();
		$(".stresizer").on("touchmove", resizerTouchMove).hide();
		/**Main Variables end**/
		
		/*stdrawpage Events*/
		page.bind("touchstart", function (event) {
			_startPoint.x = event.originalEvent.touches[0].clientX;
			_startPoint.y = event.originalEvent.touches[0].clientY;

			if (drawMode == "handle" || drawMode == "freehanding") {

				if (event.target.tagName == "svg") {
					$(".stresizer").hide();
					_curObject = null;
				}
				return;
			}

			createElement();
			_startSize.width = _curObject[0].getBoundingClientRect().width;
			_startSize.height = _curObject[0].getBoundingClientRect().height;
			_startLocation.x = event.originalEvent.touches[0].clientX;
			_startLocation.y = event.originalEvent.touches[0].clientY;
		});

		page.on("touchmove", function (event) {
		   if( drawMode != "handle" || _curObject !=null )
		   {
			   event.stopPropagation();
			  
		   }
            else{
				return;
			}
			if (drawMode == "handle") {
				return;
			} else if (drawMode == "freehand") {
				drawFreePath(event, false);
			} else if (drawMode == "freehanding") {
				drawFreePath(event, true);
			} else {

				var decX = ((Math.abs(event.originalEvent.touches[0].clientX - _startPoint.x - _offsetX))) / (_startSize.width);
				var decY = ((Math.abs(event.originalEvent.touches[0].clientY - _startPoint.y - _offsetY))) / (_startSize.height);

				if (_curObject[0].hasOwnProperty("r")) {
					_curObject.stDraw().setScale((decX * 2), (decY * 2));

				} else {
					_curObject.stDraw().setScale((decX), (decY));
					var x = _startPoint.x > event.originalEvent.touches[0].clientX - _offsetX ? 
						_startLocation.x - (_curObject.stDraw().size.width) : _startLocation.x;
					var y = _startPoint.y > event.originalEvent.touches[0].clientY - _offsetY ? 
						_startLocation.y - (_curObject.stDraw().size.height) : _startLocation.y;
					_curObject.stDraw().setLocation(x, y);
				}



			}
		});

		page.bind("touchend", function (event) {
			if (drawMode == "freehand") {
				drawMode = "freehanding";
			}
			else{
			drawMode ="handle";
			}
		});
		/*stdrawpage Events END*/
		
		/*Methods*/	
		function drawFreePath(event, start) {
			if (start) {
				_curObject.attr("d", _curObject.attr("d") + "M" + (_startPoint.x - _startLocation.x) + "," +
					(_startPoint.y - _startLocation.y) +
					" L");
				drawMode = "freehand";

			}
			_curObject.attr("d", _curObject.attr("d") + (_startPoint.x - _startLocation.x) + "," +
				(_startPoint.y - _startLocation.y) +
				" ");
			_startPoint.x = event.originalEvent.touches[0].clientX;
			_startPoint.y = event.originalEvent.touches[0].clientY;
		}
		
		function createElement() {

			var preScale = "1";
			var object;
			switch (drawMode) {
			case "circle":
				{
					object = document.createElementNS(NS, "circle");
					$(object).attr("fill", selectedColor);
					object.r.baseVal.value = 5;
					break;

				}
			case "rectangle":
				{
					object = document.createElementNS(NS, "rect");
					$(object).attr("fill", selectedColor);
					object.width.baseVal.value = 10;
					object.height.baseVal.value = 10;
					break;
				}
			case "triangle":
				{
					object = document.createElementNS(NS, "polyline");
					$(object).attr("fill", selectedColor);
					$(object).attr("points", "0,0  30,0  15,30")
					break;
				}
			case "specialShape":
				{
					object = document.createElementNS(NS, "path");
					$(object).attr("fill", selectedColor);
					$(object).attr("d", grapHelper.getGraph(specialShape).d);
					break;
				}
			case "freehand":
				{
					object = document.createElementNS(NS, "path");
					$(object).attr("d", "M0,0 L0,0 ");
					/*Style*/
					$(object).attr("fill", "none");
					$(object).attr("stroke", selectedColor);
					$(object).attr("stroke-width", "2");
					break;
				}
			case "text":
				{
					object = document.createElementNS(NS, "text");
					_curObject = $(object);
					_curObject.append("Basılı Tut Yaz")
					/*Style*/
					_curObject.attr("fill", selectedColor);
					_curObject.css("font-size", "30px");
					/*events*/
					_curObject.attr("class", "stdraw-textinput");
					break;
				}
			}
			_curObject = $(object);
			_curObject.attr("transform", "translate(0,0) rotate(0,0,0) scale(" + preScale + "," + preScale + ")");

			_curObject.stDraw().setLocation(_startPoint.x - _offsetX, _startPoint.y - _offsetY);
			_curObject.on("touchstart", elementTouchStart);
			_curObject.on("touchmove", elementTouchMove);
			page.append(_curObject);
			if (drawMode == "text") {
				bindInputTextTab();
			}

		}
		
		function showResizer() {
			$(".stresizer").show();
			var rPoints = getRotatedRectMidPoints(_curObject, _curObject.stDraw().getTransform().rotate.rotate, 13);
			resizerR.stDraw().setLocation(rPoints[0].x, rPoints[0].y);
			resizerB.stDraw().setLocation(rPoints[1].x, rPoints[1].y);
			rotater.stDraw().setLocation(rPoints[2].x, rPoints[2].y);
			deleter.stDraw().setLocation(rPoints[3].x, rPoints[3].y);
		}
		
		/* Return Points: Right,Top,Bottom,Left in an Array*/
		function getRotatedRectMidPoints(rect, angle, pointWidth) {
			var size = rect.stDraw().size;
			var cx = rect.stDraw().getTransform().transform.x
			var cy = rect.stDraw().getTransform().transform.y
			if (!rect[0].hasOwnProperty("r")) {
				cx = rect.stDraw().getTransform().transform.x + (size.width / 2)
				cy = rect.stDraw().getTransform().transform.y + (size.height / 2)
			}
			if (rect[0].tagName == "text") {
				cy -= ((size.height - 10))
			}

			var r = new Point(0, 0);
			var t = new Point(0, 0);
			var b = new Point(0, 0);
			var l = new Point(0, 0);
			r = getPointByDecDegreeOrgin(angle, new Size(size.width / 2, 0), new Point(cx, cy), new Size(pointWidth, 0));
			b = getPointByDecDegreeOrgin(angle, new Size(0, size.height / 2), new Point(cx, cy), new Size(0, pointWidth));
			rt = getPointByDecDegreeOrgin(angle, new Size(0, -1 * (size.height + 50) / 2), new Point(cx, cy), new Size(0, 0));
			dl = new Point(cx - (size.width / 2) - (pointWidth * 2), cy - (size.height / 2) - (pointWidth * 2));
			var result = new Array();
			result.push(r, b, rt, dl);
			return result;
		}
		/*Methods END*/
		
		/*Element Events*/
		function elementTouchStart(event) {
			drawMode = "handle";
			_curObject = $(event.target);
			_startPoint.x = event.originalEvent.touches[0].clientX;
			_startPoint.y = event.originalEvent.touches[0].clientY;

			_startLocation.x = _curObject.stDraw().getTransform().transform.x;
			_startLocation.y = _curObject.stDraw().getTransform().transform.y;
			page.append(resizerR, resizerB, rotater, deleter);
			page.append(_curObject);
			showResizer();
		}

		function elementTouchMove(event) {
			_curObject.attr("fill-opacity", "0.7");
			if (event.originalEvent.touches.length == 1) {
				var size = _curObject.stDraw().size;
				if (_curObject[0].hasOwnProperty("r")) {
					_curObject.stDraw().setLocation(
						(event.originalEvent.touches[0].clientX) - _offsetX,
						event.originalEvent.touches[0].clientY - _offsetY);
				} else {
					_curObject.stDraw().setLocation(
						(event.originalEvent.touches[0].clientX) - Math.abs(_startPoint.x - _startLocation.x),
						event.originalEvent.touches[0].clientY - Math.abs(_startPoint.y - _startLocation.y));
				}
				showResizer()
			}
		}

		function elementTouchEnd(event) {
			_curObject.attr("fill-opacity", "1");
		}
	   /*Element Events End*/
		
				function resizerTouchStart(event) {

			if (event.target.classList.contains("delete")) {

				_curObject.remove();
				$(".stresizer").hide();
				return;
			}
			_startPoint.x = event.originalEvent.touches[0].clientX;
			_startPoint.y = event.originalEvent.touches[0].clientY;
			_startSize.width = _curObject[0].getBoundingClientRect().width;
			_startSize.height = _curObject[0].getBoundingClientRect().height;
			_startScale.width = _curObject.stDraw().getTransform().scale.x;
			_startScale.height = _curObject.stDraw().getTransform().scale.y;


			_startLocation.x = _curObject.stDraw().getTransform().transform.x;
			_startLocation.y = _curObject.stDraw().getTransform().transform.y;

		}
		
		/*Resizer Events*/
		function resizerTouchMove(event) {
			if (event.target.classList.contains("rotate")) {
				var p = new Point(event.originalEvent.touches[0].clientX - _offsetX, event.originalEvent.touches[0].clientY - _offsetY);
				var size = new Size(0, 0);
				if (!_curObject[0].hasOwnProperty("r")) {
					size = _curObject.stDraw().size;
				}
				if (_curObject[0].tagName == "text") {
					size = _curObject.stDraw().size;
					size.height -= (size.height - 10) * 2;
				}
				var x = (size.width / 2)
				var y = (size.height / 2);
				_curObject.stDraw().setRotateFromOrgin(90 +
					getAngleBetweenPoints(
						new Point(_startLocation.x + x,
							_startLocation.y + y),
						p));
			} else {
				var decX = (event.originalEvent.touches[0].clientX - _startPoint.x) / _startSize.width;
				var decY = (event.originalEvent.touches[0].clientY - _startPoint.y) / _startSize.height;
				_curObject.stDraw().setScale(_startScale.width + (decX * _startScale.width), _startScale.height + (decY * _startScale.height));
			}
			showResizer();
		}
		/*Resizer Events*/
		
	}

}(jQuery));





















