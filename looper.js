const keys = new Tone.Players({
    urls: {
        kick: "samples/kick.WAV",
        snare: "samples/snare.WAV",
        hihat: "samples/hihat.WAV",
    },
}).toDestination();

// This is an object of sequence arrays, keeping track of each of the on/off positions of all the steps for each sample
const sequences = {
    kick:  [false, false, false, false,false, false, false, false],
    snare: [false, false, false, false,false, false, false, false],
    hihat: [false, false, false, false,false, false, false, false],
}

// Loops over all step sequencer rows ( each row represents a sample, indicated by its `data-sampleName` property
document.querySelectorAll(".step-sequencer").forEach((sampleSequencerElement) => {
    // Extract the sample name
    const sampleName = sampleSequencerElement.dataset.samplename;

    // Loop over each step for a sample, and wire a click event listener
    sampleSequencerElement.querySelectorAll("button").forEach((stepElement, step) => {
        stepElement.addEventListener("click", ( ev ) => {
            console.log("click", step, sampleName)

            // Toggle the element class to change the red light indicator
            stepElement.querySelector('.light').classList.toggle('active');

            // Toggle the sequence value for the instrument
            sequences[sampleName][step] = !sequences[sampleName][step];
        });
    })
})

// Play button click handler
document.querySelector(".play").addEventListener('click', ev => {
    Tone.Transport.start();
});

// This thing just ticks away at equal intervals, allowing us to step in and program the samples to play at each one of those intervals
new Tone.Sequence((time, step) => {
    for (const instrument in sequences) {
        sequences[instrument][step] && keys.player(instrument).start()
    }
}, [0,1,2,3,4,5,6,7]).start(0);

// Beats per minute
Tone.Transport.bpm.value = 120;

// Volume channel
let channel = new Tone.Channel(10).toMaster();
keys.connect(channel);