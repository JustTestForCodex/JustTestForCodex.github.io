import Sound  from "./module";
console.log(Sound);
const context = new (window.AudioContext || window.webkitAudioContext)();

let destination, gainNode, oscillator, intervals = [], gainNodes = [];


const play = (index) => {


    // получатель звука
    destination = context.destination;
    // ноты
    const controctave = {
        'C': 32.7,
        'C#': 34.6,
        'D': 36.7,
        'D#': 38.9,
        'E': 41.20,
        'F': 43.6,
        'F#': 46.3,
        'G': 49,
        'G#': 51.9,
        'A': 55,
        'A#': 58.3,
        'B': 61.8,
    },
        notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        count_notes = 2 + Math.floor(Math.random() * 5);
    let melody = [];

    for (let i = 0; i < count_notes; i++) {
        const note = notes[Math.floor(Math.random() * notes.length)],
            octava = 3 + Math.floor(Math.random() * 6),
            sharp = (note[1] == "#") ? true : false;
        melody = (sharp) ? [...melody, note[0] + octava + note[1]] : [...melody, note + octava];
    }

    

    const interval_time = timeIntervals[index].value;
    if (interval_time < 50) {
        alert("Interval must be greater than 50");
        return;
    }

    melodies[index].value = melody.join(" ");

    const play_note = (x) => {
        const note = x[0].toUpperCase(),
            octave = parseInt(x[1]),
            sharp = x[2] == '#' ? true : false;
        let frequency = sharp ? controctave[note + '#'] * Math.pow(2, octave - 1) : controctave[note] * Math.pow(2, octave - 1);
        // создаем генератор для нот
        const now = context.currentTime;
        oscillator = context.createOscillator();
        // создаем усилитель звука
        gainNode = context.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(destination);
        if (!gainNodes[index]) {
            gainNodes = [...gainNodes, gainNode];
        }
        gainNode.gain.exponentialRampToValueAtTime(
            0.00001, now + 1
        );
        gainNode.gain.value = volumes[index].value / 10;
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        oscillator.start(now);
        // oscillator.stop(now + 1);
    }


    const play_melody = () => {
        for (let i = 0; i < melody.length; i++) {
            console.log(intervals[index]);
            const timeout = setTimeout(() => {
                if (intervals[index]) {
                    play_note(melody[i]);
                } else {
                    clearTimeout(timeout);
                }
            }, interval_time * i);

        }
    }


    play_melody();

    const interval = setInterval(play_melody, interval_time * count_notes);

    intervals[index] = interval;
}

// Функция остановки воспроизведения
const stop = (index) => {
    clearInterval(intervals[index]);
    intervals[index] = 0;
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



infoButton.addEventListener("click", function () {
    console.log(gainNodes);
})




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
    if (volume && gainNode) {
        let index;
        for (let i = 0; i < volumes.length; i++) {
            if (volume === volumes[i]) {
                index = i;
                break;
            }
        }
        if (gainNodes[index]) {
            gainNodes[index].gain.value = volume.value / 10;
        }
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

    // const value = this.classList.value;
    // [value, this.children[0].innerText] = (this.classList[0] === "play-all")
    //     ? [value.replace("play-all", "stop-all"), "S-All"]
    //     : [value.replace("stop-all", "play-all"), "All"];
    // musicButtons.map(btn => {
    //     if (btn.classList[0] === "stop") {
    //         btn.click();
    //     }
    // });
})