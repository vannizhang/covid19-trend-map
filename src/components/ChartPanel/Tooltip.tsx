import React, { useEffect } from 'react';

import { Scales, SvgContainerData } from './SvgContainer';

import { Covid19CasesByTimeFeature } from 'covid19-trend-map';

import { numberFns } from 'helper-toolkit-ts';
import { ThemeStyle } from '../../AppConfig';

type TooltipPos = {
    top: number;
    left: number;
};

type Props = {
    svgContainerData?: SvgContainerData;
    scales?: Scales;
    data: Covid19CasesByTimeFeature;
};

const Tooltip: React.FC<Props> = ({ svgContainerData, scales, data }) => {
    const tooltipRef = React.useRef<HTMLDivElement>();

    const [tooltipPos, setTooltipPos] = React.useState<TooltipPos>({
        top: 0,
        left: 0,
    });

    const updateTooltipPosition = () => {
        const tooltipDiv = tooltipRef.current;

        if (!tooltipDiv) {
            return;
        }

        const { dimension, margin } = svgContainerData;

        const { width } = dimension;

        const { x } = scales;

        const tooltipDivWidth = tooltipDiv.offsetWidth;
        const tooltipDivHeight = tooltipDiv.offsetHeight;

        const top = -(tooltipDivHeight - margin.top);
        const xPosForItemOnHover = x(data.attributes.dt) + margin.left;

        let left =
            xPosForItemOnHover + tooltipDivWidth / 2 >= width + margin.left
                ? xPosForItemOnHover - tooltipDivWidth
                : xPosForItemOnHover - tooltipDivWidth / 2;

        left = left >= margin.left ? left : margin.left;

        setTooltipPos({
            top,
            left,
        });
    };

    const getTooltip = (): JSX.Element => {
        const { top, left } = tooltipPos;

        const { attributes } = data;

        const {
            dt,
            Confirmed,
            Deaths,
            NewCases,
            NewDeaths,
            // Population,
        } = attributes;

        const newCases = numberFns.numberWithCommas(NewCases);
        const confirmed = numberFns.numberWithCommas(Confirmed);
        const deaths = numberFns.numberWithCommas(Deaths);
        const newDeaths = numberFns.numberWithCommas(NewDeaths);

        return (
            <div
                ref={tooltipRef}
                style={{
                    position: 'absolute',
                    left: `${left}px`,
                    top: `${top}px`,
                    padding: '7px 10px',
                    background: ThemeStyle['theme-color-khaki-bright'],
                    color: '#fff',
                    // 'width': '300px',
                    pointerEvents: 'none',
                    boxSizing: 'border-box',
                    boxShadow: `0 0 10px 2px ${ThemeStyle['floating-panel-box-shadow']}`,
                    zIndex: 5
                }}
            >
                <div className="font-size--3 avenir-demi">
                    <span className="text-theme-color-khaki">{dt}</span>
                </div>

                <div className="font-size--2 avenir-bold">
                    <div>
                        <span className="text-theme-color-khaki">
                            new cases:{' '}
                            <span className="text-theme-color-red">
                                {newCases}
                            </span>
                        </span>
                    </div>

                    <div>
                        <span className="text-theme-color-khaki">
                            new deaths:{' '}
                            <span className="text-theme-color-red">
                                {newDeaths}
                            </span>
                        </span>
                    </div>

                    <div>
                        <span className="text-theme-color-khaki">
                            cumulative cases:{' '}
                            <span className="text-theme-color-red">
                                {confirmed}
                            </span>
                        </span>
                    </div>

                    <div>
                        <span className="text-theme-color-khaki">
                            cumulative deaths:{' '}
                            <span className="text-theme-color-red">
                                {deaths}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        updateTooltipPosition();
    }, [data]);

    return data ? getTooltip() : null;
};

export default Tooltip;
