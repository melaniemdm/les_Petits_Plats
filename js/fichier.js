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
    //appel fonction pour selectionner la card de la recette
    addEventCardRecipe()
}else{
    nodeCards.innerHTML+= 'Aucune recette ne correspond à votre critère.... vous pouvez chercher "tartes aux pommes", "poissons", etc.'
}
return 0;
}

/*---------- fonction qui recupere le json----------*/
async function getRecipesFromJson() {
    let url = "http://127.0.0.1:5500/json/recipes.json";
    let rep = await fetch(url, { method: "GET" });
    let reponse = await rep.json();
    let arrayRecipes = reponse["recipes"];
      return arrayRecipes;
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
function checkSearchString(recipe){
    var nodeInputValue= document.querySelector("#inputSearch").value;
    // variable qui stock la reponse la premiere recherche
    var firstSearch = (recipe.name.includes(nodeInputValue.toLowerCase()) || JSON.stringify(recipe.ingredients).toLowerCase().includes(nodeInputValue.toLowerCase()) || recipe.description.includes(nodeInputValue.toLowerCase()));
    //noeuds des tags
    var nodeTagIngredient = document.querySelector("#tagIngredient")
    var nodeTagAppliance = document.querySelector("#tagAppliance")
    var nodeTagUstensils = document.querySelector("#tagUstensiles")
    //condition si noeud tag est vide
    if (nodeTagIngredient.innerHTML==="" && nodeTagAppliance.innerHTML==="" && nodeTagUstensils.innerHTML===""){
    var secondSearch = true;
    }else{
       var secondSearch =  true;
        var listTag = nodeTagIngredient.innerHTML.split('<i class="fa fa-times-circle-o" aria-hidden="true"></i>')
        //supprime le dernier element de la liste - supp ligne vide
        listTag.pop();
        listTag.forEach(function(tag){
    secondSearch = (secondSearch && JSON.stringify(recipe.ingredients).toLowerCase().includes(tag.trim().toLowerCase()))
})
        
    }
    return (firstSearch && secondSearch) 
    }

    //remplit les champs de recherche avancée
async  function filledAdvancedSearchFields(arrayFromJson){

    //recherche avancée des ingrédients
    var nodeListeIngredients = document.querySelector("#listIngredients");
    nodeListeIngredients.innerHTML= ""
    //recherche avancée des appareil
    var nodeListeAppareil = document.querySelector("#listAppareil");
    nodeListeAppareil.innerHTML= ""
    //recherche avancée des ustensiles
    var nodeListeUstensiles = document.querySelector("#listUstensiles");
    nodeListeUstensiles.innerHTML= "";
    
    arrayFromJson.forEach(function(recipe){
        var arrayIngredientsForOneRecipe = recipe.ingredients;
        //boucle pour eviter les doublons des ingredients
        arrayIngredientsForOneRecipe.forEach(function(ingredient){
            //condition qui test si l'ingredient n'existe pas deja
            if(isIngredientNotInNode(nodeListeIngredients, ingredient)){ 
                   nodeListeIngredients.innerHTML+= `<div class="ingredient">`+ingredient.ingredient +`</div>`    
            }     
        })
        
        var arrayFromJsonUstensils = recipe.ustensils;
        arrayFromJsonUstensils.forEach(function(ustensils){
      //condition qui fait appel a la function qui test si l'ustensils est dans la liste
        if(isInustensilsNotInNode(nodeListeUstensiles, ustensils)){
            nodeListeUstensiles.innerHTML+= `<div class="ustensils">`+ustensils +`</div>`  
        }
         })
//condition qui fait appel a la function qui test si l'appareil est dans la liste
    if( isApplianceNotInNode(nodeListeAppareil, recipe)){
        nodeListeAppareil.innerHTML+= `<div class="appliance">` +recipe.appliance +`</div>`
    }
    
})
    // recupere noeud pour event au click sur le mot
    var nodeIngredientDiv = document.querySelectorAll(".ingredient");
    nodeIngredientDiv.forEach(element=> element.addEventListener("click", getCliked))
    var nodeUstensilsDiv = document.querySelectorAll(".ustensils");
    nodeUstensilsDiv.forEach(element=> element.addEventListener("click", getCliked))
    var nodeAppliancesDiv = document.querySelectorAll(".appliance");
    nodeAppliancesDiv.forEach(element=> element.addEventListener("click", getCliked))
    return 0
      } 
// function qui demande si l'ingredient existe deja
      function isIngredientNotInNode(nodeListeIngredients, ingredient){
       return (nodeListeIngredients.innerHTML.toLowerCase().includes(ingredient.ingredient.toLowerCase())=== false)
      }
// function qui demande si l'ustensils existe deja
function isInustensilsNotInNode(nodeListeUstensiles, ustensils){
    return  (nodeListeUstensiles.innerHTML.toLowerCase().includes(ustensils.toLowerCase())=== false)
   }
   // function qui demande si l'appareil existe deja
   function isApplianceNotInNode(nodeListeAppareil, recipe){
       return  ( nodeListeAppareil.innerHTML.toLowerCase().includes(recipe.appliance.toLowerCase())=== false)
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
     var titleRecette= recipe.name;
var cardHtml = `<div class="card" title ="`+titleRecette +`">
<img class="card-img-top" src=`+sourceImg+` alt="Card image cap">
<div class="card-body">
    <div class="firstPartieCard"> 
        <div class="recipesTitle"> `+titleRecette+`</div>
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
//construction de l'affichage des ingredients 
function buildDisplayOfIngredients (recipe){
    var ingredients="<ul>";
//boucle
    recipe.ingredients.forEach(function(ingredient){
    ingredients += "<li> <span class='nameIngredient'> "+ ingredient.ingredient + `</span>`    // ajout quantity 
    if(ingredient.quantity){
        ingredients  += ":" +" "+  ingredient.quantity  ;
    }
    //ajout de unit
    if( ingredient.unit){
    ingredients  +=  " "+ingredient.unit   ;
    }
    ingredients  += "</li>"
})
ingredients += "</ul>" 

return ingredients
}
//Ecouteur au click sur la loupe
var nodeSearch = document.querySelector("#search");
nodeSearch.addEventListener("click", rechargeRecipes);
//ecouteur au keyup sur le champs recherche
var nodeInputSearch = document.querySelector("#inputSearch");
nodeInputSearch.addEventListener("keyup", rechargeRecipes);
//recharge les recettes au click
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

/*------- tronc du paragraphe de la card-------*/
function troncInstruction(text){
var numberletter = 140;
if (text.length > numberletter ){
return text.substring(0,numberletter) +"...";
}else{
return text
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
    if(nodeDisappear){
    nodeDisappear.style.visibility ="hidden";    
    }
    appear(targetEventTitle)
}
//fonction qui fait apparaitre la recherche avancée
function appear(targetEventTitle){
    //ingredients - appareil - ustensiles
    var disappearSearchIngredients = document.querySelector("#search"+ targetEventTitle )
    disappearSearchIngredients.style.visibility ="visible";
   }

//ecouteur au keyup pour mettre a jour la liste
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
          //tableau des recettes filtrées
      filterArrayAdvanced.forEach(function(recipe){
var arrayIngredientsOfOneRecipes = recipe.ingredients;
var arrayUstensilesOfOneRecipes = recipe.ustensils;
var arrayAppareilOfOneRecipes = recipe.appliance;

arrayIngredientsOfOneRecipes.forEach(function(ingredient){
//Condition recherche avancée
if(isIngredientNotInNodeAd(nodeListeIngredientsAdvanced,ingredient)){
    nodeListeIngredientsAdvanced.innerHTML+= `<div class="ingredient">` +ingredient.ingredient+`</div>`
   }})
arrayUstensilesOfOneRecipes.forEach(function(ustensil){
    //Condition recherche avancée
    if(isInustensilsNotInNodeAd(nodeListeUstensilesAdvanced, ustensil)){
        nodeListeUstensilesAdvanced.innerHTML+= `<div class="ustensils">` +ustensil+`</div>`
    }})
            //Condition recherche avancée
        if(isApplianceNotInNodeAd(arrayAppareilOfOneRecipes)){
            nodeListeAppareilAdvanced.innerHTML+= `<div class="appliance">` +arrayAppareilOfOneRecipes+`</div>`
        }})
        //appel de la fonction
    setEventOnAdvancedSearchLists()
  }
// function qui met un event sur chaque noeud des listes de recherches avancées
 function setEventOnAdvancedSearchLists(){
// recupere noeud pour event au click sur le mot
var nodeIngredientDiv = document.querySelectorAll(".ingredient");
nodeIngredientDiv.forEach(element=> element.addEventListener("click", getCliked))
var nodeUstensilsDiv = document.querySelectorAll(".ustensils");
nodeUstensilsDiv.forEach(element=> element.addEventListener("click", getCliked))
var nodeAppliancesDiv = document.querySelectorAll(".appliance");
nodeAppliancesDiv.forEach(element=> element.addEventListener("click", getCliked))
  }

// function qui demande si l'ingredient existe deja de la recherche avancée
function isIngredientNotInNodeAd( ingredient){
    return (ingredient.ingredient.toLowerCase().includes(nodeInputSearchIngredient.value.toLowerCase()) && nodeListeIngredientsAdvanced.innerHTML.toLowerCase().includes(ingredient.ingredient.toLowerCase())=== false)
   }
// function qui demande si l'ustensils existe deja de la recherche avancée
function isInustensilsNotInNodeAd(ustensil){
 return  (ustensil.toLowerCase().includes(nodeInputSearchUstensiles.value.toLowerCase()) && nodeListeUstensilesAdvanced.innerHTML.toLowerCase().includes(ustensil.toLowerCase())=== false)
}
// function qui demande si l'appareil existe deja de la recherche avancée
function isApplianceNotInNodeAd(arrayAppareilOfOneRecipes){
    return  ( arrayAppareilOfOneRecipes.toLowerCase().includes(nodeInputSearchAppareil.value.toLowerCase()) && nodeListeAppareilAdvanced.innerHTML.toLowerCase().includes(arrayAppareilOfOneRecipes.toLowerCase())=== false)
   }

//recuperer mot cliké
function getCliked(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    //cible de l'evenement cliké - mot cliké
var clikedWord = e.target.innerHTML;

//rend visible ou invisible le btn de seach ou display
closeListIngredients()
closeListAppliance()
closeListUstensils()

//noeuds des tags
var nodeTagIngredient = document.querySelector("#tagIngredient")
var nodeTagAppliance = document.querySelector("#tagAppliance")
var nodeTagUstensils = document.querySelector("#tagUstensiles")
//condition de gestion des tags
if(isClickedWordNotInList(clikedWord)){
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
//function de close des listes
function closeListIngredients(){
    var nodeSearchIngredientsDisappear = document.querySelector("#searchIngredients")
    nodeSearchIngredientsDisappear.style.visibility="hidden";
    var nodeDisplayIngredientsDisappear = document.querySelector("#displayIngredients")
    nodeDisplayIngredientsDisappear.style.visibility="visible";
}

function closeListAppliance(){
    var nodeSearchAppareilDisappear = document.querySelector("#searchAppareil")
    nodeSearchAppareilDisappear.style.visibility="hidden";
    var nodeDisplayAppareilDisappear = document.querySelector("#displayAppareil")
    nodeDisplayAppareilDisappear.style.visibility="visible";
}

function closeListUstensils(){
    var nodeSearchUstensilsDisappear = document.querySelector("#searchUstensiles")
    nodeSearchUstensilsDisappear.style.visibility="hidden";
    var nodeDisplayAUstensilsDisappear = document.querySelector("#displayUstensiles")
    nodeDisplayAUstensilsDisappear.style.visibility="visible";
}
//regarde si le mot cliké a deja été ajouté dans la liste des tags
function isClickedWordNotInList( clikedWord){
    //noeuds des tags
var nodeTagIngredient = document.querySelector("#tagIngredient")
var nodeTagAppliance = document.querySelector("#tagAppliance")
var nodeTagUstensils = document.querySelector("#tagUstensiles")
    return ((nodeTagIngredient.innerHTML.includes(clikedWord) || nodeTagAppliance.innerHTML.includes(clikedWord) || nodeTagUstensils.innerHTML.includes(clikedWord))=== false)
}

function addEventCardRecipe(){
  var nodecard = document.querySelectorAll(".card");
nodecard.forEach(recipe => recipe.addEventListener("click", selectRecipe));

}
function selectRecipe(e){
    var node = e.target;
    while(node.className!= "card"){
node = node.parentNode;
    }
    var titleRecette = node.title;
    console.log("cette recette est selectionnée :" + titleRecette)
} 