import axios from 'axios'

const base = import.meta.env.VITE_API_URL

function toViewModel(member) {
  return {
    id:        member.id,
    name:      member.name,
    location:  member.location,
    expertise: member.skill,
    ops:       member.opsExpertise ?? 'NEW',
    active:    member.active
  }
}

function toApiModel(member) {
  return {
    name:         member.name,
    location:     member.location,
    skill:        member.expertise,
    opsExpertise: member.ops === 'NEW' ? null : member.ops,
    active:       member.active ?? true
  }
}

export const membersApi = {
  getAll() {
    return axios.get(`${base}/members`).then(r => ({
      ...r,
      data: r.data.map(toViewModel)
    }))
  },
  create(member) {
    return axios.post(`${base}/members`, toApiModel(member)).then(r => ({
      ...r,
      data: toViewModel(r.data)
    }))
  },
  update(id, member) {
    return axios.put(`${base}/members/${id}`, toApiModel(member)).then(r => ({
      ...r,
      data: toViewModel(r.data)
    }))
  },
  remove(id) {
    return axios.delete(`${base}/members/${id}`)
  }
}