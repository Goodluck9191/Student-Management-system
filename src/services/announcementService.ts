import type { Announcement, AnnouncementInput } from '../types/announcement'
import type { Repository } from './mockRepository'
import { createMockRepository } from './mockRepository'
import { mockAnnouncements } from '../data/mock/announcements'

export interface AnnouncementRepository extends Repository<Announcement, AnnouncementInput> {}

export const announcementService: AnnouncementRepository = createMockRepository<
  Announcement,
  AnnouncementInput
>(mockAnnouncements)