function YoY (data) {

console.log("inside yearly review")
//console.log(data);
//create object for all unique buisness name and fill with 2 arrays 1 for the reviews and one for the dates

var businessObj = [];

console.log(data.length);
for (var i = 0; i < data.length; i++){
  //assign variables to store current review date and stars
  var list ={};
  const date = data[i].review_date;
  const stars = data[i].review_stars;
  const name = data[i].business_name;
  //extract only the year from the dates data points 
  var d = new Date(date);
  var year = d.getFullYear();
  //const year = date.getYear();
  //console.log(year);
  //list ['Business_id'] = data[i].business_id
  list ["Business_Name"] = name;
  list ["Year"] = year;
  list ["Stars"] = stars;

  businessObj.push(list);
};
//end for loop 

//get the average stars per year for each unique business
var avg_rating = d3.nest()
.key(function(d) { return d.Business_Name; })
.key(function(d) { return d.Year; })
.rollup(function(v) { return d3.mean(v, function(d) { return d.Stars; }); })
.entries(businessObj);

lineVisual(avg_rating)

};