# CovidPulse App

### This repository is archived. On March 10, 2023, the Johns Hopkins Coronavirus Resource Center ceased collecting and reporting of global COVID-19 data.

Visualize US Covid-19 trend lines, since March 2020.

[view it live](https://livingatlas.arcgis.com/covidpulse/)
![screenshot](./screenshot.png)

## Getting Started

- To begin, clone this repository to your computer:

    ```sh
    https://github.com/vannizhang/covid19-trend-map.git
    ```

- From the project's root directory, install the required packages (dependencies):

    ```sh
    npm install
    ```

- Now you can start the webpack dev server to test the app on your local machine:

    ```sh
    # it will start a server instance and begin listening for connections from localhost on port 8080
    npm run start
    ```

- To build/deploye the app, you can simply run:

    ```sh
    # it will place all files needed for deployment into the /build directory 
    npm run build
    ```
## FAQ

- How to generate [data](./src/static/) for sparklines?

    > Here is the [repository](https://github.com/vannizhang/covid19-trend-map-data) with scripts that we use to fetch Covid-19 Data for the US from JHU Covid-19 County Cases and transform them into the JSON files with paths that can be rendered as sparklines.

- How to render data as sparklines?

    > Here is a [blog post](https://www.esri.com/arcgis-blog/products/js-api-arcgis/mapping/how-to-create-a-sparkline-map-with-the-arcgis-api-for-javascript/) with step by step instructions about how to create a sparkline map using CIMSymbol with the ArcGIS API for JavaScript.

## Resources
- [ArcGIS Blog: CovidPulse](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/health/covidpulse/)
- [ArcGIS Blog: A tour of CovidPulse and its inception](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/health/a-tour-of-covidpulse-and-its-inception/)
- [ArcGIS Blog: CovidPulse update: Grid View](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/mapping/covidpulse-update-grid-view/)
- [JHU Centers for Civic Impact Covid-19 County Cases](https://www.arcgis.com/home/item.html?id=4cb598ae041348fb92270f102a6783cb#/wayback-81-flavors-of-world-imagery/)


## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2020 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](LICENSE) file.