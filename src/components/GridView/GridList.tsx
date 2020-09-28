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
    gridListSortOrderSelector
} from '../../store/reducers/UI';

import {
    updateTooltipData,
    tooltipPositionChanged,
} from '../../store/reducers/Map';

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

const FeatureSetSize = 300;
const SparklineSize = 60;

type Props = {
    activeTrend: Covid19TrendName;
    data: Covid19TrendDataWithLatestNumbers[];
    frame: PathFrame;
    scrollToBottomHandler?: () => void;
    onHoverHandler: (FIPS:string, tooltipPosition: TooltipPosition)=>void;
};

const GridList: React.FC<Props> = ({
    activeTrend,
    data,
    frame,
    scrollToBottomHandler,
    onHoverHandler
}: Props) => {
    const sparklinesContainerRef = React.createRef<HTMLDivElement>();

    const onScrollHandler = () => {
        if (!scrollToBottomHandler) {
            return;
        }

        const sidebarDiv = sparklinesContainerRef.current;

        if (
            sidebarDiv.scrollHeight - sidebarDiv.scrollTop <=
            sidebarDiv.clientHeight
        ) {
            // console.log('hit to bottom');
            scrollToBottomHandler();
        }
    };

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
                <div
                    key={FIPS}
                    style={{
                        position: 'relative',
                        width: SparklineSize,
                        height: SparklineSize,
                        margin: '.5rem',
                    }}
                >
                    <Sparkline
                        path={path}
                        color={ThemeStyle['theme-color-red']}
                        frame={frame}
                        size={SparklineSize}
                        onHoverHandler={(tooltipPosition)=>{
                            onHoverHandler(FIPS, tooltipPosition)
                        }}
                    />
                </div>
            );
        });

        return sparklines;
    };

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
            <div className="grid-container">
                <div className="column-24 leader-0">
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {getSparklines()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GridListContainer = () => {
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
        const sortedFeatures = [
            ...covid19TrendData4USCountiesWithLatestNumbers,
        ].sort((a, b) => {
            return sortOrder === 'descending' 
                ? b.attributes[sortField] - a.attributes[sortField]
                : a.attributes[sortField] - b.attributes[sortField];
        });
        // console.log('sortedFeatures', sortedFeatures);

        return sortedFeatures;
    }, [sortField, sortOrder]);

    const loadSparklinesData = (endIndex?: number) => {
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

    useEffect(() => {
        // reload sparklines data if sorted data is changed
        loadSparklinesData(FeatureSetSize);
    }, [sortedData]);

    return (
        <GridList
            activeTrend={activeTrend}
            data={sparklinesData}
            frame={getFrame()}
            scrollToBottomHandler={loadSparklinesData}
            onHoverHandler={(FIPS, tooltipPosition)=>{
                // console.log(FIPS, tooltipPosition);
                
                const tooltipData = covid19LatestNumbers[FIPS];
                dispatch(updateTooltipData('foobar', tooltipData));
                dispatch(tooltipPositionChanged(tooltipPosition));
            }}
        />
    );
};

export default GridListContainer;
