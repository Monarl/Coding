import {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const APILINK = 'http://localhost:8000/api/v1/reviews/';

const ReviewApp = () => {
    const [reviews, setReviews] = useState([]); //Store all reviews
    const [newreview, setReview] = useState(""); //Store edit review
    const [newuser, setUser] = useState(""); //Store edit user
    const [addreview, setAReview] = useState(""); //Store new review
    const [adduser, setAUser] = useState(""); //Store new user
    const [reviewInputId, setReviewInputId] = useState("") //Current editing Review input id
    const [userInputId, setUserInputId] = useState("") //Current editing User input id
    
    const url = new URL(window.location.href); // Get URL query information
    const movieId = url.searchParams.get('id');
    const movieTitle = url.searchParams.get('title');

    useEffect(() => {
        returnReviews(APILINK);
      }, []);


    const returnReviews = (url) => {
        fetch(url + "movie/" + movieId).then(res => res.json())
        .then((data) => {
            console.log(data);
            setReviews(data);
        }) 
    }

    const editReview = (id, review, user) => {
        setReviewInputId("review" + id)
        setUserInputId("user" + id);
        setReview(review)
        setUser(user)
    }

    const saveReview = (reviewInputId, userInputId, id = "") => {
        if (!id) { //Post new review
            fetch(APILINK + "new", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*'
                },
                body: JSON.stringify({ review: addreview, user: adduser , movieId: movieId}),
            })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                location.reload();
            }) 
            setReviewInputId("")
        } else { // Update review
            fetch(APILINK + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*'
                },
                body: JSON.stringify({ review: newreview, user: newuser }),
            })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                location.reload();
            }) 
            setReviewInputId("")
        }
    }

    const deleteReview = (id) => {
        fetch(APILINK + id, {
            method: 'DELETE'
        })
       .then(res => res.json())
       .then((res) => {
            console.log(res);
            location.reload();
        })
    }
    return (
        <>
        <div className = "topnav">
            <Link className = "active" to="/">Movies Site</Link>
        </div>
        <h1>Reviews for:</h1>
        <h3 id = "title">{movieTitle}</h3>
        <div className='movie-container'>
            <div className='row full_screen'>
                <div className='column'>
                    <div className='card'>
                        <h1>New reviews</h1>
                        <p><strong>Review: </strong>
                        <input type='text' className='input_light' id={reviewInputId} value={addreview} onChange={(e) => setAReview(e.target.value)}/>
                        </p>
                        <p><strong>    User: </strong>
                        <input type='text' className='input_light' id={userInputId} value={adduser} onChange={(e) => setAUser(e.target.value)}/>
                        </p>
                        <p><a href = '#' onClick = {() => saveReview(reviewInputId, userInputId)}>💾</a>
                        </p>
                    </div>
                </div>
            </div>
            
            {
                reviews.map(review => (
                    <div key={review._id} className='row'>
                        <div className='column'>
                            <div className='card' id={review._id}>
                                {
                                    (reviewInputId == "review" + review._id) ? (
                                        <>
                                            <p><strong>Review: </strong>
                                            <input type='text' className='input_light' id={reviewInputId} value={newreview} onChange={(e) => setReview(e.target.value)}/>
                                            </p>
                                            <p><strong>    User: </strong>
                                            <input type='text' className='input_light' id={userInputId} value={newuser} onChange={(e) => setUser(e.target.value)}/>
                                            </p>
                                            <p><a href = '#' onClick = {() => saveReview(reviewInputId, userInputId, review._id)}>💾</a>
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                        <p><strong>Review: </strong>{review.review}</p>
                                        <p><strong>User: </strong>{review.user}</p>
                                        <p><a href ='#' onClick={() => editReview(review._id, review.review, review.user)}>✏️</a>
                                        <a href='#' onClick={() => deleteReview(review._id)}>🗑️</a></p>
                                        </>)
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
        </>
    )
}

export default ReviewApp;