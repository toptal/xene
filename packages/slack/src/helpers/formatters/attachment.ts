import { IAttachment } from '../../api/types/message'
import * as buttonFormat from './button'
import * as menuFormat from './menu'

export function toSlack(attachment: IAttachment) {
  const { buttons, menus, ...rest } = attachment
  const slackButtons: any = (buttons || []).map(buttonFormat.toSlack)
  const slackMenus: any = (menus || []).map(menuFormat.toSlack)
  return { actions: slackButtons.concat(slackMenus), text: '', ...rest }
}

export function fromSlack(attachment): IAttachment {
  const { actions, ...rest } = attachment
  return {
    buttons: actions.filter(a => a.type === 'button').map(buttonFormat.fromSlack),
    menus: actions.filter(a => a.type === 'menu').map(menuFormat.fromSlack),
    ...rest
  }
}
