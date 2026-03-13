/* Template: Aurora — Gradient Mesh Portfolio */

function generateAuroraHTML(data, accentColor, font) {
  var ac = accentColor || '#63B3ED';
  var f = font || 'Inter';
  var e = _escA;

  var photo = data.photo
    ? '<img src="' + e(data.photo) + '" alt="' + e(data.name) + '" class="aurora-photo" />'
    : '<div class="aurora-avatar">' + (data.name ? data.name[0].toUpperCase() : '?') + '</div>';

  var socials = '';
  if (data.github) socials += '<a href="' + e(data.github) + '" target="_blank">GitHub</a>';
  if (data.linkedin) socials += '<a href="' + e(data.linkedin) + '" target="_blank">LinkedIn</a>';
  if (data.twitter) socials += '<a href="' + e(data.twitter) + '" target="_blank">Twitter</a>';
  if (data.website) socials += '<a href="' + e(data.website) + '" target="_blank">Website</a>';

  var skills = (data.skills||[]).map(function(s){ return '<span class="glass-chip">' + e(s) + '</span>'; }).join('');
  var projects = (data.projects||[]).filter(function(p){return p.name;}).map(function(p){
    return '<div class="glass-card"><h3>' + e(p.name) + '</h3><p>' + e(p.description) + '</p>' + (p.url?'<a href="'+e(p.url)+'" target="_blank">View →</a>':'') + '</div>';
  }).join('');
  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="au-entry"><div class="au-row"><strong>' + e(x.degree) + '</strong><span>' + e(x.year) + '</span></div><p>' + e(x.school) + '</p></div>';
  }).join('');
  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="au-entry"><div class="au-row"><strong>' + e(x.role) + '</strong><span>' + e(x.duration) + '</span></div><p class="au-company">' + e(x.company) + '</p>' + (x.description?'<p class="au-desc">'+e(x.description)+'</p>':'') + '</div>';
  }).join('');
  var languages = (data.languages||[]).filter(function(l){return l.language;}).map(function(l){
    return '<span class="glass-chip">' + e(l.language) + ' <em>(' + e(l.level) + ')</em></span>';
  }).join('');
  var achievements = (data.achievements||[]).filter(function(a){return a.title;}).map(function(a){
    return '<div class="au-ach"><span>✦</span><div><strong>' + e(a.title) + '</strong>' + (a.issuer?'<small>' + e(a.issuer) + '</small>':'') + '</div></div>';
  }).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(data.name) + '</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=' + f.replace(/ /g,'+') + ':wght@300;400;500;600;700&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}'
    + 'body{font-family:"' + f + '",sans-serif;background:#0f0f1a;color:#e2e8f0;line-height:1.7;-webkit-font-smoothing:antialiased}'
    + 'a{color:#90cdf4;text-decoration:none;font-weight:500}a:hover{text-decoration:underline}'
    + '.aurora-hero{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 24px 60px;background:linear-gradient(135deg,#667eea 0%,#764ba2 40%,#11998e 100%);position:relative;overflow:hidden}'
    + '.aurora-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(255,255,255,0.15),transparent 60%)}'
    + '.aurora-hero::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 70% 80%,rgba(17,153,142,0.3),transparent 50%)}'
    + '.aurora-hero>*{position:relative;z-index:2}'
    + '.aurora-photo{width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,0.3);margin-bottom:24px;box-shadow:0 8px 32px rgba(0,0,0,0.3)}'
    + '.aurora-avatar{width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.1);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;font-size:3rem;color:white;font-weight:800;border:4px solid rgba(255,255,255,0.2);margin-bottom:24px}'
    + 'h1{font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(2rem,5vw,3.4rem);font-weight:800;color:white;letter-spacing:-1px;margin-bottom:6px}'
    + '.au-title{font-size:1.1rem;color:rgba(255,255,255,0.8);font-weight:400;margin-bottom:16px}'
    + '.au-bio{color:rgba(255,255,255,0.65);max-width:520px;font-size:0.92rem}'
    + '.au-socials{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px}'
    + '.au-socials a{padding:8px 20px;background:rgba(255,255,255,0.1);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.15);border-radius:999px;color:white;font-size:0.82rem;transition:all .2s}'
    + '.au-socials a:hover{background:rgba(255,255,255,0.2);text-decoration:none}'
    + '.container{max-width:760px;margin:0 auto;padding:0 24px}'
    + 'section{padding:48px 0}'
    + 'section h2{font-family:"Plus Jakarta Sans",sans-serif;font-size:1.2rem;font-weight:700;color:white;margin-bottom:24px;display:flex;align-items:center;gap:10px}'
    + '.glass-chips{display:flex;flex-wrap:wrap;gap:8px}'
    + '.glass-chip{padding:8px 18px;background:rgba(255,255,255,0.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:999px;font-size:0.84rem;color:#e2e8f0;font-weight:500}'
    + '.glass-chip em{color:#90cdf4;font-style:normal}'
    + '.glass-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}'
    + '.glass-card{background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:24px;transition:all .2s}'
    + '.glass-card:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2)}'
    + '.glass-card h3{font-family:"Plus Jakarta Sans",sans-serif;font-size:1rem;color:white;margin-bottom:6px}'
    + '.glass-card p{font-size:0.84rem;color:#a0aec0;margin-bottom:10px}'
    + '.au-entry{padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06)}'
    + '.au-row{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}'
    + '.au-row strong{color:white;font-size:0.95rem}'
    + '.au-row span{color:#90cdf4;font-size:0.8rem;font-weight:500}'
    + '.au-entry p{color:#a0aec0;font-size:0.86rem;margin-top:2px}'
    + '.au-company{color:#90cdf4!important}'
    + '.au-desc{color:#718096!important;font-size:0.84rem;margin-top:6px}'
    + '.au-ach{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)}'
    + '.au-ach span{color:#90cdf4}'
    + '.au-ach strong{display:block;color:white;font-size:0.9rem}'
    + '.au-ach small{display:block;color:#718096;font-size:0.78rem}'
    + '.contact-sec{list-style:none;display:flex;flex-wrap:wrap;gap:20px}'
    + '.contact-sec li{color:#a0aec0;font-size:0.9rem}'
    + '.contact-sec li strong{color:white}'
    + 'footer{text-align:center;padding:40px 24px;color:#4a5568;font-size:0.75rem}'
    + '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    + '@media(max-width:600px){h1{font-size:1.8rem}.glass-grid{grid-template-columns:1fr}}'
    + '</style></head><body>'
    + '<div class="aurora-hero">' + photo + '<h1>' + e(data.name) + '</h1>'
    + (data.jobTitle ? '<div class="au-title">' + e(data.jobTitle) + '</div>' : '')
    + (data.bio ? '<p class="au-bio">' + e(data.bio) + '</p>' : '')
    + (socials ? '<div class="au-socials">' + socials + '</div>' : '')
    + '</div><div class="container">'
    + (skills ? '<section><h2>🛠 Skills</h2><div class="glass-chips">' + skills + '</div></section>' : '')
    + (education ? '<section><h2>🎓 Education</h2>' + education + '</section>' : '')
    + (experience ? '<section><h2>💼 Experience</h2>' + experience + '</section>' : '')
    + (projects ? '<section><h2>🚀 Projects</h2><div class="glass-grid">' + projects + '</div></section>' : '')
    + (languages ? '<section><h2>🌍 Languages</h2><div class="glass-chips">' + languages + '</div></section>' : '')
    + (achievements ? '<section><h2>🏆 Achievements</h2>' + achievements + '</section>' : '')
    + '<section><h2>📬 Contact</h2><ul class="contact-sec">'
    + (data.email ? '<li><strong>Email:</strong> <a href="mailto:' + e(data.email) + '">' + e(data.email) + '</a></li>' : '')
    + (data.phone ? '<li><strong>Phone:</strong> ' + e(data.phone) + '</li>' : '')
    + (data.location ? '<li><strong>Location:</strong> ' + e(data.location) + '</li>' : '')
    + '</ul></section>'
    + '<div id="gh-placeholder" class="container"></div>'
    + '<script>'
    + 'if(window.parent.getGitHubWidgetHTML) {'
    + '  window.parent.getGitHubWidgetHTML("' + e(data.github) + '", "' + ac + '").then(html => {'
    + '    if(html) document.getElementById("gh-placeholder").innerHTML = html;'
    + '  });'
    + '}'
    + '</script>'
    + '</div>'
    + '<footer>Built with ⚡ Portfolio Generator</footer></body></html>';
}

function _escA(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
