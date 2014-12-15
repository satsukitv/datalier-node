var exampleData = [
    { localTimestamp: 0, value: 0 },
    { localTimestamp: 1, value: 1 },
    { localTimestamp: 2, value: 2 },
    { localTimestamp: 3, value: 4 },
    { localTimestamp: 5, value: 8 },
    { localTimestamp: 8, value: 16 },
    { localTimestamp: 13, value: 32 },
    { localTimestamp: 21, value: 64 }
];
var examplePlot1,
    examplePlot2,
    examplePlot3,
    examplePlot4,
    examplePlot5;
function attachExample(id) {
    $("#graphContainer .graph").appendTo("body");
    $("#graph"+id).appendTo("#graphContainer");
    $("#graphContainer").data('id',id);
}
function messWithTheData() {
    for (var i =0; i < exampleData.length; i++) {
        exampleData[i].value = Math.floor(1+Math.random()*64);
    }
    examplePlot1.draw();
    examplePlot2.draw();
    examplePlot3.draw();
    examplePlot4.draw();
    examplePlot5.draw();
}
$(document).ready(function() {
    attachExample(1);
    $("#randomizeData").click(messWithTheData);
    $("#nextExample").click(function() {
        var id = $("#graphContainer").data('id');
        id++;
        if (id>5)
            id=1;
        attachExample(id);
    });
    $("#previousExample").click(function() {
        var id = $("#graphContainer").data('id');
        id--;
        if (id<1)
            id=5;
        attachExample(id);
    });
    var valueLabelsOptions = {
       show: true,
       yoffset: 1,
       yoffsetMin: 20,
       xoffset: 5,
       align: 'center',
       font: "9pt 'Trebuchet MS'",
       fontcolor: '#0053B9'
    };
    var xaxis = { min: 0, max:22, tickSize: 2, tickDecimals: 0 };
    examplePlot1 = new datalier.plot(
        [{
            type: 'field',
            field: 'value',
            lines: true,
            label: "Number of fries I ate when I sat down to eat",
            valueLabels: valueLabelsOptions
            
        }],
        exampleData,
        {
            xaxes: [ xaxis ],
            legend: { position: "nw" },
			container:"#example1",
		}
    );
    examplePlot1.draw();
    var filter2 = {
        type: 'collapseCount',
        granularity: 2,
        showZeroes: true,
        lines: true,
        label: "Number of times I ate fries during a 2 hour period"
    };
    examplePlot2 = new datalier.plot(
        [$.extend({},filter2,{valueLabels: valueLabelsOptions})],
        exampleData,
        {
            xaxes: [ xaxis ],
            legend: { position: "nw" },
			container:"#example2",
		}
    );
    examplePlot2.draw();
    $("#filter2").text(JSON.stringify(filter2,null,4));
    var filter3 = {
        type: 'collapseField',
        field: 'value',
        granularity: 2,
        showZeroes: true,
        lines: true,
        label: "Total Number of fries I ate during a 2 hour period"
    };
    examplePlot3 = new datalier.plot(
        [$.extend({},filter3,{valueLabels: valueLabelsOptions})],
        exampleData,
        {
            xaxes: [ xaxis ],
            legend: { position: "nw" },
			container:"#example3",
		}
    );
    examplePlot3.draw();
    $("#filter3").text(JSON.stringify(filter3,null,4));
    var filter4 = {
        type: 'accumulateCount',
        granularity: 2,
        lines: true,
        label: "Running count of times I sat down to eat fries"        
    };
    examplePlot4 = new datalier.plot(
        [$.extend({},filter4,{valueLabels: valueLabelsOptions})],
        exampleData,
        {
            xaxes: [ xaxis ],
            legend: { position: "nw" },
			container:"#example4",
		}
    );
    examplePlot4.draw();
    $("#filter4").text(JSON.stringify(filter4,null,4));
    var filter5 = {
        type: 'accumulateField',
        field: 'value',
        granularity: 2,
        lines: true,
        label: "Running total of the number of fries I ate since the beginning of time"
    };
    examplePlot5 = new datalier.plot(
        [$.extend({},filter5,{valueLabels: valueLabelsOptions})],
        exampleData,
        {
            xaxes: [ xaxis ],
            legend: { position: "nw" },
			container:"#example5",
		}
    );
    examplePlot5.draw();
    $("#filter5").text(JSON.stringify(filter5,null,4));
});