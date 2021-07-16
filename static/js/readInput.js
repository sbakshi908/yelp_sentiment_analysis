var businessCount = 0;
var hiObj = [];
var loObj = [];
var losorted = [];

const distinct = (value, index, self) => {
    return self.indexOf(value) == index;
}


function lowSort(starObj){

    // use slice() to copy the array and not just make a reference
    // var losorted = starObj.slice(0);
    losorted = starObj.sort(function(a,b) {
    return a.Rating - b.Rating;
    });
    console.log('by low stars:');
    console.log(losorted);
    // return losorted
}

function hiSort(starObj){
    // use slice() to copy the array and not just make a reference
    // var hisorted = starObj.slice(0);
    var hisorted = starObj.sort(function(a,b) {
    return b.Rating - a.Rating;
    });
    console.log('by hi stars:');
    console.log(hisorted);
    return hisorted
}

function businessCard(dataset){
    console.log("Inside cardJS")
    console.log(dataset)

    var businessSel = dataset.map(businessFn => businessFn.business_id)
    var businessList = []
    businessSel.forEach((business) => {
        
        if (!(businessList.includes(business))) {
            businessList.push(business);

        }

    })

    var starObj = []
    
    businessCount = 0
    businessList.forEach((business) => {
        var businessItem = {}
        //console.log(business)

        //Get the rating from yelp
        var ratingSel = dataset.filter(function (ratingFn) {
            return ratingFn.business_id === business;
        }).map(function (rate) {
            return rate.stars;
        }).filter(distinct)
        const [rating] = ratingSel
        
        //Get the business Name
        var nameSel = dataset.filter(function (nameFn) {
            return nameFn.business_id === business;
        }).map(function (nam) {
            return nam.business_name;
        }).filter(distinct)
        const [name] = nameSel

        //Stars count
        var r_5_stars = dataset.filter(rstarsFn => (rstarsFn.business_id === business) && (parseInt(rstarsFn.review_stars) === 5));
        var r_4_stars = dataset.filter(rstarsFn => (rstarsFn.business_id === business) && (parseInt(rstarsFn.review_stars) === 4));
        var r_3_stars = dataset.filter(rstarsFn => (rstarsFn.business_id === business) && (parseInt(rstarsFn.review_stars) === 3));
        var r_2_stars = dataset.filter(rstarsFn => (rstarsFn.business_id === business) && (parseInt(rstarsFn.review_stars) === 2));
        var r_1_stars = dataset.filter(rstarsFn => (rstarsFn.business_id === business) && (parseInt(rstarsFn.review_stars) === 1));
        
        // console.log("Review 3 stars"+r_3_stars)
        //Review count
        var reviewCount = r_5_stars.length + r_4_stars.length + r_3_stars.length + r_2_stars.length + r_1_stars.length
        //console.log(reviewCount)

        businessItem['Name'] = name
        businessItem['Rating'] = rating
        businessItem['ReviewCount'] = reviewCount
        businessItem['Stars_1'] = r_1_stars.length
        businessItem['Stars_2'] = r_2_stars.length
        businessItem['Stars_3'] = r_3_stars.length
        businessItem['Stars_4'] = r_4_stars.length
        businessItem['Stars_5'] = r_5_stars.length

        starObj.push(businessItem)
        hiObj.push(businessItem)
        loObj.push(businessItem)
        businessCount += 1
    })
  

    starObj.forEach((s) =>{

        console.log(s)
    })
    
    // lowSort(loObj)
    addCard(starObj, businessCount)

    

}



function highestRated(){
    console.log("hiObj" + hiObj)
    var sortArray = hiSort(hiObj)
    console.log("Inside onclick")
    console.log(sortArray)
    addCard(sortArray, businessCount)
}

function lowestRated(){
    losorted = loObj.sort(function(a,b) {
        return a.Rating - b.Rating;
        });
    // var sortArray2 = losorted
    console.log(losorted)
    console.log("Inside onclick")
    addCard(losorted, businessCount)
}