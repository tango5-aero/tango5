import { FeatureCollection } from 'geojson';
import { Fragment, FunctionComponent } from 'react';
import { Layer, Source } from 'react-map-gl';
import data from '@/data/sample_us.json';
import { Labels } from './labels';

const FlightsLayout: FunctionComponent<{ collection: FeatureCollection }> = ({ collection }) => (
    <Fragment>
        <Source id="flights" type="geojson" data={collection}>
            <Layer
                id="borders"
                type="line"
                paint={{
                    'line-color': [
                        'match',
                        ['get', 'type'],
                        'flightPosition',
                        ['case', ['boolean', ['get', 'isNct'], true], 'hsl(88, 27%, 46%)', 'hsl(0, 0%, 100%)'],
                        'hsla(0, 0%, 100%, 0)'
                    ]
                }}
            />
            <Layer
                id="fills"
                type="fill"
                paint={{
                    'fill-color': [
                        'match',
                        ['get', 'type'],
                        'flightPosition',
                        ['case', ['boolean', ['get', 'isPcdFirst'], true], 'hsl(25, 93%, 43%)', ['case', ['boolean', ['get', 'isNct'], true], 'hsl(88, 27%, 46%)', '#242c36']],
                        '#242c36'
                    ],
                    'fill-opacity': ['match', ['get', 'type'], 'flightPosition', 1, 0],
                    'fill-antialias': true
                }}
                beforeId="borders"
            />
            <Layer
                id="lines"
                type="line"
                paint={{
                    'line-color': [
                        'match',
                        ['get', 'type'],
                        ['STCA', 'forced', 'MTCD'],
                        'hsl(25, 93%, 43%)',
                        ['flightSpeed', 'flightPosition', 'labelLink'],
                        ['case', ['boolean', ['get', 'isNct'], true], 'hsl(88, 27%, 46%)', 'hsl(0, 0%, 100%)'],
                        'hsl(0, 0%, 100%)'
                    ],
                    'line-width': 1,
                    'line-opacity': ['match', ['get', 'type'], ['flightLabel', 'pcdLabel', 'forced', 'flightPosition'], 0, 'labelLink', 0.6, 'halo', 0.3, 1],
                    'line-dasharray': [1] // ['match', ['get', 'type'], 'forced', [10, 10], [1]]
                }}
                beforeId="fills"
            />
            {/** * this is a hack to overcome https://github.com/mapbox/mapbox-gl-js/issues/3045 * it should work
                with 2.3.0 but no luck * once fixed replace previous line and delete the dashedLines style */}
            <Layer
                id="dashedLines"
                type="line"
                paint={{
                    'line-color': ['match', ['get', 'type'], 'forced', 'hsl(25, 93%, 43%)', 'hsl(0, 0%, 100%)'],
                    'line-width': 1,
                    'line-opacity': ['match', ['get', 'type'], 'forced', 1, 0],
                    'line-dasharray': [2, 2]
                }}
                beforeId="fills"
            />
        </Source>
        <Labels labels={collection} />
    </Fragment>
);

const Flights = () => {
    return <FlightsLayout collection={data as FeatureCollection} />;
};

export { Flights };
