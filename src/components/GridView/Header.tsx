import React from 'react';
import SortFieldSelector from './SortFieldSelector';

export const HeaderHeight = 155;

const Header: React.FC = () => {
    return (
        <div
            style={{
                width: '100%',
                height: HeaderHeight,
                padding: '10px',
                boxSizing: 'border-box'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: 'calc(100% - 610px)',
                    height: '110px',
                    backgroundColor: '#E8E2D3',
                    boxSizing: 'border-box',
                    padding: '0 25px'
                }}
            >
                <SortFieldSelector />
            </div>
        </div>
    );
};

export default Header;
