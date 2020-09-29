import React from 'react';
import { ThemeStyle } from '../../AppConfig';
import SortFieldSelector from './SortFieldSelector';
import SortOrderSelector from './SortOrder';

export const HeaderHeight = 130;

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
                    width: 'calc(100% - 610px)',
                    height: '110px',
                    backgroundColor: '#E8E2D3',
                    boxSizing: 'border-box',
                    padding: '8px 25px'
                }}
            >
                <div>
                    <span className='font-size--3 text-theme-color-khaki avenir-demi'>Choose a metric by which to sort these trend lines</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        // height: '100%',
                    }}
                >
                    <SortFieldSelector />

                    <SortOrderSelector />
                </div>
                
            </div>
        </div>
    );
};

export default Header;
