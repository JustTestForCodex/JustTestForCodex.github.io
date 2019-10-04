import Sound from "./module";

const context = new (window.AudioContext || window.webkitAudioContext)();

const playlist = [];



const play = (index) => {

    playlist[index] = new Sound(context);
    const music = playlist[index];
    
    const count_notes = 2 + Math.floor(Math.random() * 5);
    music.createMelody(count_notes);

    const interval_time = timeIntervals[index].value;
    if (interval_time < 50) {
        alert("Interval must be greater than 50");
        return;
    }

    melodies[index].value = music.melody.join(" ");

    const volume = volumes[index].value / 10;
    music.setVolume(volume);

    music.play(interval_time);
}

// Функция остановки воспроизведения
const stop = (index) => {
    // clearInterval(intervals[index]);
    // intervals[index] = 0;
    playlist[index].stop(index);
}

// Добавляем новую строчку

const addNewRow = () => {
    const last_row = document.getElementsByClassName("row_last")[0],
        panel = document.getElementsByClassName("panel")[0],
        height = parseFloat(getComputedStyle(panel).height);

    last_row.insertAdjacentHTML("beforebegin",

        `<div class="row">
                    <div class="ceil">
                        <button class="play toggle">
                            <span class="btn-text">Play</span>
                        </button>
                    </div>
                    <div class="ceil">
                        <div class="select-wrapper">
                            <select class="instrument">
                                <option>Piano</option>
                                <option>Guitar</option>
                            </select>
                        </div>
                    </div>
                    <div class="ceil">
                        <input type="text" class="melody" readonly>
                    </div>
                    <div class="ceil">
                        <input type="text" class="interval" value="1000" minlength="3" maxlength="6">
                    </div>
                    <div class="ceil">
                        <div class="select-wrapper">
                            <select class="effect">
                                <option>Пункт 1</option>
                                <option>Пункт 2</option>
                            </select>
                        </div>
                    </div>
                    <div class="ceil">
                        <input type="range" name="effect_gain" class="effect_gain" min="0" max="10" step="0.01"
                            value="5">
                        <output>5.00</output>
                    </div>
                    <div class="ceil">
                        <input type="range" name="volume" class="volume" min="0" max="10" step="0.01" value="5">
                        <output>5.00</output>
                    </div>
                    <button class="delete"></button>
                </div>`);
    const new_row = last_row.previousElementSibling;
    musicButtons = [...musicButtons, new_row.children[0].children[0]];
    melodies = [...melodies, new_row.children[2].children[0]];
    timeIntervals = [...timeIntervals, new_row.children[3].children[0]]
    volumes = [...volumes, new_row.children[6].children[0]];
    deleteButtons = [...deleteButtons, new_row.lastElementChild];
    rows.splice(rows.length - 1, 0, new_row);
    panel.style.height = `${height + 60}px`;
}

// Удаляем строчку 

const deleteRow = index => {
    const panel = document.getElementsByClassName("panel")[0],
        height = parseFloat(getComputedStyle(panel).height);
    panel.style.height = `${height - 60}px`;
    rows[index + 1].remove();
    rows.splice(index + 1, 1);
    deleteButtons.splice(index, 1);
}

// Достаем элементы

let allMusicButton = [...document.getElementsByClassName("toggle")],
    playAll = allMusicButton.pop(),
    musicButtons = allMusicButton,
    rows = [...document.getElementsByClassName("row")],
    infoButton = document.getElementById("info"),
    addTrack = document.getElementById("add"),
    deleteButtons = [...document.getElementsByClassName("delete")],
    volumes = [...document.getElementsByClassName("volume")],
    effects_gain = [...document.getElementsByClassName("effect_gain")],
    melodies = [...document.getElementsByClassName("melody")],
    timeIntervals = [...document.getElementsByClassName("interval")],
    panel = document.getElementsByClassName("panel")[0];

//  Обработчики событий


effects_gain.map(effect_gain => effect_gain.addEventListener("input", function () {
    this.nextElementSibling.value = parseFloat(this.value).toFixed(2);
}));



// infoButton.addEventListener("click", function () {
//     console.log(gainNodes);
// })




addTrack.addEventListener("click", function () {
    addNewRow();
});



panel.addEventListener("click", event => {
    const target = event.target;
    const playButton = target.closest(".play");
    const stopButton = target.closest(".stop");
    const deleteButton = target.closest(".delete");
    if (!(playButton || stopButton || deleteButton)) return;
    let index;
    for (let i = 0; i < musicButtons.length; i++) {
        if (playButton === musicButtons[i] || stopButton === musicButtons[i]) {
            index = i;
            break;
        }
    }
    if (playButton) {
        play(index);
        if (timeIntervals[index].value >= 50) {
            playButton.classList.value = playButton.classList.value.replace("play", "stop");
            playButton.children[0].innerText = "Stop";
        }
    } else if (stopButton) {
        stop(index);
        stopButton.classList.value = stopButton.classList.value.replace("stop", "play");
        stopButton.children[0].innerText = "Play";
    } else if (deleteButton) {
        for (let i = 0; i < deleteButtons.length; i++) {
            if (deleteButton === deleteButtons[i]) {
                index = i;
                break;
            }
        }
        deleteRow(index);
    }
});


panel.addEventListener("input", event => {
    const target = event.target; // где был клик?
    const interval = target.closest(".interval");
    // const effect_gain = target.closest(".effect_gain");
    const volume = target.closest(".volume");
    if (interval) {
        let newValue = interval.value.replace(/[^\d]/g, '');
        // if (newValue < 100) {
        //     newValue = 100;
        // } 
        interval.value = newValue

    } else {
        target.nextElementSibling.value = parseFloat(target.value).toFixed(2);
    }
    if (volume) {
        let index;
        for (let i = 0; i < volumes.length; i++) {
            if (volume === volumes[i]) {
                index = i;
                break;
            }
        }
        const music = playlist[index];
        console.log(index);
        console.log(music);
        music.setVolume(volume.value / 10);
    }

});


playAll.addEventListener("click", function () {
    if (this.classList[0] === "play-all") {
        this.classList.value = this.classList.value.replace("play-all", "stop-all");
        this.children[0].innerText = "S-All";
        musicButtons.map(btn => {
            if (btn.classList[0] === "play") {
                btn.click();
            }
        });
    } else {
        this.classList.value = this.classList.value.replace("stop-all", "play-all");
        this.children[0].innerText = "All";
        musicButtons.map(btn => {
            if (btn.classList[0] === "stop") {
                btn.click();
            }
        });
    }
})