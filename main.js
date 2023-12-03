'use strict'

//CONSTANTES 
//TRAER ELEMENTOS DEL HTML (FORM/SECTION)

const inputSearch = document.querySelector('.js-input-search'); //casilla buscar
const btnSearch = document.querySelector('.js-btn-search'); // boton buscar
const listFav = document.querySelector('.js-list-fav'); //lista favoritas
const listSearch = document.querySelector('.js-list-search'); //lista con la busqueda
const btnDelete = document.querySelector('.js-delete'); //botón reset


//ARRAYS VACIOS
let seriesSearch = []; 
let seriesFav = [];

const seriesLS = JSON.parse(localStorage.getItem("favorites"));
if (seriesLS !== null){
    seriesFav=seriesLS;
}
renderSerieFav (seriesFav);

//PEDIR INFO A LA API
function getApiInfo () {
    const valueInput = inputSearch.value;   
        //URL API + VALOR INTRODUCIDO EN EL INPUT
    const url =`//api.tvmaze.com/search/shows?q=${valueInput}`
    fetch(url)
    .then((response) => response.json())
    .then(dataApi => {       
        //pintar un listado
        seriesSearch = dataApi;   
        renderSeriesList (seriesSearch);
    });
}

//PINTA ESTRUCTURA SERIE
function renderSeries(serie){
    let html="";
    if (serie in seriesFav){
          //añade el id de cada serie a cada li
    html+=`<li id=${serie.show.id} class="serie stylecard stylecardfav js-serie">`; 
    //CONDICIONAL QUE ME DEVUELVE LA FOTO Y SI NO TIENE ME PONE UNA IMAGEN DE RELLENO
        if (serie.show.image !== null){
        html+=`<h3 class="">${serie.show.name}</h3>
        <p> ${serie.show.genres} </p>
        <img class="img" src="${serie.show.image.medium}" alt="${serie.show.name}"/>`
      }else{
        html+= `<li>
        <h3>${serie.show.name}</h3>
        <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="${serie.show.name}"/>
        </li>`;
      }
    html+=`</li>`  
    }else{
          //añade el id de cada serie a cada li
    html+=`<li id=${serie.show.id} class="serie stylecard js-serie">`; 
    //CONDICIONAL QUE ME DEVUELVE LA FOTO Y SI NO TIENE ME PONE UNA IMAGEN DE RELLENO
        if (serie.show.image !== null){
        html+=`<h3 class="">${serie.show.name}</h3>
        <p> ${serie.show.genres} </p>
        <img class="img" src="${serie.show.image.medium}" alt="${serie.show.name}"/>`
      }else{
        html+= `<li>
        <h3>${serie.show.name}</h3>
        <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="${serie.show.name}"/>
        </li>`;
      }
    html+=`</li>`   
    }

    return html;
    
}

//PINTAR LISTADO CON BUCLES
function renderSeriesList (listSeries){
    //para que no se me acumulen las busquedas (linea inferior)
    listSearch.innerHTML ="";
    for (const serie of listSeries) {
        listSearch.innerHTML+= renderSeries(serie)

    }
    /*llamo a la funcion addEventToSerie para que me pinte las series (lo hago aqui porque es donde me pinta las series y si lo pongo debajo del evento del boton de buscar me sale vacio, ya que EL FETCH TODAVIA NO ME HA DEVUELTO LA INFO Y aun no tengo pintadas las series)*/
    addEventToSerie();
}


//FUNCIÓN SOBRE EL BOTÓN DE BUSCAR
function handleClickSearch(event) {
    event.preventDefault();
    //devuelveme la info de API 
    getApiInfo ();
};

//FUNCION PARA PINTAR LAS FAVORITAS
function renderSerieFav (favSeries){
     //para que no se me acumulen las busquedas (linea inferior)
    listFav.innerHTML ="";
    for (const item of favSeries) {
        listFav.innerHTML += renderSeries(item)
    }

}

//FUNCION SOBRE AÑADIR A FAVORITOS
function handleClickFav(event){
//la ul es quien escucha el evento ya que he hecho un qsAll sobre la ul
const idSerieCliked = parseInt(event.currentTarget.id);
//buscar la serie por id para saber en cual he dado click
const foundSerie = seriesSearch.find(item => item.show.id === idSerieCliked); 
console.log(foundSerie.show.name);
//comprueba si esta en el listado (findIndex busca la posicion de un elemento en una lista. -1 no esta) 
const indexFav = seriesFav.findIndex(item => item.show.id === idSerieCliked);

//si no esta lo añade(push)
if (indexFav === -1){
    seriesFav.push(foundSerie);
    //cambia color
    event.currentTarget.classList.add("stylecardfav");
}else{
//si esta lo quita (posicionaeliminar, cuantosquieroeliminar)
seriesFav.splice(indexFav, 1)
//cambia color
event.currentTarget.classList.remove("stylecard"); 
}

//AÑADIR (PINTAR) LAS SERIES A FAVORITAS en html
renderSerieFav(seriesFav);  

//guarda el listado de favoritas
localStorage.setItem('favorites', JSON.stringify(seriesFav));
}

/*FUNCION PARA OBTENER TODAS LAS SERIES QUE HE BUSCADO (qsAll porque no se cuantas tengo en total, ya que la info viene del servidor)*/
function addEventToSerie(){
const allSeries = document.querySelectorAll(".js-serie");
//añadir la funcion a cada una de las series a las que haga click
for (const item of allSeries) {
    item.addEventListener('click', handleClickFav)
}
}
//FUNCIÓN PARA BORRAR TODAS LAS FAVORITAS
function handleCLickDelete(){
    seriesFav = [];
    localStorage.removeItem('favorites');
    renderSerieFav(seriesFav);
}

//EVENTO SOBRE BOTÓN RESET
btnDelete.addEventListener('click', handleCLickDelete);
//EVENTO SOBRE BOTÓN DE BUSCAR
btnSearch.addEventListener('click', handleClickSearch);


