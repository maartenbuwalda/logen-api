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

var _commonProps = require('../commonProps');

var _reactFauxDom = require('react-faux-dom');

var _reactFauxDom2 = _interopRequireDefault(_reactFauxDom);

var Pie = (function (_Component) {
  _inherits(Pie, _Component);

  function Pie(props) {
    _classCallCheck(this, Pie);

    _get(Object.getPrototypeOf(Pie.prototype), 'constructor', this).call(this, props);
  }

  _createClass(Pie, [{
    key: 'mkSeries',
    value: function mkSeries() {
      var _props = this.props;
      var data = _props.data;
      var chartSeries = _props.chartSeries;
      var value = _props.value;
      var name = _props.name;
      var categoricalColors = _props.categoricalColors;

      var chartSeriesData = chartSeries.map(function (f, i) {

        // set a color if not set
        if (!f.color) f.color = categoricalColors(i);

        // set name if not set
        if (!f.name) f.name = f.field;

        var val;

        data.forEach(function (d) {
          if (name(d) === f.field) val = d;
        });

        return Object.assign(f, { value: value(val) });
      });

      return chartSeriesData;
    }
  }, {
    key: '_mkPie',
    value: function _mkPie(dom) {
      var _props2 = this.props;
      var width = _props2.width;
      var height = _props2.height;
      var innerRadius = _props2.innerRadius;
      var outerRadius = _props2.outerRadius;
      var pieSort = _props2.pieSort;
      var value = _props2.value;
      var radius = _props2.radius;
      var onMouseOut = _props2.onMouseOut;
      var onMouseOver = _props2.onMouseOver;

      var radius = this.props.radius || Math.min(width - 100, height - 100) / 2;
      var outerRadius = outerRadius || radius - 10;

      var chartSeriesData = this.mkSeries();

      var arc = _d32['default'].svg.arc().outerRadius(outerRadius).innerRadius(innerRadius);

      var arcOver = _d32['default'].svg.arc().outerRadius(outerRadius + 10).innerRadius(innerRadius);

      var pie = _d32['default'].layout.pie().sort(function (a, b) {
        return pieSort(a.value, b.value);
      }).value(function (d) {
        return d.value;
      });

      var pieDom = _d32['default'].select(dom);

      var g = pieDom.selectAll('.arc').data(pie(chartSeriesData)).enter().append('g').attr('class', 'arc');

      g.append("path").attr("d", arc).style("fill", function (d) {
        return d.data.color;
      }).style("stroke", "#FFF").attr("style", function (d) {
        var s = '';
        if (d.data.style) {
          for (var key in d.data.style) {
            s += key + ':' + d.data.style[key] + ';';
          }
        }
        return s;
      }).on("mouseover", onMouseOver).on("mouseout", onMouseOut);

      var labelr = radius + 10;

      g.append("text").attr("transform", function (d) {
        var c = arc.centroid(d),
            x = c[0],
            y = c[1],

        // pythagorean theorem for hypotenuse
        h = Math.sqrt(x * x + y * y);

        return "translate(" + x / h * labelr + ',' + y / h * labelr + ")";
      }).attr("dy", ".35em").style("text-anchor", function (d) {
        return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
      }).text(function (d) {
        return d.data.name;
      });

      return pieDom;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var width = _props3.width;
      var height = _props3.height;
      var margins = _props3.margins;

      var t = 'translate(' + (width - margins.left - margins.right) / 2 + ',  ' + (height - margins.top - margins.bottom) / 2 + ')';

      var pieChart = _reactFauxDom2['default'].createElement('g');
      pieChart.setAttribute("transform", t);
      pieChart.setAttribute("ref", "react-d3-basic__pie");

      var pie = this._mkPie(pieChart);

      return pie.node().toReact();
    }
  }], [{
    key: 'defaultProps',
    value: Object.assign(_commonProps.pieProps, {
      onMouseOver: function onMouseOver(d) {},
      onMouseOut: function onMouseOut(d) {}
    }),
    enumerable: true
  }]);

  return Pie;
})(_react.Component);

exports['default'] = Pie;
module.exports = exports['default'];