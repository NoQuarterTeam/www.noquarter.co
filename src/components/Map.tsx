import MapBox, { Marker } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
export default function Map() {
  return (
    <div className="overflow-hidden h-[300px] w-full">
      <MapBox
        attributionControl={false}
        mapboxAccessToken="pk.eyJ1IjoiamNsYWNrZXR0IiwiYSI6ImNpdG9nZDUwNDAwMTMyb2xiZWp0MjAzbWQifQ.fpvZu03J3o5D8h6IMjcUvw"
        initialViewState={{ longitude: 4.8930095, latitude: 52.4030866, zoom: 14 }}
        style={{ width: "100%", height: 300 }}
        mapStyle="mapbox://styles/jclackett/ck44lf1f60a7j1cowkgjr6f3j"
      >
        <Marker longitude={4.8930095} latitude={52.4030866} anchor="bottom">
          <div
            style={{
              height: 10,
              width: 10,
              background: "#00F5D4",
              border: "2px solid",
              borderColor: "#01C7AC",
              borderRadius: 1000,
            }}
          />
        </Marker>
      </MapBox>
    </div>
  )
}
