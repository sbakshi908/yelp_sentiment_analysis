
var yelpCategoryData;
var cityStateData;

dataUrl = "static/data/Yelp_Categories.json"
cityStateUrl = "static/data/US_States_and_Cities.json"


var tbody = d3.select("tbody");

console.log('hello')
function categoryLoad() {
    d3.json(dataUrl, function (data) {
        console.log('In cat file json')
        //console.log(data);
        yelpCategoryData = data;
        categoryData = populateCategories(data);
        addListeners()
        generateCategoryList(categoryData)
        console.log(categoryData)
        cityStateLoad()
    });
}

function cityStateLoad() {
    d3.json(cityStateUrl, function (data) {
        console.log('In state file json')
        //console.log(data);
        cityStateData = data;
        stateData = populateState(data);
       
        generateStateList(stateData)
        console.log(stateData)
        InitializeChildLists()
    });
}


//Initialize all Lists
function populateCategories(catData) {
    var keys = [];
    for (var k in catData)
        keys.push(k);

    return keys;
}

function populateState(stateData) {
    var keys = [];
    for (var k in stateData)
        keys.push(k);

    return keys;
}


function populateSubCategories(catData) {
    var keys = [];
    for (var k in catData)
        keys.push(k);

    return keys;
}

function addListeners() {
    d3.select("#selectcategory").on("change", onCategorychange, false);
    d3.select("#selectstate").on("change", onStatechange, false);
    d3.select("#fltrBusiness").on("click", onFilterButtonchange, false);
}


function generateCategoryList(data) {

    var select = d3.select("#selectcategory");

    var options = select
        .selectAll('option')
        .data(data).enter()
        .append('option')
        .text(function (d) { return d; });

}

//Handle Category change event
function onCategorychange() {
    //console.log('Country change dd called');
    selectValue = d3.select('#selectcategory').property("value").trim();
    //console.log("selected value" + selectValue);
    tbody.html("");
    var filteredByCategory = filterDataByCategory(selectValue);
    //console.log(filteredByTeam);
    console.log(filteredByCategory)
    SetSubCategoryDropDownToEmpty()
    generateSubCategoryList(filteredByCategory);

};

//Handle State change event
function onStatechange() {
    //console.log('Country change dd called');
    selectValue = d3.select('#selectstate').property("value").trim();
    //console.log("selected value" + selectValue);
    tbody.html("");
    var filteredByState = filterDataByState(selectValue);
    //console.log(filteredByTeam);
    console.log(filteredByState)
    SetCityDropDownToEmpty()
    generateCityList(filteredByState);

};


//Apply Category filter condition
function filterDataByCategory(cat) {
    return yelpCategoryData[cat]
}

//Apply State filter condition
function filterDataByState(state) {
    return cityStateData[state]
}


function generateSubCategoryList(data) {

    var select = d3.select("#selectsubcategory");

    var options = select
        .selectAll('option')
        .data(data).enter()
        .append('option')
        .text(function (d) { return d; });

}

function generateStateList(data) {

    var select = d3.select("#selectstate");

    var options = select
        .selectAll('option')
        .data(data).enter()
        .append('option')
        .text(function (d) { return d; });

}

function generateCityList(data) {

    var select = d3.select("#selectcity");

    var options = select
        .selectAll('option')
        .data(data).enter()
        .append('option')
        .text(function (d) { return d; });

}

function InitializeChildLists() {

    var select = d3.select("#selectcity");

    var options = select
        .selectAll('option')
        .data(cityStateData['New York']).enter()
        .append('option')
        .text(function (d) { return d; });

        var select = d3.select("#selectsubcategory");

        var options = select
            .selectAll('option')
            .data(yelpCategoryData['Active Life']).enter()
            .append('option')
            .text(function (d) { return d; });
    

}


function SetSubCategoryDropDownToEmpty() 
{           
$('#selectsubcategory').find('option').remove().end().append('<option value="0"></option>');
//$("#selectsubcategory").trigger("liszt:updated");          
}

function SetCityDropDownToEmpty() 
{           
$('#selectcity').find('option').remove().end().append('<option value="0"></option>');
//$("#selectcity").trigger("liszt:updated");          
}


//Handle Team change event
function onFilterButtonchange() {
    console.log("In btn click")
    var category = d3.select("#selectsubcategory").node().value
    console.log(category)
    var city = d3.select("#selectcity").node().value
    console.log(city)
    var state = d3.select("#selectstate").node().value
    console.log(city)
    getData(state, category, city)
    // getWordCloudData(category,city)
};
