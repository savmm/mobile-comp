(function ($) {

	$.fn.stDialog = function (options) {
		var _dialog;
		var _options;
		var _selectedBox;
		var _InEffect;
		var _OutEffect;
		_dialog = $(this);
		_options = options;
		_InEffect = _options.inEffect;
		_OutEffect = _options.outEffect;
		var showTrigger = $(options.showTrigger);
		var _TargetDate;
		var _Input;

		showTrigger.on(_options.TriggerEvent, function () {

			showDialog();

		});

		if (_options.dialogType == "ActionBox") {
			_dialog.css("top", "20%");
			_dialog.find(".action-box").on(_options.TriggerEvent, function (event) {
				boxSelected(event);
			});

			_dialog.find(".action-box").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
				function (event) {
					var target = $(event.target);
					target.removeClass("animated " + _InEffect);
				});
		}

		if (_options.dialogType == "ItemSelect") {
			_InEffect = "fadeInUp";
			_OutEffect = "fadeOutDown";
			_dialog.css("margin", "0px");
			_dialog.css("max-width", "100%");
			_dialog.css("width", "100%");
			_dialog.addClass("st-footer");
		}

		if (_options.dialogType == "DatePicker") {
			_InEffect = "zoomIn";
			_OutEffect = "zoomOut";
			_TargetDate = options.targetDate;
			_dialog.css("width", "auto");
			_dialog.css("top", "10%");
			bindResize();
		}
		

		if (_options.dialogType == "TimePicker") {
			_InEffect = "zoomIn";
			_OutEffect = "zoomOut";
			_TargetDate = options.targetDate;
			_dialog.css("width", "auto");
			_dialog.css("top", "10%");
			bindResize();
	
		}
		
		if (_options.dialogType == "ColorPicker") {
			_InEffect = "zoomIn";
			_OutEffect = "zoomOut";
			_dialog.css("width", "220");
			_dialog.css("top", "20%");
			bindResize();
		}
		
		if (_options.dialogType == "InputText") {
			_InEffect = "zoomIn";
			_OutEffect = "zoomOut";
			_dialog.css("width", "220");
			_dialog.css("top", "20%");
			bindResize();
		}

		_dialog.addClass("animated " + _InEffect).hide();

		function bindResize()
		{
				$(window).resize(function () {
				if (_options.dialogType == "DatePicker") {
					initDatePicker();
				}
				if (_options.dialogType == "TimePicker") {
					initTimePicker();
				}
			});
		}
		
		 function initColorPicker() {
			_dialog.html('<div  class="st-colorpicker">  </div>');
			_dialog.find(".st-colorpicker").stColorPicker({
					onSelect: function (data) {
					hideDialog(data);
					_dialog.parent().children("#"+_dialog.get(0).id).hide();
					_dialog.html("");

				}

			});

		}

		function initTimePicker() {
			_dialog.html('<div  class="st-timepicker">  </div>');
			_dialog.find(".st-timepicker").stDatePicker({
				type: "Time",
				lang: "tr",
				targetDate: new Date(_TargetDate),
				onSelect: function (date) {
					hideDialog(date);
					_dialog.parent().children("#"+_dialog.get(0).id).hide();
					_dialog.html("");

				}
			});
			_dialog.css("width", "auto");
			_dialog.css("height", "auto");
		}

		function initDatePicker() {
			_dialog.html("");
			_dialog.append('<div  class="st-datepicker">  </div>');
			_dialog.find(".st-datepicker").stDatePicker({
				type: "Date",
				lang: "tr",
				targetDate: new Date(_TargetDate),
				onSelect: function (date) {
					hideDialog(date);
						_dialog.parent().children("#"+_dialog.get(0).id).hide();
					_dialog.html("");

				}
			});
			_dialog.css("width", "auto");
			_dialog.css("height", "auto");
		}

		function boxSelected(event) {
			var target = $(event.target);
			if (target.get(0).tagName == "I") {
				target = target.parent();
			}
			target.addClass("animated bounceIn").show();
			if (target.hasClass("st-alert")) {
				_selectedBox = "alert";
			}
			if (target.hasClass("st-meeting")) {
				_selectedBox = "meeting";
			}
			hideDialog(_selectedBox);
		}

		function initInput()
		{
			_dialog.css("width", "auto");
			_dialog.find(".st-context").append("<input class='st-dialog-input'/>");
			_dialog.find(".st-context").append("<button class='st-dialog-datepicker-ok btn-input' >Tamam</button> ");
			_Input =_dialog.children(".st-context").children(".st-dialog-input");
			if(_options.getHtml)
			{
			_Input.val(_options.InputText.html());
			}
			else{
				_Input.val(_options.InputText);
			}
			_Input.select();
			_dialog.find(".st-context").children(".btn-input").on("click",function()
																  {
					hideDialog(_Input.val());
						_dialog.find(".st-context").html("");
						});
		
		}

		function hideDialog(result) {
			_dialog.removeClass(_InEffect).addClass(_OutEffect).show();
			_dialog.parent().children(".st-dialog-overlay").remove();
			_dialog.hide();
			_options.onClose.call(_dialog, result);

		}

		function showDialog() {
			if(_options.parent== null)
			{
				_dialog.parents().find("body").append("<div id='st-dialog-overlay' class='st-dialog-overlay'></div>");
			} else
			{
			$("body").find(_options.parent).append("<div id='st-dialog-overlay' class='st-dialog-overlay'></div>");
			}
			_dialog.removeClass(_OutEffect).addClass(_InEffect).show();
							if (_options.dialogType == "DatePicker") {
							initDatePicker();
						}
						if (_options.dialogType == "TimePicker") {
							initTimePicker();
						}
						if (_options.dialogType == "ColorPicker") {
							initColorPicker();
						}
						if (_options.dialogType == "InputText") 
						{
										initInput();
					   }
			_dialog.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
				function (event) {
				if($(event.target).hasClass("st-dialog"))
					if (_dialog.hasClass(_InEffect)) {
						if (_options.dialogType == "DatePicker") {
							initDatePicker();
						}
						if (_options.dialogType == "TimePicker") {
							initTimePicker();
						}
						if (_options.dialogType == "InputText") {
							_Input.focus();
						}
					
					}
				});
		}
		
		return $(this);
		
		
	};

}(jQuery));