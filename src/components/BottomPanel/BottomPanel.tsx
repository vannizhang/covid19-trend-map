import React from 'react'
import { ThemeStyle } from '../../AppConfig'

const BottomPanel:React.FC = ({
    children
}) => {
    return (
        <div
            style={{
                'position': 'absolute',
                'left': '15px',
                'right': '15px',
                'bottom': '25px',
                // 'width': '100%',
                // 'padding': '1rem 1rem 1.5rem',
                'boxSizing': 'border-box',
                'boxShadow': `0 0 10px 2px ${ThemeStyle["floating-panel-box-shadow"]}`,
                'backgroundColor': ThemeStyle["theme-color-khaki-bright"]
            }}
        >
            { children }
        </div>
    )
}

export default BottomPanel
