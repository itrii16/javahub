import type { SystemDesign } from '@/types/content'
import urlShortener from './url-shortener.json'
import rateLimiter from './rate-limiter.json'
import notificationSystem from './notification-system.json'
import chatApplication from './chat-application.json'
import ecommerceInventory from './ecommerce-inventory.json'
import cacheService from './cache-service.json'

export const systemDesigns: SystemDesign[] = [
  urlShortener,
  rateLimiter,
  notificationSystem,
  chatApplication,
  ecommerceInventory,
  cacheService,
] as SystemDesign[]

export const systemDesignMap: Record<string, SystemDesign> = Object.fromEntries(
  systemDesigns.map(d => [d.id, d])
)
