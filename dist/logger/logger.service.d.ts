import { ConsoleLogger } from '@nestjs/common';
export declare class LoggerService extends ConsoleLogger {
    private readonly logDir;
    private readonly maxFileSize;
    private readonly logLevels;
    private currentLogLevel;
    constructor();
    log(message: any, ...optionalParams: any[]): void;
    error(message: any, ...optionalParams: any[]): void;
    warn(message: any, ...optionalParams: any[]): void;
    debug(message: any, ...optionalParams: any[]): void;
    verbose(message: any, ...optionalParams: any[]): void;
    private writeToFile;
    private rotateAndWrite;
}
