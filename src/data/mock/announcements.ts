import type { Announcement } from '../../types/announcement'

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Parent Meeting',
    message:
      'There will be a parent meeting on Friday at 9:00 AM in the school assembly hall. The meeting will discuss Term 2 academic progress and the upcoming national examinations. All parents are kindly requested to attend.',
    audience: 'parents',
    priority: 'important',
    authorId: 'u-admin',
    authorName: 'Administrator',
    date: '2026-08-14',
    status: 'published',
  },
  {
    id: 'a2',
    title: 'Term 2 Results Published',
    message:
      'Term 2 results for the 2026 academic year are now available on the parent portal. Parents can log in to view the published results of their children.',
    audience: 'parents',
    priority: 'normal',
    authorId: 'u-admin',
    authorName: 'Administrator',
    date: '2026-08-10',
    status: 'published',
  },
  {
    id: 'a3',
    title: 'Term 3 Begins',
    message:
      'Term 3 of the 2026 academic year begins on Monday. All students are required to report by 7:30 AM with their school uniform and full stationery.',
    audience: 'all',
    priority: 'urgent',
    authorId: 'u-admin',
    authorName: 'Administrator',
    date: '2026-08-05',
    status: 'published',
  },
  {
    id: 'a4',
    title: 'Form Four Mock Examinations',
    message:
      'Mock examinations for Form Four will be held from the 3rd to the 14th of September. Students should use the timetable posted on the notice board for preparation.',
    audience: 'class',
    audienceClassId: 'c6',
    priority: 'important',
    authorId: 'u-teacher',
    authorName: 'James Mwakapamba',
    date: '2026-08-12',
    status: 'published',
  },
  {
    id: 'a5',
    title: 'Inter-Class Sports Day',
    message:
      'The school will host an inter-class sports day on Saturday. Students participating in sports should register with their class teachers by Thursday.',
    audience: 'students',
    priority: 'normal',
    authorId: 'u-teacher',
    authorName: 'Sarah Kimaro',
    date: '2026-08-15',
    status: 'draft',
  },
  {
    id: 'a6',
    title: 'Staff Development Workshop',
    message:
      'All teachers are invited to a professional development workshop on modern teaching methodologies next Wednesday afternoon.',
    audience: 'teachers',
    priority: 'normal',
    authorId: 'u-admin',
    authorName: 'Administrator',
    date: '2026-08-08',
    status: 'published',
  },
]