// World data from user
let input_width = localStorage.getItem('world_width');
let input_trees = localStorage.getItem('world_trees');
let input_land = localStorage.getItem('world_land');

// Variables
let page = document.querySelector('.page');
let worldPage = document.querySelector('.page .world');
let sideBar = document.querySelector('.page aside');

// World data
const blockDimention = input_width;
const width = worldPage.clientWidth;
const height = worldPage.clientHeight;
let calculatedColumns = Math.round(width/blockDimention);
let calculatedRows = Math.round(height/blockDimention);
const numOfColumns = calculatedColumns;
const numOfLayers = calculatedRows;
const tools = ['axe','pickaxe','shovel'];
const elements = ['dirt','rock','grass','wood','leaf','tnt'];


// Page Buttons
let toolsButtons = document.querySelectorAll('.tools > div.tool');
let inventorysButtons = document.querySelectorAll('.inventory > div.element');
let optionsButtons = document.querySelectorAll('.options > button');
let explosionSound = new Audio('./sound/explode1.mp3');


// Objects
function Block(row,col,type,occupied){
    this.row = row;
    this.col = col;
    this.type = type;
    this.occupied = occupied;
}

// Variables
worldPage.style = `
grid-template-columns: repeat(${numOfColumns},1fr);
grid-template-rows: repeat(${numOfLayers},1fr);`;
let world = {
    groundLevel: Math.round(numOfLayers*input_land/100),
    hand: 'cursor',
    freeLand:numOfColumns+1,
    elements: {
        dirt: 0, 
        rock: 0,
        grass: 0,
        wood: 0,
        leaf: 0,
        tnt:0,
    },
    inventory: {
        dirt: 0, 
        rock: 0,
        grass: 0,
        wood: 0,
        leaf: 0,
        tnt:5,
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
        button.style.borderColor = 'rgba(255, 41, 41)';
        world.hand = button.dataset.hand;
        console.log(world.hand);
    });
});

worldPage.addEventListener('click', worldClick);


// Create The World
createBlocks();
createGround(world.groundLevel);
createTrees();
createRocks();
console.log(world);


//Functions
function createBlocks(){
    for(let row = 0; row< numOfLayers; row++){
        let r = [];
        for(let column = 0; column < numOfColumns; column ++){
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
    let numOfRocks = generateRandom(1,Math.floor(world.freeLand/2));
    let groundRow = numOfLayers - world.groundLevel -1;
    for(let i = 0; i<numOfRocks; i++){
        let randomX = Math.floor(Math.random()*numOfColumns );
        if(blocks[groundRow][randomX][1].occupied || blocks[groundRow][randomX][1].type === 'wood')
            i--;
        else{
            blocks[groundRow][randomX][0].classList.add('rock');
            blocks[groundRow][randomX][1].type = 'rock';
            blocks[groundRow][randomX][1].occupied = true;
            world.freeLand--;
            world.elements.rock++;
        }
    }
}


// || isBeyondWorld(groundRow,randomX+Math.floor(treeLeaves/2)) 
// || isBeyondWorld(groundRow,randomX-Math.floor(treeLeaves/2))
function createTrees(){
    let trees = findSuitableTreePositions(input_trees);
    let numOfTrees = trees.length;
    let groundRow = numOfLayers - world.groundLevel -1;
    for(let i = 0; i<numOfTrees; i++){
            createTree(groundRow,trees[i][0],trees[i][1],trees[i][2]);
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
                world.elements.leaf++;
            }
        }
    }
}


function worldClick(e){
    let block = e.target;
    if(block != worldPage){
        let blockObj = blocks[block.dataset.row][block.dataset.column][1];
        if(tools.includes(world.hand)){
            if(blockObj.occupied){
                if(!checkValidRemove(block))
                    return false;
                deleteBlockElement(block.dataset.row,block.dataset.column);
            }
            else{}
        }
        else if(elements.includes(world.hand)){
            if(!blockObj.occupied){
                if(world.inventory[world.hand] > 0 || world.hand === 'tnt'){
                    let inventoryButton = document.querySelector(`.inventory .${world.hand}`);
                    block.classList.add(world.hand);
                    blockObj.occupied = true;
                    blockObj.type = world.hand;
                    if(world.hand != 'tnt'){
                        world.inventory[world.hand]--;
                        inventoryButton.dataset.before = world.inventory[world.hand];
                    }
                    else{
                        explosion(blockObj.row, blockObj.col);
                    }
                }
            }
            else{}
        }
    }
}


findSuitableTreePositions(3);
function findSuitableTreePositions(n){
    let trees=[];
    let groundRow = numOfLayers - world.groundLevel -1;
    let freeGroundBlocks = blocks[groundRow].filter(element => 
        !element[1].occupied);
    console.log(freeGroundBlocks);
    for(let x = 0; x<n; x++){
        let leaves = generateRandom(2,4);
        let skyHeight = groundRow-1;
        let trunk = generateRandom(2,4);
        leaves = leaves%2? leaves:leaves+1;
        let position = generateRandom(0+2,numOfColumns-1-2);
        console.log(blocks[groundRow][position]);
        if(!blocks[groundRow][position][1].occupied){
            trees.push([position,trunk,leaves]);
        }
    }
    return trees;
}


function generateRandom(a,b){
    return Math.floor(a + Math.random()* (b-a+1));
}

function deleteBlockElement(r,c){
    let block = blocks[r][c];
    if(!isEmpty(r,c)){
        let inventoryButton = document.querySelector(`.inventory .${block[1].type}`);
        block[0].classList = 'block';
        if(block[1].type != 'tnt'){
            world.inventory[block[1].type]++;
            inventoryButton.dataset.before = world.inventory[block[1].type];
            console.log('tnt');
        }
        block[1].type = null;
        block[1].occupied = false;
    }
}

function checkValidRemove(block){
    let r = parseInt(block.dataset.row);
    let c = parseInt(block.dataset.column);
    let condition = isEmpty(r-1,c) || isEmpty(r+1,c) || isEmpty(r,c-1) || isEmpty(r,c+1);
    if(!condition){
        // ......
    }
    return (condition);
}


function isEmpty(r,c){
    if(isBeyondWorld(r,c))
        return false;
    return !blocks[r][c][1].occupied;
}

function isBeyondWorld(r,c){
    return (r>= numOfLayers || r<0 || c>=numOfColumns || c<0);
}

function explosion(r,c){
    let explisonRadius = generateRandom(1,3);
    setTimeout(function(){
        explosionSound.play();
        for(let i = -explisonRadius; i<=explisonRadius; i++){
            for(let v = -generateRandom(1,3); v<=generateRandom(1,3); v++){
                if(!isBeyondWorld(r+i,c-v))
                    deleteBlockElement(r+i,c-v);
            }
        }
    },1000);
}



// Buttons Listeners

function toMainPage(){
    window.location.replace("./index.html");
}
function saveProgress(){
    window.location.replace("./world.html");
}
function newWorld(){
    window.location.replace("./world.html");
}