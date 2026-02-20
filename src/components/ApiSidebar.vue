<script setup lang="ts">
import { ref, computed } from 'vue'
import { apiSections } from '../data/api-docs'
import type { ApiSection } from '../data/api-docs'

defineProps<{
  activeEndpointId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const searchQuery = ref('')

function matchesSearch(endpoint: { path: string; summary: string; description: string }, q: string): boolean {
  if (!q.trim()) return true
  const lower = q.trim().toLowerCase()
  return (
    endpoint.path.toLowerCase().includes(lower) ||
    endpoint.summary.toLowerCase().includes(lower) ||
    endpoint.description.toLowerCase().includes(lower)
  )
}

const filteredSections = computed((): ApiSection[] => {
  const q = searchQuery.value
  if (!q.trim()) return apiSections
  return apiSections
    .map(section => ({
      ...section,
      endpoints: section.endpoints.filter(e => matchesSearch(e, q))
    }))
    .filter(s => s.endpoints.length > 0)
})
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-search">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Поиск по методам"
        class="search-input"
      />
    </div>
    <nav class="sidebar-nav">
      <div v-for="section in filteredSections" :key="section.id" class="nav-section">
        <div class="nav-section-title">{{ section.title }}</div>
        <button
          v-for="endpoint in section.endpoints"
          :key="endpoint.id"
          type="button"
          :class="['nav-link', { active: activeEndpointId === `${section.id}_${endpoint.id}` }]"
          @click="emit('select', `${section.id}_${endpoint.id}`)"
        >
          <span class="method" :class="endpoint.method.toLowerCase()">{{ endpoint.method }}</span>
          <div class="nav-link-text">
            <span class="summary">{{ endpoint.summary }}</span>
            <span class="path">{{ endpoint.path }}</span>
          </div>
        </button>
      </div>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.sidebar {
  width: $sidebar-width;
  min-width: $sidebar-width;
  flex-shrink: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  overflow: hidden;

  &-search {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  &-nav {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 1rem 1.25rem;
  }
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--content-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    border-color: var(--accent);
  }
}

.nav-section {
  margin-bottom: 1.75rem;

  &-title {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    padding: 0 1.25rem;
    margin-bottom: 0.6rem;
  }
}

.nav-link {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 1.25rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;

  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }

  &.active {
    background: var(--active-bg);
    color: var(--accent);
  }
}

.method {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.45rem;
  border-radius: 5px;
  flex-shrink: 0;
  letter-spacing: 0.02em;
  @include method-badges;
}

.nav-link-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  .summary {
    font-size: 0.95rem;
    font-weight: 600;
    color: inherit;
    line-height: 1.3;
  }

  .path {
    font-size: 0.75rem;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
