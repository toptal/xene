import Bot from '../../lib/bot'

export default class Testbot extends Bot<any, any> {

  async getUser() {
    return { id: 'user' }
  }

  formatMessage(message: any, object: any): any {
    return message
  }

  async sendMessage(chat: string, message: any) {
    // send message
  }
}
