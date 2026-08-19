import type { NotificationItem } from '../../types/notification'

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'result',
    title: 'Results Published',
    message: 'Your child\'s Term 2 results are now available.',
    date: '2026-08-10T09:30:00',
    read: false,
  },
  {
    id: 'n2',
    type: 'announcement',
    title: 'Parent Meeting',
    message: 'The school will hold a parent meeting on Friday at 9:00 AM.',
    date: '2026-08-14T07:00:00',
    read: false,
  },
  {
    id: 'n3',
    type: 'announcement',
    title: 'Term 3 Begins',
    message: 'Term 3 of the 2026 academic year begins on Monday.',
    date: '2026-08-05T08:15:00',
    read: true,
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Welcome to the Portal',
    message: 'Welcome to the Iyunga Secondary School parent portal.',
    date: '2026-08-01T10:00:00',
    read: true,
  },
]