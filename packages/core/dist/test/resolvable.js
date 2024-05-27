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
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const resolvable_1 = require("../resolvable");
(0, ava_1.default)('Resolves with correct value', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const s = new resolvable_1.Resolvable();
    s.promise.then(v => t.is(v, 5));
    s.resolve(5);
    t.pass();
}));
(0, ava_1.default)('Rejects with correct error', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const s = new resolvable_1.Resolvable();
    s.promise.catch(err => t.is(err.message, 'Error5'));
    s.reject(new Error('Error5'));
    t.pass();
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Jlc29sdmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2QkFBc0I7QUFDdEIsOENBQTBDO0FBRTFDLElBQUEsYUFBSSxFQUFDLDZCQUE2QixFQUFFLENBQU0sQ0FBQyxFQUFDLEVBQUU7SUFDNUMsTUFBTSxDQUFDLEdBQUcsSUFBSSx1QkFBVSxFQUFPLENBQUE7SUFDL0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQy9CLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDWixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDVixDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUYsSUFBQSxhQUFJLEVBQUMsNEJBQTRCLEVBQUUsQ0FBTSxDQUFDLEVBQUMsRUFBRTtJQUMzQyxNQUFNLENBQUMsR0FBRyxJQUFJLHVCQUFVLEVBQU8sQ0FBQTtJQUMvQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUM3QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDVixDQUFDLENBQUEsQ0FBQyxDQUFBIn0=