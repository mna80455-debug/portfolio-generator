/* Template: Paper — Light Editorial Portfolio */

function generatePaperHTML(data, accentColor, font) {
  var ac = accentColor || '#00F5A0';
  var f = font || 'DM Sans';
  var e = _escP;

  var photo = data.photo
    ? '<img src="' + e(data.photo) + '" alt="' + e(data.name) + '" class="paper-photo" />'
    : '';

  var socials = [];
  if (data.github) socials.push('<a href="' + e(data.github) + '" target="_blank" rel="noopener">GitHub</a>');
  if (data.linkedin) socials.push('<a href="' + e(data.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
  if (data.twitter) socials.push('<a href="' + e(data.twitter) + '" target="_blank" rel="noopener">Twitter</a>');
  if (data.website) socials.push('<a href="' + e(data.website) + '" target="_blank" rel="noopener">Website</a>');

  var skills = (data.skills||[]).map(function(s){ return e(s); }).join(' · ');
  var projects = (data.projects||[]).filter(function(p){return p.name;}).map(function(p, i){
    return '<div class="proj-item"><span class="proj-num">0' + (i+1) + '</span><div><h3>' + e(p.name) + '</h3><p>' + e(p.description) + '</p>' + (p.url ? '<a href="' + e(p.url) + '" target="_blank">View Project →</a>' : '') + '</div></div>';
  }).join('');
  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="paper-entry"><div class="pe-row"><strong>' + e(x.degree) + '</strong><em>' + e(x.year) + '</em></div><p class="pe-sub">' + e(x.school) + '</p></div>';
  }).join('');
  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="paper-entry"><div class="pe-row"><strong>' + e(x.role) + '</strong><em>' + e(x.duration) + '</em></div><p class="pe-company">' + e(x.company) + '</p>' + (x.description ? '<p class="pe-desc">' + e(x.description) + '</p>' : '') + '</div>';
  }).join('');
  var languages = (data.languages||[]).filter(function(l){return l.language;}).map(function(l){
    return e(l.language) + ' <em class="lang-level">(' + e(l.level) + ')</em>';
  }).join(' · ');
  var achievements = (data.achievements||[]).filter(function(a){return a.title;}).map(function(a){
    return '<li><strong>' + e(a.title) + '</strong>' + (a.issuer ? ' — <em>' + e(a.issuer) + '</em>' : '') + '</li>';
  }).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(data.name) + '</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=' + f.replace(/ /g,'+') + ':wght@300;400;500;600&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}'
    + 'body{font-family:"' + f + '",Georgia,serif;background:#FAFAF8;color:#1a1a1a;line-height:1.85;-webkit-font-smoothing:antialiased}'
    + 'a{color:' + ac + ';text-decoration:none;transition:opacity .2s}'
    + 'a:hover{opacity:.7}'
    + '.wrap{max-width:680px;margin:0 auto;padding:72px 24px 48px}'
    + 'header{margin-bottom:56px;text-align:center}'
    + '.paper-photo{width:100px;height:100px;border-radius:50%;object-fit:cover;filter:grayscale(100%);transition:filter .4s;margin-bottom:20px}'
    + '.paper-photo:hover{filter:grayscale(0%)}'
    + 'header h1{font-family:"Playfair Display",Georgia,serif;font-size:2.6rem;font-weight:800;color:#111;letter-spacing:-1px;line-height:1.1;margin-bottom:6px}'
    + 'header .subtitle{font-size:1rem;color:' + ac + ';font-weight:400;margin-bottom:14px}'
    + 'header .bio{color:#555;font-size:0.92rem;max-width:480px;margin:0 auto}'
    + 'hr{border:none;height:1px;background:#e0ddd8;margin:0}'
    + 'section{padding:32px 0}'
    + 'section h2{font-family:"Playfair Display",Georgia,serif;font-size:0.95rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#111;margin-bottom:20px;position:relative;display:inline-block}'
    + 'section h2::after{content:"";position:absolute;bottom:-4px;left:0;width:100%;height:2px;background:' + ac + '}'
    + '.skills-text{color:#444;font-size:0.92rem;letter-spacing:.3px}'
    + '.proj-item{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid #eee}'
    + '.proj-num{font-family:"Playfair Display",serif;font-size:1.4rem;font-weight:800;color:#ddd;line-height:1}'
    + '.proj-item h3{font-family:"Playfair Display",serif;font-size:1rem;font-weight:700;color:#111;margin-bottom:4px}'
    + '.proj-item p{font-size:0.86rem;color:#666;margin-bottom:6px}'
    + '.paper-entry{padding:14px 0;border-bottom:1px solid #eee}'
    + '.pe-row{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}'
    + '.pe-row strong{font-size:0.95rem;color:#111}'
    + '.pe-row em{font-size:0.82rem;color:' + ac + ';font-style:normal}'
    + '.pe-sub{font-size:0.86rem;color:#888;margin-top:2px}'
    + '.pe-company{font-size:0.86rem;color:' + ac + ';margin-top:2px}'
    + '.pe-desc{font-size:0.84rem;color:#666;margin-top:6px;line-height:1.6}'
    + '.lang-level{color:#888;font-style:normal}'
    + '.ach-list{list-style:none;padding:0}'
    + '.ach-list li{padding:8px 0;border-bottom:1px solid #eee;font-size:0.9rem;color:#444}'
    + '.ach-list li::before{content:"✦ ";color:' + ac + '}'
    + '.ach-list li strong{color:#111}'
    + '.contact-line{color:#444;font-size:0.9rem;display:flex;flex-wrap:wrap;gap:20px}'
    + '.social-links{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px}'
    + 'footer{text-align:center;padding:48px 0 16px;color:#bbb;font-size:0.72rem;font-style:italic}'
    + '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    + '@media(max-width:600px){.wrap{padding:40px 16px 24px}header h1{font-size:1.8rem}}'
    + '</style></head><body><div class="wrap">'
    + '<header>' + photo + '<h1>' + e(data.name) + '</h1>'
    + (data.jobTitle ? '<div class="subtitle">' + e(data.jobTitle) + '</div>' : '')
    + (data.bio ? '<p class="bio">' + e(data.bio) + '</p>' : '')
    + '</header><hr>'
    + (skills ? '<section><h2>Skills</h2><p class="skills-text">' + skills + '</p></section><hr>' : '')
    + (education ? '<section><h2>Education</h2>' + education + '</section><hr>' : '')
    + (experience ? '<section><h2>Experience</h2>' + experience + '</section><hr>' : '')
    + (projects ? '<section><h2>Projects</h2>' + projects + '</section><hr>' : '')
    + (languages ? '<section><h2>Languages</h2><p class="skills-text">' + languages + '</p></section><hr>' : '')
    + (achievements ? '<section><h2>Achievements</h2><ul class="ach-list">' + achievements + '</ul></section><hr>' : '')
    + '<section><h2>Contact</h2><div class="contact-line">'
    + (data.email ? '<span>✉ <a href="mailto:' + e(data.email) + '">' + e(data.email) + '</a></span>' : '')
    + (data.phone ? '<span>☎ ' + e(data.phone) + '</span>' : '')
    + (data.location ? '<span>📍 ' + e(data.location) + '</span>' : '')
    + '</div>'
    + (socials.length ? '<div class="social-links">' + socials.join(' · ') + '</div>' : '')
    + '</section>'
    + '<div id="gh-placeholder" style="max-width:680px;margin:0 auto"></div>'
    + '<script>'
    + 'if(window.parent.getGitHubWidgetHTML) {'
    + '  window.parent.getGitHubWidgetHTML("' + e(data.github) + '", "' + ac + '").then(html => {'
    + '    if(html) document.getElementById("gh-placeholder").innerHTML = html;'
    + '  });'
    + '}'
    + '</script>'
    + '<footer>Crafted with care</footer></div></body></html>';
}

function _escP(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
