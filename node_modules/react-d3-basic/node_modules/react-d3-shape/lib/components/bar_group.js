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

var BarGroup = (function (_Component) {
  _inherits(BarGroup, _Component);

  function BarGroup(props) {
    _classCallCheck(this, BarGroup);

    _get(Object.getPrototypeOf(BarGroup.prototype), 'constructor', this).call(this, props);
  }

  _createClass(BarGroup, [{
    key: '_mkBarGroup',
    value: function _mkBarGroup(dom) {
      var _props = this.props;
      var height = _props.height;
      var margins = _props.margins;
      var barClassName = _props.barClassName;
      var xScaleSet = _props.xScaleSet;
      var yScaleSet = _props.yScaleSet;
      var onMouseOut = _props.onMouseOut;
      var onMouseOver = _props.onMouseOver;

      var dataset = (0, _utilsSeries.series)(this.props);
      var x1 = _d32['default'].scale.ordinal();

      // mapping x1, inner x axis
      x1.domain(dataset.map(function (d) {
        return d.field;
      })).rangeRoundBands([0, xScaleSet.rangeBand()]);

      var domain = yScaleSet.domain();
      var zeroBase;

      if (domain[0] * domain[1] < 0) {
        zeroBase = yScaleSet(0);
      } else if (domain[0] * domain[1] >= 0 && domain[0] >= 0) {
        zeroBase = yScaleSet.range()[0];
      } else if (domain[0] * domain[1] >= 0 && domain[0] < 0) {
        zeroBase = yScaleSet.range()[1];
      }

      // make areas
      var chart = _d32['default'].select(dom);

      chart.selectAll('.bargroup').data(dataset).enter().append('g').attr("class", "bargroup").each(function (dt, i) {
        var dom = _d32['default'].select(this).selectAll("rect").data(dt.data).enter().append("rect").attr("class", barClassName + ' bar').attr("width", x1.rangeBand()).attr("x", function (d) {
          return xScaleSet(d.x) ? xScaleSet(d.x) + x1.rangeBand() * i : -10000;
        }).attr("y", function (d) {
          return d.y < 0 ? zeroBase : yScaleSet(d.y);
        }).attr("height", function (d) {
          return d.y < domain[0] ? 0 : Math.abs(zeroBase - yScaleSet(d.y));
        }).style("fill", function (d) {
          return dt.color;
        }).on("mouseover", onMouseOver).on("mouseout", onMouseOut);

        if (dt.style) {
          for (var key in dt.style) {
            dom.style(key, dt.style[key]);
          }
        }
      });

      return chart;
    }
  }, {
    key: 'render',
    value: function render() {
      var barChart = _reactFauxDom2['default'].createElement('g');
      var bar = this._mkBarGroup(barChart);

      return bar.node().toReact();
    }
  }], [{
    key: 'defaultProps',
    value: {
      onMouseOver: function onMouseOver(d) {},
      onMouseOut: function onMouseOut(d) {},
      barClassName: 'react-d3-basic__bar_group'
    },
    enumerable: true
  }]);

  return BarGroup;
})(_react.Component);

exports['default'] = BarGroup;
module.exports = exports['default'];