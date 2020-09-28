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

const Sparkline: React.FC<Props> = ({ 
    path, 
    frame, 
    color, 
    size, 
    onHoverHandler 
}: Props) => {

    const containerRef = React.createRef<HTMLDivElement>();

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
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: size,
                height: size,
                margin: '.5rem',
                // border: '2px solid #000'
            }}
            onMouseOver={()=>{
                const conatiner = containerRef.current;
                const { top, right } = conatiner.getBoundingClientRect();
        
                onHoverHandler({
                    x: right,
                    y: top
                })
            }}
            onMouseOut={onHoverHandler.bind(this, null)}
        >
            <svg
                width={size}
                height={getHeight()}
                viewBox={`0 0 ${frame.xmax} ${frame.ymax}`}
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    pointerEvents: 'none'
                }}
            >
                {getPath()}
            </svg>
        </div>


    );
};

export default Sparkline;
