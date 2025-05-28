export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/v1/api";
export const RESET_APP = "app/reset";

export const SORT_OPTIONS = {
  DEFAULT: "default",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  CREATED_ASC: "created_asc",
  CREATED_DESC: "created_desc",
};

export const SORT_OPTIONS_VALUES = {
  DEFAULT: 0,
  NAME_ASC: 1,
  NAME_DESC: 2,
  CREATED_ASC: 3,
  CREATED_DESC: 4,
};

export const AVATAR_COLORS = [
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
  "#87d068",
  "#1890ff",
  "#eb2f96",
  "#fa541c",
  "#13c2c2",
  "#52c41a",
];

export const GRADIENT_COMBOS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #ff9a9e, #fad0c4)",
  "linear-gradient(135deg, #89f7fe, #66a6ff)",
  "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
  "linear-gradient(135deg, #ffecd2, #fcb69f)",
  "linear-gradient(135deg, #f6d365, #fda085)",
  "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  "linear-gradient(135deg, #d4fc79, #96e6a1)",
  "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #30cfd0, #330867)",
  "linear-gradient(135deg, #5ee7df, #b490ca)",
  "linear-gradient(135deg, #c2e9fb, #81a4fd)",
  "linear-gradient(135deg, #fccb90, #d57eeb)",
  "linear-gradient(135deg, #fa709a, #fee140)",
];

export const BOARD_BG_GRADIANT_COLORS = [
  { bg: "linear-gradient(to right, #a1c4fd, #c2e9fb)", emoji: "🫧" },
  { bg: "linear-gradient(to right, #2980b9, #6dd5fa)", emoji: "❄️" },
  { bg: "linear-gradient(to right, #0052d4, #4364f7)", emoji: "🌊" },
  { bg: "linear-gradient(to right, #a18cd1, #fbc2eb)", emoji: "🪷" },
  { bg: "linear-gradient(to right, #fc67fa, #f4c4f3)", emoji: "🌈" },
  { bg: "linear-gradient(to right, #f7971e, #ffd200)", emoji: "🥭" },
  { bg: "linear-gradient(to right, #fbc2eb, #a6c1ee)", emoji: "🌸" },
  { bg: "linear-gradient(to right, #11998e, #38ef7d)", emoji: "🌍" },
  { bg: "linear-gradient(to right, #2c3e50, #4ca1af)", emoji: "👽" },
  { bg: "linear-gradient(to right, #e52d27, #b31217)", emoji: "🍄" },
];

export const BOARD_BG_SOLID_COLORS = [
  "#0079bf",
  "#d29034",
  "#519839",
  "#b04632",
  "#89609e",
  "#cd5a91",
  "#4bbf6b",
  "#00aecc",
  "#838c91",
  "#f2d600",
];

export const STATUS_LIST_COLORS = [
  "#D0EBFF",
  "#FFECB3",
  "#C8E6C9",
  "#FFCDD2",
  "#E1BEE7",
  "#F8BBD0",
  "#B2EBF2",
  "#BBDEFB",
  "#E0E0E0",
  "#FFF59D",
  "#FFD180",
  "#B2DFDB",
];

export const TICKET_LABELS = [
  "FE",
  "BE",
  "Web",
  "Mobile",
  "UI improvement",
  "feature",
  "bug",
  "enhancement",
  "performance",
  "refactor",
  "testing",
  "documentation",
  "devops",
  "security",
  "api",
  "integration",
  "database",
  "UX",
  "CI/CD",
  "infra",
  "code cleanup",
] as const;
