'use client';

import MapGL, { MapProvider } from 'react-map-gl';
import { Flights } from './flights';

import 'mapbox-gl/dist/mapbox-gl.css';
import '~/styles/globals.sass';

const Map = () => {
    return (
        <MapProvider>
            <MapGL
                id="map"
                mapboxAccessToken="pk.eyJ1Ijoic2FtdWVsLWNyaXN0b2JhbCIsImEiOiJja3Y2bHBnNnAwaHhzMnFrOTNoM3U1ZzAyIn0.FokOBQmMj65P1V3qb6zd-w"
                initialViewState={{
                    longitude: -76.96729,
                    latitude: 35.78202,
                    zoom: 7
                }}
                maxBounds={[-85.5, 24.18, -67.8, 46.3]}
                style={{ width: '100%', height: '100dvh' }}
                mapStyle="mapbox://styles/samuel-cristobal/cl9zn67ak006k15phkih6malq">
                <Flights />
            </MapGL>
        </MapProvider>
    );
};

export { Map };
