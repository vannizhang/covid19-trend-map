import React from 'react'
import { ThemeStyle } from '../../AppConfig'
import { Covid19CasesByTimeFeature } from 'covid19-trend-map';
import { numberFns } from 'helper-toolkit-ts';

type Props = {
    locationName?: string;
    data: Covid19CasesByTimeFeature[];
    closeBtnOnClick: ()=>void;
}

const SummaryInfoPanel:React.FC<Props> = ({
    locationName,
    data,
    closeBtnOnClick
}) => {

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
                    'display': 'flex',
                    'alignItems': 'center',
                    'padding': '0 1rem'
                }}
            >
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

    return (
        <div
            style={{
                'width': '100%',
                'padding': '.4rem 1.35rem',
                'display': 'flex',
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
                    'cursor': 'pointer'
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
