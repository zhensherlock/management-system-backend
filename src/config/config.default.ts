import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1684229751344_9182',
  koa: {
    port: 7001,
    globalPrefix: '/v1',
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        timezone: '+08:00',
        database: 'smart_security',
        charset: 'utf8mb4',
        synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: false,
        entities: ['**/entity/*.entity{.ts,.js}'],
      },
    },
    defaultDataSourceName: 'default',
  },
  redis: {
    client: {
      db: 0,
    },
    globalConfig: {
      Prefix: 'ss:',
    },
  },
  jwt: {
    secret: '123456789', // fs.readFileSync('xxxxx.key')
    refreshToken: {
      secret: '987654321',
      expiresIn: '5d',
    },
    expiresIn: '1m', // https://github.com/vercel/ms
  },
  midwayLogger: {
    default: {
      maxSize: '200m',
      maxFiles: '31d',
      dir: './logs/',
    },
    clients: {
      coreLogger: {
        level: 'warn',
        consoleLevel: 'warn',
      },
      appLogger: {
        level: 'info',
        consoleLevel: 'info',
      },
    },
  },
  swagger: {
    tags: [
      {
        name: 'tenant',
        description: 'Tenant API Document',
      },
      {
        name: 'system_config',
        description: 'System Config API Document',
      },
      {
        name: 'admin',
        description: 'Admin API Document',
      },
      {
        name: 'module',
        description: 'Module API Document',
      },
      {
        name: 'operation',
        description: 'Operation API Document',
      },
      {
        name: 'role',
        description: 'Role API Document',
      },
      {
        name: 'organization',
        description: 'Organization API Document',
      },
      {
        name: 'employee',
        description: 'Employee API Document',
      },
      {
        name: 'device',
        description: 'Device API Document',
      },
    ],
  },
  i18n: {
    writeCookie: true,
    defaultLocale: 'zh_CN',
    localeTable: {
      en_US: {
        // default: require('../../locales/en_US'),
        // module: require('../../locales/en-US/module'),
        // user: require('../../locales/en-US/user'),
        // employee: require('../../locales/en-US/employee'),
        tenant: require('../locales/en-US/tenant'),
      },
      zh_CN: {
        // default: require('../../locales/zh_CN'),
        // user: require('../../locales/zh-CN/user'),
        // employee: require('../../locales/zh-CN/employee'),
        admin: require('../locales/zh-CN/admin'),
        module: require('../locales/zh-CN/module'),
        operation: require('../locales/zh-CN/operation'),
        role: require('../locales/zh-CN/role'),
        tenant: require('../locales/zh-CN/tenant'),
        organization: require('../locales/zh-CN/organization'),
        employee: require('../locales/zh-CN/employee'),
        device: require('../locales/zh-CN/device'),
        system: require('../locales/zh-CN/system'),
        global: require('../locales/zh-CN/global'),
        validation: require('../locales/zh-CN/validation'),
      },
    },
  },
} as MidwayConfig;
