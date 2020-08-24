import axios from 'axios';

import {
    Covid19CasesByTimeFeature
} from 'covid19-trend-map';

type FetchCovid19DataOptions = {
    countyFIPS?: string;
    stateName?: string;
}

const USCountiesCovid19CasesByTimeFeatureServiceURL = 'https://services9.arcgis.com/6Hv9AANartyT7fJW/ArcGIS/rest/services/USCounties_cases_V1/FeatureServer/1';

const cachedQueryResults: {
    [key:string]: Covid19CasesByTimeFeature[]
} = {};

export const FIPSCodes4NYCCounties = [ '36085', '36047', '36081', '36005', '36061' ];
const FIPSCode4NYCounty = '36061';
const FIPSCodes4OtherNYCCounties = FIPSCodes4NYCCounties.filter(FIPS=> FIPS !== FIPSCode4NYCounty);

export const fetchCovid19DataForNYCCounties = async():Promise<Covid19CasesByTimeFeature[]>=>{

    if(cachedQueryResults[FIPSCode4NYCounty]){
        return cachedQueryResults[FIPSCode4NYCounty];
    }

    const features4NYCCounties:{
        [key:string]: Covid19CasesByTimeFeature[]
    } = {};

    for(let i = 0, len = FIPSCodes4NYCCounties.length; i < len; i++){
        const countyFIPS = FIPSCodes4NYCCounties[i];
        features4NYCCounties[countyFIPS] = await fetchCovid19Data({ countyFIPS });
    }

    const NYCountyFeatures = features4NYCCounties[FIPSCode4NYCounty];

    // add numbers from all NYC Counties into NY County
    const features = NYCountyFeatures.map((feature, index)=>{

        FIPSCodes4OtherNYCCounties.forEach(FIPS=>{

            // get items for each NYC County ast specific date
            const results = features4NYCCounties[FIPS];

            if(results && results[index]){
                const item = results[index];
                feature.attributes.Confirmed += item.attributes.Confirmed;
                feature.attributes.NewCases += item.attributes.NewCases;
                feature.attributes.Deaths += item.attributes.Deaths;
                feature.attributes.Population += item.attributes.Population;
                feature.attributes.NewDeaths += item.attributes.NewDeaths;
            }
        })

        return feature;
    });

    cachedQueryResults[FIPSCode4NYCounty] = features;

    console.log(features);

    return features;
}

export const fetchCovid19Data = async({
    countyFIPS,
    stateName
}:FetchCovid19DataOptions):Promise<Covid19CasesByTimeFeature[]>=>{

    const key4CachedResults = countyFIPS || stateName;

    if(cachedQueryResults[key4CachedResults]){
        return cachedQueryResults[key4CachedResults];
    }

    const requestUrl = `${USCountiesCovid19CasesByTimeFeatureServiceURL}/query`;

    const params = countyFIPS
        ? {
            f: 'json',
            where: `FIPS='${countyFIPS}'`,
            outFields: 'dt,Confirmed,Deaths,NewCases,Population',
            orderByFields: 'dt'
        }
        : {
            f: 'json',
            where: `ST_Name='${stateName}'`,
            outFields: '*',
            orderByFields: 'dt',
            groupByFieldsForStatistics: 'ST_Name,dt',
            outStatistics: JSON.stringify([
                {
                    "statisticType": "sum",
                    "onStatisticField": "Confirmed", 
                    "outStatisticFieldName": "Confirmed"
                },
                {
                    "statisticType": "sum",
                    "onStatisticField": "Deaths", 
                    "outStatisticFieldName": "Deaths"
                },
                {
                    "statisticType": "sum",
                    "onStatisticField": "NewCases",
                    "outStatisticFieldName": "NewCases"
                },
                {
                    "statisticType": "sum",
                    "onStatisticField": "Population",
                    "outStatisticFieldName": "Population"
                }  
            ])
        };

    try {
        const { data } = await axios.get(requestUrl, { 
            params: new URLSearchParams(params)
        });

        if(data && data.features){
            // console.log(data.features)

            const features:Covid19CasesByTimeFeature[] = data.features.map((feature:Covid19CasesByTimeFeature, index:number)=>{
        
                const previousFeature = index > 0 
                    ? data.features[index - 1] 
                    : undefined;
        
                const newDeaths = previousFeature 
                    ? feature.attributes.Deaths - previousFeature.attributes.Deaths 
                    : 0;
        
                feature.attributes.NewDeaths = newDeaths;

                return feature
            });

            // console.log(features)

            cachedQueryResults[key4CachedResults] = features;

            return features;
        }

    } catch(err){
        console.error(err);
    }

    return null;
};