export const conversationIntent = {
  productInquiry: "PRODUCT_INQUIRY",
  pricingRequest: "PRICING_REQUEST",
  bookingRequest: "BOOKING_REQUEST",
  supportQuestion: "SUPPORT_QUESTION",
  technicalIssue: "TECHNICAL_ISSUE",
  featureRequest: "FEATURE_REQUEST",
  generalQuestion: "GENERAL_QUESTION",
  partnershipOpportunity: "PARTNERSHIP_OPPORTUNITY",
  salesFollowUp: "SALES_FOLLOW_UP",
  unsubscribeRequest: "UNSUBSCRIBE_REQUEST",
  jobApplication: "JOB_APPLICATION",
  billingIssue: "BILLING_ISSUE",
  demoRequest: "DEMO_REQUEST",
  feedbackSubmission: "FEEDBACK_SUBMISSION",
};

export const leadQuality = {
  cold: "COLD",
  warm: "WARM",
  hot: "HOT",
  disqualified: "DISQUALIFIED",
};

export const conversationNextSteps = {
  scheduleCall: "SCHEDULE_CALL",
  sendPricing: "SEND_PRICING",
  sendBrochure: "SEND_BROCHURE",
  followUp: "FOLLOW_UP",
  escalateToSales: "ESCALATE_TO_SALES",
  waitForResponse: "WAIT_FOR_RESPONSE",
  noActionRequired: "NO_ACTION_REQUIRED",
  qualifyLead: "QUALIFY_LEAD",
  sendInvoice: "SEND_INVOICE",
  bookDemo: "BOOK_DEMO",
};

export const QEUES = {
  conversationTagging: "conversation-tagging",
};

export const MAX_CONVERSATION_CONTEXT = 3;
