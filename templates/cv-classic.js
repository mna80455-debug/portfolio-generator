/* Template: CV Classic — Traditional ATS-Friendly Resume */

function generateCVClassicHTML(data, accentColor, font) {
  var ac = accentColor || '#63B3ED';
  var e = _escCC;

  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="cv-entry"><div class="cv-row"><strong>' + e(x.degree) + '</strong><em>' + e(x.year) + '</em></div><p class="cv-sub">' + e(x.school) + '</p></div>';
  }).join('');
  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="cv-entry"><div class="cv-row"><strong>' + e(x.role) + '</strong><em>' + e(x.duration) + '</em></div><p class="cv-company">' + e(x.company) + '</p>' + (x.description?'<p class="cv-desc">• ' + e(x.description) + '</p>':'') + '</div>';
  }).join('');
  var skills = (data.skills||[]).map(function(s){ return '<span class="cv-skill">' + e(s) + '</span>'; }).join('');
  var projects = (data.projects||[]).filter(function(p){return p.name;}).map(function(p){
    return '<div class="cv-project"><div class="cv-proj-header"><span class="cv-proj-name">' + e(p.name) + '</span>' + (p.url?'<a class="cv-proj-link" href="'+e(p.url)+'">' + e(p.url.replace('https://','')) + '</a>':'') + '</div>' + (p.description?'<p class="cv-proj-desc">• ' + e(p.description) + '</p>':'') + '</div>';
  }).join('');
  var languages = (data.languages||[]).filter(function(l){return l.language;}).map(function(l){
    return e(l.language) + ' (' + e(l.level) + ')';
  }).join(' · ');
  var achievements = (data.achievements||[]).filter(function(a){return a.title;}).map(function(a){
    return '<li>' + e(a.title) + (a.issuer ? ' — <em>' + e(a.issuer) + '</em>' : '') + '</li>';
  }).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(data.name) + ' — CV</title>'
    + '<style>'
    + '*{margin:0;padding:0;box-sizing:border-box}'
    + 'body{font-family:Georgia,"Times New Roman",serif;font-size:11pt;color:#1a1a1a;background:white;max-width:800px;margin:0 auto;padding:40px 50px}'
    + 'a{color:' + ac + ';text-decoration:none}'
    + '.cv-header{border-bottom:2px solid ' + ac + ';padding-bottom:16px;margin-bottom:24px}'
    + '.cv-name{font-size:26pt;font-weight:bold;letter-spacing:1px;color:#0a0a0a}'
    + '.cv-title{font-size:12pt;color:' + ac + ';font-style:italic;margin:4px 0 10px}'
    + '.cv-contacts{display:flex;flex-wrap:wrap;gap:16px;font-size:9pt;color:#444}'
    + '.cv-section{margin-bottom:22px}'
    + '.cv-section-title{font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:' + ac + ';border-bottom:1px solid #e0e0e0;padding-bottom:4px;margin-bottom:12px}'
    + '.cv-bio{font-size:10.5pt;line-height:1.6;color:#333}'
    + '.cv-skills{display:flex;flex-wrap:wrap;gap:6px}'
    + '.cv-skill{font-size:9.5pt;padding:3px 10px;border:1px solid ' + ac + ';border-radius:3px;color:' + ac + '}'
    + '.cv-entry{padding:8px 0;border-bottom:1px solid #f0f0f0}'
    + '.cv-row{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}'
    + '.cv-row strong{font-size:11pt;color:#111}'
    + '.cv-row em{font-size:9pt;color:' + ac + ';font-style:normal}'
    + '.cv-sub{font-size:10pt;color:#666;margin-top:2px}'
    + '.cv-company{font-size:10pt;color:' + ac + ';margin-top:2px}'
    + '.cv-desc{font-size:10pt;color:#555;margin-top:4px;line-height:1.5}'
    + '.cv-project{margin-bottom:14px}'
    + '.cv-proj-header{display:flex;justify-content:space-between;align-items:baseline}'
    + '.cv-proj-name{font-weight:bold;font-size:11pt}'
    + '.cv-proj-link{font-size:9pt;color:' + ac + '}'
    + '.cv-proj-desc{font-size:10pt;color:#555;margin-top:4px;line-height:1.5}'
    + '.cv-langs{font-size:10pt;color:#333;line-height:1.8}'
    + '.cv-ach-list{list-style:none;padding:0}'
    + '.cv-ach-list li{padding:4px 0;font-size:10pt;color:#444}'
    + '.cv-ach-list li::before{content:"✦ ";color:' + ac + '}'
    + '.cv-ach-list li em{color:#888;font-style:normal}'
    + '.cv-contact-row{display:flex;flex-wrap:wrap;gap:20px;font-size:10pt;color:#333}'
    + '@media print{body{padding:20px 30px}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}'
    + '</style></head><body>'
    + '<header class="cv-header">'
    + '<div class="cv-name">' + e(data.name||'Your Name') + '</div>'
    + '<div class="cv-title">' + e(data.jobTitle||'Your Title') + '</div>'
    + '<div class="cv-contacts">'
    + (data.email ? '<span>📧 ' + e(data.email) + '</span>' : '')
    + (data.phone ? '<span>📱 ' + e(data.phone) + '</span>' : '')
    + (data.location ? '<span>📍 ' + e(data.location) + '</span>' : '')
    + (data.github ? '<span>🐙 ' + e(data.github.replace('https://','')) + '</span>' : '')
    + (data.linkedin ? '<span>💼 ' + e(data.linkedin.replace('https://','')) + '</span>' : '')
    + '</div></header>'
    + (data.bio ? '<section class="cv-section"><div class="cv-section-title">Professional Summary</div><p class="cv-bio">' + e(data.bio) + '</p></section>' : '')
    + (education ? '<section class="cv-section"><div class="cv-section-title">Education</div>' + education + '</section>' : '')
    + (experience ? '<section class="cv-section"><div class="cv-section-title">Experience</div>' + experience + '</section>' : '')
    + (skills ? '<section class="cv-section"><div class="cv-section-title">Technical Skills</div><div class="cv-skills">' + skills + '</div></section>' : '')
    + (projects ? '<section class="cv-section"><div class="cv-section-title">Projects</div>' + projects + '</section>' : '')
    + (languages ? '<section class="cv-section"><div class="cv-section-title">Languages</div><p class="cv-langs">' + languages + '</p></section>' : '')
    + (achievements ? '<section class="cv-section"><div class="cv-section-title">Achievements</div><ul class="cv-ach-list">' + achievements + '</ul></section>' : '')
    + '</body></html>';
}

function _escCC(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
