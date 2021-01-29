"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@deck.gl/core");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

var _core2 = require("@luma.gl/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var vs = "\n  attribute vec3 positions;\n  attribute vec3 instancePositions;\n  attribute vec3 instancePositions64Low;\n  attribute vec4 instanceColors;\n  attribute float instanceScale;\n  attribute float instanceRotationAngle;\n  attribute float instanceWidth;\n  // for onHover to work must\n  // delcare instancePickingColors here and assign it to\n  // geometry.pickingColor\n  // and then register DECKGL_FILTER_COLOR hook in\n  // fragment shader\n  attribute vec3 instancePickingColors;\n\n  varying vec4 vColor;\n  varying vec2 vPosition;\n\n  vec2 rotate_by_angle(vec2 vertex, float angle) {\n    float angle_radian = angle * PI / 180.0;\n    float cos_angle = cos(angle_radian);\n    float sin_angle = sin(angle_radian);\n    mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);\n    return rotationMatrix * vertex;\n  }\n\n  void main(void) {\n    geometry.pickingColor = instancePickingColors;\n    // layer adopted from circle and default radius was 30\n    vec3 offsetCommon = positions * project_size(30.0);\n    offsetCommon = vec3(rotate_by_angle(offsetCommon.xy, instanceRotationAngle), 0);\n    offsetCommon.x = offsetCommon.x * instanceWidth;\n    // width first\n    offsetCommon = offsetCommon * instanceScale;\n    \n    vec3 positionCommon = project_position(instancePositions, instancePositions64Low);\n    // missx: So in your shader, positionCommon is the anchor position on the map. \n    // offsetCommon is the local coordinate relative to the anchor\n    // You want to leave the anchor alone and rotate the offset\n\n    gl_Position = project_common_position_to_clipspace(vec4(positionCommon + offsetCommon, 1.0));\n\n    vPosition = positions.xy;\n    vColor = instanceColors;\n    DECKGL_FILTER_COLOR(vColor, geometry);\n\n  }";
var fs = "\n  precision highp float;\n\n  varying vec4 vColor;\n  varying vec2 vPositionn;\n\n  void main(void) {    \n\n    gl_FragColor = vec4(vColor.rgb, vColor.a);\n    DECKGL_FILTER_COLOR(gl_FragColor, geometry);\n  }";
var defaultProps = {
  getPosition: {
    type: 'accessor',
    value: function value(x) {
      return x.position;
    }
  },
  getColor: {
    type: 'accessor',
    value: [0, 0, 0, 255]
  },
  getScale: {
    type: 'accessor',
    value: 1
  },
  getRotationAngle: {
    type: 'accessor',
    value: 1
  },
  getWidth: {
    type: 'accessor',
    value: 1
  }
};

var BarLayer = function (_Layer) {
  _inherits(BarLayer, _Layer);

  var _super = _createSuper(BarLayer);

  function BarLayer() {
    _classCallCheck(this, BarLayer);

    return _super.apply(this, arguments);
  }

  _createClass(BarLayer, [{
    key: "getShaders",
    value: function getShaders() {
      return _get(_getPrototypeOf(BarLayer.prototype), "getShaders", this).call(this, {
        vs,
        fs,
        modules: [_core.project32, _core.picking]
      });
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      this.getAttributeManager().addInstanced({
        instancePositions: {
          size: 3,
          type: _constants.default.DOUBLE,
          accessor: 'getPosition'
        },
        instanceColors: {
          size: 4,
          type: _constants.default.UNSIGNED_BYTE,
          accessor: 'getColor',
          defaultValue: [0, 0, 0, 255]
        },
        instanceScale: {
          size: 1,
          accessor: 'getScale',
          defaultValue: 1
        },
        instanceRotationAngle: {
          size: 1,
          accessor: 'getRotationAngle',
          defaultValue: 1
        },
        instanceWidth: {
          size: 1,
          accessor: 'getWidth',
          defaultValue: 1
        }
      });
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;

      _get(_getPrototypeOf(BarLayer.prototype), "updateState", this).call(this, {
        props,
        oldProps,
        changeFlags
      });

      if (changeFlags.extensionsChanged) {
        var gl = this.context.gl;

        if (this.state.model) {
          this.state.model.delete();
        }

        this.setState({
          model: this._getModel(gl)
        });
      }
    }
  }, {
    key: "_getModel",
    value: function _getModel(gl) {
      var positions = [-.1, -1, 0.1, -1, -.1, 1, -.1, 1, 0.1, 1, 0.1, -1];
      return new _core2.Model(gl, Object.assign(this.getShaders(), {
        id: this.props.id,
        geometry: new _core2.Geometry({
          drawMode: _constants.default.TRIANGLE_STRIP,
          vertexCount: 6,
          attributes: {
            positions: {
              size: 2,
              value: new Float32Array(positions)
            }
          }
        }),
        isInstanced: true
      }));
    }
  }]);

  return BarLayer;
}(_core.Layer);

exports.default = BarLayer;
BarLayer.layerName = 'BarLayer';
BarLayer.defaultProps = defaultProps;