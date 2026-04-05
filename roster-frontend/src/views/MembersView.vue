<template>
  <div class="members-view">

    <!-- Page header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Team members</h1>
        <p class="page-sub">Manage your roster pool. Eligible members are paired by ops expertise.</p>
      </div>
      <button class="btn btn-primary" @click="openAdd">
        <span>+</span> Add member
      </button>
    </div>

    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat">
        <span class="stat-num">{{ store.members.length }}</span>
        <span class="stat-label">total</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-num stat-offshore">{{ store.offshore.length }}</span>
        <span class="stat-label">offshore</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-num stat-onshore">{{ store.onshore.length }}</span>
        <span class="stat-label">onshore</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-num">{{ store.eligible.length }}</span>
        <span class="stat-label">eligible for pairing</span>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar">
      <input
        v-model="search"
        class="search-input"
        placeholder="Search by name…"
      />
      <div class="filter-group">
        <button
          v-for="f in locationFilters"
          :key="f.value"
          :class="['filter-btn', locationFilter === f.value ? 'filter-btn--active' : '']"
          @click="locationFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>
      <div class="filter-group">
        <button
          v-for="f in opsFilters"
          :key="f.value"
          :class="['filter-btn', opsFilter === f.value ? 'filter-btn--active' : '']"
          @click="opsFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="state-msg">
      <div class="spinner"></div>
      Loading members…
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="state-msg state-msg--error">
      {{ store.error }}
      <button class="btn btn-ghost" style="margin-left:12px" @click="store.fetchAll()">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0 && store.members.length === 0" class="empty-state">
      <div class="empty-icon">◎</div>
      <p class="empty-title">No members yet</p>
      <p class="empty-sub">Add your first team member to get started.</p>
      <button class="btn btn-primary" @click="openAdd">Add member</button>
    </div>

    <!-- No results -->
    <div v-else-if="filtered.length === 0" class="empty-state">
      <div class="empty-icon">⊘</div>
      <p class="empty-title">No matches</p>
      <p class="empty-sub">Try adjusting your filters.</p>
    </div>

    <!-- Grid -->
    <div v-else class="members-grid">
      <TransitionGroup name="card">
        <MemberCard
          v-for="m in filtered"
          :key="m.id"
          :member="m"
          @edit="openEdit(m)"
          @remove="confirmRemove(m)"
        />
      </TransitionGroup>
    </div>

    <!-- Confirm remove -->
    <div v-if="removingMember" class="form-overlay" @click.self="removingMember = null">
      <div class="confirm-panel">
        <p class="confirm-title">Remove <strong>{{ removingMember.name }}</strong>?</p>
        <p class="confirm-sub">They will be removed from the rotation queue.</p>
        <div class="confirm-actions">
          <button class="btn btn-ghost" @click="removingMember = null">Cancel</button>
          <button class="btn btn-danger" style="border:1px solid var(--danger)" @click="doRemove">Remove</button>
        </div>
      </div>
    </div>

    <!-- Add / Edit form -->
    <MemberForm
      v-if="showForm"
      :member="editingMember"
      @close="closeForm"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeamStore } from '../stores/team.js'
import { useToast } from '../composables/useToast.js'
import MemberCard from '../components/MemberCard.vue'
import MemberForm from '../components/MemberForm.vue'

const store = useTeamStore()
const { success, error: showError } = useToast()

// Form state
const showForm     = ref(false)
const editingMember = ref(null)
const removingMember = ref(null)

function openAdd()    { editingMember.value = null; showForm.value = true }
function openEdit(m)  { editingMember.value = m;    showForm.value = true }
function closeForm()  { showForm.value = false; editingMember.value = null }
function confirmRemove(m) { removingMember.value = m }

async function handleSave(payload) {
  try {
    if (payload.id) {
      await store.updateMember(payload.id, payload)
      success(`${payload.name} updated`)
    } else {
      await store.addMember(payload)
      success(`${payload.name} added`)
    }
    closeForm()
  } catch (e) {
    showError(e.response?.data?.message || 'Something went wrong')
  }
}

async function doRemove() {
  const m = removingMember.value
  try {
    await store.removeMember(m.id)
    success(`${m.name} removed`)
  } catch (e) {
    showError('Failed to remove member')
  } finally {
    removingMember.value = null
  }
}

const search         = ref('')
const locationFilter = ref('ALL')
const opsFilter      = ref('ALL')

const locationFilters = [
  { label: 'All locations', value: 'ALL' },
  { label: 'Offshore',      value: 'OFFSHORE' },
  { label: 'Onshore',       value: 'ONSHORE' },
]
const opsFilters = [
  { label: 'All levels', value: 'ALL' },
  { label: 'Eligible',   value: 'ELIGIBLE' },
  { label: 'New',        value: 'NEW' },
]

const filtered = computed(() => {
  return store.members.filter(m => {
    const matchSearch   = m.name.toLowerCase().includes(search.value.toLowerCase())
    const matchLocation = locationFilter.value === 'ALL' || m.location === locationFilter.value
    const matchOps =
      opsFilter.value === 'ALL'      ? true :
      opsFilter.value === 'NEW'      ? m.ops === 'NEW' :
      opsFilter.value === 'ELIGIBLE' ? m.ops !== 'NEW' : true
    return matchSearch && matchLocation && matchOps
  })
})

onMounted(() => store.fetchAll())
</script>

<style scoped>
.members-view { padding: 32px; max-width: 1100px; margin: 0 auto; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}
.page-title { font-size: 24px; font-weight: 700; color: var(--text); line-height: 1.2; }
.page-sub   { font-size: 13px; color: var(--text3); margin-top: 4px; }

.stats-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 20px;
  margin-bottom: 20px;
}
.stat { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 48px; }
.stat-num { font-size: 20px; font-weight: 700; font-family: var(--mono); color: var(--text); line-height: 1; }
.stat-offshore { color: var(--offshore); }
.stat-onshore  { color: var(--onshore); }
.stat-label { font-size: 10px; color: var(--text3); font-family: var(--mono); letter-spacing: 0.04em; }
.stat-divider { width: 1px; height: 28px; background: var(--border); }

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.search-input { width: 220px; }
.filter-group { display: flex; gap: 4px; }
.filter-btn {
  padding: 6px 14px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text3);
  font-size: 12px;
  font-family: var(--mono);
  cursor: pointer;
  transition: all 0.12s;
}
.filter-btn:hover { color: var(--text); border-color: var(--border2); }
.filter-btn--active { color: var(--accent); border-color: var(--accent); background: rgba(200,240,96,0.08); }

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

/* Card transition */
.card-enter-active { transition: all 0.2s ease; }
.card-leave-active { transition: all 0.18s ease; }
.card-enter-from   { opacity: 0; transform: translateY(8px); }
.card-leave-to     { opacity: 0; transform: scale(0.96); }
.card-move         { transition: transform 0.2s ease; }

/* Loading / error / empty */
.state-msg {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: var(--text3);
  font-size: 14px;
}
.state-msg--error { color: var(--danger); }
.spinner {
  width: 16px; height: 16px;
  border: 2px solid var(--border2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg) } }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  gap: 10px;
  color: var(--text3);
}
.empty-icon  { font-size: 36px; opacity: 0.4; margin-bottom: 8px; }
.empty-title { font-size: 16px; font-weight: 600; color: var(--text2); }
.empty-sub   { font-size: 13px; margin-bottom: 12px; }

/* Confirm dialog */
.form-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  backdrop-filter: blur(4px);
}
.confirm-panel {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: var(--radius-lg);
  padding: 28px;
  width: 360px;
  max-width: 95vw;
  animation: slide-up 0.18s ease;
}
@keyframes slide-up { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
.confirm-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
.confirm-title strong { color: var(--accent); }
.confirm-sub   { font-size: 13px; color: var(--text3); margin-bottom: 20px; }
.confirm-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>
