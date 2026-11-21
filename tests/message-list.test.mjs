import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function load(name, dependencies = {}) {
  const source = readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    fileName: name + '.tsx',
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(
    (id) => dependencies[id] ?? require(id), module, module.exports,
  );
  return module.exports;
}

function children(node) {
  if (Array.isArray(node)) return node.flatMap(children);
  if (typeof node !== 'object' || node === null) return [];
  return [node, ...children(node.props?.children)];
}

const message = {
  id: 'message',
  type: 'MESSAGE',
  senderId: 'recipient',
  content: 'https://example.test',
  createdAt: '2026-11-21T15:00:00Z',
  attachments: [],
};

const conversation = {
  type: 'GROUP',
  members: [{ userId: 'recipient', username: 'Alicia' }],
};

const { MessageBubble } = load('components/message-bubble', {
  './conversation-event-message': { ConversationEventMessage: 'ConversationEventMessage' },
  './location-content': { LocationContent: 'LocationContent' },
  '@components/attachments/message-attachment': { MessageAttachment: 'MessageAttachment' },
});

test('the inspected user supplies alignment and receipts, and a group entry shows the sender', () => {
  const tree = MessageBubble({
    currentUserId: 'recipient',
    conversation,
    message: { ...message, deliveries: [{ userId: 'other', status: 'READ' }] },
    selected: false,
  });
  assert.match(tree.props.className, /justify-end/);
  const elements = children(tree);
  assert.ok(elements.some((element) => element.props.children === 'Alicia'));
  const receipt = elements.find((element) => element.type?.name === 'MessageDelivery');
  assert.equal(receipt.type(receipt.props).props['aria-label'], 'Leído');

  const incoming = MessageBubble({ currentUserId: 'other', message, selected: false });
  assert.match(incoming.props.className, /justify-start/);
  assert.ok(!children(incoming).some((element) => element.type?.name === 'MessageDelivery'));
});

test('opening an HTTP link is independent of selecting its message', () => {
  let selected = 0;
  let stopped = 0;
  const tree = MessageBubble({
    currentUserId: 'other',
    message,
    selected: false,
    onSelect: () => selected++,
  });
  const link = children(tree).find((element) => element.type === 'a');
  assert.equal(link.props.href, message.content);
  assert.equal(link.props.target, '_blank');
  link.props.onClick({ stopPropagation: () => stopped++ });
  assert.equal(stopped, 1);
  assert.equal(selected, 0);
  tree.props.onClick();
  assert.equal(selected, 1);
});

test('shared locations and call events use their chat renderers', () => {
  const location = { latitude: 4, longitude: -74, capturedAt: 10 };
  const map = MessageBubble({ currentUserId: 'recipient', message: { ...message, location } });
  assert.equal(children(map).find((element) => element.type === 'LocationContent').props.location, location);

  const call = { id: 'call', type: 'CALL_ACCEPTED', metadata: { callerId: 'recipient' } };
  const event = MessageBubble({ currentUserId: 'recipient', message: call, conversation });
  assert.equal(event.type, 'ConversationEventMessage');
  assert.equal(event.props.isOwn, true);
  assert.equal(event.props.members, conversation.members);
});

test('history reverses server pages and prepends them with the same cursor', async () => {
  const requests = [];
  const metadata = [];
  const refs = [];
  const layoutEffects = [];
  let items = [];
  let stateIndex = 0;
  let refIndex = 0;
  let pagination;
  let requestOlder;
  const { MessageList } = load('components/message-list', {
    react: {
      useCallback: (callback) => callback,
      useLayoutEffect: (callback) => layoutEffects.push(callback),
      useRef: (value) => refs[refIndex++] ??= { current: value },
      useState: () => [stateIndex++ === 0 ? metadata.at(-1) : undefined, (value) => metadata.push(value)],
    },
    '@components/message-bubble': { MessageBubble: 'MessageBubble' },
    '@hooks/use-cursor-pagination': {
      useCursorPagination: (options) => {
        pagination = options;
        return { items, isLoading: false, hasMore: true, loadMore() {} };
      },
    },
    '@hooks/use-infinite-scroll': {
      useInfiniteScrollSentinel: ({ onIntersect }) => {
        requestOlder = onIntersect;
        return { current: null };
      },
    },
    '@services/user-service': {
      userService: {
        listConversationMessages: async ({ cursor, ...query }) => {
          requests.push({ cursor, ...query });
          return cursor
            ? { page: [{ id: 'oldest' }], nextCursor: null }
            : { page: [{ id: 'latest' }, { id: 'earlier' }], nextCursor: 'cursor', conversation };
        },
      },
    },
  });
  function render() {
    refIndex = 0;
    stateIndex = 0;
    layoutEffects.length = 0;
    return MessageList({ userId: 'viewer', conversationId: 'conversation' });
  }

  render();
  const first = await pagination.fetchPage(null);
  items = first.page;
  render();
  const viewport = { scrollHeight: 1200, scrollTop: 0 };
  refs[0].current = viewport;
  layoutEffects[0]();
  assert.equal(viewport.scrollTop, 1200);

  viewport.scrollTop = 20;
  requestOlder();
  const second = await pagination.fetchPage(first.nextCursor);
  items = [...second.page, ...first.page];
  viewport.scrollHeight = 1600;
  const tree = render();
  layoutEffects[0]();
  assert.equal(viewport.scrollTop, 420);
  assert.deepEqual(
    children(tree).filter(({ type }) => type === 'MessageBubble').map(({ props }) => props.message.id),
    ['oldest', 'earlier', 'latest'],
  );
  assert.equal(pagination.reverse, true);
  assert.deepEqual(first.page.map(({ id }) => id), ['earlier', 'latest']);
  assert.deepEqual(second.page.map(({ id }) => id), ['oldest']);
  assert.deepEqual(metadata, [conversation]);
  assert.deepEqual(requests.map(({ cursor }) => cursor), [null, 'cursor']);
});
