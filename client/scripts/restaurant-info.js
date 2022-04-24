// Script by Bryan Pham

const menuList = document.querySelector('.menu-list');
const foodChoice = document.querySelector('#foodChoice');
const newFoodName = document.querySelector('#newFoodName');
const submitBtn = document.querySelector('#submit-btn');
const small = document.querySelector('.form-small');
const restaurantButtons = document.querySelectorAll('.restaurant-button');
const restaurantInputs = document.querySelectorAll('.correction-input');
const restaurantDropdown = document.querySelector('#restaurant-dropdown');
 

let searchResults = [];

let diningHall = 'The Diner';

let serverResponse = '';

//get results from users request
async function getMenu(){
    try {
        console.log('Function called')
        const response = await fetch(`/api/food/`)
        const formattedResponse = await response.json();
        searchResults = formattedResponse;
        
        console.log(formattedResponse);
    } catch (e){
        console.log('Error - ' + e)
    }
}

//update menu 
async function updateMenu(newFood, foodId){
    try {
        console.log('Function called')
        const response = await fetch(`/api/food/update?new_food_name=${newFood}&meal_id=${foodId}`,{
            method: 'PUT', // or 'PUT'
        })
        const formattedResponse = await response.json();
        serverResponse = formattedResponse;
        
        console.log(formattedResponse);
    } catch (e){
        console.log('Error - ' + e)
    }
}

//delete menu item 
async function deleteMenuItem(foodId){
    try {
        console.log('Function called')
        const response = await fetch(`/api/food/delete?meal_id=${foodId}`,{
            method: 'DELETE', // or 'PUT'
        })
        const formattedResponse = await response.json();
        serverResponse = formattedResponse;
        
        console.log(formattedResponse);
    } catch (e){
        console.log('Error - ' + e)
    }
}

//add menu item 
async function addMenuItem(foodName, foodId = 0, diningHallId){

    let newGeneratedId = Math.round(Math.random() * 10000000);

    try {
        console.log('Function called')
        const query1 = await fetch(`/api/food/post?new_food_name=${foodName}&meal_id=${newGeneratedId}`,{
            method: 'POST',  
        })

        const formattedResponse1 = await query1.json();
        serverResponse = formattedResponse1;

        const query2 = await fetch(`/api/food/post2?hall_id=${diningHallId}&meal_id=${newGeneratedId}`,{
            method: 'POST',  
        })

        console.log(formattedResponse1);
    } catch (e){
        console.log('Error - ' + e)
    }
}

 
function displayMenu(){
    // show only 7 choices so page does not become too l
    searchResults.map(meal => {
        const newEntry = document.createElement('div')
        newEntry.classList.add('menu-item');
        newEntry.textContent = `${meal['meal_name']} (${meal['hall_name']})`
        menuList.appendChild(newEntry);
        //console.log(meal);
    })

    getFoodId('scrambled eggs')
}


function getFoodId(foodName){
    foodName = foodName.toLowerCase();
    console.log(foodName);
    let foodId = 0;
    let diningHallId = 0;
    searchResults.map(result => {
         if(result['meal_name'].toLowerCase() === foodName){
             console.log(result['meal_id'])
             foodId = result['meal_id'];
             diningHallId  =  result['hall_id'];
             return;
         }
    })
    return [foodId, diningHallId];
}


function getDiningHallIdNewElement(diningHallName){
    let diningHalls = {'The Diner': 1, 'South Campus': 2,'251 North Dining': 2}
    let diningHallId = 4;
    for(const [key, value] of Object.entries(diningHalls)){
        if(diningHallName === key) {diningHallId= value;}       
   }
   return diningHallId;
}

 
function addEventListenersToRadioButtons(){

    // convert HTMLCollection to array
    let buttonsArr = [...restaurantButtons]
    console.log(buttonsArr)

    //addevent listeners to each radio button

    buttonsArr.map(button => {
        let childArr = [...button.children]
        childArr[0].addEventListener('click', e =>{
            console.log(childArr[0].id)
            hideInputs(childArr[0].id)
        })

    })
}


function hideInputs(inputId){
    let restrArray = [...restaurantInputs]
    // show both inputs (one for food target and one for new replacement value) with update
    // console.log(restrArray[1])
    if(inputId === 'update'){

        //reveal "New Food Label" + "Food Choice" label and input
        restrArray[0].classList.remove('invisible');
        restrArray[0].classList.add('visible');
        restrArray[1].classList.remove('invisible');
        restrArray[1].classList.add('visible');

     
        //hide drop down
        restrArray[2].classList.remove('visible');
        restrArray[2].classList.add('invisible');;

    } else if(inputId === 'add'){

         //hide "Food Choice" label and input
         restrArray[0].classList.remove('visible');
         restrArray[0].classList.add('invisible');

         //reveal "New Food Label" label and input
         restrArray[1].classList.remove('invisible');
         restrArray[1].classList.add('visible');

         //reveal dropdown
         restrArray[2].classList.remove('invisible');
         restrArray[2].classList.add('visible');
    } else {
        
        //reveal "Food Choice" label and input
        restrArray[0].classList.remove('invisible');
        restrArray[0].classList.add('visible');


        //hide "New Food Label" label and input
        restrArray[1].classList.remove('visible');
        restrArray[1].classList.add('invisible');

        //hide drop down
        restrArray[2].classList.remove('visible');
        restrArray[2].classList.add('invisible');;
    }
}


function executeFetchRequest(foodName, httpFunction, foodId, diningIdInserted){
    let httpMethodsObj = {'update': updateMenu, 'delete': deleteMenuItem, 'add': addMenuItem}
    let httpMethod =  '';

    for(const [key, value] of Object.entries(httpMethodsObj)){
         if(httpFunction === key) {httpMethod = value;}       
    }
     
    httpMethod(foodName, foodId, diningIdInserted).then(() => {
        small.textContent = serverResponse;
        small.classList.add('visible');;
    });
    
}

submitBtn.addEventListener("click", e => {
    e.preventDefault();
    console.log('btn clicked!')
    let foodName = newFoodName.value;



    //get ids for previous added values


    let visibleInput = foodChoice.classList.contains('visible') ? foodChoice.value: foodName;
    
    let [foodId, diningIdExisting] = getFoodId(visibleInput);

    console.log(diningIdExisting);

    //get diningHallId for soon to be inserted value
    let diningIdInserted = getDiningHallIdNewElement(restaurantDropdown.value)

    let restBtnArray = [ ...restaurantButtons];
    
    // get id of checked radio button 
    let childIdParam = '';
    restBtnArray.map(button => {
        let childArr = [...button.children] 
        if(childArr[0].checked ){
            childIdParam =  childArr[0].id
        }
    })

    console.log(foodName );

    executeFetchRequest(foodName, childIdParam, foodId, diningIdInserted);

}) 


addEventListenersToRadioButtons()
getMenu().then(() => displayMenu())