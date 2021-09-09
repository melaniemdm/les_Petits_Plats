//function affiche les recettes
export async function displayRecipes(){
// appel de la function from json
var arrayFromJson =  await getRecipesFromJson(); 

var nodeCards = document.querySelector(".cards");
// valeur de l'input search
var valueSearch = document.querySelector("#inputSearch").value;

//transforme le json en string
var jsonString = JSON.stringify(arrayFromJson)
//condition de recherche
if(jsonString.includes(valueSearch) ){
    //filtre de l'array des recettes - appel de la condition du filtre - si true stock la recette
    var filterArray = arrayFromJson.filter(checkSearchString);
    //appel fonction qui remplit les champs de la recherche avancée
    filledAdvancedSearchFields(filterArray)
    //parcours le tableau
    for (let i = 0; i < filterArray.length; i++){
     var sourceImg = "https://source.unsplash.com/collection/4466406/480x480?sig="+i+"&client_id=hXJZfm926ewJ7LxaoHzwVxiR7cyTnkdu3Vidn6Ojdew";
    //affichage des ingredients
        var timing = filterArray[i].time;
        var ingredients="<ul>";
        for(let j = 0; j<filterArray[i].ingredients.length; j++){
        ingredients += "<li> <span class='nameIngredient'> "+ filterArray[i].ingredients[j].ingredient + `</span>`    // ajout quantity 
        if(filterArray[i].ingredients[j].quantity){
            ingredients  += ":" +" "+  filterArray[i].ingredients[j].quantity  ;
        }
        //ajout de unit
        if( filterArray[i].ingredients[j].unit){
        ingredients  +=  " "+ filterArray[i].ingredients[j].unit   ;
        }
        ingredients  += "</li>"
    }
    ingredients += "</ul>" 
    
        var instruction=filterArray[i].description;
       
    
        var titreRecette= filterArray[i].name;
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

}else{
    nodeCards.innerHTML+= 'Aucune recette ne correspond à votre critère.... vous pouvez chercher "tartes aux pommes", "poissons", etc.'
}
return 0;
}
/*-----------fonction qui retourne true ou false si la valeur de la recherche est presente ou pas---*/
function checkSearchString(element){
var nodeInputValue= document.querySelector("#inputSearch").value; 
return (element.name.includes(nodeInputValue.toLowerCase()) || JSON.stringify(element.ingredients).includes(nodeInputValue.toLowerCase()) || element.description.includes(nodeInputValue.toLowerCase()))
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
               nodeListeIngredients.innerHTML+= `<div>`+arrayFromJsonIngredient[l].ingredient +`</div>`    
        }     
    }
    //boucle pour eviter les doublons des ustensiles
    var arrayFromJsonUstensils = arrayFromJsonRecipes[k].ustensils;
   for(let l = 0; l < arrayFromJsonUstensils.length; l++){
    if( nodeListeUstensiles.innerHTML.toLowerCase().includes(arrayFromJsonUstensils[l].toLowerCase())=== false){
        nodeListeUstensiles.innerHTML+= `<div>`+arrayFromJsonUstensils[l] +`</div>`  
    }
    }
if( nodeListeAppareil.innerHTML.toLowerCase().includes(arrayFromJsonRecipes[k].appliance.toLowerCase())=== false){
    nodeListeAppareil.innerHTML+= `<div>` +arrayFromJsonRecipes[k].appliance +`</div>`
}

}
return 0
  } 

  var nodeInputSearchIngredient = document.querySelector("#nameIngredients")
  nodeInputSearchIngredient.addEventListener("keyup", updateListIngredients)
  
  //mise a jour liste des ingredients
 async function updateListIngredients(){
      var nodeListeIngredientsAdvanced = document.querySelector("#listIngredients")
      //vide la liste
      nodeListeIngredientsAdvanced.innerHTML= "";
      var arrayFromJsonAdvanced =  await getRecipesFromJson();  
       var filterArrayAdvanced = arrayFromJsonAdvanced.filter(checkSearchString);
      
      for (let i = 0; i < filterArrayAdvanced.length; i++){
          //tableau des ingredients d'une recette de la premiere recherche
var arrayIngredientsOfOneRecipes = filterArrayAdvanced[i].ingredients;

for (let j = 0; j < arrayIngredientsOfOneRecipes.length; j++){
//Condition recherche avancée
if(arrayIngredientsOfOneRecipes[j].ingredient.toLowerCase().includes(nodeInputSearchIngredient.value.toLowerCase()) && nodeListeIngredientsAdvanced.innerHTML.toLowerCase().includes(arrayIngredientsOfOneRecipes[j].ingredient.toLowerCase())=== false){
    nodeListeIngredientsAdvanced.innerHTML+= `<div>` +arrayIngredientsOfOneRecipes[j].ingredient+`</div>`
    
}
}
   }
  }