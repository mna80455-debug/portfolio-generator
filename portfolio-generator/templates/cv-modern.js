/* Template: CV Modern — Clean Two-Column Resume */

function generateCVModernHTML(data, accentColor, font) {
  var ac = accentColor || '#63B3ED';
  var e = _escCM;

  var photo = data.photo
    ? '<img class="cv-photo" src="' + e(data.photo) + '" alt="' + e(data.name) + '" />'
    : '<div class="cv-photo-placeholder">👤</div>';

  var skills = (data.skills||[]).map(function(s){ return '<span class="sidebar-skill">' + e(s) + '</span>'; }).join('');
  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="main-entry"><div class="main-row"><strong>' + e(x.degree) + '</strong><em>' + e(x.year) + '</em></div><p class="main-sub">' + e(x.school) + '</p></div>';
  }).join('');
  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="main-entry"><div class="main-row"><strong>' + e(x.role) + '</strong><em>' + e(x.duration) + '</em></div><p class="main-company">' + e(x.company) + '</p>' + (x.description?'<p class="main-desc">' + e(x.description) + '</p>':'') + '</div>';
  }).join('');
  var projects = (data.projects||[]).filter(function(p){return p.name;}).map(function(p){
    return '<div class="project-item"><div><span class="project-name">' + e(p.name) + '</span>' + (p.url?'<a class="project-link" href="'+e(p.url)+'">↗ View</a>':'') + '</div>' + (p.description?'<p class="project-desc">' + e(p.description) + '</p>':'') + '</div>';
  }).join('');
  var languages = (data.languages||[]).filter(function(l){return l.language;}).map(function(l){
    return '<div class="sidebar-item">' + e(l.language) + ' <em style="color:#718096;font-style:normal">(' + e(l.level) + ')</em></div>';
  }).join('');
  var achievements = (data.achievements||[]).filter(function(a){return a.title;}).map(function(a){
    return '<div class="sidebar-item">✦ ' + e(a.title) + (a.issuer ? ' — ' + e(a.issuer) : '') + '</div>';
  }).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(data.name) + ' — CV</title>'
    + '<style>'
    + '*{margin:0;padding:0;box-sizing:border-box}'
    + 'body{font-family:"Helvetica Neue",Arial,sans-serif;font-size:10pt;color:#2d3748;background:white;display:grid;grid-template-columns:240px 1fr;min-height:100vh}'
    + 'a{color:' + ac + ';text-decoration:none;font-weight:500}'
    + '.cv-sidebar{background:#1a202c;color:white;padding:32px 24px}'
    + '.cv-photo{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid ' + ac + ';display:block;margin:0 auto 16px}'
    + '.cv-photo-placeholder{width:90px;height:90px;border-radius:50%;background:#2d3748;border:3px solid ' + ac + ';display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 16px}'
    + '.sidebar-name{font-size:15pt;font-weight:700;color:white;text-align:center;line-height:1.2}'
    + '.sidebar-title{font-size:9pt;color:' + ac + ';text-align:center;margin:6px 0 24px}'
    + '.sidebar-section{margin-bottom:20px}'
    + '.sidebar-section-title{font-size:8pt;text-transform:uppercase;letter-spacing:2px;color:' + ac + ';margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.1)}'
    + '.sidebar-item{font-size:9pt;color:#cbd5e0;margin-bottom:6px;line-height:1.4}'
    + '.sidebar-skill{display:inline-block;font-size:8.5pt;padding:3px 8px;background:rgba(255,255,255,0.08);border-radius:3px;margin:3px 3px 0 0;color:#e2e8f0}'
    + '.cv-main{padding:32px 36px}'
    + '.main-section{margin-bottom:24px}'
    + '.main-section-title{font-size:11pt;font-weight:700;color:#1a202c;text-transform:uppercase;letter-spacing:1.5px;padding-bottom:6px;border-bottom:2px solid ' + ac + ';margin-bottom:14px}'
    + '.cv-bio-text{font-size:10pt;line-height:1.7;color:#4a5568}'
    + '.main-entry{padding:10px 0;border-bottom:1px solid #edf2f7}'
    + '.main-row{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}'
    + '.main-row strong{font-size:10.5pt;color:#1a202c}'
    + '.main-row em{font-size:8.5pt;color:' + ac + ';font-style:normal}'
    + '.main-sub{font-size:9.5pt;color:#718096;margin-top:2px}'
    + '.main-company{font-size:9.5pt;color:' + ac + ';margin-top:2px}'
    + '.main-desc{font-size:9.5pt;color:#718096;margin-top:4px;line-height:1.5}'
    + '.project-item{margin-bottom:14px}'
    + '.project-name{font-weight:600;font-size:10.5pt;color:#1a202c}'
    + '.project-link{font-size:8.5pt;color:' + ac + ';margin-left:8px}'
    + '.project-desc{font-size:9.5pt;color:#718096;margin-top:4px;line-height:1.5}'
    + '@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}'
    + '@media(max-width:600px){body{grid-template-columns:1fr}.cv-sidebar{padding:24px}}'
    + '</style></head><body>'

    + '<aside class="cv-sidebar">'
    + photo
    + '<div class="sidebar-name">' + e(data.name||'Your Name') + '</div>'
    + '<div class="sidebar-title">' + e(data.jobTitle||'Your Title') + '</div>'

    + '<div class="sidebar-section"><div class="sidebar-section-title">Contact</div>'
    + (data.email ? '<div class="sidebar-item">📧 ' + e(data.email) + '</div>' : '')
    + (data.phone ? '<div class="sidebar-item">📱 ' + e(data.phone) + '</div>' : '')
    + (data.location ? '<div class="sidebar-item">📍 ' + e(data.location) + '</div>' : '')
    + (data.website ? '<div class="sidebar-item">🌐 ' + e(data.website.replace('https://','')) + '</div>' : '')
    + '</div>'

    + ((data.github||data.linkedin) ? '<div class="sidebar-section"><div class="sidebar-section-title">Online</div>'
    + (data.github ? '<div class="sidebar-item">🐙 ' + e(data.github.replace('https://github.com/','')) + '</div>' : '')
    + (data.linkedin ? '<div class="sidebar-item">💼 LinkedIn</div>' : '')
    + '</div>' : '')

    + (skills ? '<div class="sidebar-section"><div class="sidebar-section-title">Skills</div><div>' + skills + '</div></div>' : '')
    + (languages ? '<div class="sidebar-section"><div class="sidebar-section-title">Languages</div>' + languages + '</div>' : '')
    + (achievements ? '<div class="sidebar-section"><div class="sidebar-section-title">Achievements</div>' + achievements + '</div>' : '')
    + '</aside>'

    + '<main class="cv-main">'
    + (data.bio ? '<section class="main-section"><div class="main-section-title">About Me</div><p class="cv-bio-text">' + e(data.bio) + '</p></section>' : '')
    + (education ? '<section class="main-section"><div class="main-section-title">Education</div>' + education + '</section>' : '')
    + (experience ? '<section class="main-section"><div class="main-section-title">Experience</div>' + experience + '</section>' : '')
    + (projects ? '<section class="main-section"><div class="main-section-title">Projects</div>' + projects + '</section>' : '')
    + '</main>'

    + '</body></html>';
}

function _escCM(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
