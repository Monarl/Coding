import express from "express"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()

router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews) // get data base on movie id
router.route("/new").post(ReviewsCtrl.apiPostReview) // update new review
router.route("/:id")
    .get(ReviewsCtrl.apiGetReview)
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router