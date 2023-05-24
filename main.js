//felhasználónév megjegyzése
let username = JSON.parse(localStorage.getItem('username')) || "";
localStorage.setItem('username', JSON.stringify(username));
let recordpage = JSON.parse(localStorage.getItem('recordpage')) || [0,[]];
localStorage.setItem('recordpage', JSON.stringify(recordpage));

const userfield = document.querySelector('.menu label input');
userfield.value = username;

userfield.addEventListener("keyup", ()=> {
    username = userfield.value;
    localStorage.setItem('username', JSON.stringify(username));
});
//**************************************/
//nehézség állítása
const dif_button = document.querySelector('.difficulty button')
dif_button.addEventListener("click", () => {
    if (dif_button.className == "medium") {dif_button.className = "hard";dif_button.innerHTML = "Nehéz";}
    else if (dif_button.className == "hard") {dif_button.className = "easy";dif_button.innerHTML = "Könnyű";}
    else if (dif_button.className == "easy") {dif_button.className = "medium";dif_button.innerHTML = "Közepes";}
});
//**************************************/

const menu = document.querySelector('.menu');
const statpage = document.querySelector('.statpage');


const statsmenu = document.querySelector('.stats');
const back = document.querySelector('.back');

statsmenu.addEventListener('click', ()=> {
    menu.style.display = "none";
    statpage.style.display = "flex";
    recordpage[0] = 0;
    localStorage.setItem('recordpage', JSON.stringify(recordpage));
    newStatcounter.style.display = 'none';
    document.querySelector('.records').innerHTML = "";
    recordpage[1].forEach((e) => {
        document.querySelector('.records').innerHTML += `<div class="record">
                <div class="creator">
                    <h6>készítő</h6>
                    <h2>${e.name}</h2>
                </div>
                <div class="dif">
                    <h6>Nehézség</h6>
                    <h2>${e.diff}</h2>
                </div>
                <div class="lamps">
                    <h6>lámpák</h6>
                    <h2>${e.lamps}</h2>
                </div>
                <div class="time">
                    <h6>idő</h6>
                    <h2>${e.time}</h2>
                </div>
            </div>`
    })
});
back.addEventListener('click', ()=> {
    menu.style.display = "flex";
    statpage.style.display = "none";
});

//Játéktér********************************

const gamefield = document.querySelector('.gamefield');
let fields = [];
let easy = [[], [1,4,5,8], [], [7], [2], [6], [3], [], [1,4,5,8], []];
let medium = [[1,7], [2,8], [], [5,9], [3,5,9], [1,6], [0,3], [], [1,5,8], [3,9]];
let hard = [[0,3,8,9], [5,6], [1,4,7], [0,3,4,5,7], [2,9], [0,6,9], [0,2,4], [1,6,7,8], [3,8], [0,5,9]];
let gamerun = false;
let bulbcounter = 0;
let time = "0:00";
let sec = 0;
let min = 0;

function Gamestart() {
    document.querySelector('.game').style.display= 'flex';
    menu.style.display= 'none';

    gamerun = true;
    let diffname = document.querySelector('.difficulty button').className
    let difficulty = medium;
    let nehezsegmutato = document.querySelector('.nezehsegmutato');
    if (diffname == 'easy') {
        difficulty = easy;
        nehezsegmutato.className = `nezehsegmutato ${diffname}`;
        document.querySelector('.nezehsegmutato h3').innerHTML = "Könnyű"
    }
    else if (diffname == 'hard') {
        difficulty = hard;
        nehezsegmutato.className = `nezehsegmutato ${diffname}`;
        document.querySelector('.nezehsegmutato h3').innerHTML = "Nehéz"
    } else {
        nehezsegmutato.className = `nezehsegmutato ${diffname}`;
        document.querySelector('.nezehsegmutato h3').innerHTML = "Közepes"
    }
    gamefield.innerHTML = "";
    for (let i=0; i < 10; i++) {
        for (let j=0; j < 10; j++) {
            elem = document.createElement('div');
            elem.classList.add(i);
            elem.setAttribute('id', j);
            if (difficulty[i].includes(j)) elem.classList.add('black');
            
            gamefield.appendChild(elem);
            fields.push(elem)
        }
    }
    fields.forEach((f) => {
        f.addEventListener('click', (e)=> {
            if (gamerun) {
                if (!f.classList.contains('black') && !f.classList.contains('bulb')) {f.classList.add('bulb'); bulbcounter++}
                else if (f.classList.contains("bulb")) {f.classList.remove("bulb"); bulbcounter--}
                document.querySelector('.display .lamps').innerHTML = 'lámpák: ' + bulbcounter
                light();
            }
        });
    })
    setInterval(()=>{
        if (gamerun){
            sec++;
            if (sec >= 60) {
                sec = 0;
                min++
            }
            if (sec < 10) sec = '0' + sec;
            time = `${min}:${sec}`
            document.querySelector('.display .time').innerHTML = 'idő: ' + time;
        }
    }, 1000);

}

//világítás
function light() {
    fields.forEach(f => {f.classList.remove("light")})
    fields.filter(f => f.classList.contains('bulb')).forEach((e) => {
        for (let i = e.id; i < 10; i++) {
            field = fields.filter(f => f.className[0] == e.className[0])[i]
            if (field.classList.contains('black')) break;
            else if (!field.classList.contains('bulb')) {field.classList.add('light')}
            
        }
        for (let i = e.id; i >= 0; i--) {
            field = fields.filter(f => f.className[0] == e.className[0])[i]
            if (field.classList.contains('black')) break;
            else if (!field.classList.contains('bulb')) {field.classList.add('light')}
            
        }
        for (let i = e.className[0]; i >= 0; i--) {
            field = fields.filter(f => f.id == e.id)[i]
            if (field.classList.contains('black')) break;
            else if (!field.classList.contains('bulb')) {field.classList.add('light')}
            
        }
        for (let i = e.className[0]; i < 10; i++) {
            field = fields.filter(f => f.id == e.id)[i]
            if (field.classList.contains('black')) break;
            else if (!field.classList.contains('bulb')) {field.classList.add('light')}
            
        }
    })
    let gameend = true;
    fields.forEach(f => {
        if (!f.classList.contains('black') && !f.classList.contains('light') && !f.classList.contains('bulb')) {gameend=false}
    })
    if (gameend) Gameend();
    
}
const nextbutton = document.querySelector('.game .next');
function Gameend() {
    gamerun = false;
    nextbutton.style.display = 'block';
    document.querySelector('.game h1').style.display = 'block';
    recordpage[0]++;
    recordpage[1].unshift({
        name: username,
        diff: document.querySelector('.nezehsegmutato h3').innerHTML,
        lamps: bulbcounter,
        time: time
    });
    localStorage.setItem('recordpage', JSON.stringify(recordpage));
}
nextbutton.addEventListener('click', e=> {location.reload()})




//statisztika
const newStatcounter = document.querySelector('.stats span h6')
if (recordpage[0] == 0) newStatcounter.style.display = 'none';
else {newStatcounter.innerHTML = recordpage[0]}
