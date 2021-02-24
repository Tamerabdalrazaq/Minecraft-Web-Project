// World data
const numOfColumns = 30;
const numOfLayers = 18;
const width = null;

// World data from user
let input_width = localStorage.getItem('world_width');
let input_trees = localStorage.getItem('world_trees');
let input_land = localStorage.getItem('world_land');

let page = document.querySelector('.page');
let world = document.querySelector('.page .world');
let blocks = [];

createBlocks();
createGround(Math.round(numOfLayers*input_land/100));




function createBlocks(){
    for(let row = 0; row<18; row++){
        let r = [];
        for(let column = 0; column < 30; column ++){
            let block = document.createElement('div');
            block.classList.add('block');
            block.classList.add(`block${row}-${column}`);
            r.push(block);
            world.appendChild(block);
        }
        blocks.push(r);
    }
}

function createGround(rows){
    for(let x = blocks.length-1; x> blocks.length -1 - rows; x--){
        console.log(blocks[x]);
        for(let y = 0; y<blocks[x].length; y++){
            if(x === blocks.length -  rows)
                blocks[x][y].classList.add('grass')
            else
                blocks[x][y].classList.add('dirt')
        }
    }
}