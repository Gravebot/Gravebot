import chai from 'chai';
import fs from 'fs';
import nock from 'nock';
import nconf from 'nconf';
import path from 'path';

import wolfram from '../../src/commands/useful/wolfram';


chai.should();
const res_fixture = fs.readFileSync(path.join(__dirname, '../fixtures/wolfram.xml'));

describe('wolfram', () => {
  it('should return an image containg the Canadian Primeminister', () => {
    nconf.set('WOLFRAM_KEY', '123');
    nock.cleanAll();
    nock('http://api.wolframalpha.com')
      .get(`/v2/query?units=metric&format=plaintext%2Cimage&primary=true&appid=${nconf.get('WOLFRAM_KEY')}&input=Who%20is%20the%20prime%20minister%20of%20Canada%3F`)
      .reply(200, res_fixture);

    return wolfram.wolfram({}, {}, 'Who is the prime minister of Canada?')
      .then(res => res.should.equal('http://www4b.wolframalpha.com/Calculate/MSP/MSP6444228f0g54209493h00000478549cb03adfa5h?MSPStoreType=image/gif&s=34'));
  });
});
