/*
Copyright (c) 2007 John Dyer (http://johndyer.name)
MIT style license
*/

var app = angular.module("DyerColorPicker", []);
var MainController = function ($scope, colormethods) {
    var clientFilesPath = 'refresh_web/colorpicker/images/';

    $scope.RadioClick = function () {
        setColorMode($scope.cp1_Mode.thesel);
    };

    var theMouseIsDown = false;
    var ColorMode = 's';
    var mapactive = false;
    var baractive = false;

    function positionIndicator() {
        /*var xMinValue = 0,
            xMaxValue = 100,
            yMinValue = 0,
            yMaxValue = 100,
            xValue = 0,
            yValue = 0,
            _areaWidth = 256,
            _areaHeight = 256,
            offset = 33,
            indicatorWidth = 33,
            indicatorHeight = 33,
            indicatorhtml = null*/
    }
    
    //positionIndicator.prototype.mouse = {x:0,y:0};

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

        //console.log(this);
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
    
    _map.ValueChanged = function () {
        // update values

        switch (ColorMode) {
        case 'h':
            $scope.cp1_Saturation_val = this.xValue;
            $scope.cp1_Brightness_val = 100 - this.yValue;
            break;

        case 's':
                $scope.cp1_Hue_val = this.xValue;
                $scope.cp1_Brightness_val = 100 - this.yValue;
            break;

        case 'v':
            $scope.cp1_Hue_val = this.xValue;
            $scope.cp1_Saturation_val = 100 - this.yValue;
            break;

        case 'r':
            $scope.cp1_Blue_val = this.xValue;
            $scope.cp1_Green_val = 256 - this.yValue;
            break;

        case 'g':
            $scope.cp1_Blue_val = this.xValue;
            $scope.cp1_Red_val = 256 - this.yValue;
            break;

        case 'b':
            $scope.cp1_Red_val = this.xValue;
            $scope.cp1_Green_val = 256 - this.yValue;
            break;
        }

        switch (ColorMode) {
        case 'h':
        case 's':
        case 'v':
                setHsv({
            h: $scope.cp1_Hue_val,
            s: $scope.cp1_Saturation_val,
            v: $scope.cp1_Brightness_val
        });
            break;

        case 'r':
        case 'g':
        case 'b':
                setRgb({
            r: $scope.cp1_Red_val,
            g: $scope.cp1_Green_val,
            b: $scope.cp1_Blue_val
        });
            break;
        }

        updateVisuals();
    };
    
    _slider.ValueChanged = function() {
		
		switch(ColorMode) {
			case 'h':
				$scope.cp1_Hue_val = 360 - this.yValue;
				break;
			case 's':
				$scope.cp1_Saturation_val = 100 - this.yValue;
				break;
			case 'v':
				$scope.cp1_Brightness_val = 100 - this.yValue;
				break;
				
			case 'r':
				$scope.cp1_Red_val = 255 - this.yValue;
				break;
			case 'g':
				$scope.cp1_Green_val = 255 - this.yValue;
				break;
			case 'b':
				$scope.cp1_Blue_val = 255 - this.yValue;
				break;				
		}
		
		switch(ColorMode) {
			case 'h':
			case 's':
			case 'v':
                setHsv({
            h: $scope.cp1_Hue_val,
            s: $scope.cp1_Saturation_val,
            v: $scope.cp1_Brightness_val
        });
				break;
				
			case 'r':
			case 'g':
			case 'b':
                setRgb({
            r: $scope.cp1_Red_val,
            g: $scope.cp1_Green_val,
            b: $scope.cp1_Blue_val
        });
				break;				
		}		

		updateVisuals();
	};


    
    //NOT UNDERSTANDING SOMETHING -why need define? maybe because is a function and var is private to it, need : format?
    //rest stuff below is defining public versions so it works?
    _map.mouse = {};
    _map.mouse.x = 0;
    _map.mouse.y = 0;
    _slider.mouse = {};
    _slider.mouse.x = 0;
    _slider.mouse.y = 0;

    _map.indicatorhtml = angular.element('#mappoint');
    _slider.indicatorhtml = angular.element('#rangearrows');

    _map.xMaxValue = 359;
    _map.yMaxValue = 100;
    _slider.yMaxValue = 100;
    _map.xMinValue = 1;
    _map.yMinValue = 1;
    _slider.yMinValue = 1;

    _slider.yValue = 33;
    _map.xValue = 34;
    _map.yValue = 35;

    _map._areaWidth = parseInt(angular.element('#cp1_ColorMap').css('width'));
    _map._areaHeight = parseInt(angular.element('#cp1_ColorMap').css('height'));
    _map.offset = angular.element('#cp1_ColorMap').offset();
    //console.log("map width : " + _map._areaWidth);
    //console.log("map height : " + _map._areaHeight);
    //console.log("offset : " + _map.offset.left + ", " + _map.offset.top);

    _slider._areaWidth = parseInt(angular.element('#cp1_ColorBar').css('width'));
    _slider._areaHeight = parseInt(angular.element('#cp1_ColorBar').css('height'));
    _slider.offset = angular.element('#cp1_ColorBar').offset();
    //console.log("slider width : " + _slider._areaWidth);
    //console.log("slider height : " + _slider._areaHeight);
    //console.log("offset : " + _slider.offset.left + ", " + _slider.offset.top);

    _map.indicatorWidth = parseInt(angular.element('#mappoint').css('width'));
    _map.indicatorHeight = parseInt(angular.element('#mappoint').css('height'));

    _slider.indicatorWidth = parseInt(angular.element('#rangearrows').css('width'));
    _slider.indicatorHeight = parseInt(angular.element('#rangearrows').css('height'));


    $scope.mapmousedown = function (event) {
        //console.log("mouse down");
        theMouseIsDown = true;
        //var xpos = parseInt(event.pageX - _map.offset.left);
        //var ypos = parseInt(event.pageY - _map.offset.top);
        //_map.xValue = xpos;
        //_map.yValue = ypos;

        //msg = xpos + ", " + ypos;
        //console.log(msg);
        _map.mouse.x = event.pageX;
        _map.mouse.y = event.pageY;
        
        event.preventDefault();
        _map.setValuesFromMousePosition();
        
        mapactive = true;
   
    };

    $scope.barmousedown = function (event) {
        //console.log("mouse down");
        theMouseIsDown = true;
        //var xpos = parseInt(event.pageX - _slider.offset.left);
        //var ypos = parseInt(event.pageY - _slider.offset.top);

        //msg = xpos + ", " + ypos;
        _slider.mouse.x = event.pageX;
        _slider.mouse.y = event.pageY;
        _slider.setValuesFromMousePosition();
        event.preventDefault();
         baractive = true;
    };

    $scope.mouseup = function (event) {
        //console.log("mouse up");
        theMouseIsDown = false;
        mapactive = false;
        baractive = false;
    };
    
    $scope.mouseleave = function (event) {

        theMouseIsDown = false;
        mapactive = false;
        baractive = false;
    };
    
    
    $scope.mousemove = function (event) {
        if (!theMouseIsDown)
            return;

        if(mapactive) {
            _map.mouse.x = event.pageX;
            _map.mouse.y = event.pageY;
            _map.setValuesFromMousePosition();
        }
         if(baractive) {
            _slider.mouse.x = event.pageX;
            _slider.mouse.y = event.pageY;
            _slider.setValuesFromMousePosition();
        }
    };

    $scope.onHsvChange = function () {
        validateHsv();
        setHsv({
            h: $scope.cp1_Hue_val,
            s: $scope.cp1_Saturation_val,
            v: $scope.cp1_Brightness_val
        });
        updateVisuals();
        positionMapAndSliderArrows();
    };
    $scope.onRgbChange = function () {
        validateRgb();
        setRgb({
            r: $scope.cp1_Red_val,
            g: $scope.cp1_Green_val,
            b: $scope.cp1_Blue_val
        });
        updateVisuals();
        positionMapAndSliderArrows();
    };

    $scope.onHexChange = function () {
        if (validateHex()) {
            setHex($scope.cp1_Hex);
            updateVisuals();
            positionMapAndSliderArrows();
        }
    };
    
    function setHsv(hsv) {
        var rgb = colormethods.hsvToRgb(hsv);
        $scope.cp1_Red_val = rgb.r;
        $scope.cp1_Green_val = rgb.g;
        $scope.cp1_Blue_val = rgb.b;

        var hex = colormethods.rgbToHex(rgb);
        $scope.cp1_Hex = hex;
    }

    function setRgb(rgb) {
        var hsv = colormethods.rgbToHsv(rgb);
        $scope.cp1_Hue_val = hsv.h;
        $scope.cp1_Saturation_val = hsv.s;
        $scope.cp1_Brightness_val = hsv.v;

        var hex = colormethods.rgbToHex(rgb);
        $scope.cp1_Hex = hex;
    }

    function setHex(hex) {

        var rgb = colormethods.hexToRgb(hex);
        $scope.cp1_Red_val = rgb.r;
        $scope.cp1_Green_val = rgb.g;
        $scope.cp1_Blue_val = rgb.b;

        var hsv = colormethods.rgbToHsv(rgb);
        $scope.cp1_Hue_val = hsv.h;
        $scope.cp1_Saturation_val = hsv.s;
        $scope.cp1_Brightness_val = hsv.v;
    }

    function validateRgb() {
        $scope.cp1_Red_val = _setValueInRange($scope.cp1_Red_val, 0, 255);
        $scope.cp1_Green_val = _setValueInRange($scope.cp1_Green_val, 0, 255);
        $scope.cp1_Blue_val = _setValueInRange($scope.cp1_Blue_val, 0, 255);
    }

    function validateHsv() {
        $scope.cp1_Hue_val = _setValueInRange($scope.cp1_Hue_val, 0, 359);
        $scope.cp1_Saturation_val = _setValueInRange($scope.cp1_Saturation_val, 0, 100);
        $scope.cp1_Brightness_val = _setValueInRange($scope.cp1_Brightness_val, 0, 100);
    }

    function validateHex() {
        var hex = new String($scope.cp1_Hex).toUpperCase();
        hex = hex.replace(/[^A-F0-9]/g, '0');
        if (hex.length > 6) hex = hex.substring(0, 6);
        if (hex.length < 6)
            return false;
        $scope.cp1_Hex = hex;
        return true;
    }

    function _setValueInRange(value, min, max) {
        if (value == '' || isNaN(value))
            return min;

        value = parseInt(value);
        if (value > max)
            return max;
        if (value < min)
            return min;

        return value;
    }

    $scope.cp1_mapL1_src = clientFilesPath + "blank.gif";
    $scope.cp1_mapL2_src = clientFilesPath + "blank.gif";

    $scope.cp1_barL1_src = clientFilesPath + "blank.gif";
    $scope.cp1_barL2_src = clientFilesPath + "blank.gif";
    $scope.cp1_barL3_src = clientFilesPath + "blank.gif";
    $scope.cp1_barL4_src = clientFilesPath + "bar-brightness.png";

    $scope.cp1_Preview_style = {
        'width': '60px',
        'height': '60px',
        'background-color': '#fff',
        padding: 0,
        margin: 0,
        border: 'solid 1px #000'
    };

    $scope.cp1_Mode = {
        thesel: null
    };

    var settings = {
        startHex: '22cc33',
        startMode: 's'
    };
    $scope.cp1_Hex = settings.startHex;

    var rgb = colormethods.hexToRgb($scope.cp1_Hex);
    $scope.cp1_Red_val = rgb.r;
    $scope.cp1_Green_val = rgb.g;
    $scope.cp1_Blue_val = rgb.b;

    var hsv = colormethods.rgbToHsv(rgb);
    $scope.cp1_Hue_val = hsv.h;
    $scope.cp1_Saturation_val = hsv.s;
    $scope.cp1_Brightness_val = hsv.v;
    
    setColorMode(settings.startMode);

    $scope.cp1_Preview_style["background-color"] = '#' + $scope.cp1_Hex;


    function updateVisuals() {
        updatePreview();
        updateMapVisuals();
        updateSliderVisuals();
    }

    function updatePreview() {
        $scope.cp1_Preview_style["background-color"] = '#' + $scope.cp1_Hex;
    }

    // start of whole indicator process, not inside prototype
    function positionMapAndSliderArrows() {

        var maxHue = 360; // ? 359 ?
        var maxBright = 100;
        var maxSaturation = 100;
        var maxRGB = 255;

        // Slider
        var sliderValue = 0;
        switch (ColorMode) {
        case 'h':
            sliderValue = maxHue - $scope.cp1_Hue_val;
            break;

        case 's':
            sliderValue = maxSaturation - $scope.cp1_Saturation_val;
            break;

        case 'v':
            sliderValue = maxBright - $scope.cp1_Brightness_val;
            break;

        case 'r':
            sliderValue = maxRGB - $scope.cp1_Red_val;
            break;

        case 'g':
            sliderValue = maxRGB - $scope.cp1_Green_val;
            break;

        case 'b':
            sliderValue = maxRGB - $scope.cp1_Blue_val;
            break;
        }

        _slider.yValue = sliderValue;
        _slider.setIndicatorPositionFromValues();

        // color map
        var mapXValue = 0;
        var mapYValue = 0;
        switch (ColorMode) {
        case 'h':
            mapXValue = $scope.cp1_Saturation_val;
            mapYValue = maxBright - $scope.cp1_Brightness_val;
            break;

        case 's':
            mapXValue = $scope.cp1_Hue_val;
            mapYValue = maxBright - $scope.cp1_Brightness_val;
            break;

        case 'v':
            mapXValue = $scope.cp1_Hue_val;
            mapYValue = maxSaturation - $scope.cp1_Saturation_val;
            break;

        case 'r':
            mapXValue = $scope.cp1_Blue_val;
            mapYValue = maxRGB - $scope.cp1_Green_val;
            break;

        case 'g':
            mapXValue = $scope.cp1_Blue_val;
            mapYValue = maxRGB - $scope.cp1_Red_val;
            break;

        case 'b':
            mapXValue = $scope.cp1_Red_val;
            mapYValue = maxRGB - $scope.cp1_Green_val;
            break;
        }
        _map.xValue = mapXValue;
        _map.yValue = mapYValue;
        _map.setIndicatorPositionFromValues();
    }


    function updateMapVisuals() {

        switch (ColorMode) {
        case 'h':
            // fake color with only hue
            var hsv = {
                h: $scope.cp1_Hue_val,
                s: 100,
                v: 100
            };
            var rgb = colormethods.hsvToRgb(hsv);
            var hexval = colormethods.rgbToHex(rgb);

            angular.element('#cp1_mapL1').css('background-color', '#' + hexval);
            break;

        case 's':
            angular.element('#cp1_mapL2').css('opacity', (100 - $scope.cp1_Saturation_val) / 100);
            break;

        case 'v':
            angular.element('#cp1_mapL2').css('opacity', $scope.cp1_Brightness_val / 100);
            break;

        case 'r':
            angular.element('#cp1_mapL2').css('opacity', $scope.cp1_Red_val / 256);
            break;

        case 'g':
            angular.element('#cp1_mapL2').css('opacity', $scope.cp1_Green_val / 256);
            break;

        case 'b':
            angular.element('#cp1_mapL2').css('opacity', $scope.cp1_Blue_val / 256);
            break;
        }
    }

    function updateSliderVisuals() {
        switch (ColorMode) {
        case 'h':
            break;

        case 's':
            var saturatedColor = {
                h: $scope.cp1_Hue_val,
                s: 100,
                v: $scope.cp1_Brightness_val
            };
            var rgb = colormethods.hsvToRgb(saturatedColor);
            var hexval = colormethods.rgbToHex(rgb);
            angular.element('#cp1_barL3').css('background-color', '#' + hexval);
            break;

        case 'v':
            var valueColor = {
                h: $scope.cp1_Hue_val,
                s: $scope.cp1_Saturation_val,
                v: 100
            };
            var rgb = colormethods.hsvToRgb(valueColor);
            var hexval = colormethods.rgbToHex(rgb);
            angular.element('#cp1_barL3').css('background-color', '#' + hexval);
            break;
        case 'r':
        case 'g':
        case 'b':

            var hValue = 0;
            var vValue = 0;

            if (this.ColorMode == 'r') {
                hValue = $scope.cp1_Blue_val;
                vValue = $scope.cp1_Green_val;
            } else if (this.ColorMode == 'g') {
                hValue = $scope.cp1_Blue_val;
                vValue = $scope.cp1_Red_val;
            } else if (this.ColorMode == 'b') {
                hValue = $scope.cp1_Red_val;
                vValue = $scope.cp1_Green_val;
            }

            var horzPer = (hValue / 256);
            var vertPer = (vValue / 256);

            var horzPerRev = ((256 - hValue) / 256);
            var vertPerRev = ((256 - vValue) / 256);

            angular.element('#cp1_barL4').css('opacity', '#' + (vertPer > horzPerRev) ? horzPerRev : vertPer);
            angular.element('#cp1_barL3').css('opacity', '#' + (vertPer > horzPer) ? horzPer : vertPer);
            angular.element('#cp1_barL2').css('opacity', '#' + (vertPerRev > horzPer) ? horzPer : vertPerRev);
            angular.element('#cp1_barL1').css('opacity', '#' + (vertPerRev > horzPerRev) ? horzPerRev : vertPerRev);

            break;

        }
    }



    function setColorMode(colorMode) {

        function resetImageStyle(imgid) {
            angular.element(imgid).css('opacity', 1);
            angular.element(imgid).css('background-color', '');
        }

        resetImageStyle('#cp1_mapL1');
        resetImageStyle('#cp1_mapL2');
        resetImageStyle('#cp1_barL1');
        resetImageStyle('#cp1_barL2');
        resetImageStyle('#cp1_barL3');
        resetImageStyle('#cp1_barL4');

        $scope.cp1_mapL1_src = clientFilesPath + 'blank.gif';
        $scope.cp1_mapL2_src = clientFilesPath + 'blank.gif';
        $scope.cp1_barL1_src = clientFilesPath + 'blank.gif';
        $scope.cp1_barL2_src = clientFilesPath + 'blank.gif';
        $scope.cp1_barL3_src = clientFilesPath + 'blank.gif';
        $scope.cp1_barL4_src = clientFilesPath + 'blank.gif';


        switch (colorMode) {
        case 'h':
            $scope.cp1_Mode.thesel = 'h';

            // MAP
            // put a color layer on the bottom
            angular.element('#cp1_mapL1').css('background-color', '#' + $scope.cp1_Hex);

            // add a hue map on the top
            angular.element('#cp1_mapL2').css('background-color', 'transparent');
            $scope.cp1_mapL2_src = clientFilesPath + 'map-hue.png';
            angular.element('#cp1_mapL2').css('opacity', 1);

            // SLIDER
            // simple hue map
            $scope.cp1_barL4_src = clientFilesPath + 'bar-hue.png';

            _map.xMaxValue = 100;
            _map.yMaxValue = 100;
            _slider.yMaxValue = 359;

            break;

        case 's':
            //this._saturationRadio.checked = true;	
            $scope.cp1_Mode.thesel = 's';

            // MAP
            // bottom has saturation map
            $scope.cp1_mapL1_src = clientFilesPath + 'map-saturation.png';

            // top has overlay
            $scope.cp1_mapL2_src = clientFilesPath + 'map-saturation-overlay.png';
            angular.element('#cp1_mapL2').css('opacity', 0);

            // SLIDER
            // bottom: color
            angular.element('#cp1_barL3').css('background-color', '#' + $scope.cp1_Hex);

            // top: graduated overlay
            $scope.cp1_barL4_src = clientFilesPath + 'bar-saturation.png';

            _map.xMaxValue = 359;
            _map.yMaxValue = 100;
            _slider.yMaxValue = 100;

            break;

        case 'v':
            $scope.cp1_Mode.thesel = 'v';

            // MAP
            // bottom: nothing

            // top
            angular.element('#cp1_mapL1').css('background-color', '#000');
            $scope.cp1_mapL2_src = clientFilesPath + 'map-brightness.png';

            // SLIDER
            // bottom
            angular.element('#cp1_barL3').css('background-color', '#' + $scope.cp1_Hex);

            // top				
            $scope.cp1_barL4_src = clientFilesPath + 'bar-brightness.png';


            _map.xMaxValue = 359;
            _map.yMaxValue = 100;
            _slider.yMaxValue = 100;
            break;

        case 'r':
            $scope.cp1_Mode.thesel = 'r';

            $scope.cp1_mapL2_src = clientFilesPath + 'map-red-max.png';
            $scope.cp1_mapL1_src = clientFilesPath + 'map-red-min.png';
            $scope.cp1_barL4_src = clientFilesPath + 'bar-red-tl.png';
            $scope.cp1_barL3_src = clientFilesPath + 'bar-red-tr.png';
            $scope.cp1_barL2_src = clientFilesPath + 'bar-red-br.png';
            $scope.cp1_barL1_src = clientFilesPath + 'bar-red-bl.png';

            break;

        case 'g':
            $scope.cp1_Mode.thesel = 'g';
            $scope.cp1_mapL2_src = clientFilesPath + 'map-green-max.png';
            $scope.cp1_mapL1_src = clientFilesPath + 'map-green-min.png';

            $scope.cp1_barL4_src = clientFilesPath + 'bar-green-tl.png';
            $scope.cp1_barL3_src = clientFilesPath + 'bar-green-tr.png';
            $scope.cp1_barL2_src = clientFilesPath + 'bar-green-br.png';
            $scope.cp1_barL1_src = clientFilesPath + 'bar-green-bl.png';

            break;

        case 'b':
            $scope.cp1_Mode.thesel = 'b';
            $scope.cp1_mapL2_src = clientFilesPath + 'map-blue-max.png';
            $scope.cp1_mapL1_src = clientFilesPath + 'map-blue-min.png';

            $scope.cp1_barL4_src = clientFilesPath + 'bar-blue-tl.png';
            $scope.cp1_barL3_src = clientFilesPath + 'bar-blue-tr.png';
            $scope.cp1_barL2_src = clientFilesPath + 'bar-blue-br.png';
            $scope.cp1_barL1_src = clientFilesPath + 'bar-blue-bl.png';

            break;

        default:
            alert('invalid mode');
            break;
        }
        ColorMode = colorMode;

        switch (colorMode) {
        case 'h':
        case 's':
        case 'v':

            _map.xMinValue = 1;
            _map.yMinValue = 1;
            _slider.yMinValue = 1;
            break;

        case 'r':
        case 'g':
        case 'b':

            _map.xMinValue = 0;
            _map.yMinValue = 0;
            _slider.yMinValue = 0;

            _map.xMaxValue = 255;
            _map.yMaxValue = 255;
            _slider.yMaxValue = 255;
            break;
        }

        positionMapAndSliderArrows();

        updateMapVisuals();
        updateSliderVisuals();
    }

};
app.controller(MainController, "MainController");
