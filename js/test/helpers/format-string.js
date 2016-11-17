"use strict";
const chai = require('chai');
const format_string_1 = require('../../helpers/format-string');
const expect = chai.expect;
describe('Format string:', () => {
    it('should format by single key', () => {
        const str = 'test {test}';
        const obj = { test: 'string' };
        const formatted = format_string_1.default(str, obj);
        expect(formatted).to.equals('test string');
    });
    it('should format by nested key', () => {
        const str = 'test {test.nested}';
        const obj = { test: { nested: 'string' } };
        const formatted = format_string_1.default(str, obj);
        expect(formatted).to.equals('test string');
    });
    it('should not format by missing key', () => {
        const str = 'test {test.nested}';
        const obj = { test: { missing: 'string' } };
        const formatted = format_string_1.default(str, obj);
        expect(formatted).to.equals('test {test.nested}');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LXN0cmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0L2hlbHBlcnMvZm9ybWF0LXN0cmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBWSxJQUFJLFdBQU0sTUFDdEIsQ0FBQyxDQUQyQjtBQUM1QixnQ0FBbUIsNkJBQ25CLENBQUMsQ0FEK0M7QUFDaEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUUxQixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1FBQ2hDLE1BQU0sR0FBRyxHQUFHLGFBQWEsQ0FBQTtRQUN6QixNQUFNLEdBQUcsR0FBRyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQTtRQUM1QixNQUFNLFNBQVMsR0FBRyx1QkFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNsQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUM1QyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtRQUNoQyxNQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQTtRQUNoQyxNQUFNLEdBQUcsR0FBRyxFQUFDLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsRUFBQyxDQUFBO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLHVCQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQzVDLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1FBQ3JDLE1BQU0sR0FBRyxHQUFHLG9CQUFvQixDQUFBO1FBQ2hDLE1BQU0sR0FBRyxHQUFHLEVBQUMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUE7UUFDdkMsTUFBTSxTQUFTLEdBQUcsdUJBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDbEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtJQUNuRCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIn0=