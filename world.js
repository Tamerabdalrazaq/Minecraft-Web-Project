// World data
const numOfColumns = 30;
const numOfLayers = 18;
const width = null;

// World data from user
let input_width = localStorage.getItem('world_width');
let input_trees = localStorage.getItem('world_trees');
let input_land = localStorage.getItem('world_land');

let page = document.querySelector('.page');
let worldPage = document.querySelector('.page .world');
let world = {
    groundLevel: Math.round(numOfLayers*input_land/100),
    soil: 0, 
    rocks: 0,
    grass: 0,
    wood: 0,
    leaves: 0,
};
let blocks = [];

createBlocks();
createGround(world.groundLevel);
createRocks();
createTrees();
console.log(world);

function createBlocks(){
    for(let row = 0; row<18; row++){
        let r = [];
        for(let column = 0; column < 30; column ++){
            let block = document.createElement('div');
            block.classList.add('block');
            block.classList.add(`block${row}-${column}`);
            r.push(block);
            worldPage.appendChild(block);
        }
        blocks.push(r);
    }
}

function createGround(rows){
    for(let x = blocks.length-1; x> blocks.length -1 - rows; x--){
        for(let y = 0; y<blocks[x].length; y++){
            if(x === blocks.length -  rows){
                blocks[x][y].classList.add('grass')
                world.grass++
            }
            else{
                blocks[x][y].classList.add('dirt')
                world.soil++
            }
        }
    }
}

function createRocks(){
    let numOfRocks = Math.floor(Math.random()*5 + 1);
    let groundRow = numOfLayers - world.groundLevel -1;
    for(let i = 0; i<numOfRocks; i++){
        let randomX = Math.floor(Math.random()*numOfColumns );
        if(blocks[groundRow][randomX].classList.length > 2)
            i--;
        else{
            blocks[groundRow][randomX].classList.add('rock');
            world.rocks++;
        }
    }
}

function createTrees(){
    let numOfTrees = input_trees;
    let groundRow = numOfLayers - world.groundLevel -1;
    for(let i = 0; i<numOfTrees; i++){
        let randomX = Math.floor(Math.random()*numOfColumns );
        if(blocks[groundRow][randomX].classList.length > 2)
            i--;
        else{
            let treeTrunk = Math.floor(Math.random()*4 + 1);
            let treeLeaves = Math.floor(Math.random()*5 + 1); 
            createTree(groundRow,randomX,treeTrunk,treeLeaves);
        }
    }
}

function createTree(y,x,trunkHeight, leavesWidth){
    for(let i = 0; i<trunkHeight; i++){
        blocks[y-i][x].classList.add('wood');
        world.wood++;
    }
    for(let v = 0; v<leavesWidth; v++){
        for(let s = 0; s<leavesWidth; s++){
            blocks[y-trunkHeight-v][x-Math.floor(leavesWidth/2)+s].classList.add('leaves');
            world.leaves++;
        }
    }
}