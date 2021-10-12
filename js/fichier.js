//function affiche les recettes
export async function displayRecipes() {
    // appel de la function from json
    var arrayFromJson = await getRecipesFromJson();
    var nodeCards = document.querySelector(".cards");

    //condition de recherche
    if (isResearchInRecipes(arrayFromJson)) {
    //filtre de l'array des recettes - appel de la condition du filtre - si true stock la recette

        var filterArray = filterRecipes(arrayFromJson);
        //appel fonction qui remplit les champs de la recherche avancée
        filledAdvancedSearchFields(filterArray);
        //appel function qui ajout l'event pour fermer le tag
        addEventCloseTag();
        //method qui parcours chaque recette
        for (let i = 0; i < filterArray.length; i++) {
            // appel de fonction de construction pour afficher la card d'une recette
            var recipeCardHtml = buildRecipeCardHtml(filterArray[i]);
            nodeCards.innerHTML += recipeCardHtml;
        }
        //appel fonction pour selectionner la card de la recette
        addEventCardRecipe();
    } else {
        nodeCards.innerHTML +=
      'Aucune recette ne correspond à votre critère.... vous pouvez chercher "tartes aux pommes", "poissons", etc.';
    }
    return 0;
}

function filterRecipes(arrayFromJson) {
    // create array vide
    var arrayFilter = new Array();
    for (let i = 0; i < arrayFromJson.length; i++) {
        if (checkSearchString(arrayFromJson[i])) {
            //ajoute la nouvelle recette dans le tableau
            arrayFilter.push(arrayFromJson[i]);
        }
    }
    return arrayFilter;
}

/*---------- fonction qui recupere le json----------*/
async function getRecipesFromJson() {
    let url = "https://melaniemdm.github.io/les_Petits_Plats/json/recipes.json";
    let rep = await fetch(url, { method: "GET" });
    let reponse = await rep.json();
    let arrayRecipes = reponse["recipes"];
    return arrayRecipes;
}

//renvoie true ou false en regardant  - si la valeur cherché est incluse dans les recettes
function isResearchInRecipes(arrayFromJson) {
    // valeur de l'input search
    var valueSearch = document.querySelector("#inputSearch").value.toLowerCase();
    //transforme le json en string
    var jsonString = JSON.stringify(arrayFromJson).toLowerCase();
    return jsonString.includes(valueSearch);
}

/*-----------fonction qui retourne true ou false si la valeur de la recherche est presente ou pas---*/
function checkSearchString(recipe) {
    var nodeInputValue = document.querySelector("#inputSearch").value;
    // variable qui stock la reponse la premiere recherche
    var firstSearch =
    recipe.name.includes(nodeInputValue.toLowerCase()) ||
    JSON.stringify(recipe.ingredients)
        .toLowerCase()
        .includes(nodeInputValue.toLowerCase()) ||
    recipe.description.includes(nodeInputValue.toLowerCase());
    //noeuds des tags
    var nodeTagIngredient = document.querySelector("#tagIngredient");
    var nodeTagAppliance = document.querySelector("#tagAppliance");
    var nodeTagUstensils = document.querySelector("#tagUstensiles");
    //condition si noeud tag est vide
    var secondSearch = true;
    if (!(
        nodeTagIngredient &&
    nodeTagAppliance &&
    nodeTagUstensils &&
    nodeTagIngredient.innerHTML === "" &&
    nodeTagAppliance.innerHTML === "" &&
    nodeTagUstensils.innerHTML === ""
    ))  {
        var iconCloseTag = `<i class="fa fa-times-circle-o" aria-hidden="true"></i>`;
        var listTagIngredient = nodeTagIngredient.innerHTML.split(iconCloseTag);
        var listTagAppliance = nodeTagAppliance.innerHTML.split(iconCloseTag);
        var listTagUstensils = nodeTagUstensils.innerHTML.split(iconCloseTag);
        //supprime le dernier element de la liste - supp ligne vide
        listTagIngredient.pop();
        for (let i = 0; i < listTagIngredient.length; i++) {
            //appel de la fonction qui recupere l'ingredient
            let tag = getIngredient(listTagIngredient[i]);

            secondSearch =
        secondSearch &&
        JSON.stringify(recipe.ingredients)
            .toLowerCase()
            .includes(tag.trim().toLowerCase());
        }
        listTagAppliance.pop();
        for (let i = 0; i < listTagAppliance.length; i++) {
            let tag = getAppliance(listTagAppliance[i]);
            secondSearch =
        secondSearch &&
        JSON.stringify(recipe.appliance)
            .toLowerCase()
            .includes(tag.trim().toLowerCase());
        }
        listTagUstensils.pop();
        for (let i = 0; i < listTagUstensils.length; i++) {
            let tag = getUstensil(listTagUstensils[i]);
            secondSearch =
        secondSearch &&
        JSON.stringify(recipe.ustensils)
            .toLowerCase()
            .includes(tag.trim().toLowerCase());
        }
    }
    return firstSearch && secondSearch;
}
//function qui recupere l'ingredient
function getAppliance(tag) {
    return splitTagSearchAvanced(tag);
}
//function qui recupere l'ingredient
function getIngredient(tag) {
    return splitTagSearchAvanced(tag);
}
//function qui recupere l'ingredient
function getUstensil(tag) {
    return splitTagSearchAvanced(tag);
}

//fonction qui split le code qui mermet de recuperer l'ingredient  ou l'ustensil ou l'appareil
function splitTagSearchAvanced(tag) {
    tag = tag.split('<div class="cardTag">')[1];
    tag = tag.split('<div class="close">')[0];
    return tag;
}

//remplit les champs de recherche avancée
async function filledAdvancedSearchFields(arrayFromJson) {
    //recherche avancée des ingrédients
    var nodeListeIngredients = document.querySelector("#listIngredients");
    nodeListeIngredients.innerHTML = "";
    //recherche avancée des appareil
    var nodeListeAppliance = document.querySelector("#listAppliance");
    nodeListeAppliance.innerHTML = "";
    //recherche avancée des ustensiles
    var nodeListeUstensiles = document.querySelector("#listUstensiles");
    nodeListeUstensiles.innerHTML = "";

    for (let i = 0; i < arrayFromJson.length; i++) {
        var arrayIngredientsForOneRecipe = arrayFromJson[i].ingredients;
        //boucle pour eviter les doublons des ingredients
        for (let j = 0; j < arrayIngredientsForOneRecipe.length; j++) {
            //condition qui test si l'ingredient n'existe pas deja
            if (
                isIngredientNotInNode(
                    nodeListeIngredients,
                    arrayIngredientsForOneRecipe[j]
                )
            ) {
                //recupere la valeur de l'input pour afficher que les ingredients concernés
                if (
                    arrayIngredientsForOneRecipe[j].ingredient
                        .toLowerCase()
                        .includes(
                            document.querySelector("#nameIngredients").value.toLowerCase()
                        )
                ) {
                    nodeListeIngredients.innerHTML +=
            `<div class="ingredient">` +
            arrayIngredientsForOneRecipe[j].ingredient +
            `</div>`;
                }
            }
        }

        var arrayFromJsonUstensils = arrayFromJson[i].ustensils;
        //boucle pour eviter les doublons
        for (let k = 0; k < arrayFromJsonUstensils.length; k++) {
            //condition qui fait appel a la function qui test si l'ustensil est dans la liste
            if (
                isInustensilsNotInNode(nodeListeUstensiles, arrayFromJsonUstensils[k])
            ) {
                //recupere la valeur de l'input pour afficher que les ustensiles concernés
                if (
                    arrayFromJsonUstensils[k]
                        .toLowerCase()
                        .includes(
                            document.querySelector("#nameUstensiles").value.toLowerCase()
                        )
                ) {
                    nodeListeUstensiles.innerHTML +=
            `<div class="ustensils">` + arrayFromJsonUstensils[k] + `</div>`;
                }
            }
        }

        //condition qui fait appel a la function qui test si l'appareil est dans la liste
        if (isApplianceNotInNode(nodeListeAppliance, arrayFromJson[i].appliance)) {
            if (
                arrayFromJson[i].appliance
                    .toLowerCase()
                    .includes(
                        document.querySelector("#nameAppliance").value.toLowerCase()
                    )
            ) {
                nodeListeAppliance.innerHTML +=
          `<div class="appliance">` + arrayFromJson[i].appliance + `</div>`;
            }
        }
    }
    // recupere noeud pour event au click sur le mot
    var nodeIngredientDiv = document.querySelectorAll(".ingredient");
    for (let i = 0; i < nodeIngredientDiv.length; i++) {
        nodeIngredientDiv[i].addEventListener("click", getCliked);
    }
    var nodeUstensilsDiv = document.querySelectorAll(".ustensils");
    for (let i = 0; i < nodeUstensilsDiv.length; i++) {
        nodeUstensilsDiv[i].addEventListener("click", getCliked);
    }
    var nodeAppliancesDiv = document.querySelectorAll(".appliance");
    for (let i = 0; i < nodeAppliancesDiv.length; i++) {
        nodeAppliancesDiv[i].addEventListener("click", getCliked);
    }

    return 0;
}
// function qui demande si l'ingredient existe deja
function isIngredientNotInNode(nodeListeIngredients, ingredient) {
    return (
        nodeListeIngredients.innerHTML
            .toLowerCase()
            .includes(ingredient.ingredient.toLowerCase()) === false
    );
}
// function qui demande si l'ustensils existe deja
function isInustensilsNotInNode(nodeListeUstensiles, ustensils) {
    return (
        nodeListeUstensiles.innerHTML
            .toLowerCase()
            .includes(ustensils.toLowerCase()) === false
    );
}
// function qui demande si l'appareil existe deja
function isApplianceNotInNode(nodeListeAppliance, appliance) {
    return (
        nodeListeAppliance.innerHTML
            .toLowerCase()
            .includes(appliance.toLowerCase()) === false
    );
}

// construction de la card d'une recette
function buildRecipeCardHtml(recipe) {
    //arrondi un nmbre au hasard entre 0 et 1 * 1000
    var number = Math.floor(Math.random() * 1000);
    var sourceImg =
    "https://source.unsplash.com/collection/4466406/480x480?sig=" +
    number +
    "&client_id=hXJZfm926ewJ7LxaoHzwVxiR7cyTnkdu3Vidn6Ojdew";
    var timing = recipe.time;
    //appel de la fonction qui construit l'affichage des ingredients
    var ingredients = buildDisplayOfIngredients(recipe);

    var instruction = recipe.description;
    var titleRecette = recipe.name;
    var cardHtml =
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
        <div class="timing">  <i class="far fa-clock iconClock"> </i> &nbsp; <div class="numberTiming">` +
    timing +
    ` </div> <div class="minTiming" >  min </div></div>
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
    return cardHtml;
}
//construction de l'affichage des ingredients
function buildDisplayOfIngredients(recipe) {
    var ingredients = "<ul>";
    //boucle
    for (let i = 0; i < recipe.ingredients.length; i++) {
        ingredients +=
      "<li> <span class='nameIngredient'> " +
      recipe.ingredients[i].ingredient +
      `</span>`; // ajout quantity
        if (recipe.ingredients[i].quantity) {
            ingredients += ":" + " " + recipe.ingredients[i].quantity;
        }
        //ajout de unit
        if (recipe.ingredients[i].unit) {
            ingredients += " " + recipe.ingredients[i].unit;
        }
        ingredients += "</li>";
    }
    ingredients += "</ul>";

    return ingredients;
}
//Ecouteur au click sur la loupe
var nodeSearch = document.querySelector("#search");
nodeSearch.addEventListener("click", rechargeRecipes);
//ecouteur au keyup sur le champs recherche
var nodeInputSearch = document.querySelector("#inputSearch");
nodeInputSearch.addEventListener("keyup", rechargeRecipes);
//recharge les recettes au click
function rechargeRecipes(e) {
    //empeche le comportement par default du chargement
    e.preventDefault();
    e.stopImmediatePropagation();
    var nodeCards = document.querySelector(".cards");
    //recupere la value de l'input
    var textOfSearch = document.querySelector("#inputSearch").value;
    if (textOfSearch.length >= 3) {
    //vider la page
        nodeCards.innerHTML = "";
        //affichage des cards grace à l'appel de la fonction
        displayRecipes();
    }
}

/*------- tronc du paragraphe de la card-------*/
function troncInstruction(text) {
    var numberletter = 138;
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
nodeSearchIngredients.style.display= "none";
//appareil - recherche
var nodeSearchAppliance = document.querySelector("#searchAppliance");
nodeSearchAppliance.style.display= "none";
//ustensiles - recherche
var nodeSearchUstensiles = document.querySelector("#searchUstensiles");
nodeSearchUstensiles.style.display= "none";

//fonction de disparation de la recherche avancée
function disappear(e) {
    
    //ingredients - appareil - ustensiles
    var targetEventTitle = e.currentTarget.title;
    var nodeDisappear = document.querySelector("#display" + targetEventTitle);
    if (nodeDisappear) {
        nodeDisappear.style.display= "none";
    }
    appear(targetEventTitle);
}
//fonction qui fait apparaitre la recherche avancée
function appear(targetEventTitle) {
    //ingredients - appareil - ustensiles
    var disappearSearchIngredients = document.querySelector(
        "#search" + targetEventTitle
    );
    disappearSearchIngredients.style.display= "block";
}

//ecouteur au keyup pour mettre a jour la liste
var nodeInputSearchIngredient = document.querySelector("#nameIngredients");
nodeInputSearchIngredient.addEventListener("keyup", updateListIngredients);

var nodeInputSearchUstensiles = document.querySelector("#nameUstensiles");
nodeInputSearchUstensiles.addEventListener("keyup", updateListIngredients);
var nodeInputSearchAppliance = document.querySelector("#nameAppliance");
nodeInputSearchAppliance.addEventListener("keyup", updateListIngredients);
//mise a jour liste des ingredients
async function updateListIngredients() {
    //recuperation du json
    var arrayFromJsonAdvanced = await getRecipesFromJson();

    //recettes filtrées
    var filterArrayAdvanced = filterRecipes(arrayFromJsonAdvanced);
    //appel de fonction qui rempli la recherche avancée
    filledAdvancedSearchFields(filterArrayAdvanced);

    //appel de la fonction
    setEventOnAdvancedSearchLists();
}
// function qui met un event sur chaque noeud des listes de recherches avancées
function setEventOnAdvancedSearchLists() {
    // recupere noeud pour event au click sur le mot
    var nodeIngredientDiv = document.querySelectorAll(".ingredient");
    for (let i = 0; i < nodeIngredientDiv.length; i++) {
        nodeIngredientDiv[i].addEventListener("click", getCliked);
    }

    var nodeUstensilsDiv = document.querySelectorAll(".ustensils");
    for (let i = 0; i < nodeUstensilsDiv.length; i++) {
        nodeUstensilsDiv[i].addEventListener("click", getCliked);
    }

    var nodeAppliancesDiv = document.querySelectorAll(".appliance");
    for (let i = 0; i < nodeAppliancesDiv.length; i++) {
        nodeAppliancesDiv[i].addEventListener("click", getCliked);
    }
}

//recuperer mot cliké
function getCliked(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    //cible de l'evenement cliké - mot cliké
    var clikedWord = e.target.innerHTML;

    //rend visible ou invisible le btn de seach ou display
    closeListIngredients();
    closeListAppliance();
    closeListUstensils();

    //noeuds des tags
    var nodeTagIngredient = document.querySelector("#tagIngredient");
    var nodeTagAppliance = document.querySelector("#tagAppliance");
    var nodeTagUstensils = document.querySelector("#tagUstensiles");
    //condition de gestion des tags
    if (isClickedWordNotInList(clikedWord)) {
    //gestion des tags
        if (e.target.className === "ingredient") {
            nodeTagIngredient.style.display = "block";
            nodeTagIngredient.innerHTML +=
        `<div class="cardTag">` +
        clikedWord +
        `<div class="close"> <i class="fa fa-times-circle-o"></i></div></div>`;
        }
        if (e.target.className === "appliance") {
            nodeTagAppliance.style.display = "block";
            nodeTagAppliance.innerHTML +=
        `<div class="cardTag">` +
        clikedWord +
        `<div class="close"> <i class="fa fa-times-circle-o"></i></div></div>`;
        }
        if (e.target.className === "ustensils") {
            nodeTagUstensils.style.display = "block";
            nodeTagUstensils.innerHTML +=
        `<div class="cardTag">` +
        clikedWord +
        `<div class="close"> <i class="fa fa-times-circle-o"></i></div></div>`;
        }
    }
    var nodeCards = document.querySelector(".cards");
    nodeCards.innerHTML = "";
    displayRecipes();
}
//function de close des listes
function closeListIngredients() {
    var nodeSearchIngredientsDisappear =
    document.querySelector("#searchIngredients");
    nodeSearchIngredientsDisappear.style.display = "none";
    var nodeDisplayIngredientsDisappear = document.querySelector(
        "#displayIngredients"
    );
    nodeDisplayIngredientsDisappear.style.display = "block";
}

function closeListAppliance() {
    var nodeSearchApplianceDisappear = document.querySelector("#searchAppliance");
    nodeSearchApplianceDisappear.style.display = "none";
    var nodeDisplayApplianceDisappear =
    document.querySelector("#displayAppliance");
    nodeDisplayApplianceDisappear.style.display = "block";
}

function closeListUstensils() {
    var nodeSearchUstensilsDisappear =
    document.querySelector("#searchUstensiles");
    nodeSearchUstensilsDisappear.style.display = "none";
    var nodeDisplayAUstensilsDisappear =
    document.querySelector("#displayUstensiles");
    nodeDisplayAUstensilsDisappear.style.display = "block";
}
//regarde si le mot cliké a deja été ajouté dans la liste des tags
function isClickedWordNotInList(clikedWord) {
    //noeuds des tags
    var nodeTagIngredient = document.querySelector("#tagIngredient");
    var nodeTagAppliance = document.querySelector("#tagAppliance");
    var nodeTagUstensils = document.querySelector("#tagUstensiles");
    return (
        (nodeTagIngredient.innerHTML.includes(clikedWord) ||
      nodeTagAppliance.innerHTML.includes(clikedWord) ||
      nodeTagUstensils.innerHTML.includes(clikedWord)) === false
    );
}

function addEventCardRecipe() {
    var nodecard = document.querySelectorAll(".card");
    for (let i = 0; i < nodecard.length; i++) {
        nodecard[i].addEventListener("click", selectRecipe);
    }
}
function selectRecipe(e) {
    var node = e.currentTarget;
    //affiche ler nom de la recette selectionnée
    var titleRecette = node.title;
    console.log("cette recette est selectionnée :" + titleRecette);
}

//close du tag
function addEventCloseTag() {
    var nodeClose = document.querySelectorAll(".close");
    for (let i = 0; i < nodeClose.length; i++) {
        nodeClose[i].addEventListener("click", closeTag);
    }
}
function closeTag(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var nodeCloseTag = e.target.parentNode.parentNode;
    var nodeCloseTagParent = nodeCloseTag.parentNode;
    nodeCloseTagParent.removeChild(nodeCloseTag);
    
    if(nodeCloseTagParent.innerHTML === ""){
        nodeCloseTagParent.style.display= "none";
    }
    //permet de recharger la page
    displayRecipes();
}

var nodeCloseListIngredient = document.querySelector("#closeListIngredient");
nodeCloseListIngredient.addEventListener("click",closeListIngredients);

var nodeCloseListAppliance = document.querySelector("#closeListAppliance");
nodeCloseListAppliance.addEventListener("click",closeListAppliance);

var nodeCloseListustensils = document.querySelector("#closeListUstensils");
nodeCloseListustensils.addEventListener("click",closeListUstensils);