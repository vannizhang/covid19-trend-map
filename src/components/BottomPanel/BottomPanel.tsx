import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeStyle } from '../../AppConfig';
import { AppContext } from '../../context/AppContextProvider';

import {
    resetQueryData,
    covid19DataByLocationSelector,
    covid19DataOnLoadingSelector,
    queryLocationSelector,
} from '../../store/reducers/Covid19Data';

import ChartPanel from '../ChartPanel/ChartPanel';
import SummaryInfoPanel from '../SummaryInfoPanel/SummaryInfoPanel';

type Props = {
    showLoadingIndicator: boolean;
    children: React.ReactNode;
};

const BottomPanel: React.FC<Props> = ({
    showLoadingIndicator,
    children,
}: Props) => {
    const getLoadingIndicator = () => {
        return (
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '225px',
                }}
            >
                <div className="loader is-active">
                    <div className="loader-bars"></div>
                    {/* <div className="loader-text">Loading...</div> */}
                </div>
            </div>
        );
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: '15px',
                right: '15px',
                bottom: '25px',
                boxSizing: 'border-box',
                boxShadow: `0 0 10px 2px ${ThemeStyle['floating-panel-box-shadow']}`,
                backgroundColor: ThemeStyle['theme-color-khaki-bright'],
                zIndex: 5
            }}
        >
            {showLoadingIndicator ? getLoadingIndicator() : children}
        </div>
    );
};

const BottomPanelContainer: React.FC = () => {
    const dispatch = useDispatch();

    const { covid19LatestNumbers } = useContext(AppContext)

    const covid19CasesByTimeQueryResults = useSelector(
        covid19DataByLocationSelector
    );

    const covid19CasesByTimeQueryLocation = useSelector(queryLocationSelector);

    const isLoading = useSelector(covid19DataOnLoadingSelector);

    return covid19CasesByTimeQueryResults || isLoading ? (
        <BottomPanel showLoadingIndicator={isLoading}>
            <SummaryInfoPanel
                locationName={
                    covid19CasesByTimeQueryLocation
                        ? covid19CasesByTimeQueryLocation.locationName
                        : undefined
                }
                data={
                    covid19CasesByTimeQueryResults
                        ? covid19CasesByTimeQueryResults.summaryInfo
                        : undefined
                }
                ranks={
                    covid19CasesByTimeQueryLocation 
                        ? covid19LatestNumbers[covid19CasesByTimeQueryLocation.FIPS].Ranks
                        : []
                }
                closeBtnOnClick={() => {
                    dispatch(resetQueryData());
                }}
            />

            <ChartPanel
                data={
                    covid19CasesByTimeQueryResults
                        ? covid19CasesByTimeQueryResults.features
                        : undefined
                }
            />
        </BottomPanel>
    ) : null;
};

export default BottomPanelContainer;
