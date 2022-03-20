const calculateReviewsStats = require('./getReviewers/calculateReviewsStats');
const { durationToString } = require('../utils');

module.exports = (reviews) => {
  const summaryStats = calculateReviewsStats(reviews);
  const summary = `**TOTALS | PRs**: ${summaryStats.totalReviews}. **Comments:** ${summaryStats.totalComments}. **Time to review:** ${durationToString(summaryStats.timeToReview)}`;
  return summary;
};
