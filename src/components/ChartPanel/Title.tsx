import React from 'react';

import {
    margin
} from './SvgContainer';

import {
    Covid19TrendName
} from 'covid19-trend-map';

type Props = {
    chartType: Covid19TrendName
}

const TitleLookup:{ [key in Covid19TrendName] : string} = {
    'confirmed': 'CUMULATIVE CASES',
    'death': 'NEW DAILY DEATHS',
    'new-cases': 'NEW DAILY CASES'
}

const Title:React.FC<Props> = ({
    chartType
}) => {

    const getTitleContent = ()=>{
        if(chartType === 'confirmed'){
            return ( <span>{TitleLookup[chartType]}</span> )
        }

        return (
            <>
                <span className='text-theme-color-khaki'>{TitleLookup[chartType]}</span>
                <br/>
                <span>WEEKLY AVERAGE</span>
            </>
        )
    }

    return (
        <div
            className={'text-theme-color-red avenir-demi'}
            style={{
                'position': 'absolute',
                'top': `13px`,
                'left': `${margin.left + 5}px`,
                'fontSize': '.8rem'
            }}
        >
            {
                getTitleContent()
            }
        </div>
    )
}

export default Title
