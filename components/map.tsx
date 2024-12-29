'use client';

import MapGL, { MapProvider } from 'react-map-gl';
import { Layer, Source } from 'react-map-gl';
import data from '~/data/sample_us.json';
import { Feature, Polygon } from 'geojson';
import { PropsWithChildren, useEffect, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import '~/styles/globals.sass';

const Label = ({ feature }: PropsWithChildren<{ feature: Feature }>) => {
    const [canvas] = useState<HTMLCanvasElement>(document.createElement('canvas'));

    const id = feature.properties?.id as string;
    const geometry = feature.geometry as Polygon;
    const coordinates = geometry.coordinates[0];

    canvas.height = 300;
    canvas.width = 300;

    useEffect(() => {
        const selFL = feature.properties?.selectedAlt ? (feature.properties.selectedAlt / 100).toFixed(0).padStart(3, '0') : '';
        const actFL = feature.properties?.alt ? (feature.properties.alt / 100).toFixed(0).padStart(3, '0') : '';
        const actGS = feature.properties?.gs ? (feature.properties.gs / 10).toFixed(0) : '';

        const next = feature.properties?.nextPoint ? feature.properties.nextPoint : '';

        let vstatus = ' ';

        switch (feature.properties?.verticalStatus) {
            case 'climbing':
                vstatus = '↑';
                break;
            case 'descending':
                vstatus = '↓';
        }

        const context = canvas.getContext('2d')!;

        context.font = '60px B612';
        context.fillStyle = '#ffffff';
        context.fillText(feature.properties?.callsign ?? '', 10, 60);
        context.fillText(`${actFL}${vstatus}${selFL}`, 10, 160);
        context.fillText(`${actGS} ${next}`, 10, 260);
    }, [canvas, feature.properties]);

    return (
        <Source id={id} key={id} type="canvas" coordinates={coordinates.slice(0, 4)} animate={true} canvas={canvas}>
            <Layer id={id} type="raster" paint={{ 'raster-fade-duration': 0 }} />
        </Source>
    );
};

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
                <Source id="flights" type="geojson" data={data}>
                    <Layer id="positions-borders" type="line" paint={{ 'line-color': 'hsl(0, 0%, 100%)' }} filter={['==', ['get', 'type'], 'flightPosition']} />
                    <Layer id="positions-inside" type="fill" paint={{ 'fill-color': '#242c36' }} filter={['==', ['get', 'type'], 'flightPosition']} beforeId="positions-borders" />
                    <Layer
                        id="speeds"
                        type="line"
                        paint={{
                            'line-color': 'hsl(0, 0%, 100%)'
                        }}
                        filter={['==', ['get', 'type'], 'flightSpeed']}
                        beforeId="positions-inside"
                    />
                </Source>
                {data.features
                    .filter((label) => label.properties?.type === 'flightLabel')
                    .map((label) => (
                        <Label feature={label as Feature} key={label.properties?.id} />
                    ))}
            </MapGL>
        </MapProvider>
    );
};

export { Map };
