import './About.scss';
import React, {
    useEffect
} from 'react';
import { modal, bus } from 'calcite-web/dist/js/calcite-web.min.js';

type Props = {
    isOpen?: boolean;
    closeBtnOnClicked: ()=>void;
}

const ModalID = 'about';

const About:React.FC<Props> = ({
    isOpen,
    closeBtnOnClicked
}) => {

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

                <div className='block-group block-group-3-up'>
                    <div className='block'>
                        <h4 className='header-red avenir-bold'>WEEKLY CASES</h4>
                        <p>These lines mark the weekly averages of new cases, per 100,000 population, per week—useful for showing the local fluctuations of cases throughout the outbreak. When seen together regional patterns emerge. The Y-axis of these charts are scaled to fit the maximum weekly increase when new cases are greater than 25 per 100,000. Please see the note on the Y-axis below for an explanation.</p>
                    </div>
                    <div className='block'>
                        <h4 className='header-red avenir-bold'>CASES</h4>
                        <p>These lines track the ongoing cumulative number of cases, per 100,000 population, per week. Because it is a cumulative count, the lines will never trend downward, though their rate of increase over time can provide an impression of the local history of the outbreak. An upward-bending line indicates a slow start and rapidly rising outbreak. A generally diagonal line indicates a consistent rate of transmission. An s-shaped line indicates a local “flattening of the curve” associated with a decrease in local cases. A stair-stepped line indicates multiple waves of transmission.</p>
                    </div>
                    <div className='block'>
                        <h4 className='header-red avenir-bold'>DEATHS</h4>
                        <p>These lines track the ongoing cumulative number of deaths, per 100,000 population. Interpretations of these lines is consistent with the description of cases, above. Given the incubation and illness period of the virus, this line will show a similar pattern, though with a lag, compared to cases.</p>
                    </div>
                </div>

                <div>
                    <h4 className='header-khaki avenir-bold'>ABOUT THE Y-AXIS</h4>
                    <p>Each trend line has a dynamic y-axis such that if the maximum rate of cases exceeds 25 cases per 100,000 population (quite high), then the height is compressed to fit into the rectangular bounds of the chart container. While this prevents a direct comparison between locations, it ensures that areas with very low populations (and therefore highly fluctuating case rates) do not by comparison suppress (to nearly flat) the rates of moderate and high-population areas. This compromise allows for a general visual reference of local trends while specific counts can be accessed when a location is selected.</p>
                </div>

                <div>
                    <h4 className='header-khaki avenir-bold'>SOURCES</h4>
                    <p>These counts are sourced from the Johns Hopkins University features service of <a href="https://services9.arcgis.com/6Hv9AANartyT7fJW/ArcGIS/rest/services">US County Cases</a> and normalized into rates using <a href="https://www.arcgis.com/home/item.html?id=99fd67933e754a1181cc755146be21ca">state</a> and <a href="https://www.arcgis.com/home/item.html?id=7566e0221e5646f99ea249a197116605">county</a> populations from the US Census Bureau accessed via <a href="https://livingatlas.arcgis.com/en/browse/#d=2&amp;q=usa%20population">Living Atlas</a>. The Khaki basemap is <a href="https://livingatlas.arcgis.com/en/browse/#d=2&amp;q=khaki">available via Living Atlas</a>.</p>
                </div>

                <div>
                    <h4 className='header-khaki avenir-bold'>CREATORS</h4>
                    <p>This application was created by <a href="https://github.com/vannizhang/">Jinnan Zhang</a> and <a href="https://adventuresinmapping.com/">John Nelson</a>, of Esri, with help from <a href="https://github.com/ycabon">Yann Cabon</a>, inspired by the <a href="https://datagistips.hypotheses.org/488">trend line maps of Mathieu Rajerison</a> and the <a href="https://twitter.com/rileydchampine/status/1243552850728411143">local 1918 flu charts of Riley D. Champine</a>. We are not medical professionals but saw a need for a visual sense of local rates and trends and created this primarily as a resource for ourselves but are making it available to the public in the event that it is a helpful resource for understanding patterns. We make no claims of officiality and share it only as a reference.</p>
                </div>
            </div>
            
        </div>
    )
}

export default About;
