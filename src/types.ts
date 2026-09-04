export type Role =
  | 'director'
  | 'uchebny_head'
  | 'vospitatelny_head'
  | 'curator'
  | 'teamlead'
  | 'it_admin'
  | 'student'

export interface RoleMeta {
  label: string
  color: string
  colorLight: string
  dashboardPath: string
}

export const ROLES: Record<Role, RoleMeta> = {
  director: { label: 'Директор', color: '#534AB7', colorLight: '#EEEDFE', dashboardPath: '/director' },
  uchebny_head: { label: 'Руководитель учебного отдела', color: '#185FA5', colorLight: '#E6F1FB', dashboardPath: '/uchebny' },
  vospitatelny_head: { label: 'Руководитель воспитательного отдела', color: '#0F6E56', colorLight: '#E1F5EE', dashboardPath: '/vospitatelniy' },
  curator: { label: 'Куратор', color: '#0F6E56', colorLight: '#E1F5EE', dashboardPath: '/vospitatelniy' },
  teamlead: { label: 'Тимлидер', color: '#534AB7', colorLight: '#EEEDFE', dashboardPath: '/teacher-analytics' },
  it_admin: { label: 'Сис. администратор', color: '#854F0B', colorLight: '#FAEEDA', dashboardPath: '/it-support' },
  student: { label: 'Студент', color: '#5F5E5A', colorLight: '#F1EFE8', dashboardPath: '/student' },
}

export interface User {
  id: string
  fullName: string
  email: string
  role: Role
  password: string
}
