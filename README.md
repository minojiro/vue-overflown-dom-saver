# vue-overflown-dom-saver

## Usage

Components that suppress rendering of the DOM outside the viewport to save DOM size throughout the application.

### Sample Code

Vue3:

```vue
<script setup lang="ts">
import { OverflownDomSaver } from "vue-overflown-dom-saver";
</script>

<template>
  <div>
    <h1>Large DOM size view</h1>
    <ul>
      <li v-for="(_, i) in Array(1000)" :key="i">
        <OverflownDomSaver>
          <p>{{ i }}</p>
        </OverflownDomSaver>
      </li>
    </ul>
  </div>
</template>
```

## Contribute

Contributions are welcome. Feel free to send a PR.

```
# development
pnpm i
pnpm dev
```
