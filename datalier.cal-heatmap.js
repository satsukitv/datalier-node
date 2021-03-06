if (typeof module !== "undefined")
	var datalier = require('./datalier.js');
else if (typeof datalier === "undefined")
	var datalier = {};


datalier.calHeatmap = function (filters, data, chartOptions, defaultTimeField) {
	if (filters instanceof Array) {
		filters = new datalier.filters(data, filters, defaultTimeField);
	}
    else {
        filters = new datalier.filters(data, [filters], defaultTimeField);
    }
    this.filterIndex = 0;
	this.filters = filters;
	var self = this;
	
	this.filters.addListener(function() {
		self.draw(true);
	});
	
	this.chartOptions = {
        itemSelector: "#heatmap",
        domain: "week",
        cellSize: 12,
        domainGutter: 1
    };
	if (typeof chartOptions !== "undefined") {
		for (var key in chartOptions)
			this.chartOptions[key] = chartOptions[key];
	}
}
datalier.calHeatmap.prototype.setFilter = function (filter) {
    this.filters.removeFilter(this.filterIndex);
    this.filterIndex = this.filters.addFilter(filter);
    return this.filterIndex;
}
datalier.calHeatmap.prototype.applyPlotFilter = function() {
	if (this.filters.chartDataset instanceof Array) {
        var i = this.filterIndex;
        switch(this.filters.filters[i].type) {
            case 'accumulateField':
            case 'accumulateCount':
            case 'field':
            case 'collapseCount':
            case 'collapseField':
                this.filters.chartDataset[i].data = datalier.utils.transformToDictionary(this.filters.chartDataset[i].data);
                break;
            case 'passthrough':
                break;
        }
		return this.filters.chartDataset[this.filterIndex];
	}
	return {};
}
datalier.calHeatmap.prototype.draw = function(filtersAlreadyApplied) {
	if (!filtersAlreadyApplied)
		this.filters.applyFilters();
	else {
		var chartDataset = this.applyPlotFilter();
        if (typeof this.cal !== "undefined") {
            this.cal = this.cal.destroy();
        }
		this.cal = new CalHeatMap();
        this.chartOptions.data = chartDataset.data;
        this.cal.init(this.chartOptions);
	}
}
if (typeof module !== "undefined") {
	module.exports = {calHeatmap: datalier.calHeatmap };
}