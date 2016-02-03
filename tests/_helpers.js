import fs from 'fs';
import path from 'path';
import R from 'ramda';


export function loadFixtures(fixtures_path, encoding = 'utf8') {
  var loaded_fixtures = {};

  R.forEach(file_name => {
    let fixture_ext = path.extname(file_name);
    let fixture_name = path.basename(file_name, fixture_ext);
    let fixture_path = path.join(fixtures_path, file_name);

    loaded_fixtures[fixture_name] = fs.readFileSync(fixture_path, encoding);
    if (fixture_ext === '.json') loaded_fixtures[fixture_name] = JSON.parse(loaded_fixtures[fixture_name]);
  }, fs.readdirSync(fixtures_path));

  return loaded_fixtures;
}
