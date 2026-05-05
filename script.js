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


