// import './Axis.scss';
import React from 'react';
import { numberFns } from 'helper-toolkit-ts';

import { select, axisBottom, axisLeft, scaleTime, timeFormat } from 'd3';

import { Scales, SvgContainerData } from './SvgContainer';

interface Props {
    svgContainerData?: SvgContainerData;
    scales?: Scales;
}

const formatTime = timeFormat('%b');

const Axis: React.FC<Props> = ({ svgContainerData, scales }) => {
    const drawXAxis = () => {
        const { dimension, g } = svgContainerData;

        const { height, width } = dimension;

        const mainGroup = select(g);

        const { x } = scales;

        const domain = x.domain();
        const startDateParts = domain[0].split('-').map((d) => +d);
        const startDate = new Date(
            startDateParts[0],
            startDateParts[1] - 1,
            startDateParts[2]
        );

        const endDateParts = domain[domain.length - 1]
            .split('-')
            .map((d) => +d);
        const endDate = new Date(
            endDateParts[0],
            endDateParts[1] - 1,
            endDateParts[2]
        );

        const xScale = scaleTime()
            .range([0, width])
            .domain([startDate, endDate]);

        const xAxis = axisBottom(xScale)
            // .ticks(timeMonth)
            .tickFormat((date: Date) => {
                return formatTime(date);
            });
        // .tickValues(d=>{})
        // .tickSizeInner(-(height))
        // .tickPadding(9)

        const xAxisLabel = mainGroup.selectAll('.x.axis');

        if (!xAxisLabel.size()) {
            mainGroup
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);
        } else {
            xAxisLabel
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);
        }
    };

    const drawYAxis = () => {
        const { g, dimension } = svgContainerData;

        const { width } = dimension;

        const { y } = scales;

        const mainGroup = select(g);

        const yAxis = axisLeft(y)
            .ticks(3)
            .tickSizeInner(-width)
            .tickPadding(5)
            .tickFormat((num) => {
                return numberFns.abbreviateNumber(+num, 0);
            });

        const yAxisLabel = mainGroup.selectAll('.y.axis');

        if (!yAxisLabel.size()) {
            mainGroup.append('g').attr('class', 'y axis').call(yAxis);
        } else {
            yAxisLabel.call(yAxis);
        }
    };

    React.useEffect(() => {
        if (svgContainerData && scales) {
            drawXAxis();
            drawYAxis();
        }
    }, [svgContainerData, scales]);

    return null;
};

export default Axis;
