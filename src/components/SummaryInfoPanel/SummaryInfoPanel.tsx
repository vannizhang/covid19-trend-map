import React from 'react';

import { useSelector } from 'react-redux';

import { isMobileSeletor } from '../../store/reducers/UI';

import { ThemeStyle } from '../../AppConfig';
import { numberFns } from 'helper-toolkit-ts';
import { format, parse } from 'date-fns';

import { SummaryInfo } from '../../utils/queryCovid19Data';

type Props = {
    locationName?: string;
    data: SummaryInfo;
    closeBtnOnClick: () => void;
};

const SummaryInfoPanel: React.FC<Props> = ({
    locationName,
    data,
    closeBtnOnClick,
}: Props) => {
    const isMobile = useSelector(isMobileSeletor);

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
                : `solid 1px rgba(178, 165, 132, .5)`,
            display: isMobile ? 'block' : 'flex',
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
                <div
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
                </div>

                <div style={blockStyle}>
                    <span>
                        <span className="text-theme-color-red">Population</span>{' '}
                        {population}
                    </span>
                </div>

                <div style={blockStyle}>
                    <span>
                        <span className="text-theme-color-red">
                            {newCasesThisWeek}
                        </span>{' '}
                        new cases and{' '}
                        <span className="text-theme-color-red">
                            {deathsThisWeek}
                        </span>{' '}
                        deaths in past 7 days
                    </span>
                </div>

                <div
                    style={{
                        ...blockStyle,
                        borderRight: 'none',
                    }}
                >
                    <span>
                        <span className="text-theme-color-red">
                            {cumulativeCases}
                        </span>{' '}
                        cumulative cases and{' '}
                        <span className="text-theme-color-red">
                            {cumulativeDeaths}
                        </span>{' '}
                        deaths
                    </span>
                </div>
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
                    color: ThemeStyle['theme-color-red'],
                    textTransform: 'uppercase',
                    maxWidth: isMobile ? '320px' : 'auto',
                }}
            >
                <span className="avenir-bold font-size-2">{locationName}</span>
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
