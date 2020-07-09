import axios from 'axios';

import {
    csvToArray
} from './csv';

const CSSECovid19TimeSeriesCsv = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv';

type USCovid19ConfirmedCases = {
    lat: number,
    lon: number,
    county: string,
    state: string,
    confirmed_cases: number[]
}

export const get7DaysAve = async(): Promise<USCovid19ConfirmedCases[]>=>{

    const rawCsv = await axios.get(CSSECovid19TimeSeriesCsv);

    const csvRows = csvToArray(rawCsv.data);

    // const headers = csvRows[0];

    const rows = csvRows.slice(1);

    const data: USCovid19ConfirmedCases[] = rows
        .map(row=>{

            const [
                UID,
                iso2,
                iso3,
                code3,
                FIPS,
                Admin2,
                Province_State,
                Country_Region,
                Lat,
                Long_,
                Combined_Key,
            ] = row.slice(0, 11);

            const covid19ConfirmedCases = row
                .slice(11)
                .map(d=>+d);

            return {
                lat: +Lat,
                lon: +Long_,
                county: Admin2,
                state: Province_State,
                confirmed_cases: covid19ConfirmedCases
            };

        })
        .filter(d=>{
            const isValdLatLon = d.lat && d.lon;
            return d.county && d.county !== 'Unassigned' && isValdLatLon
        })

    return data;
};

