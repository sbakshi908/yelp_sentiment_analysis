function classifyWord(wordDataset){
    positiveWords = []
    negativeWords = []
    for(var i = 0; i < wordDataset.length; i++){
      
        if (wordDataset[i].Option === 'positive'){
            pos_dict ={}
            pos_dict['x'] = wordDataset[i].x
            pos_dict['value'] = wordDataset[i].value
            positiveWords.push(pos_dict)
        }
        else{
            neg_dict ={}
            neg_dict['x'] = wordDataset[i].x
            neg_dict['value'] = wordDataset[i].value
            negativeWords.push(neg_dict)
        }   
    }
    console.log("Positive words" + positiveWords)
    console.log("Negative words" + negativeWords)
    positiveWordCloud(positiveWords)
    negativeWordCloud(negativeWords)
    barplot_freq(positiveWords,negativeWords)
}

function negativeWordCloud(data){
    // d3.csv("static/data/file.csv",function(data){
        data1 = data
        //console.log(data)
        anychart.onDocumentReady(function () {
            
            //console.log("inside anychart")
            //console.log(data)
            // code to create a word cloud chart will be here
            // create a tag (word) cloud chart
            var chart = anychart.tagCloud(data);
            // set a chart title
            chart.title('Negative Reviews Word Cloud')
            // set an array of angles at which the words will be laid out
            chart.angles([0])
            // enable a color range
            //chart.colorRange(true);
            // set the color range length
            chart.colorRange().length('80%');
            
            var background = chart.background();
            background.stroke("black");
            background.cornerType("cut");
            background.corners(5, 5, 5, 5);
            // display the word cloud chart
            chart.container("container2").draw();
            //console.log("making container")
            //chart.draw();
            //return(chart.draw())
        });
// });
}

function positiveWordCloud(data){
    // d3.csv("static/data/file.csv",function(data){
        data1 = data
        //console.log(data)
        anychart.onDocumentReady(function () {
            
            var chart = anychart.tagCloud(data);
            // set a chart title
            chart.title('Positive Reviews Word Cloud')
            // set an array of angles at which the words will be laid out
            chart.angles([0])
            // enable a color range
            //chart.colorRange(true);
            // set the color range length
            chart.colorRange().length('80%');
            var background = chart.background();
            background.stroke("black");
            background.cornerType("cut");
            background.corners(5, 5, 5, 5);
            // display the word cloud chart
            chart.container("container1").draw();
            //console.log("making container")
            //chart.draw();
            //return(chart.draw())
        });
// });
}

function barplot_freq(pos_words,neg_words){
    var x= []
    var y= []

    pos_words.forEach((d)=> {
        x.push(d.x)
        y.push(d.value)
    })
    x = x.slice(0,5)
    y = y.slice(0,5)
    console.log(x)
    console.log(y)

    var neg_x = []
    var neg_y=[]
    neg_words.forEach((d)=> {
        neg_x.push(d.x)
        neg_y.push(`-${d.value}`)
    })

    neg_x = neg_x.slice(0,5)
    neg_y = neg_y.slice(0,5)

    console.log(neg_x)
    console.log(neg_y)

    console.log("in barplot function")
    var trace1 = {
        x: x,
        y: y,
        name: 'Positve',
        type: 'bar',
        marker:{
            color: 'rgb(0, 255, 0)'
        }
      };
    
    var trace2 = {
        x: neg_x,
        y: neg_y,
        name: 'Negative',
        type: 'bar',
        marker:{
            color: 'rgb(255, 0, 0)'
        }
    };

    var layout = {
        title: "Frequency of Top 5 words in Positive and Negative Reviews",

    };
    var data = [trace1, trace2];

    Plotly.newPlot('polarity', data,layout,{displayModeBar: false});  
}