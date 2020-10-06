import './style.scss';

import React, {
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from 'react';

import { useDispatch, useSelector } from 'react-redux';

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
    queryCountyData
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
    // scrollToBottomHandler?: () => void;
    onHoverHandler: (FIPS:string, tooltipPosition: TooltipPosition)=>void;
    onClickHandler: (FIPS: string)=>void;
};

const GridList: React.FC<Props> = ({
    activeTrend,
    data,
    frame,
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
        const sparklines = data.map((d) => {
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
            <div className="column-24 leader-0">
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        paddingTop: 60
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
    } = useContext(AppContext);

    const activeTrend = useSelector(activeTrendSelector);

    const sortField = useSelector(gridListSortFieldSelector);

    const sortOrder = useSelector(gridListSortOrderSelector);

    const [sparklinesData, setSparklinesData] = useState<
        Covid19TrendDataWithLatestNumbers[]
    >([]);

    const sortedData = useMemo(() => {
        let sortedFeatures = [
            ...covid19TrendData4USCountiesWithLatestNumbers,
        ];

        if(sortField === 'CaseFatalityRate' || sortField === 'CaseFatalityRate100Day'){
            sortedFeatures = sortedFeatures.filter(d=>d.attributes.Deaths > 0 && d.attributes.CaseFatalityRate100Day > 0)
        }

        sortedFeatures.sort((a, b) => {
            return sortOrder === 'descending' 
                ? b.attributes[sortField] - a.attributes[sortField]
                : a.attributes[sortField] - b.attributes[sortField];
        });
        // console.log('sortedFeatures', sortedFeatures);

        return sortedFeatures;
    }, [sortField, sortOrder]);

    const loadSparklinesData = (endIndex?: number) => {
        console.log('calling loadSparklinesData', endIndex)
        if (!endIndex) {
            endIndex =
                sparklinesData.length + FeatureSetSize <= sortedData.length
                    ? sparklinesData.length + FeatureSetSize
                    : sparklinesData.length;
        }

        const featuresSet = sortedData.slice(0, endIndex);

        setSparklinesData(featuresSet);
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
    }, [sortedData]);

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
                data={sparklinesData}
                frame={getFrame()}
                // scrollToBottomHandler={loadSparklinesData}
                onHoverHandler={(FIPS, tooltipPosition)=>{
                    // console.log(FIPS, tooltipPosition);

                    const stateFIPS = FIPS && tooltipPosition ? FIPS.substr(0,2) : null;
                    const stateAbbr = getStateAbbrev(stateFIPS);
                    const tooltipData = covid19LatestNumbers[FIPS];
                    dispatch(updateTooltipData(tooltipData));
                    dispatch(tooltipPositionChanged(tooltipPosition));
                    dispatch(state2highlightInOverviewMapUpdated(stateAbbr));
                    dispatch(isOverviewMapVisibleToggled())
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
