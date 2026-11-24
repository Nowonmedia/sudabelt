import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  FileText,
  Mail,
  ClipboardList,
  Wrench,
  Users,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Search,
  RefreshCw,
  Send,
  X,
  AlertTriangle,
  ShieldAlert,
  UserPlus,
  Upload,
  Download,
} from 'lucide-react'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { api } from '../../api/api'
import { exportToCSV, exportToPDF } from '../../utils/exportUtils'
import type {
  ApiProject,
  ApiProduct,
  ApiArticle,
  ApiNewsletterSubscriber,
  ApiNewsletterCampaign,
  ApiLeadMagnet,
  ApiRfq,
  ApiSupportTicket,
  ApiAdminUser,
} from '../../api/api'

type TabType =
  | 'overview'
  | 'projects'
  | 'products'
  | 'articles'
  | 'newsletters'
  | 'leads'
  | 'rfqs'
  | 'tickets'
  | 'team'

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
}

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'blockquote',
  'code-block',
  'link',
  'image',
]

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [currentUser, setCurrentUser] = useState<{
    id: string
    email: string
    name: string
    role: 'superadmin' | 'admin' | 'editor'
  } | null>(null)

  // Data states
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [articles, setArticles] = useState<ApiArticle[]>([])
  const [subscribers, setSubscribers] = useState<ApiNewsletterSubscriber[]>([])
  const [campaigns, setCampaigns] = useState<ApiNewsletterCampaign[]>([])
  const [leads, setLeads] = useState<ApiLeadMagnet[]>([])
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>('All')
  const [rfqs, setRfqs] = useState<ApiRfq[]>([])
  const [tickets, setTickets] = useState<ApiSupportTicket[]>([])
  const [adminUsers, setAdminUsers] = useState<ApiAdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<ApiProject | null>(null)

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null)

  const [showArticleModal, setShowArticleModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<ApiArticle | null>(null)
  const [articleContent, setArticleContent] = useState('')
  const [articleType, setArticleType] = useState<'blog' | 'newsletter'>('blog')
  const [isSavingArticle, setIsSavingArticle] = useState(false)

  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [showAdminUserModal, setShowAdminUserModal] = useState(false)

  // Inquiries filter: after-sales, training, contact form, or all
  const [ticketCategory, setTicketCategory] = useState<'all' | 'after_sales' | 'training' | 'contact'>('all')
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')

  // 1. Initial Auth Check
  useEffect(() => {
    const token = localStorage.getItem('sbm_admin_token')
    const savedUser = localStorage.getItem('sbm_admin_user')

    if (!token) {
      navigate('/admin/login')
      return
    }

    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch {
        // ignore
      }
    }

    fetchAllData()
  }, [navigate])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [
        projsRes,
        prodsRes,
        artsRes,
        subsRes,
        campsRes,
        leadsRes,
        rfqsRes,
        ticksRes,
      ] = await Promise.all([
        api.adminGetProjects().catch(() => ({ data: [] })),
        api.adminGetProducts().catch(() => ({ data: [] })),
        api.adminGetArticles().catch(() => ({ data: [] })),
        api.adminGetSubscribers().catch(() => ({ data: [] })),
        api.adminGetCampaigns().catch(() => ({ data: [] })),
        api.adminGetLeads().catch(() => ({ data: [] })),
        api.adminGetRfqs().catch(() => ({ data: [] })),
        api.adminGetTickets().catch(() => ({ data: [] })),
      ])

      setProjects(projsRes.data || [])
      setProducts(prodsRes.data || [])
      setArticles(artsRes.data || [])
      setSubscribers(subsRes.data || [])
      setCampaigns(campsRes.data || [])
      setLeads(leadsRes.data || [])
      setRfqs(rfqsRes.data || [])
      setTickets(ticksRes.data || [])

      // Fetch team only if superadmin
      const savedUserStr = localStorage.getItem('sbm_admin_user')
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr)
        if (u.role === 'superadmin') {
          const usersRes = await api.adminGetUsers().catch(() => ({ data: [] }))
          setAdminUsers(usersRes.data || [])
        }
      }
    } catch (err) {
      console.error('Failed to load CRM data', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await api.adminLogout().catch(() => {})
    localStorage.removeItem('sbm_admin_token')
    localStorage.removeItem('sbm_admin_user')
    toast.info('Signed out of admin console.')
    navigate('/admin/login')
  }

  // ============================================================================
  // PROJECT CRUD HANDLERS
  // ============================================================================
  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const payload: Partial<ApiProject> = {
      title: String(formData.get('title')),
      category: String(formData.get('category')),
      facilityName: String(formData.get('facilityName')),
      locationState: String(formData.get('locationState')),
      city: String(formData.get('city') || ''),
      completionYear: Number(formData.get('completionYear')),
      heroImage: String(formData.get('heroImage')),
      shortDescription: String(formData.get('shortDescription')),
      fullDescription: String(formData.get('fullDescription')),
      isFeatured: formData.get('isFeatured') === 'on',
      published: true,
      scopeOfWork: String(formData.get('scopeOfWork') || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      equipmentSupplied: String(formData.get('equipmentSupplied') || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    }

    try {
      if (editingProject) {
        await api.adminUpdateProject(editingProject._id, payload)
        toast.success('Project updated successfully.')
      } else {
        await api.adminCreateProject(payload)
        toast.success('New project created.')
      }
      setShowProjectModal(false)
      setEditingProject(null)
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving project')
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await api.adminDeleteProject(id)
      toast.success('Project removed.')
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  // ============================================================================
  // PRODUCT CRUD HANDLERS
  // ============================================================================
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const isConsumable = formData.get('isConsumable') === 'on'
    const primaryImg = String(formData.get('primaryImage') || '/images/services/service-1-tech.jpg').trim()
    const rawGallery = String(formData.get('galleryImages') || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const galleryImages = rawGallery.length > 0 ? rawGallery : [primaryImg]
    const compatibleSlugs = String(formData.get('compatibleProductSlugs') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const brochure = String(formData.get('brochureUrl') || '').trim()

    const payload: Partial<ApiProduct> = {
      name: String(formData.get('name')),
      modelNumber: String(formData.get('modelNumber')),
      brand: String(formData.get('brand')),
      category: String(formData.get('category')),
      shortDescription: String(formData.get('shortDescription')),
      fullOverview: String(formData.get('fullOverview')),
      isConsumable,
      productType: isConsumable ? 'Consumable' : 'Technology',
      primaryImage: primaryImg,
      galleryImages,
      datasheetUrl: brochure,
      brochureUrl: brochure,
      compatibleProductSlugs: compatibleSlugs,
      images: {
        primaryCutout: primaryImg,
        contextualGallery: galleryImages,
        altText: String(formData.get('name')),
      },
      published: true,
    }

    try {
      if (editingProduct) {
        await api.adminUpdateProduct(editingProduct._id, payload)
        toast.success('Product updated.')
      } else {
        await api.adminCreateProduct(payload)
        toast.success('Product created.')
      }
      setShowProductModal(false)
      setEditingProduct(null)
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product from catalog?')) return
    try {
      await api.adminDeleteProduct(id)
      toast.success('Product removed.')
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  // ============================================================================
  // ARTICLE CRUD HANDLERS
  // ============================================================================
  const handleSaveArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSavingArticle) return
    const form = e.currentTarget
    const formData = new FormData(form)

    const title = String(formData.get('title') || '').trim()
    const resolvedType = (formData.get('type') || articleType) as 'blog' | 'newsletter'
    const summaryInput = String(formData.get('summary') || '').trim()
    const summary = summaryInput || title
    const rawContent = articleContent.trim() || String(formData.get('content') || '').trim()
    const content =
      resolvedType === 'newsletter'
        ? rawContent || summary || title
        : rawContent || summary
    const pdfUrl = String(formData.get('pdfUrl') || '').trim() || undefined
    const issueNumber = formData.get('issueNumber') ? Number(formData.get('issueNumber')) : undefined
    const quarter = (formData.get('quarter') as 'Q1' | 'Q2' | 'Q3' | 'Q4') || undefined
    const year = formData.get('year') ? Number(formData.get('year')) : undefined

    const rawGallery = String(formData.get('galleryImages') || '')
    const galleryImages = rawGallery
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
    const author = String(formData.get('author') || '').trim() || undefined

    const payload: Partial<ApiArticle> = {
      title,
      type: resolvedType,
      category: String(formData.get('category') || 'Clinical Insights').trim(),
      author,
      summary,
      content,
      coverImage: String(formData.get('coverImage') || '/images/services/service-1-tech.jpg').trim(),
      galleryImages,
      pdfUrl,
      issueNumber,
      quarter,
      year,
      readTimeMinutes: Number(formData.get('readTimeMinutes') || 5),
      published: true,
      publishedDate: formData.get('publishedDate')
        ? new Date(String(formData.get('publishedDate'))).toISOString()
        : (editingArticle?.publishedDate || new Date().toISOString()),
    }

    setIsSavingArticle(true)
    try {
      if (editingArticle) {
        await api.adminUpdateArticle(editingArticle._id, payload)
        toast.success(resolvedType === 'newsletter' ? 'Newsletter updated.' : 'Article updated.')
      } else {
        await api.adminCreateArticle(payload)
        toast.success(resolvedType === 'newsletter' ? 'Newsletter published.' : 'Article published.')
      }
      setShowArticleModal(false)
      setEditingArticle(null)
      setArticleContent('')
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving article')
    } finally {
      setIsSavingArticle(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Delete this article?')) return
    try {
      await api.adminDeleteArticle(id)
      toast.success('Article deleted.')
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  // ============================================================================
  // NEWSLETTER HANDLERS
  // ============================================================================
  const handleSaveCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const payload: Partial<ApiNewsletterCampaign> = {
      title: String(formData.get('title')),
      subject: String(formData.get('subject')),
      issueNumber: Number(formData.get('issueNumber')),
      quarter: formData.get('quarter') as 'Q1' | 'Q2' | 'Q3' | 'Q4',
      year: Number(formData.get('year')),
      summary: String(formData.get('summary')),
      content: String(formData.get('content')),
      coverImage: String(formData.get('coverImage') || '/images/services/service-1-tech.jpg'),
      pdfUrl: String(formData.get('pdfUrl') || ''),
      status: 'draft',
      published: false,
    }

    try {
      await api.adminCreateCampaign(payload)
      toast.success('Newsletter campaign draft created.')
      setShowCampaignModal(false)
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving campaign')
    }
  }

  const handleSendCampaign = async (id: string) => {
    if (!window.confirm(`Broadcast this newsletter issue to all active subscribers?`)) return
    try {
      const res = await api.adminSendCampaign(id)
      toast.success(res.message)
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send campaign')
    }
  }

  const handleUploadMediaFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetInputId: string,
    fieldNameKey: string
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(fieldNameKey)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const fileData = reader.result as string
        const res = await api.adminUploadMedia({
          fileName: file.name,
          fileData,
          mimeType: file.type,
        })
        if (res?.url) {
          const targetEl = document.getElementById(targetInputId) as HTMLInputElement
          if (targetEl) {
            targetEl.value = res.url
          }
          toast.success(`Uploaded: ${file.name}`)
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Upload failed.')
      } finally {
        setUploadingField(null)
      }
    }
    reader.readAsDataURL(file)
  }

  // ============================================================================
  // ADMIN USER MANAGEMENT (SUPERADMIN ONLY)
  // ============================================================================
  const handleCreateAdminUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      password: String(formData.get('password')),
      role: formData.get('role') as 'superadmin' | 'admin' | 'editor',
    }

    try {
      const res = await api.adminCreateUser(payload)
      toast.success(res.message)
      setShowAdminUserModal(false)
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create administrator')
    }
  }

  const handleDeleteAdminUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this administrator?')) return
    try {
      await api.adminDeleteUser(id)
      toast.success('Administrator removed.')
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleToggleAdminStatus = async (user: ApiAdminUser) => {
    try {
      await api.adminUpdateUser(user._id, { isActive: !user.isActive })
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}.`)
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    }
  }

  // ============================================================================
  // RFQ & TICKET STATUS UPDATES
  // ============================================================================
  const handleUpdateRfqStatus = async (id: string, status: string) => {
    try {
      await api.adminUpdateRfq(id, { status })
      toast.success(`RFQ status updated to ${status}.`)
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update RFQ')
    }
  }

  const handleUpdateTicketStatus = async (id: string, status: string) => {
    try {
      await api.adminUpdateTicket(id, { status })
      toast.success(`Ticket status updated to ${status}.`)
      fetchAllData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update ticket')
    }
  }

  const isSuperAdmin = currentUser?.role === 'superadmin'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-sudabelt-navy text-white h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 group">
            <span className="font-extrabold text-lg text-white tracking-tight">
              Sudabelt<span className="text-sudabelt-green">CRM</span>
            </span>
          </a>
          <span className="text-xs bg-white/10 text-gray-300 px-2.5 py-0.5 rounded-full font-mono">
            v1.2 Medical Core
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="text-right">
              <p className="text-xs font-bold text-white leading-tight">
                {currentUser?.name || 'Admin'}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.2 rounded-full ${
                    isSuperAdmin
                      ? 'bg-sudabelt-green text-white'
                      : 'bg-sudabelt-blue text-white'
                  }`}
                >
                  {currentUser?.role || 'admin'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-sudabelt-border flex flex-col shrink-0">
          <div className="p-4 border-b border-sudabelt-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CRM..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-sudabelt-border focus:ring-1 focus:ring-sudabelt-green focus:border-sudabelt-green"
              />
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-sudabelt-green-tint text-sudabelt-green'
                  : 'text-sudabelt-navy hover:bg-sudabelt-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & KPIs</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'projects'
                  ? 'bg-sudabelt-green-tint text-sudabelt-green'
                  : 'text-sudabelt-navy hover:bg-sudabelt-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4" />
                <span>Projects Manager</span>
              </div>
              <span className="text-[11px] font-mono bg-sudabelt-surface px-2 py-0.5 rounded-full text-sudabelt-muted">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'products'
                  ? 'bg-sudabelt-green-tint text-sudabelt-green'
                  : 'text-sudabelt-navy hover:bg-sudabelt-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products & Catalog</span>
              </div>
              <span className="text-[11px] font-mono bg-sudabelt-surface px-2 py-0.5 rounded-full text-sudabelt-muted">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'articles'
                  ? 'bg-sudabelt-green-tint text-sudabelt-green'
                  : 'text-sudabelt-navy hover:bg-sudabelt-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Blog & Insights</span>
              </div>
              <span className="text-[11px] font-mono bg-sudabelt-surface px-2 py-0.5 rounded-full text-sudabelt-muted">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('newsletters')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'newsletters'
                  ? 'bg-sudabelt-green-tint text-sudabelt-green'
                  : 'text-sudabelt-navy hover:bg-sudabelt-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Newsletter Subscribers</span>
              </div>
              <span className="text-[11px] font-mono bg-sudabelt-surface px-2 py-0.5 rounded-full text-sudabelt-muted">
                {subscribers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'leads'
                  ? 'bg-sudabelt-green-tint text-sudabelt-green'
                  : 'text-sudabelt-navy hover:bg-sudabelt-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4" />
                <span>Generated Leads</span>
              </div>
              <span className="text-[11px] font-mono bg-sudabelt-surface px-2 py-0.5 rounded-full text-sudabelt-muted">
                {leads.length}
              </span>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Operations & Inquiries
            </div>

            <button
              onClick={() => setActiveTab('rfqs')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'rfqs'
                  ? 'bg-sudabelt-green-tint text-sudabelt-green'
                  : 'text-sudabelt-navy hover:bg-sudabelt-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4" />
                <span>RFQ Quotations</span>
              </div>
              <span className="text-[11px] font-mono bg-sudabelt-surface px-2 py-0.5 rounded-full text-sudabelt-muted">
                {rfqs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-sudabelt-green-tint text-sudabelt-green'
                  : 'text-sudabelt-navy hover:bg-sudabelt-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4" />
                <span>Support Tickets</span>
              </div>
              <span className="text-[11px] font-mono bg-sudabelt-surface px-2 py-0.5 rounded-full text-sudabelt-muted">
                {tickets.length}
              </span>
            </button>

            {/* SUPER ADMIN ONLY TAB */}
            {isSuperAdmin && (
              <>
                <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-sudabelt-green">
                  Security & Access
                </div>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'team'
                      ? 'bg-sudabelt-green-tint text-sudabelt-green'
                      : 'text-sudabelt-navy hover:bg-sudabelt-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-sudabelt-green" />
                    <span>Manage Admins</span>
                  </div>
                  <span className="text-[10px] font-mono bg-sudabelt-green text-white px-2 py-0.5 rounded-full">
                    SUPER
                  </span>
                </button>
              </>
            )}
          </nav>

          <div className="p-3 border-t border-sudabelt-border bg-slate-50">
            <button
              onClick={fetchAllData}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-sudabelt-muted hover:text-sudabelt-navy transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh CRM Sync</span>
            </button>
          </div>
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* ================================================================= */}
          {/* TAB 1: OVERVIEW & KPIS */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold text-sudabelt-navy tracking-tight">
                  Medical Infrastructure Control Hub
                </h1>
                <p className="text-xs text-sudabelt-muted mt-1">
                  Real-time CRM status, inventory catalogue, and client procurement streams.
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-sudabelt-border shadow-xs">
                  <div className="flex items-center justify-between text-sudabelt-muted text-xs font-semibold">
                    <span>Turnkey Projects</span>
                    <FolderKanban className="w-4 h-4 text-sudabelt-green" />
                  </div>
                  <p className="text-2xl font-extrabold text-sudabelt-navy mt-2">
                    {projects.length}
                  </p>
                  <span className="text-[11px] text-sudabelt-green font-medium">
                    {projects.filter((p) => p.isFeatured).length} Featured on site
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-sudabelt-border shadow-xs">
                  <div className="flex items-center justify-between text-sudabelt-muted text-xs font-semibold">
                    <span>Clinical Products</span>
                    <Package className="w-4 h-4 text-sudabelt-blue" />
                  </div>
                  <p className="text-2xl font-extrabold text-sudabelt-navy mt-2">
                    {products.length}
                  </p>
                  <span className="text-[11px] text-sudabelt-muted font-medium">
                    Equipment & Consumables
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-sudabelt-border shadow-xs">
                  <div className="flex items-center justify-between text-sudabelt-muted text-xs font-semibold">
                    <span>Active Subscribers</span>
                    <Mail className="w-4 h-4 text-sudabelt-green" />
                  </div>
                  <p className="text-2xl font-extrabold text-sudabelt-navy mt-2">
                    {subscribers.length}
                  </p>
                  <span className="text-[11px] text-sudabelt-muted font-medium">
                    {campaigns.filter((c) => c.status === 'sent').length} Broadcasts sent
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-sudabelt-border shadow-xs">
                  <div className="flex items-center justify-between text-sudabelt-muted text-xs font-semibold">
                    <span>Pending RFQs</span>
                    <ClipboardList className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-extrabold text-sudabelt-navy mt-2">
                    {rfqs.filter((r) => r.status === 'pending').length}
                  </p>
                  <span className="text-[11px] text-amber-600 font-medium">
                    Awaiting quotation review
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent RFQs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-sudabelt-border shadow-xs">
                  <h2 className="text-base font-bold text-sudabelt-navy mb-4">
                    Recent Hospital RFQ Inquiries
                  </h2>
                  {rfqs.length === 0 ? (
                    <p className="text-xs text-sudabelt-muted py-6 text-center">No RFQs submitted yet.</p>
                  ) : (
                    <div className="divide-y divide-sudabelt-border">
                      {rfqs.slice(0, 4).map((r) => (
                        <div key={r._id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-sudabelt-navy">{r.facilityName}</p>
                            <p className="text-[11px] text-sudabelt-muted">{r.contact.name} · {r.location.city}, {r.location.state}</p>
                          </div>
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                            r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-sudabelt-border shadow-xs">
                  <h2 className="text-base font-bold text-sudabelt-navy mb-4">
                    Quick CRM Actions
                  </h2>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setEditingProject(null)
                        setShowProjectModal(true)
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-sudabelt-surface hover:bg-sudabelt-green-tint/60 text-xs font-bold text-sudabelt-navy transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-sudabelt-green" /> Add Turnkey Project
                      </span>
                      <span className="text-[10px] text-sudabelt-muted">CMS</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingProduct(null)
                        setShowProductModal(true)
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-sudabelt-surface hover:bg-sudabelt-green-tint/60 text-xs font-bold text-sudabelt-navy transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-sudabelt-green" /> Add Medical Equipment / SKU
                      </span>
                      <span className="text-[10px] text-sudabelt-muted">Catalog</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingArticle(null)
                        setArticleContent('')
                        setArticleType('blog')
                        setShowArticleModal(true)
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-sudabelt-surface hover:bg-sudabelt-green-tint/60 text-xs font-bold text-sudabelt-navy transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-sudabelt-green" /> Publish Insight / Article
                      </span>
                      <span className="text-[10px] text-sudabelt-muted">Blog</span>
                    </button>

                    <button
                      onClick={() => setShowCampaignModal(true)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-sudabelt-surface hover:bg-sudabelt-green-tint/60 text-xs font-bold text-sudabelt-navy transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sudabelt-green" /> Draft Newsletter Campaign
                      </span>
                      <span className="text-[10px] text-sudabelt-muted">Broadcast</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: PROJECTS MANAGER */}
          {/* ================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-sudabelt-navy">
                    Turnkey Projects CMS
                  </h1>
                  <p className="text-xs text-sudabelt-muted mt-0.5">
                    Manage completed landmark installations, dialysis units, and oxygen plants shown on the Projects page.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject(null)
                    setShowProjectModal(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-sudabelt-green hover:bg-sudabelt-green-dark text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add New Project
                </button>
              </div>

              {/* Projects Table */}
              <div className="bg-white rounded-2xl border border-sudabelt-border shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-sudabelt-border text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Project / Facility</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Year</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sudabelt-border">
                    {projects.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.heroImage}
                              alt={p.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                              onError={(e) => {
                                ;(e.target as HTMLElement).style.display = 'none'
                              }}
                            />
                            <div>
                              <p className="font-bold text-sudabelt-navy">{p.title}</p>
                              <p className="text-[11px] text-sudabelt-muted">{p.facilityName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-sudabelt-green-tint text-sudabelt-green font-semibold px-2 py-0.5 rounded-full text-[10px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-sudabelt-body">
                          {p.city || p.locationState}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-sudabelt-navy">
                          {p.completionYear}
                        </td>
                        <td className="py-3.5 px-4">
                          {p.isFeatured ? (
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              Featured
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProject(p)
                                setShowProjectModal(true)
                              }}
                              className="p-1.5 text-sudabelt-navy hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: PRODUCTS & CATALOG */}
          {/* ================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-sudabelt-navy">
                    Products & Equipment Catalogue
                  </h1>
                  <p className="text-xs text-sudabelt-muted mt-0.5">
                    Manage medical devices, reagents, and consumables available for hospital RFQs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setShowProductModal(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-sudabelt-green hover:bg-sudabelt-green-dark text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-sudabelt-border shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-sudabelt-border text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Brand</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sudabelt-border">
                    {products.map((pr) => (
                      <tr key={pr._id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-sudabelt-navy">{pr.name}</p>
                          <p className="text-[11px] font-mono text-sudabelt-muted">
                            Model: {pr.modelNumber}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-sudabelt-navy">
                          {pr.brand}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                            {pr.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pr.isConsumable
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {pr.isConsumable ? 'Consumable' : 'Equipment'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(pr)
                                setShowProductModal(true)
                              }}
                              className="p-1.5 text-sudabelt-navy hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(pr._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: BLOG & INSIGHTS */}
          {/* ================================================================= */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-sudabelt-navy">
                    Articles & Clinical Blog
                  </h1>
                  <p className="text-xs text-sudabelt-muted mt-0.5">
                    Publish thought leadership, engineering case studies, and clinical guides.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingArticle(null)
                    setArticleContent('')
                    setArticleType('blog')
                    setShowArticleModal(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-sudabelt-green hover:bg-sudabelt-green-dark text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> Publish Article
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-sudabelt-border shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-sudabelt-border text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Read Time</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sudabelt-border">
                    {articles.map((a) => (
                      <tr key={a._id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-sudabelt-navy max-w-md">
                          {a.title}
                        </td>
                        <td className="py-3.5 px-4 text-sudabelt-muted">
                          {a.category}
                        </td>
                        <td className="py-3.5 px-4 uppercase font-mono font-bold text-[10px] text-sudabelt-green">
                          {a.type}
                        </td>
                        <td className="py-3.5 px-4 text-sudabelt-body">
                          {a.readTimeMinutes || 5} mins
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingArticle(a)
                                setArticleContent(a.content || '')
                                setArticleType(a.type || 'blog')
                                setShowArticleModal(true)
                              }}
                              className="p-1.5 text-sudabelt-navy hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(a._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
          {/* ================================================================= */}
          {activeTab === 'newsletters' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-sudabelt-navy">
                    Newsletter Subscribers &amp; Broadcasts
                  </h1>
                  <p className="text-xs text-sudabelt-muted mt-0.5">
                    Subscribers captured through the website footer and newsletter archive.
                  </p>
                </div>
                <button
                  onClick={() => setShowCampaignModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-sudabelt-green hover:bg-sudabelt-green-dark text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> New Campaign Broadcast
                </button>
              </div>

              {/* Campaigns / Issues Grid */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-sudabelt-navy mb-3">
                  Newsletter Issues & Broadcasts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((c) => (
                    <div key={c._id} className="p-5 bg-white rounded-2xl border border-sudabelt-border shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold bg-sudabelt-surface text-sudabelt-navy px-2 py-0.5 rounded-full">
                          Issue #{c.issueNumber} · {c.quarter || 'Q1'} {c.year}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          c.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-sudabelt-navy">{c.title}</h3>
                      <p className="text-xs text-sudabelt-muted mt-1 line-clamp-2">{c.summary}</p>

                      <div className="mt-4 pt-3 border-t border-sudabelt-border flex items-center justify-between">
                        <span className="text-[11px] text-sudabelt-muted">
                          {c.recipientCount ? `${c.recipientCount} recipients` : 'Not sent yet'}
                        </span>
                        {c.status !== 'sent' && (
                          <button
                            onClick={() => handleSendCampaign(c._id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-sudabelt-green hover:bg-sudabelt-green-dark px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Send className="w-3 h-3" /> Send Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscriber Roster */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-sudabelt-navy">
                    Registered Subscribers ({subscribers.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        exportToCSV(
                          'sudabelt-newsletter-subscribers.csv',
                          ['Email Address', 'Source', 'Date Subscribed'],
                          subscribers.map((s) => [
                            s.email,
                            s.source || 'website_footer',
                            s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
                          ])
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-sudabelt-border hover:border-sudabelt-navy text-xs font-bold text-sudabelt-navy transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-sudabelt-green" /> Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        exportToPDF(
                          'sudabelt-newsletter-subscribers.pdf',
                          'Newsletter Subscribers Report',
                          'Registered website & campaign subscribers',
                          ['Email Address', 'Source', 'Date Subscribed'],
                          subscribers.map((s) => [
                            s.email,
                            s.source || 'website_footer',
                            s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
                          ])
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sudabelt-navy hover:bg-sudabelt-green text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-sudabelt-border shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-sudabelt-border text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Email Address</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Date Subscribed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sudabelt-border">
                      {subscribers.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 px-4 text-center text-sudabelt-muted">
                            No newsletter subscribers yet.
                          </td>
                        </tr>
                      ) : (
                        subscribers.map((s) => (
                          <tr key={s._id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-mono font-semibold text-sudabelt-navy">
                              {s.email}
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-medium">
                                {s.source || 'website_footer'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sudabelt-muted">
                              {s.subscribedAt
                                ? new Date(s.subscribedAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5B: GENERATED LEADS (LEAD MAGNET CAPTURES) */}
          {/* ================================================================= */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-extrabold text-sudabelt-navy">
                  Generated Leads
                </h1>
                <p className="text-xs text-sudabelt-muted mt-0.5">
                  Tracks exact origin (Company Handbook, Product Datasheet, Newsletter) for targeted outreach.
                </p>
              </div>

              {/* Lead Magnet Captures (Gated Document Downloads for Targeted Cold Emails) */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-sudabelt-navy">
                      Lead Magnet Captures ({leads.filter((l) => leadSourceFilter === 'All' || (l.leadSource || 'Technical Document') === leadSourceFilter).length})
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={leadSourceFilter}
                      onChange={(e) => setLeadSourceFilter(e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border border-sudabelt-border bg-white text-sudabelt-navy"
                    >
                      <option value="All">All Lead Sources</option>
                      <option value="Company Handbook">Company Handbook</option>
                      <option value="Product Datasheet">Product Datasheet</option>
                      <option value="Newsletter">Newsletter</option>
                      <option value="Technical Document">Technical Document</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const filtered = leads.filter(
                          (l) => leadSourceFilter === 'All' || (l.leadSource || 'Technical Document') === leadSourceFilter
                        )
                        exportToCSV(
                          'sudabelt-lead-magnets.csv',
                          ['Work Email', 'Name', 'Organization', 'Lead Source', 'Downloaded Document', 'Date'],
                          filtered.map((l) => [
                            l.workEmail,
                            l.name,
                            l.facilityName,
                            l.leadSource || 'Technical Document',
                            l.downloadedAssetTitle || l.downloadedAssetSlug,
                            l.downloadedAt ? new Date(l.downloadedAt).toLocaleDateString('en-GB') : '',
                          ])
                        )
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-sudabelt-border hover:border-sudabelt-navy text-xs font-bold text-sudabelt-navy transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-sudabelt-green" /> Export CSV
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const filtered = leads.filter(
                          (l) => leadSourceFilter === 'All' || (l.leadSource || 'Technical Document') === leadSourceFilter
                        )
                        exportToPDF(
                          'sudabelt-lead-magnets.pdf',
                          'Lead Magnet Captures Report',
                          `Source Filter: ${leadSourceFilter}`,
                          ['Work Email', 'Name', 'Organization', 'Lead Source', 'Downloaded Document', 'Date'],
                          filtered.map((l) => [
                            l.workEmail,
                            l.name,
                            l.facilityName,
                            l.leadSource || 'Technical Document',
                            l.downloadedAssetTitle || l.downloadedAssetSlug,
                            l.downloadedAt ? new Date(l.downloadedAt).toLocaleDateString('en-GB') : '',
                          ])
                        )
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sudabelt-navy hover:bg-sudabelt-green text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-sudabelt-border shadow-xs overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-sudabelt-border text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Organization</th>
                        <th className="py-3 px-4">Lead Magnet Source</th>
                        <th className="py-3 px-4">Exact Document / Item</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sudabelt-border">
                      {leads
                        .filter((l) => leadSourceFilter === 'All' || (l.leadSource || 'Technical Document') === leadSourceFilter)
                        .map((l) => (
                          <tr key={l._id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4">
                              <div className="font-bold text-sudabelt-navy">{l.name}</div>
                              <div className="font-mono text-[11px] text-sudabelt-blue">{l.workEmail}</div>
                            </td>
                            <td className="py-3 px-4 text-sudabelt-body font-medium">{l.facilityName}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  l.leadSource === 'Company Handbook'
                                    ? 'bg-purple-100 text-purple-800'
                                    : l.leadSource === 'Newsletter'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {l.leadSource || 'Product Datasheet'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sudabelt-navy font-semibold">
                              {l.downloadedAssetTitle || l.downloadedAssetSlug}
                            </td>
                            <td className="py-3 px-4 text-sudabelt-muted font-mono text-[11px]">
                              {l.downloadedAt ? new Date(l.downloadedAt).toLocaleDateString('en-GB') : '-'}
                            </td>
                          </tr>
                        ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-sudabelt-muted">
                            No gated document downloads captured yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: RFQ QUOTATIONS */}
          {/* ================================================================= */}
          {activeTab === 'rfqs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-sudabelt-navy">
                    RFQ Quotation Stream
                  </h1>
                  <p className="text-xs text-sudabelt-muted mt-0.5">
                    Procurement bids and equipment line items submitted by clinics and hospitals.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      exportToCSV(
                        'sudabelt-rfq-quotations.csv',
                        ['Reference ID', 'Facility Name', 'Facility Type', 'Location', 'Urgency', 'Status', 'Contact Name', 'Role', 'Email', 'Phone', 'Requested Items'],
                        rfqs.map((r) => [
                          r.referenceId,
                          r.facilityName,
                          r.facilityType,
                          `${r.location.city}, ${r.location.state}`,
                          r.urgency,
                          r.status,
                          r.contact.name,
                          r.contact.role,
                          r.contact.email,
                          r.contact.phone,
                          r.selectedItems?.map((it) => `${it.quantity}x ${it.name}`).join('; ') || '',
                        ])
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-sudabelt-border hover:border-sudabelt-navy text-xs font-bold text-sudabelt-navy transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-sudabelt-green" /> Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      exportToPDF(
                        'sudabelt-rfq-quotations.pdf',
                        'RFQ Quotations Report',
                        'Institutional Request for Quote submissions',
                        ['Reference ID', 'Facility', 'Location', 'Urgency', 'Status', 'Contact', 'Requested Items'],
                        rfqs.map((r) => [
                          r.referenceId,
                          `${r.facilityName} (${r.facilityType})`,
                          `${r.location.city}, ${r.location.state}`,
                          r.urgency,
                          r.status,
                          `${r.contact.name} - ${r.contact.phone} - ${r.contact.email}`,
                          r.selectedItems?.map((it) => `${it.quantity}x ${it.name}`).join('; ') || '',
                        ])
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sudabelt-navy hover:bg-sudabelt-green text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export PDF
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {rfqs.map((r) => (
                  <div key={r._id} className="bg-white p-6 rounded-2xl border border-sudabelt-border shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sudabelt-border gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-sudabelt-green bg-sudabelt-green-tint px-2.5 py-0.5 rounded-full">
                          {r.referenceId}
                        </span>
                        <h2 className="text-base font-extrabold text-sudabelt-navy mt-1.5">{r.facilityName}</h2>
                        <p className="text-xs text-sudabelt-muted">{r.facilityType} · {r.location.city}, {r.location.state}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateRfqStatus(r._id, e.target.value)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-sudabelt-border bg-white text-sudabelt-navy"
                        >
                          <option value="pending">Pending</option>
                          <option value="quoted">Quoted</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="py-4 border-b border-sudabelt-border">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Requested Equipment</p>
                      <ul className="space-y-1.5">
                        {r.selectedItems?.map((it, idx) => (
                          <li key={idx} className="text-xs text-sudabelt-body flex items-center justify-between bg-slate-50 p-2.5 rounded-lg">
                            <span className="font-semibold text-sudabelt-navy">{it.name}</span>
                            <span className="font-mono text-sudabelt-green font-bold">Qty: {it.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 text-xs text-sudabelt-muted flex items-center justify-between">
                      <span>Contact: <strong>{r.contact.name}</strong> ({r.contact.role}) · {r.contact.phone} · {r.contact.email}</span>
                      <span>Urgency: <strong>{r.urgency}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: SUPPORT TICKETS & INQUIRIES */}
          {/* ================================================================= */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-sudabelt-navy">
                    Support Tickets, Training Requests &amp; Inquiries
                  </h1>
                  <p className="text-xs text-sudabelt-muted mt-0.5">
                    Differentiated after-sales repairs, biomedical training bookings, and contact inquiries.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const filteredTickets = tickets.filter((t) => {
                        if (ticketCategory === 'all') return true
                        if (ticketCategory === 'after_sales') return t.ticketType === 'after_sales' || !t.ticketType
                        return t.ticketType === ticketCategory
                      })
                      exportToCSV(
                        'sudabelt-support-tickets.csv',
                        ['Ticket ID', 'Type', 'Institution / Hospital', 'Subject / Model', 'Status', 'Urgency', 'Contact Name', 'Email', 'Phone', 'Description'],
                        filteredTickets.map((t) => [
                          t.ticketId,
                          t.ticketType || 'after_sales',
                          t.hospitalName,
                          t.equipmentModel,
                          t.status,
                          t.urgencyLevel,
                          t.contactName,
                          t.email || '',
                          t.phone,
                          t.description,
                        ])
                      )
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-sudabelt-border hover:border-sudabelt-navy text-xs font-bold text-sudabelt-navy transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-sudabelt-green" /> Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const filteredTickets = tickets.filter((t) => {
                        if (ticketCategory === 'all') return true
                        if (ticketCategory === 'after_sales') return t.ticketType === 'after_sales' || !t.ticketType
                        return t.ticketType === ticketCategory
                      })
                      exportToPDF(
                        'sudabelt-support-tickets.pdf',
                        'Support, Training & Contact Inquiries Report',
                        `Filter: ${ticketCategory}`,
                        ['Ticket ID', 'Type', 'Institution', 'Subject / Model', 'Status', 'Contact', 'Details'],
                        filteredTickets.map((t) => [
                          t.ticketId,
                          t.ticketType || 'after_sales',
                          t.hospitalName,
                          t.equipmentModel,
                          t.status,
                          `${t.contactName} (${t.phone}${t.email ? `, ${t.email}` : ''})`,
                          t.description,
                        ])
                      )
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sudabelt-navy hover:bg-sudabelt-green text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export PDF
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTicketCategory('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    ticketCategory === 'all'
                      ? 'bg-sudabelt-navy text-white shadow-xs'
                      : 'bg-white border border-sudabelt-border text-sudabelt-navy hover:bg-slate-50'
                  }`}
                >
                  All Inquiries ({tickets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTicketCategory('after_sales')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    ticketCategory === 'after_sales'
                      ? 'bg-sudabelt-green text-white shadow-xs'
                      : 'bg-white border border-sudabelt-border text-sudabelt-navy hover:bg-slate-50'
                  }`}
                >
                  🛠️ After-Sales &amp; Breakdown ({tickets.filter((t) => t.ticketType === 'after_sales' || !t.ticketType).length})
                </button>
                <button
                  type="button"
                  onClick={() => setTicketCategory('training')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    ticketCategory === 'training'
                      ? 'bg-sudabelt-blue text-white shadow-xs'
                      : 'bg-white border border-sudabelt-border text-sudabelt-navy hover:bg-slate-50'
                  }`}
                >
                  🎓 Clinical Training ({tickets.filter((t) => t.ticketType === 'training').length})
                </button>
                <button
                  type="button"
                  onClick={() => setTicketCategory('contact')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    ticketCategory === 'contact'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-sudabelt-border text-sudabelt-navy hover:bg-slate-50'
                  }`}
                >
                  ✉️ Contact Form ({tickets.filter((t) => t.ticketType === 'contact').length})
                </button>
              </div>

              <div className="space-y-4">
                {tickets
                  .filter((t) => {
                    if (ticketCategory === 'all') return true
                    if (ticketCategory === 'after_sales') return t.ticketType === 'after_sales' || !t.ticketType
                    return t.ticketType === ticketCategory
                  })
                  .map((t) => {
                    const isTraining = t.ticketType === 'training'
                    const isContact = t.ticketType === 'contact'
                    const isAfterSales = !isTraining && !isContact

                    return (
                      <div key={t._id} className="bg-white p-6 rounded-2xl border border-sudabelt-border shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sudabelt-border gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-mono font-bold text-sudabelt-blue bg-sudabelt-blue/10 px-2.5 py-0.5 rounded-full">
                                {t.unifiedId || t.ticketId}
                              </span>

                              {isAfterSales && (
                                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  🛠️ {t.displayType || 'After-Sales Service'}
                                </span>
                              )}

                              {isTraining && (
                                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                  🎓 Clinical Training Booking
                                </span>
                              )}

                              {isContact && (
                                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                                  ✉️ Contact Inquiry
                                </span>
                              )}

                              {t.urgencyLevel && (
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  t.urgencyLevel === 'critical_patient_impact'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {t.urgencyLevel.replace(/_/g, ' ')}
                                </span>
                              )}
                            </div>

                            <h2 className="text-base font-extrabold text-sudabelt-navy mt-1.5">
                              {t.hospitalName || t.institutionName || t.facilityName || 'Healthcare Institution'}
                            </h2>

                            {isAfterSales && t.equipmentModel && (
                              <p className="text-xs text-sudabelt-muted">
                                Equipment: <strong>{t.equipmentModel}</strong> {t.serialNumber ? `(S/N: ${t.serialNumber})` : ''}
                              </p>
                            )}

                            {isTraining && t.courseTrack && (
                              <p className="text-xs text-sudabelt-blue font-semibold">
                                Track: {t.courseTrack} • {t.numberOfTrainees || 1} Trainees
                              </p>
                            )}
                          </div>

                          <select
                            value={t.status}
                            onChange={(e) => handleUpdateTicketStatus(t._id, e.target.value)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-sudabelt-border bg-white text-sudabelt-navy self-start"
                          >
                            <option value="open">Open / New</option>
                            <option value="in_progress">In Progress / Responded</option>
                            <option value="resolved">Resolved / Completed</option>
                            <option value="closed">Closed / Archived</option>
                          </select>
                        </div>

                        <div className="py-3 text-xs text-sudabelt-body">
                          <p className="font-semibold text-sudabelt-navy mb-1">Inquiry / Case Summary:</p>
                          <p className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {t.description || 'No additional notes provided.'}
                          </p>
                        </div>

                        <div className="pt-2 text-xs text-sudabelt-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span>
                            Contact: <strong>{t.contactName || t.contactPerson}</strong>
                            {t.phone ? ` · ${t.phone}` : ''}
                            {t.email ? ` · ${t.email}` : ''}
                          </span>
                          <span>
                            Location: <strong>{t.locationState || t.targetHospitalState || 'Nigeria'}</strong>
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: TEAM & ADMIN MANAGEMENT (SUPERADMIN ONLY) */}
          {/* ================================================================= */}
          {activeTab === 'team' && isSuperAdmin && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-sudabelt-green" />
                    <h1 className="text-xl font-extrabold text-sudabelt-navy">
                      Administrator Roster & Role Permissions
                    </h1>
                  </div>
                  <p className="text-xs text-sudabelt-muted mt-0.5">
                    Exclusive to Superadmin. Create new administrators, assign roles, and manage system access.
                  </p>
                </div>
                <button
                  onClick={() => setShowAdminUserModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-sudabelt-green hover:bg-sudabelt-green-dark text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <UserPlus className="w-4 h-4" /> Create New Admin
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-sudabelt-border shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-sudabelt-border text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sudabelt-border">
                    {adminUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-sudabelt-navy">
                          {u.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-sudabelt-muted">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              u.role === 'superadmin'
                                ? 'bg-sudabelt-green text-white'
                                : u.role === 'admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleAdminStatus(u)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {u.isActive ? 'Active' : 'Suspended'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {u.email !== currentUser?.email && (
                            <button
                              onClick={() => handleDeleteAdminUser(u._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ===================================================================== */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-sudabelt-border mb-4">
              <h3 className="text-base font-bold text-sudabelt-navy">
                {editingProject ? 'Edit Project' : 'Create New Turnkey Project'}
              </h3>
              <button onClick={() => setShowProjectModal(false)} className="p-1 text-gray-400 hover:text-sudabelt-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Project Title</label>
                <input
                  name="title"
                  defaultValue={editingProject?.title}
                  required
                  placeholder="e.g. Asokoro General Hospital Dialysis Centre"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingProject?.category || 'Dialysis & renal'}
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  >
                    <option value="Dialysis & renal">Dialysis & renal</option>
                    <option value="Oxygen & medical gas">Oxygen & medical gas</option>
                    <option value="Imaging & diagnostics">Imaging & diagnostics</option>
                    <option value="Hospital equipping">Hospital equipping</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Completion Year</label>
                  <input
                    type="number"
                    name="completionYear"
                    defaultValue={editingProject?.completionYear || 2023}
                    required
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Facility Name</label>
                  <input
                    name="facilityName"
                    defaultValue={editingProject?.facilityName}
                    required
                    placeholder="e.g. Asokoro District Hospital"
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">State / Location</label>
                  <input
                    name="locationState"
                    defaultValue={editingProject?.locationState || 'Abuja'}
                    required
                    placeholder="e.g. Abuja"
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-sudabelt-navy">Hero Image (URL or Upload)</label>
                  <label className="text-[11px] font-bold text-sudabelt-blue hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {uploadingField === 'project-hero' ? 'Uploading...' : 'Upload Image File'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadMediaFile(e, 'project-hero-input', 'project-hero')}
                    />
                  </label>
                </div>
                <input
                  id="project-hero-input"
                  name="heroImage"
                  defaultValue={editingProject?.heroImage || '/images/projects/project-adeboye.webp'}
                  required
                  placeholder="/images/projects/project-adeboye.webp or external URL"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Short Description</label>
                <textarea
                  name="shortDescription"
                  rows={2}
                  defaultValue={editingProject?.shortDescription}
                  required
                  placeholder="Summary of project for cards"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Full Description</label>
                <textarea
                  name="fullDescription"
                  rows={4}
                  defaultValue={editingProject?.fullDescription}
                  required
                  placeholder="Comprehensive engineering and handover details"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Scope of Work (one per line)</label>
                <textarea
                  name="scopeOfWork"
                  rows={3}
                  defaultValue={editingProject?.scopeOfWork?.join('\n')}
                  placeholder="Pre-installation site audit&#10;Equipment installation&#10;Staff certification"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={editingProject?.isFeatured}
                  className="rounded text-sudabelt-green"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-sudabelt-navy">
                  Mark as Featured Project on Homepage / Projects
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sudabelt-border">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl border border-sudabelt-border text-sudabelt-navy font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sudabelt-green hover:bg-sudabelt-green-dark text-white font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ===================================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-sudabelt-border mb-4">
              <h3 className="text-base font-bold text-sudabelt-navy">
                {editingProduct ? 'Edit Product' : 'Add New Clinical Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-gray-400 hover:text-sudabelt-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Product Name</label>
                <input
                  name="name"
                  defaultValue={editingProduct?.name}
                  required
                  placeholder="e.g. Baxter Artis Physio Hemodialysis System"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Brand</label>
                  <input
                    name="brand"
                    defaultValue={editingProduct?.brand || 'Baxter'}
                    required
                    placeholder="e.g. Baxter, GE HealthCare"
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Model Number</label>
                  <input
                    name="modelNumber"
                    defaultValue={editingProduct?.modelNumber}
                    required
                    placeholder="e.g. ARTIS-PHYSIO"
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={editingProduct?.category || 'renal-and-critical-care'}
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                >
                  <option value="imaging-and-life-care">Imaging &amp; Life Care (GE Healthcare)</option>
                  <option value="renal-and-critical-care">Renal &amp; Critical Care (Baxter, SWS Medical)</option>
                  <option value="blood-management-cell-technologies">Blood Management &amp; Cell Technologies (Terumo BCT)</option>
                  <option value="laboratory-and-diagnostics">Laboratory &amp; Diagnostics (Abbott, Maccura)</option>
                  <option value="respiratory-and-neonatal-care">Respiratory &amp; Neonatal Care (Fisher &amp; Paykel)</option>
                  <option value="minimally-invasive-surgery">Minimally Invasive Surgery - MIS (Ezisurg Medical)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Short Description</label>
                <textarea
                  name="shortDescription"
                  rows={2}
                  defaultValue={editingProduct?.shortDescription}
                  required
                  placeholder="Summary for catalog cards"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Full Overview</label>
                <textarea
                  name="fullOverview"
                  rows={4}
                  defaultValue={editingProduct?.fullOverview}
                  required
                  placeholder="Detailed clinical capabilities and applications"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-sudabelt-navy">Primary Product Image (URL or Upload)</label>
                  <label className="text-[11px] font-bold text-sudabelt-blue hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {uploadingField === 'product-img' ? 'Uploading...' : 'Upload Image File'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadMediaFile(e, 'product-img-input', 'product-img')}
                    />
                  </label>
                </div>
                <input
                  id="product-img-input"
                  name="primaryImage"
                  defaultValue={editingProduct?.primaryImage || editingProduct?.images?.primaryCutout || '/images/services/service-1-tech.jpg'}
                  placeholder="URL to primary image or upload above"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">
                  All Product Gallery Image URLs (One URL per line for multi-image carousel)
                </label>
                <textarea
                  name="galleryImages"
                  rows={3}
                  defaultValue={
                    (editingProduct?.galleryImages || editingProduct?.images?.contextualGallery || [])
                      .join('\n')
                  }
                  placeholder="https://res.cloudinary.com/.../image1.png&#10;https://res.cloudinary.com/.../image2.png"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">
                  Compatible Consumable / Product Slugs (Comma-separated)
                </label>
                <input
                  name="compatibleProductSlugs"
                  defaultValue={(editingProduct?.compatibleProductSlugs || []).join(', ')}
                  placeholder="e.g. high-flux-dialyzers, blood-tubing-lines, av-fistula-needles"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border font-mono text-[11px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-sudabelt-navy">Technical Brochure PDF (Optional)</label>
                  <label className="text-[11px] font-bold text-sudabelt-blue hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {uploadingField === 'product-brochure' ? 'Uploading...' : 'Upload PDF'}
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleUploadMediaFile(e, 'product-brochure-input', 'product-brochure')}
                    />
                  </label>
                </div>
                <input
                  id="product-brochure-input"
                  name="brochureUrl"
                  defaultValue={editingProduct?.brochureUrl || editingProduct?.datasheetUrl || ''}
                  placeholder="URL to technical brochure PDF or upload above"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isConsumable"
                  name="isConsumable"
                  defaultChecked={editingProduct?.isConsumable}
                  className="rounded text-sudabelt-green"
                />
                <label htmlFor="isConsumable" className="text-xs font-bold text-sudabelt-navy">
                  Is Consumable / Reagent (Uncheck if capital equipment)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sudabelt-border">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl border border-sudabelt-border text-sudabelt-navy font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sudabelt-green hover:bg-sudabelt-green-dark text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT ARTICLE */}
      {/* ===================================================================== */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-sudabelt-border mb-4">
              <h3 className="text-base font-bold text-sudabelt-navy">
                {editingArticle
                  ? articleType === 'newsletter'
                    ? 'Edit Newsletter Issue'
                    : 'Edit Blog Article'
                  : articleType === 'newsletter'
                  ? 'Publish New Newsletter Issue'
                  : 'Publish New Blog Article'}
              </h3>
              <button
                onClick={() => {
                  setShowArticleModal(false)
                  setEditingArticle(null)
                  setArticleContent('')
                }}
                className="p-1 text-gray-400 hover:text-sudabelt-navy cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Article Title</label>
                <input
                  name="title"
                  defaultValue={editingArticle?.title}
                  required
                  placeholder="e.g. Mitigating Dialysis Machine Downtime in West Africa"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Publication Type</label>
                  <select
                    name="type"
                    value={articleType}
                    onChange={(e) => setArticleType(e.target.value as 'blog' | 'newsletter')}
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border font-bold text-sudabelt-navy bg-white cursor-pointer"
                  >
                    <option value="blog">Clinical Blog / Case Study</option>
                    <option value="newsletter">Quarterly Newsletter Issue</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Category</label>
                  <input
                    name="category"
                    defaultValue={editingArticle?.category || (articleType === 'newsletter' ? 'Clinical Insights' : 'Renal Care')}
                    required
                    placeholder="e.g. Healthcare Infrastructure, Renal Care"
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Publication Date</label>
                  <input
                    type="date"
                    name="publishedDate"
                    defaultValue={editingArticle?.publishedDate ? editingArticle.publishedDate.slice(0, 10) : ''}
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border bg-white text-sudabelt-navy"
                  />
                </div>
              </div>

              {/* Newsletter Specific Fields: Issue #, Quarter, Year, and PDF Document */}
              {articleType === 'newsletter' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-sudabelt-navy mb-1">Issue #</label>
                      <input
                        type="number"
                        name="issueNumber"
                        defaultValue={editingArticle?.issueNumber || articles.filter((a) => a.type === 'newsletter').length + 1}
                        placeholder="e.g. 1"
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-sudabelt-navy mb-1">Quarter</label>
                      <select
                        name="quarter"
                        defaultValue={editingArticle?.quarter || 'Q2'}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-sudabelt-navy mb-1">Year</label>
                      <input
                        type="number"
                        name="year"
                        defaultValue={editingArticle?.year || new Date().getFullYear()}
                        placeholder="2026"
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-sudabelt-navy">
                        Actual Newsletter Document (PDF for Client Download)
                      </label>
                      <label className="text-[11px] font-bold text-sudabelt-blue hover:underline cursor-pointer flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        {uploadingField === 'article-pdf' ? 'Uploading PDF...' : 'Upload PDF Document'}
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handleUploadMediaFile(e, 'article-pdf-input', 'article-pdf')}
                        />
                      </label>
                    </div>
                    <input
                      id="article-pdf-input"
                      name="pdfUrl"
                      defaultValue={editingArticle?.pdfUrl}
                      placeholder="Paste PDF URL or click 'Upload PDF Document' to upload the actual newsletter"
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* Cover Preview Image */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-sudabelt-navy">Preview Cover Image (URL or Upload)</label>
                  <label className="text-[11px] font-bold text-sudabelt-blue hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {uploadingField === 'article-cover' ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadMediaFile(e, 'article-cover-input', 'article-cover')}
                    />
                  </label>
                </div>
                <input
                  id="article-cover-input"
                  name="coverImage"
                  defaultValue={editingArticle?.coverImage || '/images/services/service-1-tech.jpg'}
                  placeholder="URL to cover preview image or upload above"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              {articleType === 'blog' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-sudabelt-navy mb-1">Author Name</label>
                    <input
                      name="author"
                      defaultValue={editingArticle?.author || 'Sudabelt Medical'}
                      placeholder="e.g. Alero Yemiete"
                      className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sudabelt-navy mb-1">
                      Blog Gallery Images (One URL per line)
                    </label>
                    <textarea
                      id="article-gallery-input"
                      name="galleryImages"
                      rows={3}
                      defaultValue={(editingArticle?.galleryImages || []).join('\n')}
                      placeholder="Paste additional image URLs (one per line) to display in the gallery below the blog post..."
                      className="w-full p-2.5 rounded-xl border border-sudabelt-border font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">
                  {articleType === 'newsletter' ? 'Summary / Excerpt (Optional)' : 'Summary / Excerpt'}
                </label>
                <textarea
                  name="summary"
                  rows={2}
                  defaultValue={editingArticle?.summary}
                  required={articleType !== 'newsletter'}
                  placeholder={
                    articleType === 'newsletter'
                      ? 'Optional brief description of this newsletter issue...'
                      : 'Short briefing or executive summary...'
                  }
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              {/* React Quill Rich Text Editor (Blogs only; Newsletters use downloadable PDF) */}
              {articleType !== 'newsletter' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-sudabelt-navy">
                      Article Body Content (Visual Rich Text Editor)
                    </label>
                    <span className="text-[10px] text-sudabelt-muted">
                      Format with headings, lists, bold text, links, and quotes
                    </span>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden border border-sudabelt-border">
                    <ReactQuill
                      theme="snow"
                      value={articleContent}
                      onChange={setArticleContent}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Write and visually format your article or clinical briefing with headings, bullet points, numbered lists, quotes, and links..."
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-sudabelt-border">
                <button
                  type="button"
                  onClick={() => {
                    setShowArticleModal(false)
                    setEditingArticle(null)
                    setArticleContent('')
                  }}
                  className="px-4 py-2 rounded-xl border border-sudabelt-border text-sudabelt-navy font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingArticle || uploadingField !== null}
                  className="px-5 py-2 rounded-xl bg-sudabelt-green hover:bg-sudabelt-green-dark text-white font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSavingArticle
                    ? 'Saving...'
                    : uploadingField
                      ? 'Uploading File...'
                      : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CREATE NEWSLETTER CAMPAIGN */}
      {/* ===================================================================== */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-sudabelt-border mb-4">
              <h3 className="text-base font-bold text-sudabelt-navy">
                Create Newsletter Campaign Broadcast
              </h3>
              <button onClick={() => setShowCampaignModal(false)} className="p-1 text-gray-400 hover:text-sudabelt-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Campaign Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Sudabelt Clinical Dispatch: Q3 2026"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Email Subject Line</label>
                <input
                  name="subject"
                  required
                  placeholder="e.g. Transforming ICU Uptime: New Guidelines"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Issue #</label>
                  <input
                    type="number"
                    name="issueNumber"
                    defaultValue={campaigns.length + 1}
                    required
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Quarter</label>
                  <select name="quarter" defaultValue="Q2" className="w-full p-2.5 rounded-xl border border-sudabelt-border">
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sudabelt-navy mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    defaultValue={2026}
                    required
                    className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Summary</label>
                <textarea
                  name="summary"
                  rows={2}
                  required
                  placeholder="Executive summary"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Email Body Content</label>
                <textarea
                  name="content"
                  rows={4}
                  required
                  placeholder="Newsletter briefing content..."
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-sudabelt-navy">Preview Cover Image (URL or Upload)</label>
                  <label className="text-[11px] font-bold text-sudabelt-blue hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {uploadingField === 'campaign-cover' ? 'Uploading...' : 'Upload Cover Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadMediaFile(e, 'campaign-cover-input', 'campaign-cover')}
                    />
                  </label>
                </div>
                <input
                  id="campaign-cover-input"
                  name="coverImage"
                  defaultValue="/images/services/service-4-training.jpg"
                  placeholder="URL to cover preview image or upload above"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-sudabelt-navy">Downloadable Newsletter PDF (Optional)</label>
                  <label className="text-[11px] font-bold text-sudabelt-blue hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {uploadingField === 'campaign-pdf' ? 'Uploading...' : 'Upload PDF File'}
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleUploadMediaFile(e, 'campaign-pdf-input', 'campaign-pdf')}
                    />
                  </label>
                </div>
                <input
                  id="campaign-pdf-input"
                  name="pdfUrl"
                  placeholder="URL to downloadable PDF (e.g. /uploads/issue-3.pdf or external URL)"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sudabelt-border">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 rounded-xl border border-sudabelt-border text-sudabelt-navy font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sudabelt-green hover:bg-sudabelt-green-dark text-white font-bold"
                >
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CREATE ADMIN USER (SUPERADMIN ONLY) */}
      {/* ===================================================================== */}
      {showAdminUserModal && isSuperAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-sudabelt-border mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-sudabelt-green" />
                <h3 className="text-base font-bold text-sudabelt-navy">
                  Create Administrator Account
                </h3>
              </div>
              <button onClick={() => setShowAdminUserModal(false)} className="p-1 text-gray-400 hover:text-sudabelt-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Full Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Dr. Amina Bello"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Work Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. a.bello@sudabelt.com"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">Temporary Password (Min 6 chars)</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-xl border border-sudabelt-border"
                />
              </div>

              <div>
                <label className="block font-bold text-sudabelt-navy mb-1">System Role & Permissions</label>
                <select name="role" defaultValue="admin" className="w-full p-2.5 rounded-xl border border-sudabelt-border font-semibold">
                  <option value="admin">Administrator (Full catalog & operations access)</option>
                  <option value="editor">Editor (Content & blog publishing only)</option>
                  <option value="superadmin">Superadmin (All privileges + Manage team)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Only Superadmin can view and manage other administrative users.</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sudabelt-border">
                <button
                  type="button"
                  onClick={() => setShowAdminUserModal(false)}
                  className="px-4 py-2 rounded-xl border border-sudabelt-border text-sudabelt-navy font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sudabelt-green hover:bg-sudabelt-green-dark text-white font-bold"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage
