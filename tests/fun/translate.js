import chai from 'chai';
import fs from 'fs';
import nock from 'nock';
import path from 'path';

import translate from '../../src/commands/fun/translate';


chai.should();
const res_fixture = fs.readFileSync(path.join(__dirname, '../fixtures/yoda.html'));

describe('translate', () => {
  describe('yoda', () => {
    it('shoud return converted text', () => {
      nock.cleanAll();
      nock('http://www.yodaspeak.co.uk')
        .post('/index.php')
        .reply(200, res_fixture);

      return translate.yoda({}, {}, 'Hello, lets go to the store.')
        .then(res => res.should.equal('Hello, to the store lets go. '));
    });
  });
});
