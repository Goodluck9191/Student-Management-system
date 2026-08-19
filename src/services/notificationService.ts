import type { NotificationItem, NotificationFilters } from '../types/notification'
import { mockNotifications } from '../data/mock/notifications'
import { delay } from '../lib/id'

export interface NotificationRepository {
  list(filters?: NotificationFilters): Promise<NotificationItem[]>
  markRead(id: string): Promise<NotificationItem>
  markAllRead(): Promise<void>
  unreadCount(): Promise<number>
}

class MockNotificationRepository implements NotificationRepository {
  private notifications: NotificationItem[] = [...mockNotifications]

  async list(filters?: NotificationFilters): Promise<NotificationItem[]> {
    await delay(200)
    let items = [...this.notifications]
    if (filters?.type) {
      items = items.filter((n) => n.type === filters.type)
    }
    if (filters?.read === 'read') {
      items = items.filter((n) => n.read)
    }
    if (filters?.read === 'unread') {
      items = items.filter((n) => !n.read)
    }
    return items
  }

  async markRead(id: string): Promise<NotificationItem> {
    await delay(150)
    const index = this.notifications.findIndex((n) => n.id === id)
    if (index === -1) {
      throw new Error(`Notification with id "${id}" was not found.`)
    }
    this.notifications[index] = { ...this.notifications[index], read: true }
    return { ...this.notifications[index] }
  }

  async markAllRead(): Promise<void> {
    await delay(150)
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }))
  }

  async unreadCount(): Promise<number> {
    await delay(100)
    return this.notifications.filter((n) => !n.read).length
  }
}

export const notificationService: NotificationRepository = new MockNotificationRepository()