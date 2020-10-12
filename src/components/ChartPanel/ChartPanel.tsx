import React, { useState, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

// import useWindowSize from '@rehooks/window-size';

import {
    isMobileSeletor,
    // updateIsNarrowSreen,
    activeTrendSelector,
    isNarrowSreenSeletor,
} from '../../store/reducers/UI';

import { Covid19TrendName, Covid19CasesByTimeFeature } from 'covid19-trend-map';

import SvgContainer from './SvgContainer';
import Axis from './Axis';
import Bar from './Bars';
import Line from './Line';
import MouseEventsRect from './MouseEventsRect';
import Tooltip from './Tooltip';
import Title from './Title';

import { max } from 'd3';

import { ThemeStyle } from '../../AppConfig';

type ContainerProps = {
    data: Covid19CasesByTimeFeature[];
};

export type ChartDataItem = {
    x: string;
    y: number;
};

// field names for Covid19CasesByTime Features
export const FieldNameByActiveTrend: { [key in Covid19TrendName]: string } = {
    'new-cases': 'NewCases',
    death: 'NewDeaths',
    confirmed: 'Confirmed',
};

type TooltipData = {
    data: Covid19CasesByTimeFeature;
    parentChart: Covid19TrendName;
};

type Props = {
    data: Covid19CasesByTimeFeature[];
    chartType: Covid19TrendName;
    visible: boolean;
    tooltipData: TooltipData;
    setTooltipData: (data:TooltipData)=>void;
}

const getChartData = (
    data: Covid19CasesByTimeFeature[],
    fieldName: string,
    showMovingAve?: boolean
): ChartDataItem[] => {

    if (!data || !data.length) {
        return [];
    }
    console.log('calling getChartData', data)

    if (!showMovingAve) {
        return data.map((d) => {
            const y = d.attributes[fieldName];

            return {
                x: d.attributes.dt,
                y,
            };
        });
    }

    const values: ChartDataItem[] = [];

    for (let i = data.length - 1; i > 0; i--) {
        const feature = data[i];

        const x = feature.attributes.dt;

        let sum = 0;
        const startIndex = i - 6 >= 0 ? i - 6 : 0;
        const endIndex = i + 1;

        const featuresInPastWeek = data.slice(startIndex, endIndex);

        featuresInPastWeek.forEach((d) => (sum += d.attributes[fieldName]));

        let y = sum / featuresInPastWeek.length;

        y = Math.round(y);

        y = y < 0 ? 0 : y;

        values.push({
            x,
            y,
        });
    }

    return values;
};

const Chart: React.FC<Props> = ({
    data,
    chartType,
    visible,
    tooltipData,
    setTooltipData
})=>{

    const fieldName = FieldNameByActiveTrend[chartType];

    const shouldShowBars = chartType === 'new-cases' || chartType === 'death';

    const data4Bars = useMemo(() => {
        if(!shouldShowBars){
            return null;
        }

        return getChartData(data, fieldName);
    }, [ data, fieldName ]);

    const data4Line = useMemo(() => {
        return getChartData(data, fieldName, shouldShowBars);
    }, [ data, fieldName ]);

    const xDomain = useMemo(() => {
        return data.map((d) => d.attributes.dt);
    }, [ data ]);

    const yDomain = useMemo(() => {
        const values = data.map((d) => {
            return d.attributes[fieldName];
        });
        const yMax = max(values) || 1;
        return [0, yMax];
    }, [ data, fieldName ]);

    return visible ? (
        <SvgContainer
            key={chartType}
            xDomain={xDomain}
            yDomain={yDomain}
        >
            <Axis />

            <Title chartType={chartType} />

            { data4Bars ? (
                <Bar
                    fillColor={ThemeStyle['theme-color-khaki-dark']}
                    data={data4Bars}
                />
            ) : (
                <></>
            )}

            <Line
                strokeColor={ThemeStyle['theme-color-red']}
                data={data4Line}
            />

            {tooltipData && tooltipData.parentChart === chartType ? (
                <Tooltip data={tooltipData.data} />
            ) : (
                <></>
            )}

            <MouseEventsRect
                data={data}
                onHover={(data) => {
                    if (!data) {
                        setTooltipData(undefined);
                    }

                    setTooltipData({
                        data,
                        parentChart: chartType,
                    });
                }}
            />
        </SvgContainer>
    ) : null ;
}

const ChartContainer: React.FC<ContainerProps> = ({ data }: ContainerProps) => {
    // const dispatch = useDispatch();

    const activeTrend = useSelector(activeTrendSelector);

    const isMobile = useSelector(isMobileSeletor);

    const isNarrowScreen = useSelector(isNarrowSreenSeletor);

    const [tooltipData, setTooltipData] = useState<TooltipData>();

    const isVisible = (chartType:Covid19TrendName):boolean=>{

        const onlyShowChartForActiveTrend = isMobile || isNarrowScreen;

        if(!onlyShowChartForActiveTrend){
            return true
        }

        return chartType === activeTrend;
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '170px',
                backgroundColor: ThemeStyle['theme-color-khaki-bright'],
                padding: '0 1rem 1rem',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Chart 
                    data={data}
                    chartType='new-cases'
                    visible={isVisible('new-cases')}
                    tooltipData={tooltipData}
                    setTooltipData={setTooltipData}
                />

                <Chart 
                    data={data}
                    chartType='death'
                    visible={isVisible('death')}
                    tooltipData={tooltipData}
                    setTooltipData={setTooltipData}
                />

                <Chart 
                    data={data}
                    chartType='confirmed'
                    visible={isVisible('confirmed')}
                    tooltipData={tooltipData}
                    setTooltipData={setTooltipData}
                />

            </div>

            <div
                className="text-right"
                style={{
                    position: 'absolute',
                    bottom: '.25rem',
                    right: '1rem',
                }}
            >
                <span className="font-size--3 text-theme-color-khaki">
                    source: Johns Hopkins University CSSE{' '}
                    <a
                        className="text-theme-color-khaki avenir-demi"
                        href="https://www.arcgis.com/home/item.html?id=4cb598ae041348fb92270f102a6783cb"
                        target="blank"
                    >
                        US County Cases
                    </a>
                </span>
            </div>
        </div>
    );
};

export default ChartContainer;
