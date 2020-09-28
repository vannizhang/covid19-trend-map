import { PathFrame } from 'covid19-trend-map';
import React from 'react';
import { TooltipPosition } from '../Tooltip/Tooltip';

type Props = {
    path: number[][];
    frame: PathFrame;
    color: string;
    size: number;
    onHoverHandler: (data?:TooltipPosition)=>void
};

const Sparkline: React.FC<Props> = ({ path, frame, color, size, onHoverHandler }: Props) => {

    const sparklineRef = React.createRef<SVGSVGElement>();

    const getPath = () => {
        // const origin = path[0];

        const { ymax } = frame;

        const originX = 0;
        const originY = ymax;

        const nodes = path
            .slice(1)
            .map(([x, y]) => {
                // console.log(x, y)
                y = ymax - y;
                return `${x} ${y}`;
            })
            .join(', ');

        const d = `M ${originX} ${originY} L ${nodes}`;

        return (
            <path
                d={d}
                stroke={color}
                strokeWidth={1.5}
                fill="transparent"
                vectorEffect="non-scaling-stroke"
            />
        );
    };

    const getHeight = () => {
        const { xmax, ymax } = frame;
        const ratio = ymax / xmax;
        return size * ratio;
    };

    return (
        <svg
            ref={sparklineRef}
            width={size}
            height={getHeight()}
            viewBox={`0 0 ${frame.xmax} ${frame.ymax}`}
            style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
            }}
            onMouseEnter={()=>{
                const svg = sparklineRef.current;
                const { top, right } = svg.getBoundingClientRect();
        
                onHoverHandler({
                    x: right,
                    y: top
                })
            }}
            onMouseLeave={onHoverHandler.bind(this, null)}
        >
            {getPath()}
        </svg>
    );
};

export default Sparkline;
