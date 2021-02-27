// World data from user

document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    let input_width = document.querySelector('#input_width');
    let input_trees = document.querySelector('#input_num_trees');
    let input_land = document.querySelector('#input_land_height');
    let width = input_width.value;
    let trees = input_trees.value;
    let land = input_land.value;

    if(width>60){
        input_width.select();
        alert('Dimension should be less than 60')
        return false;
    }
    if(land>60){
        input_land.select();
        alert('height should be less than 60')
        return false;
    }
    
    localStorage.setItem('world_width', width);
    localStorage.setItem('world_trees', trees);
    localStorage.setItem('world_land', land);
    window.location.replace("./world.html");
});
