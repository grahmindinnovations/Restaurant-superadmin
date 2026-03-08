const SUPER_ADMIN_AUTH_KEY = 'super_admin_authed_v1'

export function isSuperAdminAuthed() {
  return localStorage.getItem(SUPER_ADMIN_AUTH_KEY) === 'true'
}

export function setSuperAdminAuthed(value) {
  localStorage.setItem(SUPER_ADMIN_AUTH_KEY, value ? 'true' : 'false')
}

