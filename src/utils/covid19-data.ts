import axios from 'axios';

import {
    csvToArray
} from './csv';

const CSSECovid19TimeSeriesCsv = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv';

export const get7DaysAve = async()=>{

    const rawCsv = await axios.get(CSSECovid19TimeSeriesCsv);

    const convertedData = csvToArray(rawCsv.data);

    console.log(convertedData);
};

