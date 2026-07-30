import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import { 
  Home, BookOpen, Database, Settings, Plus, Trash2, Upload, Download, 
  Search, Check, X, Image as ImageIcon, Code, Bug, Github, Star, Tag, 
  Save, ChevronLeft, Calendar, Target, CheckCircle, Clock, MapPin, User, Edit3,
  ArrowUp, ArrowDown, Maximize2, FileText, LayoutDashboard, FileJson, PenLine
} from 'lucide-react';
import LearningPortfolioPDF from './components/pdf/LearningPortfolioPDF';
import WritingCenter from './components/writing/WritingCenter';
import './styles.css';

const DEFAULT_AVAILABLE_TAGS = [
  "C++", "Git", "GitHub", "Debug", "Algorithm", "APCS", "STL", 
  "問題分析", "自主學習", "團隊合作", "簡報能力"
];

const MISSIONS_KEY = 'poppins_missions';
const PROJECTS_KEY = 'poppins_projects';
const TAGS_KEY = 'poppins_available_tags';
const TITLES_KEY = 'poppins_writing_titles';

const PROGRAMMING_LANGUAGES = [
  "cpp", "c", "python", "javascript", "java", "html", "css", "json", "markdown", "bash"
];

const REFLECTION_TEMPLATES = [
  {
    id: 'growth',
    name: '模板一｜能力成長反思型',
    content: `透過本次學習，我原本對 【學習主題】 還不熟悉，但經過課堂練習與實作後，現在已經能夠 【現在能做到的事】。我認為自己最大的進步在於 【最大的進步】，也讓我對後續學習更有信心。 本次學習中，我遇到最大的困難是 【最大困難】。分析後發現，主要原因是 【困難原因】，因此導致 【造成的結果】。這也提醒我，除了完成程式之外，更需要理解每個步驟背後的原理。 為了解決上述問題，我嘗試了 【嘗試的方法】。最後透過 【最後解決方式】 順利完成程式，也讓我學會 【學會的能力】。這次經驗讓我了解到，遇到問題時應該逐步分析，而不是急著尋找答案。 完成本次學習後，我希望下一步能夠學習 【下一步學習內容】，因為 【原因】。我預計完成 【預計完成項目】，並持續累積程式設計能力，逐步朝 APCS 的學習目標邁進。`
  },
  {
    id: 'problem-solving',
    name: '模板二｜問題解決歷程',
    content: `為了提升自己在 **【學習主題】** 方面的能力，我將本次自主學習設定為 **【學習目標】**，希望透過 **【學習方式】** 建立更完整的基礎。學習過程中，我主要接觸了 **【學習內容】**，並完成 **【完成作品】**，讓我逐步理解相關概念與實際應用。

在實作過程中，我遇到了 **【遇到的問題】**，一開始因為 **【原因】**，導致 **【造成的結果】**。為了解決這個問題，我嘗試 **【解決方法】**，經過反覆測試與修正後，終於成功 **【最後成果】**。這次經驗讓我體會到 **【最大的體會】**，也培養了我面對問題時分析與修正的能力。

我認為本次學習最大的收穫是 **【最大收穫】**，除了完成既定目標，也更加熟悉 **【學會的能力】**。未來，我希望能持續挑戰 **【下一步目標】**，逐步累積更多程式設計經驗，朝自己的學習目標穩定前進。`
  },
  {
    id: 'project-result',
    name: '模板三｜專案成果歷程',
    content: `本次自主學習以完成 **【作品名稱】** 為主要目標，希望透過實際開發，熟悉 **【學習主題】** 的應用方式。在製作過程中，我運用了 **【使用技術】**、**【使用工具】** 等知識，並逐步完成 **【完成內容】**，讓我對整個開發流程有更完整的認識。

雖然開發過程中曾遇到 **【遇到的問題】**，但透過 **【解決方式】**，最終成功完成作品，也讓我更加理解 **【學到的觀念】** 的重要性。我認為作品中最具特色的是 **【作品特色】**，這也是我最有成就感的部分。

經過這次專案，我不僅提升了 **【能力提升】**，也學會如何從規劃、實作到除錯逐步完成一個完整作品。未來，我希望持續優化 **【未來改進】**，並挑戰更具難度的程式設計內容。`
  },
  {
    id: 'growth-journey',
    name: '模板四｜成長反思歷程',
    content: `在開始學習 **【學習主題】** 之前，我對 **【原本不熟悉】** 還沒有完整的概念，因此希望透過本次自主學習建立基礎能力。課程中，我學習了 **【學習內容】**，並完成 **【完成作品】**，逐步累積實作經驗，也更加理解相關知識的應用方式。

學習過程中，我最大的挑戰是 **【最大困難】**。起初因為 **【困難原因】**，讓我一度無法順利完成程式，但透過 **【突破方式】**，最終成功克服問題，也讓我對 **【學到的新觀念】** 有更深入的理解。

回顧整個學習歷程，我最大的成長在於 **【最大成長】**，不只是學會撰寫程式，更培養了獨立思考與解決問題的能力。未來，我希望持續學習 **【下一步】**，並將這次經驗作為挑戰 APCS 與資訊相關課程的重要基礎。`
  },
  {
    id: 'future-plan',
    name: '模板五｜未來展望與行動計畫',
    content: `完成本次專案後，我對 **【學習主題】** 有了更完整的理解，也從 **【重要經驗】** 中看見自己仍可加強的方向。回顧整個過程，我認為最值得延伸的是 **【可延伸方向】**，因為這能讓作品或學習成果更接近實際應用。

接下來，我希望先針對 **【優先改進項目】** 進行優化，並透過 **【具體方法】** 持續修正。若時間允許，我也想挑戰 **【進階目標】**，讓本次學習不只停留在完成作品，而能成為下一個專題或自主學習計畫的基礎。

這次經驗讓我了解到，學習歷程不只是記錄成果，更重要的是呈現自己如何規劃、嘗試、修正與成長。未來我會持續累積 **【想培養的能力】**，並將這些經驗運用在 **【未來應用情境】**。`
  }
];

const DAILY_REFLECTION_ITEMS = [
  {
    key: 'learning',
    title: '今天學到了什麼？',
    prompt: '請記錄今天最重要的新知識或技能。',
    examples: ['學會 Git Commit', '完成 STL Vector 練習', '理解 Pointer 基本概念']
  },
  {
    key: 'challenge',
    title: '今天最大的挑戰',
    prompt: '今天遇到哪些問題？',
    examples: ['Git Push 一直失敗', 'Pointer 觀念混亂', '程式一直 Compile Error']
  },
  {
    key: 'solution',
    title: '我如何解決？',
    prompt: '今天如何突破問題？',
    examples: ['查官方文件', '請教老師', 'Debug', '重構程式']
  },
  {
    key: 'harvest',
    title: '今天最大的收穫／下一步',
    prompt: '今天最大的收穫是什麼？下一步希望挑戰什麼？',
    examples: ['理解 Git 工作流程', '想學 Branch', '想完成 DFS']
  }
];

const createDefaultDailyReflection = () => ({
  learning: '',
  challenge: '',
  solution: '',
  harvest: ''
});

const createDefaultProjectReport = () => ({
  difficultyEntries: [],
  resultPages: [],
  reflection: { templateId: '', templateText: '', fields: {} }
});

const RESULT_TYPES = [
  { id: 'note', label: '📖 學習筆記' },
  { id: 'code', label: '💻 程式碼' },
  { id: 'github', label: '🔗 GitHub' },
  { id: 'image', label: '🖼 成果圖片' },
  { id: 'certificate', label: '🏅 證書' },
  { id: 'attachment', label: '📎 其他附件' }
];

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeDailyReflection = (mission = {}) => ({
  ...createDefaultDailyReflection(),
  ...(mission.dailyReflection || {}),
  learning: mission.dailyReflection?.learning || mission.reflection?.takeaway || '',
  challenge: mission.dailyReflection?.challenge || mission.reflection?.difficulty || '',
  solution: mission.dailyReflection?.solution || mission.reflection?.overcome || '',
  harvest: mission.dailyReflection?.harvest || mission.reflection?.next || ''
});

const safeText = (value) => String(value || '').toLowerCase();
const includesSearch = (value, search) => safeText(value).includes(safeText(search));
const getTemplatePlaceholders = (content) => [...new Set(String(content || '').match(/【[^】]+】/g) || [])];
const isMediaResultType = (type) => ['image', 'certificate', 'attachment'].includes(type);

const DB_NAME = 'poppins_db';
const STORE_NAME = 'poppins_store';
const initDB = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE_NAME);
  request.onsuccess = (e) => resolve(e.target.result);
  request.onerror = () => reject('IDB init error');
});

const localforage = {
  getItem: async (key) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  setItem: async (key, value) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

const SyntaxHighlighter = ({ language, children }) => (
  <pre className="code-block rounded-xl m-0 text-sm p-4 overflow-x-auto text-slate-50" style={{ margin: 0, borderRadius: '0.75rem' }}>
    <code data-language={language}>{children}</code>
  </pre>
);

const createDefaultMission = () => ({
  id: Date.now().toString(),
  projectId: '',
  date: new Date().toISOString().split('T')[0],
  title: '',
  objective: '',
  content: '',
  hours: 1,
  teacher: '',
  location: '',
  codes: [],
  bugs: [],
  githubs: [],
  images: [],
  dailyReflection: createDefaultDailyReflection(),
  isMasterpiece: false,
  masterpieceDetail: { name: '', features: '' },
  tags: []
});

const createDefaultProject = () => ({
  id: Date.now().toString(),
  name: '',
  startDate: '',
  endDate: '',
  teacher: '',
  location: '',
  goal: '',
  content: '',
  report: createDefaultProjectReport()
});

const normalizeMission = (mission) => {
  const { reflection, ...missionWithoutLegacyReflection } = mission || {};
  return {
    ...createDefaultMission(),
    ...missionWithoutLegacyReflection,
    projectId: mission?.projectId || '',
    codes: mission?.codes || [],
    bugs: mission?.bugs || [],
    githubs: mission?.githubs || [],
    images: mission?.images || [],
    dailyReflection: normalizeDailyReflection({ ...missionWithoutLegacyReflection, reflection }),
    masterpieceDetail: { name: '', features: '', ...(mission?.masterpieceDetail || {}) },
    tags: mission?.tags || []
  };
};

const normalizeProject = (project) => ({
  ...createDefaultProject(),
  ...project,
  teacher: project.teacher || '',
  location: project.location || '',
  report: {
    ...createDefaultProjectReport(),
    ...(project.report || {}),
    difficultyEntries: Array.isArray(project.report?.difficultyEntries) ? project.report.difficultyEntries : [],
    resultPages: Array.isArray(project.report?.resultPages)
      ? project.report.resultPages
      : (Array.isArray(project.report?.resultCards) ? project.report.resultCards : []),
    reflection: {
      templateId: '',
      templateText: '',
      fields: {},
      ...(project.report?.reflection || {})
    }
  }
});

const normalizeWritingTitle = (title) => ({
  id: title.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: title.title || '',
  templateId: title.templateId || '',
  templateName: title.templateName || '自訂標題',
  favorite: Boolean(title.favorite),
  createdAt: title.createdAt || new Date().toISOString()
});

const createDifficultyEntryFromMission = (mission) => ({
  id: createId(),
  missionId: mission.id,
  date: mission.date || '',
  title: mission.title || '未命名 Mission',
  content: mission.content || '',
  dailyReflection: {
    ...createDefaultDailyReflection(),
    ...(mission.dailyReflection || {})
  }
});

const createDefaultResultCard = () => ({
  id: createId(),
  title: '',
  type: 'code',
  sourceMode: 'manual',
  missionId: '',
  sourceId: '',
  sourceIds: [],
  sourceItems: [],
  sourceLabel: '',
  sourceDetail: '',
  sourceDataUrl: '',
  sourceUrl: '',
  sourceCode: '',
  sourceLanguage: '',
  attachmentName: '',
  description: ''
});

const getMissionResultOptions = (mission, type) => {
  if (!mission) return [];
  if (type === 'code') {
    return (mission.codes || []).map(code => ({
      id: code.id,
      label: code.filename || `${(code.language || 'code').toUpperCase()} 程式碼`,
      detail: [code.language && `語言：${code.language}`, code.description && `說明：${code.description}`].filter(Boolean).join('\n'),
      code: code.code || '',
      language: code.language || '',
      title: code.filename || '程式碼成果'
    }));
  }
  if (type === 'github') {
    return (mission.githubs || []).map(github => ({
      id: github.id,
      label: github.repo || github.url || 'GitHub 紀錄',
      detail: [`Branch：${github.branch || '未填寫'}`, `Commit：${github.commit || '未填寫'}`, github.url && `URL：${github.url}`].filter(Boolean).join('\n'),
      url: github.url || '',
      title: github.repo || 'GitHub Repository'
    }));
  }
  if (isMediaResultType(type)) {
    return (mission.images || []).map((image, index) => ({
      id: image.id,
      label: image.note || `圖片 ${index + 1}`,
      detail: image.note || '未填寫圖片備註',
      dataUrl: image.dataUrl || '',
      title: image.note || `成果圖片 ${index + 1}`
    }));
  }
  return [];
};

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = event => resolve(event.target.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

const cleanFileName = (value) => String(value || 'ProjectReport')
  .replace(/[\\/:*?"<>|]/g, '_')
  .replace(/\s+/g, '_')
  .slice(0, 80);

const renderProjectReflectionText = (reflection = {}) => {
  if (!reflection.templateText) return '';
  return reflection.templateText
    .replace(/【[^】]+】/g, placeholder => reflection.fields?.[placeholder] || '')
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const splitTextForSlides = (value, maxLength = 780) => {
  const text = String(value || '').trim();
  if (!text) return [];
  const chunks = [];
  let remaining = text;
  while (remaining.length > maxLength) {
    const breakAt = Math.max(
      remaining.lastIndexOf('\n\n', maxLength),
      remaining.lastIndexOf('\n', maxLength),
      remaining.lastIndexOf('。', maxLength)
    );
    const index = breakAt > maxLength * 0.45 ? breakAt + 1 : maxLength;
    chunks.push(remaining.slice(0, index).trim());
    remaining = remaining.slice(index).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
};

// Image compression to save IndexedDB space
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });
};

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} flex flex-col max-h-[90vh]`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children, action }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Icon className="text-blue-600" size={20} />
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false, title, type = 'button' }) => {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all active:scale-95 text-sm";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow",
    secondary: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-slate-600 hover:bg-slate-100"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} aria-label={title} className={`${base} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const Input = ({ label, type="text", value, onChange, placeholder, min, step }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input type={type} value={value} min={min} step={step} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows=3 }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
  </div>
);

const DailyReflectionGrid = ({ value, onChange, readonly = false }) => {
  const dailyReflection = { ...createDefaultDailyReflection(), ...(value || {}) };

  const updateDailyReflection = (key, nextValue) => {
    onChange?.({ ...dailyReflection, [key]: nextValue });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {DAILY_REFLECTION_ITEMS.map(item => (
        <article key={item.key} className="daily-reflection-card">
          <div className="daily-reflection-examples">
            <h4>{item.title}</h4>
            <p>{item.prompt}</p>
            <ul>
              {item.examples.map(example => <li key={example}>{example}</li>)}
            </ul>
          </div>
          {readonly ? (
            <p className="daily-reflection-readonly">{dailyReflection[item.key] || '未填寫'}</p>
          ) : (
            <textarea
              value={dailyReflection[item.key]}
              onChange={event => updateDailyReflection(item.key, event.target.value)}
              rows={4}
              maxLength={180}
              placeholder="80～150 字，快速記錄今天的重點。"
            />
          )}
        </article>
      ))}
    </div>
  );
};

const Dashboard = ({ missions, projects }) => {
  const stats = useMemo(() => {
    let completed = 0;
    let images = 0, codes = 0, bugs = 0, githubs = 0, masterpieces = 0, totalHours = 0;
    const tagCounts = {};

    missions.forEach(m => {
      if (Object.values(m.dailyReflection || {}).some(Boolean) || m.codes.length > 0 || m.images.length > 0) completed++;
      images += m.images.length;
      codes += m.codes.length;
      bugs += m.bugs.length;
      githubs += m.githubs.length;
      totalHours += Number(m.hours) || 0;
      if (m.isMasterpiece) masterpieces++;
      m.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
    });

    return {
      total: missions.length,
      completionRate: missions.length ? Math.round((completed / missions.length) * 100) : 0,
      images, codes, bugs, githubs, masterpieces, totalHours, projects: projects.length,
      tags: Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    };
  }, [missions, projects]);

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">歡迎回來，學習者 👋</h2>
        <p className="text-slate-500">持續累積，讓每個 Debug 都成為成長的養分。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="歷程專案" value={stats.projects} icon={FileJson} colorClass="bg-cyan-100 text-cyan-600" />
        <StatCard title="累積 Mission" value={stats.total} icon={Target} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="紀錄完成率" value={`${stats.completionRate}%`} icon={CheckCircle} colorClass="bg-emerald-100 text-emerald-600" />
        <StatCard title="代表作品" value={stats.masterpieces} icon={Star} colorClass="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="投入小時數" value={stats.totalHours} icon={Clock} colorClass="bg-purple-100 text-purple-600" />
        <StatCard title="圖片紀錄" value={stats.images} icon={ImageIcon} colorClass="bg-slate-100 text-slate-600" />
        <StatCard title="程式碼片段" value={stats.codes} icon={Code} colorClass="bg-slate-100 text-slate-600" />
        <StatCard title="Bug 分析" value={stats.bugs} icon={Bug} colorClass="bg-slate-100 text-slate-600" />
        <StatCard title="GitHub 連結" value={stats.githubs} icon={Github} colorClass="bg-slate-100 text-slate-600" />
      </div>

      {stats.tags.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Tag size={20} className="text-blue-600"/> 熱門能力標籤</h3>
          <div className="flex flex-wrap gap-2">
            {stats.tags.map(([tag, count]) => (
              <div key={tag} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="font-medium text-slate-700">{tag}</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MissionList = ({ missions, projects, onEdit, onDelete }) => {
  const projectNameById = useMemo(
    () => Object.fromEntries(projects.map(project => [project.id, project.name || '未命名專案'])),
    [projects]
  );

  if (missions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm mt-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">尚無學習紀錄</h3>
        <p className="text-slate-500 mb-6">點擊上方按鈕開始你的第一個 Mission 吧！</p>
        <Button icon={Plus} onClick={() => onEdit('new')}>新增 Mission</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 mt-6">
      {missions.map(m => (
        <div key={m.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {m.isMasterpiece && <Star size={20} className="text-amber-500 fill-amber-500" />}
                <h3 className="text-lg font-bold text-slate-800">{m.title || '未命名任務'}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={14}/> {m.date}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> {m.hours} 小時</span>
                <span className="flex items-center gap-1"><FileJson size={14}/> {projectNameById[m.projectId] || '未指定專案'}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
              <Button variant="secondary" icon={FileText} onClick={() => onEdit(m.id)}>編輯 / 檢視</Button>
              <Button variant="danger" icon={Trash2} title="刪除任務" onClick={() => { if(window.confirm('確定要刪除此任務嗎？')) onDelete(m.id); }} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {m.tags.map(tag => (
              <span key={tag} className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{tag}</span>
            ))}
          </div>
          <div className="flex gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <span className="flex items-center gap-1"><ImageIcon size={16}/> {m.images.length}</span>
            <span className="flex items-center gap-1"><Code size={16}/> {m.codes.length}</span>
            <span className="flex items-center gap-1"><Bug size={16}/> {m.bugs.length}</span>
            <span className="flex items-center gap-1"><Github size={16}/> {m.githubs.length}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProjectReportEditor = ({ project, missions, reflectionTemplates, onSaveProject, onBack }) => {
  const report = { ...createDefaultProjectReport(), ...(project.report || {}) };
  const difficultyEntries = Array.isArray(report.difficultyEntries) ? report.difficultyEntries : [];
  const resultPages = Array.isArray(report.resultPages) ? report.resultPages : [];
  const reflection = { templateId: '', templateText: '', fields: {}, ...(report.reflection || {}) };
  const placeholders = getTemplatePlaceholders(reflection.templateText);
  const [isExportingPpt, setIsExportingPpt] = useState(false);
  const [pptStatus, setPptStatus] = useState('');
  const projectMissions = useMemo(
    () => missions
      .filter(mission => mission.projectId === project.id)
      .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0)),
    [missions, project.id]
  );
  const [difficultyMissionId, setDifficultyMissionId] = useState(projectMissions[0]?.id || '');

  const updateReport = (patch) => {
    onSaveProject({
      ...project,
      report: {
        ...report,
        ...patch
      }
    });
  };

  const addDifficultyMission = () => {
    const mission = projectMissions.find(item => item.id === difficultyMissionId);
    if (!mission) return;
    updateReport({
      difficultyEntries: [...difficultyEntries, createDifficultyEntryFromMission(mission)]
    });
  };

  const updateDifficultyEntry = (id, patch) => {
    updateReport({
      difficultyEntries: difficultyEntries.map(entry => entry.id === id ? { ...entry, ...patch } : entry)
    });
  };

  const updateDifficultyReflection = (id, key, value) => {
    updateReport({
      difficultyEntries: difficultyEntries.map(entry => entry.id === id
        ? { ...entry, dailyReflection: { ...createDefaultDailyReflection(), ...(entry.dailyReflection || {}), [key]: value } }
        : entry)
    });
  };

  const moveDifficultyEntry = (index, direction) => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= difficultyEntries.length) return;
    const nextEntries = [...difficultyEntries];
    [nextEntries[index], nextEntries[nextIndex]] = [nextEntries[nextIndex], nextEntries[index]];
    updateReport({ difficultyEntries: nextEntries });
  };

  const deleteDifficultyEntry = (id) => {
    updateReport({ difficultyEntries: difficultyEntries.filter(entry => entry.id !== id) });
  };

  const addResultPage = (sourceMode = 'manual') => {
    updateReport({ resultPages: [...resultPages, { ...createDefaultResultCard(), sourceMode }] });
  };

  const updateResultPage = (id, patch) => {
    updateReport({
      resultPages: resultPages.map(page => page.id === id ? { ...page, ...patch } : page)
    });
  };

  const deleteResultPage = (id) => {
    updateReport({ resultPages: resultPages.filter(page => page.id !== id) });
  };

  const moveResultPage = (index, direction) => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= resultPages.length) return;
    const nextPages = [...resultPages];
    [nextPages[index], nextPages[nextIndex]] = [nextPages[nextIndex], nextPages[index]];
    updateReport({ resultPages: nextPages });
  };

  const createResultSourceSnapshot = (source) => ({
    id: source?.id || '',
    label: source?.label || '',
    detail: source?.detail || '',
    dataUrl: source?.dataUrl || '',
    url: source?.url || '',
    code: source?.code || '',
    language: source?.language || '',
    title: source?.title || source?.label || ''
  });

  const summarizeSelectedSources = (card, selectedItems) => {
    const first = selectedItems[0] || {};
    const labels = selectedItems.map(item => item.label).filter(Boolean);
    const details = selectedItems.map(item => item.detail).filter(Boolean);
    const countLabel = selectedItems.length > 1 ? `${selectedItems.length} 個成果來源` : '';
    return {
      sourceId: first.id || '',
      sourceIds: selectedItems.map(item => item.id).filter(Boolean),
      sourceItems: selectedItems,
      sourceLabel: countLabel || first.label || '',
      sourceDetail: selectedItems.length > 1 ? details.join('\n\n') : first.detail || '',
      sourceDataUrl: first.dataUrl || '',
      sourceUrl: first.url || '',
      sourceCode: first.code || '',
      sourceLanguage: first.language || '',
      title: card.title || first.title || first.label || ''
    };
  };

  const selectResultSource = (card, sourceId) => {
    const mission = projectMissions.find(item => item.id === card.missionId);
    const source = getMissionResultOptions(mission, card.type).find(item => item.id === sourceId);
    const selectedItems = source ? [createResultSourceSnapshot(source)] : [];
    updateResultPage(card.id, summarizeSelectedSources(card, selectedItems));
  };

  const toggleResultSource = (card, sourceId) => {
    const mission = projectMissions.find(item => item.id === card.missionId);
    const sourceOptions = getMissionResultOptions(mission, card.type);
    const source = sourceOptions.find(item => item.id === sourceId);
    if (!source) return;
    const currentItems = hydrateSourceItems(card, sourceOptions);
    const currentIds = Array.isArray(card.sourceIds) && card.sourceIds.length > 0
      ? card.sourceIds
      : (card.sourceId ? [card.sourceId] : []);
    const selectedItems = currentIds.includes(sourceId)
      ? currentItems.filter(item => item.id !== sourceId)
      : [...currentItems, createResultSourceSnapshot(source)];

    updateResultPage(card.id, summarizeSelectedSources(card, selectedItems));
  };

  const resetResultSourcePatch = () => ({
    sourceId: '',
    sourceIds: [],
    sourceItems: [],
    sourceLabel: '',
    sourceDetail: '',
    sourceDataUrl: '',
    sourceUrl: '',
    sourceCode: '',
    sourceLanguage: '',
    attachmentName: ''
  });

  const hydrateSourceItems = (page, sourceOptions) => {
    const ids = Array.isArray(page.sourceIds) && page.sourceIds.length > 0
      ? page.sourceIds
      : (page.sourceId ? [page.sourceId] : []);
    const savedItems = Array.isArray(page.sourceItems) ? page.sourceItems : [];
    const items = ids.map(id => {
      const saved = savedItems.find(item => item.id === id) || {};
      const resolved = sourceOptions.find(item => item.id === id) || {};
      return createResultSourceSnapshot({ ...saved, ...resolved, id });
    }).filter(item => item.id || item.label || item.dataUrl || item.code || item.url);

    if (items.length > 0) return items;
    if (page.sourceLabel || page.sourceDetail || page.sourceDataUrl || page.sourceUrl || page.sourceCode) {
      return [createResultSourceSnapshot({
        id: page.sourceId,
        label: page.sourceLabel,
        detail: page.sourceDetail,
        dataUrl: page.sourceDataUrl,
        url: page.sourceUrl,
        code: page.sourceCode,
        language: page.sourceLanguage,
        title: page.title
      })];
    }
    return [];
  };

  const hydrateResultPageSource = (page) => {
    const mission = projectMissions.find(item => item.id === page.missionId);
    const sourceOptions = getMissionResultOptions(mission, page.type);
    const sourceItems = hydrateSourceItems(page, sourceOptions);
    const summary = summarizeSelectedSources(page, sourceItems);
    return {
      ...page,
      ...summary,
      sourceItems,
      title: page.title || summary.title
    };
  };

  const uploadResultFile = async (card, file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    const sourceItem = createResultSourceSnapshot({
      id: createId(),
      label: file.name,
      detail: card.sourceDetail,
      dataUrl,
      title: file.name.replace(/\.[^.]+$/, '')
    });
    updateResultPage(card.id, {
      sourceId: sourceItem.id,
      sourceIds: [sourceItem.id],
      sourceItems: [sourceItem],
      sourceDataUrl: dataUrl,
      attachmentName: file.name,
      sourceLabel: card.sourceLabel || file.name,
      title: card.title || file.name.replace(/\.[^.]+$/, '')
    });
  };

  const selectReflectionTemplate = (templateId) => {
    const template = reflectionTemplates.find(item => item.id === templateId);
    if (!template) {
      updateReport({ reflection: { templateId: '', templateText: '', fields: {} } });
      return;
    }

    const nextFields = {};
    getTemplatePlaceholders(template.content).forEach(key => {
      nextFields[key] = reflection.fields?.[key] || '';
    });
    updateReport({
      reflection: {
        templateId,
        templateText: template.content,
        fields: nextFields
      }
    });
  };

  const updateReflectionField = (key, value) => {
    updateReport({
      reflection: {
        ...reflection,
        fields: { ...(reflection.fields || {}), [key]: value }
      }
    });
  };

  const exportProjectPpt = async () => {
    setIsExportingPpt(true);
    setPptStatus('正在產生 PPT...');
    try {
      const { default: pptxgen } = await import('pptxgenjs');
      const pptx = new pptxgen();
      pptx.layout = 'LAYOUT_WIDE';
      pptx.author = 'Poppins Learning Portfolio';
      pptx.subject = project.name || 'Project Report';
      pptx.title = `${project.name || 'Project'} Project Report`;
      pptx.company = 'Poppins Learning Portfolio';
      pptx.lang = 'zh-TW';
      pptx.theme = {
        headFontFace: 'Aptos Display',
        bodyFontFace: 'Aptos'
      };

      const addSectionSlide = (title, subtitle = '') => {
        const slide = pptx.addSlide();
        slide.background = { color: 'F8FAFC' };
        slide.addText(title, { x: 0.6, y: 0.55, w: 12.1, h: 0.45, fontFace: 'Aptos Display', fontSize: 22, bold: true, color: '111827', fit: 'shrink' });
        if (subtitle) slide.addText(subtitle, { x: 0.62, y: 1.05, w: 11.8, h: 0.35, fontSize: 11, color: '64748B', fit: 'shrink' });
        return slide;
      };

      const addBodySlide = (title, body, options = {}) => {
        splitTextForSlides(body || '未填寫', options.maxLength || 820).forEach((chunk, index) => {
          const slide = addSectionSlide(index === 0 ? title : `${title}（續）`, project.name || '');
          slide.addText(chunk, { x: 0.75, y: 1.45, w: 11.75, h: 5.4, fontSize: options.fontSize || 15, color: '334155', breakLine: false, fit: 'shrink', valign: 'top' });
        });
      };

      difficultyEntries.forEach((entry, index) => {
        const body = [
          `日期：${entry.date || '未填寫'}`,
          `Mission：${entry.title || '未命名 Mission'}`,
          '',
          '學習內容',
          entry.content || '未填寫',
          '',
          ...DAILY_REFLECTION_ITEMS.flatMap(item => [
            item.title,
            entry.dailyReflection?.[item.key] || '未填寫',
            ''
          ])
        ].join('\n');
        addBodySlide(`一、困難解決歷程 ${index + 1}`, body, { maxLength: 900, fontSize: 13 });
      });
      if (difficultyEntries.length === 0) {
        addBodySlide('一、過程遭遇的困難及困難解決的歷程', '尚未引用 Mission。');
      }

      const getImageSize = (dataUrl) => new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height });
        image.onerror = () => resolve({ width: 4, height: 3 });
        image.src = dataUrl;
      });

      const fitImageInBox = ({ width, height }, box) => {
        const imageRatio = width / height;
        const boxRatio = box.w / box.h;
        const size = imageRatio > boxRatio
          ? { w: box.w, h: box.w / imageRatio }
          : { w: box.h * imageRatio, h: box.h };
        return {
          x: box.x + (box.w - size.w) / 2,
          y: box.y + (box.h - size.h) / 2,
          w: size.w,
          h: size.h
        };
      };

      const addMediaImages = async (slide, items) => {
        const imageItems = items.filter(item => item.dataUrl?.startsWith('data:image')).slice(0, 6);
        if (imageItems.length === 0) return false;
        const layouts = {
          1: [{ x: 2.2, y: 1.35, w: 8.9, h: 3.75 }],
          2: [{ x: 1.1, y: 1.45, w: 5.3, h: 3.35 }, { x: 6.9, y: 1.45, w: 5.3, h: 3.35 }],
          3: [{ x: 0.85, y: 1.25, w: 3.75, h: 2.65 }, { x: 4.8, y: 1.25, w: 3.75, h: 2.65 }, { x: 8.75, y: 1.25, w: 3.75, h: 2.65 }],
          4: [{ x: 1.1, y: 1.15, w: 5.3, h: 1.9 }, { x: 6.9, y: 1.15, w: 5.3, h: 1.9 }, { x: 1.1, y: 3.25, w: 5.3, h: 1.9 }, { x: 6.9, y: 3.25, w: 5.3, h: 1.9 }]
        };
        const grid = layouts[imageItems.length] || [
          { x: 0.9, y: 1.15, w: 3.55, h: 1.75 }, { x: 4.9, y: 1.15, w: 3.55, h: 1.75 }, { x: 8.9, y: 1.15, w: 3.55, h: 1.75 },
          { x: 0.9, y: 3.1, w: 3.55, h: 1.75 }, { x: 4.9, y: 3.1, w: 3.55, h: 1.75 }, { x: 8.9, y: 3.1, w: 3.55, h: 1.75 }
        ];

        for (const [imageIndex, item] of imageItems.entries()) {
          const box = grid[imageIndex];
          const imageSize = await getImageSize(item.dataUrl);
          slide.addImage({ data: item.dataUrl, ...fitImageInBox(imageSize, box) });
        }
        return true;
      };

      const hydratedResultPages = resultPages.map(hydrateResultPageSource);
      for (const page of hydratedResultPages) {
        const slide = pptx.addSlide();
        slide.background = { color: 'F8FAFC' };
        const sourceItems = Array.isArray(page.sourceItems) ? page.sourceItems : [];
        slide.addText(page.title || '未命名成果', { x: 0.75, y: 0.55, w: 11.75, h: 0.45, fontFace: 'Aptos Display', fontSize: 24, bold: true, color: '111827', fit: 'shrink' });
        slide.addText(page.description || '未填寫成果說明', { x: 0.75, y: 5.35, w: 11.75, h: 1.15, fontSize: 13, color: '334155', fit: 'shrink', valign: 'top' });

        if (isMediaResultType(page.type) && await addMediaImages(slide, sourceItems)) {
        } else if (page.type === 'code') {
          const codeText = page.sourceCode || page.sourceDetail || page.sourceLabel || '未填寫程式碼';
          slide.addText(codeText.slice(0, 1800), { x: 0.75, y: 1.35, w: 11.75, h: 3.65, fontFace: 'Courier New', fontSize: 10, color: '111827', fill: { color: 'F1F5F9' }, margin: 0.08, fit: 'shrink', breakLine: false, valign: 'top' });
        } else if (page.type === 'github') {
          if (page.sourceUrl) {
            slide.addText(page.sourceUrl, { x: 0.75, y: 1.35, w: 10.8, h: 0.3, fontSize: 14, color: '2563EB', hyperlink: { url: page.sourceUrl }, fit: 'shrink' });
          }
          slide.addText(page.sourceDetail || '', { x: 0.75, y: 1.85, w: 11.75, h: 2.8, fontSize: 13, color: '334155', fit: 'shrink', valign: 'top' });
        } else {
          slide.addText(page.sourceDetail || page.sourceUrl || '未填寫成果內容', { x: 0.75, y: 1.35, w: 11.75, h: 3.65, fontSize: 13, color: '334155', fit: 'shrink', valign: 'top' });
        }
      }
      if (resultPages.length === 0) {
        addBodySlide('二、成果說明', '尚未建立成果頁。');
      }

      const reflectionText = renderProjectReflectionText(reflection);
      addBodySlide('三、學習反思與心得', reflectionText || '尚未選擇反思模板。', { maxLength: 900, fontSize: 13 });

      const pptxBlob = await pptx.write({ outputType: 'blob' });
      const fileName = `${cleanFileName(project.name)}_ProjectReport.pptx`;
      const url = URL.createObjectURL(pptxBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setPptStatus('PPT 已產生');
    } catch (error) {
      console.error(error);
      setPptStatus('PPT 匯出失敗');
      window.alert('PPT 匯出失敗，請稍後再試。');
    } finally {
      setIsExportingPpt(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-blue-600">Project Report</p>
          <h2 className="text-2xl font-bold text-slate-800">{project.name || '未命名專案'}｜專案報告</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={Download} disabled={isExportingPpt} onClick={exportProjectPpt}>{isExportingPpt ? '匯出中...' : '匯出 PPT'}</Button>
          <Button variant="secondary" icon={ChevronLeft} onClick={onBack}>返回專案</Button>
        </div>
      </div>
      {pptStatus && <p className="project-report-hint">{pptStatus}</p>}

      <section className="project-report-section">
        <h4><Bug size={18} /> 一、過程遭遇的困難及困難解決的歷程</h4>
        <div className="project-report-add-row">
          <select value={difficultyMissionId} onChange={event => setDifficultyMissionId(event.target.value)}
            className="w-full rounded-xl border-slate-300 border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">選擇要引用的 Mission</option>
            {projectMissions.map(mission => (
              <option key={mission.id} value={mission.id}>{mission.date}｜{mission.title || '未命名 Mission'}</option>
            ))}
          </select>
          <Button variant="secondary" icon={Plus} onClick={addDifficultyMission}>引用 Mission</Button>
        </div>

        <div className="project-report-stack">
          {difficultyEntries.map((entry, index) => (
            <article key={entry.id} className="project-report-entry">
              <div className="project-report-entry-actions">
                <button type="button" title="上移" aria-label="上移" onClick={() => moveDifficultyEntry(index, 'up')}><ArrowUp size={16} /></button>
                <button type="button" title="下移" aria-label="下移" onClick={() => moveDifficultyEntry(index, 'down')}><ArrowDown size={16} /></button>
                <button type="button" title="刪除" aria-label="刪除" onClick={() => deleteDifficultyEntry(entry.id)}><Trash2 size={16} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4">
                <Input label="日期" type="date" value={entry.date} onChange={value => updateDifficultyEntry(entry.id, { date: value })} />
                <Input label="Mission 標題" value={entry.title} onChange={value => updateDifficultyEntry(entry.id, { title: value })} />
              </div>
              <Textarea rows={4} label="學習內容" value={entry.content} onChange={value => updateDifficultyEntry(entry.id, { content: value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DAILY_REFLECTION_ITEMS.map(item => (
                  <Textarea
                    key={item.key}
                    rows={3}
                    label={item.title}
                    value={entry.dailyReflection?.[item.key] || ''}
                    onChange={value => updateDifficultyReflection(entry.id, item.key, value)}
                  />
                ))}
              </div>
            </article>
          ))}
          {difficultyEntries.length === 0 && <p className="project-report-hint">尚未引用 Mission。請先選擇 Project 底下的 Mission，再手動整理困難與解決歷程。</p>}
        </div>
      </section>

      <section className="project-report-section">
        <h4><Star size={18} /> 二、成果說明</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={Plus} onClick={() => addResultPage('mission')}>從 Mission 建立</Button>
          <Button variant="secondary" icon={Plus} onClick={() => addResultPage('manual')}>自行建立</Button>
        </div>
        <div className="project-report-stack">
          {resultPages.map((card, index) => {
            const mission = projectMissions.find(item => item.id === card.missionId);
            const sourceOptions = getMissionResultOptions(mission, card.type);
            const hydratedCard = hydrateResultPageSource(card);
            const selectedSourceIds = Array.isArray(hydratedCard.sourceIds) ? hydratedCard.sourceIds : [];
            const selectedSourceItems = Array.isArray(hydratedCard.sourceItems) ? hydratedCard.sourceItems : [];
            const typeLabel = RESULT_TYPES.find(type => type.id === card.type)?.label || card.type;
            return (
              <article key={card.id} className="project-report-entry">
                <div className="project-report-entry-actions">
                  <span className="project-report-page-label">成果頁 {index + 1}</span>
                  <button type="button" title="上移" aria-label="上移" onClick={() => moveResultPage(index, 'up')}><ArrowUp size={16} /></button>
                  <button type="button" title="下移" aria-label="下移" onClick={() => moveResultPage(index, 'down')}><ArrowDown size={16} /></button>
                  <button type="button" title="刪除" aria-label="刪除" onClick={() => deleteResultPage(card.id)}><Trash2 size={16} /></button>
                </div>
                <Input label="成果標題" value={card.title} onChange={value => updateResultPage(card.id, { title: value })} placeholder="例如：GitHub Repository 或 Python 爬蟲程式" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">成果類型</label>
                    <select value={card.type} onChange={event => updateResultPage(card.id, { type: event.target.value, ...resetResultSourcePatch() })}
                      className="w-full rounded-xl border-slate-300 border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      {RESULT_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">引用 Mission</label>
                    <select value={card.missionId} disabled={card.sourceMode !== 'mission'} onChange={event => updateResultPage(card.id, { missionId: event.target.value, ...resetResultSourcePatch() })}
                      className="w-full rounded-xl border-slate-300 border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">選擇 Mission</option>
                      {projectMissions.map(item => <option key={item.id} value={item.id}>{item.date}｜{item.title || '未命名 Mission'}</option>)}
                    </select>
                  </div>
                  {!isMediaResultType(card.type) && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">引用的 Mission 成果</label>
                    <select value={card.sourceId} disabled={card.sourceMode !== 'mission'} onChange={event => selectResultSource(card, event.target.value)}
                      className="w-full rounded-xl border-slate-300 border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">選擇成果來源</option>
                      {sourceOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
                    </select>
                  </div>
                  )}
                </div>
                {card.sourceMode === 'mission' && isMediaResultType(card.type) && (
                  <div className="project-report-image-picker">
                    <div className="project-report-image-picker-head">
                      <strong>引用的 Mission 圖片</strong>
                      <span>{selectedSourceIds.length} 張已勾選</span>
                    </div>
                    {sourceOptions.length > 0 ? (
                      <div className="project-report-image-grid">
                        {sourceOptions.map(option => {
                          const checked = selectedSourceIds.includes(option.id);
                          return (
                            <label key={option.id} className={`project-report-image-choice ${checked ? 'is-selected' : ''}`}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleResultSource(card, option.id)}
                              />
                              <span className="project-report-image-check">{checked ? <Check size={16} /> : null}</span>
                              {option.dataUrl?.startsWith('data:image') ? (
                                <img src={option.dataUrl} alt={option.label || 'Mission 圖片'} />
                              ) : (
                                <span className="project-report-image-empty"><ImageIcon size={22} /> 無圖片資料</span>
                              )}
                              <span className="project-report-image-caption">{option.label || option.detail || '未命名圖片'}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="project-report-hint">這個 Mission 目前沒有可引用的圖片。</p>
                    )}
                  </div>
                )}
                {card.sourceMode === 'manual' && (
                  <div className="project-report-manual-source">
                    <p className="project-report-hint">自行建立：{typeLabel}</p>
                    {isMediaResultType(card.type) && (
                      <label className="project-report-upload">
                        <Upload size={18} />
                        <span>{card.attachmentName || '上傳圖片或附件'}</span>
                        <input type="file" accept={card.type === 'attachment' ? '*' : 'image/*'} onChange={event => uploadResultFile(card, event.target.files?.[0])} />
                      </label>
                    )}
                    {card.type === 'github' && (
                      <Input label="GitHub URL" value={card.sourceUrl} onChange={value => updateResultPage(card.id, { sourceUrl: value, sourceLabel: value || card.sourceLabel })} placeholder="https://github.com/..." />
                    )}
                    {card.type === 'code' && (
                      <div className="grid gap-4">
                        <Input label="語言" value={card.sourceLanguage} onChange={value => updateResultPage(card.id, { sourceLanguage: value })} placeholder="python / cpp / javascript" />
                        <Textarea rows={6} label="程式碼" value={card.sourceCode} onChange={value => updateResultPage(card.id, { sourceCode: value, sourceLabel: card.sourceLabel || '自行貼上的程式碼' })} placeholder="貼上程式碼..." />
                      </div>
                    )}
                    {(card.type === 'note' || card.type === 'attachment') && (
                      <Textarea rows={3} label="成果內容" value={card.sourceDetail} onChange={value => updateResultPage(card.id, { sourceDetail: value, sourceLabel: card.sourceLabel || '自行建立成果' })} placeholder="貼上筆記內容或附件說明。" />
                    )}
                  </div>
                )}

                {(hydratedCard.sourceLabel || hydratedCard.sourceDetail || hydratedCard.sourceUrl || hydratedCard.sourceDataUrl || hydratedCard.sourceCode) && (
                  <div className="project-report-source">
                    <strong>{hydratedCard.sourceLabel || hydratedCard.title || '成果內容'}</strong>
                    {hydratedCard.sourceUrl && <p>{hydratedCard.sourceUrl}</p>}
                    {hydratedCard.sourceDetail && <p>{hydratedCard.sourceDetail}</p>}
                    {hydratedCard.sourceCode && <p>{hydratedCard.sourceCode.slice(0, 300)}{hydratedCard.sourceCode.length > 300 ? '...' : ''}</p>}
                    {selectedSourceItems.some(item => item.dataUrl?.startsWith('data:image')) && (
                      <div className="project-report-preview-grid">
                        {selectedSourceItems.filter(item => item.dataUrl?.startsWith('data:image')).map((item, imageIndex) => (
                          <figure key={item.id || `${card.id}-${imageIndex}`}>
                            <img src={item.dataUrl} alt={item.label || `已選圖片 ${imageIndex + 1}`} />
                            <figcaption>{item.label || item.detail || `圖片 ${imageIndex + 1}`}</figcaption>
                          </figure>
                        ))}
                      </div>
                    )}
                    {hydratedCard.attachmentName && <p>{hydratedCard.attachmentName}</p>}
                  </div>
                )}
                <Textarea rows={4} label="成果說明" value={card.description} onChange={value => updateResultPage(card.id, { description: value })} placeholder="一個成果，搭配一段說明文字。" />
              </article>
            );
          })}
          {resultPages.length === 0 && <p className="project-report-hint">尚未建立成果頁。成果可從 Mission 引用程式碼、GitHub、圖片或附件，也可以自行建立。</p>}
        </div>
      </section>

      <section className="project-report-section">
        <h4><BookOpen size={18} /> 三、學習反思與心得</h4>
        <select value={reflection.templateId || ''} onChange={event => selectReflectionTemplate(event.target.value)}
          className="w-full rounded-xl border-slate-300 border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">引用寫作中心的反思模板</option>
          {reflectionTemplates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
        </select>
        {reflection.templateText ? (
          <div className="project-reflection-fill">
            {reflection.templateText.split(/(【[^】]+】)/g).map((part, index) => {
              if (!part.match(/^【[^】]+】$/)) {
                return <span key={`${part}-${index}`} className="whitespace-pre-wrap">{part}</span>;
              }
              const label = part.slice(1, -1);
              return (
                <input
                  key={`${part}-${index}`}
                  value={reflection.fields?.[part] || ''}
                  onChange={event => updateReflectionField(part, event.target.value)}
                  placeholder={label}
                />
              );
            })}
          </div>
        ) : (
          <p className="project-report-hint">請先選擇一種完整反思模板。</p>
        )}
        {placeholders.length > 0 && <p className="project-report-hint">{placeholders.length} 個欄位可填寫，內容會儲存在此專案報告中。</p>}
      </section>
    </div>
  );
};

const ProjectCenter = ({ projects, missions, selectedProjectId, onSaveProject, onDeleteProject, onCreateMission, onOpenProjectReport }) => {
  const [draft, setDraft] = useState(createDefaultProject);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const missionCounts = useMemo(() => {
    const counts = {};
    missions.forEach(mission => {
      if (mission.projectId) counts[mission.projectId] = (counts[mission.projectId] || 0) + 1;
    });
    return counts;
  }, [missions]);
  const visibleProjects = useMemo(() => {
    if (!selectedProjectId) return projects;
    return projects.filter(project => project.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const updateDraft = (field, value) => setDraft(prev => ({ ...prev, [field]: value }));
  const resetDraft = () => setDraft(createDefaultProject());
  const saveDraft = async () => {
    if (!draft.name.trim()) return;
    await onSaveProject({ ...draft, name: draft.name.trim() });
    resetDraft();
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      {!showCreateForm && projects.length > 0 && (
        <div className="flex justify-end">
          <Button icon={Plus} onClick={() => setShowCreateForm(true)}>新增專案</Button>
        </div>
      )}

      {showCreateForm && (
        <SectionCard title="新增歷程專案" icon={FileJson}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="專案名稱" value={draft.name} onChange={v => updateDraft('name', v)} placeholder="例如：APCS 程式設計自主學習" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">專案期間</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={draft.startDate} onChange={e => updateDraft('startDate', e.target.value)}
                  className="w-full rounded-xl border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                <input type="date" value={draft.endDate} onChange={e => updateDraft('endDate', e.target.value)}
                  className="w-full rounded-xl border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
            </div>
            <Input label="指導老師" value={draft.teacher} onChange={v => updateDraft('teacher', v)} placeholder="例如：王老師" />
            <Input label="學習地點" value={draft.location} onChange={v => updateDraft('location', v)} placeholder="例如：Poppins Lab" />
            <Textarea label="專案目標" rows={3} value={draft.goal} onChange={v => updateDraft('goal', v)} placeholder="這個歷程專案想達成什麼？" />
            <Textarea label="專案內容" rows={3} value={draft.content} onChange={v => updateDraft('content', v)} placeholder="整理專案範圍、學習主題與產出。" />
          </div>
          <div className="flex gap-3">
            <Button icon={Plus} onClick={saveDraft}>新增專案</Button>
            <Button variant="secondary" icon={X} onClick={() => { resetDraft(); setShowCreateForm(false); }}>取消</Button>
          </div>
        </SectionCard>
      )}

      {!showCreateForm && projects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <FileJson size={40} className="mx-auto text-blue-500 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">尚無歷程專案</h3>
          <p className="text-slate-500 mt-1 mb-5">先建立專案，再把 Mission 放進對應的歷程脈絡。</p>
          <Button icon={Plus} onClick={() => setShowCreateForm(true)}>新增專案</Button>
        </div>
      )}

      <div className="grid gap-4">
        {visibleProjects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{project.name || '未命名專案'}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {project.startDate || '未設定開始'} - {project.endDate || '未設定結束'} · {missionCounts[project.id] || 0} 個 Mission
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  指導老師：{project.teacher || '未設定'} · 學習地點：{project.location || '未設定'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" icon={FileText} onClick={() => onOpenProjectReport(project.id)}>專案報告</Button>
                <Button variant="secondary" icon={Plus} onClick={() => onCreateMission(project.id)}>新增 Mission</Button>
                <Button variant="secondary" icon={Edit3} onClick={() => setEditingProjectId(editingProjectId === project.id ? null : project.id)}>編輯</Button>
                <Button variant="danger" icon={Trash2} onClick={() => { if(window.confirm('刪除此專案後，相關 Mission 會改為未指定專案。確定刪除嗎？')) onDeleteProject(project.id); }}>刪除</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 border-t border-slate-100 pt-4">
              <div>
                <p className="font-bold text-slate-800 mb-1">專案目標</p>
                <p className="whitespace-pre-wrap">{project.goal || '未填寫'}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1">專案內容</p>
                <p className="whitespace-pre-wrap">{project.content || '未填寫'}</p>
              </div>
            </div>

            {editingProjectId === project.id && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t border-slate-100 pt-6">
                <Input label="專案名稱" value={project.name} onChange={v => onSaveProject({ ...project, name: v })} />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">專案期間</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={project.startDate} onChange={e => onSaveProject({ ...project, startDate: e.target.value })}
                      className="w-full rounded-xl border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    <input type="date" value={project.endDate} onChange={e => onSaveProject({ ...project, endDate: e.target.value })}
                      className="w-full rounded-xl border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                </div>
                <Input label="指導老師" value={project.teacher} onChange={v => onSaveProject({ ...project, teacher: v })} />
                <Input label="學習地點" value={project.location} onChange={v => onSaveProject({ ...project, location: v })} />
                <Textarea label="專案目標" rows={3} value={project.goal} onChange={v => onSaveProject({ ...project, goal: v })} />
                <Textarea label="專案內容" rows={3} value={project.content} onChange={v => onSaveProject({ ...project, content: v })} />
              </div>
            )}
          </div>
        ))}
        {selectedProjectId && visibleProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <FileJson size={40} className="mx-auto text-blue-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">找不到這個歷程專案</h3>
            <p className="text-slate-500 mt-1">可能已被刪除，請從左側重新選擇。</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MissionDetailCard = ({ mission, projects, onEdit, onDelete }) => {
  const project = projects.find(p => p.id === mission?.projectId);

  if (!mission) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <BookOpen size={40} className="mx-auto text-blue-500 mb-3" />
        <h3 className="text-lg font-bold text-slate-800">找不到這個 Mission</h3>
        <p className="text-slate-500 mt-1">可能已被刪除，請從左側重新選擇。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {mission.isMasterpiece && <Star size={26} className="text-amber-500 fill-amber-500" />}
            <h2 className="text-2xl font-bold text-slate-800">{mission.title || '未命名任務'}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1"><Calendar size={18}/> {mission.date}</span>
            <span className="flex items-center gap-1"><Clock size={18}/> {mission.hours} 小時</span>
            <span className="flex items-center gap-1"><FileJson size={18}/> {project?.name || '未指定專案'}</span>
            {mission.teacher && <span className="flex items-center gap-1"><User size={18}/> {mission.teacher}</span>}
            {mission.location && <span className="flex items-center gap-1"><MapPin size={18}/> {mission.location}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={FileText} onClick={() => onEdit(mission.id)}>編輯</Button>
          <Button variant="danger" icon={Trash2} onClick={() => { if(window.confirm('確定要刪除此 Mission 嗎？')) onDelete(mission.id); }}>刪除</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {mission.tags.map(tag => (
          <span key={tag} className="text-sm font-medium px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl">{tag}</span>
        ))}
      </div>

      {(mission.objective || mission.content) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 border-t border-slate-100 py-6">
          <div>
            <p className="font-bold text-slate-800 mb-1">本次目標</p>
            <p className="whitespace-pre-wrap">{mission.objective || '未填寫'}</p>
          </div>
          <div>
            <p className="font-bold text-slate-800 mb-1">學習內容</p>
            <p className="whitespace-pre-wrap">{mission.content || '未填寫'}</p>
          </div>
        </div>
      )}

      {Object.values(mission.dailyReflection || {}).some(Boolean) && (
        <div className="border-t border-slate-100 py-6">
          <p className="font-bold text-slate-800 mb-3">每日四宮格</p>
          <DailyReflectionGrid value={mission.dailyReflection} readonly />
        </div>
      )}

      <div className="flex gap-6 border-t border-slate-100 pt-6 text-slate-600">
        <span className="flex items-center gap-1"><ImageIcon size={20}/> {mission.images.length}</span>
        <span className="flex items-center gap-1"><Code size={20}/> {mission.codes.length}</span>
        <span className="flex items-center gap-1"><Bug size={20}/> {mission.bugs.length}</span>
        <span className="flex items-center gap-1"><Github size={20}/> {mission.githubs.length}</span>
      </div>
    </div>
  );
};

const TagManagementCenter = ({ availableTags, missions, onAddTag, onDeleteTag }) => {
  const [newTag, setNewTag] = useState('');
  const tagCounts = useMemo(() => {
    const counts = {};
    missions.forEach(mission => mission.tags.forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; }));
    return counts;
  }, [missions]);

  const submit = async () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    await onAddTag(trimmed);
    setNewTag('');
  };

  return (
    <SectionCard title="能力標籤管理中心" icon={Tag}>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          placeholder="新增能力標籤"
          className="flex-1 rounded-xl border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        <Button icon={Plus} onClick={submit}>新增標籤</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        {availableTags.map(tag => (
          <div key={tag} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-medium text-slate-700">{tag}</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tagCounts[tag] || 0}</span>
            <button onClick={() => { if(window.confirm(`確定刪除「${tag}」標籤嗎？既有 Mission 也會移除此標籤。`)) onDeleteTag(tag); }}
              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

const MissionEdit = ({ missionId, missions, projects, availableTags, initialProjectId = '', onSave, onCancel }) => {
  const [mission, setMission] = useState(() => {
    const baseMission = missionId === 'new' ? createDefaultMission() 
           : missions.find(m => m.id === missionId) || createDefaultMission();
    const project = projects.find(p => p.id === (baseMission.projectId || initialProjectId));
    const normalized = normalizeMission(baseMission);
    return {
      ...normalized,
      projectId: normalized.projectId || initialProjectId,
      teacher: normalized.teacher || project?.teacher || '',
      location: normalized.location || project?.location || ''
    };
  });
  const [previewContent, setPreviewContent] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field, value) => setMission(prev => ({ ...prev, [field]: value }));
  const updateProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setMission(prev => ({
      ...prev,
      projectId,
      teacher: prev.teacher || project?.teacher || '',
      location: prev.location || project?.location || ''
    }));
  };
  const updateNested = (category, id, field, value) => {
    setMission(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };
  const addNested = (category, defaultItem) => {
    setMission(prev => ({ ...prev, [category]: [...prev[category], { id: Date.now().toString(), ...defaultItem }] }));
  };
  const removeNested = (category, id) => {
    setMission(prev => ({ ...prev, [category]: prev[category].filter(item => item.id !== id) }));
  };

  const onDropImages = useCallback(async (acceptedFiles) => {
    const newImages = await Promise.all(acceptedFiles.map(async file => ({
      id: Date.now().toString() + Math.random(),
      dataUrl: await compressImage(file),
      note: ''
    })));
    setMission(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onDropImages, accept: {'image/*': []} });

  const moveImage = (index, dir) => {
    const imgs = [...mission.images];
    if (dir === 'up' && index > 0) [imgs[index-1], imgs[index]] = [imgs[index], imgs[index-1]];
    if (dir === 'down' && index < imgs.length - 1) [imgs[index+1], imgs[index]] = [imgs[index], imgs[index+1]];
    updateField('images', imgs);
  };

  const saveMission = async () => {
    setIsSaving(true);
    try {
      await onSave(mission);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-40 py-4 border-b border-slate-200">
        <Button variant="ghost" icon={ChevronLeft} onClick={onCancel}>返回列表</Button>
        <div className="flex gap-3">
          <Button icon={Save} disabled={isSaving} onClick={saveMission}>{isSaving ? '儲存中...' : '儲存 Mission'}</Button>
        </div>
      </div>

      <SectionCard title="基本資料" icon={Target}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">所屬歷程專案</label>
            <select value={mission.projectId} onChange={e => updateProject(e.target.value)}
              className="w-full rounded-xl border-slate-300 border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">未指定專案</option>
              {projects.map(project => <option key={project.id} value={project.id}>{project.name || '未命名專案'}</option>)}
            </select>
          </div>
          <Input label="Mission 標題" value={mission.title} onChange={v => updateField('title', v)} placeholder="例如：APCS 模擬測驗練習" />
          <Input label="日期" type="date" value={mission.date} onChange={v => updateField('date', v)} />
          <Input label="本次目標" value={mission.objective} onChange={v => updateField('objective', v)} placeholder="簡述想達成什麼" />
          <Input label="學習時數" type="number" min="0" step="0.5" value={mission.hours} onChange={v => updateField('hours', v)} />
          <Input label="指導老師 (選填)" value={mission.teacher} onChange={v => updateField('teacher', v)} />
          <Input label="學習地點 (選填)" value={mission.location} onChange={v => updateField('location', v)} />
        </div>
        <div>
          <div className="flex gap-2 mb-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex-1">學習內容 (支援 Markdown)</label>
            <button onClick={() => setPreviewContent(false)} className={`text-sm px-3 py-1 rounded-lg ${!previewContent ? 'bg-slate-200 font-bold' : 'text-slate-500'}`}>編輯</button>
            <button onClick={() => setPreviewContent(true)} className={`text-sm px-3 py-1 rounded-lg ${previewContent ? 'bg-slate-200 font-bold' : 'text-slate-500'}`}>預覽</button>
          </div>
          {previewContent ? (
            <div className="prose max-w-none p-4 border border-slate-200 rounded-xl bg-white min-h-[150px]">
              <ReactMarkdown>{mission.content || '*尚未輸入內容*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea rows={5} value={mission.content} onChange={e => updateField('content', e.target.value)} placeholder="記錄具體學到了什麼..."
              className="w-full rounded-xl border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 outline-none transition font-mono text-sm" />
          )}
        </div>
      </SectionCard>

      <SectionCard title="圖片紀錄 (拖曳上傳)" icon={ImageIcon}>
        <div {...getRootProps()} className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-8 text-center cursor-pointer hover:bg-blue-50 transition mb-4">
          <input {...getInputProps()} />
          <Upload className="mx-auto h-10 w-10 text-blue-400 mb-3" />
          {isDragActive ? <p className="text-blue-600 font-medium">放開以放入圖片...</p> : <p className="text-blue-600 font-medium">拖曳圖片至此，或點擊選擇檔案 (自動壓縮)</p>}
        </div>
        {mission.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mission.images.map((img, idx) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <img src={img.dataUrl} className="w-full h-40 object-cover cursor-pointer" onClick={() => setZoomImage(img.dataUrl)} alt="record" />
                <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button type="button" title="圖片上移" aria-label="圖片上移" onClick={() => moveImage(idx, 'up')} className="bg-white/90 p-1.5 rounded-lg shadow hover:bg-white text-slate-700"><ArrowUp size={16}/></button>
                  <button type="button" title="圖片下移" aria-label="圖片下移" onClick={() => moveImage(idx, 'down')} className="bg-white/90 p-1.5 rounded-lg shadow hover:bg-white text-slate-700"><ArrowDown size={16}/></button>
                  <button type="button" title="刪除圖片" aria-label="刪除圖片" onClick={() => removeNested('images', img.id)} className="bg-red-500/90 p-1.5 rounded-lg shadow hover:bg-red-500 text-white"><Trash2 size={16}/></button>
                </div>
                <input className="w-full p-2 border-t border-slate-100 text-sm focus:outline-none bg-slate-50" 
                  placeholder="加入圖片備註..." value={img.note} onChange={e => updateNested('images', img.id, 'note', e.target.value)} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="程式碼片段" icon={Code} action={<Button variant="secondary" icon={Plus} onClick={() => addNested('codes', { filename: '', language: 'cpp', code: '', description: '' })}>新增</Button>}>
        {mission.codes.map(c => (
          <div key={c.id} className="mb-6 p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
            <button onClick={() => removeNested('codes', c.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={20}/></button>
            <div className="grid grid-cols-2 gap-4 mb-3 pr-8">
              <Input label="檔案名稱" value={c.filename} onChange={v => updateNested('codes', c.id, 'filename', v)} placeholder="main.cpp" />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">語言</label>
                <select value={c.language} onChange={e => updateNested('codes', c.id, 'language', e.target.value)} className="w-full rounded-xl border-slate-300 border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {PROGRAMMING_LANGUAGES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            <textarea rows={6} value={c.code} onChange={e => updateNested('codes', c.id, 'code', e.target.value)} placeholder="貼上程式碼..."
              className="w-full rounded-xl border-slate-300 border p-3 font-mono text-sm bg-slate-900 text-slate-50 focus:outline-none mb-3" />
            <Textarea label="程式碼說明" rows={2} value={c.description} onChange={v => updateNested('codes', c.id, 'description', v)} placeholder="這段程式碼在做什麼？" />
          </div>
        ))}
        {mission.codes.length === 0 && <p className="text-slate-400 text-center py-4">無程式碼紀錄</p>}
      </SectionCard>

      <SectionCard title="Bug 排除紀錄" icon={Bug} action={<Button variant="secondary" icon={Plus} onClick={() => addNested('bugs', { name: '', problem: '', cause: '', solution: '', lesson: '' })}>新增</Button>}>
        {mission.bugs.map(b => (
          <div key={b.id} className="mb-6 p-4 border border-slate-200 rounded-xl bg-red-50/30 relative">
             <button onClick={() => removeNested('bugs', b.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={20}/></button>
             <div className="mb-4 pr-8"><Input label="Bug 名稱" value={b.name} onChange={v => updateNested('bugs', b.id, 'name', v)} placeholder="例如：陣列越界錯誤" /></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Textarea label="問題狀況" rows={2} value={b.problem} onChange={v => updateNested('bugs', b.id, 'problem', v)} placeholder="發生了什麼錯誤訊息？" />
               <Textarea label="發生原因" rows={2} value={b.cause} onChange={v => updateNested('bugs', b.id, 'cause', v)} placeholder="為什麼會產生這個 Bug？" />
               <Textarea label="解決方案" rows={2} value={b.solution} onChange={v => updateNested('bugs', b.id, 'solution', v)} placeholder="你是如何修好它的？" />
               <Textarea label="學到了什麼" rows={2} value={b.lesson} onChange={v => updateNested('bugs', b.id, 'lesson', v)} placeholder="下次如何避免？" />
             </div>
          </div>
        ))}
        {mission.bugs.length === 0 && <p className="text-slate-400 text-center py-4">太棒了，沒有 Bug！</p>}
      </SectionCard>

      <SectionCard title="GitHub 紀錄" icon={Github} action={<Button variant="secondary" icon={Plus} onClick={() => addNested('githubs', { repo: '', commit: '', branch: 'main', url: '' })}>新增</Button>}>
         {mission.githubs.map(g => (
          <div key={g.id} className="mb-4 p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-wrap gap-4 items-end relative">
             <button onClick={() => removeNested('githubs', g.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={20}/></button>
             <div className="flex-1 min-w-[200px]"><Input label="Repository" value={g.repo} onChange={v => updateNested('githubs', g.id, 'repo', v)} /></div>
             <div className="w-32"><Input label="Branch" value={g.branch} onChange={v => updateNested('githubs', g.id, 'branch', v)} /></div>
             <div className="flex-1 min-w-[200px]"><Input label="Commit 摘要" value={g.commit} onChange={v => updateNested('githubs', g.id, 'commit', v)} /></div>
             <div className="w-full"><Input label="URL 連結" value={g.url} onChange={v => updateNested('githubs', g.id, 'url', v)} /></div>
          </div>
        ))}
        {mission.githubs.length === 0 && <p className="text-slate-400 text-center py-4">無 GitHub 紀錄</p>}
      </SectionCard>

      <SectionCard title="每日四宮格" icon={BookOpen}>
         <DailyReflectionGrid
           value={mission.dailyReflection}
           onChange={dailyReflection => setMission(prev => ({ ...prev, dailyReflection }))}
         />
      </SectionCard>

      <SectionCard title="能力標籤" icon={Tag}>
         <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => {
              const active = mission.tags.includes(tag);
              return (
                <button key={tag} onClick={() => {
                  setMission(prev => ({
                    ...prev, tags: active ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
                  }))
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {tag}
                </button>
              )
            })}
         </div>
      </SectionCard>

      <SectionCard title="設定為代表作品" icon={Star}>
         <div className="flex items-center gap-3 mb-4">
           <input type="checkbox" id="masterpiece" checked={mission.isMasterpiece} onChange={e => updateField('isMasterpiece', e.target.checked)} className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500 cursor-pointer" />
           <label htmlFor="masterpiece" className="font-bold text-slate-800 cursor-pointer">將此 Mission 標記為代表作品</label>
         </div>
         {mission.isMasterpiece && (
           <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-4">
             <Input label="作品名稱" value={mission.masterpieceDetail.name} onChange={v => setMission(prev => ({...prev, masterpieceDetail: {...prev.masterpieceDetail, name: v}}))} placeholder="給這個作品一個響亮的名字" />
             <Textarea label="作品功能介紹" rows={3} value={mission.masterpieceDetail.features} onChange={v => setMission(prev => ({...prev, masterpieceDetail: {...prev.masterpieceDetail, features: v}}))} placeholder="列出亮點與特色..." />
           </div>
         )}
      </SectionCard>

      {zoomImage && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 cursor-pointer" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl" alt="zoomed" />
          <button className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full hover:bg-white/20"><X size={24}/></button>
        </div>
      )}
    </div>
  );
};

const EvidenceCenter = ({ missions, projects }) => {
  const [tab, setTab] = useState('images');
  const [search, setSearch] = useState('');
  const projectNameById = useMemo(
    () => Object.fromEntries(projects.map(project => [project.id, project.name || '未命名專案'])),
    [projects]
  );

  const allImages = useMemo(() => missions.flatMap(m => m.images.map(i => ({...i, mTitle: m.title, mId: m.id, projectTitle: projectNameById[m.projectId] || '未指定專案'}))), [missions, projectNameById]);
  const allCodes = useMemo(() => missions.flatMap(m => m.codes.map(c => ({...c, mTitle: m.title, mId: m.id, projectTitle: projectNameById[m.projectId] || '未指定專案'}))), [missions, projectNameById]);
  const allBugs = useMemo(() => missions.flatMap(m => m.bugs.map(b => ({...b, mTitle: m.title, mId: m.id, projectTitle: projectNameById[m.projectId] || '未指定專案'}))), [missions, projectNameById]);
  
  const filteredImages = allImages.filter(i => includesSearch(i.note, search) || includesSearch(i.mTitle, search) || includesSearch(i.projectTitle, search));
  const filteredCodes = allCodes.filter(c => includesSearch(c.filename, search) || includesSearch(c.description, search) || includesSearch(c.projectTitle, search) || includesSearch(c.mTitle, search));
  const filteredBugs = allBugs.filter(b => includesSearch(b.name, search) || includesSearch(b.problem, search) || includesSearch(b.solution, search) || includesSearch(b.projectTitle, search) || includesSearch(b.mTitle, search));

  const TabBtn = ({ tId, label, icon: Icon, count }) => (
    <button onClick={() => setTab(tId)} className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${tab === tId ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
      <Icon size={18} /> {label} <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{count}</span>
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[70vh] flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 flex-1">
           <TabBtn tId="images" label="圖片" icon={ImageIcon} count={allImages.length} />
           <TabBtn tId="codes" label="程式碼" icon={Code} count={allCodes.length} />
           <TabBtn tId="bugs" label="Bugs" icon={Bug} count={allBugs.length} />
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           <input type="text" placeholder="搜尋..." value={search} onChange={e => setSearch(e.target.value)}
             className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="p-6 flex-1 overflow-auto bg-slate-50">
        {tab === 'images' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredImages.map(img => (
              <div key={img.id} className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
                <img src={img.dataUrl} className="w-full h-32 object-cover rounded-lg mb-2" alt="ev" />
                <p className="text-xs text-slate-500 truncate mb-1">專案：{img.projectTitle}</p>
                <p className="text-xs text-slate-500 truncate mb-1">任務：{img.mTitle}</p>
                <p className="text-sm font-medium truncate">{img.note || '無備註'}</p>
              </div>
            ))}
            {filteredImages.length === 0 && <p className="col-span-full text-center text-slate-400 py-12">找不到符合條件的圖片紀錄。</p>}
          </div>
        )}
        {tab === 'codes' && (
          <div className="space-y-4">
            {filteredCodes.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-100 px-4 py-2 border-b flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700">{c.filename}</span>
                  <span className="text-slate-500 text-xs">專案：{c.projectTitle} / 任務：{c.mTitle}</span>
                </div>
                <div className="p-4">
                   {c.description && <p className="mb-3 text-sm text-slate-700">{c.description}</p>}
                   <div className="rounded-xl overflow-hidden text-sm">
                     <SyntaxHighlighter language={c.language}>{c.code}</SyntaxHighlighter>
                   </div>
                </div>
              </div>
            ))}
            {filteredCodes.length === 0 && <p className="text-center text-slate-400 py-12">找不到符合條件的程式碼紀錄。</p>}
          </div>
        )}
        {tab === 'bugs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBugs.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-red-200 shadow-sm p-4 border-l-4 border-l-red-500">
                <h4 className="font-bold text-slate-800 mb-2">{b.name}</h4>
                <p className="text-xs text-slate-500 mb-3 border-b pb-2">專案：{b.projectTitle} / 任務：{b.mTitle}</p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-slate-700">問題：</span>{b.problem}</p>
                  <p><span className="font-semibold text-slate-700">解法：</span>{b.solution}</p>
                </div>
              </div>
            ))}
            {filteredBugs.length === 0 && <p className="md:col-span-2 text-center text-slate-400 py-12">找不到符合條件的 Bug 紀錄。</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCenter = ({ missions, projects, availableTags, onAddTag, onDeleteTag, onExportJson, onImportJson, onExportPdf, isExportingPdf }) => {
  const [section, setSection] = useState('evidence');

  const InfoTab = ({ id, label, icon: Icon }) => (
    <button onClick={() => setSection(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${section === id ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <InfoTab id="evidence" label="證據中心" icon={Database} />
        <InfoTab id="tags" label="能力標籤" icon={Tag} />
        <InfoTab id="data" label="資料管理" icon={Download} />
      </div>

      {section === 'evidence' && <EvidenceCenter missions={missions} projects={projects} />}

      {section === 'tags' && (
        <TagManagementCenter
          availableTags={availableTags}
          missions={missions}
          onAddTag={onAddTag}
          onDeleteTag={onDeleteTag}
        />
      )}

      {section === 'data' && (
        <SectionCard title="資料管理" icon={Download}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={onExportJson}
              className="min-h-[110px] rounded-xl border border-slate-200 bg-slate-50 p-5 text-left hover:bg-white hover:shadow-sm transition">
              <Download size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">備份 JSON</h3>
              <p className="text-sm text-slate-500">匯出專案、Mission 與能力標籤。</p>
            </button>
            <label className="min-h-[110px] rounded-xl border border-slate-200 bg-slate-50 p-5 text-left hover:bg-white hover:shadow-sm transition cursor-pointer">
              <Upload size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">匯入 JSON</h3>
              <p className="text-sm text-slate-500">從備份檔還原資料。</p>
              <input type="file" accept=".json" className="hidden" onChange={onImportJson} />
            </label>
            <button onClick={onExportPdf} disabled={isExportingPdf}
              className="min-h-[110px] rounded-xl border border-slate-200 bg-slate-50 p-5 text-left hover:bg-white hover:shadow-sm transition">
              <FileText size={24} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">{isExportingPdf ? '產生 PDF 中' : '匯出歷程 PDF'}</h3>
              <p className="text-sm text-slate-500">下載正式 A4 學習歷程文件。</p>
            </button>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

const ProjectSidebarTree = ({ projects, missions, currentTab, selectedProjectId, editingId, onSelectProject, onSelectMission }) => {
  const missionsByProject = useMemo(() => {
    const groups = {};
    missions.forEach(mission => {
      const key = mission.projectId || 'unassigned';
      groups[key] = groups[key] || [];
      groups[key].push(mission);
    });
    return groups;
  }, [missions]);

  const unassignedMissions = missionsByProject.unassigned || [];

  return (
    <div className="mt-1 mb-3 space-y-1">
      {projects.map(project => {
        const projectMissions = missionsByProject[project.id] || [];
        const activeProject = (currentTab === 'projects' || currentTab === 'projectReport') && selectedProjectId === project.id;
        return (
          <div key={project.id}>
            <button onClick={() => onSelectProject(project.id)}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeProject ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <span className="block truncate">{project.name || '未命名專案'}</span>
            </button>
            <div className="ml-5 border-l border-slate-100 pl-3 space-y-1">
              {projectMissions.map(mission => {
                const activeMission = (currentTab === 'missionDetail' || currentTab === 'edit') && editingId === mission.id;
                return (
                  <button key={mission.id} onClick={() => onSelectMission(mission)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${activeMission ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                    <span className="block truncate">{mission.title || '未命名任務'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {unassignedMissions.length > 0 && (
        <div>
          <button onClick={() => onSelectProject('')}
            className={`w-full text-left px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${currentTab === 'projects' && !selectedProjectId ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <span className="block truncate">未指定專案</span>
          </button>
          <div className="ml-5 border-l border-slate-100 pl-3 space-y-1">
            {unassignedMissions.map(mission => {
              const activeMission = (currentTab === 'missionDetail' || currentTab === 'edit') && editingId === mission.id;
              return (
                <button key={mission.id} onClick={() => onSelectMission(mission)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${activeMission ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                  <span className="block truncate">{mission.title || '未命名任務'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [missions, setMissions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [availableTags, setAvailableTags] = useState(DEFAULT_AVAILABLE_TAGS);
  const [writingTitles, setWritingTitles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard'); // dashboard, projects, projectReport, missionDetail, edit, writing, info
  const [editingId, setEditingId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [initialProjectId, setInitialProjectId] = useState('');
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const [saveNotice, setSaveNotice] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    Promise.all([
      localforage.getItem(MISSIONS_KEY),
      localforage.getItem(PROJECTS_KEY),
      localforage.getItem(TAGS_KEY),
      localforage.getItem(TITLES_KEY)
    ]).then(([storedMissions, storedProjects, storedTags, storedTitles]) => {
      if (storedMissions) setMissions(Array.isArray(storedMissions) ? storedMissions.map(normalizeMission) : []);
      if (storedProjects) setProjects(Array.isArray(storedProjects) ? storedProjects.map(normalizeProject) : []);
      if (storedTags) setAvailableTags(Array.isArray(storedTags) && storedTags.length > 0 ? storedTags : DEFAULT_AVAILABLE_TAGS);
      if (storedTitles) setWritingTitles(Array.isArray(storedTitles) ? storedTitles.map(normalizeWritingTitle) : []);
      setIsLoaded(true);
    }).catch(err => {
      console.error(err);
      setIsLoaded(true);
    });
  }, []);

  const persistValue = async (key, value, applyState) => {
    try {
      applyState(value);
      await localforage.setItem(key, value);
      setSaveNotice('已儲存');
      window.setTimeout(() => setSaveNotice(''), 1800);
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: '儲存失敗', message: '資料無法寫入瀏覽器儲存空間，請先匯出 JSON 備份後再繼續操作。' });
      throw error;
    }
  };

  const saveMissions = (newMissions) => persistValue(MISSIONS_KEY, newMissions, setMissions);

  const saveProjects = (newProjects) => persistValue(PROJECTS_KEY, newProjects, setProjects);

  const saveAvailableTags = (newTags) => persistValue(TAGS_KEY, newTags, setAvailableTags);

  const saveWritingTitles = (newTitles) => persistValue(TITLES_KEY, newTitles.map(normalizeWritingTitle), setWritingTitles);

  const handleSaveMission = async (mission) => {
    const isNew = !missions.some(m => m.id === mission.id);
    const normalized = normalizeMission(mission);
    const newMissions = isNew ? [normalized, ...missions] : missions.map(m => m.id === normalized.id ? normalized : m);
    await saveMissions(newMissions);
    setCurrentTab('missionDetail');
    setEditingId(normalized.id);
    setSelectedProjectId(normalized.projectId || '');
    setInitialProjectId('');
  };

  const handleDeleteMission = async (id) => {
    const mission = missions.find(m => m.id === id);
    await saveMissions(missions.filter(m => m.id !== id));
    setEditingId(null);
    setInitialProjectId('');
    setSelectedProjectId(mission?.projectId || '');
    setCurrentTab('projects');
  };

  const handleSaveProject = async (project) => {
    const normalized = normalizeProject(project);
    const exists = projects.some(p => p.id === normalized.id);
    const newProjects = exists ? projects.map(p => p.id === normalized.id ? normalized : p) : [normalized, ...projects];
    await saveProjects(newProjects);
  };

  const handleDeleteProject = async (id) => {
    await saveProjects(projects.filter(project => project.id !== id));
    await saveMissions(missions.map(mission => mission.projectId === id ? { ...mission, projectId: '' } : mission));
    if (selectedProjectId === id) setSelectedProjectId('');
  };

  const handleCreateMissionForProject = (projectId) => {
    setSelectedProjectId(projectId);
    setInitialProjectId(projectId);
    setEditingId('new');
    setCurrentTab('edit');
  };

  const handleOpenProjectReport = (projectId) => {
    setSelectedProjectId(projectId);
    setEditingId(null);
    setInitialProjectId('');
    setCurrentTab('projectReport');
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setEditingId(null);
    setInitialProjectId('');
    setCurrentTab('projects');
  };

  const handleSelectMission = (mission) => {
    setSelectedProjectId(mission.projectId || '');
    setInitialProjectId('');
    setEditingId(mission.id);
    setCurrentTab('missionDetail');
  };

  const handleEditMission = (id) => {
    const mission = missions.find(m => m.id === id);
    setSelectedProjectId(mission?.projectId || '');
    setInitialProjectId('');
    setEditingId(id);
    setCurrentTab('edit');
  };

  const handleAddTag = async (tag) => {
    if (availableTags.includes(tag)) return;
    await saveAvailableTags([...availableTags, tag]);
  };

  const handleDeleteTag = async (tag) => {
    await saveAvailableTags(availableTags.filter(t => t !== tag));
    await saveMissions(missions.map(mission => ({
      ...mission,
      tags: mission.tags.filter(t => t !== tag)
    })));
  };

  const handleSaveWritingTitle = async (title) => {
    await saveWritingTitles([normalizeWritingTitle(title), ...writingTitles]);
  };

  const handleUpdateWritingTitle = async (id, title) => {
    await saveWritingTitles(writingTitles.map(item => item.id === id ? { ...item, title } : item));
  };

  const handleDeleteWritingTitle = async (id) => {
    if (!window.confirm('確定要刪除此標題嗎？')) return;
    await saveWritingTitles(writingTitles.filter(item => item.id !== id));
  };

  const handleToggleWritingTitleFavorite = async (id) => {
    await saveWritingTitles(writingTitles.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item));
  };

  const handleCopyWritingTitle = async (title) => {
    try {
      await navigator.clipboard.writeText(title);
      setSaveNotice('已複製標題');
      window.setTimeout(() => setSaveNotice(''), 1800);
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: '複製失敗', message: '無法使用剪貼簿，請手動選取標題複製。' });
    }
  };

  const handleExportJson = () => {
    const backup = {
      version: 2,
      exportedAt: new Date().toISOString(),
      missions,
      projects,
      availableTags
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const dlAnchorNode = document.createElement('a');
    dlAnchorNode.setAttribute("href", url);
    dlAnchorNode.setAttribute("download", `poppins_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchorNode);
    dlAnchorNode.click();
    dlAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json)) {
          await saveMissions(json.map(normalizeMission));
          setModal({ show: true, title: '成功', message: '資料已成功匯入！' });
        } else if (json && Array.isArray(json.missions)) {
          await saveMissions(json.missions.map(normalizeMission));
          await saveProjects(Array.isArray(json.projects) ? json.projects.map(normalizeProject) : []);
          await saveAvailableTags(Array.isArray(json.availableTags) && json.availableTags.length > 0 ? json.availableTags : DEFAULT_AVAILABLE_TAGS);
          setModal({ show: true, title: '成功', message: '資料已成功匯入！' });
        } else throw new Error();
      } catch {
        setModal({ show: true, title: '錯誤', message: '檔案格式不符！請上傳正確的備份 JSON。' });
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset input
  };

  const handleExportPdf = async () => {
    if (!pdfRef.current || isExportingPdf) return;
    setIsExportingPdf(true);
    const today = new Date();
    const filenameDate = today.toISOString().slice(0, 10).replaceAll('-', '');

    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const worker = html2pdf()
        .set({
          margin: [16, 16, 16, 16],
          filename: `LearningPortfolio_${filenameDate}.pdf`,
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            letterRendering: true
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'], avoid: ['.pdf-avoid', 'img', 'figure'] }
        })
        .from(pdfRef.current)
        .toPdf();

      await worker.get('pdf').then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        pdf.setFontSize(9);
        pdf.setTextColor(100);
        for (let page = 1; page <= totalPages; page += 1) {
          pdf.setPage(page);
          pdf.text('Poppins Learning Portfolio', 16, 287);
          pdf.text(`Page ${page} / ${totalPages}`, 181, 287, { align: 'right' });
        }
      }).save();
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: 'PDF 匯出失敗', message: '產生 PDF 時發生問題，請先確認瀏覽器儲存空間與圖片資料是否完整後再試一次。' });
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-blue-600 font-bold animate-pulse">載入中...</div>;

  const selectedProject = projects.find(project => project.id === selectedProjectId);

  const NavItem = ({ tab, icon: Icon, label, onClick }) => (
    <button onClick={onClick || (() => setCurrentTab(tab))} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full md:w-auto md:justify-start ${currentTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
      <Icon size={20} /> <span className="hidden md:block">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-4 z-10 shadow-sm">
        <div className="flex items-center gap-2 px-2 py-4 mb-6">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
           <h1 className="font-extrabold text-xl text-slate-800 tracking-tight">Poppins<span className="text-blue-600">.</span></h1>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => { setSelectedProjectId(''); setCurrentTab('dashboard'); }} />
          <NavItem tab="projects" icon={FileJson} label="歷程專案" onClick={() => { setSelectedProjectId(''); setEditingId(null); setCurrentTab('projects'); }} />
          <ProjectSidebarTree
            projects={projects}
            missions={missions}
            currentTab={currentTab}
            selectedProjectId={selectedProjectId}
            editingId={editingId}
            onSelectProject={handleSelectProject}
            onSelectMission={handleSelectMission}
          />
          <NavItem tab="writing" icon={PenLine} label="寫作中心" onClick={() => { setSelectedProjectId(''); setCurrentTab('writing'); }} />
          <NavItem tab="info" icon={Database} label="資訊中心" onClick={() => { setSelectedProjectId(''); setCurrentTab('info'); }} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">P</div>
           <h1 className="font-extrabold text-lg text-slate-800">Poppins.</h1>
          </div>
          <button onClick={() => setModal({ show: true, title: '功能', message: '行動版建議使用下方導覽列。備份等進階功能請使用桌面版操作。' })} className="text-slate-500"><Settings size={20}/></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
          <div className="max-w-6xl mx-auto">
            {saveNotice && (
              <div className="fixed right-4 top-4 z-50 rounded-xl border border-emerald-100 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-card">
                {saveNotice}
              </div>
            )}
            {currentTab === 'dashboard' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">儀表板</h2>
                  <Button icon={Plus} onClick={() => { setInitialProjectId(''); setCurrentTab('edit'); setEditingId('new'); }}>新增紀錄</Button>
                </div>
                <Dashboard missions={missions} projects={projects} />
              </div>
            )}

            {currentTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">{selectedProject ? selectedProject.name || '未命名專案' : '歷程專案'}</h2>
                </div>
                <ProjectCenter
                  projects={projects}
                  missions={missions}
                  selectedProjectId={selectedProjectId}
                  onSaveProject={handleSaveProject}
                  onDeleteProject={handleDeleteProject}
                  onCreateMission={handleCreateMissionForProject}
                  onOpenProjectReport={handleOpenProjectReport}
                />
              </div>
            )}

            {currentTab === 'projectReport' && (
              <ProjectReportEditor
                project={selectedProject || createDefaultProject()}
                missions={missions}
                reflectionTemplates={REFLECTION_TEMPLATES}
                onSaveProject={handleSaveProject}
                onBack={() => setCurrentTab('projects')}
              />
            )}
            
            {currentTab === 'missionDetail' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">學習任務</h2>
                </div>
                <MissionDetailCard
                  mission={missions.find(mission => mission.id === editingId)}
                  projects={projects}
                  onEdit={handleEditMission}
                  onDelete={handleDeleteMission}
                />
              </div>
            )}

            {currentTab === 'edit' && (
              <MissionEdit 
                missionId={editingId} 
                missions={missions} 
                projects={projects}
                availableTags={availableTags}
                initialProjectId={initialProjectId}
                onSave={handleSaveMission} 
                onCancel={() => {
                  if (editingId && editingId !== 'new') setCurrentTab('missionDetail');
                  else {
                    setCurrentTab('projects');
                    setEditingId(null);
                  }
                  setInitialProjectId('');
                }} 
              />
            )}

            {currentTab === 'info' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Database size={24}/> 資訊中心</h2>
                <InfoCenter
                  missions={missions}
                  projects={projects}
                  availableTags={availableTags}
                  onAddTag={handleAddTag}
                  onDeleteTag={handleDeleteTag}
                  onExportJson={handleExportJson}
                  onImportJson={handleImportJson}
                  onExportPdf={handleExportPdf}
                  isExportingPdf={isExportingPdf}
                />
              </div>
            )}

            {currentTab === 'writing' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><PenLine size={24}/> 學習歷程寫作中心</h2>
                <WritingCenter
                  savedTitles={writingTitles}
                  onSaveTitle={handleSaveWritingTitle}
                  onUpdateTitle={handleUpdateWritingTitle}
                  onDeleteTitle={handleDeleteWritingTitle}
                  onToggleFavorite={handleToggleWritingTitleFavorite}
                  onCopyTitle={handleCopyWritingTitle}
                  reflectionTemplates={REFLECTION_TEMPLATES}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around items-center pb-safe z-50">
          <button onClick={() => setCurrentTab('dashboard')} className={`p-3 rounded-xl flex flex-col items-center gap-1 ${currentTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500'}`}>
            <LayoutDashboard size={20} /><span className="text-[10px] font-bold">總覽</span>
          </button>
          <button onClick={() => setCurrentTab('projects')} className={`p-3 rounded-xl flex flex-col items-center gap-1 ${currentTab === 'projects' ? 'text-blue-600' : 'text-slate-500'}`}>
            <FileJson size={20} /><span className="text-[10px] font-bold">專案</span>
          </button>
          <button onClick={() => setCurrentTab('writing')} className={`p-3 rounded-xl flex flex-col items-center gap-1 ${currentTab === 'writing' ? 'text-blue-600' : 'text-slate-500'}`}>
            <PenLine size={20} /><span className="text-[10px] font-bold">寫作</span>
          </button>
          <button onClick={() => setCurrentTab('info')} className={`p-3 rounded-xl flex flex-col items-center gap-1 ${currentTab === 'info' ? 'text-blue-600' : 'text-slate-500'}`}>
            <Database size={20} /><span className="text-[10px] font-bold">資訊</span>
          </button>
        </nav>
      </main>

      {/* Global Message Modal */}
      <Modal isOpen={modal.show} onClose={() => setModal({ show: false, title: '', message: '' })} title={modal.title}>
        <div className="py-4 text-slate-700 text-center text-lg">{modal.message}</div>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => setModal({ show: false, title: '', message: '' })}>確定</Button>
        </div>
      </Modal>

      <div className="pdf-render-host" aria-hidden="true">
        <LearningPortfolioPDF ref={pdfRef} missions={missions} projects={projects} generatedAt={new Date()} />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
