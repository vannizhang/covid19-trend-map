import React from 'react';

import { useSelector } from 'react-redux';

import { isMobileSeletor } from '../../store/reducers/UI';

import { ThemeStyle } from '../../AppConfig';
import { numberFns } from 'helper-toolkit-ts';
import { format, parse } from 'date-fns';

import { SummaryInfo } from '../../utils/queryCovid19Data';

import {
    RankInfo
} from '../Tooltip/Tooltip';

type Props = {
    locationName?: string;
    data: SummaryInfo;
    // Ranks for: casesPerCapita, deathsPerCapita, caseFatalityRate, caseFatalityRatePast100Day
    ranks?: number[]
    closeBtnOnClick: () => void;
};

const SummaryInfoPanel: React.FC<Props> = ({
    locationName,
    data,
    ranks,
    closeBtnOnClick,
}: Props) => {
    const isMobile = useSelector(isMobileSeletor);

    const getRanksInfo = ()=>{

        if(!ranks || !ranks.length){
            return null;
        }

        const titles = [
            'Cases per Capita',
            'Deaths per Capita',
            'Case Fatality Rate',
            '100-Day Case Fatality Rate'
        ];

        const items = ranks.map((num, index)=>{
            return (
                <div 
                    key={index}
                    className='margin-right-1'
                >
                    <RankInfo 
                        value={num}
                        label={titles[index]}
                    />
                </div>
            )
        })

        return (
            <>{ items }</>
        );

    }

    const getSummaryInfo = () => {
        if (!data) {
            return null;
        }

        const cumulativeCases = numberFns.numberWithCommas(
            data.cumulativeCases
        );
        const cumulativeDeaths = numberFns.numberWithCommas(
            data.cumulativeDeaths
        );

        const newCasesThisWeek = numberFns.numberWithCommas(
            data.newCasesPast7Days
        );
        const deathsThisWeek = numberFns.numberWithCommas(data.deathsPast7Days);

        const population = numberFns.numberWithCommas(data.population);

        const dateWithBiggestWeeklyIncrease = parse(
            data.dateWithBiggestWeeklyIncrease,
            'yyyy-MM-dd',
            new Date()
        );
        const dateWithBiggestWeeklyIncreaseFormatted = format(
            dateWithBiggestWeeklyIncrease,
            'MMMM dd, yyyy'
        );

        const blockStyle: React.CSSProperties = {
            padding: isMobile ? '0' : '0 .65rem',
            borderRight: isMobile
                ? 'none'
                : `solid 1px ${ThemeStyle["theme-color-khaki-dark-semi-transparent"]}`,
            // display: isMobile ? 'block' : 'flex',
            alignItems: 'center',
        };

        return (
            <div
                className="font-size--2 avenir-bold text-theme-color-khaki"
                style={{
                    display: isMobile ? 'block' : 'flex',
                    alignItems: 'strech',
                    padding: `0 ${isMobile ? '0' : '1rem'}`,
                }}
            >
                {/* <div
                    style={{
                        ...blockStyle,
                        display: 'block',
                    }}
                >
                    <span>
                        <span className="text-theme-color-red">
                            Biggest Weekly New Cases Jump
                        </span>{' '}
                        {isMobile ? null : <br />}{' '}
                        {dateWithBiggestWeeklyIncreaseFormatted}
                    </span>
                </div> */}

                <div 
                    style={blockStyle}
                >
                    <span className="text-theme-color-red">Population</span>
                    <br/>
                    <span>{population}</span>
                </div>

                <div 
                    style={blockStyle}
                >
                    <div>
                        <span className="text-theme-color-red">
                            {newCasesThisWeek}
                        </span>{' '}
                        new cases and{' '}
                        <span className="text-theme-color-red">
                            {deathsThisWeek}
                        </span>{' '}
                        deaths in past 7 days
                    </div>

                    <div>
                        <span className="text-theme-color-red">
                            {cumulativeCases}
                        </span>{' '}
                        cumulative cases and{' '}
                        <span className="text-theme-color-red">
                            {cumulativeDeaths}
                        </span>{' '}
                        deaths
                    </div>
                </div>

                <div
                    style={{
                        ...blockStyle,
                        display: 'flex',
                        
                        borderRight: 'unset',
                    }}
                >
                    { getRanksInfo() }
                </div>

                {/* <div
                    style={{
                        ...blockStyle,
                        borderRight: 'none',
                    }}
                >
                    <div>
                        <span className="text-theme-color-red">
                            {cumulativeCases}
                        </span>{' '}
                        cumulative cases and{' '}
                        <span className="text-theme-color-red">
                            {cumulativeDeaths}
                        </span>{' '}
                        deaths
                    </div>
                </div> */}
            </div>
        );
    };

    const getCloseBtnStyleForMobileDevice = (): React.CSSProperties => {
        if (!isMobile) {
            return null;
        }

        return {
            position: 'absolute',
            top: '.5rem',
            right: '.5rem',
        };
    };

    const serachBtnOnClick = ()=>{

        const [ locationNamePart1, locationNamePart2 ]: string[] = locationName.split(',').map(d=>d.trim());

        const locationName2Search = locationNamePart1 && locationNamePart2 
            ? `${locationNamePart1}+County+${locationNamePart2}`
            : locationNamePart1;

        window.open(`https://www.google.com/search?q=${locationName2Search}+covid`, '_blank');
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                padding: '.4rem 1.35rem',
                display: isMobile ? 'block' : 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                backgroundColor: ThemeStyle['theme-color-khaki'],
            }}
        >
            <div
                style={{
                    position: 'relative',
                    color: ThemeStyle['theme-color-red'],
                    textTransform: 'uppercase',
                    maxWidth: isMobile ? '320px' : 'auto',
                }}
            >
                <span className="avenir-bold font-size-2">{locationName}</span>

                <div
                    style={{
                        position: 'absolute',
                        top: '-5px' ,
                        right:'-15px',
                        cursor: 'pointer',
                    }}
                    title='Find more on the web'
                    onClick={serachBtnOnClick}
                >
                    <svg height="16" width="16" viewBox="0 0 16 16" fill={ThemeStyle["theme-color-khaki-dark"]}><path d="M14.482 13.784L9.708 9.011a4.8 4.8 0 1 0-.69.69l4.773 4.773zM3.315 8.687a3.8 3.8 0 1 1 2.687 1.112 3.806 3.806 0 0 1-2.687-1.112z"/><path fill="none" d="M0 0h16v16H0z"/></svg>
                </div>
            </div>

            <div
                style={{
                    flexGrow: 1,
                }}
            >
                {getSummaryInfo()}
            </div>

            <div
                style={{
                    cursor: 'pointer',
                    ...getCloseBtnStyleForMobileDevice(),
                }}
                onClick={closeBtnOnClick}
            >
                <svg
                    viewBox="0 0 32 32"
                    height="32"
                    width="32"
                    fill={ThemeStyle['theme-color-khaki-dark']}
                >
                    <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z" />
                    <path fill="none" d="M0 0h32v32H0z" />
                </svg>
            </div>
        </div>
    );
};

export default SummaryInfoPanel;
