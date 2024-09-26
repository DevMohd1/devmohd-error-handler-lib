const messages = {
    en: {
      VALIDATION_FAILED: 'Validation failed.',
      DATABASE_ERROR: 'A database error occurred.',
      UNAUTHORIZED: 'Unauthorized access.',
      NOT_FOUND: 'The requested resource was not found.',
      SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    },
    ar: {
      VALIDATION_FAILED: 'فشلت عملية التحقق.',
      DATABASE_ERROR: 'حدث خطأ في قاعدة البيانات.',
      UNAUTHORIZED: 'الوصول غير مصرح به.',
      NOT_FOUND: 'المورد المطلوب غير موجود.',
      SERVER_ERROR: 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى لاحقًا.',
    },
    es: {
      VALIDATION_FAILED: 'La validación falló.',
      DATABASE_ERROR: 'Ocurrió un error en la base de datos.',
      UNAUTHORIZED: 'Acceso no autorizado.',
      NOT_FOUND: 'El recurso solicitado no fue encontrado.',
      SERVER_ERROR: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    },
    fr: {
      VALIDATION_FAILED: 'Échec de la validation.',
      DATABASE_ERROR: 'Une erreur de base de données s\'est produite.',
      UNAUTHORIZED: 'Accès non autorisé.',
      NOT_FOUND: 'La ressource demandée est introuvable.',
      SERVER_ERROR: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
    }
  };
  
  // Function to get the localized message by key
  function localizeMessage(key, lang = 'en') {
    return messages[lang] && messages[lang][key] ? messages[lang][key] : messages['en'][key];  // Fallback to English if missing
  }
  
  module.exports = {
    localizeMessage,
  };
  