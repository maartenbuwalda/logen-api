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

var Area = (function (_Component) {
  _inherits(Area, _Component);

  function Area(props) {
    _classCallCheck(this, Area);

    _get(Object.getPrototypeOf(Area.prototype), 'constructor', this).call(this, props);
  }

  _createClass(Area, [{
    key: '_mkArea',
    value: function _mkArea(dom) {
      var _props = this.props;
      var areaClassName = _props.areaClassName;
      var areaOpacity = _props.areaOpacity;

      var dataset = (0, _utilsSeries.series)(this.props);

      // make area
      var area = _d32['default'].select(dom);
      var that = this;

      area.selectAll('.area').data(dataset).enter().append('path').attr("class", areaClassName + ' area').style("fill", function (d) {
        return d.color;
      }).attr("d", function (d) {
        return that._setAxes(d.data);
      }).each(function (d) {
        var dom = _d32['default'].select(this);
        if (d.style) {
          for (var key in d.style) {
            dom.style(key, d.style[key]);
          }
        }
      });

      return area;
    }
  }, {
    key: '_setAxes',
    value: function _setAxes(data) {
      var _props2 = this.props;
      var height = _props2.height;
      var margins = _props2.margins;
      var xScaleSet = _props2.xScaleSet;
      var yScaleSet = _props2.yScaleSet;
      var interpolate = _props2.interpolate;

      var area = _d32['default'].svg.area().interpolate(interpolate).x(function (d) {
        return xScaleSet(d.x);
      }).y0(function (d) {
        var domain = yScaleSet.domain();

        if (domain[0] * domain[1] < 0) {
          return yScaleSet(0);
        } else if (domain[0] * domain[1] >= 0 && domain[0] >= 0) {
          return yScaleSet.range()[0];
        } else if (domain[0] * domain[1] >= 0 && domain[0] < 0) {
          return yScaleSet.range()[1];
        }
      }).y1(function (d) {
        return yScaleSet(d.y);
      });

      return area.call(this, data);
    }
  }, {
    key: 'render',
    value: function render() {
      var areaPath = _reactFauxDom2['default'].createElement('g');
      var area = this._mkArea(areaPath);

      return area.node().toReact();
    }
  }], [{
    key: 'defaultProps',
    value: Object.assign(_commonProps2['default'], {
      interpolate: null,
      areaClassName: 'react-d3-basic__area'
    }),
    enumerable: true
  }]);

  return Area;
})(_react.Component);

exports['default'] = Area;
module.exports = exports['default'];