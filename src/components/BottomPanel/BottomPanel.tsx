import React from 'react'
import { ThemeStyle } from '../../AppConfig'

type Props = {
    showLoadingIndicator: boolean;
}

const BottomPanel:React.FC<Props> = ({
    showLoadingIndicator,
    children
}) => {

    const getLoadingIndicator = ()=>{

        return (
            <div
                style={{
                    'position': 'relative',
                    'display': 'flex',
                    'justifyContent': 'center',
                    'alignItems': 'center',
                    'width': '100%',
                    'height': '225px'
                }}
            >
                <div className="loader is-active">
                    <div className="loader-bars"></div>
                    {/* <div className="loader-text">Loading...</div> */}
                </div>
            </div>
        )
    }

    return (
        <div
            style={{
                'position': 'absolute',
                'left': '15px',
                'right': '15px',
                'bottom': '25px',
                'boxSizing': 'border-box',
                'boxShadow': `0 0 10px 2px ${ThemeStyle["floating-panel-box-shadow"]}`,
                'backgroundColor': ThemeStyle["theme-color-khaki-bright"]
            }}
        >
            { 
                showLoadingIndicator 
                    ? getLoadingIndicator() 
                    : children 
            }
        </div>
    )
}

export default BottomPanel
