import type { Gender } from '../lib/ridePreferences'

export const DEMO_SESSION_KEY = 'routemate-demo-v1'

export type StudentDetails = { name: string; email: string; studentId: string }
type DemoStudent = StudentDetails & { id: string; gender?: Gender; label: string }

// Fictional records for exercising the verification flow without collecting real documents.
export const DEMO_STUDENTS: DemoStudent[] = [
  { id: 'maya', name: 'Maya Chen', email: 'maya.chen@yorku.example', studentId: 'DEMO-1001', gender: 'woman', label: 'Woman listed' },
  { id: 'daniel', name: 'Daniel Lee', email: 'daniel.lee@yorku.example', studentId: 'DEMO-1002', gender: 'man', label: 'Man listed' },
  { id: 'alex', name: 'Alex Singh', email: 'alex.singh@yorku.example', studentId: 'DEMO-1003', label: 'No gender listed' },
]

export function demoStudentById(id: string | undefined) {
  return DEMO_STUDENTS.find((student) => student.id === id)
}

export function verifyDemoStudent({ email, studentId }: StudentDetails) {
  return DEMO_STUDENTS.find((student) => student.email === email.trim().toLowerCase() && student.studentId === studentId.trim().toUpperCase())
}

export function readVerifiedDemoStudent() {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY)
    return raw ? demoStudentById(JSON.parse(raw).answers?.verifiedStudentId) : undefined
  } catch {
    return undefined
  }
}
