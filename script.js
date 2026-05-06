function openFeatures(){
       var allelems = document.querySelectorAll('.elem')
       var fullelempage = document.querySelectorAll('.fullelem')
       var fullelempagebackbtn = document.querySelectorAll('.fullelem .back')
       allelems.forEach(function(elem){
    
       elem.addEventListener('click',function(){
       fullelempage[elem.id].style.display = 'block'
        
       })
})

       fullelempagebackbtn.forEach(function(back){
       back.addEventListener('click',function(){
       fullelempage[back.id].style.display = 'none'
              
       })
})
}
openFeatures();

function todolist(){

let form = document.querySelector('.addtask form')
let taskinput = document.querySelector('.addtask form #task-input')
let taskdetailsinput = document.querySelector('.addtask form textarea')
let taskcheckbox = document.querySelector('.addtask form #check')

// let currenttask = [
//        {
//               task:'Mandir jao',
//               details:'Hanuman Mandir',
//               imp:true
//        },
//        {
//               task:'Recording Karo',
//               details:'Cohort ke liye',
//               imp:true
//        },
//        {
//               task:'Lunch at 2 pm',
//               details:'Gains chle jayenge vrna',
//               imp:false
//        }
// ]
 

var currenttask = []
//When the page loads, use localStorage.getItem('key') and JSON.parse() to pull the data back into your JavaScript variables and then display them in the HTML.
if(localStorage.getItem('currenttask')){
// If the "currenttask" key exists in Local Storage.
       currenttask = JSON.parse(localStorage.getItem('currenttask'))//toh item ko get karo or usko currenttask me add kardo. This is why your tasks don't disappear when you refresh the page.

       // localStorage.getItem json string ke form me answer dega toh islie pehle parse method use kia jo usko JS object me convert krega
}else{
       console.log('Task list is empty')
}

function rendertask(){

       var alltask = document.querySelector('.alltask')

var sum =''
currenttask.forEach(function(elem,idx){
   sum = sum + `<div class="task">
                        <h5>${elem.task} <span class=${elem.imp}>*imp</span></h5>
                        <button id="${idx}">Mark as Completed</button>
                    </div>`
})

alltask.innerHTML = sum

localStorage.setItem('currenttask',JSON.stringify(currenttask))//Every time the list is updated (either by adding a task or deleting one with splice), you overwrite the old string in Local Storage with the new, updated array. This ensures the "Save File" is always up to date.

var markcompletedbtn = document.querySelectorAll('.task button')
markcompletedbtn.forEach(function(btn){
       btn.addEventListener('click',function(){

            currenttask.splice(btn.id,1) 
            //splice method on array works on array which deletes an element starting from the index "btn.id", and upto any number of elements from this index, in this case, we have given "1", means from index btn.id , only one element that is the element on btn.id index itself is deleted.  
            rendertask();//to add into local storage
       })
    })
}
rendertask();

form.addEventListener('submit',function(e){

       e.preventDefault() //prevents the page from reloading on every form submission.
       // console.log(taskinput.value);//prints value of the input given
       // console.log(taskdetailsinput.value);//prints details given in textarea

       //adding new task and data in the array of tasks
       currenttask.push(
              {
              task:taskinput.value,details:taskdetailsinput.value,imp:taskcheckbox.checked
              }
              )

       // console.log(currenttask);
       rendertask()//re-render the function to add the current newly added task to the list of todo tasks
       

       taskinput.value=''
       taskdetailsinput.value=''
       taskcheckbox.checked=false
       //these three steps ensure that after adding a task into the list, the previous entered task and details are cleared  from the input boxes.
       
       //this can also be done using local storage,bcz by above method if we reload the page , our added tasks will vanish again.but using local storage avoids it.
       // localStorage.setItem('currenttask',JSON.stringify(currenttask))
       //local storage me currenttask array ke andar currenttask ki current value ko add kardo
       //JSON.stringify is used to convert the "value" stored in the local storage from "object" to string bcz local storage me object ke form me values nhi honi chahiye.
       //iss step ko hum render task method ke andar me bhi kar skte hai
             
})


}
todolist();

//=================================================================================================================

function dailyplanner(){
       var dayplandata = JSON.parse(localStorage.getItem('dayplandata')) || {}
var dayplanner = document.querySelector('.day-planner')


// var hours = Array.from({length:18},function(elem,idx){//array traversal for length 18
//        return `${6+idx}:00 - ${7+idx}:00`
//  })
var hours = Array.from({length:18},(_,idx)=> `${6+idx}:00 - ${7+idx}:00`)

 var wholedaysum =''
 hours.forEach(function(elem,idx){
  var saveddata = dayplandata[idx] || ''
  wholedaysum += `<div class="day-planner-time">
                    <p>${elem}</p>
                    <input id = "${idx}" type="text" placeholder="..." value = "${saveddata}">
                </div>`

 })
dayplanner.innerHTML = wholedaysum

var dayplannerinput =  document.querySelectorAll('.day-planner input')
dayplannerinput.forEach(function(elem){
     elem.addEventListener('input',function(){
         dayplandata[elem.id]  = elem.value

         localStorage.setItem('dayplandata',JSON.stringify(dayplandata))
     })
})
}
dailyplanner();

//==================================================================================================================

function motivationalquote(){
       var motivationquote =document.querySelector('.motivation-2 h1' )
var motivationauthor = document.querySelector('.motivation-3 h2')
 

async function fetchquote(){
       let response = await fetch('https://dummyjson.com/quotes/random')
       let data = await response.json()

       motivationquote.innerHTML = data.quote
       motivationauthor.innerHTML = '~ ' + data.author

}
fetchquote()
}
motivationalquote()

//==================================================================================================================

function pomodoro(){
       
let timer = document.querySelector('.pomo-timer h1')
var startbtn = document.querySelector('.pomo-timer .start-timer')
var pausebtn = document.querySelector('.pomo-timer .pause-timer')
var resetbtn = document.querySelector('.pomo-timer .reset-timer')

var session = document.querySelector('.pomodoro-fullpage .session')

let totalseconds = 25*60; //total time taken = 25 minutes = 1500 seconds
timertinterval = null;
var isworksession = true;

function updatetimer(){
       let minutes = Math.floor(totalseconds/60)
       let seconds = totalseconds%60
       
       timer.innerHTML = `${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')}`
       //padstart is a method that is used on strings, thats why we converted minutes and seconds into string.
       //padstart method adds a padding of some given characters in the starting, if the length of the called string is less than the given max length in padstart method.
       //here the max len we gave is 2, and character to pad is 0. this ensures when seconds become single digit thep appear in "00" format not single digit.
}

function starttimer(){
       clearInterval(timertinterval)//clear interval before starting so that the speed of decrement doesnt increase after repeated consequent clicks on start button
      

       if(isworksession){
       
              timertinterval=setInterval(function(){
              
       if(totalseconds>0){
             totalseconds-- 
             updatetimer()
       }
       else{
              isworksession = false
              clearInterval(timertinterval)
              timer.innerHTML='05:00'
              session.innerHTML = 'Take a Break'
              session.style.backgroundColor = 'var(--blue)'
              totalseconds = 5*60
       }

       },1000)

       }else{
              
              timertinterval=setInterval(function(){

              if(totalseconds>0){
             totalseconds-- 
             updatetimer()
       }
       else{
              isworksession = true
              clearInterval(timertinterval)
              timer.innerHTML='25:00'
              session.innerHTML = 'Work Session'
              session.style.backgroundColor = 'var(--green)'
              totalseconds = 25*60
              
       }

       },1000)
       
       }
}


function pausetimer(){
       clearInterval(timertinterval)//clears the inerval
}
function resettimer(){
       clearInterval(timertinterval)
       totalseconds = 25*60
       updatetimer()
}
startbtn.addEventListener('click',starttimer)
pausebtn.addEventListener('click',pausetimer)
resetbtn.addEventListener('click',resettimer)
}
pomodoro()
//==================================================================================================================

function weatherboard(){
       var apiKey = '984d7f67eccc49e482680738260505'
var city = 'Delhi'



var header1time = document.querySelector('.header1 h1')
var header1date = document.querySelector('.header1 h2')
var header2temp = document.querySelector('.header2 h2')
var header2condition = document.querySelector('.header2 h4')
var header2precp = document.querySelector('.header2 .Precipitation')
var header2humi = document.querySelector('.header2 .Humidity')
var header2wind = document.querySelector('.header2 .Wind')

var data = null
async function weatherapicall(){
       var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)//we need to provide the "key" ie api key and "q" ie city
       data = await response.json()
       
       header2temp.innerHTML = `${data.current.temp_c}°C`
       header2condition.innerHTML = `${data.current.condition.text}`
       header2wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`
       header2precp.innerHTML = `Precipitation: ${data.current.precip_in}%`
       header2humi.innerHTML = `Humidity: ${data.current.humidity}%`

}
weatherapicall()

var date = null
function timedate(){
       const daysofweek =['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

       const months = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"]
     date = new Date()//this method gives date
     var dayofweek = daysofweek[date.getDay()]//this getDay() method gives the numer of a day of the week , using that number of day we can get the particular day by name using the array.
     var hours = date.getHours()
     var minutes = date.getMinutes()
     var seconds = date.getSeconds()
     var day = date.getDate()
     var month = months[date.getMonth()]
     var year = date.getFullYear()

     header1date.innerHTML = `${day} ${month},${year}`
     
     if(hours>12){
       header1time.innerHTML = `${dayofweek}, ${String(hours-12).padStart('2','0')}:${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')} pm`
     }else{
       header1time.innerHTML = `${dayofweek}, ${String(hours).padStart('2','0')}:${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')} am`
     }
}
setInterval(function(){
       timedate()
},1000)//we call timedate() in setinterval so that the seconds (in time slot) can change on the webpage subsequently without reloading the page


}
weatherboard()

//===================================================================================================================

function changetheme(){
       var theme = document.querySelector('.theme')
var rootelement= document.documentElement//this is used to select the entire html script

var flag = 0

theme.addEventListener('click',function(){

       if(flag==0){

       rootelement.style.setProperty('--pri','#EAEFEF')
       rootelement.style.setProperty('--tri1','#BFC9D1')
       rootelement.style.setProperty('--tri2','#296374')
       rootelement.style.setProperty('--tri3','#658C58')
       rootelement.style.setProperty('--sec','#25343F')
       
       flag = 1
       
       }else if(flag==1){
              
       rootelement.style.setProperty('--pri','#F3F4F4')
       rootelement.style.setProperty('--tri1','#7d1f40')
       rootelement.style.setProperty('--tri2','#612D53')
       rootelement.style.setProperty('--tri3','rgb(46, 24, 24)')
       rootelement.style.setProperty('--sec','#292929')
        
       flag = 2

       }else if(flag==2){
         
       rootelement.style.setProperty('--pri','#F6F3EB')
       rootelement.style.setProperty('--tri1','#C9CAAC')
       rootelement.style.setProperty('--tri2','#869B7E')
       rootelement.style.setProperty('--tri3','#8A7650')
       rootelement.style.setProperty('--sec','#452E5A')
        
       flag = 0;
       }
})
}
changetheme()
// ===================================================================================================================

/* ============================================================
   DAILY GOALS - FINAL REFINED LOGIC
   ============================================================ */


function dailygoals(){
       // 1. Enhanced Image Mapping
       const dgImageMap = {

    running: {

        keywords: ["run", "running", "jog", "jogging", "sprint", "marathon", "treadmill"],

        url: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=500&q=80"

    },

    fitness: {

        keywords: ["gym", "workout", "exercise", "lifting", "training", "fitness", "muscle", "bench", "strength"],

        url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80"

    },

    walking: {

        keywords: ["walk", "walking", "steps", "stroll", "outside", "treadmill"],

        url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=80"

    },

    eating: {

        keywords: ["eat", "food", "healthy", "meal", "breakfast", "lunch", "dinner", "protein", "diet"],

        url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80"

    },

    coding: {

        keywords: ["code", "programming", "javascript", "python", "web", "dev", "software", "java", "leetcode", "dsa","code forces"],

        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80"

    },

    reading: {

        keywords: ["read", "book", "library", "novel", "literature", "kindle", "story"],

        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80"

    },

    water: {

        keywords: ["water", "hydrate", "drink"],

        url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&q=80"

    },

    bathing: {
        keywords: ["bath", "bathing", "shower", "freshen up", "fresh", "grooming", "hygiene", "soap", "wash"],
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80"
    },

    meditation: {

        keywords: ["meditate", "yoga", "peace", "zen", "mindfulness", "breath", "mental health"],

        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80"

    },

    study: {

        keywords: ["study", "exam", "college", "school", "homework", "learn", "course", "lecture","classes"],

        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80"

    },

    cleaning: {

        keywords: ["clean", "tidy", "laundry", "dishes", "organize", "chore", "room"],

        url: "https://images.unsplash.com/photo-1581578731548-c64695cc6958?w=500&q=80"

    },

    sleep: {

        keywords: ["sleep", "rest", "bed", "nap", "early"],

        url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&q=80"

    },

    finance: {

        keywords: ["money", "save", "budget", "finance", "invest", "bill", "bank"],

        url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&q=80"

    },

    productivity: {

        keywords: ["work", "focus", "office", "meeting", "email", "tasks", "deadline"],

        url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&q=80"

    },

    hobbies: {

        keywords: ["game", "play", "music", "guitar", "art", "paint", "draw", "hobby"],

        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80"

    },

    social: {

        keywords: ["call", "meet", "friend", "family", "social", "party", "talk"],

        url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80"

    },

    shopping: {

        keywords: ["buy", "shop", "grocery", "order", "store"],

        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"

    }

};

// 2. State Management
let dgGoalCount = 0;
let dgTotalPoints = 0;
let dgDecisionsMade = 0;
let currentDayIndex = new Date().getDay(); // Initialized to today

// 3. DOM Elements
const dgSetGoalBtn = document.querySelector("#dg-set-goal-btn");
const dgGoalInput = document.querySelector("#dg-goal-input");
const dgCardsContainer = document.querySelector("#dg-cards-container");
const dgScoreDisplay = document.querySelector("#dg-current-score");

// 4. Helper: Image Matching Logic
const getGoalImage = (userInput) => {
    const text = userInput.toLowerCase();
    const words = text.split(/\s+/);

    for (const category in dgImageMap) {
        const keywords = dgImageMap[category].keywords;
        const isMatch = keywords.some(k => text === k || words.includes(k) || text.includes(k));
        if (isMatch) return dgImageMap[category].url;
    }
    return "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&q=80"; // Default
};

// 5. Update Weekly Grid (Heatmap Logic)
const updateWeeklyGrid = (dayIndex) => {
    const days = document.querySelectorAll('.dg-day');
    if (dayIndex >= 0 && dayIndex < days.length) {
        const activeDay = days[dayIndex];
        
        // Clean previous states
        activeDay.classList.remove('lvl-20', 'lvl-40', 'lvl-60', 'lvl-80', 'lvl-100');

        // Apply new heatmap level based on points achieved
        if (dgTotalPoints >= 100)      activeDay.classList.add('lvl-100');
        else if (dgTotalPoints >= 80) activeDay.classList.add('lvl-80');
        else if (dgTotalPoints >= 60) activeDay.classList.add('lvl-60');
        else if (dgTotalPoints >= 40) activeDay.classList.add('lvl-40');
        else if (dgTotalPoints >= 20) activeDay.classList.add('lvl-20');
        
        console.log(`Grid index ${dayIndex} updated. Score: ${dgTotalPoints}`);
    }
};

// 6. Handle Batch Completion
const finalizeDecision = () => {
    dgDecisionsMade++;

    if (dgDecisionsMade === 5) {
        updateWeeklyGrid(currentDayIndex);

        setTimeout(() => {
            // UI & State Reset
            dgCardsContainer.innerHTML = "";
            dgGoalCount = 0;
            dgDecisionsMade = 0;
            dgTotalPoints = 0;
            dgScoreDisplay.innerText = "0";
            
            // Advance Day Index (Loops 0-6)
            currentDayIndex = (currentDayIndex + 1) % 7; 
            
            alert("Daily batch complete! Tracker updated.");
        }, 800);
    }
};

// 7. Event Listener: Goal Creation
dgSetGoalBtn.addEventListener("click", () => {
    const goalValue = dgGoalInput.value.trim();

    if (goalValue !== "" && dgGoalCount < 5) {
        dgGoalCount++;
        const imageUrl = getGoalImage(goalValue);
        
        const card = document.createElement("div");
        card.classList.add("dg-card");
        card.innerHTML = `
            <div class="dg-card-img-container">
                <img src="${imageUrl}" alt="${goalValue}">
            </div>
            <div class="dg-card-content">
                <h3>${goalValue}</h3>
                <div class="dg-btn-group">
                    <button class="dg-achieve-btn">Achieve</button>
                    <button class="dg-postpone-btn">Postpone</button>
                </div>
            </div>
        `;

        dgCardsContainer.appendChild(card);
        dgGoalInput.value = "";

        const achieveBtn = card.querySelector(".dg-achieve-btn");
        const postponeBtn = card.querySelector(".dg-postpone-btn");

        // Logic for "Achieve"
        achieveBtn.addEventListener("click", () => {
            achieveBtn.classList.add("dg-completed");
            achieveBtn.innerText = "Done";
            postponeBtn.style.display = "none";
            
            dgTotalPoints += 20;
            dgScoreDisplay.innerText = dgTotalPoints;
            
            finalizeDecision();
        });

        // Logic for "Postpone"
        postponeBtn.addEventListener("click", () => {
            postponeBtn.classList.add("dg-postponed");
            postponeBtn.innerText = "Later";
            achieveBtn.style.display = "none";
            
            finalizeDecision();
        });

    } else if (dgGoalCount >= 5) {
        alert("Daily limit reached! Finish your current set first.");
    }
});
}
dailygoals()