(function() {
    angular.module("DyerColorPicker")
        .factory("positionindicatorfactory", positionindicatorfactory);
    
    function positionindicatorfactory() {

        function positionIndicator() {
        };
        
        positionIndicator.prototype.setIndicatorPositionFromValues = function () {
            this.setPositioningVariables();

            // sets the arrow position from XValue and YValue properties

            var indicatorOffsetX = 0;
            var indicatorOffsetY = 0;
            //console.log("this width " + this._areaWidth);
            //console.log(indicatorOffsetX + ", " + indicatorOffsetY);
            // X Value/Position
            if (this.xMinValue != this.xMaxValue) {

                if (this.xValue == this.xMinValue) {
                    indicatorOffsetX = 0;
                } else if (this.xValue == this.xMaxValue) {
                    indicatorOffsetX = this._areaWidth - 1;
                } else {

                    var xMax = this.xMaxValue;
                    //console.log("maxx " + xMax);
                    if (this.xMinValue < 1) {
                        xMax = xMax + Math.abs(this.xMinValue) + 1;
                    }
                    //console.log("maxx " + xMax);
                    var xValue = this.xValue;
                    //console.log("xvalue " + xValue);

                    if (this.xValue < 1) xValue = xValue + 1;
                    //console.log("xvalue " + xValue);

                    indicatorOffsetX = xValue / xMax * this._areaWidth;
                    //console.log(indicatorOffsetX + ", " + indicatorOffsetY);

                    if (parseInt(indicatorOffsetX) == (xMax - 1))
                        indicatorOffsetX = xMax;
                    else
                        indicatorOffsetX = parseInt(indicatorOffsetX);

                    // shift back to normal values
                    if (this.xMinValue < 1) {
                        indicatorOffsetX = indicatorOffsetX - Math.abs(this.xMinValue) - 1;
                    }
                }
            }


            // Y Value/Position
            if (this.yMinValue != this.yMaxValue) {

                if (this.yValue == this.yMinValue) {
                    indicatorOffsetY = 0;
                } else if (this.yValue == this.yMaxValue) {
                    indicatorOffsetY = this._areaHeight - 1;
                } else {

                    var yMax = this.yMaxValue;
                    if (this.yMinValue < 1) {
                        yMax = yMax + Math.abs(this.yMinValue) + 1;
                    }

                    var yValue = this.yValue;

                    if (this.yValue < 1) yValue = yValue + 1;

                    var indicatorOffsetY = yValue / yMax * this._areaHeight;

                    if (parseInt(indicatorOffsetY) == (yMax - 1))
                        indicatorOffsetY = yMax;
                    else
                        indicatorOffsetY = parseInt(indicatorOffsetY);

                    if (this.yMinValue < 1) {
                        indicatorOffsetY = indicatorOffsetY - Math.abs(this.yMinValue) - 1;
                    }
                }
            }
            //console.log("indicatorXY : " + indicatorOffsetX + ", " + indicatorOffsetY);
            this._setIndicatorPosition(indicatorOffsetX, indicatorOffsetY);

        };

        positionIndicator.prototype.setPositioningVariables = function () {
            // calculate sizes and ranges
            // BAR

            console.log(this);
            var pos = this.offset;
            this._areaTop = pos.top;
            this._areaLeft = pos.left;

            this._areaBottom = this._areaTop + this._areaHeight;
            this._areaRight = this._areaLeft + this._areaWidth;

            // MIN & MAX
            this.MinX = this._areaLeft;
            this.MinY = this._areaTop;

            this.MaxX = this._areaRight;
            this.MinY = this._areaBottom;

        };

        positionIndicator.prototype._setIndicatorPosition = function (offsetX, offsetY) {
            //console.log("offsets : " + offsetX + ", " + offsetY);
            //TODO - NO MAGIC NUMBERS
            // validate
            if (offsetX < 0) offsetX = 0
            if (offsetX > 255) offsetX = 255;
            if (offsetY < 0) offsetY = 0
            if (offsetY > 255) offsetY = 255;

            var posX = this._areaLeft + offsetX;
            var posY = this._areaTop + offsetY;
            //console.log("posA : " + posX + ", " + posY);
            //console.log("top : " + this._areaTop);
            //console.log("offsetxy : " + offsetX + ", " + offsetY);
            //console.log("pos : " + posX + ", " + posY);
            //console.log("widths : " + this.indicatorWidth + ", " + this._areaWidth);

            // check if the arrow is bigger than the bar area
            if (this.indicatorWidth > this._areaWidth) {
                posX = posX - (this.indicatorWidth / 2 - this._areaWidth / 2);
            } else {
                posX = posX - parseInt(this.indicatorWidth / 2);
            }
            if (this.indicatorHeight > this._areaHeight) {
                posY = posY - (this.indicatorHeight / 2 - this._areaHeight / 2);
            } else {
                posY = posY - parseInt(this.indicatorHeight / 2);
            }

            posX = parseInt(posX);
            posY = parseInt(posY);
            //console.log("pos : " + posX + ", " + posY);

            this.indicatorhtml.css('left', posX + 'px');
            this.indicatorhtml.css('top', posY + 'px');

        };


        positionIndicator.prototype.setValuesFromMousePosition = function () {

            var relativeX = 0;
            var relativeY = 0;

            // mouse relative to object's top left
            if (this.mouse.x < this._areaLeft)
                relativeX = 0;
            else if (this.mouse.x > this._areaRight)
                relativeX = this._areaWidth;
            else
                relativeX = this.mouse.x - this._areaLeft + 1;

            if (this.mouse.y < this._areaTop)
                relativeY = 0;
            else if (this.mouse.y > this._areaBottom)
                relativeY = this._areaHeight;
            else
                relativeY = this.mouse.y - this._areaTop + 1;


            var newXValue = parseInt(relativeX / this._areaWidth * this.xMaxValue);
            var newYValue = parseInt(relativeY / this._areaHeight * this.yMaxValue);

            // set values
            this.xValue = newXValue;
            this.yValue = newYValue;

            // position arrow
            if (this.xMaxValue == this.xMinValue)
                relativeX = 0;
            if (this.yMaxValue == this.yMinValue)
                relativeY = 0;
            this._setIndicatorPosition(relativeX, relativeY);

            this.ValueChanged();
        };
        
        var _map = new positionIndicator();
        var _slider = new positionIndicator();
        return {"_map":_map, "_slider":_slider};
    }
    
})();