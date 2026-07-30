const svgToDataUrl = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const paperNoise = (id, opacity = 0.06) => `
  <filter id="${id}-paper">
    <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="11"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="table" tableValues="0 ${opacity}"/></feComponentTransfer>
  </filter>`;

const bg = (id, name, svg) => ({ id, name, dataUrl: svgToDataUrl(svg) });

export const PPT_BACKGROUNDS = [
  bg('minimal-cream', '極簡米白留白', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>${paperNoise('minimal-cream')}</defs>
      <rect width="1600" height="900" fill="#fff8ec"/>
      <rect width="1600" height="900" filter="url(#minimal-cream-paper)"/>
      <circle cx="1390" cy="124" r="90" fill="#ff6b5b" opacity=".18"/>
      <circle cx="1480" cy="90" r="32" fill="#173763" opacity=".85"/>
      <path d="M104 736c190 58 340 40 450-54" fill="none" stroke="#58b5e6" stroke-width="8" stroke-linecap="round" opacity=".55"/>
      <path d="M96 778c186 44 320 26 438-58" fill="none" stroke="#ff6b5b" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <g fill="#173763" opacity=".22"><circle cx="132" cy="122" r="7"/><circle cx="168" cy="122" r="7"/><circle cx="204" cy="122" r="7"/><circle cx="132" cy="158" r="7"/><circle cx="168" cy="158" r="7"/><circle cx="204" cy="158" r="7"/></g>
    </svg>`),

  bg('notebook-paper', '橫線筆記紙', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        ${paperNoise('notebook-paper', 0.05)}
        <pattern id="notebook-lines" width="1600" height="54" patternUnits="userSpaceOnUse"><path d="M0 53H1600" stroke="#7ab8da" stroke-width="2" opacity=".22"/></pattern>
      </defs>
      <rect width="1600" height="900" fill="#fffaf2"/>
      <rect width="1600" height="900" filter="url(#notebook-paper-paper)"/>
      <rect width="1600" height="900" fill="url(#notebook-lines)"/>
      <path d="M154 0v900" stroke="#ff6b5b" stroke-width="4" opacity=".34"/>
      <g transform="translate(1170 620) rotate(-8)">
        <rect width="260" height="155" rx="18" fill="#ffffff" stroke="#173763" stroke-width="4" opacity=".88"/>
        <path d="M34 48h190M34 84h164M34 120h212" stroke="#173763" stroke-width="6" stroke-linecap="round" opacity=".2"/>
        <circle cx="222" cy="44" r="16" fill="#ff6b5b"/>
      </g>
      <g transform="translate(78 650) rotate(-16)">
        <rect width="250" height="38" rx="12" fill="#ff6b5b"/>
        <path d="M250 19l62-19-20 38z" fill="#f7d7a5"/>
        <path d="M304 19l24-8-8 16z" fill="#173763"/>
      </g>
    </svg>`),

  bg('dark-code', '深色程式碼', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <rect width="1600" height="900" fill="#101b31"/>
      <path d="M0 0h1600v190H0z" fill="#173763"/>
      <circle cx="92" cy="88" r="14" fill="#ff6b5b"/><circle cx="136" cy="88" r="14" fill="#ffd86b"/><circle cx="180" cy="88" r="14" fill="#74c7b8"/>
      <g fill="none" stroke="#58b5e6" stroke-linecap="round" opacity=".42">
        <path d="M160 314l-92 92 92 92" stroke-width="18"/>
        <path d="M1440 314l92 92-92 92" stroke-width="18"/>
        <path d="M905 262L690 648" stroke-width="12"/>
      </g>
      <g font-family="Courier New, monospace" font-size="28" fill="#d8ecff" opacity=".18">
        <text x="220" y="318">const learning = portfolio.map(growth);</text>
        <text x="260" y="386">for (mission of project) record(mission);</text>
        <text x="220" y="454">debug(); reflect(); improve();</text>
      </g>
      <rect x="80" y="690" width="1440" height="2" fill="#58b5e6" opacity=".32"/>
      <circle cx="1330" cy="690" r="70" fill="#ff6b5b" opacity=".16"/>
    </svg>`),

  bg('timeline-road', '計畫時間軸', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>${paperNoise('timeline-road')}</defs>
      <rect width="1600" height="900" fill="#f7fbff"/>
      <rect width="1600" height="900" filter="url(#timeline-road-paper)"/>
      <path d="M180 730C410 450 590 610 764 370S1160 150 1430 304" fill="none" stroke="#173763" stroke-width="18" stroke-linecap="round" opacity=".85"/>
      <path d="M180 730C410 450 590 610 764 370S1160 150 1430 304" fill="none" stroke="#58b5e6" stroke-width="5" stroke-linecap="round"/>
      <g fill="#ff6b5b" stroke="#fff8ec" stroke-width="8">
        <circle cx="300" cy="606" r="32"/><circle cx="650" cy="492" r="32"/><circle cx="950" cy="252" r="32"/><circle cx="1288" cy="240" r="32"/>
      </g>
      <g fill="#173763" opacity=".1"><rect x="70" y="90" width="340" height="220" rx="34"/><rect x="1160" y="570" width="320" height="160" rx="34"/></g>
    </svg>`),

  bg('result-wall', '成果卡片牆', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <rect width="1600" height="900" fill="#fff8ec"/>
      <g transform="translate(885 90)">
        <rect width="230" height="150" rx="24" fill="#ff6b5b"/><rect x="270" y="42" width="230" height="150" rx="24" fill="#58b5e6"/><rect x="100" y="230" width="230" height="150" rx="24" fill="#ffd86b"/><rect x="390" y="285" width="230" height="150" rx="24" fill="#74c7b8"/>
        <g fill="#fff8ec" opacity=".76"><rect x="38" y="96" width="150" height="13" rx="6"/><rect x="308" y="138" width="150" height="13" rx="6"/><rect x="138" y="326" width="150" height="13" rx="6"/><rect x="428" y="382" width="150" height="13" rx="6"/></g>
      </g>
      <path d="M0 0h690c-54 130-154 222-300 278C238 336 108 424 0 544z" fill="#173763" opacity=".96"/>
      <circle cx="560" cy="200" r="46" fill="#ff6b5b"/><path d="M530 202h60M560 172v60" stroke="#fff8ec" stroke-width="12" stroke-linecap="round"/>
      <path d="M74 768h560" stroke="#ff6b5b" stroke-width="7" stroke-linecap="round"/>
    </svg>`),

  bg('blueprint-grid', '藍圖格線', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        <pattern id="blueprint-small" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0v32" fill="none" stroke="#ffffff" stroke-width="1" opacity=".16"/></pattern>
        <pattern id="blueprint-big" width="160" height="160" patternUnits="userSpaceOnUse"><path d="M160 0H0v160" fill="none" stroke="#ffffff" stroke-width="2" opacity=".24"/></pattern>
      </defs>
      <rect width="1600" height="900" fill="#173763"/>
      <rect width="1600" height="900" fill="url(#blueprint-small)"/><rect width="1600" height="900" fill="url(#blueprint-big)"/>
      <g fill="none" stroke="#58b5e6" stroke-width="8" opacity=".7"><rect x="1030" y="160" width="310" height="210" rx="28"/><path d="M1088 432h410M1088 496h290M1088 560h360"/></g>
      <path d="M0 720C160 620 294 610 404 690s240 92 390-6v216H0z" fill="#ff6b5b" opacity=".9"/>
      <circle cx="1338" cy="685" r="90" fill="#fff8ec" opacity=".12"/>
    </svg>`),

  bg('research-poster', '研究海報', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>${paperNoise('research-poster')}</defs>
      <rect width="1600" height="900" fill="#fbfbf7"/><rect width="1600" height="900" filter="url(#research-poster-paper)"/>
      <rect x="78" y="92" width="360" height="640" rx="28" fill="#fff8ec" stroke="#e8d8c0" stroke-width="4"/>
      <rect x="1162" y="118" width="310" height="220" rx="28" fill="#e9f6fb" stroke="#58b5e6" stroke-width="4"/>
      <rect x="1162" y="386" width="310" height="260" rx="28" fill="#fff0e8" stroke="#ff6b5b" stroke-width="4"/>
      <g stroke="#173763" stroke-width="7" stroke-linecap="round" opacity=".22"><path d="M140 190h230M140 246h190M140 302h240M140 458h210M140 514h180M140 570h238"/></g>
      <g fill="none" stroke="#173763" stroke-width="8" opacity=".72"><circle cx="1320" cy="228" r="64"/><path d="M1366 274l92 92"/></g>
      <path d="M612 210c180-80 330-44 450 108" fill="none" stroke="#58b5e6" stroke-width="10" stroke-linecap="round"/>
      <path d="M640 370c150 70 300 54 450-48" fill="none" stroke="#ff6b5b" stroke-width="7" stroke-linecap="round"/>
    </svg>`),

  bg('photo-board', '照片成果牆', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <rect width="1600" height="900" fill="#fff8ec"/>
      <g opacity=".95">
        <rect x="70" y="86" width="310" height="220" rx="10" fill="#ffffff" stroke="#e8d8c0" stroke-width="5" transform="rotate(-5 225 196)"/>
        <rect x="1218" y="120" width="300" height="210" rx="10" fill="#ffffff" stroke="#e8d8c0" stroke-width="5" transform="rotate(4 1368 225)"/>
        <rect x="1050" y="610" width="330" height="220" rx="10" fill="#ffffff" stroke="#e8d8c0" stroke-width="5" transform="rotate(-3 1215 720)"/>
      </g>
      <g fill="#58b5e6" opacity=".5"><rect x="106" y="120" width="238" height="128" rx="18" transform="rotate(-5 225 184)"/><rect x="1254" y="154" width="228" height="118" rx="18" transform="rotate(4 1368 213)"/><rect x="1092" y="648" width="250" height="118" rx="18" transform="rotate(-3 1217 707)"/></g>
      <path d="M546 122h460v7H546zM520 780h430v7H520z" fill="#ff6b5b"/>
      <g fill="#173763" opacity=".16"><circle cx="764" cy="430" r="150"/><circle cx="848" cy="430" r="150"/></g>
      <circle cx="806" cy="430" r="52" fill="#ff6b5b" opacity=".72"/>
    </svg>`),

  bg('soft-gradient', '柔和漸層光暈', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        <radialGradient id="g1" cx="25%" cy="20%"><stop offset="0" stop-color="#ffd86b" stop-opacity=".55"/><stop offset="1" stop-color="#ffd86b" stop-opacity="0"/></radialGradient>
        <radialGradient id="g2" cx="78%" cy="35%"><stop offset="0" stop-color="#58b5e6" stop-opacity=".42"/><stop offset="1" stop-color="#58b5e6" stop-opacity="0"/></radialGradient>
        <radialGradient id="g3" cx="58%" cy="82%"><stop offset="0" stop-color="#ff6b5b" stop-opacity=".26"/><stop offset="1" stop-color="#ff6b5b" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1600" height="900" fill="#fff8ec"/><rect width="1600" height="900" fill="url(#g1)"/><rect width="1600" height="900" fill="url(#g2)"/><rect width="1600" height="900" fill="url(#g3)"/>
      <g fill="none" stroke="#173763" stroke-width="3" opacity=".16"><circle cx="122" cy="130" r="72"/><circle cx="1490" cy="760" r="96"/><path d="M1270 120c90 60 170 64 240 12"/></g>
      <g fill="#173763" opacity=".2"><circle cx="1210" cy="160" r="7"/><circle cx="1246" cy="160" r="7"/><circle cx="1282" cy="160" r="7"/><circle cx="1210" cy="196" r="7"/><circle cx="1246" cy="196" r="7"/><circle cx="1282" cy="196" r="7"/></g>
    </svg>`),

  bg('achievement-stage', '代表作品舞台', `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <rect width="1600" height="900" fill="#fffaf2"/>
      <path d="M0 670h1600v230H0z" fill="#173763"/>
      <path d="M330 670c80-160 220-240 420-240s340 80 420 240z" fill="#58b5e6" opacity=".34"/>
      <path d="M800 120l42 128h134l-108 78 42 128-110-78-110 78 42-128-108-78h134z" fill="#ffd86b" stroke="#173763" stroke-width="8"/>
      <g fill="#ff6b5b" opacity=".8"><circle cx="220" cy="170" r="24"/><circle cx="1380" cy="190" r="18"/><circle cx="1280" cy="610" r="28"/></g>
      <g stroke="#fff8ec" stroke-width="6" stroke-linecap="round" opacity=".55"><path d="M120 746h430M1050 746h430M250 812h260M1100 812h260"/></g>
    </svg>`)
];
