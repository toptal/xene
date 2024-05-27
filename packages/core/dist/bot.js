"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const binder_1 = require("./binder");
const dialog_1 = require("./dialog");
const channel_1 = require("./channel");
class Bot {
    constructor() {
        /** @internal */
        this._dialogHandlers = [];
        /** @internal */
        this._performerHandlers = [];
        this.when = binder_1.Binder.for(this);
        this._channels = new Map();
    }
    /** @internal */
    _channelFor(channelId) {
        const channel = this._channels.get(channelId) || new channel_1.Channel();
        this._channels.set(channelId, channel);
        return channel;
    }
    dialog(channel, users) {
        return new dialog_1.Dialog(this, channel, users);
    }
    abortDialog(channel, user) {
        this._channelFor(channel).abort(user);
    }
    onMessage(message) {
        const performer = this._performerHandlers.find(c => c.match(message));
        if (performer)
            return performer.handler(message, this);
        const channel = this._channelFor(message.channel);
        const hasActions = channel.hasFor(message.user);
        if (hasActions)
            return channel.processMessage(message);
        const dialog = this._dialogHandlers.find(c => c.match(message));
        if (dialog) {
            const obj = this.dialog(message.channel, [message.user]);
            obj._manager.perform(message);
            dialog.handler(obj, this);
        }
    }
}
exports.Bot = Bot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBaUM7QUFDakMscUNBQWlDO0FBQ2pDLHVDQUFtQztBQWFuQyxNQUFzQixHQUFHO0lBQXpCO1FBQ0UsZ0JBQWdCO1FBQ2hCLG9CQUFlLEdBQTBCLEVBQUUsQ0FBQTtRQUMzQyxnQkFBZ0I7UUFDaEIsdUJBQWtCLEdBQTZCLEVBQUUsQ0FBQTtRQUVqRCxTQUFJLEdBQUcsZUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUdmLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQTtJQW1DaEQsQ0FBQztJQTlCQyxnQkFBZ0I7SUFDaEIsV0FBVyxDQUFDLFNBQWlCO1FBQzNCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksaUJBQU8sRUFBRSxDQUFBO1FBQzlELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN0QyxPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQWUsRUFBRSxLQUFlO1FBQ3JDLE9BQU8sSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQWUsRUFBRSxJQUFZO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3ZDLENBQUM7SUFFUyxTQUFTLENBQUMsT0FBb0I7UUFDdEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNyRSxJQUFJLFNBQVM7WUFBRSxPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRXRELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2pELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9DLElBQUksVUFBVTtZQUFFLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUV0RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUMvRCxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQ3hELEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzdCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQzFCO0lBQ0gsQ0FBQztDQUNGO0FBNUNELGtCQTRDQyJ9