export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    verifyRegistration: '/auth/verify-registration',
    resendRegistrationCode: '/auth/resend-registration-code',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  users: {
    me: '/users/me',
    updateMe: '/users/me',
  },
  courses: {
    list: '/courses',
    manage: '/courses/manage',
    my: '/courses/me',
    byId: (id: string) => `/courses/${id}`,
    create: '/courses',
    update: (id: string) => `/courses/${id}`,
    delete: (id: string) => `/courses/${id}`,
    cover: (id: string) => `/courses/${id}/cover`,
    startTrial: (id: string) => `/courses/${id}/start-trial`,
    reorder: '/courses/reorder',
    structure: (id: string) => `/courses/${id}/structure`,
  },
  courseMaterials: {
    list: (courseId: string, moduleId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials`,
    byId: (courseId: string, moduleId: string, id: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${id}`,
    create: (courseId: string, moduleId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials`,
    import: (courseId: string, moduleId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/import`,
    questions: (courseId: string, moduleId: string, materialId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/questions`,
    question: (courseId: string, moduleId: string, materialId: string, questionId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/questions/${questionId}`,
    elements: (courseId: string, moduleId: string, materialId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/elements`,
    element: (courseId: string, moduleId: string, materialId: string, elementId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/elements/${elementId}`,
    update: (courseId: string, moduleId: string, id: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${id}`,
    delete: (courseId: string, moduleId: string, id: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${id}`,
    attachments: (courseId: string, moduleId: string, materialId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/attachments`,
    attachmentLink: (courseId: string, moduleId: string, materialId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/attachments/link`,
    attachmentById: (
      courseId: string,
      moduleId: string,
      materialId: string,
      attachmentId: string,
    ) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/attachments/${attachmentId}`,
    attachmentDownload: (
      courseId: string,
      moduleId: string,
      materialId: string,
      attachmentId: string,
    ) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/attachments/${attachmentId}/download`,
  },
  courseModules: {
    list: (courseId: string) => `/courses/${courseId}/modules`,
    create: (courseId: string) => `/courses/${courseId}/modules`,
    update: (courseId: string, moduleId: string) => `/courses/${courseId}/modules/${moduleId}`,
    delete: (courseId: string, moduleId: string) => `/courses/${courseId}/modules/${moduleId}`,
  },
  subscriptions: {
    checkout: '/subscriptions/checkout',
    syncCheckout: '/subscriptions/sync-checkout',
    myAccess: '/subscriptions/me',
  },
  payments: {
    myPayments: '/payments/me',
  },
  quiz: {
    startAttempt: '/quiz/attempts',
    getAttempt: (attemptId: string) => `/quiz/attempts/${attemptId}`,
    submit: (attemptId: string) => `/quiz/attempts/${attemptId}/submit`,
    answer: (attemptId: string) => `/quiz/attempts/${attemptId}/answers`,
    questions: (materialId: string) => `/quiz/materials/${materialId}/questions`,
    lastAttempt: (materialId: string) => `/quiz/materials/${materialId}/last-attempt`,
  },
  youtube: {
    preview: (videoId: string) => `/youtube/preview/${videoId}`,
  },
  practice: {
    overview: (materialId: string) => `/practice/materials/${materialId}`,
    /** The speaking tasks of a practice, and whatever this student has recorded. */
    speaking: (materialId: string) => `/practice/materials/${materialId}/speaking`,
    speakingRecording: (elementId: string) =>
      `/practice/speaking/${elementId}/recording`,
  },
  writing: {
    task: (materialId: string) => `/writing/materials/${materialId}`,
    submit: (materialId: string) => `/writing/materials/${materialId}/submit`,
    /** Every writing task of a practice's Schreiben block, in one request. */
    practiceTasks: (materialId: string) => `/writing/practice/${materialId}`,
    submitPractice: (elementId: string) =>
      `/writing/practice/elements/${elementId}/submit`,
  },
  progress: {
    me: '/progress/me',
    course: (courseId: string) => `/courses/${courseId}/progress`,
    complete: (courseId: string, moduleId: string, materialId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/complete`,
  },
  lessonNotes: {
    read: (materialId: string) => `/lesson-notes/${materialId}`,
    save: (materialId: string) => `/lesson-notes/${materialId}`,
  },
  vocabulary: {
    list: '/vocabulary',
    create: '/vocabulary',
    update: (id: string) => `/vocabulary/${id}`,
    delete: (id: string) => `/vocabulary/${id}`,
  },
  contact: {
    submit: '/contact',
  },
} as const;

/**
 * Endpoints where a 401 must never start a token refresh.
 *
 * These are the auth endpoints themselves. Answering a failed refresh with another refresh is
 * a loop, and answering a wrong password with one is nonsense.
 *
 * `/courses` used to be on this list, for the public catalog, and the match was by prefix.
 * Together those two facts made every authenticated course-management call unrefreshable,
 * because all of them begin with `/courses` - `/courses/manage`, `/courses/:id/structure`,
 * `/courses/:id/modules/:m/materials/:mat/elements`, the CSV import. Thirty minutes after
 * logging in the access-token cookie expires and the browser stops sending it; the next save
 * in the course editor then failed with "No token provided" and no retry at all, while the
 * refresh token still had six days left on it.
 *
 * Nothing else belongs here. The interceptor already declines to refresh when there is no
 * session, which is exactly the anonymous visitor browsing the catalog.
 */
export const NO_REFRESH_ENDPOINTS = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.register,
  API_ENDPOINTS.auth.verifyRegistration,
  API_ENDPOINTS.auth.resendRegistrationCode,
  API_ENDPOINTS.auth.refresh,
  API_ENDPOINTS.auth.logout,
  API_ENDPOINTS.contact.submit,
] as const;

/** @deprecated The old name, kept so nothing that imports it breaks. */
export const PUBLIC_ENDPOINT_PREFIXE = NO_REFRESH_ENDPOINTS;
