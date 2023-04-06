/*
See all ramen images in the div with the id of 
ramen-menu. When the page loads, request the 
data from the server to get all the ramen objects. 
Then, display the image for each of the ramen 
using an an img tag inside the #ramen-menu div. /X
*/
// write your code here

//locate element to appent to 
//make fetch request
//for each obj in obj array render image in ramen div

const ramenMenu = document.querySelector("#ramen-menu")
const ramenInfo = document.querySelector("#ramen-detail")
const ramenForm = document.querySelector("#ramen-rating")
const ramenImg = document.querySelector("#ramen-img")
const newRamenForm = document.querySelector("#new-ramen")


fetch("http://localhost:3000/ramens")
.then(resp => resp.json())
.then(ramenObjs => {
    console.log(ramenObjs)
    ramenObjs.forEach(addRamenToMenu)
})


function addRamenToMenu(ramen){
    let ramenImg = document.createElement("img")
    ramenImg.src = ramen.image
    ramenImg.id = "ramen-img"
    ramenImg.dataset.id = ramen.id
    ramenMenu.append(ramenImg)
}

/*
Click on an image from the #ramen-menu div and see 
all the info about that ramen displayed inside the /X
#ramen-detail div, as well as the current rating 
and comment for the ramen displayed in the #ramen-rating 
form. /X
*/

//target elements to be edited when image clicked
//add event listener for image click - get id from image make
//fetch request with id for info
//change HTML - add fetched OBJ info

/* <img class="detail-image" src="./assets/image-placeholder.jpg" alt="Insert Name Here" />
      <h2 class="name">Insert Name Here</h2>
      <h3 class="restaurant">Insert Restaurant Here</h3> */



ramenMenu.addEventListener("click", function(event){
    if(event.target.matches("#ramen-img")){
        let id = event.target.dataset.id
        fetch(`http://localhost:3000/ramens/${id}`)
        .then(resp => resp.json())
        .then(ramenObj => {
            console.log(ramenObj)
            addRamenImg(ramenObj)
            addRamenForm(ramenObj)
        })
    }
})

function addRamenImg(ramenObj){
    //I understand the security drawbacks of using innerHTML but chose this method 
    //because it's the fastest. given more time, if security were a concern I would 
    //create new elements and set them to equal keys from the obj. 
    ramenInfo.innerHTML = `
      <img class="detail-image" src=${ramenObj.image} alt=${ramenObj.name} />
      <h2 class="name">${ramenObj.name}</h2>
      <h3 class="restaurant">${ramenObj.restaurant}</h3>
    `
}

function addRamenForm(ramenObj){
    ramenForm.innerHTML = `
    <label for="rating">Rating: </label>
    <input type="text" name="rating" id="rating" value=${ramenObj.rating} />
    <label for="comment">Comment: </label>
    <textarea name="comment" id="comment">${ramenObj.comment}</textarea>
    <input type="submit" value="Update" />
    `
    ramenForm.dataset.id = ramenObj.id
}

/* Update the rating and comment for a ramen. When the #ramen-rating form 
is submitted, it should update the value on the server. Changes should /X
also be reflected on the frontend (you can test this by submitting the form; 
clicking a different ramen image; then clicking the image for the ramen you 
updated - you should see the rating and comment that you submitted previously). /X
*/

//target element to add event listener to 
//add event listener on submit 
//create new OBJ with user submissions 
//create patch request with stringified new obj as patch body 

ramenForm.addEventListener("submit", function(event){
    event.preventDefault()
    const newRating = {
        rating: event.target.rating.value,
        comment: event.target.comment.value
    }
    console.log(newRating)
    let id = ramenForm.dataset.id

    fetch(`http://localhost:3000/ramens/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(newRating)
    })
    .then(resp => resp.json())
    .then(newRating => addRamenForm(newRating))
})

//debugger


//------Trying adavanced deliverables----//

/*See the details for the first ramen as soon as the page loads 
(without clicking on an image) /X
*/

document.addEventListener('DOMContentLoaded', (event) => {
        fetch(`http://localhost:3000/ramens/1`)
        .then(resp => resp.json())
        .then(ramenObj => {
            console.log(ramenObj)
            addRamenImg(ramenObj)
            addRamenForm(ramenObj)
        })
});

/*
Create a new ramen. You can add this form to the index.html 
file to get started: /X
*/

//target element to add event listener
//create obj with user input 
//make post request with stringified user obj as body
//render new ramen on page 


newRamenForm.addEventListener("submit", function(event) {
    event.preventDefault()
    newRamen = {
        name: event.target.name.value,
        restaurant: event.target.restaurant.value,
        image: event.target.image.value,
        comment: event.target['new-comment'].value,
        rating: event.target.rating.value,
    }
    //debugger
    let id = parseInt(document.querySelector("#ramen-rating").dataset.id)
    console.log(newRamen)
    console.log(id)
    addRamenToMenu(newRamen)
    addRamenImg(newRamen)
    addRamenForm(newRamen)
    fetch('http://localhost:3000/ramens', { 
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(newRamen)
    })
    .then(resp => resp.json())
    .then(newRamen => {
        console.log(newRamen)
    })
    event.target.reset()
})

/*Delete a ramen (you can add a "delete" button if you'd like, 
or use an existing element to handle the delete action). 
The ramen should be removed from the ramen-menu div, and should 
not be displayed in the ramen-detail div. */

//figure out where to add delete button 
//create delete functions to remove form front end
//make fetch request with DELETE method to delete from back end

const dltButton = document.createElement("button")
dltButton.id = "dlt-btn"
dltButton.innerText = "Delete Ramen"
document.body.append(dltButton)
//debugger

dltButton.addEventListener("click", (event) => {
    event.target.dataset.id = ramenForm.dataset.id
    let id = dltButton.dataset.id
    //console.log(dltButton.dataset.id)
    fetch(`http://localhost:3000/ramens/${id}`, {
        method: "DELETE"
    })
    ramenInfo.remove()
    ramenForm.remove()
    const ramenImgs = document.querySelectorAll("#ramen-img")
    console.log("ramenIMGs:", ramenImgs)
    ramenImgs.forEach((img) => {
        if(img.dataset.id == id) img.remove()
    })
})