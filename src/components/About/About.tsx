import './About.scss';
import React, {
    useEffect
} from 'react';
import { modal, bus } from 'calcite-web/dist/js/calcite-web.min.js';

import {
    useSelector,
    useDispatch
} from 'react-redux';

import {
    isAboutModalOpenSelector,
    isAboutModalOpenToggled
} from '../../store/reducers/UI';

import {
    numberFns
} from 'helper-toolkit-ts'

type Props = {
    ymax4confirmed: number;
    ymax4deaths: number;
}

const ModalID = 'about';

const About:React.FC<Props> = ({
    ymax4confirmed,
    ymax4deaths
}) => {

    const dispatch = useDispatch();

    const isOpen = useSelector(isAboutModalOpenSelector);

    const closeBtnOnClicked = ()=>{
        dispatch(isAboutModalOpenToggled())
    }

    useEffect(()=>{
        modal();
        // bus.emit('modal:open', {id: "about"})
    }, [])

    useEffect(()=>{

        if(isOpen){
            bus.emit('modal:open', {id: ModalID})
        } else {
            bus.emit('modal:close')
        }
        
    }, [ isOpen ])

    return (
        <div
            className="js-modal modal-overlay about-modal"
            data-modal={ModalID}
        >
            <div
                className="modal-content column-20"
                role="dialog"
                aria-labelledby="modal"
            >
                <div className='close-btn' onClick={closeBtnOnClicked}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24"><path d="M18.01 6.697L12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z"/></svg>
                </div>

                <div className='block-group block-group-3-up tablet-block-group-1-up phone-block-group-1-up'>
                    <div className='block'>
                        <h4 className='header-red avenir-bold'>CASES PER CAPITA</h4>
                        <p>These trend lines mark the proportion of new cases, per 100,000 population, per week—useful for showing the local fluctuations of case rates throughout the outbreak. When viewing these local rates across the map, comparative national and regional patterns of transmission emerge.</p>
                    </div>
                    <div className='block'>
                        <h4 className='header-red avenir-bold'>CUMULATIVE CASES</h4>
                        <p>These trend lines track the ongoing cumulative number of cases, per 100,000 population, per week. Because it is a cumulative count, the lines will never trend downward, though their rate of increase over time can provide an impression of the local history of the outbreak. An upward-bending line indicates a slow start and rapidly rising outbreak. A generally diagonal line indicates a consistent rate of transmission. An s-shaped line indicates a local “flattening of the curve” associated with a decrease in local cases.</p>
                    </div>
                    <div className='block'>
                        <h4 className='header-red avenir-bold'>DEATHS</h4>
                        <p>These trend lines track the ongoing cumulative number of deaths, per 100,000 population. Interpretations of these lines is consistent with the description of cases. Given the incubation and illness period of the virus, these lines will show a similar pattern to CASES, though with a time lag.</p>
                    </div>
                </div>

                <div>
                    <h4 className='header-khaki avenir-bold'>TREND CATEGORY COLORS</h4>
                    <p>When the Trend Category option is selected, county trend lines are rendered in a color corresponding to their statistically-determined “<a href="https://urbanobservatory.maps.arcgis.com/apps/MapSeries/index.html?appid=ad46e587a9134fcdb43ff54c16f8c39b" target="_blank">trend summary</a>”, created by Charlie Frye. Find the full methodology <a href="https://www.arcgis.com/home/item.html?id=a16bb8b137ba4d8bbe645301b80e5740" target="_blank">here</a>.</p>
                </div>

                <div>
                    <h4 className='header-khaki avenir-bold'>ABOUT THE Y-AXIS</h4>
                    <p>The y-axis of chart lines are consistent so place-to-place comparisons can be visualized, except for outlier counties; Outlier counties are given a scaled y-axis. Specifically, outliers are defined for CASES PER CAPITA as counties with greater than 200 cases per 100,000 population (Trousdale, TN, for <a href="https://en.wikipedia.org/wiki/Trousdale_Turner_Correctional_Center" target="_blank">instance</a>); CUMULATIVE CASES and DEATHS outliers are defined as counties with numbers over two standard deviations from the national mean, which is currently {numberFns.numberWithCommas(ymax4confirmed)} and {ymax4deaths}, respectively. These outlier county chart lines are given a fixed maximum height of 200 pixels.</p>
                </div>

                <div>
                    <h4 className='header-khaki avenir-bold'>SOURCES</h4>
                    <p>These counts are sourced from the Johns Hopkins University CSSE feature service of daily <a target='_blank' href="https://services9.arcgis.com/6Hv9AANartyT7fJW/ArcGIS/rest/services">US County Cases</a> since February 22, 2020, and normalized into population-normalized rates using the population attribute also provided in the JHU service. The Khaki basemap is <a target='_blank' href="https://livingatlas.arcgis.com/en/browse/#d=2&amp;q=khaki">available via Living Atlas</a>.</p>
                </div>

                <div>
                    <h4 className='header-khaki avenir-bold'>CREATORS</h4>
                    <p>This application was created by <a target='_blank' href="https://github.com/vannizhang/">Jinnan Zhang</a> and <a target='_blank' href="https://adventuresinmapping.com/">John Nelson</a>, of Esri, with help from <a target='_blank' href="https://github.com/ycabon">Yann Cabon</a> and Fang Li, inspired by the <a target='_blank' href="https://datagistips.hypotheses.org/488">trend line maps of Mathieu Rajerison</a> and the <a target='_blank' href="https://twitter.com/rileydchampine/status/1243552850728411143">local 1918 flu charts of Riley D. Champine</a>. We are not medical professionals but saw a need for a visual sense of local rates and trends and created this primarily as a resource for ourselves but are making it available to the public in the event that it is a helpful resource for understanding patterns. We make no claims of officiality and share it only as a reference. For more geographic resources, please visit the <a href="https://www.esri.com/en-us/covid-19/overview" target="_blank">Esri COVID-19 hub.</a></p>
                </div>
            </div>
            
        </div>
    )
}

export default About;
