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
  render() {
    const children: VNode[] = [];
    if (this.shown) {
      const content = this.$slots.default()[0];
      children.push(h(DIV, { ref: this.inner }, h(content)));
    }
    return [h(DIV, { style: this.outerStyle, ref: this.outer }, children)];
  },
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
  setup(props) {
    const shown = ref(false);
    const outer = ref<Element>();
    const inner = ref<Element>();
    const lastInnerSize = ref<[number, number]>([
      props.initialHeight,
      props.initialWidth,
    ]);
    const outerStyle = computed(() => ({
      minHeight: shown ? 0 : `${lastInnerSize[0].value}px`,
      minWidth: shown ? 0 : `${lastInnerSize[1].value}px`,
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
    return {
      inner,
      outer,
      outerStyle,
      shown,
    };
  },
});
