import React from 'react'
import { Covid19TrendName } from 'covid19-trend-map';
import {
    ThemeStyle
} from '../../AppConfig';

type Props = {
    activeTrend: Covid19TrendName;
    activeTrendOnChange: (val:Covid19TrendName)=>void;
}

const SwitchBtnData: {
    label: string;
    value: Covid19TrendName
}[] = [
    {
        label: 'WEEKLY CASES',
        value: 'new-cases'
    },
    {
        label: 'CASES',
        value: 'confirmed'
    },
    {
        label: 'DEATHS',
        value: 'death'
    }
];

const ControlPanel: React.FC<Props> = ({
    activeTrend,
    activeTrendOnChange
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
                        'color': ThemeStyle["theme-color-red"],
                        'backgroundColor': activeTrend === value ? ThemeStyle["theme-color-khaki-bright"] : 'transparent',
                        'display': 'flex',
                        'alignItems': 'center',
                        'justifyContent': 'center',
                        'boxSizing':'border-box',
                        'borderBottom': `solid 4px ${ activeTrend === value ? ThemeStyle["theme-color-red"] : 'transparent' }`,
                        'borderRight': `solid 1px #E0D8C1`,
                        'cursor': 'pointer'
                    }}
                    onClick={activeTrendOnChange.bind(this, value)}
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
                    fill={ThemeStyle["theme-color-khaki-dark"]}
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
                'boxShadow': `0 0 10px 2px #B1A483`,
            }}
        >
            <div
                style={{
                    'backgroundColor': ThemeStyle["theme-color-red"],
                    'color': ThemeStyle["theme-color-khaki-bright"],
                    'height': '20px',
                    'lineHeight': '20px',
                    'width': '100%',
                    'textAlign': 'center'
                }}
            >
                <span className='avenir-bold' style={{
                    'fontSize': '0.785rem'
                }}>CORONAVIRUS TRENDS PER 100,000 PEOPLE, SINCE FEBRUARY, UPDATED DAILY</span>
            </div>

            <div
                style={{
                    'display': 'flex',
                    'height': '60px',
                    'width': '100%',
                    'boxSizing':'border-box',
                    
                    'backgroundColor': ThemeStyle["theme-color-khaki"]
                }}
            >
                { getSwitchBtns() }
                { getInfoBtn() }
            </div>
        </div>

    )
}

export default ControlPanel
