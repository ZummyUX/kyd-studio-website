// KYD Studio — Figma Design Generator
// Generates the full KYD Studio landing page design

(async function main() {

  // ── Color helpers ──────────────────────────────────────────────────────────
  function hex(h) {
    return {
      r: parseInt(h.slice(1,3),16)/255,
      g: parseInt(h.slice(3,5),16)/255,
      b: parseInt(h.slice(5,7),16)/255,
    };
  }
  const C = {
    white:       hex('#ffffff'),
    card:        hex('#faf6ec'),
    cardLight:   hex('#faf8f3'),
    ink:         hex('#2a2620'),
    ink2:        hex('#5b554b'),
    ink3:        hex('#8a8377'),
    accent:      hex('#a78256'),
    accentSoft:  hex('#d8c5a3'),
    line:        hex('#d9cfb9'),
    line2:       hex('#e5dcc6'),
    warmGrad:    hex('#f4eee0'),
  };

  function solid(color, opacity=1) {
    return [{ type: 'SOLID', color, opacity }];
  }
  function noFill() { return []; }
  function stroke(color, weight=1) {
    return { strokes: [{ type:'SOLID', color }], strokeWeight: weight, strokeAlign: 'INSIDE' };
  }

  // ── Font loading ───────────────────────────────────────────────────────────
  const fontsNeeded = [
    { family: 'Frank Ruhl Libre', style: 'Regular' },
    { family: 'Frank Ruhl Libre', style: 'Medium' },
    { family: 'Frank Ruhl Libre', style: 'Bold' },
    { family: 'Assistant',        style: 'Regular' },
    { family: 'Assistant',        style: 'SemiBold' },
    { family: 'Assistant',        style: 'Bold' },
  ];
  for (const f of fontsNeeded) {
    try { await figma.loadFontAsync(f); }
    catch { await figma.loadFontAsync({ family: 'Noto Serif Hebrew', style: 'Regular' }).catch(()=>{}); }
  }

  // ── Layout constants ───────────────────────────────────────────────────────
  const TW   = 1440;   // total width
  const CW   = 1180;   // content width
  const PAD  = (TW - CW) / 2;  // 130px side padding

  // ── Low-level builders ────────────────────────────────────────────────────
  function makeFrame(name, w, h) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.clipsContent = false;
    return f;
  }

  function makeRect(name, x, y, w, h, fillColor, opts={}) {
    const r = figma.createRectangle();
    r.name = name;
    r.x = x; r.y = y;
    r.resize(w, h);
    r.fills = fillColor ? solid(fillColor) : noFill();
    if (opts.radius)  r.cornerRadius = opts.radius;
    if (opts.stroke)  { r.strokes = solid(opts.stroke); r.strokeWeight = opts.strokeW||1; r.strokeAlign='INSIDE'; }
    return r;
  }

  function makeText(content, family, style, size, color, opts={}) {
    const t = figma.createText();
    t.fontName = { family, style };
    t.fontSize = size;
    t.characters = content;
    t.fills = solid(color);
    if (opts.align)         t.textAlignHorizontal = opts.align;
    if (opts.lineH)         t.lineHeight = { value: opts.lineH, unit: 'PIXELS' };
    if (opts.letterSpacing) t.letterSpacing = { value: opts.letterSpacing, unit: 'PERCENT' };
    if (opts.w) { t.textAutoResize = 'HEIGHT'; t.resize(opts.w, t.height); }
    return t;
  }

  function place(node, x, y) {
    node.x = x; node.y = y;
    return node;
  }

  function add(parent, ...children) {
    for (const c of children) parent.appendChild(c);
  }

  function makePanelCard(parent, y, h) {
    const card = makeRect('Panel Card', PAD, y, CW, h, C.white, { radius:10, stroke:C.line2 });
    parent.appendChild(card);
    return card;
  }

  function makeSectionTitle(parent, text, y) {
    const t = makeText(text, 'Frank Ruhl Libre', 'Medium', 36, C.ink, {
      align: 'CENTER', w: CW
    });
    place(t, PAD, y);
    parent.appendChild(t);
    return t;
  }

  function makeAccentBtn(parent, label, x, y, w=220) {
    const bg = makeRect('Button BG', x, y, w, 46, C.accent, { radius:4 });
    const txt = makeText(label, 'Assistant', 'SemiBold', 14, C.white, { align:'CENTER', w });
    place(txt, x, y + 15);
    add(parent, bg, txt);
    return { bg, txt };
  }

  function makeGhostBtn(parent, label, x, y, w=190) {
    const bg = makeRect('Ghost Button', x, y, w, 46, C.white, { radius:4, stroke:C.line });
    const txt = makeText(label, 'Assistant', 'Regular', 14, C.ink, { align:'CENTER', w });
    place(txt, x, y + 15);
    add(parent, bg, txt);
  }

  // ── Page setup ────────────────────────────────────────────────────────────
  const page = figma.currentPage;
  page.name = 'KYD Studio';

  // Clear existing content
  for (const node of [...page.children]) node.remove();

  // ── Master frame ──────────────────────────────────────────────────────────
  const master = makeFrame('KYD Studio — Landing Page', TW, 4100);
  master.fills = solid(C.white);
  page.appendChild(master);

  let Y = 0; // running y-position tracker

  // ══════════════════════════════════════════════════════════════════════════
  // NAV
  // ══════════════════════════════════════════════════════════════════════════
  {
    const nav = makeFrame('Nav', TW, 80);
    nav.fills = solid(C.white);
    Object.assign(nav, stroke(C.line2));
    nav.strokeAlign = 'OUTSIDE';

    // Logo
    const logo = makeText('KYD', 'Frank Ruhl Libre', 'Bold', 26, C.ink, { letterSpacing: 14 });
    place(logo, TW - PAD - logo.width, 20);
    const studioLabel = makeText('STUDIO', 'Assistant', 'Regular', 10, C.ink2, { letterSpacing: 38 });
    place(studioLabel, TW - PAD - studioLabel.width, 50);

    // Menu items
    const items = ['בית','איך זה עובד','מה מקבלים','דוגמאות','אודות'];
    let mx = TW - PAD - 260;
    for (const item of items) {
      const t = makeText(item, 'Assistant', 'Regular', 14, C.ink2);
      mx -= (t.width + 28);
      place(t, mx, 31);
      nav.appendChild(t);
    }

    // CTA
    makeAccentBtn(nav, '← בדיקת התאמה', PAD, 20, 200);

    add(nav, logo, studioLabel);
    master.appendChild(nav);
    Y += 80;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HERO
  // ══════════════════════════════════════════════════════════════════════════
  {
    const hero = makeFrame('Hero', TW, 580);
    hero.fills = solid(C.white);
    hero.y = Y;

    // Headline
    const h1 = makeText('מרעיון לא ברור\nלקונספט שאפשר להציג.', 'Frank Ruhl Libre', 'Medium', 60, C.ink, {
      align: 'RIGHT', lineH: 70, w: 530
    });
    place(h1, TW - PAD - 530, 64);

    // Lead paragraph
    const lead = makeText(
      'אנחנו עוזרים ליזמים, ממציאים ושותפים מקצועיים להפוך\nרעיון גולמי למצגת Concept MVP ברורה:\nאפיון, מחקר, הדמיות וסיפור מוצר.',
      'Assistant', 'Regular', 17, C.ink2,
      { align: 'RIGHT', lineH: 29, w: 500 }
    );
    place(lead, TW - PAD - 500, 290);

    // CTA buttons
    makeAccentBtn(hero, '← בדיקת התאמה ראשונית', TW - PAD - 460, 420, 220);
    makeGhostBtn(hero,  'לראות מה מקבלים ›',     TW - PAD - 660, 420, 190);

    // Security note
    const note = makeText('המידע שלך נשמר בצורה מאובטחת ודיסקרטית.', 'Assistant', 'Regular', 13, C.ink3);
    place(note, TW - PAD - 340, 484);

    // ── Hero Visual (right-to-left = left side visually) ──
    const visual = makeRect('Hero Visual', PAD, 40, 560, 500, C.warmGrad, { radius:14 });

    // MVP title on visual
    const mvpTitle = makeText('CONCEPT MVP', 'Frank Ruhl Libre', 'Medium', 20, C.ink, {
      align: 'CENTER', letterSpacing: 18, w: 560
    });
    place(mvpTitle, PAD, 80);

    const mvpSub = makeText('Smart. Simple. Solves.', 'Assistant', 'Regular', 11, C.ink3, {
      align: 'CENTER', letterSpacing: 24, w: 560
    });
    place(mvpSub, PAD, 108);

    // Mini cards grid (direction: ltr inside RTL page)
    const cardLabels = [
      ['01', 'PROBLEM'], ['02', 'PRODUCT'], ['03', 'USER'],
      ['04', 'SCENARIO'], ['05', 'PITCH'],
    ];
    const COLS = 3;
    const cardW = 162, cardH = 130, cardGap = 12;
    const gridLeft = PAD + 30;
    const gridTop  = 142;

    for (let i = 0; i < 5; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx = gridLeft + col * (cardW + cardGap);
      const cy = gridTop  + row * (cardH + cardGap);

      const card = makeRect(`Mini Card ${i+1}`, cx, cy, cardW, cardH, C.white, { radius:10 });
      card.effects = [{
        type: 'DROP_SHADOW', color: {...C.ink, a:0.08},
        offset: { x:0, y:2 }, radius:8, spread:0, visible:true, blendMode:'NORMAL'
      }];

      const lbl = makeText(`${cardLabels[i][0]} ${cardLabels[i][1]}`, 'Assistant', 'Bold', 9, C.ink3, { letterSpacing: 22 });
      place(lbl, cx + 12, cy + 12);

      add(hero, card, lbl);
    }

    add(hero, visual, h1, lead, note, mvpTitle, mvpSub);
    master.appendChild(hero);
    Y += 580;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // AUDIENCE STRIP
  // ══════════════════════════════════════════════════════════════════════════
  {
    const strip = makeFrame('Audience Strip', TW, 168);
    strip.fills = solid(C.white);
    strip.y = Y;
    strip.strokes = solid(C.line2);
    strip.strokeWeight = 1;
    strip.strokeAlign = 'OUTSIDE';

    const stripTitle = makeText(
      'השלב החכם לפני פטנט, אבטיפוס, פיתוח או פגישה עם משקיע.',
      'Assistant', 'Regular', 17, C.ink2, { align: 'CENTER', w: CW }
    );
    place(stripTitle, PAD, 26);
    strip.appendChild(stripTitle);

    const audiences = ['יזמים פרטיים','ממציאים','סטארטאפים מוקדמים','חברות מוצר','משרדי פטנטים'];
    const colW = CW / 5;
    for (let i = 0; i < 5; i++) {
      const cx = PAD + i * colW + (colW - 38) / 2;

      const circ = figma.createEllipse();
      circ.name = `Icon ${i+1}`;
      circ.resize(38, 38);
      circ.x = cx; circ.y = 72;
      circ.fills = noFill();
      circ.strokes = solid(C.line2);
      circ.strokeWeight = 1.5;
      strip.appendChild(circ);

      // Inner dot (icon placeholder)
      const dot = figma.createEllipse();
      dot.resize(10, 10);
      dot.x = cx + 14; dot.y = 86;
      dot.fills = solid(C.line);
      strip.appendChild(dot);

      const lbl = makeText(audiences[i], 'Assistant', 'Regular', 13, C.ink2, { align:'CENTER', w: colW });
      place(lbl, PAD + i * colW, 122);
      strip.appendChild(lbl);
    }

    master.appendChild(strip);
    Y += 168;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // WHAT WE DO
  // ══════════════════════════════════════════════════════════════════════════
  {
    const SECTION_H = 370;
    const sec = makeFrame('What We Do', TW, SECTION_H);
    sec.fills = solid(C.white);
    sec.y = Y;

    makePanelCard(sec, 32, SECTION_H - 52);
    makeSectionTitle(sec, 'מה אנחנו עושים', 72);

    const cards = [
      { n:'1', title:'מפרקים את הרעיון',    desc:'מגדירים בעיה, קהל יעד ושלבי שימוש.' },
      { n:'2', title:'ממחישים את הפתרון',   desc:'הדמיות ריאליסטיות ותרחישי שימוש ברורים.' },
      { n:'3', title:'בודקים את הסביבה',    desc:'מחקר מתחרים, השראות ובידול ראשוני.' },
      { n:'4', title:'ממקדים את הערך',      desc:'מגדירים בידול, קהל יעד ומסגרת שימוש.' },
    ];

    const CARD_W = (CW - 80 - 3 * 20) / 4;
    for (let i = 0; i < 4; i++) {
      const d = cards[i];
      const cx = PAD + 40 + i * (CARD_W + 20);
      const cy = 155;

      const card = makeRect(`Card ${d.n}`, cx, cy, CARD_W, 195, C.cardLight, { radius:8, stroke:C.line2 });
      sec.appendChild(card);

      // Number badge (top-left in LTR = top-right in RTL panel)
      const badge = figma.createEllipse();
      badge.resize(26, 26);
      badge.x = cx + CARD_W - 38; badge.y = cy + 16;
      badge.fills = solid(C.accent);
      const badgeNum = makeText(d.n, 'Assistant', 'Bold', 12, C.white, { align:'CENTER', w:26 });
      place(badgeNum, cx + CARD_W - 38, cy + 22);
      add(sec, badge, badgeNum);

      // Icon circle
      const iconBg = figma.createEllipse();
      iconBg.resize(40, 40); iconBg.x = cx + 16; iconBg.y = cy + 14;
      iconBg.fills = solid(C.accentSoft, 0.3);
      sec.appendChild(iconBg);

      const title = makeText(d.title, 'Frank Ruhl Libre', 'Medium', 18, C.ink, { align:'RIGHT', w: CARD_W-28 });
      place(title, cx + 14, cy + 68);
      const desc = makeText(d.desc, 'Assistant', 'Regular', 13, C.ink2, { align:'RIGHT', lineH:21, w: CARD_W-28 });
      place(desc, cx + 14, cy + 112);
      add(sec, title, desc);
    }

    master.appendChild(sec);
    Y += SECTION_H;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HOW IT WORKS
  // ══════════════════════════════════════════════════════════════════════════
  {
    const SECTION_H = 290;
    const sec = makeFrame('How It Works', TW, SECTION_H);
    sec.fills = solid(C.white);
    sec.y = Y;

    makePanelCard(sec, 32, SECTION_H - 52);
    makeSectionTitle(sec, 'איך זה עובד', 72);

    const steps = ['רעיון','ראיון','אפיון','מחקר','קונספט','הדמיות','מצגת'];
    const STEP_W = CW / 7;
    const CIRC_Y = 155;

    for (let i = 0; i < 7; i++) {
      const cx = PAD + i * STEP_W + (STEP_W - 68) / 2;

      // Circle
      const circ = figma.createEllipse();
      circ.name = `Step ${i+1}`;
      circ.resize(68, 68);
      circ.x = cx; circ.y = CIRC_Y;
      circ.fills = solid(C.white);
      circ.strokes = solid(C.line);
      circ.strokeWeight = 1;
      sec.appendChild(circ);

      // Connector line + arrow
      if (i < 6) {
        const lineX = cx + 68 + 4;
        const lineW = STEP_W - 76;
        const connector = makeRect(`Connector ${i}`, lineX, CIRC_Y + 34, lineW, 1, C.line);
        sec.appendChild(connector);

        const arrow = makeText('‹', 'Assistant', 'Regular', 14, C.accent);
        place(arrow, lineX + lineW/2 - 4, CIRC_Y + 26);
        sec.appendChild(arrow);
      }

      // Step label
      const lbl = makeText(steps[i], 'Assistant', 'SemiBold', 13, C.ink, { align:'CENTER', w:STEP_W });
      place(lbl, PAD + i * STEP_W, CIRC_Y + 76);
      sec.appendChild(lbl);
    }

    master.appendChild(sec);
    Y += SECTION_H;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // WHAT YOU GET
  // ══════════════════════════════════════════════════════════════════════════
  {
    const SECTION_H = 340;
    const sec = makeFrame('What You Get', TW, SECTION_H);
    sec.fills = solid(C.white);
    sec.y = Y;

    makePanelCard(sec, 32, SECTION_H - 52);
    makeSectionTitle(sec, 'מה יוצא לך מזה?', 72);

    const items = [
      { title:'התקדמות', desc:'יהיה לך קובץ שאפשר לשתף, לבחון\nולקבל עליו פידבק מיד.' },
      { title:'ביטחון',  desc:'תדע להסביר את הרעיון בצורה\nמקצועית ומשכנעת.' },
      { title:'בהירות',  desc:'תבין מה בדיוק יש לך ביד ואיך\nהמוצר פותר בעיה.' },
    ];
    const COL_W = (CW - 80) / 3;

    for (let i = 0; i < 3; i++) {
      const bx = PAD + 40 + i * (COL_W + 20);

      const iconCirc = figma.createEllipse();
      iconCirc.resize(58, 58);
      iconCirc.x = bx + (COL_W - 58) / 2; iconCirc.y = 148;
      iconCirc.fills = solid(C.card);
      iconCirc.strokes = solid(C.accentSoft, 0.5);
      iconCirc.strokeWeight = 1.5;
      sec.appendChild(iconCirc);

      // Icon dot
      const dot = figma.createEllipse();
      dot.resize(18, 18);
      dot.x = bx + (COL_W - 18) / 2; dot.y = 167;
      dot.fills = solid(C.accent, 0.4);
      sec.appendChild(dot);

      const t = makeText(items[i].title, 'Frank Ruhl Libre', 'Medium', 21, C.ink, { align:'CENTER', w: COL_W });
      place(t, bx, 220);
      const d = makeText(items[i].desc, 'Assistant', 'Regular', 14, C.ink2, { align:'CENTER', lineH:24, w: COL_W - 20 });
      place(d, bx + 10, 256);
      add(sec, t, d);
    }

    master.appendChild(sec);
    Y += SECTION_H;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EXAMPLES
  // ══════════════════════════════════════════════════════════════════════════
  {
    const SECTION_H = 360;
    const sec = makeFrame('Examples', TW, SECTION_H);
    sec.fills = solid(C.white);
    sec.y = Y;

    makePanelCard(sec, 32, SECTION_H - 52);
    makeSectionTitle(sec, 'דוגמאות מהשטח', 72);

    const examples = [
      { tag:'מוצר רפואי',     title:'מכשיר ניטור ביתי',   desc:'מרעיון עמום לקונספט ברור\nעם תרחישי שימוש ומשקיעים.' },
      { tag:'טכנולוגיה / IoT', title:'מערכת חכמה לבית',    desc:'אפיון, קהל יעד והדמיות\nשמסבירות חוויית שימוש.' },
      { tag:'מוצר צרכני',     title:'אביזר יומיומי',       desc:'רעיון פשוט שהפך למוצר\nחכם עם סיפור ברור.' },
    ];
    const EX_W = (CW - 80 - 2 * 20) / 3;
    const IMG_W = 118;

    for (let i = 0; i < 3; i++) {
      const ex = examples[i];
      const ex_x = PAD + 40 + i * (EX_W + 20);
      const ex_y = 148;

      // Card background
      const card = makeRect(`Example ${i+1}`, ex_x, ex_y, EX_W, 180, C.white, { radius:8, stroke:C.line2 });
      // Image placeholder (left side — we use ltr convention)
      const img = makeRect(`Example ${i+1} Image`, ex_x, ex_y, IMG_W, 180, hex('#f0eadb'), { radius:8 });
      add(sec, card, img);

      // "PHOTO" placeholder text
      const photoLbl = makeText('PHOTO', 'Assistant', 'Regular', 10, C.ink3, { align:'CENTER', letterSpacing:20, w:IMG_W });
      place(photoLbl, ex_x, ex_y + 82);
      sec.appendChild(photoLbl);

      // Tag
      const tag = makeText(ex.tag, 'Assistant', 'SemiBold', 11, C.accent, { letterSpacing:6 });
      place(tag, ex_x + IMG_W + 14, ex_y + 18);

      // Title
      const title = makeText(ex.title, 'Frank Ruhl Libre', 'Medium', 18, C.ink, { align:'RIGHT', w: EX_W - IMG_W - 28 });
      place(title, ex_x + IMG_W + 14, ex_y + 40);

      // Description
      const desc = makeText(ex.desc, 'Assistant', 'Regular', 13, C.ink2, { align:'RIGHT', lineH:21, w: EX_W - IMG_W - 28 });
      place(desc, ex_x + IMG_W + 14, ex_y + 88);

      // Link
      const link = makeText('לצפייה בדוגמה ›', 'Assistant', 'SemiBold', 13, C.accent);
      place(link, ex_x + IMG_W + 14, ex_y + 148);

      add(sec, tag, title, desc, link);
    }

    master.appendChild(sec);
    Y += SECTION_H;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ABOUT
  // ══════════════════════════════════════════════════════════════════════════
  {
    const SECTION_H = 340;
    const sec = makeFrame('About', TW, SECTION_H);
    sec.fills = solid(C.white);
    sec.y = Y;

    makePanelCard(sec, 32, SECTION_H - 52);

    // Portrait placeholder
    const portrait = makeRect('Portrait', PAD + 40, 88, 150, 195, hex('#d5cbb4'), { radius:8 });
    const portLbl = makeText('תמונת\nמייסד', 'Assistant', 'Regular', 12, C.ink3, { align:'CENTER', w:150 });
    place(portLbl, PAD + 40, 164);
    add(sec, portrait, portLbl);

    // Text
    const name = makeText('KYD Studio', 'Frank Ruhl Libre', 'Bold', 26, C.ink);
    place(name, PAD + 212, 90);
    const role = makeText('בהובלת יוגב קרסנטי', 'Assistant', 'SemiBold', 14, C.accent);
    place(role, PAD + 212, 128);
    const bio = makeText(
      'מעצב מוצר המתמחה באסטרטגיה ועיצוב.\nמעל 10 שנות ניסיון בפיתוח קונספטים\nוהנגשת רעיונות למוצרים פיזיים ודיגיטליים.\nליווי אישי, חשיבה מוצרית ודיוק מסרים.',
      'Assistant', 'Regular', 14, C.ink2,
      { align:'RIGHT', lineH:24, w:370 }
    );
    place(bio, PAD + 212, 156);
    add(sec, name, role, bio);

    // Stats (3 columns)
    const statData = [
      { num:'200+', label:'מצגות קונספט\nשהוכנו ברצינות' },
      { num:'10+',  label:'שנות ניסיון\nבעיצוב ופיתוח' },
      { num:'',     label:'עיצוב מוצרי', sub:'עיצוב תעשייתי, UX,\nהדמיות וסיפור מוצר.' },
    ];
    const STAT_W = 180;
    const STATS_START = PAD + 640;
    for (let i = 0; i < 3; i++) {
      const sx = STATS_START + i * (STAT_W + 20);
      const s = statData[i];

      // Icon circle
      const ic = figma.createEllipse();
      ic.resize(46, 46); ic.x = sx + (STAT_W-46)/2; ic.y = 96;
      ic.fills = solid(C.card);
      sec.appendChild(ic);

      if (s.num) {
        const num = makeText(s.num, 'Frank Ruhl Libre', 'Bold', 30, C.ink, { align:'CENTER', w:STAT_W });
        place(num, sx, 155);
        sec.appendChild(num);
      }

      const lbl = makeText(s.num ? s.label : s.label, 'Assistant', 'Regular', 13, s.num ? C.ink2 : C.ink, {
        align:'CENTER', lineH:21, w:STAT_W
      });
      place(lbl, sx, s.num ? 195 : 155);
      sec.appendChild(lbl);

      if (s.sub) {
        const sub = makeText(s.sub, 'Assistant', 'Regular', 12, C.ink2, { align:'CENTER', lineH:20, w:STAT_W });
        place(sub, sx, 183);
        sec.appendChild(sub);
      }
    }

    master.appendChild(sec);
    Y += SECTION_H;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PRICING
  // ══════════════════════════════════════════════════════════════════════════
  {
    const SECTION_H = 430;
    const sec = makeFrame('Pricing', TW, SECTION_H);
    sec.fills = solid(C.white);
    sec.y = Y;

    makePanelCard(sec, 32, SECTION_H - 52);
    makeSectionTitle(sec, 'חבילות מומלצות', 72);

    const packages = [
      { title:'Investor / Partner Pack',  desc:'התאמת המצגת למשקיע,\nשותף עסקי או פגישה חשובה.', amount:'₪7,900', featured:false },
      { title:'Concept Development',      desc:'תהליך עומק מלא: אפיון,\nמחקר, הדמיות ומצגת ברורה.', amount:'₪5,900', featured:true },
      { title:'Concept MVP Sprint',       desc:'תהליך ממוקד להמחשת\nהרעיון וקבלת פידבק מהיר.', amount:'₪3,500', featured:false },
    ];
    const FEAT_W = 192;
    const CARD_W = (CW - 80 - FEAT_W - 3 * 18) / 3;

    for (let i = 0; i < 3; i++) {
      const p = packages[i];
      const px = PAD + 40 + i * (CARD_W + 18);
      const py = 148;

      const borderColor = p.featured ? C.accent : C.line2;
      const card = makeRect(`Price ${i+1}`, px, py, CARD_W, 240, C.white, { radius:8, stroke:borderColor, strokeW: p.featured ? 2 : 1 });
      sec.appendChild(card);

      if (p.featured) {
        const badge = makeRect('Badge', px + (CARD_W-90)/2, py - 14, 90, 28, C.accent, { radius:4 });
        const badgeTxt = makeText('הכי פופולרי', 'Assistant', 'SemiBold', 12, C.white, { align:'CENTER', w:90 });
        place(badgeTxt, px + (CARD_W-90)/2, py - 8);
        add(sec, badge, badgeTxt);
      }

      const pTitle = makeText(p.title, 'Frank Ruhl Libre', 'Medium', 19, C.ink, { align:'RIGHT', w: CARD_W-28 });
      place(pTitle, px + 14, py + 22);
      const pDesc = makeText(p.desc, 'Assistant', 'Regular', 13, C.ink2, { align:'RIGHT', lineH:21, w:CARD_W-28 });
      place(pDesc, px + 14, py + 68);

      // Divider
      const divider = makeRect('Divider', px + 14, py + 158, CARD_W - 28, 1, C.line2);

      const fromLbl = makeText('החל מ-', 'Assistant', 'Regular', 12, C.ink3, { align:'CENTER', w:CARD_W });
      place(fromLbl, px, py + 172);
      const amount = makeText(p.amount, 'Frank Ruhl Libre', 'Bold', 30, C.ink, { align:'CENTER', w:CARD_W });
      place(amount, px, py + 195);

      add(sec, pTitle, pDesc, divider, fromLbl, amount);
    }

    // Features checklist box
    const featX = PAD + 40 + 3 * (CARD_W + 18);
    const featBox = makeRect('Features', featX, 148, FEAT_W, 240, C.cardLight, { radius:8, stroke:C.line2 });
    sec.appendChild(featBox);

    const features = ['תהליך מובנה ומדויק','יחס אישי וצמוד','דיסקרטיות מלאה','חשיבה אסטרטגית + עיצוב'];
    for (let i = 0; i < 4; i++) {
      const fy = 162 + i * 52;

      const chk = makeText('✓', 'Assistant', 'Bold', 15, C.accent);
      place(chk, featX + FEAT_W - 28, fy);

      const dividerLine = makeRect(`FeatDiv ${i}`, featX + 16, fy + 42, FEAT_W - 32, 1, C.line2);
      if (i < 3) sec.appendChild(dividerLine);

      const fTxt = makeText(features[i], 'Assistant', 'Regular', 13, C.ink, { align:'RIGHT', w: FEAT_W - 44 });
      place(fTxt, featX + 12, fy + 1);
      add(sec, chk, fTxt);
    }

    // Disclaimer
    const disclaimer = makeText(
      'המחירים אינם כוללים מע"מ. כל הצעה מותאמת לצרכים הספציפיים שלך.',
      'Assistant', 'Regular', 12, C.ink3, { align:'CENTER', w: CW - 80 }
    );
    place(disclaimer, PAD + 40, 406);
    sec.appendChild(disclaimer);

    master.appendChild(sec);
    Y += SECTION_H;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LEAD FORM
  // ══════════════════════════════════════════════════════════════════════════
  {
    const SECTION_H = 300;
    const sec = makeFrame('Lead Form', TW, SECTION_H);
    sec.fills = solid(C.white);
    sec.y = Y;

    makePanelCard(sec, 32, SECTION_H - 52);

    const formTitle = makeText(
      'יש לך רעיון למוצר? בוא נבדוק איך להפוך אותו לקונספט מנצח.',
      'Frank Ruhl Libre', 'Medium', 26, C.ink,
      { align:'CENTER', lineH:36, w: CW - 160 }
    );
    place(formTitle, PAD + 80, 72);

    const formSub = makeText(
      'מלא פרטים וקבל בדיקת התאמה ראשונית — ללא התחייבות.',
      'Assistant', 'Regular', 14, C.ink2, { align:'CENTER', w: CW - 160 }
    );
    place(formSub, PAD + 80, 122);

    add(sec, formTitle, formSub);

    // Input fields
    const fields = ['שם מלא','טלפון','תחום / מוצר','אימייל'];
    const INPUT_W = (CW - 80 - 3 * 12) / 4;
    for (let i = 0; i < 4; i++) {
      const fx = PAD + 40 + i * (INPUT_W + 12);
      const inputBg = makeRect(`Input ${i+1}`, fx, 162, INPUT_W, 46, C.white, { radius:6, stroke:C.line2 });
      const ph = makeText(fields[i], 'Assistant', 'Regular', 14, C.ink3);
      place(ph, fx + INPUT_W - 14 - ph.width, 177);
      add(sec, inputBg, ph);
    }

    // Submit button (centered)
    const BTN_W = 250;
    makeAccentBtn(sec, '← שליחת בדיקת התאמה', PAD + 40 + (CW - 80 - BTN_W) / 2, 226, BTN_W);

    master.appendChild(sec);
    Y += SECTION_H;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════════════════════════════════
  {
    const footer = makeFrame('Footer', TW, 88);
    footer.fills = solid(C.white);
    footer.y = Y;
    footer.strokes = solid(C.line2);
    footer.strokeWeight = 1;
    footer.strokeAlign = 'INSIDE';

    const copy = makeText('KYD STUDIO © כל הזכויות שמורות', 'Assistant', 'Regular', 13, C.ink3);
    place(copy, PAD, 34);
    footer.appendChild(copy);

    const footLinks = ['הצהרת נגישות','מדיניות פרטיות','תנאי שימוש'];
    let lx = TW - PAD;
    for (const link of footLinks) {
      const t = makeText(link, 'Assistant', 'Regular', 13, C.ink3);
      lx -= (t.width + 24);
      place(t, lx, 34);
      footer.appendChild(t);
    }

    master.appendChild(footer);
    Y += 88;
  }

  // ── Resize master to exact height ────────────────────────────────────────
  master.resize(TW, Y);

  // ── Zoom to fit ───────────────────────────────────────────────────────────
  figma.viewport.scrollAndZoomIntoView([master]);

  figma.closePlugin('✅ KYD Studio design created! (' + Y + 'px tall)');

})();
