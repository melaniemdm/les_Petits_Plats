//function affiche les recettes
export async function displayRecipes(){
// appel de la function from json
var arrayFromJson =  await getRecipesFromJson(); 
//boucle qui parcours le tableau json
for (let i = 0; i < arrayFromJson.length; i++){
  var valueSearch = document.querySelector("#inputSearch").value.toLowerCase();
  var recipe = arrayFromJson[i];
     //condition du search - met en minuscule la recherche et recherche dans une chaine de caractere - transforme l'array des ingredients en chaine de caractere
if(isSearchInRecipe(recipe, valueSearch)) {
var stockIngredientFiltres= listIngredient(recipe);
var nodeNameIngredient = document.querySelector("#listIngredients");

//met les ingredients dans le noeud
nodeNameIngredient.innerHTML += stockIngredientFiltres;


var stockUstensilFiltres= listUstensil(recipe);
var nodeNameUstensil = document.querySelector("#listUstensiles");
//met les ustensils dans le noeud
nodeNameUstensil.innerHTML += stockUstensilFiltres;

var stockApplianceFiltres= listAppliance(recipe);
var nodeNameAppliance = document.querySelector("#listAppareil");
//met les ustensils dans le noeud
nodeNameAppliance.innerHTML += stockApplianceFiltres;

buildCard(recipe);
}}
//event pour mettre dans la console l'ingredient cliqué
var nodeIngredientAdvanced = document.querySelectorAll(".ingredientAdvanced")
nodeIngredientAdvanced.forEach(ingredient=> ingredient.addEventListener("click", displayTagIngredientAdvanced))
//event pour mettre dans la console l'ustensil cliqué
var nodeUstensilAdvanced = document.querySelectorAll(".ustensilAdvanced")
nodeUstensilAdvanced.forEach(ustensil=> ustensil.addEventListener("click", displayUstensilAdvanced))
//event pour mettre dans la console l'appareil cliqué
var nodeAppareilAdvanced = document.querySelectorAll(".applianceAdvanced")
nodeAppareilAdvanced.forEach(appliance=> appliance.addEventListener("click", displayApplianceAdvanced))

var nodeCards = document.querySelector(".cards");
//affichage du message d'erreur
if( nodeCards.innerHTML==="" ){
    nodeCards.innerHTML+= 'Aucune recette ne correspond à votre critère.... vous pouvez chercher "tartes aux pommes", "poissons", etc.'
}
return 0;
}


function displayTagIngredientAdvanced(e){
    console.log(e.target)
}
function displayUstensilAdvanced(e){
    console.log(e.target)
}
function displayApplianceAdvanced(e){
    console.log(e.target)
}

function listIngredient(recipe){
    var ingredientFiltered = "";
    //parcours du tableau des ingedients filtrés
for(let i=0; i<recipe.ingredients.length;i++){
    var ingredient = recipe.ingredients[i].ingredient;
    if(document.querySelector("#listIngredients").innerHTML.toLowerCase().includes(ingredient.toLowerCase())=== false){
ingredientFiltered += `<div class ="ingredientAdvanced">`+ingredient + `</div>`;
    }}
return ingredientFiltered
}
function listUstensil(recipe){
    var ustensilFiltered = "";
    //parcours du tableau des ustensils filtrés
for(let i=0; i<recipe.ustensils.length;i++){
    var ustensil = recipe.ustensils[i];
    if(document.querySelector("#listUstensiles").innerHTML.toLowerCase().includes(ustensil.toLowerCase())=== false){
 ustensilFiltered += `<div class ="ustensilAdvanced">`+ustensil+ `</div>`;       
    }
}
return ustensilFiltered
}
//parcours la liste des appareils
function listAppliance(recipe){
    var applianceFiltered = "";
    if(document.querySelector("#listAppareil").innerHTML.toLowerCase().includes(recipe.appliance.toLowerCase())===false){
    applianceFiltered += `<div class ="applianceAdvanced">`+recipe.appliance+ `</div>`;     
    }
return applianceFiltered
}

//fonction qui verifie si la recherche est dans la recette
function isSearchInRecipe(recipe, valueSearch){
    var firstSearch = (recipe.name.toLowerCase().includes(valueSearch)|| valueSearch === "" || recipe.description.toLowerCase().includes(valueSearch) || JSON.stringify(recipe.ingredients).toLowerCase().includes(valueSearch));
    return firstSearch
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

function rechargeRecipes(e){
    //empeche le comportement par default du chargement
    e.preventDefault();
    e.stopImmediatePropagation();
var nodeCards= document.querySelector(".cards");
//recupere la value de l'input
var textOfSearch = document.querySelector("#inputSearch").value;
if(textOfSearch.length>=3){
   //vider la page
nodeCards.innerHTML=""; 
//affichage des cards grace à l'appel de la fonction
displayRecipes()
}
return 0
}
//construction card
function buildCard(recipe){
    var nodeCards = document.querySelector(".cards");
     //arrondi un nmbre au hasard entre 0 et 1 * 1000
     var number = Math.floor(Math.random() * 1000) ;
    var sourceImg = "https://source.unsplash.com/collection/4466406/480x480?sig="+number +"&client_id=hXJZfm926ewJ7LxaoHzwVxiR7cyTnkdu3Vidn6Ojdew";
    //affichage des ingredients
        var timing = recipe.time;
        var ingredients="<ul>";
        for(let j = 0; j<recipe.ingredients.length; j++){
        ingredients += "<li> <span class='nameIngredient'> "+ recipe.ingredients[j].ingredient + `</span>`    // ajout quantity 
        if(recipe.ingredients[j].quantity){
            ingredients  += ":" +" "+  recipe.ingredients[j].quantity  ;
        }
        //ajout de unit
        if( recipe.ingredients[j].unit){
        ingredients  +=  " "+ recipe.ingredients[j].unit   ;
        }
        ingredients  += "</li>"
    }
    ingredients += "</ul>" 
    
        var instruction=recipe.description;
       
    
        var titreRecette= recipe.name;
    nodeCards.innerHTML+= `<div class="card">
    <img class="card-img-top" src=`+sourceImg+` alt="Card image cap">
    <div class="card-body">
        <div class="firstPartieCard"> 
            <div class="recipesTitle"> `+titreRecette+`</div>
            <div class="timing">  <i class="far fa-clock"> </i> &nbsp; `+timing +` min </div>
        </div>
        <div class="secondPartieCard onePartieCard">
         <div class="ingredients">`+ ingredients +`
         </div>
         <div class="instruction">`+troncInstruction(instruction)+`</div>
        </div> 
    </div>
    </div>
    `
}
/*------- tronc du paragraphe-------*/
function troncInstruction(text){
var numberletter = 140;
if (text.length > numberletter ){
return text.substring(0,numberletter) +"...";
}else{
return text
}
};

var nodeInputSearch = document.querySelector("#inputSearch");
nodeInputSearch.addEventListener("keyup", startSearch);

/*--------recuperation de la valeur de l'input-------*/
function startSearch(event){
    var nodeCards= document.querySelector(".cards");
    var textOfSearch = event.target.value;
       if(textOfSearch.length>=3){
        //vider la page dans tous les cas
    nodeCards.innerHTML=""; 
    //recharge la page dans tous les cas
     displayRecipes()     
    }else if (textOfSearch ===""){
//vider la page dans tous les cas
nodeCards.innerHTML=""; 
//recharge la page dans tous les cas
 displayRecipes()   
    }
};


