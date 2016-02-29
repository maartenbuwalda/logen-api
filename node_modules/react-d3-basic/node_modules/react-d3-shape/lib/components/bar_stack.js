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

var _utilsSeries = require('../utils/series');

var BarStack = (function (_Component) {
  _inherits(BarStack, _Component);

  function BarStack(props) {
    _classCallCheck(this, BarStack);

    _get(Object.getPrototypeOf(BarStack.prototype), 'constructor', this).call(this, props);
  }

  _createClass(BarStack, [{
    key: '_mkBarStack',
    value: function _mkBarStack(dom) {
      var _props = this.props;
      var height = _props.height;
      var margins = _props.margins;
      var barClassName = _props.barClassName;
      var xScaleSet = _props.xScaleSet;
      var yScaleSet = _props.yScaleSet;
      var onMouseOver = _props.onMouseOver;
      var onMouseOut = _props.onMouseOut;

      var dataset = (0, _utilsSeries.series)(this.props);

      var _setStack = this._setStack();

      // make areas
      var chart = _d32['default'].select(dom).attr("class", "g");

      var domain = yScaleSet.domain();
      var zeroBase;

      if (domain[0] * domain[1] < 0) {
        zeroBase = yScaleSet(0);
      } else if (domain[0] * domain[1] >= 0 && domain[0] >= 0) {
        zeroBase = yScaleSet.range()[0];
      } else if (domain[0] * domain[1] >= 0 && domain[0] < 0) {
        zeroBase = yScaleSet.range()[1];
      }

      var barGroup = chart.selectAll("g").data(_setStack(dataset)).enter().append("g").attr("class", "barGroup").style("fill", function (d) {
        return d.color;
      }).attr("style", function (d) {
        var s = '';
        if (d.style) {
          for (var key in d.style) {
            s += key + ':' + d.style[key] + ';';
          }
        }
        return s;
      });

      barGroup.selectAll("rect").data(function (d) {
        return d.data;
      }).enter().append("rect").attr("class", barClassName + ' bar').attr("width", xScaleSet.rangeBand()).attr("x", function (d) {
        return xScaleSet(d.x) ? xScaleSet(d.x) : -10000;
      }).attr("y", function (d, i) {
        return yScaleSet(d.y0 + d.y);
      }).attr("height", function (d, i) {
        return Math.abs(yScaleSet(d.y) - yScaleSet(0));
      }).on("mouseover", onMouseOver).on("mouseout", onMouseOut);

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
    key: 'render',
    value: function render() {
      var barChart = _reactFauxDom2['default'].createElement('g');
      var bar = this._mkBarStack(barChart);

      return bar.node().toReact();
    }
  }], [{
    key: 'defaultProps',
    value: {
      onMouseOver: function onMouseOver(d) {},
      onMouseOut: function onMouseOut(d) {},
      barClassName: 'react-d3-basic__bar_stack'
    },
    enumerable: true
  }]);

  return BarStack;
})(_react.Component);

exports['default'] = BarStack;
module.exports = exports['default'];