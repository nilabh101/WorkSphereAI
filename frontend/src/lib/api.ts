import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401, refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get("refresh_token");
        if (refreshToken) {
          const { data } = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });
          Cookies.set("access_token", data.access_token, { expires: 1 });
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;
          }
          return apiClient(originalRequest);
        }
      } catch {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),
  logout: () => apiClient.post("/auth/logout"),
  me: () => apiClient.get("/auth/me"),
  refreshToken: (token: string) =>
    apiClient.post("/auth/refresh", { refresh_token: token }),
  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password", { token, password }),
};

// ─── Employees API ────────────────────────────────────────────────────────────
export const employeesApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/employees", { params }),
  get: (id: number) => apiClient.get(`/employees/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post("/employees", data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/employees/${id}`, data),
  delete: (id: number) => apiClient.delete(`/employees/${id}`),
  getFatigueHistory: (id: number) => apiClient.get(`/employees/${id}/fatigue-history`),
  getShiftHistory: (id: number) => apiClient.get(`/employees/${id}/shift-history`),
};

// ─── Shifts API ───────────────────────────────────────────────────────────────
export const shiftsApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/shifts", { params }),
  get: (id: number) => apiClient.get(`/shifts/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post("/shifts", data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/shifts/${id}`, data),
  delete: (id: number) => apiClient.delete(`/shifts/${id}`),
  checkConflicts: (data: Record<string, unknown>) => apiClient.post("/shifts/check-conflicts", data),
  autoAssign: (weekStart: string, deptId?: number) =>
    apiClient.post("/shifts/auto-assign", { week_start: weekStart, department_id: deptId }),
};

// ─── Leave API ────────────────────────────────────────────────────────────────
export const leaveApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/leave", { params }),
  get: (id: number) => apiClient.get(`/leave/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post("/leave", data),
  approve: (id: number) => apiClient.patch(`/leave/${id}/approve`),
  reject: (id: number, reason?: string) => apiClient.patch(`/leave/${id}/reject`, { reason }),
  cancel: (id: number) => apiClient.patch(`/leave/${id}/cancel`),
  getBalance: (employeeId: number) => apiClient.get(`/leave/balance/${employeeId}`),
};

// ─── Overtime API ─────────────────────────────────────────────────────────────
export const overtimeApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/overtime", { params }),
  create: (data: Record<string, unknown>) => apiClient.post("/overtime", data),
  approve: (id: number) => apiClient.patch(`/overtime/${id}/approve`),
  reject: (id: number, reason?: string) => apiClient.patch(`/overtime/${id}/reject`, { reason }),
};

// ─── Departments API ──────────────────────────────────────────────────────────
export const departmentsApi = {
  list: () => apiClient.get("/departments"),
  get: (id: number) => apiClient.get(`/departments/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post("/departments", data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/departments/${id}`, data),
};

// ─── Analytics API ────────────────────────────────────────────────────────────
export const analyticsApi = {
  dashboard: () => apiClient.get("/analytics/dashboard"),
  fatigueOverview: () => apiClient.get("/analytics/fatigue"),
  attendanceTrends: (params?: Record<string, unknown>) =>
    apiClient.get("/analytics/attendance", { params }),
  staffingCoverage: () => apiClient.get("/analytics/staffing"),
  overtimeSummary: () => apiClient.get("/analytics/overtime"),
  complianceReport: () => apiClient.get("/analytics/compliance"),
  heatmap: () => apiClient.get("/analytics/heatmap"),
};

// ─── Notifications API ────────────────────────────────────────────────────────
export const notificationsApi = {
  list: () => apiClient.get("/notifications"),
  markRead: (id: number) => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: () => apiClient.patch("/notifications/read-all"),
  delete: (id: number) => apiClient.delete(`/notifications/${id}`),
};

// ─── AI API ───────────────────────────────────────────────────────────────────
export const aiApi = {
  chat: (message: string, context?: Record<string, unknown>) =>
    apiClient.post("/ai/chat", { message, context }),
  fatigueInsights: () => apiClient.get("/ai/fatigue-insights"),
  scheduleOptimize: (weekStart: string) =>
    apiClient.post("/ai/optimize-schedule", { week_start: weekStart }),
  burnoutPrediction: () => apiClient.get("/ai/burnout-prediction"),
  recommendations: (employeeId?: number) =>
    apiClient.get("/ai/recommendations", { params: { employee_id: employeeId } }),
};

// ─── Attendance API ───────────────────────────────────────────────────────────
export const attendanceApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/attendance", { params }),
  checkIn: (employeeId: number) => apiClient.post("/attendance/check-in", { employee_id: employeeId }),
  checkOut: (employeeId: number) => apiClient.post("/attendance/check-out", { employee_id: employeeId }),
  getReport: (params?: Record<string, unknown>) => apiClient.get("/attendance/report", { params }),
};

// ─── Audit API ────────────────────────────────────────────────────────────────
export const auditApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/audit-logs", { params }),
  export: (format: "csv" | "pdf") =>
    apiClient.get(`/audit-logs/export?format=${format}`, { responseType: "blob" }),
};
