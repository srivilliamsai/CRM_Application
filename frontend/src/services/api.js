import axios from 'axios';

// ============ API Clients ============

const AUTH_API = axios.create({
    baseURL: 'http://localhost:8081/api/auth',
    headers: { 'Content-Type': 'application/json' },
});

const CUSTOMER_API = axios.create({
    baseURL: 'http://localhost:8082/api',
    headers: { 'Content-Type': 'application/json' },
});

const SALES_API = axios.create({
    baseURL: 'http://localhost:8083/api',
    headers: { 'Content-Type': 'application/json' },
});

const MARKETING_API = axios.create({
    baseURL: 'http://localhost:8084/api',
    headers: { 'Content-Type': 'application/json' },
});

const SUPPORT_API = axios.create({
    baseURL: 'http://localhost:8085/api',
    headers: { 'Content-Type': 'application/json' },
});

const ANALYTICS_API = axios.create({
    baseURL: 'http://localhost:8086/api',
    headers: { 'Content-Type': 'application/json' },
});

const NOTIFICATION_API = axios.create({
    baseURL: 'http://localhost:8089/api/notifications',
    headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor to all APIs
const addToken = (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

AUTH_API.interceptors.request.use(addToken);
CUSTOMER_API.interceptors.request.use(addToken);
SALES_API.interceptors.request.use(addToken);
MARKETING_API.interceptors.request.use(addToken);
SUPPORT_API.interceptors.request.use(addToken);
ANALYTICS_API.interceptors.request.use(addToken);
NOTIFICATION_API.interceptors.request.use(addToken);

// ============ Auth Service ============

export const register = async (data) => {
    const response = await AUTH_API.post('/register', data);
    return response.data;
};

export const login = async (data) => {
    const response = await AUTH_API.post('/login', data);
    return response.data;
};

export const getAllUsers = async (companyId) => {
    if (companyId) {
        const response = await AUTH_API.get(`/users/company/${companyId}`);
        return response.data;
    }
    const response = await AUTH_API.get('/users');
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await AUTH_API.put(`/users/${userId}/role`, { role });
    return response.data;
};

export const grantPermission = async (userId, permission) => {
    const response = await AUTH_API.put(`/users/${userId}/permissions`, { permission });
    return response.data;
};

export const revokePermission = async (userId, permission) => {
    // Delete requests with body need 'data' key in axios
    const response = await AUTH_API.delete(`/users/${userId}/permissions`, { data: { permission } });
    return response.data;
};

export const saveAuth = (authResponse) => {
    sessionStorage.setItem('token', authResponse.token);
    sessionStorage.setItem('user', JSON.stringify({
        id: authResponse.id,
        username: authResponse.username,
        email: authResponse.email,
        fullName: authResponse.fullName,
        companyName: authResponse.companyName,
        companyId: authResponse.companyId,
        roles: authResponse.roles,
        permissions: authResponse.permissions,
    }));
};

export const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

export const getToken = () => sessionStorage.getItem('token');

export const getUser = () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const refreshUserProfile = async () => {
    try {
        const response = await AUTH_API.get('/me');
        const user = response.data;
        const currentToken = sessionStorage.getItem('token');

        // Update session storage with new user data but keep the token
        saveAuth({ ...user, token: currentToken });
        return user;
    } catch (error) {
        console.error("Failed to refresh user profile", error);
        return null;
    }
};

export const getCompanyId = () => {
    const user = getUser();
    return user?.companyId;
};

export const forgotPassword = async (email) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ message: 'If an account exists, a reset link has been sent.' }), 1000);
    });
};

export const resetPassword = async (token, newPassword) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ message: 'Password has been reset successfully.' }), 1000);
    });
};

// ============ Leads (customer-service) ============

export const getLeadsByAssignee = async (userId) => {
    const companyId = getCompanyId();
    const response = await CUSTOMER_API.get(`/leads/assigned/${userId}?companyId=${companyId}`);
    return response.data;
};

export const getHighScoreLeads = async () => {
    const companyId = getCompanyId();
    const response = await CUSTOMER_API.get(`/leads?companyId=${companyId}`);
    return response.data;
};

export const getAllLeads = async () => {
    const companyId = getCompanyId();
    const response = await CUSTOMER_API.get(`/leads?companyId=${companyId}`);
    return response.data;
};

export const getLeadById = async (id) => {
    const response = await CUSTOMER_API.get(`/leads/${id}`);
    return response.data;
};

export const createLead = async (data) => {
    const companyId = getCompanyId();
    const response = await CUSTOMER_API.post('/leads', { ...data, companyId });
    return response.data;
};

export const updateLead = async (id, data) => {
    const response = await CUSTOMER_API.put(`/leads/${id}`, data);
    return response.data;
};

export const updateLeadStatus = async (id, status) => {
    const response = await CUSTOMER_API.put(`/leads/${id}/status?status=${status}`);
    return response.data;
};

export const deleteLead = async (id) => {
    await CUSTOMER_API.delete(`/leads/${id}`);
};

export const getLeadHistory = async (id) => {
    const response = await CUSTOMER_API.get(`/leads/${id}/history`);
    return response.data;
};

// ============ Customers (customer-service) ============

export const getAllCustomers = async () => {
    const companyId = getCompanyId();
    const response = await CUSTOMER_API.get(`/customers?companyId=${companyId}`);
    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await CUSTOMER_API.get(`/customers/${id}`);
    return response.data;
};

export const searchCustomers = async (keyword) => {
    const companyId = getCompanyId();
    const response = await CUSTOMER_API.get(`/customers/search?keyword=${keyword}&companyId=${companyId}`);
    return response.data;
};

export const createCustomer = async (data) => {
    const companyId = getCompanyId();
    const response = await CUSTOMER_API.post('/customers', { ...data, companyId });
    return response.data;
};

export const updateCustomer = async (id, data) => {
    const response = await CUSTOMER_API.put(`/customers/${id}`, data);
    return response.data;
};

export const deleteCustomer = async (id) => {
    await CUSTOMER_API.delete(`/customers/${id}`);
};

// ============ Notes (customer-service) ============

export const getNotesByCustomer = async (customerId) => {
    const response = await CUSTOMER_API.get(`/notes/customer/${customerId}`);
    return response.data;
};

export const createNote = async (data) => {
    const response = await CUSTOMER_API.post('/notes', data);
    return response.data;
};

export const deleteNote = async (id) => {
    await CUSTOMER_API.delete(`/notes/${id}`);
};

// ============ Activities (customer-service) ============

export const getAllActivities = async () => {
    const response = await CUSTOMER_API.get('/activities');
    return response.data;
};

export const getActivitiesByCustomer = async (customerId) => {
    const response = await CUSTOMER_API.get(`/activities/customer/${customerId}`);
    return response.data;
};

export const createActivity = async (data) => {
    const response = await CUSTOMER_API.post('/activities', data);
    return response.data;
};

// ============ Deals (sales-service) ============

export const getAllDeals = async () => {
    const companyId = getCompanyId();
    const response = await SALES_API.get(`/deals?companyId=${companyId}`);
    return response.data;
};

export const getDealById = async (id) => {
    const response = await SALES_API.get(`/deals/${id}`);
    return response.data;
};

export const getDealsByStage = async (stage) => {
    const companyId = getCompanyId();
    const response = await SALES_API.get(`/deals/stage/${stage}?companyId=${companyId}`);
    return response.data;
};

export const getDealsByCustomer = async (customerId) => {
    const companyId = getCompanyId();
    const response = await SALES_API.get(`/deals/customer/${customerId}?companyId=${companyId}`);
    return response.data;
};

export const createDeal = async (data) => {
    const companyId = getCompanyId();
    const response = await SALES_API.post('/deals', { ...data, companyId });
    return response.data;
};

export const updateDeal = async (id, data) => {
    const response = await SALES_API.put(`/deals/${id}`, data);
    return response.data;
};

export const updateDealStage = async (id, stage) => {
    const response = await SALES_API.put(`/deals/${id}/stage?stage=${stage}`);
    return response.data;
};

export const deleteDeal = async (id) => {
    await SALES_API.delete(`/deals/${id}`);
};

// ============ Followups (sales-service) ============

export const getFollowupsByDeal = async (dealId) => {
    const companyId = getCompanyId();
    const response = await SALES_API.get(`/followups/deal/${dealId}?companyId=${companyId}`);
    return response.data;
};

export const getPendingFollowups = async () => {
    const response = await SALES_API.get('/followups/pending');
    return response.data;
};

export const createFollowup = async (data) => {
    const companyId = getCompanyId();
    const response = await SALES_API.post('/followups', { ...data, companyId });
    return response.data;
};

// ============ Campaigns (marketing-service) ============

export const getAllCampaigns = async () => {
    const companyId = getCompanyId();
    const response = await MARKETING_API.get(`/campaigns?companyId=${companyId}`);
    return response.data;
};

export const getCampaignById = async (id) => {
    const response = await MARKETING_API.get(`/campaigns/${id}`);
    return response.data;
};

export const createCampaign = async (data) => {
    const companyId = getCompanyId();
    const response = await MARKETING_API.post('/campaigns', { ...data, companyId });
    return response.data;
};

export const updateCampaign = async (id, data) => {
    const response = await MARKETING_API.put(`/campaigns/${id}`, data);
    return response.data;
};

export const deleteCampaign = async (id) => {
    await MARKETING_API.delete(`/campaigns/${id}`);
};

// ============ Tickets (support-service) ============

export const getAllTickets = async () => {
    const companyId = getCompanyId();
    const response = await SUPPORT_API.get(`/tickets?companyId=${companyId}`);
    return response.data;
};

export const getTicketById = async (id) => {
    const response = await SUPPORT_API.get(`/tickets/${id}`);
    return response.data;
};

export const getTicketsByStatus = async (status) => {
    const companyId = getCompanyId();
    const response = await SUPPORT_API.get(`/tickets/status/${status}?companyId=${companyId}`);
    return response.data;
};

export const getTicketsByCustomer = async (customerId) => {
    const companyId = getCompanyId();
    const response = await SUPPORT_API.get(`/tickets/customer/${customerId}?companyId=${companyId}`);
    return response.data;
};

export const createTicket = async (data) => {
    const companyId = getCompanyId();
    const response = await SUPPORT_API.post('/tickets', { ...data, companyId });
    return response.data;
};

export const updateTicket = async (id, data) => {
    const response = await SUPPORT_API.put(`/tickets/${id}`, data);
    return response.data;
};

export const updateTicketStatus = async (id, status) => {
    const response = await SUPPORT_API.put(`/tickets/${id}/status?status=${status}`);
    return response.data;
};

export const deleteTicket = async (id) => {
    await SUPPORT_API.delete(`/tickets/${id}`);
};

export const getTicketResponses = async (id) => {
    const response = await SUPPORT_API.get(`/tickets/${id}/responses`);
    return response.data;
};

export const addTicketResponse = async (id, data) => {
    // data should contain { message, respondedBy, responderType }
    const response = await SUPPORT_API.post(`/tickets/${id}/responses`, data);
    return response.data;
};

// ============ Analytics (analytics-service) ============

// ============ Analytics (analytics-service) ============

export const getDashboardAnalytics = async () => {
    const companyId = getCompanyId();
    const response = await ANALYTICS_API.get(`/analytics/dashboard?companyId=${companyId}`);
    return response.data;
};

export const getAllReports = async () => {
    const response = await ANALYTICS_API.get('/analytics/reports');
    return response.data;
};

export const createReport = async (data) => {
    const response = await ANALYTICS_API.post('/analytics/reports', data);
    return response.data;
};

export const deleteReport = async (id) => {
    await ANALYTICS_API.delete(`/analytics/reports/${id}`);
};

// ============ Integrations (integration-service) ============

const INTEGRATION_API = axios.create({
    baseURL: 'http://localhost:8088/api',
    headers: { 'Content-Type': 'application/json' },
});

INTEGRATION_API.interceptors.request.use(addToken);

export const getIntegrationStatus = async () => {
    const response = await INTEGRATION_API.get('/integrations/status');
    return response.data;
};

export const sendEmail = async (data) => {
    const response = await INTEGRATION_API.post('/integrations/email/send', data);
    return response.data;
};

export const sendWebhook = async (data) => {
    const response = await INTEGRATION_API.post('/integrations/webhook/send', data);
    return response.data;
};

// ============ Workflows (workflow-service) ============

const WORKFLOW_API = axios.create({
    baseURL: 'http://localhost:8087/api',
    headers: { 'Content-Type': 'application/json' },
});

WORKFLOW_API.interceptors.request.use(addToken);

export const getAllRules = async () => {
    const response = await WORKFLOW_API.get('/workflows/rules');
    return response.data;
};

export const createRule = async (data) => {
    const response = await WORKFLOW_API.post('/workflows/rules', data);
    return response.data;
};

export const updateRule = async (id, data) => {
    const response = await WORKFLOW_API.put(`/workflows/rules/${id}`, data);
    return response.data;
};

export const toggleRule = async (id) => {
    const response = await WORKFLOW_API.put(`/workflows/rules/${id}/toggle`);
    return response.data;
};

export const deleteRule = async (id) => {
    await WORKFLOW_API.delete(`/workflows/rules/${id}`);
};

export const getWorkflowLogs = async () => {
    const response = await WORKFLOW_API.get('/workflows/logs');
    return response.data;
};

// ============ Notifications (notification-service) ============

// Notification API instance is already declared at the top

export const getNotifications = async (userId) => {
    const response = await NOTIFICATION_API.get(`/user/${userId}`);
    return response.data;
};

export const getUnreadNotifications = async (userId) => {
    const response = await NOTIFICATION_API.get(`/user/${userId}/unread`);
    return response.data;
};

export const getUnreadCount = async (userId) => {
    const response = await NOTIFICATION_API.get(`/user/${userId}/unread-count`);
    return response.data; // returns { userId, unreadCount }
};

export const markAsRead = async (id) => {
    const response = await NOTIFICATION_API.put(`/${id}/read`);
    return response.data;
};

export const markAllAsRead = async (userId) => {
    await NOTIFICATION_API.put(`/user/${userId}/read-all`);
    return response.data;
};

export const sendNotification = async (data) => {
    const response = await NOTIFICATION_API.post('', data);
    return response.data;
};

export default AUTH_API;
