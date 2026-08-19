export type AnnouncementPriority = 'normal' | 'important' | 'urgent'

export type AnnouncementAudience = 'all' | 'students' | 'parents' | 'teachers' | 'class'

export type AnnouncementStatus = 'draft' | 'published'

export interface Announcement {
  id: string
  title: string
  message: string
  audience: AnnouncementAudience
  audienceClassId?: string
  priority: AnnouncementPriority
  authorId: string
  authorName: string
  date: string
  status: AnnouncementStatus
}

export type AnnouncementInput = Omit<Announcement, 'id'>

export interface AnnouncementFilters {
  search: string
  audience: AnnouncementAudience | ''
  priority: AnnouncementPriority | ''
  status: AnnouncementStatus | ''
}