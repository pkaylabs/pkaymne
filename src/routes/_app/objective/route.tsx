import ObjectivesPage from '@/pages/objectives'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/objective')({
  component: ObjectivesPage,
})

