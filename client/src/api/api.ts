import { useQuery, useMutation } from '@tanstack/react-query'

export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://sudabelt-api.fly.dev/api/v1'
    : '/api/v1')

// ============================================================================
// SHARED API TYPES
// ============================================================================

export interface ApiProduct {
  _id: string
  name: string
  slug: string
  modelNumber?: string
  sku?: string
  brand: string
  category: string
  categoryLabel?: string
  productType?: 'Technology' | 'Consumable'
  shortDescription: string
  fullOverview: string
  productFeatures?: string[]
  commonUses?: string[]
  usps?: string
  otherInformation?: string[]
  specifications?: Record<string, unknown>
  keyFeatures?: { title: string; description: string }[]
  clinicalApplications?: string[]
  complianceCertifications?: string[]
  primaryImage?: string
  galleryImages?: string[]
  images?: {
    primaryCutout?: string
    contextualGallery?: string[]
    altText?: string
  }
  isConsumable: boolean
  datasheetUrl?: string
  brochureUrl?: string
  videoUrl?: string
  pricingNotes?: string
  compatibleProductSlugs?: string[]
  compatibleConsumables?: ApiProduct[]
  availableConsumables?: ApiProduct[]
  faqs?: { question: string; answer: string }[]
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
  author?: string
  summary: string
  content: string
  coverImage?: string
  galleryImages?: string[]
  pdfUrl?: string
  readTimeMinutes?: number
  publishedDate?: string
  published: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiProject {
  _id: string
  title: string
  slug: string
  category: string
  facilityName: string
  locationState: string
  city?: string
  completionYear: number
  isFeatured: boolean
  heroImage: string
  galleryImages?: string[]
  shortDescription: string
  fullDescription: string
  clientOrCommissionedBy?: string
  scopeOfWork?: string[]
  equipmentSupplied?: string[]
  impactMetrics?: { label: string; value: string }[]
  published: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiNewsletterSubscriber {
  _id: string
  email: string
  name?: string
  institution?: string
  source: string
  isActive: boolean
  subscribedAt: string
  tags?: string[]
}

export interface ApiNewsletterCampaign {
  _id: string
  title: string
  slug: string
  subject: string
  issueNumber: number
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  year: number
  summary: string
  content: string
  coverImage?: string
  pdfUrl?: string
  status: 'draft' | 'scheduled' | 'sent'
  sentAt?: string
  recipientCount?: number
  published: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiAdminUser {
  _id: string
  name: string
  email: string
  role: 'superadmin' | 'admin' | 'editor'
  isActive: boolean
  lastLoginAt?: string
  createdAt?: string
}

export interface ApiRfq {
  _id: string
  referenceId: string
  facilityName: string
  facilityType: string
  location: { city: string; state: string; country?: string }
  urgency: string
  selectedItems: { name: string; category?: string; quantity: number; notes?: string }[]
  contact: { name: string; role: string; email: string; phone: string }
  status: 'pending' | 'quoted' | 'fulfilled' | 'cancelled'
  createdAt: string
}

export interface ApiSupportTicket {
  _id: string
  ticketId?: string
  unifiedId?: string
  ticketType?: 'after_sales' | 'training' | 'contact'
  displayType?: string
  facilityName?: string
  institutionName?: string
  hospitalName?: string
  equipmentModel?: string
  serialNumber?: string
  issueType?: string
  urgencyLevel?: string
  description?: string
  contactName?: string
  contactPerson?: string
  email?: string
  phone?: string
  locationState?: string
  targetHospitalState?: string
  courseTrack?: string
  numberOfTrainees?: number
  department?: string
  status: string
  createdAt: string
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
  location: { city: string; state: string; country?: string }
  urgency: string
  selectedItems: RFQItemPayload[]
  slaTier?: string
  contact: { name: string; role: string; email: string; phone: string }
  tenderAttachmentUrl?: string
  additionalNotes?: string
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

export interface ContactInquiryPayload {
  name: string
  email: string
  phone: string
  facilityName?: string
  department: 'sales' | 'biomedical_sla' | 'training' | 'general'
  message: string
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
    productType?: 'Technology' | 'Consumable'
    search?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.category) query.set('category', params.category)
    if (params?.brand) query.set('brand', params.brand)
    if (params?.isConsumable !== undefined) query.set('isConsumable', String(params.isConsumable))
    if (params?.productType) query.set('productType', params.productType)
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

  // Public Projects
  getProjects: (params?: { category?: string; year?: number; featured?: boolean; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.category) query.set('category', params.category)
    if (params?.year) query.set('year', String(params.year))
    if (params?.featured !== undefined) query.set('featured', String(params.featured))
    if (params?.search) query.set('search', params.search)
    const qs = query.toString()
    return request<{ success: boolean; count: number; data: ApiProject[] }>(
      `/projects${qs ? `?${qs}` : ''}`
    )
  },

  getProjectBySlug: (slug: string) =>
    request<{ success: boolean; data: ApiProject }>(`/projects/${encodeURIComponent(slug)}`),

  // Public Newsletter
  subscribeNewsletter: (payload: { email: string; name?: string; institution?: string }) =>
    request<{ success: boolean; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Public Forms
  submitRFQ: (payload: RFQSubmissionPayload) =>
    request<{ success: boolean; referenceId: string; whatsappUrl: string }>('/forms/rfq', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitTrainingBooking: (payload: TrainingBookingPayload) =>
    request<{ success: boolean; registrationId: string; whatsappUrl: string }>('/forms/training-booking', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitSupportTicket: (payload: SupportTicketPayload) =>
    request<{ success: boolean; ticketId: string; whatsappUrgentUrl: string }>('/forms/support-ticket', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitContactInquiry: (payload: ContactInquiryPayload) =>
    request<{ success: boolean; inquiryId: string; message: string }>('/forms/contact-inquiry', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // ============================================================================
  // ADMIN AUTH & CRUD METHODS
  // ============================================================================

  adminLogin: (credentials: { email: string; password: string }) =>
    request<{
      success: boolean
      token: string
      user: { id: string; email: string; name: string; role: 'superadmin' | 'admin' | 'editor' }
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  adminLogout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),

  adminGetMe: () =>
    request<{
      success: boolean
      user: { id: string; email: string; name: string; role: 'superadmin' | 'admin' | 'editor' }
    }>('/auth/me'),

  // Products
  adminGetProducts: () =>
    request<{ success: boolean; count: number; data: ApiProduct[] }>('/admin/products'),

  adminCreateProduct: (payload: Partial<ApiProduct>) =>
    request<{ success: boolean; message: string; data: ApiProduct }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminUpdateProduct: (id: string, payload: Partial<ApiProduct>) =>
    request<{ success: boolean; message: string; data: ApiProduct }>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  adminDeleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    }),

  // Projects
  adminGetProjects: () =>
    request<{ success: boolean; count: number; data: ApiProject[] }>('/admin/projects'),

  adminCreateProject: (payload: Partial<ApiProject>) =>
    request<{ success: boolean; message: string; data: ApiProject }>('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminUpdateProject: (id: string, payload: Partial<ApiProject>) =>
    request<{ success: boolean; message: string; data: ApiProject }>(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  adminDeleteProject: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/projects/${id}`, {
      method: 'DELETE',
    }),

  // Articles / Blogs
  adminGetArticles: () =>
    request<{ success: boolean; count: number; data: ApiArticle[] }>('/admin/articles'),

  adminCreateArticle: (payload: Partial<ApiArticle>) =>
    request<{ success: boolean; message: string; data: ApiArticle }>('/admin/articles', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminUpdateArticle: (id: string, payload: Partial<ApiArticle>) =>
    request<{ success: boolean; message: string; data: ApiArticle }>(`/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  adminDeleteArticle: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/articles/${id}`, {
      method: 'DELETE',
    }),

  // Newsletters
  adminGetSubscribers: () =>
    request<{ success: boolean; count: number; data: ApiNewsletterSubscriber[] }>('/admin/newsletter/subscribers'),

  adminCreateSubscriber: (payload: { email: string; name?: string; institution?: string }) =>
    request<{ success: boolean; message: string; data: ApiNewsletterSubscriber }>('/admin/newsletter/subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminDeleteSubscriber: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/newsletter/subscribers/${id}`, {
      method: 'DELETE',
    }),

  adminGetCampaigns: () =>
    request<{ success: boolean; count: number; data: ApiNewsletterCampaign[] }>('/admin/newsletter/campaigns'),

  adminCreateCampaign: (payload: Partial<ApiNewsletterCampaign>) =>
    request<{ success: boolean; message: string; data: ApiNewsletterCampaign }>('/admin/newsletter/campaigns', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminUpdateCampaign: (id: string, payload: Partial<ApiNewsletterCampaign>) =>
    request<{ success: boolean; message: string; data: ApiNewsletterCampaign }>(`/admin/newsletter/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  adminDeleteCampaign: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/newsletter/campaigns/${id}`, {
      method: 'DELETE',
    }),

  adminSendCampaign: (id: string) =>
    request<{ success: boolean; message: string; data: ApiNewsletterCampaign }>(`/admin/newsletter/campaigns/${id}/send`, {
      method: 'POST',
    }),

  adminGetLeads: () =>
    request<{ success: boolean; count: number; data: ApiLeadMagnet[] }>('/admin/leads'),

  // Admin Users (Super Admin Only)
  adminGetUsers: () =>
    request<{ success: boolean; count: number; data: ApiAdminUser[] }>('/admin/users'),

  adminCreateUser: (payload: { name: string; email: string; password: string; role: 'superadmin' | 'admin' | 'editor' }) =>
    request<{ success: boolean; message: string; data: ApiAdminUser }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminUpdateUser: (id: string, payload: Partial<ApiAdminUser> & { password?: string }) =>
    request<{ success: boolean; message: string; data: ApiAdminUser }>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  adminDeleteUser: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  // Uploads
  adminUploadMedia: (payload: { fileName: string; fileData: string; mimeType?: string }) =>
    request<{ success: boolean; url: string; fileName: string; sizeBytes: number }>('/admin/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // RFQs & Support Tickets
  adminGetRfqs: () =>
    request<{ success: boolean; count: number; data: ApiRfq[] }>('/admin/rfqs'),

  adminUpdateRfq: (id: string, payload: { status: string; adminNotes?: string }) =>
    request<{ success: boolean; data: ApiRfq }>(`/admin/rfqs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  adminGetTickets: (params?: { type?: string }) =>
    request<{ success: boolean; count: number; data: ApiSupportTicket[] }>(
      `/admin/support-tickets${params?.type ? `?type=${params.type}` : ''}`
    ),

  adminUpdateTicket: (id: string, payload: { status: string; resolutionNotes?: string }) =>
    request<{ success: boolean; data: ApiSupportTicket }>(`/admin/support-tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
}

// React Query hooks for public products & projects
export function useProducts(params?: {
  category?: string
  brand?: string
  isConsumable?: boolean
  productType?: 'Technology' | 'Consumable'
  search?: string
}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.getProducts(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProductBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useProjects(params?: { category?: string; year?: number; featured?: boolean; search?: string }) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => api.getProjects(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.getProjectBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useArticles(params?: {
  type?: 'blog' | 'newsletter'
  category?: string
  year?: number
  quarter?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => api.getArticles(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useArticleDetail(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => api.getArticleBySlug(slug),
    enabled: Boolean(slug),
  })
}

export interface LeadCapturePayload {
  name: string
  workEmail: string
  phone: string
  facilityName: string
  assetSlug: string
  assetTitle?: string
  assetUrl?: string
  leadSource?: string
}

export interface ApiLeadMagnet {
  _id: string
  name: string
  workEmail: string
  phone?: string
  facilityName: string
  downloadedAssetSlug: string
  downloadedAssetTitle?: string
  downloadedAssetUrl?: string
  leadSource?: string
  downloadedAt: string
}

export interface LeadCaptureResponse {
  success: boolean
  downloadUrl: string
}

export function useLeadCaptureMutation() {
  return useMutation({
    mutationFn: (payload: LeadCapturePayload) =>
      request<LeadCaptureResponse>('/forms/lead-capture', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  })
}
