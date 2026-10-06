const form = document.getElementById("search_form");
const input = document.getElementById("search_box");
const status = document.getElementById("status");


// =========================
// SEARCH
// =========================

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();

    if (query === "") {
        status.textContent = "Please enter something to search.";
        return;
    }

    await search(query);
});


// =========================
// SEARCH FUNCTION
// =========================

async function search(query) {

    // Show loading message
    status.innerHTML = '<div class="spinner"></div> Searching…';

    // Show placeholder cards
    showSkeletons();

    const url =
        "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
        "&gsrsearch=" + encodeURIComponent(query) +
        "&gsrnamespace=6" +
        "&gsrlimit=20" +
        "&prop=imageinfo" +
        "&iiprop=url" +
        "&iiurlwidth=300" +
        "&format=json" +
        "&origin=*";

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();

        const items = Object.values(data.query.pages || {});

        status.textContent = "Showing " + items.length + " results.";

        render(items);

    } catch (error) {

        console.error(error);

        status.textContent = "Something went wrong. Please try again.";

        document.getElementById("box").innerHTML = "";
    }
}


// =========================
// SKELETON LOADING CARDS
// =========================

function showSkeletons() {

    const results = document.getElementById("box");

    results.innerHTML = "";

    for (let i = 0; i < 20; i++) {

        const card = document.createElement("article");

        card.className = "card skeleton";

        results.appendChild(card);
    }
}


// =========================
// RENDER RESULTS
// =========================

function render(items) {

    const results = document.getElementById("box");

    // Clear old results
    results.innerHTML = "";

    items.forEach((item) => {

        // Create card
        const card = document.createElement("article");

        card.className = "card";


        // Create image
        const img = document.createElement("img");

        img.src = item.imageinfo[0].thumburl;

        img.alt = item.title;


        // Create caption
        const caption = document.createElement("p");

        caption.textContent = item.title
            .replace(/^File:/, "")
            .replace(/\.[^/.]+$/, "");


        // Put image and caption inside card
        card.appendChild(img);
        card.appendChild(caption);


        // Put card inside main
        results.appendChild(card);
    });
}