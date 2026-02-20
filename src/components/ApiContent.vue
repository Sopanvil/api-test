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
            <div class="schema-field-main">
              <code class="field-name">{{ field.name }}</code>
              <span v-if="field.required" class="required">*</span>
              <span class="field-type">{{ field.type }}</span>
            </div>
            <p class="field-desc">{{ field.description }}</p>
            <div v-if="field.nested?.length" class="schema-nested">
              <div
                v-for="n in field.nested"
                :key="n.name"
                class="schema-nested-field"
              >
                <code>{{ n.name }}</code>
                <span class="field-type">{{ n.type }}</span>
                <span class="field-desc-inline">— {{ n.description }}</span>
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
            <div class="schema-field-main">
              <code class="field-name">{{ field.name }}</code>
              <span class="field-type">{{ field.type }}</span>
            </div>
            <p class="field-desc">{{ field.description }}</p>
            <div v-if="field.nested?.length" class="schema-nested">
              <div
                v-for="n in field.nested"
                :key="n.name"
                class="schema-nested-field"
              >
                <code>{{ n.name }}</code>
                <span class="field-type">{{ n.type }}</span>
                <span class="field-desc-inline">— {{ n.description }}</span>
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

<style scoped>
.content {
  flex: 1;
  min-width: 0;
  padding: 2rem 2.5rem;
  overflow-y: auto;
  background: var(--content-bg);
}

.content-empty {
  display: flex;
  align-items: center;
  justify-content: center;
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
}

.method-badge.get { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.method-badge.post { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.method-badge.put { background: rgba(249, 115, 22, 0.2); color: #f97316; }
.method-badge.delete { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.method-badge.patch { background: rgba(168, 85, 247, 0.2); color: #a855f7; }

.endpoint-path {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
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
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.params-table {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.params-row {
  display: grid;
  grid-template-columns: 1fr 100px 2fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--border-color);
}

.params-row:last-child {
  border-bottom: none;
}

.params-header {
  background: var(--table-header-bg);
  font-weight: 600;
  color: var(--text-muted);
}

.params-row code {
  background: var(--code-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 5px;
  font-size: 0.8em;
  font-family: 'JetBrains Mono', monospace;
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
}

.response-code.success { color: #22c55e; }
.response-code.client-error { color: #ef4444; }
.response-code.server-error { color: #dc2626; }

.schema-block {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.schema-field {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.schema-field:last-child {
  border-bottom: none;
}

.schema-field-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.field-name {
  font-weight: 600;
  background: var(--code-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 5px;
  font-size: 0.9em;
  font-family: 'JetBrains Mono', monospace;
}

.field-type {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.field-desc {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.schema-nested {
  margin-top: 0.75rem;
  padding-left: 1rem;
  border-left: 3px solid var(--accent);
  opacity: 0.9;
}

.schema-nested-field {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.schema-nested-field:last-child {
  margin-bottom: 0;
}

.schema-nested-field code {
  background: var(--code-bg);
  padding: 0.1rem 0.3rem;
  border-radius: 5px;
  font-size: 0.85em;
  font-family: 'JetBrains Mono', monospace;
}

.field-desc-inline {
  color: var(--text-secondary);
}
</style>
