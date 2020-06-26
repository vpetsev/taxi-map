import React, { Component } from 'react';
import { ScatterplotLayer } from "@deck.gl/layers"
import { mapStylePicker, layerControl } from "./Style"
import { HexagonLayer } from "@deck.gl/aggregation-layers";


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

export const SCATTERPLOT_CONTROLS = {
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

const MAPBOX_DEFAULT_MAPSTYLES = [
  { label: "Streets V10", value: "mapbox://styles/mapbox/streets-v10" },
  { label: "Outdoors V10", value: "mapbox://styles/mapbox/outdoors-v10" },
  { label: "Light V9", value: "mapbox://styles/mapbox/light-v9" },
  { label: "Dark V9", value: "mapbox://styles/mapbox/dark-v9" },
  { label: "Satellite V9", value: "mapbox://styles/mapbox/satellite-v9" },
  {
    label: "Satellite Streets V10",
    value: "mapbox://styles/mapbox/satellite-streets-v10",
  },
  {
    label: "Navigation Preview Day V4",
    value: "mapbox://styles/mapbox/navigation-preview-day-v4",
  },
  {
    label: "Navitation Preview Night V4",
    value: "mapbox://styles/mapbox/navigation-preview-night-v4",
  },
  {
    label: "Navigation Guidance Day V4",
    value: "mapbox://styles/mapbox/navigation-guidance-day-v4",
  },
  {
    label: "Navigation Guidance Night V4",
    value: "mapbox://styles/mapbox/navigation-guidance-night-v4",
  },
];

export function MapStylePicker({ currentStyle, onStyleChange }) {
  return (
    <select
      className="map-style-picker"
      style={mapStylePicker}
      value={currentStyle}
      onChange={(e) => onStyleChange(e.target.value)}
    >
      {MAPBOX_DEFAULT_MAPSTYLES.map((style) => (
        <option key={style.value} value={style.value}>
          {style.label}
        </option>
      ))}
    </select>
  );
}

export class LayerControls extends Component {
  _onValueChange(settingName, newValue) {
    const { settings } = this.props;
    // Only update if we have a confirmed change
    if (settings[settingName] !== newValue) {
      // Create a new object so that shallow-equal detects a change
      const newSettings = {
        ...this.props.settings,
        [settingName]: newValue,
      };

      this.props.onChange(newSettings);
    }
  }

  render() {
    const { title, settings, propTypes = {} } = this.props;

    return (
      <div className="layer-controls" style={layerControl}>
        {title && <h4>{title}</h4>}
        {Object.keys(settings).map((key) => (
          <div key={key}>
            <label>{propTypes[key].displayName}</label>
            <div style={{ display: "inline-block", float: "right" }}>
              {settings[key]}
            </div>
            <Setting
              settingName={key}
              value={settings[key]}
              propType={propTypes[key]}
              onChange={this._onValueChange.bind(this)}
            />
          </div>
        ))}
      </div>
    );
  }
}

const Setting = (props) => {
  const { propType } = props;
  if (propType && propType.type) {
    switch (propType.type) {
      case "range":
        return <Slider {...props} />;

      case "boolean":
        return <Checkbox {...props} />;
      default:
        return <input {...props} />;
    }
  }
};

const Checkbox = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className="input-group">
        <input
          type="checkbox"
          id={settingName}
          checked={value}
          onChange={(e) => onChange(settingName, e.target.checked)}
        />
      </div>
    </div>
  );
};

const Slider = ({ settingName, value, propType, onChange }) => {
  const { max = 100 } = propType;

  return (
    <div key={settingName}>
      <div className="input-group">
        <div>
          <input
            type="range"
            id={settingName}
            min={0}
            max={max}
            step={max / 100}
            value={value}
            onChange={(e) => onChange(settingName, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

// Rendering the layer
const PICKUP_COLOR = [114, 19, 108];
const DROPOFF_COLOR = [243, 185, 72];

export function renderLayers(props) {
  const { data, onHover, settings } = props;
  return [
    settings.showScatterplot &&
      new ScatterplotLayer({
        id: "scatterplot",
        getPosition: (d) => d.position,
        getColor: (d) => (d.pickup ? PICKUP_COLOR : DROPOFF_COLOR),
        getRadius: (d) => 5,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        data,
        onHover,
        ...settings,
      }),
    settings.showHexagon &&
      new HexagonLayer({
        id: "heatmap",
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: (d) => d.position,
        lightSettings: LIGHT_SETTINGS,
        opacity: 0.8,
        pickable: true,
        data,
        onHover,
        ...settings,
      }),
  ];
}