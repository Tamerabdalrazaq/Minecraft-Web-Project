// World data
const numOfColumns = 30;
const numOfLayers = 18;
const width = null;

// World data from user
let input_width = localStorage.getItem('world_width');
let input_trees = localStorage.getItem('world_trees');
let input_land = localStorage.getItem('world_land');

// Page Buttons
let toolsButtons = document.querySelectorAll('.tools > div.tool');
let inventorysButtons = document.querySelectorAll('.inventory > div.element');
let optionsButtons = document.querySelectorAll('.options > button');


// Objects
function Block(row,col,type,occupied){
    this.row = row;
    this.col = col;
    this.type = type;
    this.occupied = occupied;
}

// Variables
let page = document.querySelector('.page');
let worldPage = document.querySelector('.page .world');
let world = {
    groundLevel: Math.round(numOfLayers*input_land/100),
    hand: 'cursor',
    elements: {
        dirt: 0, 
        rock: 0,
        grass: 0,
        wood: 0,
        leaves: 0,
    },
    inventory: {
        dirt: 0, 
        rock: 0,
        grass: 0,
        wood: 0,
        leaf: 0,
    },
};
let blocks = [];

// Event Listeners for Buttons
toolsButtons.forEach(button => {
    button.addEventListener('click', function(){
        toolsButtons.forEach(button => button.style.borderColor = 'white');
        button.style.borderColor = 'rgb(255, 41, 41)';
        world.hand = button.dataset.hand;
    });
});

inventorysButtons.forEach(button => {
    button.addEventListener('click', function(){
        inventorysButtons.forEach(button => button.style.borderColor = 'white');
        button.style.borderColor = 'rgb(255, 41, 41)';
        world.hand = button.dataset.hand;
        console.log(world.hand);
    });
});

worldPage.addEventListener('click', worldClick);


// Create The World
createBlocks();
createGround(world.groundLevel);
createRocks();
createTrees();
console.log(blocks);
console.log(world);


//Functions
function createBlocks(){
    for(let row = 0; row<18; row++){
        let r = [];
        for(let column = 0; column < 30; column ++){
            let block = document.createElement('div');
            block.setAttribute('data-row', `${row}`);
            block.setAttribute('data-column', `${column}`);
            block.classList.add('block');
            r.push([block,new Block(row,column,null,false)]);
            worldPage.appendChild(block);
        }
        blocks.push(r);
    }
}

function createGround(rows){
    for(let x = blocks.length-1; x> blocks.length -1 - rows; x--){
        for(let y = 0; y<blocks[x].length; y++){
            if(x === blocks.length -  rows){
                blocks[x][y][0].classList.add('grass');
                blocks[x][y][1].type = 'grass';
                blocks[x][y][1].occupied = true;
                world.elements.grass++;
            }
            else{
                blocks[x][y][0].classList.add('dirt');
                world.elements.dirt++;
                blocks[x][y][1].type = 'dirt';
                blocks[x][y][1].occupied = true;
            }
        }
    }
}

function createRocks(){
    let numOfRocks = Math.floor(Math.random()*5 + 1);
    let groundRow = numOfLayers - world.groundLevel -1;
    for(let i = 0; i<numOfRocks; i++){
        let randomX = Math.floor(Math.random()*numOfColumns );
        if(blocks[groundRow][randomX][1].occupied)
            i--;
        else{
            blocks[groundRow][randomX][0].classList.add('rock');
            blocks[groundRow][randomX][1].type = 'rock';
            blocks[groundRow][randomX][1].occupied = true;
            world.elements.rock++;
        }
    }
}

function createTrees(){
    let numOfTrees = input_trees;
    let groundRow = numOfLayers - world.groundLevel -1;
    for(let i = 0; i<numOfTrees; i++){
        let randomX = Math.floor(Math.random()*numOfColumns );
        if(blocks[groundRow][randomX][1].occupied)
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
        blocks[y-i][x][0].classList.add('wood');
        blocks[y-i][x][1].type = 'wood';
        blocks[y-i][x][1].occupied = true;
        world.elements.wood++;
    }
    for(let v = 0; v<leavesWidth; v++){
        for(let s = 0; s<leavesWidth; s++){
            let block = blocks[y-trunkHeight-v][x-Math.floor(leavesWidth/2)+s];
            if(!block[1].occupied){
                block[0].classList.add('leaf');
                block[1].type = 'leaf';
                block[1].occupied = true;
                world.elements.leaves++;
            }
        }
    }
}


function worldClick(e){
    let block = e.target;
    if(block != worldPage){
        let blockObj = blocks[block.dataset.row][block.dataset.column][1]
        if(blockObj.occupied){
            let inventoryButton = document.querySelector(`.inventory .${blockObj.type}`);
            block.classList = 'block';
            blockObj.occupied = false;
            world.inventory[blockObj.type]++;
            inventoryButton.dataset.before = world.inventory[blockObj.type];
        }

        else{
            
        }
    }
}