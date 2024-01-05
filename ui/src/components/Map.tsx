import { MapContainer, Tooltip, TileLayer, Polygon, Rectangle } from 'react-leaflet';
import { LatLng, LatLngBounds, LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';

import district_geojson from "../assets/districts.geojson.ts";

import { ReactElement } from 'react';



function Map() {
  const position: LatLngExpression = [27, 85];

  const boxes: ReactElement[] = []
  for (let feature of district_geojson["features"]) {
    let bbox = feature["properties"]["bbox"];
    let a = new LatLng(bbox[1], bbox[0]);
    let b = new LatLng(bbox[3], bbox[2]);
    let bounds = new LatLngBounds(a, b);

    boxes.push(
      <Rectangle bounds={bounds} />
    );
  }

  const polygons: ReactElement[] = [];
  for (let feature of district_geojson["features"]) {
    let polygon = feature["geometry"]["coordinates"];
    let id = feature["properties"]["title"];
    polygons.push(
      <Polygon positions={polygon.map((point) => new LatLng(point[1], point[0]))} color="black">
        <Tooltip sticky>{id}</Tooltip>
      </Polygon >
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=uPrrDjnAdV9b4IwBxAYXqQGM2g1gFfLcEhv80MlNx5rD3ILDYFmHNaptZhyfcLyx"
        />
        {...polygons}
        {...boxes}
      </MapContainer>
    </div>
  );
}


export default Map;
