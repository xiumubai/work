import store from '@/store'

export default function hasActions (actionName) {
  const permissions = store.getters.permissions
  const flag = permissions.some(p => {
    if (p.name && p.name === actionName) {
      return true
    }
  })
  return flag
}
