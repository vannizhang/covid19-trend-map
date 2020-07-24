import React from 'react';
import { select } from 'd3';
import { generate } from 'shortid';

import {
    Scales,
    SvgContainerData
} from './SvgContainer';

import {
    ChartDataItem
} from './ChartPanel';

const BarRectGroupClassName = `bar-rect-group-${generate()}`;
const BarRectClassName = `bar-rect-${generate()}`;

type Props = {
    svgContainerData?: SvgContainerData;
    scales?: Scales;
};

type BarProps = {
    data: ChartDataItem[],
    fillColor: string;
} & Props;

const Bar:React.FC<BarProps> = ({
    data,
    fillColor,
    svgContainerData,
    scales
})=>{

    const containerG = React.useRef<SVGGElement>();

    const initContainer = ()=>{
        const { g } = svgContainerData;

        containerG.current = select(g)
            .append('g')
            .node();
    };

    const draw = ()=>{

        const { dimension } = svgContainerData;

        const { height } = dimension;

        const { x, y } = scales;

        remove();

        select(containerG.current)
            .append('g')
            .attr('class', BarRectGroupClassName)
            // .attr("clip-path", `url(#${clipPathId})`)
            .selectAll(`.${BarRectClassName}`)
                .data(data)
            .enter().append("rect")
                .attr("class", BarRectClassName)
                .style('fill', fillColor)
                .attr("x", d=>x(d.x))
                .attr("width", x.bandwidth() )
                .attr("y", d=>y(d.y))
                .attr("height", (d)=>{
                    return height - y(d.y)
                })
                
    };

    const remove = ()=>{

        const existingBars = select(containerG.current)
            .selectAll(`.${BarRectGroupClassName}`);

        if (existingBars.size()) {
            existingBars.remove()
        }
    };

    React.useEffect(()=>{
        if( svgContainerData){
            initContainer();
        }
    }, [ svgContainerData ]);

    React.useEffect(()=>{
        if( svgContainerData && scales && data ){
            draw();
        }
    }, [ scales, data ]);

    return null;
};

export default Bar;