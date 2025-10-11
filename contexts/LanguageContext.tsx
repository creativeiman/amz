'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.newScan': 'New Scan',
    'nav.scanHistory': 'Scan History',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.billing': 'Billing',
    'nav.signOut': 'Sign Out',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.manageCompliance': 'Manage your label compliance checks and track your progress.',
    'dashboard.totalScans': 'Total Scans',
    'dashboard.compliant': 'Compliant',
    'dashboard.issuesFound': 'Issues Found',
    'dashboard.riskScore': 'Risk Score',
    'dashboard.recentScans': 'Recent Scans',
    'dashboard.uploadNewLabel': 'Upload New Label',
    'dashboard.freePlanRemaining': 'Free plan: 1 scan remaining',
    'dashboard.upgradeForUnlimited': 'Upgrade for Unlimited Scans',
    
    // Settings
    'settings.title': 'Settings',
    'settings.manageAccount': 'Manage your account preferences',
    'settings.profileInformation': 'Profile Information',
    'settings.fullName': 'Full Name',
    'settings.emailAddress': 'Email Address',
    'settings.notifications': 'Notifications',
    'settings.notificationsDesc': 'Receive notifications about important updates',
    'settings.emailUpdates': 'Email Updates',
    'settings.emailUpdatesDesc': 'Receive email notifications about important updates',
    'settings.preferences': 'Preferences',
    'settings.language': 'Language',
    'settings.saveChanges': 'Save Changes',
    'settings.saving': 'Saving...',
    'settings.settingsUpdated': 'Settings updated successfully!',
    'settings.updateFailed': 'Failed to update settings',
    
    // Common
    'common.backToDashboard': 'Back to Dashboard',
    'common.backToHome': 'Back to Home',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Team
    'team.title': 'Team Management',
    'team.manageTeam': 'Manage your team members and their permissions',
    'team.inviteMember': 'Invite Member',
    'team.totalMembers': 'Total Members',
    'team.activeMembers': 'Active Members',
    'team.pendingInvites': 'Pending Invites',
    'team.teamMembers': 'Team Members',
    'team.inviteTeamMember': 'Invite Team Member',
    'team.emailAddress': 'Email Address',
    'team.role': 'Role',
    'team.editorRole': 'Editor - Can create and edit scans',
    'team.viewerRole': 'Viewer - Can only view scans and reports',
    'team.sendInvite': 'Send Invite',
    'team.sending': 'Sending...',
    'team.inviteSent': 'Invitation sent successfully!',
    'team.inviteFailed': 'Failed to send invitation',
    'team.memberRemoved': 'Team member removed successfully!',
    'team.removeFailed': 'Failed to remove team member',
    'team.joined': 'Joined',
    'team.lastActive': 'Last active',
    'team.admin': 'Admin',
    'team.editor': 'Editor',
    'team.viewer': 'Viewer',
    'team.active': 'Active',
    'team.pending': 'Pending',
    'team.invited': 'Invited',
    'team.noAdditionalMembers': 'No additional team members yet',
    'team.inviteMembersDescription': 'Invite team members to collaborate on compliance checks and reports.',
    'team.inviteFirstMember': 'Invite First Member',
    
    // Integrations
    'integrations.title': 'Integrations',
    'integrations.connectAmazonDescription': 'Connect your Amazon Seller Central account',
    'integrations.amazonIntegration': 'Amazon Integration',
    'integrations.amazonDescription': 'Connect your Amazon Seller Central account to automatically scan all your active listings for compliance issues. Perfect for sellers with multiple products who need comprehensive compliance monitoring.',
    'integrations.amazonFeatures': 'Amazon Integration Features',
    'integrations.importAsins': 'Import all active ASINs',
    'integrations.batchScanning': 'Batch compliance scanning',
    'integrations.autoRiskFlagging': 'Automatic risk flagging',
    'integrations.compliancePortfolio': 'Compliance portfolio view',
    'integrations.upgradeToConnect': 'Upgrade to Connect Amazon - $15/month',
    'integrations.connectedIntegrations': 'Connected Integrations',
    'integrations.noIntegrations': 'No integrations connected',
    'integrations.connectToGetStarted': 'Connect your Amazon Seller Central account to get started',
    'integrations.connectAmazon': 'Connect Amazon',
    'integrations.connecting': 'Connecting...',
    'integrations.connected': 'Connected',
    'integrations.yourAsins': 'Your ASINs',
    'integrations.syncAsins': 'Sync ASINs',
    'integrations.syncing': 'Syncing...',
    'integrations.scanSelected': 'Scan Selected',
    'integrations.lastSync': 'Last sync',
    'integrations.asins': 'ASINs',
    'integrations.lastChecked': 'Last checked',
    'integrations.compliant': 'compliant',
    'integrations.risk': 'risk',
    'integrations.active': 'Active',
    'integrations.inactive': 'Inactive',
    'integrations.low': 'Low',
    'integrations.medium': 'Medium',
    'integrations.high': 'High',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.newScan': 'Nuevo Escaneo',
    'nav.scanHistory': 'Historial de Escaneos',
    'nav.reports': 'Informes',
    'nav.settings': 'Configuración',
    'nav.billing': 'Facturación',
    'nav.signOut': 'Cerrar Sesión',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenido de nuevo',
    'dashboard.manageCompliance': 'Gestiona tus verificaciones de cumplimiento de etiquetas y rastrea tu progreso.',
    'dashboard.totalScans': 'Escaneos Totales',
    'dashboard.compliant': 'Cumplimiento',
    'dashboard.issuesFound': 'Problemas Encontrados',
    'dashboard.riskScore': 'Puntuación de Riesgo',
    'dashboard.recentScans': 'Escaneos Recientes',
    'dashboard.uploadNewLabel': 'Subir Nueva Etiqueta',
    'dashboard.freePlanRemaining': 'Plan gratuito: 1 escaneo restante',
    'dashboard.upgradeForUnlimited': 'Actualizar para Escaneos Ilimitados',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.manageAccount': 'Gestiona las preferencias de tu cuenta',
    'settings.profileInformation': 'Información del Perfil',
    'settings.fullName': 'Nombre Completo',
    'settings.emailAddress': 'Dirección de Correo',
    'settings.notifications': 'Notificaciones',
    'settings.notificationsDesc': 'Recibe notificaciones sobre actualizaciones importantes',
    'settings.emailUpdates': 'Actualizaciones por Correo',
    'settings.emailUpdatesDesc': 'Recibe notificaciones por correo sobre actualizaciones importantes',
    'settings.preferences': 'Preferencias',
    'settings.language': 'Idioma',
    'settings.saveChanges': 'Guardar Cambios',
    'settings.saving': 'Guardando...',
    'settings.settingsUpdated': '¡Configuración actualizada exitosamente!',
    'settings.updateFailed': 'Error al actualizar la configuración',
    
    // Common
    'common.backToDashboard': 'Volver al Panel',
    'common.backToHome': 'Volver al Inicio',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.yes': 'Sí',
    'common.no': 'No',
    
    // Team
    'team.title': 'Gestión de Equipo',
    'team.manageTeam': 'Gestiona los miembros de tu equipo y sus permisos',
    'team.inviteMember': 'Invitar Miembro',
    'team.totalMembers': 'Miembros Totales',
    'team.activeMembers': 'Miembros Activos',
    'team.pendingInvites': 'Invitaciones Pendientes',
    'team.teamMembers': 'Miembros del Equipo',
    'team.inviteTeamMember': 'Invitar Miembro del Equipo',
    'team.emailAddress': 'Dirección de Correo',
    'team.role': 'Rol',
    'team.editorRole': 'Editor - Puede crear y editar escaneos',
    'team.viewerRole': 'Visualizador - Solo puede ver escaneos e informes',
    'team.sendInvite': 'Enviar Invitación',
    'team.sending': 'Enviando...',
    'team.inviteSent': '¡Invitación enviada exitosamente!',
    'team.inviteFailed': 'Error al enviar invitación',
    'team.memberRemoved': '¡Miembro del equipo eliminado exitosamente!',
    'team.removeFailed': 'Error al eliminar miembro del equipo',
    'team.joined': 'Se unió',
    'team.lastActive': 'Última actividad',
    'team.admin': 'Administrador',
    'team.editor': 'Editor',
    'team.viewer': 'Visualizador',
    'team.active': 'Activo',
    'team.pending': 'Pendiente',
    'team.invited': 'Invitado',
    'team.noAdditionalMembers': 'Aún no hay miembros adicionales del equipo',
    'team.inviteMembersDescription': 'Invita a miembros del equipo para colaborar en verificaciones de cumplimiento e informes.',
    'team.inviteFirstMember': 'Invitar Primer Miembro',
    
    // Integrations
    'integrations.title': 'Integraciones',
    'integrations.connectAmazonDescription': 'Conecta tu cuenta de Amazon Seller Central',
    'integrations.amazonIntegration': 'Integración de Amazon',
    'integrations.amazonDescription': 'Conecta tu cuenta de Amazon Seller Central para escanear automáticamente todas tus listas activas en busca de problemas de cumplimiento. Perfecto para vendedores con múltiples productos que necesitan monitoreo integral de cumplimiento.',
    'integrations.amazonFeatures': 'Características de Integración de Amazon',
    'integrations.importAsins': 'Importar todos los ASINs activos',
    'integrations.batchScanning': 'Escaneo de cumplimiento por lotes',
    'integrations.autoRiskFlagging': 'Marcado automático de riesgos',
    'integrations.compliancePortfolio': 'Vista de portafolio de cumplimiento',
    'integrations.upgradeToConnect': 'Actualizar para Conectar Amazon - $15/mes',
    'integrations.connectedIntegrations': 'Integraciones Conectadas',
    'integrations.noIntegrations': 'No hay integraciones conectadas',
    'integrations.connectToGetStarted': 'Conecta tu cuenta de Amazon Seller Central para comenzar',
    'integrations.connectAmazon': 'Conectar Amazon',
    'integrations.connecting': 'Conectando...',
    'integrations.connected': 'Conectado',
    'integrations.yourAsins': 'Tus ASINs',
    'integrations.syncAsins': 'Sincronizar ASINs',
    'integrations.syncing': 'Sincronizando...',
    'integrations.scanSelected': 'Escanear Seleccionados',
    'integrations.lastSync': 'Última sincronización',
    'integrations.asins': 'ASINs',
    'integrations.lastChecked': 'Última verificación',
    'integrations.compliant': 'cumplimiento',
    'integrations.risk': 'riesgo',
    'integrations.active': 'Activo',
    'integrations.inactive': 'Inactivo',
    'integrations.low': 'Bajo',
    'integrations.medium': 'Medio',
    'integrations.high': 'Alto',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.newScan': 'Nouveau Scan',
    'nav.scanHistory': 'Historique des Scans',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'nav.billing': 'Facturation',
    'nav.signOut': 'Se Déconnecter',
    
    // Dashboard
    'dashboard.welcome': 'Bon retour',
    'dashboard.manageCompliance': 'Gérez vos vérifications de conformité des étiquettes et suivez vos progrès.',
    'dashboard.totalScans': 'Scans Totaux',
    'dashboard.compliant': 'Conforme',
    'dashboard.issuesFound': 'Problèmes Trouvés',
    'dashboard.riskScore': 'Score de Risque',
    'dashboard.recentScans': 'Scans Récents',
    'dashboard.uploadNewLabel': 'Télécharger Nouvelle Étiquette',
    'dashboard.freePlanRemaining': 'Plan gratuit : 1 scan restant',
    'dashboard.upgradeForUnlimited': 'Mettre à Niveau pour Scans Illimités',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.manageAccount': 'Gérez vos préférences de compte',
    'settings.profileInformation': 'Informations du Profil',
    'settings.fullName': 'Nom Complet',
    'settings.emailAddress': 'Adresse Email',
    'settings.notifications': 'Notifications',
    'settings.notificationsDesc': 'Recevoir des notifications sur les mises à jour importantes',
    'settings.emailUpdates': 'Mises à Jour Email',
    'settings.emailUpdatesDesc': 'Recevoir des notifications par email sur les mises à jour importantes',
    'settings.preferences': 'Préférences',
    'settings.language': 'Langue',
    'settings.saveChanges': 'Sauvegarder les Modifications',
    'settings.saving': 'Sauvegarde...',
    'settings.settingsUpdated': 'Paramètres mis à jour avec succès !',
    'settings.updateFailed': 'Échec de la mise à jour des paramètres',
    
    // Common
    'common.backToDashboard': 'Retour au Tableau de Bord',
    'common.backToHome': 'Retour à l\'Accueil',
    'common.loading': 'Chargement...',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    
    // Team
    'team.title': 'Gestion d\'Équipe',
    'team.manageTeam': 'Gérez les membres de votre équipe et leurs permissions',
    'team.inviteMember': 'Inviter Membre',
    'team.totalMembers': 'Membres Totaux',
    'team.activeMembers': 'Membres Actifs',
    'team.pendingInvites': 'Invitations en Attente',
    'team.teamMembers': 'Membres de l\'Équipe',
    'team.inviteTeamMember': 'Inviter Membre d\'Équipe',
    'team.emailAddress': 'Adresse Email',
    'team.role': 'Rôle',
    'team.editorRole': 'Éditeur - Peut créer et modifier les scans',
    'team.viewerRole': 'Visualiseur - Peut seulement voir les scans et rapports',
    'team.sendInvite': 'Envoyer Invitation',
    'team.sending': 'Envoi...',
    'team.inviteSent': 'Invitation envoyée avec succès !',
    'team.inviteFailed': 'Échec de l\'envoi de l\'invitation',
    'team.memberRemoved': 'Membre d\'équipe supprimé avec succès !',
    'team.removeFailed': 'Échec de la suppression du membre d\'équipe',
    'team.joined': 'Rejoint',
    'team.lastActive': 'Dernière activité',
    'team.admin': 'Administrateur',
    'team.editor': 'Éditeur',
    'team.viewer': 'Visualiseur',
    'team.active': 'Actif',
    'team.pending': 'En attente',
    'team.invited': 'Invité',
    'team.noAdditionalMembers': 'Aucun membre d\'équipe supplémentaire pour le moment',
    'team.inviteMembersDescription': 'Invitez des membres d\'équipe pour collaborer sur les vérifications de conformité et les rapports.',
    'team.inviteFirstMember': 'Inviter Premier Membre',
    
    // Integrations
    'integrations.title': 'Intégrations',
    'integrations.connectAmazonDescription': 'Connectez votre compte Amazon Seller Central',
    'integrations.amazonIntegration': 'Intégration Amazon',
    'integrations.amazonDescription': 'Connectez votre compte Amazon Seller Central pour scanner automatiquement toutes vos annonces actives pour les problèmes de conformité. Parfait pour les vendeurs avec plusieurs produits qui ont besoin de surveillance complète de conformité.',
    'integrations.amazonFeatures': 'Fonctionnalités d\'Intégration Amazon',
    'integrations.importAsins': 'Importer tous les ASINs actifs',
    'integrations.batchScanning': 'Scan de conformité par lots',
    'integrations.autoRiskFlagging': 'Marquage automatique des risques',
    'integrations.compliancePortfolio': 'Vue du portefeuille de conformité',
    'integrations.upgradeToConnect': 'Mettre à niveau pour Connecter Amazon - 15$/mois',
    'integrations.connectedIntegrations': 'Intégrations Connectées',
    'integrations.noIntegrations': 'Aucune intégration connectée',
    'integrations.connectToGetStarted': 'Connectez votre compte Amazon Seller Central pour commencer',
    'integrations.connectAmazon': 'Connecter Amazon',
    'integrations.connecting': 'Connexion...',
    'integrations.connected': 'Connecté',
    'integrations.yourAsins': 'Vos ASINs',
    'integrations.syncAsins': 'Synchroniser ASINs',
    'integrations.syncing': 'Synchronisation...',
    'integrations.scanSelected': 'Scanner Sélectionnés',
    'integrations.lastSync': 'Dernière synchronisation',
    'integrations.asins': 'ASINs',
    'integrations.lastChecked': 'Dernière vérification',
    'integrations.compliant': 'conforme',
    'integrations.risk': 'risque',
    'integrations.active': 'Actif',
    'integrations.inactive': 'Inactif',
    'integrations.low': 'Faible',
    'integrations.medium': 'Moyen',
    'integrations.high': 'Élevé',
  },
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.newScan': 'Neuer Scan',
    'nav.scanHistory': 'Scan-Verlauf',
    'nav.reports': 'Berichte',
    'nav.settings': 'Einstellungen',
    'nav.billing': 'Abrechnung',
    'nav.signOut': 'Abmelden',
    
    // Dashboard
    'dashboard.welcome': 'Willkommen zurück',
    'dashboard.manageCompliance': 'Verwalten Sie Ihre Label-Compliance-Prüfungen und verfolgen Sie Ihren Fortschritt.',
    'dashboard.totalScans': 'Gesamte Scans',
    'dashboard.compliant': 'Konform',
    'dashboard.issuesFound': 'Gefundene Probleme',
    'dashboard.riskScore': 'Risikobewertung',
    'dashboard.recentScans': 'Aktuelle Scans',
    'dashboard.uploadNewLabel': 'Neues Label Hochladen',
    'dashboard.freePlanRemaining': 'Kostenloser Plan: 1 Scan verbleibend',
    'dashboard.upgradeForUnlimited': 'Für Unbegrenzte Scans Upgraden',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.manageAccount': 'Verwalten Sie Ihre Kontoeinstellungen',
    'settings.profileInformation': 'Profilinformationen',
    'settings.fullName': 'Vollständiger Name',
    'settings.emailAddress': 'E-Mail-Adresse',
    'settings.notifications': 'Benachrichtigungen',
    'settings.notificationsDesc': 'Benachrichtigungen über wichtige Updates erhalten',
    'settings.emailUpdates': 'E-Mail-Updates',
    'settings.emailUpdatesDesc': 'E-Mail-Benachrichtigungen über wichtige Updates erhalten',
    'settings.preferences': 'Einstellungen',
    'settings.language': 'Sprache',
    'settings.saveChanges': 'Änderungen Speichern',
    'settings.saving': 'Speichern...',
    'settings.settingsUpdated': 'Einstellungen erfolgreich aktualisiert!',
    'settings.updateFailed': 'Fehler beim Aktualisieren der Einstellungen',
    
    // Common
    'common.backToDashboard': 'Zurück zum Dashboard',
    'common.backToHome': 'Zurück zur Startseite',
    'common.loading': 'Laden...',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.close': 'Schließen',
    'common.yes': 'Ja',
    'common.no': 'Nein',
    
    // Team
    'team.title': 'Team-Verwaltung',
    'team.manageTeam': 'Verwalten Sie Ihre Teammitglieder und deren Berechtigungen',
    'team.inviteMember': 'Mitglied Einladen',
    'team.totalMembers': 'Gesamte Mitglieder',
    'team.activeMembers': 'Aktive Mitglieder',
    'team.pendingInvites': 'Ausstehende Einladungen',
    'team.teamMembers': 'Teammitglieder',
    'team.inviteTeamMember': 'Teammitglied Einladen',
    'team.emailAddress': 'E-Mail-Adresse',
    'team.role': 'Rolle',
    'team.editorRole': 'Editor - Kann Scans erstellen und bearbeiten',
    'team.viewerRole': 'Betrachter - Kann nur Scans und Berichte anzeigen',
    'team.sendInvite': 'Einladung Senden',
    'team.sending': 'Senden...',
    'team.inviteSent': 'Einladung erfolgreich gesendet!',
    'team.inviteFailed': 'Fehler beim Senden der Einladung',
    'team.memberRemoved': 'Teammitglied erfolgreich entfernt!',
    'team.removeFailed': 'Fehler beim Entfernen des Teammitglieds',
    'team.joined': 'Beigetreten',
    'team.lastActive': 'Letzte Aktivität',
    'team.admin': 'Administrator',
    'team.editor': 'Editor',
    'team.viewer': 'Betrachter',
    'team.active': 'Aktiv',
    'team.pending': 'Ausstehend',
    'team.invited': 'Eingeladen',
    'team.noAdditionalMembers': 'Noch keine zusätzlichen Teammitglieder',
    'team.inviteMembersDescription': 'Laden Sie Teammitglieder ein, um bei Compliance-Prüfungen und Berichten zusammenzuarbeiten.',
    'team.inviteFirstMember': 'Erstes Mitglied Einladen',
    
    // Integrations
    'integrations.title': 'Integrationen',
    'integrations.connectAmazonDescription': 'Verbinden Sie Ihr Amazon Seller Central Konto',
    'integrations.amazonIntegration': 'Amazon Integration',
    'integrations.amazonDescription': 'Verbinden Sie Ihr Amazon Seller Central Konto, um automatisch alle Ihre aktiven Listings auf Compliance-Probleme zu scannen. Perfekt für Verkäufer mit mehreren Produkten, die umfassende Compliance-Überwachung benötigen.',
    'integrations.amazonFeatures': 'Amazon Integration Funktionen',
    'integrations.importAsins': 'Alle aktiven ASINs importieren',
    'integrations.batchScanning': 'Batch-Compliance-Scanning',
    'integrations.autoRiskFlagging': 'Automatische Risikokennzeichnung',
    'integrations.compliancePortfolio': 'Compliance-Portfolio-Ansicht',
    'integrations.upgradeToConnect': 'Upgrade um Amazon zu verbinden - 15$/Monat',
    'integrations.connectedIntegrations': 'Verbundene Integrationen',
    'integrations.noIntegrations': 'Keine Integrationen verbunden',
    'integrations.connectToGetStarted': 'Verbinden Sie Ihr Amazon Seller Central Konto um zu beginnen',
    'integrations.connectAmazon': 'Amazon verbinden',
    'integrations.connecting': 'Verbinden...',
    'integrations.connected': 'Verbunden',
    'integrations.yourAsins': 'Ihre ASINs',
    'integrations.syncAsins': 'ASINs synchronisieren',
    'integrations.syncing': 'Synchronisieren...',
    'integrations.scanSelected': 'Ausgewählte scannen',
    'integrations.lastSync': 'Letzte Synchronisation',
    'integrations.asins': 'ASINs',
    'integrations.lastChecked': 'Zuletzt überprüft',
    'integrations.compliant': 'konform',
    'integrations.risk': 'Risiko',
    'integrations.active': 'Aktiv',
    'integrations.inactive': 'Inaktiv',
    'integrations.low': 'Niedrig',
    'integrations.medium': 'Mittel',
    'integrations.high': 'Hoch',
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
