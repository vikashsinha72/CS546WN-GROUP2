export const createEventRegisteredUser = async (userName, e, reviewerName, review, rating) => {
    productId = helpers.checkId(productId, "Product ID");
    title = helpers.checkString(title, "Title");
    reviewerName = helpers.checkString(reviewerName, "Reviewer Name");
    review = helpers.checkString(review, "Review");
    rating = helpers.checkNumber(rating, "Rating");
  
    const reviewDate = helpers.getReviewDate();
  
    if (rating < 1 || rating > 5) throw "Rating must be between 1 and 5";
  
    const productCollection = await products();
    const newReview = {
      _id: new ObjectId(),
      title,
      reviewDate,
      reviewerName,
      review,
      rating
    };
  
    const updateInfo = await productCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $push: { reviews: newReview } }
    );
  
    if (updateInfo.modifiedCount === 0) throw 'Could not add review';
  
    await recalculateAverageRating(productId);
    return newReview;
  };
  