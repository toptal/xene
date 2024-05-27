"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestToLogLevel = exports.logger = void 0;
const winston = require("winston");
const env = process.env.NODE_ENV || 'development';
const level = env === 'development' || process.env.XENE_LOGS_VERBOSE ? 'verbose' : 'info';
const transport = new winston.transports.Console({
    format: winston.format.combine(winston.format.label({ label: '@xene/slack' }), winston.format.json())
});
exports.logger = winston.createLogger({ level, transports: [transport] });
exports.requestToLogLevel = process.env.XENE_LOGS_LOG_REQUEST_TO_INFO ? 'info' : 'verbose';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBa0M7QUFDbEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxDQUFBO0FBQ2pELE1BQU0sS0FBSyxHQUFHLEdBQUcsS0FBSyxhQUFhLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFFekYsTUFBTSxTQUFTLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztJQUMvQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBQyxDQUFDLEVBQzdDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQ3RCO0NBQ0YsQ0FBQyxDQUFBO0FBQ1csUUFBQSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDakUsUUFBQSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQSJ9