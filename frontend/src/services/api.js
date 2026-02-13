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

export const getAllLeads = async () => {
    const response = await CUSTOMER_API.get('/leads');
    return response.data;
};

export const getLeadById = async (id) => {
    const response = await CUSTOMER_API.get(`/leads/${id}`);
    return response.data;
};

export const createLead = async (data) => {
    const response = await CUSTOMER_API.post('/leads', data);
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

// ============ Customers (customer-service) ============

export const getAllCustomers = async () => {
    const response = await CUSTOMER_API.get('/customers');
    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await CUSTOMER_API.get(`/customers/${id}`);
    return response.data;
};

export const searchCustomers = async (keyword) => {
    const response = await CUSTOMER_API.get(`/customers/search?keyword=${keyword}`);
    return response.data;
};

export const createCustomer = async (data) => {
    const response = await CUSTOMER_API.post('/customers', data);
    return response.data;
};

export const updateCustomer = async (id, data) => {
    const response = await CUSTOMER_API.put(`/customers/${id}`, data);
    return response.data;
};

export const deleteCustomer = async (id) => {
    await CUSTOMER_API.delete(`/customers/${id}`);
};

// ============ Deals (sales-service) ============

export const getAllDeals = async () => {
    const response = await SALES_API.get('/deals');
    return response.data;
};

export const getDealById = async (id) => {
    const response = await SALES_API.get(`/deals/${id}`);
    return response.data;
};

export const getDealsByStage = async (stage) => {
    const response = await SALES_API.get(`/deals/stage/${stage}`);
    return response.data;
};

export const createDeal = async (data) => {
    const response = await SALES_API.post('/deals', data);
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
    const response = await SALES_API.get(`/followups/deal/${dealId}`);
    return response.data;
};

export const getPendingFollowups = async () => {
    const response = await SALES_API.get('/followups/pending');
    return response.data;
};

export const createFollowup = async (data) => {
    const response = await SALES_API.post('/followups', data);
    return response.data;
};

// ============ Campaigns (marketing-service) ============

export const getAllCampaigns = async () => {
    const response = await MARKETING_API.get('/campaigns');
    return response.data;
};

export const getCampaignById = async (id) => {
    const response = await MARKETING_API.get(`/campaigns/${id}`);
    return response.data;
};

export const createCampaign = async (data) => {
    const response = await MARKETING_API.post('/campaigns', data);
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
    const response = await SUPPORT_API.get('/tickets');
    return response.data;
};

export const getTicketById = async (id) => {
    const response = await SUPPORT_API.get(`/tickets/${id}`);
    return response.data;
};

export const getTicketsByStatus = async (status) => {
    const response = await SUPPORT_API.get(`/tickets/status/${status}`);
    return response.data;
};

export const createTicket = async (data) => {
    const response = await SUPPORT_API.post('/tickets', data);
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

// ============ Analytics (analytics-service) ============

export const getDashboardAnalytics = async () => {
    const response = await ANALYTICS_API.get('/analytics/dashboard');
    return response.data;
};

export const getAllReports = async () => {
    const response = await ANALYTICS_API.get('/analytics/reports');
    return response.data;
};

export default AUTH_API;
