import React, { useEffect, useState } from 'react'
import { modal, bus } from 'calcite-web/dist/js/calcite-web.min.js';

const ModalID = 'message';

const MessageModal = () => {

    const [isOpen, setIsOpen] = useState(true);

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
            className="js-modal modal-overlay about-modal is-active"
            data-modal={ModalID}
        >
            <div
                className="modal-content column-12"
                role="dialog"
                aria-labelledby="modal"
            >
                <div className="close-btn" onClick={setIsOpen.bind(null, false)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                    >
                        <path d="M18.01 6.697L12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z" />
                    </svg>
                </div>

                <div>
                    <p className='text-theme-red font-size-0 avenir-bold'>
                        On March 10, 2023, the Johns Hopkins Coronavirus Resource Center ceased collecting and reporting of global COVID-19 data. 
                    </p>

                    <p>
                        For updated cases, deaths, and vaccine data please visit the following sources:
                    </p>

                    <ul>
                        <li>Global - <a href="https://www.who.int/" target="_blank">World Health Organization (WHO)</a></li>
                        <li>U.S. - <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html" target="_blank">U.S. Centers for Disease Control and Prevention (CDC)</a></li>
                    </ul>

                    <p>
                        For more information, visit the <a href="https://coronavirus.jhu.edu/" target="_blank">Johns Hopkins Coronavirus Resource Center.</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MessageModal