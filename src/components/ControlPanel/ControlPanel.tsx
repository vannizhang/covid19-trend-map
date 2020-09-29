import React from 'react';
import { Covid19TrendName } from 'covid19-trend-map';
import { ThemeStyle } from '../../AppConfig';

import { useSelector, useDispatch } from 'react-redux';

import {
    isMobileSeletor,
    activeTrendSelector,
    activeTrendUpdated,
    isAboutModalOpenToggled,
    activeViewModeSelector,
    updateActiveMode,
    ViewMode,
} from '../../store/reducers/UI';

import { updateTrendTypeInURLHashParams } from '../../utils/UrlSearchParams';

import TrendCategoriesToggle from '../TrendCategoriesToggle/TrendCategoriesToggle';

const SwitchBtnData: {
    label: string;
    value: Covid19TrendName;
}[] = [
    {
        label: 'NEW CASES PER CAPITA',
        value: 'new-cases',
    },
    {
        label: 'DEATHS PER CAPITA',
        value: 'death',
    },
    {
        label: 'CUMULATIVE CASES',
        value: 'confirmed',
    },
];

const ViewToggleBtns: {
    value: ViewMode;
    icon: any;
}[] = [
    {
        value: 'grid',
        icon: (
            <svg height="24" width="24" viewBox="0 0 24 24">
                <path
                    fill={ThemeStyle['theme-color-red']}
                    d="M2 11h9V2H2zm1-8h7v7H3zm10 8h9V2h-9zm1-8h7v7h-7zM2 22h9v-9H2zm1-8h7v7H3zm10 8h9v-9h-9zm1-8h7v7h-7z"
                />
                <path fill="none" d="M0 0h24v24H0z" />
            </svg>
        ),
    },
    {
        value: 'map',
        icon: (
            <svg height="24" width="24" viewBox="0 0 24 24">
                <path
                    fill={ThemeStyle['theme-color-red']}
                    d="M2.02 21.98h19.961v-6.264l.019-.024-.019-.015V2.02H2.021zM13.886 21l.117-.268c.274-.63.31-.716.31-.89a1.084 1.084 0 0 0-.288-.655c-.038-.05-.087-.13-.108-.117a1.41 1.41 0 0 1 .422-.158c.384-.106 1.098-.302 1.098-1.057a1.068 1.068 0 0 0-.332-.68c-.044-.05-.107-.121-.108-.073 0-.092.046-.152.217-.323a1.34 1.34 0 0 0 .484-.972v-.609a.46.46 0 0 1 .377.049 1.384 1.384 0 0 0 .608.165 1.467 1.467 0 0 0 .982-.382.71.71 0 0 1 .369-.202 1.303 1.303 0 0 1 .153.296 1.816 1.816 0 0 0 .437.689 2.562 2.562 0 0 0 1.561.808 3.36 3.36 0 0 0 .51-.052 2.764 2.764 0 0 1 .306-.034V21zM21 15.596c-.171.03-.36.046-.45.06a2.283 2.283 0 0 1-.366.04c-.295 0-.69-.347-.952-.577a1.218 1.218 0 0 1-.197-.36c-.135-.313-.361-.839-.962-.839a1.464 1.464 0 0 0-.981.383.578.578 0 0 1-.41.185.711.711 0 0 1-.22-.08 1.405 1.405 0 0 0-.61-.165.987.987 0 0 0-1.079.869v.695c0 .09-.046.15-.216.32a1.345 1.345 0 0 0-.485.975 1.06 1.06 0 0 0 .33.675c.033.038.079.093.101.097a1.71 1.71 0 0 1-.41.147c-.41.113-1.096.302-1.096 1.054a1.122 1.122 0 0 0 .294.675l.08.107c-.044.114-.128.303-.217.505-.096.221-.194.45-.27.638h-2.477v-.024a2.118 2.118 0 0 1 .17-.755l.048-.14a2.708 2.708 0 0 0 .173-.922c0-.805-.81-.994-1.294-1.107l-.429-.1c-.16-.319-.081-.448.33-.859a1.78 1.78 0 0 0 .68-1.25 1.107 1.107 0 0 0-.88-1.172 1.502 1.502 0 0 0-.79.127.878.878 0 0 1-.36.084.258.258 0 0 1-.144-.036.9.9 0 0 1 .158-.44 1.755 1.755 0 0 0 .27-.88 2.126 2.126 0 0 0-.086-.563 1.236 1.236 0 0 1-.056-.329.4.4 0 0 1 .356-.428c.145 0 .228.109.452.509a1.33 1.33 0 0 0 1.26.666c.956 0 1.567-1.076 1.567-1.816 0-.105.074-.215.144-.215.078 0 .146.045.292.156a1.356 1.356 0 0 0 .85.342 1.408 1.408 0 0 0 1.234-.921 1.372 1.372 0 0 1 .446-.56 2.01 2.01 0 0 0 .748-2.418c.046-.075.15-.184.141-.2a1.091 1.091 0 0 0 .943-.297 1.224 1.224 0 0 0 .156-1.09.946.946 0 0 1-.027-.264.925.925 0 0 1 .26-.278 1.34 1.34 0 0 0 .59-1.029 1.374 1.374 0 0 0-.22-.706.54.54 0 0 1-.103-.255c0-.051.101-.373.921-.818L18.231 3H21zM3 3h13.709a1.277 1.277 0 0 0-.347.83 1.375 1.375 0 0 0 .221.71.538.538 0 0 1 .102.251c0 .085-.064.153-.266.326a1.578 1.578 0 0 0-.536.687 1.085 1.085 0 0 0-.054.343 2.152 2.152 0 0 0 .05.388c.018.098.053.28.089.28a.49.49 0 0 1-.217.011 1.15 1.15 0 0 0-.84.438.972.972 0 0 0-.27.868c.151.742.151 1.188-.282 1.421a2.138 2.138 0 0 0-.812.92c-.214.38-.283.451-.429.451-.079 0-.146-.045-.293-.156a1.35 1.35 0 0 0-.849-.342 1.106 1.106 0 0 0-1.068 1.139c0 .298-.278.892-.644.892-.346 0-.414-.124-.465-.216a1.45 1.45 0 0 0-1.246-.96 1.32 1.32 0 0 0-1.28 1.353 2.126 2.126 0 0 0 .086.563 1.234 1.234 0 0 1 .056.328.9.9 0 0 1-.158.44 1.754 1.754 0 0 0-.27.881 1.02 1.02 0 0 0 1.068.96 1.788 1.788 0 0 0 .695-.146.808.808 0 0 1 .323-.084h.007a.496.496 0 0 1 .08.267c0 .176-.154.343-.407.596a1.52 1.52 0 0 0-.505 1.928 1.413 1.413 0 0 0 1.045.585c.184.042.525.121.58.207a1.807 1.807 0 0 1-.121.621l-.046.13a2.985 2.985 0 0 0-.223 1.066V21H3z"
                />
                <path fill="none" d="M0 0h24v24H0z" />
            </svg>
        ),
    },
];

const ControlPanel: React.FC = () => {
    const dispatch = useDispatch();
    const activeTrend = useSelector(activeTrendSelector);
    const isMobile = useSelector(isMobileSeletor);
    const activeViewMode = useSelector(activeViewModeSelector);

    const getTitleText = () => {
        const title = (
            <span
                className="avenir-bold"
                style={{
                    fontSize: '14.5px',
                }}
            >
                Esri CovidPulse &nbsp;--&nbsp; United States novel coronavirus
                trend lines, since February
            </span>
        );

        const dataSource = (
            <span
                className="avenir-light"
                style={{
                    fontSize: '12px',
                    // 'marginRight': '12px',
                }}
            >
                data: Johns Hopkins University, Esri
            </span>
        );

        const content = !isMobile ? (
            <div>
                <div> {title} </div>
                <div className="text-right"> {dataSource} </div>
            </div>
        ) : (
            <div>
                {title}
                &nbsp;&nbsp;
                {dataSource}
            </div>
        );

        return (
            <div
                style={{
                    backgroundColor: ThemeStyle['theme-color-red'],
                    color: ThemeStyle['theme-color-khaki-bright'],
                    // 'height': isMobile ? 'auto' : '20px',
                    lineHeight: '16px',
                    width: '100%',
                    // 'textAlign': 'center',
                    // 'maxWidth': isMobile ? 'auto': '540px',
                    padding: '.5rem',
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {content}
            </div>
        );
    };

    const getSwitchBtns = () => {
        return SwitchBtnData.map((d) => {
            const { value, label } = d;

            return (
                <div
                    key={value}
                    style={{
                        width: isMobile ? 'auto' : '160px',
                        flexGrow: isMobile ? 1 : 0,
                        height: '100%',
                        color: ThemeStyle['theme-color-red'],
                        backgroundColor:
                            activeTrend === value
                                ? ThemeStyle['theme-color-khaki-bright']
                                : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        borderBottom: `solid 4px ${
                            activeTrend === value
                                ? ThemeStyle['theme-color-red']
                                : 'transparent'
                        }`,
                        borderRight: `solid 1px #E0D8C1`,
                        cursor: 'pointer',
                        textAlign: 'center',
                    }}
                    onClick={() => {
                        dispatch(activeTrendUpdated(value));
                        updateTrendTypeInURLHashParams(value);
                    }}
                >
                    <span
                        className={`avenir-bold`}
                        style={{
                            fontSize: '12px',
                        }}
                    >
                        {label}
                    </span>
                </div>
            );
        });
    };

    const getInfoBtn = () => {
        return (
            <div
                style={{
                    width: '60px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
                onClick={() => {
                    dispatch(isAboutModalOpenToggled());
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    fill={ThemeStyle['theme-color-khaki-dark']}
                >
                    <path d="M12.5 7.5a1 1 0 1 1 1-1 1.002 1.002 0 0 1-1 1zM13 18V9h-2v1h1v8h-1v1h3v-1zm9.8-5.5A10.3 10.3 0 1 1 12.5 2.2a10.297 10.297 0 0 1 10.3 10.3zm-1 0a9.3 9.3 0 1 0-9.3 9.3 9.31 9.31 0 0 0 9.3-9.3z" />
                    <path fill="none" d="M0 0h24v24H0z" />
                </svg>
            </div>
        );
    };

    const getViewToggleBtns = () => {
        const viewToogleBtns = ViewToggleBtns.map(({ value, icon }) => {
            const isActive = activeViewMode === value;

            return (
                <div
                    key={value}
                    onClick={() => {
                        dispatch(updateActiveMode(value));
                    }}
                    style={{
                        height: '50%',
                        width: '50px',
                        padding: '10px',
                        boxSizing: 'border-box',
                        backgroundColor: isActive
                            ? ThemeStyle['theme-color-khaki-bright']
                            : ThemeStyle['theme-color-khaki'],
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: isActive
                            ? `4px solid ${ThemeStyle['theme-color-red']}`
                            : `4px solid transparent`,
                        borderTop: `solid 1px #E0D8C1`,
                    }}
                >
                    {icon}
                </div>
            );
        });

        return (
            <div
                className="margin-right-half"
                style={{
                    boxShadow: `0 0 8px 2px ${ThemeStyle["floating-panel-box-shadow"]}`,
                    cursor: 'pointer',
                }}
            >
                {viewToogleBtns}
            </div>
        );
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                left: isMobile ? '10px' : 'unset',
            }}
        >
            <div
                style={{
                    display: 'flex',
                }}
            >
                {getViewToggleBtns()}

                <div
                    style={{
                        boxShadow: `0 0 10px 2px ${ThemeStyle["floating-panel-box-shadow"]}`,
                    }}
                >
                    {getTitleText()}

                    <div
                        style={{
                            display: 'flex',
                            height: '60px',
                            width: '100%',
                            boxSizing: 'border-box',

                            backgroundColor: ThemeStyle['theme-color-khaki'],
                        }}
                    >
                        {getSwitchBtns()}
                        {getInfoBtn()}
                    </div>
                </div>
            </div>

            {
                activeViewMode === 'map' ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <TrendCategoriesToggle />
                    </div>
                ) : null
            }
        </div>
    );
};

export default ControlPanel;
