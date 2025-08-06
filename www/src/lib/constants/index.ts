export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_BASE_URL;
export const ROUTES = {
  index: "/",
  demo: "https://twentypx.com/",
  app: {
    index: "/app",
    agents: {
      index: "/app/agents",
      create: "/app/agents/create",
    },
    settings: "/app/settings",
    customers: "#",
  },
  agent: {
    index: "/app/agents",
    create: "/app/agents/create",
  },
  onboard: {
    business: "/onboard/business",
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
  about: "#",
  blog: "#",
  contact: "#",
};
export enum COOKIE_KEYS {
  token = "token",
  user = "user",
  business = "business",
  currentBusiness = "current_business",
}
export const AUDIO_INPUT_SILENCE_THRESHOLD_DURATION = 2000;
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const BUSINESS_FORM_STEPS = [
  {
    step: 0,
    title: "Let's create your business",
    description: "Start by telling us the essentials about your business.",
    fields: [
      {
        label: "Name",
        value: "name",
        type: "text",
      },
      {
        label: "Slogan",
        value: "slogan",
        type: "text",
      },
      {
        label: "Industry",
        value: "industry",
        inputType: "select",
        options: [
          "Technology",
          "Retail",
          "Finance",
          "Healthcare",
          "Education",
          "Real Estate",
          "E-commerce",
          "SaaS",
          "Marketing",
          "Legal",
          "Hospitality",
          "Travel",
          "Food & Beverage",
          "Entertainment",
          "Logistics",
          "Manufacturing",
          "Construction",
          "Automotive",
          "Fitness & Wellness",
          "Media & Publishing",
          "Telecommunications",
          "Consulting",
          "Nonprofit",
          "Human Resources",
          "Recruitment",
          "Fashion & Apparel",
          "Beauty & Cosmetics",
          "Events & Experiences",
          "Government",
          "Energy & Utilities",
          "Agriculture",
          "Insurance",
          "Gaming",
          "Cybersecurity",
          "AR/VR",
          "Aerospace",
          "Biotech",
          "Home Services",
          "Pets & Animals",
          "Spiritual & Religious Services",
          "Professional Services",
          "Freelancing & Solopreneur",
          "Financial Advisory",
          "Cybersecurity",
          "AI & Machine Learning",
          "Green Energy",
          "Interior Design",
          "Marketplace",
          "Venture Capital",
          "Social Impact",
          "Blockchain & Web3",
        ],
      },
    ],
  },
  {
    step: 1,
    title: "Business Details",
    description:
      "Help us understand what your company does and where to find you online.",
    fields: [
      {
        label: "Description",
        value: "description",
        type: "text",
        inputType: "textarea",
      },
      {
        label: "Website",
        value: "website",
        type: "url",
      },
    ],
  },
  {
    step: 2,
    title: "Contact Info",
    description: "How can we or your customers reach you?",
    fields: [
      {
        label: "Phone",
        value: "contact_info_phone",
        type: "tel",
      },
      {
        label: "Email",
        value: "contact_info_email",
        type: "email",
      },
    ],
  },
];

export const AUDIO_INPUT_TIME_SLICE = 100; // time to send audio chunks
