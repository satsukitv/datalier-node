if (typeof module !== "undefined")
	var datalier = require('./datalier.js');
else if (typeof datalier === "undefined")
	var datalier = {};


datalier.sparkline = function (filters, data, chartOptions, defaultTimeField) {
	if (filters instanceof Array) {
		filters = new datalier.filters(data, filters, defaultTimeField);
	}
	this.filters = filters;
	var self = this;
	
	this.filters.addListener(function() {
		self.draw(true);
	});
	
	this.chartOptions = { type: 'bar', barColor: '#3ABCC9', forceStacked: false };
	if (typeof chartOptions !== "undefined") {
		for (var key in chartOptions)
			this.chartOptions[key] = chartOptions[key];
	}
}
datalier.sparkline.prototype.getRealXValue = function(series, index) {
    if (series in this.finalMap && index in this.finalMap[series] && 0 in this.finalMap[series][index])
        return this.finalMap[series][index][0];
    return false;
};
datalier.sparkline.prototype.applyPlotFilters = function() {
	if (this.filters.chartDataset instanceof Array) {
		var finalBucket = [];
        this.finalMap = [];
		for (var i = 0; i < this.filters.chartDataset.length; i++) {
			var relativeValue = (typeof this.filters.filters[i].relativeValue == "undefined")?0:this.filters.filters[i].relativeValue;
			switch(this.filters.filters[i].type) {
				case 'collapseCount':
				case 'collapseField':
                case 'field':
                case 'accumulateField':
				case 'accumulateCount':
				case 'bars':
				case 'timeline':
				case 'passthrough':
					break;
			}
            this.finalMap[i] = {};
		}
        // do sampling
        for (var i = 0; i < this.filters.chartDataset.length; i++) {
            if (typeof this.filters.filters[i].sampling === "undefined")
                continue;
            if (this.filters.filters[i].sampling.constructor === Array) {
                this.filters.chartDataset[i].data = datalier.utils.resample(this.filters.chartDataset[i].data, this.filters.filters[i].sampling);
            }
            else {
                var sampleindex = parseInt(this.filters.filters[i].sampling,10);
                if (i != sampleindex)
                    this.filters.chartDataset[i].data = datalier.utils.resample(this.filters.chartDataset[i].data, datalier.utils.getDatasetXAxis(this.filters.chartDataset[sampleindex].data));
            }
        }
		var currentTime = -1;
		var currentTimeMin = Number.MAX_VALUE;
		var currentIndices = [];
		for (var j=0;j<this.filters.chartDataset.length;j++) {
			currentIndices[j] = 0;
		}
        // merge the data together into a final bucket
        if (this.filters.chartDataset.length > 1 || this.chartOptions.forceStacked === true) {
            while(true) {
                // quit when we have reached the end of each dataset
                var breakLoop = true;
                for (var i=0;i<currentIndices.length;i++) {
                    if (currentIndices[i] < this.filters.chartDataset[i].data.length) {
                        breakLoop = false;
                        break;
                    }
                }
                if (breakLoop)
                    break;
                // go through each dataset one by one and increment the currentTime by the least amount
                currentTimeMin = Number.MAX_VALUE;
                for (var i=0;i<this.filters.chartDataset.length;i++) {
                    if (currentIndices[i] < this.filters.chartDataset[i].data.length) {
                        currentTimeMin = Math.min(currentTimeMin, this.filters.chartDataset[i].data[currentIndices[i]][0]);
                        break;
                    }
                }
                currentTime = currentTimeMin;
                var arr = [];
                // for each dataset that has a piece of data at the currentTime, add it to our entry, stacked.
                for (var i=0;i<this.filters.chartDataset.length;i++) {
                    if (currentIndices[i] < this.filters.chartDataset[i].data.length 
                    && this.filters.chartDataset[i].data[currentIndices[i]][0] == currentTime) {
                        this.finalMap[i][finalBucket.length] = this.filters.chartDataset[i].data[currentIndices[i]];
                        arr.push(this.filters.chartDataset[i].data[currentIndices[i]][1]);
                        currentIndices[i]++;
                    }
                    else {
                        arr.push(0);
                    }
                }
                // add the entry to our final bucket
                finalBucket.push(arr);
            }
        }
        else if (this.filters.chartDataset.length == 1) {
            // simply push the data unwrapped into the final bucket.
            for(var i = 0; i < this.filters.chartDataset[0].data.length; i++) {
                var newLength = finalBucket.push(this.filters.chartDataset[0].data[i][1]);
                this.finalMap[0][newLength-1] = this.filters.chartDataset[0].data[i];
            }
        }
        this.finalBucket = finalBucket;
		return finalBucket;
	}
	return [];
}
datalier.sparkline.prototype.draw = function(filtersAlreadyApplied) {
	if (!filtersAlreadyApplied)
		this.filters.applyFilters();
	else {
		var chartDatasets = this.applyPlotFilters();
		//console.log(chartDatasets);
		if (typeof $ !== undefined)
			$(this.chartOptions.container).sparkline(chartDatasets, this.chartOptions);
		else
			console.log("No jQuery to draw");
	}
}
if (typeof module !== "undefined") {
	module.exports = {sparkline: datalier.sparkline };
}