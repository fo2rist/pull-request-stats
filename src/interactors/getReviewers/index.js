const calculateReviewsStats = require('./calculateReviewsStats');
const groupReviews = require('./groupReviews');

module.exports = (pulls, excludedAuthors = []) => {
  const groupedStats = groupReviews(pulls).map(({ author, reviews }) => (
    {
      author,
      reviews,
      stats: calculateReviewsStats(reviews),
    }
  ));

  return groupedStats.filter((r) => !excludedAuthors.includes(r.author.login));
};
