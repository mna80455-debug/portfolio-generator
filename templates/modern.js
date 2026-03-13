/* Template: Midnight — Dark Professional Portfolio */

function generateMidnightHTML(data, accentColor, font) {
  var ac = accentColor || '#00F5A0';
  var f = font || 'DM Sans';
  var e = _esc;

  var photo = data.photo
    ? '<div class="photo-ring"><img src="' + e(data.photo) + '" alt="' + e(data.name) + '" class="photo" /></div>'
    : '<div class="photo-ring"><div class="photo-placeholder">' + (data.name ? data.name[0].toUpperCase() : '?') + '</div></div>';

  var socials = '';
  if (data.github) socials += '<a href="' + e(data.github) + '" target="_blank" rel="noopener">GitHub</a>';
  if (data.linkedin) socials += '<a href="' + e(data.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>';
  if (data.twitter) socials += '<a href="' + e(data.twitter) + '" target="_blank" rel="noopener">Twitter</a>';
  if (data.website) socials += '<a href="' + e(data.website) + '" target="_blank" rel="noopener">Website</a>';

  var skills = (data.skills||[]).map(function(s){ return '<span class="chip">' + e(s) + '</span>'; }).join('');
  var projects = (data.projects||[]).filter(function(p){return p.name;}).map(function(p){
    return '<div class="proj"><h3>' + e(p.name) + '</h3><p>' + e(p.description) + '</p>' + (p.url?'<a href="'+e(p.url)+'" target="_blank">View →</a>':'') + '</div>';
  }).join('');
  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="timeline-item"><div class="tl-header"><strong>' + e(x.degree) + '</strong><span class="tl-date">' + e(x.year) + '</span></div><p class="tl-sub">' + e(x.school) + '</p></div>';
  }).join('');
  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="timeline-item"><div class="tl-header"><strong>' + e(x.role) + '</strong><span class="tl-date">' + e(x.duration) + '</span></div><p class="tl-sub" style="color:'+ac+'">' + e(x.company) + '</p>' + (x.description?'<p class="tl-desc">'+e(x.description)+'</p>':'') + '</div>';
  }).join('');
  var languages = (data.languages||[]).filter(function(l){return l.language;}).map(function(l){
    return '<div class="lang-row"><span>' + e(l.language) + '</span><span class="lang-badge">' + e(l.level) + '</span></div>';
  }).join('');
  var achievements = (data.achievements||[]).filter(function(a){return a.title;}).map(function(a){
    return '<div class="ach-item"><span class="ach-icon">✦</span><div><strong>' + e(a.title) + '</strong>' + (a.issuer?'<span class="ach-issuer">' + e(a.issuer) + '</span>':'') + '</div></div>';
  }).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(data.name) + '</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=' + f.replace(/ /g,'+') + ':wght@300;400;500;600;700&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}'
    + 'body{font-family:"' + f + '",sans-serif;background:#050810;color:#c8d0e0;-webkit-font-smoothing:antialiased;'
    + 'font-size:' + (data.fontSize || 16) + 'px;'
    + 'line-height:' + (data.lineHeight || 1.7) + ';'
    + 'font-weight:' + (data.fontWeight || 400) + ';'
    + 'letter-spacing:' + (data.letterSpacing || 0) + 'px;}'
    + 'a{color:' + ac + ';text-decoration:none;font-weight:500}'
    + 'a:hover{text-decoration:underline}'
    + '@keyframes spin{to{transform:rotate(360deg)}}'
    + '@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}'
    + '.hero{text-align:center;padding:80px 24px 60px;background:linear-gradient(180deg,#050810 0%,#0d1220 100%);position:relative}'
    + '.hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,' + ac + '08,transparent 70%);pointer-events:none}'
    + '.photo-ring{display:inline-block;background:conic-gradient(' + ac + ',#6366f1,' + ac + ');animation:spin 4s linear infinite;border-radius:50%;padding:3px;margin-bottom:20px}'
    + '.photo{width:120px;height:120px;border-radius:50%;object-fit:cover;display:block}'
    + '.photo-placeholder{width:120px;height:120px;border-radius:50%;background:#141925;display:flex;align-items:center;justify-content:center;font-size:2.8rem;color:' + ac + ';font-family:"Syne",sans-serif;font-weight:800}'
    + '.hero h1{font-family:"Syne",sans-serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:800;color:#fff;letter-spacing:-1px;margin-bottom:4px}'
    + '.hero .title{font-size:1.1rem;color:' + ac + ';font-weight:500;margin-bottom:14px}'
    + '.hero .title::after{content:"|";animation:blink 1s step-end infinite;margin-left:2px;color:' + ac + '}'
    + '@keyframes blink{50%{opacity:0}}'
    + '.hero .bio{color:#8892A4;max-width:520px;margin:0 auto 20px;font-size:0.92rem}'
    + '.socials{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}'
    + '.socials a{padding:6px 16px;border:1px solid rgba(255,255,255,0.08);border-radius:999px;font-size:0.82rem;transition:all .2s}'
    + '.socials a:hover{background:' + ac + '15;border-color:' + ac + '40;text-decoration:none}'
    + '.container{max-width:760px;margin:0 auto;padding:0 24px}'
    + 'section{padding:48px 0;animation:fadeIn .6s ease both}'
    + 'section h2{font-family:"Syne",sans-serif;font-size:1.25rem;font-weight:700;color:#fff;margin-bottom:24px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:10px}'
    + 'section h2 .ico{font-size:1.1rem}'
    + '.chips{display:flex;flex-wrap:wrap;gap:8px}'
    + '.chip{padding:6px 16px;background:rgba(255,255,255,0.04);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:999px;font-size:0.84rem;color:#fff;font-weight:500}'
    + '.proj{background:#0d1220;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:22px;margin-bottom:14px;transition:border-color .2s}'
    + '.proj:hover{border-color:' + ac + '40}'
    + '.proj h3{font-family:"Syne",sans-serif;font-size:1.05rem;color:#fff;margin-bottom:6px}'
    + '.proj p{color:#8892A4;font-size:0.86rem;margin-bottom:10px}'
    + '.timeline-item{padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.04)}'
    + '.tl-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}'
    + '.tl-header strong{color:#fff;font-size:0.95rem}'
    + '.tl-date{color:' + ac + ';font-size:0.8rem;font-weight:600}'
    + '.tl-sub{color:#8892A4;font-size:0.86rem;margin-top:2px}'
    + '.tl-desc{color:#6b7488;font-size:0.84rem;margin-top:6px;line-height:1.6}'
    + '.lang-row{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:#0d1220;border-radius:10px;margin-bottom:8px}'
    + '.lang-row span{color:#fff;font-weight:500}'
    + '.lang-badge{background:' + ac + '18;color:' + ac + ';padding:3px 12px;border-radius:999px;font-size:0.78rem;font-weight:600}'
    + '.ach-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04)}'
    + '.ach-icon{color:' + ac + ';font-size:1rem;margin-top:2px}'
    + '.ach-item strong{display:block;color:#fff;font-size:0.92rem}'
    + '.ach-issuer{display:block;color:#8892A4;font-size:0.8rem}'
    + '.contact{list-style:none;display:flex;flex-wrap:wrap;gap:20px}'
    + '.contact li{color:#8892A4;font-size:0.9rem}'
    + '.contact li strong{color:#fff}'
    + 'footer{text-align:center;padding:40px 24px;color:#3a4050;font-size:0.75rem;border-top:1px solid rgba(255,255,255,0.04);margin-top:32px}'
    + '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    + '@media(max-width:600px){.hero h1{font-size:1.8rem}}'
    + '</style></head><body>'
    + '<div class="hero">' + photo + '<h1>' + e(data.name) + '</h1>'
    + (data.jobTitle ? '<div class="title">' + e(data.jobTitle) + '</div>' : '')
    + (data.bio ? '<p class="bio">' + e(data.bio) + '</p>' : '')
    + (socials ? '<div class="socials">' + socials + '</div>' : '')
    + '</div><div class="container">'
    + (skills ? '<section><h2><span class="ico">🛠</span> Skills</h2><div class="chips">' + skills + '</div></section>' : '')
    + (education ? '<section><h2><span class="ico">🎓</span> Education</h2>' + education + '</section>' : '')
    + (experience ? '<section><h2><span class="ico">💼</span> Experience</h2>' + experience + '</section>' : '')
    + (projects ? '<section><h2><span class="ico">🚀</span> Projects</h2>' + projects + '</section>' : '')
    + (languages ? '<section><h2><span class="ico">🌍</span> Languages</h2>' + languages + '</section>' : '')
    + (achievements ? '<section><h2><span class="ico">🏆</span> Achievements</h2>' + achievements + '</section>' : '')
    + '<section><h2><span class="ico">📬</span> Contact</h2><ul class="contact">'
    + (data.email ? '<li><strong>Email:</strong> <a href="mailto:' + e(data.email) + '">' + e(data.email) + '</a></li>' : '')
    + (data.phone ? '<li><strong>Phone:</strong> ' + e(data.phone) + '</li>' : '')
    + (data.location ? '<li><strong>Location:</strong> ' + e(data.location) + '</li>' : '')
    + '</ul></section></div>'
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

function _esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
