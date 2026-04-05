import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { membersApi } from '../api/members.js'

export const useTeamStore = defineStore('team', () => {
  const members  = ref([])
  const loading  = ref(false)
  const error    = ref(null)

  // Derived
  const offshore = computed(() => members.value.filter(m => m.location === 'OFFSHORE'))
  const onshore  = computed(() => members.value.filter(m => m.location === 'ONSHORE'))
  const eligible = computed(() => members.value.filter(m => m.ops !== 'NEW'))

  async function fetchAll() {
    loading.value = true
    error.value   = null
    try {
      const { data } = await membersApi.getAll()
      members.value = data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to load members'
    } finally {
      loading.value = false
    }
  }

  async function addMember(payload) {
    const { data } = await membersApi.create(payload)
    members.value.push(data)
    return data
  }

  async function updateMember(id, payload) {
    const { data } = await membersApi.update(id, payload)
    const idx = members.value.findIndex(m => m.id === id)
    if (idx !== -1) members.value[idx] = data
    return data
  }

  async function removeMember(id) {
    await membersApi.remove(id)
    members.value = members.value.filter(m => m.id !== id)
  }

  return { members, loading, error, offshore, onshore, eligible, fetchAll, addMember, updateMember, removeMember }
})
