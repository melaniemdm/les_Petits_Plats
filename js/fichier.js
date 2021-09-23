//function affiche les recettes
export async function displayRecipes() {
    // appel de la function from json
    var arrayFromJson = await getRecipesFromJson();
    //boucle qui parcours le tableau json
    for (let i = 0; i < arrayFromJson.length; i++) {
        var valueSearch = document
            .querySelector("#inputSearch")
            .value.toLowerCase();
        var recipe = arrayFromJson[i];
        //condition du search - met en minuscule la recherche et recherche dans une chaine de caractere - transforme l'array des ingredients en chaine de caractere
        if (isSearchInRecipe(recipe, valueSearch)) {
            var stockIngredientFiltres = listIngredient(recipe);
            var nodeNameIngredient = document.querySelector("#listIngredients");

            //met les ingredients dans le noeud
            nodeNameIngredient.innerHTML += stockIngredientFiltres;
            var stockUstensilFiltres = listUstensil(recipe);
            var nodeNameUstensil = document.querySelector("#listUstensiles");
            //met les ustensils dans le noeud
            nodeNameUstensil.innerHTML += stockUstensilFiltres;
            var stockApplianceFiltres = listAppliance(recipe);
            var nodeNameAppliance = document.querySelector("#listAppliance");
            //met les ustensils dans le noeud
            nodeNameAppliance.innerHTML += stockApplianceFiltres;
            buildCard(recipe);
        }
    }
    //event pour mettre dans la console l'ingredient cliqué
    var nodeIngredientAdvanced = document.querySelectorAll(".ingredientAdvanced");
    nodeIngredientAdvanced.forEach((ingredient) =>
        ingredient.addEventListener("click", displayTagIngredientAdvanced)
    );
    //event pour mettre dans la console l'ustensil cliqué
    var nodeUstensilAdvanced = document.querySelectorAll(".ustensilAdvanced");
    nodeUstensilAdvanced.forEach((ustensil) =>
        ustensil.addEventListener("click", displayUstensilAdvanced)
    );
    //event pour mettre dans la console l'appareil cliqué
    var nodeApplianceAdvanced = document.querySelectorAll(".applianceAdvanced");
    nodeApplianceAdvanced.forEach((appliance) =>
        appliance.addEventListener("click", displayApplianceAdvanced)
    );

    var nodeCards = document.querySelector(".cards");
    //appel fonction pour selectionner la card de la recette
    addEventCardRecipe();
    //affichage du message d'erreur
    if (nodeCards.innerHTML === "") {
        nodeCards.innerHTML +=
      'Aucune recette ne correspond à votre critère.... vous pouvez chercher "tartes aux pommes", "poissons", etc.';
    }
    return 0;
}
//selectionne un element de la liste
function displayTagIngredientAdvanced(e) {
    var ingredientTag = e.target.innerHTML;
    var nodeTagIngredient = document.querySelector("#tagIngredient");
    nodeTagIngredient.innerHTML =
    `<div class="cardTag">` +
    ingredientTag +
    `<div class="close"> <i class="fa fa-times-circle-o"></i></div></div>`;
    eventCloseTag();
    rechargeRecipes();
}
function displayUstensilAdvanced(e) {
    var ustensilTag = e.target.innerHTML;
    var nodeTagUstensil = document.querySelector("#tagUstensiles");
    nodeTagUstensil.innerHTML =
    `<div class="cardTag">` +
    ustensilTag +
    `<div class="close"> <i class="fa fa-times-circle-o"></i></div></div>`;
    eventCloseTag();
    rechargeRecipes();
}
function displayApplianceAdvanced(e) {
    var applianceTag = e.target.innerHTML;
    var nodeTagAppliance = document.querySelector("#tagAppliance");
    nodeTagAppliance.innerHTML =
    `<div class="cardTag">` +
    applianceTag +
    `<div class="close"> <i class="fa fa-times-circle-o"></i></div></div>`;
    eventCloseTag();
    rechargeRecipes();
}

function listIngredient(recipe) {
    var ingredientFiltered = "";
    //parcours du tableau des ingedients filtrés
    for (let i = 0; i < recipe.ingredients.length; i++) {
        var ingredient = recipe.ingredients[i].ingredient;
        var nameIngredients = document.querySelector("#nameIngredients");
        if (
            document
                .querySelector("#listIngredients")
                .innerHTML.toLowerCase()
                .includes(ingredient.toLowerCase()) === false &&
      ingredient.toLowerCase().includes(nameIngredients.value.toLowerCase())
        ) {
            ingredientFiltered +=
        `<div class ="ingredientAdvanced">` + ingredient + `</div>`;
        }
    }
    return ingredientFiltered;
}
function listUstensil(recipe) {
    var ustensilFiltered = "";
    //parcours du tableau des ustensils filtrés
    for (let i = 0; i < recipe.ustensils.length; i++) {
        var ustensil = recipe.ustensils[i];
        if (
            document
                .querySelector("#listUstensiles")
                .innerHTML.toLowerCase()
                .includes(ustensil.toLowerCase()) === false
        ) {
            ustensilFiltered +=
        `<div class ="ustensilAdvanced">` + ustensil + `</div>`;
        }
    }
    return ustensilFiltered;
}
//parcours la liste des appareils
function listAppliance(recipe) {
    var applianceFiltered = "";
    var appliance = recipe.appliance;
    if (
        document
            .querySelector("#listAppliance")
            .innerHTML.toLowerCase()
            .includes(appliance.toLowerCase()) === false
    ) {
        applianceFiltered +=
      `<div class ="applianceAdvanced">` + appliance + `</div>`;
    }
    return applianceFiltered;
}

//fonction qui verifie si la recherche est dans la recette
function isSearchInRecipe(recipe, valueSearch) {
    var firstSearch =
    recipe.name.toLowerCase().includes(valueSearch) ||
    valueSearch === "" ||
    recipe.description.toLowerCase().includes(valueSearch) ||
    JSON.stringify(recipe.ingredients).toLowerCase().includes(valueSearch);
    var secondSearchIngredient = true;
    var secondSearchUstensil = true;
    var secondSearchAppliance = true;
    var nodeTagIngredient = document.querySelector("#tagIngredient");
    var nodeTagUstensil = document.querySelector("#tagUstensiles");
    var nodeTagAppliance = document.querySelector("#tagAppliance");
    //split la partie de gauche
    var rightTagIngredient = nodeTagIngredient.innerHTML.split(
        '<div class="cardTag">'
    )[1];
    var rightTagUstensil = nodeTagUstensil.innerHTML.split(
        '<div class="cardTag">'
    )[1];
    var rightTagAppliance = nodeTagAppliance.innerHTML.split(
        '<div class="cardTag">'
    )[1];
    //recupere l'élément ingredient
    if (rightTagIngredient) {
        secondSearchIngredient = false;
        var valueTagIngredient = rightTagIngredient
            .split(
                '<div class="close"> <i class="fa fa-times-circle-o" aria-hidden="true"></i></div></div>'
            )[0]
            .trim()
            .toLowerCase();
        //recupere le tableau des ingredients
        var arrayIngredient = recipe.ingredients;

        for (let i = 0; i < arrayIngredient.length; i++) {
            var ingredient = arrayIngredient[i].ingredient.toLowerCase().trim();
            //compare la l'ingredient de la liste avec le tag
            if (ingredient === valueTagIngredient) {
                secondSearchIngredient = true;
            }
        }
    }
    //recupere l'élément ustensil
    if (rightTagUstensil) {
        secondSearchUstensil = false;
        var valueTagUstensil = rightTagUstensil
            .split(
                '<div class="close"> <i class="fa fa-times-circle-o" aria-hidden="true"></i></div></div>'
            )[0]
            .trim()
            .toLowerCase();
        //recupere le tableau des ustensils
        var arrayUstensil = recipe.ustensils;

        for (let i = 0; i < arrayUstensil.length; i++) {
            var ustensil = arrayUstensil[i].toLowerCase().trim();
            //compare la l'ingredient de la liste avec le tag
            if (ustensil === valueTagUstensil) {
                secondSearchUstensil = true;
            }
        }
    }
    //recupere l'élément appliance
    if (rightTagAppliance) {
        secondSearchAppliance = false;
        var valueTagAppliance = rightTagAppliance
            .split(
                '<div class="close"> <i class="fa fa-times-circle-o" aria-hidden="true"></i></div></div>'
            )[0]
            .trim()
            .toLowerCase();
        //recupere le tableau des ustensils
        var appliance = recipe.appliance.toLowerCase().trim();
        //compare la l'ingredient de la liste avec le tag
        if (appliance === valueTagAppliance) {
            secondSearchAppliance = true;
        }
    }

    return (
        firstSearch &&
    secondSearchIngredient &&
    secondSearchUstensil &&
    secondSearchAppliance
    );
}
/*---------- fonction qui recupere le json----------*/
async function getRecipesFromJson() {
    let url = "http://127.0.0.1:5500/json/recipes.json";
    let rep = await fetch(url, { method: "GET" });
    let reponse = await rep.json();
    let arrayRecipes = reponse["recipes"];
    return arrayRecipes;
}
/*--------------- recharge les recipes---------*/
var nodeSearch = document.querySelector("#search");
nodeSearch.addEventListener("click", rechargeRecipes);

function rechargeRecipes(e) {
    //empeche le comportement par default du chargement
    //test l'existence de e
    if (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
    var nodeCards = document.querySelector(".cards");
    //recupere la value de l'input
    var textOfSearch = document.querySelector("#inputSearch").value;
    if (textOfSearch.length >= 3 || textOfSearch === "") {
    //vider la page
        nodeCards.innerHTML = "";
        //vide le noeud des liste pour recharge ceux ci avec les elements filtrés
        var nodeNameIngredient = document.querySelector("#listIngredients");
        nodeNameIngredient.innerHTML = "";
        var nodeNameAppliance = document.querySelector("#listAppliance");
        nodeNameAppliance.innerHTML = "";
        var nodeNameUstensil = document.querySelector("#listUstensiles");
        nodeNameUstensil.innerHTML = "";
        //affichage des cards grace à l'appel de la fonction
        displayRecipes();
    }
    return 0;
}
//construction card
function buildCard(recipe) {
    var nodeCards = document.querySelector(".cards");
    //arrondi un nmbre au hasard entre 0 et 1 * 1000
    var number = Math.floor(Math.random() * 1000);
    var sourceImg =
    "https://source.unsplash.com/collection/4466406/480x480?sig=" +
    number +
    "&client_id=hXJZfm926ewJ7LxaoHzwVxiR7cyTnkdu3Vidn6Ojdew";
    //affichage des ingredients
    var timing = recipe.time;
    var ingredients = "<ul>";
    for (let j = 0; j < recipe.ingredients.length; j++) {
        ingredients +=
      "<li> <span class='nameIngredient'> " +
      recipe.ingredients[j].ingredient +
      `</span>`; // ajout quantity
        if (recipe.ingredients[j].quantity) {
            ingredients += ":" + " " + recipe.ingredients[j].quantity;
        }
        //ajout de unit
        if (recipe.ingredients[j].unit) {
            ingredients += " " + recipe.ingredients[j].unit;
        }
        ingredients += "</li>";
    }
    ingredients += "</ul>";

    var instruction = recipe.description;

    var titleRecette = recipe.name;
    nodeCards.innerHTML +=
    `<div class="card" title ="` +
    titleRecette +
    `">
        <img class="card-img-top" src=` +
    sourceImg +
    ` alt="Card image cap">
        <div class="card-body">
            <div class="firstPartieCard"> 
                <div class="recipesTitle"> ` +
    titleRecette +
    `</div>
                <div class="timing">  <i class="far fa-clock"> </i> &nbsp; ` +
    timing +
    ` min </div>
            </div>
            <div class="secondPartieCard onePartieCard">
             <div class="ingredients">` +
    ingredients +
    `
             </div>
             <div class="instruction">` +
    troncInstruction(instruction) +
    `</div>
            </div> 
        </div>
        </div>
     
        `;
    return 0;
}
/*------- tronc du paragraphe-------*/
function troncInstruction(text) {
    var numberletter = 140;
    if (text.length > numberletter) {
        return text.substring(0, numberletter) + "...";
    } else {
        return text;
    }
}
/*------- recherche avancée-------*/

//ingredients - btn
var nodeDisplayIngredients = document.querySelector("#displayIngredients");
nodeDisplayIngredients.addEventListener("click", disappear);
//appareil - btn
var nodeDisplayAppliance = document.querySelector("#displayAppliance");
nodeDisplayAppliance.addEventListener("click", disappear);
//ustensiles - btn
var nodeDisplayUstensiles = document.querySelector("#displayUstensiles");
nodeDisplayUstensiles.addEventListener("click", disappear);

//ingredients - recherche
var nodeSearchIngredients = document.querySelector("#searchIngredients");
nodeSearchIngredients.style.visibility = "hidden";
//appareil - recherche
var nodeSearchAppliance = document.querySelector("#searchAppliance");
nodeSearchAppliance.style.visibility = "hidden";
//ustensiles - recherche
var nodeSearchUstensiles = document.querySelector("#searchUstensiles");
nodeSearchUstensiles.style.visibility = "hidden";

//fonction de disparation de la recherche avancée
function disappear(e) {
    //ingredients - appareil - ustensiles
    var targetEventTitle = e.target.title;
    console.log(targetEventTitle);
    var nodeDisappear = document.querySelector("#display" + targetEventTitle);
    if (nodeDisappear) {
        nodeDisappear.style.visibility = "hidden";
    }
    appear(targetEventTitle);
}
//fonction qui fait apparaitre la recherche avancée
function appear(targetEventTitle) {
    //ingredients - appareil - ustensiles
    var disappearSearchIngredients = document.querySelector(
        "#search" + targetEventTitle
    );
    disappearSearchIngredients.style.visibility = "visible";
}
//event sur les noeuds de l'input
var nodeInputSearch = document.querySelector("#inputSearch");
nodeInputSearch.addEventListener("keyup", rechargeRecipes);

var nodeInputIngredient = document.querySelector("#nameIngredients");
nodeInputIngredient.addEventListener("keyup", filterSecondSearch);

var nodeInputAppliance = document.querySelector("#nameAppliance");
nodeInputAppliance.addEventListener("keyup", filterSecondSearch);

var nodeInputUstensil = document.querySelector("#nameUstensiles");
nodeInputUstensil.addEventListener("keyup", filterSecondSearch);

//recharge recipe
function filterSecondSearch(e) {
    rechargeRecipes(e);
    return 0;
}
//event sur closeTag
function eventCloseTag() {
    var nodeCloseTag = document.querySelectorAll(".close");
    nodeCloseTag.forEach((close) => close.addEventListener("click", closeTag));
    return 0;
}

//close du tag
function closeTag(e) {
    var nodeToRemove = e.target.parentNode.parentNode;
    nodeToRemove.parentNode.removeChild(nodeToRemove);
    rechargeRecipes();
    return 0;
}
//selection de la recette par l'utilisateur
function addEventCardRecipe() {
    var nodecard = document.querySelectorAll(".card");
    nodecard.forEach((recipe) => recipe.addEventListener("click", selectRecipe));
}
function selectRecipe(e) {
    var node = e.target;
    while (node.className !== "card") {
        node = node.parentNode;
    }
    //affiche ler nom de la recette selectionnée
    var titleRecette = node.title;
    console.log("cette recette est selectionnée :" + titleRecette);
}
