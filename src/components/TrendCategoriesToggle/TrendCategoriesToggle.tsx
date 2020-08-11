import React from 'react'
import { ThemeStyle, TrendColor } from '../../AppConfig'
import { COVID19TrendCategoryType } from 'covid19-trend-map'

type Props = {
    showTrendCategories: boolean;
    showNoDataAtStateLevelMessage: boolean;
    onToggle: ()=>void;
}

const LegendData:{
    value: string;
    label?: string;
    tooltip?: string;
    color: string;
}[]  = [
    {
        value: 'Emergent',
        tooltip: 'Early stages of outbreak',
        color: '#D49EC6'
    }, 
    {
        value: 'Spreading',
        tooltip: 'Early stages, and, depending on an administrative area’s capacity, a manageable rate of spread',
        color: '#A5336E'
    }, 
    {
        value: 'Epidemic',
        tooltip: 'Uncontrolled spread',
        color: '#800B4C'
    }, 
    {
        value: 'Controlled',
        tooltip: 'Very low levels of new cases',
        color: '#93C3C3'
    }, 
    {
        value: 'End Stage',
        tooltip: 'No New cases',
        color: '#5BA0A8'
    }, 
    {
        value: 'Zero Cases',
        tooltip: '',
        color: '#c8c8c8',
        label: 'No Cases'
    }
];

const Height = '22px';

const TrendCategoriesToggle:React.FC<Props> = ({
    showTrendCategories,
    showNoDataAtStateLevelMessage,
    onToggle
}) => {

    const getCheckbox = ()=>{

        const checkboxIcon = showTrendCategories 
            ? (
                <svg 
                    viewBox="0 0 24 24" 
                    height="24" 
                    width="24" 
                    style={{
                        'fill': ThemeStyle["theme-color-khaki-dark"]
                    }}
                >
                    <path d="M3 4.281v16.437A1.282 1.282 0 0 0 4.281 22h16.437A1.282 1.282 0 0 0 22 20.718V4.281A1.281 1.281 0 0 0 20.719 3H4.28A1.281 1.281 0 0 0 3 4.281zM20.719 4a.281.281 0 0 1 .281.281V20.72a.281.281 0 0 1-.281.281H4.28a.281.281 0 0 1-.28-.282V4.28A.281.281 0 0 1 4.281 4zM10.5 17L7 13.689l.637-.636 2.863 2.674 7.022-6.87.637.637z"/>
                    <path fill="none" d="M0 0h24v24H0z"/>
                </svg>

                
            )
            : (
                <svg 
                    viewBox="0 0 24 24"
                    height="24" 
                    width="24" 
                    style={{
                        'fill': ThemeStyle["theme-color-khaki-dark"]
                    }}
                >
                    <path d="M3 4.281v16.437A1.282 1.282 0 0 0 4.281 22h16.437A1.282 1.282 0 0 0 22 20.718V4.281A1.281 1.281 0 0 0 20.719 3H4.28A1.281 1.281 0 0 0 3 4.281zM20.719 4a.281.281 0 0 1 .281.281V20.72a.281.281 0 0 1-.281.281H4.28a.281.281 0 0 1-.28-.282V4.28A.281.281 0 0 1 4.281 4z"/>
                    <path fill="none" d="M0 0h24v24H0z"/>
                </svg>
            );

        return (
            <div 
                style={{
                    'display': 'flex',
                    'alignItems': 'center',
                    'backgroundColor':  ThemeStyle["theme-color-khaki-bright"],
                    // 'padding': '0 .1rem',
                    'cursor': 'pointer'
                }}
                onClick={onToggle}
            >
                { checkboxIcon }
            </div>
        );
    };

    const getTrendCategoriesLegend = ()=>{

        if( showTrendCategories && showNoDataAtStateLevelMessage ){
            return (
                <div
                    style={{
                        'backgroundColor': ThemeStyle["theme-color-khaki-bright"],
                        'color': ThemeStyle["theme-color-khaki-dark"],
                        'width': '540px',
                        'boxSizing': 'border-box',
                        'border': `1px solid ${ThemeStyle["theme-color-khaki"]}`,
                        'padding': '0 .25rem'
                    }}
                >
                    <span className='avenir-demi'>Trend categories are available at the county level. Please zoom in.</span>
                </div>
            )
        }

        const legends = LegendData.map(d=>{

            return (
                <div
                    key={d.value}
                    style={{
                        'display': 'felx',
                        'alignItems': 'center',
                        'backgroundColor': d.color,
                        'width': '90px',
                        'color': '#fff',
                        // 'padding': '.3rem .5rem',
                        'textAlign': 'center',
                        'textTransform': 'uppercase',
                        
                    }}
                    title={d.tooltip}
                >
                    <span className='avenir-demi'>{d.label || d.value}</span>
                </div>
            )
        })

        return (
            <div
                style={{
                    'display': 'flex'
                }}
            >
                { legends }
            </div>
        )
    };

    const getMessageForUncheckedBox = ()=>{
        return (
            <div
                style={{
                    'color': '#fff',
                    'backgroundColor': ThemeStyle["theme-color-red"],
                    'padding': '0 .35rem',
                    'display': 'felx',
                    'alignItems': 'center',
                    'height': '100%',
                    // 'lineHeight': Height
                }}
            >
                <span className='avenir-demi'>SHOW TREND CATEGORIES</span>
            </div>
        )
    };

    return (
        <div
            style={{
                'position': 'absolute',
                'top': '110px',
                'right': '10px',
                'height': Height,
                'display': 'flex',
                'fontSize': '12px',
                'lineHeight': Height
            }}
        >
            {
                getCheckbox()
            }

            {
                showTrendCategories
                ? getTrendCategoriesLegend()
                : getMessageForUncheckedBox()
            }

        </div>
    )
}

export default TrendCategoriesToggle
