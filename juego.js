const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const fondo = "https://i.imgur.com/fqG34pO.png";
const personaje = "https://i.imgur.com/ucwvhlh.png";
const arbol = "https://i.imgur.com/wIK2b9P.png";
const cartel = "https://i.imgur.com/NXIjxr8.png";

const textoCartel ="CARTEL";

const tileSize = 32;

const posIniPersonaje = {
	x: 5 * tileSize,
	y: 5 * tileSize
}

const posIniArbol = {
	x: 1 * tileSize,
	y: 4 * tileSize
}

const posIniCartel = {
	x: 5 * tileSize,
	y: 0 * tileSize
}

const mapSize = {
	x: 10 * tileSize,
	y: 10 * tileSize
}

function cargarImagen(src) {
	return new Promise((resolve, reject) => {
			const image = new Image();
			image.src = src;

			image.onload = () => {
				resolve(image);
			};
			image.onerror = reject;
		});
}

function getPosicion(pos) {
	return pos * tileSize;
}

async function dibujar() {
	const imgFondo = await cargarImagen(fondo);
	const imgPersonaje = await cargarImagen(personaje);
	const imgArbol = await cargarImagen(arbol);
	const imgCartel = await cargarImagen(cartel);
	
	for (y = 0; y < mapSize.y; y++) 
		for (x = 0; x < mapSize.x; x++) 
			context.drawImage(imgFondo, x, y);
		
	context.drawImage(imgPersonaje, posIniPersonaje.x, posIniPersonaje.y);

	context.drawImage(imgArbol, posIniArbol.x, posIniArbol.y, 32, 32);

	context.drawImage(imgCartel, posIniCartel.x, posIniCartel.y);

	context.font = "20pt Calibri";
	context.textAlign = "start";
	context.textBaseline = "bottom";
	context.fillStyle = "#ffffff";
	context.fillText(textoCartel, posIniCartel.x + getPosicion(1), posIniCartel.y + getPosicion(2));
}

dibujar()