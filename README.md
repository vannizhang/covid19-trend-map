# COVID-19 Trends Map
[view live](https://livingatlas.arcgis.com/covidtrends/?@=-94.464,40.252,4)
![screenshot](./screenshot.png)

### Weekly Cases
These lines mark the weekly averages of new cases, per 100,000 population, per week—useful for showing the local fluctuations of cases throughout the outbreak. When seen together regional patterns emerge. The Y-axis of these charts are scaled to fit the maximum weekly increase when new cases are greater than 25 per 100,000. Please see the note on the Y-axis below for an explanation.

### Cases
These lines track the ongoing cumulative number of cases, per 100,000 population, per week. Because it is a cumulative count, the lines will never trend downward, though their rate of increase over time can provide an impression of the local history of the outbreak. An upward-bending line indicates a slow start and rapidly rising outbreak. A generally diagonal line indicates a consistent rate of transmission. An s-shaped line indicates a local “flattening of the curve” associated with a decrease in local cases. A stair-stepped line indicates multiple waves of transmission.

### Deaths
These lines track the ongoing cumulative number of deaths, per 100,000 population. Interpretations of these lines is consistent with the description of cases, above. Given the incubation and illness period of the virus, this line will show a similar pattern, though with a lag, compared to cases.

### About the Y-axis
Each trend line has a dynamic y-axis such that if the maximum rate of cases exceeds 25 cases per 100,000 population (quite high), then the height is compressed to fit into the rectangular bounds of the chart container. While this prevents a direct comparison between locations, it ensures that areas with very low populations (and therefore highly fluctuating case rates) do not by comparison suppress (to nearly flat) the rates of moderate and high-population areas. This compromise allows for a general visual reference of local trends while specific counts can be accessed when a location is selected.

### Sources
These counts are sourced from the Johns Hopkins University features service of [US County Cases](https://services9.arcgis.com/6Hv9AANartyT7fJW/ArcGIS/rest/services) and normalized into rates using [state](https://www.arcgis.com/home/item.html?id=99fd67933e754a1181cc755146be21ca) and [county](https://www.arcgis.com/home/item.html?id=7566e0221e5646f99ea249a197116605) populations from the US Census Bureau accessed via [Living Atlas](https://livingatlas.arcgis.com/en/browse/#d=2&q=usa%20population).
The Khaki basemap is [available via Living Atlas](https://livingatlas.arcgis.com/en/browse/#d=2&q=khaki).

### Creators
This application was created by Jinnan Zhang and [John Nelson](https://adventuresinmapping.com/), of Esri, with help from [Yann Cabon](https://github.com/ycabon), inspired by the [trend line maps of Mathieu Rajerison](https://datagistips.hypotheses.org/488) and the [local 1918 flu charts of Riley D. Champine](https://twitter.com/rileydchampine/status/1243552850728411143). We are not medical professionals but saw a need for a visual sense of local rates and trends and created this primarily as a resource for ourselves but are making it available to the public in the event that it is a helpful resource for understanding patterns. We make no claims of officiality and share it only as a reference.
