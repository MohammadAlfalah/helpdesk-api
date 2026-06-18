/* HelpDesk agent console — real API client.
 *
 * Replaces the mock data.js. Talks to the HelpDesk REST API on the SAME origin
 * (the API serves this page from wwwroot), so there is no CORS to configure and
 * paths are simple relative "/api/..." calls. The JWT from /api/auth/login is
 * kept in localStorage and sent as a Bearer token on every request.
 *
 * The API returns enums as strings (JsonStringEnumConverter) and dates as ISO
 * strings; the console components expect epoch-millisecond timestamps, so the
 * mappers below convert dates while leaving the already-correct enum strings
 * (status "Open"/"InProgress"/…, priority "Low"/…) untouched.
 */
window.HelpDeskApi = (function () {
  const TOKEN_KEY = 'helpdesk.token';
  const USER_KEY = 'helpdesk.user';

  let token = localStorage.getItem(TOKEN_KEY) || null;
  let user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

  async function request(path, options = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(path, Object.assign({}, options, { headers }));

    if (res.status === 401) {
      logout();
      throw new Error('Your session has expired — please sign in again.');
    }
    if (!res.ok) {
      let message = 'Request failed (' + res.status + ').';
      try {
        const problem = await res.json();
        message = problem.detail || problem.title || problem.error || message;
      } catch { /* non-JSON error body */ }
      throw new Error(message);
    }
    if (res.status === 204) return null;
    const contentType = res.headers.get('content-type') || '';
    return contentType.includes('application/json') ? res.json() : res.text();
  }

  const toMs = (iso) => (iso ? new Date(iso).getTime() : null);

  function mapTicket(t) {
    return Object.assign({}, t, {
      createdAt: toMs(t.createdAt) || Date.now(),
      updatedAt: toMs(t.updatedAt) || Date.now(),
      slaDueAt: toMs(t.slaDueAt) || Date.now(),
      resolvedAt: toMs(t.resolvedAt),
      escalatedAt: toMs(t.escalatedAt),
    });
  }
  function mapComment(c) {
    return Object.assign({}, c, { createdAt: toMs(c.createdAt) || Date.now() });
  }

  // ---- auth ----
  async function login(email, password) {
    const r = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    token = r.token;
    user = { email: r.email, fullName: r.fullName, role: r.role };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }
  function logout() {
    token = null;
    user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  function currentUser() { return user; }
  function isAuthenticated() { return Boolean(token); }

  // ---- tickets ----
  async function getTickets() {
    const r = await request('/api/tickets?pageSize=100'); // default sort = newest first
    return (r.items || []).map(mapTicket);
  }
  async function getComments(ticketId) {
    const r = await request('/api/tickets/' + ticketId + '/comments');
    return (r || []).map(mapComment);
  }
  async function getAgents() {
    try { return await request('/api/users/agents'); }
    catch { return []; } // customers can't list agents — degrade gracefully
  }
  async function createTicket(payload) {
    const r = await request('/api/tickets', { method: 'POST', body: JSON.stringify(payload) });
    return mapTicket(r);
  }
  async function addComment(ticketId, body, isInternal) {
    const r = await request('/api/tickets/' + ticketId + '/comments', {
      method: 'POST',
      body: JSON.stringify({ body, isInternal }),
    });
    return mapComment(r);
  }
  async function updateTicket(ticketId, patch) {
    const r = await request('/api/tickets/' + ticketId, { method: 'PUT', body: JSON.stringify(patch) });
    return mapTicket(r);
  }
  async function assignTicket(ticketId, agentId) {
    const r = await request('/api/tickets/' + ticketId + '/assign', {
      method: 'POST',
      body: JSON.stringify({ agentId: agentId === '' || agentId == null ? null : Number(agentId) }),
    });
    return mapTicket(r);
  }

  return {
    login, logout, currentUser, isAuthenticated,
    getTickets, getComments, getAgents,
    createTicket, addComment, updateTicket, assignTicket,
  };
})();
