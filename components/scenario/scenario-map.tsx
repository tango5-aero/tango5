'use client';

import { useState, useEffect, type PropsWithChildren, CSSProperties, PropsWithoutRef } from 'react';
import MapGL, { MapProvider, Layer, Source, useMap } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';
import { featureCollection as featureCollection } from '~/lib/domain/geojson';
import { Scenario } from '~/lib/domain/scenario';
import { MapEvent, MapMouseEvent, MapSourceDataEvent } from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import { destination, point, Units } from '@turf/turf';
import { BBox } from '~/lib/domain/geometry';
import { MAP_SOURCE_ID } from '~/lib/constants';

type ScenarioMapProps = {
    style?: CSSProperties;
    scenario: Scenario;
    selectFlight: (id: string) => void;
    selectedFlight: string | null;
    selectedPairs: [string, string][];
    isGameOver: boolean;
    onMapReady: () => void;
};

const ScenarioMap = (props: PropsWithChildren<ScenarioMapProps>) => {
    const [zoom, setZoom] = useState<number | undefined>(undefined);

    const onClick = (e: MapMouseEvent) => {
        const id = e.features?.at(0)?.properties?.ref;
        if (id) props.selectFlight(id);
    };

    const onMouseEnter = (e: MapEvent) => {
        e.target.getCanvas().style.cursor = 'pointer';
    };

    const onMouseLeave = (e: MapEvent) => {
        e.target.getCanvas().style.cursor = '';
    };

    const scaledBoundaries = scaleBbox(props.scenario.boundaries);
    const onSourceData = (e: MapSourceDataEvent) => {
        if (e.sourceId !== MAP_SOURCE_ID) return;
        if (!e.isSourceLoaded) return;
        if (e.source?.type !== 'geojson') return;

        const haveFeatures =
            typeof e.source.data !== 'string' && (e.source.data as FeatureCollection).features?.length > 0;

        if (haveFeatures) {
            props.onMapReady();
        }
    };

    return (
        <MapProvider>
            <ScaleMap latitude={props.scenario.boundaries[3]} />
            <MapGL
                id="map"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                initialViewState={{ bounds: scaledBoundaries }}
                style={props.style}
                mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
                interactive={false}
                fadeDuration={0}
                interactiveLayerIds={[LayersIds.positionFill, LayersIds.labelFill]}
                onLoad={(e) => setZoom(e.target.getZoom())}
                onZoomEnd={(e) => setZoom(e.viewState.zoom)}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                onSourceData={onSourceData}>
                <ResizeEffects bounds={props.scenario.boundaries} />
                <Layers
                    zoom={zoom}
                    scenario={props.scenario}
                    selectedFlight={props.selectedFlight}
                    selectedPairs={props.selectedPairs}
                    isGameOver={props.isGameOver}
                />
            </MapGL>
        </MapProvider>
    );
};

const ScaleMap = (props: PropsWithoutRef<{ latitude: number }>) => {
    const { map: mapRef } = useMap();
    const [width, setWidth] = useState(0);

    const zoom = mapRef?.getMap().getZoom();

    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) return;

        const coords1 = [0, props.latitude] as [number, number];
        const point1 = point(coords1);
        const distance = 5;
        const bearing = 90;
        const options: {
            units?: Units;
        } = { units: 'nauticalmiles' };

        const point2 = destination(point1, distance, bearing, options);

        const proj1 = map.project(coords1);
        const proj2 = map.project([point2.geometry.coordinates[0], point2.geometry.coordinates[1]]);

        const distanceInPixels = Math.round(Math.abs(proj1.x - proj2.x));

        setWidth(distanceInPixels);
    }, [props.latitude, mapRef, zoom]);

    if (!mapRef) return;

    return (
        <div className={`fixed left-60 top-7 z-30`} style={{ width: `${width}px` }}>
            <div className="text-center text-sm text-secondary dark:text-primary">5NM</div>
            <div className="h-[5px] w-full border-b-[1px] border-l-[1px] border-r-[1px] dark:border-primary"></div>
            <div className="h-1 w-full border-l-[1px] border-r-[1px] dark:border-primary"></div>
        </div>
    );
};

const ResizeEffects = (props: PropsWithoutRef<{ bounds: number[] }>) => {
    const { map: mapRef } = useMap();

    useEffect(() => {
        const map = mapRef?.getMap();

        if (map) {
            const fitBounds = () => map.fitBounds(props.bounds as [number, number, number, number]);
            const resize = () => map.resize.bind(map);

            window.addEventListener('resize', fitBounds);
            window.addEventListener('resize', resize);

            return () => {
                window.removeEventListener('resize', fitBounds);
                window.removeEventListener('resize', resize);
            };
        }
    }, [mapRef, props.bounds]);

    return null;
};

type LayerProps = {
    zoom?: number;
    scenario: Scenario;
    selectedFlight: string | null;
    selectedPairs: [string, string][];
    isGameOver: boolean;
};

const Layers = (props: PropsWithChildren<LayerProps>) => {
    const { map: mapRef } = useMap();

    const [collection, setCollection] = useState<FeatureCollection>({ type: 'FeatureCollection', features: [] });

    useEffect(() => {
        const map = mapRef?.getMap();

        if (!map || !props.zoom) return;

        const project = ([lng, lat]: [number, number]) => {
            const point = map.project([lng, lat]);
            return [point.x, point.y] as [number, number];
        };

        const unproject = ([x, y]: [number, number]) => {
            const point = map.unproject([x, y]);
            return [point.lng, point.lat] as [number, number];
        };

        const scalingFactor = props.zoom ** 2.1;

        const computedCollection = featureCollection(
            props.scenario,
            props.selectedFlight,
            props.selectedPairs,
            props.isGameOver,
            scalingFactor,
            project,
            unproject
        );

        setCollection(computedCollection);
    }, [props.scenario, props.zoom, mapRef, props.selectedFlight, props.selectedPairs, props.isGameOver]);

    return (
        <Source id={MAP_SOURCE_ID} type="geojson" data={collection}>
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
                id={LayersIds.pcdLine}
                type="line"
                paint={{
                    'line-color': [
                        'match',
                        ['get', 'status'],
                        'conflict',
                        '#D45D08',
                        'monitor',
                        '#D45D08',
                        'clear',
                        '#456C0F',
                        '#456C0F'
                    ]
                }}
                filter={['==', ['get', 'type'], GeometryTypes.pcdLink]}
                beforeId={LayersIds.positionFill}
            />
            <Layer
                id={LayersIds.pcdLabelFill}
                type="fill"
                paint={{
                    'fill-opacity': 1,
                    'fill-color': [
                        'match',
                        ['get', 'status'],
                        'conflict',
                        '#D45D08',
                        'monitor',
                        '#D45D08',
                        'clear',
                        '#456C0F',
                        '#456C0F'
                    ]
                }}
                filter={['==', ['get', 'type'], GeometryTypes.pcdLabel]}
            />
            <Layer
                id={LayersIds.pcdLabelText}
                type="symbol"
                filter={['==', ['get', 'type'], GeometryTypes.pcdText]}
                layout={{
                    'text-field': [
                        'format',
                        ['get', 'statusText'],
                        { 'text-font': ['Barlow Bold'] },
                        '\n',
                        {},
                        ['get', 'text'],
                        { 'text-font': ['Barlow Regular'] }
                    ],
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                    'text-justify': 'left',
                    'text-size': ['get', 'fontSize'],
                    'text-rotation-alignment': 'viewport'
                }}
                paint={{
                    'text-color': [
                        'match',
                        ['get', 'status'],
                        'conflict',
                        '#13151A',
                        'monitor',
                        '#13151A',
                        'clear',
                        '#C9CDD0',
                        '#C9CDD0'
                    ]
                }}
            />
            <Layer
                id={LayersIds.labelFill}
                type="fill"
                paint={{ 'fill-opacity': 0 }}
                filter={['==', ['get', 'type'], GeometryTypes.label]}
            />
            <Layer
                id={LayersIds.labelText}
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
    halo: 'halo',
    position: 'position',
    pcdLabel: 'pcd-label',
    pcdText: 'pcd-text',
    pcdLink: 'pcd-link',
    label: 'label',
    labelText: 'label-text',
    labelLink: 'label-link'
} as const;

const LayersIds = {
    positionFill: 'position-fill',
    positionBorder: 'position-border',
    leadVector: 'lead-vector',
    halo: 'halo',
    pcdLabelText: 'pcd-label-text',
    pcdLabelFill: 'pcd-label-fill',
    pcdLine: 'pcd-line',
    labelFill: 'labels-fill',
    labelText: 'labels-text',
    labelAnchor: 'label-anchor'
} as const;

const scaleBbox = (boundaries: BBox): BBox => {
    const estimatedPaddingX = 0.5;
    const estimatedPaddingY = 0.7;

    return [
        boundaries[0] - estimatedPaddingX,
        boundaries[1] - estimatedPaddingY,
        boundaries[2] + estimatedPaddingX,
        boundaries[3] + estimatedPaddingY
    ];
};

export { ScenarioMap, GeometryTypes };
