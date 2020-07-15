(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'prop-types'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('prop-types'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.propTypes);
    global.CustomOverlay = mod.exports;
  }
})(this, function (exports, _react, _propTypes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CustomOverlay = undefined;

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function createPopupClass() {
    function Popup(_ref) {
      var position = _ref.position,
          content = _ref.content,
          map = _ref.map,
          passThroughMouseEvents = _ref.passThroughMouseEvents,
          onDraw = _ref.onDraw;

      this.position = position;
      this.containerDiv = content;
      this.onDraw = onDraw;
      this.setMap(map);
      if (!passThroughMouseEvents) {
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
      }
    }

    Popup.prototype = Object.create(google.maps.OverlayView.prototype);

    Popup.prototype.show = function () {
      this.containerDiv.style.visibility = 'visible';
    };

    Popup.prototype.hide = function () {
      this.containerDiv.style.visibility = 'hidden';
    };

    Popup.prototype.onAdd = function () {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    };

    Popup.prototype.onRemove = function () {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    };

    Popup.prototype.draw = function () {
      if (!this.position) {
        return;
      }
      this.onDraw();
      var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
      var display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

      if (display === 'block') {
        this.containerDiv.style.left = divPosition.x + 'px';
        this.containerDiv.style.top = divPosition.y + 'px';
      }
      if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }
    };

    return Popup;
  }

  var asLatLng = function asLatLng(position) {
    return !position || position instanceof google.maps.LatLng ? position : new google.maps.LatLng(position.lat, position.lng);
  };

  var CustomOverlay = exports.CustomOverlay = function CustomOverlay(_ref2) {
    var map = _ref2.map,
        position = _ref2.position,
        children = _ref2.children,
        visible = _ref2.visible,
        className = _ref2.className,
        passThroughMouseEvents = _ref2.passThroughMouseEvents;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        hasDrawn = _useState2[0],
        setHasDrawn = _useState2[1];

    var containerRef = (0, _react.useRef)(null);
    var popoverRef = (0, _react.useRef)(null);

    (0, _react.useEffect)(function () {
      if (map) {
        var Popup = createPopupClass();
        popoverRef.current = new Popup({
          position: asLatLng(position),
          content: containerRef.current,
          map: map,
          passThroughMouseEvents: passThroughMouseEvents,
          onDraw: function onDraw() {
            return setHasDrawn(true);
          }
        });
      }
    }, [map]);

    (0, _react.useEffect)(function () {
      var popover = popoverRef.current;
      if (popover) {
        popover.position = asLatLng(position);
        popover.draw();
      }
    }, [position]);

    (0, _react.useEffect)(function () {
      var popover = popoverRef.current;
      if (popover) {
        visible ? popover.show() : popover.hide();
      }
    }, [visible]);

    var display = hasDrawn ? 'block' : 'none';
    return _react2.default.createElement(
      'div',
      {
        className: className,
        style: { position: 'absolute', display: display },
        ref: containerRef
      },
      visible && children
    );
  };

  CustomOverlay.propTypes = {
    className: _propTypes2.default.string,
    children: _propTypes2.default.node.isRequired,
    map: _propTypes2.default.object,
    position: _propTypes2.default.object,
    visible: _propTypes2.default.bool,
    passThroughMouseEvents: _propTypes2.default.bool
  };

  CustomOverlay.defaultProps = {
    visible: true
  };

  exports.default = CustomOverlay;
});