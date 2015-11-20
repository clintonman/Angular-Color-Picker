/*
Copyright (c) 2007 John Dyer (http://johndyer.name)
MIT style license
*/
(function () {
    angular.module("DyerColorPicker", []);

    angular.module('DyerColorPicker').directive("icrcolorPicker", icrcolorpicker);
    
    function icrcolorpicker() {
        return {
            //replace: true,
            transclude: true,
            templateUrl: 'colorpicker/colorpickertemplate.html',
            controllerAs: 'vm',
            link: function (scope, el, attr) {
                var action = function () {

                    _map.indicatorhtml = angular.element('#mappoint');
                    _slider.indicatorhtml = angular.element('#rangearrows');

                    _map._areaWidth = parseInt(angular.element('#cp1_ColorMap').css('width'));
                    _map._areaHeight = parseInt(angular.element('#cp1_ColorMap').css('height'));
                    _map.offset = angular.element('#cp1_ColorMap').offset();

                    _slider._areaWidth = parseInt(angular.element('#cp1_ColorBar').css('width'));
                    _slider._areaHeight = parseInt(angular.element('#cp1_ColorBar').css('height'));
                    _slider.offset = angular.element('#cp1_ColorBar').offset();

                    _map.indicatorWidth = parseInt(angular.element('#mappoint').css('width'));
                    _map.indicatorHeight = parseInt(angular.element('#mappoint').css('height'));

                    _slider.indicatorWidth = parseInt(angular.element('#rangearrows').css('width'));
                    _slider.indicatorHeight = parseInt(angular.element('#rangearrows').css('height'));
                    setColorMode(settings.startMode);
                };
                action();
                //$timeout(action, 0);
            }
        }
    }
        
    angular.module('DyerColorPicker').controller("MainController", MainController);
    
    function MainController(colormethods, positionindicatorfactory) {
        var vm = this;

        var clientFilesPath = 'colorpicker/images/';

        vm.RadioClick = function () {
            setColorMode(vm.cp1_Mode.thesel);
        };

        var theMouseIsDown = false;
        ColorMode = 's';
        var mapactive = false;
        var baractive = false;

        _map = positionindicatorfactory["_map"];
        _slider = positionindicatorfactory["_slider"];

        _map.mouse = {};
        _map.mouse.x = 0;
        _map.mouse.y = 0;
        _slider.mouse = {};
        _slider.mouse.x = 0;
        _slider.mouse.y = 0;
        _map.xMaxValue = 359;
        _map.yMaxValue = 100;
        _slider.yMaxValue = 100;
        _map.xMinValue = 1;
        _map.yMinValue = 1;
        _slider.yMinValue = 1;

        _slider.yValue = 33;
        _map.xValue = 34;
        _map.yValue = 35;

        _map.ValueChanged = function () {
            // update values

            switch (ColorMode) {
                case 'h':
                    vm.cp1_Saturation_val = this.xValue;
                    vm.cp1_Brightness_val = 100 - this.yValue;
                    break;

                case 's':
                    vm.cp1_Hue_val = this.xValue;
                    vm.cp1_Brightness_val = 100 - this.yValue;
                    break;

                case 'v':
                    vm.cp1_Hue_val = this.xValue;
                    vm.cp1_Saturation_val = 100 - this.yValue;
                    break;

                case 'r':
                    vm.cp1_Blue_val = this.xValue;
                    vm.cp1_Green_val = 256 - this.yValue;
                    break;

                case 'g':
                    vm.cp1_Blue_val = this.xValue;
                    vm.cp1_Red_val = 256 - this.yValue;
                    break;

                case 'b':
                    vm.cp1_Red_val = this.xValue;
                    vm.cp1_Green_val = 256 - this.yValue;
                    break;
            }

            switch (ColorMode) {
                case 'h':
                case 's':
                case 'v':
                    setHsv({
                        h: vm.cp1_Hue_val,
                        s: vm.cp1_Saturation_val,
                        v: vm.cp1_Brightness_val
                    });
                    break;

                case 'r':
                case 'g':
                case 'b':
                    setRgb({
                        r: vm.cp1_Red_val,
                        g: vm.cp1_Green_val,
                        b: vm.cp1_Blue_val
                    });
                    break;
            }

            updateVisuals();
        };

        _slider.ValueChanged = function () {

            switch (ColorMode) {
                case 'h':
                    vm.cp1_Hue_val = 360 - this.yValue;
                    break;
                case 's':
                    vm.cp1_Saturation_val = 100 - this.yValue;
                    break;
                case 'v':
                    vm.cp1_Brightness_val = 100 - this.yValue;
                    break;

                case 'r':
                    vm.cp1_Red_val = 255 - this.yValue;
                    break;
                case 'g':
                    vm.cp1_Green_val = 255 - this.yValue;
                    break;
                case 'b':
                    vm.cp1_Blue_val = 255 - this.yValue;
                    break;
            }

            switch (ColorMode) {
                case 'h':
                case 's':
                case 'v':
                    setHsv({
                        h: vm.cp1_Hue_val,
                        s: vm.cp1_Saturation_val,
                        v: vm.cp1_Brightness_val
                    });
                    break;

                case 'r':
                case 'g':
                case 'b':
                    setRgb({
                        r: vm.cp1_Red_val,
                        g: vm.cp1_Green_val,
                        b: vm.cp1_Blue_val
                    });
                    break;
            }

            updateVisuals();
        };

        vm.mapmousedown = function (event) {
            theMouseIsDown = true;

            _map.mouse.x = event.pageX;
            _map.mouse.y = event.pageY;

            event.preventDefault();
            _map.setValuesFromMousePosition();

            mapactive = true;

        };

        vm.barmousedown = function (event) {

            theMouseIsDown = true;

            _slider.mouse.x = event.pageX;
            _slider.mouse.y = event.pageY;
            _slider.setValuesFromMousePosition();
            event.preventDefault();
            baractive = true;
        };

        vm.mouseup = function (event) {

            theMouseIsDown = false;
            mapactive = false;
            baractive = false;
        };

        vm.mouseleave = function (event) {

            theMouseIsDown = false;
            mapactive = false;
            baractive = false;
        };


        vm.mousemove = function (event) {
            if (!theMouseIsDown)
                return;

            if (mapactive) {
                _map.mouse.x = event.pageX;
                _map.mouse.y = event.pageY;
                _map.setValuesFromMousePosition();
            }
            if (baractive) {
                _slider.mouse.x = event.pageX;
                _slider.mouse.y = event.pageY;
                _slider.setValuesFromMousePosition();
            }
        };

        vm.onHsvChange = function () {
            console.log("onhsvchange");
            console.log(colorstuff);
            validateHsv();
            setHsv({
                h: vm.cp1_Hue_val,
                s: vm.cp1_Saturation_val,
                v: vm.cp1_Brightness_val
            });
            updateVisuals();
            positionMapAndSliderArrows();
        };
        vm.onRgbChange = function () {
            validateRgb();
            setRgb({
                r: vm.cp1_Red_val,
                g: vm.cp1_Green_val,
                b: vm.cp1_Blue_val
            });
            updateVisuals();
            positionMapAndSliderArrows();
        };

        vm.onHexChange = function () {
            if (validateHex()) {
                setHex(vm.cp1_Hex);
                updateVisuals();
                positionMapAndSliderArrows();
            }
        };

        function setHsv(hsv) {
            var rgb = colormethods.hsvToRgb(hsv);
            vm.cp1_Red_val = rgb.r;
            vm.cp1_Green_val = rgb.g;
            vm.cp1_Blue_val = rgb.b;

            var hex = colormethods.rgbToHex(rgb);
            vm.cp1_Hex = hex;
        }

        function setRgb(rgb) {
            var hsv = colormethods.rgbToHsv(rgb);
            vm.cp1_Hue_val = hsv.h;
            vm.cp1_Saturation_val = hsv.s;
            vm.cp1_Brightness_val = hsv.v;

            var hex = colormethods.rgbToHex(rgb);
            vm.cp1_Hex = hex;
        }

        function setHex(hex) {

            var rgb = colormethods.hexToRgb(hex);
            vm.cp1_Red_val = rgb.r;
            vm.cp1_Green_val = rgb.g;
            vm.cp1_Blue_val = rgb.b;

            var hsv = colormethods.rgbToHsv(rgb);
            vm.cp1_Hue_val = hsv.h;
            vm.cp1_Saturation_val = hsv.s;
            vm.cp1_Brightness_val = hsv.v;
        }

        function validateRgb() {
            vm.cp1_Red_val = _setValueInRange(vm.cp1_Red_val, 0, 255);
            vm.cp1_Green_val = _setValueInRange(vm.cp1_Green_val, 0, 255);
            vm.cp1_Blue_val = _setValueInRange(vm.cp1_Blue_val, 0, 255);
        }

        function validateHsv() {
            vm.cp1_Hue_val = _setValueInRange(vm.cp1_Hue_val, 0, 359);
            vm.cp1_Saturation_val = _setValueInRange(vm.cp1_Saturation_val, 0, 100);
            vm.cp1_Brightness_val = _setValueInRange(vm.cp1_Brightness_val, 0, 100);
        }

        function validateHex() {
            var hex = new String(vm.cp1_Hex).toUpperCase();
            hex = hex.replace(/[^A-F0-9]/g, '0');
            if (hex.length > 6) hex = hex.substring(0, 6);
            if (hex.length < 6)
                return false;
            vm.cp1_Hex = hex;
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

        vm.cp1_mapL1_src = clientFilesPath + "blank.gif";
        vm.cp1_mapL2_src = clientFilesPath + "blank.gif";

        vm.cp1_barL1_src = clientFilesPath + "blank.gif";
        vm.cp1_barL2_src = clientFilesPath + "blank.gif";
        vm.cp1_barL3_src = clientFilesPath + "blank.gif";
        vm.cp1_barL4_src = clientFilesPath + "bar-brightness.png";

        vm.cp1_Preview_style = {
            'width': '60px',
            'height': '60px',
            'background-color': '#fff',
            padding: 0,
            margin: 0,
            border: 'solid 1px #000'
        };

        vm.cp1_Mode = {
            thesel: null
        };

        settings = {
            startHex: '22cc33',
            startMode: 's'
        };
        vm.cp1_Hex = settings.startHex;

        var rgb = colormethods.hexToRgb(vm.cp1_Hex);
        vm.cp1_Red_val = rgb.r;
        vm.cp1_Green_val = rgb.g;
        vm.cp1_Blue_val = rgb.b;

        var hsv = colormethods.rgbToHsv(rgb);
        vm.cp1_Hue_val = hsv.h;
        vm.cp1_Saturation_val = hsv.s;
        vm.cp1_Brightness_val = hsv.v;

        vm.cp1_Preview_style["background-color"] = '#' + vm.cp1_Hex;

        function updateVisuals() {
            updatePreview();
            updateMapVisuals();
            updateSliderVisuals();
        }

        function updatePreview() {
            vm.cp1_Preview_style["background-color"] = '#' + vm.cp1_Hex;
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
                    sliderValue = maxHue - vm.cp1_Hue_val;
                    break;

                case 's':
                    sliderValue = maxSaturation - vm.cp1_Saturation_val;
                    break;

                case 'v':
                    sliderValue = maxBright - vm.cp1_Brightness_val;
                    break;

                case 'r':
                    sliderValue = maxRGB - vm.cp1_Red_val;
                    break;

                case 'g':
                    sliderValue = maxRGB - vm.cp1_Green_val;
                    break;

                case 'b':
                    sliderValue = maxRGB - vm.cp1_Blue_val;
                    break;
            }

            _slider.yValue = sliderValue;
            _slider.setIndicatorPositionFromValues();

            // color map
            var mapXValue = 0;
            var mapYValue = 0;
            switch (ColorMode) {
                case 'h':
                    mapXValue = vm.cp1_Saturation_val;
                    mapYValue = maxBright - vm.cp1_Brightness_val;
                    break;

                case 's':
                    mapXValue = vm.cp1_Hue_val;
                    mapYValue = maxBright - vm.cp1_Brightness_val;
                    break;

                case 'v':
                    mapXValue = vm.cp1_Hue_val;
                    mapYValue = maxSaturation - vm.cp1_Saturation_val;
                    break;

                case 'r':
                    mapXValue = vm.cp1_Blue_val;
                    mapYValue = maxRGB - vm.cp1_Green_val;
                    break;

                case 'g':
                    mapXValue = vm.cp1_Blue_val;
                    mapYValue = maxRGB - vm.cp1_Red_val;
                    break;

                case 'b':
                    mapXValue = vm.cp1_Red_val;
                    mapYValue = maxRGB - vm.cp1_Green_val;
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
                        h: vm.cp1_Hue_val,
                        s: 100,
                        v: 100
                    };
                    var rgb = colormethods.hsvToRgb(hsv);
                    var hexval = colormethods.rgbToHex(rgb);

                    angular.element('#cp1_mapL1').css('background-color', '#' + hexval);
                    break;

                case 's':
                    angular.element('#cp1_mapL2').css('opacity', (100 - vm.cp1_Saturation_val) / 100);
                    break;

                case 'v':
                    angular.element('#cp1_mapL2').css('opacity', vm.cp1_Brightness_val / 100);
                    break;

                case 'r':
                    angular.element('#cp1_mapL2').css('opacity', vm.cp1_Red_val / 256);
                    break;

                case 'g':
                    angular.element('#cp1_mapL2').css('opacity', vm.cp1_Green_val / 256);
                    break;

                case 'b':
                    angular.element('#cp1_mapL2').css('opacity', vm.cp1_Blue_val / 256);
                    break;
            }
        }

        function updateSliderVisuals() {
            switch (ColorMode) {
                case 'h':
                    break;

                case 's':
                    var saturatedColor = {
                        h: vm.cp1_Hue_val,
                        s: 100,
                        v: vm.cp1_Brightness_val
                    };
                    var rgb = colormethods.hsvToRgb(saturatedColor);
                    var hexval = colormethods.rgbToHex(rgb);
                    angular.element('#cp1_barL3').css('background-color', '#' + hexval);
                    break;

                case 'v':
                    var valueColor = {
                        h: vm.cp1_Hue_val,
                        s: vm.cp1_Saturation_val,
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
                        hValue = vm.cp1_Blue_val;
                        vValue = vm.cp1_Green_val;
                    } else if (this.ColorMode == 'g') {
                        hValue = vm.cp1_Blue_val;
                        vValue = vm.cp1_Red_val;
                    } else if (this.ColorMode == 'b') {
                        hValue = vm.cp1_Red_val;
                        vValue = vm.cp1_Green_val;
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



        //function setColorMode(colorMode) {
        setColorMode = function (colorMode) {

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

            vm.cp1_mapL1_src = clientFilesPath + 'blank.gif';
            vm.cp1_mapL2_src = clientFilesPath + 'blank.gif';
            vm.cp1_barL1_src = clientFilesPath + 'blank.gif';
            vm.cp1_barL2_src = clientFilesPath + 'blank.gif';
            vm.cp1_barL3_src = clientFilesPath + 'blank.gif';
            vm.cp1_barL4_src = clientFilesPath + 'blank.gif';


            switch (colorMode) {
                case 'h':
                    vm.cp1_Mode.thesel = 'h';

                    // MAP
                    // put a color layer on the bottom
                    angular.element('#cp1_mapL1').css('background-color', '#' + vm.cp1_Hex);

                    // add a hue map on the top
                    angular.element('#cp1_mapL2').css('background-color', 'transparent');
                    vm.cp1_mapL2_src = clientFilesPath + 'map-hue.png';
                    angular.element('#cp1_mapL2').css('opacity', 1);

                    // SLIDER
                    // simple hue map
                    vm.cp1_barL4_src = clientFilesPath + 'bar-hue.png';

                    _map.xMaxValue = 100;
                    _map.yMaxValue = 100;
                    _slider.yMaxValue = 359;

                    break;

                case 's':
                    //this._saturationRadio.checked = true;	
                    vm.cp1_Mode.thesel = 's';

                    // MAP
                    // bottom has saturation map
                    vm.cp1_mapL1_src = clientFilesPath + 'map-saturation.png';

                    // top has overlay
                    vm.cp1_mapL2_src = clientFilesPath + 'map-saturation-overlay.png';
                    angular.element('#cp1_mapL2').css('opacity', 0);

                    // SLIDER
                    // bottom: color
                    angular.element('#cp1_barL3').css('background-color', '#' + vm.cp1_Hex);

                    // top: graduated overlay
                    vm.cp1_barL4_src = clientFilesPath + 'bar-saturation.png';

                    _map.xMaxValue = 359;
                    _map.yMaxValue = 100;
                    _slider.yMaxValue = 100;

                    break;

                case 'v':
                    vm.cp1_Mode.thesel = 'v';

                    // MAP
                    // bottom: nothing

                    // top
                    angular.element('#cp1_mapL1').css('background-color', '#000');
                    vm.cp1_mapL2_src = clientFilesPath + 'map-brightness.png';

                    // SLIDER
                    // bottom
                    angular.element('#cp1_barL3').css('background-color', '#' + vm.cp1_Hex);

                    // top				
                    vm.cp1_barL4_src = clientFilesPath + 'bar-brightness.png';


                    _map.xMaxValue = 359;
                    _map.yMaxValue = 100;
                    _slider.yMaxValue = 100;
                    break;

                case 'r':
                    vm.cp1_Mode.thesel = 'r';

                    vm.cp1_mapL2_src = clientFilesPath + 'map-red-max.png';
                    vm.cp1_mapL1_src = clientFilesPath + 'map-red-min.png';
                    vm.cp1_barL4_src = clientFilesPath + 'bar-red-tl.png';
                    vm.cp1_barL3_src = clientFilesPath + 'bar-red-tr.png';
                    vm.cp1_barL2_src = clientFilesPath + 'bar-red-br.png';
                    vm.cp1_barL1_src = clientFilesPath + 'bar-red-bl.png';

                    break;

                case 'g':
                    vm.cp1_Mode.thesel = 'g';
                    vm.cp1_mapL2_src = clientFilesPath + 'map-green-max.png';
                    vm.cp1_mapL1_src = clientFilesPath + 'map-green-min.png';

                    vm.cp1_barL4_src = clientFilesPath + 'bar-green-tl.png';
                    vm.cp1_barL3_src = clientFilesPath + 'bar-green-tr.png';
                    vm.cp1_barL2_src = clientFilesPath + 'bar-green-br.png';
                    vm.cp1_barL1_src = clientFilesPath + 'bar-green-bl.png';

                    break;

                case 'b':
                    vm.cp1_Mode.thesel = 'b';
                    vm.cp1_mapL2_src = clientFilesPath + 'map-blue-max.png';
                    vm.cp1_mapL1_src = clientFilesPath + 'map-blue-min.png';

                    vm.cp1_barL4_src = clientFilesPath + 'bar-blue-tl.png';
                    vm.cp1_barL3_src = clientFilesPath + 'bar-blue-tr.png';
                    vm.cp1_barL2_src = clientFilesPath + 'bar-blue-br.png';
                    vm.cp1_barL1_src = clientFilesPath + 'bar-blue-bl.png';

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
    }

})();

