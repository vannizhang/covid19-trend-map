import React, { useContext } from 'react';

import { 
    useDispatch, 
    useSelector 
} from 'react-redux';

import {
    isGridListVisibleSelector,
    isGridListVisibleToggled
} from '../../store/reducers/UI'

import {
    AppContext 
} from '../../context/AppContextProvider';
import { ThemeStyle } from '../../AppConfig';

import Sparkline from './Sparkline';
import { Covid19TrendData, PathFrame } from 'covid19-trend-map';

type Pros = {
    visible: boolean;
    data: Covid19TrendData[];
    frame:PathFrame;
}

const GridList:React.FC<Pros> = ({
    visible,
    data,
    frame
}) => {

    const getHeader = ()=>{
        return (
            <div
                style={{
                    'width': '100%',
                    'height': '120px',
                    'backgroundColor': ThemeStyle["theme-color-khaki"]
                }}
            ></div>
        )
    };

    const getContent = ()=>{

        const sparklines = data.map((d, i)=>{
            // console.log(d);
            return (
                <Sparkline 
                    key={i}
                    path={d.newCases.path}
                    color={ThemeStyle["theme-color-red"]}
                    frame={frame}
                />
            );
        })

        return (
            <div
                style={{
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': '100%',
                    'height': '100%',
                    'paddingTop': '120px',
                    'paddingBottom': '60px',
                    'boxSizing': 'border-box',
                    'overflowY': 'auto', 
                }}
            >
                <div className='grid-container'>
                    <div className='column-24 leader-2'>
                        <div
                            style={{
                                'display': 'flex',
                                'flexWrap': 'wrap',
                                'justifyContent': 'center'
                            }}
                        >
                            {sparklines}
                        </div>
                    </div>
                </div>
            </div>

        )
    };

    return visible ? (
        <div
            style={{
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'bottom': 0,
                'right': 0,
                'backgroundColor': ThemeStyle["theme-color-khaki-bright"],
                'color': ThemeStyle["theme-color-red"],
            }}
        >
            { getHeader() }
            { getContent() }
        </div>
    ) : null;
}


const GridListContainer = () => {
    const dispatch = useDispatch();

    const visible = useSelector(isGridListVisibleSelector);

    const { 
        covid19USCountiesData, 
        covid19LatestNumbers
    } = useContext(AppContext);

    const getData = ()=>{
        const { features, frames } = covid19USCountiesData;
        return features.slice(0, 200);
    };

    const getFrame = ()=>{
        const { frames } = covid19USCountiesData;
        // console.log(frames);
        return frames.newCases;
    }

    return (
        <GridList 
            visible={visible}
            data={getData()}
            frame={getFrame()}
        />
    )
}

export default GridListContainer
