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

var Scatter = (function (_Component) {
  _inherits(Scatter, _Component);

  function Scatter(props) {
    _classCallCheck(this, Scatter);

    _get(Object.getPrototypeOf(Scatter.prototype), 'constructor', this).call(this, props);
  }

  _createClass(Scatter, [{
    key: '_mkScatter',
    value: function _mkScatter(dom, dataset) {
      var _props = this.props;
      var scatterClassName = _props.scatterClassName;
      var defaultSymbol = _props.defaultSymbol;
      var defaultSymbolSize = _props.defaultSymbolSize;
      var brushSymbol = _props.brushSymbol;
      var xScaleSet = _props.xScaleSet;
      var yScaleSet = _props.yScaleSet;

      // for building symbols in brush, set to circle and size to 4
      if (brushSymbol) {
        symbol = 'circle';
        symbolSize = 4;
      }

      var dots = _d32['default'].select(dom);

      dots.selectAll('g').data(dataset).enter().append('g').each(function (dot) {

        var symbol = dot.symbol ? dot.symbol : defaultSymbol;
        var symbolSize = dot.symbolSize ? dot.symbolSize : defaultSymbolSize;

        var dom = _d32['default'].select(this).selectAll('' + scatterClassName).data(dot.data).enter().append('path').attr('class', 'react-d3-basic__scatter__path').style('fill', dot.color).attr('transform', function (d) {
          return "translate(" + xScaleSet(d.x) + "," + yScaleSet(d.y) + ")";
        }).attr('d', _d32['default'].svg.symbol().size(function (d) {
          return symbolSize * symbolSize;
        }).type(symbol));

        // set style for dot
        if (dot.style) {
          for (var key in dot.style) {
            dom.style(key, dot.style[key]);
          }
        }
      });

      return dots;
    }
  }, {
    key: 'render',
    value: function render() {
      var d = (0, _utilsSeries.series)(this.props);

      var scatterPlot = _reactFauxDom2['default'].createElement('g');
      var scatter = this._mkScatter(scatterPlot, d);

      return scatter.node().toReact();
    }
  }], [{
    key: 'defaultProps',
    value: {
      defaultSymbol: 'circle',
      defaultSymbolSize: 10,
      scatterClassName: 'react-d3-basic__scatter'
    },
    enumerable: true
  }]);

  return Scatter;
})(_react.Component);

exports['default'] = Scatter;
module.exports = exports['default'];