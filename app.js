const STORAGE_KEY = "seedlog.v1";
const SQLITE_DB_PATH = "sqlite:seedlog.db";
const SQLITE_MIGRATION_KEY = "seedlog.sqlite.migrated.v1";
// Non-core state that has no SQLite table of its own — learning progress, goals,
// coach output. Mirrored to a single app_kv['aux'] row in SQLite mode so it
// survives a localStorage wipe (previously these lived ONLY on localStorage).
const AUX_STATE_KEYS = [
  "learningTracks",
  "learningSessions",
  "learningWeeklyHours",
  "learningReviewDone",
  "goals",
  "reflectionCoaches",
];
const PROJECTS_MIGRATION_KEY = "seedlog.projects.migrated.v1";
const SOURCE_TAG_MIGRATION_KEY = "seedlog.sourceTag.migrated.v1";
const APP_BUILD = "review-p2p3-20260628";

const KoreanDate = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
});

const LongDate = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

const STOP_WORDS = new Set([
  "그리고",
  "그냥",
  "내가",
  "나는",
  "오늘",
  "오전",
  "오후",
  "이번",
  "저번",
  "관련",
  "대한",
  "위해",
  "해서",
  "하기",
  "있는",
  "없는",
  "것도",
  "것은",
  "것을",
  "정도",
  "좀더",
  "다시",
  "나중",
  "어떤",
  "좋을까",
  "확인",
  "정리",
  "생각",
  "todo",
  "task",
  "note",
  "idea",
  "studio",
  "q3",
  "분기",
  "프로젝트",
  "프로젝트화",
  "기능",
  "확장",
  "앱",
  "까지",
  "로드맵",
  "완료",
  "정의",
  "구현",
  "연결",
  "milestone",
  "roadmap",
  "release",
  "hardening",
  "docs",
  "demo",
  "scenario",
  "beta",
  "prototype",
  "with",
  "from",
  "this",
  "that",
]);

const SIGNAL_EXCLUDED_KEYWORDS = new Set([
  "택배",
  "반납",
  "반품",
  "배송",
  "청소",
  "빨래",
  "설거지",
  "분리수거",
  "쓰레기",
  "장보기",
  "마트",
  "주문",
  "결제",
  "예약",
  "은행",
  "세탁",
  "집안일",
  "parcel",
  "return",
  "delivery",
  "cleaning",
  "laundry",
  "dishes",
  "trash",
  "grocery",
  "errand",
  "chores",
]);

const TYPE_LABEL = {
  task: "할 일",
  idea: "아이디어",
  note: "메모",
  question: "질문",
};

const HORIZON_LABEL = {
  today: "오늘",
  short: "단기",
  long: "장기",
};

// Cultivation pipeline: 씨앗→구체화→개발 are the main flow (now/next/build),
// 학습·보류 (invest/someday) are support lanes. Keys are kept stable for
// laneRank ordering and stored data; only the display labels changed.
const LANE_LABEL = {
  now: "씨앗",
  next: "구체화",
  build: "개발",
  invest: "학습",
  someday: "보류",
};

const MAIN_LANES = ["now", "next", "build"];
const SUPPORT_LANES = ["invest", "someday"];

const LANE_SUBTITLE = {
  now: "떠오른 생각",
  next: "정의 · 다듬기",
  build: "빌드 시작",
  invest: "스킬 적립",
  someday: "지금은 아님 · 얼려둠",
};

const IMPORTANCE_LABEL = {
  low: "Low",
  normal: "Normal",
  high: "High",
  critical: "Critical",
};

const MOMENTUM_LABEL = {
  seed: "Seed",
  active: "Active",
  blocked: "Blocked",
  stale: "Stale",
  done: "Done",
};

const DAILY_CONTEXT_LABEL = {
  company: "회사",
  personal: "개인 업무",
  learning: "학습",
  idea: "아이디어",
  life: "생활/관리",
};

const CONTEXT_ICON = {
  company: "🏢",
  personal: "👤",
  learning: "📖",
  idea: "💡",
  life: "🏡",
};

const TIME_BLOCK_LABEL = {
  morning: "09-12 Morning Focus",
  workday: "12-18 Work/Core",
  evening: "18-24 Evening Build",
};

const TIME_BLOCK_ORDER = ["morning", "workday", "evening"];

const DAILY_PRIORITY_LABEL = {
  primary: "Primary",
  secondary: "Secondary",
  parking: "Parking",
};

// Self-management intervention layer
const BLOCK_CAPACITY = { morning: 3, workday: 5, evening: 3 };
const DEFER_FRICTION_THRESHOLD = 3;
const DEFER_REASON_LABEL = {
  blocked: "막힘 (외부)",
  avoided: "회피 (감정)",
  forgot: "잊음",
  toobig: "너무 큼",
  misscheduled: "시간 잘못",
};

const PROJECT_STATUS_LABEL = {
  active: "Active",
  incubating: "Incubating",
  paused: "Paused",
  completed: "Completed",
};

const AI_PROVIDER_LABEL = {
  rules: "Local Rules",
  ollama: "Ollama",
  openai: "OpenAI-ready",
};

const OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/generate";
const LEARNING_DEPTH_MULTIPLIER = 3;

const DEFAULT_COURSE_MODULES = {
  ibm_ds_01: [
    ["ibm_ds_01_m01", "Defining Data Science and What Data Scientists Do", 3, "11 videos · 11 readings · 5 assignments"],
    ["ibm_ds_01_m02", "Data Science Topics", 4, "13 videos · 8 readings · 6 assignments"],
    ["ibm_ds_01_m03", "Applications and Careers in Data Science", 3, "10 videos · 14 readings · 8 assignments"],
    ["ibm_ds_01_m04", "Data literacy for Data Science (Optional)", 2, "11 videos · 6 readings · 4 assignments"],
  ],
  ibm_ds_02: [
    ["ibm_ds_02_m01", "Overview of Data Science Tools", 3, "Data scientist toolkit · open source, commercial, and cloud tools"],
    ["ibm_ds_02_m02", "Languages of Data Science", 2, "Python, R, SQL and other languages used by data professionals"],
    ["ibm_ds_02_m03", "Packages, APIs, Data Sets, and Models", 3, "Libraries, APIs, datasets, models, and big data tools"],
    ["ibm_ds_02_m04", "Jupyter Notebooks and JupyterLab", 3, "Notebook environments and hands-on data science workflows"],
    ["ibm_ds_02_m05", "RStudio, Git, and GitHub", 3, "RStudio basics, source control, repositories, and collaboration"],
    ["ibm_ds_02_m06", "Create and Share Your Jupyter Notebook", 2, "Final project · create, publish, and share a notebook"],
  ],
  ibm_ds_03: [
    ["ibm_ds_03_m01", "From Problem to Approach and From Requirements to Collection", 2, "Business understanding, analytic approach, data requirements, and collection"],
    ["ibm_ds_03_m02", "From Understanding to Preparation and From Modeling to Evaluation", 2, "Data understanding, preparation, modeling, and evaluation"],
    ["ibm_ds_03_m03", "From Deployment to Feedback and Final Evaluation", 1, "Deployment, feedback loops, and final evaluation"],
    ["ibm_ds_03_m04", "Final Assignment and Case Study", 4, "Apply the data science methodology to a case study"],
  ],
  ibm_ds_04: [
    ["ibm_ds_04_m01", "Python Basics", 5, "Syntax, expressions, variables, data types, and strings"],
    ["ibm_ds_04_m02", "Python Data Structures", 5, "Lists, tuples, dictionaries, sets, and data organization"],
    ["ibm_ds_04_m03", "Python Programming Fundamentals", 5, "Conditions, branching, loops, functions, objects, and exception handling"],
    ["ibm_ds_04_m04", "Working with Data in Python", 5, "Pandas, NumPy, files, and Jupyter Notebook workflows"],
    ["ibm_ds_04_m05", "APIs and Data Collection", 4, "REST APIs, requests, web scraping, and BeautifulSoup"],
  ],
  ibm_ds_05: [
    ["ibm_ds_05_m01", "Crowdsourcing Short Squeeze Dashboard", 4, "Collect stock and revenue data with Python and prepare dashboard inputs"],
    ["ibm_ds_05_m02", "Final Assignment and Dashboard Submission", 3, "Analyze historical stock/revenue data and submit a dashboard project"],
  ],
  ibm_ds_06: [
    ["ibm_ds_06_m01", "Getting Started with SQL", 2, "SELECT, INSERT, UPDATE, DELETE and basic database concepts"],
    ["ibm_ds_06_m02", "Introduction to Relational Databases and Tables", 3, "Relational database concepts, tables, DDL, CREATE, ALTER, DROP, and LOAD"],
    ["ibm_ds_06_m03", "Intermediate SQL", 5, "Filtering, sorting, grouping, functions, subqueries, and joins"],
    ["ibm_ds_06_m04", "Accessing Databases using Python", 4, "Connect Python to databases, use SQL magic, SQLite, and Pandas"],
    ["ibm_ds_06_m05", "Course Assignment", 2, "Analyze real-world Chicago datasets with SQL queries"],
    ["ibm_ds_06_m06", "Bonus Module: Advanced SQL for Data Engineers", 2, "Views, transactions, stored procedures, joins, and advanced query patterns"],
  ],
  ibm_ds_07: [
    ["ibm_ds_07_m01", "Importing Data Sets", 2, "Understand dataset structures and import data with Python libraries"],
    ["ibm_ds_07_m02", "Data Wrangling", 4, "Missing values, formatting, normalization, binning, and categorical variables"],
    ["ibm_ds_07_m03", "Exploratory Data Analysis", 3, "Descriptive statistics, grouping, correlation, and exploratory patterns"],
    ["ibm_ds_07_m04", "Model Development", 4, "Regression, pipelines, model fitting, and prediction"],
    ["ibm_ds_07_m05", "Model Evaluation and Refinement", 3, "Model evaluation, overfitting, underfitting, and hyperparameter tuning"],
    ["ibm_ds_07_m06", "Final Assignment", 1, "Apply data analysis workflow in a final project"],
  ],
  ibm_ds_08: [
    ["ibm_ds_08_m01", "Introduction to Data Visualization Tools", 3, "Matplotlib basics, line plots, and visualization foundations"],
    ["ibm_ds_08_m02", "Basic and Specialized Visualization Tools", 4, "Area, histogram, bar, pie, box, scatter, and bubble plots"],
    ["ibm_ds_08_m03", "Advanced Visualizations and Geospatial Data", 5, "Waffle charts, word clouds, regression plots, maps, and choropleths"],
    ["ibm_ds_08_m04", "Creating Dashboards with Plotly and Dash", 4, "Interactive dashboards with Plotly, Dash, callbacks, and layouts"],
    ["ibm_ds_08_m05", "Final Project and Exam", 3, "Create visualizations and dashboard deliverables"],
  ],
  ibm_ds_09: [
    ["ibm_ds_09_m01", "Introduction to Machine Learning", 3, "Machine learning concepts, workflow, scikit-learn, and model types"],
    ["ibm_ds_09_m02", "Regression", 4, "Linear regression, multiple regression, and model evaluation"],
    ["ibm_ds_09_m03", "Classification", 4, "KNN, decision trees, logistic regression, and classification metrics"],
    ["ibm_ds_09_m04", "Linear Classification", 3, "Support vector machines and linear classification techniques"],
    ["ibm_ds_09_m05", "Clustering", 3, "K-means, hierarchical clustering, DBSCAN, and unsupervised learning"],
    ["ibm_ds_09_m06", "Final Project", 3, "Build and evaluate machine learning models in Python"],
  ],
  ibm_ds_10: [
    ["ibm_ds_10_m01", "Data Collection", 4, "Collect Falcon 9 data with APIs and web scraping; prepare GitHub workflow"],
    ["ibm_ds_10_m02", "Exploratory Data Analysis (EDA)", 2, "Analyze launch records with SQL and visualization"],
    ["ibm_ds_10_m03", "Interactive Visual Analytics and Dashboard", 3, "Build Plotly Dash dashboard and Folium launch-site map"],
    ["ibm_ds_10_m04", "Predictive Analysis (Classification)", 1, "Train and compare SVM, classification tree, logistic regression, and KNN models"],
    ["ibm_ds_10_m05", "Present Your Data-Driven Insights", 4, "Compile findings into a stakeholder report and final submission"],
  ],
  ibm_ds_11: [
    ["ibm_ds_11_m01", "Generative AI and Data Science Careers", 4, "Understand generative AI opportunities and risks for data science work"],
    ["ibm_ds_11_m02", "Prompt Engineering for Data Science", 3, "Use prompting patterns to explore, explain, and transform data tasks"],
    ["ibm_ds_11_m03", "Hands-on GenAI Labs for Data Science", 4, "Apply GenAI to analysis, code assistance, documentation, and workflow support"],
    ["ibm_ds_11_m04", "Career Applications and Final Project", 3, "Turn GenAI-assisted work into career-ready data science artifacts"],
  ],
  ibm_ds_12: [
    ["ibm_ds_12_m01", "Building Your Data Science Career Foundation", 4, "Career paths, portfolio positioning, resumes, and professional profiles"],
    ["ibm_ds_12_m02", "Applying and Interviewing for Data Science Roles", 3, "Job search strategy, interview formats, and technical interview preparation"],
    ["ibm_ds_12_m03", "Final Career Plan and Interview Preparation", 2, "Create a career plan and prepare interview-ready project narratives"],
  ],
  google_ada_01: [
    ["google_ada_01_m01", "Introduction to data science concepts", 3, "8 videos · 8 readings · 3 assignments · 1 plugin"],
    ["google_ada_01_m02", "The impact of data today", 3, "8 videos · 9 readings · 5 assignments · 2 plugins"],
    ["google_ada_01_m03", "Your career as a data professional", 2, "4 videos · 4 readings · 3 assignments"],
    ["google_ada_01_m04", "Data applications and workflow", 4, "7 videos · 9 readings · 6 assignments · 2 plugins"],
    ["google_ada_01_m05", "Course 1 end-of-course project", 8, "5 videos · 12 readings · 4 assignments · 6 labs"],
  ],
  google_ada_02: [
    ["google_ada_02_m01", "Find and share stories using data", 3, "8 videos · 5 readings · 3 assignments · 2 plugins"],
    ["google_ada_02_m02", "Explore raw data", 7, "9 videos · 6 readings · 4 assignments · 7 labs · 2 plugins"],
    ["google_ada_02_m03", "Clean your data", 7, "11 videos · 6 readings · 5 assignments · 5 labs · 2 plugins"],
    ["google_ada_02_m04", "Data visualizations and presentations", 4, "8 videos · 11 readings · 5 assignments · 2 plugins"],
    ["google_ada_02_m05", "Course 2 end-of-course project", 7, "4 videos · 10 readings · 4 assignments · 6 labs"],
  ],
  google_ada_03: [
    ["google_ada_03_m01", "Introduction to statistics with Python", 5, "12 videos · 6 readings · 4 assignments · 3 labs · 2 plugins"],
    ["google_ada_03_m02", "Probability", 6, "10 videos · 6 readings · 4 assignments · 3 labs · 2 plugins"],
    ["google_ada_03_m03", "Sampling", 5, "8 videos · 6 readings · 4 assignments · 3 labs · 2 plugins"],
    ["google_ada_03_m04", "Confidence intervals", 4, "8 videos · 5 readings · 4 assignments · 3 labs"],
    ["google_ada_03_m05", "Introduction to hypothesis testing", 5, "8 videos · 5 readings · 4 assignments · 3 labs"],
    ["google_ada_03_m06", "Course 3 end-of-course project", 7, "5 videos · 11 readings · 4 assignments · 6 labs"],
  ],
  google_ada_04: [
    ["google_ada_04_m01", "Introduction to complex data relationships", 2, "8 videos · 3 readings · 4 assignments · 2 plugins"],
    ["google_ada_04_m02", "Simple linear regression", 6, "11 videos · 5 readings · 5 assignments · 5 labs · 2 plugins"],
    ["google_ada_04_m03", "Multiple linear regression", 4, "9 videos · 4 readings · 5 assignments · 4 labs"],
    ["google_ada_04_m04", "Advanced hypothesis testing", 4, "8 videos · 5 readings · 5 assignments · 3 labs"],
    ["google_ada_04_m05", "Logistic regression", 4, "8 videos · 4 readings · 5 assignments · 3 labs"],
    ["google_ada_04_m06", "Course 4 end-of-course project", 7, "5 videos · 10 readings · 4 assignments · 6 labs"],
  ],
  google_ada_05: [
    ["google_ada_05_m01", "The different types of machine learning", 5, "10 videos · 5 readings · 4 assignments · 4 labs · 2 plugins"],
    ["google_ada_05_m02", "Workflow for building complex models", 6, "12 videos · 6 readings · 3 assignments · 6 labs"],
    ["google_ada_05_m03", "Unsupervised learning techniques", 4, "8 videos · 4 readings · 3 assignments · 4 labs"],
    ["google_ada_05_m04", "Tree-based modeling", 10, "17 videos · 11 readings · 5 assignments · 10 labs · 2 plugins"],
    ["google_ada_05_m05", "Course 5 end-of-course project", 10, "5 videos · 10 readings · 4 assignments · 6 labs"],
  ],
  google_ada_06: [
    ["google_ada_06_m01", "Capstone Project", 4, "7 videos · 6 readings · 3 assignments · 2 labs"],
    ["google_ada_06_m02", "AI in Advanced Data Analytics", 2, "7 videos · 4 readings · 1 assignment"],
    ["google_ada_06_m03", "Put your Advanced Data Analytics Certificate to work", 0.5, "2 videos · 4 readings · 1 plugin"],
  ],
  google_ada_07: [
    ["google_ada_07_m01", "Uncover Your Transferable Skills with AI", 1, "6 videos · 2 readings · 4 assignments"],
    ["google_ada_07_m02", "Plan Your Job Search with AI", 2, "6 videos · 2 readings · 5 assignments"],
    ["google_ada_07_m03", "Manage Your Job Applications with AI", 1, "4 videos · 1 reading · 3 assignments"],
    ["google_ada_07_m04", "Prepare and Practice for Interviews with AI", 2, "8 videos · 5 readings · 6 assignments"],
  ],
};

const DEFAULT_LEARNING_TRACKS = [
  {
    id: "lrn_ibm_data_science",
    code: "LRN-001",
    title: "IBM Data Science Professional Certificate",
    platform: "Coursera · IBM",
    targetDate: "2026-09-30",
    status: "active",
    note: "12개 course series를 9월까지 완료하고 데이터 사이언스 기본기를 프로젝트화",
    courses: [
      ["ibm_ds_01", "What is Data Science?", 12],
      ["ibm_ds_02", "Tools for Data Science", 16],
      ["ibm_ds_03", "Data Science Methodology", 9],
      ["ibm_ds_04", "Python for Data Science, AI & Development", 24],
      ["ibm_ds_05", "Python Project for Data Science", 7],
      ["ibm_ds_06", "Databases and SQL for Data Science with Python", 18],
      ["ibm_ds_07", "Data Analysis with Python", 17],
      ["ibm_ds_08", "Data Visualization with Python", 19],
      ["ibm_ds_09", "Machine Learning with Python", 20],
      ["ibm_ds_10", "Applied Data Science Capstone", 14],
      ["ibm_ds_11", "Generative AI: Elevate Your Data Science Career", 14],
      ["ibm_ds_12", "Data Scientist Career Guide and Interview Preparation", 9],
    ].map(([id, title, estimatedHours]) => createLearningCourse(id, title, estimatedHours)),
  },
  {
    id: "lrn_google_advanced_data_analytics",
    code: "LRN-002",
    title: "Google Advanced Data Analytics Professional Certificate",
    platform: "Coursera · Google",
    targetDate: "2026-09-30",
    status: "active",
    note: "7개 course series를 완료하고 고급 분석/모델링 학습 흐름 만들기",
    courses: [
      ["google_ada_01", "Foundations of Data Science", 20],
      ["google_ada_02", "Go Beyond the Numbers: Translate Data into Insights", 28],
      ["google_ada_03", "The Power of Statistics", 32],
      ["google_ada_04", "Regression Analysis: Simplify Complex Data Relationships", 27],
      ["google_ada_05", "The Nuts and Bolts of Machine Learning", 35],
      ["google_ada_06", "Google Advanced Data Analytics Capstone", 6.5],
      ["google_ada_07", "Accelerate Your Job Search with AI", 6],
    ].map(([id, title, estimatedHours]) => createLearningCourse(id, title, estimatedHours)),
  },
];

let repository = createLocalRepository();
const state = loadState();
let pendingDeleteItemId = "";
let lastDeletedItem = null;
let undoTimer = null;
const UNDO_WINDOW_MS = 7000;
let syncStatus = "idle"; // idle | syncing | error
let syncError = "";
let syncModalOpen = false;
let autoSyncTimer = null;
let autoSyncInterval = null;
let suppressAutoSync = false;
const AUTO_SYNC_DEBOUNCE_MS = 8000; // after a local change settles
const AUTO_SYNC_INTERVAL_MS = 180000; // periodic pull (3 min)
let expandedIdeaIds = new Set();
let selectedTodayIds = new Set();
const quadClickTimers = new Map();
let ideaSubDrag = null;
let projectTaskDrag = null;
let pendingQuickMove = null;
let draggedTodayItemId = "";
let todayPointerDrag = null;
let todayNativeDragState = null;
let blockInlineActiveBlock = null;
let wrapupInsightCache = { date: null, status: "idle", text: null };

function defaultDailyCapture() {
  return {
    context: "personal",
    timeBlock: currentTimeBlockKey(),
    dailyPriority: "secondary",
  };
}

function createLearningCourse(id, title, estimatedHours) {
  return {
    id,
    title,
    estimatedHours,
    status: "planned",
    sessions: 0,
    studiedMinutes: 0,
    lastStudiedAt: "",
    modules: cloneLearningCourseModules(id),
  };
}

function cloneLearningCourseModules(courseId) {
  return (DEFAULT_COURSE_MODULES[courseId] || []).map(([id, title, estimatedHours, contentSummary]) => ({
    id,
    title,
    estimatedHours,
    contentSummary,
    status: "planned",
    sessions: 0,
    studiedMinutes: 0,
    lastStudiedAt: "",
  }));
}

function loadState() {
  const today = getTodayKey();
  const fallback = {
    items: [],
    selectedDate: today,
    selectedView: "daily",
    mobileTab: "today",
    selectedThreadId: null,
    selectedProjectId: null,
    threadOverrides: {},
    projectMeta: {},
    projects: [],
    monthlyReflections: {},
    dailyReviews: {},
    goals: [],
    threadSuggestions: {},
    reflectionCoaches: {},
    learningTracks: cloneDefaultLearningTracks(),
    learningSessions: [],
    learningWeeklyHours: 12,
    learningReviewDone: {},
    learningSeedSuggestions: null,
    selectedLearningCourseKey: "",
    selectedLearningTrackId: "",
    selectedSignalKeyword: "",
    dailyCapture: defaultDailyCapture(),
    ideaDraft: "",
    ideaCompose: { title: "", items: [], draft: "" },
    aiProviderKind: "rules",
    ollamaModel: "llama3.2",
    sync: { url: "", anonKey: "", syncKey: "", lastSyncAt: null, auto: true },
    itemTombstones: [],
    draft: "",
    toast: "",
    storageMode: "localStorage",
  };

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const items = Array.isArray(stored?.items)
      ? stored.items.map(normalizeItem)
      : [];
    return {
      ...fallback,
      ...stored,
      selectedDate: today,
      items,
      dailyReviews: normalizeDailyReviews(stored?.dailyReviews),
      learningTracks: normalizeLearningTracks(stored?.learningTracks),
      learningSessions: normalizeLearningSessions(stored?.learningSessions),
      sync: { ...fallback.sync, ...(stored?.sync || {}) },
      itemTombstones: Array.isArray(stored?.itemTombstones) ? stored.itemTombstones : [],
      toast: "",
      draft: "",
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  saveUiState();
  return repository.saveItems(state.items);
}

function saveUiState() {
  const {
    items,
    selectedDate,
    selectedView,
    mobileTab,
    selectedThreadId,
    selectedProjectId,
    threadOverrides,
    projectMeta,
    projects,
    monthlyReflections,
    dailyReviews,
    goals,
    threadSuggestions,
    reflectionCoaches,
    learningTracks,
    learningSessions,
    learningWeeklyHours,
    learningReviewDone,
    learningSeedSuggestions,
    selectedLearningCourseKey,
    selectedSignalKeyword,
    dailyCapture,
    ideaDraft,
    ideaCompose,
    aiProviderKind,
    ollamaModel,
    sync,
    itemTombstones,
  } = state;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      items,
      selectedDate,
      selectedView,
      mobileTab,
      selectedThreadId,
      selectedProjectId,
      threadOverrides,
      projectMeta,
      projects,
      monthlyReflections,
      dailyReviews,
      goals,
      threadSuggestions,
      reflectionCoaches,
      learningTracks,
      learningSessions,
      learningWeeklyHours,
      learningReviewDone,
      learningSeedSuggestions,
      selectedLearningCourseKey,
      selectedSignalKeyword,
      dailyCapture,
      ideaDraft,
      ideaCompose,
      aiProviderKind,
      ollamaModel,
      sync,
      itemTombstones,
    }),
  );
  // In SQLite mode, mirror the non-core (table-less) state to app_kv so it
  // survives a localStorage wipe. Debounced — saveUiState fires very often.
  if (repository && repository.kind === "sqlite") scheduleAuxPersist();
  // Debounced auto-sync after local changes (guarded so sync's own saves don't loop).
  scheduleAutoSync();
}

let _auxPersistTimer = null;
function scheduleAuxPersist() {
  if (typeof window === "undefined") return;
  window.clearTimeout(_auxPersistTimer);
  _auxPersistTimer = window.setTimeout(() => {
    const aux = {};
    for (const key of AUX_STATE_KEYS) aux[key] = state[key];
    Promise.resolve(repository.saveAux?.(aux)).catch((err) => console.warn("saveAux 실패", err));
  }, 800);
}

async function initializeStorage() {
  const localItems = [...state.items];
  repository = await createRepository();
  state.storageMode = repository.kind;
  state.selectedDate = normalizeSelectedDate(state.selectedDate);

  if (repository.kind === "sqlite") {
    const dbItems = await repository.loadItems();
    state.threadOverrides = await repository.loadThreadOverrides();
    state.projectMeta = await repository.loadProjectMeta();
    state.monthlyReflections = await repository.loadMonthlyReflections();
    state.dailyReviews = await repository.loadDailyReviews();
    const shouldMigrate = !localStorage.getItem(SQLITE_MIGRATION_KEY) && localItems.length > 0;

    if (shouldMigrate) {
      await repository.upsertItems(localItems);
      localStorage.setItem(SQLITE_MIGRATION_KEY, "true");
      state.items = await repository.loadItems();
      setToast("기존 기록을 SQLite로 옮겼어요.");
    } else {
      state.items = dbItems;
      if (!state.toast) setToast("SQLite 저장소에 연결됐어요.");
    }

    // Restore table-less aux state (learning/goals/coach) from app_kv. On the
    // first run after this version the KV row is empty, so the localStorage
    // values (already in state) stay and get written to KV by the saveUiState
    // at the end of init — migrating them into durable storage.
    const aux = await repository.loadAux();
    if (aux.learningTracks) state.learningTracks = normalizeLearningTracks(aux.learningTracks);
    if (aux.learningSessions) state.learningSessions = normalizeLearningSessions(aux.learningSessions);
    if (Number.isFinite(Number(aux.learningWeeklyHours))) state.learningWeeklyHours = Number(aux.learningWeeklyHours);
    if (aux.learningReviewDone && typeof aux.learningReviewDone === "object") state.learningReviewDone = aux.learningReviewDone;
    if (Array.isArray(aux.goals)) state.goals = aux.goals;
    if (aux.reflectionCoaches && typeof aux.reflectionCoaches === "object") state.reflectionCoaches = aux.reflectionCoaches;
  } else {
    state.items = await repository.loadItems();
    state.threadOverrides = await repository.loadThreadOverrides();
    state.projectMeta = await repository.loadProjectMeta();
    state.monthlyReflections = await repository.loadMonthlyReflections();
    state.dailyReviews = await repository.loadDailyReviews();
  }

  state.projects = await repository.loadProjects();
  await migrateLegacyIdeas();
  await migrateThreadProjects();
  await migrateLegacySourceTags();
  saveUiState();
  render();

  // Sync on launch (pull anything the other device pushed), then keep a periodic
  // pull running. Both silent so they don't interrupt.
  if (autoSyncEnabled()) {
    startAutoSyncTimer();
    window.setTimeout(() => syncNow({ silent: true }), 600);
  }
}

// One-time: heal items created before the sourceTag field existed — their
// provenance was baked into item.text as a literal prefix ("[학습] ...",
// "Signal idea: ..."). Move it into sourceTag and strip the prefix from the
// text so it's clean and safely user-editable everywhere it's displayed.
const LEGACY_SOURCE_TEXT_PATTERNS = [
  { re: /^\[학습\]\s*/, tag: "learning" },
  { re: /^\[신호\]\s*/, tag: "signal" },
  { re: /^프로젝트 연결:\s*/, tag: "project-bridge" },
  { re: /^Signal idea:\s*/, tag: "signal-idea" },
];

async function migrateLegacySourceTags() {
  if (localStorage.getItem(SOURCE_TAG_MIGRATION_KEY)) return;
  const now = new Date().toISOString();
  const touched = [];
  for (const item of state.items) {
    if (item.sourceTag) continue;
    const match = LEGACY_SOURCE_TEXT_PATTERNS.find(({ re }) => re.test(item.text));
    if (!match) continue;
    item.text = item.text.replace(match.re, "");
    item.sourceTag = match.tag;
    item.updatedAt = now;
    touched.push(item);
  }
  if (touched.length) await repository.upsertItems(touched);
  localStorage.setItem(SOURCE_TAG_MIGRATION_KEY, "true");
}

// One-time: turn the previously thread-derived projects (PRJ brief + the
// thread's task texts) into first-class project objects so nothing is lost.
async function migrateThreadProjects() {
  if (localStorage.getItem(PROJECTS_MIGRATION_KEY)) return;
  const threads = buildThreads(state.items);
  const created = [];
  let order = Date.now();
  for (const thread of threads) {
    const threadItems = thread.itemIds.map((id) => state.items.find((it) => it.id === id)).filter(Boolean);
    const meta = getProjectMeta(thread, threadItems);
    if (!isProjectThread(thread, meta)) continue;
    const now = new Date().toISOString();
    created.push(
      normalizeProject({
        id: uid("prj"),
        no: meta.projectNo || "",
        title: state.threadOverrides[thread.id]?.title || thread.title,
        goal: meta.goal || "",
        status: meta.status || "active",
        targetDate: meta.targetDate || "",
        startDate: "",
        milestones: meta.milestone
          ? [{ id: uid("ms"), title: String(meta.milestone).slice(0, 80), start: "", end: meta.targetDate || "", status: "active" }]
          : [],
        tasks: threadItems
          .filter((it) => it.status !== "done" || true)
          .map((it) => ({ id: uid("ptask"), text: it.text, done: it.status === "done", milestoneId: null, fromIdea: it.context === "idea" })),
        createdAt: now,
        updatedAt: now,
        sortOrder: order++,
      }),
    );
  }
  if (created.length) {
    state.projects = [...created, ...state.projects];
    await repository.upsertProjects(created);
  }
  localStorage.setItem(PROJECTS_MIGRATION_KEY, "true");
}

// Existing ideas stored their content as one multi-line string. Convert them
// to the new shape once: first line = topic title, remaining lines = sub-items.
// Idempotent — once an idea has sub-items, its text is a single title line.
async function migrateLegacyIdeas() {
  const toUpdate = [];
  for (const item of state.items) {
    if (item.type !== "idea") continue;
    if (Array.isArray(item.subItems) && item.subItems.length) continue;
    const cleaned = String(item.text || "").split("\n").map(normalizeLine);
    const title = (cleaned[0] || "").trim();
    const rest = cleaned.slice(1).filter(Boolean);
    if (!rest.length) continue;
    item.text = title;
    item.subItems = rest.map((text) => ({ id: uid("si"), text, done: false, promotedItemId: null }));
    item.updatedAt = new Date().toISOString();
    toUpdate.push(item);
  }
  if (toUpdate.length) {
    await repository.upsertItems(toUpdate);
  }
}

async function createRepository() {
  const Database = window.__TAURI__?.sql;
  if (!Database?.load) return createLocalRepository();

  try {
    const db = await Database.load(SQLITE_DB_PATH);
    return createSqliteRepository(db);
  } catch (error) {
    console.warn("Falling back to localStorage storage", error);
    return createLocalRepository();
  }
}

function createLocalRepository() {
  return {
    kind: "localStorage",
    async loadItems() {
      return (loadState().items || []).filter((item) => !item.deletedAt);
    },
    async saveItems() {
      saveUiState();
    },
    async upsertItems() {
      saveUiState();
    },
    async deleteItem() {
      saveUiState();
    },
    async loadThreadOverrides() {
      return loadState().threadOverrides || {};
    },
    async saveThreadOverride() {
      saveUiState();
    },
    async loadProjectMeta() {
      return loadState().projectMeta || {};
    },
    async saveProjectMeta() {
      saveUiState();
    },
    async loadMonthlyReflections() {
      return loadState().monthlyReflections || {};
    },
    async saveMonthlyReflection() {
      saveUiState();
    },
    async loadDailyReviews() {
      return loadState().dailyReviews || {};
    },
    async saveDailyReview() {
      saveUiState();
    },
    async loadProjects() {
      return (loadState().projects || []).map(normalizeProject);
    },
    async upsertProjects() {
      saveUiState();
    },
    async deleteProject() {
      saveUiState();
    },
    // Aux state already lives in the localStorage JSON via saveUiState.
    async loadAux() {
      return {};
    },
    async saveAux() {},
  };
}

async function dbTransaction(db, fn) {
  await db.execute("BEGIN");
  try {
    await fn();
    await db.execute("COMMIT");
  } catch (err) {
    await db.execute("ROLLBACK").catch(() => {});
    const msg = `[DB] transaction failed: ${err?.message ?? err}`;
    console.error(msg);
    setToast(`⚠️ DB 저장 오류: ${err?.message ?? err}`);
    throw err;
  }
}

const UPSERT_ITEM_SQL = `
  INSERT INTO items
    (id, text, date, status, type, horizon, lane, importance, momentum, context,
     time_block, daily_priority, keywords_json, created_at, updated_at, completed_at, manual_order, sub_items_json,
     pipeline, lane_moved_at, last_forward_at, defer_count, defer_reason, deleted_at, source_tag)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
  ON CONFLICT(id) DO UPDATE SET
    text = excluded.text,
    date = excluded.date,
    status = excluded.status,
    type = excluded.type,
    horizon = excluded.horizon,
    lane = excluded.lane,
    importance = excluded.importance,
    momentum = excluded.momentum,
    context = excluded.context,
    time_block = excluded.time_block,
    daily_priority = excluded.daily_priority,
    keywords_json = excluded.keywords_json,
    updated_at = excluded.updated_at,
    completed_at = excluded.completed_at,
    manual_order = excluded.manual_order,
    sub_items_json = excluded.sub_items_json,
    pipeline = excluded.pipeline,
    lane_moved_at = excluded.lane_moved_at,
    last_forward_at = excluded.last_forward_at,
    defer_count = excluded.defer_count,
    defer_reason = excluded.defer_reason,
    deleted_at = excluded.deleted_at,
    source_tag = excluded.source_tag`;

async function upsertItemRows(db, items) {
  for (const item of items) {
    await db.execute(UPSERT_ITEM_SQL, itemToRowValues(item));
  }
}

const UPSERT_PROJECT_SQL = `
  INSERT INTO projects
    (id, no, title, goal, status, target_date, start_date, source_idea_id,
     milestones_json, tasks_json, created_at, updated_at, sort_order)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  ON CONFLICT(id) DO UPDATE SET
    no = excluded.no,
    title = excluded.title,
    goal = excluded.goal,
    status = excluded.status,
    target_date = excluded.target_date,
    start_date = excluded.start_date,
    source_idea_id = excluded.source_idea_id,
    milestones_json = excluded.milestones_json,
    tasks_json = excluded.tasks_json,
    updated_at = excluded.updated_at,
    sort_order = excluded.sort_order`;

function projectToRowValues(project) {
  return [
    project.id,
    project.no || "",
    project.title || "",
    project.goal || "",
    project.status || "active",
    project.targetDate || "",
    project.startDate || "",
    project.sourceIdeaId || "",
    JSON.stringify(Array.isArray(project.milestones) ? project.milestones : []),
    JSON.stringify(Array.isArray(project.tasks) ? project.tasks : []),
    project.createdAt || new Date().toISOString(),
    project.updatedAt || new Date().toISOString(),
    Number.isFinite(Number(project.sortOrder)) ? Number(project.sortOrder) : Date.now(),
  ];
}

function rowToProject(row) {
  return normalizeProject({
    id: row.id,
    no: row.no,
    title: row.title,
    goal: row.goal,
    status: row.status,
    targetDate: row.target_date,
    startDate: row.start_date,
    sourceIdeaId: row.source_idea_id,
    milestones: safeParseArray(row.milestones_json),
    tasks: safeParseArray(row.tasks_json),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sortOrder: Number(row.sort_order),
  });
}

function normalizeProject(project) {
  const now = new Date().toISOString();
  return {
    id: project?.id || uid("prj"),
    no: String(project?.no ?? "").trim(),
    title: String(project?.title ?? "").trim(),
    goal: String(project?.goal ?? ""),
    status: PROJECT_STATUS_LABEL[project?.status] ? project.status : "active",
    targetDate: cleanDateValue(project?.targetDate),
    startDate: cleanDateValue(project?.startDate),
    sourceIdeaId: project?.sourceIdeaId || "",
    milestones: normalizeMilestones(project?.milestones),
    tasks: normalizeProjectTasks(project?.tasks),
    createdAt: project?.createdAt || now,
    updatedAt: project?.updatedAt || now,
    sortOrder: Number.isFinite(Number(project?.sortOrder)) ? Number(project.sortOrder) : Date.now(),
  };
}

function normalizeMilestones(value) {
  const list = Array.isArray(value) ? value : safeParseArray(value);
  return list
    .map((entry) => ({
      id: entry?.id || uid("ms"),
      title: String(entry?.title ?? "").trim(),
      start: cleanDateValue(entry?.start),
      end: cleanDateValue(entry?.end),
      status: ["planned", "active", "done"].includes(entry?.status) ? entry.status : "planned",
    }))
    .filter((entry) => entry.title || entry.start || entry.end);
}

function normalizeProjectTasks(value) {
  const list = Array.isArray(value) ? value : safeParseArray(value);
  return list
    .map((entry) => ({
      id: entry?.id || uid("ptask"),
      text: String(entry?.text ?? "").trim(),
      done: Boolean(entry?.done),
      milestoneId: entry?.milestoneId || null,
      fromIdea: Boolean(entry?.fromIdea),
    }))
    .filter((entry) => entry.text);
}

function cleanDateValue(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) ? value : "";
}

function createSqliteRepository(db) {
  return {
    kind: "sqlite",
    async loadItems() {
      // Tombstones (deleted_at set) stay in the DB for sync but never enter the
      // in-memory working set — so all display/compute code remains live-only.
      const rows = await db.select("SELECT * FROM items WHERE deleted_at IS NULL ORDER BY created_at DESC");
      return rows.map(rowToItem);
    },
    async saveItems(items) {
      // Wrap DELETE + re-insert in a transaction so a mid-flight error can
      // never leave the table partially empty.
      await dbTransaction(db, async () => {
        await db.execute("DELETE FROM items");
        await upsertItemRows(db, items);
      });
      saveUiState();
    },
    async upsertItems(items) {
      await dbTransaction(db, () => upsertItemRows(db, items));
      saveUiState();
    },
    async deleteItem(id) {
      await db.execute("DELETE FROM items WHERE id = $1", [id]);
      saveUiState();
    },
    async loadThreadOverrides() {
      const rows = await db.select("SELECT thread_id, title FROM thread_overrides");
      return Object.fromEntries(rows.map((row) => [row.thread_id, { title: row.title }]));
    },
    async saveThreadOverride(threadId, title) {
      const now = new Date().toISOString();
      await db.execute(
        `INSERT INTO thread_overrides (thread_id, title, created_at, updated_at)
         VALUES ($1, $2, $3, $3)
         ON CONFLICT(thread_id) DO UPDATE SET
           title = excluded.title,
           updated_at = excluded.updated_at`,
        [threadId, title, now],
      );
      saveUiState();
    },
    async loadProjectMeta() {
      const rows = await db.select("SELECT * FROM project_meta");
      return Object.fromEntries(rows.map((row) => [row.thread_id, rowToProjectMeta(row)]));
    },
    async saveProjectMeta(threadId, meta) {
      const now = new Date().toISOString();
      await db.execute(
        `INSERT INTO project_meta
          (thread_id, project_no, goal, target_date, milestone, success_criteria, status, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
         ON CONFLICT(thread_id) DO UPDATE SET
           project_no = excluded.project_no,
           goal = excluded.goal,
           target_date = excluded.target_date,
           milestone = excluded.milestone,
           success_criteria = excluded.success_criteria,
           status = excluded.status,
           notes = excluded.notes,
           updated_at = excluded.updated_at`,
        [
          threadId,
          meta.projectNo || "",
          meta.goal || "",
          meta.targetDate || "",
          meta.milestone || "",
          meta.successCriteria || "",
          meta.status || "active",
          meta.notes || "",
          now,
        ],
      );
      saveUiState();
    },
    async loadMonthlyReflections() {
      const rows = await db.select("SELECT * FROM monthly_reflections");
      return Object.fromEntries(rows.map((row) => [row.month_key, rowToMonthlyReflection(row)]));
    },
    async saveMonthlyReflection(monthKey, reflection) {
      const now = new Date().toISOString();
      await db.execute(
        `INSERT INTO monthly_reflections
          (month_key, grew, worked, friction, adjustment, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
         ON CONFLICT(month_key) DO UPDATE SET
           grew = excluded.grew,
           worked = excluded.worked,
           friction = excluded.friction,
           adjustment = excluded.adjustment,
           notes = excluded.notes,
           updated_at = excluded.updated_at`,
        [
          monthKey,
          reflection.grew || "",
          reflection.worked || "",
          reflection.friction || "",
          reflection.adjustment || "",
          reflection.notes || "",
          now,
        ],
      );
      saveUiState();
    },
    async loadDailyReviews() {
      const rows = await db.select("SELECT * FROM daily_reviews");
      return Object.fromEntries(rows.map((row) => [row.date_key, rowToDailyReview(row)]));
    },
    async saveDailyReview(dateKey, review) {
      const now = new Date().toISOString();
      await db.execute(
        `INSERT INTO daily_reviews
          (date_key, win, friction, learned, tomorrow, energy, mental_debugs_json, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
         ON CONFLICT(date_key) DO UPDATE SET
           win = excluded.win,
           friction = excluded.friction,
           learned = excluded.learned,
           tomorrow = excluded.tomorrow,
           energy = excluded.energy,
           mental_debugs_json = excluded.mental_debugs_json,
           updated_at = excluded.updated_at`,
        [
          dateKey,
          review.win || "",
          review.friction || "",
          review.learned || "",
          review.tomorrow || "",
          review.energy || "normal",
          JSON.stringify(normalizeMentalDebugs(review.mentalDebugs)),
          now,
        ],
      );
      saveUiState();
    },
    async loadProjects() {
      const rows = await db.select("SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC");
      return rows.map(rowToProject);
    },
    async upsertProjects(projects) {
      await dbTransaction(db, async () => {
        for (const project of projects) {
          await db.execute(UPSERT_PROJECT_SQL, projectToRowValues(project));
        }
      });
      saveUiState();
    },
    async deleteProject(id) {
      await db.execute("DELETE FROM projects WHERE id = $1", [id]);
      saveUiState();
    },
    async loadAux() {
      const rows = await db.select("SELECT value_json FROM app_kv WHERE key = $1", ["aux"]);
      if (!rows.length) return {};
      try {
        return JSON.parse(rows[0].value_json) || {};
      } catch {
        return {};
      }
    },
    async saveAux(aux) {
      const now = new Date().toISOString();
      await db.execute(
        `INSERT INTO app_kv (key, value_json, updated_at)
         VALUES ('aux', $1, $2)
         ON CONFLICT(key) DO UPDATE SET
           value_json = excluded.value_json,
           updated_at = excluded.updated_at`,
        [JSON.stringify(aux ?? {}), now],
      );
    },
  };
}

function cloneDefaultLearningTracks() {
  return DEFAULT_LEARNING_TRACKS.map((track) => ({
    ...track,
    courses: track.courses.map((course) => ({
      ...course,
      modules: cloneLearningModules(course.modules),
    })),
  }));
}

function normalizeLearningTracks(value) {
  const incoming = Array.isArray(value) ? value : [];
  const byId = new Map(incoming.map((track) => [track.id, track]));
  return cloneDefaultLearningTracks().map((fallbackTrack) => {
    const storedTrack = byId.get(fallbackTrack.id) || {};
    const storedCourses = new Map((storedTrack.courses || []).map((course) => [course.id, course]));
    return {
      ...fallbackTrack,
      ...storedTrack,
      courses: fallbackTrack.courses.map((fallbackCourse) => ({
        ...fallbackCourse,
        ...normalizeStoredLearningCourse(storedCourses.get(fallbackCourse.id), fallbackCourse),
      })),
    };
  });
}

function normalizeStoredLearningCourse(storedCourse, fallbackCourse) {
  if (!storedCourse) return {};
  const nextCourse = { ...storedCourse };
  if (isPlaceholderLearningTitle(nextCourse.title)) {
    nextCourse.title = fallbackCourse.title;
  }
  if (fallbackCourse.estimatedHours !== undefined) {
    nextCourse.estimatedHours = fallbackCourse.estimatedHours;
  }
  nextCourse.modules = mergeLearningModules(storedCourse.modules, fallbackCourse.modules);
  if (
    nextCourse.status !== "done" &&
    nextCourse.modules.length &&
    nextCourse.modules.every((module) => module.status === "done")
  ) {
    nextCourse.status = "done";
    nextCourse.completedAt = nextCourse.completedAt || new Date().toISOString();
  }
  return nextCourse;
}

function isPlaceholderLearningTitle(title) {
  return /^(IBM|Google) Course \d{2}$/i.test(String(title || ""));
}

function currentTimeBlockKey(date = new Date()) {
  const hour = date.getHours();
  // Early morning (00:00–08:59) belongs to the day's first block, not evening.
  if (hour < 12) return "morning";
  if (hour < 18) return "workday";
  return "evening";
}

function inferDailyContext(text) {
  const lower = String(text || "").toLowerCase();
  if (/(회사|업무|회의|client|report|팀|work|office|windows|timesheet|expense|training req|tracking sheet|release|inquir|qual|recipe|ppt|email)/i.test(lower)) return "company";
  if (/(학습|course|coursera|certificate|study|git|api review|python|sql|statistics|learning)/i.test(lower)) return "learning";
  if (/(아이디어|idea|seed|기획|생각)/i.test(lower)) return "idea";
  if (/(운동|병원|생활|정리|관리|집|청소|택배|반납|hoa|accountant|health|life)/i.test(lower)) return "life";
  return "personal";
}

function inferDailyPriority(text, item = {}) {
  const lower = String(text || "").toLowerCase();
  if (/(primary|최우선|반드시|꼭|핵심|critical|urgent)/i.test(lower) || item.importance === "critical") return "primary";
  if (/(나중|parking|언젠가|someday|기록만)/i.test(lower) || item.lane === "someday") return "parking";
  return "secondary";
}

function cloneLearningModules(modules) {
  return Array.isArray(modules) ? modules.map((module) => ({ ...module })) : [];
}

function mergeLearningModules(storedModules, fallbackModules) {
  const fallback = cloneLearningModules(fallbackModules);
  const storedById = new Map((Array.isArray(storedModules) ? storedModules : []).map((module) => [module.id, module]));
  const merged = fallback.map((fallbackModule) => {
    const storedModule = storedById.get(fallbackModule.id) || {};
    return {
      ...fallbackModule,
      status: storedModule.status || fallbackModule.status || "planned",
      sessions: Number(storedModule.sessions || fallbackModule.sessions || 0),
      studiedMinutes: Number(storedModule.studiedMinutes || fallbackModule.studiedMinutes || 0),
      lastStudiedAt: storedModule.lastStudiedAt || fallbackModule.lastStudiedAt || "",
      completedAt: storedModule.completedAt || fallbackModule.completedAt || "",
    };
  });
  const customModules = (Array.isArray(storedModules) ? storedModules : []).filter(
    (module) => module.id && !fallback.some((fallbackModule) => fallbackModule.id === module.id),
  );
  return [...merged, ...cloneLearningModules(customModules)];
}

function normalizeLearningSessions(value) {
  return Array.isArray(value)
    ? value
        .map((session) => ({
          id: session.id || uid("session"),
          date: session.date || getTodayKey(),
          trackId: session.trackId || "",
          courseId: session.courseId || "",
          moduleId: session.moduleId || "",
          minutes: Number(session.minutes || 0),
          learned: cleanField(session.learned),
          blockedConcepts: normalizeConceptList(session.blockedConcepts),
          reviewConcepts: normalizeConceptList(session.reviewConcepts),
          bridge: cleanField(session.bridge),
          createdAt: session.createdAt || new Date().toISOString(),
        }))
        .filter((session) => session.trackId && session.courseId)
    : [];
}

function normalizeConceptList(value) {
  if (Array.isArray(value)) return value.map(cleanField).filter(Boolean);
  return String(value || "")
    .split(/[,;\n]/)
    .map(cleanField)
    .filter(Boolean);
}

function normalizeDailyReviews(value) {
  return Object.fromEntries(
    Object.entries(value || {}).map(([dateKey, review]) => [dateKey, normalizeDailyReview(review)]),
  );
}

function normalizeDailyReview(review = {}) {
  return {
    win: cleanField(review.win),
    friction: cleanField(review.friction),
    learned: cleanField(review.learned),
    tomorrow: cleanField(review.tomorrow),
    energy: cleanField(review.energy) || "normal",
    mentalDebugs: normalizeMentalDebugs(review.mentalDebugs),
  };
}

function normalizeMentalDebugs(value) {
  return Array.isArray(value)
    ? value
        .map((entry) => ({
          id: entry.id || uid("debug"),
          event: cleanField(entry.event),
          source: cleanField(entry.source),
          person: cleanField(entry.person),
          emotion: cleanField(entry.emotion),
          emotionIntensity: clampEmotionIntensity(entry.emotionIntensity),
          assumption: cleanField(entry.assumption),
          fact: cleanField(entry.fact),
          alternative: cleanField(entry.alternative),
          timeTest: cleanField(entry.timeTest) || "unknown",
          actionNeed: cleanField(entry.actionNeed) || "none",
          nextResponse: cleanField(entry.nextResponse),
          coach: normalizeMentalDebugCoach(entry.coach),
          recheckAt: entry.recheckAt || addHoursIso(entry.createdAt || new Date().toISOString(), 24),
          recheckStatus: cleanField(entry.recheckStatus) || "pending",
          actionItemId: cleanField(entry.actionItemId),
          createdAt: entry.createdAt || new Date().toISOString(),
        }))
        .filter((entry) => entry.event || entry.assumption || entry.fact || entry.alternative || entry.nextResponse)
    : [];
}

function normalizeMentalDebugCoach(value) {
  if (!value) return null;
  return {
    provider: cleanReadableProviderField(value.provider) || AI_PROVIDER_LABEL.rules,
    generatedAt: value.generatedAt || new Date().toISOString(),
    summary: cleanReadableProviderField(value.summary).slice(0, 220),
    assumptions: normalizeCoachList(value.assumptions, 3),
    alternativeReads: normalizeCoachList(value.alternativeReads, 3),
    action: cleanReadableProviderField(value.action).slice(0, 260),
    replyDraft: cleanReadableProviderField(value.replyDraft).slice(0, 320),
    error: Boolean(value.error),
  };
}

function clampEmotionIntensity(value) {
  const number = Number(value || 3);
  if (!Number.isFinite(number)) return 3;
  return Math.max(1, Math.min(5, Math.round(number)));
}

function addHoursIso(isoValue, hours) {
  const date = new Date(isoValue || new Date().toISOString());
  if (Number.isNaN(date.getTime())) return new Date(Date.now() + hours * 3600000).toISOString();
  return new Date(date.getTime() + hours * 3600000).toISOString();
}

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rowToDailyReview(row) {
  return normalizeDailyReview({
    win: row.win || "",
    friction: row.friction || "",
    learned: row.learned || "",
    tomorrow: row.tomorrow || "",
    energy: row.energy || "normal",
    mentalDebugs: parseJsonArray(row.mental_debugs_json),
  });
}

function rowToMonthlyReflection(row) {
  return {
    grew: row.grew || "",
    worked: row.worked || "",
    friction: row.friction || "",
    adjustment: row.adjustment || "",
    notes: row.notes || "",
  };
}

function rowToProjectMeta(row) {
  return {
    projectNo: row.project_no || "",
    goal: row.goal || "",
    targetDate: row.target_date || "",
    milestone: row.milestone || "",
    successCriteria: row.success_criteria || "",
    status: row.status || "active",
    notes: row.notes || "",
  };
}

function itemToRowValues(item) {
  return [
    item.id,
    item.text,
    item.date,
    item.status,
    item.type,
    item.horizon,
    item.lane,
    item.importance,
    item.momentum,
    item.context,
    item.timeBlock,
    item.dailyPriority,
    JSON.stringify(item.keywords),
    item.createdAt,
    item.updatedAt,
    item.completedAt,
    item.manualOrder,
    JSON.stringify(Array.isArray(item.subItems) ? item.subItems : []),
    item.pipeline ? 1 : 0,
    item.laneMovedAt || null,
    item.lastForwardAt || null,
    Number.isFinite(Number(item.deferCount)) ? Number(item.deferCount) : 0,
    item.deferReason || null,
    item.deletedAt || null,
    item.sourceTag || null,
  ];
}

function rowToItem(row) {
  const item = {
    id: row.id,
    text: row.text,
    date: row.date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    type: row.type,
    horizon: row.horizon,
    lane: row.lane,
    importance: row.importance,
    momentum: row.momentum,
    context: row.context,
    timeBlock: row.time_block,
    dailyPriority: row.daily_priority,
    keywords: parseKeywords(row.keywords_json),
    subItems: normalizeSubItems(row.sub_items_json),
    manualOrder: Number(row.manual_order),
    pipeline: Boolean(row.pipeline),
    laneMovedAt: row.lane_moved_at || null,
    lastForwardAt: row.last_forward_at || null,
    deferCount: Number(row.defer_count) || 0,
    deferReason: row.defer_reason || null,
    deletedAt: row.deleted_at || null,
    sourceTag: row.source_tag || null,
  };
  return normalizeItem(item);
}

function normalizeItem(item) {
  const now = new Date().toISOString();
  const normalized = {
    id: item.id || uid("item"),
    text: item.text || "",
    date: item.date || now.slice(0, 10),
    status: item.status || "open",
    createdAt: item.createdAt || item.created_at || now,
    updatedAt: item.updatedAt || item.updated_at || now,
    completedAt: item.completedAt || item.completed_at || null,
    manualOrder: Number.isFinite(Number(item.manualOrder ?? item.manual_order))
      ? Number(item.manualOrder ?? item.manual_order)
      : Date.parse(item.createdAt || item.created_at || now),
    deferCount: Number.isFinite(Number(item.deferCount ?? item.defer_count))
      ? Number(item.deferCount ?? item.defer_count)
      : 0,
    deferReason: DEFER_REASON_LABEL[item.deferReason] ? item.deferReason : null,
    // In the cultivation pipeline (재배 board)? Daily tasks default to false;
    // an item only joins the pipeline when the user sends it there or promotes
    // an idea. Orthogonal to scheduling (date/timeBlock) — an item can be both.
    pipeline: Boolean(item.pipeline ?? item.pipeline_flag),
    // Cultivation motion tracking — laneMovedAt = when the lane last changed
    // (used for "지금 돌볼 것" staleness); lastForwardAt = when it last advanced
    // to a higher stage (used for "이번 주 전진" count). Default lane time to
    // creation so a never-moved item ages from when it was made.
    laneMovedAt: item.laneMovedAt || item.lane_moved_at || item.createdAt || item.created_at || now,
    lastForwardAt: item.lastForwardAt || item.last_forward_at || null,
    deletedAt: item.deletedAt || item.deleted_at || null,
    // Where a seed/bridge item came from (학습/신호/신호아이디어/프로젝트연결) — a
    // real field instead of a text prefix, so item.text stays pristine and
    // user-editable. null for native Today/아이디어 items.
    sourceTag: item.sourceTag || item.source_tag || null,
  };
  const analysis = analyzeItem(normalized.text, normalized);
  return {
    ...normalized,
    ...analysis,
    subItems: normalizeSubItems(item.subItems),
    type: TYPE_LABEL[item.type] ? item.type : analysis.type,
    horizon: HORIZON_LABEL[item.horizon] ? item.horizon : analysis.horizon,
    lane: LANE_LABEL[item.lane] ? item.lane : analysis.lane,
    importance: IMPORTANCE_LABEL[item.importance] ? item.importance : analysis.importance,
    momentum: MOMENTUM_LABEL[item.momentum] ? item.momentum : analysis.momentum,
    context: DAILY_CONTEXT_LABEL[item.context] ? item.context : inferDailyContext(normalized.text),
    timeBlock: TIME_BLOCK_LABEL[item.timeBlock] ? item.timeBlock : currentTimeBlockKey(),
    dailyPriority: DAILY_PRIORITY_LABEL[item.dailyPriority] ? item.dailyPriority : inferDailyPriority(normalized.text, item),
  };
}

function parseKeywords(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeSubItems(value) {
  const list = typeof value === "string" ? safeParseArray(value) : value;
  if (!Array.isArray(list)) return [];
  return list
    .map((entry) => ({
      id: entry?.id || uid("si"),
      text: String(entry?.text ?? "").trim(),
      done: Boolean(entry?.done),
      promotedItemId: entry?.promotedItemId || null,
    }))
    .filter((entry) => entry.text);
}

function safeParseArray(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function normalizeLine(line) {
  return line
    .replace(/^\s*[-*•]\s*/, "")
    .replace(/^\s*\[[ xX]\]\s+/, "")
    .replace(/^\s*\d+[.)]\s+/, "")
    .trim();
}

function parseDailyDraftEntries(draft) {
  const entries = [];
  let timeBlock = state.dailyCapture.timeBlock;

  for (const rawLine of String(draft || "").split("\n")) {
    const raw = rawLine.trim();
    if (!raw) continue;

    if (/^(am|a\.m\.|오전)$/i.test(raw)) {
      timeBlock = "morning";
      continue;
    }
    if (/^(pm|p\.m\.|오후)$/i.test(raw)) {
      timeBlock = "workday";
      continue;
    }
    if (/^(evening|night|저녁)$/i.test(raw)) {
      timeBlock = "evening";
      continue;
    }

    const parsed = parseCompanyStyleLine(raw, timeBlock);
    if (parsed) entries.push(parsed);
  }

  return entries;
}

function parseCompanyStyleLine(raw, timeBlock) {
  let line = raw.replace(/^\s*[-*•]\s*/, "").replace(/^\s*\[[ xX]\]\s+/, "").trim();
  if (!line) return null;

  let status = "open";
  let completedAt = null;
  let momentumOverride = "";
  let priorityOverride = "";

  const doneMatch = line.match(/^(done|완료)\s+(.+)$/i);
  if (doneMatch) {
    status = "done";
    completedAt = new Date().toISOString();
    momentumOverride = "done";
    line = doneMatch[2].trim();
  }

  const tentativeMatch = line.match(/^(tent|tentative|임시|보류)\s+(.+)$/i);
  if (tentativeMatch) {
    momentumOverride = "seed";
    priorityOverride = "parking";
    line = tentativeMatch[2].trim();
  }

  const priorityMatch = line.match(/^(\d+)[.)]\s*(.+)$/);
  const priorityIndex = priorityMatch ? Number(priorityMatch[1]) : null;
  if (priorityMatch) line = priorityMatch[2].trim();

  if (/^lunch break\b/i.test(line)) {
    line = line.replace(/^lunch break\s*[-:–—]?\s*/i, "").trim();
    timeBlock = "workday";
    if (!priorityOverride) priorityOverride = "secondary";
  }

  line = normalizeLine(line);
  if (!line) return null;

  return {
    text: line,
    status,
    completedAt,
    timeBlock,
    dailyPriority: priorityOverride || dailyPriorityFromCompanyIndex(priorityIndex),
    momentumOverride,
  };
}

function dailyPriorityFromCompanyIndex(index) {
  if (index === null || Number.isNaN(index)) return state.dailyCapture.dailyPriority;
  if (index <= 2) return "primary";
  return "secondary";
}

function todayItemSort(a, b) {
  const statusScore = itemDoneRank(a) - itemDoneRank(b);
  if (statusScore !== 0) return statusScore;
  const dailyPriorityScore = dailyPriorityRank(a.dailyPriority) - dailyPriorityRank(b.dailyPriority);
  if (dailyPriorityScore !== 0) return dailyPriorityScore;
  const laneScore = laneRank(a.lane) - laneRank(b.lane);
  if (laneScore !== 0) return laneScore;
  const importanceScore = importanceRank(b.importance) - importanceRank(a.importance);
  if (importanceScore !== 0) return importanceScore;
  const orderScore = manualOrderValue(a) - manualOrderValue(b);
  if (orderScore !== 0) return orderScore;
  return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
}

function itemDoneRank(item) {
  return item.status === "done" ? 1 : 0;
}

function dailyPriorityRank(priority) {
  return { primary: 0, secondary: 1, parking: 2 }[priority] ?? 1;
}

function manualOrderValue(item) {
  if (Number.isFinite(Number(item.manualOrder))) return Number(item.manualOrder);
  return Date.parse(item.createdAt || item.updatedAt || "") || 0;
}

function tokenize(text) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, " ")
        .split(/\s+/)
        .map(cleanToken)
        .filter((token) => token.length >= 2 && !STOP_WORDS.has(token)),
    ),
  ).slice(0, 10);
}

function cleanToken(token) {
  return token
    .replace(/^[\d-]+|[\d-]+$/g, "")
    .replace(/(으로|에서|에게|한테|부터|까지|처럼|보다|하고|이며|이고|라는|으로는)$/u, "")
    .replace(/(은|는|을|를|이|가|에|와|과|도|만)$/u, "");
}

function classifyType(text) {
  const lower = text.toLowerCase();
  if (/[?？]$/.test(text) || /(어떻게|왜|무엇|뭐가|가능할까|좋을까)/.test(text)) {
    return "question";
  }
  if (
    /(아이디어|컨셉|만들|구현|설계|앱|프로젝트|실험|확장|개선|제안|연구|학습|개발)/.test(
      text,
    ) ||
    /(build|design|prototype|research|learn|idea|project)/.test(lower)
  ) {
    return "idea";
  }
  if (
    /(보내|작성|예약|처리|전화|회의|미팅|제출|구매|읽기|체크|검토|업데이트|완료)/.test(
      text,
    ) ||
    /(send|call|check|review|submit|finish|fix|update|email)/.test(lower)
  ) {
    return "task";
  }
  return "note";
}

function classifyHorizon(text) {
  const lower = text.toLowerCase();
  if (
    /(장기|분기|올해|언젠가|로드맵|프로젝트화|습관|성장|월별|중장기|분기별)/.test(text) ||
    /(long|quarter|quarterly|roadmap|someday|monthly)/.test(lower)
  ) {
    return "long";
  }
  if (/(오늘|오전|오후|지금|내일|회의|마감)/.test(text)) {
    return "today";
  }
  return "short";
}

function classifyLane(text) {
  const lower = text.toLowerCase();
  if (/(언젠가|나중에|보관|아이디어만)/.test(text) || /(someday|later|backlog)/.test(lower)) {
    return "someday";
  }
  if (/(분기|분기별|3개월|올해|로드맵|장기|중장기)/.test(text) || /(quarter|quarterly|roadmap|long)/.test(lower)) {
    return "invest";
  }
  if (/(이번 달|월간|mvp|프로젝트|기능|구현|빌드|만들기|개발)/.test(text) || /(month|monthly|mvp|build|project)/.test(lower)) {
    return "build";
  }
  if (/(이번 주|주간|주말|다음 주|곧)/.test(text) || /(week|weekly|soon|next)/.test(lower)) {
    return "next";
  }
  if (/(오늘|오전|오후|지금|내일|마감|회의|바로|긴급)/.test(text) || /(today|tomorrow|urgent|now|deadline)/.test(lower)) {
    return "now";
  }
  return "next";
}

function classifyImportance(text) {
  const lower = text.toLowerCase();
  if (/(긴급|마감|반드시|꼭|critical|urgent|asap|deadline)/i.test(`${text} ${lower}`)) {
    return "critical";
  }
  if (/(중요|핵심|우선|high|important|priority)/i.test(`${text} ${lower}`)) {
    return "high";
  }
  if (/(낮음|가벼운|나중|low|minor)/i.test(`${text} ${lower}`)) {
    return "low";
  }
  return "normal";
}

function classifyMomentum(text, item = {}) {
  const lower = text.toLowerCase();
  if (item.status === "done") return "done";
  if (/(막힘|블로커|보류|blocked|blocker|stuck|waiting)/.test(`${text} ${lower}`)) {
    return "blocked";
  }

  const updatedAt = item.updatedAt || item.updated_at;
  if (updatedAt) {
    const ageDays = Math.round((Date.now() - new Date(updatedAt).getTime()) / 86400000);
    if (ageDays >= 14) return "stale";
  }

  if (
    classifyType(text) === "task" ||
    /(진행|시작|실험|구현|작성|active|start|ship|build|test)/.test(`${text} ${lower}`)
  ) {
    return "active";
  }
  return "seed";
}

function analyzeItem(text, item = {}) {
  return {
    type: classifyType(text),
    horizon: classifyHorizon(text),
    lane: classifyLane(text),
    importance: classifyImportance(text),
    momentum: classifyMomentum(text, item),
    keywords: tokenize(text),
  };
}

function similarity(a, b) {
  const left = new Set(a);
  const right = new Set(b);
  const shared = [...left].filter((word) => right.has(word)).length;
  const total = new Set([...a, ...b]).size || 1;
  return shared / total;
}

function buildThreads(items) {
  const threads = [];
  const sorted = [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  for (const item of sorted) {
    if (!item.keywords.length) continue;

    let best = null;
    let bestScore = 0;
    for (const thread of threads) {
      const score = similarity(item.keywords, thread.keywords);
      const shared = item.keywords.filter((word) => thread.keywords.includes(word)).length;
      if ((score > bestScore && score >= 0.22) || shared >= 2) {
        best = thread;
        bestScore = score;
      }
    }

    if (!best) {
      best = {
        id: `thread_${item.id}`,
        title: "",
        itemIds: [],
        keywordCounts: {},
        keywords: [],
        firstDate: item.date,
        lastDate: item.date,
        stage: "seed",
        completionRate: 0,
      };
      threads.push(best);
    }

    best.itemIds.push(item.id);
    best.firstDate = best.firstDate < item.date ? best.firstDate : item.date;
    best.lastDate = best.lastDate > item.date ? best.lastDate : item.date;
    for (const keyword of item.keywords) {
      best.keywordCounts[keyword] = (best.keywordCounts[keyword] || 0) + 1;
    }
    best.keywords = Object.entries(best.keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
      .slice(0, 8);
  }

  for (const thread of threads) {
    const threadItems = thread.itemIds.map((id) => items.find((item) => item.id === id));
    const done = threadItems.filter((item) => item.status === "done").length;
    const longSignals = threadItems.filter((item) => item.horizon === "long").length;
    const ageDays = Math.round((Date.now() - new Date(thread.lastDate).getTime()) / 86400000);
    thread.completionRate = threadItems.length ? Math.round((done / threadItems.length) * 100) : 0;
    thread.generatedTitle = titleFromKeywords(thread.keywords);
    thread.title = state.threadOverrides[thread.id]?.title || thread.generatedTitle;
    thread.isRenamed = Boolean(state.threadOverrides[thread.id]?.title);
    thread.stage =
      thread.completionRate === 100
        ? "completed"
        : ageDays > 21
          ? "quiet"
          : threadItems.length >= 6 || longSignals >= 2
            ? "project"
            : threadItems.length >= 3
              ? "active"
              : "seed";
  }

  return threads.sort((a, b) => b.lastDate.localeCompare(a.lastDate));
}

function isSignalWorthyItem(item) {
  if (!item) return false;
  if (item.context === "life") return false;
  if (item.dailyPriority === "parking" && item.horizon === "today" && item.type === "task") return false;
  if (item.keywords.some((keyword) => SIGNAL_EXCLUDED_KEYWORDS.has(keyword))) return false;

  // Evening Build 항목은 항상 signal — 개인 성장 시간
  if (item.timeBlock === "evening") return true;

  return (
    item.type === "idea" ||
    item.context === "learning" ||
    item.context === "idea" ||
    item.horizon === "long" ||
    item.lane === "build" ||
    item.lane === "invest" ||
    // 단순 중요도 high는 개인/성장 컨텍스트일 때만 signal
    ((item.importance === "high" || item.importance === "critical") &&
      item.context !== "company") ||
    item.momentum === "blocked"
  );
}

function getGrowthItems(items = state.items) {
  return items.filter(
    (i) =>
      i.timeBlock === "evening" ||
      i.type === "idea" ||
      i.context === "learning" ||
      i.lane === "build" ||
      i.lane === "invest"
  );
}

function buildGrowthLayer(items, dailyReviews) {
  const reviewsMap = Array.isArray(dailyReviews)
    ? Object.fromEntries(dailyReviews.map((r) => [r.date, r]))
    : (dailyReviews || {});
  const today = getTodayKey();

  // 최근 14일 Evening Build 키워드 집계
  const days14 = Array.from({ length: 14 }, (_, i) => addDays(today, -(13 - i)));
  const growthItems = items.filter(
    (i) => i.timeBlock === "evening" || i.type === "idea" || i.context === "learning"
  );

  // 주차별(이번 주 / 지난 주) 키워드 빈도
  const thisWeekStart = addDays(today, -6);
  const lastWeekStart = addDays(today, -13);
  const thisWeekItems = growthItems.filter((i) => i.date >= thisWeekStart && i.date <= today);
  const lastWeekItems = growthItems.filter((i) => i.date >= lastWeekStart && i.date < thisWeekStart);

  const countKw = (arr) => {
    const map = {};
    arr.forEach((item) => item.keywords.forEach((k) => { map[k] = (map[k] || 0) + 1; }));
    return map;
  };

  const thisWeekKw = countKw(thisWeekItems);
  const lastWeekKw = countKw(lastWeekItems);

  // 이번 주 상위 키워드 (새로 등장했거나 증가한 것 우선)
  const topGrowthKw = Object.entries(thisWeekKw)
    .map(([kw, cnt]) => ({ kw, cnt, isNew: !lastWeekKw[kw], delta: cnt - (lastWeekKw[kw] || 0) }))
    .sort((a, b) => b.delta - a.delta || b.cnt - a.cnt)
    .slice(0, 6);

  // 7일 Evening Build 활동 히트맵
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, -(6 - i)));
  const dailyGrowth = last7.map((d) => {
    const dayGrowth = growthItems.filter((i) => i.date === d);
    const done = dayGrowth.filter((i) => i.status === "done").length;
    return { date: d, total: dayGrowth.length, done, label: new Date(d + "T00:00:00").toLocaleDateString("ko-KR", { weekday: "narrow" }) };
  });

  // 지속 관심사 (3일 이상 등장 키워드)
  const kwByDay = {};
  growthItems.forEach((i) => {
    i.keywords.forEach((k) => {
      if (!kwByDay[k]) kwByDay[k] = new Set();
      kwByDay[k].add(i.date);
    });
  });
  const sustained = Object.entries(kwByDay)
    .filter(([, days]) => days.size >= 3)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 4)
    .map(([kw, days]) => ({ kw, days: days.size }));

  return { topGrowthKw, dailyGrowth, sustained, thisWeekCount: thisWeekItems.length, lastWeekCount: lastWeekItems.length };
}

// renderGrowthLayer was replaced by renderSignalThemeStrip + renderGrowthRhythm
// in the 2026-06-16 Signals redesign (keyword chips consolidated, heatmap slimmed).

function getSignalItems(items = state.items) {
  return items.filter(isSignalWorthyItem);
}

function getSignalThreads(items = state.items) {
  return buildThreads(getSignalItems(items));
}

function titleFromKeywords(keywords) {
  if (!keywords.length) return "Untitled Thread";
  return keywords
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" · ");
}

function stageLabel(stage) {
  return {
    seed: "씨앗",
    active: "진행",
    project: "프로젝트",
    quiet: "정체",
    completed: "완료",
  }[stage];
}

async function addItems() {
  const entries = parseDailyDraftEntries(state.draft);

  if (!entries.length) {
    setToast("입력된 항목이 없어요.");
    return;
  }

  const now = new Date().toISOString();
  const orderBase = Date.now();
  const nextItems = entries.map((entry, index) => {
    const analysis = analyzeItem(entry.text, { status: entry.status });
    return {
      id: uid("item"),
      text: entry.text,
      date: state.selectedDate,
      status: entry.status,
      createdAt: now,
      updatedAt: now,
      completedAt: entry.completedAt,
      manualOrder: orderBase + index,
      context: entry.context || state.dailyCapture.context,
      timeBlock: entry.timeBlock || state.dailyCapture.timeBlock,
      dailyPriority: entry.dailyPriority || state.dailyCapture.dailyPriority,
      ...analysis,
      type: analysis.type === "idea" ? "task" : analysis.type,
      momentum: entry.momentumOverride || analysis.momentum,
    };
  });

  state.items = [...nextItems, ...state.items];
  state.draft = "";
  await repository.upsertItems(nextItems);
  setToast(`${nextItems.length}개 항목을 저장했어요.`);
  saveUiState();
  render();
}

async function addInlineBlockItem(block, rawText) {
  // Support multiline paste: split by newline, strip leading "- " markers
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
  if (!lines.length) return;

  const now = new Date().toISOString();
  const orderBase = Date.now();
  const newItems = lines.map((text, i) => ({
    id: uid("item"),
    text,
    date: state.selectedDate,
    status: "open",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    manualOrder: orderBase + i,
    context: state.dailyCapture.context,
    timeBlock: block,
    dailyPriority: state.dailyCapture.dailyPriority,
    type: "task",
    horizon: classifyHorizon(text),
    lane: "next",
    importance: classifyImportance(text),
    momentum: classifyMomentum(text, {}),
    keywords: tokenize(text),
    subItems: [],
  }));

  state.items = [...newItems, ...state.items];
  await repository.upsertItems(newItems);
  if (lines.length > 1) setToast(`${lines.length}개 항목을 저장했어요.`);
  saveUiState();
  render();
  requestAnimationFrame(() => {
    document.querySelector(`[data-block-inline-input="${block}"]`)?.focus();
  });
}

async function toggleItem(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  const done = item.status !== "done";
  item.status = done ? "done" : "open";
  item.completedAt = done ? new Date().toISOString() : null;
  item.updatedAt = new Date().toISOString();
  const { lane: _l1, type: _t1, ...analysis1 } = analyzeItem(item.text, item);
  Object.assign(item, analysis1);
  await repository.upsertItems([item]);
  saveUiState();
  render();
}

async function cycleTodayItemStatus(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  if (item.status === "done") {
    item.status = "open";
    item.completedAt = null;
  } else if (item.status === "active") {
    item.status = "done";
    item.completedAt = new Date().toISOString();
  } else {
    item.status = "active";
    item.completedAt = null;
  }
  item.updatedAt = new Date().toISOString();
  const { lane: _l2, type: _t2, ...analysis2 } = analyzeItem(item.text, item);
  Object.assign(item, analysis2);
  await repository.upsertItems([item]);
  saveUiState();
  render();
}

// Today → 재배: toggle pipeline. Single click seeds; clicking again un-seeds.
async function sendItemToCultivation(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  const now = new Date().toISOString();
  if (item.pipeline) {
    item.pipeline = false;
    item.updatedAt = now;
    await repository.upsertItems([item]);
    saveUiState();
    setToast("씨앗 취소됐어요.");
    render();
    return;
  }
  item.pipeline = true;
  item.lane = "now";
  item.laneMovedAt = now;
  item.updatedAt = now;
  await repository.upsertItems([item]);
  saveUiState();
  setToast("🌱 씨앗으로 보냈어요 · 재배 탭에서 키우세요");
  render();
}

// 재배 → Today: pull a pipeline item down into today's execution at the
// current time block. Keeps it in the pipeline (still has its lane).
// 놓아주기 — take a seed out of the 재배 pipeline (it stays as an item: ideas
// remain in 아이디어, today tasks in Today). The gentle "not worth growing".
async function releaseSeed(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  item.pipeline = false;
  item.updatedAt = new Date().toISOString();
  await repository.upsertItems([item]);
  saveUiState();
  setToast("재배에서 뺐어요 · 항목은 그대로예요.");
  render();
}

async function pullItemToToday(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  item.date = getTodayKey();
  item.timeBlock = currentTimeBlockKey() || "workday";
  item.updatedAt = new Date().toISOString();
  await repository.upsertItems([item]);
  saveUiState();
  setToast(`오늘 할 일로 내렸어요 · ${TIME_BLOCK_LABEL[item.timeBlock].replace(/^[\d-]+\s*/, "")}`);
  render();
}

// Card quad-button single/double click handlers.
async function handleQuadSingle(id, quad) {
  const item = state.items.find((i) => i.id === id);
  if (!item) return;
  const now = new Date().toISOString();
  if (quad === "tl") {
    item.status = item.status === "active" ? "open" : "active";
    item.completedAt = null;
    item.updatedAt = now;
    const { lane: _l, type: _t, ...analysis } = analyzeItem(item.text, item);
    Object.assign(item, analysis);
    await repository.upsertItems([item]);
    saveUiState();
    render();
  } else if (quad === "tr") {
    await sendItemToCultivation(id);
  } else if (quad === "bl") {
    const idx = TIME_BLOCK_ORDER.indexOf(item.timeBlock);
    if (idx <= 0) { setToast("첫 번째 타임블록이에요."); return; }
    item.timeBlock = TIME_BLOCK_ORDER[idx - 1];
    item.updatedAt = now;
    await repository.upsertItems([item]);
    saveUiState();
    setToast(`${TIME_BLOCK_LABEL[item.timeBlock].replace(/^[\d-]+\s*/, "")}으로 이동했어요.`);
    render();
  } else if (quad === "br") {
    const idx = TIME_BLOCK_ORDER.indexOf(item.timeBlock);
    if (idx >= TIME_BLOCK_ORDER.length - 1) { setToast("마지막 타임블록이에요."); return; }
    item.timeBlock = TIME_BLOCK_ORDER[idx + 1];
    item.updatedAt = now;
    await repository.upsertItems([item]);
    saveUiState();
    setToast(`${TIME_BLOCK_LABEL[item.timeBlock].replace(/^[\d-]+\s*/, "")}으로 이동했어요.`);
    render();
  }
}

async function handleQuadDouble(id, quad) {
  const item = state.items.find((i) => i.id === id);
  if (!item) return;
  const now = new Date().toISOString();
  if (quad === "tl") {
    item.status = item.status === "done" ? "open" : "done";
    item.completedAt = item.status === "done" ? now : null;
    item.updatedAt = now;
    const { lane: _l, type: _t, ...analysis } = analyzeItem(item.text, item);
    Object.assign(item, analysis);
    await repository.upsertItems([item]);
    saveUiState();
    render();
  } else if (quad === "tr") {
    await deleteItem(id);
  } else if (quad === "bl") {
    item.date = addDays(item.date, -1);
    item.updatedAt = now;
    await repository.upsertItems([item]);
    saveUiState();
    setToast("어제로 이동했어요.");
    render();
  } else if (quad === "br") {
    item.date = addDays(item.date, 1);
    if (item.lane === "now") item.lane = "next";
    item.deferCount = (item.deferCount || 0) + 1;
    item.updatedAt = now;
    await repository.upsertItems([item]);
    saveUiState();
    setToast("내일로 넘겼어요.");
    render();
  }
}

// Soft delete: mark a tombstone (deleted_at) instead of hard-removing. The item
// leaves the in-memory working set immediately (display stays correct) but the
// row persists in SQLite for undo + future sync. An undo bar offers restore.
async function deleteItem(id) {
  pendingDeleteItemId = "";
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  const now = new Date().toISOString();
  item.deletedAt = now;
  item.updatedAt = now;
  await repository.upsertItems([item]); // persist tombstone (SQLite sets deleted_at)
  state.items = state.items.filter((entry) => entry.id !== id);
  // Cross-mode tombstone log for sync (SQLite keeps deleted_at on the row, but a
  // browser/localStorage device needs the delete recorded somewhere too).
  state.itemTombstones = [
    ...state.itemTombstones.filter((t) => t.id !== id),
    { id, deletedAt: now, updatedAt: now },
  ];
  lastDeletedItem = item;
  window.clearTimeout(undoTimer);
  undoTimer = window.setTimeout(() => {
    lastDeletedItem = null;
    render();
  }, UNDO_WINDOW_MS);
  saveUiState();
  render();
}

async function restoreDeletedItem() {
  if (!lastDeletedItem) return;
  const item = lastDeletedItem;
  lastDeletedItem = null;
  window.clearTimeout(undoTimer);
  item.deletedAt = null;
  item.updatedAt = new Date().toISOString();
  state.items = [item, ...state.items];
  state.itemTombstones = state.itemTombstones.filter((t) => t.id !== item.id);
  await repository.upsertItems([item]); // clears the tombstone
  saveUiState();
  setToast("되돌렸어요.");
  render();
}

// ─────────────────────────────────────────────────────────────────────────────
// Sync — Supabase + shared sync key + Last-Write-Wins (id + updatedAt). MVP:
// items only, manual trigger. Tombstones (deletedAt) propagate deletes. Works
// across both storage modes (browser localStorage ↔ Supabase ↔ desktop SQLite).
// ─────────────────────────────────────────────────────────────────────────────
function syncConfigured() {
  const s = state.sync || {};
  return Boolean(s.url && s.anonKey && s.syncKey);
}

function syncEndpoint(path) {
  // Accept either the base URL or the full ".../rest/v1/" the Supabase UI shows.
  const base = String(state.sync.url || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/, "");
  return `${base}/rest/v1/${path}`;
}

function syncHeaders(extra = {}) {
  const key = state.sync.anonKey;
  const headers = { apikey: key, ...extra };
  // Legacy anon keys are JWTs (eyJ…) and double as the bearer token. The new
  // sb_publishable_… keys are NOT JWTs — sending one as a Bearer token makes
  // PostgREST reject it, so only add Authorization for JWT-style keys. Without
  // it, PostgREST uses the anon role and our `to anon` RLS policy applies.
  if (/^eyJ/.test(key)) headers.Authorization = `Bearer ${key}`;
  return headers;
}

async function pullRemoteItems() {
  const url = syncEndpoint(
    `seedlog_items?sync_key=eq.${encodeURIComponent(state.sync.syncKey)}&select=id,payload,updated_at,deleted_at`,
  );
  const res = await fetch(url, { headers: syncHeaders({ Accept: "application/json" }) });
  if (!res.ok) throw new Error(`pull ${res.status} ${(await res.text()).slice(0, 120)}`);
  return await res.json();
}

async function pushLocalItems(rows) {
  if (!rows.length) return;
  const res = await fetch(syncEndpoint("seedlog_items"), {
    method: "POST",
    headers: syncHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`push ${res.status} ${(await res.text()).slice(0, 120)}`);
}

// Apply remote rows into local state by LWW (compare as timestamps, not strings,
// since Supabase returns +00:00 offset while local uses Z).
function mergeRemoteIntoLocal(remoteRows) {
  let pulled = 0;
  let removed = 0;
  const localItems = new Map(state.items.map((i) => [i.id, i]));
  const localTombs = new Map((state.itemTombstones || []).map((t) => [t.id, t]));
  for (const r of remoteRows) {
    const localT = new Date(localItems.get(r.id)?.updatedAt || localTombs.get(r.id)?.updatedAt || 0).getTime();
    const remoteT = new Date(r.updated_at || 0).getTime();
    if (remoteT <= localT) continue; // local is newer or equal — keep, will push
    if (r.deleted_at) {
      state.items = state.items.filter((i) => i.id !== r.id);
      state.itemTombstones = [
        ...(state.itemTombstones || []).filter((t) => t.id !== r.id),
        { id: r.id, deletedAt: r.deleted_at, updatedAt: r.updated_at },
      ];
      removed += 1;
    } else {
      const merged = normalizeItem({ ...(r.payload || {}), id: r.id, updatedAt: r.updated_at, deletedAt: null });
      state.items = [merged, ...state.items.filter((i) => i.id !== r.id)];
      state.itemTombstones = (state.itemTombstones || []).filter((t) => t.id !== r.id);
      pulled += 1;
    }
  }
  return { pulled, removed };
}

function localSyncRows() {
  const key = state.sync.syncKey;
  const live = state.items.map((item) => ({
    sync_key: key,
    id: item.id,
    payload: item,
    updated_at: item.updatedAt,
    deleted_at: null,
  }));
  const tombs = (state.itemTombstones || []).map((t) => ({
    sync_key: key,
    id: t.id,
    payload: { id: t.id },
    updated_at: t.updatedAt,
    deleted_at: t.deletedAt,
  }));
  return [...live, ...tombs];
}

async function syncNow(opts = {}) {
  const silent = Boolean(opts.silent);
  if (!syncConfigured()) {
    if (!silent) setToast("동기화 설정(URL · 키 · 싱크키)을 먼저 입력하세요.");
    return;
  }
  if (syncStatus === "syncing") return;
  syncStatus = "syncing";
  syncError = "";
  silent ? updateSyncIndicator() : render();
  suppressAutoSync = true;
  try {
    const remote = await pullRemoteItems();
    const { pulled, removed } = mergeRemoteIntoLocal(remote);
    await pushLocalItems(localSyncRows());
    state.sync.lastSyncAt = new Date().toISOString();
    syncStatus = "idle";
    saveUiState();
    if (!silent) {
      setToast(`동기화 완료 · 받음 ${pulled} · 삭제 ${removed}`);
      render();
    } else if (pulled + removed > 0 && !isEditing()) {
      render(); // refresh to show pulled changes — only when not mid-edit
    } else {
      updateSyncIndicator();
    }
  } catch (err) {
    syncStatus = "error";
    syncError = String(err?.message || err);
    if (!silent) {
      setToast(`동기화 실패: ${syncError}`);
      render();
    } else {
      updateSyncIndicator();
    }
  } finally {
    suppressAutoSync = false;
  }
}

// True when the user is typing — used to avoid auto-sync re-renders that would
// steal focus / caret mid-edit.
function isEditing() {
  const el = document.activeElement;
  return Boolean(el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

// Surgical status update — flips the ☁ button color/glyph without a full render
// (so auto-sync doesn't disturb the page).
function updateSyncIndicator() {
  document.querySelectorAll(".sync-btn, .m-topbar-sync").forEach((btn) => {
    btn.classList.remove("sync-idle", "sync-syncing", "sync-error");
    btn.classList.add(`sync-${syncStatus}`);
    btn.textContent = syncStatus === "syncing" ? "⟳" : "☁";
  });
}

function autoSyncEnabled() {
  return syncConfigured() && state.sync.auto !== false;
}

// Debounced auto-sync after local changes (called from saveUiState).
function scheduleAutoSync() {
  if (suppressAutoSync || !autoSyncEnabled() || typeof window === "undefined") return;
  window.clearTimeout(autoSyncTimer);
  autoSyncTimer = window.setTimeout(runAutoSync, AUTO_SYNC_DEBOUNCE_MS);
}

// Network pull/push never touch the DOM by themselves — only the post-sync
// render() would disturb typing, and syncNow() already gates that on
// isEditing(). So this never has to defer (deferring on a focused quick-add
// input that's deliberately kept open would mean sync never runs at all).
function runAutoSync() {
  if (!autoSyncEnabled() || syncStatus === "syncing") return;
  syncNow({ silent: true });
}

// Periodic pull so changes made on the other device show up without a local edit.
function startAutoSyncTimer() {
  if (autoSyncInterval || typeof window === "undefined") return;
  autoSyncInterval = window.setInterval(() => {
    if (autoSyncEnabled() && document.visibilityState !== "hidden") runAutoSync();
  }, AUTO_SYNC_INTERVAL_MS);
}

function saveSyncConfig(form) {
  const data = new FormData(form);
  state.sync = {
    ...state.sync,
    url: String(data.get("url") || "").trim(),
    anonKey: String(data.get("anonKey") || "").trim(),
    syncKey: String(data.get("syncKey") || "").trim(),
    auto: data.get("auto") != null,
  };
  saveUiState();
  setToast("동기화 설정을 저장했어요.");
  if (autoSyncEnabled()) startAutoSyncTimer();
  render();
}

async function updateItemText(id, text) {
  const item = state.items.find((entry) => entry.id === id);
  const nextText = normalizeLine(text);
  if (!item || !nextText || nextText === item.text) return;
  item.text = nextText;
  item.updatedAt = new Date().toISOString();
  const { lane: _l3, type: _t3, ...analysis3 } = analyzeItem(item.text, item);
  Object.assign(item, analysis3);
  await repository.upsertItems([item]);
  saveUiState();
  setToast("항목을 수정했어요.");
  render();
}

async function requestDeleteItem(id) {
  if (pendingDeleteItemId === id) {
    setToast("항목을 삭제했어요.");
    await deleteItem(id);
    return;
  }
  pendingDeleteItemId = id;
  setToast("삭제하려면 빨간 체크를 한 번 더 누르세요.");
  render();
}

async function updateItemField(id, field, value) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item || !["lane", "importance", "momentum", "context", "timeBlock", "dailyPriority"].includes(field)) return;
  const now = new Date().toISOString();
  // Cultivation motion: when the lane genuinely changes, stamp laneMovedAt; if
  // it moved to a higher stage (씨앗→구체화→개발…) also stamp lastForwardAt so
  // the flow panel can count honest forward progress this week.
  if (field === "lane" && value !== item.lane) {
    const advanced = laneRank(value) > laneRank(item.lane);
    item.laneMovedAt = now;
    if (advanced) item.lastForwardAt = now;
  }
  item[field] = value;
  item.updatedAt = now;
  await repository.upsertItems([item]);
  saveUiState();
  render();
}

async function cycleLearningCourse(trackId, courseId) {
  updateLearningCourse(trackId, courseId, (course) => {
    const nextStatus = course.status === "done" ? "planned" : "done";
    course.status = nextStatus;
    if (nextStatus === "done") course.completedAt = new Date().toISOString();
    if (nextStatus !== "done") course.completedAt = "";
    if (Array.isArray(course.modules) && course.modules.length) {
      course.modules = course.modules.map((module) => ({
        ...module,
        status: nextStatus,
        completedAt: nextStatus === "done" ? new Date().toISOString() : "",
      }));
    }
  });
  saveUiState();
  render();
}

async function cycleLearningModule(trackId, courseId, moduleId) {
  updateLearningCourse(trackId, courseId, (course) => {
    course.modules = course.modules.map((module) => {
      if (module.id !== moduleId) return module;
      const nextStatus = module.status === "done" ? "planned" : "done";
      return {
        ...module,
        status: nextStatus,
        completedAt: nextStatus === "done" ? new Date().toISOString() : "",
      };
    });
    syncLearningCourseStatusFromModules(course);
  });
  saveUiState();
  render();
}

function syncLearningCourseStatusFromModules(course) {
  const modules = course.modules || [];
  if (modules.length && modules.every((module) => module.status === "done")) {
    course.status = "done";
    course.completedAt = course.completedAt || new Date().toISOString();
  } else if (modules.some((module) => module.status === "active" || module.status === "done")) {
    course.status = "active";
    course.completedAt = "";
  } else {
    course.status = "planned";
    course.completedAt = "";
  }
}

async function saveLearningSession(form) {
  const formData = new FormData(form);
  const [trackId, courseId, moduleId = ""] = String(formData.get("courseKey") || "").split("::");
  const track = state.learningTracks.find((entry) => entry.id === trackId);
  const course = track?.courses.find((entry) => entry.id === courseId);
  if (!track || !course) {
    setToast("학습 course를 선택해 주세요.");
    return;
  }

  await recordLearningSession(track, course, {
    moduleId,
    minutes: Number(formData.get("minutes") || 90),
    learned: cleanField(formData.get("learned")),
    blockedConcepts: normalizeConceptList(formData.get("blockedConcepts")),
    reviewConcepts: normalizeConceptList(formData.get("reviewConcepts")),
  });
}

async function recordLearningSession(track, course, sessionInput) {
  const now = new Date().toISOString();
  const minutes = Math.max(15, Number(sessionInput.minutes || 90));
  const module = sessionInput.moduleId
    ? findLearningModule(state.learningTracks, track.id, course.id, sessionInput.moduleId)?.module
    : null;
  updateLearningCourse(track.id, course.id, (entry) => {
    entry.status = entry.status === "done" ? "done" : "active";
    entry.sessions = Number(entry.sessions || 0) + 1;
    entry.studiedMinutes = Number(entry.studiedMinutes || 0) + minutes;
    entry.lastStudiedAt = now;
    if (module) {
      entry.modules = entry.modules.map((moduleEntry) => {
        if (moduleEntry.id !== module.id) return moduleEntry;
        return {
          ...moduleEntry,
          status: moduleEntry.status === "done" ? "done" : "active",
          sessions: Number(moduleEntry.sessions || 0) + 1,
          studiedMinutes: Number(moduleEntry.studiedMinutes || 0) + minutes,
          lastStudiedAt: now,
        };
      });
    }
  });

  const session = {
    id: uid("session"),
    date: state.selectedDate,
    trackId: track.id,
    courseId: course.id,
    moduleId: module?.id || "",
    minutes,
    learned: sessionInput.learned || "",
    blockedConcepts: normalizeConceptList(sessionInput.blockedConcepts),
    reviewConcepts: normalizeConceptList(sessionInput.reviewConcepts),
    bridge: sessionInput.bridge || "",
    createdAt: now,
  };
  state.learningSessions = [session, ...state.learningSessions].slice(0, 240);

  const sessionDetails = [
    session.learned ? `배운 것: ${session.learned}` : "",
    session.blockedConcepts.length ? `막힌 개념: ${session.blockedConcepts.join(", ")}` : "",
    session.reviewConcepts.length ? `복습: ${session.reviewConcepts.join(", ")}` : "",
  ].filter(Boolean);
  const item = normalizeItem({
    id: uid("learn"),
    text: `학습: ${track.code} · ${course.title}${module ? ` · ${module.title}` : ""} ${minutes}분 진행${sessionDetails.length ? ` · ${sessionDetails.join(" · ")}` : ""}`,
    date: state.selectedDate,
    status: "done",
    createdAt: now,
    updatedAt: now,
    completedAt: now,
  });
  item.type = "task";
  item.horizon = "today";
  item.lane = "invest";
  item.importance = "high";
  item.momentum = "done";
  item.keywords = tokenize(`${track.title} ${course.title} ${module?.title || ""} learning certificate`);
  state.items = [item, ...state.items];
  await repository.upsertItems([item]);
  saveUiState();
  setToast("오늘 학습 세션을 기록했어요.");
  render();
}

function setLearningWeeklyHours(value) {
  const next = Math.max(1, Number(value) || 12);
  if (next === Number(state.learningWeeklyHours || 12)) return;
  state.learningWeeklyHours = next;
  saveUiState();
  render();
}

function prepareLearningNote(trackId, courseId, moduleId = "") {
  state.selectedLearningCourseKey = `${trackId}::${courseId}`;
  saveUiState();
  render();
  window.requestAnimationFrame(() => {
    const form = document.querySelector("[data-learning-session-form]");
    const select = form?.querySelector("select[name='courseKey']");
    const learned = form?.querySelector("textarea[name='learned']");
    if (select) select.value = `${trackId}::${courseId}${moduleId ? `::${moduleId}` : ""}`;
    form?.scrollIntoView({ behavior: "smooth", block: "center" });
    learned?.focus();
  });
}

function selectLearningCourse(trackId, courseId) {
  state.selectedLearningCourseKey = `${trackId}::${courseId}`;
  saveUiState();
  render();
  window.requestAnimationFrame(() => {
    document.querySelector(".learning-course-detail")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

async function completeLearningReview(reviewId, concept) {
  state.learningReviewDone = {
    ...state.learningReviewDone,
    [reviewId]: true,
  };
  const now = new Date().toISOString();
  const item = normalizeItem({
    id: uid("review"),
    text: `복습 완료: ${concept}`,
    date: state.selectedDate,
    status: "done",
    createdAt: now,
    updatedAt: now,
    completedAt: now,
  });
  item.type = "task";
  item.horizon = "today";
  item.lane = "invest";
  item.importance = "normal";
  item.momentum = "done";
  item.keywords = tokenize(`${concept} review learning`);
  state.items = [item, ...state.items];
  await repository.upsertItems([item]);
  saveUiState();
  setToast("복습 완료를 기록했어요.");
  render();
}

async function createLearningBridgeItem(index) {
  const tracks = normalizeLearningTracks(state.learningTracks);
  const sessions = normalizeLearningSessions(state.learningSessions);
  const bridge = buildPortfolioBridge(tracks, sessions, buildThreads(state.items))[Number(index)];
  await createBridgeItem(bridge);
}

async function createLearningModuleBridgeItem(trackId, courseId, moduleId = "") {
  const tracks = normalizeLearningTracks(state.learningTracks);
  const sessions = normalizeLearningSessions(state.learningSessions);
  const source = moduleId
    ? findLearningModule(tracks, trackId, courseId, moduleId)
    : findLearningCourse(tracks, trackId, courseId);
  if (!source) return;
  const [bridge] = buildLearningProjectBridgeFromSources(
    [{ ...source, module: source.module || null, reason: "selected" }],
    sessions,
    buildThreads(state.items),
  );
  await createBridgeItem(bridge);
}

// 체화 → 재배: a finished course becomes a fresh seed (적용·확장 거리) in the
// cultivation board, closing the learning → growth loop.
async function learningCourseToCultivation(trackId, courseId) {
  const tracks = normalizeLearningTracks(state.learningTracks);
  const found = findLearningCourse(tracks, trackId, courseId);
  const course = found?.course;
  if (!course) return;
  await captureSeed(`${course.title} — 적용·확장하기`, { sourceTag: "learning" });
}

async function createBridgeItem(bridge) {
  if (!bridge) return;
  const now = new Date().toISOString();
  const item = normalizeItem({
    id: uid("bridge"),
    text: `${bridge.projectTitle ? `${bridge.projectTitle} · ` : ""}${bridge.title} · ${bridge.text}`,
    date: state.selectedDate,
    status: "open",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    sourceTag: "project-bridge",
  });
  item.type = bridge.itemType || "task";
  item.horizon = bridge.horizon || "short";
  item.lane = bridge.lane || "build";
  item.importance = "high";
  item.momentum = "active";
  item.keywords = tokenize(`${bridge.projectNo || ""} ${bridge.projectTitle || ""} ${bridge.title} ${bridge.text} ${bridge.sourceTitle || ""} portfolio project learning`);
  state.items = [item, ...state.items];
  await repository.upsertItems([item]);
  saveUiState();
  setToast("학습을 프로젝트 아이템으로 연결했어요.");
  render();
}

function updateLearningCourse(trackId, courseId, updater) {
  state.learningTracks = state.learningTracks.map((track) => {
    if (track.id !== trackId) return track;
    return {
      ...track,
      courses: track.courses.map((course) => {
        if (course.id !== courseId) return course;
        const nextCourse = { ...course };
        updater(nextCourse);
        return nextCourse;
      }),
    };
  });
}

async function saveThreadTitle(threadId, title) {
  const cleanedTitle = title.trim();
  if (!cleanedTitle) {
    setToast("thread 이름을 입력해 주세요.");
    return;
  }

  state.threadOverrides = {
    ...state.threadOverrides,
    [threadId]: { title: cleanedTitle },
  };
  await repository.saveThreadOverride(threadId, cleanedTitle);
  saveUiState();
  setToast("thread 이름을 저장했어요.");
  render();
}

async function saveProjectMeta(threadId, form) {
  const formData = new FormData(form);
  const meta = {
    projectNo: cleanField(formData.get("projectNo")),
    goal: cleanField(formData.get("goal")),
    targetDate: cleanField(formData.get("targetDate")),
    milestone: cleanField(formData.get("milestone")),
    successCriteria: cleanField(formData.get("successCriteria")),
    status: cleanField(formData.get("status")) || "active",
    notes: cleanField(formData.get("notes")),
  };

  state.projectMeta = {
    ...state.projectMeta,
    [threadId]: meta,
  };
  await repository.saveProjectMeta(threadId, meta);
  saveUiState();
  setToast("project brief를 저장했어요.");
  render();
}

async function saveMonthlyReflection(monthKey, form) {
  const reflection = monthlyReflectionFromForm(form);

  state.monthlyReflections = {
    ...state.monthlyReflections,
    [monthKey]: reflection,
  };
  await repository.saveMonthlyReflection(monthKey, reflection);
  saveUiState();
  setToast("general reflection을 저장했어요.");
  render();
}

function autosaveMonthlyReflection(monthKey, form) {
  const reflection = monthlyReflectionFromForm(form);
  state.monthlyReflections = {
    ...state.monthlyReflections,
    [monthKey]: reflection,
  };
  saveUiState();
  scheduleReflectionPersist("monthly", monthKey, reflection);
}

function monthlyReflectionFromForm(form) {
  const formData = new FormData(form);
  return {
    grew: cleanField(formData.get("grew")),
    worked: cleanField(formData.get("worked")),
    friction: cleanField(formData.get("friction")),
    adjustment: cleanField(formData.get("adjustment")),
    notes: cleanField(formData.get("notes")),
  };
}

async function saveDailyReview(dateKey, form) {
  const previous = getDailyReview(dateKey);
  const review = normalizeDailyReview({
    ...previous,
    ...dailyReviewFromForm(form),
    mentalDebugs: previous.mentalDebugs,
  });

  state.dailyReviews = {
    ...state.dailyReviews,
    [dateKey]: review,
  };
  await repository.saveDailyReview(dateKey, review);
  saveUiState();
  setToast("daily wrap-up을 저장했어요.");
  render();
}

function autosaveDailyReview(dateKey, form) {
  const previous = getDailyReview(dateKey);
  const review = normalizeDailyReview({
    ...previous,
    ...dailyReviewFromForm(form),
    mentalDebugs: previous.mentalDebugs,
  });
  state.dailyReviews = {
    ...state.dailyReviews,
    [dateKey]: review,
  };
  saveUiState();
  scheduleReflectionPersist("daily", dateKey, review);
}

function dailyReviewFromForm(form) {
  const formData = new FormData(form);
  return {
    win: cleanField(formData.get("win")),
    friction: cleanField(formData.get("friction")),
    learned: cleanField(formData.get("learned")),
    tomorrow: cleanField(formData.get("tomorrow")),
    energy: cleanField(formData.get("energy")) || "normal",
  };
}

async function saveMentalDebug(dateKey, form) {
  const formData = new FormData(form);
  const entry = normalizeMentalDebugs([
    {
      id: uid("debug"),
      event: formData.get("event"),
      source: formData.get("source"),
      person: formData.get("person"),
      emotion: formData.get("emotion"),
      emotionIntensity: formData.get("emotionIntensity"),
      assumption: formData.get("assumption"),
      fact: formData.get("fact"),
      alternative: formData.get("alternative"),
      timeTest: formData.get("timeTest"),
      actionNeed: formData.get("actionNeed"),
      nextResponse: formData.get("nextResponse"),
      createdAt: new Date().toISOString(),
      recheckAt: addHoursIso(new Date().toISOString(), 24),
      recheckStatus: "pending",
    },
  ])[0];
  if (!entry) {
    setToast("먼저 이벤트나 생각을 적어주세요.");
    return;
  }
  const review = getDailyReview(dateKey);
  const nextReview = normalizeDailyReview({
    ...review,
    mentalDebugs: [entry, ...review.mentalDebugs].slice(0, 12),
  });
  state.dailyReviews = {
    ...state.dailyReviews,
    [dateKey]: nextReview,
  };
  await repository.saveDailyReview(dateKey, nextReview);
  saveUiState();
  setToast("Mental Debugger 기록을 저장했어요.");
  render();
}

async function deleteMentalDebug(dateKey, debugId) {
  const review = getDailyReview(dateKey);
  const nextReview = normalizeDailyReview({
    ...review,
    mentalDebugs: review.mentalDebugs.filter((entry) => entry.id !== debugId),
  });
  state.dailyReviews = {
    ...state.dailyReviews,
    [dateKey]: nextReview,
  };
  await repository.saveDailyReview(dateKey, nextReview);
  saveUiState();
  setToast("Mental Debugger 기록을 지웠어요.");
  render();
}

async function suggestMentalDebugCoach(dateKey, debugId) {
  const review = getDailyReview(dateKey);
  const entry = review.mentalDebugs.find((item) => item.id === debugId);
  if (!entry) return;
  const providerLabel = AI_PROVIDER_LABEL[state.aiProviderKind] || AI_PROVIDER_LABEL.rules;
  setToast(`${providerLabel} mental debug coach 생성 중...`);
  render();

  let coach;
  try {
    coach =
      state.aiProviderKind === "ollama"
        ? await createOllamaMentalDebugCoach(entry)
        : createLocalMentalDebugCoach(entry, providerLabel);
  } catch (error) {
    console.warn("Mental debug coach failed", error);
    coach = {
      ...createLocalMentalDebugCoach(entry, `${providerLabel} fallback`),
      summary: "연결에 실패해서 Local Rules로 생각 디버깅을 만들었어요.",
      error: true,
    };
  }

  const nextReview = normalizeDailyReview({
    ...review,
    mentalDebugs: review.mentalDebugs.map((item) => (item.id === debugId ? { ...item, coach } : item)),
  });
  state.dailyReviews = {
    ...state.dailyReviews,
    [dateKey]: nextReview,
  };
  await repository.saveDailyReview(dateKey, nextReview);
  saveUiState();
  setToast("mental debug coach를 만들었어요.");
  render();
}

async function updateMentalDebugRecheck(dateKey, debugId, status) {
  const review = getDailyReview(dateKey);
  const nextReview = normalizeDailyReview({
    ...review,
    mentalDebugs: review.mentalDebugs.map((entry) =>
      entry.id === debugId
        ? {
            ...entry,
            recheckStatus: status,
            timeTest: status === "not-important" ? "no" : status === "still-important" ? "yes" : entry.timeTest,
          }
        : entry,
    ),
  });
  state.dailyReviews = {
    ...state.dailyReviews,
    [dateKey]: nextReview,
  };
  await repository.saveDailyReview(dateKey, nextReview);
  saveUiState();
  setToast("24h recheck를 업데이트했어요.");
  render();
}

async function createTodayActionFromMentalDebug(dateKey, debugId) {
  const review = getDailyReview(dateKey);
  const entry = review.mentalDebugs.find((item) => item.id === debugId);
  if (!entry) return;
  if (entry.actionItemId) {
    setToast("이미 Today 액션으로 전환된 기록이에요.");
    return;
  }
  const now = new Date().toISOString();
  const actionText = mentalDebugActionText(entry);
  const item = normalizeItem({
    id: uid("mind_action"),
    text: actionText,
    date: getTodayKey(),
    status: "open",
    type: "task",
    horizon: "today",
    lane: "now",
    importance: clampEmotionIntensity(entry.emotionIntensity) >= 4 ? "high" : "normal",
    momentum: "active",
    context: "personal",
    timeBlock: currentTimeBlockKey(),
    dailyPriority: entry.actionNeed === "none" ? "secondary" : "primary",
    keywords: tokenize(`mental debug feedback ${entry.event} ${entry.assumption} ${entry.nextResponse}`),
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  });
  state.items = [item, ...state.items];
  const nextReview = normalizeDailyReview({
    ...review,
    mentalDebugs: review.mentalDebugs.map((debug) =>
      debug.id === debugId
        ? {
            ...debug,
            actionItemId: item.id,
            actionNeed: debug.actionNeed === "none" ? "followup" : debug.actionNeed,
            recheckStatus: "converted",
          }
        : debug,
    ),
  });
  state.dailyReviews = {
    ...state.dailyReviews,
    [dateKey]: nextReview,
  };
  await repository.upsertItems([item]);
  await repository.saveDailyReview(dateKey, nextReview);
  saveUiState();
  setToast("Mental Debugger에서 Today 액션을 만들었어요.");
  render();
}

function mentalDebugActionText(entry) {
  if (entry.nextResponse) return `Mental Debug action: ${entry.nextResponse}`;
  if (entry.coach?.action) return `Mental Debug action: ${entry.coach.action}`;
  if (entry.actionNeed === "question") return `확인 질문하기: ${entry.event}`;
  if (entry.actionNeed === "reply") return `정리해서 답변하기: ${entry.event}`;
  if (entry.actionNeed === "boundary") return `경계 설정 문장 정리: ${entry.event}`;
  return `24h 후 다시 확인: ${entry.event || entry.assumption || "Mental Debugger 기록"}`;
}

function createLocalMentalDebugCoach(entry, provider = AI_PROVIDER_LABEL.rules) {
  const pattern = classifyMentalDebugPattern(entry);
  const intensity = clampEmotionIntensity(entry.emotionIntensity);
  const assumptions = [
    entry.assumption || `${pattern.label}이 섞였을 가능성이 있어요.`,
    pattern.key !== "unclear" ? `${pattern.label}은 사실보다 의도 해석이 먼저 커질 때 나타나요.` : "",
    intensity >= 4 ? "감정 강도가 높아서 확정 문장처럼 느껴질 수 있어요." : "",
  ].filter(Boolean);
  const alternativeReads = [
    entry.alternative || "상대가 나를 평가하기보다 결과물 기준을 맞추려는 요청일 수 있어요.",
    entry.fact ? `확인 가능한 사실은 "${entry.fact}"까지예요.` : "아직 이유가 명확히 확인되지 않았어요.",
    "의도를 단정하기 전, 필요한 기준이나 기대 산출물을 확인할 수 있어요.",
  ];
  const action =
    entry.actionNeed === "none"
      ? "지금은 액션보다 24시간 후 재확인이 더 좋아요."
      : entry.actionNeed === "question"
        ? "확인 질문 1개만 짧게 보내세요."
        : entry.nextResponse || "다음 행동을 30분 안에 끝날 단위로 줄여보세요.";
  const replyDraft =
    entry.actionNeed === "question"
      ? "확인 감사합니다. 제가 맞춰야 할 기준이 A인지 B인지 한 번만 확인해도 될까요?"
      : entry.actionNeed === "reply"
        ? "피드백 반영해서 핵심 기준을 다시 정리했습니다. 확인 부탁드립니다."
        : "";
  return normalizeMentalDebugCoach({
    provider,
    generatedAt: new Date().toISOString(),
    summary: `${pattern.label} 가능성을 분리하고, 확인 가능한 사실과 다음 행동을 좁혔어요.`,
    assumptions,
    alternativeReads,
    action,
    replyDraft,
  });
}

async function createOllamaMentalDebugCoach(entry) {
  const response = await fetchWithTimeout(OLLAMA_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: state.ollamaModel || "llama3.2",
      prompt: buildOllamaMentalDebugPrompt(entry),
      stream: false,
      format: "json",
      options: {
        temperature: 0.2,
      },
    }),
  });
  if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
  const payload = await response.json();
  const parsed = parseOllamaMentalDebugCoach(payload.response || "");
  return normalizeMentalDebugCoach({
    ...parsed,
    provider: `${AI_PROVIDER_LABEL.ollama} · ${state.ollamaModel || "llama3.2"}`,
    generatedAt: new Date().toISOString(),
  }) || createLocalMentalDebugCoach(entry, `${AI_PROVIDER_LABEL.ollama} fallback`);
}

function buildOllamaMentalDebugPrompt(entry) {
  return `
You are SeedLog Mental Debugger, a calm Korean cognitive debugging coach.
Help the user separate facts, assumptions, alternative reads, and next action.

Return only valid JSON in this shape:
{
  "summary": "one short Korean sentence",
  "assumptions": ["추측으로 보이는 문장"],
  "alternativeReads": ["더 중립적인 대안 해석"],
  "action": "필요한 다음 행동 또는 액션 없음",
  "replyDraft": "필요하면 보낼 수 있는 짧고 차분한 답변 초안"
}

Rules:
- Write natural Korean.
- Do not diagnose the user or other people.
- Do not invalidate emotion. Separate emotion from evidence.
- Do not invent facts.
- Keep the response practical and short.
- Avoid emoji, markdown, and unusual Unicode characters.

Event: ${entry.event || "none"}
Emotion: ${entry.emotion || "none"}
Emotion intensity: ${clampEmotionIntensity(entry.emotionIntensity)}/5
Assumption: ${entry.assumption || "none"}
Fact after removing assumptions: ${entry.fact || "none"}
Alternative read from user: ${entry.alternative || "none"}
24h test: ${mentalDebugTimeLabel(entry.timeTest)}
Action need: ${mentalDebugActionLabel(entry.actionNeed)}
Next response from user: ${entry.nextResponse || "none"}
`.trim();
}

function parseOllamaMentalDebugCoach(text) {
  const fallback = {};
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return fallback;
    }
  }
}

function scheduleReflectionPersist(kind, key, value) {
  const timerKey = `${kind}:${key}`;
  window.clearTimeout(scheduleReflectionPersist.timers?.[timerKey]);
  scheduleReflectionPersist.timers = scheduleReflectionPersist.timers || {};
  scheduleReflectionPersist.timers[timerKey] = window.setTimeout(async () => {
    try {
      if (kind === "monthly") {
        await repository.saveMonthlyReflection(key, value);
      } else {
        await repository.saveDailyReview(key, value);
      }
    } catch (error) {
      console.warn("Reflection autosave failed", error);
    }
  }, 650);
}

async function deferItemToTomorrow(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item || item.status === "done") return;
  item.date = addDays(item.date, 1);
  item.lane = item.lane === "now" ? "next" : item.lane;
  item.deferCount = (item.deferCount || 0) + 1;
  item.updatedAt = new Date().toISOString();
  await repository.upsertItems([item]);
  saveUiState();
  setToast("내일로 넘겼어요.");
  render();
}

async function moveItemToNextTimeBlock(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item || item.status === "done") return;
  moveToNextTimeBlock(item);
  await repository.upsertItems([item]);
  saveUiState();
  setToast("다음 타임으로 옮겼어요.");
  render();
}

async function moveItemByQuickStep(id, direction) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item || item.status === "done") return;

  const isForward = direction === "forward";
  const isPending = pendingQuickMove?.id === id && pendingQuickMove.direction === direction;
  if (isPending) {
    item.date = addDays(item.date, isForward ? 1 : -1);
    if (isForward) {
      item.lane = item.lane === "now" ? "next" : item.lane;
      item.deferCount = (item.deferCount || 0) + 1;
    }
    item.updatedAt = new Date().toISOString();
    pendingQuickMove = null;
    await repository.upsertItems([item]);
    saveUiState();
    setToast(isForward ? "내일로 넘겼어요." : "어제로 옮겼어요.");
    render();
    return;
  }

  const currentIndex = TIME_BLOCK_ORDER.indexOf(item.timeBlock);
  const nextIndex = currentIndex + (isForward ? 1 : -1);
  pendingQuickMove = { id, direction };

  if (nextIndex >= 0 && nextIndex < TIME_BLOCK_ORDER.length) {
    item.timeBlock = TIME_BLOCK_ORDER[nextIndex];
    item.updatedAt = new Date().toISOString();
    await repository.upsertItems([item]);
    saveUiState();
    setToast(`${TIME_BLOCK_LABEL[item.timeBlock]}로 옮겼어요. 한 번 더 누르면 ${isForward ? "내일" : "어제"}로 이동해요.`);
    render();
    return;
  }

  setToast(`한 번 더 누르면 ${isForward ? "내일" : "어제"}로 이동해요.`);
  render();
}

async function moveItemToTimeBlock(id, timeBlock) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item || !TIME_BLOCK_LABEL[timeBlock] || item.timeBlock === timeBlock) return;
  item.timeBlock = timeBlock;
  item.updatedAt = new Date().toISOString();
  await repository.upsertItems([item]);
  saveUiState();
  setToast(`${TIME_BLOCK_LABEL[timeBlock]}로 옮겼어요.`);
  render();
}

async function moveItemToTimeBlockPosition(id, timeBlock, beforeId = null) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item || !TIME_BLOCK_LABEL[timeBlock]) return;

  item.timeBlock = timeBlock;
  item.manualOrder = nextManualOrderForDrop(item, timeBlock, beforeId);
  item.updatedAt = new Date().toISOString();
  await repository.upsertItems([item]);
  saveUiState();
  setToast(`${TIME_BLOCK_LABEL[timeBlock]} 안에서 위치를 옮겼어요.`);
  render();
}

function nextManualOrderForDrop(item, timeBlock, beforeId) {
  const sameSortGroup = (entry) =>
    itemDoneRank(entry) === itemDoneRank(item) &&
    dailyPriorityRank(entry.dailyPriority) === dailyPriorityRank(item.dailyPriority) &&
    laneRank(entry.lane) === laneRank(item.lane) &&
    importanceRank(entry.importance) === importanceRank(item.importance);
  const peers = state.items
    .filter((entry) => entry.id !== item.id && entry.date === item.date && entry.timeBlock === timeBlock && sameSortGroup(entry))
    .sort((a, b) => manualOrderValue(a) - manualOrderValue(b));
  if (!peers.length) return Date.now();

  const beforeIndex = beforeId ? peers.findIndex((entry) => entry.id === beforeId) : -1;
  if (beforeIndex === 0) return manualOrderValue(peers[0]) - 1000;
  if (beforeIndex > 0) {
    const previous = peers[beforeIndex - 1];
    const next = peers[beforeIndex];
    return (manualOrderValue(previous) + manualOrderValue(next)) / 2;
  }
  return manualOrderValue(peers[peers.length - 1]) + 1000;
}

function beginTodayPointerDrag(card, event) {
  todayPointerDrag = {
    id: card.dataset.todayCard,
    fromBlock: card.dataset.currentTimeBlock,
    card,
    captureEl: event.currentTarget,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    active: false,
    dropTarget: null,
    ghost: null,
  };
  draggedTodayItemId = todayPointerDrag.id;
  // Pointer capture and preventDefault are deferred until the drag actually
  // activates (after the move threshold) so a plain click still focuses the
  // card's textarea / fires its buttons normally.
  window.addEventListener("pointermove", handleTodayPointerMove, { passive: false });
  // WKWebView (macOS) often emits pointercancel instead of pointerup when a
  // drag ends; commit on both so the drop is never silently dropped.
  window.addEventListener("pointerup", handleTodayPointerUp);
  window.addEventListener("pointercancel", handleTodayPointerUp);
}

function beginTodayNativeDrag(card, event) {
  todayNativeDragState = {
    id: card.dataset.todayCard,
    fromBlock: card.dataset.currentTimeBlock,
    card,
    dropTarget: null,
  };
  draggedTodayItemId = todayNativeDragState.id;

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", todayNativeDragState.id);
  card.classList.add("dragging");
  document.body.classList.add("today-dragging");
}

function beginTodayMouseDrag(card, event) {
  todayPointerDrag = {
    id: card.dataset.todayCard,
    fromBlock: card.dataset.currentTimeBlock,
    card,
    startX: event.clientX,
    startY: event.clientY,
    active: false,
    dropTarget: null,
  };
  draggedTodayItemId = todayPointerDrag.id;
  window.addEventListener("mousemove", handleTodayPointerMove);
  window.addEventListener("mouseup", handleTodayPointerUp, { once: true });
}

function handleTodayPointerMove(event) {
  const drag = todayPointerDrag;
  if (!drag) return;
  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (!drag.active && distance < 6) return;
  if (event.cancelable) event.preventDefault();
  if (!drag.active) {
    drag.active = true;
    // The drag started on the card body, which may have focused the textarea
    // and begun a text selection — undo both so the drag feels clean.
    document.activeElement?.blur?.();
    window.getSelection?.()?.removeAllRanges?.();
    try {
      drag.captureEl?.setPointerCapture?.(drag.pointerId);
    } catch {
      // Some WebViews reject pointer capture; window listeners still handle it.
    }
    drag.card.classList.add("dragging");
    document.body.classList.add("today-dragging");
    drag.ghost = createTodayDragGhost(drag.card);
  }
  positionTodayDragGhost(drag.ghost, event.clientX, event.clientY);
  updateTodayPointerDropTarget(event.clientX, event.clientY);
}

function createTodayDragGhost(card) {
  const rect = card.getBoundingClientRect();
  const ghost = card.cloneNode(true);
  ghost.removeAttribute("data-today-card");
  ghost.classList.remove("dragging");
  ghost.classList.add("today-drag-ghost");
  ghost.style.width = `${rect.width}px`;
  // Offset so the cursor sits inside the card rather than at its corner.
  ghost._grabX = 18;
  ghost._grabY = 14;
  document.body.appendChild(ghost);
  return ghost;
}

function positionTodayDragGhost(ghost, x, y) {
  if (!ghost) return;
  ghost.style.left = `${x - (ghost._grabX || 0)}px`;
  ghost.style.top = `${y - (ghost._grabY || 0)}px`;
}

function handleTodayNativeDragOver(event) {
  if (!todayNativeDragState) return;
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
  const target = event.currentTarget;
  const block = target.closest?.(".today-block[data-time-block-drop]");
  document.querySelectorAll(".today-block.drag-over").forEach((entry) => entry.classList.remove("drag-over"));
  clearTodayDropMarkers();
  block?.classList.add("drag-over");

  if (target.matches?.("[data-today-card]")) {
    const rect = target.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;
    target.classList.add(isAfter ? "drop-after" : "drop-before");
  }
}

function handleTodayNativeDrop(event) {
  if (!todayNativeDragState) return;
  event.preventDefault();
  event.stopPropagation();
  const drag = todayNativeDragState;
  const target = event.currentTarget;
  const list = target.matches?.("[data-time-block-drop]")
    ? target.classList.contains("today-card-list")
      ? target
      : target.querySelector?.(".today-card-list[data-time-block-drop]")
    : target.closest?.(".today-card-list[data-time-block-drop]");
  const timeBlock = list?.dataset.timeBlockDrop || target.dataset.timeBlockDrop || target.closest?.(".today-block[data-time-block-drop]")?.dataset.timeBlockDrop;
  let beforeId = null;

  if (target.matches?.("[data-today-card]") && list) {
    const rect = target.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;
    if (!isAfter) {
      beforeId = target.dataset.todayCard;
    } else {
      const cards = Array.from(list.querySelectorAll("[data-today-card]")).filter((entry) => entry.dataset.todayCard !== drag.id);
      const targetIndex = cards.findIndex((entry) => entry.dataset.todayCard === target.dataset.todayCard);
      beforeId = cards[targetIndex + 1]?.dataset.todayCard || null;
    }
  }

  cleanupTodayPointerDrag();
  if (drag && timeBlock) {
    void moveItemToTimeBlockPosition(drag.id, timeBlock, beforeId);
  }
}

function handleTodayNativeDragEnd() {
  cleanupTodayPointerDrag();
}

function handleTodayPointerUp(event) {
  const drag = todayPointerDrag;
  if (!drag) return;
  const dropTarget = drag.active
    ? getTodayDropTargetAt(event.clientX, event.clientY) || drag.dropTarget
    : null;
  cleanupTodayPointerDrag();
  if (drag.active && dropTarget?.timeBlock) {
    moveItemToTimeBlockPosition(drag.id, dropTarget.timeBlock, dropTarget.beforeId);
  }
}

function cancelTodayPointerDrag() {
  cleanupTodayPointerDrag();
}

function cleanupTodayPointerDrag() {
  window.removeEventListener("pointermove", handleTodayPointerMove);
  window.removeEventListener("pointerup", handleTodayPointerUp);
  window.removeEventListener("pointercancel", handleTodayPointerUp);
  window.removeEventListener("mousemove", handleTodayPointerMove);
  window.removeEventListener("mouseup", handleTodayPointerUp);
  document.body.classList.remove("today-dragging");
  document.querySelectorAll(".today-block.drag-over").forEach((block) => block.classList.remove("drag-over"));
  clearTodayDropMarkers();
  todayPointerDrag?.ghost?.remove();
  try {
    todayPointerDrag?.captureEl?.releasePointerCapture?.(todayPointerDrag.pointerId);
  } catch {
    // capture may already be released
  }
  todayPointerDrag?.card.classList.remove("dragging");
  todayNativeDragState?.card.classList.remove("dragging");
  todayPointerDrag = null;
  todayNativeDragState = null;
  draggedTodayItemId = "";
}

function updateTodayPointerDropTarget(x, y) {
  document.querySelectorAll(".today-block.drag-over").forEach((block) => block.classList.remove("drag-over"));
  clearTodayDropMarkers();
  const dropTarget = getTodayDropTargetAt(x, y);
  const activeDrag = todayPointerDrag || todayNativeDragState;
  if (activeDrag) {
    activeDrag.dropTarget = dropTarget;
  }
  dropTarget?.list?.closest(".today-block")?.classList.add("drag-over");
  dropTarget?.markerCard?.classList.add(dropTarget.after ? "drop-after" : "drop-before");
}

function getTodayDropZoneAt(x, y) {
  return getTodayDropTargetAt(x, y)?.list || null;
}

function getTodayDropTargetAt(x, y, fallbackElement = null) {
  const activeDrag = todayPointerDrag || todayNativeDragState;
  const card = activeDrag?.card;
  card?.classList.add("drag-probe");
  const element = document.elementFromPoint(x, y);
  card?.classList.remove("drag-probe");
  const source = element || fallbackElement;
  const block = source?.closest?.(".today-block[data-time-block-drop]") || fallbackElement?.closest?.(".today-block[data-time-block-drop]");
  const list =
    source?.closest?.(".today-card-list[data-time-block-drop]") ||
    fallbackElement?.closest?.(".today-card-list[data-time-block-drop]") ||
    block?.querySelector(".today-card-list[data-time-block-drop]");
  if (!list) return null;

  const timeBlock = list.dataset.timeBlockDrop;
  const targetCard = element?.closest?.("[data-today-card]");
  const dragId = activeDrag?.id;
  if (!targetCard || targetCard.dataset.todayCard === dragId) {
    return { timeBlock, beforeId: null, list, markerCard: null, after: true };
  }

  const rect = targetCard.getBoundingClientRect();
  const isAfter = y > rect.top + rect.height / 2;
  if (!isAfter) {
    return { timeBlock, beforeId: targetCard.dataset.todayCard, list, markerCard: targetCard, after: false };
  }

  const nextCard = Array.from(list.querySelectorAll("[data-today-card]")).find((entry) => {
    if (entry.dataset.todayCard === dragId) return false;
    return entry.getBoundingClientRect().top > rect.top + 1;
  });
  return {
    timeBlock,
    beforeId: nextCard?.dataset.todayCard || null,
    list,
    markerCard: targetCard,
    after: true,
  };
}

function clearTodayDropMarkers() {
  document
    .querySelectorAll(".today-card.drop-before, .today-card.drop-after")
    .forEach((card) => card.classList.remove("drop-before", "drop-after"));
}

// Targets for a block-level bulk action: if any open card in this block is
// selected, act only on the selection; otherwise fall back to the whole block.
function blockActionTargets(block) {
  const open = state.items.filter(
    (item) => item.date === state.selectedDate && item.timeBlock === block && item.status !== "done",
  );
  const selected = open.filter((item) => selectedTodayIds.has(item.id));
  return selected.length ? selected : open;
}

async function moveTimeBlockToNext(block) {
  const items = blockActionTargets(block);
  if (!items.length) return;
  items.forEach(moveToNextTimeBlock);
  items.forEach((item) => selectedTodayIds.delete(item.id));
  await repository.upsertItems(items);
  saveUiState();
  setToast(`${items.length}개 항목을 다음 타임으로 옮겼어요.`);
  render();
}

async function deferTimeBlockToTomorrow(block) {
  const items = blockActionTargets(block);
  if (!items.length) return;
  items.forEach((item) => {
    item.date = addDays(item.date, 1);
    item.lane = item.lane === "now" ? "next" : item.lane;
    item.updatedAt = new Date().toISOString();
  });
  items.forEach((item) => selectedTodayIds.delete(item.id));
  await repository.upsertItems(items);
  saveUiState();
  setToast(`${items.length}개 항목을 내일로 넘겼어요.`);
  render();
}

function moveToNextTimeBlock(item) {
  const currentIndex = TIME_BLOCK_ORDER.indexOf(item.timeBlock);
  const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 1;
  if (nextIndex < TIME_BLOCK_ORDER.length) {
    item.timeBlock = TIME_BLOCK_ORDER[nextIndex];
  } else {
    item.date = addDays(item.date, 1);
    item.timeBlock = TIME_BLOCK_ORDER[0];
  }
  item.lane = item.lane === "now" ? "next" : item.lane;
  item.updatedAt = new Date().toISOString();
}

async function suggestThreadNextSteps(threadId) {
  const threads = buildThreads(state.items);
  const thread = threads.find((entry) => entry.id === threadId);
  if (!thread) return;

  const context = buildThreadSuggestionContext(thread);
  const provider = createAiProvider(state.aiProviderKind);
  setToast(`${provider.label} 제안 생성 중...`);
  render();

  let suggestion;
  try {
    suggestion = await provider.suggestNextActions(context);
  } catch (error) {
    console.warn("Suggestion provider failed", error);
    suggestion = {
      provider: `${provider.label} fallback`,
      generatedAt: new Date().toISOString(),
      summary: providerFailureMessage(provider, error),
      suggestions: createLocalSuggestions(context),
      error: true,
    };
  }
  state.threadSuggestions = {
    ...state.threadSuggestions,
    [threadId]: suggestion,
  };
  saveUiState();
  setToast("next step 제안을 만들었어요.");
  render();
}

function providerFailureMessage(provider, error) {
  if (provider.kind === "ollama") {
    return `Ollama 연결에 실패해서 Local Rules로 대신 제안했어요. Ollama가 실행 중인지, model "${state.ollamaModel}"이 설치되어 있는지 확인해 주세요.`;
  }
  return `${provider.label} provider가 응답하지 않아 Local Rules로 대신 제안했어요.`;
}

function buildThreadSuggestionContext(thread) {
  const threadItems = thread.itemIds
    .map((id) => state.items.find((item) => item.id === id))
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  const meta = getProjectMeta(thread, threadItems);
  return {
    thread,
    meta,
    items: threadItems,
    openItems: threadItems.filter((item) => item.status !== "done"),
    blockedItems: threadItems.filter((item) => item.status !== "done" && item.momentum === "blocked"),
    doneItems: threadItems.filter((item) => item.status === "done"),
  };
}

function cleanField(value) {
  return String(value || "").trim();
}

function getTodayKey() {
  return formatDateKey(new Date());
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeSelectedDate(dateKey, today = getTodayKey()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))) return today;
  return dateKey > today ? today : dateKey;
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);
  return formatDateKey(date);
}

function setToast(message) {
  state.toast = message;
  window.clearTimeout(setToast.timer);
  setToast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 1800);
}

function getDayGroups(items) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.date)) groups.set(item.date, []);
    groups.get(item.date).push(item);
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function getRecentDateGroups(items, anchorDate = getTodayKey(), days = 7) {
  const grouped = new Map(getDayGroups(items));
  return Array.from({ length: days + 1 }, (_, index) => {
    const date = addDays(anchorDate, 1 - index);
    return [date, grouped.get(date) || []];
  });
}

function getMonthItems(items, date) {
  const month = date.slice(0, 7);
  return items.filter((item) => item.date.startsWith(month));
}

function summarize(items, threads) {
  const done = items.filter((item) => item.status === "done").length;
  const long = items.filter((item) => item.horizon === "long").length;
  const projects = threads.filter((thread) => thread.stage === "project").length;
  const keywordCounts = countKeywords(items);
  const laneCounts = countBy(items, "lane");
  const importanceCounts = countBy(items, "importance");
  const momentumCounts = countBy(items, "momentum");
  return {
    total: items.length,
    done,
    completion: items.length ? Math.round((done / items.length) * 100) : 0,
    long,
    projects,
    laneCounts,
    importanceCounts,
    momentumCounts,
    topKeywords: Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8),
  };
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function countKeywords(items) {
  return items.reduce((counts, item) => {
    for (const keyword of item.keywords) counts[keyword] = (counts[keyword] || 0) + 1;
    return counts;
  }, {});
}

function buildMonthlyReview(items, threads) {
  const monthItems = getMonthItems(items, state.selectedDate);
  const monthPrefix = state.selectedDate.slice(0, 7);
  const mentalDebugs = getMentalDebugsForMonth(monthPrefix);
  const mentalStats = buildMentalDebugStats(mentalDebugs);
  const previousItems = items.filter((item) => item.date < `${monthPrefix}-01`);
  const monthThreads = threads.filter((thread) =>
    thread.itemIds.some((id) => {
      const item = items.find((entry) => entry.id === id);
      return item?.date.startsWith(monthPrefix);
    }),
  );
  const counts = countKeywords(monthItems);
  const topKeywords = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const done = monthItems.filter((item) => item.status === "done");
  const openLong = monthItems.filter((item) => item.status !== "done" && item.horizon === "long");
  const ideas = monthItems.filter((item) => item.type === "idea");
  const tasks = monthItems.filter((item) => item.type === "task");
  const openItems = monthItems.filter((item) => item.status !== "done");
  const blocked = openItems.filter((item) => item.momentum === "blocked");
  const active = openItems.filter((item) => item.momentum === "active");
  const highLeverage = monthItems.filter((item) => ["high", "critical"].includes(item.importance));
  const highDone = highLeverage.filter((item) => item.status === "done");
  const taskDoneRate = tasks.length
    ? Math.round((tasks.filter((item) => item.status === "done").length / tasks.length) * 100)
    : 0;
  const ideaDoneRate = ideas.length
    ? Math.round((ideas.filter((item) => item.status === "done").length / ideas.length) * 100)
    : 0;
  const completionRate = monthItems.length ? Math.round((done.length / monthItems.length) * 100) : 0;
  const actionConversionRate = ideas.length ? Math.min(100, Math.round((tasks.length / ideas.length) * 100)) : tasks.length ? 100 : 0;
  const highLeverageDoneRate = highLeverage.length ? Math.round((highDone.length / highLeverage.length) * 100) : 0;
  const blockedRate = openItems.length ? Math.round((blocked.length / openItems.length) * 100) : 0;
  const previousKeywordCounts = countKeywords(previousItems);
  const recurringKeywords = topKeywords
    .filter(([word]) => previousKeywordCounts[word])
    .map(([word, count]) => [word, count, previousKeywordCounts[word]])
    .slice(0, 5);
  const laneCounts = countBy(monthItems, "lane");
  const momentumCounts = countBy(monthItems, "momentum");
  const projectPulse = monthThreads
    .map((thread) => {
      const threadItems = thread.itemIds.map((id) => items.find((item) => item.id === id)).filter(Boolean);
      const meta = getProjectMeta(thread, threadItems);
      return {
        thread,
        meta,
        openCount: threadItems.filter((item) => item.status !== "done").length,
        blockedCount: threadItems.filter((item) => item.status !== "done" && item.momentum === "blocked").length,
      };
    })
    .filter(({ thread, meta }) => isProjectThread(thread, meta))
    .slice(0, 4);

  const signals = [];
  if (topKeywords[0]) {
    signals.push(`이번 달 중심축은 "${topKeywords[0][0]}" 쪽으로 기울어져 있어요.`);
  }
  if (ideas.length > tasks.length) {
    signals.push("아이디어 생산량이 실행 항목보다 많아요.");
  } else if (tasks.length) {
    signals.push("실행 항목 중심으로 움직인 달이에요.");
  }
  if (openLong.length >= 3) {
    signals.push("장기 항목이 쌓이고 있어서 다음 행동 단위로 쪼개면 좋아요.");
  }
  if (taskDoneRate > ideaDoneRate + 20) {
    signals.push("명확한 할 일은 잘 끝내고, 아이디어는 다음 단계 전환에서 느려져요.");
  }
  if (blockedRate >= 25) {
    signals.push("열린 항목 중 막힘 비율이 높아요. 진행보다 병목 제거가 이번 달 효율을 더 올릴 수 있어요.");
  }
  if (highLeverage.length && highLeverageDoneRate < 40) {
    signals.push("중요도가 높은 항목이 완료로 전환되는 속도가 낮아요.");
  }

  const nudges = [];
  for (const thread of monthThreads.slice(0, 3)) {
    if (thread.stage === "seed") {
      nudges.push(`${thread.title}: 30분 실험 하나로 바꿔보기`);
    } else if (thread.stage === "quiet") {
      nudges.push(`${thread.title}: 보류인지 재시작인지 결정하기`);
    } else {
      nudges.push(`${thread.title}: 다음 1개 행동만 고르기`);
    }
  }
  const improvements = buildReviewImprovements({
    actionConversionRate,
    blockedRate,
    highLeverageDoneRate,
    openLong,
    recurringKeywords,
    active,
    ideas,
    tasks,
    mentalStats,
  });
  const reflectionPrompts = buildReflectionPrompts({ topKeywords, blocked, openLong, projectPulse, mentalStats });

  return {
    monthItems,
    monthThreads,
    mentalDebugs,
    mentalStats,
    topKeywords,
    recurringKeywords,
    taskDoneRate,
    ideaDoneRate,
    completionRate,
    actionConversionRate,
    highLeverageDoneRate,
    blockedRate,
    laneCounts,
    momentumCounts,
    blocked,
    openLong,
    active,
    projectPulse,
    improvements,
    reflectionPrompts,
    signals,
    nudges,
    doneCount: done.length,
  };
}

function getMentalDebugsForMonth(monthPrefix) {
  return Object.entries(normalizeDailyReviews(state.dailyReviews))
    .filter(([dateKey]) => dateKey.startsWith(monthPrefix))
    .flatMap(([dateKey, review]) =>
      (review.mentalDebugs || []).map((entry) => ({
        ...entry,
        dateKey,
        pattern: classifyMentalDebugPattern(entry),
      })),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function buildMentalDebugStats(entries) {
  const byPattern = entries.reduce((acc, entry) => {
    const key = entry.pattern.key;
    acc[key] = acc[key] || { ...entry.pattern, count: 0 };
    acc[key].count += 1;
    return acc;
  }, {});
  const intensities = entries.map((entry) => clampEmotionIntensity(entry.emotionIntensity));
  const averageIntensity = intensities.length
    ? Math.round((intensities.reduce((sum, value) => sum + value, 0) / intensities.length) * 10) / 10
    : 0;
  const notImportantCount = entries.filter((entry) => entry.timeTest === "no").length;
  const noActionCount = entries.filter((entry) => entry.actionNeed === "none").length;
  return {
    total: entries.length,
    averageIntensity,
    highHeatCount: intensities.filter((value) => value >= 4).length,
    notImportantCount,
    noActionCount,
    notImportantRate: entries.length ? Math.round((notImportantCount / entries.length) * 100) : 0,
    noActionRate: entries.length ? Math.round((noActionCount / entries.length) * 100) : 0,
    byPattern: Object.values(byPattern).sort((a, b) => b.count - a.count),
    heatDays: buildMentalDebugHeatDays(entries),
  };
}

function buildMentalDebugHeatDays(entries) {
  const byDate = entries.reduce((acc, entry) => {
    const dateKey = entry.dateKey || entry.createdAt.slice(0, 10);
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(clampEmotionIntensity(entry.emotionIntensity));
    return acc;
  }, {});
  return Object.entries(byDate)
    .map(([dateKey, values]) => ({
      dateKey,
      count: values.length,
      intensity: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
    }))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}

function classifyMentalDebugPattern(entry) {
  const text = `${entry.assumption || ""} ${entry.event || ""}`.toLowerCase();
  const patterns = [
    ["mistrust", "불신 해석", /(못 ?믿|신뢰.*없|distrust|trust)/i],
    ["attack", "공격 해석", /(공격|비난|혼내|attack|blame|critic)/i],
    ["rejection", "거절/배제 해석", /(싫어|미워|배제|무시|거절|reject|exclude|ignore)/i],
    ["evaluation", "평가 불안", /(평가|인정|실패|능력|performance|review|fail)/i],
    ["catastrophe", "결과 확대", /(망했|큰일|항상|절대|끝났|catastroph|always|never)/i],
    ["responsibility", "과잉 책임", /(내 탓|내가.*문제|책임|should have|my fault)/i],
  ];
  const matched = patterns.find(([, , regex]) => regex.test(text));
  return matched ? { key: matched[0], label: matched[1] } : { key: "unclear", label: "미분류 추측" };
}

function buildDailyWrapUp(dateKey, items, threads) {
  const dayItems = items.filter((item) => item.date === dateKey && item.type !== "idea");
  const done = dayItems.filter((item) => item.status === "done");
  const open = dayItems.filter((item) => item.status !== "done").sort((a, b) => prioritySort(a, b));
  const blocked = open.filter((item) => item.momentum === "blocked");
  const highLeverage = open.filter((item) => ["high", "critical"].includes(item.importance));
  const ideas = dayItems.filter((item) => item.type === "idea");
  const projectThreads = threads.filter((thread) =>
    thread.itemIds.some((id) => dayItems.some((item) => item.id === id)) && thread.stage === "project",
  );
  const completionRate = dayItems.length ? Math.round((done.length / dayItems.length) * 100) : 0;
  const carryOver = open.filter((item) => item.momentum !== "blocked");
  const tomorrowPrimaryItem = uniqueItems([...blocked, ...highLeverage, ...carryOver])[0] || null;
  const tomorrowPrimary = tomorrowPrimaryItem
    ? {
        item: tomorrowPrimaryItem,
        reason: dailyCandidateReason(tomorrowPrimaryItem),
      }
    : null;
  const prompts = buildDailyWrapUpPrompts({
    dayItems,
    done,
    open,
    blocked,
    highLeverage,
    ideas,
    projectThreads,
    completionRate,
  });

  return {
    dayItems,
    done,
    open,
    blocked,
    highLeverage,
    ideas,
    projectThreads,
    completionRate,
    carryOver,
    tomorrowPrimary,
    prompts,
  };
}

function dailyCandidateReason(item) {
  if (item.momentum === "blocked") return "막힌 이유를 질문/요청/결정으로 바꾸기 좋은 항목이에요.";
  if (["critical", "high"].includes(item.importance)) return "중요도가 높아서 내일 첫 집중 후보로 좋아요.";
  if (item.lane === "now") return "이미 Now에 올라와 있어서 흐름을 이어가기 좋아요.";
  if (item.horizon === "long") return "장기 항목이라 30분 행동으로 잘라두면 다음 달 회고가 좋아져요.";
  return "오늘 열려 있었던 흐름을 내일의 작은 시작점으로 바꿀 수 있어요.";
}

function buildDailyWrapUpPrompts(review) {
  const prompts = [];
  if (!review.dayItems.length) {
    prompts.push("오늘 기록이 비어 있어요. 짧게라도 오늘의 신호 하나를 남겨보세요.");
    return prompts;
  }
  if (review.done.length) {
    prompts.push(`${review.done.length}개를 끝냈어요. 반복하고 싶은 처리 방식이 있었는지 적어보세요.`);
  }
  if (review.open.length) {
    prompts.push(`${review.open.length}개가 열려 있어요. 내일 정말 가져갈 항목만 남기면 좋아요.`);
  }
  if (review.blocked.length) {
    prompts.push(`막힌 항목 ${review.blocked.length}개는 내일 할 일보다 질문/요청/결정으로 바꾸면 풀리기 쉬워요.`);
  }
  if (review.highLeverage.length) {
    prompts.push(`중요 항목 ${review.highLeverage.length}개는 내일 첫 집중 후보예요.`);
  }
  if (review.ideas.length > review.done.length) {
    prompts.push("아이디어가 실행보다 많았어요. 하나만 30분 행동으로 바꾸면 흐름이 이어져요.");
  }
  if (review.projectThreads.length) {
    prompts.push(`${review.projectThreads[0].title} 쪽 진행을 오늘의 프로젝트 흔적으로 남길 수 있어요.`);
  }
  return prompts.slice(0, 4);
}

function buildDayInsights(dateKey, items, dailyReviews) {
  const dayItems = items.filter((i) => i.date === dateKey && i.type !== "idea");
  const done = dayItems.filter((i) => i.status === "done");
  const open = dayItems.filter((i) => i.status !== "done");
  const blocked = open.filter((i) => i.momentum === "blocked");
  const completionRate = dayItems.length ? Math.round((done.length / dayItems.length) * 100) : 0;

  const primaryItems = dayItems.filter((i) => i.dailyPriority === "primary");
  const primaryDone = primaryItems.filter((i) => i.status === "done");
  const primaryRate = primaryItems.length ? Math.round((primaryDone.length / primaryItems.length) * 100) : null;

  const morningItems = dayItems.filter((i) => i.timeBlock === "morning");
  const morningPrimary = morningItems.filter((i) => i.dailyPriority === "primary");
  const morningPrimaryRatio = morningItems.length ? morningPrimary.length / morningItems.length : null;

  const eveningItems = dayItems.filter((i) => i.timeBlock === "evening");
  const eveningDone = eveningItems.filter((i) => i.status === "done");
  const eveningRate = eveningItems.length ? Math.round((eveningDone.length / eveningItems.length) * 100) : null;

  const deferredItems = open
    .filter((i) => {
      const created = (i.createdAt || "").slice(0, 10);
      return created && created < dateKey;
    })
    .map((i) => {
      const created = (i.createdAt || dateKey).slice(0, 10);
      const daysDeferred = Math.floor((new Date(dateKey) - new Date(created)) / 86400000);
      return { item: i, daysDeferred };
    })
    .sort((a, b) => b.daysDeferred - a.daysDeferred);

  const energyOrder = ["low", "medium", "high", "peak"];
  const reviewsMap = Array.isArray(dailyReviews)
    ? Object.fromEntries(dailyReviews.map((rv) => [rv.date, rv]))
    : (dailyReviews || {});
  const last7Dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(dateKey + "T00:00:00");
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const energyHistory = last7Dates
    .map((d) => {
      const r = reviewsMap[d];
      return r?.energy ? energyOrder.indexOf(r.energy) : -1;
    })
    .filter((v) => v >= 0);
  let energyTrend = null;
  if (energyHistory.length >= 3) {
    const recent = energyHistory.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    energyTrend = avg > energyHistory[0] + 0.5 ? "up" : avg < energyHistory[0] - 0.5 ? "down" : "flat";
  }

  let dayType, dayTypeClass;
  if (!dayItems.length) {
    dayType = "기록 없음"; dayTypeClass = "empty";
  } else if (completionRate >= 80 && (primaryRate === null || primaryRate >= 70)) {
    dayType = "집중일"; dayTypeClass = "focus";
  } else if (blocked.length >= 2) {
    dayType = "막힘일"; dayTypeClass = "blocked";
  } else if (eveningRate !== null && eveningRate >= 60 && completionRate >= 50) {
    dayType = "성장일"; dayTypeClass = "growth";
  } else if (completionRate < 40) {
    dayType = "분산일"; dayTypeClass = "scattered";
  } else {
    dayType = "진행일"; dayTypeClass = "progress";
  }

  const observations = [];
  if (primaryRate !== null && primaryRate < 50 && primaryItems.length >= 2) {
    observations.push({ level: "warn", text: `Primary ${primaryItems.length}개 중 ${primaryDone.length}개 완료 (${primaryRate}%) — 핵심 집중이 어려웠던 하루예요.` });
  } else if (primaryRate === 100 && primaryItems.length >= 2) {
    observations.push({ level: "good", text: `Primary ${primaryItems.length}개 전부 완료 — 핵심에 집중한 하루예요.` });
  }
  if (morningPrimaryRatio !== null && morningPrimaryRatio < 0.25 && morningItems.length >= 3) {
    observations.push({ level: "warn", text: `Morning Focus가 Secondary 위주 (Primary ${Math.round(morningPrimaryRatio * 100)}%) — 아침 에너지가 핵심 작업에 덜 쓰였어요.` });
  }
  if (deferredItems.length > 0) {
    const worst = deferredItems[0];
    const label = worst.item.text.length > 20 ? worst.item.text.slice(0, 20) + "…" : worst.item.text;
    const extra = deferredItems.length > 1 ? ` 외 ${deferredItems.length - 1}개` : "";
    observations.push({ level: "warn", text: `"${label}" ${worst.daysDeferred}일째 이월${extra} — 실행 장벽이 있는지 확인해보세요.` });
  }
  if (blocked.length >= 1) {
    const names = blocked.slice(0, 2).map((i) => `"${i.text.slice(0, 12)}${i.text.length > 12 ? "…" : ""}"`).join(", ");
    observations.push({ level: "info", text: `막힌 항목 ${blocked.length}개 (${names}) — 질문/요청/결정으로 바꾸면 풀려요.` });
  }
  if (eveningRate !== null && eveningRate >= 70) {
    observations.push({ level: "good", text: `Evening Build ${eveningRate}% — 성장 시간을 잘 활용했어요.` });
  } else if (eveningRate !== null && eveningRate < 30 && eveningItems.length >= 2) {
    observations.push({ level: "warn", text: `Evening Build ${eveningRate}% — 18-20 짧은 집중 블록을 먼저 잡아보세요.` });
  }
  if (energyTrend === "down") {
    observations.push({ level: "info", text: "에너지가 최근 하향 추세예요. 회복 루틴이 필요할 수 있어요." });
  }

  return {
    dayType, dayTypeClass,
    completionRate, primaryRate, eveningRate,
    deferredItems, blocked, energyTrend,
    observations: observations.slice(0, 4),
    _raw: { dayItems, done, open, blocked, primaryItems, primaryDone, eveningItems, eveningDone, deferredItems },
  };
}

function buildWeekInsights(dateKey, items, dailyReviews) {
  const reviewsMap = Array.isArray(dailyReviews) ? Object.fromEntries(dailyReviews.map((r) => [r.date, r])) : (dailyReviews || {});
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(dateKey + "T00:00:00");
    d.setDate(d.getDate() - (6 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  const dayStats = days.map((d) => {
    const dayItems = items.filter((i) => i.date === d && i.type !== "idea");
    const done = dayItems.filter((i) => i.status === "done").length;
    const total = dayItems.length;
    const eveningItems = dayItems.filter((i) => i.timeBlock === "evening");
    const eveningDone = eveningItems.filter((i) => i.status === "done").length;
    const review = reviewsMap[d];
    return {
      date: d,
      label: new Date(d + "T00:00:00").toLocaleDateString("ko-KR", { weekday: "narrow" }),
      completion: total ? Math.round((done / total) * 100) : null,
      eveningRate: eveningItems.length ? Math.round((eveningDone / eveningItems.length) * 100) : null,
      energy: review?.energy || null,
      hasData: total > 0,
    };
  });

  const activeDays = dayStats.filter((d) => d.completion !== null);
  const avgCompletion = activeDays.length
    ? Math.round(activeDays.reduce((a, b) => a + b.completion, 0) / activeDays.length)
    : null;

  let eveningStreak = 0;
  for (let i = dayStats.length - 1; i >= 0; i--) {
    const s = dayStats[i];
    if (s.eveningRate !== null && s.eveningRate >= 50) eveningStreak++;
    else break;
  }

  const recurringOpen = items.filter((i) => {
    if (i.date !== dateKey || i.status === "done" || i.type === "idea") return false;
    const created = (i.createdAt || "").slice(0, 10);
    return created && created <= days[0];
  });

  return { dayStats, avgCompletion, eveningStreak, recurringOpen };
}

function renderWeekInsights(week) {
  const bars = week.dayStats.map((d) => {
    const pct = d.completion !== null ? d.completion : 0;
    const isToday = d.date === week.dayStats[week.dayStats.length - 1].date;
    const colorClass = !d.hasData ? "week-bar-empty" : pct >= 70 ? "week-bar-good" : pct >= 40 ? "week-bar-mid" : "week-bar-low";
    return `
      <div class="week-bar-col ${isToday ? "today" : ""}">
        <div class="week-bar-wrap">
          <div class="week-bar ${colorClass}" style="height:${d.hasData ? Math.max(pct, 4) : 0}%"></div>
        </div>
        <span class="week-bar-label">${d.label}</span>
      </div>`;
  }).join("");

  const stats = [];
  if (week.avgCompletion !== null) stats.push(`이번 주 평균 <strong>${week.avgCompletion}%</strong>`);
  if (week.eveningStreak >= 3) stats.push(`Evening Build <strong>${week.eveningStreak}일</strong> 연속`);
  if (week.recurringOpen.length > 0) stats.push(`장기 이월 <strong>${week.recurringOpen.length}개</strong>`);

  return `
    <div class="week-insight">
      <div class="week-bars">${bars}</div>
      ${stats.length ? `<div class="week-stats">${stats.join(" · ")}</div>` : ""}
    </div>`;
}

// Aggregate why open items keep getting deferred — the personal failure taxonomy.
function buildDeferTaxonomy(items) {
  const counts = {};
  items
    .filter((i) => i.status !== "done" && i.type !== "idea" && i.deferReason)
    .forEach((i) => {
      counts[i.deferReason] = (counts[i.deferReason] || 0) + 1;
    });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

// How attention was actually distributed across lanes over the past 7 days.
function buildLaneFocus(items, dateKey) {
  const start = addDays(dateKey, -6);
  const recent = items.filter((i) => i.date >= start && i.date <= dateKey && i.type !== "idea");
  const byLane = {};
  Object.keys(LANE_LABEL).forEach((lane) => {
    byLane[lane] = { total: 0, done: 0 };
  });
  recent.forEach((i) => {
    if (!byLane[i.lane]) byLane[i.lane] = { total: 0, done: 0 };
    byLane[i.lane].total += 1;
    if (i.status === "done") byLane[i.lane].done += 1;
  });
  const grandTotal = recent.length || 1;
  return { byLane, grandTotal, count: recent.length };
}

function renderWeeklyReview() {
  const week = buildWeekInsights(state.selectedDate, state.items, state.dailyReviews || {});
  const chronic = state.items
    .filter((i) => i.status !== "done" && i.type !== "idea" && (i.deferCount || 0) >= DEFER_FRICTION_THRESHOLD)
    .sort((a, b) => (b.deferCount || 0) - (a.deferCount || 0));
  const taxonomy = buildDeferTaxonomy(state.items);
  const taxTotal = taxonomy.reduce((a, [, n]) => a + n, 0) || 1;
  const focus = buildLaneFocus(state.items, state.selectedDate);
  const goals = state.goals || [];
  const fakeThreads = getSignalThreads(state.items);

  // North-star check: did the strategic lanes (Build/Invest) get any attention?
  const investFocus = focus.byLane.invest || { total: 0, done: 0 };
  const buildFocus = focus.byLane.build || { total: 0, done: 0 };
  const strategicNeglected = goals.length > 0 && investFocus.total === 0 && buildFocus.total === 0;

  return `
    <div class="weekly-view">
      <div class="workspace-header">
        <div>
          <h1>주간 리뷰</h1>
          <p class="muted">일주일을 닫고, 다음 주를 다시 고른다</p>
        </div>
        <button class="ghost-button" data-view="wrapup">← 하루 마감</button>
      </div>

      <section class="weekly-step">
        <div class="weekly-step-head"><span class="weekly-step-num">1</span><h2>이번 주 숫자</h2></div>
        ${renderWeekInsights(week)}
      </section>

      <section class="weekly-step">
        <div class="weekly-step-head"><span class="weekly-step-num">2</span><h2>북극성 점검</h2></div>
        ${goals.length ? `
          <div class="weekly-goals">
            ${goals.map((g, i) => `<div class="weekly-goal"><span class="goal-num">${i + 1}</span>${escapeHtml(g)}</div>`).join("")}
          </div>
          ${strategicNeglected
            ? `<div class="weekly-flag warn">⚠ 이번 주 Build·Invest 레인에 <strong>0개</strong> — 목표는 적어뒀는데 거기에 시간을 안 썼어요.</div>`
            : ""}
          <div class="lane-focus-bars">
            ${Object.entries(LANE_LABEL).map(([lane, label]) => {
              const f = focus.byLane[lane] || { total: 0, done: 0 };
              const pct = Math.round((f.total / focus.grandTotal) * 100);
              return `
                <div class="lane-focus-row">
                  <span class="lane-focus-label ${lane}">${label}</span>
                  <div class="lane-focus-track"><div class="lane-focus-fill ${lane}" style="width:${pct}%"></div></div>
                  <span class="lane-focus-count">${f.total}건</span>
                </div>`;
            }).join("")}
          </div>
          <p class="muted weekly-note">지난 7일 ${focus.count}개 항목 기준 · 가장 중요하다던 레인에 막대가 보이나요?</p>
        ` : `<p class="muted">Priority Board에서 분기 목표를 1~3개 적어두면, 여기서 실제 시간 배분과 비춰봐요.</p>`}
      </section>

      <section class="weekly-step">
        <div class="weekly-step-head"><span class="weekly-step-num">3</span><h2>묵은 항목 결단</h2><span class="chip ${chronic.length ? "chip-warn" : ""}">${chronic.length}</span></div>
        ${chronic.length ? `
          <p class="muted weekly-note">${DEFER_FRICTION_THRESHOLD}번 이상 미룬 항목들. 하나씩 결단해요.</p>
          <div class="carry-over-list">
            ${chronic.map((item) => renderDecisionRow(item, fakeThreads.find((t) => t.itemIds.includes(item.id)))).join("")}
          </div>
        ` : `<div class="board-empty">묵은 항목이 없어요. 깔끔하네요 ✨</div>`}
      </section>

      <section class="weekly-step">
        <div class="weekly-step-head"><span class="weekly-step-num">4</span><h2>실패 분류표</h2></div>
        ${taxonomy.length ? `
          <div class="taxonomy-list">
            ${taxonomy.map(([reason, count]) => {
              const pct = Math.round((count / taxTotal) * 100);
              return `
                <div class="taxonomy-row">
                  <span class="taxonomy-label">${DEFER_REASON_LABEL[reason]}</span>
                  <div class="taxonomy-track"><div class="taxonomy-fill" style="width:${pct}%"></div></div>
                  <span class="taxonomy-count">${count}</span>
                </div>`;
            }).join("")}
          </div>
          <p class="muted weekly-note">${taxonomyInsight(taxonomy)}</p>
        ` : `<p class="muted">묵은 항목에 사유를 달면, 내가 무엇 때문에 자꾸 막히는지 패턴이 쌓여요.</p>`}
      </section>

      <section class="weekly-step">
        <div class="weekly-step-head"><span class="weekly-step-num">5</span><h2>보드 재정비</h2></div>
        <p class="muted weekly-note">레인을 다시 보고, 죽은 항목을 정리하고, 다음 주의 Now를 고르세요.</p>
        <button class="primary-button" data-view="board">Priority Board 열기 →</button>
      </section>
    </div>
  `;
}

function taxonomyInsight(taxonomy) {
  if (!taxonomy.length) return "";
  const [topReason] = taxonomy[0];
  const map = {
    blocked: "외부 의존이 가장 큰 병목이에요. 막힌 항목은 '요청/질문/결정'으로 다시 쓰면 풀려요.",
    avoided: "감정적 회피가 1순위예요. 이런 항목은 잘게 쪼개 첫 5분만 시작하는 게 약이에요.",
    forgot: "잊어서 놓치는 게 많아요. Morning Focus 상단에 고정하거나 알림을 거세요.",
    toobig: "덩어리가 너무 커요. 다음 액션 한 줄로 잘라야 움직여요.",
    misscheduled: "시간 배치가 어긋나요. 에너지가 맞는 타임블록으로 옮겨보세요.",
  };
  return map[topReason] || "";
}

function renderDayInsights(insights, week) {
  const levelIcon = { warn: "⚠", good: "✓", info: "·" };
  const levelClass = { warn: "insight-warn", good: "insight-good", info: "insight-info" };

  const observationRows = insights.observations.map((obs) => `
    <div class="insight-row ${levelClass[obs.level]}">
      <span class="insight-icon">${levelIcon[obs.level]}</span>
      <span>${escapeHtml(obs.text)}</span>
    </div>`).join("");

  let ollamaSection = "";
  if (state.aiProviderKind === "ollama") {
    const cache = wrapupInsightCache;
    let inner;
    if (cache.status === "loading") {
      inner = `<span class="insight-loading">Ollama 분석 중…</span>`;
    } else if (cache.status === "done" && cache.date === state.selectedDate) {
      inner = `<div class="insight-ai-text">${escapeHtml(cache.text)}</div>`;
    } else if (cache.status === "error") {
      inner = `<span class="insight-error">Ollama 연결 실패 — 실행 중인지 확인해주세요.</span>`;
    } else {
      inner = `<button class="small-button insight-ai-btn" data-trigger-wrapup-insight>AI 심층 분석</button>`;
    }
    ollamaSection = `<div class="insight-ollama" id="wrapup-ollama-section">${inner}</div>`;
  }

  return `
    <section class="wrapup-insights">
      <div class="insight-header">
        <div>
          <h2>오늘 분석</h2>
          <p class="muted">하루 패턴 리뷰</p>
        </div>
        <span class="insight-day-badge ${insights.dayTypeClass}">${insights.dayType}</span>
      </div>
      <div class="insight-metrics">
        <div class="insight-metric">
          <span class="metric-value">${insights.completionRate}%</span>
          <span class="metric-label">전체 완료</span>
        </div>
        ${insights.primaryRate !== null ? `<div class="insight-metric ${insights.primaryRate < 50 ? "metric-warn" : ""}">
          <span class="metric-value">${insights.primaryRate}%</span>
          <span class="metric-label">Primary</span>
        </div>` : ""}
        ${insights.eveningRate !== null ? `<div class="insight-metric ${insights.eveningRate < 30 ? "metric-warn" : ""}">
          <span class="metric-value">${insights.eveningRate}%</span>
          <span class="metric-label">Evening Build</span>
        </div>` : ""}
        ${insights.deferredItems.length > 0 ? `<div class="insight-metric metric-warn">
          <span class="metric-value">${insights.deferredItems.length}</span>
          <span class="metric-label">이월</span>
        </div>` : ""}
      </div>
      ${observationRows ? `<div class="insight-observations">${observationRows}</div>` : ""}
      ${week ? renderWeekInsights(week) : ""}
      ${ollamaSection}
    </section>`;
}

function buildWrapupInsightPrompt(dateKey, insights) {
  const r = insights._raw;
  const doneList = r.done.slice(0, 6).map((i) => `- ${i.text}`).join("\n") || "없음";
  const openList = r.open.slice(0, 6).map((i) => `- ${i.text}${i.momentum === "blocked" ? " [막힘]" : ""}`).join("\n") || "없음";
  const deferList = r.deferredItems.slice(0, 3).map(({ item, daysDeferred }) => `- "${item.text}" (${daysDeferred}일째)`).join("\n");

  return `당신은 생산성 코치입니다. 아래 하루 데이터를 보고 한국어로 짧게 피드백해주세요.

날짜: ${dateKey} / 하루 유형: ${insights.dayType}
전체 완료율: ${insights.completionRate}% / Primary: ${insights.primaryRate !== null ? insights.primaryRate + "%" : "없음"} / Evening Build: ${insights.eveningRate !== null ? insights.eveningRate + "%" : "없음"}

완료 항목 (${r.done.length}개):
${doneList}

미완 항목 (${r.open.length}개):
${openList}

${deferList ? `장기 이월:\n${deferList}` : ""}

다음 3가지를 3~4문장으로 답해주세요:
1. 오늘 하루의 핵심 패턴 한 줄
2. 가장 주목할 문제점 (있다면)
3. 내일을 위한 구체적인 제안 한 가지`;
}

async function triggerWrapupInsight(dateKey, insights) {
  if (wrapupInsightCache.status === "loading") return;
  wrapupInsightCache = { date: dateKey, status: "loading", text: null };

  const section = document.getElementById("wrapup-ollama-section");
  if (section) section.innerHTML = `<span class="insight-loading">Ollama 분석 중…</span>`;

  try {
    const response = await fetchWithTimeout(OLLAMA_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: state.ollamaModel || "llama3.2",
        prompt: buildWrapupInsightPrompt(dateKey, insights),
        stream: false,
        options: { temperature: 0.3 },
      }),
    }, 30000);
    if (!response.ok) throw new Error(`Ollama ${response.status}`);
    const payload = await response.json();
    wrapupInsightCache = { date: dateKey, status: "done", text: (payload.response || "").trim() };
  } catch {
    wrapupInsightCache = { date: dateKey, status: "error", text: null };
  }

  const updated = document.getElementById("wrapup-ollama-section");
  if (updated) {
    if (wrapupInsightCache.status === "done") {
      updated.innerHTML = `<div class="insight-ai-text">${escapeHtml(wrapupInsightCache.text)}</div>`;
    } else {
      updated.innerHTML = `<span class="insight-error">Ollama 연결 실패 — 실행 중인지 확인해주세요.</span>`;
    }
  }
}

function buildReviewImprovements(review) {
  const improvements = [];
  if (review.actionConversionRate < 60 && review.ideas.length >= 2) {
    improvements.push("아이디어 3개마다 실행 항목 1개를 강제로 만들면 전환율이 올라가요.");
  }
  if (review.blockedRate >= 20) {
    improvements.push("Blocked 항목은 할 일로 두기보다 질문/요청/결정 중 하나로 다시 써보세요.");
  }
  if (review.highLeverageDoneRate < 50) {
    improvements.push("중요 항목을 Today의 첫 시간대에 먼저 올리는 규칙을 두면 좋아요.");
  }
  if (review.openLong.length >= 3) {
    improvements.push("장기 항목은 월말에 남기지 말고 주간 milestone 하나로 쪼개는 게 좋아요.");
  }
  if (review.recurringKeywords.length >= 2 && review.active.length < 2) {
    improvements.push("반복 키워드는 많은데 active 항목이 적어요. 관심사와 실행 사이가 벌어지고 있어요.");
  }
  if (review.mentalStats?.averageIntensity >= 4) {
    improvements.push("감정 온도가 높은 피드백은 당일 답변보다 사실/추측 분리 후 다음 타임에 처리하는 규칙이 좋아요.");
  }
  if (!improvements.length) {
    improvements.push("이번 달 흐름은 비교적 균형적이에요. 다음 달에도 첫 집중을 매일 1개만 유지해보세요.");
  }
  return improvements;
}

function buildReflectionPrompts({ topKeywords, blocked, openLong, projectPulse, mentalStats }) {
  const mainKeyword = topKeywords[0]?.[0] || "이번 달";
  const prompts = [
    `"${mainKeyword}" 쪽으로 시간을 쓴 이유는 무엇이었나?`,
    "완료된 항목 중 다음 달에도 반복하고 싶은 방식은 무엇인가?",
  ];
  if (mentalStats?.byPattern?.[0]) {
    prompts.push(`"${mentalStats.byPattern[0].label}" 패턴은 실제 사실보다 얼마나 자주 커졌나?`);
  }
  if (blocked.length) {
    prompts.push("막힌 항목들은 정보 부족, 결정 지연, 에너지 부족 중 어디에 가까웠나?");
  }
  if (openLong.length) {
    prompts.push("장기 항목 중 다음 달 첫 주에 30분 실험으로 바꿀 수 있는 것은 무엇인가?");
  }
  if (projectPulse.length) {
    prompts.push("프로젝트 brief의 성공기준은 실제 다음 행동을 고르게 해주고 있나?");
  }
  return prompts.slice(0, 5);
}

function getMonthlyReflection(monthKey) {
  return {
    grew: "",
    worked: "",
    friction: "",
    adjustment: "",
    notes: "",
    ...(state.monthlyReflections?.[monthKey] || {}),
  };
}

function getDailyReview(dateKey) {
  return normalizeDailyReview({
    win: "",
    friction: "",
    learned: "",
    tomorrow: "",
    energy: "normal",
    ...(state.dailyReviews?.[dateKey] || {}),
  });
}

function buildGeneralReflectionStarters(review) {
  const starters = [];
  const keyword = review.topKeywords[0]?.[0];
  if (keyword) {
    starters.push(`성장 축: 이번 달 기록은 "${keyword}" 쪽으로 가장 많이 모였어요.`);
  }
  if (review.completionRate >= 60) {
    starters.push(`좋았던 방식: 완료 전환 ${review.completionRate}%로 실행 리듬이 꽤 살아있었어요.`);
  } else if (review.monthItems.length) {
    starters.push(`점검 지점: 완료 전환 ${review.completionRate}%라서 항목을 더 작은 단위로 자르면 좋아요.`);
  }
  if (review.blocked.length) {
    starters.push(`마찰: Blocked ${review.blocked.length}개는 질문, 요청, 결정 중 하나로 다시 써볼 만해요.`);
  }
  if (review.mentalStats?.byPattern?.[0]) {
    starters.push(`생각 디버깅: "${review.mentalStats.byPattern[0].label}" 패턴이 가장 자주 나타났어요.`);
  }
  if (review.projectPulse.length) {
    starters.push(`프로젝트: ${review.projectPulse[0].thread.title} 흐름을 다음 달 첫 체크포인트로 삼을 수 있어요.`);
  }
  return starters.slice(0, 4);
}

function buildMonthlyConclusionLines(review) {
  const keyword = review.topKeywords[0]?.[0];
  const lines = [];
  if (!review.monthItems.length) {
    return [
      "이번 달 기록이 아직 없어요.",
      "하루 입력을 2-3개만 쌓아도 방향과 반복 패턴이 보이기 시작해요.",
      "다음 달 목표는 먼저 기록 습관을 만드는 것으로 잡아도 좋아요.",
    ];
  }

  lines.push(
    keyword
      ? `이번 달의 중심은 "${keyword}" 흐름이었어요.`
      : "이번 달은 아직 뚜렷한 중심 키워드가 잡히지 않았어요.",
  );
  lines.push(
    review.completionRate >= 60
      ? `완료 전환 ${review.completionRate}%로 실행 리듬이 살아 있었어요.`
      : `완료 전환 ${review.completionRate}%라서 항목을 더 작게 쪼개면 좋아요.`,
  );
  if (review.blocked.length) {
    lines.push(`막힌 항목 ${review.blocked.length}개는 다음 달 첫 주에 질문/요청/결정으로 바꿔보세요.`);
  } else if (review.openLong.length) {
    lines.push(`남은 장기 항목 ${review.openLong.length}개는 다음 달 첫 30분 실험 후보예요.`);
  } else {
    lines.push("다음 달에도 매일 첫 집중 1개만 유지하면 흐름이 안정적으로 이어질 수 있어요.");
  }
  return lines.slice(0, 3);
}

function createAiProvider(kind) {
  if (kind === "ollama") return createOllamaProvider();
  if (kind === "openai") return createNotConnectedProvider("openai");
  return createLocalRulesProvider();
}

function createNotConnectedProvider(kind) {
  return {
    kind,
    label: AI_PROVIDER_LABEL[kind],
    async suggestNextActions(context) {
      return {
        provider: AI_PROVIDER_LABEL[kind],
        generatedAt: new Date().toISOString(),
        summary: `${AI_PROVIDER_LABEL[kind]} provider는 아직 연결되지 않았어요. Local Rules로 먼저 제안할 수 있어요.`,
        suggestions: createLocalSuggestions(context),
      };
    },
  };
}

function createLocalRulesProvider() {
  return {
    kind: "rules",
    label: AI_PROVIDER_LABEL.rules,
    async suggestNextActions(context) {
      const suggestions = createLocalSuggestions(context);
      return {
        provider: AI_PROVIDER_LABEL.rules,
        generatedAt: new Date().toISOString(),
        summary: summarizeSuggestionContext(context, suggestions),
        suggestions,
      };
    },
  };
}

function createOllamaProvider() {
  return {
    kind: "ollama",
    label: AI_PROVIDER_LABEL.ollama,
    async suggestNextActions(context) {
      const response = await fetchWithTimeout(OLLAMA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: state.ollamaModel || "llama3.2",
          prompt: buildOllamaSuggestionPrompt(context),
          stream: false,
          format: "json",
          options: {
            temperature: 0.2,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama returned ${response.status}`);
      }

      const payload = await response.json();
      const parsed = parseOllamaSuggestion(payload.response || "");
      const suggestions = parsed.suggestions.length >= 2 ? parsed.suggestions : createLocalSuggestions(context);
      return {
        provider: `${AI_PROVIDER_LABEL.ollama} · ${state.ollamaModel || "llama3.2"}`,
        generatedAt: new Date().toISOString(),
        summary: parsed.summary || summarizeSuggestionContext(context, suggestions),
        suggestions,
      };
    },
  };
}

async function fetchWithTimeout(url, options, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function buildOllamaSuggestionPrompt(context) {
  const { thread, meta, openItems, blockedItems, doneItems } = context;
  const openText = openItems.slice(0, 8).map(formatPromptItem).join("\n");
  const blockedText = blockedItems.slice(0, 5).map(formatPromptItem).join("\n") || "none";
  const doneText = doneItems.slice(-5).map(formatPromptItem).join("\n") || "none";

  return `
You are SeedLog, a local-first productivity assistant for idea growth and project momentum.
Analyze the project/thread context and propose exactly 3 next steps.

Return only valid JSON in this shape:
{
  "summary": "one short Korean sentence",
  "suggestions": [
    {"title": "short Korean title", "action": "specific next action", "why": "short reason"}
  ]
}

Rules:
- Write all user-facing text in natural Korean. Keep existing product names, project codes, and dates as-is.
- Use a calm senior product/project coach tone.
- Titles must be short Korean task labels, not slogans, romanized words, or invented terms.
- Make actions concrete and doable within 30-90 minutes.
- Prefer actions that unblock, create a visible artifact, or clarify success criteria.
- Do not invent external facts.
- Do not mention that you are an AI.
- Avoid emoji, markdown, bullets, and unusual Unicode characters.

Thread title: ${thread.title}
Stage: ${thread.stage}
Project no: ${meta.projectNo || "none"}
Goal: ${meta.goal || "none"}
Target date: ${meta.targetDate || "none"}
Milestone: ${meta.milestone || "none"}
Success criteria: ${meta.successCriteria || "none"}
Notes: ${meta.notes || "none"}

Open items:
${openText || "none"}

Blocked items:
${blockedText}

Recently done:
${doneText}
`.trim();
}

function formatPromptItem(item) {
  return `- [${item.lane}/${item.importance}/${item.momentum}] ${item.date}: ${item.text}`;
}

function parseOllamaSuggestion(text) {
  const fallback = { summary: "", suggestions: [] };
  try {
    const parsed = JSON.parse(text);
    return normalizeProviderSuggestion(parsed);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;
    try {
      return normalizeProviderSuggestion(JSON.parse(jsonMatch[0]));
    } catch {
      return fallback;
    }
  }
}

function normalizeProviderSuggestion(parsed) {
  const suggestions = Array.isArray(parsed?.suggestions)
    ? parsed.suggestions
        .map((item) => ({
          title: cleanField(item.title).slice(0, 80),
          action: cleanField(item.action).slice(0, 260),
          why: cleanField(item.why).slice(0, 180),
        }))
        .filter((item) => item.title && item.action)
        .filter((item) => isReadableProviderText(`${item.title} ${item.action} ${item.why}`))
        .slice(0, 3)
    : [];
  return {
    summary: cleanReadableProviderField(parsed?.summary).slice(0, 220),
    suggestions,
  };
}

function cleanReadableProviderField(value) {
  const text = cleanField(value);
  return isReadableProviderText(text) ? text : "";
}

function isReadableProviderText(text) {
  if (!text) return true;
  return !/[^\u0009\u000A\u000D\u0020-\u007E\u3131-\u318E\uAC00-\uD7A3]/u.test(text);
}

function createLocalSuggestions(context) {
  const { meta, openItems, blockedItems } = context;
  const suggestions = [];
  const priorityItems = [...openItems].sort((a, b) => prioritySort(a, b));
  const nextMilestoneItem = priorityItems.find((item) => item.lane === "build") || priorityItems[0];
  const highItem = priorityItems.find((item) => ["high", "critical"].includes(item.importance));

  if (blockedItems.length) {
    suggestions.push({
      title: `병목 1개를 질문으로 바꾸기`,
      action: blockedItems[0].text,
      why: "막힌 항목은 계속 들고 있기보다 정보/결정/도움 요청 중 하나로 바꿀 때 움직여요.",
    });
  }

  if (nextMilestoneItem) {
    suggestions.push({
      title: "30분짜리 다음 산출물 만들기",
      action: nextMilestoneItem.text,
      why: meta.milestone
        ? "Project Brief의 milestone과 가장 가까운 실행 항목이에요."
        : "현재 thread에서 가장 실행 가능한 열린 항목이에요.",
    });
  }

  if (highItem && highItem.id !== nextMilestoneItem?.id) {
    suggestions.push({
      title: "중요 항목을 첫 집중으로 올리기",
      action: highItem.text,
      why: "중요도가 높은 항목은 Today에서 먼저 잡아야 월말 회고의 전환율이 좋아져요.",
    });
  }

  if (meta.successCriteria) {
    suggestions.push({
      title: "성공기준으로 체크포인트 만들기",
      action: meta.successCriteria,
      why: "성공기준이 있으면 다음 행동이 산출물 중심으로 좁혀져요.",
    });
  }

  if (meta.targetDate) {
    suggestions.push({
      title: "Target date 기준으로 이번 주 범위 자르기",
      action: `${meta.targetDate}까지 가려면 이번 주에 확인 가능한 checkpoint 1개를 정하기`,
      why: "마감이 있는 프로젝트는 지금 할 행동과 나중에 할 행동을 분리해야 부담이 줄어요.",
    });
  }

  if (!suggestions.length) {
    suggestions.push({
      title: "씨앗을 액션으로 바꾸기",
      action: "이 thread에서 30분 안에 확인할 수 있는 가장 작은 실험 1개 작성",
      why: "아직 열린 실행 항목이 부족해서, 먼저 행동 단위를 만들어야 해요.",
    });
  }

  return uniqueSuggestionList(suggestions).slice(0, 3);
}

function uniqueSuggestionList(suggestions) {
  return [...new Map(suggestions.map((item) => [`${item.title}:${item.action}`, item])).values()];
}

function summarizeSuggestionContext(context, suggestions) {
  const { thread, meta, openItems, blockedItems } = context;
  const target = meta.targetDate ? ` target ${meta.targetDate}` : "";
  const project = meta.projectNo ? `${meta.projectNo} ` : "";
  return `${project}${thread.title}${target}: ${openItems.length} open, ${blockedItems.length} blocked 기준으로 ${suggestions.length}개 next step을 골랐어요.`;
}

async function suggestReflectionCoach(scope, key) {
  const context = buildReflectionCoachContext(scope, key);
  if (!context) return;

  const providerLabel = AI_PROVIDER_LABEL[state.aiProviderKind] || AI_PROVIDER_LABEL.rules;
  setToast(`${providerLabel} reflection coach 생성 중...`);
  render();

  let coach;
  try {
    coach =
      state.aiProviderKind === "ollama"
        ? await createOllamaReflectionCoach(context)
        : createLocalReflectionCoach(context, providerLabel);
  } catch (error) {
    console.warn("Reflection coach failed", error);
    coach = {
      ...createLocalReflectionCoach(context, `${providerLabel} fallback`),
      summary: `연결에 실패해서 Local Rules로 회고 코치를 만들었어요.`,
      error: true,
    };
  }

  state.reflectionCoaches = {
    ...state.reflectionCoaches,
    [reflectionCoachKey(scope, key)]: coach,
  };
  saveUiState();
  setToast("reflection coach를 만들었어요.");
  render();
}

function buildReflectionCoachContext(scope, key) {
  const threads = buildThreads(state.items);
  if (scope === "daily") {
    const wrap = buildDailyWrapUp(key, state.items, threads);
    return {
      scope,
      key,
      title: `${key} 하루 회고`,
      review: getDailyReview(key),
      metrics: {
        total: wrap.dayItems.length,
        done: wrap.done.length,
        open: wrap.open.length,
        blocked: wrap.blocked.length,
        completionRate: wrap.completionRate,
        highLeverage: wrap.highLeverage.length,
        ideas: wrap.ideas.length,
      },
      signals: wrap.prompts,
      items: wrap.dayItems,
      projects: wrap.projectThreads.map((thread) => thread.title),
      nextAction: wrap.tomorrowPrimary?.item?.text || "",
    };
  }

  if (scope === "monthly") {
    const review = buildMonthlyReview(state.items, threads);
    const reflection = getMonthlyReflection(key);
    return {
      scope,
      key,
      title: `${key} 월간 회고`,
      review: reflection,
      metrics: {
        total: review.monthItems.length,
        done: review.doneCount,
        blocked: review.blocked.length,
        completionRate: review.completionRate,
        actionConversionRate: review.actionConversionRate,
        highLeverageDoneRate: review.highLeverageDoneRate,
      },
      signals: [...buildMonthlyConclusionLines(review), ...review.improvements, ...review.reflectionPrompts].slice(0, 8),
      items: review.monthItems,
      projects: review.projectPulse.map(({ thread, meta }) => `${meta.projectNo ? `${meta.projectNo} · ` : ""}${thread.title}`),
      nextAction: review.nudges[0] || "",
    };
  }

  return null;
}

function createLocalReflectionCoach(context, provider = AI_PROVIDER_LABEL.rules) {
  const observations = [];
  const questions = [];
  const { metrics, review } = context;

  if (!metrics.total) {
    observations.push("아직 기록량이 적어서 패턴보다 입력 습관을 먼저 보는 게 좋아요.");
    questions.push("오늘 또는 이번 달에 남기고 싶은 가장 작은 흔적은 무엇인가요?");
  } else if (metrics.completionRate >= 60) {
    observations.push(`완료 전환 ${metrics.completionRate}%로 실행 리듬이 살아 있어요.`);
    questions.push("이번 리듬을 만든 환경이나 순서는 무엇이었나요?");
  } else {
    observations.push(`완료 전환 ${metrics.completionRate}%라서 항목 단위가 조금 클 수 있어요.`);
    questions.push("열린 항목 중 30분 안에 끝낼 수 있게 다시 쓸 수 있는 것은 무엇인가요?");
  }

  if (metrics.blocked) {
    observations.push(`막힌 항목 ${metrics.blocked}개가 보여요. 할 일보다 질문/요청/결정으로 바꾸면 좋아요.`);
    questions.push("막힘의 원인은 정보 부족, 결정 지연, 에너지 부족 중 어디에 가장 가까운가요?");
  }
  if (context.projects.length) {
    observations.push(`프로젝트 흐름은 ${context.projects[0]} 쪽으로 모이고 있어요.`);
  }
  if (review?.friction) {
    observations.push("직접 적은 마찰이 있으니 다음 조정은 그 한 가지에서 시작하는 게 좋아요.");
  }
  if (review?.worked) {
    questions.push("효율이 좋았던 방식을 다음 주에도 반복하려면 어떤 트리거가 필요할까요?");
  }

  return normalizeReflectionCoach({
    provider,
    generatedAt: new Date().toISOString(),
    summary: reflectionCoachSummary(context),
    observations,
    questions,
    experiment: context.nextAction || "내일 첫 30분은 열린 항목 하나를 더 작게 쪼개는 데 써보세요.",
  });
}

function reflectionCoachSummary(context) {
  if (!context.metrics.total) return "기록을 시작하기 위한 아주 작은 다음 행동이 먼저예요.";
  if (context.metrics.blocked) return "지금은 더 많이 하기보다 막힘을 명확한 질문으로 바꾸는 게 우선이에요.";
  if (context.metrics.completionRate >= 60) return "실행 리듬은 좋고, 이제 반복 가능한 방식을 이름 붙이면 좋아요.";
  return "열린 항목을 더 작은 산출물 단위로 줄이면 흐름이 좋아질 수 있어요.";
}

async function createOllamaReflectionCoach(context) {
  const response = await fetchWithTimeout(OLLAMA_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: state.ollamaModel || "llama3.2",
      prompt: buildOllamaReflectionPrompt(context),
      stream: false,
      format: "json",
      options: {
        temperature: 0.25,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const payload = await response.json();
  const parsed = parseOllamaReflectionCoach(payload.response || "");
  const fallback = createLocalReflectionCoach(context, `${AI_PROVIDER_LABEL.ollama} fallback`);
  return normalizeReflectionCoach({
    ...fallback,
    ...parsed,
    provider: `${AI_PROVIDER_LABEL.ollama} · ${state.ollamaModel || "llama3.2"}`,
    generatedAt: new Date().toISOString(),
  });
}

function buildOllamaReflectionPrompt(context) {
  const reviewText = Object.entries(context.review || {})
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n") || "none";
  const itemsText = context.items.slice(0, 12).map(formatPromptItem).join("\n") || "none";
  const signalsText = context.signals.join("\n") || "none";
  const projectsText = context.projects.join(", ") || "none";

  return `
You are SeedLog Reflection Coach, a calm Korean productivity coach.
Read the user's daily/monthly review and produce concise coaching feedback.

Return only valid JSON:
{
  "summary": "one short Korean sentence",
  "observations": ["2-3 Korean observations"],
  "questions": ["2 Korean reflection questions"],
  "experiment": "one concrete 30-90 minute experiment"
}

Rules:
- Write in natural Korean.
- Be specific, kind, and practical.
- Do not overpraise. Name one useful pattern and one adjustment.
- Do not invent external facts.
- Do not mention AI, model, JSON, or the prompt.
- Avoid markdown, bullets, emoji, and unusual Unicode.

Scope: ${context.scope}
Title: ${context.title}
Metrics: ${JSON.stringify(context.metrics)}
Projects: ${projectsText}
Review notes:
${reviewText}

Signals:
${signalsText}

Items:
${itemsText}
`.trim();
}

function parseOllamaReflectionCoach(text) {
  try {
    return normalizeReflectionCoach(JSON.parse(text));
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {};
    try {
      return normalizeReflectionCoach(JSON.parse(jsonMatch[0]));
    } catch {
      return {};
    }
  }
}

function normalizeReflectionCoach(value) {
  return {
    provider: cleanReadableProviderField(value?.provider) || AI_PROVIDER_LABEL.rules,
    generatedAt: value?.generatedAt || new Date().toISOString(),
    summary: cleanReadableProviderField(value?.summary).slice(0, 220),
    observations: normalizeCoachList(value?.observations, 3),
    questions: normalizeCoachList(value?.questions, 2),
    experiment: cleanReadableProviderField(value?.experiment).slice(0, 260),
    error: Boolean(value?.error),
  };
}

function normalizeCoachList(value, limit) {
  return Array.isArray(value)
    ? value
        .map((item) => cleanReadableProviderField(item).slice(0, 220))
        .filter(Boolean)
        .slice(0, limit)
    : [];
}

function reflectionCoachKey(scope, key) {
  return `${scope}:${key}`;
}

function exportData() {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          items: state.items,
          threadOverrides: state.threadOverrides,
          projectMeta: state.projectMeta,
          monthlyReflections: state.monthlyReflections,
          dailyReviews: state.dailyReviews,
          goals: state.goals,
          reflectionCoaches: state.reflectionCoaches,
          learningTracks: state.learningTracks,
          learningSessions: state.learningSessions,
          learningWeeklyHours: state.learningWeeklyHours,
          learningReviewDone: state.learningReviewDone,
        },
        null,
        2,
      ),
    ],
    {
    type: "application/json",
    },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `seedlog-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      const incoming = Array.isArray(parsed.items) ? parsed.items : [];
      const byId = new Map(state.items.map((item) => [item.id, item]));
      for (const item of incoming) {
        if (item.id && item.text && item.date) {
          byId.set(item.id, normalizeImportedItem(item));
        }
      }
      state.items = [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      state.threadOverrides = {
        ...state.threadOverrides,
        ...(parsed.threadOverrides || {}),
      };
      state.projectMeta = {
        ...state.projectMeta,
        ...(parsed.projectMeta || {}),
      };
      state.monthlyReflections = {
        ...state.monthlyReflections,
        ...(parsed.monthlyReflections || {}),
      };
      state.dailyReviews = normalizeDailyReviews({
        ...state.dailyReviews,
        ...(parsed.dailyReviews || {}),
      });
      state.reflectionCoaches = {
        ...state.reflectionCoaches,
        ...(parsed.reflectionCoaches || {}),
      };
      state.learningTracks = normalizeLearningTracks(parsed.learningTracks);
      state.learningSessions = normalizeLearningSessions(parsed.learningSessions);
      state.learningWeeklyHours = Number(parsed.learningWeeklyHours || state.learningWeeklyHours || 12);
      state.learningReviewDone = parsed.learningReviewDone || state.learningReviewDone || {};
      await repository.saveItems(state.items);
      for (const [threadId, override] of Object.entries(state.threadOverrides)) {
        if (override?.title) await repository.saveThreadOverride(threadId, override.title);
      }
      for (const [threadId, meta] of Object.entries(state.projectMeta)) {
        await repository.saveProjectMeta(threadId, meta);
      }
      for (const [monthKey, reflection] of Object.entries(state.monthlyReflections)) {
        await repository.saveMonthlyReflection(monthKey, reflection);
      }
      for (const [dateKey, review] of Object.entries(state.dailyReviews)) {
        await repository.saveDailyReview(dateKey, review);
      }
      saveUiState();
      setToast(`${incoming.length}개 항목을 가져왔어요.`);
      render();
    } catch {
      setToast("가져오기에 실패했어요.");
    }
  };
  reader.readAsText(file);
}

function normalizeImportedItem(item) {
  return normalizeItem({
    id: item.id,
    text: item.text,
    date: item.date,
    status: item.status || "open",
    createdAt: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
    completedAt: item.completedAt || item.completed_at || null,
    context: item.context,
    timeBlock: item.timeBlock,
    dailyPriority: item.dailyPriority,
  });
}

function render() {
  if (isMobileView()) {
    renderMobile();
    return;
  }
  const validViews = new Set(["daily", "wrapup", "thread", "threads", "ideas", "projects", "learning", "board", "monthly", "weekly"]);
  if (!validViews.has(state.selectedView)) {
    state.selectedView = "daily";
  }
  if (state.selectedView === "focus") {
    state.selectedView = "daily";
  }
  const app = document.querySelector("#app");
  const threads = buildThreads(state.items);
  const summary = summarize(state.items, threads);
  const selectedItems = state.items.filter((item) => item.date === state.selectedDate);
  const selectedThread = threads.find((thread) => thread.id === state.selectedThreadId);
  const layoutClass = getLayoutClass(state.selectedView);

  // Error boundary: a single view renderer throwing must not blank the whole app
  // (topbar/sidebar stay usable so the user can navigate away). The monthly-review
  // crash — a deleted helper — is exactly the failure this contains.
  let workspaceHtml;
  try {
    workspaceHtml =
      state.selectedView === "daily"
        ? renderDaily(selectedItems, threads)
        : state.selectedView === "wrapup"
        ? renderDailyWrapUp(threads)
        : state.selectedView === "thread"
          ? renderThreadDetail(selectedThread, threads)
        : state.selectedView === "threads"
          ? renderThreads(threads)
        : state.selectedView === "ideas"
          ? renderIdeas(threads)
        : state.selectedView === "projects"
          ? renderProjectDashboard(threads)
        : state.selectedView === "learning"
          ? renderLearningDashboard(threads)
          : state.selectedView === "board"
            ? renderBoard(threads)
          : state.selectedView === "weekly"
            ? renderWeeklyReview()
            : renderMonthly(threads);
  } catch (err) {
    console.error(`render: "${state.selectedView}" 뷰 렌더 실패`, err);
    workspaceHtml = `
      <div class="view-error">
        <h2>이 화면을 그리는 중 문제가 생겼어요</h2>
        <p class="muted">다른 탭은 정상이에요. 아래로 돌아가서 계속 쓰실 수 있어요.</p>
        <pre class="view-error-detail">${escapeHtml(String(err && err.stack ? err.stack : err))}</pre>
        <button class="primary-button" data-view="daily">Today로 돌아가기</button>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="shell">
      ${renderTopbar()}
      <main class="layout ${layoutClass}">
        ${renderSidebar(summary, threads)}
        <section class="workspace">
          ${workspaceHtml}
        </section>
        ${renderInspector()}
      </main>
      ${renderUndoBar()}
    </div>
    <input class="hidden-file" id="import-file" type="file" accept="application/json" />
  `;

  bindEvents();
}

function renderUndoBar() {
  if (!lastDeletedItem) return "";
  const text = String(lastDeletedItem.text || "항목").replace(/^\[(학습|신호)\]\s*/, "");
  const short = text.length > 28 ? `${text.slice(0, 27)}…` : text;
  return `
    <div class="undo-bar" role="status">
      <span class="undo-text">삭제됨 · ${escapeHtml(short)}</span>
      <button class="undo-btn" data-undo-delete>되돌리기</button>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile view (phone / Android) — dedicated single-column shell that shares the
// desktop data layer (state, repository, item/idea actions). Activated below a
// width breakpoint or on a touch-first viewport. v1 scope: Today + 아이디어.
// ─────────────────────────────────────────────────────────────────────────────

const MOBILE_BREAKPOINT = 600;
const MOBILE_BLOCK_SHORT = { morning: "오전 · 09–12", workday: "오후 · 12–18", evening: "저녁 · 18–24" };
let _mobileMql = null;
let _openSwipeId = null;

function isMobileView() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

// Re-render when crossing the breakpoint so the correct shell loads.
function watchMobileBreakpoint() {
  if (_mobileMql || typeof window === "undefined") return;
  _mobileMql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const onChange = () => render();
  if (_mobileMql.addEventListener) _mobileMql.addEventListener("change", onChange);
  else _mobileMql.addListener(onChange);
}

function formatMobileDate(key) {
  const [y, m, d] = String(key).split("-").map(Number);
  if (!y || !m || !d) return key;
  const date = new Date(y, m - 1, d);
  const dow = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const todayTag = key === getTodayKey() ? " · 오늘" : "";
  return `${m}월 ${d}일 (${dow})${todayTag}`;
}

function renderMobile() {
  watchMobileBreakpoint();
  if (!["today", "cultivate", "idea"].includes(state.mobileTab)) state.mobileTab = "today";
  const app = document.querySelector("#app");
  // Same crash containment as desktop render(): one bad sub-renderer must not
  // white-screen the phone — this is the primary satellite-capture surface.
  let body;
  try {
    body = state.mobileWrapup
      ? renderMobileWrapup()
      : state.mobileTab === "idea"
        ? renderMobileIdea()
        : state.mobileTab === "cultivate"
          ? renderMobileCultivate()
          : renderMobileToday();
  } catch (err) {
    console.error(`renderMobile: "${state.mobileTab}" 탭 렌더 실패`, err);
    state.mobileWrapup = false;
    body = `
      <div class="view-error">
        <h2>이 화면을 그리는 중 문제가 생겼어요</h2>
        <p class="muted">다른 탭은 정상이에요.</p>
        <pre class="view-error-detail">${escapeHtml(String(err && err.stack ? err.stack : err))}</pre>
        <button class="primary-button" data-mtab="today">Today로 돌아가기</button>
      </div>
    `;
  }
  app.innerHTML = `
    <div class="m-shell">
      ${renderMobileTopbar()}
      <main class="m-content">
        ${body}
      </main>
      ${renderMobileTabbar()}
      ${!state.mobileWrapup && !state.mobileCapture ? `<button class="m-fab" data-mcapture-open aria-label="빠른 캡처">＋</button>` : ""}
      ${state.mobileCapture ? renderMobileCapture() : ""}
      ${syncModalOpen ? renderSyncModal() : ""}
      ${renderUndoBar()}
      ${state.toast ? `<div class="m-toast">${escapeHtml(state.toast)}</div>` : ""}
    </div>
  `;
  bindMobileEvents();
}

function renderMobileTopbar() {
  if (state.mobileWrapup) {
    return `
      <header class="m-topbar m-topbar-row">
        <button class="m-back" data-mwrapup-close aria-label="뒤로">←</button>
        <div class="m-topbar-titlewrap">
          <div class="m-topbar-title">하루 마감</div>
          <div class="m-topbar-sub">${formatMobileDate(state.selectedDate)}</div>
        </div>
      </header>
    `;
  }
  const isToday = state.mobileTab === "today";
  const title = { today: "Today", cultivate: "재배", idea: "아이디어" }[state.mobileTab] || "Today";
  return `
    <header class="m-topbar m-topbar-row">
      <div class="m-topbar-titlewrap">
        <div class="m-topbar-title">${title}</div>
        ${isToday ? `<div class="m-topbar-sub">${formatMobileDate(state.selectedDate)}</div>` : ""}
      </div>
      <button class="m-topbar-sync sync-${syncStatus}${syncConfigured() ? "" : " sync-unset"}" data-action="sync-open" aria-label="동기화">${syncStatus === "syncing" ? "⟳" : "☁"}</button>
      ${isToday ? `<button class="m-topbar-action" data-mwrapup-open>하루 마감</button>` : ""}
    </header>
  `;
}

function renderMobileTabbar() {
  const tab = state.mobileTab;
  const t = (key, icon, label) =>
    `<button class="m-tab ${tab === key ? "active" : ""}" data-mtab="${key}">
       <span class="m-tab-icon">${icon}</span><span class="m-tab-label">${label}</span>
     </button>`;
  return `
    <nav class="m-tabbar m-tabbar-3" aria-label="tabs">
      ${t("today", "✓", "Today")}
      ${t("cultivate", "🌱", "재배")}
      ${t("idea", "💡", "아이디어")}
    </nav>
  `;
}

function renderMobileToday() {
  const items = state.items
    .filter((it) => it.type !== "idea" && it.date === state.selectedDate)
    .sort((a, b) => {
      const ao = TIME_BLOCK_ORDER.indexOf(a.timeBlock);
      const bo = TIME_BLOCK_ORDER.indexOf(b.timeBlock);
      if (ao !== bo) return ao - bo;
      return (a.manualOrder || 0) - (b.manualOrder || 0);
    });

  let list = "";
  if (!items.length) {
    list = `<div class="m-empty">오늘 할 일이 아직 없어요.<br/>아래에서 추가해 보세요.</div>`;
  } else {
    let lastBlock = null;
    items.forEach((item) => {
      if (item.timeBlock !== lastBlock) {
        lastBlock = item.timeBlock;
        list += `<div class="m-section">${MOBILE_BLOCK_SHORT[item.timeBlock] ?? item.timeBlock}</div>`;
      }
      list += renderMobileTodayCard(item);
    });
  }

  return `
    <div class="m-today">${list}</div>
    <form class="m-quickadd" data-mquickadd="today">
      <input class="m-quickadd-input" type="text" placeholder="오늘 할 일 추가…" data-mquickadd-input="today" autocomplete="off" />
      <button class="m-quickadd-btn" type="submit" aria-label="추가">+</button>
    </form>
  `;
}

function renderMobileTodayCard(item) {
  const ctx = CONTEXT_ICON[item.context] ?? "";
  return `
    <article class="m-card ${item.status}" data-mcard="${item.id}">
      <div class="m-card-actions">
        <button class="m-swipe-btn seed ${item.pipeline ? "on" : ""}" data-mseed="${item.id}" aria-label="씨앗으로 보내기">🌱</button>
        <button class="m-swipe-btn del" data-mdelete="${item.id}" aria-label="삭제">🗑</button>
      </div>
      <div class="m-card-main" data-mcard-main="${item.id}">
        <button class="m-check ${item.status}" data-mcycle="${item.id}" aria-label="상태 변경"></button>
        <div class="m-card-text">${escapeHtml(item.text)}</div>
        ${ctx ? `<span class="m-ctx ctx-${item.context}">${ctx}</span>` : ""}
      </div>
    </article>
  `;
}

// Next stage in the cultivation flow (씨앗→구체화→개발). Support lanes funnel
// back into 씨앗. build(개발) has no next stage → it is ready to execute (오늘로).
function mobileNextLane(lane) {
  return { now: "next", next: "build", invest: "now", someday: "now" }[lane] || null;
}

function renderMobileCultivate() {
  const open = state.items.filter((it) => it.pipeline && it.status !== "done");
  const now = Date.now();
  const DAY = 86400000;

  let body = "";
  if (!open.length) {
    body = `<div class="m-empty">재배 중인 씨앗이 없어요.<br/>Today에서 카드를 왼쪽으로 밀어<br/>🌱 씨앗으로 보내보세요.</div>`;
  } else {
    Object.keys(LANE_LABEL).forEach((lane) => {
      const inLane = open
        .filter((it) => it.lane === lane)
        .sort((a, b) => new Date(a.laneMovedAt || a.createdAt) - new Date(b.laneMovedAt || b.createdAt));
      if (!inLane.length) return;
      body += `<div class="m-section">${LANE_LABEL[lane]} · ${inLane.length}</div>`;
      inLane.forEach((item) => {
        const days = Math.max(0, Math.floor((now - new Date(item.laneMovedAt || item.createdAt).getTime()) / DAY));
        const warn = days >= (LANE_WARN_THRESHOLD[lane] ?? 99);
        const next = mobileNextLane(lane);
        const pill = next
          ? `<button class="m-cult-advance" data-madvance="${item.id}|${next}">${LANE_LABEL[next]} →</button>`
          : `<button class="m-cult-advance ready" data-mpull="${item.id}">오늘로 ↓</button>`;
        body += `
          <article class="m-cult-card">
            <div class="m-cult-info">
              <div class="m-cult-text">${escapeHtml(item.text)}</div>
              <div class="m-cult-age ${warn ? "warn" : ""}">${days === 0 ? "오늘" : `${days}일째`}</div>
            </div>
            ${pill}
          </article>`;
      });
    });
  }

  return `<div class="m-cult">${body}</div>`;
}

function renderMobileIdea() {
  const ideas = state.items
    .filter((it) => it.type === "idea")
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  let list = "";
  if (!ideas.length) {
    list = `<div class="m-empty">아이디어가 아직 없어요.<br/>떠오른 생각을 적어보세요.</div>`;
  } else {
    list = ideas.map(renderMobileIdeaCard).join("");
  }

  return `
    <form class="m-quickadd m-quickadd-idea" data-mideaadd="1">
      <input class="m-quickadd-input" type="text" placeholder="새 아이디어…" data-mideaadd-input="1" autocomplete="off" />
      <button class="m-quickadd-btn" type="submit" aria-label="추가">+</button>
    </form>
    <div class="m-idea-list">${list}</div>
  `;
}

function renderMobileIdeaCard(idea) {
  const expanded = expandedIdeaIds.has(idea.id);
  const subs = Array.isArray(idea.subItems) ? idea.subItems : [];
  const doneCount = subs.filter((s) => s.done).length;
  const linkedProject = state.projects.find((p) => p.sourceIdeaId === idea.id);
  return `
    <article class="m-idea ${expanded ? "open" : ""}" data-midea="${idea.id}">
      <button class="m-idea-head" data-midea-toggle="${idea.id}">
        <span class="m-idea-title">${escapeHtml(idea.text)}</span>
        <span class="m-idea-meta">${subs.length ? `${doneCount}/${subs.length}` : ""}<span class="m-idea-caret">${expanded ? "▾" : "▸"}</span></span>
      </button>
      ${
        expanded
          ? `<div class="m-idea-body">
        ${
          subs.length
            ? `<ul class="m-idea-subs">${subs
                .map(
                  (s) => `<li class="m-idea-sub ${s.done ? "done" : ""}">
                    <button class="m-subcheck ${s.done ? "done" : ""}" data-midea-sub="${idea.id}|${s.id}" aria-label="완료 토글"></button>
                    <span>${escapeHtml(s.text)}</span>
                  </li>`,
                )
                .join("")}</ul>`
            : `<div class="m-idea-empty">세부 항목이 없어요.</div>`
        }
        <form class="m-idea-subadd" data-midea-subadd="${idea.id}">
          <input type="text" placeholder="세부 항목 추가…" data-midea-subadd-input="${idea.id}" autocomplete="off" />
        </form>
        <div class="m-idea-actions">
          ${
            linkedProject
              ? `<span class="m-idea-badge">프로젝트화됨</span>`
              : `<button class="m-idea-promote" data-midea-promote="${idea.id}">프로젝트로 만들기 →</button>`
          }
          <button class="m-idea-del" data-mdelete="${idea.id}">삭제</button>
        </div>
      </div>`
          : ""
      }
    </article>
  `;
}

function renderMobileWrapup() {
  const date = state.selectedDate;
  const threads = buildThreads(state.items);
  const wrap = buildDailyWrapUp(date, state.items, threads);
  const review = getDailyReview(date);
  const total = wrap.done.length + wrap.open.length;
  const energyPill = (val, label) =>
    `<label class="m-energy-pill"><input type="radio" name="energy" value="${val}" ${review.energy === val ? "checked" : ""}/>${label}</label>`;
  return `
    <form class="m-wrapup" data-mwrapup="${date}">
      <div class="m-wrap-summary">
        <div class="m-wrap-pct">${wrap.completionRate}%</div>
        <div class="m-wrap-meta">${wrap.done.length} / ${total} 완료${wrap.open.length ? ` · ${wrap.open.length} 남음` : ""}</div>
      </div>
      ${
        wrap.tomorrowPrimary
          ? `<div class="m-wrap-suggest">🎯 내일 1순위 추천<br/><strong>${escapeHtml(wrap.tomorrowPrimary.item.text)}</strong></div>`
          : ""
      }
      <label class="m-wrap-field">
        <span>오늘의 승리</span>
        <textarea name="win" rows="2" placeholder="오늘 잘한 것 한 가지">${escapeHtml(review.win)}</textarea>
      </label>
      <label class="m-wrap-field">
        <span>내일 한 가지</span>
        <textarea name="tomorrow" rows="2" placeholder="내일 가장 중요한 한 가지">${escapeHtml(review.tomorrow)}</textarea>
      </label>
      <div class="m-wrap-field">
        <span>에너지</span>
        <div class="m-energy">${energyPill("low", "낮음")}${energyPill("normal", "보통")}${energyPill("high", "높음")}</div>
      </div>
      <input type="hidden" name="friction" value="${escapeHtml(review.friction)}" />
      <input type="hidden" name="learned" value="${escapeHtml(review.learned)}" />
      <button type="submit" class="m-wrap-save">저장</button>
    </form>
  `;
}

const MOBILE_CAPTURE_PLACEHOLDER = { task: "오늘 할 일…", idea: "떠오른 생각…", seed: "키울 씨앗…" };

function renderMobileCapture() {
  const target = state.mobileCaptureTarget || "task";
  const seg = (val, label) =>
    `<button type="button" class="m-cap-seg ${target === val ? "on" : ""}" data-mcapture-target="${val}">${label}</button>`;
  return `
    <div class="m-cap-backdrop" data-mcapture-close></div>
    <div class="m-cap-sheet">
      <div class="m-cap-segs">${seg("task", "할 일")}${seg("idea", "아이디어")}${seg("seed", "🌱 씨앗")}</div>
      <form class="m-cap-form" data-mcapture-form>
        <input class="m-cap-input" type="text" placeholder="${MOBILE_CAPTURE_PLACEHOLDER[target]}" data-mcapture-input autocomplete="off" />
        <button class="m-cap-submit" type="submit">담기</button>
      </form>
    </div>
  `;
}

// Quick-capture straight into the cultivation pipeline at 씨앗 (now).
async function captureSeed(rawText, opts = {}) {
  const text = String(rawText || "").trim();
  if (!text) return;
  const now = new Date().toISOString();
  const analyzed = analyzeItem(text);
  const item = {
    id: uid("item"),
    text,
    date: getTodayKey(),
    status: "open",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    manualOrder: Date.now(),
    context: "company",
    timeBlock: currentTimeBlockKey(),
    dailyPriority: "secondary",
    ...analyzed,
    type: "task",
    pipeline: true,
    lane: "now",
    laneMovedAt: now,
    lastForwardAt: null,
    subItems: [],
    sourceTag: opts.sourceTag || null,
  };
  state.items = [item, ...state.items];
  await repository.upsertItems([item]);
  setToast("🌱 씨앗으로 담았어요 · 재배 탭에서 키우세요");
  saveUiState();
  render();
}

async function addQuickIdea(rawTitle) {
  const title = String(rawTitle || "").trim();
  if (!title) return;
  const now = new Date().toISOString();
  const analyzed = analyzeItem(title);
  const idea = {
    id: uid("idea"),
    text: title,
    subItems: [],
    date: getTodayKey(),
    status: "open",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    ...analyzed,
    type: "idea",
    horizon: analyzed.horizon === "today" ? "short" : analyzed.horizon,
    lane: "someday",
    importance: "normal",
    momentum: "seed",
    context: "idea",
    timeBlock: currentTimeBlockKey(),
    dailyPriority: "parking",
  };
  state.items = [idea, ...state.items];
  expandedIdeaIds.add(idea.id);
  await repository.upsertItems([idea]);
  setToast("아이디어를 담았어요.");
  saveUiState();
  render();
}

function bindMobileEvents() {
  document.querySelector("[data-undo-delete]")?.addEventListener("click", restoreDeletedItem);

  document.querySelector("[data-action='sync-open']")?.addEventListener("click", () => {
    syncModalOpen = !syncModalOpen;
    render();
  });
  document.querySelectorAll("[data-sync-close]").forEach((el) =>
    el.addEventListener("click", () => {
      syncModalOpen = false;
      render();
    }),
  );
  document.querySelector("[data-sync-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveSyncConfig(event.currentTarget);
  });
  document.querySelector("[data-sync-now]")?.addEventListener("click", syncNow);

  document.querySelectorAll("[data-mtab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeMobileSwipe();
      state.mobileWrapup = false;
      state.mobileCapture = false;
      state.mobileTab = btn.dataset.mtab;
      saveUiState();
      render();
    });
  });

  document.querySelectorAll("[data-mcycle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      cycleTodayItemStatus(btn.dataset.mcycle);
    });
  });
  document.querySelectorAll("[data-mseed]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      sendItemToCultivation(btn.dataset.mseed);
    });
  });
  document.querySelectorAll("[data-mdelete]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteItem(btn.dataset.mdelete);
    });
  });

  document.querySelectorAll("[data-mquickadd]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector("[data-mquickadd-input]");
      if (!input || !input.value.trim()) return;
      await addInlineBlockItem(currentTimeBlockKey() || "workday", input.value);
    });
  });
  document.querySelectorAll("[data-mideaadd]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector("[data-mideaadd-input]");
      if (!input) return;
      await addQuickIdea(input.value);
    });
  });

  document.querySelectorAll("[data-midea-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => toggleIdeaExpand(btn.dataset.mideaToggle));
  });
  document.querySelectorAll("[data-midea-sub]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [ideaId, subId] = btn.dataset.mideaSub.split("|");
      toggleIdeaSubItem(ideaId, subId);
    });
  });
  document.querySelectorAll("[data-midea-subadd]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector("[data-midea-subadd-input]");
      if (!input || !input.value.trim()) return;
      await addIdeaSubItem(form.dataset.mideaSubadd, input.value);
    });
  });
  document.querySelectorAll("[data-midea-promote]").forEach((btn) => {
    btn.addEventListener("click", () => promoteIdeaTopic(btn.dataset.mideaPromote));
  });

  document.querySelectorAll("[data-madvance]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const [id, lane] = btn.dataset.madvance.split("|");
      updateItemField(id, "lane", lane);
    });
  });
  document.querySelectorAll("[data-mpull]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      pullItemToToday(btn.dataset.mpull);
    });
  });

  // 하루 마감 (A-2)
  document.querySelectorAll("[data-mwrapup-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeMobileSwipe();
      state.mobileWrapup = true;
      render();
    });
  });
  document.querySelectorAll("[data-mwrapup-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mobileWrapup = false;
      render();
    });
  });
  document.querySelectorAll("[data-mwrapup]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      state.mobileWrapup = false;
      await saveDailyReview(form.dataset.mwrapup, form);
    });
  });

  // 빠른 캡처 (A-3). Defaults to 씨앗 — Today/아이디어 탭엔 이미 자체 인라인
  // 추가 입력창이 있어서, FAB는 그 둘과 안 겹치는 고유 역할(씨앗 직행)로
  // 열리게 한다. 재배 탭엔 인라인 입력이 아예 없어 여기서도 자연스러운 기본값.
  document.querySelectorAll("[data-mcapture-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mobileCapture = true;
      state.mobileCaptureTarget = "seed";
      render();
    });
  });
  document.querySelectorAll("[data-mcapture-close]").forEach((el) => {
    el.addEventListener("click", () => {
      state.mobileCapture = false;
      render();
    });
  });
  document.querySelectorAll("[data-mcapture-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mobileCaptureTarget = btn.dataset.mcaptureTarget;
      document.querySelectorAll(".m-cap-seg").forEach((s) => s.classList.toggle("on", s === btn));
      const input = document.querySelector("[data-mcapture-input]");
      if (input) input.placeholder = MOBILE_CAPTURE_PLACEHOLDER[state.mobileCaptureTarget] || "";
    });
  });
  document.querySelectorAll("[data-mcapture-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector("[data-mcapture-input]");
      const text = input ? input.value : "";
      if (!text.trim()) return;
      const target = state.mobileCaptureTarget || "task";
      state.mobileCapture = false;
      if (target === "idea") await addQuickIdea(text);
      else if (target === "seed") await captureSeed(text);
      else await addInlineBlockItem(currentTimeBlockKey() || "workday", text);
    });
  });
  if (state.mobileCapture) {
    requestAnimationFrame(() => document.querySelector("[data-mcapture-input]")?.focus());
  }

  bindMobileSwipe();
}

function closeMobileSwipe() {
  _openSwipeId = null;
  document.querySelectorAll(".m-card-main.swiped").forEach((el) => {
    el.classList.remove("swiped");
    el.style.transform = "";
  });
}

function setMobileSwipeOpen(main, id, open) {
  if (open && _openSwipeId && _openSwipeId !== id) closeMobileSwipe();
  main.style.transform = "";
  if (open) {
    main.classList.add("swiped");
    _openSwipeId = id;
  } else {
    main.classList.remove("swiped");
    if (_openSwipeId === id) _openSwipeId = null;
  }
}

// Pointer-based horizontal swipe — works for touch and mouse so it is testable
// in the desktop preview. Reveals the seed/delete actions sitting behind the card.
function bindMobileSwipe() {
  const ACTIONS_W = 108;
  document.querySelectorAll("[data-mcard-main]").forEach((main) => {
    const id = main.dataset.mcardMain;
    let startX = 0, startY = 0, dx = 0, dragging = false, locked = false;

    main.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      startY = e.clientY;
      dx = 0;
      dragging = true;
      locked = false;
      main.style.transition = "none";
    });

    main.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const mdx = e.clientX - startX;
      const mdy = e.clientY - startY;
      if (!locked) {
        if (Math.abs(mdx) < 6 && Math.abs(mdy) < 6) return;
        if (Math.abs(mdx) <= Math.abs(mdy)) {
          dragging = false; // vertical scroll wins
          return;
        }
        locked = true;
        try { main.setPointerCapture(e.pointerId); } catch {}
      }
      const base = main.classList.contains("swiped") ? -ACTIONS_W : 0;
      dx = Math.max(-ACTIONS_W, Math.min(0, base + mdx));
      main.style.transform = `translateX(${dx}px)`;
    });

    const finish = () => {
      if (!dragging) return;
      dragging = false;
      main.style.transition = "";
      if (locked) {
        setMobileSwipeOpen(main, id, dx < -ACTIONS_W / 2);
      }
    };
    main.addEventListener("pointerup", finish);
    main.addEventListener("pointercancel", finish);

    // Tap an open card body to close it.
    main.addEventListener("click", (e) => {
      if (!locked && main.classList.contains("swiped")) {
        e.preventDefault();
        setMobileSwipeOpen(main, id, false);
      }
    });
  });
}

function getLayoutClass(view) {
  return {
    daily: "daily-layout",
    board: "board-layout",
    wrapup: "wrapup-layout",
    ideas: "ideas-layout",
    projects: "projects-layout",
    learning: "learning-layout",
    threads: "signals-layout",
    monthly: "review-layout",
    weekly: "review-layout",
    thread: "thread-layout",
  }[view] || "";
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="brand">
        <img class="brand-logo" src="assets/code_by_noah_logo.png" alt="Code by Noah" />
        <div class="brand-copy">
          <div class="brand-title">SeedLog</div>
          <div class="brand-subtitle">${state.storageMode === "sqlite" ? "SQLite local database" : "Browser local storage"} · ${APP_BUILD}</div>
        </div>
      </div>
      <nav class="nav" aria-label="views">
        ${navButton("daily", "Today")}
        ${navButton("wrapup", "하루 마감")}
        ${navButton("board", "재배")}
        ${navButton("ideas", "아이디어")}
        ${navButton("projects", "프로젝트")}
        ${navButton("learning", "학습")}
        ${navButton("threads", "Signals")}
        ${navButton("monthly", "월간 리뷰")}
      </nav>
      <div class="top-actions">
        <button class="icon-button sync-btn sync-${syncStatus}${syncConfigured() ? "" : " sync-unset"}" data-action="sync-open" title="동기화" aria-label="동기화">${syncStatus === "syncing" ? "⟳" : "☁"}</button>
        <button class="icon-button" data-action="import" title="Import JSON">↥</button>
        <button class="icon-button" data-action="export" title="Export JSON">↧</button>
      </div>
    </header>
    ${syncModalOpen ? renderSyncModal() : ""}
  `;
}

function renderSyncModal() {
  const s = state.sync || {};
  const last = s.lastSyncAt ? new Date(s.lastSyncAt).toLocaleString("ko-KR") : "아직 없음";
  return `
    <div class="sync-backdrop" data-sync-close></div>
    <div class="sync-modal" role="dialog" aria-label="동기화 설정">
      <div class="sync-modal-head">
        <h2>기기 간 동기화</h2>
        <button class="sync-x" data-sync-close aria-label="닫기">✕</button>
      </div>
      <p class="muted">Supabase에 안전하게 동기화해요. 두 기기에 같은 값을 넣으세요. 싱크 키는 길고 비밀스럽게 — 그게 곧 비밀번호예요.</p>
      <form class="sync-form" data-sync-form>
        <label><span>Supabase URL</span><input name="url" type="text" placeholder="https://xxxx.supabase.co" value="${escapeHtml(s.url || "")}" autocomplete="off" /></label>
        <label><span>anon / publishable key</span><input name="anonKey" type="password" placeholder="sb_publishable_… (또는 eyJ…)" value="${escapeHtml(s.anonKey || "")}" autocomplete="off" /></label>
        <label><span>싱크 키 (비밀)</span><input name="syncKey" type="text" placeholder="긴 무작위 문자열" value="${escapeHtml(s.syncKey || "")}" autocomplete="off" /></label>
        <label class="sync-auto-row"><input name="auto" type="checkbox" ${s.auto !== false ? "checked" : ""} /><span>자동 동기화 — 변경 후 잠시 뒤·앱 시작 시·3분마다 조용히</span></label>
        <div class="sync-form-actions">
          <button type="submit" class="small-button">설정 저장</button>
        </div>
      </form>
      <div class="sync-status-row">
        <span class="muted">마지막 동기화: ${escapeHtml(last)}${syncStatus === "error" ? ` · <span class="sync-err">실패: ${escapeHtml(syncError)}</span>` : ""}</span>
        <button class="primary-button" data-sync-now ${syncStatus === "syncing" ? "disabled" : ""}>${syncStatus === "syncing" ? "동기화 중…" : "지금 동기화"}</button>
      </div>
    </div>
  `;
}

function navButton(view, label) {
  const isActive = state.selectedView === view || (state.selectedView === "thread" && view === "threads");
  return `<button class="${isActive ? "active" : ""}" data-view="${view}">${label}</button>`;
}

function renderSidebar(summary, threads) {
  const dayGroups = getRecentDateGroups(state.items.filter((item) => item.type !== "idea"), getTodayKey(), 7);
  return `
    <aside class="panel">
      <section class="panel-section">
        <div class="date-row">
          <label class="date-label" for="selected-date">날짜</label>
          <input type="date" id="selected-date" value="${state.selectedDate}" />
        </div>
      </section>
      <section class="panel-section">
        <div class="stat-row">
          <div class="stat-pill">
            <span class="stat-pill-value">${summary.total}</span>
            <span class="stat-pill-label">items</span>
          </div>
          <div class="stat-pill">
            <span class="stat-pill-value">${summary.completion}%</span>
            <span class="stat-pill-label">done</span>
            <div class="stat-pbar"><div class="stat-pbar-fill" style="width:${summary.completion}%"></div></div>
          </div>
          <div class="stat-pill">
            <span class="stat-pill-value">${threads.length}</span>
            <span class="stat-pill-label">signals</span>
          </div>
          <div class="stat-pill">
            <span class="stat-pill-value">${summary.long}</span>
            <span class="stat-pill-label">long</span>
          </div>
        </div>
      </section>
      <section class="panel-section">
        <div class="section-heading">
          <h2>최근 날짜</h2>
        </div>
        <div class="tl-list">
          ${
            dayGroups.length
              ? dayGroups.map(([date, items]) => {
                  const done = items.filter((item) => item.status === "done").length;
                  const allDone = items.length > 0 && done === items.length;
                  const dateHint = date === addDays(getTodayKey(), 1) ? "내일" : date === getTodayKey() ? "오늘" : "";
                  const doneBadge = allDone
                    ? `<span class="tl-done-chip">전부 완료</span>`
                    : done > 0
                    ? `<span class="tl-done-chip">${done} done</span>`
                    : "";
                  return `
                    <button class="tl-item ${date === state.selectedDate ? "active" : ""}" data-date="${date}">
                      <div class="tl-dot"></div>
                      <div class="tl-content">
                        <div class="tl-date-text">${dateHint ? `${dateHint} · ` : ""}${KoreanDate.format(new Date(`${date}T00:00:00`))}</div>
                        <div class="tl-meta-text">${items.length}개 항목${doneBadge}</div>
                      </div>
                    </button>
                  `;
                }).join("")
              : `<div class="muted">아직 기록이 없어요.</div>`
          }
        </div>
      </section>
      <section class="panel-section">
        <div class="section-heading">
          <h2>Signals</h2>
        </div>
        <div class="signal-list">
          ${
            threads.slice(0, 5).length
              ? threads.slice(0, 5).map((thread) => `
                  <button class="signal-item ${thread.id === state.selectedThreadId ? "active" : ""}" data-thread="${thread.id}">
                    <div class="signal-strip stage-${thread.stage}"></div>
                    <div class="signal-body">
                      <div class="signal-title">${escapeHtml(thread.title)}</div>
                      <div class="signal-meta">
                        <span class="stage-chip stage-chip-${thread.stage}">${stageLabel(thread.stage)}</span>
                        <span>${thread.itemIds.length} items</span>
                      </div>
                    </div>
                  </button>
                `).join("")
              : `<div class="muted">thread 대기 중</div>`
          }
        </div>
      </section>
    </aside>
  `;
}

function renderCapacityWarning(items) {
  if (state.selectedDate !== getTodayKey()) return "";
  const over = TIME_BLOCK_ORDER.map((block) => {
    const open = items.filter((i) => i.timeBlock === block && i.status !== "done").length;
    return { block, open, cap: BLOCK_CAPACITY[block] };
  }).filter((b) => b.open > b.cap);
  if (!over.length) return "";
  return `
    <div class="capacity-warn">
      <span class="bridge-eyebrow warn">용량 초과</span>
      <div class="capacity-warn-body">
        ${over.map((b) => `<span class="capacity-warn-block">${TIME_BLOCK_LABEL[b.block].replace(/^[\d-]+\s*/, "")} <strong>${b.open}</strong>개 <small>(권장 ${b.cap})</small></span>`).join("")}
        <span class="capacity-warn-hint">다 못 해요. 줄이거나 다른 날로 옮기세요.</span>
      </div>
    </div>
  `;
}

function renderNowBanner() {
  if (state.selectedDate !== getTodayKey()) return "";
  // Seeds in the pipeline that aren't yet placed into a time block today —
  // surface them so the user can pull one into Morning/Work/Evening.
  const nowItems = state.items.filter(
    (i) => i.pipeline && i.lane === "now" && i.status !== "done" && !TIME_BLOCK_ORDER.includes(i.timeBlock),
  );
  if (!nowItems.length) return "";
  return `
    <div class="now-banner">
      <div class="now-banner-header">
        <span class="bridge-eyebrow">🌱 씨앗 — 오늘 키울까?</span>
        <span class="chip now-chip">${nowItems.length}개 대기</span>
      </div>
      <div class="now-banner-items">
        ${nowItems.slice(0, 3).map((i) => `
          <div class="now-banner-row">
            <span class="now-banner-dot"></span>
            <span class="now-banner-text">${escapeHtml(i.text)}</span>
            <div class="now-banner-actions">
              <button class="small-button" data-add-now-to-block="morning" data-item-id="${i.id}">Morning</button>
              <button class="small-button" data-add-now-to-block="workday" data-item-id="${i.id}">Work</button>
              <button class="small-button" data-add-now-to-block="evening" data-item-id="${i.id}">Evening</button>
              <button class="small-button" data-item-status-done="${i.id}">완료</button>
            </div>
          </div>
        `).join("")}
        ${nowItems.length > 3 ? `<div class="now-banner-more">외 ${nowItems.length - 3}개 더</div>` : ""}
      </div>
    </div>
  `;
}

function renderYesterdayBridge() {
  if (state.selectedDate !== getTodayKey()) return "";
  const yesterdayKey = addDays(state.selectedDate, -1);
  const yesterdayReview = getDailyReview(yesterdayKey);
  if (!yesterdayReview.tomorrow?.trim()) return "";
  return `
    <div class="yesterday-bridge">
      <span class="bridge-eyebrow">어제 다짐</span>
      <span class="bridge-text">${escapeHtml(yesterdayReview.tomorrow.trim())}</span>
      <button class="small-button bridge-add-btn" data-add-from-tomorrow="${escapeHtml(yesterdayReview.tomorrow.trim())}">Morning에 추가</button>
    </div>
  `;
}

function renderDaily(allItems, threads) {
  // Ideas live only in the Idea tab — keep them out of the daily timeline.
  const items = allItems.filter((item) => item.type !== "idea");
  const currentBlock = state.selectedDate === getTodayKey() ? currentTimeBlockKey() : "";
  const currentBlockLabel = currentBlock ? `${TIME_BLOCK_LABEL[currentBlock]} 중심 운영` : "선택한 날짜 기록";
  return `
    ${renderNowBanner()}
    ${renderYesterdayBridge()}
    <div class="workspace-header">
      <div>
        <h1>${LongDate.format(new Date(`${state.selectedDate}T00:00:00`))}</h1>
        <p class="muted">${items.length}개 기록됨 · ${currentBlockLabel}</p>
      </div>
      <button class="ghost-button" data-view="wrapup">하루 마감</button>
    </div>
    ${renderCapacityWarning(items)}
    ${renderDailyDashboard(items, currentBlock)}
    ${renderTodayTimeline(items, threads, currentBlock)}
    ${state.toast ? `<div class="today-toast">${escapeHtml(state.toast)}</div>` : ""}
  `;
}

function renderMentalDebugger(dateKey, mode = "today") {
  const review = getDailyReview(dateKey);
  const entries = review.mentalDebugs || [];
  const latest = entries[0];
  const compact = mode === "today";
  const showInlineLog = mode !== "mind";
  return `
    <section class="mental-debugger ${compact ? "compact" : "expanded"}">
      <div class="mental-debugger-header">
        <div>
          <div class="focus-eyebrow">Mental Debugger</div>
          <h2>사실과 해석을 분리하기</h2>
          <p class="muted">피드백이나 사건에서 추측을 덜어내고, 필요한 다음 행동만 남겨요.</p>
        </div>
        <div class="mental-debugger-stats">
          <span><strong>${entries.length}</strong> debug</span>
          <span>${latest ? mentalDebugActionLabel(latest.actionNeed) : "noise check"}</span>
        </div>
      </div>
      <form class="mental-debug-form" data-mental-debug-form="${escapeHtml(dateKey)}">
        <div class="mental-feedback-strip wide">
          <label>
            <span>Feedback Inbox · 출처</span>
            <select name="source">
              ${[
                ["feedback", "피드백"],
                ["meeting", "회의/대화"],
                ["message", "메시지/이메일"],
                ["self", "내 생각"],
                ["other", "기타"],
              ]
                .map(([value, label]) => `<option value="${value}">${label}</option>`)
                .join("")}
            </select>
          </label>
          <label>
            <span>관련 사람/상황</span>
            <input name="person" type="text" placeholder="예: manager, teammate, client" />
          </label>
        </div>
        <label class="wide">
          <span>Step 1 · 사실 또는 이벤트</span>
          <textarea name="event" rows="2" placeholder="실제로 일어난 일만 적기. 예: 보고서 A 부분을 다시 확인해달라는 피드백을 받았다."></textarea>
        </label>
        <label>
          <span>감정</span>
          <input name="emotion" type="text" placeholder="불안, 억울함, 방어적 느낌" />
        </label>
        <label>
          <span>감정 강도</span>
          <div class="emotion-intensity-field">
            <input name="emotionIntensity" type="range" min="1" max="5" value="3" />
            <div class="emotion-intensity-scale" aria-hidden="true">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>
        </label>
        <label>
          <span>Step 2 · 현재 포함된 추측</span>
          <textarea name="assumption" rows="2" placeholder="예: 나를 못 믿는 것 같다, 공격받는 것 같다, 평가가 나빠질 것 같다."></textarea>
        </label>
        <label>
          <span>추측 제거 후 남는 사실</span>
          <textarea name="fact" rows="2" placeholder="확실히 확인 가능한 문장만 남기기."></textarea>
        </label>
        <label>
          <span>Step 3 · 대안 해석</span>
          <textarea name="alternative" rows="2" placeholder="다른 가능한 설명 1-2개."></textarea>
        </label>
        <label>
          <span>Step 4 · 24시간 후에도 중요한가</span>
          <select name="timeTest">
            ${[
              ["unknown", "아직 모름"],
              ["no", "아니오"],
              ["some", "조금"],
              ["yes", "중요함"],
            ]
              .map(([value, label]) => `<option value="${value}">${label}</option>`)
              .join("")}
          </select>
        </label>
        <label>
          <span>Step 5 · 액션이 필요한가</span>
          <select name="actionNeed">
            ${[
              ["none", "액션 없음"],
              ["question", "확인 질문"],
              ["reply", "정리해서 답변"],
              ["followup", "후속 작업"],
              ["boundary", "경계 설정"],
            ]
              .map(([value, label]) => `<option value="${value}">${label}</option>`)
              .join("")}
          </select>
        </label>
        <label class="wide">
          <span>Next Response · 차분한 다음 행동</span>
          <textarea name="nextResponse" rows="2" placeholder="예: 내일 오전 기준을 확인하고 수정본을 보낸다."></textarea>
        </label>
        <div class="mental-debug-actions">
          <button class="primary-button" type="submit">Noise 제거 기록</button>
        </div>
      </form>
      ${renderMentalHeatmap(entries, compact ? "최근 감정 온도" : "오늘 감정 온도")}
      ${renderMentalRecheckQueue(entries, dateKey)}
      ${showInlineLog ? renderMentalDebugInlineLog(entries, dateKey) : ""}
    </section>
  `;
}

function renderMentalDebugInlineLog(entries, dateKey) {
  return entries.length
    ? `<div class="mental-debug-list">
        ${entries.map((entry) => renderMentalDebugEntry(entry, dateKey)).join("")}
      </div>`
    : `<div class="mental-debug-empty">아직 분리한 생각이 없어요. 감정적으로 걸리는 피드백 하나를 짧게 디버그해보세요.</div>`;
}

function renderMentalRecheckQueue(entries, dateKey) {
  const dueEntries = entries
    .filter((entry) => entry.recheckStatus === "pending" && new Date(entry.recheckAt || addHoursIso(entry.createdAt, 24)) <= new Date())
    .slice(0, 3);
  const pendingCount = entries.filter((entry) => entry.recheckStatus === "pending").length;
  if (!entries.length) return "";
  return `
    <div class="mental-recheck-queue">
      <div class="mental-recheck-queue-header">
        <span>24h Recheck Queue</span>
        <small>${dueEntries.length} due · ${pendingCount} pending</small>
      </div>
      ${
        dueEntries.length
          ? dueEntries
              .map(
                (entry) => `
                  <article class="mental-recheck-mini">
                    <strong>${escapeHtml(entry.event || entry.assumption || "Mental Debugger 기록")}</strong>
                    <div>
                      <button class="small-button" data-mental-recheck="not-important" data-mental-debug-id="${escapeHtml(entry.id)}" data-date-key="${escapeHtml(dateKey)}">낮아짐</button>
                      <button class="small-button" data-mental-recheck="still-important" data-mental-debug-id="${escapeHtml(entry.id)}" data-date-key="${escapeHtml(dateKey)}">중요</button>
                    </div>
                  </article>
                `,
              )
              .join("")
          : `<p class="muted">아직 지금 다시 볼 기록은 없어요.</p>`
      }
    </div>
  `;
}

function renderMentalDebugEntry(entry, dateKey) {
  return `
    <article class="mental-debug-entry">
      <div class="mental-debug-entry-main">
        <div class="mental-debug-entry-title">${escapeHtml(entry.event || "이벤트 미기록")}</div>
        <div class="mental-debug-entry-meta">
          ${entry.source ? `<span>${mentalDebugSourceLabel(entry.source)}</span>` : ""}
          ${entry.person ? `<span>${escapeHtml(entry.person)}</span>` : ""}
          ${entry.emotion ? `<span>${escapeHtml(entry.emotion)}</span>` : ""}
          <span>열감 ${clampEmotionIntensity(entry.emotionIntensity)}/5</span>
          <span>${mentalDebugTimeLabel(entry.timeTest)}</span>
          <span>${mentalDebugActionLabel(entry.actionNeed)}</span>
        </div>
        ${entry.assumption ? `<p><strong>추측</strong>${escapeHtml(entry.assumption)}</p>` : ""}
        ${entry.fact ? `<p><strong>사실</strong>${escapeHtml(entry.fact)}</p>` : ""}
        ${entry.alternative ? `<p><strong>대안</strong>${escapeHtml(entry.alternative)}</p>` : ""}
        ${entry.nextResponse ? `<p><strong>다음 행동</strong>${escapeHtml(entry.nextResponse)}</p>` : ""}
        ${renderMentalDebugRecheck(entry, dateKey)}
        ${renderMentalDebugCoach(entry.coach)}
      </div>
      <div class="mental-debug-entry-actions">
        <button class="small-button" data-mental-debug-action="${escapeHtml(entry.id)}" data-date-key="${escapeHtml(dateKey)}">${entry.actionItemId ? "액션 생성됨" : "Today 액션"}</button>
        <button class="small-button" data-mental-debug-coach="${escapeHtml(entry.id)}" data-date-key="${escapeHtml(dateKey)}">${entry.coach ? "다시 디버그" : "AI 디버그"}</button>
        <button class="small-button danger-button" data-mental-debug-delete="${escapeHtml(entry.id)}" data-date-key="${escapeHtml(dateKey)}">삭제</button>
      </div>
    </article>
  `;
}

function renderMentalDebugRecheck(entry, dateKey) {
  const due = new Date(entry.recheckAt || addHoursIso(entry.createdAt, 24));
  const isDue = due <= new Date();
  const statusLabel = {
    pending: isDue ? "재확인 필요" : "24h 대기",
    "not-important": "낮아짐",
    "still-important": "여전히 중요",
    converted: "액션 전환",
  }[entry.recheckStatus] || "24h 대기";
  return `
    <div class="mental-recheck">
      <div>
        <strong>24h Recheck</strong>
        <span>${statusLabel} · ${escapeHtml(due.toISOString().slice(0, 10))}</span>
      </div>
      <div class="mental-recheck-actions">
        <button class="small-button" data-mental-recheck="not-important" data-mental-debug-id="${escapeHtml(entry.id)}" data-date-key="${escapeHtml(dateKey)}">낮아짐</button>
        <button class="small-button" data-mental-recheck="still-important" data-mental-debug-id="${escapeHtml(entry.id)}" data-date-key="${escapeHtml(dateKey)}">중요</button>
      </div>
    </div>
  `;
}

function mentalDebugSourceLabel(value) {
  return {
    feedback: "피드백",
    meeting: "회의/대화",
    message: "메시지/이메일",
    self: "내 생각",
    other: "기타",
  }[value] || "피드백";
}

function renderMentalDebugCoach(coach) {
  if (!coach) return "";
  return `
    <div class="mental-coach-result">
      <div class="mental-coach-header">
        <span>${escapeHtml(coach.provider)}</span>
        <small>${escapeHtml(coach.generatedAt.slice(0, 10))}</small>
      </div>
      ${coach.summary ? `<p>${escapeHtml(coach.summary)}</p>` : ""}
      <div class="mental-coach-grid">
        ${renderMentalCoachList("추측 분리", coach.assumptions)}
        ${renderMentalCoachList("대안 해석", coach.alternativeReads)}
      </div>
      ${coach.action ? `<p><strong>추천 액션</strong>${escapeHtml(coach.action)}</p>` : ""}
      ${coach.replyDraft ? `<p><strong>답변 초안</strong>${escapeHtml(coach.replyDraft)}</p>` : ""}
    </div>
  `;
}

function renderMentalCoachList(title, lines) {
  return `
    <div class="mental-coach-list">
      <strong>${title}</strong>
      ${
        lines?.length
          ? lines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")
          : `<span class="muted">추가 기록이 있으면 더 선명해져요.</span>`
      }
    </div>
  `;
}

function renderMentalHeatmap(entries, title = "감정 온도") {
  const cells = entries.slice(0, 14).reverse();
  if (!cells.length) return "";
  return `
    <div class="mental-heatmap" aria-label="${escapeHtml(title)}">
      <div class="mental-heatmap-header">
        <span>${escapeHtml(title)}</span>
        <small>낮음 → 높음</small>
      </div>
      <div class="mental-heatmap-cells">
        ${cells
          .map(
            (entry) => `
              <span
                class="heat-cell heat-${clampEmotionIntensity(entry.emotionIntensity)}"
                title="${escapeHtml(entry.createdAt.slice(0, 10))} · ${clampEmotionIntensity(entry.emotionIntensity)}/5 · ${escapeHtml(entry.emotion || "감정")}"
              ></span>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function mentalDebugTimeLabel(value) {
  return {
    no: "24h 후 낮음",
    some: "24h 후 조금",
    yes: "24h 후 중요",
    unknown: "24h 테스트 대기",
  }[value] || "24h 테스트 대기";
}

function mentalDebugActionLabel(value) {
  return {
    none: "액션 없음",
    question: "확인 질문",
    reply: "정리 답변",
    followup: "후속 작업",
    boundary: "경계 설정",
  }[value] || "액션 없음";
}

function renderDailyDashboard(items, currentBlock) {
  const stats = buildDailyDashboardStats(items, currentBlock);
  return `
    <section class="daily-dashboard" aria-label="Daily progress dashboard">
      <article class="daily-dashboard-main">
        <div class="dashboard-hero">
          <div class="daily-progress-ring" style="--progress:${stats.completionRate}">
            <strong>${stats.completionRate}%</strong>
            <span>완료</span>
          </div>
          <div class="daily-dashboard-copy">
            <div class="focus-eyebrow">Today Pulse</div>
            <h2>${dailyDashboardHeadline(stats)}</h2>
            <div class="pulse-chips">
              <span class="pulse-chip">완료 ${stats.done}/${stats.total}</span>
              <span class="pulse-chip ${stats.active ? "on" : ""}">진행 ${stats.active}</span>
              <span class="pulse-chip ${stats.primaryOpen ? "warn" : ""}">Primary 열림 ${stats.primaryOpen}</span>
              <span class="pulse-chip ${stats.blocked ? "alert" : ""}">막힘 ${stats.blocked}</span>
            </div>
          </div>
        </div>
        ${renderDayFlow(stats.dayFlow)}
      </article>
      <div class="daily-dashboard-lower">
        ${renderAttentionPanel(stats.attentionItems)}
        <div class="daily-dashboard-graphs">
          ${renderDailyDistribution("시간대", stats.blockBreakdown)}
          ${renderDailyDistribution("우선순위", stats.priorityBreakdown)}
        </div>
      </div>
    </section>
  `;
}

function renderDayFlow(segments) {
  return `
    <div class="day-flow" role="group" aria-label="하루 흐름">
      ${segments
        .map((seg, i) => {
          // Note: avoid the bare "empty" class — it collides with the global
          // .empty utility (min-height: 260px) used for empty-state boxes.
          const stateClass = seg.total === 0 ? "vacant" : seg.done === seg.total ? "complete" : "partial";
          const connector =
            i < segments.length - 1 ? `<div class="day-flow-arrow" aria-hidden="true">›</div>` : "";
          return `
            <div class="day-flow-seg ${stateClass} ${seg.isCurrent ? "current" : ""}">
              <div class="dfs-top">
                <span class="dfs-range">${seg.range}</span>
                ${seg.isCurrent ? `<span class="dfs-now">지금</span>` : ""}
              </div>
              <div class="dfs-name">${seg.name}</div>
              <div class="dfs-track"><span style="width:${Math.round(seg.ratio * 100)}%"></span></div>
              <div class="dfs-count">${seg.done}<small>/${seg.total}</small></div>
            </div>
            ${connector}
          `;
        })
        .join("")}
    </div>
  `;
}

function renderAttentionPanel(attentionItems) {
  if (!attentionItems.length) {
    return `
      <article class="attention-panel calm">
        <div class="attention-head"><h3>주의가 필요한 것</h3></div>
        <div class="attention-empty">막힘·지연 없이 깔끔하게 흐르고 있어요 ✨</div>
      </article>
    `;
  }
  const top = attentionItems.slice(0, 4);
  const rest = attentionItems.length - top.length;
  return `
    <article class="attention-panel">
      <div class="attention-head">
        <h3>주의가 필요한 것</h3>
        <span class="attention-count">${attentionItems.length}건</span>
      </div>
      <div class="attention-list">
        ${top.map(renderAttentionRow).join("")}
      </div>
      ${rest > 0 ? `<div class="attention-more">+${rest}개 더 있어요</div>` : ""}
    </article>
  `;
}

function renderAttentionRow(entry) {
  const { item, carried, blocked } = entry;
  const tag = blocked
    ? `<span class="att-tag blocked">막힘</span>`
    : `<span class="att-tag carried">${carried}일째</span>`;
  const block = TIME_BLOCK_LABEL[item.timeBlock]?.replace(/^[\d-]+\s*/, "") || "";
  return `
    <div class="attention-row ${blocked ? "blocked" : "carried"}">
      <span class="att-dot" aria-hidden="true"></span>
      <div class="att-body">
        <span class="att-text">${escapeHtml(item.text)}</span>
        <small class="att-meta">${block}${item.dailyPriority === "primary" ? " · Primary" : ""}</small>
      </div>
      ${tag}
    </div>
  `;
}

function buildDailyDashboardStats(items, currentBlock) {
  const done = items.filter((item) => item.status === "done").length;
  const open = items.length - done;
  const active = items.filter((item) => item.status === "active").length;
  const blocked = items.filter((item) => item.status !== "done" && item.momentum === "blocked").length;
  const primaryItems = items.filter((item) => item.dailyPriority === "primary");
  const primaryDone = primaryItems.filter((item) => item.status === "done").length;
  const currentBlockItems = currentBlock ? items.filter((item) => item.timeBlock === currentBlock) : [];
  const currentBlockDone = currentBlockItems.filter((item) => item.status === "done").length;
  const deferredItems = items.filter(isDeferredItem);
  const deferredDone = deferredItems.filter((item) => item.status === "done").length;
  const onPlanDone = items.filter((item) => item.status === "done" && !isDeferredItem(item)).length;

  // What's actually stuck or dragging: blocked items, or open items that were
  // carried over from an earlier day. Sorted by severity so the worst surfaces.
  const attentionItems = items
    .filter((item) => item.status !== "done")
    .map((item) => {
      const created = String(item.createdAt || "").slice(0, 10);
      const carried = created && item.date ? Math.max(0, daysBetween(created, item.date)) : 0;
      return { item, carried, blocked: item.momentum === "blocked" };
    })
    .filter((entry) => entry.blocked || entry.carried >= 1)
    .sort((a, b) => {
      if (a.blocked !== b.blocked) return a.blocked ? -1 : 1;
      if (b.carried !== a.carried) return b.carried - a.carried;
      return dailyPriorityRank(a.item.dailyPriority) - dailyPriorityRank(b.item.dailyPriority);
    });

  const dayFlow = TIME_BLOCK_ORDER.map((key) => {
    const blockItems = items.filter((item) => item.timeBlock === key);
    const blockDone = blockItems.filter((item) => item.status === "done").length;
    const label = TIME_BLOCK_LABEL[key];
    return {
      key,
      range: (label.match(/^[\d-]+/) || [""])[0],
      name: label.replace(/^[\d-]+\s*/, ""),
      total: blockItems.length,
      done: blockDone,
      ratio: blockItems.length ? blockDone / blockItems.length : 0,
      isCurrent: key === currentBlock,
    };
  });

  return {
    total: items.length,
    done,
    open,
    active,
    blocked,
    primaryTotal: primaryItems.length,
    primaryDone,
    primaryOpen: primaryItems.length - primaryDone,
    currentBlockTotal: currentBlockItems.length,
    currentBlockDone,
    currentBlockName: currentBlock ? TIME_BLOCK_LABEL[currentBlock] : null,
    attentionItems,
    dayFlow,
    completionRate: items.length ? Math.round((done / items.length) * 100) : 0,
    deferredTotal: deferredItems.length,
    deferredDone,
    onPlanDone,
    onPlanRate: items.length ? Math.round((onPlanDone / items.length) * 100) : 0,
    deferredRate: items.length ? Math.round((deferredItems.length / items.length) * 100) : 0,
    notDoneRate: items.length ? Math.round((open / items.length) * 100) : 0,
    currentBlockLabel: currentBlock
      ? `${TIME_BLOCK_LABEL[currentBlock]} ${currentBlockDone}/${currentBlockItems.length} 완료`
      : "선택한 날짜 전체",
    blockBreakdown: Object.entries(TIME_BLOCK_LABEL).map(([key, label]) => {
      const blockItems = items.filter((item) => item.timeBlock === key);
      return {
        key,
        label: label.replace(/^[0-9-]+\\s/, ""),
        count: blockItems.length,
        done: blockItems.filter((item) => item.status === "done").length,
        percent: items.length ? Math.round((blockItems.length / items.length) * 100) : 0,
      };
    }),
    priorityBreakdown: Object.entries(DAILY_PRIORITY_LABEL).map(([key, label]) => {
      const priorityItems = items.filter((item) => item.dailyPriority === key);
      return {
        key,
        label,
        count: priorityItems.length,
        done: priorityItems.filter((item) => item.status === "done").length,
        percent: items.length ? Math.round((priorityItems.length / items.length) * 100) : 0,
      };
    }),
  };
}

function isDeferredItem(item) {
  const originalDate = String(item.createdAt || "").slice(0, 10);
  return Boolean(originalDate && item.date && item.date > originalDate);
}

function dailyDashboardHeadline(stats) {
  if (!stats.total) return "오늘의 기록을 넣으면 진행 그래프가 살아나요.";
  if (stats.completionRate === 100) return "오늘 모든 항목 완료 — 정말 잘했어요.";
  if (stats.blocked > 0) return `막힌 항목 ${stats.blocked}개가 흐름을 잡고 있어요. 먼저 풀어보세요.`;
  if (stats.primaryOpen > 0 && stats.active > 0) return `Primary ${stats.primaryOpen}개 열림 · ${stats.active}개 진행 중이에요.`;
  if (stats.primaryOpen > 0) return `Primary ${stats.primaryOpen}개가 오늘의 핵심이에요. 여기서 시작하세요.`;
  if (stats.active > 0) return `${stats.active}개 진행 중 — 흐름을 끊지 말고 이어가세요.`;
  if (stats.completionRate >= 70) return "오늘 실행 리듬이 꽤 좋게 올라왔어요.";
  if (stats.completionRate >= 40) return "절반을 넘어가고 있어요. 다음으로 이어가세요.";
  return "첫 번째 항목을 완료하면 오늘의 리듬이 생겨요.";
}

function renderDailyDistribution(title, entries) {
  return `
    <article class="daily-distribution">
      <div class="daily-distribution-header">
        <h3>${title}</h3>
        <span>${entries.reduce((sum, entry) => sum + entry.count, 0)} total</span>
      </div>
      <div class="daily-distribution-bars">
        ${entries.map(renderDailyDistributionRow).join("")}
      </div>
    </article>
  `;
}

function renderDailyDistributionRow(entry) {
  const totalWidth = Math.max(entry.count ? 4 : 0, entry.percent);
  const doneWidth = entry.count ? Math.round(totalWidth * entry.done / entry.count) : 0;
  const openWidth = totalWidth - doneWidth;
  return `
    <div class="daily-distribution-row ${entry.key}">
      <div>
        <span>${entry.label}</span>
        <small>${entry.done}/${entry.count} done</small>
      </div>
      <div class="daily-distribution-track">
        <span class="track-done" style="width:${doneWidth}%"></span>
        <span class="track-open" style="width:${openWidth}%"></span>
      </div>
      <strong>${entry.count}</strong>
    </div>
  `;
}

function captureSelect(field, label, labels, value) {
  return `
    <label>
      <span>${label}</span>
      <select data-capture-field="${field}">
        ${Object.entries(labels)
          .map(([key, text]) => `<option value="${key}" ${value === key ? "selected" : ""}>${text}</option>`)
          .join("")}
      </select>
    </label>
  `;
}

function renderTodayTimeline(items, threads, currentBlock) {
  return `
    <section class="today-timeline" aria-label="Today timeline">
      ${TIME_BLOCK_ORDER.map((block) => renderTodayTimeBlock(block, TIME_BLOCK_LABEL[block], items, threads, currentBlock)).join("")}
    </section>
    ${items.length ? "" : `<div class="empty today-empty">오늘의 씨앗을 기다리는 중</div>`}
  `;
}

function renderTodayTimeBlock(block, label, items, threads, currentBlock) {
  const blockItems = items.filter((item) => item.timeBlock === block).sort((a, b) => todayItemSort(a, b));
  const openItems = blockItems.filter((item) => item.status !== "done");
  const primaryCount = blockItems.filter((item) => item.dailyPriority === "primary").length;
  const doneCount = blockItems.filter((item) => item.status === "done").length;
  const isCurrent = block === currentBlock;
  return `
    <article class="today-block ${block} ${isCurrent ? "current" : ""}" data-time-block-drop="${block}">
      <div class="today-block-header">
        <div>
          <div class="focus-eyebrow">
            ${block === "evening" ? "Growth Engine" : "Time Block"}
            ${isCurrent ? `<span class="now-pill"><span class="now-dot" aria-hidden="true"></span>지금 진행 중</span>` : ""}
          </div>
          <h2>${label}</h2>
        </div>
        <div class="today-block-stats">
          <span>${doneCount} / ${blockItems.length} done</span>
          <span>${primaryCount} primary</span>
        </div>
      </div>
      <div class="today-card-list" data-time-block-drop="${block}">
        ${blockItems.length ? blockItems.map((item) => renderTodayCard(item, threads)).join("") : `<div class="daily-empty">비어 있음</div>`}
      </div>
      <div class="block-inline-area">
        ${blockInlineActiveBlock === block
          ? `<div class="block-inline-form">
               <textarea class="block-inline-input" data-block-inline-input="${block}" rows="1" placeholder="항목 추가 · Enter 저장 · Shift+Enter 줄바꿈 · Esc 취소" autocomplete="off"></textarea>
               <button class="block-inline-cancel" data-block-inline-cancel="${block}" tabindex="-1">×</button>
             </div>`
          : `<button class="block-inline-trigger" data-block-inline-open="${block}">+ 추가</button>`
        }
      </div>
      ${
        openItems.length
          ? `<div class="today-block-actions">
              <span>${openItems.length}개 남음</span>
              <button class="small-button" data-move-time-block-next="${block}">다음 타임으로</button>
              <button class="small-button" data-defer-block-tomorrow="${block}">내일로</button>
            </div>`
          : ""
      }
    </article>
  `;
}

function renderTodayCard(item, threads) {
  const isDone = item.status === "done";
  const isActive = item.status === "active";
  const tlClass = isDone ? "status-done" : isActive ? "status-active" : "";
  const tlIcon = isDone ? "✓" : isActive ? "▶" : "○";
  const trClass = item.pipeline ? "seeded" : "";
  return `
    <article class="today-card prio-${item.dailyPriority} ${isDone ? "done" : ""} ${isActive ? "active" : ""}" data-today-card="${item.id}" data-current-time-block="${item.timeBlock}" title="카드를 끌어서 순서·시간대 이동">
      <button class="prio-strip" data-cycle-prio="${item.id}" title="우선순위 변경 (클릭)"></button>
      <div class="card-inner">
        <div class="card-quad">
          <button class="quad-btn quad-tl ${tlClass}" data-quad="${item.id}:tl" title="진행중 / 완료(더블클릭)">${tlIcon}</button>
          <button class="quad-btn quad-tr ${trClass}" data-quad="${item.id}:tr" title="씨앗 / 삭제(더블클릭)">🌱</button>
          <button class="quad-btn quad-bl" data-quad="${item.id}:bl" title="이전 타임 / 어제(더블클릭)">‹</button>
          <button class="quad-btn quad-br" data-quad="${item.id}:br" title="다음 타임 / 내일(더블클릭)">›</button>
        </div>
        <textarea class="today-card-title-input" data-item-text="${item.id}" rows="1" aria-label="항목 내용 수정">${escapeHtml(item.text)}</textarea>
        <button class="ctx-chip ctx-${item.context}" data-cycle-ctx="${item.id}" title="${DAILY_CONTEXT_LABEL[item.context]} (클릭하여 변경)">${CONTEXT_ICON[item.context] ?? ""}</button>
      </div>
    </article>
  `;
}

function renderDailyWrapUp(threads) {
  const review = buildDailyWrapUp(state.selectedDate, state.items, threads);
  const savedReview = getDailyReview(state.selectedDate);
  const isSaved = savedReview.win || savedReview.tomorrow;
  const insights = buildDayInsights(state.selectedDate, state.items, state.dailyReviews || []);
  const weekInsights = buildWeekInsights(state.selectedDate, state.items, state.dailyReviews || {});

  // timeblock breakdown
  const blockSummary = TIME_BLOCK_ORDER.map((key) => {
    const label = TIME_BLOCK_LABEL[key].replace(/^\d+-\d+\s*/, "");
    const range = TIME_BLOCK_LABEL[key].match(/^[\d-]+/)?.[0] || "";
    const blockItems = review.dayItems.filter((item) => item.timeBlock === key);
    const done = blockItems.filter((item) => item.status === "done").length;
    const total = blockItems.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { key, label, range, done, total, pct };
  });

  // evening build items for growth section
  const eveningItems = review.dayItems.filter((item) => item.timeBlock === "evening");
  const eveningDone = eveningItems.filter((item) => item.status === "done");
  const eveningOpen = eveningItems.filter((item) => item.status !== "done");

  return `
    <div class="wrapup-view">
      <div class="workspace-header">
        <div>
          <h1>하루 마감</h1>
          <p class="muted">${LongDate.format(new Date(`${state.selectedDate}T00:00:00`))}</p>
        </div>
        <div class="wrapup-header-right">
          <div class="focus-summary" aria-label="Daily wrap-up summary">
            <span><strong>${review.completionRate}%</strong> 완료</span>
            <span><strong>${review.done.length}</strong> 완료</span>
            <span><strong>${review.open.length}</strong> 남음</span>
          </div>
          <button class="ghost-button" data-view="weekly">주간 리뷰 →</button>
        </div>
      </div>

      <section class="wrapup-block-summary">
        ${blockSummary.map(({ key, label, range, done, total, pct }) => `
          <div class="wbs-row ${key}">
            <div class="wbs-meta">
              <span class="wbs-range">${range}</span>
              <span class="wbs-label">${label}</span>
            </div>
            <div class="wbs-bar-wrap">
              <div class="wbs-bar" style="width:${pct}%"></div>
            </div>
            <span class="wbs-count">${done}/${total}</span>
          </div>
        `).join("")}
      </section>

      ${renderDayInsights(insights, weekInsights)}

      <div class="wrapup-grid">
        <section class="focus-section">
          <div class="focus-section-header">
            <div>
              <h2>오늘 완료</h2>
              <p class="muted">닫힌 흔적</p>
            </div>
            <span class="chip">${review.done.length}</span>
          </div>
          <div class="focus-card-list">
            ${
              review.done.length
                ? review.done.map((item) => renderWrapUpItem(item, threads, "done")).join("")
                : `<div class="board-empty">아직 완료된 항목이 없어요.</div>`
            }
          </div>
        </section>
        <section class="focus-section">
          <div class="focus-section-header">
            <div>
              <h2>넘길 항목</h2>
              <p class="muted">완료하거나 내일로</p>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              ${review.open.filter((i) => i.momentum !== "blocked").length > 1
                ? `<button class="small-button" data-defer-all-tomorrow>전부 내일로</button>`
                : ""}
              <span class="chip">${review.open.length}</span>
            </div>
          </div>
          <div class="carry-over-list">
            ${review.open.length
              ? (() => {
                  const regular = review.open.filter((i) => i.momentum !== "blocked");
                  const blocked = review.open.filter((i) => i.momentum === "blocked");
                  return `
                    ${regular.map((item) => renderWrapUpItem(item, threads, "open")).join("")}
                    ${blocked.length ? `
                      <div class="carry-blocked-divider">막힘 — 결정 필요</div>
                      ${blocked.map((item) => renderWrapUpItem(item, threads, "blocked")).join("")}
                    ` : ""}
                  `;
                })()
              : `<div class="board-empty">열린 항목이 없어요.</div>`
            }
          </div>
        </section>
      </div>

      ${eveningItems.length ? `
      <section class="wrapup-growth">
        <div class="focus-section-header">
          <div>
            <div class="focus-eyebrow">18-24</div>
            <h2>오늘 성장 시간</h2>
          </div>
          <span class="chip">${eveningDone.length}/${eveningItems.length}</span>
        </div>
        <div class="wrapup-growth-lists">
          ${eveningDone.length ? `
            <div class="wrapup-growth-group">
              <span class="wrapup-growth-label done">완료</span>
              ${eveningDone.map((item) => `<div class="wrapup-growth-item done">${escapeHtml(item.text)}</div>`).join("")}
            </div>` : ""}
          ${eveningOpen.length ? `
            <div class="wrapup-growth-group">
              <span class="wrapup-growth-label open">미완</span>
              ${eveningOpen.map((item) => `
                <div class="wrapup-growth-item open">
                  <span>${escapeHtml(item.text)}</span>
                  <button class="small-button" data-defer-tomorrow="${item.id}">내일로</button>
                  <button class="small-button" data-toggle="${item.id}">완료</button>
                </div>`).join("")}
            </div>` : ""}
        </div>
      </section>` : ""}

      <article class="review-card daily-review-card">
        <div class="review-card-header">
          <div>
            <h2>하루 회고</h2>
            <p class="muted">${review.prompts[0] || "짧게 적고 하루를 닫아요"}</p>
          </div>
          <span class="chip">${isSaved ? "저장됨" : "작성 중"}</span>
        </div>
        <form class="daily-review-form" data-daily-review-form="${escapeHtml(state.selectedDate)}">
          <label>
            <span>오늘의 수확 · 성과나 배운 것</span>
            <textarea name="win" rows="3" placeholder="끝낸 것, 한 걸음 나아간 것, 발견한 것">${escapeHtml(savedReview.win)}</textarea>
          </label>
          <label>
            <span>내일 첫 30분</span>
            <textarea name="tomorrow" rows="2" placeholder="내일 가장 먼저 잡을 한 가지">${escapeHtml(savedReview.tomorrow)}</textarea>
          </label>
          <label class="energy-field">
            <span>오늘 에너지</span>
            <div class="energy-select-row">
              ${[["low", "낮음 😮‍💨"], ["normal", "보통 😐"], ["high", "높음 ⚡"]].map(([value, label]) =>
                `<label class="energy-option ${savedReview.energy === value ? "selected" : ""}">
                  <input type="radio" name="energy" value="${value}" ${savedReview.energy === value ? "checked" : ""} />
                  ${label}
                </label>`
              ).join("")}
            </div>
          </label>
          <div class="daily-review-actions">
            <button class="primary-button" type="submit">마감 저장</button>
          </div>
        </form>
      </article>
      ${renderReflectionCoach("daily", state.selectedDate)}
    </div>
  `;
}

function dailyWrapUpHeadline(review) {
  if (!review.dayItems.length) return "오늘의 기록이 비어 있어요.";
  if (!review.open.length) return "오늘 항목이 모두 닫혔어요.";
  if (review.blocked.length) return "오늘은 병목을 내일의 질문으로 바꾸면 좋아요.";
  return "오늘의 열린 항목을 내일의 첫 행동으로 좁혀보세요.";
}

function dailyWrapUpSubcopy(review) {
  if (!review.dayItems.length) return "Daily에 짧은 메모 하나를 남기면 마감 회고가 시작돼요.";
  return `${review.dayItems.length}개 중 ${review.done.length}개 완료 · ${review.highLeverage.length}개 중요 항목 · ${review.ideas.length}개 아이디어`;
}

function renderWrapUpItem(item, threads, mode) {
  const thread = threads.find((entry) => entry.itemIds.includes(item.id));

  if (mode === "done") {
    return `
      <article class="wrapup-item done">
        <div class="wrapup-item-main">
          <div class="wrapup-item-title done-title">${escapeHtml(item.text)}</div>
          ${thread ? `<span class="wrapup-item-thread">${escapeHtml(thread.title)}</span>` : ""}
        </div>
        <button class="wrapup-reopen-btn" data-toggle="${item.id}" title="다시 열기">↩</button>
      </article>
    `;
  }

  if (mode === "blocked") {
    return `
      <div class="carry-row blocked">
        <div class="carry-row-title">
          <span class="carry-blocked-dot"></span>
          ${escapeHtml(item.text)}
          ${thread ? `<span class="carry-row-thread">${escapeHtml(thread.title)}</span>` : ""}
        </div>
        <div class="carry-row-actions">
          <button class="small-button" data-toggle="${item.id}">완료</button>
          <button class="small-button" data-item-field-button="momentum" data-item-value="active" data-item-id="${item.id}">풀기</button>
          <button class="small-button" data-defer-tomorrow="${item.id}">내일로</button>
        </div>
      </div>
    `;
  }

  // Chronic deferral — force a decision instead of one more free "내일로".
  if ((item.deferCount || 0) >= DEFER_FRICTION_THRESHOLD) {
    return renderDecisionRow(item, thread);
  }

  const priorityDot = item.dailyPriority === "primary"
    ? `<span class="carry-priority-dot primary" title="Primary"></span>`
    : "";
  const deferTag = (item.deferCount || 0) > 0
    ? `<span class="carry-defer-count" title="미룬 횟수">↻${item.deferCount}</span>`
    : "";

  return `
    <div class="carry-row">
      <div class="carry-row-title">
        ${priorityDot}
        ${escapeHtml(item.text)}
        ${deferTag}
        ${thread ? `<span class="carry-row-thread">${escapeHtml(thread.title)}</span>` : ""}
      </div>
      <div class="carry-row-actions">
        <button class="small-button" data-toggle="${item.id}">완료</button>
        <button class="small-button" data-defer-tomorrow="${item.id}">내일로</button>
      </div>
    </div>
  `;
}

// Forcing function for items that have been deferred too many times.
function renderDecisionRow(item, thread) {
  const reasonChips = Object.entries(DEFER_REASON_LABEL).map(([key, label]) =>
    `<button class="reason-chip ${item.deferReason === key ? "selected" : ""}" data-decide-reason="${item.id}" data-reason="${key}">${label}</button>`
  ).join("");
  return `
    <div class="carry-row decision">
      <div class="decision-head">
        <span class="defer-badge">${item.deferCount}번째 미룸</span>
        <span class="decision-title">${escapeHtml(item.text)}</span>
        ${thread ? `<span class="carry-row-thread">${escapeHtml(thread.title)}</span>` : ""}
      </div>
      <div class="decision-reasons">
        <span class="decision-reasons-label">왜 계속 미뤘나?</span>
        ${reasonChips}
      </div>
      <div class="decision-actions">
        <button class="small-button decide-do" data-decide-today="${item.id}">오늘 진짜 한다</button>
        <button class="small-button decide-schedule" data-decide-schedule="${item.id}">날짜 박기</button>
        <button class="small-button decide-kill" data-decide-kill="${item.id}">접는다</button>
      </div>
    </div>
  `;
}

function renderTomorrowCandidate(candidate, threads) {
  const { item, reason } = candidate;
  const thread = threads.find((entry) => entry.itemIds.includes(item.id));
  return `
    <article class="tomorrow-candidate">
      <div class="candidate-rank">1</div>
      <div class="candidate-copy">
        <div class="wrapup-item-title">${escapeHtml(item.text)}</div>
        <p>${escapeHtml(reason)}</p>
        <div class="chip-row">
          <span class="chip ${item.lane}">${LANE_LABEL[item.lane]}</span>
          <span class="chip ${item.importance}">${IMPORTANCE_LABEL[item.importance]}</span>
          <span class="chip ${item.momentum}">${MOMENTUM_LABEL[item.momentum]}</span>
          ${thread ? `<span class="chip">${escapeHtml(thread.title)}</span>` : ""}
        </div>
      </div>
      <div class="wrapup-actions candidate-actions">
        <button class="small-button" data-item-field-button="lane" data-item-value="now" data-item-id="${item.id}">지금 집중</button>
        <button class="small-button" data-defer-tomorrow="${item.id}">내일로 이동</button>
      </div>
    </article>
  `;
}

function renderItem(item, threads) {
  const thread = threads.find((entry) => entry.itemIds.includes(item.id));
  return `
    <article class="item ${item.status === "done" ? "done" : ""}">
      <button class="check ${item.status === "done" ? "done" : ""}" data-toggle="${item.id}" title="Toggle done">${item.status === "done" ? "✓" : ""}</button>
      <div>
        <div class="item-text">${escapeHtml(item.text)}</div>
        <div class="chip-row">
          <span class="chip ${item.context}">${DAILY_CONTEXT_LABEL[item.context]}</span>
          <span class="chip ${item.timeBlock}">${TIME_BLOCK_LABEL[item.timeBlock]}</span>
          <span class="chip ${item.dailyPriority}">${DAILY_PRIORITY_LABEL[item.dailyPriority]}</span>
          <span class="chip ${item.type}">${TYPE_LABEL[item.type]}</span>
          <span class="chip ${item.horizon}">${HORIZON_LABEL[item.horizon]}</span>
          <span class="chip ${item.lane}">${LANE_LABEL[item.lane]}</span>
          <span class="chip ${item.importance}">${IMPORTANCE_LABEL[item.importance]}</span>
          <span class="chip ${item.momentum}">${MOMENTUM_LABEL[item.momentum]}</span>
          ${thread ? `<span class="chip">${escapeHtml(thread.title)}</span>` : ""}
          ${item.keywords.slice(0, 3).map((keyword) => `<span class="chip">#${escapeHtml(keyword)}</span>`).join("")}
        </div>
        <div class="priority-controls">
          ${selectControl(item, "context", DAILY_CONTEXT_LABEL)}
          ${selectControl(item, "timeBlock", TIME_BLOCK_LABEL)}
          ${selectControl(item, "dailyPriority", DAILY_PRIORITY_LABEL)}
          ${selectControl(item, "lane", LANE_LABEL)}
          ${selectControl(item, "importance", IMPORTANCE_LABEL)}
          ${selectControl(item, "momentum", MOMENTUM_LABEL)}
        </div>
      </div>
      <button class="delete-button" data-delete="${item.id}" title="Delete">×</button>
    </article>
  `;
}

function selectControl(item, field, labels) {
  return `
    <select data-item-field="${field}" data-item-id="${item.id}" aria-label="${field}">
      ${Object.entries(labels)
        .map(
          ([value, label]) =>
            `<option value="${value}" ${item[field] === value ? "selected" : ""}>${label}</option>`,
        )
        .join("")}
    </select>
  `;
}

function renderFocus(threads) {
  const openItems = state.items.filter((item) => item.status !== "done");
  const nowItems = openItems
    .filter((item) => item.lane === "now")
    .sort((a, b) => prioritySort(a, b));
  const blockedItems = openItems
    .filter((item) => item.momentum === "blocked")
    .sort((a, b) => prioritySort(a, b));
  const highLeverageItems = openItems
    .filter(
      (item) =>
        item.lane !== "now" &&
        item.momentum !== "blocked" &&
        ["high", "critical"].includes(item.importance),
    )
    .sort((a, b) => prioritySort(a, b));
  const todayItems = openItems
    .filter(
      (item) =>
        item.date === state.selectedDate &&
        item.lane !== "now" &&
        item.momentum !== "blocked" &&
        !["high", "critical"].includes(item.importance),
    )
    .sort((a, b) => prioritySort(a, b));

  const primaryItem = nowItems[0] || highLeverageItems[0] || todayItems[0] || openItems.sort((a, b) => prioritySort(a, b))[0];
  const queueItems = uniqueItems([...nowItems, ...highLeverageItems, ...todayItems])
    .filter((item) => item.id !== primaryItem?.id && item.momentum !== "blocked")
    .slice(0, 8);
  const quietItems = openItems
    .filter(
      (item) =>
        !queueItems.some((entry) => entry.id === item.id) &&
        item.id !== primaryItem?.id &&
        item.momentum !== "blocked",
    )
    .sort((a, b) => prioritySort(a, b))
    .slice(0, 5);

  return `
    <div class="focus-view">
      <div class="workspace-header">
        <div>
          <h1>오늘 집중</h1>
          <p class="muted">${LongDate.format(new Date(`${state.selectedDate}T00:00:00`))}</p>
        </div>
        <div class="focus-summary" aria-label="Focus summary">
          <span><strong>${nowItems.length}</strong> 지금</span>
          <span><strong>${highLeverageItems.length}</strong> 중요</span>
          <span><strong>${blockedItems.length}</strong> 막힘</span>
        </div>
      </div>
      ${renderFocusPrimary(primaryItem, threads)}
      <div class="focus-columns">
        ${renderFocusQueue("집중 대기열", queueItems, threads, "다음으로 잡을 항목이 없어요.")}
        ${renderFocusQueue("막힘 신호", blockedItems.slice(0, 6), threads, "막힌 항목이 없어요.")}
      </div>
      ${renderFocusQueue("오늘 여유 항목", quietItems, threads, "오늘은 지금 보이는 항목만 잡아도 충분해요.", true)}
    </div>
  `;
}

function uniqueItems(items) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function renderFocusPrimary(item, threads) {
  if (!item) {
    return `
      <section class="focus-primary empty-primary">
        <div>
          <div class="focus-eyebrow">첫 집중</div>
          <h2>오늘은 비어 있어요.</h2>
          <p class="muted">Daily에서 씨앗을 하나 기록하면 여기서 바로 집중 항목을 고를 수 있어요.</p>
        </div>
      </section>
    `;
  }

  const thread = threads.find((entry) => entry.itemIds.includes(item.id));
  return `
    <section class="focus-primary">
      <div class="focus-primary-copy">
        <div class="focus-eyebrow">첫 집중</div>
        <h2>${escapeHtml(item.text)}</h2>
        <div class="chip-row">
          <span class="chip ${item.lane}">${LANE_LABEL[item.lane]}</span>
          <span class="chip ${item.importance}">${IMPORTANCE_LABEL[item.importance]}</span>
          <span class="chip ${item.momentum}">${MOMENTUM_LABEL[item.momentum]}</span>
          ${thread ? `<span class="chip">${escapeHtml(thread.title)}</span>` : ""}
        </div>
      </div>
      <div class="focus-primary-actions">
        <button class="primary-button" data-toggle="${item.id}">완료</button>
        ${
          item.lane !== "now"
            ? `<button class="ghost-button" data-move-lane="now" data-item-id="${item.id}">지금 집중</button>`
            : `<button class="ghost-button" data-item-field-button="momentum" data-item-value="active" data-item-id="${item.id}">진행 중</button>`
        }
        ${
          item.momentum !== "blocked"
            ? `<button class="ghost-button" data-item-field-button="momentum" data-item-value="blocked" data-item-id="${item.id}">막힘</button>`
            : `<button class="ghost-button" data-item-field-button="momentum" data-item-value="active" data-item-id="${item.id}">풀기</button>`
        }
      </div>
    </section>
  `;
}

function renderFocusQueue(title, items, threads, emptyText, compact = false) {
  return `
    <section class="focus-section ${compact ? "compact" : ""}">
      <div class="focus-section-header">
        <div>
          <h2>${title}</h2>
          <p class="muted">${focusSectionHint(title)}</p>
        </div>
        <span class="chip">${items.length}</span>
      </div>
      <div class="focus-card-list">
        ${
          items.length
            ? items.map((item) => renderFocusCard(item, threads)).join("")
            : `<div class="board-empty">${emptyText}</div>`
        }
      </div>
    </section>
  `;
}

function focusSectionHint(title) {
  return {
    "집중 대기열": "위에서부터 하나씩 처리",
    "막힘 신호": "풀거나 내려놓을 병목",
    "오늘 여유 항목": "오늘 여력이 있으면 보기",
  }[title];
}

function renderFocusSection(title, items, threads, emptyText) {
  return `
    <section class="focus-section">
      <div class="focus-section-header">
        <h2>${title}</h2>
        <span class="chip">${items.length}</span>
      </div>
      <div class="focus-card-list">
        ${
          items.length
            ? items.map((item) => renderFocusCard(item, threads)).join("")
            : `<div class="board-empty">${emptyText}</div>`
        }
      </div>
    </section>
  `;
}

function renderFocusCard(item, threads) {
  const thread = threads.find((entry) => entry.itemIds.includes(item.id));
  return `
    <article class="focus-card">
      <div>
        <div class="focus-card-title">${escapeHtml(item.text)}</div>
        <div class="chip-row">
          <span class="chip ${item.lane}">${LANE_LABEL[item.lane]}</span>
          <span class="chip ${item.importance}">${IMPORTANCE_LABEL[item.importance]}</span>
          <span class="chip ${item.momentum}">${MOMENTUM_LABEL[item.momentum]}</span>
        </div>
        ${thread ? `<div class="board-thread">${escapeHtml(thread.title)}</div>` : ""}
      </div>
      <div class="focus-actions">
        <button class="small-button" data-toggle="${item.id}">완료</button>
        ${
          item.lane !== "now"
            ? `<button class="small-button" data-move-lane="now" data-item-id="${item.id}">지금</button>`
            : `<button class="small-button" data-item-field-button="momentum" data-item-value="active" data-item-id="${item.id}">진행</button>`
        }
        ${
          item.momentum !== "blocked"
            ? `<button class="small-button" data-item-field-button="momentum" data-item-value="blocked" data-item-id="${item.id}">막힘</button>`
            : `<button class="small-button" data-item-field-button="momentum" data-item-value="active" data-item-id="${item.id}">풀기</button>`
        }
      </div>
    </article>
  `;
}

const LANE_WARN_THRESHOLD = { now: 4, next: 9, build: 16, invest: 99, someday: 99 };

function renderGoals() {
  const goals = state.goals || [];
  return `
    <section class="goals-panel">
      <div class="goals-head">
        <div>
          <div class="focus-eyebrow">North Star</div>
          <h2>이번 분기 목표</h2>
        </div>
        <span class="muted">매일의 항목이 여기로 향하는지 점검</span>
      </div>
      <div class="goals-list">
        ${goals.map((g, i) => `
          <div class="goal-row">
            <span class="goal-num">${i + 1}</span>
            <span class="goal-text">${escapeHtml(g)}</span>
            <button class="goal-remove" data-goal-remove="${i}" title="삭제">×</button>
          </div>
        `).join("")}
        ${goals.length < 3 ? `
          <form class="goal-add-form" data-goal-add>
            <input name="goal" placeholder="목표 추가 (최대 3개)" maxlength="80" autocomplete="off" />
            <button class="small-button" type="submit">추가</button>
          </form>
        ` : ""}
        ${!goals.length ? `<p class="goals-empty muted">분기 목표 1~3개를 적어두면, 주간 리뷰에서 실제로 거기에 시간을 썼는지 비춰봐요.</p>` : ""}
      </div>
    </section>
  `;
}

// Derive where a seed came from. Prefers the sourceTag field; falls back to
// sniffing legacy text prefixes for items created before that field existed
// (migrateLegacySourceTags cleans those up once, so this fallback is mostly
// dead weight going forward — kept only as a defensive no-op).
function deriveSeedSource(item) {
  const bySourceTag = {
    learning: { label: "학습", cls: "src-learning" },
    signal: { label: "Signals", cls: "src-signal" },
    "signal-idea": { label: "Signals", cls: "src-signal" },
    "project-bridge": { label: "학습", cls: "src-learning" },
  }[item.sourceTag];
  if (bySourceTag) return bySourceTag;
  const text = String(item.text || "");
  if (text.startsWith("[학습]")) return { label: "학습", cls: "src-learning" };
  if (text.startsWith("[신호]")) return { label: "Signals", cls: "src-signal" };
  if (item.type === "idea") return { label: "아이디어", cls: "src-idea" };
  return { label: "Today", cls: "src-today" };
}

// Recently captured seeds — pipeline items that entered 씨앗(now) in the last 7
// days. The "capture inbox": what just landed, with source + quick triage, so
// the 씨앗 lane doesn't become an undifferentiated graveyard.
function recentCaptureSeeds(items) {
  const now = Date.now();
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  return items
    .filter((item) => item.pipeline && item.status !== "done" && item.lane === "now")
    .filter((item) => {
      const ts = new Date(item.laneMovedAt || item.createdAt || 0).getTime();
      return now - ts < WEEK;
    })
    .sort((a, b) => new Date(b.laneMovedAt || b.createdAt || 0) - new Date(a.laneMovedAt || a.createdAt || 0));
}

function renderRecentCaptures(captures) {
  if (!captures.length) return "";
  const today = getTodayKey();
  const todayCount = captures.filter((c) => (c.laneMovedAt || c.createdAt || "").slice(0, 10) === today).length;
  const rows = captures
    .slice(0, 6)
    .map((item) => {
      const src = deriveSeedSource(item);
      const cleanText = String(item.text || "").replace(/^\[(학습|신호)\]\s*/, "");
      return `
        <div class="capture-row">
          <span class="capture-src ${src.cls}">${src.label}</span>
          <span class="capture-text">${escapeHtml(cleanText)}</span>
          <div class="capture-acts">
            <button class="small-button" data-move-lane="next" data-item-id="${item.id}" title="구체화 단계로">구체화로 →</button>
            ${item.date === today ? "" : `<button class="small-button" data-pull-today="${item.id}" title="오늘 할 일로">오늘로 ↓</button>`}
            <button class="small-button ghost" data-seed-release="${item.id}" title="재배에서 빼기 (항목은 유지)">놓아주기</button>
          </div>
        </div>
      `;
    })
    .join("");
  return `
    <section class="capture-inbox">
      <div class="capture-inbox-head">
        <span class="focus-eyebrow">최근 잡힌 씨앗</span>
        <span class="muted">${captures.length}개 · 오늘 ${todayCount} — 손질해서 흘려보내세요</span>
      </div>
      <div class="capture-list">${rows}</div>
    </section>
  `;
}

function renderBoard(threads) {
  const openItems = state.items
    .filter((item) => item.status !== "done" && item.pipeline)
    .sort((a, b) => prioritySort(a, b));

  const captures = recentCaptureSeeds(openItems);
  const mainCount = openItems.filter((i) => MAIN_LANES.includes(i.lane)).length;

  const mainColumns = MAIN_LANES
    .map((lane) => renderBoardColumn(lane, openItems.filter((item) => item.lane === lane), threads))
    .join(`<div class="flow-arrow" aria-hidden="true">→</div>`);

  const supportColumns = SUPPORT_LANES
    .map((lane) => renderBoardColumn(lane, openItems.filter((item) => item.lane === lane), threads))
    .join("");

  return `
    <div class="board-view cultivation">
      <div class="workspace-header">
        <div>
          <h1>재배</h1>
          <p class="muted">씨앗에서 개발까지 — 생각이 자라는 흐름 · ${mainCount}개 진행 중</p>
        </div>
      </div>
      ${renderRecentCaptures(captures)}
      ${renderGoals()}
      ${
        openItems.length === 0
          ? `<div class="cultivation-intro">
              <strong>아직 재배 중인 게 없어요.</strong>
              <span>Today에서 키울 만한 항목의 🌱 버튼을 누르면 씨앗으로 들어와요. 씨앗 → 구체화 → 개발로 옮기며 키우세요.</span>
            </div>`
          : ""
      }
      <div class="cultivation-flow">
        ${mainColumns}
      </div>
      <div class="cultivation-support-head">보조 레인 — 메인 흐름을 옆에서 지원</div>
      <div class="cultivation-support">
        ${supportColumns}
      </div>
    </div>
  `;
}

function renderBoardColumn(lane, items, threads) {
  const isOverloaded = items.length >= LANE_WARN_THRESHOLD[lane];
  const highItems = items.filter((i) => ["high", "critical"].includes(i.importance));
  const normalItems = items.filter((i) => !["high", "critical"].includes(i.importance));
  const hasGroups = highItems.length > 0 && normalItems.length > 0;

  const cardList = hasGroups
    ? `
      ${highItems.map((item) => renderBoardCard(item, threads)).join("")}
      <div class="board-group-divider">그 외</div>
      ${normalItems.map((item) => renderBoardCard(item, threads)).join("")}
    `
    : items.map((item) => renderBoardCard(item, threads)).join("");

  return `
    <section class="board-column lane-${lane}">
      <div class="board-column-header">
        <div class="board-column-title">
          <span class="board-column-dot lane-dot-${lane}" aria-hidden="true"></span>
          <h2>${LANE_LABEL[lane]}</h2>
          <span class="board-column-sub">${LANE_SUBTITLE[lane]}</span>
        </div>
        <span class="chip ${lane} ${isOverloaded ? "chip-warn" : ""}">${items.length}${isOverloaded ? " ⚠" : ""}</span>
      </div>
      <div class="board-card-list">
        ${items.length ? cardList : `<div class="board-empty">비어 있음</div>`}
      </div>
    </section>
  `;
}

function renderBoardCard(item, threads) {
  const thread = threads.find((entry) => entry.itemIds.includes(item.id));
  const isHigh = ["high", "critical"].includes(item.importance);
  const scheduledToday = item.date === getTodayKey();
  const linkedProject = state.projects.find((p) => p.sourceIdeaId === item.id);
  const zoomLink = linkedProject
    ? `<button class="board-card-zoom" data-board-open-project="${linkedProject.id}" title="연결된 프로젝트 열기">프로젝트 →</button>`
    : item.type === "idea"
    ? `<button class="board-card-zoom" data-board-open-idea="${item.id}" title="아이디어 탭에서 열기">아이디어 →</button>`
    : "";
  return `
    <article class="board-card board-lane-${item.lane} ${isHigh ? "board-card-high" : ""}">
      <div class="board-card-body">
        <div class="board-card-title">${escapeHtml(item.text)}</div>
        ${thread ? `<div class="board-card-thread">${escapeHtml(thread.title)}</div>` : ""}
        ${zoomLink}
      </div>
      <div class="board-card-actions">
        ${scheduledToday ? "" : `<button class="small-button board-pull-today" data-pull-today="${item.id}" title="오늘 할 일로 내리기">↓ 오늘로</button>`}
        ${boardMoveButtons(item)}
      </div>
    </article>
  `;
}

function boardMoveButtons(item) {
  return Object.entries(LANE_LABEL)
    .filter(([lane]) => lane !== item.lane)
    .map(([lane, label]) => `<button class="small-button" data-move-lane="${lane}" data-item-id="${item.id}">${label}</button>`)
    .join("");
}

function renderIdeas(threads) {
  const ideaItems = state.items
    .filter((item) => item.type === "idea")
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const promotedCount = ideaItems.filter((item) => state.projects.some((p) => p.sourceIdeaId === item.id)).length;

  return `
    <div class="ideas-view">
      <div class="workspace-header">
        <div>
          <h1>아이디어 인박스</h1>
          <p class="muted">주제별로 떠오른 생각을 모으고, 준비된 것만 프로젝트로 확장합니다.</p>
        </div>
        <div class="focus-summary" aria-label="Idea summary">
          <span><strong>${ideaItems.length}</strong> 주제</span>
          <span><strong>${promotedCount}</strong> 프로젝트화</span>
        </div>
      </div>
      ${renderIdeaComposer(ensureCompose())}
      <section class="idea-board">
        ${
          ideaItems.length
            ? ideaItems.map((item) => renderIdeaCard(item, threads)).join("")
            : `<div class="idea-empty">
                <h2>아직 주제가 없어요.</h2>
                <p class="muted">위에 주제와 떠오른 아이디어를 적어 첫 카드를 만들어보세요.</p>
              </div>`
        }
      </section>
    </div>
  `;
}

function renderIdeaComposer(compose) {
  const items = Array.isArray(compose.items) ? compose.items : [];
  const draftCount = compose.draft && compose.draft.trim() ? 1 : 0;
  const count = items.length + draftCount;
  return `
    <section class="idea-composer">
      <div class="focus-eyebrow">Quick Seed</div>
      <input id="idea-compose-title" class="composer-title" type="text" placeholder="주제 — 예: 국수 프로젝트" value="${escapeHtml(compose.title || "")}" aria-label="주제" />
      <div class="composer-row">
        <input id="idea-compose-item" class="composer-item" type="text" placeholder="떠오른 아이디어를 적고 Enter로 추가 · 여러 줄 붙여넣기도 가능" value="${escapeHtml(compose.draft || "")}" aria-label="아이디어 추가" />
        <button class="composer-add" data-compose-add aria-label="아이디어 추가">+</button>
      </div>
      ${
        items.length
          ? `<div class="composer-list">
              ${items
                .map(
                  (text, index) => `
                <div class="composer-li">
                  <span class="composer-dot" aria-hidden="true"></span>
                  <span class="composer-li-text">${escapeHtml(text)}</span>
                  <button class="composer-rm" data-compose-remove="${index}" aria-label="삭제">✕</button>
                </div>`,
                )
                .join("")}
            </div>`
          : ""
      }
      <div class="composer-foot">
        <span class="muted">${count ? `아이디어 ${count}개` : "첫 칸은 주제, 아래 칸에 아이디어를 추가하세요"}</span>
        <button class="primary-button" data-compose-save>주제 저장</button>
      </div>
    </section>
  `;
}

function renderIdeaCard(item, threads) {
  const subItems = Array.isArray(item.subItems) ? item.subItems : [];
  const expanded = expandedIdeaIds.has(item.id);
  const total = subItems.length;
  const done = subItems.filter((sub) => sub.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const hasTitle = Boolean(item.text && item.text.trim());
  const title = hasTitle ? item.text : "제목 없음";
  const ordered = orderedIdeaSubItems(subItems);
  const linkedProject = state.projects.find((p) => p.sourceIdeaId === item.id);

  return `
    <article class="topic-card ${expanded ? "expanded" : ""} ${linkedProject ? "promoted" : ""}" data-topic="${item.id}">
      <div class="topic-head" data-topic-toggle="${item.id}">
        <span class="topic-chevron" aria-hidden="true">${expanded ? "▾" : "▸"}</span>
        <span class="topic-title ${hasTitle ? "" : "untitled"}">${escapeHtml(title)}</span>
        ${linkedProject ? `<span class="topic-promoted-chip">프로젝트</span>` : ""}
        <span class="topic-progress">
          <span class="topic-bar"><span style="width:${pct}%"></span></span>
          <span class="topic-count">${total ? `${total}개 · ${done} 완료` : "비어 있음"}</span>
        </span>
      </div>
      ${
        expanded
          ? `<div class="topic-body">
              <input class="topic-title-input" data-topic-title="${item.id}" type="text" value="${escapeHtml(item.text || "")}" placeholder="주제 제목" aria-label="주제 제목 수정" />
              <div class="sub-list" data-sub-list="${item.id}">
                ${ordered.length ? ordered.map((sub) => renderSubItem(item, sub)).join("") : `<div class="sub-empty muted">아래에 아이디어를 추가해 보세요.</div>`}
              </div>
              <input class="sub-add-input" data-sub-add="${item.id}" type="text" placeholder="+ 항목 추가 (Enter · 여러 줄 붙여넣기 가능)" aria-label="항목 추가" />
              <div class="topic-foot">
                ${
                  linkedProject
                    ? `<span class="sub-badge">프로젝트화됨</span><button class="small-button" data-idea-project="${linkedProject.id}">프로젝트 보기</button>`
                    : item.pipeline
                      ? `<span class="sub-badge seed">🌱 재배 중</span><button class="small-button" data-goto-board>재배에서 보기</button><button class="small-button promote-project" data-idea-promote="${item.id}">프로젝트로 →</button>`
                      : `<button class="small-button seed" data-idea-cultivate="${item.id}" title="씨앗으로 — 천천히 키우기">🌱 재배로</button><button class="small-button promote-project" data-idea-promote="${item.id}">프로젝트로 만들기 →</button>`
                }
                <button class="small-button danger" data-delete="${item.id}">주제 삭제</button>
              </div>
            </div>`
          : ""
      }
    </article>
  `;
}

function orderedIdeaSubItems(subItems) {
  const open = subItems.filter((sub) => !sub.done);
  const done = subItems.filter((sub) => sub.done);
  return [...open, ...done];
}

function renderSubItem(idea, sub) {
  return `
    <div class="sub-item ${sub.done ? "done" : ""}" data-sub-id="${sub.id}" data-topic-id="${idea.id}">
      <span class="sub-grip" data-sub-grip="${sub.id}" data-topic-id="${idea.id}" title="끌어서 순서 변경" aria-hidden="true">⠿</span>
      <button class="sub-check ${sub.done ? "on" : ""}" data-sub-toggle="${sub.id}" data-topic-id="${idea.id}" role="checkbox" aria-checked="${sub.done}" aria-label="완료"></button>
      <input class="sub-text" data-sub-text="${sub.id}" data-topic-id="${idea.id}" type="text" value="${escapeHtml(sub.text)}" aria-label="아이디어 수정" />
      <button class="sub-act ghost" data-sub-delete="${sub.id}" data-topic-id="${idea.id}" aria-label="삭제">✕</button>
    </div>
  `;
}

function ensureCompose() {
  if (!state.ideaCompose || typeof state.ideaCompose !== "object") {
    state.ideaCompose = { title: "", items: [], draft: "" };
  }
  if (!Array.isArray(state.ideaCompose.items)) state.ideaCompose.items = [];
  if (typeof state.ideaCompose.title !== "string") state.ideaCompose.title = "";
  if (typeof state.ideaCompose.draft !== "string") state.ideaCompose.draft = "";
  return state.ideaCompose;
}

function commitComposeItems(rawText) {
  const compose = ensureCompose();
  const lines = String(rawText ?? "").split("\n").map(normalizeLine).filter(Boolean);
  if (lines.length) compose.items = [...compose.items, ...lines];
  compose.draft = "";
}

async function saveIdeaTopic() {
  const compose = ensureCompose();
  const pending = [...compose.items];
  pending.push(...String(compose.draft || "").split("\n").map(normalizeLine).filter(Boolean));
  const title = compose.title.trim();
  const items = pending.map((text) => text.trim()).filter(Boolean);
  if (!title && !items.length) {
    setToast("주제나 아이디어를 입력해 주세요.");
    return;
  }

  const now = new Date().toISOString();
  const titleText = title || "제목 없음";
  const analyzed = analyzeItem(titleText);
  const idea = {
    id: uid("idea"),
    text: titleText,
    subItems: items.map((text) => ({ id: uid("si"), text, done: false, promotedItemId: null })),
    date: getTodayKey(),
    status: "open",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    ...analyzed,
    type: "idea",
    horizon: analyzed.horizon === "today" ? "short" : analyzed.horizon,
    lane: "someday",
    importance: "normal",
    momentum: "seed",
    context: "idea",
    timeBlock: currentTimeBlockKey(),
    dailyPriority: "parking",
  };

  state.items = [idea, ...state.items];
  state.ideaCompose = { title: "", items: [], draft: "" };
  await repository.upsertItems([idea]);
  setToast("주제를 저장했어요.");
  saveUiState();
  render();
}

function toggleIdeaExpand(ideaId) {
  if (expandedIdeaIds.has(ideaId)) expandedIdeaIds.delete(ideaId);
  else expandedIdeaIds.add(ideaId);
  render();
}

async function updateIdeaTitle(ideaId, text) {
  const idea = state.items.find((entry) => entry.id === ideaId);
  const next = text.trim();
  if (!idea || !next || next === idea.text) return;
  idea.text = next;
  idea.updatedAt = new Date().toISOString();
  await repository.upsertItems([idea]);
  saveUiState();
  render();
}

async function toggleIdeaSubItem(ideaId, subId) {
  const idea = state.items.find((entry) => entry.id === ideaId);
  const sub = idea?.subItems?.find((entry) => entry.id === subId);
  if (!sub) return;
  sub.done = !sub.done;
  idea.updatedAt = new Date().toISOString();
  await repository.upsertItems([idea]);
  saveUiState();
  render();
}

async function updateIdeaSubItemText(ideaId, subId, text) {
  const idea = state.items.find((entry) => entry.id === ideaId);
  const sub = idea?.subItems?.find((entry) => entry.id === subId);
  const next = text.trim();
  if (!sub || !next || next === sub.text) return;
  sub.text = next;
  idea.updatedAt = new Date().toISOString();
  await repository.upsertItems([idea]);
  saveUiState();
  render();
}

async function addIdeaSubItem(ideaId, text) {
  const idea = state.items.find((entry) => entry.id === ideaId);
  if (!idea) return;
  const lines = String(text).split("\n").map(normalizeLine).filter(Boolean);
  if (!lines.length) return;
  if (!Array.isArray(idea.subItems)) idea.subItems = [];
  lines.forEach((line) => idea.subItems.push({ id: uid("si"), text: line, done: false, promotedItemId: null }));
  idea.updatedAt = new Date().toISOString();
  await repository.upsertItems([idea]);
  saveUiState();
  render();
}

async function deleteIdeaSubItem(ideaId, subId) {
  const idea = state.items.find((entry) => entry.id === ideaId);
  if (!Array.isArray(idea?.subItems)) return;
  idea.subItems = idea.subItems.filter((entry) => entry.id !== subId);
  idea.updatedAt = new Date().toISOString();
  await repository.upsertItems([idea]);
  saveUiState();
  render();
}

async function reorderIdeaSubItem(ideaId, subId, beforeId) {
  const idea = state.items.find((entry) => entry.id === ideaId);
  if (!Array.isArray(idea?.subItems)) return;
  const arr = idea.subItems;
  const from = arr.findIndex((entry) => entry.id === subId);
  if (from < 0) return;
  const [moved] = arr.splice(from, 1);
  let to = beforeId ? arr.findIndex((entry) => entry.id === beforeId) : arr.length;
  if (to < 0) to = arr.length;
  arr.splice(to, 0, moved);
  idea.updatedAt = new Date().toISOString();
  await repository.upsertItems([idea]);
  saveUiState();
  render();
}

// Promote a whole idea topic into a first-class project: the topic title
// becomes the project title and its sub-items become the project's tasks.
// 아이디어 → 재배 씨앗: the gentle path (vs "프로젝트로 만들기" which jumps
// straight to 구체화 + a full project). Puts the idea into the pipeline at 씨앗
// so it can be grown gradually. Completes "every flow source → 재배".
async function sendIdeaToCultivation(ideaId) {
  const idea = state.items.find((entry) => entry.id === ideaId);
  if (!idea) return;
  const now = new Date().toISOString();
  idea.pipeline = true;
  idea.lane = "now";
  idea.laneMovedAt = now;
  idea.updatedAt = now;
  await repository.upsertItems([idea]);
  saveUiState();
  setToast("🌱 씨앗으로 보냈어요 · 재배 탭에서 키우세요");
  render();
}

async function promoteIdeaTopic(ideaId) {
  const idea = state.items.find((entry) => entry.id === ideaId);
  if (!idea) return;
  const existing = state.projects.find((p) => p.sourceIdeaId === idea.id);
  if (existing) {
    state.selectedProjectId = existing.id;
    state.selectedView = "projects";
    render();
    return;
  }

  const now = new Date().toISOString();
  const subs = Array.isArray(idea.subItems) ? idea.subItems : [];
  const project = normalizeProject({
    id: uid("prj"),
    no: suggestProjectNo(),
    title: idea.text && idea.text.trim() ? idea.text : "제목 없는 프로젝트",
    status: "active",
    sourceIdeaId: idea.id,
    milestones: [],
    tasks: subs.map((sub) => ({ id: uid("ptask"), text: sub.text, done: Boolean(sub.done), milestoneId: null, fromIdea: true })),
    createdAt: now,
    updatedAt: now,
    sortOrder: Date.now(),
  });

  state.projects = [...state.projects, project];
  state.selectedProjectId = project.id;
  state.selectedView = "projects";

  // 프로젝트화 = 구체화 단계로 진입. 아이디어 항목을 재배 흐름에 올려 보드의
  // 구체화(next) 레인에 나타나게 하고, 프로젝트와 연결된 상태로 추적한다.
  idea.pipeline = true;
  idea.lane = "next";
  idea.laneMovedAt = now;
  idea.lastForwardAt = now;
  idea.updatedAt = now;
  await repository.upsertItems([idea]);

  await repository.upsertProjects([project]);
  setToast("주제를 프로젝트로 만들었어요 · 재배 ‘구체화’로 들어왔어요");
  saveUiState();
  render();
}

function bindIdeaComposerEvents() {
  const title = document.querySelector("#idea-compose-title");
  if (title) {
    title.addEventListener("input", (event) => { ensureCompose().title = event.target.value; });
  }

  const item = document.querySelector("#idea-compose-item");
  if (item) {
    item.addEventListener("input", (event) => { ensureCompose().draft = event.target.value; });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commitComposeItems(event.target.value);
        saveUiState();
        render();
        document.querySelector("#idea-compose-item")?.focus();
      }
    });
    item.addEventListener("paste", (event) => {
      const pasted = event.clipboardData?.getData("text") || "";
      if (pasted.includes("\n")) {
        event.preventDefault();
        commitComposeItems((event.target.value || "") + pasted);
        saveUiState();
        render();
        document.querySelector("#idea-compose-item")?.focus();
      }
    });
  }

  document.querySelector("[data-compose-add]")?.addEventListener("click", () => {
    commitComposeItems(document.querySelector("#idea-compose-item")?.value || "");
    saveUiState();
    render();
    document.querySelector("#idea-compose-item")?.focus();
  });

  document.querySelectorAll("[data-compose-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      ensureCompose().items.splice(Number(button.dataset.composeRemove), 1);
      saveUiState();
      render();
    });
  });

  document.querySelector("[data-compose-save]")?.addEventListener("click", saveIdeaTopic);
}

function bindIdeaCardEvents() {
  document.querySelectorAll("[data-topic-toggle]").forEach((head) => {
    head.addEventListener("click", () => toggleIdeaExpand(head.dataset.topicToggle));
  });

  document.querySelectorAll("[data-topic-title]").forEach((input) => {
    input.addEventListener("change", () => updateIdeaTitle(input.dataset.topicTitle, input.value));
    input.addEventListener("blur", () => updateIdeaTitle(input.dataset.topicTitle, input.value));
    input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); input.blur(); } });
  });

  document.querySelectorAll("[data-sub-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleIdeaSubItem(button.dataset.topicId, button.dataset.subToggle));
  });

  document.querySelectorAll("[data-sub-text]").forEach((input) => {
    input.addEventListener("change", () => updateIdeaSubItemText(input.dataset.topicId, input.dataset.subText, input.value));
    input.addEventListener("blur", () => updateIdeaSubItemText(input.dataset.topicId, input.dataset.subText, input.value));
    input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); input.blur(); } });
  });

  document.querySelectorAll("[data-sub-add]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const value = input.value;
        input.value = "";
        addIdeaSubItem(input.dataset.subAdd, value);
      }
    });
    input.addEventListener("paste", (event) => {
      const pasted = event.clipboardData?.getData("text") || "";
      if (pasted.includes("\n")) {
        event.preventDefault();
        const merged = (input.value || "") + pasted;
        input.value = "";
        addIdeaSubItem(input.dataset.subAdd, merged);
      }
    });
  });

  document.querySelectorAll("[data-sub-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteIdeaSubItem(button.dataset.topicId, button.dataset.subDelete));
  });

  document.querySelectorAll("[data-idea-promote]").forEach((button) => {
    button.addEventListener("click", () => promoteIdeaTopic(button.dataset.ideaPromote));
  });

  document.querySelectorAll("[data-idea-cultivate]").forEach((button) => {
    button.addEventListener("click", () => sendIdeaToCultivation(button.dataset.ideaCultivate));
  });

  document.querySelectorAll("[data-idea-project]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedProjectId = button.dataset.ideaProject;
      state.selectedView = "projects";
      render();
    });
  });

  document.querySelectorAll("[data-sub-grip]").forEach((grip) => {
    grip.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const row = grip.closest(".sub-item");
      if (!row) return;
      event.preventDefault();
      beginIdeaSubDrag(row, event);
    });
  });
}

function beginIdeaSubDrag(row, event) {
  ideaSubDrag = {
    topicId: row.dataset.topicId,
    subId: row.dataset.subId,
    row,
    list: row.closest(".sub-list"),
    startY: event.clientY,
    active: false,
    dropBeforeId: undefined,
  };
  window.addEventListener("pointermove", handleIdeaSubMove, { passive: false });
  window.addEventListener("pointerup", handleIdeaSubUp);
  window.addEventListener("pointercancel", handleIdeaSubUp);
}

function handleIdeaSubMove(event) {
  const drag = ideaSubDrag;
  if (!drag) return;
  if (!drag.active && Math.abs(event.clientY - drag.startY) < 5) return;
  if (event.cancelable) event.preventDefault();
  if (!drag.active) {
    drag.active = true;
    drag.row.classList.add("dragging");
    document.body.classList.add("sub-dragging");
  }
  clearSubMarkers();
  drag.row.classList.add("drag-probe");
  const el = document.elementFromPoint(event.clientX, event.clientY);
  drag.row.classList.remove("drag-probe");
  const overRow = el?.closest?.(".sub-item");
  if (!overRow || !drag.list?.contains(overRow) || overRow === drag.row) return;
  const rect = overRow.getBoundingClientRect();
  if (event.clientY > rect.top + rect.height / 2) {
    overRow.classList.add("drop-after");
    const rows = [...drag.list.querySelectorAll(".sub-item")].filter((r) => r !== drag.row);
    const idx = rows.indexOf(overRow);
    drag.dropBeforeId = rows[idx + 1]?.dataset.subId || null;
  } else {
    overRow.classList.add("drop-before");
    drag.dropBeforeId = overRow.dataset.subId;
  }
}

function handleIdeaSubUp() {
  const drag = ideaSubDrag;
  cleanupIdeaSubDrag();
  if (!drag || !drag.active || drag.dropBeforeId === undefined) return;
  if (drag.dropBeforeId === drag.subId) return;
  reorderIdeaSubItem(drag.topicId, drag.subId, drag.dropBeforeId);
}

function cleanupIdeaSubDrag() {
  window.removeEventListener("pointermove", handleIdeaSubMove);
  window.removeEventListener("pointerup", handleIdeaSubUp);
  window.removeEventListener("pointercancel", handleIdeaSubUp);
  document.body.classList.remove("sub-dragging");
  clearSubMarkers();
  ideaSubDrag?.row.classList.remove("dragging", "drag-probe");
  ideaSubDrag = null;
}

function clearSubMarkers() {
  document
    .querySelectorAll(".sub-item.drop-before, .sub-item.drop-after")
    .forEach((row) => row.classList.remove("drop-before", "drop-after"));
}

async function promoteIdeaToProject(itemId) {
  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) return;

  item.horizon = "long";
  item.lane = "build";
  item.importance = item.importance === "critical" ? "critical" : "high";
  item.momentum = "active";
  item.dailyPriority = "primary";
  item.updatedAt = new Date().toISOString();
  await repository.upsertItems([item]);

  const threads = buildThreads(state.items);
  const thread = threads.find((entry) => entry.itemIds.includes(item.id));
  if (!thread) {
    setToast("프로젝트로 묶을 키워드를 찾지 못했어요. 아이디어를 조금 더 구체화해 주세요.");
    saveUiState();
    render();
    return;
  }

  const title = item.text.split(/[.!?。]|\\n/)[0].trim().slice(0, 48) || thread.title;
  const meta = {
    ...getProjectMeta(thread, [item]),
    goal: `${title}를 실행 가능한 프로젝트로 구체화`,
    milestone: item.text,
    status: "incubating",
    notes: "아이디어 인박스에서 프로젝트 후보로 승격됨",
  };

  state.threadOverrides = {
    ...state.threadOverrides,
    [thread.id]: { title },
  };
  state.projectMeta = {
    ...state.projectMeta,
    [thread.id]: meta,
  };
  await repository.saveThreadOverride(thread.id, title);
  await repository.saveProjectMeta(thread.id, meta);
  state.selectedThreadId = thread.id;
  state.selectedView = "thread";
  setToast("아이디어를 프로젝트 후보로 확장했어요.");
  saveUiState();
  render();
}

function renderProjectDashboard() {
  const projects = [...state.projects].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const current = state.selectedProjectId ? projects.find((p) => p.id === state.selectedProjectId) : null;
  return current ? renderProjectDetail(current) : renderProjectList(projects);
}

function renderProjectList(projects) {
  const active = projects.filter((p) => p.status !== "completed" && projectProgress(p).pct < 100).length;
  const dueSoon = projects.filter((p) => {
    const d = projectDDay(p);
    return typeof d === "number" && d >= 0 && d <= 14;
  }).length;
  return `
    <div class="projects-view">
      <div class="workspace-header">
        <div>
          <h1>프로젝트</h1>
          <p class="muted">아이디어에서 키운 주제를 마일스톤·간트가 있는 진짜 프로젝트로 운영합니다.</p>
        </div>
        <div class="focus-summary" aria-label="Project summary">
          <span><strong>${projects.length}</strong> 전체</span>
          <span><strong>${active}</strong> 진행</span>
          <span><strong>${dueSoon}</strong> 임박</span>
        </div>
      </div>
      <div class="project-list-actions">
        <button class="primary-button" data-project-new>+ 새 프로젝트</button>
      </div>
      ${
        projects.length
          ? `<div class="project-card-grid">${projects.map(renderProjectListCard).join("")}</div>`
          : `<div class="idea-empty">
              <h2>아직 프로젝트가 없어요.</h2>
              <p class="muted">아이디어 탭에서 주제를 "프로젝트로 만들기" 하거나, 위 버튼으로 새로 시작하세요.</p>
            </div>`
      }
    </div>
  `;
}

function renderProjectListCard(project) {
  const prog = projectProgress(project);
  const d = projectDDay(project);
  const dLabel = d === null ? "목표일 미정" : d < 0 ? `D+${Math.abs(d)}` : `D-${d}`;
  return `
    <article class="project-card" data-open-project="${project.id}">
      <div class="project-card-head">
        <span class="project-card-no">${escapeHtml(project.no || "PRJ 미지정")}</span>
        <span class="chip ${project.status}">${PROJECT_STATUS_LABEL[project.status] || "진행"}</span>
      </div>
      <h2 class="project-card-title">${escapeHtml(project.title || "제목 없는 프로젝트")}</h2>
      <div class="progress"><span style="width:${prog.pct}%"></span></div>
      <div class="project-card-metrics">
        <span><strong>${prog.pct}%</strong> 완료</span>
        <span><strong>${prog.open}</strong> 남음</span>
        <span><strong>${(project.milestones || []).length}</strong> 마일스톤</span>
        <span><strong>${dLabel}</strong></span>
      </div>
      ${project.goal ? `<p class="project-card-goal">${escapeHtml(project.goal)}</p>` : ""}
    </article>
  `;
}

function renderProjectDetail(project) {
  const prog = projectProgress(project);
  const d = projectDDay(project);
  const dLabel = d === null ? "목표일 미정" : d < 0 ? `D+${Math.abs(d)} 지남` : `D-${d}`;
  const milestones = project.milestones || [];
  const tasks = orderedProjectTasks(project.tasks || []);
  return `
    <div class="projects-view project-detail">
      <button class="ghost-button" data-project-back>← 프로젝트 목록</button>
      <div class="project-detail-head">
        <div class="project-detail-titles">
          <input class="project-no-input" data-project-field="no" data-project-id="${project.id}" value="${escapeHtml(project.no)}" placeholder="PRJ-000" aria-label="프로젝트 번호" />
          <input class="project-title-input" data-project-field="title" data-project-id="${project.id}" value="${escapeHtml(project.title)}" placeholder="프로젝트 제목" aria-label="프로젝트 제목" />
        </div>
        <div class="project-detail-controls">
          <select class="project-status-select" data-project-field="status" data-project-id="${project.id}" aria-label="상태">
            ${Object.entries(PROJECT_STATUS_LABEL).map(([k, l]) => `<option value="${k}" ${project.status === k ? "selected" : ""}>${l}</option>`).join("")}
          </select>
          <label class="project-date-label">목표일 <input type="date" data-project-field="targetDate" data-project-id="${project.id}" value="${project.targetDate}" /></label>
          <span class="project-dday">${dLabel}</span>
        </div>
      </div>
      <div class="progress big"><span style="width:${prog.pct}%"></span></div>
      <div class="project-detail-metrics">
        <span><strong>${prog.pct}%</strong> 완료</span>
        <span><strong>${prog.done}/${prog.total}</strong> 할 일</span>
        <span><strong>${milestones.length}</strong> 마일스톤</span>
      </div>

      ${renderGantt(project)}

      <section class="project-section">
        <div class="project-section-head"><h3>마일스톤</h3><button class="small-button" data-ms-add="${project.id}">+ 마일스톤</button></div>
        ${milestones.length ? `<div class="ms-list">${milestones.map((m) => renderMilestoneRow(project, m)).join("")}</div>` : `<p class="muted">마일스톤을 추가하고 시작·종료 날짜를 넣으면 위 간트에 막대로 표시돼요.</p>`}
      </section>

      <section class="project-section">
        <div class="project-section-head"><h3>할 일</h3></div>
        <div class="ptask-list" data-ptask-list="${project.id}">
          ${tasks.length ? tasks.map((t) => renderProjectTaskRow(project, t)).join("") : `<div class="sub-empty muted">아래에 할 일을 추가하세요.</div>`}
        </div>
        <input class="sub-add-input" data-ptask-add="${project.id}" type="text" placeholder="+ 할 일 추가 (Enter · 여러 줄 붙여넣기 가능)" aria-label="할 일 추가" />
      </section>

      <div class="project-goal-block">
        <label>목표</label>
        <textarea class="project-goal-input" data-project-field="goal" data-project-id="${project.id}" rows="2" placeholder="이 프로젝트의 목표를 한 줄로 적어두세요.">${escapeHtml(project.goal)}</textarea>
      </div>

      <div class="project-detail-foot">
        <button class="small-button danger" data-project-delete="${project.id}">프로젝트 삭제</button>
      </div>
    </div>
  `;
}

function renderMilestoneRow(project, ms) {
  return `
    <div class="ms-row" data-ms-id="${ms.id}" data-project-id="${project.id}">
      <span class="ms-dot ms-${ms.status}" aria-hidden="true"></span>
      <input class="ms-name" data-ms-field="title" data-ms-id="${ms.id}" data-project-id="${project.id}" value="${escapeHtml(ms.title)}" placeholder="마일스톤 이름" aria-label="마일스톤 이름" />
      <input class="ms-date-input" type="date" data-ms-field="start" data-ms-id="${ms.id}" data-project-id="${project.id}" value="${ms.start}" aria-label="시작일" />
      <span class="ms-dash">–</span>
      <input class="ms-date-input" type="date" data-ms-field="end" data-ms-id="${ms.id}" data-project-id="${project.id}" value="${ms.end}" aria-label="종료일" />
      <select class="ms-status" data-ms-field="status" data-ms-id="${ms.id}" data-project-id="${project.id}" aria-label="마일스톤 상태">
        <option value="planned" ${ms.status === "planned" ? "selected" : ""}>예정</option>
        <option value="active" ${ms.status === "active" ? "selected" : ""}>진행</option>
        <option value="done" ${ms.status === "done" ? "selected" : ""}>완료</option>
      </select>
      <button class="sub-act ghost" data-ms-delete="${ms.id}" data-project-id="${project.id}" aria-label="마일스톤 삭제">✕</button>
    </div>
  `;
}

function renderProjectTaskRow(project, task) {
  return `
    <div class="sub-item ${task.done ? "done" : ""}" data-ptask-id="${task.id}" data-project-id="${project.id}">
      <span class="sub-grip" data-ptask-grip="${task.id}" data-project-id="${project.id}" title="끌어서 순서 변경" aria-hidden="true">⠿</span>
      <button class="sub-check ${task.done ? "on" : ""}" data-ptask-toggle="${task.id}" data-project-id="${project.id}" role="checkbox" aria-checked="${task.done}" aria-label="완료"></button>
      <input class="sub-text" data-ptask-text="${task.id}" data-project-id="${project.id}" value="${escapeHtml(task.text)}" aria-label="할 일 수정" />
      ${task.fromIdea ? `<span class="task-from" title="아이디어에서 넘어왔어요">↳ 아이디어</span>` : ""}
      <select class="task-ms-select" data-ptask-ms="${task.id}" data-project-id="${project.id}" aria-label="마일스톤 지정">
        <option value="">— 마일스톤</option>
        ${(project.milestones || []).map((m) => `<option value="${m.id}" ${task.milestoneId === m.id ? "selected" : ""}>${escapeHtml(m.title || "(제목 없음)")}</option>`).join("")}
      </select>
      ${task.done ? "" : `<button class="sub-act ptask-today" data-ptask-today="${task.id}" data-project-id="${project.id}" title="오늘 할 일로 보내기" aria-label="Today로 보내기">→ Today</button>`}
      <button class="sub-act ghost" data-ptask-delete="${task.id}" data-project-id="${project.id}" aria-label="삭제">✕</button>
    </div>
  `;
}

function renderGantt(project) {
  const gantt = computeGantt(project);
  if (!gantt.hasGantt) {
    return `
      <section class="project-section">
        <div class="project-section-head"><h3>타임라인</h3></div>
        <p class="muted">마일스톤에 시작·종료 날짜를 넣으면 여기에 간트 차트가 그려져요.</p>
      </section>`;
  }
  return `
    <section class="project-section gantt-section">
      <div class="project-section-head"><h3>타임라인</h3>${project.targetDate ? `<span class="muted">목표 ${formatMonthDay(project.targetDate)}</span>` : ""}</div>
      <div class="gantt">
        <div class="gantt-months">${gantt.months.map((m) => `<span style="left:${m.leftPct}%">${m.label}</span>`).join("")}</div>
        <div class="gantt-tracks">
          ${gantt.bars
            .map(
              (b) => `
            <div class="gantt-row">
              <div class="gantt-label">${escapeHtml(b.title || "(제목 없음)")} <span class="gantt-date">${formatMonthDay(b.start)}–${formatMonthDay(b.end)}</span></div>
              <div class="gantt-track"><div class="gantt-bar ms-${b.status}" style="left:${b.leftPct}%;width:${b.widthPct}%"></div></div>
            </div>`,
            )
            .join("")}
          <div class="gantt-today" style="left:${gantt.todayPct}%"><span>오늘</span></div>
          ${gantt.targetPct !== null ? `<div class="gantt-target" style="left:${gantt.targetPct}%"></div>` : ""}
        </div>
      </div>
    </section>
  `;
}

function projectProgress(project) {
  const tasks = project.tasks || [];
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  return { total, done, open: total - done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function projectDDay(project) {
  return project.targetDate ? daysUntil(project.targetDate) : null;
}

function orderedProjectTasks(tasks) {
  return [...tasks.filter((t) => !t.done), ...tasks.filter((t) => t.done)];
}

function formatMonthDay(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey || "")) return "";
  return `${Number(dateKey.slice(5, 7))}/${Number(dateKey.slice(8, 10))}`;
}

function computeGantt(project) {
  const bars = (project.milestones || []).filter((m) => m.start && m.end && m.end >= m.start);
  if (!bars.length) return { hasGantt: false };
  const today = getTodayKey();
  const starts = [...bars.map((m) => m.start), today];
  const ends = [...bars.map((m) => m.end), today];
  if (project.targetDate) ends.push(project.targetDate);
  if (project.startDate) starts.push(project.startDate);
  let rangeStart = starts.slice().sort()[0];
  let rangeEnd = ends.slice().sort().slice(-1)[0];
  const rawSpan = Math.max(1, daysBetween(rangeStart, rangeEnd));
  const pad = Math.max(2, Math.round(rawSpan * 0.05));
  rangeStart = addDays(rangeStart, -pad);
  rangeEnd = addDays(rangeEnd, pad);
  const total = Math.max(1, daysBetween(rangeStart, rangeEnd));
  const pct = (dateKey) => Math.max(0, Math.min(100, (daysBetween(rangeStart, dateKey) / total) * 100));
  return {
    hasGantt: true,
    bars: bars.map((m) => ({ ...m, leftPct: pct(m.start), widthPct: Math.max(2, pct(m.end) - pct(m.start)) })),
    months: ganttMonths(rangeStart, rangeEnd, pct),
    todayPct: pct(today),
    targetPct: project.targetDate ? pct(project.targetDate) : null,
  };
}

function ganttMonths(rangeStart, rangeEnd, pct) {
  const months = [];
  let year = Number(rangeStart.slice(0, 4));
  let month = Number(rangeStart.slice(5, 7));
  for (let i = 0; i < 36; i++) {
    const key = `${year}-${String(month).padStart(2, "0")}-01`;
    if (key > rangeEnd) break;
    if (key >= rangeStart || months.length === 0) {
      months.push({ label: `${month}월`, leftPct: pct(key < rangeStart ? rangeStart : key) });
    }
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return months;
}

function findProject(id) {
  return state.projects.find((p) => p.id === id);
}

async function persistProject(project) {
  project.updatedAt = new Date().toISOString();
  await repository.upsertProjects([project]);
  saveUiState();
  render();
}

function suggestProjectNo() {
  const nums = state.projects
    .map((p) => Number((p.no || "").match(/(\d+)/)?.[1]))
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `PRJ-${String(next).padStart(3, "0")}`;
}

async function createProject() {
  const now = new Date().toISOString();
  const project = normalizeProject({
    id: uid("prj"),
    no: suggestProjectNo(),
    title: "새 프로젝트",
    status: "active",
    createdAt: now,
    updatedAt: now,
    sortOrder: Date.now(),
  });
  state.projects = [...state.projects, project];
  state.selectedProjectId = project.id;
  await repository.upsertProjects([project]);
  saveUiState();
  render();
}

function openProject(id) {
  state.selectedProjectId = id;
  render();
}

function closeProjectDetail() {
  state.selectedProjectId = null;
  render();
}

async function updateProjectField(id, field, value) {
  const project = findProject(id);
  if (!project) return;
  let next = value;
  if (field === "targetDate") next = cleanDateValue(value);
  if (field === "status" && !PROJECT_STATUS_LABEL[value]) return;
  if (field === "no" || field === "title" || field === "goal") next = String(value);
  if (project[field] === next) return;
  project[field] = next;
  await persistProject(project);
}

async function deleteProjectById(id) {
  state.projects = state.projects.filter((p) => p.id !== id);
  state.selectedProjectId = null;
  await repository.deleteProject(id);
  saveUiState();
  render();
}

async function addMilestone(projectId) {
  const project = findProject(projectId);
  if (!project) return;
  project.milestones = [...(project.milestones || []), { id: uid("ms"), title: "", start: "", end: "", status: "planned" }];
  await persistProject(project);
}

async function updateMilestone(projectId, msId, field, value) {
  const project = findProject(projectId);
  const ms = project?.milestones?.find((m) => m.id === msId);
  if (!ms) return;
  let next = value;
  if (field === "start" || field === "end") next = cleanDateValue(value);
  if (field === "status" && !["planned", "active", "done"].includes(value)) return;
  if (ms[field] === next) return;
  ms[field] = next;
  await persistProject(project);
}

async function deleteMilestone(projectId, msId) {
  const project = findProject(projectId);
  if (!project) return;
  project.milestones = (project.milestones || []).filter((m) => m.id !== msId);
  (project.tasks || []).forEach((t) => {
    if (t.milestoneId === msId) t.milestoneId = null;
  });
  await persistProject(project);
}

async function addProjectTask(projectId, text) {
  const project = findProject(projectId);
  if (!project) return;
  const lines = String(text).split("\n").map(normalizeLine).filter(Boolean);
  if (!lines.length) return;
  project.tasks = [
    ...(project.tasks || []),
    ...lines.map((line) => ({ id: uid("ptask"), text: line, done: false, milestoneId: null, fromIdea: false })),
  ];
  await persistProject(project);
}

async function toggleProjectTask(projectId, taskId) {
  const project = findProject(projectId);
  const task = project?.tasks?.find((t) => t.id === taskId);
  if (!task) return;
  task.done = !task.done;
  await persistProject(project);
}

async function updateProjectTaskText(projectId, taskId, text) {
  const project = findProject(projectId);
  const task = project?.tasks?.find((t) => t.id === taskId);
  const next = text.trim();
  if (!task || !next || next === task.text) return;
  task.text = next;
  await persistProject(project);
}

// 프로젝트 할 일 → Today: surface a project task in the daily flow as a today
// task (project work was previously siloed from Today). Keeps the project task
// intact; creates a linked Today item at the current time block.
async function projectTaskToToday(projectId, taskId) {
  const project = findProject(projectId);
  const task = project?.tasks?.find((t) => t.id === taskId);
  if (!task) return;
  const now = new Date().toISOString();
  const item = normalizeItem({
    id: uid("item"),
    text: task.text,
    date: getTodayKey(),
    status: "open",
    type: "task",
    timeBlock: currentTimeBlockKey(),
    context: "company",
    dailyPriority: "secondary",
    keywords: tokenize(`${project.no || ""} ${project.title || ""} ${task.text}`),
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  });
  state.items = [item, ...state.items];
  await repository.upsertItems([item]);
  saveUiState();
  setToast(`Today로 보냈어요 · ${TIME_BLOCK_LABEL[item.timeBlock]?.replace(/^[\d-]+\s*/, "") || "오늘"}`);
  render();
}

async function deleteProjectTask(projectId, taskId) {
  const project = findProject(projectId);
  if (!project) return;
  project.tasks = (project.tasks || []).filter((t) => t.id !== taskId);
  await persistProject(project);
}

async function setProjectTaskMilestone(projectId, taskId, msId) {
  const project = findProject(projectId);
  const task = project?.tasks?.find((t) => t.id === taskId);
  if (!task) return;
  task.milestoneId = msId || null;
  await persistProject(project);
}

async function reorderProjectTask(projectId, taskId, beforeId) {
  const project = findProject(projectId);
  if (!Array.isArray(project?.tasks)) return;
  const arr = project.tasks;
  const from = arr.findIndex((t) => t.id === taskId);
  if (from < 0) return;
  const [moved] = arr.splice(from, 1);
  let to = beforeId ? arr.findIndex((t) => t.id === beforeId) : arr.length;
  if (to < 0) to = arr.length;
  arr.splice(to, 0, moved);
  await persistProject(project);
}

function bindProjectEvents() {
  document.querySelector("[data-project-new]")?.addEventListener("click", createProject);
  document.querySelector("[data-project-back]")?.addEventListener("click", closeProjectDetail);

  document.querySelectorAll("[data-open-project]").forEach((card) => {
    card.addEventListener("click", () => openProject(card.dataset.openProject));
  });

  document.querySelectorAll("[data-project-field]").forEach((input) => {
    const field = input.dataset.projectField;
    const id = input.dataset.projectId;
    const handler = () => updateProjectField(id, field, input.value);
    if (input.tagName === "SELECT" || input.type === "date") {
      input.addEventListener("change", handler);
    } else {
      input.addEventListener("change", handler);
      input.addEventListener("blur", handler);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && input.tagName !== "TEXTAREA") {
          event.preventDefault();
          input.blur();
        }
      });
    }
  });

  document.querySelector("[data-project-delete]")?.addEventListener("click", (event) => {
    deleteProjectById(event.currentTarget.dataset.projectDelete);
  });

  document.querySelector("[data-ms-add]")?.addEventListener("click", (event) => {
    addMilestone(event.currentTarget.dataset.msAdd);
  });

  document.querySelectorAll("[data-ms-field]").forEach((input) => {
    const handler = () => updateMilestone(input.dataset.projectId, input.dataset.msId, input.dataset.msField, input.value);
    if (input.tagName === "SELECT" || input.type === "date") {
      input.addEventListener("change", handler);
    } else {
      input.addEventListener("change", handler);
      input.addEventListener("blur", handler);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        }
      });
    }
  });

  document.querySelectorAll("[data-ms-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteMilestone(button.dataset.projectId, button.dataset.msDelete));
  });

  document.querySelectorAll("[data-ptask-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleProjectTask(button.dataset.projectId, button.dataset.ptaskToggle));
  });

  document.querySelectorAll("[data-ptask-text]").forEach((input) => {
    input.addEventListener("change", () => updateProjectTaskText(input.dataset.projectId, input.dataset.ptaskText, input.value));
    input.addEventListener("blur", () => updateProjectTaskText(input.dataset.projectId, input.dataset.ptaskText, input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        input.blur();
      }
    });
  });

  document.querySelectorAll("[data-ptask-ms]").forEach((select) => {
    select.addEventListener("change", () => setProjectTaskMilestone(select.dataset.projectId, select.dataset.ptaskMs, select.value));
  });

  document.querySelectorAll("[data-ptask-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteProjectTask(button.dataset.projectId, button.dataset.ptaskDelete));
  });

  document.querySelectorAll("[data-ptask-today]").forEach((button) => {
    button.addEventListener("click", () => projectTaskToToday(button.dataset.projectId, button.dataset.ptaskToday));
  });

  document.querySelectorAll("[data-ptask-add]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const value = input.value;
        input.value = "";
        addProjectTask(input.dataset.ptaskAdd, value);
      }
    });
    input.addEventListener("paste", (event) => {
      const pasted = event.clipboardData?.getData("text") || "";
      if (pasted.includes("\n")) {
        event.preventDefault();
        const merged = (input.value || "") + pasted;
        input.value = "";
        addProjectTask(input.dataset.ptaskAdd, merged);
      }
    });
  });

  document.querySelectorAll("[data-ptask-grip]").forEach((grip) => {
    grip.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const row = grip.closest(".sub-item");
      if (!row) return;
      event.preventDefault();
      beginProjectTaskDrag(row, event);
    });
  });
}

function beginProjectTaskDrag(row, event) {
  projectTaskDrag = {
    projectId: row.dataset.projectId,
    taskId: row.dataset.ptaskId,
    row,
    list: row.closest(".ptask-list"),
    startY: event.clientY,
    active: false,
    dropBeforeId: undefined,
  };
  window.addEventListener("pointermove", handleProjectTaskMove, { passive: false });
  window.addEventListener("pointerup", handleProjectTaskUp);
  window.addEventListener("pointercancel", handleProjectTaskUp);
}

function handleProjectTaskMove(event) {
  const drag = projectTaskDrag;
  if (!drag) return;
  if (!drag.active && Math.abs(event.clientY - drag.startY) < 5) return;
  if (event.cancelable) event.preventDefault();
  if (!drag.active) {
    drag.active = true;
    drag.row.classList.add("dragging");
    document.body.classList.add("sub-dragging");
  }
  clearSubMarkers();
  drag.row.classList.add("drag-probe");
  const el = document.elementFromPoint(event.clientX, event.clientY);
  drag.row.classList.remove("drag-probe");
  const overRow = el?.closest?.(".sub-item");
  if (!overRow || !drag.list?.contains(overRow) || overRow === drag.row) return;
  const rect = overRow.getBoundingClientRect();
  if (event.clientY > rect.top + rect.height / 2) {
    overRow.classList.add("drop-after");
    const rows = [...drag.list.querySelectorAll(".sub-item")].filter((r) => r !== drag.row);
    const idx = rows.indexOf(overRow);
    drag.dropBeforeId = rows[idx + 1]?.dataset.ptaskId || null;
  } else {
    overRow.classList.add("drop-before");
    drag.dropBeforeId = overRow.dataset.ptaskId;
  }
}

function handleProjectTaskUp() {
  const drag = projectTaskDrag;
  cleanupProjectTaskDrag();
  if (!drag || !drag.active || drag.dropBeforeId === undefined) return;
  if (drag.dropBeforeId === drag.taskId) return;
  reorderProjectTask(drag.projectId, drag.taskId, drag.dropBeforeId);
}

function cleanupProjectTaskDrag() {
  window.removeEventListener("pointermove", handleProjectTaskMove);
  window.removeEventListener("pointerup", handleProjectTaskUp);
  window.removeEventListener("pointercancel", handleProjectTaskUp);
  document.body.classList.remove("sub-dragging");
  clearSubMarkers();
  projectTaskDrag?.row.classList.remove("dragging", "drag-probe");
  projectTaskDrag = null;
}

function buildProjectDashboard(threads) {
  const projects = threads
    .map((thread) => {
      const context = buildThreadSuggestionContext(thread);
      if (!isProjectThread(thread, context.meta)) return null;
      const nextItem = [...context.openItems].sort((a, b) => prioritySort(a, b))[0] || null;
      const daysLeft = context.meta.targetDate ? daysUntil(context.meta.targetDate) : null;
      return {
        ...context,
        nextItem,
        daysLeft,
        health: projectHealth(context.meta, context.openItems, context.blockedItems, daysLeft),
      };
    })
    .filter(Boolean)
    .sort(projectSort);

  return {
    projects,
    total: projects.length,
    active: projects.filter((project) => project.health.key === "active").length,
    blocked: projects.filter((project) => project.health.key === "blocked").length,
    dueSoon: projects.filter((project) => ["due-soon", "late"].includes(project.health.key)).length,
  };
}

function projectSort(a, b) {
  const healthRank = { blocked: 0, late: 1, "due-soon": 2, active: 3, incubating: 4, completed: 5 };
  const byHealth = (healthRank[a.health.key] ?? 9) - (healthRank[b.health.key] ?? 9);
  if (byHealth) return byHealth;
  const aDate = a.meta.targetDate || "9999-99-99";
  const bDate = b.meta.targetDate || "9999-99-99";
  if (aDate !== bDate) return aDate.localeCompare(bDate);
  return (a.meta.projectNo || a.thread.title).localeCompare(b.meta.projectNo || b.thread.title);
}

function projectHealth(meta, openItems, blockedItems, daysLeft) {
  if (meta.status === "completed" || !openItems.length) return { key: "completed", label: "완료" };
  if (blockedItems.length) return { key: "blocked", label: "막힘" };
  if (typeof daysLeft === "number" && daysLeft < 0) return { key: "late", label: "지연" };
  if (typeof daysLeft === "number" && daysLeft <= 14) return { key: "due-soon", label: "임박" };
  if (meta.status === "incubating") return { key: "incubating", label: "준비" };
  return { key: "active", label: "진행" };
}

function daysUntil(dateKey, fromDateKey = getTodayKey()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))) return null;
  const target = new Date(`${dateKey}T00:00:00`);
  const from = new Date(`${fromDateKey}T00:00:00`);
  return Math.round((target.getTime() - from.getTime()) / 86400000);
}

function renderProjectDashboardCard(project) {
  const { thread, meta, openItems, blockedItems, doneItems, nextItem, daysLeft, health } = project;
  const targetLabel = projectTargetLabel(meta.targetDate, daysLeft);
  return `
    <article class="project-dashboard-card">
      <div class="project-dashboard-header">
        <div>
          <div class="thread-meta">${escapeHtml(meta.projectNo || "PRJ 미지정")}</div>
          <h2>${escapeHtml(thread.title)}</h2>
        </div>
        <span class="project-health ${health.key}">${health.label}</span>
      </div>
      <div class="progress"><span style="width:${thread.completionRate}%"></span></div>
      <div class="project-dashboard-metrics">
        <span><strong>${thread.completionRate}%</strong> 완료</span>
        <span><strong>${openItems.length}</strong> 열림</span>
        <span><strong>${blockedItems.length}</strong> 막힘</span>
        <span><strong>${targetLabel.short}</strong> 목표</span>
      </div>
      <div class="project-dashboard-body">
        <div>
          <span>목표</span>
          <p>${escapeHtml(meta.goal || "Project Brief에서 목표를 한 줄로 고정해보세요.")}</p>
        </div>
        <div>
          <span>다음 마일스톤</span>
          <p>${escapeHtml(meta.milestone || nextItem?.text || "다음 체크포인트를 정하면 대시보드가 더 선명해져요.")}</p>
        </div>
      </div>
      <div class="project-next-action">
        <div>
          <span>다음 행동</span>
          <p>${nextItem ? escapeHtml(nextItem.text) : "남은 액션이 없어요."}</p>
          <small>${targetLabel.detail}</small>
        </div>
        <div class="project-action-buttons">
          ${nextItem ? `<button class="small-button" data-toggle="${nextItem.id}">완료</button>` : ""}
          ${nextItem && nextItem.lane !== "now" ? `<button class="small-button" data-move-lane="now" data-item-id="${nextItem.id}">지금</button>` : ""}
          <button class="small-button" data-thread="${thread.id}">상세</button>
        </div>
      </div>
      <div class="chip-row">
        <span class="chip">${doneItems.length} done</span>
        <span class="chip ${meta.status}">${PROJECT_STATUS_LABEL[meta.status] || PROJECT_STATUS_LABEL.active}</span>
        ${thread.keywords.slice(0, 3).map((keyword) => `<span class="chip">#${escapeHtml(keyword)}</span>`).join("")}
      </div>
    </article>
  `;
}

function projectTargetLabel(targetDate, daysLeft) {
  if (!targetDate) return { short: "미정", detail: "목표일이 아직 없어요." };
  if (typeof daysLeft !== "number") return { short: targetDate, detail: targetDate };
  if (daysLeft < 0) return { short: `${Math.abs(daysLeft)}일 지연`, detail: `${targetDate} 목표일을 지났어요.` };
  if (daysLeft === 0) return { short: "오늘", detail: `${targetDate} 오늘이 목표일이에요.` };
  return { short: `D-${daysLeft}`, detail: `${targetDate}까지 ${daysLeft}일 남았어요.` };
}

// Learning cultivation lanes — mirror the 재배 board (씨앗→구체화→개발) so the
// two tabs read as siblings. A certificate "track" is placed by its progress.
const LEARNING_LANES = ["now", "next", "build"];
const LEARNING_LANE_LABEL = { now: "배울 거리", next: "익히는 중", build: "체화" };
const LEARNING_LANE_SUB = {
  now: "아직 시작 전 · 후보",
  next: "지금 진행 중",
  build: "끝낸 것 · 복습으로 유지",
};

function learningTrackProgress(track) {
  const courses = track.courses || [];
  if (!courses.length) return 0;
  const done = courses.filter((c) => c.status === "done").length;
  return Math.round((done / courses.length) * 100);
}

function learningTrackLane(track) {
  const courses = track.courses || [];
  if (!courses.length) return "now";
  const done = courses.filter((c) => c.status === "done").length;
  const active = courses.filter((c) => c.status === "active").length;
  if (done === courses.length) return "build";
  if (done === 0 && active === 0) return "now";
  return "next";
}

function renderLearningDashboard(threads = []) {
  const tracks = normalizeLearningTracks(state.learningTracks);
  const sessions = normalizeLearningSessions(state.learningSessions);
  const summary = buildLearningSummary(tracks);
  const reviewQueue = buildSpacedReviewQueue(sessions, tracks);

  // Project-style detail when a certificate is opened.
  if (state.selectedLearningTrackId) {
    const track = tracks.find((t) => t.id === state.selectedLearningTrackId);
    if (track) return renderLearningTrackDetail(track, sessions);
  }

  const conceptBank = buildConceptBank(sessions, tracks);
  const coach = buildLearningCoach(summary, conceptBank, tracks, sessions);
  const weeklyPlan = buildWeeklyLearningPlan(tracks, Number(state.learningWeeklyHours || 12));
  const dashboard = buildLearningDashboardInsights(tracks, sessions, summary, reviewQueue);
  const nextSeeds = state.learningSeedSuggestions || createLocalLearningSeedSuggestions(tracks, sessions, summary, conceptBank);

  return `
    <div class="learning-view cultivation">
      <div class="workspace-header">
        <div>
          <h1>학습</h1>
          <p class="muted">배울 거리에서 체화까지 — 스킬이 자라는 흐름 · ${summary.active}개 진행 중</p>
        </div>
      </div>

      <div class="learning-metric-strip learning-metric-strip-3">
        <div class="learning-metric"><div class="lm-v">${summary.completionRate}%</div><div class="lm-l">완료</div></div>
        <div class="learning-metric"><div class="lm-v">${reviewQueue.length}</div><div class="lm-l">복습 due</div></div>
        <div class="learning-metric"><div class="lm-v">${summary.daysLeft ? "D-" + summary.daysLeft : "—"}</div><div class="lm-l">cert 목표</div></div>
      </div>

      ${renderLearningPaceBar(summary)}

      ${renderLearningTodayPick(dashboard)}
      ${renderLearningBoard(tracks, nextSeeds, reviewQueue)}

      <details class="learning-secondary">
        <summary>이번 주 계획</summary>
        <div class="learning-secondary-body">
          ${renderWeeklyLearningPlanner(weeklyPlan)}
          ${renderLearningCoach(coach)}
        </div>
      </details>

      <details class="learning-secondary">
        <summary>복습 &amp; 인사이트</summary>
        <div class="learning-secondary-body">
          <div class="learning-insight-grid">
            ${renderConceptBank(conceptBank)}
            ${renderSpacedReviewQueue(reviewQueue)}
          </div>
        </div>
      </details>
    </div>
  `;
}

// Unified weekly pace — required (computed) vs available (inline-editable),
// replacing the bald "62.5h 주 필요" metric that gave no context or action.
function renderLearningPaceBar(summary) {
  const required = Number(summary.weeklyHours) || 0;
  const available = Number(state.learningWeeklyHours || 12);
  const gap = available - required;
  const gapAbs = Math.abs(gap).toFixed(1);
  const behind = gap < -0.05;
  const paceState = behind ? "behind" : "ok";
  const gapLabel = behind ? `${gapAbs}h 부족` : `${gapAbs}h 여유`;
  return `
    <div class="learning-pace-bar ${paceState}">
      <div class="lpb-main">
        <span class="lpb-eyebrow">이번 주 페이스</span>
        <span class="lpb-nums">필요 <strong>${required.toFixed(1)}h</strong> · 가능 <input class="lpb-input" type="number" min="1" step="1" value="${available}" data-learning-weekly-hours aria-label="이번 주 가능 시간" />h</span>
      </div>
      <span class="lpb-gap ${paceState}">${behind ? "⚠" : "✓"} ${gapLabel}</span>
    </div>
  `;
}

function renderLearningTodayPick(dashboard) {
  const rec = dashboard.recommendation;
  if (!rec) return "";
  const isModule = Boolean(rec.module);
  const title = isModule ? rec.module.title : rec.course.title;
  const meta = isModule ? `${rec.track.code} · ${rec.course.title}` : `${rec.track.code} · course 단위`;
  return `
    <section class="learning-todaypick">
      <div class="focus-eyebrow">Today Pick</div>
      <div class="learning-todaypick-row">
        <div class="learning-todaypick-text">
          <h2>${escapeHtml(title)}</h2>
          <p class="muted">${escapeHtml(meta)}</p>
        </div>
        <button class="small-button" data-learning-open-track="${rec.track.id}">상세 →</button>
      </div>
    </section>
  `;
}

function renderLearningBoard(tracks, nextSeeds, reviewQueue) {
  const seeds = (nextSeeds?.seeds || []).slice(0, 4);
  const lanes = { now: [], next: [], build: [] };
  tracks.forEach((t) => lanes[learningTrackLane(t)].push(t));

  // 체화 harvest: courses finished inside certs that aren't fully done yet —
  // gives the lane real content (and the 🌱 재배로 bridge a home) long before a
  // whole certificate completes.
  const harvest = tracks
    .filter((t) => learningTrackLane(t) !== "build")
    .flatMap((t) => (t.courses || []).filter((c) => c.status === "done").map((c) => ({ track: t, course: c })));

  const columns = LEARNING_LANES.map((lane) => {
    const certCards = lanes[lane].map((t) => renderLearningCertCard(t)).join("");
    const seedCards = lane === "now" ? seeds.map((s, i) => renderLearningSeedChip(s, i)).join("") : "";
    const harvestCards = lane === "build" ? harvest.map((h) => renderLearningHarvestChip(h.track, h.course)).join("") : "";
    const aiExpand = lane === "now" ? `<button class="learning-ai-expand" data-learning-ai-seeds title="AI로 학습 씨앗 더 제안받기">+ AI로 더 제안</button>` : "";
    const reviewChip =
      lane === "build" && reviewQueue.length
        ? `<button class="learning-review-chip" data-learning-open-review>복습 due ${reviewQueue.length}개 — 보기 →</button>`
        : "";
    const count = lanes[lane].length + (lane === "now" ? seeds.length : 0) + (lane === "build" ? harvest.length : 0);
    const body = certCards + harvestCards + seedCards + aiExpand + reviewChip;
    return `
      <section class="board-column lane-${lane}">
        <div class="board-column-header">
          <div class="board-column-title">
            <span class="board-column-dot lane-dot-${lane}" aria-hidden="true"></span>
            <h2>${LEARNING_LANE_LABEL[lane]}</h2>
            <span class="board-column-sub">${LEARNING_LANE_SUB[lane]}</span>
          </div>
          <span class="chip ${lane}">${count}</span>
        </div>
        <div class="board-card-list">
          ${body || `<div class="board-empty">비어 있음</div>`}
        </div>
      </section>
    `;
  }).join(`<div class="flow-arrow" aria-hidden="true">→</div>`);

  return `<div class="cultivation-flow">${columns}</div>`;
}

function renderLearningCertCard(track) {
  const pct = learningTrackProgress(track);
  const lane = learningTrackLane(track);
  const d = daysUntil(track.targetDate);
  const dLabel = d == null ? "" : d < 0 ? `D+${Math.abs(d)}` : `D-${d}`;
  const courses = track.courses || [];
  const done = courses.filter((c) => c.status === "done").length;
  return `
    <article class="board-card learning-cert board-lane-${lane}" data-learning-open-track="${track.id}" title="클릭 — 로드맵·마일스톤 상세">
      <div class="learning-cert-top">
        <span class="learning-cert-badge">◆ CERT</span>
        ${dLabel ? `<span class="learning-cert-dday">${dLabel}</span>` : ""}
      </div>
      <div class="board-card-title">${escapeHtml(track.title)}</div>
      <div class="thread-meta">${escapeHtml(track.platform || "")} · ${done}/${courses.length} course</div>
      <div class="progress compact"><span style="width:${pct}%"></span></div>
      <div class="learning-cert-foot">${pct}% · 클릭하여 로드맵 →</div>
    </article>
  `;
}

function renderLearningSeedChip(seed, index) {
  return `
    <article class="board-card learning-seed-chip board-lane-now">
      <div class="board-card-title">${escapeHtml(seed.title)}</div>
      <div class="learning-seed-chip-foot">
        <span class="thread-meta">${escapeHtml(seed.branchLabel || seed.branch || "Learning")}</span>
        <button class="mini-seed-btn" data-learning-seed-idea="${index}" title="아이디어로 보내기" aria-label="아이디어로 보내기">💡</button>
      </div>
    </article>
  `;
}

// 체화 harvest chip — a finished course, with the 🌱 재배로 bridge.
function renderLearningHarvestChip(track, course) {
  return `
    <article class="board-card learning-harvest board-lane-build">
      <div class="learning-harvest-top">
        <span class="learning-harvest-check" aria-hidden="true">✓</span>
        <span class="board-card-title">${escapeHtml(course.title)}</span>
      </div>
      <div class="learning-harvest-foot">
        <span class="thread-meta">${escapeHtml(track.code)}</span>
        <button class="mini-seed-btn" data-learning-course-cultivation="${track.id}" data-course-id="${course.id}" title="재배 씨앗으로 — 적용·확장하기" aria-label="재배로 보내기">🌱</button>
      </div>
    </article>
  `;
}

// Project-style certificate detail — roadmap (gantt) + interactive course list.
function renderLearningTrackDetail(track, sessions) {
  const pct = learningTrackProgress(track);
  const courses = track.courses || [];
  const done = courses.filter((c) => c.status === "done").length;
  const active = courses.filter((c) => c.status === "active").length;
  const d = daysUntil(track.targetDate);
  const dLabel = d == null ? "목표일 미정" : d < 0 ? `D+${Math.abs(d)}` : `D-${d}`;
  const remainingDeepHours = courses.reduce((sum, c) => sum + remainingCourseHours(c), 0);
  const weeksLeft = Math.max(1, Math.ceil(Math.max(0, d || 0) / 7));
  const weeklyPace = (remainingDeepHours / weeksLeft).toFixed(1);

  return `
    <div class="learning-view learning-detail">
      <div class="workspace-header">
        <div class="learning-detail-head">
          <button class="ghost-button" data-learning-back>← 학습 보드</button>
          <div>
            <div class="thread-meta">${escapeHtml(track.code)} · ${escapeHtml(track.platform || "")}</div>
            <h1>${escapeHtml(track.title)}</h1>
          </div>
        </div>
        <div class="focus-summary" aria-label="Certificate summary">
          <span><strong>${pct}%</strong> 완료</span>
          <span><strong>${done}/${courses.length}</strong> course</span>
          <span><strong>${active}</strong> 진행</span>
          <span><strong>${dLabel}</strong> · ${weeklyPace}h/주</span>
        </div>
      </div>

      ${renderLearningRoadmap(track)}

      <div class="learning-grid">
        ${renderLearningTrack(track, { embedded: true })}
      </div>

      ${
        state.selectedLearningCourseKey && state.selectedLearningCourseKey.startsWith(`${track.id}::`)
          ? renderCourseDetail([track], sessions)
          : ""
      }

      ${renderLearningSessionForm([track])}
    </div>
  `;
}

// Gantt-like roadmap: each course is a bar, colored by status (planned→done).
function renderLearningRoadmap(track) {
  const courses = track.courses || [];
  if (!courses.length) return "";
  const rows = courses
    .map((course, index) => {
      const statusClass = course.status === "done" ? "done" : course.status === "active" ? "active" : "plan";
      const label = course.status === "done" ? "완료" : course.status === "active" ? "진행" : "예정";
      const width = courses.length ? Math.max(8, Math.round(100 / courses.length)) : 100;
      const left = courses.length ? Math.round((index / courses.length) * 100) : 0;
      return `
        <div class="lr-row">
          <span class="lr-name">${String(index + 1).padStart(2, "0")}. ${escapeHtml(course.title)}</span>
          <div class="lr-track">
            <div class="lr-bar lr-${statusClass}" style="left:${left}%;width:${width}%">${label}</div>
          </div>
        </div>
      `;
    })
    .join("");
  return `
    <section class="learning-roadmap">
      <div class="focus-eyebrow">로드맵 — course = 마일스톤</div>
      <div class="lr-grid">${rows}</div>
    </section>
  `;
}

function renderNextLearningSeeds(seedPack) {
  const seeds = (seedPack?.seeds || []).slice(0, 5);
  return `
    <section class="learning-seeds-panel">
      <div class="learning-seeds-header">
        <div>
          <div class="focus-eyebrow">Next Learning Seeds</div>
          <h2>현재 학습에서 다음 가지를 뻗기</h2>
          <p class="muted">${escapeHtml(seedPack?.summary || "완료한 course, 막힌 개념, 프로젝트 방향을 보고 다음 학습 후보를 제안합니다.")}</p>
        </div>
        <div class="learning-seeds-actions">
          <span class="chip">${escapeHtml(seedPack?.provider || AI_PROVIDER_LABEL.rules)}</span>
          ${renderAiProviderControls("learning-seeds")}
          <button class="small-button" data-learning-ai-seeds>AI로 확장</button>
        </div>
      </div>
      <div class="learning-seed-grid">
        ${
          seeds.length
            ? seeds.map((seed, index) => renderLearningSeedCard(seed, index)).join("")
            : `<div class="board-empty">추천할 학습 씨앗이 아직 없어요.</div>`
        }
      </div>
    </section>
  `;
}

function renderLearningSeedCard(seed, index) {
  const resources = (seed.resources || []).slice(0, 3);
  return `
    <article class="learning-seed-card ${seed.branch || "data"}">
      <div>
        <div class="thread-meta">${escapeHtml(seed.branchLabel || seed.branch || "Learning")} · ${escapeHtml(seed.level || "Next")}</div>
        <h3>${escapeHtml(seed.title)}</h3>
        <p>${escapeHtml(seed.why)}</p>
      </div>
      <div class="chip-row">
        <span class="chip">${escapeHtml(seed.estimatedHours || "6-10h")}</span>
        ${resources.map((resource) => `<span class="chip">${escapeHtml(resource)}</span>`).join("")}
      </div>
      <div class="learning-seed-actions">
        <button class="small-button" data-learning-seed-idea="${index}">아이디어로 저장</button>
      </div>
    </article>
  `;
}

function createLocalLearningSeedSuggestions(tracks, sessions, summary, conceptBank) {
  const context = buildLearningSeedContext(tracks, sessions, summary, conceptBank);
  const seeds = buildLocalLearningSeeds(context);
  return {
    provider: AI_PROVIDER_LABEL.rules,
    generatedAt: new Date().toISOString(),
    summary: learningSeedSummary(context, seeds),
    seeds,
  };
}

function buildLearningSeedContext(tracks, sessions, summary, conceptBank) {
  const courses = tracks.flatMap((track) => track.courses.map((course) => ({ track, course })));
  const modules = courses.flatMap(({ track, course }) =>
    (course.modules || []).map((module) => ({ track, course, module })),
  );
  const doneCourses = courses.filter(({ course }) => course.status === "done");
  const activeCourses = courses.filter(({ course }) => course.status === "active");
  const doneModules = modules.filter(({ module }) => module.status === "done");
  const activeModules = modules.filter(({ module }) => module.status === "active");
  const recentSessions = [...sessions].slice(0, 8);
  const textBlob = [
    ...doneCourses.map(({ course }) => course.title),
    ...activeCourses.map(({ course }) => course.title),
    ...doneModules.map(({ module }) => module.title),
    ...activeModules.map(({ module }) => module.title),
    ...recentSessions.flatMap((session) => [session.learned, ...(session.blockedConcepts || []), ...(session.reviewConcepts || [])]),
  ]
    .join(" ")
    .toLowerCase();

  return {
    tracks,
    sessions,
    summary,
    conceptBank,
    doneCourses,
    activeCourses,
    doneModules,
    activeModules,
    recentSessions,
    textBlob,
  };
}

function buildLocalLearningSeeds(context) {
  const candidates = [
    learningSeedCandidate("analysis-workflow", "Data Science", "재현 가능한 분석 워크플로우", "Jupyter, Git/GitHub, 폴더 구조, 실험 로그를 묶어 분석을 다시 실행 가능한 형태로 만드는 가지예요.", "Beginner+", "6-8h", ["Coursera", "YouTube", "Docs"], ["tool", "jupyter", "github", "methodology"], "data"),
    learningSeedCandidate("sql-analytics", "Data Science", "SQL for Analytics 심화", "데이터 사이언스 코스와 실제 프로젝트 사이를 가장 빠르게 이어주는 기본기예요. 집계, join, window function까지 확장하면 좋아요.", "Core", "10-14h", ["Coursera", "Mode", "Udemy"], ["sql", "database", "analysis", "join"], "data"),
    learningSeedCandidate("python-eda", "Data Science", "Python EDA 루틴", "pandas, visualization, notebook narrative를 하나의 반복 루틴으로 만들면 certificate 학습이 포트폴리오 재료로 바뀌어요.", "Core", "8-12h", ["Coursera", "Kaggle", "YouTube"], ["python", "pandas", "analysis", "visualization"], "data"),
    learningSeedCandidate("statistics-ml", "Data Science", "Statistics to Machine Learning 연결", "통계 개념을 회귀, 분류, 모델 평가로 연결하면 Google Advanced Analytics와 IBM ML course의 이해가 깊어져요.", "Intermediate", "12-18h", ["Coursera", "Book", "YouTube"], ["statistics", "regression", "machine", "model"], "data"),
    learningSeedCandidate("frontend-dashboard", "Front-end", "데이터 대시보드 UI 패턴", "학습한 분석 결과를 사용자가 한눈에 보는 화면으로 바꾸는 가지예요. SeedLog와 StructLens에도 바로 응용됩니다.", "Applied", "8-12h", ["Udemy", "YouTube", "Docs"], ["dashboard", "visualization", "front", "react"], "frontend"),
    learningSeedCandidate("backend-sqlite-sync", "Back-end", "Local-first 저장소와 동기화 설계", "Tauri, SQLite, migration, sync API를 이해하면 SeedLog 자체를 더 단단한 학습 프로젝트로 키울 수 있어요.", "Applied", "10-16h", ["Docs", "YouTube", "Udemy"], ["sqlite", "database", "backend", "sync", "tauri"], "backend"),
    learningSeedCandidate("ai-recommendation", "AI", "추천 시스템과 임베딩 기초", "지금 만드는 Next Learning Seeds를 더 똑똑하게 만들 수 있는 가지예요. rule-based에서 embedding ranking으로 확장할 수 있어요.", "Intermediate", "10-14h", ["Coursera", "YouTube", "Docs"], ["ai", "recommendation", "embedding", "ollama"], "ai"),
  ];

  return candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreLearningSeed(candidate, context),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ score, ...candidate }) => candidate);
}

function learningSeedCandidate(id, branchLabel, title, why, level, estimatedHours, resources, triggers, branch) {
  return { id, branch, branchLabel, title, why, level, estimatedHours, resources, triggers };
}

function scoreLearningSeed(candidate, context) {
  const triggerScore = candidate.triggers.reduce((score, trigger) => score + (context.textBlob.includes(trigger) ? 3 : 0), 0);
  const blockedScore = (context.conceptBank.blocked || []).some(([concept]) =>
    candidate.triggers.some((trigger) => concept.toLowerCase().includes(trigger)),
  )
    ? 4
    : 0;
  const branchBonus =
    candidate.branch === "data"
      ? 4
      : candidate.branch === "ai" && /ai|ollama|추천|recommendation/.test(context.textBlob)
        ? 5
        : candidate.branch === "frontend" && /dashboard|visual|ui|front/.test(context.textBlob)
          ? 5
          : candidate.branch === "backend" && /sql|sqlite|database|tauri/.test(context.textBlob)
            ? 5
            : 0;
  const progressBonus = context.summary.done > 0 ? 2 : 0;
  return triggerScore + blockedScore + branchBonus + progressBonus;
}

function learningSeedSummary(context, seeds) {
  if (!seeds.length) return "학습 기록이 쌓이면 다음 가지 추천이 더 선명해져요.";
  const doneText = context.summary.done ? `${context.summary.done}개 course 완료 흐름` : "현재 진행 흐름";
  return `${doneText}을 기준으로 ${seeds[0].branchLabel || "다음 학습"} 쪽 확장을 먼저 추천해요.`;
}

async function suggestLearningSeeds() {
  const tracks = normalizeLearningTracks(state.learningTracks);
  const sessions = normalizeLearningSessions(state.learningSessions);
  const summary = buildLearningSummary(tracks);
  const conceptBank = buildConceptBank(sessions, tracks);
  const context = buildLearningSeedContext(tracks, sessions, summary, conceptBank);
  const localPack = createLocalLearningSeedSuggestions(tracks, sessions, summary, conceptBank);
  const providerLabel = AI_PROVIDER_LABEL[state.aiProviderKind] || AI_PROVIDER_LABEL.rules;
  setToast(`${providerLabel} 학습 씨앗 생성 중...`);
  render();

  try {
    state.learningSeedSuggestions =
      state.aiProviderKind === "ollama"
        ? await createOllamaLearningSeedSuggestions(context, localPack)
        : {
            ...localPack,
            provider: providerLabel,
            summary:
              state.aiProviderKind === "openai"
                ? "OpenAI-ready provider는 아직 연결되지 않아 Local Rules 추천을 보여줘요."
                : localPack.summary,
          };
  } catch (error) {
    console.warn("Learning seed provider failed", error);
    state.learningSeedSuggestions = {
      ...localPack,
      provider: `${providerLabel} fallback`,
      summary: providerFailureMessage({ kind: state.aiProviderKind, label: providerLabel }, error),
    };
  }

  saveUiState();
  setToast("다음 학습 씨앗을 갱신했어요.");
  render();
}

async function createOllamaLearningSeedSuggestions(context, localPack) {
  const response = await fetchWithTimeout(OLLAMA_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: state.ollamaModel || "llama3.2",
      prompt: buildOllamaLearningSeedPrompt(context, localPack.seeds),
      stream: false,
      format: "json",
      options: {
        temperature: 0.35,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const payload = await response.json();
  const parsed = parseOllamaLearningSeeds(payload.response || "");
  return {
    provider: `${AI_PROVIDER_LABEL.ollama} · ${state.ollamaModel || "llama3.2"}`,
    generatedAt: new Date().toISOString(),
    summary: parsed.summary || localPack.summary,
    seeds: parsed.seeds.length ? parsed.seeds : localPack.seeds,
  };
}

function buildOllamaLearningSeedPrompt(context, localSeeds) {
  const doneCourses = context.doneCourses.slice(0, 8).map(({ track, course }) => `${track.code}: ${course.title}`).join("\n") || "none";
  const activeCourses = context.activeCourses.slice(0, 8).map(({ track, course }) => `${track.code}: ${course.title}`).join("\n") || "none";
  const doneModules = context.doneModules.slice(-10).map(({ course, module }) => `${course.title}: ${module.title}`).join("\n") || "none";
  const blocked = (context.conceptBank.blocked || []).slice(0, 8).map(([concept, count]) => `${concept} (${count})`).join(", ") || "none";
  const review = (context.conceptBank.review || []).slice(0, 8).map(([concept, count]) => `${concept} (${count})`).join(", ") || "none";
  const local = localSeeds.map((seed) => `- ${seed.branchLabel}: ${seed.title} (${seed.level}, ${seed.estimatedHours})`).join("\n");

  return `
You are SeedLog Learning Coach. Recommend next learning seeds for a Korean learner.

Return only valid JSON:
{
  "summary": "one short Korean sentence",
  "seeds": [
    {
      "title": "short Korean title",
      "branchLabel": "Data Science | Front-end | Back-end | AI",
      "branch": "data | frontend | backend | ai",
      "why": "why this is useful now",
      "level": "Beginner | Core | Applied | Intermediate",
      "estimatedHours": "6-10h",
      "resources": ["Coursera", "Udemy", "YouTube"]
    }
  ]
}

Rules:
- Write user-facing text in natural Korean.
- Recommend exactly 4 seeds.
- Do not invent specific live course names, prices, ratings, instructors, or URLs.
- Use platform/resource categories only: Coursera, Udemy, YouTube, Book, Docs, Kaggle.
- Include at least one practical branch outside pure data science when useful, such as Front-end, Back-end, or AI.
- Prefer seeds that can later become ideas in SeedLog.
- Keep why under 120 Korean characters.
- Avoid markdown and emoji.

Completed courses:
${doneCourses}

Active courses:
${activeCourses}

Recently completed modules:
${doneModules}

Blocked concepts:
${blocked}

Review concepts:
${review}

Local rule candidates:
${local}
`.trim();
}

function parseOllamaLearningSeeds(text) {
  const fallback = { summary: "", seeds: [] };
  try {
    return normalizeLearningSeedProvider(JSON.parse(text));
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;
    try {
      return normalizeLearningSeedProvider(JSON.parse(jsonMatch[0]));
    } catch {
      return fallback;
    }
  }
}

function normalizeLearningSeedProvider(parsed) {
  const allowedBranches = new Set(["data", "frontend", "backend", "ai"]);
  const seeds = Array.isArray(parsed?.seeds)
    ? parsed.seeds
        .map((seed, index) => {
          const branch = allowedBranches.has(cleanField(seed.branch)) ? cleanField(seed.branch) : "data";
          return {
            id: cleanField(seed.id) || `ai_seed_${index}`,
            branch,
            branchLabel: cleanReadableProviderField(seed.branchLabel).slice(0, 40) || branch,
            title: cleanReadableProviderField(seed.title).slice(0, 80),
            why: cleanReadableProviderField(seed.why).slice(0, 180),
            level: cleanReadableProviderField(seed.level).slice(0, 40) || "Next",
            estimatedHours: cleanReadableProviderField(seed.estimatedHours).slice(0, 30) || "6-10h",
            resources: Array.isArray(seed.resources)
              ? seed.resources.map(cleanReadableProviderField).filter(Boolean).slice(0, 3)
              : ["Coursera", "YouTube"],
            triggers: [],
          };
        })
        .filter((seed) => seed.title && seed.why)
        .slice(0, 5)
    : [];
  return {
    summary: cleanReadableProviderField(parsed?.summary).slice(0, 220),
    seeds,
  };
}

function currentLearningSeedPack() {
  const tracks = normalizeLearningTracks(state.learningTracks);
  const sessions = normalizeLearningSessions(state.learningSessions);
  const summary = buildLearningSummary(tracks);
  const conceptBank = buildConceptBank(sessions, tracks);
  return state.learningSeedSuggestions || createLocalLearningSeedSuggestions(tracks, sessions, summary, conceptBank);
}

async function saveLearningSeedAsIdea(index) {
  const seed = currentLearningSeedPack().seeds[Number(index)];
  if (!seed) return;

  const now = new Date().toISOString();
  const text = `학습 확장: ${seed.title} · ${seed.why}`;
  const item = normalizeItem({
    id: uid("idea"),
    text,
    date: getTodayKey(),
    status: "open",
    type: "idea",
    horizon: "short",
    lane: "someday",
    importance: seed.branch === "data" ? "high" : "normal",
    momentum: "seed",
    context: "learning",
    timeBlock: currentTimeBlockKey(),
    dailyPriority: "parking",
    keywords: tokenize(`${seed.title} ${seed.branchLabel} ${seed.why} learning course seed`),
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  });

  state.items = [item, ...state.items];
  await repository.upsertItems([item]);
  setToast("추천 학습 씨앗을 아이디어로 저장했어요.");
  saveUiState();
  render();
}

function buildLearningSummary(tracks) {
  const courses = tracks.flatMap((track) => track.courses);
  const done = courses.filter((course) => course.status === "done").length;
  const active = courses.filter((course) => course.status === "active").length;
  const remaining = courses.length - done;
  const modules = courses.flatMap((course) => course.modules || []);
  const doneModules = modules.filter((module) => module.status === "done").length;
  const activeModules = modules.filter((module) => module.status === "active").length;
  const remainingDeepHours = courses.reduce((sum, course) => sum + remainingCourseHours(course), 0);
  const daysLeft = Math.max(0, ...tracks.map((track) => daysUntil(track.targetDate) ?? 0));
  const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
  const weeklyHours = remainingDeepHours / weeksLeft;
  return {
    total: courses.length,
    done,
    active,
    remaining,
    modules: modules.length,
    doneModules,
    activeModules,
    moduleCompletionRate: modules.length ? Math.round((doneModules / modules.length) * 100) : 0,
    completionRate: courses.length ? Math.round((done / courses.length) * 100) : 0,
    remainingDeepHours: Math.round(remainingDeepHours),
    weeklyHours: weeklyHours.toFixed(1),
    risk: learningPaceRisk(weeklyHours),
    daysLeft,
    daysLeftLabel: daysLeft ? `${daysLeft}일` : "목표일까지",
  };
}

function buildLearningDashboardInsights(tracks, sessions, summary, reviewQueue) {
  const weeklyAvailable = Number(state.learningWeeklyHours || 12);
  const weeklyRequired = Number(summary.weeklyHours || 0);
  const paceGap = weeklyAvailable - weeklyRequired;
  const blocksNeeded = Math.ceil(weeklyRequired / 1.5);
  const blocksAvailable = Math.floor(weeklyAvailable / 1.5);
  const recommendation = nextLearningModule(tracks) || nextLearningCourse(tracks);
  const today = getTodayKey();
  const sevenDaysAgo = addDays(today, -6);
  const recentSessions = sessions.filter((session) => session.date >= sevenDaysAgo && session.date <= today);
  const todayMinutes = sessions
    .filter((session) => session.date === today)
    .reduce((sum, session) => sum + Number(session.minutes || 0), 0);
  const recentMinutes = recentSessions.reduce((sum, session) => sum + Number(session.minutes || 0), 0);

  return {
    recommendation,
    weeklyAvailable,
    weeklyRequired,
    paceGap,
    blocksNeeded,
    blocksAvailable,
    todayHours: (todayMinutes / 60).toFixed(1),
    recentHours: (recentMinutes / 60).toFixed(1),
    recentSessions: recentSessions.length,
    reviewDue: reviewQueue.length,
    moduleProgress: `${summary.doneModules}/${summary.modules || 0}`,
    moduleCompletionRate: summary.moduleCompletionRate,
  };
}

function renderLearningCommandCenter(dashboard) {
  const rec = dashboard.recommendation;
  const isModule = Boolean(rec?.module);
  const paceLabel = dashboard.paceGap >= 0 ? "목표 페이스 커버" : "추가 블록 필요";
  const paceDetail =
    dashboard.paceGap >= 0
      ? `이번 주 계획이 목표보다 ${dashboard.paceGap.toFixed(1)}h 여유 있어요.`
      : `이번 주 ${Math.abs(dashboard.paceGap).toFixed(1)}h를 더 확보해야 해요.`;
  const recTitle = rec
    ? isModule
      ? rec.module.title
      : rec.course.title
    : "모든 학습 course 완료";
  const recMeta = rec
    ? isModule
      ? `${rec.track.code} · ${rec.course.title} · 학습 노트 추천`
      : `${rec.track.code} · course 단위 학습 노트 추천`
    : "포트폴리오 정리와 복습으로 넘어가도 좋아요.";

  return `
    <section class="learning-command">
      <article class="learning-command-card primary">
        <div class="focus-eyebrow">Today Pick</div>
        <h2>${escapeHtml(recTitle)}</h2>
        <p>${escapeHtml(recMeta)}</p>
        ${
          rec
            ? `<div class="learning-command-actions">
                <button class="small-button" data-learning-detail-course="${rec.track.id}" data-course-id="${rec.course.id}">상세 보기</button>
                ${
                  isModule
                    ? `<button class="small-button" data-learning-note-module="${rec.track.id}" data-course-id="${rec.course.id}" data-module-id="${rec.module.id}">노트</button>`
                    : `<button class="small-button" data-learning-note-course="${rec.track.id}" data-course-id="${rec.course.id}">노트</button>`
                }
              </div>`
            : ""
        }
      </article>
      <article class="learning-command-card ${dashboard.paceGap >= 0 ? "on-track" : "behind"}">
        <div class="focus-eyebrow">Pace</div>
        <h2>${paceLabel}</h2>
        <p>${paceDetail}</p>
        <strong>${dashboard.weeklyAvailable}h 계획 / ${dashboard.weeklyRequired.toFixed(1)}h 필요</strong>
      </article>
      <article class="learning-command-card">
        <div class="focus-eyebrow">Weekly Blocks</div>
        <h2>${dashboard.blocksAvailable}/${dashboard.blocksNeeded} blocks</h2>
        <p>집중 학습 블록 기준이에요. 부족하면 Daily의 Now Stack에 학습 블록을 먼저 올리는 게 좋아요.</p>
      </article>
      <article class="learning-command-card">
        <div class="focus-eyebrow">Recent Signal</div>
        <h2>${dashboard.recentHours}h · ${dashboard.recentSessions} sessions</h2>
        <p>오늘 ${dashboard.todayHours}h 기록 · 복습 due ${dashboard.reviewDue}개 · module ${dashboard.moduleProgress} 완료</p>
        <div class="progress compact"><span style="width:${dashboard.moduleCompletionRate}%"></span></div>
      </article>
    </section>
  `;
}

function renderLearningTrack(track, { embedded = false } = {}) {
  const done = track.courses.filter((course) => course.status === "done").length;
  const active = track.courses.filter((course) => course.status === "active").length;
  const remaining = track.courses.length - done;
  const completionRate = track.courses.length ? Math.round((done / track.courses.length) * 100) : 0;
  const daysLeft = daysUntil(track.targetDate);
  const weeksLeft = Math.max(1, Math.ceil(Math.max(0, daysLeft || 0) / 7));
  const deepHours = track.courses.reduce((sum, course) => sum + deepCourseHours(course), 0);
  const remainingDeepHours = track.courses.reduce((sum, course) => sum + remainingCourseHours(course), 0);
  const weeklyPace = (remainingDeepHours / weeksLeft).toFixed(1);

  // In the certificate detail the header/stats already appear above, so the
  // embedded variant renders only the course list (+ note) to avoid duplication.
  const header = embedded
    ? `<div class="learning-course-head"><h3>Course 목록</h3><span class="muted">${escapeHtml(track.note)}</span></div>`
    : `
      <div class="learning-card-header">
        <div>
          <div class="thread-meta">${escapeHtml(track.code)} · ${escapeHtml(track.platform)}</div>
          <h2>${escapeHtml(track.title)}</h2>
        </div>
        <span class="project-health ${remaining ? "active" : "completed"}">${remaining ? "진행" : "완료"}</span>
      </div>
      <div class="progress"><span style="width:${completionRate}%"></span></div>
      <div class="learning-metrics">
        <span><strong>${completionRate}%</strong> 완료</span>
        <span><strong>${done}/${track.courses.length}</strong> courses</span>
        <span><strong>${active}</strong> 진행 중</span>
        <span><strong>${Math.round(remainingDeepHours)}/${Math.round(deepHours)}h</strong> deep</span>
      </div>
      <p class="muted">${escapeHtml(track.note)} · 남은 깊은 학습 페이스 ${weeklyPace}h/주</p>
    `;

  return `
    <article class="learning-card">
      ${header}
      <div class="learning-course-list">
        ${track.courses.map((course, index) => renderLearningCourse(track, course, index)).join("")}
      </div>
    </article>
  `;
}

function renderLearningCourse(track, course, index) {
  const statusLabel = {
    planned: "대기",
    active: "진행",
    done: "완료",
  }[course.status || "planned"];
  const courseKey = `${track.id}::${course.id}`;
  const isSelected = state.selectedLearningCourseKey === courseKey;
  const moduleCount = course.modules?.length || 0;
  return `
    <div class="learning-course ${course.status || "planned"} ${isSelected ? "selected" : ""}">
      <button class="check ${course.status === "done" ? "done" : ""}" data-learning-cycle-course="${track.id}" data-course-id="${course.id}" title="Course 상태 변경">${course.status === "done" ? "✓" : ""}</button>
      <div>
        <strong>${String(index + 1).padStart(2, "0")}. ${escapeHtml(course.title)}</strong>
        <span>${statusLabel} · base ${course.estimatedHours || "?"}h · deep ${deepCourseHours(course)}h · ${studiedHours(course)}h studied · ${Number(course.sessions || 0)} sessions${moduleCount ? ` · ${moduleCount} modules` : ""}${course.lastStudiedAt ? ` · last ${escapeHtml(course.lastStudiedAt.slice(0, 10))}` : ""}</span>
      </div>
      <div class="learning-course-actions">
        <button class="small-button" data-learning-detail-course="${track.id}" data-course-id="${course.id}">${isSelected ? "열림" : "상세"}</button>
        <button class="small-button" data-learning-note-course="${track.id}" data-course-id="${course.id}" title="Study Session에 이 course를 선택">노트</button>
        ${course.status === "done" ? `<button class="small-button seed" data-learning-course-cultivation="${track.id}" data-course-id="${course.id}" title="이 학습을 재배 씨앗으로 — 적용·확장 거리로 키우기">🌱 재배로</button>` : ""}
      </div>
    </div>
  `;
}

function renderLearningSessionForm(tracks) {
  const nextCourse = findNextLearningCourse(tracks);
  return `
    <section class="learning-session-panel">
      <div class="learning-session-copy">
        <div class="focus-eyebrow">Study Session</div>
        <h2>오늘 배운 것과 막힌 개념을 남기기</h2>
        <p class="muted">세션 기록은 Daily 완료 항목에도 같이 남고, Concept Bank와 Learning Coach의 재료가 됩니다.</p>
      </div>
      <form class="learning-session-form" data-learning-session-form>
        <label>
          <span>Course</span>
          <select name="courseKey">
            ${tracks
              .map((track) =>
                track.courses
                  .map((course) => {
                    const value = `${track.id}::${course.id}`;
                    const selected = value === nextCourse ? "selected" : "";
                    const moduleOptions = (course.modules || [])
                      .map(
                        (module, moduleIndex) =>
                          `<option value="${value}::${module.id}">${track.code} · ${String(moduleIndex + 1).padStart(2, "0")} ${escapeHtml(module.title)}</option>`,
                      )
                      .join("");
                    return `<option value="${value}" ${selected}>${track.code} · ${escapeHtml(course.title)} 전체</option>${moduleOptions}`;
                  })
                  .join(""),
              )
              .join("")}
          </select>
        </label>
        <label>
          <span>Minutes</span>
          <input name="minutes" type="number" min="15" step="15" value="90" />
        </label>
        <label class="span-2">
          <span>오늘 배운 것</span>
          <textarea name="learned" rows="2" placeholder="예: SQL join 개념을 실습했고 pandas groupby와 비교했다."></textarea>
        </label>
        <label>
          <span>막힌 개념</span>
          <input name="blockedConcepts" type="text" placeholder="regression, p-value, SQL join" />
        </label>
        <label>
          <span>복습 필요</span>
          <input name="reviewConcepts" type="text" placeholder="statistics, model evaluation" />
        </label>
        <div class="learning-session-actions span-2">
          <button class="primary-button" type="submit">학습 세션 저장</button>
        </div>
      </form>
    </section>
  `;
}

function renderWeeklyLearningPlanner(plan) {
  return `
    <section class="learning-planner">
      <div>
        <div class="focus-eyebrow">이번 주 무엇부터</div>
        <h2>가능 ${plan.availableHours}h 기준 추천 순서</h2>
        <p class="muted">위 "이번 주 페이스"의 가능 시간을 바꾸면 배분이 다시 계산돼요.</p>
      </div>
      <div class="weekly-plan-list">
        ${
          plan.items.length
            ? plan.items.map((item) => `<p><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.detail)}</p>`).join("")
            : `<p class="muted">남은 학습 course가 없어요.</p>`
        }
      </div>
    </section>
  `;
}

function buildWeeklyLearningPlan(tracks, availableHours) {
  const summary = buildLearningSummary(tracks);
  let remainingBudget = availableHours;
  const items = [];
  for (const track of tracks) {
    for (const course of track.courses) {
      const modules = (course.modules || []).filter((module) => module.status !== "done");
      if (modules.length) {
        for (const module of modules) {
          const remainingHours = remainingModuleHours(module);
          if (!remainingHours || remainingBudget <= 0) continue;
          const allocated = Math.min(remainingHours, remainingBudget);
          items.push({
            title: `${track.code} · ${module.title}`,
            detail: `${course.title} · ${allocated.toFixed(1)}h 배정 · 남은 module ${remainingHours.toFixed(1)}h`,
          });
          remainingBudget -= allocated;
        }
        continue;
      }

      const remainingHours = remainingCourseHours(course);
      if (!remainingHours || remainingBudget <= 0) continue;
      const allocated = Math.min(remainingHours, remainingBudget);
      items.push({
        title: `${track.code} · ${course.title}`,
        detail: `${allocated.toFixed(1)}h 배정 · 남은 deep ${remainingHours.toFixed(1)}h`,
      });
      remainingBudget -= allocated;
    }
  }
  return {
    availableHours,
    blocks: Math.max(1, Math.floor(availableHours / 1.5)),
    coverage: Math.min(100, Math.round((availableHours / Number(summary.weeklyHours || 1)) * 100)),
    items: items.slice(0, 5),
  };
}

function renderCertificateRoadmap(tracks, summary) {
  const expectedFinish = addDays(getTodayKey(), Math.ceil((summary.remainingDeepHours / Math.max(1, Number(state.learningWeeklyHours || 12))) * 7));
  return `
    <section class="learning-roadmap">
      <div class="learning-roadmap-header">
        <div>
          <div class="focus-eyebrow">Certificate Roadmap</div>
          <h2>현재 주간 ${Number(state.learningWeeklyHours || 12)}h 기준 예상 완료 ${expectedFinish}</h2>
        </div>
        <span class="project-health ${expectedFinish > "2026-09-30" ? "late" : "active"}">${expectedFinish > "2026-09-30" ? "목표 초과" : "목표 가능"}</span>
      </div>
      <div class="roadmap-track-list">
        ${tracks.map((track) => renderRoadmapTrack(track)).join("")}
      </div>
    </section>
  `;
}

function renderRoadmapTrack(track) {
  return `
    <div class="roadmap-track">
      <strong>${escapeHtml(track.code)} · ${escapeHtml(track.title)}</strong>
      <div class="roadmap-courses">
        ${track.courses
          .map(
            (course) =>
              `<span class="${course.status || "planned"}" title="${escapeHtml(course.title)}">${course.status === "done" ? "✓" : ""}</span>`,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderCourseDetail(tracks, sessions) {
  const selected = selectedLearningCourse(tracks);
  if (!selected) return "";
  const { track, course } = selected;
  const courseSessions = sessions.filter((session) => session.trackId === track.id && session.courseId === course.id);
  const blocked = countConcepts(courseSessions.flatMap((session) => session.blockedConcepts));
  const review = countConcepts(courseSessions.flatMap((session) => session.reviewConcepts));
  const remaining = remainingCourseHours(course);
  const modules = course.modules || [];
  const moduleDone = modules.filter((module) => module.status === "done").length;
  const moduleDeepTotal = modules.reduce((sum, module) => sum + deepModuleHours(module), 0);
  return `
    <section class="learning-course-detail">
      <div class="learning-card-header">
        <div>
          <div class="focus-eyebrow">Course Detail</div>
          <h2>${escapeHtml(track.code)} · ${escapeHtml(course.title)}</h2>
          <p class="muted">3배 기준 ${deepCourseHours(course)}h · studied ${studiedHours(course)}h · remaining ${remaining.toFixed(1)}h${modules.length ? ` · module total ${moduleDeepTotal}h · modules ${moduleDone}/${modules.length}` : ""}</p>
        </div>
        <span class="project-health ${course.status || "planned"}">${course.status || "planned"}</span>
      </div>
      <div class="learning-module-list">
        ${
          modules.length
            ? modules.map((module, index) => renderLearningModule(track, course, module, index, courseSessions)).join("")
            : `<div class="learning-module-empty">
                <strong>아직 세부 모듈 데이터가 없어요.</strong>
                <p class="muted">상세 버튼 구조는 준비됐고, Coursera 공개 페이지에서 확인한 module name/hour를 course별로 계속 채워 넣을 수 있어요.</p>
              </div>`
        }
      </div>
      <div class="learning-detail-grid">
        <div>
          <h3>최근 세션</h3>
          <div class="insight-list">
            ${
              courseSessions.length
                ? courseSessions
                    .slice(0, 4)
                    .map((session) => `<p>${escapeHtml(session.date)} · ${session.minutes}분 · ${escapeHtml(session.learned || "학습 기록")}</p>`)
                    .join("")
                : `<p class="muted">아직 세션 기록이 없어요.</p>`
            }
          </div>
        </div>
        <div>
          <h3>개념</h3>
          <div class="chip-row">
            ${renderConceptChips("막힘", Object.entries(blocked), true)}
            ${renderConceptChips("복습", Object.entries(review))}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderLearningModule(track, course, module, index, courseSessions) {
  const moduleSessions = courseSessions.filter((session) => session.moduleId === module.id);
  const statusLabel = {
    planned: "대기",
    active: "진행",
    done: "완료",
  }[module.status || "planned"];
  const deepHours = deepModuleHours(module);
  const studied = studiedModuleHours(module);
  const remaining = module.status === "done" ? 0 : Math.max(0, deepHours - Number(module.studiedMinutes || 0) / 60);
  const progress = module.status === "done" ? 100 : Math.min(100, Math.round((Number(module.studiedMinutes || 0) / 60 / Math.max(1, deepHours)) * 100));
  return `
    <div class="learning-module ${module.status || "planned"}">
      <button class="check ${module.status === "done" ? "done" : ""}" data-learning-cycle-module="${track.id}" data-course-id="${course.id}" data-module-id="${module.id}" title="Module 상태 변경">${module.status === "done" ? "✓" : ""}</button>
      <div class="learning-module-body">
        <div class="learning-module-title">
          <strong>${String(index + 1).padStart(2, "0")}. ${escapeHtml(module.title)}</strong>
          <span>${statusLabel} · 3배 기준 ${deepHours}h · remaining ${remaining.toFixed(1)}h · Coursera ${module.estimatedHours || "?"}h · ${studied}h studied · ${Number(module.sessions || 0)} sessions</span>
        </div>
        <p>${escapeHtml(module.contentSummary || "Coursera module")}</p>
        <div class="progress compact"><span style="width:${progress}%"></span></div>
        ${
          moduleSessions[0]
            ? `<p class="module-last">최근: ${escapeHtml(moduleSessions[0].date)} · ${moduleSessions[0].minutes}분 · ${escapeHtml(moduleSessions[0].learned || "학습 기록")}</p>`
            : ""
        }
      </div>
      <div class="learning-module-actions">
        <button class="small-button" data-learning-note-module="${track.id}" data-course-id="${course.id}" data-module-id="${module.id}" title="Study Session에 이 module을 선택">노트</button>
      </div>
    </div>
  `;
}

function selectedLearningCourse(tracks) {
  const [selectedTrackId, selectedCourseId] = String(state.selectedLearningCourseKey || "").split("::");
  const selected = findLearningCourse(tracks, selectedTrackId, selectedCourseId);
  if (selected) return selected;
  return nextLearningCourse(tracks);
}

function findNextLearningCourse(tracks) {
  for (const track of tracks) {
    const active = track.courses.find((course) => course.status === "active");
    if (active) return `${track.id}::${active.id}`;
  }
  for (const track of tracks) {
    const planned = track.courses.find((course) => course.status !== "done");
    if (planned) return `${track.id}::${planned.id}`;
  }
  return `${tracks[0]?.id || ""}::${tracks[0]?.courses[0]?.id || ""}`;
}

function deepCourseHours(course) {
  return Number(course.estimatedHours || 0) * LEARNING_DEPTH_MULTIPLIER;
}

function deepModuleHours(module) {
  return Number(module.estimatedHours || 0) * LEARNING_DEPTH_MULTIPLIER;
}

function studiedHours(course) {
  return (Number(course.studiedMinutes || 0) / 60).toFixed(1);
}

function studiedModuleHours(module) {
  return (Number(module.studiedMinutes || 0) / 60).toFixed(1);
}

function remainingCourseHours(course) {
  if (course.status === "done") return 0;
  return Math.max(0, deepCourseHours(course) - Number(course.studiedMinutes || 0) / 60);
}

function remainingModuleHours(module) {
  if (module.status === "done") return 0;
  return Math.max(0, deepModuleHours(module) - Number(module.studiedMinutes || 0) / 60);
}

function learningPaceRisk(weeklyHours) {
  if (weeklyHours >= 18) return { key: "high", label: "High Risk", helper: "주간 부하가 높아요" };
  if (weeklyHours >= 10) return { key: "medium", label: "Watch", helper: "꾸준한 블록 필요" };
  return { key: "low", label: "On Track", helper: "현실적인 페이스" };
}

function buildConceptBank(sessions) {
  const blocked = countConcepts(sessions.flatMap((session) => session.blockedConcepts));
  const review = countConcepts(sessions.flatMap((session) => session.reviewConcepts));
  const learned = countConcepts(sessions.flatMap((session) => tokenize(session.learned)));
  return {
    blocked: Object.entries(blocked).sort((a, b) => b[1] - a[1]).slice(0, 6),
    review: Object.entries(review).sort((a, b) => b[1] - a[1]).slice(0, 6),
    learned: Object.entries(learned).sort((a, b) => b[1] - a[1]).slice(0, 6),
  };
}

function buildSpacedReviewQueue(sessions, tracks) {
  const intervals = [1, 3, 7];
  const today = getTodayKey();
  return sessions.flatMap((session) => {
    const match = findLearningCourse(tracks, session.trackId, session.courseId);
    const concepts = [...new Set([...session.reviewConcepts, ...session.blockedConcepts])];
    return concepts.flatMap((concept, conceptIndex) =>
      intervals.map((days) => {
        const dueDate = addDays(session.date, days);
        const id = `${session.id}:${conceptIndex}:${days}`;
        return {
          id,
          concept,
          dueDate,
          courseTitle: match?.course.title || "Learning",
          trackCode: match?.track.code || "LRN",
          days,
        };
      }),
    );
  })
    .filter((review) => review.dueDate <= today && !state.learningReviewDone?.[review.id])
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);
}

function countConcepts(concepts) {
  return concepts.reduce((counts, concept) => {
    const key = cleanField(concept).toLowerCase();
    if (!key) return counts;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function buildLearningCoach(summary, conceptBank, tracks, sessions) {
  const next = nextLearningCourse(tracks);
  const blockedConcept = conceptBank.blocked[0]?.[0];
  const reviewConcept = conceptBank.review[0]?.[0];
  const recentSession = sessions[0];
  return {
    headline:
      summary.risk.key === "high"
        ? "목표는 가능하지만 주간 학습 블록을 먼저 확보해야 해요."
        : "지금은 course 완료보다 세션 리듬과 복습 루프를 같이 만드는 게 좋아요.",
    actions: [
      next ? `${next.track.code} · ${next.course.title}를 다음 90분 학습 블록으로 잡기` : "완료된 학습을 포트폴리오 노트로 정리하기",
      blockedConcept ? `"${blockedConcept}"는 질문 3개와 예제 1개로 다시 풀기` : "막힌 개념을 세션마다 하나 이상 기록하기",
      reviewConcept ? `"${reviewConcept}"를 24시간 안에 짧게 재복습하기` : "복습 필요 개념을 comma로 남겨 Concept Bank 만들기",
    ],
    question: recentSession?.learned
      ? `방금 배운 "${recentSession.learned.slice(0, 42)}"를 어떤 프로젝트 산출물로 바꿀 수 있을까요?`
      : "이번 주 학습에서 포트폴리오로 남길 수 있는 가장 작은 산출물은 무엇인가요?",
  };
}

function nextLearningCourse(tracks) {
  for (const track of tracks) {
    const course = track.courses.find((entry) => entry.status === "active") || track.courses.find((entry) => entry.status !== "done");
    if (course) return { track, course };
  }
  return null;
}

function nextLearningModule(tracks) {
  for (const track of tracks) {
    const activeCourse = track.courses.find((course) => course.status === "active");
    const activeModule = activeCourse?.modules?.find((module) => module.status === "active" && remainingModuleHours(module) > 0);
    if (activeCourse && activeModule) return { track, course: activeCourse, module: activeModule };
  }
  for (const track of tracks) {
    for (const course of track.courses) {
      const module = course.modules?.find((entry) => entry.status !== "done" && remainingModuleHours(entry) > 0);
      if (module) return { track, course, module };
    }
  }
  return null;
}

function buildPortfolioBridge(tracks, sessions, threads = []) {
  const explicitBridges = sessions
    .filter((session) => session.bridge)
    .slice(0, 2)
    .map((session) => {
      const match = findLearningCourse(tracks, session.trackId, session.courseId);
      const module = session.moduleId ? match?.course.modules?.find((entry) => entry.id === session.moduleId) : null;
      return {
        title: match ? `${match.track.code} · ${module?.title || match.course.title}` : "Learning bridge",
        text: session.bridge,
        projectTitle: "직접 연결",
        projectNo: "",
        sourceTitle: module?.title || match?.course.title || "",
        why: "세션 기록에서 직접 남긴 프로젝트 연결이에요.",
        itemType: "task",
        horizon: "short",
        lane: "build",
      };
    });

  const generated = buildLearningProjectBridge(tracks, sessions, threads);
  return uniqueBridgeList([...explicitBridges, ...generated]).slice(0, 6);
}

function buildLearningProjectBridge(tracks, sessions, threads) {
  const sources = learningBridgeSources(tracks, sessions);
  return buildLearningProjectBridgeFromSources(sources, sessions, threads);
}

function buildLearningProjectBridgeFromSources(sources, sessions, threads) {
  const projectTargets = buildLearningProjectTargets(threads);
  const bridges = [];

  for (const source of sources) {
    const profile = learningApplicationProfile(source);
    const targets = rankLearningProjectTargets(profile, projectTargets).slice(0, 2);
    for (const target of targets) {
      bridges.push(createLearningProjectBridge(source, profile, target));
    }
  }

  return bridges;
}

function learningBridgeSources(tracks, sessions) {
  const sources = [];
  const nextModule = nextLearningModule(tracks);
  if (nextModule) sources.push({ ...nextModule, reason: "next" });

  for (const session of sessions.slice(0, 3)) {
    const match = findLearningCourse(tracks, session.trackId, session.courseId);
    if (!match) continue;
    const module = session.moduleId ? match.course.modules?.find((entry) => entry.id === session.moduleId) : null;
    sources.push({ ...match, module, session, reason: "recent" });
  }

  if (!sources.length) {
    const nextCourse = nextLearningCourse(tracks);
    if (nextCourse) sources.push({ ...nextCourse, module: null, reason: "next" });
  }

  return uniqueBridgeSources(sources).slice(0, 4);
}

function uniqueBridgeSources(sources) {
  return [...new Map(sources.map((source) => [`${source.track.id}:${source.course.id}:${source.module?.id || "course"}`, source])).values()];
}

function learningApplicationProfile(source) {
  const text = `${source.track.title} ${source.course.title} ${source.module?.title || ""} ${source.session?.learned || ""} ${(source.session?.blockedConcepts || []).join(" ")} ${(source.session?.reviewConcepts || []).join(" ")}`.toLowerCase();
  const tags = [];
  if (/sql|database|query|join|dataframe|pandas|clean/.test(text)) tags.push("data-pipeline");
  if (/visual|chart|dashboard|presentation|story|insight|analysis/.test(text)) tags.push("analytics-ux");
  if (/statistic|probability|sampling|confidence|hypothesis|p-value|regression/.test(text)) tags.push("statistics");
  if (/machine learning|model|tree|unsupervised|logistic|baseline|metric|classification/.test(text)) tags.push("modeling");
  if (/capstone|project|portfolio|career|job|interview/.test(text)) tags.push("portfolio");
  if (!tags.length) tags.push("learning-artifact");

  return {
    tags,
    sourceTitle: source.module?.title || source.course.title,
    courseTitle: source.course.title,
    trackCode: source.track.code,
  };
}

function buildLearningProjectTargets(threads) {
  const projectThreads = threads
    .map((thread) => {
      const threadItems = thread.itemIds.map((id) => state.items.find((item) => item.id === id)).filter(Boolean);
      const meta = getProjectMeta(thread, threadItems);
      if (!isProjectThread(thread, meta)) return null;
      const text = `${meta.projectNo} ${thread.title} ${meta.goal} ${meta.milestone} ${thread.keywords.join(" ")}`.toLowerCase();
      return {
        key: thread.id,
        threadId: thread.id,
        title: meta.projectNo ? `${meta.projectNo} · ${thread.title}` : thread.title,
        projectNo: meta.projectNo || "",
        targetDate: meta.targetDate || "",
        tags: projectTagsFromText(text),
        focus: meta.milestone || meta.goal || "다음 산출물",
        source: "thread",
      };
    })
    .filter(Boolean);

  return [
    ...projectThreads,
    {
      key: "structlens",
      title: "StructLens Studio",
      projectNo: "PRJ-002",
      targetDate: "2026-09-30",
      tags: ["data-pipeline", "analytics-ux", "statistics", "modeling"],
      focus: "문서/구조 데이터 품질과 분석 흐름을 대시보드 산출물로 만들기",
      source: "default",
    },
    {
      key: "doculens",
      title: "DocuLens Studio",
      projectNo: "PRJ-003",
      targetDate: "2026-09-30",
      tags: ["data-pipeline", "analytics-ux", "portfolio", "learning-artifact"],
      focus: "document ingestion, reading flow, section map을 검증 가능한 산출물로 만들기",
      source: "default",
    },
    {
      key: "structdiff",
      title: "StructDiff Studio",
      projectNo: "PRJ-001",
      targetDate: "2026-09-30",
      tags: ["statistics", "modeling", "data-pipeline", "portfolio"],
      focus: "구조 비교 결과를 metric, benchmark, regression note로 검증하기",
      source: "default",
    },
  ];
}

function projectTagsFromText(text) {
  const tags = [];
  if (/doculens|document|ingestion|section|reading|ocr|lens/.test(text)) tags.push("data-pipeline", "analytics-ux");
  if (/structlens|dashboard|quality|analysis|chart|visual|lens/.test(text)) tags.push("data-pipeline", "analytics-ux", "statistics");
  if (/structdiff|diff|compare|regression|metric|benchmark|model/.test(text)) tags.push("statistics", "modeling");
  if (/portfolio|capstone|demo|case|artifact/.test(text)) tags.push("portfolio");
  return tags.length ? [...new Set(tags)] : ["learning-artifact"];
}

function rankLearningProjectTargets(profile, targets) {
  return [...targets].sort((a, b) => {
    const scoreA = learningProjectScore(profile, a);
    const scoreB = learningProjectScore(profile, b);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.title.localeCompare(b.title);
  });
}

function learningProjectScore(profile, target) {
  const sharedTags = profile.tags.filter((tag) => target.tags.includes(tag)).length;
  const sourceBonus = target.source === "thread" ? 1 : 0;
  return sharedTags * 3 + sourceBonus;
}

function createLearningProjectBridge(source, profile, target) {
  const action = learningProjectAction(profile, target);
  return {
    title: `${profile.trackCode} → ${target.projectNo || "PRJ"} 적용`,
    text: action,
    projectTitle: target.title,
    projectNo: target.projectNo,
    threadId: target.threadId || "",
    targetDate: target.targetDate,
    sourceTitle: profile.sourceTitle,
    why: `${profile.sourceTitle} 학습을 ${target.focus} 쪽으로 바로 전환합니다.`,
    itemType: "task",
    horizon: "short",
    lane: "build",
    tags: profile.tags,
  };
}

function learningProjectAction(profile, target) {
  const source = profile.sourceTitle;
  if (profile.tags.includes("data-pipeline")) {
    return `${source}에서 배운 데이터 정리/SQL 흐름으로 ${target.title} 샘플 데이터 점검 체크리스트 5개 만들기`;
  }
  if (profile.tags.includes("statistics")) {
    return `${source} 개념으로 ${target.title}의 결과 품질을 설명할 metric/hypothesis note 1장 작성`;
  }
  if (profile.tags.includes("modeling")) {
    return `${source} 기반으로 ${target.title}에 적용 가능한 baseline model 또는 evaluation scenario 1개 설계`;
  }
  if (profile.tags.includes("analytics-ux")) {
    return `${source}를 ${target.title}의 1-page insight/dashboard brief로 변환`;
  }
  if (profile.tags.includes("portfolio")) {
    return `${source} 학습 결과를 ${target.title} 포트폴리오 artifact로 정리`;
  }
  return `${source}에서 배운 개념 1개를 ${target.title}의 작은 실험 항목으로 바꾸기`;
}

function uniqueBridgeList(bridges) {
  return [...new Map(bridges.map((bridge) => [`${bridge.projectTitle}:${bridge.sourceTitle}:${bridge.text}`, bridge])).values()];
}

function findLearningCourse(tracks, trackId, courseId) {
  const track = tracks.find((entry) => entry.id === trackId);
  const course = track?.courses.find((entry) => entry.id === courseId);
  return track && course ? { track, course } : null;
}

function findLearningModule(tracks, trackId, courseId, moduleId) {
  const match = findLearningCourse(tracks, trackId, courseId);
  const module = match?.course.modules?.find((entry) => entry.id === moduleId);
  return match && module ? { ...match, module } : null;
}

function renderLearningCoach(coach) {
  return `
    <section class="learning-insight-card">
      <div class="focus-eyebrow">Learning Coach</div>
      <h2>${escapeHtml(coach.headline)}</h2>
      <div class="insight-list">
        ${coach.actions.map((action) => `<p>${escapeHtml(action)}</p>`).join("")}
      </div>
      <div class="learning-coach-question">
        <p>${escapeHtml(coach.question)}</p>
        <button class="small-button" data-coach-question-idea="${escapeHtml(coach.question)}" title="이 질문을 아이디어로 담기">💡 아이디어로</button>
      </div>
    </section>
  `;
}

function renderConceptBank(bank) {
  return `
    <section class="learning-insight-card">
      <div class="focus-eyebrow">Concept Bank</div>
      <h2>막힘과 복습 개념</h2>
      <div class="chip-row">
        ${renderConceptChips("막힘", bank.blocked, true)}
        ${renderConceptChips("복습", bank.review)}
        ${renderConceptChips("학습", bank.learned)}
      </div>
    </section>
  `;
}

function renderConceptChips(label, concepts, seedable = false) {
  if (!concepts.length) return `<span class="chip">${label} 대기</span>`;
  return concepts
    .map(([concept, count]) =>
      seedable
        ? `<button class="chip chip-seedable" data-concept-seed="${escapeHtml(concept)}" title="막힌 개념을 재배 씨앗으로 — 뚫기">${label} · ${escapeHtml(concept)} ${count} 🌱</button>`
        : `<span class="chip">${label} · ${escapeHtml(concept)} ${count}</span>`,
    )
    .join("");
}

function renderSpacedReviewQueue(queue) {
  return `
    <section class="learning-insight-card" id="learning-review-queue">
      <div class="focus-eyebrow">Spaced Review</div>
      <h2>오늘 복습 큐</h2>
      <div class="review-queue-list">
        ${
          queue.length
            ? queue
                .map(
                  (review) => `
                  <div class="review-queue-item">
                    <div>
                      <strong>${escapeHtml(review.concept)}</strong>
                      <span>${escapeHtml(review.trackCode)} · ${escapeHtml(review.courseTitle)} · ${review.days}일 복습</span>
                    </div>
                    <button class="small-button" data-learning-review-done="${escapeHtml(review.id)}" data-review-concept="${escapeHtml(review.concept)}">완료</button>
                  </div>
                `,
                )
                .join("")
            : `<p class="muted">오늘 due인 복습 개념이 없어요.</p>`
        }
      </div>
    </section>
  `;
}

function prioritySort(a, b) {
  const laneScore = laneRank(a.lane) - laneRank(b.lane);
  if (laneScore !== 0) return laneScore;
  const importanceScore = importanceRank(b.importance) - importanceRank(a.importance);
  if (importanceScore !== 0) return importanceScore;
  return b.updatedAt.localeCompare(a.updatedAt);
}

function laneRank(lane) {
  return Object.keys(LANE_LABEL).indexOf(lane);
}

function importanceRank(importance) {
  return { low: 0, normal: 1, high: 2, critical: 3 }[importance] ?? 1;
}

function renderThreads() {
  const signalItems = getSignalItems(state.items);
  const signalThreads = getSignalThreads(state.items);
  const signalMap = buildSignalMap(signalThreads);
  const excludedCount = Math.max(0, state.items.length - signalItems.length);
  const growth = buildGrowthLayer(state.items, state.dailyReviews);
  return `
    <div class="signals-view">
      <div class="workspace-header signals-header">
        <div>
          <h1>Signals</h1>
          <p class="muted">아직 정리 안 한 신호 — 떠오르는 주제 · 프로젝트감 · 정체된 것을 레이더처럼 잡아요.</p>
        </div>
      </div>

      ${renderSignalThemeStrip(signalMap, growth)}

      <section class="signal-grid">
        ${
          signalMap.signals.length
            ? signalMap.signals.map((signal, index) => renderSignalCard(signal, index)).join("")
            : `<div class="empty">기록이 조금 더 쌓이면 반복 신호가 보여요.</div>`
        }
      </section>

      ${renderGrowthRhythm(growth)}

      <section class="signal-thread-panel">
        <div class="section-heading">
          <h2>밑에 깔린 흐름</h2>
          <span class="chip">${signalThreads.length}</span>
        </div>
        <div class="signal-thread-list">
          ${
            signalThreads.length
              ? signalThreads.map((thread) => renderThreadCard(thread)).join("")
              : `<div class="empty">생활/잡무를 제외한 반복 신호가 쌓이면 thread가 생겨요.</div>`
          }
        </div>
      </section>
    </div>
  `;
}

// 떠오르는 주제 — consolidates what were 4 separate keyword displays (growth
// chips, sustained chips, cloud bubbles, hero chips) into one strip. Ranked
// signal keywords + sustained interests, each clickable.
function renderSignalThemeStrip(signalMap, growth) {
  const themes = signalMap.topKeywords.slice(0, 8);
  const sustained = (growth.sustained || []).slice(0, 4);
  if (!themes.length && !sustained.length) {
    return `
      <section class="signal-theme-strip empty-theme">
        <div class="focus-eyebrow">떠오르는 주제</div>
        <p class="muted">${escapeHtml(signalMap.summary)}</p>
      </section>
    `;
  }
  const newKw = new Set((growth.topGrowthKw || []).filter((k) => k.isNew).map((k) => k.kw));
  return `
    <section class="signal-theme-strip">
      <div class="focus-eyebrow">떠오르는 주제</div>
      <div class="signal-theme-chips">
        ${themes
          .map(
            ([keyword, count]) =>
              `<button class="signal-theme-chip ${state.selectedSignalKeyword === keyword ? "active" : ""}" data-signal-keyword="${escapeHtml(keyword)}">#${escapeHtml(keyword)} <span class="stc-count">${count}</span>${newKw.has(keyword) ? ` <span class="stc-new">✦</span>` : ""}</button>`,
          )
          .join("")}
      </div>
      ${
        sustained.length
          ? `<div class="signal-sustained"><span class="signal-sustained-label">계속 맴도는 것</span>${sustained
              .map((s) => `<span class="chip">${escapeHtml(s.kw)} · ${s.days}일</span>`)
              .join("")}</div>`
          : ""
      }
    </section>
  `;
}

// 성장 리듬 — the slim 7-day Evening Build activity strip (kept in Signals as a
// momentum signal, not moved to the rarely-opened weekly review).
function renderGrowthRhythm(growth) {
  const dots = growth.dailyGrowth
    .map((d) => {
      const intensity = d.total === 0 ? "empty" : d.done / d.total >= 0.6 ? "high" : "mid";
      return `<div class="growth-dot ${intensity}" title="${d.date}: ${d.done}/${d.total}"><span>${d.label}</span></div>`;
    })
    .join("");
  const diff = growth.thisWeekCount - growth.lastWeekCount;
  const trend =
    diff > 0
      ? `이번 주 ${growth.thisWeekCount}회 — 지난 주보다 ${diff}회 많아요.`
      : diff < 0
      ? `이번 주 ${growth.thisWeekCount}회 — 지난 주(${growth.lastWeekCount}회)보다 적어요.`
      : `이번 주 ${growth.thisWeekCount}회 — 지난 주와 비슷해요.`;
  return `
    <section class="signal-rhythm">
      <div class="signal-rhythm-head">
        <span class="focus-eyebrow">성장 리듬 · 최근 7일</span>
        <span class="muted">${escapeHtml(trend)}</span>
      </div>
      <div class="growth-activity-row">${dots}</div>
    </section>
  `;
}

function buildSignalMap(threads) {
  const items = getSignalItems(state.items);
  const today = getTodayKey();
  const recentStart = addDays(today, -29);
  const previousStart = addDays(today, -59);
  const recentItems = items.filter((item) => item.date >= recentStart && item.date <= today);
  const previousItems = items.filter((item) => item.date >= previousStart && item.date < recentStart);
  const recentKeywords = countKeywords(recentItems);
  const previousKeywords = countKeywords(previousItems);
  const topKeywords = rankSignalKeywords(recentItems, recentKeywords, previousKeywords, today).slice(0, 8);

  const signals = [
    ...buildEmergingKeywordSignals(topKeywords, previousKeywords, recentItems),
    ...buildProjectCandidateSignals(threads),
    ...buildStalledSignals(threads),
    ...buildLearningConnectionSignals(items),
  ].slice(0, 8);

  if (!signals.length && items.length) {
    signals.push({
      type: "pattern",
      tone: "seed",
      title: "기록은 쌓이고 있지만 아직 반복 신호가 약해요.",
      detail: "Today와 Ideas에 같은 키워드가 두세 번 더 쌓이면 프로젝트 후보나 학습 연결이 보이기 시작합니다.",
      threadId: null,
      keywords: [],
    });
  }

  return {
    signals,
    topKeywords,
    projectCandidates: signals.filter((signal) => signal.type === "project").length,
    stalled: signals.filter((signal) => signal.type === "stalled").length,
    headline: signals[0]?.title || "아직 뚜렷한 신호가 없어요.",
    summary: signals[0]?.detail || "아이디어와 Today 기록이 쌓이면 반복되는 관심사와 병목을 자동으로 찾습니다.",
  };
}

function rankSignalKeywords(items, recentKeywords, previousKeywords, today = getTodayKey()) {
  return Object.entries(recentKeywords)
    .map(([keyword, count]) => {
      const related = items.filter((item) => item.keywords.includes(keyword));
      const previous = previousKeywords[keyword] || 0;
      const score = signalKeywordScore(keyword, count, previous, related, today);
      return [keyword, count, score];
    })
    .sort((a, b) => b[2] - a[2] || b[1] - a[1] || a[0].localeCompare(b[0]));
}

function signalKeywordScore(keyword, count, previous, relatedItems, today) {
  const learning = relatedItems.filter((item) => item.context === "learning").length;
  const ideas = relatedItems.filter((item) => item.type === "idea" || item.context === "idea").length;
  const projectish = relatedItems.filter((item) => item.horizon === "long" || item.lane === "build" || item.lane === "invest").length;
  const blocked = relatedItems.filter((item) => item.momentum === "blocked").length;
  const high = relatedItems.filter((item) => item.importance === "high" || item.importance === "critical").length;
  const recent = relatedItems.filter((item) => daysBetween(item.date, today) <= 7).length;
  const emerging = previous ? Math.max(0, count - previous) * 1.15 : count >= 2 ? 1.8 : 0;
  const namedProject = /^prj[-\s]?\d+/i.test(keyword) ? 4 : 0;
  return count + learning * 1.5 + ideas * 1.3 + projectish * 1.4 + blocked * 2.2 + high * 1.1 + recent * 0.75 + emerging + namedProject;
}

function buildEmergingKeywordSignals(topKeywords, previousKeywords, recentItems) {
  return topKeywords
    .filter(([, count]) => count >= 2)
    .slice(0, 3)
    .map(([keyword, count]) => {
      const previous = previousKeywords[keyword] || 0;
      const related = recentItems.filter((item) => item.keywords.includes(keyword));
      const open = related.filter((item) => item.status !== "done").length;
      return {
        type: "emerging",
        tone: previous ? "active" : "new",
        title: `#${keyword} 신호가 반복되고 있어요.`,
        detail: `${count}번 등장했고 열린 항목 ${open}개가 남아 있어요. ${previous ? `이전 30일에는 ${previous}번 보였어요.` : "새로 강해지는 관심사일 수 있어요."}`,
        threadId: findThreadForKeyword(keyword)?.id || null,
        keywords: [keyword],
      };
    });
}

function buildProjectCandidateSignals(threads) {
  return threads
    .map((thread) => {
      const threadItems = thread.itemIds.map((id) => state.items.find((item) => item.id === id)).filter(Boolean);
      const meta = getProjectMeta(thread, threadItems);
      if (isProjectThread(thread, meta)) return null;
      const longCount = threadItems.filter((item) => item.horizon === "long").length;
      const ideaCount = threadItems.filter((item) => item.type === "idea").length;
      if (thread.itemIds.length < 3 && longCount < 1 && ideaCount < 2) return null;
      return {
        type: "project",
        tone: "project",
        title: `${thread.title}는 프로젝트 후보예요.`,
        detail: `${thread.itemIds.length}개 항목, 아이디어 ${ideaCount}개, 장기 항목 ${longCount}개가 묶였어요. 목표와 다음 산출물을 정하면 Projects에서 관리할 수 있어요.`,
        threadId: thread.id,
        keywords: thread.keywords.slice(0, 3),
      };
    })
    .filter(Boolean)
    .slice(0, 3);
}

function buildStalledSignals(threads) {
  const today = getTodayKey();
  return threads
    .map((thread) => {
      const threadItems = thread.itemIds.map((id) => state.items.find((item) => item.id === id)).filter(Boolean);
      const openItems = threadItems.filter((item) => item.status !== "done");
      const blocked = openItems.filter((item) => item.momentum === "blocked").length;
      const age = daysBetween(thread.lastDate, today);
      if (!openItems.length || (blocked === 0 && age < 14)) return null;
      return {
        type: "stalled",
        tone: blocked ? "blocked" : "quiet",
        title: `${thread.title} 흐름이 멈춰 있어요.`,
        detail: blocked
          ? `막힌 항목 ${blocked}개가 있어요. 질문, 요청, 결정 중 하나로 바꾸면 다시 움직일 수 있어요.`
          : `${age}일 동안 새 움직임이 약해요. 30분 실험으로 살릴지 보관할지 정하면 좋아요.`,
        threadId: thread.id,
        keywords: thread.keywords.slice(0, 3),
      };
    })
    .filter(Boolean)
    .slice(0, 2);
}

function buildLearningConnectionSignals(items) {
  const learningItems = items.filter((item) => item.context === "learning" || /^학습/.test(item.text));
  const ideaItems = items.filter((item) => item.type === "idea");
  if (!learningItems.length || !ideaItems.length) return [];
  const learningKeywords = new Set(learningItems.flatMap((item) => item.keywords));
  const matchedIdeas = ideaItems.filter((item) => item.keywords.some((keyword) => learningKeywords.has(keyword)));
  if (!matchedIdeas.length) return [];
  const keyword = matchedIdeas[0].keywords.find((entry) => learningKeywords.has(entry)) || "learning";
  return [
    {
      type: "learning",
      tone: "learning",
      title: `학습과 아이디어가 #${keyword}에서 만나요.`,
      detail: `학습 기록과 아이디어가 같은 키워드를 공유합니다. course를 더 듣기보다 작은 실험 아이디어로 저장하면 연결이 선명해져요.`,
      threadId: findThreadForKeyword(keyword)?.id || null,
      keywords: [keyword],
    },
  ];
}

function findThreadForKeyword(keyword) {
  return getSignalThreads(state.items).find((thread) => thread.keywords.includes(keyword));
}

function daysBetween(startDateKey, endDateKey) {
  return Math.floor((new Date(`${endDateKey}T00:00:00`) - new Date(`${startDateKey}T00:00:00`)) / 86400000);
}

function renderSignalCard(signal, index) {
  return `
    <article class="signal-card ${signal.tone || signal.type}">
      <div class="signal-card-header">
        <div>
          <div class="focus-eyebrow">${signalTypeLabel(signal.type)}</div>
          <h2>${escapeHtml(signal.title)}</h2>
        </div>
        <span class="signal-rank">${index + 1}</span>
      </div>
      <p>${escapeHtml(signal.detail)}</p>
      <div class="chip-row">
        ${(signal.keywords || []).map((keyword) => `<span class="chip">#${escapeHtml(keyword)}</span>`).join("")}
      </div>
      <div class="signal-actions">
        <button class="small-button seed" data-signal-cultivate="${index}" title="이 신호를 재배 씨앗으로 — 키워보기">🌱 재배로</button>
        <button class="small-button" data-signal-idea="${index}">아이디어로</button>
        <button class="small-button" data-signal-today="${index}">Today 실험</button>
        ${signal.threadId ? `<button class="small-button" data-thread="${escapeHtml(signal.threadId)}">Thread</button>` : ""}
        ${signal.type === "project" && signal.threadId ? `<button class="small-button" data-signal-project="${escapeHtml(signal.threadId)}">프로젝트로</button>` : ""}
      </div>
    </article>
  `;
}

function signalTypeLabel(type) {
  return {
    emerging: "Emerging",
    project: "Project Candidate",
    stalled: "Stalled",
    learning: "Learning Link",
    pattern: "Pattern",
  }[type] || "Signal";
}

function currentSignals() {
  return buildSignalMap(getSignalThreads(state.items)).signals;
}

function selectSignalKeyword(keyword) {
  state.selectedSignalKeyword = keyword || "";
  saveUiState();
  render();
}

async function saveSignalAsIdea(index) {
  const signal = currentSignals()[Number(index)];
  if (!signal) return;
  const now = new Date().toISOString();
  const item = normalizeItem({
    id: uid("idea"),
    text: `${signal.title} · ${signal.detail}`,
    date: getTodayKey(),
    status: "open",
    type: "idea",
    horizon: signal.type === "project" ? "long" : "short",
    lane: "someday",
    importance: signal.type === "stalled" || signal.type === "project" ? "high" : "normal",
    momentum: "seed",
    context: "idea",
    timeBlock: currentTimeBlockKey(),
    dailyPriority: "parking",
    keywords: tokenize(`${signal.title} ${signal.detail} ${(signal.keywords || []).join(" ")}`),
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    sourceTag: "signal-idea",
  });
  state.items = [item, ...state.items];
  await repository.upsertItems([item]);
  setToast("Signal을 아이디어로 저장했어요.");
  saveUiState();
  render();
}

// Signal → 재배: plant an emerging signal as a cultivation seed (씨앗) so it
// flows into 씨앗→구체화→개발. Closes the radar → growth loop.
async function signalToCultivation(index) {
  const signal = currentSignals()[Number(index)];
  if (!signal) return;
  const theme = (signal.keywords || [])[0] || signal.title;
  await captureSeed(`${theme} — 키워보기`, { sourceTag: "signal" });
}

async function createSignalTodayExperiment(index) {
  const signal = currentSignals()[Number(index)];
  if (!signal) return;
  const now = new Date().toISOString();
  const item = normalizeItem({
    id: uid("signal"),
    text: `30분 실험: ${signal.title.replace(/[.。]$/, "")}`,
    date: state.selectedDate || getTodayKey(),
    status: "open",
    type: "task",
    horizon: "today",
    lane: "now",
    importance: signal.type === "stalled" || signal.type === "project" ? "high" : "normal",
    momentum: signal.type === "stalled" ? "blocked" : "active",
    context: signal.type === "learning" ? "learning" : "personal",
    timeBlock: currentTimeBlockKey(),
    dailyPriority: "primary",
    keywords: tokenize(`${signal.title} ${signal.detail} ${(signal.keywords || []).join(" ")}`),
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  });
  state.items = [item, ...state.items];
  await repository.upsertItems([item]);
  state.selectedView = "daily";
  setToast("Signal을 Today 30분 실험으로 올렸어요.");
  saveUiState();
  render();
}

async function promoteSignalThreadToProject(threadId) {
  const threads = getSignalThreads(state.items);
  const thread = threads.find((entry) => entry.id === threadId);
  if (!thread) return;
  const threadItems = thread.itemIds.map((id) => state.items.find((item) => item.id === id)).filter(Boolean);
  const currentMeta = getProjectMeta(thread, threadItems);
  const meta = {
    ...currentMeta,
    goal: currentMeta.goal || `${thread.title}를 실행 가능한 프로젝트로 구체화`,
    milestone:
      currentMeta.milestone ||
      threadItems.filter((item) => item.status !== "done").sort((a, b) => prioritySort(a, b))[0]?.text ||
      "첫 30분 실험 정의",
    status: "incubating",
    notes: currentMeta.notes || "Signals에서 프로젝트 후보로 승격됨",
  };
  state.projectMeta = {
    ...state.projectMeta,
    [threadId]: meta,
  };
  await repository.saveProjectMeta(threadId, meta);
  state.selectedThreadId = threadId;
  state.selectedView = "thread";
  setToast("Signal을 프로젝트 후보로 확장했어요.");
  saveUiState();
  render();
}

function renderThreadDetail(thread, threads) {
  if (!thread) {
    return `
      <div class="thread-detail-view">
        <div class="workspace-header">
          <div>
            <h1>Thread Detail</h1>
            <p class="muted">열어볼 thread를 선택해 주세요.</p>
          </div>
          <button class="ghost-button" data-view="threads">Signals</button>
        </div>
        <div class="empty">Signals 목록이나 사이드바에서 흐름 하나를 선택하면 상세가 열려요.</div>
      </div>
    `;
  }

  const threadItems = thread.itemIds
    .map((id) => state.items.find((item) => item.id === id))
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  const openItems = threadItems.filter((item) => item.status !== "done");
  const doneItems = threadItems.filter((item) => item.status === "done");
  const blockedItems = openItems.filter((item) => item.momentum === "blocked");
  const nextActions = openItems.sort((a, b) => prioritySort(a, b)).slice(0, 4);
  const laneCounts = countBy(threadItems, "lane");
  const momentumCounts = countBy(threadItems, "momentum");
  const prompts = buildThreadPrompts(thread, threadItems, openItems, blockedItems);
  const projectMeta = getProjectMeta(thread, threadItems);

  return `
    <div class="thread-detail-view">
      <div class="workspace-header">
        <div>
          <h1>${escapeHtml(thread.title)}</h1>
          <p class="muted">${stageLabel(thread.stage)} · ${thread.firstDate} → ${thread.lastDate} · ${threadItems.length} items</p>
        </div>
        <div class="thread-header-actions">
          <button class="ghost-button" data-suggest-thread="${thread.id}">Suggest Next Step</button>
          <button class="ghost-button" data-view="threads">Signals</button>
        </div>
      </div>

      <article class="thread-hero">
        <div>
          <div class="thread-meta">${thread.isRenamed ? "custom thread" : "auto-generated thread"}</div>
          <form class="thread-title-form" data-thread-title-form="${thread.id}">
            <input type="text" value="${escapeHtml(thread.title)}" aria-label="Thread title" />
            <button class="small-button" type="submit">이름 저장</button>
          </form>
          <div class="progress"><span style="width:${thread.completionRate}%"></span></div>
          <div class="chip-row">
            ${thread.keywords.map((keyword) => `<span class="chip">#${escapeHtml(keyword)}</span>`).join("")}
          </div>
        </div>
        <div class="thread-score-grid">
          <div class="thread-score"><strong>${thread.completionRate}%</strong><span>done</span></div>
          <div class="thread-score"><strong>${openItems.length}</strong><span>open</span></div>
          <div class="thread-score"><strong>${blockedItems.length}</strong><span>blocked</span></div>
          <div class="thread-score"><strong>${doneItems.length}</strong><span>finished</span></div>
        </div>
      </article>

      ${renderProjectBrief(thread, projectMeta)}
      ${renderThreadSuggestion(thread)}

      <div class="thread-detail-grid">
        <section class="thread-panel">
          <div class="thread-panel-header">
            <h2>Next Actions</h2>
            <span class="chip">${nextActions.length}</span>
          </div>
          <div class="thread-action-list">
            ${
              nextActions.length
                ? nextActions.map((item) => renderThreadAction(item)).join("")
                : `<div class="board-empty">남은 액션이 없어요. 완료된 흐름으로 정리해도 좋아요.</div>`
            }
          </div>
        </section>

        <section class="thread-panel">
          <div class="thread-panel-header">
            <h2>Pattern</h2>
          </div>
          <div class="mini-chart">
            ${miniCountBars(laneCounts, LANE_LABEL)}
            ${miniCountBars(momentumCounts, MOMENTUM_LABEL)}
          </div>
        </section>
      </div>

      <section class="thread-panel">
        <div class="thread-panel-header">
          <h2>Growth Notes</h2>
          <span class="chip">${stageLabel(thread.stage)}</span>
        </div>
        <div class="insight-list">
          ${prompts.map((prompt) => `<p>${escapeHtml(prompt)}</p>`).join("")}
        </div>
      </section>

      <section class="thread-panel">
        <div class="thread-panel-header">
          <h2>Timeline</h2>
          <span class="chip">${threadItems.length}</span>
        </div>
        <div class="thread-timeline">
          ${threadItems.map((item) => renderThreadTimelineItem(item)).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderThreadCard(thread) {
  const threadItems = thread.itemIds
    .map((id) => state.items.find((item) => item.id === id))
    .filter(Boolean)
    .slice(-4)
    .reverse();
  const projectMeta = getProjectMeta(thread, threadItems);
  const hasProjectBrief = isProjectThread(thread, projectMeta);

  return `
    <article class="thread-card">
      <div class="thread-card-header">
        <div>
          <h2>${escapeHtml(thread.title)}</h2>
          <div class="thread-meta">
            ${projectMeta.projectNo ? `${escapeHtml(projectMeta.projectNo)} · ` : ""}${stageLabel(thread.stage)} · ${thread.firstDate} → ${thread.lastDate}
          </div>
        </div>
        <button class="small-button" data-thread="${thread.id}">열기</button>
      </div>
      <form class="thread-title-form" data-thread-title-form="${thread.id}">
        <input type="text" value="${escapeHtml(thread.title)}" aria-label="Thread title" />
        <button class="small-button" type="submit">이름 저장</button>
      </form>
      <div class="progress"><span style="width:${thread.completionRate}%"></span></div>
      <div class="chip-row">
        ${thread.isRenamed ? `<span class="chip">custom name</span>` : ""}
        ${hasProjectBrief && projectMeta.targetDate ? `<span class="chip">target ${escapeHtml(projectMeta.targetDate)}</span>` : ""}
        ${hasProjectBrief ? `<span class="chip">${PROJECT_STATUS_LABEL[projectMeta.status] || PROJECT_STATUS_LABEL.active}</span>` : ""}
        ${thread.keywords.map((keyword) => `<span class="chip">#${escapeHtml(keyword)}</span>`).join("")}
      </div>
      <div class="item-list">
        ${threadItems.map((item) => renderCompactItem(item)).join("")}
      </div>
    </article>
  `;
}

function renderProjectBrief(thread, meta) {
  return `
    <section class="project-brief">
      <div class="project-brief-header">
        <div>
          <div class="focus-eyebrow">Project Brief</div>
          <h2>${meta.projectNo ? `${escapeHtml(meta.projectNo)} · ` : ""}${escapeHtml(thread.title)}</h2>
        </div>
        <span class="chip ${meta.status}">${PROJECT_STATUS_LABEL[meta.status] || PROJECT_STATUS_LABEL.active}</span>
      </div>
      <form class="project-form" data-project-form="${thread.id}">
        <label>
          <span>Project No.</span>
          <input name="projectNo" type="text" value="${escapeHtml(meta.projectNo)}" placeholder="PRJ-001" />
        </label>
        <label>
          <span>Target Date</span>
          <input name="targetDate" type="date" value="${escapeHtml(meta.targetDate)}" />
        </label>
        <label>
          <span>Status</span>
          <select name="status">
            ${Object.entries(PROJECT_STATUS_LABEL)
              .map(
                ([value, label]) =>
                  `<option value="${value}" ${meta.status === value ? "selected" : ""}>${label}</option>`,
              )
              .join("")}
          </select>
        </label>
        <label class="span-2">
          <span>Goal</span>
          <textarea name="goal" rows="2" placeholder="이 프로젝트가 9월까지 도달해야 하는 상태">${escapeHtml(meta.goal)}</textarea>
        </label>
        <label class="span-2">
          <span>Next Milestone</span>
          <textarea name="milestone" rows="2" placeholder="가장 가까운 체크포인트와 산출물">${escapeHtml(meta.milestone)}</textarea>
        </label>
        <label class="span-2">
          <span>Success Criteria</span>
          <textarea name="successCriteria" rows="2" placeholder="완료를 판단할 수 있는 기준">${escapeHtml(meta.successCriteria)}</textarea>
        </label>
        <label class="span-2">
          <span>Notes</span>
          <textarea name="notes" rows="3" placeholder="결정 사항, 리스크, 다음에 떠올릴 맥락">${escapeHtml(meta.notes)}</textarea>
        </label>
        <div class="project-form-actions span-2">
          <span class="status">${state.toast}</span>
          <button class="primary-button" type="submit">Project 저장</button>
        </div>
      </form>
    </section>
  `;
}

function renderThreadSuggestion(thread) {
  const suggestion = state.threadSuggestions[thread.id];
  const controls = renderAiProviderControls(thread.id);
  if (!suggestion) {
    return `
      <section class="ai-suggestion empty-suggestion">
        <div>
          <div class="focus-eyebrow">Suggestion Engine</div>
          <h2>다음 행동이 필요하면 제안을 만들 수 있어요.</h2>
          <p class="muted">${AI_PROVIDER_LABEL[state.aiProviderKind] || AI_PROVIDER_LABEL.rules} provider가 project brief, timeline, open/blocked items를 보고 next step을 골라줘요.</p>
        </div>
        <div class="ai-empty-actions">
          ${controls}
          <button class="primary-button" data-suggest-thread="${thread.id}">Suggest Next Step</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="ai-suggestion">
      <div class="ai-suggestion-header">
        <div>
          <div class="focus-eyebrow">Suggestion Engine</div>
          <h2>Next Step Suggestions</h2>
          <p class="muted">${escapeHtml(suggestion.summary)}</p>
        </div>
        <div class="ai-suggestion-meta">
          <span class="chip">${escapeHtml(suggestion.provider)}</span>
          ${controls}
          <button class="small-button" data-suggest-thread="${thread.id}">다시 제안</button>
        </div>
      </div>
      <div class="suggestion-list">
        ${suggestion.suggestions.map((item, index) => renderSuggestionItem(item, index)).join("")}
      </div>
    </section>
  `;
}

function renderReflectionCoach(scope, key) {
  const coach = state.reflectionCoaches?.[reflectionCoachKey(scope, key)];
  const title = scope === "daily" ? "오늘 회고 코치" : "월간 회고 코치";
  const subtitle =
    scope === "daily"
      ? "오늘의 실행, 막힘, 회고 메모를 보고 다음 조정을 제안해요."
      : "이번 달 패턴과 종합 회고를 보고 성장 방식의 다음 실험을 제안해요.";
  const controls = renderAiProviderControls(`${scope}-${key}`);

  if (!coach) {
    return `
      <section class="ai-suggestion reflection-coach empty-suggestion">
        <div>
          <div class="focus-eyebrow">회고 코치</div>
          <h2>${title}</h2>
          <p class="muted">${subtitle}</p>
        </div>
        <div class="ai-empty-actions">
          ${controls}
          <button class="primary-button" data-reflection-coach-scope="${scope}" data-reflection-coach-key="${escapeHtml(key)}">코치 받기</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="ai-suggestion reflection-coach">
      <div class="ai-suggestion-header">
        <div>
          <div class="focus-eyebrow">회고 코치</div>
          <h2>${title}</h2>
          <p class="muted">${escapeHtml(coach.summary || subtitle)}</p>
        </div>
        <div class="ai-suggestion-meta">
          <span class="chip">${escapeHtml(coach.provider)}</span>
          ${controls}
          <button class="small-button" data-reflection-coach-scope="${scope}" data-reflection-coach-key="${escapeHtml(key)}">다시 코칭</button>
        </div>
      </div>
      <div class="reflection-coach-grid">
        ${renderCoachSection("관찰", coach.observations)}
        ${renderCoachSection("질문", coach.questions)}
        <article class="reflection-coach-section">
          <span>다음 실험</span>
          <p>${escapeHtml(coach.experiment || "다음 행동을 30분 안에 끝날 단위로 줄여보세요.")}</p>
        </article>
      </div>
    </section>
  `;
}

function renderCoachSection(title, lines) {
  return `
    <article class="reflection-coach-section">
      <span>${title}</span>
      <div class="insight-list">
        ${
          lines?.length
            ? lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")
            : `<p class="muted">조금 더 기록하면 코칭 포인트가 선명해져요.</p>`
        }
      </div>
    </article>
  `;
}

function renderAiProviderControls(threadId) {
  return `
    <div class="ai-provider-controls" data-provider-controls="${threadId}">
      <select data-ai-provider aria-label="AI provider">
        ${Object.entries(AI_PROVIDER_LABEL)
          .map(
            ([value, label]) =>
              `<option value="${value}" ${state.aiProviderKind === value ? "selected" : ""}>${label}</option>`,
          )
          .join("")}
      </select>
      <input
        data-ollama-model
        type="text"
        value="${escapeHtml(state.ollamaModel)}"
        aria-label="Ollama model"
        placeholder="llama3.2"
        ${state.aiProviderKind === "ollama" ? "" : "disabled"}
      />
    </div>
  `;
}

function renderSuggestionItem(item, index) {
  return `
    <article class="suggestion-item">
      <span class="suggestion-rank">${index + 1}</span>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.action)}</p>
        <small>${escapeHtml(item.why)}</small>
      </div>
    </article>
  `;
}

function getProjectMeta(thread, threadItems = []) {
  return {
    ...inferProjectMeta(thread, threadItems),
    ...(state.projectMeta[thread.id] || {}),
  };
}

function isProjectThread(thread, meta) {
  return Boolean(state.projectMeta[thread.id] || meta.projectNo || thread.stage === "project");
}

function inferProjectMeta(thread, threadItems) {
  const joined = [thread.title, ...threadItems.map((item) => item.text)].join(" ");
  const projectNo = joined.match(/PRJ[-\s]?\d{3}/i)?.[0]?.replace(/\s+/g, "-").toUpperCase() || "";
  const targetDate = inferTargetDate(thread, threadItems);
  const status = thread.stage === "completed" ? "completed" : thread.stage === "seed" ? "incubating" : "active";

  return {
    projectNo,
    goal: inferGoal(thread, targetDate),
    targetDate,
    milestone: inferMilestone(threadItems),
    successCriteria: "",
    status,
    notes: "",
  };
}

function inferTargetDate(thread, threadItems) {
  const septemberItem = threadItems
    .filter((item) => item.date.startsWith("2026-09"))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  return septemberItem?.date || thread.lastDate || "";
}

function inferGoal(thread, targetDate) {
  if (!targetDate) return "";
  return `${thread.title}를 ${targetDate}까지 실행 가능한 기능 확장 프로젝트로 정리`;
}

function inferMilestone(threadItems) {
  const openItems = threadItems
    .filter((item) => item.status !== "done")
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  return openItems[0]?.text || "";
}

function renderThreadAction(item) {
  return `
    <article class="thread-action">
      <div>
        <div class="board-card-title">${escapeHtml(item.text)}</div>
        <div class="chip-row">
          <span class="chip ${item.lane}">${LANE_LABEL[item.lane]}</span>
          <span class="chip ${item.importance}">${IMPORTANCE_LABEL[item.importance]}</span>
          <span class="chip ${item.momentum}">${MOMENTUM_LABEL[item.momentum]}</span>
        </div>
      </div>
      <div class="thread-action-buttons">
        <button class="small-button" data-toggle="${item.id}">완료</button>
        ${item.lane !== "now" ? `<button class="small-button" data-move-lane="now" data-item-id="${item.id}">지금</button>` : ""}
        ${
          item.momentum !== "blocked"
            ? `<button class="small-button" data-item-field-button="momentum" data-item-value="blocked" data-item-id="${item.id}">막힘</button>`
            : `<button class="small-button" data-item-field-button="momentum" data-item-value="active" data-item-id="${item.id}">풀기</button>`
        }
      </div>
    </article>
  `;
}

function renderThreadTimelineItem(item) {
  return `
    <article class="timeline-item ${item.status === "done" ? "done" : ""}">
      <div class="timeline-date">${item.date}</div>
      <div>
        <div class="item-text">${escapeHtml(item.text)}</div>
        <div class="chip-row">
          <span class="chip ${item.type}">${TYPE_LABEL[item.type]}</span>
          <span class="chip ${item.horizon}">${HORIZON_LABEL[item.horizon]}</span>
          <span class="chip ${item.lane}">${LANE_LABEL[item.lane]}</span>
          <span class="chip ${item.momentum}">${MOMENTUM_LABEL[item.momentum]}</span>
          <span class="chip">${item.status === "done" ? "done" : "open"}</span>
        </div>
      </div>
    </article>
  `;
}

function buildThreadPrompts(thread, threadItems, openItems, blockedItems) {
  const prompts = [];
  const longItems = threadItems.filter((item) => item.horizon === "long");
  const nowItems = openItems.filter((item) => item.lane === "now");

  if (thread.stage === "seed") {
    prompts.push("아직 씨앗 단계예요. 30분 안에 끝나는 실험 하나를 Now로 올려보면 흐름이 살아나요.");
  }
  if (thread.stage === "project") {
    prompts.push("프로젝트 후보로 충분히 커졌어요. 목표, 산출물, 다음 체크포인트를 따로 고정할 시점이에요.");
  }
  if (thread.stage === "quiet") {
    prompts.push("최근 움직임이 조용해졌어요. 보류할지, 다시 시작할지, 아주 작은 다음 행동을 정하면 좋아요.");
  }
  if (blockedItems.length) {
    prompts.push("막힌 항목이 있어요. 필요한 정보, 사람, 환경 중 무엇이 병목인지 적어보면 풀릴 가능성이 커요.");
  }
  if (longItems.length >= 2 && nowItems.length === 0) {
    prompts.push("장기 신호는 있는데 오늘 실행 항목이 없어요. 장기 항목 하나를 Now 액션으로 쪼개보세요.");
  }
  if (!prompts.length) {
    prompts.push("흐름이 건강하게 움직이고 있어요. 다음 액션 하나만 유지하면 월간 리뷰에서 좋은 성장 흔적이 남을 거예요.");
  }

  return prompts;
}

function miniCountBars(counts, labels) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (!total) return "";

  return Object.entries(labels)
    .filter(([key]) => counts[key])
    .map(([key, label]) => {
      const value = Math.round(((counts[key] || 0) / total) * 100);
      return bar(label, value, `var(--${countColor(key)})`);
    })
    .join("");
}

function countColor(key) {
  if (["now", "critical", "blocked"].includes(key)) return "rose";
  if (["build", "high", "active"].includes(key)) return "green";
  if (["invest", "normal", "seed"].includes(key)) return "blue";
  return "amber";
}

function renderCompactItem(item) {
  return `
    <div class="item">
      <span class="chip ${item.type}">${TYPE_LABEL[item.type]}</span>
      <div>
        <div class="item-text">${escapeHtml(item.text)}</div>
        <div class="item-meta">${item.date} · ${LANE_LABEL[item.lane]} · ${MOMENTUM_LABEL[item.momentum]}</div>
      </div>
      <span class="chip">${item.status === "done" ? "done" : "open"}</span>
    </div>
  `;
}

function renderMonthly(threads) {
  const review = buildMonthlyReview(state.items, threads);
  const monthKey = state.selectedDate.slice(0, 7);
  const reflection = getMonthlyReflection(monthKey);
  const conclusions = buildMonthlyConclusionLines(review);
  return `
    <div class="monthly-view">
      <div class="workspace-header">
        <div>
          <h1>${monthKey} 월간 리뷰</h1>
          <p class="muted">${review.monthItems.length}개 항목 · ${review.monthThreads.length}개 흐름</p>
        </div>
      </div>
      <article class="review-card monthly-summary-card">
        <div class="review-card-header">
          <h2>이번 달 결론</h2>
          <span class="chip">3줄 요약</span>
        </div>
        <div class="summary-lines">
          ${conclusions.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
        </div>
      </article>
      <div class="review-snapshot">
        ${reviewMetric("완료 전환", `${review.completionRate}%`, `${review.doneCount}개 완료`)}
        ${reviewMetric("아이디어→실행", `${review.actionConversionRate}%`, `할 일 완료 ${review.taskDoneRate}%`)}
        ${reviewMetric("중요 항목", `${review.highLeverageDoneRate}%`, "중요 항목 완료")}
        ${reviewMetric("막힘", `${review.blockedRate}%`, `${review.blocked.length}개 항목`)}
      </div>
      ${reviewPhaseHead("돌아보기", "이번 달 무슨 일이 있었나")}
      <article class="review-card">
        <div class="review-card-header">
          <h2>방향</h2>
          <span class="chip">${review.doneCount}개 완료</span>
        </div>
        <div class="keyword-cloud">
          ${
            review.topKeywords.length
              ? review.topKeywords
                  .map(([word, count], index) => {
                    const size = Math.min(30, 13 + count * 3 + (5 - Math.min(index, 5)));
                    return `<span style="font-size:${size}px">${escapeHtml(word)}</span>`;
                  })
                  .join("")
              : `<span class="muted">키워드 없음</span>`
          }
        </div>
        ${
          review.recurringKeywords.length
            ? `<div class="recurring-keywords">
                ${review.recurringKeywords
                  .map(([word, count, previous]) => `<span class="chip">반복 #${escapeHtml(word)} ${previous}→${count}</span>`)
                  .join("")}
              </div>`
            : ""
        }
      </article>
      <div class="review-grid">
        <article class="review-card">
          <div class="review-card-header">
            <h2>흐름 패턴</h2>
          </div>
          <div class="mini-chart">
            ${bar("완료 전환", review.completionRate, "var(--green)")}
            ${bar("아이디어→실행", review.actionConversionRate, "var(--blue)")}
            ${bar("중요 항목 완료", review.highLeverageDoneRate, "var(--rose)")}
            ${bar("명확한 할 일", review.taskDoneRate, "var(--green)")}
          </div>
        </article>
        <article class="review-card">
          <div class="review-card-header">
            <h2>분포</h2>
          </div>
          <div class="chip-row">
            ${priorityChips(review.laneCounts, LANE_LABEL)}
            ${priorityChips(review.momentumCounts, MOMENTUM_LABEL)}
          </div>
        </article>
      </div>
      <article class="review-card">
        <div class="review-card-header">
          <h2>신호</h2>
        </div>
        <div class="insight-list">
          ${
            review.signals.length
              ? review.signals.map((signal) => `<p>${escapeHtml(signal)}</p>`).join("")
              : `<p class="muted">이번 달 신호가 아직 부족해요.</p>`
          }
        </div>
      </article>

      ${reviewPhaseHead("막힌 것", "어디서 걸렸나")}
      <div class="review-grid">
        <article class="review-card">
          <div class="review-card-header">
            <h2>마찰</h2>
            <span class="chip">${review.blocked.length + review.openLong.length}</span>
          </div>
          <div class="insight-list">
            ${renderFrictionList(review)}
          </div>
        </article>
        <article class="review-card">
          <div class="review-card-header">
            <h2>효율 개선</h2>
          </div>
          <div class="insight-list">
            ${review.improvements.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
          </div>
        </article>
      </div>
      <article class="review-card">
        <div class="review-card-header">
          <h2>프로젝트 흐름</h2>
          <span class="chip">${review.projectPulse.length}</span>
        </div>
        <div class="project-pulse-list">
          ${
            review.projectPulse.length
              ? review.projectPulse.map(({ thread, meta, openCount, blockedCount }) => renderProjectPulse(thread, meta, openCount, blockedCount)).join("")
              : `<p class="muted">이번 달 프로젝트 brief가 연결된 thread가 아직 없어요.</p>`
          }
        </div>
      </article>

      ${reviewPhaseHead("다음 달로", "그래서 무엇을")}
      <article class="review-card">
        <div class="review-card-header">
          <h2>회고 질문</h2>
        </div>
        <div class="insight-list">
          ${review.reflectionPrompts.map((prompt) => `<p>${escapeHtml(prompt)}</p>`).join("")}
        </div>
      </article>
      ${renderGeneralReflection(monthKey, review, reflection)}
      ${renderReflectionCoach("monthly", monthKey)}
      <article class="review-card">
        <div class="review-card-header">
          <h2>다음 달 넛지</h2>
        </div>
        <div class="insight-list">
          ${
            review.nudges.length
              ? review.nudges.map((nudge) => `<p>${escapeHtml(nudge)}</p>`).join("")
              : `<p class="muted">조금 더 기록하면 다음 달 제안이 생겨요.</p>`
          }
        </div>
      </article>
    </div>
  `;
}

function renderMonthlyMentalPatterns(review) {
  const stats = review.mentalStats;
  return `
    <article class="review-card mental-pattern-card">
      <div class="review-card-header">
        <div>
          <h2>Noise Pattern</h2>
          <p class="muted">Mental Debugger가 잡은 반복 추측과 감정 온도</p>
        </div>
        <span class="chip">${stats.total} debug</span>
      </div>
      ${
        stats.total
          ? `
            <div class="mental-pattern-layout">
              <div class="mental-pattern-summary">
                <span><strong>${stats.averageIntensity}</strong><small>평균 열감</small></span>
                <span><strong>${stats.highHeatCount}</strong><small>고열감 기록</small></span>
                <span><strong>${stats.byPattern[0]?.label || "미분류"}</strong><small>최다 패턴</small></span>
                <span><strong>${stats.notImportantRate}%</strong><small>24h 후 낮음</small></span>
                <span><strong>${stats.noActionRate}%</strong><small>액션 없음</small></span>
                <span><strong>${Math.max(0, stats.total - stats.noActionCount)}</strong><small>액션 필요</small></span>
              </div>
              <div class="mental-pattern-list">
                ${stats.byPattern
                  .slice(0, 5)
                  .map((pattern) => `<span class="chip">${escapeHtml(pattern.label)} ${pattern.count}</span>`)
                  .join("")}
              </div>
              <div class="insight-list">
                ${buildMentalPatternInsights(stats).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
              </div>
              ${renderMentalDayHeatmap(stats.heatDays, "월간 감정 heatmap")}
            </div>
          `
          : `<p class="muted">이번 달 Mental Debugger 기록이 아직 없어요. 감정적으로 걸린 피드백을 하나만 분리해도 패턴이 생겨요.</p>`
      }
    </article>
  `;
}

function buildMentalPatternInsights(stats) {
  const lines = [];
  if (stats.byPattern[0]) {
    lines.push(`가장 자주 나타난 노이즈는 "${stats.byPattern[0].label}"이에요.`);
  }
  if (stats.averageIntensity >= 4) {
    lines.push("평균 감정 온도가 높아서 즉시 대응보다 다음 타임 재해석이 유리해요.");
  } else {
    lines.push("감정 온도는 관리 가능한 범위예요. 기록을 계속 쌓으면 트리거가 더 선명해져요.");
  }
  if (stats.notImportantRate >= 40) {
    lines.push(`24시간 후 낮아지는 이슈가 ${stats.notImportantRate}%라서, 반응 지연 규칙이 효과적일 가능성이 커요.`);
  }
  if (stats.noActionRate >= 40) {
    lines.push(`액션이 필요 없던 기록이 ${stats.noActionRate}%예요. 생각 정리만으로 닫히는 노이즈가 꽤 있어요.`);
  }
  return lines.slice(0, 4);
}

function renderMentalDayHeatmap(days, title) {
  if (!days.length) return "";
  return `
    <div class="mental-heatmap monthly-heatmap" aria-label="${escapeHtml(title)}">
      <div class="mental-heatmap-header">
        <span>${escapeHtml(title)}</span>
        <small>일별 평균 감정 강도</small>
      </div>
      <div class="mental-heatmap-cells">
        ${days
          .map(
            (day) => `
              <span
                class="heat-cell heat-${day.intensity}"
                title="${escapeHtml(day.dateKey)} · ${day.intensity}/5 · ${day.count}개"
              ></span>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderGeneralReflection(monthKey, review, reflection) {
  const starters = buildGeneralReflectionStarters(review);
  return `
    <article class="review-card general-reflection-card">
      <div class="review-card-header">
        <div>
          <h2>종합 회고</h2>
          <p class="muted">${monthKey} 개인 리뷰</p>
        </div>
        <span class="chip">${reflection.grew || reflection.worked || reflection.friction || reflection.adjustment || reflection.notes ? "저장됨" : "작성 중"}</span>
      </div>
      <div class="general-reflection-layout">
        <div class="reflection-starters">
          <div class="focus-eyebrow">시작점</div>
          <div class="insight-list">
            ${
              starters.length
                ? starters.map((starter) => `<p>${escapeHtml(starter)}</p>`).join("")
                : `<p class="muted">이번 달 기록이 쌓이면 회고 starter가 생겨요.</p>`
            }
          </div>
        </div>
        <form class="reflection-form" data-monthly-reflection-form="${escapeHtml(monthKey)}">
          <label>
            <span>이번 달 무엇이 성장했나?</span>
            <textarea name="grew" rows="3" placeholder="예: 아이디어를 프로젝트 brief로 바꾸는 속도가 좋아졌다.">${escapeHtml(reflection.grew)}</textarea>
          </label>
          <label>
            <span>효율이 좋았던 방식</span>
            <textarea name="worked" rows="3" placeholder="예: 하루 첫 집중 1개만 고정했을 때 진행이 빨랐다.">${escapeHtml(reflection.worked)}</textarea>
          </label>
          <label>
            <span>마찰 또는 반복 병목</span>
            <textarea name="friction" rows="3" placeholder="예: 큰 항목을 너무 오래 열어둬서 다음 행동이 흐려졌다.">${escapeHtml(reflection.friction)}</textarea>
          </label>
          <label>
            <span>다음 달 조정 1가지</span>
            <textarea name="adjustment" rows="3" placeholder="예: 장기 항목은 매주 금요일 30분 실험으로 쪼갠다.">${escapeHtml(reflection.adjustment)}</textarea>
          </label>
          <label class="span-2">
            <span>자유 노트</span>
            <textarea name="notes" rows="4" placeholder="이번 달의 느낌, 배운 점, 다음 달의 태도">${escapeHtml(reflection.notes)}</textarea>
          </label>
          <div class="reflection-form-actions span-2">
            <button class="primary-button" type="submit">종합 회고 저장</button>
          </div>
        </form>
      </div>
    </article>
  `;
}

function reviewMetric(label, value, helper) {
  return `
    <div class="review-metric">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${helper}</small>
    </div>
  `;
}

// Labeled horizontal bar (label · track · value%). Used by weekly/monthly review
// charts. (Restored — these two helpers were dropped in an earlier cleanup,
// which silently crashed the 월간/주간 리뷰 render.)
function bar(label, value, color = "var(--amber)") {
  const pct = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  return `
    <div class="bar">
      <span>${escapeHtml(String(label))}</span>
      <div class="bar-track"><span style="width:${pct}%; background:${color};"></span></div>
      <span>${pct}%</span>
    </div>
  `;
}

// Phase divider for the monthly review — gives the wall of cards a retrospective
// spine (돌아보기 → 막힌 것 → 다음 달로), matching the eyebrow style used elsewhere.
function reviewPhaseHead(eyebrow, title) {
  return `
    <div class="review-phase-head">
      <span class="focus-eyebrow">${escapeHtml(eyebrow)}</span>
      <h2>${escapeHtml(title)}</h2>
    </div>
  `;
}

// Count chips for a category map ({key: count} + {key: label}).
function priorityChips(counts, labelMap) {
  const entries = Object.entries(labelMap).filter(([key]) => counts && counts[key]);
  if (!entries.length) return `<span class="chip muted">데이터 없음</span>`;
  return entries.map(([key, label]) => `<span class="chip">${escapeHtml(String(label))} ${counts[key]}</span>`).join("");
}

function renderFrictionList(review) {
  const items = [];
  for (const item of review.blocked.slice(0, 3)) {
    items.push(`<p>막힘: ${escapeHtml(item.text)}</p>`);
  }
  for (const item of review.openLong.slice(0, 3)) {
    items.push(`<p>열린 장기 항목: ${escapeHtml(item.text)}</p>`);
  }
  return items.length ? items.join("") : `<p class="muted">이번 달의 뚜렷한 병목은 아직 없어요.</p>`;
}

function renderProjectPulse(thread, meta, openCount, blockedCount) {
  return `
    <button class="project-pulse" data-thread="${thread.id}">
      <strong>${meta.projectNo ? `${escapeHtml(meta.projectNo)} · ` : ""}${escapeHtml(thread.title)}</strong>
      <span>${meta.targetDate ? `target ${escapeHtml(meta.targetDate)} · ` : ""}${openCount} open · ${blockedCount} blocked</span>
    </button>
  `;
}

// Right-rail data: the cultivation FLOW (motion, not census). Funnel by stage,
// stale items needing care, the project closest to done, and this week's real
// forward moves / harvests. All computed from pipeline items + projects.
function buildCultivationFlow(items, projects) {
  const now = Date.now();
  const DAY = 86400000;
  const WEEK = 7 * DAY;
  const openPipeline = items.filter((item) => item.pipeline && item.status !== "done");

  const funnel = {
    now: openPipeline.filter((item) => item.lane === "now").length,
    next: openPipeline.filter((item) => item.lane === "next").length,
    build: openPipeline.filter((item) => item.lane === "build").length,
  };

  // 지금 돌볼 것 — seeds/구체화 that have sat longest without a stage change.
  const ageDays = (item) =>
    Math.max(0, Math.floor((now - new Date(item.laneMovedAt || item.createdAt).getTime()) / DAY));
  const tend = openPipeline
    .filter((item) => item.lane === "now" || item.lane === "next")
    .map((item) => ({ item, days: ageDays(item) }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 2);

  // 완료에 가까운 것 — active project with the highest task completion (<100%).
  const completionOf = (project) => {
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    const done = tasks.filter((task) => task.done).length;
    return { done, total: tasks.length, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
  };
  const closest =
    (projects || [])
      .filter((project) => project.status !== "done")
      .map((project) => ({ project, ...completionOf(project) }))
      .filter((entry) => entry.total > 0 && entry.pct < 100)
      .sort((a, b) => b.pct - a.pct)[0] || null;

  // 이번 주 움직임 — honest counts from the tracked timestamps.
  const within = (ts) => ts && now - new Date(ts).getTime() < WEEK;
  const forward = items.filter((item) => item.pipeline && within(item.lastForwardAt)).length;
  const harvested = items.filter(
    (item) => item.pipeline && item.status === "done" && within(item.completedAt),
  ).length;

  return { funnel, openCount: openPipeline.length, tend, closest, forward, harvested };
}

function renderInspector() {
  const { funnel, openCount, tend, closest, forward, harvested } = buildCultivationFlow(
    state.items,
    state.projects,
  );

  const stage = (key, cls, label, count) => `
    <button class="flow-stage ${cls}" data-goto-board title="재배 탭에서 보기">
      <span class="flow-stage-dot"></span>
      <span class="flow-stage-num">${count}</span>
      <span class="flow-stage-lbl">${label}</span>
    </button>`;

  const tendBlock = tend.length
    ? tend
        .map(({ item, days }) => {
          const warn = days >= 7;
          const isSeed = item.lane === "now";
          const hint = isSeed ? "↓ 오늘로 내려 키워볼까요?" : "→ 구체화에서 멈춤 · 다음 행동 정하기";
          const action = isSeed ? `data-pull-today="${item.id}"` : `data-goto-board`;
          return `
            <button class="flow-tend ${warn ? "warn" : ""}" ${action} title="${escapeHtml(item.text)}">
              <span class="flow-tend-top">
                <span class="flow-tend-title">${escapeHtml(item.text)}</span>
                <span class="flow-tend-age ${warn ? "warn" : ""}">${days}일째</span>
              </span>
              <span class="flow-tend-hint">${hint}</span>
            </button>`;
        })
        .join("")
    : `<p class="muted">막 돌본 씨앗들이에요 ✨</p>`;

  const closestBlock = closest
    ? `<button class="flow-prj" data-board-open-project="${closest.project.id}">
         <span class="flow-prj-top">
           <span class="flow-prj-name">${escapeHtml(closest.project.no ? `${closest.project.no} · ` : "")}${escapeHtml(closest.project.title)}</span>
           <span class="flow-prj-pct">${closest.pct}%</span>
         </span>
         <span class="flow-prj-track"><span class="flow-prj-fill" style="width:${closest.pct}%"></span></span>
         <span class="flow-prj-sub">${closest.total}개 중 ${closest.done}개 완료</span>
       </button>`
    : `<p class="muted">진행 중인 프로젝트가 아직 없어요.</p>`;

  return `
    <aside class="inspector cultivation-rail">
      <div>
        <div class="section-heading flow-head">
          <h2>재배 흐름</h2>
          <span class="flow-total">진행 ${openCount}</span>
        </div>
        ${
          openCount === 0
            ? `<p class="muted flow-empty">아직 재배 중인 씨앗이 없어요. Today 카드의 🌱로 보내보세요.</p>`
            : `<div class="flow-funnel">
                 ${stage("now", "seed", "씨앗", funnel.now)}
                 <span class="flow-arrow-sm" aria-hidden="true">›</span>
                 ${stage("next", "define", "구체화", funnel.next)}
                 <span class="flow-arrow-sm" aria-hidden="true">›</span>
                 ${stage("build", "build", "개발", funnel.build)}
               </div>`
        }
      </div>
      <div>
        <div class="section-heading"><h2>지금 돌볼 것</h2></div>
        <div class="flow-tend-list">${tendBlock}</div>
      </div>
      <div>
        <div class="section-heading"><h2>완료에 가까운 것</h2></div>
        ${closestBlock}
      </div>
      <div>
        <div class="section-heading"><h2>이번 주 움직임</h2></div>
        <div class="flow-motion">
          <div class="flow-mpill">
            <span class="flow-mval fwd">→ ${forward}</span>
            <span class="flow-mlbl">단계 전진</span>
          </div>
          <div class="flow-mpill">
            <span class="flow-mval harvest">✓ ${harvested}</span>
            <span class="flow-mlbl">수확 완료</span>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedView = button.dataset.view;
      saveUiState();
      render();
    });
  });

  document.querySelector("#selected-date")?.addEventListener("change", (event) => {
    state.selectedDate = event.target.value;
    saveUiState();
    render();
  });

  document.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDate = button.dataset.date;
      state.selectedView = "daily";
      saveUiState();
      render();
    });
  });

  document.querySelectorAll("[data-thread]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedThreadId = button.dataset.thread;
      state.selectedView = "thread";
      saveUiState();
      render();
    });
  });

  document.querySelector("#draft")?.addEventListener("input", (event) => {
    state.draft = event.target.value;
  });

  bindIdeaComposerEvents();
  bindIdeaCardEvents();
  bindProjectEvents();

  document.querySelectorAll("[data-capture-field]").forEach((select) => {
    select.addEventListener("change", () => {
      state.dailyCapture = {
        ...defaultDailyCapture(),
        ...state.dailyCapture,
        [select.dataset.captureField]: select.value,
      };
      saveUiState();
    });
  });

  document.querySelector("[data-action='add']")?.addEventListener("click", addItems);

  document.querySelectorAll("[data-block-inline-open]").forEach((button) => {
    button.addEventListener("click", () => {
      blockInlineActiveBlock = button.dataset.blockInlineOpen;
      render();
      requestAnimationFrame(() => {
        document.querySelector(`[data-block-inline-input="${blockInlineActiveBlock}"]`)?.focus();
      });
    });
  });

  document.querySelectorAll("[data-block-inline-cancel]").forEach((button) => {
    button.addEventListener("click", () => {
      blockInlineActiveBlock = null;
      render();
    });
  });

  document.querySelectorAll("[data-block-inline-input]").forEach((input) => {
    const autoGrow = () => {
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
    };
    input.addEventListener("input", autoGrow);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        // Enter saves (one or many lines); Shift+Enter inserts a newline.
        event.preventDefault();
        addInlineBlockItem(input.dataset.blockInlineInput, input.value);
      } else if (event.key === "Escape") {
        blockInlineActiveBlock = null;
        render();
      }
    });
    input.addEventListener("paste", (event) => {
      const text = event.clipboardData?.getData("text") || "";
      if (!text.includes("\n")) return; // single line — let default paste work
      event.preventDefault();
      addInlineBlockItem(input.dataset.blockInlineInput, text);
    });
  });

  document.querySelectorAll("[data-signal-keyword]").forEach((element) => {
    element.addEventListener("click", () => {
      selectSignalKeyword(element.dataset.signalKeyword);
    });
  });

  document.querySelectorAll("[data-signal-cultivate]").forEach((button) => {
    button.addEventListener("click", () => {
      signalToCultivation(button.dataset.signalCultivate);
    });
  });

  document.querySelectorAll("[data-signal-idea]").forEach((button) => {
    button.addEventListener("click", () => {
      saveSignalAsIdea(button.dataset.signalIdea);
    });
  });

  document.querySelectorAll("[data-signal-today]").forEach((button) => {
    button.addEventListener("click", () => {
      createSignalTodayExperiment(button.dataset.signalToday);
    });
  });

  document.querySelectorAll("[data-signal-project]").forEach((button) => {
    button.addEventListener("click", () => {
      promoteSignalThreadToProject(button.dataset.signalProject);
    });
  });

  document.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleItem(button.dataset.toggle));
  });

  document.querySelectorAll("[data-today-cycle]").forEach((button) => {
    button.addEventListener("click", () => cycleTodayItemStatus(button.dataset.todayCycle));
  });

  document.querySelectorAll("[data-cycle-prio]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const item = state.items.find((it) => it.id === button.dataset.cyclePrio);
      if (!item) return;
      const prios = Object.keys(DAILY_PRIORITY_LABEL);
      const next = prios[(prios.indexOf(item.dailyPriority) + 1) % prios.length];
      updateItemField(item.id, "dailyPriority", next);
    });
  });

  document.querySelectorAll("[data-cycle-ctx]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const item = state.items.find((it) => it.id === button.dataset.cycleCtx);
      if (!item) return;
      const ctxs = Object.keys(DAILY_CONTEXT_LABEL);
      const next = ctxs[(ctxs.indexOf(item.context) + 1) % ctxs.length];
      updateItemField(item.id, "context", next);
    });
  });

  document.querySelectorAll("[data-to-cultivation]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      sendItemToCultivation(button.dataset.toCultivation);
    });
  });

  document.querySelectorAll("[data-quad]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const [id, quad] = btn.dataset.quad.split(":");
      const key = id + ":" + quad;
      if (quadClickTimers.has(key)) {
        clearTimeout(quadClickTimers.get(key));
        quadClickTimers.delete(key);
        handleQuadDouble(id, quad);
      } else {
        const t = setTimeout(() => {
          quadClickTimers.delete(key);
          handleQuadSingle(id, quad);
        }, 280);
        quadClickTimers.set(key, t);
      }
    });
  });

  document.querySelectorAll("[data-pull-today]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      pullItemToToday(button.dataset.pullToday);
    });
  });

  document.querySelectorAll("[data-seed-release]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      releaseSeed(button.dataset.seedRelease);
    });
  });

  document.querySelectorAll("[data-board-open-project]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      state.selectedProjectId = button.dataset.boardOpenProject;
      state.selectedView = "projects";
      saveUiState();
      render();
    });
  });

  document.querySelectorAll("[data-goto-board]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      state.selectedView = "board";
      saveUiState();
      render();
    });
  });

  document.querySelectorAll("[data-board-open-idea]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      expandedIdeaIds.add(button.dataset.boardOpenIdea);
      state.selectedView = "ideas";
      saveUiState();
      render();
    });
  });

  document.querySelectorAll("[data-delete-confirm]").forEach((button) => {
    button.addEventListener("click", () => requestDeleteItem(button.dataset.deleteConfirm));
  });

  document.querySelectorAll("[data-mental-debug-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveMentalDebug(form.dataset.mentalDebugForm, form);
    });
  });

  document.querySelectorAll("[data-mental-debug-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteMentalDebug(button.dataset.dateKey, button.dataset.mentalDebugDelete);
    });
  });

  document.querySelectorAll("[data-mental-debug-coach]").forEach((button) => {
    button.addEventListener("click", () => {
      suggestMentalDebugCoach(button.dataset.dateKey, button.dataset.mentalDebugCoach);
    });
  });

  document.querySelectorAll("[data-mental-recheck]").forEach((button) => {
    button.addEventListener("click", () => {
      updateMentalDebugRecheck(button.dataset.dateKey, button.dataset.mentalDebugId, button.dataset.mentalRecheck);
    });
  });

  document.querySelectorAll("[data-mental-debug-action]").forEach((button) => {
    button.addEventListener("click", () => {
      createTodayActionFromMentalDebug(button.dataset.dateKey, button.dataset.mentalDebugAction);
    });
  });

  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteItem(button.dataset.delete));
  });

  document.querySelector("[data-undo-delete]")?.addEventListener("click", restoreDeletedItem);

  document.querySelectorAll("[data-item-text]").forEach((input) => {
    autosizeTodayTextInput(input);
    input.addEventListener("input", () => autosizeTodayTextInput(input));
    input.addEventListener("change", () => updateItemText(input.dataset.itemText, input.value));
    input.addEventListener("blur", () => updateItemText(input.dataset.itemText, input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        input.blur();
      }
    });
  });

  document.querySelectorAll("[data-today-card]").forEach((card) => {
    // Drag the whole card body to reorder/move. Native HTML5 DnD is swallowed
    // by Tauri's webview, so we drive ordering through pointer events.
    card.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      // Let interactive controls (check/delete/move buttons, text editing,
      // selects) handle their own clicks — only the bare card body drags.
      if (event.target.closest("button, a, select, input, textarea")) return;
      beginTodayPointerDrag(card, event);
    });
  });

  document.querySelectorAll("[data-item-field]").forEach((select) => {
    select.addEventListener("change", () => {
      updateItemField(select.dataset.itemId, select.dataset.itemField, select.value);
    });
  });

  document.querySelectorAll("[data-move-lane]").forEach((button) => {
    button.addEventListener("click", () => {
      updateItemField(button.dataset.itemId, "lane", button.dataset.moveLane);
    });
  });

  document.querySelectorAll("[data-item-field-button]").forEach((button) => {
    button.addEventListener("click", () => {
      updateItemField(button.dataset.itemId, button.dataset.itemFieldButton, button.dataset.itemValue);
    });
  });

  document.querySelectorAll("[data-learning-cycle-course]").forEach((button) => {
    button.addEventListener("click", () => {
      cycleLearningCourse(button.dataset.learningCycleCourse, button.dataset.courseId);
    });
  });

  document.querySelectorAll("[data-learning-note-course]").forEach((button) => {
    button.addEventListener("click", () => {
      prepareLearningNote(button.dataset.learningNoteCourse, button.dataset.courseId);
    });
  });

  document.querySelectorAll("[data-learning-cycle-module]").forEach((button) => {
    button.addEventListener("click", () => {
      cycleLearningModule(button.dataset.learningCycleModule, button.dataset.courseId, button.dataset.moduleId);
    });
  });

  document.querySelector("[data-learning-ai-seeds]")?.addEventListener("click", suggestLearningSeeds);

  document.querySelectorAll("[data-learning-open-track]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.stopPropagation();
      state.selectedLearningTrackId = el.dataset.learningOpenTrack;
      render();
    });
  });

  document.querySelector("[data-learning-back]")?.addEventListener("click", () => {
    state.selectedLearningTrackId = "";
    render();
  });

  document.querySelectorAll("[data-learning-course-cultivation]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      learningCourseToCultivation(button.dataset.learningCourseCultivation, button.dataset.courseId);
    });
  });

  document.querySelector("[data-learning-weekly-hours]")?.addEventListener("change", (event) => {
    setLearningWeeklyHours(event.target.value);
  });

  document.querySelectorAll("[data-concept-seed]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      captureSeed(`"${button.dataset.conceptSeed}" 막힘 뚫기`, { sourceTag: "learning" });
    });
  });

  document.querySelectorAll("[data-coach-question-idea]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addQuickIdea(button.dataset.coachQuestionIdea);
    });
  });

  document.querySelector("[data-learning-open-review]")?.addEventListener("click", () => {
    const panel = document.querySelector(".learning-secondary");
    if (panel) panel.open = true;
    document.querySelector("#learning-review-queue")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.querySelectorAll("[data-learning-seed-idea]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      saveLearningSeedAsIdea(button.dataset.learningSeedIdea);
    });
  });

  document.querySelectorAll("[data-learning-note-module]").forEach((button) => {
    button.addEventListener("click", () => {
      prepareLearningNote(button.dataset.learningNoteModule, button.dataset.courseId, button.dataset.moduleId);
    });
  });

  document.querySelectorAll("[data-learning-detail-course]").forEach((button) => {
    button.addEventListener("click", () => {
      selectLearningCourse(button.dataset.learningDetailCourse, button.dataset.courseId);
    });
  });

  document.querySelectorAll("[data-learning-session-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveLearningSession(form);
    });
  });

  document.querySelectorAll("[data-learning-review-done]").forEach((button) => {
    button.addEventListener("click", () => {
      completeLearningReview(button.dataset.learningReviewDone, button.dataset.reviewConcept);
    });
  });

  document.querySelectorAll("[data-defer-tomorrow]").forEach((button) => {
    button.addEventListener("click", () => {
      deferItemToTomorrow(button.dataset.deferTomorrow);
    });
  });

  // North Star goals
  const goalAddForm = document.querySelector("[data-goal-add]");
  if (goalAddForm) {
    goalAddForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = new FormData(goalAddForm).get("goal")?.toString().trim();
      if (!value) return;
      state.goals = [...(state.goals || []), value].slice(0, 3);
      saveUiState();
      setToast("분기 목표를 추가했어요.");
      render();
    });
  }

  document.querySelectorAll("[data-goal-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.goalRemove, 10);
      state.goals = (state.goals || []).filter((_, i) => i !== idx);
      saveUiState();
      render();
    });
  });

  // Chronic-deferral decision buttons
  document.querySelectorAll("[data-decide-reason]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const item = state.items.find((i) => i.id === btn.dataset.decideReason);
      if (!item) return;
      item.deferReason = item.deferReason === btn.dataset.reason ? null : btn.dataset.reason;
      item.updatedAt = new Date().toISOString();
      await repository.upsertItems([item]);
      saveUiState();
      render();
    });
  });

  document.querySelectorAll("[data-decide-today]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const item = state.items.find((i) => i.id === btn.dataset.decideToday);
      if (!item) return;
      item.date = getTodayKey();
      item.dailyPriority = "primary";
      item.timeBlock = "morning";
      item.deferCount = 0;
      item.updatedAt = new Date().toISOString();
      await repository.upsertItems([item]);
      saveUiState();
      setToast("오늘 Primary로 못 박았어요. 이제 진짜 합니다.");
      render();
    });
  });

  document.querySelectorAll("[data-decide-schedule]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const item = state.items.find((i) => i.id === btn.dataset.decideSchedule);
      if (!item) return;
      const input = window.prompt("언제 할까요? 날짜(YYYY-MM-DD) 또는 며칠 뒤(숫자)", "7");
      if (input === null) return;
      let target = null;
      const trimmed = input.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        target = trimmed;
      } else if (/^\d+$/.test(trimmed)) {
        target = addDays(getTodayKey(), parseInt(trimmed, 10));
      }
      if (!target) {
        setToast("날짜 형식을 이해하지 못했어요.");
        return;
      }
      item.date = target;
      item.deferCount = 0;
      item.updatedAt = new Date().toISOString();
      await repository.upsertItems([item]);
      saveUiState();
      setToast(`${target}로 못 박았어요.`);
      render();
    });
  });

  document.querySelectorAll("[data-decide-kill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = state.items.find((i) => i.id === btn.dataset.decideKill);
      if (!item) return;
      if (!window.confirm(`"${item.text}"\n\n정말 접을까요? 항목이 삭제됩니다.`)) return;
      deleteItem(item.id);
      setToast("접었어요. 마음의 짐 하나 내려놓았네요.");
    });
  });

  const insightBtn = document.querySelector("[data-trigger-wrapup-insight]");
  if (insightBtn) {
    insightBtn.addEventListener("click", () => {
      const insights = buildDayInsights(state.selectedDate, state.items, state.dailyReviews || []);
      triggerWrapupInsight(state.selectedDate, insights);
    });
  }

  const deferAllBtn = document.querySelector("[data-defer-all-tomorrow]");
  if (deferAllBtn) {
    deferAllBtn.addEventListener("click", async () => {
      const openNonBlocked = state.items.filter(
        (i) => i.date === state.selectedDate && i.status !== "done" && i.momentum !== "blocked" && i.type !== "idea"
      );
      for (const item of openNonBlocked) {
        item.date = addDays(item.date, 1);
        item.lane = item.lane === "now" ? "next" : item.lane;
        item.deferCount = (item.deferCount || 0) + 1;
        item.updatedAt = new Date().toISOString();
      }
      await repository.upsertItems(openNonBlocked);
      saveUiState();
      setToast(`${openNonBlocked.length}개를 내일로 넘겼어요.`);
      render();
    });
  }

  document.querySelectorAll("[data-add-from-tomorrow]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.addFromTomorrow;
      if (!text) return;
      const now = new Date().toISOString();
      const item = normalizeItem({
        id: uid("item"),
        text,
        date: state.selectedDate,
        status: "open",
        createdAt: now,
        updatedAt: now,
        manualOrder: Date.now(),
        timeBlock: "morning",
        dailyPriority: "primary",
        type: "task",
      });
      state.items = [item, ...state.items];
      await repository.upsertItems([item]);
      saveUiState();
      setToast("Morning Focus에 추가했어요.");
      render();
    });
  });

  // Now banner: assign time block
  document.querySelectorAll("[data-add-now-to-block]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const block = btn.dataset.addNowToBlock;
      const itemId = btn.dataset.itemId;
      const item = state.items.find((i) => i.id === itemId);
      if (!item) return;
      item.timeBlock = block;
      item.updatedAt = new Date().toISOString();
      await repository.upsertItems([item]);
      saveUiState();
      setToast(`${TIME_BLOCK_LABEL[block]}에 배치했어요.`);
      render();
    });
  });

  // Now banner: mark done
  document.querySelectorAll("[data-item-status-done]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemId = btn.dataset.itemStatusDone;
      const item = state.items.find((i) => i.id === itemId);
      if (!item) return;
      item.status = "done";
      item.completedAt = new Date().toISOString();
      item.updatedAt = new Date().toISOString();
      await repository.upsertItems([item]);
      saveUiState();
      render();
    });
  });

  // Auto-trigger Ollama if wrapup view is active and not yet analyzed today
  if (state.selectedView === "wrapup" && state.aiProviderKind === "ollama") {
    const cache = wrapupInsightCache;
    if (cache.status === "idle" || (cache.status !== "loading" && cache.date !== state.selectedDate)) {
      const insights = buildDayInsights(state.selectedDate, state.items, state.dailyReviews || []);
      triggerWrapupInsight(state.selectedDate, insights);
    }
  }

  document.querySelectorAll("[data-move-time-next]").forEach((button) => {
    button.addEventListener("click", () => {
      moveItemToNextTimeBlock(button.dataset.moveTimeNext);
    });
  });

  document.querySelectorAll("[data-quick-time-shift]").forEach((button) => {
    button.addEventListener("click", () => {
      moveItemByQuickStep(button.dataset.quickTimeShift, button.dataset.direction);
    });
  });

  document.querySelectorAll("[data-move-time-block-next]").forEach((button) => {
    button.addEventListener("click", () => {
      moveTimeBlockToNext(button.dataset.moveTimeBlockNext);
    });
  });

  document.querySelectorAll("[data-defer-block-tomorrow]").forEach((button) => {
    button.addEventListener("click", () => {
      deferTimeBlockToTomorrow(button.dataset.deferBlockTomorrow);
    });
  });


  document.querySelectorAll("[data-board-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const rail = document.querySelector(".board-scroll");
      if (!rail) return;
      const direction = Number(button.dataset.boardScroll);
      rail.scrollBy({ left: direction * Math.round(rail.clientWidth * 0.82), behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-suggest-thread]").forEach((button) => {
    button.addEventListener("click", () => {
      suggestThreadNextSteps(button.dataset.suggestThread);
    });
  });

  document.querySelectorAll("[data-reflection-coach-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      suggestReflectionCoach(button.dataset.reflectionCoachScope, button.dataset.reflectionCoachKey);
    });
  });

  document.querySelectorAll("[data-ai-provider]").forEach((select) => {
    select.addEventListener("change", () => {
      state.aiProviderKind = select.value;
      saveUiState();
      render();
    });
  });

  document.querySelectorAll("[data-ollama-model]").forEach((input) => {
    input.addEventListener("change", () => {
      state.ollamaModel = input.value.trim() || "llama3.2";
      saveUiState();
      render();
    });
  });

  document.querySelectorAll("[data-thread-title-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      saveThreadTitle(form.dataset.threadTitleForm, input.value);
    });
  });

  document.querySelectorAll("[data-project-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveProjectMeta(form.dataset.projectForm, form);
    });
  });

  document.querySelectorAll("[data-monthly-reflection-form]").forEach((form) => {
    form.addEventListener("input", () => {
      autosaveMonthlyReflection(form.dataset.monthlyReflectionForm, form);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveMonthlyReflection(form.dataset.monthlyReflectionForm, form);
    });
  });

  document.querySelectorAll("[data-daily-review-form]").forEach((form) => {
    form.addEventListener("input", () => {
      autosaveDailyReview(form.dataset.dailyReviewForm, form);
    });
    form.addEventListener("change", (event) => {
      autosaveDailyReview(form.dataset.dailyReviewForm, form);
      // sync .selected class on energy radio buttons
      if (event.target.name === "energy") {
        form.querySelectorAll(".energy-option").forEach((label) => {
          label.classList.toggle("selected", label.querySelector("input")?.checked);
        });
      }
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveDailyReview(form.dataset.dailyReviewForm, form);
    });
  });

  document.querySelector("[data-action='export']")?.addEventListener("click", exportData);
  document.querySelector("[data-action='import']")?.addEventListener("click", () => {
    document.querySelector("#import-file").click();
  });
  document.querySelector("#import-file")?.addEventListener("change", (event) => {
    importData(event.target.files[0]);
  });

  document.querySelector("[data-action='sync-open']")?.addEventListener("click", () => {
    syncModalOpen = !syncModalOpen;
    render();
  });
  document.querySelectorAll("[data-sync-close]").forEach((el) =>
    el.addEventListener("click", () => {
      syncModalOpen = false;
      render();
    }),
  );
  document.querySelector("[data-sync-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveSyncConfig(event.currentTarget);
  });
  document.querySelector("[data-sync-now]")?.addEventListener("click", syncNow);
}

function autosizeTodayTextInput(input) {
  input.style.height = "auto";
  // With overflow hidden + border-box, scrollHeight excludes the border, so add
  // it back to avoid clipping the last line by the border width.
  const cs = getComputedStyle(input);
  const extra = cs.boxSizing === "border-box"
    ? parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    : 0;
  input.style.height = `${Math.max(24, input.scrollHeight + extra)}px`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();
initializeStorage();
