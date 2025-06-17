import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { contactUsService } from '../../services/contactUsService';

interface IValidationObject {
  name?: string;
  email?: string;
  description?: string;
}

export interface ContactUsResponse {
  errors?: IValidationObject;
  stack: string;
  success: boolean;
  status: number;
  message: string;
}

interface ContactUsState {
  response: ContactUsResponse | null;
  validationObject?: IValidationObject;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ContactUsState = {
  response: null,
  loading: false,
  error: null,
  success: null,
};

export const contactUsCreate = createAsyncThunk(
  'contact-us',
  async (
    data: {
      name: string;
      email: string;
      description: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await contactUsService.createTask(data);
      return response;
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        dispatch(validationState(error.response?.data?.errors));
        return rejectWithValue(error.response.data.errors);
      }
      return rejectWithValue(error.response?.data?.message ?? 'Error while fetching adding contact us data');
    }
  }
);

const contactUsSlice = createSlice({
  name: 'contactUs',
  initialState,
  reducers: {
    validationState: (state, action) => {
      state.validationObject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get contact-us Create
      .addCase(contactUsCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(contactUsCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = 'Your request send successfully..!';
        state.response = action.payload;
      })
      .addCase(contactUsCreate.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as string) || 'Error while fetching Dashboard count.';
      });
  },
});

export const { validationState } = contactUsSlice.actions;

export default contactUsSlice.reducer;
