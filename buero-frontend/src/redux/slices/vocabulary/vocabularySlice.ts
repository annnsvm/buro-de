import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createVocabularyWord,
  deleteVocabularyWord,
  fetchMyVocabulary,
} from '@/api/vocabularyApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import type {
  NewVocabularyWord,
  VocabularyWord,
} from '@/types/features/vocabulary/Vocabulary.types';

type VocabularyState = {
  words: VocabularyWord[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: VocabularyState = {
  words: [],
  status: 'idle',
  error: null,
};

export const fetchVocabularyThunk = createAsyncThunk<
  VocabularyWord[],
  void,
  { rejectValue: string }
>('vocabulary/fetch', async (_, { rejectWithValue }) => {
  try {
    return await fetchMyVocabulary();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load vocabulary'));
  }
});

export const addWordThunk = createAsyncThunk<
  VocabularyWord,
  NewVocabularyWord,
  { rejectValue: string }
>('vocabulary/add', async (payload, { rejectWithValue }) => {
  try {
    return await createVocabularyWord(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to add the word'));
  }
});

export const deleteWordThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  'vocabulary/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteVocabularyWord(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete the word'));
    }
  },
);

const vocabularySlice = createSlice({
  name: 'vocabulary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVocabularyThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        /**
         * Drop whatever is held before asking the server. A word list belongs to one
         * account, so showing the previous contents while the request is in flight
         * would briefly display another student's words.
         */
        state.words = [];
      })
      .addCase(
        fetchVocabularyThunk.fulfilled,
        (state, action: PayloadAction<VocabularyWord[]>) => {
          state.status = 'succeeded';
          state.words = action.payload;
        },
      )
      .addCase(fetchVocabularyThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load vocabulary';
      })
      .addCase(addWordThunk.fulfilled, (state, action) => {
        state.words.unshift(action.payload);
        state.error = null;
      })
      .addCase(addWordThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to add the word';
      })
      .addCase(deleteWordThunk.fulfilled, (state, action) => {
        state.words = state.words.filter((word) => word.id !== action.payload);
      })
      .addCase(deleteWordThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete the word';
      });
  },
});

export const vocabularyReducer = vocabularySlice.reducer;
