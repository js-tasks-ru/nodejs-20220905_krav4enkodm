import fs from 'fs';
import {EOL} from 'os';
import {execSync} from 'child_process';
import path from 'path';
import {expect} from 'chai';

describe('event-loop/events-order', () => {
  describe('Порядок вывода сообщений', () => {
    it('файл с решением должен быть в папке с задачей', () => {
      const isExists = fs.existsSync(path.join(__dirname, '../solution.txt'));
      expect(isExists).to.be.true;
    });

    it('порядок вывода совпадает', () => {
      const solution = fs
        .readFileSync(path.join(__dirname, '../solution.txt'), {
          encoding: 'utf-8',
        })
        .replace(/\r\n|\r|\n/g, EOL);

      const output = execSync(`node "${path.join(__dirname, '../index.ts')}"`, {
        encoding: 'utf-8',
      }).replace(/\r\n|\r|\n/g, EOL);

      expect(solution.trim()).to.equal(output.trim());
    });
  });
});
