console.log("lets write javascript code");
let songs;
let currentsong = new Audio(); 
let currentFolder;


function secondsToMMSS(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00"; // Handle invalid input
  }

  // Round to the nearest second
  const roundedSeconds = Math.round(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  // Format minutes and seconds to always have two digits
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  // Combine the formatted minutes and seconds with a colon
  return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
const timeInSeconds = 125.678;
const formattedTime = secondsToMMSS(timeInSeconds);
//console.log(formattedTime);  // Output: "02:06"


async function getsongs(folder) {
  currentFolder = folder
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  //console.log(response);
  
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  //console.log(as);

   songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
    
  }
 // return songs
  // show all songs in playlist
  let songUl = document.querySelector('.songlist').getElementsByTagName('ul')[0]
  songUl.innerHTML = ' '
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li> <img class="invert " src="/img/music.svg" alt="">
                              <div class="info">
                                  <div> ${song.replaceAll('%20',' ')} </div>
                                  <div>Darshan</div>
                              </div>
                              <div class="playnow"> 
                                  <span>Play Now</span> 
                                  <img src="/img/playnow.svg" alt="">
                              </div> 
    </li>`
    
  }
  // attach an event listener to each song
  Array.from (document.querySelector('.songlist').getElementsByTagName('li')).forEach (e=>{
    e.addEventListener('click',e=>{
    // console.log(e.querySelector('.info').firstElementChild.innerHTML)
      playmusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
    })
  }) 
return songs
}


const playmusic = (track, pause = false)=>{
  //let audio = new Audio('/music/' + track)
  currentsong.src = `/${currentFolder}/`+ track
  if(!pause){
    currentsong.play()
    play.src = '/img/pause.svg'
  }
  document.querySelector('.songinfo').innerHTML = decodeURI(track);
  document.querySelector('.songtime').innerHTML = '00:00 / 00:00'; 
}
 
// Display all the albhums on the page
async function displayAlbums() {
  try {
    let albumListResponse = await fetch('http://127.0.0.1:5500/music/');
    let albumListHtml = await albumListResponse.text();
    
    let div = document.createElement('div');
    div.innerHTML = albumListHtml;
    let anchors = div.getElementsByTagName('a');
    let cardContainer = document.querySelector('.cardContainer');
    
    let array = Array.from(anchors);
    
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
      if (e.href.includes('/music')) {
        let folder = e.href.split('/').slice(-1)[0]; // Extract folder name
        //console.log(folder);
        
        try {
          // Fetch metadata of the folder
          let metadataResponse = await fetch(`http://127.0.0.1:5500/music/${folder}/info.json`);
          let metadata = await metadataResponse.json();
          
          // Append album card to cardContainer
          cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">
              <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                  <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" fill="#000" stroke-linejoin="round" />
                </svg>   
              </div>
              <img src="/music/${folder}/cover.jpg" alt="${metadata.title}">
              <h2>${metadata.title}</h2>
              <p>${metadata.description}</p>
            </div>`;
        } catch (error) {
          console.error(`Failed to fetch metadata for folder ${folder}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch album list:', error);
  }
     //load playlist whenever card is clicked
     Array.from( document.getElementsByClassName('card')).forEach (e=>{
      e.addEventListener('click', async  item =>{
      songs = await getsongs(`music/${item.currentTarget.dataset.folder}`)
       playmusic(songs[0])
      })
    })
}

displayAlbums();


/*
async function displayalbhums (){
let a = await fetch(`http://127.0.0.1:5500/music/`);
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let anchors = div.getElementsByTagName('a')
let cardContainer = document.querySelector('.cardContainer')
//console.log(anchors)

  let array = Array.from(anchors)

   for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  if(e.href.includes('/music')){
    let folder = e.href.split('/').slice(-1)[0]      //-1 or 4 to see the folder
    console.log(folder)

    // get metadata of folder
    let a = await fetch(`http://127.0.0.1:5500/music/${folder}/info.json`);
    let response = await a.json()
    
    //append albhum cards to cardContainer
    cardContainer.innerHTML = cardContainer.innerHTML +  `<div data-folder="ncs" class="card ">
    <div class="play">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" fill="#000" stroke-linejoin="round" />
    </svg>   
    </div>
    <img src="/music/${folder}/cover.jpg" alt="kanmani">
    <h2>${response.title}</h2>
    <p>${response.description}</p>
    </div>`

}
}


//load playlist whenever card is clicked
Array.from( document.getElementsByClassName('card')).forEach ( e=>{
  e.addEventListener('click', async  item =>{
    songs = await getsongs(`music/${item.currentTarget.dataset.folder}`)
    
        })
      })
    }
  */


async function main(){
 
  //get list of all songs
     await getsongs('music/cs')
    playmusic(songs[0], true)
    //console.log(songs)
   
    //display all the album on page
    //displayalbhums()                               //update here
  

    // attach an event listner to play,next snd previous
    play.addEventListener('click', () =>{
      if(currentsong.paused){
      currentsong.play()
      play.src = '/img/pause.svg'
      }
      else{
        currentsong.pause()
        play.src = '/img/play.svg'
      }
    })

    // listen timeupdate event
    currentsong.addEventListener('timeupdate',()=>{
    // console.log(currentsong.currentTime, currentsong.duration)
      document.querySelector('.songtime').innerHTML = `${secondsToMMSS(currentsong.currentTime)}/${secondsToMMSS(currentsong.duration)}`
      //seekbar circle
      document.querySelector('.circle').style.left = (currentsong.currentTime/currentsong.duration) * 100 +'%'
    })
   
    //add an event listner to seekbar
    document.querySelector('.seekbar').addEventListener('click', e=>{
      let percent =(e.offsetX / e.target.getBoundingClientRect().width) * 100
     document.querySelector('.circle').style.left = percent +'%';
     currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

     // add an event listner to hamburger
     document.querySelector('.hamburger').addEventListener('click', ()=>{
      document.querySelector('.left').style.left = '0'
     })

     //add an eventlistner to close
     document.querySelector('.close').addEventListener('click', ()=>{
      document.querySelector('.left').style.left = '-110%'
     })

     // add an eventlistner to previous
     preveious.addEventListener('click',()=>{
      currentsong.pause()
      console.log('previous clicked')
      let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0]) 
      console.log(index)
      if((index-1) >= 0){
        playmusic(songs[index-1])
        }
     
     })

     // add an eventlistner to next
     next.addEventListener('click',()=>{
      currentsong.pause()
      console.log('next clicked')
      console.log(songs)
      let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0]) 
      console.log(index)
      if((index+1) < songs.length){
        playmusic(songs[index+1])
      }
      //console.log(songs,index)
     })

     //add eventlistner to volume
     document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e)=>{
      console.log('setting volume to',e.target.value, '/100')  
      currentsong.volume = parseInt(e.target.value) / 100
      if(currentsong.volume > 0){
        document.querySelector('.volume>img').src = document.querySelector('.volume>img').src.replace('mute.svg','volume.svg')

      }
     })
     
     /*
       //load playlist whenever card is clicked
   Array.from( document.getElementsByClassName('card')).forEach (e=>{
    e.addEventListener('click', async  item =>{
    songs = await getsongs(`music/${item.currentTarget.dataset.folder}`)
     
    })
  })
     */

  //add eventlistner to mute the range
  document.querySelector('.volume>img').addEventListener('click', (e)=>{
    console.log(e.target)
    console.log('changing',e.target.src)
    if(e.target.src.includes('volume.svg')){
      e.target.src = e.target.src.replace('volume.svg', 'mute.svg')
      currentsong.volume = 0;
      document.querySelector('.range').getElementsByTagName('input')[0].value = 0;
    }
    else{
      e.target.src = e.target.src.replace('mute.svg', 'volume.svg')
       currentsong.volume = .10;
       document.querySelector('.range').getElementsByTagName('input')[0].value = 10;
    }
  })
  }
 main()