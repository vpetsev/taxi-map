import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from "@deck.gl/layers"
import { HexagonLayer } from "@deck.gl/aggregation-layers";


const App = ({ data, viewport }) => {
    const layer = new HexagonLayer({
        HEXAGON_CONTROLS
    })
}

export const HEXAGON_CONTROLS = {
  showHexagon: {
    displayName: "Show Hexagon",
    type: "boolean",
    value: true,
  },
  radius: {
    displayName: "Hexagon Radius",
    type: "range",
    value: 250,
    step: 50,
    min: 50,
    max: 1000,
  },
  coverage: {
    displayName: "Hexagon Coverage",
    type: "range",
    value: 0.7,
    step: 0.1,
    min: 0,
    max: 1,
  },
  upperPercentile: {
    displayName: "Hexagon Upper Percentile",
    type: "range",
    value: 100,
    step: 0.1,
    min: 80,
    max: 100,
  },
  showScatterplot: {
    displayName: "Show Scatterplot",
    type: "boolean",
    value: true,
  },
  radiusScale: {
    displayName: "Scatterplot Radius",
    type: "range",
    value: 30,
    step: 10,
    min: 10,
    max: 200,
  },
};

// in RGB

const HEATMAP_COLORS = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [44, 127, 184],
  [37, 52, 148]
];

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];