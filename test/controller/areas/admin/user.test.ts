import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/areas/admin/user.test.ts', () => {

  it('should POST /api/admin/user/create', async () => {
    // create app
    const app = await createApp<Framework>();

    for (let i = 55425; i < 100000; i++) {
      const result = await createHttpRequest(app).post('/v1/api/admin/user/create').set({
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzcG9ydElkIjoiMjhhZTUyOGMyZDBkNDE3OTllMTg2YWY3ZWM3YTRlMzIiLCJwYXNzcG9ydFR5cGUiOiJhZG1pbiIsImlhdCI6MTY4NzgzMzYwOCwiZXhwIjoxNjg3ODM3MjA4fQ.eC8SrqwZpa60Jxmrt0sVWZTlXR7Db5clcgRuqEseSKg',
        'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzcG9ydElkIjoiMjhhZTUyOGMyZDBkNDE3OTllMTg2YWY3ZWM3YTRlMzIiLCJwYXNzcG9ydFR5cGUiOiJhZG1pbiIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjg3ODMzNjA4LCJleHAiOjE2ODgyNjU2MDh9.zimTipMAJ7_6FPI6vy2ND4Dzn_GSrZGy34MsDTm34QQ'
      }).send({
        'name': 'blxx-user' + i,
        'password': '1qaz!QAZ',
        'tenantId': 'a3a1e223f275466ea24fc63dc236895b',
        'type': '1',
        'organizationIds': ['8f195413e0224f58ac4f47ac24d246df'],
        'roleIds': ['74c9280bb683416e957d6d6186b0ed8f']
      });
      console.log(result.text)
    }


    // make request
    // const result = await createHttpRequest(app).put('/v1/api/admin/user').set({
    //   'authorization': '123',
    //   'refreshToken': ''
    // });

    // use expect by jest
    // expect(result.status).toBe(200);
    // expect(result.text).toBe('Hello Midwayjs!');

    // close app
    await close(app);
  }, 36000000);

});
