"use strict";
const _ = require('lodash');
const format_string_1 = require('./format-string');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (obj, options) => {
    const predicate = formatAttachment.bind(null, options);
    const partial = _.isString(obj) ? fromString(obj) : fromObject(obj);
    return {
        attachments: partial.attachments.map(predicate),
        text: format_string_1.default(partial.text, options)
    };
};
function fromString(str) {
    return { text: str, attachments: [] };
}
function fromObject(partial) {
    let { attachment, attachments } = partial;
    if (attachment)
        attachments = [attachment];
    return {
        attachments: attachments || [],
        text: partial.text
    };
}
function formatAttachment(options, attachment) {
    const title = format_string_1.default(attachment.title || '', options);
    const buttons = (attachment.buttons || []).map(formatButton);
    return { title, buttons };
}
function formatButton(button) {
    if (_.isNumber(button))
        button = button.toString();
    if (_.isString(button))
        return {
            label: button,
            value: button,
            type: 'default'
        };
    return {
        label: button.label,
        value: button.value || button.label,
        type: button.type || 'default',
        confirm: button.confirm
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LW1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9mb3JtYXQtbWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBWSxDQUFDLFdBQU0sUUFDbkIsQ0FBQyxDQUQwQjtBQUMzQixnQ0FBeUIsaUJBQ3pCLENBQUMsQ0FEeUM7QUFVMUM7a0JBQWUsQ0FBQyxHQUE0QixFQUFFLE9BQVk7SUFDeEQsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN0RCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbkUsTUFBTSxDQUFDO1FBQ0wsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFhLFNBQVMsQ0FBQztRQUMzRCxJQUFJLEVBQUUsdUJBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztLQUMxQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsb0JBQXFCLEdBQVc7SUFDOUIsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUE7QUFDdkMsQ0FBQztBQUVELG9CQUFxQixPQUF1QjtJQUMxQyxJQUFJLEVBQUMsVUFBVSxFQUFFLFdBQVcsRUFBQyxHQUFHLE9BQU8sQ0FBQTtJQUN2QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFBQyxXQUFXLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUMxQyxNQUFNLENBQUM7UUFDTCxXQUFXLEVBQUUsV0FBVyxJQUFJLEVBQUU7UUFDOUIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO0tBQ25CLENBQUE7QUFDSCxDQUFDO0FBRUQsMEJBQTJCLE9BQVksRUFBRSxVQUE2QjtJQUNwRSxNQUFNLEtBQUssR0FBRyx1QkFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQzNELE1BQU0sT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDNUQsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFBO0FBQzNCLENBQUM7QUFFRCxzQkFBdUIsTUFBOEI7SUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7SUFFbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQztZQUM3QixLQUFLLEVBQUUsTUFBTTtZQUNiLEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQTtJQUVELE1BQU0sQ0FBQztRQUNMLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztRQUNuQixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSztRQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksSUFBSSxTQUFTO1FBQzlCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztLQUN4QixDQUFBO0FBQ0gsQ0FBQyJ9