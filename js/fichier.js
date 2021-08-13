//function affiche les recettes
export async function displayRecipes(){
// appel de la function from json
var arrayFromJson =  await getRecipesFromJson(); 

var nodeCards = document.querySelector(".cards");
for (let i = 0; i < arrayFromJson.length; i++){
    var sourceImg = "https://source.unsplash.com/collection/4466406/480x480?sig="+i+"&client_id=hXJZfm926ewJ7LxaoHzwVxiR7cyTnkdu3Vidn6Ojdew";
//affichage des ingredients
    var timing = arrayFromJson[i].time;
    var ingredients="<ul>";
    for(let j = 0; j<arrayFromJson[i].ingredients.length; j++){
    ingredients += "<li>" + arrayFromJson[i].ingredients[j].ingredient 
    // ajout quantity 
    if(arrayFromJson[i].ingredients[j].quantity){
        ingredients  += ":" +" "+  arrayFromJson[i].ingredients[j].quantity  ;
    }
    //ajout de unit
    if( arrayFromJson[i].ingredients[j].unit){
    ingredients  +=  " "+ arrayFromJson[i].ingredients[j].unit   ;
    }
    ingredients  += "</li>"
}
ingredients += "</ul>" 

    var instruction=arrayFromJson[i].description;
    var titreRecette= arrayFromJson[i].name;
nodeCards.innerHTML+= `<div class="card">
<img class="card-img-top" src=`+sourceImg+` alt="Card image cap">
<div class="card-body">
    <div class="firstPartieCard"> 
        <div class="card-text"> `+titreRecette+`</div>
        <div class="timing">  <i class="far fa-clock"></i><div>`+timing +` min</div> </div>
    </div>
    <div class="secondPartieCard onePartieCard">
     <div class="ingredients">`+ ingredients +`
     </div>
     <div class="instruction">`+instruction+`</div>
    </div> 
</div>
</div>
`
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
 /*--------------- recharge les recipes---------*/   
var nodeSearch = document.querySelector("#search");
nodeSearch.addEventListener("click", rechargeRecipes);

function rechargeRecipes(e){
    //empeche le comportement par default du chargement
    e.preventDefault();
    e.stopImmediatePropagation();
var nodeCards= document.querySelector(".cards");
//vider la page
nodeCards.innerHTML="";
//affichage des cards grace à l'appel de la fonction
displayRecipes()
}