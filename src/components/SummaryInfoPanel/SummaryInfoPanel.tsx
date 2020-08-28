import React from 'react';

import {
    useSelector
} from 'react-redux';

import {
    isMobileSeletor
} from '../../store/reducers/UI'

import { ThemeStyle } from '../../AppConfig'
import { Covid19CasesByTimeFeature } from 'covid19-trend-map';
import { numberFns } from 'helper-toolkit-ts';
import { parse, getISODay, format } from 'date-fns';

type Props = {
    locationName?: string;
    data: Covid19CasesByTimeFeature[];
    closeBtnOnClick: ()=>void;
};

const SummaryInfoPanel:React.FC<Props> = ({
    locationName,
    data,
    closeBtnOnClick
}) => {

    const isMobile = useSelector(isMobileSeletor);

    const getBiggestWeeklyIncrease = ()=>{

        let featureWithBiggestWeeklyIncrease = data[0];
        let biggestWeeklyIncrease = Number.NEGATIVE_INFINITY;

        const dateForFirstFeature = parse(data[0].attributes.dt, 'yyyy-MM-dd', new Date())

        let dayForFirstFeature = getISODay(dateForFirstFeature);

        for( let i = 0, len= data.length; i < len; i++){

            let dayOfWeek = ( i % 7 ) + dayForFirstFeature;

            dayOfWeek = dayOfWeek > 7 ? dayOfWeek - 7 : dayOfWeek;

            if(dayOfWeek === 1){
                const { Confirmed } = data[i].attributes;

                const feature7DaysAgo = i - 6 >= 0 
                    ? data[i-6] 
                    : data[0];
                
                const weeklyIncrease = Confirmed - feature7DaysAgo.attributes.Confirmed;

                if(weeklyIncrease > biggestWeeklyIncrease){
                    biggestWeeklyIncrease = weeklyIncrease;
                    featureWithBiggestWeeklyIncrease = data[i];
                }
            }
        }

        const dateWithBiggestWeeklyIncrease = parse(featureWithBiggestWeeklyIncrease.attributes.dt, 'yyyy-MM-dd', new Date())

        return format(dateWithBiggestWeeklyIncrease, 'MMMM dd, yyyy');
    };

    const getSummaryInfo = ()=>{

        if(!data || !data.length){
            return null
        }

        // const feature7DaysAgo = data[data.length - 7]
        const indexOfLatestFeature = data.length - 1;
        const latestFeature = data[indexOfLatestFeature];

        const { dt, Confirmed, Deaths, Population } = latestFeature.attributes;

        const [ year, month, day ] = dt.split('-');
        const date = new Date(+year, +month - 1, +day);
    
        const dayOfWeek = date.getDay();
    
        const featureOfLastSunday = dayOfWeek === 0 
            ? data[ indexOfLatestFeature - 6 ]
            : data[ indexOfLatestFeature - dayOfWeek ];

        const cumulativeCases = numberFns.numberWithCommas(Confirmed);
        const cumulativeDeaths = numberFns.numberWithCommas(Deaths);

        const newCasesThisWeek = numberFns.numberWithCommas(Confirmed - featureOfLastSunday.attributes.Confirmed);
        const deathsThisWeek = numberFns.numberWithCommas(Deaths - featureOfLastSunday.attributes.Deaths);

        const population = numberFns.numberWithCommas(Population);

        const blockStyle:React.CSSProperties ={
            'padding': isMobile ? '0' : '0 .65rem',
            'borderRight': isMobile ? 'none' : `solid 1px rgba(178, 165, 132, .5)`,
            'display': isMobile ? 'block' : 'flex',
            'alignItems': 'center'
        }

        return (
            <div
                className='font-size--2 avenir-bold text-theme-color-khaki'
                style={{
                    'display': isMobile ? 'block' : 'flex',
                    'alignItems': 'strech',
                    'padding': `0 ${isMobile ? '0' : '1rem' }`
                }}
            >
                <div style={{
                    ...blockStyle,
                    'display': 'block'
                }}>
                    <span>
                        <span className='text-theme-color-red'>Biggest Weekly New Cases Jump</span> { isMobile ? null : <br/>} { getBiggestWeeklyIncrease() }
                    </span>
                </div>

                <div style={blockStyle}>
                    <span><span className='text-theme-color-red'>Population</span> { population }</span>
                </div>

                <div style={blockStyle}>
                    <span>
                        <span className='text-theme-color-red'>{newCasesThisWeek}</span> new cases and <span className='text-theme-color-red'>{deathsThisWeek}</span> deaths this week
                    </span>
                </div>

                <div style={{
                    ...blockStyle,
                    'borderRight': 'none'
                }}>
                    <span>
                        <span className='text-theme-color-red'>{cumulativeCases}</span> cumulative cases and <span className='text-theme-color-red'>{cumulativeDeaths}</span> deaths
                    </span>
                </div>
            </div>
        )

    }

    const getCloseBtnStyleForMobileDevice = ():React.CSSProperties=>{

        if(!isMobile){
            return null;
        }

        return {
            'position': 'absolute',
            'top': '.5rem',
            'right': '.5rem'
        }
    }

    return (
        <div
            style={{
                'position': 'relative',
                'width': '100%',
                'padding': '.4rem 1.35rem',
                'display': isMobile ? 'block' : 'flex',
                'alignItems': 'center',
                'boxSizing': 'border-box',
                'backgroundColor': ThemeStyle["theme-color-khaki"],
            }}
        >
            <div
                style={{
                    'color': ThemeStyle["theme-color-red"],
                    'textTransform': 'uppercase',
                    'maxWidth': isMobile ? '320px' : 'auto'
                }}
            >
                <span className='avenir-bold font-size-2'>{locationName}</span>
            </div>

            <div
                style={{
                    'flexGrow': 1
                }}
            >
                { getSummaryInfo() }
            </div>

            <div
                style={{
                    'cursor': 'pointer',
                    ...getCloseBtnStyleForMobileDevice()
                }}
                onClick={closeBtnOnClick}
            >
                <svg 
                    viewBox="0 0 32 32" 
                    height="32" 
                    width="32"
                    fill={ThemeStyle["theme-color-khaki-dark"]}
                >
                    <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"/>
                    <path fill="none" d="M0 0h32v32H0z"/>
                </svg>
            </div>
        </div>
    )
}

export default SummaryInfoPanel
