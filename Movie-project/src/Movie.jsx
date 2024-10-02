import {useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMovies } from './redux/movieSlice';


const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=19f5f46e79fcd98320c0d2a8055481e8&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=19f5f46e79fcd98320c0d2a8055481e8&query=";

const MovieApp = () => {
    const movies = useSelector((state) => state.movies.list);
    const [keyword, setKeyword] = useState("");
    const dispatch = useDispatch();

    
    useEffect(() => {
        returnMovies(APILINK);
      }, []);

    const handle_name_submit = e => {
        e.preventDefault();
        if(keyword) returnMovies(SEARCHAPI + keyword)
            else returnMovies(APILINK)  
    }

    const Update_movies_by_name = e =>  setKeyword(e.target.value);

    const returnMovies = (url) => {
        fetch(url).then(res => res.json())
        .then((data) => {
            console.log(data.results);
            dispatch(setMovies(data.results));
        }) 
    }

    return (
        <>
        <div className = "topnav">
            <a className = "active" href="#">Movies Site</a>
            <div className = "search-container">
                <form role = "search" id = "form" onSubmit={handle_name_submit}>
                    <input onChange={Update_movies_by_name} type="search" id="query" name="q" placeholder="Search..."/>
                </form>
            </div>
        </div>
        <div className="movie-container">
            {movies.map(movie => (
                <div className={"row"} key={movie.id}>
                    <div className={"column"}>
                        <div className={"card"}>
                            <center>
                                <img src={IMG_PATH + movie.poster_path} className={"thumbnail"}/>
                            </center>
                            <h3>{movie.title}</h3 >
                        </div>
                    </div>
                </div>
            )
        )
    }
</div>
        </>
    )
}

export default MovieApp;
