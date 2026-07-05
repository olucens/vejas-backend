"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let LoggerService = class LoggerService extends common_1.ConsoleLogger {
    constructor() {
        super();
        this.logDir = process.env.LOG_DIR || 'logs';
        this.maxFileSize = (parseInt(process.env.LOG_FILE_SIZE_KB || '10') || 10) * 1024;
        this.logLevels = [
            'error',
            'warn',
            'log',
            'debug',
            'verbose',
        ];
        this.currentLogLevel = parseInt(process.env.LOG_LEVEL || '2') || 2;
        this.setLogLevels(this.logLevels.slice(0, this.currentLogLevel + 1));
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }
    log(message, ...optionalParams) {
        super.log(message, ...optionalParams);
        this.writeToFile('log', message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        super.error(message, ...optionalParams);
        this.writeToFile('error', message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        super.warn(message, ...optionalParams);
        this.writeToFile('warn', message, ...optionalParams);
    }
    debug(message, ...optionalParams) {
        super.debug(message, ...optionalParams);
        this.writeToFile('debug', message, ...optionalParams);
    }
    verbose(message, ...optionalParams) {
        super.verbose(message, ...optionalParams);
        this.writeToFile('verbose', message, ...optionalParams);
    }
    writeToFile(level, message, ...optionalParams) {
        if (this.logLevels.indexOf(level) > this.currentLogLevel) {
            return;
        }
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [${level.toUpperCase()}] ${message} ${JSON.stringify(optionalParams)}\n`;
        this.rotateAndWrite('app.log', logMessage);
        if (level === 'error') {
            this.rotateAndWrite('error.log', logMessage);
        }
    }
    rotateAndWrite(filename, message) {
        const filePath = path.join(this.logDir, filename);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.size >= this.maxFileSize) {
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const newName = path.join(this.logDir, `${filename.split('.')[0]}_${timestamp}.log`);
                fs.renameSync(filePath, newName);
            }
        }
        fs.appendFileSync(filePath, message);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
//# sourceMappingURL=logger.service.js.map