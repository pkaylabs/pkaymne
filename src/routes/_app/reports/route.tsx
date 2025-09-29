import ReportsPage from '@/pages/reports'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/reports')({
  component: ReportsPage,
})
