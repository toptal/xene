import { Context } from 'koa'
import { Handler } from './types'
import * as streamBody from 'raw-body'
import * as qs from 'querystring'

export default async (handler: Handler, ctx: Context, next) => {
  if (ctx.method.toLowerCase() !== 'post') return
  // ctx.request['body'] hack is to get parsed body
  // if any body parser middleware is already used in code
  // tslint:disable
  const payload = ctx.request['body'] && ctx.request['body'].payload
    ? ctx.request['body'].payload
    : await streamBody(ctx.req, { encoding: true })
      .then(qs.parse).then(i => JSON.parse(i.payload))

  console.log(payload)
}

// PAYLOAD
// {
//   actions: [{ name: 'Claim call', type: 'button', value: 'claim-queue' }],
//   callback_id: 'a961eda2-e254-42ec-98d8-7503c51c3568',
//   team: { id: 'T1H382SAD', domain: 'toptal-test' },
//   channel: { id: 'C4Q5QM953', name: 'matcher-finance' },
//   user: { id: 'U1H382SD7', name: 'dempfi' },
//   action_ts: '1498057878.966068',
//   message_ts: '1498042082.523792',
//   attachment_id: '1',
//   token: '8lEihNRC8BMuc99D1llU3Q96',
//   is_app_unfurl: false,
//   original_message:
//   {
//     type: 'message',
//     user: 'U4GDS4SLA',
//     text: '',
//     bot_id: 'B4FP8JL5P',
//     attachments: [[Object]],
//     ts: '1498042082.523792'
//   },
//   response_url: 'https://hooks.slack.com/actions/T1H382SAD/202141728695/SwXtFihHhy2nhFIWzYBKq4i7'
// }
