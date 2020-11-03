import React, { useRef } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import { ThemeStyle, TrendColor } from '../../AppConfig';
import { numberFns } from 'helper-toolkit-ts';

import { useSelector } from 'react-redux';

import {
    tooltipDataSelector,
    tooltipPositionSelector,
} from '../../store/reducers/Map';
import { COVID19TrendCategoryType } from 'covid19-trend-map';
import { activeViewModeSelector } from '../../store/reducers/UI';
import {
    SparklineSize
} from '../GridView/GridList';

export type TooltipPosition = {
    x: number;
    y: number;
};

export type TooltipData = {
    locationName: string;
    confirmed: number;
    deaths: number;
    newCasesPast7Days: number;
    newDeathsPast7Days: number;
    population: number;
    trendCategory?: COVID19TrendCategoryType;
    percentiles?: {
        casesPerCapita: number;
        deathsPerCapita: number; 
        caseFatalityRate: number; 
        caseFatalityRatePast100Day: number;
    }
};

type Props = {
    position: TooltipPosition;
    data: TooltipData;
    offsetX?: number;
};

// const TooltipWidth = 200;
// const TooltipHeight = 150;
const PositionOffset = 10;

export const PercentileInfo:React.FC<{
    value:number, 
    label:string,
    // margin bottom in rem unit
    marginBottom?: number;
}> = ({
    value, label, marginBottom
})=> {
    const percentile = value === 1 ? '100' : (value * 100).toFixed(2)
    return (
        <div
            style={{
                marginBottom: marginBottom ? `${marginBottom}rem` : 'unset'
            }}
        >
            <div
                style={{
                    lineHeight: '18px'
                }}
            >
                <span
                    style={{
                        color: ThemeStyle["theme-color-red"],
                    }}
                >{percentile}th percentile</span>
            </div>

            <div
                style={{
                    lineHeight: '18px'
                }}
            >
                <span>{ label } </span>
            </div>

        </div>
    );
}

const Tooltip: React.FC<Props> = ({ position, data, offsetX }: Props) => {
    const containerRef = useRef<HTMLDivElement>();

    const [width, height] = useWindowSize();

    const getXPosition = () => {
        if (!position) {
            return -99999;
        }

        const tooltipWidth = containerRef.current
            ? containerRef.current.offsetWidth
            : 200;
        
        const offset = offsetX || PositionOffset;

        if (position.x + tooltipWidth > width) {
            return position.x - tooltipWidth - offset;
        }

        return position.x + PositionOffset;
    };

    const getYPosition = () => {
        if (!position) {
            return -99999;
        }

        const tooltipHeight = containerRef.current
            ? containerRef.current.offsetHeight
            : 150;

        if (position.y + tooltipHeight > height) {
            return position.y - tooltipHeight - PositionOffset;
        }

        return position.y + PositionOffset;
    };

    const getTrendType = () => {
        if (!data || !data.trendCategory) {
            return null;
        }

        const trendCategory = data.trendCategory;

        return (
            <div className="trailer-quarter">
                <span>
                    <span
                        className="text-theme-color-red avenir-demi font-size--1"
                        style={{
                            textTransform: 'uppercase',
                            color: TrendColor[trendCategory].hex,
                        }}
                    >
                        {trendCategory}
                    </span>{' '}
                    trend
                </span>
            </div>
        );
    };

    const getPercentileItem = (value:number, label:string)=>{
        const percentile = value === 1 ? '100' : (value * 100).toFixed(2)
        return (
            <div
                className='trailer-quarter'
            >
                <div
                    style={{
                        lineHeight: '18px'
                    }}
                >
                    <span
                        style={{
                            color: ThemeStyle["theme-color-red"],
                        }}
                    >{percentile}th percentile</span>
                </div>

                <div
                    style={{
                        lineHeight: '18px'
                    }}
                >
                    <span>{ label } </span>
                </div>

            </div>
        )
    }

    const getPercentiles = ()=>{
        if (!data || !data.percentiles) {
            return null;
        }

        const {
            casesPerCapita,
            deathsPerCapita,
            caseFatalityRate,
            caseFatalityRatePast100Day
        } = data.percentiles;

        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    // maxWidth: '350px',
                    margin: '.5rem 0 .5rem',
                    padding: '.5rem 0',
                    borderTop: `solid 1px ${ThemeStyle["theme-color-khaki-dark-semi-transparent"]}`,
                    borderBottom: `solid 1px ${ThemeStyle["theme-color-khaki-dark-semi-transparent"]}`
                }}
            >
                <div
                    style={{
                        marginRight: '.75rem'
                    }}
                >
                    <PercentileInfo 
                        value={casesPerCapita}
                        label='Cases per Capita'
                        marginBottom={.5}
                    />

                    <PercentileInfo 
                        value={deathsPerCapita}
                        label='Deaths per Capita'
                    />
                </div>

                <div>
                    <PercentileInfo 
                        value={caseFatalityRate}
                        label='Case Fatality Rate'
                        marginBottom={.5}
                    />

                    <PercentileInfo 
                        value={caseFatalityRatePast100Day}
                        label='100-Day Case Fatality Rate'
                    />
                </div>

            </div>
        )
    }

    const getContent = () => {
        const {
            population,
            newCasesPast7Days,
            newDeathsPast7Days,
            confirmed,
            deaths,
        } = data;

        const content =
            data.confirmed === 0 && data.trendCategory ? (
                <div
                    style={{
                        maxWidth: '220px',
                    }}
                >
                    <span>
                        Due to state reporting structures, the Johns Hopkins
                        University data service does not fully reflect cases in
                        this county
                    </span>
                </div>
            ) : (
                <>
                    <span>
                        <span className="text-theme-color-red">
                            {numberFns.numberWithCommas(population)}
                        </span>{' '}
                        population
                    </span>
                    <br />

                    <span>
                        <span className="text-theme-color-red">
                            {numberFns.numberWithCommas(newCasesPast7Days)}
                        </span>{' '}
                        new cases and{' '}
                        <span className="text-theme-color-red">
                            {numberFns.numberWithCommas(newDeathsPast7Days)}
                        </span>{' '}
                        deaths in past 7 days
                    </span>
                    <br />

                    {/* <span>
                        <span className='text-theme-color-red'>{numberFns.numberWithCommas(data.newDeathsPast7Days)}</span> new deaths in past 7 days
                    </span>
                    <br/> */}

                    <span>
                        <span className="text-theme-color-red">
                            {numberFns.numberWithCommas(confirmed)}
                        </span>{' '}
                        cumulative cases and{' '}
                        <span className="text-theme-color-red">
                            {numberFns.numberWithCommas(deaths)}
                        </span>{' '}
                        deaths
                    </span>
                    <br />

                    {/* <span>
                        <span className='text-theme-color-red'>{numberFns.numberWithCommas(data.deaths)}</span> total deaths
                    </span> */}

                    
                </>
            );

        return (
            <div
                className="text-theme-color-khaki avenir-demi font-size--2"
                style={{
                    padding: '5px 15px 7px',
                    // 'maxWidth': '250px'
                }}
            >
                { content }
                { getPercentiles() }
                { getTrendType() }
            </div>
        );
    };

    return data ? (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: getYPosition() + 'px',
                left: getXPosition() + 'px',
                // 'height': TooltipHeight + 'px',
                // 'width': TooltipWidth + 'px',

                background: ThemeStyle['theme-color-khaki-bright'],
                pointerEvents: 'none',
                boxSizing: 'border-box',
                boxShadow: `0 0 10px 2px ${ThemeStyle['floating-panel-box-shadow']}`,
                zIndex: 5,
            }}
        >
            <div
                style={{
                    padding: '5px 15px',
                    backgroundColor: '#E8E2D2',
                    textTransform: 'uppercase',
                }}
            >
                <span className="text-theme-color-red avenir-demi font-size--1">
                    {data.locationName}
                </span>
            </div>

            {getContent()}
        </div>
    ) : null;
};

const TooltipConatiner = () => {
    const position = useSelector(tooltipPositionSelector);
    const data = useSelector(tooltipDataSelector);
    const activeViewMode = useSelector(activeViewModeSelector);

    return (
        <Tooltip 
            position={position} 
            data={data} 
            offsetX={ activeViewMode === 'grid' ? SparklineSize : undefined }
        />
    );
};

export default TooltipConatiner;
