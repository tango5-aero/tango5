import { Layer, Source, useMap } from 'react-map-gl';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { Flight } from '~/models/flight';
import { featureCollection as featureCollection } from '~/models/geojson';
import { FlightLayersTypes } from '~/constants';
import type { FeatureCollection } from 'geojson';

const LayersIds = {
    leadVector: 'flights-lead-vector',
    labelAnchor: 'flight-label-anchor',
    halo: 'flight-halo',
    positionFill: 'flight-position-fill',
    positionBorder: 'flight-position-border',
    trailsBorder: 'flight-trails-border',
    trajectoryFill: 'flight-trajectory-fill',
    labelsFill: 'flight-labels-fill',
    labelsText: 'flight-labels-text'
} as const;

const Layers = ({ flights, view }: PropsWithChildren<{ flights: Flight[]; view: { longitude: number; latitude: number; zoom: number } }>) => {
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
            <Layer id={LayersIds.leadVector} type="line" paint={{ 'line-color': '#FFFFFF' }} filter={['==', ['get', 'type'], FlightLayersTypes.flightSpeed]} />
            <Layer id={LayersIds.labelAnchor} type="line" paint={{ 'line-color': '#FFFFFF', 'line-opacity': 0.3 }} filter={['==', ['get', 'type'], FlightLayersTypes.labelLink]} />
            <Layer id={LayersIds.halo} type="line" paint={{ 'line-color': '#FFFFFF' }} filter={['==', ['get', 'type'], FlightLayersTypes.halo]} />
            <Layer id={LayersIds.positionFill} type="fill" paint={{ 'fill-color': '#FFFFFF' }} filter={['==', ['get', 'type'], FlightLayersTypes.flightPosition]} />
            <Layer id={LayersIds.positionBorder} type="line" paint={{ 'line-color': '#FFFFFF' }} filter={['==', ['get', 'type'], FlightLayersTypes.flightPosition]} />
            <Layer id={LayersIds.trailsBorder} type="line" paint={{ 'line-color': '#FFFFFF' }} filter={['==', ['get', 'type'], FlightLayersTypes.flightTrail]} />
            <Layer id={LayersIds.trajectoryFill} type="fill" paint={{ 'fill-color': '#FFFFFF' }} filter={['==', ['get', 'type'], FlightLayersTypes.flightTrajectory]} />
            <Layer id={LayersIds.labelsFill} type="fill" paint={{ 'fill-opacity': 0.3 }} filter={['==', ['get', 'type'], FlightLayersTypes.flightLabel]} />
            <Layer
                id={LayersIds.labelsText}
                type="symbol"
                filter={['==', ['get', 'type'], FlightLayersTypes.flightLabelText]}
                layout={{
                    // 'text-font': ['B612 Regular'],
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

export { Layers, LayersIds };
