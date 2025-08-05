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
  bookMeeting: "BOOK_MEETING",
};

export const QEUES = {
  conversationTagging: "conversation-tagging",
};

export const MAX_CONVERSATION_CONTEXT = 3;

export const WebSocketResponseType = Object.freeze({
  TTS_AUDIO_STREAM: "TTS_AUDIO_STREAM",
  TTS_AUDIO_STREAM_END: "TTS_AUDIO_STREAM_END",
  AGENT_SERVICES_READY: "AGENT_SERVICES_READY",
  ERROR: "ERROR",
  LLM_PROCESSING_ERROR: "LLM_PROCESSING_ERROR",
  LLM_RESPONSE: "LLM_RESPONSE",
});
