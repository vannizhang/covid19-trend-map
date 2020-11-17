import './About.scss';
import React, { useEffect } from 'react';
import { modal, bus } from 'calcite-web/dist/js/calcite-web.min.js';

import { useSelector, useDispatch } from 'react-redux';

import {
    isAboutModalOpenSelector,
    isAboutModalOpenToggled,
} from '../../store/reducers/UI';

type Props = {
    ymax4confirmed: number;
    ymax4deaths: number;
};

const ModalID = 'about';

const About: React.FC<Props> = ({ ymax4confirmed, ymax4deaths }: Props) => {
    const dispatch = useDispatch();

    const isOpen = useSelector(isAboutModalOpenSelector);

    const closeBtnOnClicked = () => {
        dispatch(isAboutModalOpenToggled());
    };

    useEffect(() => {
        modal();
        // bus.emit('modal:open', {id: "about"})
    }, []);

    useEffect(() => {
        if (isOpen) {
            bus.emit('modal:open', { id: ModalID });
        } else {
            bus.emit('modal:close');
        }
    }, [isOpen]);

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
                <div className="close-btn" onClick={closeBtnOnClicked}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                    >
                        <path d="M18.01 6.697L12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z" />
                    </svg>
                </div>

                <div className="block-group block-group-3-up tablet-block-group-1-up phone-block-group-1-up">
                    <div className="block">
                        <h4 className="header-red avenir-bold">
                            NEW CASES PER CAPITA
                        </h4>
                        <p>
                            These trend lines mark the proportion of new cases,
                            normalized by population—useful for showing the
                            local fluctuations of case rates throughout the
                            outbreak. When viewing these local rates across the
                            map, comparative national and regional patterns of
                            transmission emerge.
                        </p>
                    </div>
                    <div className="block">
                        <h4 className="header-red avenir-bold">
                            DEATHS PER CAPITA
                        </h4>
                        <p>
                            These trend lines mark the proportion of new
                            covid-19 related deaths, normalized by population.
                            When viewing these local rates across the map,
                            comparative national and regional patterns of
                            transmission emerge. Given the incubation and
                            illness period of the virus, these lines may show a
                            similar pattern to NEW CASES PER CAPITA, though with
                            a time lag.
                        </p>
                    </div>
                    <div className="block">
                        <h4 className="header-red avenir-bold">
                            CUMULATIVE CASES
                        </h4>
                        <p>
                            These trend lines track the ongoing cumulative
                            number of cases, normalized by population. Because
                            it is a cumulative count, the lines will never trend
                            downward, except in the event of data-corrective
                            measures (see SOURCES, below).
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="header-khaki avenir-bold">
                        TREND CATEGORY COLORS
                    </h4>
                    <p>
                        When the Trend Category option is selected, county trend
                        lines are rendered in a color corresponding to their
                        statistically-determined “
                        <a
                            href="https://urbanobservatory.maps.arcgis.com/apps/MapSeries/index.html?appid=ad46e587a9134fcdb43ff54c16f8c39b"
                            target="_blank"
                            rel="noreferrer"
                        >
                            trend summary
                        </a>
                        ”, created by Charlie Frye. Find the full methodology{' '}
                        <a
                            href="https://www.arcgis.com/home/item.html?id=a16bb8b137ba4d8bbe645301b80e5740"
                            target="_blank"
                            rel="noreferrer"
                        >
                            here
                        </a>
                        .
                    </p>
                </div>

                <div>
                    <h4 className="header-khaki avenir-bold">
                        ABOUT THE Y-AXIS
                    </h4>
                    <p>
                        The y-axis of chart lines are consistent within each of
                        the categories so place-to-place comparisons can be
                        visualized—except for rare outlier counties. Outlier
                        counties are constrained by a scaled y-axis.
                        Specifically, outliers are defined for NEW CASES PER
                        CAPITA as counties with greater than 200 cases per
                        100,000 population; DEATHS PER CAPITA outliers are
                        defined as counties with numbers of weekly deaths that
                        are two standard deviations (currently a rate of{' '}
                        {ymax4deaths} per 10 million population) higher than the
                        national average; CUMULATIVE CASES outliers are defined
                        as counties with counts that are two standard deviations
                        above (currently {ymax4confirmed}) the national mean.
                    </p>
                </div>

                <div className='trailer-1'>
                    <h4 className="header-khaki avenir-bold">
                        ABOUT THE GRID VIEW SORT OPTIONS
                    </h4>
                    <div>
                        The Grid View provides six options by which to sort the state and county trend lines. They are:
                    </div>

                    <div>
                        <span className='avenir-demi'>100-Day Case Fatality Rate: </span>
                        <span>The simple ratio of deaths to cases over the past 100 days. Counties with no deaths are omitted from this list.</span>
                    </div>

                    <div>
                        <span className='avenir-demi'>Overall Case Fatality Rate:</span>
                        <span>The simple ratio of deaths to cases since March, 2020. Counties with no deaths are omitted from this list.</span>
                    </div>

                    <div>
                        <span className='avenir-demi'>Total Cases per Capita:</span>
                        <span>The ratio of cumulative case counts to population.</span>
                    </div>

                    <div>
                        <span className='avenir-demi'>Total Deaths per Capita: </span>
                        <span>The ration of deaths to population.</span>
                    </div>

                    <div>
                        <span className='avenir-demi'>Total Cases: </span>
                        <span>The total number of cases since March, 2020.</span>
                    </div>

                    <div>
                        <span className='avenir-demi'>Total Deaths:</span>
                        <span>The total number of deaths since March, 2020.</span>
                    </div>
                </div>

                <div>
                    <h4 className="header-khaki avenir-bold">SOURCES</h4>
                    <p>
                        These counts are sourced from the Johns Hopkins
                        University CSSE feature service of daily{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://www.arcgis.com/home/item.html?id=4cb598ae041348fb92270f102a6783cb"
                        >
                            US County Cases
                        </a>{' '}
                        since March 1st, 2020, and normalized into
                        population-normalized rates using the population
                        attribute also provided in the JHU service. Care has
                        been taken to note, via county tooltip, when state
                        reporting structures have impeded the Johns Hopkins
                        University effort to aggregate this data in an ongoing
                        fashion. Please refer to their{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://coronavirus.jhu.edu/us-map-faq"
                        >
                            frequently asked questions
                        </a>{' '}
                        for more context around this data. The Khaki basemap is{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://livingatlas.arcgis.com/en/browse/#d=2&amp;q=khaki"
                        >
                            available via Living Atlas
                        </a>
                        . Learn more about sparklines as a data visualization
                        tool{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=000AIr"
                        >
                            here
                        </a>
                        .
                    </p>
                </div>

                <div>
                    <h4 className="header-khaki avenir-bold">CREATORS</h4>
                    <p>
                        This application was created by{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://github.com/vannizhang/"
                        >
                            Jinnan Zhang
                        </a>{' '}
                        and{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://adventuresinmapping.com/"
                        >
                            John Nelson
                        </a>
                        , of Esri, with help from{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://github.com/ycabon"
                        >
                            Yann Cabon
                        </a>{' '}
                        and Fang Li, inspired by the{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://datagistips.hypotheses.org/488"
                        >
                            trend line maps of Mathieu Rajerison
                        </a>{' '}
                        and the{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://twitter.com/rileydchampine/status/1243552850728411143"
                        >
                            local 1918 flu charts of Riley D. Champine
                        </a>
                        . We are not medical professionals but saw a need for a
                        visual sense of local rates and trends and created this
                        primarily as a resource for ourselves but are making it
                        available to the public in the event that it is a
                        helpful resource for understanding patterns. We make no
                        claims of officiality and share it only as a reference.
                        For more geographic resources, please visit the{' '}
                        <a
                            href="https://www.esri.com/en-us/covid-19/overview"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Esri COVID-19 hub.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
