(function ($) {



	$.fn.stTabs = function (options) {
		var tab = $(this);

		var wrapper = tab.find(".wrapper");
		var pages = wrapper.children(".page");
		var _currPage = -1;
		var _oldPage = -1;
		var _pageCount = pages.length;
		var _pageWidth;

		wrapper.css("width", $(window).width() * _pageCount)
		_pageWidth = wrapper.width() / _pageCount;

		/*PAGINATION*/
		var pager = tab.find(".pagination");

		$.each(pager.find(".tab"), function (index, object) {
			$(object).attr("data-tabindex", index);
			$(object).css("width", _pageWidth / _pageCount);
			$(object).css("left", index * _pageWidth / _pageCount);
			if ($(object).hasClass("active")) {
				_currPage = index;
			}

		});

		$.each(pages, function (index, object) {
			$(object).attr("data-tabindex", index);
			$(object).css("width", (100 / _pageCount) + "%");
		});




		var headerWidth = (_pageWidth / _pageCount);
		var dot, dotTop = 1,
			dotLeft = 0;

		for (i = 1; i < 13; i++) {
			pager.append('<div class="dot" data-dn ="' + i + '" ></div>');
			dot = pager.children("[data-dn='" + i + "']");
			dot.css("top", 5 + dotTop);
			dot.css("transition-delay", (Math.ceil(Math.random() * 18) * 30) + "ms");
			dot.css("left", (headerWidth / 2) + dotLeft - (12));
			if (i % 4 == 0) {
				dotTop += 5;
				dotLeft = 0;
			} else {
				dotLeft += 5;
			}
		}
		setActivePage();

		function setActivePage() {
			wrapper.css("transition-duration", "400ms");
			wrapper.css("left", (-1 * _currPage * _pageWidth) + "px");
			setPagination(0);
			wrapper.css("transition-duration", "0s");
			pager.children(".dot").css("background-color", "transparent");
			pager.find("[data-tabindex=" + _currPage + "]").css("color", "#06A3F4");
		}


		var starttime;
		var startX;

		pager.children(".tab").on("touch click", function (event) {
			event.preventDefault();

			showPage($(event.currentTarget).data("tabindex"));

		});

		wrapper.on('transitionend',
			function (event) {
				wrapper.css("transition-duration", "0s");
				pager.children(".dot").css("background-color", "transparent");
				if (_oldPage != _currPage) {
					pager.find("[data-tabindex=" + _currPage + "]").css("color", "#06A3F4");
				}
			});



		wrapper.bind("touchstart", function (event) {
			if (event.currentTarget.className == "wrapper") {
				starttime = event.timeStamp;
				startX = event.originalEvent.touches[0].clientX;
			}

		});

		wrapper.bind("touchend", function (event) {
			if (event.currentTarget.className == "wrapper") {


				var dist = Math.abs(wrapper.position().left % _pageWidth);
				if (dist > 0) {
					if (parseInt(wrapper.css("left")) + 5 >= tab.width() / 2) {
						showPage(0);
					}
					if (_currPage == _pageCount - 1 && Math.abs(parseInt(wrapper.css("left"))) > _pageWidth * (_pageCount - 1)) {
						showPage(_pageCount);
					} else
					if (dist < _pageWidth / 2) {
						showPage(_currPage - 1);
					} else
					if (dist >= _pageWidth / 2) {
						showPage(_currPage + 1);
					}
				}
			}

		});

		function showPage(index) {
			_oldPage = _currPage;
			var newPage = index;

			if (index > _pageCount - 1) {
				newPage = _pageCount - 1;
			} else
			if (index <= 0) {
				newPage = 0;
			}
			wrapper.css("transition-duration", "400ms");
			wrapper.css("left", (-1 * newPage * _pageWidth) + "px");
			if (_currPage != newPage) {
				setPagination(newPage);
				_currPage = newPage;
			}

		}

		function setPagination(pageNo) {

			pager.find("[data-tabindex=" + _oldPage + "]").css("color", "#A2A7AB");
			var newLeft = (pageNo * headerWidth) + (headerWidth / 2) - 11;
			var dotLeft = 0;
			$.each(pager.children(".dot"), function (index, object) {
				$(object).css("left", newLeft + dotLeft + "px");
				if ((index + 1) % 4 == 0) {
					dotLeft = 0;
				} else {
					dotLeft += 5;
				}
				$(object).css("background-color", "#06A3F4");
			});

		}

		var touchmoveX;

		wrapper.bind("touchmove", function (event) {
			event.preventDefault();
			//if ($(event.target).hasClass("page")) {
				touchmoveX = event.originalEvent.touches[0].clientX;
				var newX;
				if (startX > touchmoveX && Math.abs(wrapper.position().left) < wrapper.width() - (_pageWidth / 2)) {
					newX = parseInt(wrapper.css("left")) - (startX - touchmoveX);
					if (newX - 10 > -1 * wrapper.width()) {
						wrapper.css("left", newX + "px");
					}
				} else
				if (startX < touchmoveX) {
					newX = (parseInt(wrapper.css("left")) - (startX - touchmoveX));
					if (newX < tab.width() / 2) {
						wrapper.css("left", (parseInt(wrapper.css("left")) + (touchmoveX - startX)) + "px");
					}
				}
				startX = touchmoveX;

			//}
		});



		/*	
		 * 
		





		$.each(tabHeaderButtons,
			function (index, element) {
				if ($(element).hasClass("st-tab-active")) {
					firstLeft = lineToX = "+=" + $(element).position().left + "px";
					_currTab = $(element).index();
					tab.find(".st-line").animate({
						left: firstLeft
					}, 300, function () {

					});
					tab.find("[data-tabindex=" + $(element).index() + "]").removeClass("hidden");

				}
				$(element).attr("data-index", index);
			});


		$(".st-tab-header-button").on("click touch",
			function (event) {
				event.preventDefault();
				var target = $(event.target);
				if (target.prop("tagName") != "DIV") {
					target = $(event.target.parentElement);
				}
				selectTab(target.attr("data-index"));
			});*/

		function selectTab(index) {

			var target;
			event.preventDefault();
			target = tab.find(".st-tab-header-button").eq(index);

			var icon = tab.find(".st-tab-header-button").find("i");


			var oldTabHeader = tab.find(".st-tab-header-button").eq(_currTab);
			var oldTabHeaderIndex = _currTab;

			if (target.index() != oldTabHeaderIndex) {
				line.css("width", tabHeader.width() / tabHeaderButtons.length);
				var oldIcon = oldTabHeader.find("i");
				var lineToX;
				lineToX = ((tabHeader.width() / tabHeaderButtons.length) * index) + "px";

				line.animate({
					left: lineToX
				}, 300, function () {

				});

				icon.animate({
					color: "#0F8EFC"
				}, 300, function () {
					// Animation complete.
				});

				oldIcon.animate({
					color: "#8BC0E9"
				}, 300, function () {


				});

				/*Show Page*/
				var newPage = tab.find("[data-tabindex=" + target.attr("data-index") + "]");
				var oldPage = $(target).parent().parent().children(".st-tab-content").children(".st-tab-page").eq(oldTabHeaderIndex);

				_currTab = target.index();


			}

		}
	}
}(jQuery));