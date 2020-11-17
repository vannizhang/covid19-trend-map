import React from 'react';
import SortFieldSelector from './SortFieldSelector';
import SortOrderSelector from './SortOrder';

import { useSelector, useDispatch } from 'react-redux';

import {
    updateActiveMode,
    isMobileSeletor,
    isNarrowSreenSeletor
} from '../../store/reducers/UI';

import { ThemeStyle } from '../../AppConfig';

export const HeaderHeight = 130;

const Header: React.FC = () => {

    const dispatch = useDispatch();

    const isNarrowScreen = useSelector(isNarrowSreenSeletor);
    const isMobile = useSelector(isMobileSeletor);

    const getCloseBtn = ()=>{

        if(!isNarrowScreen){
            return null;
        }

        return (
            <div
                style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '.75rem',
                    right: '.75rem',
                }}
                onClick={()=>{
                    // set active view mode to map to close grid view
                    dispatch(updateActiveMode('map'));
                }}
            >
                <svg
                    viewBox="0 0 32 32"
                    height="32"
                    width="32"
                    fill={ThemeStyle['theme-color-khaki-dark']}
                >
                    <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z" />
                    <path fill="none" d="M0 0h32v32H0z" />
                </svg>
            </div>
        )
    };

    return (
        <div
            style={{
                width: '100%',
                height: HeaderHeight,
                padding: '10px',
                boxSizing: 'border-box'
            }}
        >
            {
                getCloseBtn()
            }

            <div
                style={{
                    width: isNarrowScreen ? '100%' : 'calc(100% - 610px)',
                    height: isMobile ? 'auto' : '110px',
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
                        display: isMobile ? 'block' :'flex',
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
