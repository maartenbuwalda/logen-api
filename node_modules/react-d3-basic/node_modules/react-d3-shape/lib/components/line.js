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

var Line = (function (_Component) {
  _inherits(Line, _Component);

  function Line(props) {
    _classCallCheck(this, Line);

    _get(Object.getPrototypeOf(Line.prototype), 'constructor', this).call(this, props);
  }

  _createClass(Line, [{
    key: '_mkLine',
    value: function _mkLine(dom) {
      var lineClassName = this.props.lineClassName;

      var dataset = (0, _utilsSeries.series)(this.props);

      // make line
      var line = _d32['default'].select(dom);
      var that = this;

      line.selectAll('.line').data(dataset).enter().append('path').style("stroke", function (d) {
        return d.color;
      }).style("fill", 'none').attr("class", lineClassName + ' line').attr("d", function (d) {
        return that._setAxes(d.data);
      }).each(function (d) {
        var dom = _d32['default'].select(this);
        if (d.style) {
          for (var key in d.style) {
            dom.style(key, d.style[key]);
          }
        }
      });

      return line;
    }
  }, {
    key: '_setAxes',
    value: function _setAxes(data) {
      var _props = this.props;
      var xScaleSet = _props.xScaleSet;
      var yScaleSet = _props.yScaleSet;
      var interpolate = _props.interpolate;

      var line = _d32['default'].svg.line().interpolate(interpolate).x(function (d) {
        return xScaleSet(d.x);
      }).y(function (d) {
        return yScaleSet(d.y);
      });

      return line.call(this, data);
    }
  }, {
    key: 'render',
    value: function render() {
      var linePath = _reactFauxDom2['default'].createElement('g');
      var line = this._mkLine(linePath);

      return line.node().toReact();
    }
  }], [{
    key: 'defaultProps',
    value: Object.assign(_commonProps2['default'], {
      interpolate: null,
      lineClassName: 'react-d3-basic__line'
    }),
    enumerable: true
  }]);

  return Line;
})(_react.Component);

exports['default'] = Line;
module.exports = exports['default'];