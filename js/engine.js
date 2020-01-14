class Engine {
    constructor(context) {
        this.ctx = context;
		
		this.map = {};
		
		this.urls = {
			pasto: "https://i.imgur.com/fqG34pO.png",
			agua: "https://i.imgur.com/4BZGw0M.png",
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
			const img = await this.cargarImagen(url)
			this.imagenes[nombreUrl] = img
		}
		
	}
	
	async cargarMapa() {
		const response = await fetch("/maps/city.json");
		this.map = await response.json();
	}
	
	async inicializar() {
		await this.cargarImagenes()
		await this.cargarMapa()
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
		for (let y = 0; y < this.mapSize.y; y += this.tileSize) {
			for (let x = 0; x < this.mapSize.x; x += this.tileSize) {
				let i = y / this.tileSize
				let j = x / this.tileSize
				
				let img = this.map[i][j]
				
				this.ctx.background.drawImage(this.imagenes[img.background], x, y);
			}
		}
	}
	
	dibujarPersonaje() {
		this.ctx.foreground.drawImage(this.imagenes.personaje, this.personaje.pos.x, this.personaje.pos.y, 32, 32);
	}
	
	dibujarEntorno() {
		for (let y = 0; y < this.mapSize.y; y += this.tileSize) {
			for (let x = 0; x < this.mapSize.x; x += this.tileSize) {
				let i = y / this.tileSize
				let j = x / this.tileSize
				
				let tile = this.map[i][j]
				
				if (tile.hasOwnProperty('foreground')) {
					this.ctx.foreground.drawImage(this.imagenes[tile.foreground], x, y);
				}
				if (tile.hasOwnProperty('texto')) {
					this.ctx.foreground.font = tile.texto.fuente; 
					this.ctx.foreground.fillStyle = tile.texto.color; 
					this.ctx.foreground.fillText(tile.texto.texto, x, y);
				}
			}
		}
	}
	
	clearCanvas() {
        this.ctx.foreground.clearRect(0, 0, this.mapSize.x, this.mapSize.y);
    }
	
	iniciarTeclas() {
		document.addEventListener("keydown", e => {
			let prevmoy = this.personaje.pos.y
			let prevmox = this.personaje.pos.x

			switch (e.keyCode) {
				case this.keys.arrowUp:
					if (this.personaje.pos.y - this.tileSize >= 0)
						this.personaje.pos.y -= this.tileSize;
					break;
				case this.keys.arrowDown:
					if (this.personaje.pos.y + (this.tileSize) < this.mapSize.y)
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

			let i = this.personaje.pos.y / this.tileSize
			let j = this.personaje.pos.x / this.tileSize
			
			console.log(i)
			console.log(j)

			let tile = this.map[i][j]

			console.log(tile)

			if (!tile.hasOwnProperty('bloqueado') || !tile.bloqueado) {
				this.dibujarResto()
			} else {
				this.personaje.pos.y = prevmoy
				this.personaje.pos.x = prevmox
			}
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