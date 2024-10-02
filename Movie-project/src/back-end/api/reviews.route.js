import express from "express"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()

router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews)
router.route("/new").post(ReviewsCtrl.apiPostReviews)
router.route("/:id")
    .get(ReviewsCtrl.apiGetReviews)
    .post(ReviewsCtrl.apiPostReviews)
    .delete(ReviewsCtrl.apiDeleteReviews)

export default router