<template>
  <div :class="['member-card', `member-card--${member.location.toLowerCase()}`]">
    <div class="card-header">
      <div class="avatar">{{ initials }}</div>
      <div class="card-meta">
        <div class="card-name">{{ member.name }}</div>
        <div class="card-sub">{{ member.expertise }}</div>
      </div>
      <span :class="['loc-badge', `loc-badge--${member.location.toLowerCase()}`]">
        {{ member.location }}
      </span>
    </div>

    <div class="card-body">
      <div class="ops-row">
        <span class="ops-label">Ops level</span>
        <template v-if="member.ops === 'NEW'">
          <span class="ops-new">NEW</span>
        </template>
        <template v-else>
          <div class="ops-pips">
            <span
              v-for="n in 5"
              :key="n"
              :class="['pip', n <= member.ops ? 'pip--on' : 'pip--off']"
            ></span>
          </div>
          <span class="ops-num">{{ member.ops }}/5</span>
        </template>
      </div>
    </div>

    <div class="card-actions">
      <button class="btn btn-ghost btn-sm" @click="$emit('edit', member)">Edit</button>
      <button class="btn btn-danger btn-sm" @click="$emit('remove', member.id)">Remove</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  member: { type: Object, required: true }
})

defineEmits(['edit', 'remove'])

const initials = computed(() =>
  props.member.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)
</script>

<style scoped>
.member-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.15s, transform 0.15s;
}
.member-card:hover { border-color: var(--border2); transform: translateY(-1px); }
.member-card--offshore { border-left: 3px solid var(--offshore); }
.member-card--onshore  { border-left: 3px solid var(--onshore); }

.card-header { display: flex; align-items: center; gap: 12px; }

.avatar {
  width: 38px; height: 38px;
  border-radius: 8px;
  background: var(--bg3);
  border: 1px solid var(--border2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--mono);
  color: var(--text2);
  flex-shrink: 0;
}

.card-meta { flex: 1; min-width: 0; }
.card-name { font-size: 14px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-sub  { font-size: 11px; color: var(--text3); font-family: var(--mono); margin-top: 2px; }

.loc-badge {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  font-family: var(--mono);
}
.loc-badge--offshore { background: rgba(91,140,247,0.12); color: var(--offshore); }
.loc-badge--onshore  { background: rgba(247,162,91,0.12); color: var(--onshore); }

.card-body { border-top: 1px solid var(--border); padding-top: 12px; }

.ops-row { display: flex; align-items: center; gap: 10px; }
.ops-label { font-size: 11px; color: var(--text3); font-family: var(--mono); flex: 1; }
.ops-pips { display: flex; gap: 4px; }
.pip {
  width: 10px; height: 10px;
  border-radius: 2px;
  transition: background 0.1s;
}
.pip--on  { background: var(--accent); }
.pip--off { background: var(--border2); }
.ops-num { font-size: 11px; font-family: var(--mono); color: var(--text3); min-width: 24px; text-align: right; }
.ops-new {
  font-size: 10px; font-weight: 600; font-family: var(--mono);
  letter-spacing: 0.06em;
  color: var(--new-badge);
  background: rgba(167,139,250,0.12);
  padding: 2px 8px;
  border-radius: 4px;
}

.card-actions { display: flex; gap: 8px; justify-content: flex-end; }
.btn-sm { padding: 5px 12px; font-size: 12px; }
</style>
