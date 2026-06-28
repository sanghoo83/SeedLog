// ============================================================================
// ARCHIVED — Signals tab "Signal Cloud" + "Focused Signal" mind-map
// Removed from the live app 2026-06-16 (Signals redesign → flat "radar").
// This file is NOT loaded by index.html. Reference only.
//
// What it was: a word-cloud (palette-8 bubbles) + an SVG mind-map showing
// keyword co-occurrence around a selected keyword, plus an insight panel.
//
// To restore:
//   1. Paste these functions/consts back into app.js (before
//      buildEmergingKeywordSignals).
//   2. In buildSignalMap()'s return, re-add:
//        constellation: buildSignalConstellation(items, threads, topKeywords),
//   3. In renderThreads(), re-add after the header:
//        ${renderSignalConstellation(signalMap.constellation)}
//   4. Re-add the .signal-constellation / .signal-cloud / .constellation-*
//      CSS (still present in styles.css — search "Signal Cloud").
//
// Shared helpers it CALLS (must exist in app.js): state, escapeHtml,
// prioritySort, daysBetween, TIME_BLOCK_LABEL, DAILY_CONTEXT_LABEL,
// DAILY_PRIORITY_LABEL, renderConstellationBubble's siblings.
// ============================================================================

function buildSignalConstellation(items, threads, topKeywords) {
  const keywordEntries = topKeywords.slice(0, 12);
  const aiKeyword = keywordEntries.find(([keyword]) => keyword.toLowerCase() === "ai")?.[0] || "";
  const selectedKeyword =
    state.selectedSignalKeyword && keywordEntries.some(([keyword]) => keyword === state.selectedSignalKeyword)
      ? state.selectedSignalKeyword
      : aiKeyword || keywordEntries[0]?.[0] || "";

  const nodeKeywords = new Set(keywordEntries.map(([keyword]) => keyword));
  const connectionCounts = countKeywordConnections(items, nodeKeywords);
  const nodes = keywordEntries.map(([keyword, count, score]) => {
    const relatedItems = items.filter((item) => item.keywords.includes(keyword));
    const stats = signalKeywordStats(relatedItems);
    return {
      keyword,
      count,
      score: score || count,
      stats,
      connection: selectedKeyword && keyword !== selectedKeyword ? connectionCounts[pairKey(keyword, selectedKeyword)] || 0 : count,
      size: Math.min(72, 38 + Math.sqrt(score || count) * 8),
      tone: signalKeywordTone(keyword, relatedItems),
      selected: keyword === selectedKeyword,
    };
  });

  const branchNodes = positionSignalBranches(nodes, selectedKeyword);
  const nodeMap = new Map(branchNodes.map((node) => [node.keyword, node]));
  const edges = Object.entries(connectionCounts)
    .map(([pair, count]) => {
      const [source, target] = pair.split("|");
      return { source, target, count, sourceNode: nodeMap.get(source), targetNode: nodeMap.get(target) };
    })
    .filter((edge) => edge.sourceNode && edge.targetNode)
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  const selectedItems = selectedKeyword
    ? items
        .filter((item) => item.keywords.includes(selectedKeyword))
        .sort((a, b) => prioritySort(a, b))
        .slice(0, 5)
    : [];
  const selectedThread = selectedKeyword ? threads.find((thread) => thread.keywords.includes(selectedKeyword)) : null;
  const selectedNode = nodes.find((node) => node.keyword === selectedKeyword);
  const selectedStats = selectedNode?.stats || signalKeywordStats(selectedItems);
  const relatedKeywords = branchNodes.filter((node) => node.side !== "center" && node.connection > 0).length;

  return {
    nodes,
    branchNodes,
    edges,
    selectedKeyword,
    selectedStats,
    nextMove: signalNextMove(selectedKeyword, selectedStats),
    relatedKeywords,
    selectedItems,
    selectedThread,
  };
}

function countKeywordConnections(items, nodeKeywords) {
  const edgeCounts = {};
  for (const item of items) {
    const keywords = item.keywords.filter((keyword) => nodeKeywords.has(keyword)).slice(0, 6);
    for (let left = 0; left < keywords.length; left += 1) {
      for (let right = left + 1; right < keywords.length; right += 1) {
        const pair = pairKey(keywords[left], keywords[right]);
        edgeCounts[pair] = (edgeCounts[pair] || 0) + 1;
      }
    }
  }
  return edgeCounts;
}

function pairKey(left, right) {
  return [left, right].sort().join("|");
}

function signalKeywordStats(items) {
  return {
    total: items.length,
    open: items.filter((item) => item.status !== "done").length,
    done: items.filter((item) => item.status === "done").length,
    learning: items.filter((item) => item.context === "learning").length,
    ideas: items.filter((item) => item.type === "idea" || item.context === "idea").length,
    projectish: items.filter((item) => item.horizon === "long" || item.lane === "build" || item.lane === "invest").length,
    blocked: items.filter((item) => item.momentum === "blocked").length,
  };
}

function signalNextMove(keyword, stats) {
  if (!keyword) return "신호가 조금 더 쌓이면 다음 행동을 제안할게요.";
  if (stats.blocked) return `#${keyword}에서 막힌 항목을 하나 골라 질문, 요청, 결정 중 하나로 바꿔보세요.`;
  if (stats.learning && stats.projectish) return `#${keyword} 학습을 30분짜리 프로젝트 실험으로 연결하면 좋아요.`;
  if (stats.ideas >= 2) return `#${keyword} 아이디어 중 하나를 산출물 이름으로 바꾸면 프로젝트 후보가 됩니다.`;
  if (stats.open >= 3) return `#${keyword} 열린 항목을 Primary 하나와 Parking 나머지로 나눠보세요.`;
  return `#${keyword}는 아직 좋은 씨앗이에요. 다음 기록에서 같은 맥락이 반복되는지 지켜보세요.`;
}

function positionSignalBranches(nodes, selectedKeyword) {
  const selected = nodes.find((node) => node.keyword === selectedKeyword) || nodes[0];
  if (!selected) return [];

  const focusPositions = [
    { x: 50, y: 20, side: "top" },
    { x: 18, y: 46, side: "left" },
    { x: 82, y: 46, side: "right" },
    { x: 28, y: 78, side: "bottom-left" },
    { x: 72, y: 78, side: "bottom-right" },
  ];
  const branches = nodes
    .filter((node) => node.keyword !== selected.keyword)
    .sort((a, b) => b.connection - a.connection || b.score - a.score)
    .slice(0, 5);

  const positioned = [{ ...selected, x: 50, y: 52, size: 82, side: "center", selected: true }];
  branches.forEach((node, index) => {
    const spot = focusPositions[index];
    positioned.push({
      ...node,
      x: spot.x,
      y: spot.y,
      size: Math.min(72, Math.max(58, node.size)),
      hubX: (spot.x + 50) / 2,
      hubY: (spot.y + 52) / 2,
      side: spot.side,
    });
  });
  return positioned;
}

function signalKeywordTone(keyword, items) {
  if (items.some((item) => item.momentum === "blocked")) return "blocked";
  if (items.some((item) => item.context === "learning")) return "learning";
  if (items.some((item) => item.type === "idea" || item.context === "idea")) return "idea";
  if (items.some((item) => item.horizon === "long" || item.lane === "build" || item.lane === "invest")) return "project";
  return "active";
}

const SIGNAL_CLOUD_LAYOUT = [
  { x: 46, y: 42, size: 56 },
  { x: 73, y: 48, size: 48 },
  { x: 34, y: 68, size: 38 },
  { x: 60, y: 74, size: 32 },
  { x: 20, y: 30, size: 22 },
  { x: 18, y: 52, size: 22 },
  { x: 78, y: 26, size: 21 },
  { x: 82, y: 65, size: 19 },
  { x: 46, y: 88, size: 17 },
  { x: 63, y: 18, size: 16 },
  { x: 28, y: 86, size: 15 },
  { x: 88, y: 82, size: 14 },
];

const SIGNAL_CLOUD_DOTS = [
  { x: 25, y: 47, tone: "cream" },
  { x: 58, y: 20, tone: "green" },
  { x: 69, y: 20, tone: "cream" },
  { x: 18, y: 78, tone: "teal" },
  { x: 86, y: 78, tone: "pink" },
  { x: 33, y: 21, tone: "purple" },
  { x: 76, y: 84, tone: "purple" },
  { x: 61, y: 57, tone: "peach" },
  { x: 35, y: 52, tone: "cream" },
  { x: 92, y: 39, tone: "pink" },
];

function renderSignalConstellation(constellation) {
  if (!constellation?.nodes?.length) {
    return `
      <section class="signal-constellation empty-constellation">
        <div>
          <div class="focus-eyebrow">Signal Cloud</div>
          <h2>아직 구름을 만들 신호가 부족해요.</h2>
          <p class="muted">학습, 아이디어, 프로젝트성 항목이 쌓이면 관심사의 모양이 보이기 시작합니다.</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="signal-constellation">
      <div class="signal-cloud-panel">
        <div class="section-heading">
          <div>
            <h2>Signal Cloud</h2>
            <p class="muted">자주 등장하는 키워드의 크기는 관심과 반복을 나타냅니다.</p>
          </div>
          <span class="signal-period-pill">최근 30일</span>
        </div>
        <div class="signal-cloud" aria-label="Signal keyword cloud">
          ${constellation.nodes.map(renderSignalCloudBubble).join("")}
          ${SIGNAL_CLOUD_DOTS.map(renderSignalCloudDot).join("")}
        </div>
      </div>
      <div class="focused-signal-panel">
        <div class="section-heading">
          <div>
            <h2>Focused Signal</h2>
            <p class="muted">선택한 신호와 가장 강하게 연결된 키워드입니다.</p>
          </div>
          <span class="focused-center-pill">중심 신호: <strong>#${escapeHtml(constellation.selectedKeyword)}</strong></span>
        </div>
        <div class="constellation-map" aria-label="Focused signal map">
          <svg class="constellation-branches" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Focused signal keyword map">
            ${constellation.branchNodes
              .filter((node) => node.side !== "center")
              .map(
                (node) => `
                  <path
                    class="mind-branch ${node.tone}"
                    d="M 50 52 Q ${node.hubX} ${node.hubY}, ${node.x} ${node.y}"
                    stroke-width="${Math.min(2.6, 0.9 + Math.max(node.connection, node.count * 0.35) * 0.22)}"
                  />`,
              )
              .join("")}
          </svg>
          <div class="constellation-glow" aria-hidden="true"></div>
          ${constellation.branchNodes.map(renderConstellationBubble).join("")}
        </div>
        <div class="focused-signal-bottom">
          ${renderSignalInsightPanel(constellation)}
        </div>
      </div>
    </section>
  `;
}

function signalStatPill(label, value) {
  return `<span><strong>${value}</strong>${label}</span>`;
}

function renderSignalCloudBubble(node, index = 0) {
  const layout = SIGNAL_CLOUD_LAYOUT[index % SIGNAL_CLOUD_LAYOUT.length];
  const label = shortSignalLabel(node.keyword);
  const scoreSize = Math.max(15, Math.min(64, layout.size + Math.min(4, node.count * 0.25)));
  return `
    <button
      class="cloud-word palette-${index % 8} ${node.selected ? "active" : ""}"
      style="--x: ${layout.x}%; --y: ${layout.y}%; --word-size: ${scoreSize}px"
      data-signal-keyword="${escapeHtml(node.keyword)}"
      title="#${escapeHtml(node.keyword)} · ${node.count} items"
    >
      <span>#${escapeHtml(label)}</span>
      <small>${node.count}</small>
    </button>
  `;
}

function renderSignalCloudDot(dot, index = 0) {
  return `<span class="cloud-dot ${dot.tone}" style="--x: ${dot.x}%; --y: ${dot.y}%; --dot-size: ${index % 3 === 0 ? 18 : index % 3 === 1 ? 14 : 11}px"></span>`;
}

function renderConstellationBubble(node, index = 0) {
  const label = shortSignalLabel(node.keyword);
  const palette = node.side === "center" ? "center" : `palette-${Math.max(0, index - 1) % 6}`;
  return `
    <button
      class="constellation-bubble ${palette} ${node.selected ? "active" : ""} ${node.side}"
      style="--x: ${node.x}%; --y: ${node.y}%; --bubble-size: ${node.size}px"
      data-signal-keyword="${escapeHtml(node.keyword)}"
      title="#${escapeHtml(node.keyword)} · ${node.count} items"
    >
      <span>#${escapeHtml(label)}</span>
      <small>${node.count}</small>
    </button>
  `;
}

function renderSignalInsightPanel(constellation) {
  const keyword = constellation.selectedKeyword;
  const insight =
    constellation.selectedStats.learning && constellation.selectedStats.projectish
      ? `#${keyword}는 학습과 프로젝트, 도구 활용으로 확장되고 있어요.`
      : constellation.selectedStats.learning
        ? `#${keyword}는 학습 흐름에서 반복해서 등장하고 있어요.`
        : constellation.selectedStats.projectish
          ? `#${keyword}는 프로젝트 후보로 자랄 가능성이 있어요.`
          : `#${keyword}는 반복되는 관심 신호로 쌓이고 있어요.`;
  return `
    <div class="signal-insight-card">
      <div class="insight-row">
        <span class="insight-icon bulb" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M8.5 14.5C7.1 13.4 6 11.7 6 9.8 6 6.5 8.7 4 12 4s6 2.5 6 5.8c0 1.9-1.1 3.6-2.5 4.7-.8.6-1.2 1.2-1.3 2H9.8c-.1-.8-.5-1.4-1.3-2Z"/></svg>
        </span>
        <div>
          <strong>Insight</strong>
          <p>${escapeHtml(insight)}</p>
        </div>
      </div>
      <div class="insight-divider"></div>
      <div class="insight-row">
        <span class="insight-icon rocket" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M14 4c2.7.2 4.4.8 6 2-1.2 1.6-1.8 3.3-2 6l-5 5-4-4 5-5ZM8 14l-2 1-2 5 5-2 1-2m1-8 5 5M15.5 7.5h.01"/></svg>
        </span>
        <div>
          <strong>Next move</strong>
          <p>${escapeHtml(constellation.nextMove)}</p>
        </div>
      </div>
    </div>
  `;
}

function shortSignalLabel(keyword) {
  const value = String(keyword || "");
  return value.length > 12 ? `${value.slice(0, 11)}…` : value;
}

function renderMiniSignalItem(item) {
  return `
    <article class="mini-signal-item ${item.status === "done" ? "done" : ""}">
      <strong>${escapeHtml(item.text)}</strong>
      <span>${TIME_BLOCK_LABEL[item.timeBlock]} · ${DAILY_CONTEXT_LABEL[item.context]} · ${item.status === "done" ? "done" : DAILY_PRIORITY_LABEL[item.dailyPriority]}</span>
    </article>
  `;
}
