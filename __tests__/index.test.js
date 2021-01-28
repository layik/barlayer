import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import BarLayer from '../src/index';
import DeckGL from 'deck.gl';

const data = [{
  scale: 1, color: [255, 0, 0], angle: 10, width: 20, coordinates: [1, 1]
}, {
  scale: 1, color: [0, 255, 0], angle: 0, width: 5, coordinates: [1, 2]
}, {
  scale: 1, color: [0, 0, 255], angle: -10, width: 15, coordinates: [1, 3]
}];
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 51.96,
  zoom: 7,
};

const bar =
  new BarLayer({
    id: 'ridge-layer',
    data: data,
    getColor: d => d.color,
    getScale: d => d.scale,
    getRotationAngle: d => d.angle,
    getWidth: d => d.width,
    getPosition: d => d.coordinates,
  })

describe('barlayer', () => {
  test('snapshot renders', () => {
    const component = renderer.create(
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        layers={[
          bar
        ]} />);
  })
  test('renders', () => {
    const wrapper = mount(
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        layers={[
          bar
        ]} />
    );
    // expect(wrapper.find(Counter).length).toEqual(1);
  });
});
