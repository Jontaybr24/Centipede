MyGame.objects.Grid = function (spec) {
	'use strict';
	let gamespace = null;
	let imageReady = false;
	let mushImage = new Image();

	mushImage.onload = function () {
		imageReady = true;
	};
	mushImage.src = spec.imageSrc;

	let mushrooms = [];
	let colorIndex = { x: 0, y: 0 };

	function genLevel(mushCount) {
		let arr = [];
		mushrooms = [];
		for (let i = 0; i < spec.GRID.Y; i++) {
			arr.push([])
			for (let j = 0; j < spec.GRID.X; j++) {
				arr[i].push({
					x: j,
					y: i,
					mushroom: null,
				});
			}
		}
		gamespace = arr;
		beginMush(mushCount);
	}

	function beginMush(mushCount) {
		let result = false;
		for (let i = 0; i < mushCount; i++) {
			do {
				let x = Math.floor(Math.random() * spec.GRID.X);
				let y = Math.floor(Math.random() * (spec.GRID.Y - 5)) + 1;
				result = growMush({ x: x, y: y });
			} while (!result)
		}
	}

	function growMush(point) {
		if (point.y >= 0)
			if (gamespace[point.y][point.x]?.mushroom == null) {
				let x = spec.GRID.Size * point.x + spec.offset.x;
				let y = spec.GRID.Size * point.y + spec.offset.y;
				gamespace[point.y][point.x].mushroom = {
					index: {x: point.y, y: point.x},
					state: 0,
					poison: 0,
					hitbox: {
						ymin: y - spec.GRID.Size * .45, ymax: y + spec.GRID.Size * .45,
						xmin: x - spec.GRID.Size * .40, xmax: x + spec.GRID.Size * .40,
					},
					center: {
						x: x,
						y: y,
					}
				}
				mushrooms.push(gamespace[point.y][point.x].mushroom);
				return true;
			}
		return false;
	}

	function regrow() {
		for (let i in gamespace) {
			for (let j in gamespace[i]) {
				if (gamespace[i][j].mushroom != null)
					gamespace[i][j].mushroom.state = 0;
			}
		}
	}

	function takeHit(index) {
		gamespace[index.x][index.y].mushroom.state++
		if (gamespace[index.x][index.y].mushroom.state > 3) {
			for(let shroom in mushrooms){
				if (mushrooms[shroom].index == index){
					mushrooms.splice(shroom, 1)
				}
			}
			gamespace[index.x][index.y].mushroom = null;
			return true;
		}
		return false;
	}

	function poison(index) {
		gamespace[index.x][index.y].mushroom.poison = 1;
	}

	function newColor() {
	  colorIndex.x += 14;
	  if (colorIndex.x > 27) {
		colorIndex.x = 0;
		colorIndex.y += 11;
		if (colorIndex.y > 43)
		  colorIndex.y = 0
	  }
	}

	function resetColor() {
	  colorIndex = { x: 0, y: 0 };
	}

	let api = {
		growMush: growMush,
		beginMush: beginMush,
		genLevel: genLevel,
		takeHit: takeHit,
		regrow: regrow,
		poison: poison,
		newColor: newColor,
		resetColor: resetColor,
		get mushrooms() { return mushrooms; },
		get imageReady() { return imageReady; },
		get mushImage() { return mushImage; },
		get index() { return { x: spec.index.x + colorIndex.x, y: spec.index.y + colorIndex.y }; },
		get subTexture() { return spec.subTexture; }
	};

	return api;
}
