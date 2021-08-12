//function affiche les recettes
export async function displayRecipes(){
// appel de la function from json
var arrayFromJson =  await getRecipesFromJson(); 

var nodeCards = document.querySelector(".cards");
for (let i = 0; i < arrayFromJson.length; i++){
    var sourceImg = "https://img-31.ccm2.net/lK0t3Q0I2lhHmo1mRvAiO-duZi8=/910x/smart/9a916f6efef5426fa54b8b67d57b3e12/ccmcms-hugo/12352828.jpg";
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
/* fonction qui recupere le json*/
async function getRecipesFromJson() {
    let url = "http://127.0.0.1:5500/json/recipes.json";
    let rep = await fetch(url, { method: "GET" });
    let reponse = await rep.json();
    let arrayRecipes = reponse["recipes"];
      return arrayRecipes;
    }
