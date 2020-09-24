import { PathFrame } from 'covid19-trend-map';
import React, { useRef, useEffect } from 'react'
import { ThemeStyle } from '../../AppConfig';

type Props = {
    path: number[][];
    frame:PathFrame;
    color: string;
}

const Width = 40;

const Sparkline:React.FC<Props> = ({
    path,
    frame,
    color
}:Props) => {

    // const canvasRef = useRef<HTMLCanvasElement>(null)

    // useEffect(()=>{

    //     const canvas = canvasRef.current;
    //     const context = canvas.getContext('2d');
        
    //     // context.translate(0.5, 0)
    //     context.beginPath();

    //     path.forEach(([x, y], index)=>{

    //         y = 200 - y

    //         if(index === 0){
    //             context.moveTo(x, y);
    //         } else {
    //             context.lineTo(x, y);
    //         }
    //     })

    //     // context.translate(-0.5, 0);

    //     context.lineWidth = 2;
    //     // context.strokeStyle = color;
    //     context.stroke();

    // }, []);

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
        return Width * ratio;
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
                'margin': '.5rem'
            }}
        >
            <svg 
                width={Width} 
                height={getHeight()}
                viewBox={`0 0 ${frame.xmax} ${frame.ymax}`}
            >
                { getPath() }
            </svg>
        </div>
    )
}

export default Sparkline
