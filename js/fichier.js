export async function displayRecipes(){
var nodeCards = document.querySelector(".cards");
for (let i = 0; i < 10; i++){
    var sourceImg = "https://img-31.ccm2.net/lK0t3Q0I2lhHmo1mRvAiO-duZi8=/910x/smart/9a916f6efef5426fa54b8b67d57b3e12/ccmcms-hugo/12352828.jpg";

    var timing = 10;
    var ingredients = `Poulet : 1
    <br> Lait de coco : 400ml
    <br>Coulis de tomate: 25cl`;
    var instruction=`Découper le poulet en morceaux, les faire dorer dans une cocotte avec de l'huile d'olive. Salez et poivrez. Une fois doré, laisser cuire en ajoutant de l'eau. Au bout de 30 minutes, ajouter le coulis de tomate, le lait de coco ainsi que le poivron et l'oignon découpés en morceaux. Laisser cuisiner 30 minutes de plus. Servir avec du riz`;
nodeCards.innerHTML+= `<div class="card">
<img class="card-img-top" src=`+sourceImg+` alt="Card image cap">
<div class="card-body">
    <div class="firstPartieCard"> 
        <div class="card-text"> Poulet coco réunionnais</div>
        <div class="timing">  <i class="far fa-clock"></i><div>`+timing +` min</div> </div>
    </div>
    <div class="secondPartieCard onePartieCard">
     <div class="ingredients">`+ ingredients +`
     </div>
     <div class="instruction">`+instruction+`</div>
    </div> 
</div>
</div>
`}
return 0;
}