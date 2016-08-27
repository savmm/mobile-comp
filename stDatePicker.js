(function ($) {

	$.fn.scrollStopped = function (callback) {
		var $this = $(this),
			self = this;
		$this.scroll(function () {
			if ($this.data('scrollTimeout')) {
				clearTimeout($this.data('scrollTimeout'));
			}
			$this.data('scrollTimeout', setTimeout(callback, 250, self));
		});
	};

	$.fn.stDatePicker = function (options) {

		var _daysS = new Array("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
		var _daysL = new Array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");

		var _daysStr = new Array("Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz");
		var _daysLtr = new Array("Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar");

		var _monthL = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
		var _monthL = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');

		var _monthStr = new Array("Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara");
		var _monthLtr = new Array('Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık');

		var _daysHtml = "";
		var _picker;
		var _pickerSelectedBg;
		var _selectedDay;
		var _monthTops = new Array;
		var _detailMonth, _detailDay, _detailYear, _detailHeader;
		var _options;

		_target = $(this);
		_options = options;
		var _curMonth = _options.targetDate.getMonth();
		var _curYear = _options.targetDate.getFullYear();
		var _curDay = _options.targetDate.getDate();
		var _tocuhY = 0;
		var _hour, _min;
		var hour;
		var min;
		var _timeType;

		var _curDaysS, _curDaysL;
		var _curMonthS, _curMonthL;
		if (options.lang == "tr") {
			_curDaysS = _daysStr;
			_curDaysL = _daysLtr;
			_curMonthL = _monthLtr;
			_curMonthS = _monthStr;
		}

		if (options.type == "Date") {
			initDatePicker(_options.targetDate);
		}
 
		if (options.type == "Time") {
			initTimePicker(_options.targetDate);
		}

		function initTimePicker(date) {

			_hour = date.getHours();
			if ($(document).width() <= 450) {
					_target.append(" <div class='detail vertical'> \
										<div class='labels'> \
										   <label class='hour'> </label> \
										   <label>:</label> \
										   <label class='min'></label> \
										</div> \
									</div>	 \
									<div class='timer-container vertical'> \
													   <div class='circle centre'> \
													 <div class='line1'> </div> \
									</div> ");

					_target.append(" <div class='footer vertical' > \
													<div class='st-dialog-datepicker-ok btn' style='width:100%; height:100%;'>Bitti</div> \
									  </div>");
				_target.css("width","230px");
				_target.css("height","320px");
			}else if ($(document).width() > 450) {
					_target.append(" <div class='detail horizontal'> \
										<div class='labels horizontal'> \
										   <label class='hour'> </label> \
										   <label>:</label> \
										   <label class='min'></label> \
										</div> \
									</div>	 \
									<div> \
									<div class='timer-container horizontal'> \
													   <div class='circle centre'> \
													 <div class='line1'> </div> \
									</div> \
								   </div>");
					_target.append(" <div class='footer horizontal' > \
													<div class='st-dialog-datepicker-ok btn' style='width:100%; height:100%;'>Bitti</div> \
									  </div>");
				_target.css("width","80%");
			}
			

			hour = _target.find(".detail").find(".hour");
			min = _target.find(".detail").find(".min");
			_hour = date.getHours() - 3;
			_min = date.getMinutes();

			min.on("click", function () {
				changeType("min")


			});
			_target.find(".st-dialog-datepicker-ok").on("click", function (event) {
				_options.onSelect.call(_target, {
					hour: hour.html(),
					min: min.html()
				});

			});
			hour.on("click", function () {
				changeType("hour");


			});
			changeType("hour");

		}
        
	   function Point(x, y) {
			this.x = x;
			this.y = y;
		}

	    function getDecTwoPoint(p1, p2) {
			return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
		}
        

		var container;

		function changeType(type) {
			if (type == "min") {
				_timeType = type;
				initHours(type);
			}

			if (type == "hour") {
				_timeType = type;
				initHours(type);


			}

			container.addClass("animated zoomIn");
		}


		function initHours(type) {

			container = _target.find(".timer-container");
			container.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
				function (event) {
					container.removeClass("animated zoomIn");
				});
			container.html("");
			container.append(" 	<div class='focus'> </div> \
									<div class='centre'></div>  \
								<div class='line1'> \
									<div class='line'> </div>  \
							 	</div> ");

			var r1, r2;
			var circle;
			var clockText;


			if (_timeType == "hour") {

				for (i = 0; i < 12; i++) {

					clockText = parseInt(i + 3) % 12;
					if (clockText == 0) {
						clockText = 12;
					}
					container.append("<div class='circle hour pm deg" + i + "'><label>" + clockText + "</label></div>");
					r1 = (i * 30)
					r2 = (-1 * i * 30)
					circle = container.find(".deg" + i);
					circle.css("transform", "rotate(" + r1 + "deg) translate(" + parseInt((parseInt(container.css("height")) / 2) - 45) + "px) rotate(" + r2 + "deg)");
					circle.attr("data-deg", parseInt(r1 / 30));

				}

				for (i = 0; i < 12; i++) {

					clockText = parseInt(i + 3) % 12;
					if (clockText == 0) {
						clockText = 12;
					}
					container.append("<div class='circle hour am deg" + parseInt(i + 12) + "'><label>" + parseInt(clockText + 12) + "</label></div>");
					r1 = (i * 30)
					r2 = (-1 * i * 30)
					circle = container.find(".deg" + parseInt(i + 12));
					circle.css("transform", "rotate(" + r1 + "deg) translate(" + parseInt((parseInt(container.css("height")) / 2) - 20) + "px) rotate(" + r2 + "deg)");
					circle.attr("data-deg", parseInt(r1 / 30) + 12);

				}
				min.css("color", "#929898");
				hour.css("color", "#52C0F9");
				var line = container.find(".line1");
				line.css("width", (line.position().left - 15) + "px");
				var x1, x2, y1, y2, t, ang, dec;
				var tp = container.position();
				var focus = container.find(".focus");
				var angPow, angMod;
				container.bind("touchmove", function (event) {
					if (_timeType == "hour") {
						t = event.originalEvent.touches[0];

						x1 = (container.width() / 2) + parseInt(container.offset().left);
						y1 = (container.width() / 2) + parseInt(container.offset().top);

						ang = Math.atan2(t.clientY - y1, t.clientX - x1) * 180 / Math.PI;
						dec = Math.sqrt(Math.pow((x1 - t.clientX), 2) + Math.pow((y1 - t.clientY), 2));


						//console.info( t.screenX +" "+t.screenY);
						angPow = parseInt(ang / 30);
						angMod = Math.abs(ang % 30);


						if (ang > (angPow * 30) + 15) {
							line.css("transform", "rotate(" + ((angPow + 1) * 30) + "deg");
							setActiveCircle(parseInt(angPow + 1));

						} else
						if (ang < (angPow * 30) - 15) {
							line.css("transform", "rotate(" + ((angPow - 1) * 30) + "deg");
							setActiveCircle(parseInt(angPow + 10) + 1);

						} else if (ang < 15 && ang > -15) {
							line.css("transform", "rotate(0deg");
							setActiveCircle(0)
						}
					}

				});
				hour.addClass("animated bounceIn");
				hour.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
					function (event) {
						hour.removeClass("animated bounceIn");
					});
				if (_hour < 0) {
					_hour = 21;
				}
				setTimeDetail(-1, _min);
				setTime();
				container.find(".hour").bind("touch click", function (event) {
					_hour = $(event.target).parent().data("deg");
					setTime();
					changeType("min");
				});
			}

			if (_timeType == "min") {
				for (i = 0; i < 60; i++) {

					clockText = parseInt(i + 15) % 60;
					if (clockText == 0) {
						clockText = 0;
					}
					if (clockText < 10) {
						clockText = "0" + clockText;
					}
					if (i % 5 == 0) {
						container.append("<div class='circle min min5 deg" + i + "'><label>" + clockText + "</label></div>");
					} else {
						container.append("<div class='circle min deg" + i + "'><label></label></div>");
					}
					r1 = (i * 6)
					r2 = (-1 * i * 6)
					circle = container.find(".deg" + i);
					circle.css("transform", "rotate(" + r1 + "deg) translate(" + parseInt((parseInt(container.css("width")) / 2) - 25) + "px) rotate(" + r2 + "deg)");
					circle.attr("data-deg", parseInt(r1 / 6));

				}

				hour.css("color", "#929898");
				min.css("color", "#52C0F9");
				var line = container.find(".line1");
				var focus = container.find(".focus");

				var x1, x2, y1, y2, t, ang;
				var c = $(".centre");
				var tp = container.position();


				var angPow, angMod;
				container.bind("touchmove", function (event) {
					if (_timeType == "min") {
						t = event.originalEvent.touches[0];

						x1 = (container.width() / 2) + parseInt(container.offset().left);
						y1 = (container.width() / 2) + parseInt(container.offset().top);

						ang = Math.atan2(t.clientY - y1, t.clientX - x1) * 180 / Math.PI;

						//console.info( t.screenX +" "+t.screenY);
						angPow = parseInt(ang / 6);
						angMod = ang % 6;
						//	console.info((y1 - t.clientY) +" "+  (x1 - t.clientX));

						if (ang > (angPow * 6) + 3) {
							line.css("transform", "rotate(" + ((angPow + 1) * 6) + "deg");
							setActiveCircle(((angPow + 1) * 6));

						} else
						if (ang < (angPow * 6) - 3) {
							line.css("transform", "rotate(" + ((angPow) * 6) + "deg");
							setActiveCircle(angPow * 6);

						} else if (ang < 3 && ang > -3) {
							line.css("transform", "rotate(0deg");
							setActiveCircle(0)
						}


					}

				});
				container.find(".min").bind("touch click", function (event) {
					_min = $(event.target).parent().data("deg") + 15;
					setTime();
				});
				min.addClass("animated bounceIn");
				min.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
					function (event) {
						min.removeClass("animated bounceIn")
					});
				setTime();
			}

			setTime();

			function setTime() {

				if (_timeType == "hour") {

					if (_hour <= 11) {
						activeCircle = container.find("[data-deg=" + _hour + "]");
						line.css("width", "75px");
					}
					if (_hour > 11) {
						activeCircle = container.find("[data-deg=" + _hour + "]");
						line.css("width", "100px");
					}
					line.css("transform", "rotate(" + (parseInt(_hour) * 30) + "deg");
					setLine();
					if (_hour > 11) {
						container.find(".hour.am").find("label").css("fontSize", "16px");
						container.find(".hour.pm").find("label").css("fontSize", "12px");
						setTimeDetail((_hour + 3), -1);
					} else {
						container.find(".hour.am").find("label").css("fontSize", "12px");
						container.find(".hour.pm").find("label").css("fontSize", "16px");
						if ((_hour + 3) % 12 == 0) {
							setTimeDetail("12", -1);
						} else {
							setTimeDetail((_hour + 3) % 12, -1);
						}
					}


				}
				if (_timeType == "min") {
					if (_min == 15) {
						activeCircle = container.find("[data-deg=" + 0 + "]");
					} else
					if (_min > 15) {
						activeCircle = container.find("[data-deg=" + parseInt(_min - 15) + "]");
					} else {
						activeCircle = container.find("[data-deg=" + parseInt(60 - 15 + _min) + "]");
					}
					line.css("transform", "rotate(" + ((_min - 15) * 6) + "deg");
					setLine();
					setTimeDetail(-1, _min % 60);

				}
			}

			function setTimeDetail(h, m) {
				if (h != -1) {
					if (parseInt(h) == 0) {
						h = "00"
					} else
					if (h < 10) {
						h = "0" + h;
					}
					if (h > 24) {
						h = (h % 24) + 12;
					} else if (h == 24) {
						h = "00"
					}

					hour.html(h);
				}

				if (m != -1) {
					if (parseInt(m) == 0) {
						m = "00"
					} else
					if (m < 10) {
						m = "0" + m;
					}

					min.html(m);
				}
			}

			function setLine() {
				container.find(".circle").css("background-color", "#FFFFFF");
				activeCircle.css("background-color", "#DEF0F7");
				focus.css("top", activeCircle.position().top - 4);
				focus.css("left", activeCircle.position().left - 4);
                
                line.css("width",Math.abs( getDecTwoPoint(new Point(activeCircle.position().left,activeCircle.position().top),
                                                new Point(100,100))) + "px");
    
			}




			var oldDeg;

			function setActiveCircle(deg) {
				if (deg != oldDeg) {
					console.info(oldDeg);
					oldDeg = deg;
					container.find(".circle").css("background-color", "#FFFFFF");
					if (_timeType == "hour") {

						if (dec > 75) {
							deg += 12;
							line.css("width", "90px");

							container.find(".hour.am").find("label").css("fontSize", "16px");
							container.find(".hour.pm").find("label").css("fontSize", "12px");
						} else {
							container.find(".hour.am").find("label").css("fontSize", "12px");
							container.find(".hour.pm").find("label").css("fontSize", "16px");
							deg = (deg) % 12;
							line.css("width", "75px");
						}
						activeCircle = container.find("[data-deg=" + deg + "]");
						setLine()
						if (dec < 75) {
							_hour = (deg + 3) % 12;
							if (_hour == 0) {
								_hour = 12;
							}
						} else {
							_hour = deg + 3;

							if (_hour != 24 && parseInt(_hour / 24) == 1) {
								_hour = (_hour % 24) + 12;

							}
							if (_hour == 24) {
								_hour = "00";
							}
						}


						setTimeDetail(_hour, -1);
					}

					if (_timeType == "min") {
						line.css("width", "90px");
						if (deg % 6 == 0) {

							if (deg < 0) {
								deg = 360 - Math.abs(deg);

							}
							console.info(deg);
							activeCircle = container.find("[data-deg=" + Math.abs(parseInt(deg / 6)) + "]");
							setLine()

						}

						_min = ((deg / 6) + 15) % 60;
						setTimeDetail(-1, _min);
					}


				}
			}

		}

		function changeYear(direction) {


			if (direction == "next") {
				_curYear++;
				initDatePicker(new Date(_curYear, _curMonth, _curDay));
			}

			if (direction == "prev") {
				_curYear--;
				initDatePicker(new Date(_curYear, _curMonth, _curDay));
			}

		}

		function initDatePicker(date) {

			var resultHtml = "";

			if ($(document).width() < 450) {
				_target.html('<div class="st-datepicker"> \
                                        <div class="header"></div> \
                                        <div class="content" style="height:calc(100% - 50px);"> \
                                            <div class="detail vertical"> \
                                                <label class="st-caption month"></label> \
                                                <label class="st-caption day"></label> \
                                               <div style="display:inline-flex"> <i class="fa fa-arrow-circle-left fa-2x yearsetdown"></i>  <label class="st-caption year"></label> <i class="fa fa-arrow-circle-right fa-2x yearsetup"></i> </div>\
                                            </div> \
                                                <div class="picker vertical">  \
                                                </div> \
                                        </div> \
                                        <div class="footer" > \
                                            <div class="st-dialog-datepicker-ok btn" style="width:100%; height:100%;">Bitti</div> \
                                        </div> \
                                    </div>');
				_target.css("height", "420px");
				_target.css("width", "220px");
				_target.css("display", "block");

			}
			if ($(document).width() > 450) {
				_target.html(' <div class="st-datepicker"> \
                                                    <div class="content" style="height:100%"> \
                                                        <div class="detail horizontal"> \
                                                            <div class="header"></div> \
                                                <label class="st-caption month"></label> \
                                                <label class="st-caption day"></label> \
                                                <div style="display:inline-flex"> <i class="fa fa-arrow-circle-left fa-2x yearsetdown"></i>  <label class="st-caption year"></label> <i class="fa fa-arrow-circle-right fa-2x yearsetup"></i> </div>\
                                                            <div class="footer" style="position:absolute" > \
                                                                <div class="st-dialog-datepicker-ok btn" style="width:100%; height:100%;" >Bitti</div> \
                                                            </div> \
                                                        </div> \
                                                        <div class="picker horizontal"> \
                                                        </div> \
                                                    </div> \
                                                </div>');
				_target.css("height", "230px");
				_target.css("width", "420px");
			}


			_target.find(".st-dialog-datepicker-ok").on("click", function (event) {
				_options.onSelect.call(_target, new Date(_picker.data("curdate")));
				_target.html("");
			});

			_picker = _target.find(".picker");
			_picker.data("curdate", new Date(date.getFullYear(), date.getMonth(), date.getDate()));
			_detailDay = _target.find(".day");
			_detailMonth = _target.find(".month");
			_detailYear = _target.find(".year");
			_detailHeader = _target.find(".header");

			var bgHtml = "<div class='selected-bg'></div>";

			var curDate = new Date(_picker.data("curdate"))
			$.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], function (index, value) {


				var loopDate = new Date(curDate.getFullYear(), value, 0);

				var yearMonthHtml = "<div class='monthyear'>" + _curMonthL[loopDate.getMonth()] + " " + loopDate.getFullYear() + "</div>";


				var _daysHtml = "<table class='st-table'><thead><tr>";
				$.each(_curDaysS, function (index, object) {
					_daysHtml += "<th class='st-day-header'>" + object + "</th>"

				});

				_daysHtml += "</tr></thead>";
				_daysHtml += initPicker(curDate, loopDate);
				_daysHtml += "</table>";

				resultHtml += yearMonthHtml + _daysHtml;

			});
			var lastDivHtml = "<div style='height:30px;'></div>"
			_picker.html(bgHtml + resultHtml + lastDivHtml);

			_monthTops = new Array();
			$.each(_picker.children(".st-table"), function (index, value) {

				_monthTops.push($(value).position().top);
			});

			_picker.find(".day").on("click", function (event) {
				selectDay(event);
			});
			_target.find(".yearsetup").on("click", function () {
				changeYear("next");
			});

			_target.find(".yearsetdown").on("click", function () {
				changeYear("prev");
			});

			_picker.scrollStopped(function (event) {
				fitPicker();
			});

			_picker.scrollTop(_monthTops[date.getMonth()] - 30);

			selectDay();
			_picker.on("touchend", function (event) {
				fitPicker();

			});

		}

		function fitPicker() {
			if (_picker.scrollTop() != 0) {
				var minDif = 100000;
				var top;
				$.each(_monthTops, function (index, value) {
					if (minDif > Math.abs(_picker.scrollTop() - value)) {

						minDif = Math.abs(_picker.scrollTop() - value);
						top = _monthTops[index];
						_curMonth = index;
					}
				});


				_picker.animate({
					scrollTop: top - 30
				}, 300, function () {

				});
			}
		}


		function selectDay(event) {

			var curDate = new Date(_picker.data("curdate"));
			var selecTedDay;
			if (event != null) {
				selecTedDay = $(event.target);
			} else {
				selecTedDay = $(_picker.find("[data-num=" + curDate.getDate() + "]").get(curDate.getMonth()));
			}
			curDate.setDate(selecTedDay.html());
			_pickerSelectedBg = _picker.find(".selected-bg");
			_pickerSelectedBg.css("left", (selecTedDay.position().left) + "px");
			if (event == null) {
				_pickerSelectedBg.css("top", (_monthTops[curDate.getMonth()] + selecTedDay.position().top - 30) + "px");
				_detailDay.html(selecTedDay.data("num"));

			} else {

				_pickerSelectedBg.css("top", (selecTedDay.position().top + 2 + _monthTops[parseInt(_picker.scrollTop() / 190)] - 30) + "px");

			}

			_detailDay.html(curDate.getDate());
			_detailMonth.html(_curMonthL[curDate.getMonth()]);
			_detailYear.html(curDate.getFullYear());
			_detailHeader.html(_curDaysL[selecTedDay.data("num") % 7]);

			curDate.setMonth(_curMonth);
			curDate.setFullYear(_curYear);
			_picker.data("curdate", curDate);

		}

		function initPicker(date, loopDate) {
			var firstDayofMonth = new Date(loopDate.getFullYear(), loopDate.getMonth(), 1).getDay() + 6; // FirsDay is Monday
			firstDayofMonth = (firstDayofMonth % 7);
			var curMonth = loopDate.getMonth();
			var daysCountInMonth = new Date(loopDate.getFullYear(), loopDate.getMonth() + 1, 0).getDate();
			var daysHtml = "<tbody>";
			var day = 0;
			for (i = 0; i < daysCountInMonth + firstDayofMonth; i++) {

				if (i - 1 % 7 == 6) {
					daysHtml += "</tr>";
				}
				if (i % 7 == 0) {
					daysHtml += "<tr>";
				}
				if (i >= firstDayofMonth) {
					day++;
					if (date.getDate() + firstDayofMonth == i + 1 && _options.targetDate.getMonth() == loopDate.getMonth() && _options.targetDate.getFullYear() == loopDate.getFullYear()) {
						daysHtml += "<td data-num='" + day + "' class='day curday' >" + day + "</td>";
					} else {
						daysHtml += "<td data-num='" + day + "' class='day' >" + day + "</td>";
					}

				} else {
					daysHtml += "<td></td>";
				}

			}

			daysHtml += "</tbody>";

			return daysHtml;
		}




		return $(this);
	};

}(jQuery));