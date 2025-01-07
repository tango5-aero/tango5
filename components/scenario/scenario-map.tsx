'use client';

import { useState, useEffect, type PropsWithChildren, CSSProperties } from 'react';
import MapGL, { MapProvider, Layer, Source, useMap } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';
import { Flight } from '~/lib/domain/flight';
import { featureCollection as featureCollection } from '~/lib/domain/geojson';
import { Scenario, View } from '~/lib/domain/scenario';

import 'mapbox-gl/dist/mapbox-gl.css';
import { MapEvent, MapMouseEvent } from 'mapbox-gl';

const onLoad = (e: MapEvent) => {
    if (window) window.addEventListener('resize', () => e.target.resize());
    e.target.touchZoomRotate.disableRotation();
};

const onRemove = (e: MapEvent) => {
    if (window) window.removeEventListener('resize', () => e.target.resize());
};

const onMouseEnter = (e: MapEvent) => {
    e.target.getCanvas().style.cursor = 'pointer';
};
const onMouseLeave = (e: MapEvent) => {
    e.target.getCanvas().style.cursor = '';
};

const ScenarioMap = (props: PropsWithChildren<{ style?: CSSProperties; scenario: Scenario }>) => {
    const [view, setView] = useState(props.scenario.view);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const flights = props.scenario.flights.map(
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

    const onClick = (e: MapMouseEvent) => {
        const id = e.features?.at(0)?.properties?.ref;
        if (!id) return;

        const flight = flights.find((flight) => flight.id === id);
        if (!flight) return;

        setSelectedIds((selectedIds) => {
            if (selectedIds.includes(flight.id)) {
                return selectedIds.filter((id) => id !== flight.id);
            } else {
                return [...selectedIds, flight.id];
            }
        });
    };

    return (
        <MapProvider>
            <MapGL
                {...view}
                id="map"
                onMove={(evt) => setView(evt.viewState)}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                maxBounds={props.scenario.boundaries as [number, number, number, number]}
                style={props.style}
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
                interactiveLayerIds={[LayersIds.positionFill, LayersIds.labelsFill]}
                onLoad={onLoad}
                onRemove={onRemove}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}>
                <Layers flights={flights} selectedIds={selectedIds} view={view} />
            </MapGL>
        </MapProvider>
    );
};

const Layers = (props: PropsWithChildren<{ flights: Flight[]; selectedIds: string[]; view: View }>) => {
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

        const scalingFactor = props.view.zoom ** 2;

        const computedCollection = featureCollection(
            props.flights,
            props.selectedIds,
            scalingFactor,
            project,
            unproject
        );

        setCollection(computedCollection);
    }, [props.flights, mapRef, props.view.zoom, props.selectedIds]);

    return (
        <Source id="flights-source" type="geojson" data={collection}>
            <Layer
                id={LayersIds.leadVector}
                type="line"
                paint={{ 'line-color': '#FFFFFF' }}
                filter={['==', ['get', 'type'], GeometryTypes.speedVector]}
            />
            <Layer
                id={LayersIds.labelAnchor}
                type="line"
                paint={{ 'line-color': '#FFFFFF', 'line-opacity': 0.3 }}
                filter={['==', ['get', 'type'], GeometryTypes.labelLink]}
            />
            <Layer
                id={LayersIds.halo}
                type="line"
                paint={{ 'line-color': '#FFFFFF' }}
                filter={['==', ['get', 'type'], GeometryTypes.halo]}
            />
            <Layer
                id={LayersIds.positionFill}
                type="fill"
                paint={{ 'fill-color': '#FFFFFF' }}
                filter={['==', ['get', 'type'], GeometryTypes.position]}
            />
            <Layer
                id={LayersIds.positionBorder}
                type="line"
                paint={{ 'line-color': '#FFFFFF' }}
                filter={['==', ['get', 'type'], GeometryTypes.position]}
            />
            <Layer
                id={LayersIds.labelsFill}
                type="fill"
                paint={{ 'fill-opacity': 0 }}
                filter={['==', ['get', 'type'], GeometryTypes.label]}
            />
            <Layer
                id={LayersIds.labelsText}
                type="symbol"
                filter={['==', ['get', 'type'], GeometryTypes.labelText]}
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

const GeometryTypes = {
    speedVector: 'speed',
    labelLink: 'label-link',
    halo: 'halo',
    position: 'position',
    label: 'label',
    labelText: 'label-text'
} as const;

const LayersIds = {
    leadVector: 'lead-vector',
    halo: 'halo',
    positionFill: 'position-fill',
    positionBorder: 'position-border',
    trailsBorder: 'trails-border',
    trajectoryFill: 'trajectory-fill',
    labelsFill: 'labels-fill',
    labelsText: 'labels-text',
    labelAnchor: 'label-anchor'
} as const;

export { ScenarioMap, GeometryTypes };
