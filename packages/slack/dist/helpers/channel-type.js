"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrivateChannel = exports.channelType = void 0;
const channelType = (str) => {
    switch (str.substring(0, 1)) {
        case 'C': return 'channel';
        case 'G': return 'group';
        case 'D': return 'direct';
        default: return null;
    }
};
exports.channelType = channelType;
const isPrivateChannel = (id) => id.length && id[0].toLowerCase() === 'd';
exports.isPrivateChannel = isPrivateChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC10eXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hlbHBlcnMvY2hhbm5lbC10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFPLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFrQyxFQUFFO0lBQ2pFLFFBQVEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDM0IsS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQTtRQUMxQixLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sT0FBTyxDQUFBO1FBQ3hCLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUE7UUFDekIsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUE7S0FDckI7QUFDSCxDQUFDLENBQUE7QUFQWSxRQUFBLFdBQVcsZUFPdkI7QUFFTSxNQUFNLGdCQUFnQixHQUFHLENBQUMsRUFBVSxFQUFXLEVBQUUsQ0FDdEQsRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxDQUFBO0FBRDdCLFFBQUEsZ0JBQWdCLG9CQUNhIn0=