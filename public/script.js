const userContainer = document.getElementById("users-container");

const fetchMovies = async ()=>{
    try{
        //fetch data from server
        const response = await fetch("/movies");
        if(!response.ok){
            throw new Error("Failed to get users");
        }

        //Parse json
        const users = await response.json();

        //Format the data to html
        userContainer.innerHTML = "";

        users.forEach((movie) => {
            const userDiv = document.createElement("div");
            userDiv.className = "user";
            userDiv.innerHTML = `${movie.moviename}`;
            userContainer.appendChild(userDiv);            
        });
    }catch(error){
        console.error("Error: ", error);
        userContainer.innerHTML = "<p style='color:red'>Failed to get movies</p>";
    }
    
    
}

fetchMovies();