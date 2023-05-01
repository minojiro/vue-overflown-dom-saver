import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  VNode,
  ref,
} from "vue";

const DIV = "div";
const DEFAULT_INITIAL_SIZE = 100;

export const OverflownDomSaver = defineComponent({
  name: "OverflownDomSaver",
  props: {
    initialHeight: {
      type: Number,
      default: DEFAULT_INITIAL_SIZE,
    },
    initialWidth: {
      type: Number,
      default: DEFAULT_INITIAL_SIZE,
    },
  },
  setup(props, { slots }) {
    const shown = ref(false);
    const outer = ref<Element>();
    const inner = ref<Element>();
    const lastInnerSize = ref<[number, number]>([
      props.initialHeight,
      props.initialWidth,
    ]);
    const outerStyle = computed(() => ({
      minHeight: shown.value ? 0 : `${lastInnerSize.value[0]}px`,
      minWidth: shown.value ? 0 : `${lastInnerSize.value[1]}px`,
    }));
    const observer = new IntersectionObserver(
      ([{ isIntersecting, rootBounds }]) => {
        if (rootBounds) {
          if (inner.value) {
            lastInnerSize.value = [
              inner.value.clientHeight,
              inner.value.clientWidth,
            ];
          }
          shown.value = isIntersecting;
        }
      }
    );
    onMounted(() => observer.observe(outer.value as Element));
    onBeforeUnmount(() => observer.disconnect());

    return () => {
      const children: VNode[] = [];
      if (shown.value) {
        children.push(
          h(DIV, { ref: inner }, slots.default ? slots.default() : [])
        );
      }
      return [h(DIV, { style: outerStyle.value, ref: outer }, children)];
    };
  },
});
