import React from 'react'
import { TrendData } from 'covid19-trend-map'

type Props = {
    activeTrendData: TrendData;
    trendDataOnChange: (vale:TrendData)=>void;
}

const SwitchBtnData: {
    label: string;
    value: TrendData
}[] = [
    {
        label: 'WEEKLY CASES',
        value: 'new-cases'
    },
    {
        label: 'TOATL DEATHS',
        value: 'death'
    },
    {
        label: 'TOATL CASES',
        value: 'confirmed'
    }
];

const SwitchBtnTextColor = '#A10D22';
const BackgroundColor = '#E8E2D2';
const BackgroundColor4ActiveItem = '#EFEADB';

const ControlPanel: React.FC<Props> = ({
    activeTrendData,
    trendDataOnChange
}) => {
    
    const getSwitchBtns = ()=>{
        return SwitchBtnData.map(d=>{

            const {
                value, label
            } = d;

            return (
                <div
                    key={value}
                    style={{
                        'width': '150px',
                        'height': '100%',
                        'color': SwitchBtnTextColor,
                        'backgroundColor': activeTrendData === value ? BackgroundColor4ActiveItem : 'transparent',
                        'display': 'flex',
                        'alignItems': 'center',
                        'justifyContent': 'center',
                        'boxSizing':'border-box',
                        'borderBottom': `solid 4px ${ activeTrendData === value ? SwitchBtnTextColor : 'transparent' }`,
                        'borderRight': `solid 1px #E0D8C1`,
                        'cursor': 'pointer'
                    }}
                    onClick={trendDataOnChange.bind(this, value)}
                >
                    <span className='avenir-bold'>{label}</span>
                </div>
            )
        })
    };

    const getInfoBtn = ()=>{

        return (
            <div
                style={{
                    'width': '60px',
                    'height': '100%',
                    'display': 'flex',
                    'alignItems': 'center',
                    'justifyContent': 'center',
                    'cursor': 'pointer'
                }}
            >
                <svg 
                    viewBox="0 0 24 24" 
                    height='24' 
                    width='24'
                    fill='#B2A584'
                >
                    <path d="M12.5 7.5a1 1 0 1 1 1-1 1.002 1.002 0 0 1-1 1zM13 18V9h-2v1h1v8h-1v1h3v-1zm9.8-5.5A10.3 10.3 0 1 1 12.5 2.2a10.297 10.297 0 0 1 10.3 10.3zm-1 0a9.3 9.3 0 1 0-9.3 9.3 9.31 9.31 0 0 0 9.3-9.3z"/>
                    <path fill="none" d="M0 0h24v24H0z"/>
                </svg>
            </div>
        )
    }
    
    return (
        <div
            style={{
                'position': 'absolute',
                'top': '10px',
                'right': '10px',
                'display': 'flex',
                'height': '60px',
                'boxSizing':'border-box',
                'boxShadow': `0 0 10px 2px #B1A483`,
                'backgroundColor': BackgroundColor
            }}
        >
            { getSwitchBtns() }
            { getInfoBtn() }
        </div>
    )
}

export default ControlPanel
