import React, {
    useState
} from 'react';

import {
    useSelector
} from 'react-redux';

import {
    activeTrendSelector,
    isMobileSeletor,
    isNarrowSreenSeletor
} from '../../store/reducers/UI'

import {
    Covid19TrendName,
    Covid19CasesByTimeFeature
} from 'covid19-trend-map';

import SvgContainer from './SvgContainer';
import Axis from './Axis';
import Bar from './Bars';
import Line from './Line';
import MouseEventsRect from './MouseEventsRect';
import Tooltip from './Tooltip';
import Title from './Title';

import {
    max
} from 'd3';

import { ThemeStyle } from '../../AppConfig';

type Props = {
    // activeTrend: Covid19TrendName;
    data: Covid19CasesByTimeFeature[]
}

export type ChartDataItem = {
    x: string;
    y: number;
}

// field names for Covid19CasesByTime Features
export const FieldNameByActiveTrend:{ [ key in Covid19TrendName]: string } = {
    'new-cases': 'NewCases',
    'death': 'Deaths',
    'confirmed': 'Confirmed'
}

type TooltipData = {
    data: Covid19CasesByTimeFeature;
    parentChart: Covid19TrendName;
};

const NarrowScreenBreakPoint = 1020;

const ChartPanel:React.FC<Props> = ({
    // activeTrend,
    data
}) => {

    const activeTrend = useSelector(activeTrendSelector);

    const isMobile = useSelector(isMobileSeletor);

    const isNarrowScreen = useSelector(isNarrowSreenSeletor);

    // const fieldNameByActiveTrend = FieldNameByActiveTrend[activeTrend];

    // if true, convert numbers from Covid19CasesByTimeFeature into number per 100K people
    const [ showNormalizedValues, setShowNormalizedValues ] = useState<boolean>(false);

    const [ itemOnHover, setItemOnHover ] = useState<TooltipData>();

    const getXDomain = ()=>{
        const xDomain = data.map(d=>d.attributes.dt);
        return xDomain
    };

    const getYDomain = (fieldName:string)=>{
        const values = data.map(d=>{
            return showNormalizedValues 
                ? Math.round(d.attributes[fieldName] / d.attributes.Population * 100000 )
                : d.attributes[fieldName] 
        });
        const yMax = max(values) || 1;
        const yDomain = [ 0, yMax ];
        return yDomain;
    }

    const getChartData = (fieldName:string, showMovingAve?:boolean):ChartDataItem[] =>{
        if(!data || !data.length){
            return [];
        }

        if(!showMovingAve){
            return data.map(d=>{

                const y = showNormalizedValues
                    ? Math.round(d.attributes[fieldName] / d.attributes.Population * 100000)
                    : d.attributes[fieldName] 
    
                return {
                    x: d.attributes.dt, 
                    y
                }
            });
        }

        let values:ChartDataItem[]  = [];

        for(let i = data.length - 1; i > 0; i--){

            const feature = data[i];
            
            const x = feature.attributes.dt;

            let sum = 0;
            const startIndex = i - 6 >= 0 ? i - 6 : 0;
            const endIndex = i + 1;

            const featuresInPastWeek = data
                .slice(startIndex, endIndex);

            featuresInPastWeek.forEach(d=>sum += d.attributes[fieldName]);

            let y = (sum / featuresInPastWeek.length);

            if(showNormalizedValues){
                y = ( y / feature.attributes.Population * 100000)
            }

            y = Math.round(y);

            y = y < 0 ? 0 : y;

            values.push({
                x,
                y
            })
        }

        return values;
    };

    const getChart = (chartType:Covid19TrendName)=>{

        if(!data || !data.length){
            return null;
        }

        const onlyShowChartForActiveTrend = isMobile || isNarrowScreen;

        const isShowingData4ActiveTrend = chartType === activeTrend;

        if( onlyShowChartForActiveTrend && !isShowingData4ActiveTrend){
            return null;
        }

        const fieldName = FieldNameByActiveTrend[chartType];

        const shouldLineShowMovingAve =  chartType === 'new-cases';

        return (
            <SvgContainer
                key={chartType}
                xDomain={getXDomain()}
                yDomain={getYDomain(fieldName)}
            >

                <Axis />

                <Title 
                    chartType={chartType}
                />

                {
                    chartType === 'new-cases' ? (
                        <Bar 
                            fillColor={ThemeStyle["theme-color-khaki-dark"]}
                            data={getChartData(fieldName)}
                        />
                    ) : <></>
                }

                <Line 
                    strokeColor={ThemeStyle["theme-color-red"]}
                    data={getChartData(fieldName, shouldLineShowMovingAve)}
                />

                {
                    itemOnHover && itemOnHover.parentChart === chartType ? (
                        <Tooltip 
                            data={itemOnHover.data}
                        />
                    ) : <></>
                }

                <MouseEventsRect 
                    data={data}
                    onHover={(data)=>{
                        if(!data){
                            setItemOnHover(undefined)
                        }

                        setItemOnHover({
                            data,
                            parentChart: chartType
                        })
                    }}
                />

            </SvgContainer>
        );
    }

    return (
        <div
            style={{
                'width': '100%',
                'height': '170px',
                'backgroundColor': ThemeStyle["theme-color-khaki-bright"],
                'display': 'flex',
                'boxSizing': 'border-box',
                'padding': '0 1rem'
            }}
        >

            { getChart('new-cases') }

            { getChart('confirmed') }

            { getChart('death') }
        </div>
    
    )
}

export default ChartPanel;