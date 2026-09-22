import { combineReducers, type Action } from '@reduxjs/toolkit';
import { uiReducer } from './slices/ui/uiSlice';
import { authReducer } from './slices/auth/authSlice';
import { userReducer } from './slices/user/userSlice';
import { placementTestReducer } from './slices/placementTest/placementTestSlice';
import { coursesCatalogReducer } from './slices/coursesCatalog/coursesCatalogSlice';
import { courseLearningReducer } from './slices/courseLearning/courseLearningSlice';
import { progressQuizzesReducer } from './slices/progressQuizzes/progressQuizzesSlice';
import { subscriptionsReducer } from './slices/subscriptions/subscriptionsSlice';
import { lessonRequestsReducer } from './slices/lessonRequests/lessonRequestsSlice';
import { courseDetailsReducer } from './slices/coursesCatalog/courseDetailsSlice';
import { vocabularyReducer } from './slices/vocabulary/vocabularySlice';

const appReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  user: userReducer,
  placementTest: placementTestReducer,
  coursesCatalog: coursesCatalogReducer,
  courseDetails: courseDetailsReducer,
  courseLearning: courseLearningReducer,
  progressQuizzes: progressQuizzesReducer,
  subscriptions: subscriptionsReducer,
  lessonRequests: lessonRequestsReducer,
  vocabulary: vocabularyReducer,
});

export type RootState = ReturnType<typeof appReducer>;

/**
 * Both ways a session can end: the `logout` action the API layer dispatches when a
 * token can no longer be refreshed, and `logOutThunk` behind the "sign out" button.
 * Matched by type rather than by importing the creators, because authThunks already
 * imports RootState from this file.
 */
const SESSION_END_ACTIONS = new Set(['auth/logout', 'auth/logout/fulfilled']);

/**
 * Ending a session drops every slice back to its initial state.
 *
 * Signing out used to leave the previous account's data in memory — most visibly the
 * word list, which stayed on screen until the next student's own words arrived from
 * the server. Resetting centrally means a new slice cannot forget to clean up after
 * itself, which is how that bug happened in the first place.
 */
export const rootReducer = (
  state: RootState | undefined,
  action: Action,
): RootState =>
  SESSION_END_ACTIONS.has(action.type)
    ? appReducer(undefined, action)
    : appReducer(state, action);
