import React, { forwardRef, useMemo } from 'react';

const text = (value, fallback = '未填寫') => {
  const normalized = String(value || '').trim();
  return normalized || fallback;
};

const formatDate = (value) => {
  if (!value) return '未設定';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const markdownToText = (value) => String(value || '')
  .replace(/```[\s\S]*?```/g, block => block.replace(/```[a-zA-Z0-9_-]*\n?/g, '').replace(/```/g, ''))
  .replace(/`([^`]+)`/g, '$1')
  .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[*_~>#-]/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const DAILY_REFLECTION_LABELS = [
  ['learning', '今天學到了什麼？'],
  ['challenge', '今天最大的挑戰'],
  ['solution', '我如何解決？'],
  ['harvest', '今天最大的收穫／下一步']
];

const renderDailyReflection = (dailyReflection = {}) => DAILY_REFLECTION_LABELS
  .map(([key, label]) => dailyReflection[key] && `${label}\n${dailyReflection[key]}`)
  .filter(Boolean)
  .join('\n\n');

const dateValue = (value) => {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const buildProjectSections = (projects, missions) => {
  const unassignedMissions = missions.filter(mission => !mission.projectId);
  const sections = projects.map(project => ({
    project,
    missions: missions
      .filter(mission => mission.projectId === project.id)
      .sort((a, b) => dateValue(a.date) - dateValue(b.date))
  }));

  if (unassignedMissions.length > 0) {
    sections.push({
      project: {
        id: 'unassigned',
        name: '未指定專案',
        startDate: '',
        endDate: '',
        teacher: '',
        location: '',
        goal: '這些 Mission 尚未歸入特定歷程專案。',
        content: ''
      },
      missions: unassignedMissions.sort((a, b) => dateValue(a.date) - dateValue(b.date))
    });
  }

  return sections;
};

const StatRow = ({ label, value }) => (
  <div className="pdf-stat-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const FieldBlock = ({ title, children }) => (
  <section className="pdf-field pdf-avoid">
    <h4>{title}</h4>
    <p>{children || '未填寫'}</p>
  </section>
);

const MissionBlock = ({ mission, project }) => {
  const dailyReflectionText = renderDailyReflection(mission.dailyReflection);

  return (
    <article className="pdf-mission">
      <div className="pdf-mission-heading pdf-avoid">
        <h3>{mission.title || '未命名 Mission'}</h3>
        {mission.isMasterpiece && <span className="pdf-star">★ 代表作品</span>}
      </div>

      <div className="pdf-meta-grid pdf-avoid">
        <StatRow label="日期" value={formatDate(mission.date)} />
        <StatRow label="學習時數" value={`${mission.hours || 0} 小時`} />
        <StatRow label="老師" value={text(mission.teacher || project.teacher)} />
        <StatRow label="地點" value={text(mission.location || project.location)} />
      </div>

      <div className="pdf-tags pdf-avoid">
        <strong>能力標籤</strong>
        <span>{mission.tags?.length ? mission.tags.join('、') : '未設定'}</span>
      </div>

      <FieldBlock title="本次目標">{mission.objective}</FieldBlock>
      <FieldBlock title="學習內容">{markdownToText(mission.content)}</FieldBlock>

      {mission.images?.length > 0 && (
        <section className="pdf-section">
          <h4>圖片</h4>
          <div className="pdf-image-grid">
            {mission.images.map((image, index) => (
              <figure key={image.id || index} className="pdf-image-card pdf-avoid">
                <img src={image.dataUrl} alt={`Mission 圖片 ${index + 1}`} />
                <figcaption>{image.note || '無備註'}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {mission.codes?.length > 0 && (
        <section className="pdf-section">
          <h4>程式碼</h4>
          {mission.codes.map((code, index) => (
            <div key={code.id || index} className="pdf-code-block">
              <div className="pdf-code-meta pdf-avoid">
                <strong>{code.filename || '未命名檔案'}</strong>
                <span>{(code.language || 'text').toUpperCase()}</span>
              </div>
              <pre>{code.code || '未填寫程式碼'}</pre>
              <p>{code.description || '未填寫程式說明'}</p>
            </div>
          ))}
        </section>
      )}

      {mission.bugs?.length > 0 && (
        <section className="pdf-section">
          <h4>Bug 紀錄</h4>
          {mission.bugs.map((bug, index) => (
            <div key={bug.id || index} className="pdf-record pdf-avoid">
              <h5>{bug.name || '未命名 Bug'}</h5>
              <p><strong>問題：</strong>{text(bug.problem)}</p>
              <p><strong>原因：</strong>{text(bug.cause)}</p>
              <p><strong>解法：</strong>{text(bug.solution)}</p>
              <p><strong>學到什麼：</strong>{text(bug.lesson)}</p>
            </div>
          ))}
        </section>
      )}

      {mission.githubs?.length > 0 && (
        <section className="pdf-section">
          <h4>GitHub</h4>
          {mission.githubs.map((github, index) => (
            <div key={github.id || index} className="pdf-record pdf-avoid">
              <p><strong>Repository：</strong>{text(github.repo)}</p>
              <p><strong>Branch：</strong>{text(github.branch)}</p>
              <p><strong>Commit：</strong>{text(github.commit)}</p>
              <p><strong>URL：</strong>{text(github.url)}</p>
            </div>
          ))}
        </section>
      )}

      {dailyReflectionText && <FieldBlock title="每日四宮格">{dailyReflectionText}</FieldBlock>}

      {mission.isMasterpiece && (
        <section className="pdf-masterpiece pdf-avoid">
          <h4>★ 代表作品</h4>
          <p><strong>作品名稱：</strong>{text(mission.masterpieceDetail?.name || mission.title)}</p>
          <p><strong>作品特色：</strong>{text(mission.masterpieceDetail?.features)}</p>
        </section>
      )}
    </article>
  );
};

const LearningPortfolioPDF = forwardRef(function LearningPortfolioPDF({ missions = [], projects = [], generatedAt = new Date() }, ref) {
  const report = useMemo(() => {
    const sections = buildProjectSections(projects, missions);
    const projectNameById = Object.fromEntries(projects.map(project => [project.id, project.name || '未命名專案']));
    const masterpieces = missions.filter(mission => mission.isMasterpiece);
    const tagCounts = {};
    missions.forEach(mission => mission.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }));

    return {
      sections,
      masterpieces,
      tagCounts: Object.entries(tagCounts).sort((a, b) => b[1] - a[1]),
      projectNameById,
      stats: {
        missions: missions.length,
        projects: projects.length,
        images: missions.reduce((sum, mission) => sum + (mission.images?.length || 0), 0),
        codes: missions.reduce((sum, mission) => sum + (mission.codes?.length || 0), 0),
        bugs: missions.reduce((sum, mission) => sum + (mission.bugs?.length || 0), 0),
        githubs: missions.reduce((sum, mission) => sum + (mission.githubs?.length || 0), 0),
        masterpieces: masterpieces.length,
        hours: missions.reduce((sum, mission) => sum + (Number(mission.hours) || 0), 0)
      }
    };
  }, [missions, projects]);

  return (
    <div ref={ref} className="learning-portfolio-pdf">
      <style>{`
        .learning-portfolio-pdf {
          width: 178mm;
          color: #182033;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", Arial, sans-serif;
          font-size: 12px;
          line-height: 1.72;
        }
        .learning-portfolio-pdf * { box-sizing: border-box; }
        .pdf-page {
          min-height: 265mm;
          padding: 0;
          background: #ffffff;
          page-break-after: always;
        }
        .pdf-page:last-child { page-break-after: auto; }
        .pdf-cover {
          display: flex;
          min-height: 265mm;
          flex-direction: column;
          justify-content: center;
          border: 1px solid #d9e2ef;
          padding: 22mm 18mm;
          background: linear-gradient(180deg, #f7fbff, #ffffff 54%, #eef7f4);
        }
        .pdf-cover h1 {
          margin: 0 0 10px;
          color: #111827;
          font-size: 34px;
          line-height: 1.25;
          letter-spacing: 0;
        }
        .pdf-cover h2 {
          margin: 0 0 12px;
          color: #1d4ed8;
          font-size: 24px;
        }
        .pdf-cover .pdf-brand {
          margin: 0 0 34px;
          color: #475569;
          font-size: 18px;
          font-weight: 700;
        }
        .pdf-cover-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          max-width: 112mm;
        }
        .pdf-cover-stat {
          border: 1px solid #dbe7f7;
          border-radius: 8px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.82);
        }
        .pdf-cover-stat span {
          display: block;
          color: #64748b;
          font-size: 11px;
        }
        .pdf-cover-stat strong {
          display: block;
          color: #0f172a;
          font-size: 18px;
        }
        .pdf-content-page {
          padding: 3mm 0 8mm;
        }
        .pdf-title-row {
          margin: 0 0 8mm;
          border-bottom: 2px solid #1d4ed8;
          padding-bottom: 3mm;
        }
        .pdf-title-row h2 {
          margin: 0;
          color: #0f172a;
          font-size: 22px;
        }
        .pdf-toc-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .pdf-toc-list li {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #e2e8f0;
          padding: 9px 0;
          color: #1f2937;
          font-size: 15px;
          font-weight: 700;
        }
        .pdf-project {
          padding-top: 4mm;
          page-break-before: always;
        }
        .pdf-project:first-of-type {
          page-break-before: auto;
        }
        .pdf-project-header {
          margin-bottom: 5mm;
          border-left: 5px solid #2563eb;
          padding: 4mm 5mm;
          background: #f8fbff;
        }
        .pdf-project-header h2 {
          margin: 0 0 4px;
          color: #0f172a;
          font-size: 22px;
        }
        .pdf-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 7px;
          margin: 0 0 5mm;
        }
        .pdf-stat-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 6px 8px;
          background: #ffffff;
        }
        .pdf-stat-row span { color: #64748b; }
        .pdf-stat-row strong { color: #0f172a; text-align: right; }
        .pdf-field {
          margin: 0 0 4mm;
          border: 1px solid #e5edf7;
          border-radius: 8px;
          padding: 3mm 4mm;
          background: #ffffff;
        }
        .pdf-field h4,
        .pdf-section h4 {
          margin: 0 0 2mm;
          color: #1d4ed8;
          font-size: 14px;
        }
        .pdf-field p,
        .pdf-section p {
          margin: 0;
          white-space: pre-wrap;
        }
        .pdf-mission {
          margin: 0 0 7mm;
          border-top: 1px solid #cbd5e1;
          padding-top: 5mm;
        }
        .pdf-mission-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 3mm;
        }
        .pdf-mission-heading h3 {
          margin: 0;
          color: #111827;
          font-size: 18px;
        }
        .pdf-star {
          border-radius: 999px;
          padding: 4px 9px;
          background: #fff7ed;
          color: #b45309;
          font-weight: 800;
        }
        .pdf-tags {
          display: flex;
          gap: 8px;
          margin: 0 0 4mm;
          border-radius: 8px;
          padding: 8px 10px;
          background: #f8fafc;
        }
        .pdf-tags strong { color: #334155; }
        .pdf-section {
          margin: 0 0 4mm;
        }
        .pdf-image-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 4mm;
        }
        .pdf-image-card {
          margin: 0;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 3mm;
          background: #ffffff;
        }
        .pdf-image-card img {
          display: block;
          width: 100%;
          max-height: 76mm;
          object-fit: contain;
          border-radius: 5px;
          background: #f8fafc;
        }
        .pdf-image-card figcaption {
          margin-top: 2mm;
          color: #475569;
          font-size: 11px;
          white-space: pre-wrap;
        }
        .pdf-code-block {
          margin: 0 0 4mm;
          border: 1px solid #d7e0ed;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
        }
        .pdf-code-meta {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 7px 10px;
          background: #eef4fb;
          color: #1e293b;
        }
        .pdf-code-block pre {
          margin: 0;
          padding: 10px;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          word-break: break-word;
          background: #111827;
          color: #f8fafc;
          font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 10px;
          line-height: 1.55;
        }
        .pdf-code-block p {
          margin: 0;
          padding: 8px 10px;
          white-space: pre-wrap;
        }
        .pdf-record {
          margin: 0 0 3mm;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 3mm;
          background: #ffffff;
        }
        .pdf-record h5 {
          margin: 0 0 2mm;
          color: #0f172a;
          font-size: 13px;
        }
        .pdf-record p { margin: 0 0 1mm; }
        .pdf-masterpiece {
          margin: 0 0 4mm;
          border: 2px solid #f59e0b;
          border-radius: 8px;
          padding: 3mm 4mm;
          background: #fffbeb;
        }
        .pdf-masterpiece h4 {
          margin: 0 0 2mm;
          color: #b45309;
          font-size: 15px;
        }
        .pdf-masterpiece p { margin: 0 0 1mm; white-space: pre-wrap; }
        .pdf-summary-table {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 7mm;
        }
        .pdf-tag-row {
          display: grid;
          grid-template-columns: 1fr 36px;
          gap: 10px;
          border-bottom: 1px solid #e2e8f0;
          padding: 6px 0;
        }
        .pdf-empty {
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          padding: 8mm;
          color: #64748b;
          text-align: center;
        }
        .pdf-avoid,
        .pdf-image-card,
        .pdf-record,
        .pdf-masterpiece {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      `}</style>

      <section className="pdf-page pdf-cover">
        <h1>高中自主學習歷程</h1>
        <h2>學生學習成果</h2>
        <p className="pdf-brand">Poppins Learning Portfolio</p>
        <div className="pdf-cover-stats">
          <div className="pdf-cover-stat"><span>產生日期</span><strong>{formatDate(generatedAt)}</strong></div>
          <div className="pdf-cover-stat"><span>Mission 數</span><strong>{report.stats.missions}</strong></div>
          <div className="pdf-cover-stat"><span>專案數</span><strong>{report.stats.projects}</strong></div>
          <div className="pdf-cover-stat"><span>代表作品數</span><strong>{report.stats.masterpieces}</strong></div>
        </div>
      </section>

      <section className="pdf-page pdf-content-page">
        <div className="pdf-title-row"><h2>目錄</h2></div>
        {report.sections.length > 0 ? (
          <ol className="pdf-toc-list">
            {report.sections.map((section, index) => (
              <li key={section.project.id || index}>
                <span>{index + 1}</span>
                <span>{section.project.name || '未命名專案'}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="pdf-empty">尚無專案資料。</div>
        )}
      </section>

      <section className="pdf-content-page">
        {report.sections.map((section, index) => (
          <article key={section.project.id || index} className="pdf-project">
            <header className="pdf-project-header pdf-avoid">
              <h2>{section.project.name || '未命名專案'}</h2>
              <div className="pdf-meta-grid">
                <StatRow label="專案期間" value={`${formatDate(section.project.startDate)} - ${formatDate(section.project.endDate)}`} />
                <StatRow label="老師" value={text(section.project.teacher)} />
                <StatRow label="地點" value={text(section.project.location)} />
                <StatRow label="Mission 數" value={section.missions.length} />
              </div>
              <FieldBlock title="專案目標">{section.project.goal}</FieldBlock>
              <FieldBlock title="專案介紹">{section.project.content}</FieldBlock>
            </header>

            {section.missions.length > 0 ? (
              section.missions.map(mission => (
                <MissionBlock key={mission.id} mission={mission} project={section.project} />
              ))
            ) : (
              <div className="pdf-empty pdf-avoid">此專案尚無 Mission。</div>
            )}
          </article>
        ))}
      </section>

      <section className="pdf-page pdf-content-page">
        <div className="pdf-title-row"><h2>代表作品總整理</h2></div>
        {report.masterpieces.length > 0 ? (
          report.masterpieces.map(mission => (
            <div key={mission.id} className="pdf-masterpiece pdf-avoid">
              <h4>★ {text(mission.masterpieceDetail?.name || mission.title)}</h4>
              <p><strong>所屬專案：</strong>{report.projectNameById[mission.projectId] || '未指定專案'}</p>
              <p><strong>Mission 名稱：</strong>{mission.title || '未命名 Mission'}</p>
              <p><strong>作品特色：</strong>{text(mission.masterpieceDetail?.features)}</p>
            </div>
          ))
        ) : (
          <div className="pdf-empty">尚未標記代表作品。</div>
        )}
      </section>

      <section className="pdf-page pdf-content-page">
        <div className="pdf-title-row"><h2>能力統計</h2></div>
        <div className="pdf-summary-table">
          <StatRow label="Mission 數" value={report.stats.missions} />
          <StatRow label="專案數" value={report.stats.projects} />
          <StatRow label="圖片數" value={report.stats.images} />
          <StatRow label="程式碼數" value={report.stats.codes} />
          <StatRow label="Bug 數" value={report.stats.bugs} />
          <StatRow label="GitHub 數" value={report.stats.githubs} />
          <StatRow label="代表作品數" value={report.stats.masterpieces} />
          <StatRow label="總學習時數" value={report.stats.hours} />
        </div>
        <h3>能力標籤使用次數</h3>
        {report.tagCounts.length > 0 ? (
          report.tagCounts.map(([tag, count]) => (
            <div key={tag} className="pdf-tag-row">
              <span>{tag}</span>
              <strong>{count}</strong>
            </div>
          ))
        ) : (
          <div className="pdf-empty">尚無能力標籤紀錄。</div>
        )}
      </section>
    </div>
  );
});

export default LearningPortfolioPDF;
