import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

// ============================================================================
// SHARED API TYPES
// ============================================================================

export interface ApiProduct {
  _id: string
  name: string
  slug: string
  modelNumber: string
  sku?: string
  brand: string
  category: string
  shortDescription: string
  fullOverview: string
  specifications: Record<string, unknown>
  keyFeatures?: { title: string; description: string }[]
  clinicalApplications?: string[]
  complianceCertifications?: string[]
  images?: {
    primaryCutout?: string
    contextualGallery?: string[]
    altText?: string
  }
  isConsumable: boolean
  datasheetUrl: string
  pricingNotes?: string
  compatibleProductSlugs?: string[]
  supportPackage?: {
    installationIncluded?: boolean
    clinicalTrainingHours?: number
    targetTrainees?: string[]
    preventiveMaintenanceSLA?: string
    warrantyPeriod?: string
    localSparePartsStocked?: boolean
  }
  faqs?: { question: string; answer: string }[]
  seoMeta?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  published: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiArticle {
  _id: string
  title: string
  slug: string
  type: 'blog' | 'newsletter'
  issueNumber?: number
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  year?: number
  category: string
  summary: string
  content: string
  takeaways?: string[]
  coverImage: string
  pdfUrl?: string
  readTimeMinutes?: number
  featuredProductSlugs?: string[]
  publishedDate: string
  published: boolean
}

export interface RFQItemPayload {
  equipmentId?: string
  sku?: string
  name: string
  category?: string
  quantity: number
  notes?: string
}

export interface RFQSubmissionPayload {
  facilityName: string
  facilityType: string
  location: {
    city: string
    state: string
    country?: string
  }
  urgency: string
  selectedItems: RFQItemPayload[]
  slaTier?: string
  contact: {
    name: string
    role: string
    email: string
    phone: string
  }
  tenderAttachmentUrl?: string
  additionalNotes?: string
}

export interface RFQSubmissionResponse {
  success: boolean
  referenceId: string
  whatsappUrl: string
}

export interface TrainingBookingPayload {
  institutionName: string
  courseTrack: string
  numberOfTrainees: number
  targetHospitalState: string
  contactName: string
  contactRole: string
  email: string
  phone: string
  preferredDates?: string
  notes?: string
}

export interface TrainingBookingResponse {
  success: boolean
  registrationId: string
  message: string
  whatsappUrl: string
}

export interface SupportTicketPayload {
  hospitalName: string
  equipmentModel: string
  serialNumber: string
  issueType: 'breakdown' | 'preventive_maintenance' | 'calibration' | 'consumable_stockout'
  urgencyLevel: 'critical_patient_impact' | 'moderate' | 'routine'
  description: string
  contactName: string
  email?: string
  phone: string
  locationState?: string
}

export interface SupportTicketResponse {
  success: boolean
  ticketId: string
  whatsappUrgentUrl: string
}

export interface ContactInquiryPayload {
  name: string
  email: string
  phone: string
  facilityName?: string
  department: 'sales' | 'biomedical_sla' | 'training' | 'general'
  message: string
}

export interface ContactInquiryResponse {
  success: boolean
  inquiryId: string
  message: string
}

export interface LeadCapturePayload {
  name: string
  workEmail: string
  phone: string
  facilityName: string
  assetSlug: string
  assetTitle?: string
  assetUrl?: string
}

export interface LeadCaptureResponse {
  success: boolean
  downloadUrl: string
}

// ============================================================================
// CORE HTTP REQUEST HELPER
// ============================================================================

export class ApiError extends Error {
  public status: number
  public errors?: { field: string; message: string }[]

  constructor(message: string, status: number, errors?: { field: string; message: string }[]) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sbm_admin_token') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      data.message || `Request failed with status ${response.status}`,
      response.status,
      data.errors
    )
  }

  return data as T
}

// ============================================================================
// TYPED API METHODS
// ============================================================================

export const api = {
  getHealth: () =>
    request<{ success: boolean; status: string; database: string }>('/health'),

  // Public Catalog
  getProducts: (params?: {
    category?: string
    brand?: string
    isConsumable?: boolean
    search?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.category) query.set('category', params.category)
    if (params?.brand) query.set('brand', params.brand)
    if (params?.isConsumable !== undefined) query.set('isConsumable', String(params.isConsumable))
    if (params?.search) query.set('search', params.search)
    const qs = query.toString()
    return request<{ success: boolean; count: number; data: ApiProduct[] }>(
      `/products${qs ? `?${qs}` : ''}`
    )
  },

  getProductBySlug: (slug: string) =>
    request<{ success: boolean; data: ApiProduct }>(`/products/${encodeURIComponent(slug)}`),

  // Public Articles & Newsletters
  getArticles: (params?: {
    type?: 'blog' | 'newsletter'
    category?: string
    year?: number
    quarter?: string
    search?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.type) query.set('type', params.type)
    if (params?.category) query.set('category', params.category)
    if (params?.year) query.set('year', String(params.year))
    if (params?.quarter) query.set('quarter', params.quarter)
    if (params?.search) query.set('search', params.search)
    const qs = query.toString()
    return request<{ success: boolean; count: number; data: ApiArticle[] }>(
      `/articles${qs ? `?${qs}` : ''}`
    )
  },

  getArticleBySlug: (slug: string) =>
    request<{ success: boolean; data: ApiArticle }>(`/articles/${encodeURIComponent(slug)}`),

  // Public Form Submissions
  submitRFQ: (payload: RFQSubmissionPayload) =>
    request<RFQSubmissionResponse>('/rfq', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitTrainingBooking: (payload: TrainingBookingPayload) =>
    request<TrainingBookingResponse>('/training-booking', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitSupportTicket: (payload: SupportTicketPayload) =>
    request<SupportTicketResponse>('/after-sales-support', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitContactInquiry: (payload: ContactInquiryPayload) =>
    request<ContactInquiryResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitLeadCapture: (payload: LeadCapturePayload) =>
    request<LeadCaptureResponse>('/lead-capture', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

// ============================================================================
// TANSTACK QUERY HOOKS
// ============================================================================

export const useProductsQuery = (params?: {
  category?: string
  brand?: string
  isConsumable?: boolean
  search?: string
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.getProducts(params),
  })
}

export const useProductBySlugQuery = (slug?: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProductBySlug(slug || ''),
    enabled: Boolean(slug),
  })
}

export const useArticlesQuery = (params?: {
  type?: 'blog' | 'newsletter'
  category?: string
  year?: number
  quarter?: string
  search?: string
}) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => api.getArticles(params),
  })
}

export const useArticleBySlugQuery = (slug?: string) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => api.getArticleBySlug(slug || ''),
    enabled: Boolean(slug),
  })
}

export const useSubmitRFQMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RFQSubmissionPayload) => api.submitRFQ(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-rfqs'] })
    },
  })
}

export const useSubmitTrainingBookingMutation = () => {
  return useMutation({
    mutationFn: (payload: TrainingBookingPayload) => api.submitTrainingBooking(payload),
  })
}

export const useSubmitSupportTicketMutation = () => {
  return useMutation({
    mutationFn: (payload: SupportTicketPayload) => api.submitSupportTicket(payload),
  })
}

export const useSubmitContactInquiryMutation = () => {
  return useMutation({
    mutationFn: (payload: ContactInquiryPayload) => api.submitContactInquiry(payload),
  })
}

export const useLeadCaptureMutation = () => {
  return useMutation({
    mutationFn: (payload: LeadCapturePayload) => api.submitLeadCapture(payload),
  })
}
