"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../server"));
const chai_1 = require("chai");
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
const node_http_1 = __importDefault(require("node:http"));
const filesFolder = node_path_1.default.resolve(__dirname, '../files');
const fixturesFolder = node_path_1.default.resolve(__dirname, './fixtures');
describe('streams/file-server-post', () => {
    describe('тесты на файловый сервер', () => {
        before((done) => {
            fs_extra_1.default.emptyDirSync(filesFolder);
            server_1.default.listen(3001, done);
        });
        after((done) => {
            fs_extra_1.default.emptyDirSync(filesFolder);
            fs_extra_1.default.writeFileSync(node_path_1.default.join(filesFolder, '.gitkeep'), '');
            server_1.default.close(done);
        });
        beforeEach(() => {
            fs_extra_1.default.emptyDirSync(filesFolder);
        });
        describe('POST', () => {
            it('возвращается ошибка 409 при создании файла, который есть', (done) => {
                fs_extra_1.default.copyFileSync(node_path_1.default.join(fixturesFolder, 'small.png'), node_path_1.default.join(filesFolder, 'small.png'));
                const mtime = fs_extra_1.default.statSync(node_path_1.default.join(filesFolder, 'small.png')).mtime;
                const request = node_http_1.default.request('http://localhost:3001/small.png', { method: 'POST' }, (response) => {
                    const newMtime = fs_extra_1.default.statSync(node_path_1.default.join(filesFolder, 'small.png')).mtime;
                    (0, chai_1.expect)(response.statusCode, 'статус код ответа 409').to.equal(409);
                    (0, chai_1.expect)(mtime, 'файл не должен перезаписываться').to.eql(newMtime);
                    done();
                });
                request.on('error', done);
                fs_extra_1.default
                    .createReadStream(node_path_1.default.join(fixturesFolder, 'small.png'))
                    .pipe(request);
            });
            it('если тело запроса пустое файл не перезаписывается', (done) => {
                fs_extra_1.default.copyFileSync(node_path_1.default.join(fixturesFolder, 'small.png'), node_path_1.default.join(filesFolder, 'small.png'));
                const mtime = fs_extra_1.default.statSync(node_path_1.default.join(filesFolder, 'small.png')).mtime;
                const request = node_http_1.default.request('http://localhost:3001/small.png', { method: 'POST' }, (response) => {
                    const newMtime = fs_extra_1.default.statSync(node_path_1.default.join(filesFolder, 'small.png')).mtime;
                    (0, chai_1.expect)(response.statusCode, 'статус код ответа сервера 409').to.equal(409);
                    (0, chai_1.expect)(mtime, 'файл не должен перезаписываться').to.eql(newMtime);
                    done();
                });
                request.on('error', done);
                request.end();
            });
            it('при попытке создания слишком большого файла - ошибка 413', (done) => {
                const request = node_http_1.default.request('http://localhost:3001/big.png', { method: 'POST' }, (response) => {
                    (0, chai_1.expect)(response.statusCode, 'статус код ответа сервера 413').to.equal(413);
                    setTimeout(() => {
                        (0, chai_1.expect)(fs_extra_1.default.existsSync(node_path_1.default.join(filesFolder, 'big.png')), 'файл big.png не должен оставаться на диске').to.be.false;
                        done();
                    }, 100);
                });
                request.on('error', (err) => {
                    // EPIPE/ECONNRESET error should occur because we try to pipe after res closed
                    // @ts-expect-error
                    if (!['ECONNRESET', 'EPIPE'].includes(err.code))
                        done(err);
                });
                fs_extra_1.default
                    .createReadStream(node_path_1.default.join(fixturesFolder, 'big.png'))
                    .pipe(request);
            });
            it('успешное создание файла', (done) => {
                const request = node_http_1.default.request('http://localhost:3001/small.png', { method: 'POST' }, (response) => {
                    (0, chai_1.expect)(response.statusCode, 'статус код ответа сервера 201').to.equal(201);
                    (0, chai_1.expect)(fs_extra_1.default.existsSync(node_path_1.default.join(filesFolder, 'small.png')), 'файл small.png должен быть на диске').to.be.true;
                    done();
                });
                request.on('error', done);
                fs_extra_1.default
                    .createReadStream(node_path_1.default.join(fixturesFolder, 'small.png'))
                    .pipe(request);
            });
            it('файл не должен оставаться на диске при обрыве соединения', (done) => {
                const request = node_http_1.default.request('http://localhost:3001/example.txt', { method: 'POST' }, (response) => {
                    chai_1.expect.fail('there should be no response');
                });
                request.on('error', (err) => {
                    // @ts-expect-error
                    if (err.code !== 'ECONNRESET')
                        return done(err);
                    setTimeout(() => {
                        (0, chai_1.expect)(fs_extra_1.default.existsSync(node_path_1.default.join(filesFolder, 'example.txt')), 'файл example.txt не должен оставаться на диске').to.be.false;
                        done();
                    }, 100);
                });
                request.write('content');
                setTimeout(() => {
                    request.abort();
                }, 300);
            });
            it('если путь вложенный - возвращается ошибка 400', (done) => {
                const request = node_http_1.default.request('http://localhost:3001/nested/path', { method: 'POST' }, (response) => {
                    (0, chai_1.expect)(response.statusCode, 'статус код ответа 400').to.equal(400);
                    done();
                });
                request.on('error', done);
                request.end();
            });
        });
    });
});
