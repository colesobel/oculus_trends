angular.module('app.dashController', ['app.services'])

.controller('dashController', ['$http', '$state', '$rootScope', 'getDate', function($http, $state, $rootScope, getDate) {

  this.DataSource = {
        "chart": {
            "caption": "Countries With Most Oil Reserves [2017-18]",
            "subCaption": "In MMbbl = One Million barrels",
            "xAxisName": "Country",
            "yAxisName": "Reserves (MMbbl)",
            "numberSuffix": "K",
            "theme": "fusion",
        },
        "data": [{
            "label": "Venezuela",
            "value": "290"
        }, {
            "label": "Saudi",
            "value": "260"
        }, {
            "label": "Canada",
            "value": "180"
        }, {
            "label": "Iran",
            "value": "140"
        }, {
            "label": "Russia",
            "value": "115"
        }, {
            "label": "UAE",
            "value": "100"
        }, {
            "label": "US",
            "value": "30"
        }, {
            "label": "China",
            "value": "30"
        }]
    }
  this.width = 0.5
  this.height = 0.5
  this.chartType = 'column2d'

  this.theInfo = {
    chartId: 1,
    chartType: this.chartType,
    data: this.DataSource,
    width: this.width,
    height: this.height,
    x: 0.1,
    y: 0.1
  }

}])
