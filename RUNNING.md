# Run locally

Use Node 22. Install with `npm ci --legacy-peer-deps`, then run `NODE_OPTIONS=--openssl-legacy-provider npm start`. Build with `NODE_OPTIONS=--openssl-legacy-provider npm run build`.

The bundled taxi points work without external credentials. For a Mapbox basemap, set your own public client token before starting/building: `export REACT_APP_MAPBOX_ACCESS_TOKEN="your-public-token"`. This variable is intentionally public in the client bundle; never use a private service secret here. The previously committed public token was removed from source and remains in Git history; its owner can replace or revoke it through Mapbox.

Run regression coverage with `CI=true npm test -- --watchAll=false --runInBand`.
