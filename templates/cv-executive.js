/* Template: CV Executive — Premium Serif Design */

function generateCVExecutiveHTML(data, accentColor, font) {
  var ac = accentColor || '#1A202C';
  var e = _escExec;
  var lang = data.language || 'en';

  var labels = {
    en: { edu: 'Education', exp: 'Experience', skills: 'Expertise', proj: 'Key Projects', lang: 'Languages', ach: 'Selected Achievements' },
    ar: { edu: 'المسار الأكاديمي', exp: 'الخبرة القيادية', skills: 'مجالات الخبرة', proj: 'المشاريع الاستراتيجية', lang: 'اللغات', ach: 'أبرز الإنجازات' }
  }[lang];

  return '<!DOCTYPE html><html lang="' + lang + '" dir="' + (lang==='ar'?'rtl':'ltr') + '"><head><meta charset="UTF-8"><title>' + e(data.name) + '</title>'
    + '<style>'
    + 'body{font-family:"Playfair Display", serif;color:#1A202C;line-height:1.6;padding:50px;max-width:900px;margin:0 auto;background:#fff;font-size:'+(data.fontSize||11)+'pt}'
    + '.header{text-align:center;margin-bottom:40px;border-bottom:3px double #ddd;padding-bottom:20px}'
    + 'h1{font-size:28pt;letter-spacing:2px;margin-bottom:10px;text-transform:uppercase}'
    + '.subtitle{font-size:12pt;font-style:italic;color:'+ac+';margin-bottom:15px}'
    + '.contact{font-family:"Inter", sans-serif;font-size:9pt;display:flex;justify-content:center;gap:20px;color:#4A5568}'
    + 'h2{font-size:14pt;border-left:4px solid '+ac+';padding-left:15px;margin:30px 0 15px;text-transform:uppercase;letter-spacing:1px}'
    + '[dir="rtl"] h2{border-left:0;border-right:4px solid '+ac+';padding-left:0;padding-right:15px}'
    + '.entry{margin-bottom:20px;font-family:"Inter", sans-serif}'
    + '.entry-header{display:flex;justify-content:space-between;font-weight:700;margin-bottom:5px}'
    + '.company{color:'+ac+';font-style:italic}'
    + '.desc{font-size:10pt;color:#2D3748;margin-top:5px}'
    + '.skills-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-family:"Inter", sans-serif;font-size:10pt}'
    + '</style></head><body>'
    + '<div class="header">'
    + '<h1>' + e(data.name || 'EXECUTIVE NAME') + '</h1>'
    + '<div class="subtitle">' + e(data.jobTitle || 'Strategic Leader') + '</div>'
    + '<div class="contact">'
    + (data.email ? '<span>' + e(data.email) + '</span>' : '')
    + (data.phone ? '<span>' + e(data.phone) + '</span>' : '')
    + (data.location ? '<span>' + e(data.location) + '</span>' : '')
    + '</div></div>'
    + (data.bio ? '<section><h2>Executive Summary</h2><p class="desc">' + e(data.bio) + '</p></section>' : '')
    + (data.experience ? '<section><h2>' + labels.exp + '</h2>' + data.experience.map(x => 
        '<div class="entry"><div class="entry-header"><span>'+e(x.role)+'</span><span>'+e(x.duration)+'</span></div>'
        + '<div class="company">'+e(x.company)+'</div><p class="desc">'+e(x.description)+'</p></div>').join('') + '</section>' : '')
    + (data.skills && data.skills.length ? '<section><h2>' + labels.skills + '</h2><div class="skills-grid">' + data.skills.map(s => '• ' + e(s)).join('') + '</div></section>' : '')
    + '</body></html>';
}

function _escExec(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
