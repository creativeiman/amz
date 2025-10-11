'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical,
  CheckCircle,
  Clock,
  X,
  Crown,
  UserCheck,
  Eye
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../../../contexts/LanguageContext'
import { useUpgradeModal } from '../../../hooks/useUpgradeModal'
import UpgradeModal from '../../../components/dashboard/UpgradeModal'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'pending' | 'invited'
  joinedAt: Date
  lastActive?: Date
  avatar?: string
}

export default function TeamPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const { isOpen: isUpgradeModalOpen, trigger: upgradeTrigger, closeUpgradeModal, triggerUpgrade } = useUpgradeModal()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor')
  const [isLoading, setIsLoading] = useState(true)
  
  // Get user plan from session
  const userPlan = (session?.user as any)?.plan || 'free'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      // Initialize with current user only
      setTeamMembers([
        {
          id: (session.user as any)?.id || '1',
          name: session.user.name || 'You',
          email: session.user.email || '',
          role: 'admin',
          status: 'active',
          joinedAt: new Date(),
          lastActive: new Date()
        }
      ])
      setIsLoading(false)
    }
  }, [status, session, router])

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !inviteRole) return

    setIsLoading(true)
    try {
      // TODO: Implement real API call to invite team member
      // For now, show that the feature is coming soon
      toast.success(t('team.inviteSent'))
      setInviteEmail('')
      setIsInviteModalOpen(false)
    } catch (error) {
      toast.error(t('team.inviteFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement real API call to remove team member
      // For now, show that the feature is coming soon
      toast.success(t('team.memberRemoved'))
    } catch (error) {
      toast.error(t('team.removeFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'editor':
        return <UserCheck className="w-4 h-4 text-blue-600" />
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-600" />
      default:
        return <UserCheck className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      case 'invited':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Mail className="w-3 h-3 mr-1" />
            Invited
          </span>
        )
      default:
        return null
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('team.title')}</h1>
                <p className="text-sm text-gray-600">{t('team.manageTeam')}</p>
              </div>
            </div>
            
            {userPlan === 'free' ? (
              <button
                onClick={() => triggerUpgrade('team')}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Upgrade to Invite Team
              </button>
            ) : (
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {t('team.inviteMember')}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {userPlan === 'free' ? (
          // Free plan upgrade section
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 lg:p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Team Collaboration</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Invite team members, assign roles, and collaborate on compliance checks. 
                Perfect for growing businesses that need to scale their label compliance operations.
              </p>
              
              <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Invite up to 2 team members</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Role-based permissions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Activity tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Shared scan history</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => triggerUpgrade('team')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 text-lg"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Upgrade to Deluxe - $15/month
              </button>
              
            </div>
          </div>
        ) : (
          // Paid plan team management
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 lg:p-8">
          {/* Team Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">{t('team.totalMembers')}</p>
                  <p className="text-2xl font-bold text-blue-900">{teamMembers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">{t('team.activeMembers')}</p>
                  <p className="text-2xl font-bold text-green-900">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-600">{t('team.pendingInvites')}</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {teamMembers.filter(m => m.status === 'invited' || m.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('team.teamMembers')}</h3>
            
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                          {getRoleIcon(member.role)}
                          {getStatusBadge(member.status)}
                        </div>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)} • 
                          Joined {member.joinedAt.toLocaleDateString()}
                          {member.lastActive && (
                            <span> • Last active {member.lastActive.toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {member.role}
                      </span>
                      {member.id !== '1' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty state for additional team members */}
              {teamMembers.length === 1 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('team.noAdditionalMembers')}</h3>
                  <p className="text-gray-600 mb-6">{t('team.inviteMembersDescription')}</p>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('team.inviteFirstMember')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{t('team.inviteTeamMember')}</h3>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleInviteMember} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('team.emailAddress')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="colleague@company.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('team.role')}
                  </label>
                  <select
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="editor">{t('team.editorRole')}</option>
                    <option value="viewer">{t('team.viewerRole')}</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? t('team.sending') : t('team.sendInvite')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        trigger={upgradeTrigger}
      />
    </div>
  )
}
