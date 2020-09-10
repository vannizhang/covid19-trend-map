import React, { useEffect } from 'react';

import { select, mouse } from 'd3';

import { Scales, SvgContainerData } from './SvgContainer';

import { Covid19CasesByTimeFeature } from 'covid19-trend-map';

interface Props {
    data: Covid19CasesByTimeFeature[];
    svgContainerData?: SvgContainerData;
    scales?: Scales;

    onHover?: (item: Covid19CasesByTimeFeature) => void;
}

const VerticalRefLineClassName = 'vertical-ref-line';

const MouseEventsRect: React.FC<Props> = ({
    data,
    svgContainerData,
    scales,

    onHover,
}) => {
    const containerG = React.useRef<SVGGElement>();

    const itemOnHover = React.useRef<Covid19CasesByTimeFeature>();

    const init = () => {
        const { g, dimension } = svgContainerData;

        const { height, width } = dimension;

        containerG.current = select(g).append('g').node();

        const container = select(containerG.current);

        container
            .append('line')
            .attr('class', VerticalRefLineClassName)
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', height)
            .style('opacity', 0)
            .attr('stroke-width', 0.5)
            .attr('stroke', 'rgba(255,255,255,.75)')
            .style('fill', 'none');

        container
            .append('rect')
            // .attr("class", ClassNames.BackgroundRect)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'rgba(0,0,0,0)')
            .on('mouseleave', () => {
                setItemOnHover(null);
            })
            .on('mousemove', function () {
                const mousePosX = mouse(this)[0];
                setItemOnHover(getItemByMousePos(mousePosX));
            });
    };

    const setItemOnHover = (item?: Covid19CasesByTimeFeature) => {
        itemOnHover.current = item;
        updateVerticalRefLinePos();
        onHover(item);
    };

    const updateVerticalRefLinePos = (): void => {
        const { x } = scales;

        const item = itemOnHover.current;

        const vRefLine = select(containerG.current).select(
            `.${VerticalRefLineClassName}`
        );

        const xPos = item ? x(item.attributes.dt) + x.bandwidth() / 2 : 0;

        const opacity = item ? 1 : 0;

        vRefLine.attr('x1', xPos).attr('x2', xPos).style('opacity', opacity);
    };

    const getItemByMousePos = (
        mousePosX: number
    ): Covid19CasesByTimeFeature => {
        let itemIndex = -1;
        const { x } = scales;

        for (let i = 0, len = data.length; i < len; i++) {
            const currItem = data[i];
            const currItemPos = x(currItem.attributes.dt);

            const nextItemIndex = data[i + 1] ? i + 1 : i;
            const nextItem = data[nextItemIndex];
            const nextItemPos = x(nextItem.attributes.dt);

            if (mousePosX >= currItemPos && mousePosX <= nextItemPos) {
                const distToCurrItem = Math.abs(mousePosX - currItemPos);
                const distToNextItem = Math.abs(mousePosX - nextItemPos);

                itemIndex = distToCurrItem < distToNextItem ? i : nextItemIndex;

                break;
            }
        }

        return data[itemIndex];
    };

    useEffect(() => {
        if (svgContainerData && data.length) {
            init();
        }
    }, [svgContainerData, data]);

    useEffect(() => {
        if (svgContainerData && scales) {
            const { dimension } = svgContainerData;
            const { width } = dimension;

            select(containerG.current).select('rect').attr('width', width);
        }
    }, [scales]);

    return null;
};

export default MouseEventsRect;
