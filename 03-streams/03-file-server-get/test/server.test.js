"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../server"));
const http_1 = __importDefault(require("http"));
const chai_1 = require("chai");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const filesFolder = path_1.default.resolve(__dirname, "../files");
const fixturesFolder = path_1.default.resolve(__dirname, "./fixtures");
describe("streams/file-server-get", () => {
    describe("тесты на файловый сервер", () => {
        before((done) => {
            fs_extra_1.default.emptyDirSync(filesFolder);
            server_1.default.listen(3001, done);
        });
        after((done) => {
            fs_extra_1.default.emptyDirSync(filesFolder);
            fs_extra_1.default.writeFileSync(path_1.default.join(filesFolder, ".gitkeep"), "");
            server_1.default.close(done);
        });
        beforeEach(() => {
            fs_extra_1.default.emptyDirSync(filesFolder);
        });
        describe("GET", () => {
            it("файл отдается по запросу", (done) => {
                fs_extra_1.default.copyFileSync(path_1.default.join(fixturesFolder, "index.js"), path_1.default.join(filesFolder, "index.js"));
                const content = fs_extra_1.default.readFileSync(path_1.default.join(filesFolder, "index.js"));
                const request = http_1.default.request("http://localhost:3001/index.js", (response) => { var response_1, response_1_1; return __awaiter(void 0, void 0, void 0, function* () {
                    var e_1, _a;
                    (0, chai_1.expect)(response.statusCode, "статус код ответа 200").to.equal(200);
                    const body = [];
                    try {
                        for (response_1 = __asyncValues(response); response_1_1 = yield response_1.next(), !response_1_1.done;) {
                            const chunk = response_1_1.value;
                            body.push(chunk);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (response_1_1 && !response_1_1.done && (_a = response_1.return)) yield _a.call(response_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    (0, chai_1.expect)(Buffer.concat(body).equals(content), "ответ сервера - исходный файл index.js").to.be.true;
                    done();
                }); });
                request.on("error", done);
                request.end();
            });
            it("если файла нет - отдается 404", (done) => {
                const request = http_1.default.request("http://localhost:3001/not_exists.png", (response) => {
                    (0, chai_1.expect)(response.statusCode, "статус код ответа 404").to.equal(404);
                    done();
                });
                request.on("error", done);
                request.end();
            });
            it("если путь вложенный - возвращается ошибка 400", (done) => {
                const request = http_1.default.request("http://localhost:3001/nested/path", (response) => {
                    (0, chai_1.expect)(response.statusCode, "статус код ответа 400").to.equal(400);
                    done();
                });
                request.on("error", done);
                request.end();
            });
        });
    });
});
