<script setup lang="ts">
import { ref, computed } from 'vue'
import ApiSidebar from './components/ApiSidebar.vue'
import ApiContent from './components/ApiContent.vue'
import ApiExamples from './components/ApiExamples.vue'
import { apiSections } from './data/api-docs'

const activeEndpointId = ref<string | null>(null)

const currentEndpoint = computed(() => {
  if (!activeEndpointId.value) return null
  const [sectionId, ...rest] = activeEndpointId.value.split('_')
  const endpointId = rest.join('_')
  const section = apiSections.find(s => s.id === sectionId)
  const endpoint = section?.endpoints.find(e => e.id === endpointId)
  return endpoint ?? null
})

const currentSectionId = computed(() => {
  if (!activeEndpointId.value) return ''
  return activeEndpointId.value.split('_')[0] ?? ''
})

function selectEndpoint(id: string) {
  activeEndpointId.value = id
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="logo">API Документация</h1>
    </header>
    <div class="app-body">
      <ApiSidebar :active-endpoint-id="activeEndpointId" @select="selectEndpoint" />
      <div class="app-main">
        <ApiContent :endpoint="currentEndpoint" :section-id="currentSectionId" />
        <ApiExamples :endpoint="currentEndpoint" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &-header {
    height: 64px;
    background: var(--header-bg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    padding: 0 2rem;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }

  &-body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  &-main {
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow-y: auto;
  }
}

.logo {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
</style>
