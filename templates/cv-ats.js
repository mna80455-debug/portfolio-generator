/* Template: CV ATS — Maximum Readability for Bots & Humans */

function generateCVATSHTML(data, accentColor, font) {
  var ac = accentColor || '#2563EB';
  var e = _escATS;
  var lang = data.language || 'en';

  var labels = {
    en: { edu: 'Education', exp: 'Experience', skills: 'Skills', proj: 'Projects', lang: 'Languages', ach: 'Achievements' },
    ar: { edu: 'التعليم', exp: 'الخبرة العملية', skills: 'المهارات', proj: 'المشاريع', lang: 'اللغات', ach: 'الإنجازات' }
  }[lang];

  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="entry"><strong>' + e(x.degree) + '</strong> | ' + e(x.school) + ' <span class="date">' + e(x.year) + '</span></div>';
  }).join('');

  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="entry"><strong>' + e(x.role) + '</strong> | ' + e(x.company) + ' <span class="date">' + e(x.duration) + '</span>'
      + (x.description ? '<p class="desc">' + e(x.description) + '</p>' : '') + '</div>';
  }).join('');

  return '<!DOCTYPE html><html lang="' + lang + '" dir="' + (lang==='ar'?'rtl':'ltr') + '"><head><meta charset="UTF-8"><title>' + e(data.name) + '</title>'
    + '<style>'
    + 'body{font-family:"' + font + '",Arial,sans-serif;color:#111;line-height:'+(data.lineHeight||1.5)+';padding:40px;max-width:850px;margin:0 auto;font-size:'+(data.fontSize||11)+'pt}'
    + 'h1{font-size:24pt;margin-bottom:5px;text-align:center;border-bottom:2px solid #000;padding-bottom:10px}'
    + '.contact{text-align:center;font-size:10pt;margin-bottom:30px;display:flex;justify-content:center;gap:15px;flex-wrap:wrap}'
    + 'section{margin-bottom:20px}'
    + 'h2{font-size:13pt;text-transform:uppercase;border-bottom:1px solid #ccc;margin-bottom:10px;padding-bottom:3px}'
    + '.entry{margin-bottom:12px;position:relative}'
    + '.date{float:'+(lang==='ar'?'left':'right')+';font-weight:normal;color:#444}'
    + '.desc{margin-top:5px;font-size:10pt;color:#333;text-align:justify}'
    + '.skills-list{column-count:3;font-size:10pt}'
    + '@media print{body{padding:0} .date{float:'+(lang==='ar'?'left':'right')+' !important}}'
    + '</style></head><body>'
    + '<h1>' + e(data.name || 'Name') + '</h1>'
    + '<div class="contact">'
    + (data.email ? '<span>' + e(data.email) + '</span>' : '')
    + (data.phone ? '<span>' + e(data.phone) + '</span>' : '')
    + (data.location ? '<span>' + e(data.location) + '</span>' : '')
    + (data.linkedin ? '<span>LinkedIn</span>' : '')
    + '</div>'
    + (data.bio ? '<section><h2>Summary</h2><p class="desc">' + e(data.bio) + '</p></section>' : '')
    + (experience ? '<section><h2>' + labels.exp + '</h2>' + experience + '</section>' : '')
    + (education ? '<section><h2>' + labels.edu + '</h2>' + education + '</section>' : '')
    + (data.skills && data.skills.length ? '<section><h2>' + labels.skills + '</h2><div class="skills-list">' + data.skills.map(s => '• ' + e(s)).join('<br>') + '</div></section>' : '')
    + '</body></html>';
}

function _escATS(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
