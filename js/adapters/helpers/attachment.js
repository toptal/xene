"use strict";
const _ = require('lodash');
const ATCHMNT_COLOR = '#3aa3e3';
function formatButtons(button) {
    const name = button.label;
    const value = button.value;
    const style = button.type;
    const confirm = button.confirm;
    const text = name;
    return { type: 'button', text, value, name, style, confirm };
}
function formatAttachment(attachment) {
    const title = attachment.title || '';
    return {
        title: attachment.title,
        fallback: attachment.title,
        callback_id: attachment.callbackId,
        color: ATCHMNT_COLOR,
        actions: attachment.buttons.map(formatButtons)
    };
}
function format(attachments) {
    return attachments.map(formatAttachment);
}
exports.format = format;
function replaceAttachment(selected, attachment) {
    const selectedReplacer = ':white_check_mark: ' + selected.name;
    if (_.find(attachment.actions, ['value', selected.value])) {
        const title = attachment.title;
        delete attachment.actions;
        attachment.title = title ? (title + '\n' + selectedReplacer) : selectedReplacer;
    }
    return attachment;
}
function parse(payload) {
    const selected = payload.actions[0];
    const original = payload.original_message;
    return {
        parsed: {
            message: selected.value.toLowerCase(),
            channel: payload.channel.id,
            user: payload.user.id,
            isAction: true
        },
        replaced: {
            text: original.text,
            attachments: original.attachments.map(_.partial(replaceAttachment, selected))
        }
    };
}
exports.parse = parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0YWNobWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGFwdGVycy9oZWxwZXJzL2F0dGFjaG1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFDM0IsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFBO0FBRS9CLHVCQUF3QixNQUFNO0lBQzVCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDekIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUMxQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ3pCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7SUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ2pCLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFBO0FBQzlELENBQUM7QUFFRCwwQkFBMkIsVUFBVTtJQUNuQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQTtJQUNwQyxNQUFNLENBQUM7UUFDTCxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7UUFDdkIsUUFBUSxFQUFFLFVBQVUsQ0FBQyxLQUFLO1FBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsVUFBVTtRQUNsQyxLQUFLLEVBQUUsYUFBYTtRQUNwQixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO0tBQy9DLENBQUE7QUFDSCxDQUFDO0FBRUQsZ0JBQXdCLFdBQVc7SUFDakMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUMxQyxDQUFDO0FBRmUsY0FBTSxTQUVyQixDQUFBO0FBT0QsMkJBQTRCLFFBQVEsRUFBRSxVQUFVO0lBQzlDLE1BQU0sZ0JBQWdCLEdBQUcscUJBQXFCLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQTtJQUM5RCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUE7UUFDOUIsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFBO1FBQ3pCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLGdCQUFnQixDQUFBO0lBQ2pGLENBQUM7SUFDRCxNQUFNLENBQUMsVUFBVSxDQUFBO0FBQ25CLENBQUM7QUFFRCxlQUF1QixPQUFPO0lBQzVCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFBO0lBRXpDLE1BQU0sQ0FBQztRQUNMLE1BQU0sRUFBRTtZQUNOLE9BQU8sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUNyQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsUUFBUSxFQUFFLElBQUk7U0FDZjtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtZQUNuQixXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM5RTtLQUNGLENBQUE7QUFDSCxDQUFDO0FBaEJlLGFBQUssUUFnQnBCLENBQUEifQ==