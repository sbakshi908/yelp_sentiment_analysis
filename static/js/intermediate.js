queue()
    .defer(d3.json, "/find/")
    .defer(d3.json,"/findBySelectML/")
    .await(ready);

function ready(error, dataset, wordCloudDataset){
    // console.log("hello")
    // d3.csv("static/data/Vancouver_pizza.csv", function(data) {
    //     console.log(data)
        categoryLoad()
        classifyWord(wordCloudDataset)
        // getWordCloudData()
        fetchData(dataset)
        YoY(dataset)
        businessCard(dataset)         

    // });
};

// function readInput()  {
    
// }

function getData(state,category, city){
    fetch(`/findBySelect?&state=${state}&category=${category}&city=${city}`)
        .then((response) => {
            return response.json()
        })
        .then(dataset => {
            console.log("dataset")
            console.log(dataset);
            getWordCloudData()
            fetchData(dataset)
            YoY(dataset)
            businessCard(dataset) 
        });
}

function getWordCloudData(){
    fetch("/findBySelectML/")
        .then((response) => {
            return response.json()
        })
        .then(data_wc => {
            console.log("Word cloud")
            console.log(data_wc);
            classifyWord(data_wc)
             
        });
}