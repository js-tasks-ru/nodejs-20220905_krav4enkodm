"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const LimitSizeStream_1 = __importDefault(require("./LimitSizeStream"));
const limitedStream = new LimitSizeStream_1.default({ limit: 8, encoding: "utf-8" }); // 8 байт
const outStream = fs_1.default.createWriteStream("out.txt");
limitedStream.pipe(outStream);
limitedStream.write("hello"); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл
setTimeout(() => {
    limitedStream.write("world"); // ошибка LimitExceeded! в файле осталось только hello
}, 10);
