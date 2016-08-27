(function ($) {

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

			function Transform(x, y, r, sx, sy) {
				this.transform = new Point(0, 0);
				this.transform.x = x;
				this.transform.y = y;
				this.rotate = new rotate(r, 0, 0);
				this.scale = new Point(0, 0);

			}


			function stDrawObject(object) {
				this.object = object;
				this.stTransform = null;
				this.size = new Size(0, 0);
				this.getTransform = function () {
					var transform = new Transform(0, 0, 0, 0, 0);
					$.each(this.object[0].transform.baseVal, function (index, trans) {
						if (trans.type == 2) {
							transform.transform.x = trans.matrix.e;
							transform.transform.y = trans.matrix.f;
						} else if (trans.type == 4) {
							transform.rotate = new rotate(trans.angle, 0, 0);

						} else if (trans.type == 3) {
							transform.scale.x = trans.matrix.a;
							transform.scale.y = trans.matrix.d;

						}

					});

					this.size.width = this.object[0].getBBox().width * transform.scale.x;
					this.size.height = this.object[0].getBBox().height * transform.scale.y;
					if (!this.object[0].hasOwnProperty("r")) {
						transform.rotate.rotateX = this.size.width / 2;
						transform.rotate.rotateY = this.size.height / 2;
					} else {
						transform.rotate.rotateX = 0;
						transform.rotate.rotateY = 0;
					}

					this.stTransform = transform;
					return this.stTransform;
				}
				this.setLocation = function (x, y) {
					this.object.attr("transform", "translate(" + x + "," + y + ") rotate(" + this.stTransform.rotate.rotate + "," +
						(this.stTransform.rotate.rotateX) + "," + (this.stTransform.rotate.rotateY) + ") scale(" + this.stTransform.scale.x + "," + this.stTransform.scale.y + ")");
					this.stTransform.transform.x = x;
					this.stTransform.transform.y = y;
					return this;
				}
				this.setRotateFromOrgin = function (r) {
					var x, y;
					if (!this.object[0].hasOwnProperty("r")) {
						x = this.size.width / 2;
						y = this.size.height / 2;
					} else {
						x = 0;
						y = 0;
					}
					this.object.attr("transform", "translate(" + this.stTransform.transform.x + "," + this.stTransform.transform.y +
						") rotate(" + r + "," + x + "," + y + ") scale(" + this.stTransform.scale.x + "," +
						this.stTransform.scale.y + ")");
					this.stTransform.rotate.rotate = r.rotate;
					this.stTransform.rotate.rotateX = x;
					this.stTransform.rotate.rotateY = y;
					return this;
				}
				this.setRotate = function (r) {
					this.object.attr("transform", "translate(" + this.stTransform.transform.x + "," + this.stTransform.transform.y +
						") rotate(" + r.rotate + "," + r.rotateX + "," + r.rotateY + ") scale(" + this.stTransform.scale.x + "," +
						this.stTransform.scale.y + ")");
					this.stTransform.rotate.rotate = r.rotate;
					this.stTransform.rotate.rotateX = r.rotateX;
					this.stTransform.rotate.rotateY = r.rotateY;
					return this;
				}

				this.setScale = function (sx, sy) {
					this.size.width = this.object[0].getBBox().width * sx;
					this.size.height = this.object[0].getBBox().height * sy;
					var x, y;
					if (!this.object[0].hasOwnProperty("r")) {
						x = this.size.width / 2;
						y = this.size.height / 2;
					} else {
						x = 0;
						y = 0;
					}

					this.object.attr("transform", "translate(" + this.stTransform.transform.x + "," +
						this.stTransform.transform.y + ") rotate(" + this.stTransform.rotate.rotate + "," +
						x + "," + y + ") scale(" + sx + "," + sy + ")");
					this.stTransform.scale.x = sx;
					this.stTransform.scale.y = sy;

					return this;
				}
				this.getTransform();

			}

			$.fn.stDraw = function () {

				if (this.stDrawObject == undefined) {
					this.stDrawObject = new stDrawObject(this);
				}
				return this.stDrawObject;

			};
		})(jQuery);