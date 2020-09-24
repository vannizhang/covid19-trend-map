import { PathFrame } from 'covid19-trend-map';
import React, { useRef, useEffect } from 'react'
import { ThemeStyle } from '../../AppConfig';

type Props = {
    path: number[][];
    frame:PathFrame;
    color: string;
}

const Size = 60;

const Sparkline:React.FC<Props> = ({
    path,
    frame,
    color
}:Props) => {

    const getPath = ()=>{
        // const origin = path[0];

        const { ymax } = frame;

        const originX = 0;
        const originY = ymax;

        const nodes = path
            .slice(1)
            .map(([x, y])=>{
                // console.log(x, y)
                y = ymax - y;
                return `${x} ${y}`;
            })
            .join(', ')

        const d = `M ${originX} ${originY} L ${nodes}`;

        return (
            <path 
                d={d} 
                stroke={color} 
                strokeWidth={1}
                fill="transparent"
                vectorEffect="non-scaling-stroke"
            />
        );
        
    };

    const getHeight = ()=>{
        const { xmax, ymax } = frame;
        const ratio = ymax / xmax;
        return Size * ratio;
    }

    return (
        // <canvas 
        //     width='100'
        //     height='200'
        //     style={{
        //         'width':'60px',
        //         'height':'60px',
        //     }}
        //     ref={canvasRef}
        // />
        <div
            style={{
                'position': 'relative',
                'width': Size,
                'height': Size,
                'margin': '.5rem'
            }}
        >
            <svg 
                width={Size} 
                height={getHeight()}
                viewBox={`0 0 ${frame.xmax} ${frame.ymax}`}
                style={{
                    'position': 'absolute',
                    'left': 0,
                    'bottom': 0
                }}
            >
                { getPath() }
            </svg>
        </div>
    )
}

export default Sparkline
