import { Feature, FeatureCollection, Polygon } from 'geojson';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { Layer, Source } from 'react-map-gl';

const Label: FunctionComponent<{ label: Feature }> = ({ label }) => {
    const [canvas] = useState<HTMLCanvasElement>(document.createElement('canvas'));

    const id = label.properties?.id as string;
    const geometry = label.geometry as Polygon;
    const coordinates = geometry.coordinates[0];

    canvas.height = 300;
    canvas.width = 300;

    useEffect(() => {
        const selFL = label.properties?.selectedAlt ? (label.properties.selectedAlt / 100).toFixed(0).padStart(3, '0') : '';
        const actFL = label.properties?.alt ? (label.properties.alt / 100).toFixed(0).padStart(3, '0') : '';
        const actGS = label.properties?.gs ? (label.properties.gs / 10).toFixed(0) : '';

        const next = label.properties?.nextPoint ? label.properties.nextPoint : '';

        let vstatus = ' ';

        switch (label.properties?.verticalStatus) {
            case 'climbing':
                vstatus = '↑';
                break;
            case 'descending':
                vstatus = '↓';
        }

        const context = canvas.getContext('2d')!;

        context.font = '60px B612';
        context.fillStyle = '#ffffff';
        context.fillText(label.properties?.callsign ?? '', 10, 60);
        context.fillText(`${actFL}${vstatus}${selFL}`, 10, 160);
        context.fillText(`${actGS} ${next}`, 10, 260);
    }, [canvas, label.properties]);

    return (
        <Source id={id} key={id} type="canvas" coordinates={coordinates.slice(0, 4)} animate={true} canvas={canvas}>
            <Layer id={id} type="raster" paint={{ 'raster-fade-duration': 0 }} />
        </Source>
    );
};

const Labels: FunctionComponent<{ labels: FeatureCollection }> = ({ labels }) => {
    return (
        <Fragment>
            {labels.features
                .filter((label) => label.properties?.type === 'flightLabel')
                .map((label) => (
                    <Label label={label} key={label.properties?.id} />
                ))}
        </Fragment>
    );
};

export { Labels };
