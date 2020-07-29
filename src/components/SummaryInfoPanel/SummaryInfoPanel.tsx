import React from 'react'
import { ThemeStyle } from '../../AppConfig'
import { Covid19CasesByTimeFeature } from 'covid19-trend-map';
import { numberFns } from 'helper-toolkit-ts';
import { parse, getISODay, format } from 'date-fns';

type Props = {
    locationName?: string;
    data: Covid19CasesByTimeFeature[];
    isMobile?: boolean;
    closeBtnOnClick: ()=>void;
};

const SummaryInfoPanel:React.FC<Props> = ({
    locationName,
    data,
    isMobile = false,
    closeBtnOnClick
}) => {

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
        const feature7DaysAgo = data[data.length - 7]
        const latestFeature = data[data.length - 1];

        const cumulativeCases = numberFns.numberWithCommas(latestFeature.attributes.Confirmed);
        const cumulativeDeaths = numberFns.numberWithCommas(latestFeature.attributes.Deaths);

        const newCasesThisWeek = numberFns.numberWithCommas(latestFeature.attributes.Confirmed - feature7DaysAgo.attributes.Confirmed);
        const deathsThisWeek = numberFns.numberWithCommas(latestFeature.attributes.Deaths - feature7DaysAgo.attributes.Deaths);

        const population = numberFns.numberWithCommas(latestFeature.attributes.Population);

        return (
            <div
                className='font-size--2 avenir-bold text-theme-color-khaki'
                style={{
                    'display': isMobile ? 'block' : 'flex',
                    'alignItems': 'center',
                    'padding': `0 ${isMobile ? '0' : '1rem' }`
                }}
            >
                <div className='margin-right-1'>
                    <span className='text-theme-color-red'>Biggest Weekly Jump</span> { getBiggestWeeklyIncrease() }
                </div>

                <div className='margin-right-1'>
                    <span className='text-theme-color-red'>Population</span> { population }
                </div>

                <div className='margin-right-1'>
                    <span className='text-theme-color-red'>{newCasesThisWeek}</span> new cases and <span className='text-theme-color-red'>{deathsThisWeek}</span> deaths this week
                </div>

                <div className='margin-right-1'>
                    <span className='text-theme-color-red'>{cumulativeCases}</span> cumulative cases and <span className='text-theme-color-red'>{cumulativeDeaths}</span> deaths
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
                    'textTransform': 'uppercase'
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
