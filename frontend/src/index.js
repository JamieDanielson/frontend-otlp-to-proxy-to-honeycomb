import { context, trace } from '@opentelemetry/api';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  WebTracerProvider,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-web';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'frontend-app',
    is_sending_to_proxy: 'oh yeah!',
  }),
});

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new OTLPTraceExporter({
      // instead of sending directly to honeycomb with key in the open
      // url: "https://api.honeycomb.io/v1/traces",
      // headers: {
      //   "x-honeycomb-team": "secretkey",
      // },
      // send to backend proxy, which then sends to honeycomb
      url: 'http://localhost:3000/v1/traces',
    }),
  ),
);
provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: ['http://localhost:3000'],
      clearTimingResources: true,
    }),
  ],
});

const webTracerWithZone = provider.getTracer('example-tracer-web');

const getData = (url) =>
  fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

// example of keeping track of context between async operations
const prepareClickEvent = () => {
  const url = 'http://localhost:3000';

  const element = document.getElementById('button1');

  const onClick = () => {
    const singleSpan = webTracerWithZone.startSpan('files-series-info');
    // todo replace with startactivespan
    context.with(trace.setSpan(context.active(), singleSpan), () => {
      getData(url).then((_data) => {
        trace.getActiveSpan().addEvent('fetching-single-span-completed');
        singleSpan.end();
      });
    });
  };
  element.addEventListener('click', onClick);
};

window.addEventListener('load', prepareClickEvent);
