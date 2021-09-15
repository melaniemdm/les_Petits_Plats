//function affiche les recettes
export async function displayRecipes(){
    
// appel de la function from json
var arrayFromJson =  await getRecipesFromJson(); 
var nodeCards = document.querySelector(".cards");

//condition de recherche
if(isResearchInRecipes(arrayFromJson)){
    //filtre de l'array des recettes - appel de la condition du filtre - si true stock la recette
    var filterArray = arrayFromJson.filter(checkSearchString);
    //appel fonction qui remplit les champs de la recherche avancée
    filledAdvancedSearchFields(filterArray)
    //method qui parcours chaque recette
    filterArray.forEach(function(recipe){
     // appel de fonction de construction pour afficher la card d'une recette
     var recipeCardHtml = buildRecipeCardHtml(recipe);
    nodeCards.innerHTML+=  recipeCardHtml;
    }  )

}else{
    nodeCards.innerHTML+= 'Aucune recette ne correspond à votre critère.... vous pouvez chercher "tartes aux pommes", "poissons", etc.'
}
return 0;
}
// construction de la card d'une recette
function buildRecipeCardHtml(recipe){
  //arrondi un nmbre au hasard entre 0 et 1 * 1000
  var number = Math.floor(Math.random() * 1000) ;
  var sourceImg = "https://source.unsplash.com/collection/4466406/480x480?sig="+ number +"&client_id=hXJZfm926ewJ7LxaoHzwVxiR7cyTnkdu3Vidn6Ojdew";
         var timing = recipe.time;
     //appel de la fonction qui construit l'affichage des ingredients
  var ingredients =  buildDisplayOfIngredients(recipe)

     var instruction=recipe.description;
     var titreRecette= recipe.name;
var cardHtml = `<div class="card">
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
return cardHtml
}

function buildDisplayOfIngredients (recipe){
    //construction de l'affichage des ingredients   
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

return ingredients
}

//renvoie true ou false en regardant  - si la valeur cherché est incluse dans les recettes
function isResearchInRecipes (arrayFromJson){
    // valeur de l'input search
var valueSearch = document.querySelector("#inputSearch").value.toLowerCase();
//transforme le json en string
var jsonString = JSON.stringify(arrayFromJson).toLowerCase()
return jsonString.includes(valueSearch);  
} 

/*-----------fonction qui retourne true ou false si la valeur de la recherche est presente ou pas---*/
function checkSearchString(element){
var nodeInputValue= document.querySelector("#inputSearch").value;
// variable qui stock la reponse la premiere recherche
var firstSearch =(element.name.includes(nodeInputValue.toLowerCase()) || JSON.stringify(element.ingredients).toLowerCase().includes(nodeInputValue.toLowerCase()) || element.description.includes(nodeInputValue.toLowerCase()));
//noeuds des tags
var nodeTagIngredient = document.querySelector("#tagIngredient")
var nodeTagAppliance = document.querySelector("#tagAppliance")
var nodeTagUstensils = document.querySelector("#tagUstensiles")
//consition qi noeud tag est vide
if (nodeTagIngredient.innerHTML==="" && nodeTagAppliance.innerHTML==="" && nodeTagUstensils.innerHTML===""){
var secondSearch = true;

}else{
    
    var secondSearch = JSON.stringify(element.ingredients).toLowerCase().includes(nodeTagIngredient.innerHTML.split(" <i")[0].toLowerCase())
}

return (firstSearch && secondSearch) 

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
            //vider la page
    nodeCards.innerHTML=""; 
      //session storage
    //sessionStorage.setItem("stringSearch", textOfSearch) 
           //recharge la page
    displayRecipes()
       
    }else{
        sessionStorage.setItem("stringSearch", "")   
    }
};

/*------- recherche avancée-------*/

//ingredients - btn
var nodeDisplayIngredients = document.querySelector("#displayIngredients")
nodeDisplayIngredients.addEventListener("click", disappear)
//appareil - btn
var nodeDisplayAppareil = document.querySelector("#displayAppareil")
nodeDisplayAppareil.addEventListener("click", disappear)
//ustensiles - btn
var nodeDisplayUstensiles = document.querySelector("#displayUstensiles")
nodeDisplayUstensiles.addEventListener("click", disappear )

//ingredients - recherche
var nodeSearchIngredients = document.querySelector("#searchIngredients")
nodeSearchIngredients.style.visibility ="hidden";
//appareil - recherche
var nodeSearchAppareil = document.querySelector("#searchAppareil")
nodeSearchAppareil.style.visibility ="hidden";
//ustensiles - recherche
var nodeSearchUstensiles = document.querySelector("#searchUstensiles")
nodeSearchUstensiles.style.visibility ="hidden";


//fonction de disparation de la recherche avancée
function disappear(e){
    //ingredients - appareil - ustensiles
    var targetEventTitle = e.target.title;
    var nodeDisappear = document.querySelector("#display" + targetEventTitle)
    nodeDisappear.style.visibility ="hidden";
  
    appear(targetEventTitle)
}
//fonction qui fait apparaitre la recherche avancée
function appear(targetEventTitle){
    //ingredients - appareil - ustensiles
    var disappearSearchIngredients = document.querySelector("#search"+ targetEventTitle )
    disappearSearchIngredients.style.visibility ="visible";
   }
//remplit les champs de recherche avancée
async  function filledAdvancedSearchFields(arrayFromJsonRecipes){

//recherche avancée des ingrédients
var nodeListeIngredients = document.querySelector("#listIngredients");
nodeListeIngredients.innerHTML= ""
//recherche avancée des appareil
var nodeListeAppareil = document.querySelector("#listAppareil");
nodeListeAppareil.innerHTML= ""
//recherche avancée des ustensiles
var nodeListeUstensiles = document.querySelector("#listUstensiles");
nodeListeUstensiles.innerHTML= "";

//var arrayFromJsonRecipes =  await getRecipesFromJson(); 
for(let k = 0; k < arrayFromJsonRecipes.length; k++){

    var arrayFromJsonIngredient = arrayFromJsonRecipes[k].ingredients;
    //boucle pour eviter les doublons des ingredients
    for(let l = 0; l < arrayFromJsonIngredient.length; l++){
        if(nodeListeIngredients.innerHTML.toLowerCase().includes(arrayFromJsonIngredient[l].ingredient.toLowerCase())=== false){ // si baleine inclus Baleine bleue ça return false car sensible à la casse 
      // si le sel est inclus dans la liste des ingredient - oui - on ne fait rien - non on affiche - quand la condition renvoie false
               nodeListeIngredients.innerHTML+= `<div class="ingredient">`+arrayFromJsonIngredient[l].ingredient +`</div>`    
        }     
    }
    //boucle pour eviter les doublons des ustensiles
    var arrayFromJsonUstensils = arrayFromJsonRecipes[k].ustensils;
   for(let l = 0; l < arrayFromJsonUstensils.length; l++){
    if( nodeListeUstensiles.innerHTML.toLowerCase().includes(arrayFromJsonUstensils[l].toLowerCase())=== false){
        nodeListeUstensiles.innerHTML+= `<div class="ustensils">`+arrayFromJsonUstensils[l] +`</div>`  
    }
    }
if( nodeListeAppareil.innerHTML.toLowerCase().includes(arrayFromJsonRecipes[k].appliance.toLowerCase())=== false){
    nodeListeAppareil.innerHTML+= `<div class="appliance">` +arrayFromJsonRecipes[k].appliance +`</div>`
}

}
// recupere noeud pour event au click sur le mot
var nodeIngredientDiv = document.querySelectorAll(".ingredient");
nodeIngredientDiv.forEach(element=> element.addEventListener("click", getCliked))
var nodeUstensilsDiv = document.querySelectorAll(".ustensils");
nodeUstensilsDiv.forEach(element=> element.addEventListener("click", getCliked))
var nodeAppliancesDiv = document.querySelectorAll(".appliance");
nodeAppliancesDiv.forEach(element=> element.addEventListener("click", getCliked))
return 0
  } 

  var nodeInputSearchIngredient = document.querySelector("#nameIngredients")
  nodeInputSearchIngredient.addEventListener("keyup", updateListIngredients)
  
  var nodeInputSearchUstensiles = document.querySelector("#nameUstensiles")
  nodeInputSearchUstensiles.addEventListener("keyup", updateListIngredients)

  var nodeInputSearchAppareil = document.querySelector("#nameAppareil")
  nodeInputSearchAppareil.addEventListener("keyup", updateListIngredients)


  //mise a jour liste des ingredients
 async function updateListIngredients(){
      var nodeListeIngredientsAdvanced = document.querySelector("#listIngredients")
      var nodeListeUstensilesAdvanced = document.querySelector("#listUstensiles")
      var nodeListeAppareilAdvanced = document.querySelector("#listAppareil")
      
      //vide la liste
      nodeListeIngredientsAdvanced.innerHTML= "";
      nodeListeUstensilesAdvanced.innerHTML= "";
      nodeListeAppareilAdvanced.innerHTML= "";
      //recuperation du json
      var arrayFromJsonAdvanced =  await getRecipesFromJson();  
       var filterArrayAdvanced = arrayFromJsonAdvanced.filter(checkSearchString);
      
      for (let i = 0; i < filterArrayAdvanced.length; i++){
          //tableau des ingredients d'une recette de la premiere recherche
var arrayIngredientsOfOneRecipes = filterArrayAdvanced[i].ingredients;
var arrayUstensilesOfOneRecipes = filterArrayAdvanced[i].ustensils;
var arrayAppareilOfOneRecipes = filterArrayAdvanced[i].appliance;

for (let j = 0; j < arrayIngredientsOfOneRecipes.length; j++){
//Condition recherche avancée
if(arrayIngredientsOfOneRecipes[j].ingredient.toLowerCase().includes(nodeInputSearchIngredient.value.toLowerCase()) && nodeListeIngredientsAdvanced.innerHTML.toLowerCase().includes(arrayIngredientsOfOneRecipes[j].ingredient.toLowerCase())=== false){
    nodeListeIngredientsAdvanced.innerHTML+= `<div class="ingredient">` +arrayIngredientsOfOneRecipes[j].ingredient+`</div>`
   }
}
for (let j = 0; j < arrayUstensilesOfOneRecipes.length; j++){
    //Condition recherche avancée
    if(arrayUstensilesOfOneRecipes[j].toLowerCase().includes(nodeInputSearchUstensiles.value.toLowerCase()) && nodeListeUstensilesAdvanced.innerHTML.toLowerCase().includes(arrayUstensilesOfOneRecipes[j].toLowerCase())=== false){
        nodeListeUstensilesAdvanced.innerHTML+= `<div class="ustensils">` +arrayUstensilesOfOneRecipes[j]+`</div>`
    }
    }
    
        //Condition recherche avancée
        if(arrayAppareilOfOneRecipes.toLowerCase().includes(nodeInputSearchAppareil.value.toLowerCase()) && nodeListeAppareilAdvanced.innerHTML.toLowerCase().includes(arrayAppareilOfOneRecipes.toLowerCase())=== false){
            nodeListeAppareilAdvanced.innerHTML+= `<div class="appliance">` +arrayAppareilOfOneRecipes+`</div>`
        }
   }
   // recupere noeud pour event au click sur le mot
var nodeIngredientDiv = document.querySelectorAll(".ingredient");
nodeIngredientDiv.forEach(element=> element.addEventListener("click", getCliked))
var nodeUstensilsDiv = document.querySelectorAll(".ustensils");
nodeUstensilsDiv.forEach(element=> element.addEventListener("click", getCliked))
var nodeAppliancesDiv = document.querySelectorAll(".appliance");
nodeAppliancesDiv.forEach(element=> element.addEventListener("click", getCliked))
  }

//recuperer mot cliké
function getCliked(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    //cible de l'evenement cliké - mot cliké
var clikedWord = e.target.innerHTML;
console.log(clikedWord)
//rend visible ou invisible le btn de seach ou display
var nodeSearchIngredientsDisappear = document.querySelector("#searchIngredients")
nodeSearchIngredientsDisappear.style.visibility="hidden";
var nodeDisplayIngredientsDisappear = document.querySelector("#displayIngredients")
nodeDisplayIngredientsDisappear.style.visibility="visible";

var nodeSearchAppareilDisappear = document.querySelector("#searchAppareil")
nodeSearchAppareilDisappear.style.visibility="hidden";
var nodeDisplayAppareilDisappear = document.querySelector("#displayAppareil")
nodeDisplayAppareilDisappear.style.visibility="visible";

var nodeSearchUstensilsDisappear = document.querySelector("#searchUstensiles")
nodeSearchUstensilsDisappear.style.visibility="hidden";
var nodeDisplayAUstensilsDisappear = document.querySelector("#displayUstensiles")
nodeDisplayAUstensilsDisappear.style.visibility="visible";
//noeuds des tags
var nodeTagIngredient = document.querySelector("#tagIngredient")
var nodeTagAppliance = document.querySelector("#tagAppliance")
var nodeTagUstensils = document.querySelector("#tagUstensiles")
//condition de gestion des tags
if((nodeTagIngredient.innerHTML.includes(clikedWord) || nodeTagAppliance.innerHTML.includes(clikedWord) || nodeTagUstensils.innerHTML.includes(clikedWord))=== false){
    //gestion des tags
if(e.target.className === "ingredient"  ){

nodeTagIngredient.style.visibility="visible";
nodeTagIngredient.innerHTML+= clikedWord + ` <i class="fa fa-times-circle-o"></i>`
}
if(e.target.className === "appliance"  ){

nodeTagAppliance.style.visibility="visible";
nodeTagAppliance.innerHTML+= clikedWord + ` <i class="fa fa-times-circle-o"></i>`
}
if(e.target.className === "ustensils"  ){

nodeTagUstensils.style.visibility="visible";
nodeTagUstensils.innerHTML+= clikedWord + ` <i class="fa fa-times-circle-o"></i>`
}
}
var nodeCards = document.querySelector(".cards")
nodeCards.innerHTML="";
displayRecipes()
}


