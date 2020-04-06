//Version 3 notes:
//1) Fix for bug where results table stays empty on repeat attempts at quiz.
//2) Remove inline styling and replace in CSS file.
//3) Start to make CSS mobile first.

//First get a full list of all Star Wars Characters from https://swapi.co/ 
//This video will help you A LOT https://www.youtube.com/watch?v=QO4NXhWo_NM

//============================================================================================================================================
//============================================================================================================================================
//START OF CODING TO GET NAME, SPECIES AND HOMEWORLD DATA FROM https://swapi.co/ into our "peopleArray"


var countOfGuesses = 0;
var correctGuesses = 0;
var percentageCorrect = 0;


//Global Variables here
let peopleArray = [];
let peopleURL = "https://swapi.co/api/people/"
/*proxyURL was included to stop this error when trying to get data from SWapi 

Access to fetch at 'https://swapi.co/api/people/' from origin 'http://127.0.0.1:5500' has been 
blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. 
If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch 
the resource with CORS disabled.

Comes from this stackoverflow answer:
https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors

*/
let proxyURL = "https://cors-anywhere.herokuapp.com/"

let loadingWaitMessage1Location = document.getElementById("loadingWaitMessage1");
let loadingWaitMessage2Location = document.getElementById("loadingWaitMessage2");
let dropDownContainerLocation = document.getElementById("dropDownContainer");
let invalidChoiceLocation = document.getElementById("invalidChoice");
let confirmSelectionLocation = document.getElementById("confirmSelection");
let giveResultLocation = document.getElementById("giveResult")
let resultsTableLocation = document.getElementById("resultsTable")
let resultsTableBodyLocation = document.getElementById("resultsTableBody")
let checkButtonLocation = document.getElementById("checkButton")
let cheatChoiceLocation = document.getElementById("cheatChoice")
let finalRatingLocation = document.getElementById("finalRating")
let finalRatingButtonLocation = document.getElementById("finalRatingButton")
let inviteFinalClickLocation = document.getElementById("inviteFinalClick")
let restartButtonLocation = document.getElementById("restartButton")
let characterSelect1 = document.querySelectorAll(".characterSelect")[0];
let characterSelect2 = document.querySelectorAll(".characterSelect")[1];
let homeWorldName1 = document.getElementById("homeWorldName1")
let homeWorldName2 = document.getElementById("homeWorldName2")
let numberOfGuesses = document.getElementById("numberOfGuesses")
let characterConfirm1 = document.getElementsByClassName("characterConfirm1");
let characterConfirm2 = document.getElementsByClassName("characterConfirm2");
let correctOrIncorrectLocation = document.getElementById("correctOrIncorrect");
let dataForTableLocation = document.getElementById("dataForTable")
let guessAgainMessageLocation = document.getElementById("guessAgainMessage")
let numberOfGuessesSoFarLocation = document.getElementById("numberOfGuessesSoFar")
let finalPercentageLocation = document.getElementById("finalPercentage");
let yodaWisdomLocation = document.getElementById("yodaWisdom");


main()

function main() {

//Identify all the page locations where data will be displayed


restartButtonLocation.addEventListener("click", restartGame)

//Toggle initial display on / off as appropriate for this stage of process.

loadingWaitMessage1Location.style.display="block";
loadingWaitMessage2Location.style.display="none";
dropDownContainerLocation.style.display="none";``
invalidChoiceLocation.style.display="none";
confirmSelectionLocation.style.display="none";
giveResultLocation.style.display="none";
resultsTableLocation.style.display="none";
checkButtonLocation.style.display="none";
cheatChoiceLocation.style.display="none";
finalRatingLocation.style.display="none";
finalRatingButtonLocation.style.display="none";
inviteFinalClickLocation.style.display="none";

//Find out total number of people in the array. We need to get this because they're split into pages (10 per page), so 
//we need to know how many pages to get.

fetch(proxyURL + peopleURL)
.then(peopleResponse => peopleResponse.json())
//Pass number of people in array ("jsonResponse.count") into function getNumberInPeopleArray().
.then((jsonResponse) => {getNumberInPeopleArray(jsonResponse.count)})
.catch(error => console.log(error))

}
//=========================================================================
//Function to work out how many pages of people data we need to get, and "fetch" one page at a time from https://swapi.co/ 

function getNumberInPeopleArray(numberOfPeople){



    for(let i = 1; i < Math.ceil(numberOfPeople/10)+1 ; i++){
        fetch(proxyURL + peopleURL+"?page="+i)
        .then(response => response.json())
        //For each page of data "fetched" call function "populatePeopleArray"
        .then(jsonResponse => populatePeopleArray(jsonResponse.results, numberOfPeople))
    }

}

//=========================================================================

//Function to use .map() method to populate our peopleArray with just the bits we're interested in (name, homeworld, species)
function populatePeopleArray (results, numberOfPeople) {


        
    peopleArray = [...peopleArray.concat(results).map(element => {return {name : element.name, homeworld : element.homeworld, species : element.species}})]
    //When the length of our peopleArray matches the number of records in https://swapi.co/api/people/ we've got all the data
    //we need at this point and can move on to next stage of populating the select dropdowns with the data we now have in peopleArray.
    if (peopleArray.length === numberOfPeople) {
        //Filter out all cases where homeworld is "unknown" and sort by name alphabetical order
        //peopleArray = peopleArray.filter(element => element.homeworld != "https://swapi.co/api/planets/28/").sort(nameSort)
        //Changed my mind and decided to include those with homeworld "unknown" (but will leave line above present so we can change back easily in future)
        peopleArray = peopleArray.sort(nameSort)
        //Call function to populate drop-down select boxes.
        populateCharacterSelect();
    }

}

//function to sort peopleArray by name
function nameSort(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
        comparison = 1;
        } else if (nameA < nameB) {
        comparison = -1;
        }
        return comparison;

}

//END OF CODING TO GET NAME, SPECIES AND HOMEWORLD DATA FROM https://swapi.co/ into our "peopleArray"
//============================================================================================================================================
//START OF CODING TO ALLOW USER INTERACTION WITH THE DATA WE NOW HAVE STORED IN OUR "peopleArray"

//let peopleArray =[{"name":"Ackbar","homeworld":"https://swapi.co/api/planets/31/","species":["https://swapi.co/api/species/8/"]},{"name":"Adi Gallia","homeworld":"https://swapi.co/api/planets/9/","species":["https://swapi.co/api/species/23/"]},{"name":"Anakin Skywalker","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/1/"]},{"name":"Ayla Secura","homeworld":"https://swapi.co/api/planets/37/","species":["https://swapi.co/api/species/15/"]},{"name":"Bail Prestor Organa","homeworld":"https://swapi.co/api/planets/2/","species":["https://swapi.co/api/species/1/"]},{"name":"Barriss Offee","homeworld":"https://swapi.co/api/planets/51/","species":["https://swapi.co/api/species/29/"]},{"name":"Ben Quadinaros","homeworld":"https://swapi.co/api/planets/41/","species":["https://swapi.co/api/species/19/"]},{"name":"Beru Whitesun lars","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/1/"]},{"name":"Bib Fortuna","homeworld":"https://swapi.co/api/planets/37/","species":["https://swapi.co/api/species/15/"]},{"name":"Biggs Darklighter","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/1/"]},{"name":"Boba Fett","homeworld":"https://swapi.co/api/planets/10/","species":["https://swapi.co/api/species/1/"]},{"name":"Bossk","homeworld":"https://swapi.co/api/planets/29/","species":["https://swapi.co/api/species/7/"]},{"name":"C-3PO","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/2/"]},{"name":"Chewbacca","homeworld":"https://swapi.co/api/planets/14/","species":["https://swapi.co/api/species/3/"]},{"name":"Cliegg Lars","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/1/"]},{"name":"Cordé","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/1/"]},{"name":"Darth Maul","homeworld":"https://swapi.co/api/planets/36/","species":["https://swapi.co/api/species/22/"]},{"name":"Darth Vader","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/1/"]},{"name":"Dexter Jettster","homeworld":"https://swapi.co/api/planets/55/","species":["https://swapi.co/api/species/31/"]},{"name":"Dooku","homeworld":"https://swapi.co/api/planets/52/","species":["https://swapi.co/api/species/1/"]},{"name":"Dormé","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/1/"]},{"name":"Dud Bolt","homeworld":"https://swapi.co/api/planets/39/","species":["https://swapi.co/api/species/17/"]},{"name":"Eeth Koth","homeworld":"https://swapi.co/api/planets/45/","species":["https://swapi.co/api/species/22/"]},{"name":"Finis Valorum","homeworld":"https://swapi.co/api/planets/9/","species":["https://swapi.co/api/species/1/"]},{"name":"Gasgano","homeworld":"https://swapi.co/api/planets/40/","species":["https://swapi.co/api/species/18/"]},{"name":"Greedo","homeworld":"https://swapi.co/api/planets/23/","species":["https://swapi.co/api/species/4/"]},{"name":"Gregar Typho","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/1/"]},{"name":"Grievous","homeworld":"https://swapi.co/api/planets/59/","species":["https://swapi.co/api/species/36/"]},{"name":"Han Solo","homeworld":"https://swapi.co/api/planets/22/","species":["https://swapi.co/api/species/1/"]},{"name":"Jabba Desilijic Tiure","homeworld":"https://swapi.co/api/planets/24/","species":["https://swapi.co/api/species/5/"]},{"name":"Jango Fett","homeworld":"https://swapi.co/api/planets/53/","species":["https://swapi.co/api/species/1/"]},{"name":"Jar Jar Binks","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/12/"]},{"name":"Jek Tono Porkins","homeworld":"https://swapi.co/api/planets/26/","species":["https://swapi.co/api/species/1/"]},{"name":"Jocasta Nu","homeworld":"https://swapi.co/api/planets/9/","species":["https://swapi.co/api/species/1/"]},{"name":"Ki-Adi-Mundi","homeworld":"https://swapi.co/api/planets/43/","species":["https://swapi.co/api/species/20/"]},{"name":"Kit Fisto","homeworld":"https://swapi.co/api/planets/44/","species":["https://swapi.co/api/species/21/"]},{"name":"Lama Su","homeworld":"https://swapi.co/api/planets/10/","species":["https://swapi.co/api/species/32/"]},{"name":"Lando Calrissian","homeworld":"https://swapi.co/api/planets/30/","species":["https://swapi.co/api/species/1/"]},{"name":"Leia Organa","homeworld":"https://swapi.co/api/planets/2/","species":["https://swapi.co/api/species/1/"]},{"name":"Lobot","homeworld":"https://swapi.co/api/planets/6/","species":["https://swapi.co/api/species/1/"]},{"name":"Luke Skywalker","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/1/"]},{"name":"Luminara Unduli","homeworld":"https://swapi.co/api/planets/51/","species":["https://swapi.co/api/species/29/"]},{"name":"Mace Windu","homeworld":"https://swapi.co/api/planets/42/","species":["https://swapi.co/api/species/1/"]},{"name":"Mas Amedda","homeworld":"https://swapi.co/api/planets/50/","species":["https://swapi.co/api/species/27/"]},{"name":"Mon Mothma","homeworld":"https://swapi.co/api/planets/32/","species":["https://swapi.co/api/species/1/"]},{"name":"Nien Nunb","homeworld":"https://swapi.co/api/planets/33/","species":["https://swapi.co/api/species/10/"]},{"name":"Nute Gunray","homeworld":"https://swapi.co/api/planets/18/","species":["https://swapi.co/api/species/11/"]},{"name":"Obi-Wan Kenobi","homeworld":"https://swapi.co/api/planets/20/","species":["https://swapi.co/api/species/1/"]},{"name":"Owen Lars","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/1/"]},{"name":"Padmé Amidala","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/1/"]},{"name":"Palpatine","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/1/"]},{"name":"Plo Koon","homeworld":"https://swapi.co/api/planets/49/","species":["https://swapi.co/api/species/26/"]},{"name":"Poggle the Lesser","homeworld":"https://swapi.co/api/planets/11/","species":["https://swapi.co/api/species/28/"]},{"name":"Quarsh Panaka","homeworld":"https://swapi.co/api/planets/8/","species":[]},{"name":"R2-D2","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/2/"]},{"name":"R5-D4","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/2/"]},{"name":"Ratts Tyerell","homeworld":"https://swapi.co/api/planets/38/","species":["https://swapi.co/api/species/16/"]},{"name":"Raymus Antilles","homeworld":"https://swapi.co/api/planets/2/","species":["https://swapi.co/api/species/1/"]},{"name":"Ric Olié","homeworld":"https://swapi.co/api/planets/8/","species":[]},{"name":"Roos Tarpals","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/12/"]},{"name":"Rugor Nass","homeworld":"https://swapi.co/api/planets/8/","species":["https://swapi.co/api/species/12/"]},{"name":"Saesee Tiin","homeworld":"https://swapi.co/api/planets/47/","species":["https://swapi.co/api/species/24/"]},{"name":"San Hill","homeworld":"https://swapi.co/api/planets/57/","species":["https://swapi.co/api/species/34/"]},{"name":"Sebulba","homeworld":"https://swapi.co/api/planets/35/","species":["https://swapi.co/api/species/14/"]},{"name":"Shaak Ti","homeworld":"https://swapi.co/api/planets/58/","species":["https://swapi.co/api/species/35/"]},{"name":"Shmi Skywalker","homeworld":"https://swapi.co/api/planets/1/","species":["https://swapi.co/api/species/1/"]},{"name":"Sly Moore","homeworld":"https://swapi.co/api/planets/60/","species":[]},{"name":"Tarfful","homeworld":"https://swapi.co/api/planets/14/","species":["https://swapi.co/api/species/3/"]},{"name":"Taun We","homeworld":"https://swapi.co/api/planets/10/","species":["https://swapi.co/api/species/32/"]},{"name":"Tion Medon","homeworld":"https://swapi.co/api/planets/12/","species":["https://swapi.co/api/species/37/"]},{"name":"Wat Tambor","homeworld":"https://swapi.co/api/planets/56/","species":["https://swapi.co/api/species/33/"]},{"name":"Watto","homeworld":"https://swapi.co/api/planets/34/","species":["https://swapi.co/api/species/13/"]},{"name":"Wedge Antilles","homeworld":"https://swapi.co/api/planets/22/","species":["https://swapi.co/api/species/1/"]},{"name":"Wicket Systri Warrick","homeworld":"https://swapi.co/api/planets/7/","species":["https://swapi.co/api/species/9/"]},{"name":"Wilhuff Tarkin","homeworld":"https://swapi.co/api/planets/21/","species":["https://swapi.co/api/species/1/"]},{"name":"Yarael Poof","homeworld":"https://swapi.co/api/planets/48/","species":["https://swapi.co/api/species/25/"]},{"name":"Zam Wesell","homeworld":"https://swapi.co/api/planets/54/","species":["https://swapi.co/api/species/30/"]}]
//populateCharacterSelect()

var countOfGuesses = 0;
var correctGuesses = 0;
var percentageCorrect = 0;

//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//Function populateCharacterSelect will populate the dropdown select buttons available to the users.
function populateCharacterSelect(){

//Populate dropdown selects for fields 1 and 2 with all available character names that we have in 
//peopleArray, (that we recently got from https://swapi.co/)
peopleArray.map((element, index) => {

    let newSelectOption = document.createElement("option");
    newSelectOption.textContent = element.name;
    newSelectOption.id = element.name
    newSelectOption.value = index+1
    
    characterSelect1.append(newSelectOption)
    //characterSelect2.append(newSelectOption) THIS WILL NOT WORK HERE PETE! 
    //I'M NOT SURE WHY - SOMETHING TO DO WITH THE .append method? 
    //Just have to repeat this function for characterSelect2 (see below)

})

peopleArray.map((element, index) => {

    let newSelectOption = document.createElement("option");
    newSelectOption.textContent = element.name;
    newSelectOption.id = element.name
    newSelectOption.value = index+1
    
    characterSelect2.append(newSelectOption)

})


//Now that we've finished populating the select drop-downs, hide the "loading message" and display the drop-downs

loadingWaitMessage1Location.style.display="none";
dropDownContainerLocation.style.display="flex";
checkButtonLocation.style.display="block";

//Add event listeners to our button, and nominate function to call upon button click.
checkButtonLocation.addEventListener("click", checkSelected);

}

//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//Once button is clicked, first thing is to call function to check that both input names in the drop-down selectors 
//are valid (i.e. are names present in the peopleArray), and also check that two different characters have been selected.

function checkSelected() {

    invalidChoiceLocation.style.display="none";
    cheatChoiceLocation.style.display="none"

    let inputName1 = characterSelect1.selectedOptions[0].text
    let inputName2 = characterSelect2.selectedOptions[0].text

    if((peopleArray.filter(element => element.name === inputName1).length === 0)
    ||(peopleArray.filter(element => element.name === inputName2).length === 0)){
        invalidChoiceLocation.style.display="block";
        confirmSelectionLocation.style.display="none";
        giveResultLocation.style.display="none";
    } else {
        if(inputName1 === inputName2) {
            cheatChoiceLocation.style.display="block"
            confirmSelectionLocation.style.display="none";
            giveResultLocation.style.display="none";
        }
        else {
        //If both selected inputs can be found in the peopleArray, call function getHomeWorld to get 
        //from SWapi the names of the homeworlds
        loadingWaitMessage2Location.style.display="block";
        confirmSelectionLocation.style.display="none";
        giveResultLocation.style.display="none";
        
        confirmSelection(inputName1, inputName2)
        }
    }

}

//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//Function to confirm onscreen the guess that the user made
function confirmSelection(inputName1, inputName2) {
   
    characterConfirm1[0].textContent = inputName1;
    characterConfirm2[0].textContent = inputName2;

    //Now call the function that's going to find the homeworld details.
    getHomeWorld(inputName1, inputName2)

}
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//Now we need to go back to the SWapi and get the homeworld names for our selected characters.
function getHomeWorld(inputName1, inputName2) {

    //Variables for areas of page================================

    characterConfirm1[1].textContent = inputName1;
    characterConfirm2[1].textContent = inputName2;
    //Display number of guesses and inputNames==================    

    //Get the homeWorld URLS from peopleArray(that will allow us to interrogate SWapi to get the homeworld names)==============
    let homeworld1URL = peopleArray.filter((element) => {return element.name === inputName1}).map(element => element.homeworld)
    let homeworld2URL = peopleArray.filter((element) => {return element.name === inputName2}).map(element => element.homeworld)
    //Get the homeWorld URLS from peopleArray(that will allow us to interrogate SWapi to get the homeworld names)==============

    getHomeWorldNames(homeworld1URL, homeworld2URL)


}

//============================================================================================================================================
//============================================================================================================================================   
//============================================================================================================================================
//Function to asynchronously interrogate SWapi and return the homeworld names based on the homeworldURLs we have in peopleArray.
async function getHomeWorldNames(homeWorld1URL, homeWorld2URL) {

    let homeWorldResponse1 = await fetch(proxyURL + homeWorld1URL)
    let jsonResponsehome1 = await homeWorldResponse1.json()
    let homeWorldResponse2 = await fetch(proxyURL + homeWorld2URL)
    let jsonResponsehome2 = await homeWorldResponse2.json()
    showGuess(jsonResponsehome1.name,jsonResponsehome2.name)

}
//============================================================================================================================================
//============================================================================================================================================
//Function to add homeword names to screen display, and unhide so user can see.
function showGuess (homeWorldName1var, homeWorldName2var) {


    countOfGuesses += 1;
    numberOfGuesses.textContent = countOfGuesses;
    homeWorldName1.textContent = homeWorldName1var
    homeWorldName2.textContent = homeWorldName2var
    loadingWaitMessage2Location.style.display="none";
    confirmSelectionLocation.style.display="block";

    fillTable(homeWorldName1var, homeWorldName2var)

}
//============================================================================================================================================
//============================================================================================================================================

function fillTable(homeWorldName1var, homeWorldName2var) {
  

    let resultSentence = dataForTableLocation.innerHTML
    let result =""

    if(homeWorldName1var === homeWorldName2var) {
        result = "Yes";
        correctOrIncorrectLocation.textContent = "Correct";
        correctGuesses += 1;
    } else {
        correctOrIncorrectLocation.textContent = "Incorrect";
        result = "No"
    }

    percentageCorrect = Math.round((correctGuesses / countOfGuesses) *100).toFixed(2)
    
    let newTableEntry = "<tr><td>"+countOfGuesses+"</td><td>"+resultSentence+"</td><td>"+result+"</td><td>"+percentageCorrect+"<span>%</span></td></tr>"
    resultsTableBodyLocation.innerHTML += newTableEntry;

    giveResultLocation.style.display="block";
    numberOfGuessesSoFarLocation.style.display="block"
    resultsTableLocation.style.display="table";

    if(countOfGuesses === 5) {

        numberOfGuessesSoFarLocation.style.display="none"
        inviteFinalClickLocation.style.display="block";
        dropDownContainerLocation.style.display="none"
        checkButtonLocation.style.display="none";
        guessAgainMessageLocation.style.display="none";
        finalRatingButtonLocation.style.display="block";
        finalRatingButtonLocation.addEventListener("click", displayFinalRating)

    }

}

//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
function displayFinalGuess() {

    inviteFinalClickLocation.style.display="block"
    finalRatingButtonLocation.style.display="block";
    dropDownContainerLocation.style.display="none";
    confirmSelectionLocation.style.display="none";
    giveResultLocation.style.display="none";
    checkButtonLocation.style.display="none";
    //Add event listener to display final rating.
    finalRatingButtonLocation.addEventListener("click", displayFinalRating)
}


//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
function displayFinalRating() {

    inviteFinalClickLocation.style.display="none";
    finalRatingButtonLocation.style.display="none";
    giveResultLocation.style.display="none";
    confirmSelectionLocation.style.display="none";
    resultsTableLocation.style.display="none";
    finalRatingLocation.style.display="block";


    finalPercentageCorrect = Math.round((correctGuesses / countOfGuesses) *100).toFixed(2)


    finalPercentageLocation.innerHTML = finalPercentageCorrect;

    if(finalPercentageCorrect < 20) {
        yodaWisdomLocation.textContent = "“Truly wonderful the mind of a child is...”"
    } 
    else if (finalPercentageCorrect < 40) {
        yodaWisdomLocation.textContent = "“Great disappointment you are...”"
    } 
    else if (finalPercentageCorrect < 60) {
        yodaWisdomLocation.textContent = "“Do or do not. There is no try...”"
    } 
    else if (finalPercentageCorrect < 80) {
        yodaWisdomLocation.textContent = "“Powerful you have become, the dark side I sense in you...”"
    } 
    else {
        yodaWisdomLocation.textContent = "“Don't eat yellow snow...”"
    } 
    

    
}

//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
function restartGame() {

    countOfGuesses = 0;
    correctGuesses = 0;
    percentageCorrect = 0;
    characterSelect1.selectedIndex = 0;
    characterSelect2.selectedIndex = 0;


    loadingWaitMessage1Location.style.display="block";
    loadingWaitMessage2Location.style.display="none";
    dropDownContainerLocation.style.display="none";``
    invalidChoiceLocation.style.display="none";
    confirmSelectionLocation.style.display="none";
    giveResultLocation.style.display="none";
    resultsTableLocation.style.display="none";
    checkButtonLocation.style.display="none";
    cheatChoiceLocation.style.display="none";
    finalRatingLocation.style.display="none";
    finalRatingButtonLocation.style.display="none";
    inviteFinalClickLocation.style.display="none";

    clearResultsTable()
    populateCharacterSelect()
    
}


//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
function clearResultsTable(){

    let parent = resultsTableBodyLocation;

    while(parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild)
    }


}


//============================================================================================================================================
//============================================================================================================================================//============================================================================================================================================
//============================================================================================================================================



//============================================================================================================================================
//============================================================================================================================================//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================