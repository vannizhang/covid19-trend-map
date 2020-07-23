import React from 'react';
import { generate } from 'shortid';
import { 
    select,
    line,
    curveMonotoneX
} from 'd3';

import {
    Scales,
    SvgContainerData,
} from './SvgContainer';

import {
    ChartDataItem
} from './ChartPanel';

import {
    TrendData,
    Covid19CasesByTimeFeature
} from 'covid19-trend-map';

type Props = {
    svgContainerData?: SvgContainerData;
    scales?: Scales;
};

type LineContainerProps = {
    activeTrend: TrendData;
    data: Covid19CasesByTimeFeature[]
} & Props;

type LineProps = {
    data: ChartDataItem[];
    strokeColor: string;
} & Props;

const LinePathClassName = `line-${generate()}`;

const Line:React.FC<LineProps> = ({
    data,
    strokeColor,
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

        const containerGroup = select(containerG.current);

        const { x, y } = scales;

        const xOffset = x.bandwidth() / 2;

        const valueline = line<ChartDataItem>()
            // .curve(curveMonotoneX)
            .x(d=>x(d.x) + xOffset)
            .y(d=>y(d.y));

        remove();

        containerGroup.append("path")
            .data([data])
            .attr("class", LinePathClassName)
            .attr("d", valueline)
            .style('fill', 'none')
            .style('stroke', strokeColor)
            .style('stroke-width', 1.5);
    };

    const remove = ()=>{

        const lines = select(containerG.current).selectAll(`.${LinePathClassName}`);
        
        // check the number of existing lines, if greater than 0; remove all existing ones
        if(lines.size()){
            lines.remove().exit();
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

// const LineContainer:React.FC<LineContainerProps> = ({
//     data,
//     activeTrend,
//     svgContainerData,
//     scales
// })=>{

//     const getData = ()=>{

//         if(!data || !data.length){
//             return [];
//         }

//         return data.map(d=>{
//             const fieldName = FieldNameByActiveTrend[activeTrend];

//             return {
//                 x: d.attributes.dt, 
//                 y: d.attributes[fieldName]
//             }
//         });
//     }

//     return (
//         <Line 
//             data={getData()}
//             strokeColor={'#fff'}
//             svgContainerData={svgContainerData}
//             scales={scales}
//         />
//     )
// }

export default Line;