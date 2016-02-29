"use strict";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3 = require('d3');

var _d32 = _interopRequireDefault(_d3);

var _reactFauxDom = require('react-faux-dom');

var _reactFauxDom2 = _interopRequireDefault(_reactFauxDom);

var _commonProps = require('../commonProps');

var _commonProps2 = _interopRequireDefault(_commonProps);

var _utilsSeries = require('../utils/series');

var AreaStack = (function (_Component) {
  _inherits(AreaStack, _Component);

  function AreaStack(props) {
    _classCallCheck(this, AreaStack);

    _get(Object.getPrototypeOf(AreaStack.prototype), 'constructor', this).call(this, props);
  }

  _createClass(AreaStack, [{
    key: '_mkStack',
    value: function _mkStack(dom) {
      var areaClassName = this.props.areaClassName;

      var dataset = (0, _utilsSeries.series)(this.props);

      var _setStack = this._setStack();
      var _setAxis = this._setAxes();

      // make areas
      var chart = _d32['default'].select(dom).attr("class", areaClassName + ' area-group');

      chart.selectAll("path").data(_setStack(dataset)).enter().append("path").attr("class", "area").style("fill", function (d) {
        return d.color;
      }).attr("d", function (d) {
        return _setAxis(d.data);
      }).attr("style", function (d) {
        var s = '';
        if (d.style) {
          for (var key in d.style) {
            s += key + ':' + d.style[key] + ';';
          }
        }
        return s;
      });

      return chart;
    }
  }, {
    key: '_setStack',
    value: function _setStack() {
      var chartSeries = this.props.chartSeries;

      var buildOut = function buildOut(len) {
        // baseline for positive and negative bars respectively.
        var currentXOffsets = [];
        var currentXIndex = 0;
        return function (d, y0, y) {

          if (currentXIndex++ % len === 0) {
            currentXOffsets = [0, 0];
          }

          if (y >= 0) {
            d.y0 = currentXOffsets[1];
            d.y = y;
            currentXOffsets[1] += y;
          } else {
            d.y0 = currentXOffsets[0] + y;
            d.y = -y;
            currentXOffsets[0] += y;
          }
        };
      };
      return _d32['default'].layout.stack().values(function (d) {
        return d.data;
      }).out(buildOut(chartSeries.length));
    }
  }, {
    key: '_setAxes',
    value: function _setAxes() {
      var _props = this.props;
      var xScaleSet = _props.xScaleSet;
      var yScaleSet = _props.yScaleSet;
      var interpolate = _props.interpolate;

      return _d32['default'].svg.area().interpolate(interpolate).x(function (d) {
        return xScaleSet(d.x);
      }).y0(function (d) {
        return yScaleSet(d.y0);
      }).y1(function (d) {
        return yScaleSet(d.y0 + d.y);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var areaPath = _reactFauxDom2['default'].createElement('g');
      var area = this._mkStack(areaPath);

      return area.node().toReact();
    }
  }], [{
    key: 'defaultProps',
    value: Object.assign(_commonProps2['default'], {
      areaClass: 'react-d3-basics__area_stack',
      interpolate: null,
      areaClassName: 'react-d3-basic__area_stack'
    }),
    enumerable: true
  }]);

  return AreaStack;
})(_react.Component);

exports['default'] = AreaStack;
module.exports = exports['default'];