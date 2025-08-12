'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Users, 
  Filter, 
  Calendar,
  Eye,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  type: string
  subject: string
  content: string
  variables: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface EmailCampaign {
  id: string
  name: string
  templateId?: string
  subject: string
  content: string
  status: string
  scheduledAt?: string
  sentAt?: string
  totalRecipients: number
  sentCount: number
  failedCount: number
  filters?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  template?: EmailTemplate
}

interface Recipient {
  id: string
  email: string
  firstName: string
  lastName: string
  grade: number
  state: string
  school?: string
  points: number
  level: number
}

interface RecipientStats {
  totalStudents: number
  gradeStats: { grade: number; _count: { grade: number } }[]
  stateStats: { state: string; _count: { state: number } }[]
}

export default function MessagingCenter() {
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns' | 'recipients'>('templates')
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [recipientStats, setRecipientStats] = useState<RecipientStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Template management
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'custom',
    subject: '',
    content: '',
    variables: [] as string[]
  })

  // Campaign management
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null)
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    templateId: '',
    subject: '',
    content: '',
    scheduledAt: '',
    filters: {
      grade: '',
      state: '',
      school: '',
      selectedUsers: [] as string[]
    }
  })

  // Recipient filters
  const [recipientFilters, setRecipientFilters] = useState({
    grade: '',
    state: '',
    school: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [templatesRes, campaignsRes, recipientsRes] = await Promise.all([
        fetch('/api/email-templates'),
        fetch('/api/email-campaigns'),
        fetch('/api/email-recipients')
      ])

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json()
        setTemplates(templatesData)
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json()
        setCampaigns(campaignsData)
      }

      if (recipientsRes.ok) {
        const recipientsData = await recipientsRes.json()
        setRecipients(recipientsData.recipients)
        setRecipientStats(recipientsData.stats)
      }
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTemplate 
        ? `/api/email-templates/${editingTemplate.id}`
        : '/api/email-templates'
      
      const method = editingTemplate ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      })

      if (response.ok) {
        setShowTemplateForm(false)
        setEditingTemplate(null)
        setTemplateForm({ name: '', type: 'custom', subject: '', content: '', variables: [] })
        fetchData()
      }
    } catch (err) {
      setError('Failed to save template')
    }
  }

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCampaign 
        ? `/api/email-campaigns/${editingCampaign.id}`
        : '/api/email-campaigns'
      
      const method = editingCampaign ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignForm)
      })

      if (response.ok) {
        setShowCampaignForm(false)
        setEditingCampaign(null)
        setCampaignForm({ name: '', templateId: '', subject: '', content: '', scheduledAt: '', filters: { grade: '', state: '', school: '', selectedUsers: [] } })
        fetchData()
      }
    } catch (err) {
      setError('Failed to save campaign')
    }
  }

  const sendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/email-campaigns/${campaignId}/send`, {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Campaign sent to ${result.recipientsCount} recipients!`)
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (err) {
      setError('Failed to send campaign')
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchData()
      }
    } catch (err) {
      setError('Failed to delete template')
    }
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    
    try {
      const response = await fetch(`/api/email-campaigns/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchData()
      }
    } catch (err) {
      setError('Failed to delete campaign')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400'
      case 'scheduled': return 'text-blue-400'
      case 'sending': return 'text-yellow-400'
      case 'sent': return 'text-green-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />
      case 'scheduled': return <Calendar className="w-4 h-4" />
      case 'sending': return <Send className="w-4 h-4" />
      case 'sent': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Messaging Center</h2>
          <p className="text-gray-400">Manage email templates and campaigns</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'templates' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Templates</span>
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'campaigns' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Campaigns</span>
        </button>
        <button
          onClick={() => setActiveTab('recipients')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'recipients' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Recipients</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Email Templates</h3>
            <button
              onClick={() => setShowTemplateForm(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    template.type === 'welcome' ? 'bg-green-500/20 text-green-300' :
                    template.type === 'new_challenge' ? 'bg-blue-500/20 text-blue-300' :
                    template.type === 'newsletter' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {template.type.replace('_', ' ')}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTemplate(template)
                        setTemplateForm({
                          name: template.name,
                          type: template.type,
                          subject: template.subject,
                          content: template.content,
                          variables: template.variables
                        })
                        setShowTemplateForm(true)
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-white font-semibold mb-2">{template.name}</h4>
                <p className="text-gray-300 text-sm mb-3">{template.subject}</p>
                <div className="text-xs text-gray-400">
                  {template.variables.length} variables available
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Email Campaigns</h3>
            <button
              onClick={() => setShowCampaignForm(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Campaign</span>
            </button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="capitalize">{campaign.status}</span>
                    </div>
                    {campaign.template && (
                      <span className="text-sm text-gray-400">
                        Template: {campaign.template.name}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => sendCampaign(campaign.id)}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingCampaign(campaign)
                        setCampaignForm({
                          name: campaign.name,
                          templateId: campaign.templateId || '',
                          subject: campaign.subject,
                          content: campaign.content,
                          scheduledAt: campaign.scheduledAt || '',
                          filters: campaign.filters ? JSON.parse(campaign.filters) : { grade: '', state: '', school: '', selectedUsers: [] }
                        })
                        setShowCampaignForm(true)
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-white font-semibold mb-2">{campaign.name}</h4>
                <p className="text-gray-300 text-sm mb-3">{campaign.subject}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Total Recipients:</span>
                    <div className="text-white font-semibold">{campaign.totalRecipients}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Sent:</span>
                    <div className="text-green-400 font-semibold">{campaign.sentCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Failed:</span>
                    <div className="text-red-400 font-semibold">{campaign.failedCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recipients Tab */}
      {activeTab === 'recipients' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Email Recipients</h3>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Filters</span>
            </div>
          </div>

          {/* Stats */}
          {recipientStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{recipientStats.totalStudents}</div>
                <div className="text-gray-300">Total Students</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{recipientStats.gradeStats.length}</div>
                <div className="text-gray-300">Grade Levels</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{recipientStats.stateStats.length}</div>
                <div className="text-gray-300">States</div>
              </div>
            </div>
          )}

          {/* Recipients Table */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">School</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recipients.map((recipient) => (
                    <tr key={recipient.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {recipient.firstName} {recipient.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {recipient.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        Grade {recipient.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {recipient.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {recipient.school || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {recipient.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingTemplate ? 'Edit Template' : 'New Email Template'}
              </h3>
              
              <form onSubmit={handleTemplateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Template Name</label>
                    <input
                      type="text"
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Welcome Email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={templateForm.type}
                      onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="welcome">Welcome Email</option>
                      <option value="new_challenge">New Challenge</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject Line</label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Welcome to MSKL!"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Content (HTML)</label>
                  <textarea
                    value={templateForm.content}
                    onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none"
                    placeholder="<div>Your HTML email content here...</div>"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateForm(false)
                      setEditingTemplate(null)
                      setTemplateForm({ name: '', type: 'custom', subject: '', content: '', variables: [] })
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Form Modal */}
      {showCampaignForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingCampaign ? 'Edit Campaign' : 'New Email Campaign'}
              </h3>
              
              <form onSubmit={handleCampaignSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                    <input
                      type="text"
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Monthly Newsletter"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Template (Optional)</label>
                    <select
                      value={campaignForm.templateId}
                      onChange={(e) => setCampaignForm({ ...campaignForm, templateId: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No template</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject Line</label>
                  <input
                    type="text"
                    value={campaignForm.subject}
                    onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Important Update from MSKL"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Content (HTML)</label>
                  <textarea
                    value={campaignForm.content}
                    onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none"
                    placeholder="<div>Your HTML email content here...</div>"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={campaignForm.scheduledAt}
                    onChange={(e) => setCampaignForm({ ...campaignForm, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCampaignForm(false)
                      setEditingCampaign(null)
                      setCampaignForm({ name: '', templateId: '', subject: '', content: '', scheduledAt: '', filters: { grade: '', state: '', school: '', selectedUsers: [] } })
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
