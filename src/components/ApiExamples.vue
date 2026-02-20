<script setup lang="ts">
import type { ApiEndpoint } from '../data/api-docs'

defineProps<{
  endpoint: ApiEndpoint | null
}>()
</script>

<template>
  <aside class="examples" v-if="endpoint">
    <div class="examples-sticky">
      <section class="example-block">
        <h3 class="example-title">Примеры запроса</h3>
        <div class="code-block">
          <pre v-if="endpoint.requestExample"><code>{{ endpoint.requestExample }}</code></pre>
          <p v-else class="no-example">Тело запроса не требуется</p>
        </div>
      </section>
      <section class="example-block">
        <h3 class="example-title">Примеры ответа</h3>
        <div class="code-block">
          <pre><code>{{ endpoint.responseExample }}</code></pre>
        </div>
      </section>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.examples {
  width: $sidebar-width;
  min-width: $sidebar-width;
  flex-shrink: 0;
  background: var(--examples-bg);
  border-left: 1px solid var(--border-color);

  &-sticky {
    padding: 2rem 1.5rem;
  }
}

.example-block {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  .example-title {
    font-size: 0.85rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
}

.code-block {
  @include bordered-block;
  background: var(--code-block-bg);

  pre {
    margin: 0;
    padding: 1.25rem 1.5rem;
    overflow-x: auto;
    font-size: 0.8rem;
    line-height: 1.6;
  }

  code {
    font-family: $font-mono;
    color: var(--code-color);
    white-space: pre;
  }
}

.no-example {
  margin: 0;
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}
</style>
