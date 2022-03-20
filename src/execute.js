const core = require('@actions/core');
const github = require('@actions/github');
const {
  alreadyPublished,
  getPulls,
  getPullRequest,
  getReviewers,
  buildTable,
  buildComment,
  buildSummary,
  postComment,
} = require('./interactors');
const { subtractDaysToDate } = require('./utils');

const run = async (params) => {
  const {
    org,
    repos,
    excludedReviewers,
    sortBy,
    githubToken,
    periodLength,
    displayCharts,
    displaySummary,
    disableLinks,
    pullRequestId,
    limit,
  } = params;
  core.debug(`Params: ${JSON.stringify(params, null, 2)}`);

  const octokit = github.getOctokit(githubToken);

  const pullRequest = await getPullRequest({ octokit, pullRequestId });
  if (alreadyPublished(pullRequest)) {
    core.info('Skipping execution because stats are published already');
    return false;
  }

  const startDate = subtractDaysToDate(new Date(), periodLength);
  const pulls = await getPulls({
    octokit, org, repos, startDate,
  });
  core.info(`Found ${pulls.length} pull requests to analyze`);

  // Calculate stats for each reviewer
  const reviewers = getReviewers(pulls, excludedReviewers);
  core.info(`Analyzed stats for ${reviewers.length} pull request reviewers: ${reviewers.map((r) => r.author.login)}`);
  core.info(`Reviewers excluded from stats: ${excludedReviewers}`);
  // Get all reviews ungrouped
  const allReviews = reviewers.reduce((acc, reviewer) => acc.concat(reviewer.reviews), []);

  // Generate PR comment
  const table = buildTable(reviewers, {
    limit,
    sortBy,
    disableLinks,
    periodLength,
    displayCharts,
  });

  const summary = displaySummary ? `\n\n${buildSummary(allReviews)}` : '';

  const content = `${buildComment({ table, periodLength })}${summary}`;

  core.debug(`Commit content built successfully: ${content}`);

  await postComment({
    octokit,
    content,
    pullRequestId,
    currentBody: pullRequest.body,
  });
  core.debug('Posted comment successfully');

  return true;
};

module.exports = async (params) => {
  await run(params);
};
