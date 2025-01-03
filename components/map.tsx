'use client';

import { useState, useEffect, type PropsWithChildren } from 'react';
import MapGL, { MapProvider, Layer, Source, useMap } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';
import { Flight } from '~/lib/flight';
import { featureCollection as featureCollection } from '~/lib/geojson';

import 'mapbox-gl/dist/mapbox-gl.css';
import './map.sass';

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

const LayerTypes = {
    speedVector: 'speed',
    labelLink: 'label-link',
    halo: 'halo',
    position: 'position',
    label: 'label',
    labelText: 'label-text'
} as const;

const LayersIds = {
    leadVector: 'lead-vector',
    labelAnchor: 'label-anchor',
    halo: 'halo',
    positionFill: 'position-fill',
    positionBorder: 'position-border',
    trailsBorder: 'trails-border',
    trajectoryFill: 'trajectory-fill',
    labelsFill: 'labels-fill',
    labelsText: 'labels-text'
} as const;

type View = { longitude: number; latitude: number; zoom: number };

const Map = () => {
    const [view, setView] = useState<View>(default_view);

    return (
        <MapProvider>
            <MapGL
                {...view}
                id="map"
                onMove={(evt) => setView(evt.viewState)}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                maxBounds={mapBoundaries as [number, number, number, number]}
                style={{ width: '100%', height: '100dvh' }}
                mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
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

const Layers = ({ flights, view }: PropsWithChildren<{ flights: Flight[]; view: View }>) => {
    const { map: mapRef } = useMap();

    const [collection, setCollection] = useState<FeatureCollection>({ type: 'FeatureCollection', features: [] });

    useEffect(() => {
        const map = mapRef?.getMap();

        if (!map) return;

        const project = ([lng, lat]: [number, number]) => {
            const point = map.project([lng, lat]);
            return [point.x, point.y] as [number, number];
        };

        const unproject = ([x, y]: [number, number]) => {
            const point = map.unproject([x, y]);
            return [point.lng, point.lat] as [number, number];
        };

        setCollection(featureCollection(flights, view.zoom, project, unproject));
    }, [flights, mapRef, view.zoom]);

    return (
        <Source id="flights-source" type="geojson" data={collection}>
            <Layer
                id={LayersIds.leadVector}
                type="line"
                paint={{ 'line-color': '#FFFFFF' }}
                filter={['==', ['get', 'type'], LayerTypes.speedVector]}
            />
            <Layer
                id={LayersIds.labelAnchor}
                type="line"
                paint={{ 'line-color': '#FFFFFF', 'line-opacity': 0.3 }}
                filter={['==', ['get', 'type'], LayerTypes.labelLink]}
            />
            <Layer
                id={LayersIds.halo}
                type="line"
                paint={{ 'line-color': '#FFFFFF' }}
                filter={['==', ['get', 'type'], LayerTypes.halo]}
            />
            <Layer
                id={LayersIds.positionFill}
                type="fill"
                paint={{ 'fill-color': '#FFFFFF' }}
                filter={['==', ['get', 'type'], LayerTypes.position]}
            />
            <Layer
                id={LayersIds.positionBorder}
                type="line"
                paint={{ 'line-color': '#FFFFFF' }}
                filter={['==', ['get', 'type'], LayerTypes.position]}
            />
            <Layer
                id={LayersIds.labelsFill}
                type="fill"
                paint={{ 'fill-opacity': 0 }}
                filter={['==', ['get', 'type'], LayerTypes.label]}
            />
            <Layer
                id={LayersIds.labelsText}
                type="symbol"
                filter={['==', ['get', 'type'], LayerTypes.labelText]}
                layout={{
                    // TODO: upload fonts to MapBox studio
                    // 'text-font': ['DIN Pro Regular', 'B612 Regular','B612', 'JetBrains Mono', 'JetBrains Mono Regular', 'DIN Pro Regular'],
                    'text-field': ['get', 'text'],
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                    'text-justify': 'left',
                    'text-size': ['get', 'fontSize']
                }}
                paint={{ 'text-color': '#FFFFFF' }}
            />
        </Source>
    );
};

export { Map, LayerTypes };
