import axios from 'axios';

import { Covid19CasesByTimeFeature } from 'covid19-trend-map';

import { parse, getISODay } from 'date-fns';

type FetchCovid19DataOptions = {
    countyFIPS?: string;
    stateName?: string;
    skipSummaryInfo?: boolean;
};

export type SummaryInfo = {
    cumulativeCases: number;
    cumulativeDeaths: number;
    newCasesPast7Days: number;
    deathsPast7Days: number;
    population: number;
    dateWithBiggestWeeklyIncrease: string;
};

export type FetchCovid19DataResponse = {
    features: Covid19CasesByTimeFeature[];
    summaryInfo?: SummaryInfo;
};

const USCountiesCovid19CasesByTimeFeatureServiceURL =
    'https://services9.arcgis.com/6Hv9AANartyT7fJW/ArcGIS/rest/services/USCounties_cases_V1/FeatureServer/1';

const cachedQueryResults: {
    [key: string]: FetchCovid19DataResponse;
} = {};

export const FIPSCodes4NYCCounties = [
    '36085',
    '36047',
    '36081',
    '36005',
    '36061',
];
const FIPSCode4NYCounty = '36061';
const FIPSCodes4OtherNYCCounties = FIPSCodes4NYCCounties.filter(
    (FIPS) => FIPS !== FIPSCode4NYCounty
);

export const fetchCovid19DataForNYCCounties = async (): Promise<
    FetchCovid19DataResponse
> => {
    if (cachedQueryResults[FIPSCode4NYCounty]) {
        return cachedQueryResults[FIPSCode4NYCounty];
    }

    const features4NYCCounties: {
        [key: string]: Covid19CasesByTimeFeature[];
    } = {};

    for (let i = 0, len = FIPSCodes4NYCCounties.length; i < len; i++) {
        const countyFIPS = FIPSCodes4NYCCounties[i];
        const { features } = await fetchCovid19Data({ countyFIPS });
        features4NYCCounties[countyFIPS] = features;
    }

    const NYCountyFeatures = features4NYCCounties[FIPSCode4NYCounty];

    // add numbers from all NYC Counties into NY County
    const features = NYCountyFeatures.map((feature, index) => {
        FIPSCodes4OtherNYCCounties.forEach((FIPS) => {
            // get items for each NYC County ast specific date
            const results = features4NYCCounties[FIPS];

            if (results && results[index]) {
                const item = results[index];
                feature.attributes.Confirmed += item.attributes.Confirmed;
                feature.attributes.NewCases += item.attributes.NewCases;
                feature.attributes.Deaths += item.attributes.Deaths;
                feature.attributes.Population += item.attributes.Population;
                feature.attributes.NewDeaths += item.attributes.NewDeaths;
            }
        });

        return feature;
    });

    const summaryInfo = getSummaryInfo(features);

    const queryResults = {
        features,
        summaryInfo,
    };

    cachedQueryResults[FIPSCode4NYCounty] = queryResults;

    return queryResults;
};

export const fetchCovid19Data = async ({
    countyFIPS,
    stateName,
    skipSummaryInfo,
}: FetchCovid19DataOptions): Promise<FetchCovid19DataResponse> => {
    const key4CachedResults = countyFIPS || stateName;

    if (cachedQueryResults[key4CachedResults]) {
        return cachedQueryResults[key4CachedResults];
    }

    const requestUrl = `${USCountiesCovid19CasesByTimeFeatureServiceURL}/query`;

    const params = countyFIPS
        ? {
              f: 'json',
              where: `FIPS='${countyFIPS}' AND dt > '2020-02-29'`,
              outFields: 'dt,Confirmed,Deaths,NewCases,Population',
              orderByFields: 'dt',
          }
        : {
              f: 'json',
              where: `ST_Name='${stateName}' AND dt > '2020-02-29'`,
              outFields: '*',
              orderByFields: 'dt',
              groupByFieldsForStatistics: 'ST_Name,dt',
              outStatistics: JSON.stringify([
                  {
                      statisticType: 'sum',
                      onStatisticField: 'Confirmed',
                      outStatisticFieldName: 'Confirmed',
                  },
                  {
                      statisticType: 'sum',
                      onStatisticField: 'Deaths',
                      outStatisticFieldName: 'Deaths',
                  },
                  {
                      statisticType: 'sum',
                      onStatisticField: 'NewCases',
                      outStatisticFieldName: 'NewCases',
                  },
                  {
                      statisticType: 'sum',
                      onStatisticField: 'Population',
                      outStatisticFieldName: 'Population',
                  },
              ]),
          };

    try {
        const { data } = await axios.get(requestUrl, {
            params: new URLSearchParams(params),
        });

        if (data && data.features) {
            // console.log(data.features)

            const features: Covid19CasesByTimeFeature[] = data.features.map(
                (feature: Covid19CasesByTimeFeature, index: number) => {
                    const previousFeature =
                        index > 0 ? data.features[index - 1] : undefined;

                    const newDeaths = previousFeature
                        ? feature.attributes.Deaths -
                          previousFeature.attributes.Deaths
                        : 0;

                    feature.attributes.NewDeaths = newDeaths;

                    return feature;
                }
            );

            // console.log(features)

            const summaryInfo = !skipSummaryInfo
                ? getSummaryInfo(features)
                : undefined;

            const queryResults = {
                features,
                summaryInfo,
            };

            cachedQueryResults[key4CachedResults] = queryResults;

            return queryResults;
        }
    } catch (err) {
        console.error(err);
    }

    return null;
};

const getSummaryInfo = (data: Covid19CasesByTimeFeature[]) => {
    const feature7DaysAgo = data[data.length - 8];
    // const indexOfLatestFeature = data.length - 1;
    const latestFeature = data[data.length - 1];

    const { Confirmed, Deaths, Population } = latestFeature.attributes;

    // const [ year, month, day ] = dt.split('-');
    // const date = new Date(+year, +month - 1, +day);
    // const dayOfWeek = date.getDay();
    // const featureOfLastSunday = data[ indexOfLatestFeature - dayOfWeek ];

    const dateWithBiggestWeeklyIncrease = getBiggestWeeklyIncrease(data);

    return {
        cumulativeCases: Confirmed,
        cumulativeDeaths: Deaths,
        newCasesPast7Days: Confirmed - feature7DaysAgo.attributes.Confirmed,
        deathsPast7Days: Deaths - feature7DaysAgo.attributes.Deaths,
        population: Population,
        dateWithBiggestWeeklyIncrease,
    };
};

const getBiggestWeeklyIncrease = (data: Covid19CasesByTimeFeature[]) => {
    let featureWithBiggestWeeklyIncrease = data[0];
    let biggestWeeklyIncrease = Number.NEGATIVE_INFINITY;

    const dateForFirstFeature = parse(
        data[0].attributes.dt,
        'yyyy-MM-dd',
        new Date()
    );

    const dayForFirstFeature = getISODay(dateForFirstFeature);

    for (let i = 0, len = data.length; i < len; i++) {
        let dayOfWeek = (i % 7) + dayForFirstFeature;

        dayOfWeek = dayOfWeek > 7 ? dayOfWeek - 7 : dayOfWeek;

        if (dayOfWeek === 1) {
            const { Confirmed } = data[i].attributes;

            const feature7DaysAgo = i - 6 >= 0 ? data[i - 6] : data[0];

            const weeklyIncrease =
                Confirmed - feature7DaysAgo.attributes.Confirmed;

            if (weeklyIncrease > biggestWeeklyIncrease) {
                biggestWeeklyIncrease = weeklyIncrease;
                featureWithBiggestWeeklyIncrease = data[i];
            }
        }
    }

    const dateWithBiggestWeeklyIncrease =
        featureWithBiggestWeeklyIncrease.attributes.dt; //parse(featureWithBiggestWeeklyIncrease.attributes.dt, 'yyyy-MM-dd', new Date())

    return dateWithBiggestWeeklyIncrease; //format(dateWithBiggestWeeklyIncrease, 'MMMM dd, yyyy');
};
