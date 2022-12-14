# WMT Data: A Real-Time Data Visualization Tool for the World Mobile Token Network

[WMT Data](https://wmtdata.net/) is an application that uses web scraping to collect data from the [WMTScan](https://wmtscan.com/) from World Mobile.
[World Mobile Token](https://worldmobiletoken.com/) is a proposed blockchain-based solution that would enable a sharing economy for telecommunications infrastructure. The use of blockchain in this model would enable the removal of intermediaries and a layer of cost from the delivery mechanism, while enabling rapid expansion of the network through the transparency provided by smart contracts. This solution aims to address the affordability issue and more efficient use of network resources to enable connectivity to be provided in a more distributed and decentralized manner.

The data collected through web scraping is automatically stored in a Firebase database. The application performs different queries to display various graphs, such as the number of users and network consumption over time. It also shows real-time daily network usage and weekly comparison graphs for both the number of users and network usage.

The application was developed using Angular, TypeScript, and the RxJS library to enable reactive programming and real-time graphs.

# Features

- Real-time data collection through web scraping
- Real-time and historical data visualization
- Comparison of weekly user and network usage data

# Technologies

- Angular
- TypeScript
- RxJS
- Firebase

# Getting Started

## Development server

To use WMT Data, clone the repository and install the dependencies using `npm install`. Then, run the application using `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

> Note: To use the application, you will need to add your own Firebase configuration in the src/environments folder.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

# Contributing

We welcome contributions to the WMT Data application. If you have an idea for a new feature or have found a bug, please open an issue in the repository. If you want to contribute to WMT Data, please feel free to submit a pull request or create an issue on the GitHub repository.

TODO: Add contribution guidelines.

# Conclusion

In conclusion, WMT Data is a useful application for collecting and visualizing data from the World Mobile Token website. Its use of reactive programming and real-time data visualization make it a valuable tool for understanding and analyzing the performance of the World Mobile Token network. The application's code is open source and we welcome contributions from the community.

# License

WMT Data is licensed under the MIT license.
TODO: Add licensing information.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.4.
