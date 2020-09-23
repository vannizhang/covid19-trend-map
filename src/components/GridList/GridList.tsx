import './style.scss';

import React, { useContext, useState, useEffect } from 'react';

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

const HeaderHeight = 155;

type Pros = {
    visible: boolean;
    data: Covid19TrendData[];
    frame:PathFrame;
    scrollToBottomHandler?:()=>void;
}

const GridList:React.FC<Pros> = ({
    visible,
    data,
    frame,
    scrollToBottomHandler
}) => {

    const sparklinesContainerRef = React.createRef<HTMLDivElement>();

    const onScrollHandler = ()=>{

        if(!scrollToBottomHandler){
            return;
        }

        const sidebarDiv = sparklinesContainerRef.current;

        if( (sidebarDiv.scrollHeight - sidebarDiv.scrollTop) <= sidebarDiv.clientHeight ){
            // console.log('hit to bottom');
            scrollToBottomHandler();
        }
    };

    const getHeader = ()=>{
        return (
            <div
                style={{
                    'width': '100%',
                    'height': HeaderHeight,
                    'backgroundColor': ThemeStyle["theme-color-khaki"]
                }}
            ></div>
        )
    };

    const getSparklines = ()=>{

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
                ref={sparklinesContainerRef}
                className='fancy-scrollbar'
                style={{
                    'width': '100%',
                    'height': `calc(100% - ${HeaderHeight}px)`,
                    'paddingBottom': '60px',
                    'boxSizing': 'border-box',
                    'overflowY': 'auto', 
                }}
                onScroll={onScrollHandler}
            >
                <div className='grid-container'>
                    <div className='column-19 center-column leader-2'>
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
            { getSparklines() }
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

    const [ sparklinesData, setSparklinesData ] = useState<Covid19TrendData[]>([])

    const loadSparklinesData = ()=>{
        const { features } = covid19USCountiesData;

        const endIndex = sparklinesData.length + 200 <= features.length 
            ? sparklinesData.length + 200 
            : sparklinesData.length;

        const featuresSet = features.slice(0, endIndex);
        
        setSparklinesData(featuresSet);
    };

    const getFrame = ()=>{
        const { frames } = covid19USCountiesData;
        // console.log(frames);
        return frames.newCases;
    }

    useEffect(()=>{
        loadSparklinesData();
    }, []);

    return (
        <GridList 
            visible={visible}
            data={sparklinesData}
            frame={getFrame()}
            scrollToBottomHandler={loadSparklinesData}
        />
    )
}

export default GridListContainer
