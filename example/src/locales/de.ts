// German translations

import { Translations } from './en';

export const de: Translations = {
  common: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    loading: 'Wird geladen...',
    error: 'Fehler',
    success: 'Erfolg',
    confirm: 'Bestätigen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    back: 'Zurück',
    next: 'Weiter',
    done: 'Fertig',
    ok: 'OK',
    yes: 'Ja',
    no: 'Nein',
    retry: 'Erneut versuchen',
    close: 'Schließen',
  },

  auth: {
    login: 'Anmelden',
    logout: 'Abmelden',
    signUp: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    rememberMe: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    resetPassword: 'Passwort zurücksetzen',
    sendResetLink: 'Link senden',
    welcomeBack: 'Willkommen zurück',
    loginSubtitle: 'Melde dich mit deinen Zugangsdaten an',
    resetPasswordTitle: 'Passwort zurücksetzen',
    resetPasswordDescription: 'Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.',
    resetPasswordSuccess: 'E-Mail gesendet',
    resetPasswordSuccessMessage: 'Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach.',
    invalidEmail: 'Bitte gültige E-Mail eingeben',
    invalidPassword: 'Passwort muss mindestens 6 Zeichen haben',
    loginFailed: 'Anmeldung fehlgeschlagen',
    logoutConfirm: 'Möchtest du dich wirklich abmelden?',
  },

  settings: {
    title: 'Einstellungen',
    appearance: 'Darstellung',
    theme: 'Design',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    themeSystem: 'System',
    account: 'Account',
    changePassword: 'Passwort ändern',
    changePasswordDescription: 'E-Mail zum Zurücksetzen senden',
    notifications: 'Benachrichtigungen',
    language: 'Sprache',
    about: 'Über',
    version: 'Version',
    appInfo: 'App-Info',
  },

  tabs: {
    home: 'Start',
    settings: 'Einstellungen',
  },

  home: {
    title: 'Start',
    welcome: 'Willkommen',
  },

  update: {
    required: 'Update erforderlich',
    available: 'Update verfügbar',
    updateApp: 'App aktualisieren',
    mandatoryDescription: 'Diese Version der App wird nicht mehr unterstützt. Bitte aktualisiere die App, um fortzufahren.',
    optionalDescription: 'Eine neue Version der App ist verfügbar. Wir empfehlen ein Update, um alle neuen Funktionen und Verbesserungen zu erhalten.',
    installedVersion: 'Installiert:',
    latestVersion: 'Neueste:',
    mandatoryNote: 'Dieses Update ist erforderlich, um die App weiterhin nutzen zu können.',
    releaseNotes: 'Neuerungen',
  },

  connection: {
    noConnection: 'Keine Internetverbindung',
    noConnectionDescription: 'Bitte überprüfe deine Internetverbindung und versuche es erneut.',
    tryAgain: 'Erneut versuchen',
    troubleshooting: 'Tipps zur Fehlerbehebung:',
    tip1: 'Prüfe deine WLAN- oder mobile Datenverbindung',
    tip2: 'Deaktiviere den Flugmodus, falls aktiviert',
    tip3: 'Starte dein Gerät neu',
  },

  changelog: {
    whatsNew: 'Was ist neu',
    noChanges: 'Keine Änderungen dokumentiert.',
    dismiss: 'Verstanden',
  },

  onboarding: {
    welcome: {
      title: 'Willkommen',
      subtitle: 'Deine Reise beginnt hier. Entdecke alle tollen Funktionen, die wir für dich vorbereitet haben.',
      continue: 'Weiter',
    },
    features: {
      title: 'Funktionen entdecken',
      feature1Title: 'Blitzschnell',
      feature1: 'Erlebe rasante Performance mit unserer optimierten Architektur.',
      feature2Title: 'Sicher konzipiert',
      feature2: 'Deine Daten sind mit branchenführenden Sicherheitsstandards geschützt.',
      feature3Title: 'Überall verfügbar',
      feature3: 'Greife von jedem Gerät, jederzeit und überall auf deine Inhalte zu.',
      continue: 'Weiter',
    },
    permissions: {
      title: 'Bleib informiert',
      subtitle: 'Aktiviere Benachrichtigungen, um keine wichtigen Updates zu verpassen.',
      enable: 'Benachrichtigungen aktivieren',
      skip: 'Vielleicht später',
    },
  },

  errors: {
    generic: 'Ein Fehler ist aufgetreten',
    networkError: 'Netzwerkfehler. Bitte überprüfe deine Verbindung.',
    serverError: 'Serverfehler. Bitte versuche es später erneut.',
    sessionExpired: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.',
  },
};
