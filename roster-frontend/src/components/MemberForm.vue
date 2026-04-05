<template>
  <div class="form-overlay" @click.self="$emit('close')">
    <div class="form-panel">
      <div class="form-header">
        <h2 class="form-title">{{ isEdit ? 'Edit member' : 'Add member' }}</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="form-body">
        <div class="field">
          <label class="field-label">Name</label>
          <input
            v-model="form.name"
            placeholder="e.g. Person 7"
            :class="{ error: errors.name }"
            @input="errors.name = ''"
          />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>

        <div class="field-row">
          <div class="field">
            <label class="field-label">Location</label>
            <select v-model="form.location">
              <option value="OFFSHORE">Offshore</option>
              <option value="ONSHORE">Onshore</option>
            </select>
          </div>

          <div class="field">
            <label class="field-label">Expertise</label>
              <select v-model="form.expertise">
                <option value="DEVELOPMENT">Development</option>
                <option value="INFRA">Infra</option>
                <option value="TEST">Test</option>
              </select>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Ops level</label>
          <div class="ops-selector">
            <button
              v-for="opt in opsOptions"
              :key="opt.value"
              :class="['ops-btn', form.ops === opt.value ? 'ops-btn--active' : '']"
              type="button"
              @click="form.ops = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <p class="field-hint">5 = highest expertise · New = excluded from pairing</p>
        </div>
      </div>

      <div class="form-footer">
        <button class="btn btn-ghost" @click="$emit('close')">Cancel</button>
        <button class="btn btn-primary" :disabled="submitting" @click="submit">
          <span v-if="submitting">Saving…</span>
          <span v-else>{{ isEdit ? 'Save changes' : 'Add member' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  member: { type: Object, default: null }
})

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.member)

const form = ref({
  name:      props.member?.name      ?? '',
  location:  props.member?.location  ?? 'OFFSHORE',
  expertise: props.member?.expertise ?? 'DEVELOPMENT',
  ops:       props.member?.ops       ?? 3
})

const errors    = ref({ name: '' })
const submitting = ref(false)

const opsOptions = [
  { label: 'New', value: 'NEW' },
  { label: '1',   value: 1 },
  { label: '2',   value: 2 },
  { label: '3',   value: 3 },
  { label: '4',   value: 4 },
  { label: '5',   value: 5 },
]

function validate() {
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
    return false
  }
  return true
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  try {
    await emit('save', { ...form.value, id: props.member?.id })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  backdrop-filter: blur(4px);
}

.form-panel {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: var(--radius-lg);
  width: 440px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  animation: slide-up 0.2s ease;
}
@keyframes slide-up { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}
.form-title { font-size: 16px; font-weight: 600; color: var(--text); }
.close-btn {
  background: none; border: none; color: var(--text3);
  font-size: 14px; cursor: pointer; padding: 4px;
  transition: color 0.15s;
}
.close-btn:hover { color: var(--text); }

.form-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 18px; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; color: var(--text3); font-family: var(--mono); text-transform: uppercase; }
.field-error { font-size: 11px; color: var(--danger); }
.field-hint  { font-size: 11px; color: var(--text3); font-family: var(--mono); margin-top: 4px; }

input.error { border-color: var(--danger); }
input, select { width: 100%; }

.ops-selector { display: flex; gap: 6px; }
.ops-btn {
  flex: 1;
  padding: 8px 4px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text2);
  font-size: 13px;
  font-family: var(--mono);
  cursor: pointer;
  transition: all 0.12s;
  text-align: center;
}
.ops-btn:hover { border-color: var(--border2); color: var(--text); }
.ops-btn--active {
  background: rgba(200,240,96,0.1);
  border-color: var(--accent);
  color: var(--accent);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 20px;
  border-top: 1px solid var(--border);
}
</style>
