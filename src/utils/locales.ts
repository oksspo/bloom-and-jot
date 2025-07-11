
export const locales = {
  en: {
    // Toast messages
    saved: "Saved!",
    saveDescription: "Your diary entry has been saved.",
    error: "Error",
    saveError: "Failed to save your entry. Please try again.",
    signedOut: "Signed out",
    signOutDescription: "You've been successfully signed out.",
    welcomeBack: "Welcome back!",
    signInSuccess: "You've successfully signed in.",
    accountCreated: "Account created!",
    checkEmail: "Please check your email to verify your account.",
    
    // UI Labels
    myDailyDiary: "My Daily Diary",
    tagline: "Track your habits, mood, and thoughts",
    signOut: "Sign Out",
    today: "Today",
    habits: "Habits",
    mood: "Mood",
    notes: "Notes",
    
    // Days of week
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  },
  de: {
    // Toast messages
    saved: "Gespeichert!",
    saveDescription: "Ihr Tagebucheintrag wurde gespeichert.",
    error: "Fehler",
    saveError: "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.",
    signedOut: "Abgemeldet",
    signOutDescription: "Sie wurden erfolgreich abgemeldet.",
    welcomeBack: "Willkommen zurück!",
    signInSuccess: "Sie haben sich erfolgreich angemeldet.",
    accountCreated: "Konto erstellt!",
    checkEmail: "Bitte überprüfen Sie Ihre E-Mail zur Kontoverifizierung.",
    
    // UI Labels
    myDailyDiary: "Mein Tägliches Tagebuch",
    tagline: "Verfolgen Sie Ihre Gewohnheiten, Stimmung und Gedanken",
    signOut: "Abmelden",
    today: "Heute",
    habits: "Gewohnheiten",
    mood: "Stimmung",
    notes: "Notizen",
    
    // Days of week
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch", 
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag"
  }
};

export type Locale = keyof typeof locales;

export const getTranslation = (locale: Locale, key: keyof typeof locales.en) => {
  return locales[locale][key] || locales.en[key];
};
