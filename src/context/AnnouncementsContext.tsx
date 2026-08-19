import { createEntityContext } from './createEntityContext'
import type { Announcement, AnnouncementInput } from '../types/announcement'
import { announcementService } from '../services/announcementService'

const { Provider: AnnouncementsProvider, useEntity: useAnnouncements } = createEntityContext<
  Announcement,
  AnnouncementInput
>(announcementService, 'Announcements')

export { AnnouncementsProvider, useAnnouncements }