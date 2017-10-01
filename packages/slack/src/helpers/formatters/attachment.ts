import { Attachment } from '../../types'
import * as buttonFormat from './button'
import * as menuFormat from './menu'

export const toSlack = ({ buttons, menus, ...rest }: Attachment) => {
  const slackButtons: any = (buttons || []).map(buttonFormat.toSlack)
  const slackMenus: any = (menus || []).map(menuFormat.toSlack)
  return { actions: slackButtons.concat(slackMenus), text: '', ...rest }
}

export const fromSlack = ({ actions, ...rest }): Attachment => ({
  buttons: (actions || []).filter(a => a.type === 'button').map(buttonFormat.fromSlack),
  menus: (actions || []).filter(a => a.type === 'menu').map(menuFormat.fromSlack),
  ...rest
})
