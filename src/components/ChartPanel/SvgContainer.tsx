import React, {
    useRef,
    useEffect
} from 'react';

import { 
    select,
    scaleBand,
    scaleLinear
} from 'd3';

import useWindowSize from '@rehooks/window-size';

const margin = {
    top: 20, 
    right: 30, 
    bottom: 30, 
    left: 40
};

type Dimension = {
    height: number;
    width: number;
};

export type XScale = d3.ScaleBand<string>;
export type YScale = d3.ScaleLinear<number, number>;

export type Scales = {
    x: XScale;
    y: YScale;
    lastUpdateTime?: Date;
};

export type SvgContainerData = {
    svg: SVGElement;
    g: SVGGElement;
    margin: typeof margin;
    dimension?: Dimension
}

type Props = {
    // data: Covid19CasesByTimeFeature[];
    xDomain: string[];
    yDomain: number[]
}

const SvgContainer:React.FC<Props> = ({
    // data,
    xDomain,
    yDomain,
    children
}) => {

    const windowSize = useWindowSize();

    const containerRef = useRef<HTMLDivElement>();
    const dimensionRef = useRef<Dimension>();

    const [ svgContainerData, setSvgContainerData ] = React.useState<SvgContainerData>();

    const [ scales, setScales ] =  React.useState<Scales>();

    const init = ()=>{

        const container = containerRef.current;
        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        dimensionRef.current = {
            height,
            width
        };

        select(container)
            .append("svg")
                .attr("width", '100%')
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr(
                    "transform", 
                    `translate(${margin.left}, ${margin.top})`
                );
        
        const svgSelector = select(container)
            .select<SVGElement>('svg');

        const svg = svgSelector.node();

        const g = svgSelector
            .select<SVGGElement>('g')
            .node();

        const xScale = scaleBand<string>()
            .paddingInner(0.2)
            .range([0, width])
            .domain(xDomain)

        const yScale = scaleLinear()
            .range([height, 0])
            .domain(yDomain).nice();

        setSvgContainerData({
            svg,
            g,
            margin,
            dimension: dimensionRef.current
        });

        setScales({
            x: xScale,
            y: yScale
        });
        
    };

    const scalesOnUpdateEndHandler = ()=>{
        setScales(scales=>{
            return {
                ...scales,
                // change last update time so the children components know scales have changed
                lastUpdateTime: new Date()
            }
        });
    };

    const resizeHandler = ()=>{

        const container = containerRef.current;

        if(!container || !svgContainerData || !scales){
            return;
        }

        // const { svg } = svgContainerData;
        const { x } = scales;

        // const newContainerWidth = window.innerWidth - 720;
        const newWidth = container.offsetWidth - margin.left - margin.right;

        dimensionRef.current.width = newWidth;

        x.range([0, newWidth ]);

        scalesOnUpdateEndHandler();
    }

    useEffect(()=>{
        init();
    }, []);

    useEffect(()=>{

        if( scales && yDomain ){
            scales.y.domain(yDomain).nice();
            scalesOnUpdateEndHandler();
        }

    }, [ yDomain ]);

    React.useEffect(()=>{
        resizeHandler();
    }, [ windowSize ]);

    return (
        <>
            <div 
                ref={containerRef}
                style={{
                    'position': 'relative',
                    'width': '100%',
                    'height': '100%'
                }}
            ></div>
            {   
                React.Children.map(children, (child)=>{
                    return React.cloneElement(child as React.ReactElement<any>, {
                        svgContainerData,
                        scales
                    });
                })  
            }
        </>
    );
}

export default SvgContainer
