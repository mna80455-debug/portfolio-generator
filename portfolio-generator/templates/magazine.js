/* Template: Magazine — Editorial Layout Portfolio */

function generateMagazineHTML(data, accentColor, font) {
  var ac = accentColor || '#63B3ED';
  var f = font || 'Inter';
  var e = _escM;

  var photo = data.photo
    ? '<img src="' + e(data.photo) + '" alt="' + e(data.name) + '" class="mag-photo" />'
    : '';

  var socials = [];
  if (data.github) socials.push('<a href="' + e(data.github) + '" target="_blank">GH</a>');
  if (data.linkedin) socials.push('<a href="' + e(data.linkedin) + '" target="_blank">IN</a>');
  if (data.twitter) socials.push('<a href="' + e(data.twitter) + '" target="_blank">TW</a>');
  if (data.website) socials.push('<a href="' + e(data.website) + '" target="_blank">WEB</a>');

  var skills = (data.skills||[]).map(function(s){ return '<span class="mag-skill">' + e(s) + '</span>'; }).join('');
  var projects = (data.projects||[]).filter(function(p){return p.name;}).map(function(p,i){
    return '<div class="mag-project"><div class="mp-num">0' + (i+1) + '</div><div class="mp-content"><h3>' + e(p.name) + '</h3><p>' + e(p.description) + '</p>' + (p.url?'<a href="'+e(p.url)+'" target="_blank">View Project ↗</a>':'') + '</div></div>';
  }).join('');
  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="mag-entry"><div class="me-row"><strong>' + e(x.degree) + '</strong><em>' + e(x.year) + '</em></div><p>' + e(x.school) + '</p></div>';
  }).join('');
  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="mag-entry"><div class="me-row"><strong>' + e(x.role) + '</strong><em>' + e(x.duration) + '</em></div><p class="me-company">' + e(x.company) + '</p>' + (x.description?'<p class="me-desc">' + e(x.description) + '</p>':'') + '</div>';
  }).join('');
  var languages = (data.languages||[]).filter(function(l){return l.language;}).map(function(l){
    return '<span class="mag-skill">' + e(l.language) + '</span>';
  }).join('');
  var achievements = (data.achievements||[]).filter(function(a){return a.title;}).map(function(a){
    return '<li>' + e(a.title) + (a.issuer ? ' <em>— ' + e(a.issuer) + '</em>' : '') + '</li>';
  }).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(data.name) + '</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=' + f.replace(/ /g,'+') + ':wght@300;400;500;600&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}'
    + 'body{font-family:"' + f + '",sans-serif;background:#FEFEFE;color:#1a1a1a;line-height:1.8;-webkit-font-smoothing:antialiased}'
    + 'a{color:' + ac + ';text-decoration:none;font-weight:600}a:hover{opacity:.7}'
    + '.mag-hero{min-height:90vh;display:flex;align-items:center;padding:60px 48px;position:relative;overflow:hidden}'
    + '.mag-hero-left{flex:1;padding-right:48px}'
    + '.mag-hero-right{width:40%;display:flex;align-items:center;justify-content:center}'
    + '.mag-photo{width:100%;max-width:360px;aspect-ratio:3/4;object-fit:cover;border-radius:24px;box-shadow:0 32px 64px rgba(0,0,0,0.12)}'
    + '.mag-name{font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(48px,8vw,96px);font-weight:900;-webkit-text-stroke:2px #0a0a0a;color:transparent;line-height:0.9;letter-spacing:-3px;margin-bottom:16px}'
    + '.mag-title{font-size:1.1rem;color:' + ac + ';font-weight:600;text-transform:uppercase;letter-spacing:3px;margin-bottom:20px}'
    + '.mag-bio{color:#555;font-size:1rem;max-width:500px;line-height:1.8}'
    + '.mag-socials{display:flex;gap:14px;margin-top:24px}'
    + '.mag-socials a{padding:8px 20px;border:2px solid #0a0a0a;border-radius:999px;color:#0a0a0a;font-size:0.82rem;font-weight:700;transition:all .2s}'
    + '.mag-socials a:hover{background:#0a0a0a;color:white}'
    + '.mag-container{max-width:900px;margin:0 auto;padding:0 48px}'
    + '.mag-section{padding:60px 0;border-top:1px solid #eee}'
    + '.mag-section h2{font-family:"Plus Jakarta Sans",sans-serif;font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:4px;color:#aaa;margin-bottom:32px}'
    + '.mag-skills{display:flex;flex-wrap:wrap;gap:12px}'
    + '.mag-skill{font-size:1.1rem;font-weight:700;color:#1a1a1a;padding:8px 24px;border:2px solid #e0e0e0;border-radius:999px;transition:all .2s}'
    + '.mag-skill:hover{border-color:' + ac + ';color:' + ac + '}'
    + '.mag-project{display:flex;gap:24px;padding:28px 0;border-bottom:1px solid #eee}'
    + '.mp-num{font-family:"Plus Jakarta Sans",sans-serif;font-size:2rem;font-weight:900;color:#ddd;line-height:1}'
    + '.mp-content h3{font-family:"Plus Jakarta Sans",sans-serif;font-size:1.15rem;font-weight:700;color:#111;margin-bottom:4px}'
    + '.mp-content p{font-size:0.88rem;color:#666;margin-bottom:8px}'
    + '.mag-entry{padding:16px 0;border-bottom:1px solid #eee}'
    + '.me-row{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}'
    + '.me-row strong{font-size:1rem;color:#111}'
    + '.me-row em{font-size:0.82rem;color:' + ac + ';font-style:normal;font-weight:600}'
    + '.mag-entry p{font-size:0.88rem;color:#888;margin-top:2px}'
    + '.me-company{color:' + ac + '!important}'
    + '.me-desc{color:#666!important;margin-top:6px}'
    + '.mag-ach{list-style:none;padding:0}'
    + '.mag-ach li{padding:10px 0;border-bottom:1px solid #eee;font-size:0.92rem;color:#444}'
    + '.mag-ach li::before{content:"→ ";color:' + ac + ';font-weight:700}'
    + '.mag-ach li em{color:#888;font-style:normal}'
    + '.mag-contact{display:flex;flex-wrap:wrap;gap:24px;font-size:0.92rem;color:#555}'
    + '.mag-contact strong{color:#111}'
    + 'footer{text-align:center;padding:48px;color:#ccc;font-size:0.72rem}'
    + '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    + '@media(max-width:768px){.mag-hero{flex-direction:column-reverse;padding:40px 24px}.mag-hero-right{width:100%;margin-bottom:32px}.mag-hero-left{padding-right:0}.mag-name{font-size:48px;-webkit-text-stroke:1.5px #0a0a0a}.mag-container{padding:0 24px}}'
    + '</style></head><body>'
    + '<div class="mag-hero"><div class="mag-hero-left">'
    + '<div class="mag-name">' + e(data.name||'Your Name') + '</div>'
    + (data.jobTitle ? '<div class="mag-title">' + e(data.jobTitle) + '</div>' : '')
    + (data.bio ? '<p class="mag-bio">' + e(data.bio) + '</p>' : '')
    + (socials.length ? '<div class="mag-socials">' + socials.join('') + '</div>' : '')
    + '</div>'
    + (photo ? '<div class="mag-hero-right">' + photo + '</div>' : '')
    + '</div>'
    + '<div class="mag-container">'
    + (skills ? '<div class="mag-section"><h2>Skills</h2><div class="mag-skills">' + skills + '</div></div>' : '')
    + (education ? '<div class="mag-section"><h2>Education</h2>' + education + '</div>' : '')
    + (experience ? '<div class="mag-section"><h2>Experience</h2>' + experience + '</div>' : '')
    + (projects ? '<div class="mag-section"><h2>Projects</h2>' + projects + '</div>' : '')
    + (languages ? '<div class="mag-section"><h2>Languages</h2><div class="mag-skills">' + languages + '</div></div>' : '')
    + (achievements ? '<div class="mag-section"><h2>Achievements</h2><ul class="mag-ach">' + achievements + '</ul></div>' : '')
    + '<div class="mag-section"><h2>Contact</h2><div class="mag-contact">'
    + (data.email ? '<span><strong>Email</strong> ' + e(data.email) + '</span>' : '')
    + (data.phone ? '<span><strong>Phone</strong> ' + e(data.phone) + '</span>' : '')
    + (data.location ? '<span><strong>Location</strong> ' + e(data.location) + '</span>' : '')
    + '</div></div>'
    + '<div id="gh-placeholder" style="max-width:900px;margin:0 auto;padding:0 48px"></div>'
    + '<script>'
    + 'if(window.parent.getGitHubWidgetHTML) {'
    + '  window.parent.getGitHubWidgetHTML("' + e(data.github) + '", "' + ac + '").then(html => {'
    + '    if(html) document.getElementById("gh-placeholder").innerHTML = html;'
    + '  });'
    + '}'
    + '</script>'
    + '</div>'
    + '<footer>Designed with care</footer></body></html>';
}

function _escM(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
