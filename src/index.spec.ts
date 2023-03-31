import { it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { OverflownDomSaver } from "./";
import { nextTick } from "vue";

const disconnectFn = vi.fn();
const observeFn = vi.fn();
const takeRecordsFn = vi.fn();
const unobserveFn = vi.fn();
let callbackFn: (arg1: any) => {};

class MockIntersectionObserver implements IntersectionObserver {
  constructor(fn) {
    callbackFn = fn;
  }
  root: Document | Element | null = null;
  rootMargin: string = ``;
  thresholds: readonly number[] = [];

  disconnect = disconnectFn;
  observe = observeFn;
  takeRecords = takeRecordsFn;
  unobserve = unobserveFn;
}
window.IntersectionObserver = MockIntersectionObserver;

const nextTickPromise = () => new Promise((res) => nextTick(() => res(null)));

const InnerContent = {
  template:
    '<div style="width: 200px; height: 100px;" class="test">Content</div>',
};

it("mount", () => {
  const wrapper = mount(OverflownDomSaver, {
    slots: { default: InnerContent },
  });
  expect(wrapper.exists()).toBe(true);
});

it("render when the wrapper is intersecting", async () => {
  const wrapper = mount(OverflownDomSaver, {
    slots: { default: InnerContent },
  });
  callbackFn([{ isIntersecting: true, rootBounds: {} }]);
  await nextTickPromise();
  expect(wrapper.find(".test").exists()).toBe(true);
});

it("do not render when the wrapper is not intersecting", async () => {
  const wrapper = mount(OverflownDomSaver, {
    slots: { default: InnerContent },
  });
  callbackFn([{ isIntersecting: false, rootBounds: {} }]);
  await nextTickPromise();
  expect(wrapper.find(".test").exists()).toBe(false);
});

it("do not render when the wrapper is intersecting but root bounds is null", async () => {
  const wrapper = mount(OverflownDomSaver, {
    slots: { default: InnerContent },
  });
  callbackFn([{ isIntersecting: true, rootBounds: null }]);
  await nextTickPromise();
  expect(wrapper.find(".test").exists()).toBe(false);
});

// Pending because the current testing cannot emulate browser behaviors.
it.todo("adjust wrapper size to content size", async () => {
  const wrapper = mount(OverflownDomSaver, {
    slots: { default: InnerContent },
  });
  callbackFn([{ isIntersecting: true, rootBounds: {} }]);
  await nextTickPromise();
  expect(wrapper.find(".test").exists()).toBe(true);
  expect(wrapper.element.clientHeight).toBe(100);

  // keep size when component is not intersecting
  callbackFn([{ isIntersecting: false, rootBounds: {} }]);
  await nextTickPromise();
  expect(wrapper.find(".test").exists()).toBe(false);
  expect(wrapper.element.clientHeight).toBe(100);
});
