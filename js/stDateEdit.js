(function ($) {
	$.fn.stDateEdit = function (options) {
		var _options = options;
		var _dateEdit = $(this);
		var _now = new Date();

		var _daysS = new Array("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
		var _daysL = new Array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");

		var _daysStr = new Array("Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz");
		var _daysLtr = new Array("Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar");

		var _monthL = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
		var _monthL = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');

		var _monthStr = new Array("Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara");
		var _monthLtr = new Array('Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık');

		var _curDaysS, _curDaysL;
		var _curMonthS, _curMonthL;
		if (options.lang == "tr") {
			_curDaysS = _daysStr;
			_curDaysL = _daysLtr;
			_curMonthL = _monthLtr;
			_curMonthS = _monthStr;
		}

		_dateEdit.find(".date").on("click", function (event) {
			onDateClick(event);
		});

		_dateEdit.find(".time").on("click", function (event) {
			onTimeClick(event);
		});

		_dateEdit.parents().find("body").append('<div id="dialog_Date" class="st-dialog light" style="-webkit-animation-duration:300ms;">');
		_dateEdit.parents().find("body").append('<div id="dialog_Time" class="st-dialog light" style="-webkit-animation-duration:300ms;">');
		_dateEdit.find(".date").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
			function (event) {
				var target = $(event.target);
				target.removeClass("animated bounceIn");
			});

		function onDateClick(event) {
			_dateEdit.find(".time-popup").hide();
			var target = $(event.target);
			target.addClass("animated bounceIn").show();
			var datePopup = _dateEdit.find(".date-popup");
			datePopup.css("top", _dateEdit.find(".date").position().top - _dateEdit.find(".date-popup").height());
			datePopup.css("left", _dateEdit.find(".date").position().left);
			datePopup.show();
		}

		function onTimeClick(event) {
			_dateEdit.find(".date-popup").hide();
			var target = $(event.target);
			target.addClass("animated bounceIn").show();
			var datePopup = _dateEdit.find(".time-popup");
			datePopup.css("top", _dateEdit.find(".time").position().top - _dateEdit.find(".time-popup ").height());
			datePopup.css("left", _dateEdit.find(".time").position().left);
			datePopup.show();
		}
		initPopups();

		function initPopups() {
			var datePopupHtml = '<div class="date-popup btn-group-vertical" role="group"  > \
 									<button type="button" class="popup-today btn" data-date="today" data-caption="Bugün">Bugün</button> \
  									<button type="button" class="popup-tomorrow btn" data-date="tomorrow" data-caption="Yarın">Yarın</button>\
								</div>';
			_dateEdit.append(datePopupHtml);
			_dateEdit.find(".date-popup").hide();
			_dateEdit.find(".date-popup").append('<button type="button" class="popup-next-week btn o" \
													data-date="nextweek" data-caption="Sonraki ' + _curDaysL[(7+(_now.getDay() - 1)) %7] + '">Sonraki ' +
				_curDaysL[(7+(_now.getDay() - 1)) %7] + '</button>');
			_dateEdit.find(".date-popup").append('<button type="button" class="popup-select-date btn" data-date="select" >Bir Tarih Seçin ...</button>');

			_dateEdit.find(".date-popup").find(".btn").on("click", function (event) {
				_dateEdit.find(".date-popup").hide();
				setDate($(event.target).data("date"), $(event.target).data("caption"));

			});



			_dateEdit.parents().find("body").children("#dialog_Date").stDialog({
				dialogType: "DatePicker",
				targetDate: new Date(),
				showTrigger: _dateEdit.find(".popup-select-date"),
				TriggerEvent: "click",
				onClose: function (data) {

					if (data.getFullYear() == _now.getFullYear() && data.getMonth() == _now.getMonth()) {
						if (data.getDate() == _now.getDate()) {
							_dateEdit.find(".date").html("Bugün");
						} else
						if (data.getDate() == _now.getDate() + 1) {
							_dateEdit.find(".date").html("Yarın");
						} else
						if (data.getDate() == _now.getDate() + 7) {
							_dateEdit.find(".date").html("Sonraki " + _curDaysL[data.getDay() - 1]);
						} else {
							_dateEdit.find(".date").html(data.getDate() + " " + _curMonthL[data.getMonth()]);
						}
					}

					if (data.getFullYear() == _now.getFullYear() && data.getMonth() != _now.getMonth()) {
						_dateEdit.find(".date").html(data.getDate() + " " + _curMonthL[data.getMonth()]);
					}

					if (data.getFullYear() != _now.getFullYear()) {
						_dateEdit.find(".date").html(data.getDate() + " " + _curMonthL[data.getMonth()]);
					}

					_dateEdit.attr("data-date", data.toLocaleDateString());

					_dateEdit.children("#dialog_Date").html("");
				}
			});



			var timePopupHtml = '<div class="time-popup btn-group-vertical" role="group"  > \
 									<button type="button" class="popup-early btn" data-time="early" data-caption="Erkenden">Erkenden</button> \
  									<button type="button" class="popup-morning btn" data-time="morning" data-caption="Sabah">Sabah</button>\
									<button type="button" class="popup-noon btn" data-time="noon" data-caption="Öğlen">Öğlen</button>\
									<button type="button" class="popup-evening btn" data-time="evening" data-caption="Akşam">Akaşm</button>\
									<button type="button" class="popup-night btn" data-time="night" data-caption="Gece">Gece</button>\
									<button type="button" class="popup-ahour btn" data-time="ahour" data-caption="1 Saat Sonra">1 Saat Sonra</button>\
									<button type="button" class="popup-select-time btn" data-time="popup-select-time " data-caption="Saat Seçin ...">Saat Seçin ...</button>\
								</div>';
			_dateEdit.append(timePopupHtml);

			_dateEdit.find(".time-popup").hide();

			_dateEdit.find(".time-popup").find(".btn").on("click", function (event) {
				_dateEdit.find(".time-popup").hide();
				setTime($(event.target).data("time"), $(event.target).data("caption"));

			});
			
			_dateEdit.parents().find("body").children("#dialog_Time").stDialog({
				dialogType: "TimePicker",
				targetDate: new Date(),
				showTrigger: _dateEdit.find(".popup-select-time"),
				TriggerEvent: "click",
				onClose: function (data) {
					_dateEdit.find(".time").html(data.hour+" : "+data.min);
					_dateEdit.children("#dialog_Date").html("");
				}
			});

		}

		function setTime(time, caption) {
		
			if (time == "early") {
				_dateEdit.attr("data-time", "07:00:00");
			}
			if (time == "morning") {
				_dateEdit.attr("data-time", "09:00:00");
			}
			if (time == "noon") {
				_dateEdit.attr("data-time", "12:30:00");
			}
			if (time == "evening") {
				_dateEdit.attr("data-time", "18:00:00");
			}
			if (time == "night") {
				_dateEdit.attr("data-time", "22:00:00");
			}
			_dateEdit.find(".time").html(_dateEdit.attr("data-time"));
			if (time == "ahour") {
				_dateEdit.attr("data-time", _now.getHours() + 1 + ":" + _now.getMinutes() + ":00");
				_dateEdit.find(".time").html(_now.getHours() + 1 + ":" + _now.getMinutes());
			}
		}

		function setDate(time, caption) {
			_dateEdit.find(".date").html(caption);

			if (date == "today") {
				_dateEdit.attr("data-date", _now);
			}
			if (date == "tomorrow") {
				var date = new Date();
				date.setDate(date.getDate() + 1);
				_dateEdit.attr("data-date", date);
			}
			if (date == "nextweek") {
				var date = new Date();
				date.setDate(date.getDate() + 7);
				_dateEdit.attr("data-date", date);
			}
		}

		return $(this);
	};


}(jQuery));