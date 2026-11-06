import App from './App';
import { renderLayers } from './deckgl-layers';
jest.mock('react-map-gl', () => ({ StaticMap: () => null }));
jest.mock('deck.gl', () => () => null);
jest.mock('./taxi', () => []);
jest.mock('./charts', () => () => null);
jest.mock('./deckgl-layers', () => ({ renderLayers: jest.fn(() => []) }));

test.each([[0, 12, 0], [null, 12, 12], [undefined, null, null], [6, 0, 6]])(
  'hover %s and selected %s pass hour %s to layers', (highlightedHour, selectedHour, expected) => {
    const app = new App({});
    app.state = { ...app.state, points: [{}], highlightedHour, selectedHour };
    app.render();
    expect(renderLayers).toHaveBeenLastCalledWith(expect.objectContaining({ hour: expected }));
  }
);
