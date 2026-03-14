const http = require("node:http");

const PORT = 3001;

// ─── In-memory stores ───────────────────────────────────────────────────────

const db = {
  users: [],
  logs: [],
  subscriptionTypes: [],
  subscriptions: [],
  anomalies: [],
  chats: [],
  priorityLevels: [],
  chatStatuses: [],
  chatReports: [],
  actionRequests: [],
  actions: [],
  tickets: [],
};

const counters = {
  users: 1,
  logs: 1,
  subscriptionTypes: 1,
  subscriptions: 1,
  anomalies: 1,
  chats: 1,
  priorityLevels: 1,
  chatStatuses: 1,
  chatReports: 1,
  actionRequests: 1,
  actions: 1,
  tickets: 1,
};

// ─── Seed data ──────────────────────────────────────────────────────────────

const seed = () => {
  const now = new Date().toISOString();

  // Statuses matching FE expectations
  db.chatStatuses.push(
    { chat_status_id: counters.chatStatuses++, chat_status_name: "open_support", created_at: now, updated_at: now },
    { chat_status_id: counters.chatStatuses++, chat_status_name: "open_ai_agent", created_at: now, updated_at: now },
    { chat_status_id: counters.chatStatuses++, chat_status_name: "closed_support", created_at: now, updated_at: now },
    { chat_status_id: counters.chatStatuses++, chat_status_name: "closed_ai_agent", created_at: now, updated_at: now },
  );

  db.priorityLevels.push(
    { priority_level_id: counters.priorityLevels++, priority_level_name: "low" },
    { priority_level_id: counters.priorityLevels++, priority_level_name: "medium" },
    { priority_level_id: counters.priorityLevels++, priority_level_name: "high" },
    { priority_level_id: counters.priorityLevels++, priority_level_name: "critical" },
  );

  // ── Seed users ──────────────────────────────────────────────────────────────

  const seedUsers = [
    { first_name: "Alice",   last_name: "Johnson",  email: "alice@example.com",   username: "alice" },
    { first_name: "Bob",     last_name: "Smith",     email: "bob@example.com",     username: "bob" },
    { first_name: "Carol",   last_name: "Williams",  email: "carol@example.com",   username: "carol" },
    { first_name: "David",   last_name: "Brown",     email: "david@example.com",   username: "david" },
    { first_name: "Eve",     last_name: "Davis",     email: "eve@example.com",     username: "eve" },
    { first_name: "Frank",   last_name: "Miller",    email: "frank@example.com",   username: "frank" },
    { first_name: "Grace",   last_name: "Wilson",    email: "grace@example.com",   username: "grace" },
    { first_name: "Hank",    last_name: "Moore",     email: "hank@example.com",    username: "hank" },
    { first_name: "Irene",   last_name: "Taylor",    email: "irene@example.com",   username: "irene" },
    { first_name: "Jack",    last_name: "Anderson",  email: "jack@example.com",    username: "jack" },
  ];

  for (const userData of seedUsers) {
    db.users.push({
      user_id: counters.users++,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      password_hash: "",
      is_active: true,
      has_subscription: Math.random() > 0.5,
      created_at: now,
      updated_at: now,
    });
  }

  // ── Seed actions ────────────────────────────────────────────────────────────

  const seedActions = [
    { name: "Refund", description: "Issue a full or partial refund to the customer", allowed: true },
    { name: "Discount Code", description: "Generate a one-time discount code", allowed: true },
    { name: "Account Reset", description: "Reset customer account credentials", allowed: false },
    { name: "Escalate to Manager", description: "Forward the issue to a team manager", allowed: true },
  ];

  for (const actionData of seedActions) {
    db.actions.push({
      action_id: counters.actions++,
      action_name: actionData.name,
      action_description: actionData.description,
      is_allowed: actionData.allowed,
      created_at: now,
      updated_at: now,
    });
  }

  // ── Seed 15 chats ───────────────────────────────────────────────────────────

  // status_id: 1=open_support, 2=open_ai_agent, 3=closed_support, 4=closed_ai_agent
  // priority:  1=low, 2=medium, 3=high, 4=critical

  const chatSeeds = [
    // Chat 1 — open_support, high priority, long conversation
    {
      user_id: 1, status_id: 1, priority: 3, issue_type: "Billing",
      messages: [
        { role: "user", content: "Hi, I was charged twice for my subscription last month. Order #12345." },
        { role: "assistant", content: "I'm sorry to hear about the double charge. Let me look into order #12345 for you right away." },
        { role: "assistant", content: "I can see there were indeed two charges on March 1st — $29.99 each. This appears to be a billing system error." },
        { role: "user", content: "Yes exactly. Can I get a refund for the extra charge?" },
        { role: "assistant", content: "Absolutely. I'd like to initiate a refund for the duplicate charge of $29.99. This will be processed back to your original payment method within 3-5 business days." },
        { role: "user", content: "That sounds good. Will I get an email confirmation?" },
        { role: "assistant", content: "Yes, you'll receive a refund confirmation email within the next hour. Is there anything else I can help you with?" },
        { role: "user", content: "No, that's all. Thank you for the quick help!" },
      ],
    },
    // Chat 2 — open_support, critical priority, long conversation
    {
      user_id: 2, status_id: 1, priority: 4, issue_type: "Account Access",
      messages: [
        { role: "user", content: "I can't log into my account. It says my account has been locked." },
        { role: "assistant", content: "I understand how frustrating that must be. Let me check the status of your account." },
        { role: "assistant", content: "I can see your account was locked due to multiple failed login attempts. This is a security measure to protect your account." },
        { role: "user", content: "I didn't make those attempts! Someone might be trying to hack my account." },
        { role: "assistant", content: "That's a valid concern. I can see the failed attempts came from an IP address in a different country than your usual location. I recommend we reset your password and enable two-factor authentication." },
        { role: "user", content: "Yes please, let's do that immediately." },
        { role: "assistant", content: "I've sent a password reset link to your registered email. Once you set a new password, I'll guide you through enabling 2FA." },
        { role: "user", content: "Got it, I just reset my password. How do I enable 2FA?" },
        { role: "assistant", content: "Go to Settings → Security → Two-Factor Authentication. You can use either an authenticator app or SMS verification. I recommend the authenticator app for better security." },
        { role: "user", content: "Done! Thanks for the help. Should I be worried about data breach?" },
        { role: "assistant", content: "Since the login attempts were unsuccessful, your data should be safe. However, I've flagged this for our security team to investigate further. They may reach out if they find anything concerning." },
      ],
    },
    // Chat 3 — open_ai_agent, medium priority, conversation with AI
    {
      user_id: 3, status_id: 2, priority: 2, issue_type: "Product Inquiry",
      messages: [
        { role: "user", content: "What's the difference between the Pro and Enterprise plans?" },
        { role: "assistant", content: "Great question! Here's a quick comparison:\n\n**Pro Plan ($49/mo)**\n- Up to 10 team members\n- 100GB storage\n- Priority email support\n\n**Enterprise Plan ($199/mo)**\n- Unlimited team members\n- 1TB storage\n- 24/7 phone & email support\n- Custom integrations\n- Dedicated account manager" },
        { role: "user", content: "Can I upgrade from Pro to Enterprise mid-cycle?" },
        { role: "assistant", content: "Yes! You can upgrade at any time. When you upgrade mid-cycle, you'll only be charged the prorated difference for the remaining days in your billing period." },
        { role: "user", content: "And is there a free trial for Enterprise?" },
        { role: "assistant", content: "We offer a 14-day free trial for the Enterprise plan. You can start it from your account settings under Billing → Change Plan. No credit card required for the trial period." },
      ],
    },
    // Chat 4 — open_support, low priority
    {
      user_id: 4, status_id: 1, priority: 1, issue_type: "Feature Request",
      messages: [
        { role: "user", content: "I'd love to see dark mode support in the mobile app. Any plans for that?" },
        { role: "assistant", content: "Thank you for the suggestion! Dark mode for the mobile app is on our roadmap. I'll add your vote to the feature request." },
      ],
    },
    // Chat 5 — closed_ai_agent, low priority
    {
      user_id: 5, status_id: 4, priority: 1, issue_type: "General Inquiry",
      messages: [
        { role: "user", content: "What are your customer support hours?" },
        { role: "assistant", content: "Our support team is available Monday to Friday, 9 AM to 6 PM EST. For urgent issues, our AI assistant is available 24/7." },
      ],
    },
    // Chat 6 — open_support, high priority
    {
      user_id: 6, status_id: 1, priority: 3, issue_type: "Technical Issue",
      messages: [
        { role: "user", content: "The export feature is broken — I keep getting a 500 error when trying to download my reports." },
        { role: "assistant", content: "I apologize for the inconvenience. Let me escalate this to our engineering team right away." },
      ],
    },
    // Chat 7 — open_ai_agent, medium priority
    {
      user_id: 7, status_id: 2, priority: 2, issue_type: "Billing",
      messages: [
        { role: "user", content: "How do I update my payment method?" },
        { role: "assistant", content: "You can update your payment method by going to Settings → Billing → Payment Methods. Click 'Add new' to add a card, then set it as default." },
      ],
    },
    // Chat 8 — closed_support, medium priority
    {
      user_id: 8, status_id: 3, priority: 2, issue_type: "Billing",
      messages: [
        { role: "user", content: "I need an invoice for my last 3 months of payments for tax purposes." },
        { role: "assistant", content: "I've generated the invoices and sent them to your registered email. Please check your inbox." },
      ],
    },
    // Chat 9 — open_support, critical priority
    {
      user_id: 9, status_id: 1, priority: 4, issue_type: "Data Loss",
      messages: [
        { role: "user", content: "All my project files are gone! I had 6 months of work in there. Please help!" },
        { role: "assistant", content: "I understand this is urgent. Let me immediately check our backup systems for your project data." },
      ],
    },
    // Chat 10 — closed_ai_agent, low priority
    {
      user_id: 10, status_id: 4, priority: 1, issue_type: "General Inquiry",
      messages: [
        { role: "user", content: "Do you offer student discounts?" },
        { role: "assistant", content: "Yes! We offer 50% off for verified students. You can apply with your .edu email at our student portal." },
      ],
    },
    // Chat 11 — open_support, medium priority
    {
      user_id: 1, status_id: 1, priority: 2, issue_type: "Integration Issue",
      messages: [
        { role: "user", content: "The Slack integration stopped sending notifications 2 days ago." },
        { role: "assistant", content: "Let me check your integration settings and recent webhook logs." },
      ],
    },
    // Chat 12 — open_ai_agent, low priority
    {
      user_id: 3, status_id: 2, priority: 1, issue_type: "Product Inquiry",
      messages: [
        { role: "user", content: "Can I import data from a CSV file?" },
        { role: "assistant", content: "Yes, we support CSV imports. Go to Data → Import and select your CSV file. We support files up to 50MB." },
      ],
    },
    // Chat 13 — closed_support, high priority
    {
      user_id: 5, status_id: 3, priority: 3, issue_type: "Technical Issue",
      messages: [
        { role: "user", content: "Our API calls are returning 429 rate limit errors even though we're well under the limit." },
        { role: "assistant", content: "We identified a bug in the rate limiter. A fix has been deployed and your API access should be restored." },
      ],
    },
    // Chat 14 — open_support, high priority
    {
      user_id: 7, status_id: 1, priority: 3, issue_type: "Account Access",
      messages: [
        { role: "user", content: "I need to transfer ownership of our team workspace to another admin." },
        { role: "assistant", content: "I can help with that. For security, I'll need to verify your identity first. Can you confirm the email used to create the workspace?" },
      ],
    },
    // Chat 15 — closed_ai_agent, medium priority
    {
      user_id: 9, status_id: 4, priority: 2, issue_type: "Billing",
      messages: [
        { role: "user", content: "I want to cancel my subscription. What happens to my data?" },
        { role: "assistant", content: "If you cancel, your data will be retained for 30 days. After that, it will be permanently deleted. You can export all your data before canceling from Settings → Data Export." },
      ],
    },
  ];

  for (const chatSeed of chatSeeds) {
    const chatId = counters.chats++;
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();

    const messages = chatSeed.messages.map((msg, msgIndex) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(new Date(createdAt).getTime() + msgIndex * 60000).toISOString(),
    }));

    db.chats.push({
      chat_id: chatId,
      user_id: chatSeed.user_id,
      chat_messages: messages,
      chat_status_id: chatSeed.status_id,
      created_by_llm: chatSeed.status_id === 2 || chatSeed.status_id === 4,
      anomaly_id: null,
      priority_level_id: chatSeed.priority,
      created_at: createdAt,
      updated_at: messages[messages.length - 1].timestamp,
    });

    // Create a report for chats that have an issue_type
    if (chatSeed.issue_type) {
      db.chatReports.push({
        id: counters.chatReports++,
        chat_id: chatId,
        report_data: { issue_type: chatSeed.issue_type, severity: chatSeed.priority >= 3 ? "high" : "normal" },
        created_at: createdAt,
        updated_at: createdAt,
      });
    }
  }

  // ── Seed tickets ───────────────────────────────────────────────────────────

  const seedTickets = [
    { name: "Investigate double billing reports" },
    { name: "Update FAQ for new pricing plans" },
    { name: "Fix CSV export 500 error" },
    { name: "Review rate limiter configuration" },
    { name: "Add 2FA setup guide to help center" },
  ];

  for (const ticketData of seedTickets) {
    db.tickets.push({
      id: counters.tickets++,
      ticket_name: ticketData.name,
      ticket_description: "",
      created_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: now,
    });
  }

  // ── Seed action requests ──────────────────────────────────────────────────

  db.actionRequests.push(
    {
      id: counters.actionRequests++,
      chat_id: 9,
      action_id: 1, // Refund
      is_approved: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: counters.actionRequests++,
      chat_id: 1,
      action_id: 1, // Refund
      is_approved: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: counters.actionRequests++,
      chat_id: 6,
      action_id: 4, // Escalate to Manager
      is_approved: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: counters.actionRequests++,
      chat_id: 14,
      action_id: 3, // Account Reset
      is_approved: false,
      created_at: now,
      updated_at: now,
    },
  );
};

seed();

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Parse JSON body from an incoming request. */
const parseBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString();
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });

/** Send a JSON response. */
const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
};

/** Send a 204 No Content response. */
const sendNoContent = (res) => {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end();
};

/** Send an error response. */
const sendError = (res, statusCode, message) => {
  sendJson(res, statusCode, { error: message });
};

/**
 * Match a URL pattern with named params (e.g. "/chat/:id").
 * Returns params object or null if no match.
 */
const matchRoute = (pattern, pathname) => {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let index = 0; index < patternParts.length; index++) {
    if (patternParts[index].startsWith(":")) {
      params[patternParts[index].slice(1)] = pathParts[index];
    } else if (patternParts[index] !== pathParts[index]) {
      return null;
    }
  }
  return params;
};

// ─── Route definitions ──────────────────────────────────────────────────────

const routes = [];

/** Register a route handler. */
const route = (method, pattern, handler) => {
  routes.push({ method, pattern, handler });
};

// ─── Client endpoints ───────────────────────────────────────────────────────

// POST /chat — Start a new chat
route("POST", "/chat", async (req, res) => {
  const body = await parseBody(req);
  const { email, text } = body;

  if (!email || !text) {
    return sendError(res, 400, "email and text are required");
  }

  const now = new Date().toISOString();

  // Find or create user by email
  let user = db.users.find((u) => u.email === email);
  if (!user) {
    user = {
      user_id: counters.users++,
      username: email.split("@")[0],
      first_name: "",
      last_name: "",
      email,
      password_hash: "",
      is_active: true,
      has_subscription: false,
      created_at: now,
      updated_at: now,
    };
    db.users.push(user);
  }

  const chat = {
    chat_id: counters.chats++,
    user_id: user.user_id,
    chat_messages: [{ role: "user", content: text, timestamp: now }],
    chat_status_id: 1, // open
    created_by_llm: false,
    anomaly_id: null,
    priority_level_id: 1, // low
    created_at: now,
    updated_at: now,
  };
  db.chats.push(chat);

  sendJson(res, 201, { chat });
});

// GET /chat/:id — Get chat with messages
route("GET", "/chat/:id", async (_req, res, params) => {
  const chatId = Number(params.id);
  const chat = db.chats.find((c) => c.chat_id === chatId);

  if (!chat) {
    return sendError(res, 404, "Chat not found");
  }

  sendJson(res, 200, { data: chat });
});

// POST /chat/:id — Send a message
route("POST", "/chat/:id", async (req, res, params) => {
  const chatId = Number(params.id);
  const chat = db.chats.find((c) => c.chat_id === chatId);

  if (!chat) {
    return sendError(res, 404, "Chat not found");
  }

  const body = await parseBody(req);
  const { text } = body;

  if (!text) {
    return sendError(res, 400, "text is required");
  }

  if (!Array.isArray(chat.chat_messages)) {
    chat.chat_messages = [];
  }

  chat.chat_messages.push({ role: "user", content: text, timestamp: new Date().toISOString() });
  chat.updated_at = new Date().toISOString();

  sendNoContent(res);
});

// ─── Back Office endpoints ──────────────────────────────────────────────────

// GET /bo/chats — List all chats (without messages)
route("GET", "/bo/chats", async (_req, res) => {
  const data = db.chats.map((chat) => {
    const status = db.chatStatuses.find((s) => s.chat_status_id === chat.chat_status_id);
    const report = db.chatReports.find((r) => r.chat_id === chat.chat_id) || null;
    const firstMessage =
      Array.isArray(chat.chat_messages) && chat.chat_messages.length > 0
        ? (chat.chat_messages[0].content || chat.chat_messages[0].text || "")
        : "";

    const { chat_messages, ...chatWithoutMessages } = chat;

    const user = db.users.find((u) => u.user_id === chat.user_id) || null;

    return {
      chat: chatWithoutMessages,
      status: status ? status.chat_status_name : "unknown",
      report,
      first_message: firstMessage,
      user,
    };
  });

  sendJson(res, 200, { data });
});

// GET /bo/chat/:id — Get single chat with full details
route("GET", "/bo/chat/:id", async (_req, res, params) => {
  const chatId = Number(params.id);
  const chat = db.chats.find((c) => c.chat_id === chatId);

  if (!chat) {
    return sendError(res, 404, "Chat not found");
  }

  const status = db.chatStatuses.find((s) => s.chat_status_id === chat.chat_status_id);
  const report = db.chatReports.find((r) => r.chat_id === chat.chat_id) || null;
  const openAction =
    db.actionRequests.find((ar) => ar.chat_id === chatId && !ar.is_approved) || null;

  sendJson(res, 200, {
    data: {
      chat,
      status: status ? status.chat_status_name : "unknown",
      report,
      open_action: openAction,
    },
  });
});

// PATCH /bo/action_request/:id — Accept or reject an action request
route("PATCH", "/bo/action_request/:id", async (req, res, params) => {
  const requestId = Number(params.id);
  const actionRequest = db.actionRequests.find((ar) => ar.id === requestId);

  if (!actionRequest) {
    return sendError(res, 404, "Action request not found");
  }

  const body = await parseBody(req);
  const { action } = body;

  if (action !== "accepted" && action !== "rejected") {
    return sendError(res, 400, 'action must be "accepted" or "rejected"');
  }

  actionRequest.is_approved = action === "accepted";
  actionRequest.updated_at = new Date().toISOString();

  sendNoContent(res);
});

// PATCH /bo/chat/:id — Escalate to human / send human message
route("PATCH", "/bo/chat/:id", async (req, res, params) => {
  const chatId = Number(params.id);
  const chat = db.chats.find((c) => c.chat_id === chatId);

  if (!chat) {
    return sendError(res, 404, "Chat not found");
  }

  const body = await parseBody(req);
  const { escalate_to_human, message } = body;

  if (escalate_to_human) {
    const escalatedStatus = db.chatStatuses.find((s) => s.chat_status_name === "escalated");
    if (escalatedStatus) {
      chat.chat_status_id = escalatedStatus.chat_status_id;
    }
  }

  if (message) {
    if (!Array.isArray(chat.chat_messages)) {
      chat.chat_messages = [];
    }
    chat.chat_messages.push({
      role: "assistant",
      content: message,
      timestamp: new Date().toISOString(),
    });
  }

  chat.updated_at = new Date().toISOString();

  sendNoContent(res);
});

// GET /bo/actions — List all actions
route("GET", "/bo/actions", async (_req, res) => {
  sendJson(res, 200, { data: db.actions });
});

// POST /bo/action — Create an action
route("POST", "/bo/action", async (req, res) => {
  const body = await parseBody(req);
  const now = new Date().toISOString();

  const action = {
    action_id: counters.actions++,
    action_name: body.action_name || "",
    action_description: body.action_description || "",
    is_allowed: body.is_allowed ?? true,
    created_at: now,
    updated_at: now,
  };

  db.actions.push(action);
  sendJson(res, 201, action);
});

// PATCH /bo/action — Update an action
route("PATCH", "/bo/action", async (req, res) => {
  const body = await parseBody(req);
  const { action_id, ...updates } = body;

  if (!action_id) {
    return sendError(res, 400, "action_id is required");
  }

  const action = db.actions.find((a) => a.action_id === action_id);
  if (!action) {
    return sendError(res, 404, "Action not found");
  }

  Object.assign(action, updates, { updated_at: new Date().toISOString() });
  sendNoContent(res);
});

// GET /bo/tickets — List all tickets
route("GET", "/bo/tickets", async (_req, res) => {
  sendJson(res, 200, { data: db.tickets });
});

// GET /bo/action_requests — List all action requests
route("GET", "/bo/action_requests", async (_req, res) => {
  sendJson(res, 200, { data: db.actionRequests });
});

// GET /bo/users — List all users
route("GET", "/bo/users", async (_req, res) => {
  sendJson(res, 200, { data: db.users });
});

// ─── Server ─────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const method = req.method;

  for (const { method: routeMethod, pattern, handler } of routes) {
    if (method !== routeMethod) continue;

    const params = matchRoute(pattern, pathname);
    if (params) {
      try {
        return await handler(req, res, params);
      } catch (error) {
        console.error(`Error handling ${method} ${pathname}:`, error);
        return sendError(res, 500, "Internal server error");
      }
    }
  }

  sendError(res, 404, "Not found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
