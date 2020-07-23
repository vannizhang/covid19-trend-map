import React from 'react'

const BottomPanel:React.FC = ({
    children
}) => {
    return (
        <div
            style={{
                'position': 'absolute',
                'left': '0',
                'bottom': '0',
                'width': '100%',
                'padding': '1rem 1rem 1.5rem',
                'boxSizing': 'border-box'
            }}
        >
            { children }
        </div>
    )
}

export default BottomPanel
