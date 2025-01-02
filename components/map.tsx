'use client';

import MapGL, { MapProvider } from 'react-map-gl';
import { Layers, LayersIds } from './layers';
import { Flight } from '~/models/flight';
import { useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import '~/styles/globals.sass';

// TODO: use dynamic data instead of static sample
import DATA from '~/data/sample_data.json';
import SCENARIO from '~/data/sample_scenario.json';

const flights = DATA.map(
    (item) =>
        new Flight(
            item.id,
            item.latitudeDeg,
            item.longitudeDeg,
            item.callsign,
            item.category,
            item.groundSpeedKts,
            item.trackDeg,
            item.altitudeFt,
            item.verticalSpeedFtpm,
            item.selectedAltitudeFt
        )
);
const default_view = SCENARIO.view;
const mapBoundaries = SCENARIO.boundaries;

const Map = () => {
    const [view, setView] = useState(default_view);

    return (
        <MapProvider>
            <MapGL
                {...view}
                id="map"
                onMove={(evt) => setView(evt.viewState)}
                mapboxAccessToken="pk.eyJ1Ijoic2FtdWVsLWNyaXN0b2JhbCIsImEiOiJja3Y2bHBnNnAwaHhzMnFrOTNoM3U1ZzAyIn0.FokOBQmMj65P1V3qb6zd-w"
                maxBounds={mapBoundaries as [number, number, number, number]}
                style={{ width: '100%', height: '100dvh' }}
                mapStyle="mapbox://styles/samuel-cristobal/cl9zn67ak006k15phkih6malq"
                interactive={true}
                maxPitch={0}
                minPitch={0}
                dragRotate={false}
                pitchWithRotate={false}
                touchPitch={false}
                touchZoomRotate={true}
                attributionControl={false}
                fadeDuration={0}
                interactiveLayerIds={[LayersIds.positionFill, LayersIds.labelsFill]}>
                <Layers flights={flights} view={view} />
            </MapGL>
        </MapProvider>
    );
};

export { Map };
