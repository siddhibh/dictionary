const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    example = wrapper.querySelector(".example .details"),
    synonyms = wrapper.querySelector(".synonyms .list"),
    infotext = wrapper.querySelector(".info-text"),
    volumeIcon = wrapper.querySelector(".word i"),
    removeIcon = wrapper.querySelector(".search span");
let audio;

//  data function
function data(result, word) {
    if (result.title) { // if api returns the message of can't find the word
        infotext.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`
    }
    else {
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
            syno = result[0].meanings[0],
            phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

        // lets's pass the particular response data to a particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        audio = new Audio(result[0].phonetics[0].audio);
        if (definitions.example == undefined) {
            example.parentElement.style.display = "none";
        }
        else {
            example.parentElement.style.display = "block";
            document.querySelector(".example span").innerText = definitions.example;
        }
        if (syno.synonyms[0] == undefined) {
            synonyms.parentElement.style.display = "none";
        }
        else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onClick=search('${syno.synonyms[i]}')>${syno.synonyms[i]},</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }
    }
}

function search(word) {
    searchInput.value = word;
    fetchApi(word);
}


// fetch api function
function fetchApi(word) {
    wrapper.classList.remove("active");
    infotext.style.color = "#000"
    infotext.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; // dictionaryapi.dev api

    // fetching api response and returning it with parsing into js object and in another then
    // method calling data function with parsing api response and searched word as an argument
    fetch(url).then(res => res.json()).then(result => data(result, word));
}

searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
})

volumeIcon.addEventListener("click", () => {
    audio.play();
    setTimeout(() =>{
        volumeIcon.style.color = "#999";
    }, 800);
})

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infotext.style.color = "#9A9A9A";
    infotext.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
})