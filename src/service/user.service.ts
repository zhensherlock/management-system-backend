import { Provide } from '@midwayjs/core';

@Provide()
export class UserService {
  async getUser() {
    return {
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
