import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

// --- Async thunks: each one talks to the Django REST API ---

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      const response = await api.get("/tasks/", { params });
      // DRF pagination wraps results in { count, next, previous, results }
      return response.data.results ?? response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post("/tasks/", taskData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, ...changes }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tasks/${id}/`, changes);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    filters: { status: "", priority: "", search: "" },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load tasks";
      })
      // create
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // update
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setFilters } = tasksSlice.actions;
export default tasksSlice.reducer;
