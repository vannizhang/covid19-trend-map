import './style.scss';

import React, {
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from 'react';

import { useDispatch, useSelector, batch } from 'react-redux';

import {
    activeTrendSelector,
    gridListSortFieldSelector,
    gridListSortOrderSelector,
    isOverviewMapVisibleToggled,
    state2highlightInOverviewMapUpdated
} from '../../store/reducers/UI';

import {
    updateTooltipData,
    tooltipPositionChanged,
} from '../../store/reducers/Map';

import {
    queryCountyData,
    queryStateData,
    queryLocationSelector
} from '../../store/reducers/Covid19Data';

import { AppContext } from '../../context/AppContextProvider';

import { ThemeStyle } from '../../AppConfig';

import Sparkline from './Sparkline';
import {
    // Covid19TrendData,
    Covid19TrendDataWithLatestNumbers,
    Covid19TrendName,
    PathData,
    PathFrame,
} from 'covid19-trend-map';

import { HeaderHeight } from './Header';
import { TooltipPosition } from '../Tooltip/Tooltip';

import {
    getStateAbbrev
} from '../../utils/getStateName'

const FeatureSetSize = 300;
export const SparklineSize = 60;

type Props = {
    activeTrend: Covid19TrendName;
    data: Covid19TrendDataWithLatestNumbers[];
    frame: PathFrame;
    queryLocationFIPS: string;
    showTopBorder?: boolean;
    paddingTop?: number;
    title: string;
    // scrollToBottomHandler?: () => void;
    onHoverHandler: (FIPS:string, tooltipPosition: TooltipPosition)=>void;
    onClickHandler: (FIPS: string)=>void;
};

const GridList: React.FC<Props> = ({
    activeTrend,
    data,
    frame,
    queryLocationFIPS,
    showTopBorder,
    paddingTop,
    title,
    // scrollToBottomHandler,
    onHoverHandler,
    onClickHandler
}: Props) => {
    // const sparklinesContainerRef = React.createRef<HTMLDivElement>();

    // const onScrollHandler = () => {
    //     if (!scrollToBottomHandler) {
    //         return;
    //     }

    //     const sidebarDiv = sparklinesContainerRef.current;

    //     if (
    //         sidebarDiv.scrollHeight - sidebarDiv.scrollTop <=
    //         sidebarDiv.clientHeight
    //     ) {
    //         // console.log('hit to bottom');
    //         scrollToBottomHandler();
    //     }
    // };

    const getSparklines = () => {
        const sparklines = data.map((d, i) => {
            // console.log(d);

            const { attributes, confirmed, deaths, newCases } = d;

            const { FIPS } = attributes;

            const pathDataByTrendName: {
                [key in Covid19TrendName]: PathData;
            } = {
                confirmed: confirmed,
                death: deaths,
                'new-cases': newCases,
            };

            const pathData = pathDataByTrendName[activeTrend];

            const { path } = pathData;

            return (
                <Sparkline
                    key={FIPS}
                    path={path}
                    color={ThemeStyle['theme-color-red']}
                    backgroundColor={ FIPS === queryLocationFIPS ? '#DFD8C2' : undefined}
                    frame={frame}
                    size={SparklineSize}
                    onHoverHandler={(tooltipPosition)=>{
                        onHoverHandler(FIPS, tooltipPosition)
                    }}
                    onClickHandler={onClickHandler.bind(this, FIPS)}
                />
            );
        });

        return sparklines;
    };

    return (
        <div className="grid-container">
            <div className="column-14 center-column leader-0"
                style={{
                    borderTop: showTopBorder ? 'solid 1px #E8E2D3' : 'unset'
                }}
            >

                <div className='leader-1 trailer-1 text-center'>
                    <span 
                        className='font-size--3 text-theme-color-khaki avenir-demi'
                    >{title}</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        paddingTop: paddingTop || 30,
                        paddingBottom: 30,
                        
                    }}
                >
                    {getSparklines()}
                </div>
            </div>
        </div>
    );
};

const GridListContainer = () => {

    const sparklinesContainerRef = React.createRef<HTMLDivElement>();

    const dispatch = useDispatch();

    const {
        covid19LatestNumbers,
        covid19USCountiesData,
        covid19TrendData4USCountiesWithLatestNumbers,
        covid19TrendData4USStatesWithLatestNumbers
    } = useContext(AppContext);

    const activeTrend = useSelector(activeTrendSelector);

    const sortField = useSelector(gridListSortFieldSelector);

    const sortOrder = useSelector(gridListSortOrderSelector);

    const covid19CasesByTimeQueryLocation = useSelector(queryLocationSelector);

    const [sparklinesData4Counties, setSparklinesData4Counties] = useState<
        Covid19TrendDataWithLatestNumbers[]
    >([]);

    const sortData = (features:Covid19TrendDataWithLatestNumbers[]):Covid19TrendDataWithLatestNumbers[] => {
        let sortedFeatures = [
            ...features,
        ];

        // if(sortField === 'CaseFatalityRate' || sortField === 'CaseFatalityRate100Day'){
        //     sortedFeatures = sortedFeatures.filter(d=>d.attributes.Deaths > 0 && d.attributes.CaseFatalityRate100Day > 0)
        // }

        sortedFeatures.sort((a, b) => {
            return sortOrder === 'descending' 
                ? b.attributes[sortField] - a.attributes[sortField]
                : a.attributes[sortField] - b.attributes[sortField];
        });
        // console.log('sortedFeatures', sortedFeatures);

        return sortedFeatures;
    }

    const sortedData4Counties = useMemo(() => {

        return sortData([
            ...covid19TrendData4USCountiesWithLatestNumbers
        ]);

    }, [sortField, sortOrder]);

    
    const sortedData4States = useMemo(() => {

        return sortData([
            ...covid19TrendData4USStatesWithLatestNumbers
        ]);

    }, [sortField, sortOrder]);

    const loadSparklinesData = (endIndex?: number) => {
        console.log('calling loadSparklinesData', endIndex)
        if (!endIndex) {
            endIndex =
                sparklinesData4Counties.length + FeatureSetSize <= sortedData4Counties.length
                    ? sparklinesData4Counties.length + FeatureSetSize
                    : sparklinesData4Counties.length;
        }

        const featuresSet = sortedData4Counties.slice(0, endIndex);

        setSparklinesData4Counties(featuresSet);
    };

    const getFrame = useCallback(() => {
        const { frames } = covid19USCountiesData;

        const pathFrameByTrendName: {
            [key in Covid19TrendName]: PathFrame;
        } = {
            confirmed: frames.confirmed,
            death: frames.deaths,
            'new-cases': frames.newCases,
        };

        return pathFrameByTrendName[activeTrend];
    }, [activeTrend]);

    const onScrollHandler = () => {

        const conatinerDiv = sparklinesContainerRef.current;

        if (
            conatinerDiv.scrollHeight - conatinerDiv.scrollTop <=
            conatinerDiv.clientHeight
        ) {
            // console.log('hit to bottom');
            loadSparklinesData();
        }
    };

    useEffect(() => {
        const conatinerDiv = sparklinesContainerRef.current;
        conatinerDiv.scrollTo(0, 0);

        // reload sparklines data if sorted data is changed
        loadSparklinesData(FeatureSetSize);
    }, [sortedData4Counties]);

    return (
        <div
            ref={sparklinesContainerRef}
            className="fancy-scrollbar"
            style={{
                width: '100%',
                height: `calc(100% - ${HeaderHeight}px)`,
                paddingBottom: '60px',
                boxSizing: 'border-box',
                overflowY: 'auto',
            }}
            onScroll={onScrollHandler}
        >

            <GridList
                activeTrend={activeTrend}
                data={sortedData4States}
                frame={getFrame()}
                queryLocationFIPS={covid19CasesByTimeQueryLocation && covid19CasesByTimeQueryLocation.FIPS 
                    ? covid19CasesByTimeQueryLocation.FIPS 
                    : ''
                }
                paddingTop={5}
                title='STATE'
                // scrollToBottomHandler={loadSparklinesData}
                onHoverHandler={(FIPS, tooltipPosition)=>{
                    console.log(FIPS, tooltipPosition);

                    const stateFIPS = FIPS && tooltipPosition ? FIPS.substr(0,2) : null;
                    const stateAbbr = getStateAbbrev(stateFIPS);
                    const tooltipData = covid19LatestNumbers[FIPS];

                    batch(()=>{
                        dispatch(updateTooltipData(FIPS, tooltipData));
                        dispatch(tooltipPositionChanged(tooltipPosition));
                        dispatch(state2highlightInOverviewMapUpdated(stateAbbr));
                        dispatch(isOverviewMapVisibleToggled())
                    });

                }}
                onClickHandler={(FIPS)=>{
                    const data = covid19LatestNumbers[FIPS];

                    dispatch(queryStateData({
                        name: data.Name,
                        FIPS
                    }));
                }}
            />

            <GridList
                activeTrend={activeTrend}
                data={sparklinesData4Counties}
                frame={getFrame()}
                queryLocationFIPS={covid19CasesByTimeQueryLocation && covid19CasesByTimeQueryLocation.FIPS 
                    ? covid19CasesByTimeQueryLocation.FIPS 
                    : ''
                }
                // paddingTop={40}
                showTopBorder={true}
                title='COUNTY'
                // scrollToBottomHandler={loadSparklinesData}
                onHoverHandler={(FIPS, tooltipPosition)=>{
                    // console.log(FIPS, tooltipPosition);

                    const stateFIPS = FIPS && tooltipPosition ? FIPS.substr(0,2) : null;
                    const stateAbbr = getStateAbbrev(stateFIPS);
                    const tooltipData = covid19LatestNumbers[FIPS];

                    batch(()=>{
                        dispatch(updateTooltipData(FIPS, tooltipData));
                        dispatch(tooltipPositionChanged(tooltipPosition));
                        dispatch(state2highlightInOverviewMapUpdated(stateAbbr));
                        dispatch(isOverviewMapVisibleToggled())
                    });

                }}
                onClickHandler={(FIPS)=>{
                    const data = covid19LatestNumbers[FIPS];

                    dispatch(queryCountyData({
                        FIPS,
                        name: data.Name,
                    }));
                }}
            />
        </div>

    );
};

export default GridListContainer;
