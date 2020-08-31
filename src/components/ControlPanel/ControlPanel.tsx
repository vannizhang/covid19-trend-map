import React from 'react'
import { Covid19TrendName } from 'covid19-trend-map';
import {
    ThemeStyle
} from '../../AppConfig';

import {
    useSelector,
    useDispatch
} from 'react-redux';

import {
    isMobileSeletor,
    activeTrendSelector,
    activeTrendUpdated,
    isAboutModalOpenToggled
} from '../../store/reducers/UI';

import {
    updateTrendTypeInURLHashParams
} from '../../utils/UrlSearchParams';

import TrendCategoriesToggle from '../TrendCategoriesToggle/TrendCategoriesToggle';

const SwitchBtnData: {
    label: string;
    value: Covid19TrendName
}[] = [
    {
        label: 'NEW CASES PER CAPITA',
        value: 'new-cases'
    },
    {
        label: 'DEATHS PER CAPITA',
        value: 'death'
    },
    {
        label: 'CUMULATIVE CASES',
        value: 'confirmed'
    }
];

const ControlPanel = () => {

    const dispatch = useDispatch();
    const activeTrend = useSelector(activeTrendSelector);
    const isMobile = useSelector(isMobileSeletor);
    
    const getTitleText = ()=>{

        const title = (
            <span className='avenir-bold' style={{
                'fontSize': '14.5px',
            }}>Esri CovidPulse &nbsp;--&nbsp; United States novel coronavirus trend lines, since February</span>
        );

        const dataSource = (
            <span className='avenir-light' style={{
                'fontSize': '12px',
                // 'marginRight': '12px',
            }}>data: Johns Hopkins University, Esri</span>
        )

        const content = !isMobile 
            ? (
                <div>
                    <div> { title } </div>
                    <div className='text-right'> { dataSource } </div>
                </div>
            ) 
            : (
                <div>
                    { title }
                    &nbsp;&nbsp;
                    { dataSource }
                </div>
            )

        return (
            <div
                style={{
                    'backgroundColor': ThemeStyle["theme-color-red"],
                    'color': ThemeStyle["theme-color-khaki-bright"],
                    // 'height': isMobile ? 'auto' : '20px',
                    'lineHeight': '16px',
                    'width': '100%',
                    // 'textAlign': 'center',
                    // 'maxWidth': isMobile ? 'auto': '540px',
                    'padding': '.5rem',
                    'boxSizing': 'border-box',
                    'display': 'flex',
                    'justifyContent': 'center'
                }}
            >
                { content }
            </div>
        );
    }

    const getSwitchBtns = ()=>{
        return SwitchBtnData.map(d=>{

            const {
                value, label
            } = d;

            return (
                <div
                    key={value}
                    style={{
                        'width': isMobile ? 'auto' : '160px',
                        'flexGrow': isMobile ? 1 : 0,
                        'height': '100%',
                        'color': ThemeStyle["theme-color-red"],
                        'backgroundColor': activeTrend === value ? ThemeStyle["theme-color-khaki-bright"] : 'transparent',
                        'display': 'flex',
                        'alignItems': 'center',
                        'justifyContent': 'center',
                        'boxSizing':'border-box',
                        'borderBottom': `solid 4px ${ activeTrend === value ? ThemeStyle["theme-color-red"] : 'transparent' }`,
                        'borderRight': `solid 1px #E0D8C1`,
                        'cursor': 'pointer',
                        'textAlign': 'center'
                    }}
                    onClick={()=>{
                        dispatch(activeTrendUpdated(value));
                        updateTrendTypeInURLHashParams(value);
                    }}
                >
                    <span 
                        className={`avenir-bold`}
                        style={{
                            'fontSize': '12px'
                        }}
                    >{label}</span>
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
                onClick={()=>{
                    dispatch(isAboutModalOpenToggled())
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
                'left': isMobile ? '10px' : 'unset',
            }}
        >
            <div
                style={{
                    'boxShadow': `0 0 10px 2px #B1A483`,
                }}
            >
                { getTitleText() }
                
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

            <TrendCategoriesToggle/>
        </div>


    )
}

export default ControlPanel
