import { MidwayConfig } from '@midwayjs/core';
import { DefaultUploadFileMimeType, uploadWhiteList } from '@midwayjs/upload';
import { tmpdir } from 'os';
import { join } from 'path';
import * as redisStore from 'cache-manager-ioredis';

const redisGlobalConfigPrefix = 'ss';
const koaGlobalPrefix = '/v1';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '-ZfVcx5Ed048VT1D',
  app: {
    security: {
      prefix: `${koaGlobalPrefix}/api`,
      ignore: [
        `${koaGlobalPrefix}`,
        `${koaGlobalPrefix}/api/admin/passport/login`,
        `${koaGlobalPrefix}/api/admin/passport/refreshToken`,
        `${koaGlobalPrefix}/api/admin/passport/captcha`,
        `${koaGlobalPrefix}/api/user/passport/login`,
        `${koaGlobalPrefix}/api/user/passport/refreshToken`,
        `${koaGlobalPrefix}/api/user/passport/captcha`,
      ],
    },
  },
  koa: {
    port: 7001,
    globalPrefix: koaGlobalPrefix,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        timezone: '+08:00',
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: 'smart_security',
        charset: 'utf8mb4',
        synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: true,
        entities: ['**/entity/*.entity{.ts,.js}'],
      },
    },
    defaultDataSourceName: 'default',
  },
  captcha: {
    default: {
      size: 4,
      noise: 15,
      width: 120,
      height: 40,
    },
    image: {
      type: 'mixed',
    },
    formula: {},
    text: {},
    expirationTime: 600, // 单位为秒
    idPrefix: 'captcha',
  },
  cache: {
    store: redisStore,
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: 0,
      keyPrefix: `${redisGlobalConfigPrefix}:`,
      ttl: 10,
    },
  },
  redis: {
    client: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: 0,
    },
    globalConfig: {
      prefix: redisGlobalConfigPrefix,
    },
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '30mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: [...uploadWhiteList, '.xlsx', '.xls'],
    // 仅允许下面这些文件类型可以上传
    mimeTypeWhiteList: {
      ...DefaultUploadFileMimeType,
      '.xlsx':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
    },
    // tmpdir: string，上传的文件临时存储路径
    tmpdir: join(tmpdir(), 'smart-security-upload-files'),
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 5 * 60 * 1000,
    // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
    base64: false,
    // 仅在匹配路径到 /import 的时候去解析 body 中的文件信息
    match: /\/import/,
  },
  jwt: {
    secret: '123456789', // fs.readFileSync('xxxxx.key')
    refreshToken: {
      secret: '987654321',
      expiresIn: '5d',
      rememberExpiresIn: '30d',
    },
    expiresIn: '1h', // https://github.com/vercel/ms
    rememberExpiresIn: '30d',
    cacheKeyPrefix: `${redisGlobalConfigPrefix}:passport`,
  },
  midwayLogger: {
    default: {
      maxSize: '10m',
      maxFiles: '3d',
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
    auth: {
      authType: 'bearer',
    },
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
      {
        name: 'user',
        description: 'User API Document',
      },
      {
        name: 'passport',
        description: 'Passport API Document',
      },
    ],
  },
  codeDye: {
    matchQueryKey: 'codeDye',
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
        admin: require('../locales/zh-CN/admin'),
        assessment: require('../locales/zh-CN/assessment'),
        device: require('../locales/zh-CN/device'),
        employee: require('../locales/zh-CN/employee'),
        global: require('../locales/zh-CN/global'),
        module: require('../locales/zh-CN/module'),
        operation: require('../locales/zh-CN/operation'),
        organization: require('../locales/zh-CN/organization'),
        passport: require('../locales/zh-CN/passport'),
        role: require('../locales/zh-CN/role'),
        school: require('../locales/zh-CN/school'),
        system: require('../locales/zh-CN/system'),
        tenant: require('../locales/zh-CN/tenant'),
        user: require('../locales/zh-CN/user'),
        validation: require('../locales/zh-CN/validation'),
        work_order: require('../locales/zh-CN/work_order'),
      },
    },
  },
} as MidwayConfig;
