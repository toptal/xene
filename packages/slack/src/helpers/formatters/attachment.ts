import { Attachment } from '../../types'
import * as buttonFormat from './button'
import * as menuFormat from './menu'

export function toSlack(attachment: Attachment) {
  const { buttons, menus, ...rest } = attachment
  const slackButtons: any = (buttons || []).map(buttonFormat.toSlack)
  const slackMenus: any = (menus || []).map(menuFormat.toSlack)
  return { actions: slackButtons.concat(slackMenus), text: '', ...rest }
}

export function fromSlack(attachment): Attachment {
  const { actions, ...rest } = attachment
  return {
    buttons: actions.filter(a => a.type === 'button').map(buttonFormat.fromSlack),
    menus: actions.filter(a => a.type === 'menu').map(menuFormat.fromSlack),
    ...rest
  }
}
