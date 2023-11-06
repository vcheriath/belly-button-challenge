// Get Data
// 	Get the sample link
const samplesLink = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let samples = [];
let metadata = [];
let names = [];

let sampleValues = [];
let otu_ids = [];
let otu_ids_text = [];
let otu_labels = [];
let sortedBySampleValues = [];
let defaultSample = [];
let newSample =  [];
let newData = [];


// Promise Pending
const dataPromise = d3.json(samplesLink);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and set up default plots
d3.json(samplesLink).then(function(data) {
	samples = data["samples"];
	names = data["names"];
	metadata = data["metadata"];

	// log the default demographic info
	console.log("default id: " + d3.select("#id").text());
	console.log("default ethnicity: " + d3.select('#ethnicity').text());
	console.log("default age: " + d3.select('#age').text());
	console.log("default location: "+ d3.select('#location').text());
	console.log("default bbtype: " + d3.select('#bbtype').text());
	console.log("default wfreq: " + d3.select('#wfreq').text());

	// DEFAULT BAR CHART
	// Grab the data for the ID we want
	// convert the data to a list of dict objects for ease of sorting and plotting
	for(let b = 0; b<samples[0].sample_values.length;b++){
		dict = {
			'sample_value' : samples[0].sample_values[b],
			'otu_id' : samples[0].otu_ids[b],
			'otu_label' : samples[0].otu_labels[b]
		};
		defaultSample.push(dict)
	}

	// Sort the data by Sample values descending
	sortedBySampleValues = defaultSample.sort((a, b) => b.sample_value - a.sample_value);
	
	// Slice the first 10 objects for plotting
	slicedData = sortedBySampleValues.slice(0, 10);

	// Reverse the array to accommodate Plotly's defaults
	reversedData = slicedData.reverse();
	
	// log the sample values, otu_ids, and otu_labels
	sampleValues = reversedData.map(object => object.sample_value);
	otu_ids = reversedData.map(object => object.otu_id);
	otu_labels = reversedData.map(object => object.otu_label);

	// convert the otu_ids to text
	for (let a=0; a<otu_ids.length; a++){
		otu_ids_text.push("OTU " + otu_ids[a].toString());
	}

	// Trace for the OTU Data
	let trace1 = {
		y: otu_ids_text.slice(0, 10),
		x: sampleValues.slice(0, 10),
		text: otu_labels.slice(0, 10),
		type: "bar",
		orientation: 'h'
  	};

	let traceDataBar = [trace1];

	let layoutBar = {
		title: "Top 10 OTUs",
	};

	Plotly.newPlot("bar", traceDataBar, layoutBar);

	// DEFAULT BUBBLE CHART
	var trace2 = {
		x: samples[0].otu_ids,
		y: samples[0].sample_values,
		text: samples[0].otu_labels,
		mode: 'markers',
		marker: {
		  size: samples[0].sample_values,
		  color: samples[0].otu_ids
		}
	  };
	  
	  var data = [trace2];
	  
	  var layout = {
		title: 'OTU samples',
		showlegend: false
	  };
	  
	  Plotly.newPlot('bubble', data, layout);

});

// On change to the dropdown meny, call optionChanged()
d3.selectAll("#selDataset").on("change", optionChanged);


function optionChanged() {d3.json(samplesLink).then(function(data) {
	// get the chosen test subject id
	let dropdownMenu = d3.select("#selDataset");
	// Assign the value of the dropdown menu option to a letiable

	// Get the old demographic data
	let dataset = dropdownMenu.property("value");
	let demographicsTable = d3.select("#sample-metadata");
	let idNumber = d3.select("#id");
	let ethnicityVal = d3.select('#ethnicity');
	let genderVal = d3.select('#gender');
	let ageVal = d3.select('#age');
	let locationVal = d3.select('#location');
	let bbtypeVal = d3.select('#bbtype');
	let wfreqVal = d3.select('#wfreq');

	

	// loop through the names list to get the right test subject
	for (let index=0; index < names.length; index++) {
		if (dataset == samples[index].id){
			console.log("index: " + index);

			// UPDATE THE DEMOGRAPHICS TABLE
			// Retrieve the updated Demographics info
			idNumber.text(dataset);
			ethnicityVal.text(metadata[index]['ethnicity']);
			genderVal.text(metadata[index]['gender']);
			ageVal.text(metadata[index]['age']);
			locationVal.text(metadata[index]['location']);
			bbtypeVal.text(metadata[index]['bbtype']);
			wfreqVal.text(metadata[index]['wfreq'])
			console.log("chosen id: " + idNumber.text());
			console.log("chosen ethnicity: " + ethnicityVal.text());
			console.log("chosen gender: " + genderVal.text());
			console.log("chosen location: " + locationVal.text());
			console.log("chosen bbtype: " + bbtypeVal.text());
			console.log("chosen wfreq: " + wfreqVal.text());

			// UPDATE THE BAR CHART
			// Get the new data
			for(let b = 0; b<samples[index].sample_values.length;b++){
				dict = {
					'sample_value' : samples[index].sample_values[b],
					'otu_id' : samples[index].otu_ids[b],
					'otu_label' : samples[index].otu_labels[b]
				};
				newSample.push(dict)
			}

			// Sort the data by Sample values descending
			newSortedBySampleValues = newSample.sort((a, b) => b.sample_value - a.sample_value);

			// Slice the first 10 objects for plotting
			newSlicedData = newSortedBySampleValues.slice(0, 10);

			// Reverse the array to accommodate Plotly's defaults
			newReversedData = newSlicedData.reverse();
			
			// log the sample values, otu_ids, and otu_labels
			new_Sample_Values = newReversedData.map(object => object.sample_value);
			new_Otu_ids = newReversedData.map(object => object.otu_id);
			new_Otu_labels = newReversedData.map(object => object.otu_label);
			let new_Otu_ids_text = [];
			for (let a=0; a<otu_ids.length; a++){
				new_Otu_ids_text.push("OTU " + new_Otu_ids[a].toString());
			}

			// Trace for the new OTU Data
			let trace1 = {
				y: new_Otu_ids_text,
				x: new_Sample_Values,
				text: new_Otu_labels,
				type: "bar",
				orientation: 'h'
			};

			let traceDataBar = [trace1];

			let layoutBar = {
				title: "Top 10 OTUs",
			};
			
			// Make new plot
			Plotly.newPlot("bar", traceDataBar, layoutBar);
			console.log("updated bar plot");

			//UPDATE BUBBLE PLOT
			var newtrace2 = {
				x: samples[index].otu_ids,
				y: samples[index].sample_values,
				text: samples[index].otu_labels,
				mode: 'markers',
				marker: {
				  size: samples[index].sample_values,
				  color: samples[index].otu_ids
				}
			  };
			  
			  var newbubbledata = [newtrace2];
			  
			  var newbubblelayout = {
				title: 'OTU samples',
				showlegend: false
			  };
			  
			  Plotly.newPlot('bubble', newbubbledata, newbubblelayout);
			  console.log('updated bubble plot');
  
		}	
	}
} 
)};