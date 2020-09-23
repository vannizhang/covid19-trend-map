import './style.scss';

import React, { useContext, useState, useEffect, useMemo } from 'react';

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
import { Covid19TrendData, Covid19TrendDataWithLatestNumbers, PathFrame } from 'covid19-trend-map';

import {
    HeaderHeight
} from './Header';

type Pros = {
    data: Covid19TrendDataWithLatestNumbers[];
    frame:PathFrame;
    scrollToBottomHandler?:()=>void;
}

const GridList:React.FC<Pros> = ({
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

    const getSparklines = ()=>{

        const sparklines = data.map((d, i)=>{
            // console.log(d);

            const { attributes } = d;

            return (
                <Sparkline 
                    key={attributes.FIPS}
                    path={d.newCases.path}
                    color={ThemeStyle["theme-color-red"]}
                    frame={frame}
                />
            );
        })

        return sparklines;
    };

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
                        {getSparklines()}
                    </div>
                </div>
            </div>
        </div>

    );
}


const GridListContainer = () => {
    // const dispatch = useDispatch();

    const { 
        covid19USCountiesData, 
        covid19TrendData4USCountiesWithLatestNumbers
    } = useContext(AppContext);

    const [ sparklinesData, setSparklinesData ] = useState<Covid19TrendDataWithLatestNumbers[]>([]);

    const loadSparklinesData = (endIndex?:number)=>{

        endIndex = endIndex || sparklinesData.length + 200 <= sortedData.length 
            ? sparklinesData.length + 200 
            : sparklinesData.length;

        const featuresSet = sortedData.slice(0, endIndex);
        
        setSparklinesData(featuresSet);
    };

    const getFrame = ()=>{
        const { frames } = covid19USCountiesData;
        // console.log(frames);
        return frames.newCases;
    }

    const sortedData = useMemo(()=>{
        const sortedFeatures = [...covid19TrendData4USCountiesWithLatestNumbers].sort((a, b)=>{
            return b.attributes.NewDeaths - a.attributes.NewDeaths
        });
        // console.log('sortedFeatures', sortedFeatures);
        
        return sortedFeatures;
    }, []);

    useEffect(()=>{
        loadSparklinesData(200);
    }, [sortedData]);

    return (
        <GridList
            data={sparklinesData}
            frame={getFrame()}
            scrollToBottomHandler={loadSparklinesData}
        />
    )
}

export default GridListContainer
