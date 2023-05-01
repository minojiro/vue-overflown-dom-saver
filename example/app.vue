<script setup lang="ts">
import { OverflownDomSaver } from "vue-overflown-dom-saver";
</script>

<template>
  <div>
    <h1>OverflownDomSaver example</h1>
    <ul>
      <li v-for="(_, i) in Array(100)" :key="i">
        <OverflownDomSaver>
          <ListItem :itemNumber="i" />
        </OverflownDomSaver>
      </li>
    </ul>
  </div>
</template>
