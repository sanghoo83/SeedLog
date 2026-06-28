const QUEUE_KEY = "seedlog.quickCaptureQueue.v1";

const LABELS = {
  context: {
    company: "회사",
    personal: "개인 업무",
    learning: "학습",
    idea: "아이디어",
    life: "생활/관리",
  },
  timeBlock: {
    morning: "09-12",
    workday: "12-18",
    evening: "18-24",
  },
  dailyPriority: {
    primary: "Primary",
    secondary: "Secondary",
    parking: "Parking",
  },
  lane: {
    now: "Now",
    next: "Next",
    build: "Build",
    invest: "Invest",
    someday: "Someday",
  },
  importance: {
    low: "Low",
    normal: "Normal",
    high: "High",
    critical: "Critical",
  },
  momentum: {
    seed: "Seed",
    active: "Active",
    blocked: "Blocked",
    stale: "Stale",
    done: "Done",
  },
};

const STOP_WORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "this",
  "that",
  "todo",
  "task",
  "done",
  "tent",
  "tentative",
  "오늘",
  "내일",
  "오전",
  "오후",
  "관련",
  "확인",
  "정리",
  "완료",
]);

const dom = {
  headerDate: document.querySelector("#header-date"),
  headerQueue: document.querySelector("#header-queue"),
  date: document.querySelector("#capture-date"),
  context: document.querySelector("#default-context"),
  draft: document.querySelector("#capture-draft"),
  save: document.querySelector("#save-queue"),
  download: document.querySelector("#download-json"),
  copy: document.querySelector("#copy-json"),
  clear: document.querySelector("#clear-queue"),
  queueCount: document.querySelector("#queue-count"),
  status: document.querySelector("#status-text"),
  previewCount: document.querySelector("#preview-count"),
  previewList: document.querySelector("#preview-list"),
};

const previewOverrides = new Map();
const hiddenPreviewItems = new Set();

dom.date.value = todayKey();
render();

dom.date.addEventListener("input", render);
dom.context.addEventListener("change", render);
dom.draft.addEventListener("input", render);
dom.save.addEventListener("click", saveQueue);
dom.download.addEventListener("click", downloadQueue);
dom.copy.addEventListener("click", copyQueue);
dom.clear.addEventListener("click", clearQueue);
dom.previewList.addEventListener("click", handlePreviewClick);
dom.previewList.addEventListener("change", handlePreviewChange);

function todayKey() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function uid(prefix = "mini") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadQueue() {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUEUE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function currentParsedItems(options = {}) {
  const parsed = parseDraft(dom.draft.value, {
    date: dom.date.value || todayKey(),
    defaultContext: dom.context.value || "company",
  });
  return applyPreviewOverrides(parsed, options);
}

function parseDraft(draft, options) {
  const entries = [];
  let timeBlock = "morning";

  for (const [lineNumber, rawLine] of String(draft || "").split("\n").entries()) {
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
    if (/^(evening|night|저녁|밤)$/i.test(raw)) {
      timeBlock = "evening";
      continue;
    }

    const parsed = parseLine(raw, timeBlock, options, lineNumber);
    if (parsed) entries.push(parsed);
  }

  return entries;
}

function parseLine(raw, timeBlock, options, lineNumber) {
  let line = raw.replace(/^\s*[-*•]\s+/, "").replace(/^\s*\[[ xX]\]\s+/, "").trim();
  if (!line) return null;

  let status = "open";
  let completedAt = null;
  let momentumOverride = "";
  let priorityOverride = "";

  const doneMatch = line.match(/^(done|완료|x)\s+(.+)$/i);
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

  const numberMatch = line.match(/^(\d+)[.)]\s*(.+)$/);
  const priorityIndex = numberMatch ? Number(numberMatch[1]) : null;
  if (numberMatch) line = numberMatch[2].trim();

  if (timeBlock === "morning" && priorityIndex !== null) {
    if (priorityIndex >= 15) {
      timeBlock = "evening";
    } else if (priorityIndex >= 8) {
      timeBlock = "workday";
    }
  }

  if (/^lunch break\b/i.test(line)) {
    line = line.replace(/^lunch break\s*[-:–—]?\s*/i, "").trim();
    timeBlock = "workday";
    if (!priorityOverride) priorityOverride = "secondary";
  }

  line = normalizeLine(line);
  if (!line) return null;

  const now = new Date().toISOString();
  const context = inferContext(line, options.defaultContext);
  const dailyPriority = priorityOverride || dailyPriorityFromIndex(priorityIndex);
  const analysis = analyzeItem(line, { status, dailyPriority, context });

  return {
    sourceKey: `${options.date}:${lineNumber}:${raw}`,
    id: uid("mini_item"),
    text: line,
    date: options.date,
    status,
    createdAt: now,
    updatedAt: now,
    completedAt,
    type: analysis.type,
    horizon: analysis.horizon,
    lane: analysis.lane,
    importance: analysis.importance,
    momentum: momentumOverride || analysis.momentum,
    context,
    timeBlock,
    dailyPriority,
    keywords: analysis.keywords,
  };
}

function applyPreviewOverrides(items, options = {}) {
  return items
    .filter((item) => options.includeHidden || !hiddenPreviewItems.has(item.sourceKey))
    .map((item) => {
      const override = previewOverrides.get(item.sourceKey);
      if (!override) return item;

      const merged = {
        ...item,
        ...override,
      };

      if (override.status) {
        merged.completedAt = override.status === "done" ? item.completedAt || new Date().toISOString() : null;
        merged.momentum = override.status === "done" ? "done" : override.momentum || "seed";
      }

      const analysis = analyzeItem(merged.text, {
        status: merged.status,
        dailyPriority: merged.dailyPriority,
        context: merged.context,
      });

      return {
        ...merged,
        type: analysis.type,
        horizon: analysis.horizon,
        lane: override.lane || analysis.lane,
        importance: override.importance || analysis.importance,
        momentum: override.momentum || merged.momentum || analysis.momentum,
        keywords: analysis.keywords,
      };
    });
}

function normalizeLine(line) {
  return line
    .replace(/^\s*[-*•]\s+/, "")
    .replace(/^\s*\[[ xX]\]\s+/, "")
    .replace(/^\s*\d+[.)]\s+/, "")
    .trim();
}

function dailyPriorityFromIndex(index) {
  if (index === null || Number.isNaN(index)) return "secondary";
  if (index <= 2 || (index >= 8 && index <= 10) || (index >= 15 && index <= 17)) return "primary";
  return "secondary";
}

function inferContext(text, fallback) {
  const lower = text.toLowerCase();
  if (/(학습|course|coursera|certificate|study|git|api review|python|sql|statistics|learning)/i.test(lower)) return "learning";
  if (/(아이디어|idea|seed|기획|개선|proposal|concept)/i.test(lower)) return "idea";
  if (/(운동|병원|생활|정리|관리|집|청소|택배|반납|hoa|accountant|health|life|tax|amz|amazon|costco|tire|rotation|water)/i.test(lower)) return "life";
  if (/(회사|업무|회의|client|report|team|work|office|timesheet|expense report|training req|tracking sheet|release|inquir|qual|recipe|ppt|email|sheet|bmm|pkg|casc?al|vcp|bl3)/i.test(lower)) return "company";
  return fallback || "personal";
}

function analyzeItem(text, item = {}) {
  return {
    type: classifyType(text),
    horizon: classifyHorizon(text),
    lane: classifyLane(text, item),
    importance: classifyImportance(text, item),
    momentum: classifyMomentum(text, item),
    keywords: tokenize(text),
  };
}

function classifyType(text) {
  const lower = text.toLowerCase();
  if (/[?？]$/.test(text) || /(why|how|what|어떻게|왜|무엇|뭐가|가능할까|좋을까)/i.test(lower)) return "question";
  if (/(아이디어|컨셉|설계|앱|프로젝트|실험|확장|개선|제안|연구|학습|개발|idea|prototype|research|learn|project|improvement)/i.test(lower)) return "idea";
  if (/(send|call|check|review|submit|finish|fix|update|email|report|create|release|작성|전화|검토|업데이트|완료|보내)/i.test(lower)) return "task";
  return "note";
}

function classifyHorizon(text) {
  const lower = text.toLowerCase();
  if (/(q[1-4]|분기|올해|로드맵|장기|중장기|9월|quarter|roadmap|monthly|certificate)/i.test(lower)) return "long";
  if (/(today|tomorrow|am|pm|오전|오후|오늘|내일|마감|timesheet|expense)/i.test(lower)) return "today";
  return "short";
}

function classifyLane(text, item = {}) {
  const lower = text.toLowerCase();
  if (item.dailyPriority === "parking" || /(later|backlog|someday|parking|나중|보류|언젠가)/i.test(lower)) return "someday";
  if (/(study|learning|course|certificate|git|api review|학습|공부|연구)/i.test(lower)) return "invest";
  if (/(build|create|release|implement|improvement|project|ppt|개선|구현|빌드|개발|제작)/i.test(lower)) return "build";
  if (item.dailyPriority === "primary") return "now";
  return "next";
}

function classifyImportance(text, item = {}) {
  const lower = text.toLowerCase();
  if (/(critical|urgent|asap|deadline|긴급|마감|반드시|꼭)/i.test(lower)) return "critical";
  if (item.dailyPriority === "primary" || /(high|important|priority|중요|우선|핵심)/i.test(lower)) return "high";
  if (item.dailyPriority === "parking" || /(low|minor|가벼운|나중)/i.test(lower)) return "low";
  return "normal";
}

function classifyMomentum(text, item = {}) {
  const lower = text.toLowerCase();
  if (item.status === "done") return "done";
  if (/(blocked|blocker|stuck|waiting|막힘|블로커|대기)/i.test(lower)) return "blocked";
  if (/(start|ship|build|test|create|release|send|update|진행|시작|작성|구현)/i.test(lower)) return "active";
  return "seed";
}

function tokenize(text) {
  return Array.from(
    new Set(
      String(text)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, " ")
        .split(/\s+/)
        .map((token) =>
          token
            .replace(/^[\d-]+|[\d-]+$/g, "")
            .replace(/(으로|에서|에게|부터|까지|처럼|보다|하고|이며|이고|라는)$/u, "")
            .replace(/(은|는|을|를|이|가|에|와|과|도|만)$/u, ""),
        )
        .filter((token) => token.length >= 2 && !STOP_WORDS.has(token)),
    ),
  ).slice(0, 10);
}

function saveQueue() {
  const items = currentParsedItems();
  if (!items.length) {
    setStatus("저장할 항목이 없어요.");
    return;
  }
  const queue = [...loadQueue(), ...items.map(toStoredItem)];
  writeQueue(queue);
  dom.draft.value = "";
  previewOverrides.clear();
  hiddenPreviewItems.clear();
  setStatus(`${items.length}개 항목을 큐에 저장했어요.`);
  render();
}

function toStoredItem(item) {
  const { sourceKey, ...storedItem } = item;
  return storedItem;
}

function downloadQueue() {
  const queue = loadQueue();
  if (!queue.length) {
    setStatus("다운로드할 큐가 비어 있어요.");
    return;
  }
  const blob = new Blob([JSON.stringify({ items: queue }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `seedlog-capture-${queue[0]?.date || todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus("SeedLog import용 JSON을 만들었어요.");
}

async function copyQueue() {
  const queue = loadQueue();
  if (!queue.length) {
    setStatus("복사할 큐가 비어 있어요.");
    return;
  }
  await navigator.clipboard.writeText(JSON.stringify({ items: queue }, null, 2));
  setStatus("JSON을 클립보드에 복사했어요.");
}

function clearQueue() {
  const queue = loadQueue();
  if (!queue.length) {
    setStatus("이미 큐가 비어 있어요.");
    return;
  }
  if (!confirm(`${queue.length}개 캡처 큐를 비울까요?`)) return;
  writeQueue([]);
  setStatus("캡처 큐를 비웠어요.");
  render();
}

function render() {
  const previewItems = currentParsedItems();
  const queue = loadQueue();
  const doneCount = previewItems.filter((item) => item.status === "done").length;
  const primaryCount = previewItems.filter((item) => item.dailyPriority === "primary").length;
  dom.headerDate.textContent = formatDateLabel(dom.date.value || todayKey());
  dom.headerQueue.textContent = `${queue.length} captured`;
  dom.queueCount.textContent = `${queue.length} captured`;
  dom.previewCount.textContent = `${previewItems.length} items`;
  dom.previewList.innerHTML = previewItems.length
    ? previewItems.map(renderPreviewItem).join("")
    : `<div class="empty">붙여넣은 메모를 SeedLog 항목으로 미리 보여줘요.</div>`;
  if (previewItems.length) {
    dom.status.textContent = `${doneCount}/${previewItems.length} done · ${primaryCount} primary`;
  }
}

function renderPreviewItem(item) {
  const statusLabel = item.status === "done" ? "Done" : item.dailyPriority === "parking" ? "Tentative" : "Open";
  const statusMark = item.status === "done" ? "✓" : item.dailyPriority === "parking" ? "△" : "";
  const typeLabel = item.type === "idea" ? "Idea" : item.type === "question" ? "Question" : "Task";
  const important = item.dailyPriority === "primary" || item.importance === "high" || item.importance === "critical";

  return `
    <article class="preview-item ${item.status === "done" ? "done" : ""}" data-source-key="${escapeHtml(item.sourceKey)}">
      <button class="todo-check" data-action="toggle-status" aria-label="Toggle done">${statusMark}</button>
      <div class="preview-main">
        <div class="preview-title-row">
          <strong>${escapeHtml(item.text)}</strong>
          <button class="star-button ${important ? "active" : ""}" data-action="toggle-primary" aria-label="Toggle primary">★</button>
        </div>
        <div class="pill-row">
          <span class="pill status">${statusLabel}</span>
          <span class="pill ${item.dailyPriority}">${LABELS.dailyPriority[item.dailyPriority]}</span>
          <span class="pill">${LABELS.timeBlock[item.timeBlock]}</span>
          <span class="pill">${LABELS.context[item.context]}</span>
          <span class="pill">${LABELS.lane[item.lane]}</span>
          <span class="pill">${typeLabel}</span>
        </div>
        <div class="quick-edit">
          ${renderSelect("timeBlock", LABELS.timeBlock, item.timeBlock, "Time")}
          ${renderSelect("context", LABELS.context, item.context, "Context")}
          ${renderSelect("dailyPriority", LABELS.dailyPriority, item.dailyPriority, "Priority")}
          <button class="remove-button" data-action="remove" aria-label="Remove item">Remove</button>
        </div>
      </div>
    </article>
  `;
}

function renderSelect(field, labels, selectedValue, ariaLabel) {
  const options = Object.entries(labels)
    .map(
      ([value, label]) =>
        `<option value="${escapeHtml(value)}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`,
    )
    .join("");
  return `<select data-field="${field}" aria-label="${ariaLabel}">${options}</select>`;
}

function handlePreviewClick(event) {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const itemNode = actionButton.closest("[data-source-key]");
  const sourceKey = itemNode?.dataset.sourceKey;
  if (!sourceKey) return;

  const item = currentParsedItems({ includeHidden: true }).find((candidate) => candidate.sourceKey === sourceKey);
  if (!item) return;

  const override = previewOverrides.get(sourceKey) || {};

  if (actionButton.dataset.action === "toggle-status") {
    const nextStatus = item.status === "done" ? "open" : "done";
    previewOverrides.set(sourceKey, {
      ...override,
      status: nextStatus,
      momentum: nextStatus === "done" ? "done" : "seed",
    });
  }

  if (actionButton.dataset.action === "toggle-primary") {
    const nextPriority = item.dailyPriority === "primary" ? "secondary" : "primary";
    previewOverrides.set(sourceKey, {
      ...override,
      dailyPriority: nextPriority,
      importance: nextPriority === "primary" ? "high" : "normal",
    });
  }

  if (actionButton.dataset.action === "remove") {
    hiddenPreviewItems.add(sourceKey);
  }

  render();
}

function handlePreviewChange(event) {
  const select = event.target.closest("[data-field]");
  if (!select) return;

  const itemNode = select.closest("[data-source-key]");
  const sourceKey = itemNode?.dataset.sourceKey;
  if (!sourceKey) return;

  const field = select.dataset.field;
  const override = previewOverrides.get(sourceKey) || {};
  previewOverrides.set(sourceKey, {
    ...override,
    [field]: select.value,
  });
  render();
}

function setStatus(message) {
  dom.status.textContent = message;
}

function formatDateLabel(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Today";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
