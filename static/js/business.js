var ratingOutput
var count = 1 

function lineVisual(avg_rating){

    ratingOutput = avg_rating
    console.log(ratingOutput)
    //addCard()
}

function getRankStars(rank){

    // Round down to get whole stars:
    var wStars = Math.floor(rank);
    // Check if whole is less than rank.
    // If less than rank, a half star is needed:
    var halfStars = (wStars < rank);

    var output="";
    //Loop through five stars:
    for(let i=1;i<=5;i++){
      //Less than or equal to stars, display a solid star:
      if(i<=wStars){
        output+="</i><i class='fas fa-star' style='color:#fbcc05'></i>";

      //If interation is after a whole star and a half star is needed, display half star:
      }else if( i==wStars+1 && halfStars==true ){
        output+="<i class='fas fa-star-half-alt' style='color:#fbcc05'></i>";

      //Otherwise, display a gray empty star:
      }else{
        output+="<i class='far fa-star' style='color:#bfbfbf'></i>";
      }
    }
    return output;
  }



const buildstarsStyleCard = starObj => {
    
    
    const card = document.createElement("div")
    const cardHead = document.createElement("div")
    const a = document.createElement("a")
    const div = document.createElement("div")
    const cardBody = document.createElement("div")
    const body = document.querySelector("#accordion");
    const rowdiv = document.createElement("div")
    const col1div = document.createElement("div")
    const col2div = document.createElement("div")
    const stardiv = document.createElement("div")
    const p = document.createElement("p")
    //Append Section
    
    body.append(card)
    //card.appendChild(a)
    card.append(cardHead)
    cardHead.append(a)
    cardHead.append(stardiv)
    cardHead.append(p)
    card.appendChild(div)
    div.appendChild(cardBody)
    cardBody.append(rowdiv)
    rowdiv.append(col1div)
    rowdiv.append(col2div)
    
    //Set Values
    a.innerText = starObj.Name
    
    stardiv.innerHTML = getRankStars(starObj.Rating)
    // col2div.innerHTML = "hello"
    //col1div.innerHTML = getBarVisual("#barVisual", starObj)
    p.innerHTML = `${starObj.Rating} average rating based on ${starObj.ReviewCount} reviews.`

    
    //Set Attributes
       
    cardBody.setAttribute("class","card-body")
    div.setAttribute("data-parent","#accordion")
    div.setAttribute("data-toggle","collapse")
    div.setAttribute("data-target",`#collapse${count}`) 
    div.setAttribute("class","collapse")
    
    div.setAttribute("id",`collapse${count}`)
    a.setAttribute("href",`#collapse${count}`)
    a.setAttribute("data-toggle","collapse")
    cardHead.setAttribute("id","businesscard")
    //a.setAttribute("data-parent","#accordion")
    //a.setAttribute("data-target",`#collapse${count}`)
    a.setAttribute("class","collapsed card-link")
    cardHead.setAttribute("class","card-header")
    card.setAttribute("class","card")
    card.setAttribute("id","cardHolder")
    col1div.setAttribute("class","col-md-5")
    col2div.setAttribute("class","col-md-7")
    rowdiv.setAttribute("class","row")
    col1div.setAttribute("id",`barVisual${count}`)
    col2div.setAttribute("id",`businessStats${count}`)

    
    var data = [
        {
          y: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
          x: [`${starObj.Stars_1}`, `${starObj.Stars_2}`, `${starObj.Stars_3}`, `${starObj.Stars_4}`, `${starObj.Stars_5}`],
          type: 'bar',
          orientation : 'h',
          width: [0.5, 0.5, 0.5, 0.5, 0.5],
          
          marker: {
            color: ['#8E9843', '#6CE2E1', '#87EBB4', '#C2ED3C', '#C49E94'],
            line: {
                width: 2.5
            }
        }
         
        }
      ];
      var layout = {
          title: "Review Distribution",
          width : 400,
          height: 400,
          xaxis: {
            title: 'Review Count'
          }
       }
      Plotly.newPlot(`barVisual${count}`, data, layout, {displayModeBar: false});

 avg_rating = ratingOutput
// console.log(ratingOutput)
var filtered = avg_rating.filter(func => (func.key) === starObj.Name)
filtered.forEach((d) =>{
businessArray = Object.values(d)[1]
//console.log(businessArray)
})

var yearList = []
var ratingList = []
var interYearList = []
for (var i =0; i<businessArray.length; i++){
  yearList.push(Object.values(businessArray)[i]['key'])
  interYearList.push(Object.values(businessArray)[i]['key'])
  ratingList.push((Object.values(businessArray)[i]['value']).toFixed(1))

}

yearList.sort(function(a, b){return a - b});

var finalRatingList = []
for(var i =0; i < yearList.length; i++){
  var index = interYearList.indexOf(yearList[i])
  finalRatingList.push(ratingList[index])
}

//console.log(yearList)
//console.log(finalRatingList)

// for loop to iterate through each business in dictionary and display their chart
  var trace1 = {
    x: yearList,
    y: finalRatingList,
    type: 'scatter'
  };

  var data1 = [trace1];
  var layout1 = {
    title: "Year over year rating",
    width : 400,
    height: 400,
    xaxis: {
      title: 'Year'
    },
    yaxis: {
      title: 'Average rating'
    }
 }
  
  Plotly.newPlot(`businessStats${count}`, data1 ,layout1, {displayModeBar: false});

count += 1 
}


function addCard(ratingStats, businessCount){
  

  var myobj = document.getElementById("accordion");
  if(myobj) {
    myobj.innerHTML = "";
    // console.log(myobj)
    // for (var i =0; i<businessCount; i++){
    //   console.log("removed")
    //   myobj.remove();
    // }
    count = 1
  }

  ratingStats.forEach(starObj => buildstarsStyleCard(starObj));
}
