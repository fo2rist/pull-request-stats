const buildSummary = require('../buildSummary');
const reviews = require('../getReviewers/__tests__/mocks/reviews');

describe('Interactors | .buildSummary', () => {
  const prefixMain = '**TOTALS |';
  const prefixPRs = 'PRs**: ';
  const prefixComments = 'Comments:** ';
  const prefixTime = 'Time to review:** ';

  describe('when there are no reviews', () => {
    it('build message with zeros', () => {
      const response = buildSummary([]);

      expect(response).toContain(prefixMain);
      expect(response).toContain(`${prefixPRs}0`);
      expect(response).toContain(`${prefixComments}0`);
      expect(response).toContain(`${prefixTime}0`);
    });
  });

  describe('when there are multiple reviews', () => {
    it('summarizes comments and aggregated review time', () => {
      const response = buildSummary(reviews);

      expect(response).toContain(prefixMain);
      expect(response).toContain(`${prefixPRs}2`);
      expect(response).toContain(`${prefixComments}6`);
      expect(response).toContain(`${prefixTime}1m`);
    });

    it('properly groups reviews of the same PR', () => {
      const response = buildSummary(reviews.concat(reviews));
      // duplicating reviews should result ins the same number of PR
      // and median review time, but double the comments

      expect(response).toContain(prefixMain);
      expect(response).toContain(`${prefixPRs}2`);
      expect(response).toContain(`${prefixComments}12`);
      expect(response).toContain(`${prefixTime}1m`);
    });
  });
});
