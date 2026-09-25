const filter = document.getElementById("typeFilter");
const games = document.querySelectorAll(".game-grid");

filter.addEventListener("change", () => {
    const selected = filter.value;

    games.forEach(game => {
        const type = game.getAttribute("data-type");
        if (type === selected) {
            game.style.display = "";
        } 
        else {
            game.style.display = "none";
        }

    });

});