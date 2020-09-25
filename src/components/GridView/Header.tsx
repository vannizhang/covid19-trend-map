import React from 'react';
import { ThemeStyle } from '../../AppConfig';

export const HeaderHeight = 155;

const Header: React.FC = () => {
    return (
        <div
            style={{
                width: '100%',
                height: HeaderHeight,
                // 'backgroundColor': ThemeStyle["theme-color-khaki"]
            }}
        ></div>
    );
};

export default Header;
