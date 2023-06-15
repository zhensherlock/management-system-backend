const process = require('process');
const { NodeSDK, node, resources } = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

// Midway 启动文件
const { Bootstrap } = require('@midwayjs/bootstrap');

// https://www.npmjs.com/package/@opentelemetry/exporter-jaeger
const tracerAgentHost = process.env['TRACER_AGENT_HOST'] || '127.0.0.1';
const jaegerExporter = new JaegerExporter({
  host: tracerAgentHost,
});

// 初始化一个 open-telemetry 的 SDK
const sdk = new NodeSDK({
  // 设置追踪服务名
  resource: new resources.Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-app',
  }),
  // 配置当前的导出方式，比如这里配置了一个输出到控制台的，也可以配置其他的 Exporter，比如 Jaeger
  traceExporter: new node.ConsoleSpanExporter(),
  // 配置当前导出为 jaeger
  // traceExporter: jaegerExporter,

  // 这里配置了默认自带的一些监控模块，比如 http 模块等
  // 若初始化时间很长，可注销此行，单独配置需要的 instrumentation 条目
  instrumentations: [getNodeAutoInstrumentations()],
});

// 初始化 SDK，成功启动之后，再启动 Midway 框架
sdk.start();

// 在进程关闭时，同时关闭数据采集
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch(error => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

Bootstrap.configure(/**/).run();
