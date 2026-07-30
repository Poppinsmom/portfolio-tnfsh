import React, { useMemo, useRef, useState } from 'react';
import {
  BookOpen, Bot, Clipboard, Copy, Edit3, FileText, Package, Plus, Save, Sparkles,
  Star, Tag, Trash2, X
} from 'lucide-react';

const TITLE_TEMPLATES = [
  {
    id: 'basic-info',
    name: '基本資訊型',
    situations: ['課程成果', '自主學習', '專題成果'],
    format: ['【時間】', '＋', '【課程／活動】', '＋', '【主題】', '＋', '【成果類型】'],
    examples: [
      '113學年度上學期｜資訊科技｜Python 股市爬蟲程式實作｜課程成果',
      'APCS 程式營隊｜C++ STL 容器學習紀錄｜自主學習成果',
      'Arduino 專題課程｜智慧避障車開發歷程｜專題成果'
    ]
  },
  {
    id: 'growth',
    name: '能力成長型',
    situations: ['能力成長', '學習反思', '自主學習成果'],
    format: ['【學習內容】', '＋', '提升／培養／建立／強化／精進', '＋', '【能力】'],
    examples: [
      '學習 C++ STL，提升演算法解題能力',
      '製作 Arduino 專題，強化系統整合能力',
      '完成 Python 爬蟲，建立資料分析能力'
    ]
  },
  {
    id: 'project-result',
    name: '專題成果型',
    situations: ['專題成果', '作品展示', '代表作品'],
    format: ['【時間／數量】', '＋', '【專業名詞】', '＋', '【成果】'],
    examples: [
      '三個月 Arduino 智慧避障車專題研究',
      '完成 20 題 APCS 演算法實作紀錄',
      '四週完成 Python AI 影像辨識專題'
    ]
  },
  {
    id: 'problem-solving',
    name: '問題解決型',
    situations: ['Debug 紀錄', '問題解決歷程', '專案修正'],
    format: ['【問題】', '↓', '【解決方式】', '↓', '【成果】'],
    examples: [
      '解決 Python API 串接失敗的完整除錯歷程',
      '從記憶體溢位到成功執行：我的 C++ Debug 紀錄',
      '如何讓 Arduino 自走車成功避障？我的專題研究',
      '解決 Git Merge Conflict 的實戰經驗'
    ]
  },
  {
    id: 'challenge',
    name: '挑戰突破型',
    situations: ['挑戰突破', '代表作品', '學習成長'],
    format: ['面對【挑戰】', '突破【困難】', '完成【成果】'],
    examples: [
      '從零開始學習 C++，完成第一個演算法專案',
      '從無法編譯到完成作品：我的程式設計成長歷程',
      '第一次參加 APCS，我如何建立演算法思維'
    ]
  }
];

const ToolCard = ({ icon: Icon, title, description, enabled, onClick }) => (
  <button
    type="button"
    disabled={!enabled}
    onClick={onClick}
    className={`writing-tool-card ${enabled ? 'writing-tool-card-enabled' : 'writing-tool-card-disabled'}`}
  >
    <div className="writing-tool-icon"><Icon size={22} /></div>
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </button>
);

const SavedTitleCard = ({ item, onToggleFavorite, onUpdate, onDelete, onCopy }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onUpdate(item.id, trimmed);
    setIsEditing(false);
  };

  return (
    <article className="saved-title-card">
      <div className="saved-title-main">
        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          className={`saved-title-star ${item.favorite ? 'saved-title-star-active' : ''}`}
          title="收藏"
          aria-label="收藏"
        >
          <Star size={18} fill={item.favorite ? 'currentColor' : 'none'} />
        </button>
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              value={draft}
              onChange={event => setDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') save();
                if (event.key === 'Escape') setIsEditing(false);
              }}
              className="saved-title-input"
            />
          ) : (
            <h3>{item.title}</h3>
          )}
          <p>{item.templateName} · {new Date(item.createdAt).toLocaleDateString('zh-TW')}</p>
        </div>
      </div>
      <div className="saved-title-actions">
        {isEditing ? (
          <>
            <button type="button" onClick={save} title="儲存" aria-label="儲存"><Save size={17} /></button>
            <button type="button" onClick={() => setIsEditing(false)} title="取消" aria-label="取消"><X size={17} /></button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => onCopy(item.title)} title="複製" aria-label="複製"><Copy size={17} /></button>
            <button type="button" onClick={() => setIsEditing(true)} title="編輯" aria-label="編輯"><Edit3 size={17} /></button>
            <button type="button" onClick={() => onDelete(item.id)} title="刪除" aria-label="刪除"><Trash2 size={17} /></button>
          </>
        )}
      </div>
    </article>
  );
};

const TitleCenter = ({ savedTitles, onSaveTitle, onUpdateTitle, onDeleteTitle, onToggleFavorite, onCopyTitle }) => {
  const [activeTemplateId, setActiveTemplateId] = useState(TITLE_TEMPLATES[0].id);
  const formRef = useRef(null);
  const activeTemplate = TITLE_TEMPLATES.find(template => template.id === activeTemplateId) || TITLE_TEMPLATES[0];
  const [draftsByTemplate, setDraftsByTemplate] = useState(() => Object.fromEntries(
    TITLE_TEMPLATES.map(template => [template.id, ''])
  ));

  const draftTitle = draftsByTemplate[activeTemplate.id] || '';
  const sortedTitles = useMemo(
    () => [...savedTitles].sort((a, b) => Number(b.favorite) - Number(a.favorite) || new Date(b.createdAt) - new Date(a.createdAt)),
    [savedTitles]
  );

  const updateDraftTitle = (value) => {
    setDraftsByTemplate(prev => ({
      ...prev,
      [activeTemplate.id]: value
    }));
  };

  const selectTemplate = (templateId) => {
    setActiveTemplateId(templateId);
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector('textarea')?.focus({ preventScroll: true });
    });
  };

  const saveGeneratedTitle = () => {
    const title = draftTitle.trim();
    if (!title) return;
    onSaveTitle({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      templateId: activeTemplate.id,
      templateName: activeTemplate.name,
      favorite: false,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="writing-panel">
        <div className="writing-panel-header">
          <div>
            <p className="writing-eyebrow">Title Center</p>
            <h2>標題中心</h2>
          </div>
          <p>建立可收藏、可管理、可重複使用的學習歷程標題資料庫。</p>
        </div>
      </div>

      <section className="writing-panel title-editor-panel" ref={formRef} tabIndex={-1}>
        <div className="writing-panel-header">
          <div>
            <p className="writing-eyebrow">Template</p>
            <h2>填寫標題</h2>
          </div>
          <div className="title-situation-list">
            {activeTemplate.situations.map(item => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="title-template-picker" aria-label="選擇標題模板">
          {TITLE_TEMPLATES.map(template => (
            <button
              key={template.id}
              type="button"
              onClick={() => selectTemplate(template.id)}
              className={template.id === activeTemplate.id ? 'title-template-pill-active' : ''}
            >
              {template.name}
            </button>
          ))}
        </div>

        <div className="title-reference-grid">
          <div className="title-reference-block">
            <p className="title-format-label">格式</p>
            <div className="title-format-large">
              {activeTemplate.format.map((part, index) => <span key={`${part}-${index}`}>{part}</span>)}
            </div>
          </div>
          <div className="title-reference-block">
            <p className="title-example-label">範例</p>
            <div className="title-examples">
              {activeTemplate.examples.map(example => <p className="title-example" key={example}>{example}</p>)}
            </div>
          </div>
        </div>

        <div className="title-direct-write">
          <textarea
            value={draftTitle}
            onChange={event => updateDraftTitle(event.target.value)}
            placeholder={activeTemplate.examples[0]}
            rows={3}
          />
          <div className="title-direct-actions">
            <button type="button" onClick={saveGeneratedTitle} className="primary-btn" disabled={!draftTitle.trim()}>
              <Plus size={16} /> 加入我的標題
            </button>
          </div>
        </div>
      </section>

      <section className="writing-panel">
        <div className="writing-panel-header">
          <div>
            <p className="writing-eyebrow">My Titles</p>
            <h2>我的標題</h2>
          </div>
          <p>{savedTitles.length} 筆標題</p>
        </div>

        <div className="space-y-3">
          {sortedTitles.length > 0 ? (
            sortedTitles.map(item => (
              <SavedTitleCard
                key={item.id}
                item={item}
                onToggleFavorite={onToggleFavorite}
                onUpdate={onUpdateTitle}
                onDelete={onDeleteTitle}
                onCopy={onCopyTitle}
              />
            ))
          ) : (
            <div className="writing-empty-state">
              <Clipboard size={30} />
              <h3>尚未建立標題</h3>
              <p>在填寫區選擇模板、參考格式與範例後，將標題加入資料庫。</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default function WritingCenter({
  savedTitles,
  onSaveTitle,
  onUpdateTitle,
  onDeleteTitle,
  onToggleFavorite,
  onCopyTitle,
  reflectionTemplates = []
}) {
  const [section, setSection] = useState('home');

  if (section === 'titles') {
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => setSection('home')} className="secondary-btn">
          <X size={16} /> 返回寫作中心
        </button>
        <TitleCenter
          savedTitles={savedTitles}
          onSaveTitle={onSaveTitle}
          onUpdateTitle={onUpdateTitle}
          onDeleteTitle={onDeleteTitle}
          onToggleFavorite={onToggleFavorite}
          onCopyTitle={onCopyTitle}
        />
      </div>
    );
  }

  if (section === 'reflectionTemplates') {
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => setSection('home')} className="secondary-btn">
          <X size={16} /> 返回寫作中心
        </button>
        <section className="writing-panel">
          <div className="writing-panel-header">
            <div>
              <p className="writing-eyebrow">Reflection Templates</p>
              <h2>學習反思模板</h2>
            </div>
            <p>{reflectionTemplates.length} 種模板</p>
          </div>
          <div className="reflection-template-list">
            {reflectionTemplates.map(template => (
              <article key={template.id} className="reflection-template-card">
                <h3>{template.name}</h3>
                <div>{template.content}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="writing-hero">
        <div>
          <p className="writing-eyebrow">Learning Portfolio Writing Center</p>
          <h2>學習歷程寫作中心</h2>
          <p>所有協助學生撰寫學習歷程的工具都會集中在這裡。</p>
        </div>
        <Sparkles size={38} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <ToolCard
          icon={Tag}
          title="標題中心"
          description="建立、收藏、管理可重複使用的標題資料庫。"
          enabled
          onClick={() => setSection('titles')}
        />
        <ToolCard
          icon={BookOpen}
          title="學習反思模板"
          description="查看 Mission 可引用的反思寫作模板。"
          enabled
          onClick={() => setSection('reflectionTemplates')}
        />
        <ToolCard
          icon={FileText}
          title="專案報告"
          description="Coming Soon"
          enabled={false}
        />
        <ToolCard
          icon={Package}
          title="Mission 素材整理"
          description="Coming Soon"
          enabled={false}
        />
        <ToolCard
          icon={Bot}
          title="AI 寫作助手"
          description="Coming Soon"
          enabled={false}
        />
      </div>
    </div>
  );
}
