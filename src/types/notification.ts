export type NotificationType = 'result' | 'announcement' | 'system'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  date: string
  read: boolean
}

export interface NotificationFilters {
  type: NotificationType | ''
  read: 'read' | 'unread' | ''
}