import nock from 'nock';
import fs from 'fs';
import path from 'path';

import version from '../../src/commands/info/version';

const res_fixture = fs.readFileSync(path.join(__dirname, '../fixtures/version.md'));


describe('version', () => {
  it('should return the change log for the latest verion', () => {
    nock('https://raw.githubusercontent.com/')
      .get('/Gravebot/Gravebot/master/CHANGELOG.md')
      .reply(200, res_fixture);

    return version.version()
      .then(res => {
        res.should.equal(`1.2.3 (Janurary 8th, 2016)

Features
- Test One

Bug Fixes
- Test Two

Technical Features
- Test Three`);
      });
  });
});
