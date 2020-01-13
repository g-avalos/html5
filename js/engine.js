class Engine {
    constructor(context) {
        this.ctx = context;

		this.urlsCodigo = {
			g: "fondo"
		}

		this.urls = {
			fondo: "https://i.imgur.com/fqG34pO.png",
			personaje: "https://i.imgur.com/ucwvhlh.png",
			arbol: "https://i.imgur.com/wIK2b9P.png",
			cartel: "https://i.imgur.com/NXIjxr8.png"
		}
	
		this.textoCartel ="CARTEL";

		this.tileSize = 32;

		this.personaje = {
			pos: {
				x: 5 * this.tileSize,
				y: 5 * this.tileSize
			}
		}

		this.arbol = {
			pos: {
				x: 1 * this.tileSize,
				y: 4 * this.tileSize
			}
		}

		this.cartel = {
			pos: {
				x: 5 * this.tileSize,
				y: 0 * this.tileSize
			}
		}

		this.mapSize = {
			x: 10 * this.tileSize,
			y: 10 * this.tileSize
		}

		this.keys = {
			arrowUp: 38,
			arrowDown: 40,
			arrowLeft: 37,
			arrowRight: 39
		};
		
		 this.imagenes = {};
	}

	cargarImagen(src) {
		return new Promise((resolve, reject) => {
				const image = new Image();
				image.src = src;

				image.onload = () => {
					resolve(image);
				};
				image.onerror = reject;
			});
	}

	getPosicion(pos) {
		return pos * this.tileSize;
	}

	async cargarImagenes() {
		for (let nombreUrl in this.urls) {
			const url = this.urls[nombreUrl]
			
			let img = await this.cargarImagen(url)
			this.imagenes[nombreUrl] = img
		}
		
	}
	
	async inicializar() {
		await this.cargarImagenes()
		await this.dibujarFondo()
		this.dibujarResto()
		this.iniciarTeclas()
	}

	dibujarResto() {
		this.clearCanvas()
		this.dibujarPersonaje()
		this.dibujarEntorno()
	}
	
	async dibujarFondo() {
		const response = await fetch("http://localhost:5000/map/city.json", {mode: 'cors'});
		const result = await response.json();
		
		for (let y = 0; y < this.mapSize.y; y++) 
			for (let x = 0; x < this.mapSize.x; x++)  {
				let img = result[x][y]
				this.ctx.background.drawImage(this.imagenes[this.urlsCodigo[img]], x, y);
			}
	}
	
	dibujarPersonaje() {
		this.ctx.foreground.drawImage(this.imagenes.personaje, this.personaje.pos.x, this.personaje.pos.y);
	}
	
	dibujarEntorno() {
		this.ctx.foreground.drawImage(this.imagenes.arbol, this.arbol.pos.x, this.arbol.pos.y, 32, 32);
		this.ctx.foreground.drawImage(this.imagenes.cartel, this.cartel.pos.x, this.cartel.pos.y);

		this.ctx.foreground.font = "20pt Calibri";
		this.ctx.foreground.textAlign = "start";
		this.ctx.foreground.textBaseline = "bottom";
		this.ctx.foreground.fillStyle = "#ffffff";
		this.ctx.foreground.fillText(this.textoCartel, this.cartel.pos.x + this.getPosicion(1), this.cartel.pos.y + this.getPosicion(2));
	}
	
	clearCanvas() {
        this.ctx.foreground.clearRect(0, 0, this.mapSize.x, this.mapSize.y);
    }
	
	iniciarTeclas() {
		document.addEventListener("keydown", e => {
			switch (e.keyCode) {
				case this.keys.arrowUp:
					if (this.personaje.pos.y - this.tileSize >= 0)
						this.personaje.pos.y -= this.tileSize;
					break;
				case this.keys.arrowDown:
					if (this.personaje.pos.y + (2 * this.tileSize) < this.mapSize.y)
						this.personaje.pos.y += this.tileSize;
					break;
				case this.keys.arrowLeft:
					if (this.personaje.pos.x - this.tileSize >= 0)
						this.personaje.pos.x -= this.tileSize;
					break;
				case this.keys.arrowRight:
					if (this.personaje.pos.x + this.tileSize < this.mapSize.x)
						this.personaje.pos.x += this.tileSize;
					break;
				default:
					break;
			}
			
			console.log(this.personaje.pos.x)
			console.log(this.personaje.pos.y)
			
			this.dibujarResto()
		});
	}
	
}

const background = document.getElementById("background");
const foreground = document.getElementById("foreground");

const context = {
    background: background.getContext("2d"),
    foreground: foreground.getContext("2d")
};

const engine = new Engine(context);
engine.inicializar();