const TMDB_CONFIG= {
    BASE_URl: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers:{
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchMovies = async({query}:{query: string}) =>{
    const endpoint = query ?
     `${TMDB_CONFIG.BASE_URl}/discover/movie?query=${encodeURIComponent(query)}` :
    `${TMDB_CONFIG.BASE_URl}/discover/movie?sort_by=popularity.dec`

    const response = await fetch(endpoint,{
        method: 'GET',
        headers: TMDB_CONFIG.headers
    })

    if(!response.ok){
        throw new Error(`failed to fetch movies: ${response.statusText}`)

    }
    const data = await response.json();
    return data.results;
}
