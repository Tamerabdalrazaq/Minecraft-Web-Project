// World data from user

document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    let input_width = document.querySelector('#input_width').value;
    let input_trees = document.querySelector('#input_num_trees').value;
    let input_land = document.querySelector('#input_land_height').value;
    console.log(input_land,input_trees,input_width,'aa');
    localStorage.setItem('world_width', input_width);
    localStorage.setItem('world_trees', input_trees);
    localStorage.setItem('world_land', input_land);
    window.location.replace("./world.html");
});
