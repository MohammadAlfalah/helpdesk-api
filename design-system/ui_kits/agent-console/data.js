/* Mock data for the HelpDesk agent console — shapes mirror the API's TicketReadDto. */
window.KIT_DATA = (function () {
  const H = 3.6e6;
  const now = Date.now();
  const agents = [
    { id: 2, fullName: 'Dana Okafor', email: 'dana@helpdesk.local', role: 'Agent' },
    { id: 3, fullName: 'Marcus Hale', email: 'marcus@helpdesk.local', role: 'Agent' },
    { id: 4, fullName: 'Priya Raman', email: 'priya@helpdesk.local', role: 'Agent' },
  ];
  const cust = (id, n, e) => ({ id, fullName: n, email: e, role: 'Customer' });

  const tickets = [
    {
      id: 2048, title: 'VPN keeps dropping every few minutes', category: 'Network',
      description: 'The corporate VPN disconnects every few minutes on my machine. Restarting the client does not help and it happens across two laptops. It started this morning after the maintenance window.',
      status: 'Open', priority: 'High',
      createdBy: cust(11, 'Sam Liu', 'sam.liu@northwind.co'), assignedAgent: agents[0],
      createdAt: now - 2 * H, updatedAt: now - 30 * 6e4, slaDueAt: now + 2 * H,
      isEscalated: false, isSlaBreached: false,
    },
    {
      id: 2047, title: 'Cannot reset password — link expired', category: 'Account',
      description: 'Every password reset email link says it has expired the moment I click it. I have tried three times over the last hour.',
      status: 'InProgress', priority: 'Urgent',
      createdBy: cust(12, 'Rosa Méndez', 'rosa@brightpath.io'), assignedAgent: agents[1],
      createdAt: now - 5 * H, updatedAt: now - 1 * H, slaDueAt: now - 0.5 * H,
      isEscalated: true, isSlaBreached: true,
    },
    {
      id: 2046, title: 'Printer on 3rd floor offline', category: 'Hardware',
      description: 'The shared printer (HP-3F) shows offline for everyone on the third floor since yesterday afternoon.',
      status: 'Open', priority: 'Medium',
      createdBy: cust(13, 'Tomas Berg', 'tomas@northwind.co'), assignedAgent: null,
      createdAt: now - 20 * H, updatedAt: now - 20 * H, slaDueAt: now + 4 * H,
      isEscalated: false, isSlaBreached: false,
    },
    {
      id: 2045, title: 'Billing invoice shows wrong seat count', category: 'Billing',
      description: 'Our latest invoice lists 60 seats but we are on the 45-seat plan. Please correct and re-issue.',
      status: 'InProgress', priority: 'Medium',
      createdBy: cust(14, 'Aisha Khan', 'aisha@brightpath.io'), assignedAgent: agents[2],
      createdAt: now - 26 * H, updatedAt: now - 3 * H, slaDueAt: now + 0.4 * H,
      isEscalated: false, isSlaBreached: false,
    },
    {
      id: 2044, title: 'Onboarding new starter — laptop request', category: 'Hardware',
      description: 'New hire starts Monday and needs a standard developer laptop image and a monitor.',
      status: 'Resolved', priority: 'Low',
      createdBy: cust(15, 'Jordan Webb', 'jordan@northwind.co'), assignedAgent: agents[0],
      createdAt: now - 70 * H, updatedAt: now - 40 * H, resolvedAt: now - 40 * H, slaDueAt: now - 10 * H,
      isEscalated: false, isSlaBreached: false,
    },
    {
      id: 2043, title: 'Email signature not applying for the team', category: 'Account',
      description: 'The standard signature template is not being pushed to anyone in the sales team Outlook.',
      status: 'Closed', priority: 'Low',
      createdBy: cust(16, 'Lena Fischer', 'lena@brightpath.io'), assignedAgent: agents[1],
      createdAt: now - 96 * H, updatedAt: now - 80 * H, resolvedAt: now - 82 * H, slaDueAt: now - 24 * H,
      isEscalated: false, isSlaBreached: false,
    },
  ];

  const comments = {
    2048: [
      { id: 1, author: cust(11, 'Sam Liu', 'sam.liu@northwind.co'), body: 'It just dropped again while I was on a call. Really disruptive.', isInternal: false, createdAt: now - 1.5 * H },
      { id: 2, author: agents[0], body: 'Thanks Sam — taking a look now. Can you confirm which VPN gateway you connect to?', isInternal: false, createdAt: now - 1 * H },
      { id: 3, author: agents[0], body: 'Gateway GW-2 was flapping after the maintenance window. Escalating to network team.', isInternal: true, createdAt: now - 40 * 6e4 },
    ],
    2047: [
      { id: 4, author: cust(12, 'Rosa Méndez', 'rosa@brightpath.io'), body: 'Still cannot get in. This is now blocking my whole morning.', isInternal: false, createdAt: now - 2 * H },
      { id: 5, author: agents[1], body: 'SLA breached — token TTL was misconfigured. Pushing a fix and will reset her link manually.', isInternal: true, createdAt: now - 50 * 6e4 },
    ],
  };

  const counts = { all: tickets.length, open: 2, inprogress: 2, escalated: 1, resolved: 1 };

  return { agents, tickets, comments, counts, now };
})();
