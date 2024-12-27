import { Feature, FeatureCollection, Polygon } from 'geojson';
import { Fragment, FunctionComponent, useState } from 'react';
import { Layer, Source } from 'react-map-gl';

type VSTATUS = 'climbing' | 'descending' | 'cruising' | 'unknown';

interface FlightText {
    callsign?: string;
    alt?: number;
    verticalStatus?: VSTATUS;
    gs?: number;
    selectedAlt?: number;
    nextPoint?: string;
    id: string;
    isSelected?: boolean;
    isNct?: boolean;
    isShadowed?: boolean;
}

interface PcdText {
    id: string;
    currentDist?: number;
    epoch: number;
    segEpoch?: number;
    segDist?: number;
    mode?: string;
}

const FLIGHT_LABEL_SIZE = { height: 300, width: 300 };
const PCD_LABEL_SIZE = { height: 120, width: 240 };

const leadingZero = (num: number) => num.toFixed(0).padStart(2, '0');

const verticalStatusChar = (status: VSTATUS | undefined) => {
    switch (status) {
        case 'climbing':
            return '↑';
        case 'descending':
            return '↓';
        default:
            return ' ';
    }
};

const writeFlightOnCanvas = (canvas: HTMLCanvasElement, flight: FlightText) => {
    const context = canvas.getContext('2d');

    if (context === null) {
        return canvas;
    }

    const { callsign = '', alt, verticalStatus, gs, selectedAlt, nextPoint = '', isSelected, isNct, isShadowed } = flight;

    const selFL = selectedAlt ? (selectedAlt / 100).toFixed(0).padStart(3, '0') : '';
    const actFL = alt ? (alt / 100).toFixed(0).padStart(3, '0') : '';
    const actGS = gs ? (gs / 10).toFixed(0) : '';

    const next = nextPoint !== null ? nextPoint : '';

    const vstatus = verticalStatusChar(verticalStatus);

    context.font = '60px B612';
    context.fillStyle = isShadowed ? '#ffffff32' : isNct ? 'hsl(88, 27%, 46%)' : '#ffffff';
    context.fillText(callsign, 10, 60);
    context.fillText(`${actFL}${vstatus}${selFL}`, 10, 160);
    context.fillText(`${actGS} ${next}`, 10, 260);

    if (isSelected) {
        context.fillStyle = 'rgba(233,247,252, 0.1)';
        context.fillRect(0, 0, FLIGHT_LABEL_SIZE.width, FLIGHT_LABEL_SIZE.height);
    }

    return canvas;
};

const writePcdOnCanvas = (canvas: HTMLCanvasElement, pcd: PcdText) => {
    const context = canvas.getContext('2d');

    if (context === null) {
        return canvas;
    }

    const { segDist, segEpoch, currentDist, epoch } = pcd;

    const timeToPCD = segEpoch && (segEpoch - epoch) / 1000;

    const minutesToPCD = timeToPCD ? Math.floor(timeToPCD / 60).toFixed(0) : '--';
    const secondsToPCD = timeToPCD ? leadingZero(timeToPCD % 60) : '--';

    const segDistNM = segDist ? segDist?.toFixed(0) : '--';

    const timeToPCDText = timeToPCD !== undefined && timeToPCD > 0 ? `${segDistNM}NM ${minutesToPCD}:${secondsToPCD}` : 'NC';

    context.font = '35px B612';
    context.fillStyle = 'hsl(25, 93%, 43%)';
    context.fillText(currentDist ? `${currentDist.toFixed(0)}NM` : '--', 10, 45);
    context.fillText(timeToPCDText, 10, 90);

    return canvas;
};

const Label: FunctionComponent<{ label: Feature }> = ({ label }) => {
    const [canvas] = useState<HTMLCanvasElement>(document.createElement('canvas'));

    if (label.properties?.type !== 'flightLabel' && label.properties?.type !== 'pcdLabel') {
        return null;
    }

    const type = label.properties?.type as string;

    const id = label.properties?.id as string;

    const geometry = label.geometry as Polygon;
    const coordinates = geometry.coordinates[0];

    if (coordinates === undefined) return null;

    switch (type) {
        case 'flightLabel': {
            canvas.height = FLIGHT_LABEL_SIZE.height;
            canvas.width = FLIGHT_LABEL_SIZE.width;

            writeFlightOnCanvas(canvas, label.properties as FlightText);

            break;
        }
        case 'pcdLabel': {
            canvas.height = PCD_LABEL_SIZE.height;
            canvas.width = PCD_LABEL_SIZE.width;

            writePcdOnCanvas(canvas, label.properties as PcdText);

            break;
        }
        default:
            return null;
    }
    return (
        <Source id={id} key={id} type="canvas" coordinates={coordinates.slice(0, 4)} animate={true} canvas={canvas}>
            <Layer id={id} type="raster" paint={{ 'raster-fade-duration': 0 }} />
        </Source>
    );
};

const Labels: FunctionComponent<{ labels: FeatureCollection }> = ({ labels }) => {
    return (
        <Fragment>
            {labels.features.map((label) => {
                if (label.properties?.type !== 'flightLabel' && label.properties?.type !== 'pcdLabel') {
                    return null;
                }
                return <Label label={label} key={label.properties?.id} />;
            })}
        </Fragment>
    );
};

export { Labels };
