import React from 'react'
import { ThemeStyle } from '../../AppConfig'

type Props = {
    locationName?: string;
    closeBtnOnClick: ()=>void;
}

const SummaryInfoPanel:React.FC<Props> = ({
    locationName,
    closeBtnOnClick
}) => {
    return (
        <div
            style={{
                'width': '100%',
                'padding': '.5rem 1.35rem',
                'display': 'flex',
                'alignItems': 'center',
                'boxSizing': 'border-box'
            }}
        >
            <div
                style={{
                    'color': ThemeStyle["theme-color-red"],
                    'textTransform': 'uppercase'
                }}
            >
                <span className='avenir-bold font-size-2'>{locationName}</span>
            </div>

            <div
                style={{
                    'flexGrow': 1
                }}
            >

            </div>

            <div
                style={{
                    'cursor': 'pointer'
                }}
                onClick={closeBtnOnClick}
            >
                <svg 
                    viewBox="0 0 32 32" 
                    height="32" 
                    width="32"
                    fill={ThemeStyle["icon-color"]}
                >
                    <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"/>
                    <path fill="none" d="M0 0h32v32H0z"/>
                </svg>
            </div>
        </div>
    )
}

export default SummaryInfoPanel
