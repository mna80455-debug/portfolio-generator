/* Template: Neon — Bold & Energetic Portfolio */

function generateNeonHTML(data, accentColor, font) {
  var ac = accentColor || '#00F5A0';
  var f = font || 'DM Sans';
  var e = _escN;

  // Extract RGB for glow effects
  var hex = ac.replace('#','');
  var r = parseInt(hex.substring(0,2),16);
  var g = parseInt(hex.substring(2,4),16);
  var b = parseInt(hex.substring(4,6),16);
  var acRgb = r+','+g+','+b;

  var skillCount = (data.skills||[]).length;
  var projectCount = (data.projects||[]).filter(function(p){return p.name;}).length;
  var expYears = (data.experience||[]).length;

  var photo = data.photo
    ? '<div class="neon-photo-wrap"><img src="' + e(data.photo) + '" alt="' + e(data.name) + '" /></div>'
    : '<div class="neon-photo-wrap"><div class="neon-avatar">' + (data.name ? data.name[0].toUpperCase() : '?') + '</div></div>';

  var socials = [];
  if (data.github) socials.push('<a href="' + e(data.github) + '" target="_blank" rel="noopener">GitHub</a>');
  if (data.linkedin) socials.push('<a href="' + e(data.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
  if (data.twitter) socials.push('<a href="' + e(data.twitter) + '" target="_blank" rel="noopener">Twitter</a>');
  if (data.website) socials.push('<a href="' + e(data.website) + '" target="_blank" rel="noopener">Website</a>');

  var skills = (data.skills||[]).map(function(s){
    return '<span class="neon-chip">' + e(s) + '</span>';
  }).join('');
  var projects = (data.projects||[]).filter(function(p){return p.name;}).map(function(p){
    return '<div class="neon-card"><h3>' + e(p.name) + '</h3><p>' + e(p.description) + '</p>' + (p.url?'<a href="'+e(p.url)+'" target="_blank">View →</a>':'') + '</div>';
  }).join('');
  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="neon-entry"><strong>' + e(x.degree) + '</strong><span class="ne-date">' + e(x.year) + '</span><p>' + e(x.school) + '</p></div>';
  }).join('');
  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="neon-entry"><strong>' + e(x.role) + '</strong><span class="ne-date">' + e(x.duration) + '</span><p style="color:'+ac+'">' + e(x.company) + '</p>' + (x.description?'<p class="ne-desc">'+e(x.description)+'</p>':'') + '</div>';
  }).join('');
  var languages = (data.languages||[]).filter(function(l){return l.language;}).map(function(l){
    var levels = {Native:100,Fluent:85,Advanced:70,Intermediate:50,Beginner:25};
    var pct = levels[l.level]||50;
    return '<div class="neon-lang"><div class="nl-top"><span>' + e(l.language) + '</span><span class="nl-lvl">' + e(l.level) + '</span></div><div class="nl-bar"><div class="nl-fill" style="width:'+pct+'%"></div></div></div>';
  }).join('');
  var achievements = (data.achievements||[]).filter(function(a){return a.title;}).map(function(a){
    return '<div class="neon-ach"><span class="na-icon">⚡</span><div><strong>' + e(a.title) + '</strong>' + (a.issuer?'<span class="na-issuer">'+e(a.issuer)+'</span>':'') + '</div></div>';
  }).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(data.name) + '</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=' + f.replace(/ /g,'+') + ':wght@300;400;500;600;700&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}'
    + 'body{font-family:"' + f + '",sans-serif;background:#0A0A0A;color:#ccc;-webkit-font-smoothing:antialiased;'
    + 'font-size:' + (data.fontSize || 13) + 'px;'
    + 'line-height:' + (data.lineHeight || 1.7) + ';'
    + 'font-weight:' + (data.fontWeight || 400) + ';'
    + 'letter-spacing:' + (data.letterSpacing || 0) + 'px;}'
    + 'a{color:' + ac + ';text-decoration:none;font-weight:600}'
    + 'a:hover{text-decoration:underline}'
    + '@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}'
    + '@keyframes neonPulse{0%,100%{box-shadow:0 0 10px rgba('+acRgb+',0.4),0 0 30px rgba('+acRgb+',0.2)}50%{box-shadow:0 0 20px rgba('+acRgb+',0.6),0 0 60px rgba('+acRgb+',0.3)}}'
    + '.anim{animation:fadeInUp .6s ease both}'
    + '.ad1{animation-delay:.1s}.ad2{animation-delay:.2s}.ad3{animation-delay:.3s}.ad4{animation-delay:.4s}'
    + '.hero{text-align:center;padding:80px 24px 64px;position:relative;overflow:hidden}'
    + '.hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% -20%,rgba('+acRgb+',0.15) 0%,transparent 50%);pointer-events:none}'
    + '.neon-photo-wrap{margin-bottom:24px}'
    + '.neon-photo-wrap img{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid '+ac+';box-shadow:0 0 20px rgba('+acRgb+',0.4);display:block;margin:0 auto}'
    + '.neon-avatar{width:120px;height:120px;border-radius:50%;background:#151515;display:flex;align-items:center;justify-content:center;font-size:2.8rem;color:'+ac+';font-family:"Syne",sans-serif;font-weight:800;border:3px solid '+ac+';box-shadow:0 0 20px rgba('+acRgb+',0.4);margin:0 auto}'
    + '.neon-title{font-family:"Syne",sans-serif;font-size:clamp(2.2rem,6vw,4rem);font-weight:800;-webkit-text-stroke:1.5px '+ac+';color:transparent;letter-spacing:-1px;margin-bottom:8px}'
    + '.hero .sub{font-size:1.1rem;color:'+ac+';font-weight:500;margin-bottom:12px}'
    + '.hero .bio{color:#888;max-width:520px;margin:0 auto;font-size:0.92rem}'
    + '.stats{display:flex;justify-content:center;gap:48px;padding:36px 24px;position:relative}'
    + '.stats::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:80%;height:1px;background:linear-gradient(90deg,transparent,rgba('+acRgb+',0.3),transparent)}'
    + '.stat{text-align:center}'
    + '.stat .num{font-family:"Syne",sans-serif;font-size:2.2rem;font-weight:800;color:'+ac+'}'
    + '.stat .lbl{font-size:0.72rem;text-transform:uppercase;letter-spacing:1.5px;color:#555;font-weight:600}'
    + '.container{max-width:780px;margin:0 auto;padding:0 24px}'
    + 'section{padding:48px 0}'
    + 'section h2{font-family:"Syne",sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:24px;text-align:center;color:#fff}'
    + '.neon-chips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}'
    + '.neon-chip{padding:8px 20px;border:1.5px solid rgba('+acRgb+',0.3);color:'+ac+';border-radius:999px;font-size:0.86rem;font-weight:600;transition:all .2s;background:rgba('+acRgb+',0.05)}'
    + '.neon-chip:hover{background:'+ac+';color:#0A0A0A;box-shadow:0 0 16px rgba('+acRgb+',0.5)}'
    + '.neon-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}'
    + '.neon-card{background:#111;border:1px solid #222;border-radius:14px;padding:22px;transition:all .2s;border-top:3px solid '+ac+'}'
    + '.neon-card:hover{border-color:'+ac+';box-shadow:0 0 24px rgba('+acRgb+',0.15)}'
    + '.neon-card h3{font-family:"Syne",sans-serif;font-size:1rem;color:#fff;margin-bottom:6px}'
    + '.neon-card p{font-size:0.84rem;color:#888;margin-bottom:10px}'
    + '.neon-entry{padding:14px 0;border-bottom:1px solid #1a1a1a}'
    + '.neon-entry strong{color:#fff;font-size:0.95rem;display:inline}'
    + '.ne-date{float:right;color:'+ac+';font-size:0.8rem;font-weight:600}'
    + '.neon-entry p{font-size:0.84rem;color:#888;margin-top:2px}'
    + '.ne-desc{color:#666;font-size:0.82rem;margin-top:6px;line-height:1.6}'
    + '.neon-lang{margin-bottom:14px}'
    + '.nl-top{display:flex;justify-content:space-between;font-size:0.88rem;color:#ccc;font-weight:500;margin-bottom:6px}'
    + '.nl-lvl{color:#555;font-size:0.8rem}'
    + '.nl-bar{width:100%;height:6px;background:#1a1a1a;border-radius:999px;overflow:hidden}'
    + '.nl-fill{height:100%;border-radius:999px;background:'+ac+';box-shadow:0 0 8px rgba('+acRgb+',0.4)}'
    + '.neon-ach{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #1a1a1a}'
    + '.na-icon{color:'+ac+';font-size:1.1rem}'
    + '.neon-ach strong{display:block;color:#fff;font-size:0.9rem}'
    + '.na-issuer{display:block;color:#555;font-size:0.78rem}'
    + '.cta{text-align:center;padding:60px 24px}'
    + '.cta-btn{display:inline-block;padding:16px 48px;background:'+ac+';color:#0A0A0A;border-radius:999px;font-family:"Syne",sans-serif;font-size:1.05rem;font-weight:700;animation:neonPulse 2s ease infinite;transition:transform .2s}'
    + '.cta-btn:hover{transform:scale(1.05);text-decoration:none}'
    + '.cta-info{margin-top:16px;color:#555;font-size:0.82rem}'
    + '.cta-info span{margin:0 10px}'
    + '.social-row{display:flex;gap:14px;justify-content:center;margin-top:12px}'
    + 'footer{text-align:center;padding:32px 24px;color:#333;font-size:0.72rem}'
    + '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    + '@media(max-width:600px){.neon-title{font-size:2rem}.stats{gap:24px}.neon-grid{grid-template-columns:1fr}}'
    + '</style></head><body>'
    + '<div class="hero anim">' + photo + '<div class="neon-title">' + e(data.name) + '</div>'
    + (data.jobTitle ? '<div class="sub">' + e(data.jobTitle) + '</div>' : '')
    + (data.bio ? '<p class="bio">' + e(data.bio) + '</p>' : '')
    + '</div>'
    + '<div class="stats anim ad1">'
    + '<div class="stat"><div class="num">' + skillCount + '</div><div class="lbl">Skills</div></div>'
    + '<div class="stat"><div class="num">' + projectCount + '</div><div class="lbl">Projects</div></div>'
    + (expYears ? '<div class="stat"><div class="num">' + expYears + '</div><div class="lbl">Roles</div></div>' : '')
    + '</div>'
    + '<div class="container">'
    + (skills ? '<section class="anim ad2"><h2>⚡ Skills</h2><div class="neon-chips">' + skills + '</div></section>' : '')
    + (education ? '<section class="anim ad2"><h2>🎓 Education</h2>' + education + '</section>' : '')
    + (experience ? '<section class="anim ad3"><h2>💼 Experience</h2>' + experience + '</section>' : '')
    + (projects ? '<section class="anim ad3"><h2>🚀 Projects</h2><div class="neon-grid">' + projects + '</div></section>' : '')
    + (languages ? '<section class="anim ad4"><h2>🌍 Languages</h2><div style="max-width:400px;margin:0 auto">' + languages + '</div></section>' : '')
    + (achievements ? '<section class="anim ad4"><h2>🏆 Achievements</h2>' + achievements + '</section>' : '')
    + '</div>'
    + '<div class="cta anim ad4">'
    + (data.email ? '<a href="mailto:' + e(data.email) + '" class="cta-btn">📩 Hire Me</a>' : '<div class="cta-btn">📩 Hire Me</div>')
    + '<div class="cta-info">'
    + (data.email ? '<span>✉ ' + e(data.email) + '</span>' : '')
    + (data.phone ? '<span>☎ ' + e(data.phone) + '</span>' : '')
    + (data.location ? '<span>📍 ' + e(data.location) + '</span>' : '')
    + '</div>'
    + (socials.length ? '<div class="social-row">' + socials.join(' · ') + '</div>' : '')
    + '</div>'
    + '<div id="gh-placeholder" class="container"></div>'
    + '<script>'
    + 'if(window.parent.getGitHubWidgetHTML) {'
    + '  window.parent.getGitHubWidgetHTML("' + e(data.github) + '", "' + ac + '").then(html => {'
    + '    if(html) document.getElementById("gh-placeholder").innerHTML = html;'
    + '  });'
    + '}'
    + '</script>'
    + '<footer>Built with ⚡ Portfolio Generator</footer></body></html>';
}

function _escN(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
