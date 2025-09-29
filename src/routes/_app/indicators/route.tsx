import IndicatorPage from '@/pages/indicators'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/indicators')({
  component: IndicatorPage,
})

