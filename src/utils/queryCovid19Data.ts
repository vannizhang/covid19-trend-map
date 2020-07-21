import axios from 'axios';

type Covid19CasesByTimeFeature = {
    attributes: {
        dt: string;
        Confirmed: number;
        Deaths: number;
        NewCases: number;
    }
};

const USCountiesCovid19CasesByTimeFeatureServiceURL = 'https://services9.arcgis.com/6Hv9AANartyT7fJW/ArcGIS/rest/services/USCounties_cases_V1/FeatureServer/1';

type FetchCovid19DataOptions = {
    countyFIPS?: string;
    stateName?: string;
}

export const fetchCovid19Data = async({
    countyFIPS,
    stateName
}:FetchCovid19DataOptions):Promise<Covid19CasesByTimeFeature[]>=>{

    const requestUrl = countyFIPS
        ? `${USCountiesCovid19CasesByTimeFeatureServiceURL}/query/?f=json&where=FIPS=${countyFIPS}&outFields=dt,Confirmed,Deaths,NewCases`
        : `${USCountiesCovid19CasesByTimeFeatureServiceURL}/query/?where=ST_Name+%3D+%27${stateName}%27&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=dt&groupByFieldsForStatistics=ST_Name%2C+dt&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22sum%22%2C%0D%0A++++%22onStatisticField%22%3A+%22Confirmed%22%2C+%0D%0A++++%22outStatisticFieldName%22%3A+%22Confirmed%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22sum%22%2C%0D%0A++++%22onStatisticField%22%3A+%22Deaths%22%2C+%0D%0A++++%22outStatisticFieldName%22%3A+%22Deaths%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22sum%22%2C%0D%0A++++%22onStatisticField%22%3A+%22NewCases%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22NewCases%22%0D%0A++%7D++%0D%0A%5D&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`;
    
    try {
        const {data} = await axios.get(requestUrl);

        if(data && data.features){
            // console.log(data.features)
            return data.features
        }

    } catch(err){
        console.error(err);
    }

    return null;
};