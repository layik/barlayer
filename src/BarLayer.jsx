import {Layer, project32, picking} from '@deck.gl/core';
import GL from '@luma.gl/constants';
import {Model, Geometry} from '@luma.gl/core';

const vs = `
  attribute vec3 positions;
  attribute vec3 instancePositions;
  attribute vec3 instancePositions64Low;
  attribute vec4 instanceColors;
  attribute float instanceScale;
  attribute float instanceRotationAngle;
  attribute float instanceWidth;
  // for onHover to work must
  // delcare instancePickingColors here and assign it to
  // geometry.pickingColor
  // and then register DECKGL_FILTER_COLOR hook in
  // fragment shader
  attribute vec3 instancePickingColors;

  varying vec4 vColor;
  varying vec2 vPosition;

  vec2 rotate_by_angle(vec2 vertex, float angle) {
    float angle_radian = angle * PI / 180.0;
    float cos_angle = cos(angle_radian);
    float sin_angle = sin(angle_radian);
    mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
    return rotationMatrix * vertex;
  }

  void main(void) {
    geometry.pickingColor = instancePickingColors;
    // layer adopted from circle and default radius was 30
    vec3 offsetCommon = positions * project_size(30.0);
    offsetCommon = vec3(rotate_by_angle(offsetCommon.xy, instanceRotationAngle), 0);
    offsetCommon.x = offsetCommon.x * instanceWidth;
    // width first
    offsetCommon = offsetCommon * instanceScale;
    
    vec3 positionCommon = project_position(instancePositions, instancePositions64Low);
    // missx: So in your shader, positionCommon is the anchor position on the map. 
    // offsetCommon is the local coordinate relative to the anchor
    // You want to leave the anchor alone and rotate the offset

    gl_Position = project_common_position_to_clipspace(vec4(positionCommon + offsetCommon, 1.0));

    vPosition = positions.xy;
    vColor = instanceColors;
    DECKGL_FILTER_COLOR(vColor, geometry);

  }`;

  const fs = `
  precision highp float;

  varying vec4 vColor;
  varying vec2 vPositionn;

  void main(void) {    

    gl_FragColor = vec4(vColor.rgb, vColor.a);
    DECKGL_FILTER_COLOR(gl_FragColor, geometry);
  }`;
  
  const defaultProps = {
  // Center of each bar, in [longitude, latitude, (z)]
  getPosition: {type: 'accessor', value: x => x.position},
  // Color of each bar, in [R, G, B, (A)]
  getColor: {type: 'accessor', value: [0, 0, 0, 255]},
  // Amount to scale bottom of bar
  getScale: {type: 'accessor', value: 1},
  // Amount to rotate bar with
  getRotationAngle: {type: 'accessor', value: 1},
  // Amount to thicken the bar with
  getWidth: {type: 'accessor', value: 1},
};

export default class BarLayer extends Layer {
  // getPickingInfo(params) {
  //   const info = super.getPickingInfo(params);
  //   const {index} = info;
  //   const {data} = this.props;

  //   if (data[0] && data[0].__source) {
  //     // data is wrapped
  //     info.object = data.find(d => d.__source.index === index);
  //   }
  //   // console.log(info);
    
  //   return info;
  // }
  
  getShaders() {
    return super.getShaders({vs, fs, modules: [project32, picking]});
  }

  initializeState() {
    this.getAttributeManager().addInstanced({
      instancePositions: {
        size: 3,
        type: GL.DOUBLE,
        accessor: 'getPosition'
      },
      instanceColors: {
        size: 4,
        type: GL.UNSIGNED_BYTE,
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
    })
  }
  updateState({props, oldProps, changeFlags}) {
    super.updateState({props, oldProps, changeFlags});
    
    if (changeFlags.extensionsChanged) {
      const {gl} = this.context;
      if (this.state.model) {
        this.state.model.delete();
      }
      this.setState({model: this._getModel(gl)});
    }
  }

  _getModel(gl) {
    const positions = [
      -.1, -1, 
      0.1, -1,
      -.1, 1,
      -.1, 1,
      0.1, 1,
      0.1, -1,
    ];
    return new Model(
      gl,
      Object.assign(this.getShaders(), {
        id: this.props.id,
        geometry: new Geometry({
          drawMode: GL.TRIANGLE_STRIP,
          vertexCount: 6,
          attributes: {
            positions: {size: 2, value: new Float32Array(positions)}
          }
        }),
        isInstanced: true
      })
    );
  }
}

BarLayer.layerName = 'BarLayer';
BarLayer.defaultProps = defaultProps;