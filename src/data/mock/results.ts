import type { Result } from '../../types/result'

export const mockResults: Result[] = [
  // --- John Mwanga (s26, Form 4A) â€” Term 1 published ---
  { id: 'r1', studentId: 's26', subjectId: 's1', term: 1, academicYear: '2026', marks: 65, grade: 'B', teacherComment: 'A fair start; needs to improve problem-solving speed.', status: 'published', teacherId: 't1', publishedAt: '2026-06-19T09:00:00' },
  { id: 'r2', studentId: 's26', subjectId: 's2', term: 1, academicYear: '2026', marks: 62, grade: 'B', teacherComment: 'Good grasp of mechanics; practice waves topics.', status: 'published', teacherId: 't1', publishedAt: '2026-06-19T09:00:00' },
  { id: 'r3', studentId: 's26', subjectId: 's3', term: 1, academicYear: '2026', marks: 60, grade: 'C', teacherComment: 'Keep revising acids and bases.', status: 'published', teacherId: 't3', publishedAt: '2026-06-19T09:00:00' },
  { id: 'r4', studentId: 's26', subjectId: 's5', term: 1, academicYear: '2026', marks: 68, grade: 'B', teacherComment: 'Solid vocabulary use.', status: 'published', teacherId: 't2', publishedAt: '2026-06-19T09:00:00' },
  { id: 'r5', studentId: 's26', subjectId: 's4', term: 1, academicYear: '2026', marks: 63, grade: 'B', teacherComment: 'Good understanding of cell biology.', status: 'published', teacherId: 't3', publishedAt: '2026-06-19T09:00:00' },

  // --- John Mwanga (s26) â€” Term 2 published ---
  { id: 'r6', studentId: 's26', subjectId: 's1', term: 2, academicYear: '2026', marks: 82, grade: 'A', teacherComment: 'Good improvement.', status: 'published', teacherId: 't1', publishedAt: '2026-08-14T09:30:00' },
  { id: 'r7', studentId: 's26', subjectId: 's2', term: 2, academicYear: '2026', marks: 76, grade: 'A', teacherComment: 'Much improved; keep it up.', status: 'published', teacherId: 't1', publishedAt: '2026-08-14T09:30:00' },
  { id: 'r8', studentId: 's26', subjectId: 's3', term: 2, academicYear: '2026', marks: 71, grade: 'B', teacherComment: 'Better practical analysis.', status: 'published', teacherId: 't3', publishedAt: '2026-08-14T09:30:00' },
  { id: 'r9', studentId: 's26', subjectId: 's5', term: 2, academicYear: '2026', marks: 84, grade: 'A', teacherComment: 'Excellent essay structure.', status: 'published', teacherId: 't2', publishedAt: '2026-08-14T09:30:00' },
  { id: 'r10', studentId: 's26', subjectId: 's4', term: 2, academicYear: '2026', marks: 78, grade: 'A', teacherComment: 'Strong understanding of genetics.', status: 'published', teacherId: 't3', publishedAt: '2026-08-14T09:30:00' },

  // --- John Mwanga (s26) â€” Term 3 approved (awaiting publish) ---
  { id: 'r11', studentId: 's26', subjectId: 's1', term: 3, academicYear: '2026', marks: 85, grade: 'A', teacherComment: 'Outstanding progress.', status: 'approved', teacherId: 't1' },
  { id: 'r12', studentId: 's26', subjectId: 's2', term: 3, academicYear: '2026', marks: 79, grade: 'A', teacherComment: 'Excellent performance.', status: 'approved', teacherId: 't1' },
  { id: 'r13', studentId: 's26', subjectId: 's3', term: 3, academicYear: '2026', marks: 75, grade: 'A', teacherComment: 'Very good.', status: 'approved', teacherId: 't3' },
  { id: 'r14', studentId: 's26', subjectId: 's5', term: 3, academicYear: '2026', marks: 86, grade: 'A', teacherComment: 'Superb writing.', status: 'approved', teacherId: 't2' },
  { id: 'r15', studentId: 's26', subjectId: 's4', term: 3, academicYear: '2026', marks: 80, grade: 'A', teacherComment: 'Excellent.', status: 'approved', teacherId: 't3' },

  // --- Mary Mwanga (s27, Form 2A) â€” Term 1 published ---
  { id: 'r16', studentId: 's27', subjectId: 's1', term: 1, academicYear: '2026', marks: 70, grade: 'B', teacherComment: 'Good foundation in arithmetic.', status: 'published', teacherId: 't1', publishedAt: '2026-06-19T10:00:00' },
  { id: 'r17', studentId: 's27', subjectId: 's5', term: 1, academicYear: '2026', marks: 74, grade: 'B', teacherComment: 'Clear and confident reader.', status: 'published', teacherId: 't2', publishedAt: '2026-06-19T10:00:00' },
  { id: 'r18', studentId: 's27', subjectId: 's6', term: 1, academicYear: '2026', marks: 68, grade: 'B', teacherComment: 'Good composition skills.', status: 'published', teacherId: 't2', publishedAt: '2026-06-19T10:00:00' },
  { id: 'r19', studentId: 's27', subjectId: 's4', term: 1, academicYear: '2026', marks: 66, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't3', publishedAt: '2026-06-19T10:00:00' },
  { id: 'r20', studentId: 's27', subjectId: 's3', term: 1, academicYear: '2026', marks: 60, grade: 'C', teacherComment: 'Needs more lab practice.', status: 'published', teacherId: 't3', publishedAt: '2026-06-19T10:00:00' },

  // --- Mary Mwanga (s27) â€” Term 2 published ---
  { id: 'r21', studentId: 's27', subjectId: 's1', term: 2, academicYear: '2026', marks: 75, grade: 'A', teacherComment: 'Improving steadily.', status: 'published', teacherId: 't1', publishedAt: '2026-08-15T10:15:00' },
  { id: 'r22', studentId: 's27', subjectId: 's5', term: 2, academicYear: '2026', marks: 78, grade: 'A', teacherComment: 'Excellent effort.', status: 'published', teacherId: 't2', publishedAt: '2026-08-15T10:15:00' },
  { id: 'r23', studentId: 's27', subjectId: 's6', term: 2, academicYear: '2026', marks: 71, grade: 'B', teacherComment: 'Keep practicing.', status: 'published', teacherId: 't2', publishedAt: '2026-08-15T10:15:00' },
  { id: 'r24', studentId: 's27', subjectId: 's4', term: 2, academicYear: '2026', marks: 73, grade: 'B', teacherComment: 'Good understanding.', status: 'published', teacherId: 't3', publishedAt: '2026-08-15T10:15:00' },
  { id: 'r25', studentId: 's27', subjectId: 's3', term: 2, academicYear: '2026', marks: 65, grade: 'B', teacherComment: 'Improved.', status: 'published', teacherId: 't3', publishedAt: '2026-08-15T10:15:00' },

  // --- Mary Mwanga (s27) â€” Term 3 submitted ---
  { id: 'r26', studentId: 's27', subjectId: 's1', term: 3, academicYear: '2026', marks: 80, grade: 'A', teacherComment: 'Excellent.', status: 'submitted', teacherId: 't1' },
  { id: 'r27', studentId: 's27', subjectId: 's5', term: 3, academicYear: '2026', marks: 82, grade: 'A', teacherComment: 'Brilliant.', status: 'submitted', teacherId: 't2' },

  // --- Amina Mwakasege (s1, Form 6A) ---
  { id: 'r28', studentId: 's1', subjectId: 's1', term: 1, academicYear: '2026', marks: 72, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't5', publishedAt: '2026-06-22T08:45:00' },
  { id: 'r29', studentId: 's1', subjectId: 's2', term: 1, academicYear: '2026', marks: 68, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't5', publishedAt: '2026-06-22T08:45:00' },
  { id: 'r30', studentId: 's1', subjectId: 's3', term: 1, academicYear: '2026', marks: 74, grade: 'B', teacherComment: 'Very good.', status: 'published', teacherId: 't3', publishedAt: '2026-06-22T08:45:00' },
  { id: 'r31', studentId: 's1', subjectId: 's4', term: 1, academicYear: '2026', marks: 70, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't3', publishedAt: '2026-06-22T08:45:00' },
  { id: 'r32', studentId: 's1', subjectId: 's5', term: 1, academicYear: '2026', marks: 80, grade: 'A', teacherComment: 'Excellent.', status: 'published', teacherId: 't2', publishedAt: '2026-06-22T08:45:00' },
  { id: 'r33', studentId: 's1', subjectId: 's1', term: 2, academicYear: '2026', marks: 78, grade: 'A', teacherComment: 'Improved.', status: 'approved', teacherId: 't5' },
  { id: 'r34', studentId: 's1', subjectId: 's2', term: 2, academicYear: '2026', marks: 75, grade: 'A', teacherComment: 'Improved.', status: 'approved', teacherId: 't5' },

  // --- Baraka Mhagama (s2, Form 6A) ---
  { id: 'r35', studentId: 's2', subjectId: 's1', term: 2, academicYear: '2026', marks: 66, grade: 'B', teacherComment: 'Needs revision.', status: 'submitted', teacherId: 't5' },
  { id: 'r36', studentId: 's2', subjectId: 's2', term: 2, academicYear: '2026', marks: 60, grade: 'C', teacherComment: 'Practice more.', status: 'submitted', teacherId: 't5' },

  // --- Frank Mwakasege (s6, Form 4A) ---
  { id: 'r37', studentId: 's6', subjectId: 's1', term: 2, academicYear: '2026', marks: 58, grade: 'C', teacherComment: 'Work on algebra.', status: 'draft', teacherId: 't1' },
  { id: 'r38', studentId: 's6', subjectId: 's2', term: 2, academicYear: '2026', marks: 55, grade: 'C', teacherComment: 'Attend extra sessions.', status: 'draft', teacherId: 't1' },

  // --- Grace Ndale (s7, Form 4A) ---
  { id: 'r39', studentId: 's7', subjectId: 's1', term: 2, academicYear: '2026', marks: 63, grade: 'B', teacherComment: 'Solid effort.', status: 'draft', teacherId: 't1' },

  // --- Peter Mwakyembe (s16, Form 2A) ---
  { id: 'r40', studentId: 's16', subjectId: 's1', term: 2, academicYear: '2026', marks: 71, grade: 'B', teacherComment: 'Good progress.', status: 'submitted', teacherId: 't1' },
  { id: 'r41', studentId: 's16', subjectId: 's2', term: 2, academicYear: '2026', marks: 66, grade: 'B', teacherComment: 'Keep it up.', status: 'submitted', teacherId: 't1' },

  // --- Queen Mwamlima (s17, Form 2A) ---
  { id: 'r42', studentId: 's17', subjectId: 's1', term: 2, academicYear: '2026', marks: 60, grade: 'C', teacherComment: 'Practice more.', status: 'draft', teacherId: 't1' },
  { id: 'r43', studentId: 's17', subjectId: 's2', term: 2, academicYear: '2026', marks: 52, grade: 'C', teacherComment: 'Needs support.', status: 'draft', teacherId: 't1' },

  // --- Raphael Mwakosya (s18, Form 2A) ---
  { id: 'r44', studentId: 's18', subjectId: 's1', term: 2, academicYear: '2026', marks: 49, grade: 'D', teacherComment: 'Extra attention needed.', status: 'draft', teacherId: 't1' },

  // --- Upendo Mwaipopo (s21, Form 1A) ---
  { id: 'r45', studentId: 's21', subjectId: 's5', term: 1, academicYear: '2026', marks: 76, grade: 'A', teacherComment: 'Excellent.', status: 'published', teacherId: 't2', publishedAt: '2026-06-18T11:20:00' },
  { id: 'r46', studentId: 's21', subjectId: 's6', term: 1, academicYear: '2026', marks: 70, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't2', publishedAt: '2026-06-18T11:20:00' },
  { id: 'r47', studentId: 's21', subjectId: 's5', term: 2, academicYear: '2026', marks: 79, grade: 'A', teacherComment: 'Very good.', status: 'submitted', teacherId: 't2' },

  // --- Victor Mwakipesile (s22, Form 1A) ---
  { id: 'r48', studentId: 's22', subjectId: 's6', term: 2, academicYear: '2026', marks: 64, grade: 'B', teacherComment: 'Keep practicing.', status: 'submitted', teacherId: 't2' },

  // --- Khadija Msemo (s11, Form 3A) ---
  { id: 'r49', studentId: 's11', subjectId: 's7', term: 1, academicYear: '2026', marks: 70, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't4', publishedAt: '2026-06-20T11:00:00' },
  { id: 'r50', studentId: 's11', subjectId: 's8', term: 1, academicYear: '2026', marks: 65, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't4', publishedAt: '2026-06-20T11:00:00' },
  { id: 'r51', studentId: 's11', subjectId: 's9', term: 1, academicYear: '2026', marks: 72, grade: 'B', teacherComment: 'Very good.', status: 'published', teacherId: 't4', publishedAt: '2026-06-20T11:00:00' },

  // --- Daudi Mpandanyama (s4, Form 5A) ---
  { id: 'r52', studentId: 's4', subjectId: 's7', term: 1, academicYear: '2026', marks: 68, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't4', publishedAt: '2026-06-20T11:00:00' },
  { id: 'r53', studentId: 's4', subjectId: 's8', term: 1, academicYear: '2026', marks: 62, grade: 'B', teacherComment: 'Good.', status: 'published', teacherId: 't4', publishedAt: '2026-06-20T11:00:00' },
]
