import chai from 'chai';

import fs from 'fs';
import nconf from 'nconf';
import nock from 'nock';
import path from 'path';

import image from '../../src/commands/useful/image';

chai.should();

const original_request_fixture = fs.readFileSync(path.join(__dirname, '../fixtures/image.json'));

describe.only('image', () => {
  before(() => {
    nconf.set('BING_IMAGE_KEY', '123');
  });
  nock.cleanAll();
  nock('https://api.cognitive.microsoft.com', {encodedQueryParams: true})
    .get('/bing/v5.0/images/search')
    .query({q: 'cats', count: '1', offset: '0', mkt: 'en-us', safeSearch: 'Moderate'})
    .reply(200, original_request_fixture);

  it('should return a picture of a cat', () => {
    return image.image({}, {}, 'cats')
      .then(res => res.should.equal('http://4.bp.blogspot.com/-h6NZxgZ8CR8/T3YC7kbhaEI/AAAAAAAAAUY/6JSTwT1EaXo/s1600/cat%2Bwallpaper%2B1.jpg'));
  });
});
