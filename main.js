// World data from user

document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    let input_width = document.querySelector('#input_width');
    let input_trees = document.querySelector('#input_num_trees');
    let input_land = document.querySelector('#input_land_height');
    let width = input_width.value;
    let trees = input_trees.value;
    let land = input_land.value;

    if(width>60 || width < 5 || isNaN(width) || width === ''){
        input_width.select();
        alert('Dimension should be less than 60 and greater than 5')
        return false;
    }
    if(land>60 || land<10 || isNaN(land) || land === ''){
        input_land.select();
        alert('height should be less than 60 and greater that 10')
        return false;
    }

    if(trees>10 || isNaN(trees) || trees === ''){
        alert('trees should be less than 10 and more than 0')
    }

    
    localStorage.setItem('world_width', width);
    localStorage.setItem('world_trees', trees);
    localStorage.setItem('world_land', land);
    window.location.replace("./world.html");
});
