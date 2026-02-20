<script setup lang="ts">
import type { ApiEndpoint } from '../data/api-docs'

defineProps<{
  endpoint: ApiEndpoint | null
  sectionId: string
}>()

function getResponseClass(code: number): string {
  if (code >= 200 && code < 300) return 'success'
  if (code >= 400 && code < 500) return 'client-error'
  if (code >= 500) return 'server-error'
  return ''
}
</script>

<template>
  <main class="content" v-if="endpoint">
    <article class="endpoint-doc">
      <header class="endpoint-header">
        <span class="method-badge" :class="endpoint.method.toLowerCase()">{{ endpoint.method }}</span>
        <h1 class="endpoint-path">{{ endpoint.path }}</h1>
      </header>

      <h2 class="endpoint-summary">{{ endpoint.summary }}</h2>
      <p class="endpoint-description">{{ endpoint.description }}</p>

      <section v-if="endpoint.requestBodySchema?.length || endpoint.parameters?.length" class="section">
        <h3 class="section-title">Параметры запроса</h3>
        <div v-if="endpoint.requestBodySchema?.length" class="schema-block">
          <div
            v-for="field in endpoint.requestBodySchema"
            :key="field.name"
            class="schema-field"
          >
            <div class="field-row">
              <span class="field-name-wrap">
                <code class="field-name">{{ field.name }}</code>
                <span v-if="field.required" class="required">*</span>
              </span>
              <div class="field-meta">
                <span class="field-type">{{ field.type }}</span>
                <p class="field-desc">{{ field.description }}</p>
              </div>
            </div>
            <div v-if="field.nested?.length" class="schema-nested">
              <div
                v-for="n in field.nested"
                :key="n.name"
                class="schema-nested-field"
              >
                <span class="field-name-wrap"><code>{{ n.name }}</code></span>
                <div class="field-meta">
                  <span class="field-type">{{ n.type }}</span>
                  <p class="field-desc">{{ n.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="endpoint.parameters?.length" class="params-table">
          <div class="params-row params-header">
            <span>Параметр</span>
            <span>Тип</span>
            <span>Описание</span>
          </div>
          <div
            v-for="param in endpoint.parameters"
            :key="param.name"
            class="params-row"
          >
            <span>
              <code>{{ param.name }}</code>
              <span v-if="param.required" class="required">*</span>
            </span>
            <span><code>{{ param.type }}</code></span>
            <span>{{ param.description }}</span>
          </div>
        </div>
      </section>

      <section v-if="endpoint.responseSchema?.length" class="section">
        <h3 class="section-title">Параметры ответа</h3>
        <div class="schema-block">
          <div
            v-for="field in endpoint.responseSchema"
            :key="field.name"
            class="schema-field"
          >
            <div class="field-row">
              <span class="field-name-wrap">
                <code class="field-name">{{ field.name }}</code>
              </span>
              <div class="field-meta">
                <span class="field-type">{{ field.type }}</span>
                <p class="field-desc">{{ field.description }}</p>
              </div>
            </div>
            <div v-if="field.nested?.length" class="schema-nested">
              <div
                v-for="n in field.nested"
                :key="n.name"
                class="schema-nested-field"
              >
                <span class="field-name-wrap"><code>{{ n.name }}</code></span>
                <div class="field-meta">
                  <span class="field-type">{{ n.type }}</span>
                  <p class="field-desc">{{ n.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">Ответы</h3>
        <div class="responses-list">
          <div
            v-for="resp in endpoint.responses"
            :key="resp.code"
            class="response-item"
          >
            <span class="response-code" :class="getResponseClass(resp.code)">{{ resp.code }}</span>
            <span class="response-desc">{{ resp.description }}</span>
          </div>
        </div>
      </section>
    </article>
  </main>
  <main class="content content-empty" v-else>
    <p class="empty-message">Выберите метод API в меню слева</p>
  </main>
</template>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.content {
  flex: 1;
  min-width: 0;
  padding: 2rem 2.5rem;
  background: var(--content-bg);

  &-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }
}

.empty-message {
  color: var(--text-muted);
  font-size: 1.125rem;
}

.endpoint-doc {
  max-width: 720px;
}

.endpoint-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.method-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  letter-spacing: 0.02em;
  @include method-badges;
}

.endpoint-path {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  font-family: $font-mono;
  letter-spacing: -0.02em;
  word-break: break-all;
}

.endpoint-summary {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 1.5rem 0 0.5rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.endpoint-description {
  color: var(--text-secondary);
  line-height: 1.65;
  margin: 0 0 2rem;
}

.section {
  margin-bottom: 2.25rem;

  &-title {
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
}

.params-table {
  @include bordered-block;
}

.params-row {
  display: grid;
  grid-template-columns: 1fr 100px 2fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  &.params-header {
    background: var(--table-header-bg);
    font-weight: 600;
    color: var(--text-muted);
  }

  code {
    @include code-inline;
    font-size: 0.8em;
  }
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.responses-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.response-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}

.response-code {
  font-weight: 600;
  min-width: 3rem;

  &.success {
    color: #22c55e;
  }

  &.client-error {
    color: #ef4444;
  }

  &.server-error {
    color: #dc2626;
  }
}

.schema-block {
  @include bordered-block;
}

.schema-field {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }
}

.field-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 2rem;
  align-items: start;
  margin-bottom: 20px;
}

.field-name-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 6rem;

  code {
    font-weight: 600;
    @include code-inline;
    font-size: 0.9em;
  }
}

.field-meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.field-type {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.field-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.schema-nested {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--accent);
  opacity: 0.9;
}

.schema-nested-field {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 1rem;
  align-items: start;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }

  .field-name-wrap {
    min-width: 6rem;

    code {
      @include code-inline;
      font-size: 0.85em;
    }
  }

  .field-meta {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .field-type {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .field-desc {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }
}
</style>
