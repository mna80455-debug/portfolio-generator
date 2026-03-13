/* Template: Terminal — Developer Aesthetic Portfolio */

function generateTerminalHTML(data, accentColor, font) {
  var ac = '#00FF41';
  var e = _escT;

  var skills = (data.skills||[]).map(function(s){ return '> installing ' + e(s) + '... [DONE]'; }).join('\n');
  var projects = (data.projects||[]).filter(function(p){return p.name;}).map(function(p){
    return '<div class="term-block"><span class="prompt">~/projects/' + e(p.name).toLowerCase().replace(/\s+/g,'-') + '</span>\n<span class="output">' + e(p.description) + '</span>' + (p.url?'\n<a href="'+e(p.url)+'" target="_blank">' + e(p.url) + '</a>':'') + '</div>';
  }).join('');
  var education = (data.education||[]).filter(function(x){return x.school;}).map(function(x){
    return '<div class="term-line"><span class="prompt">$ cat education/' + (e(x.year)||'recent') + '</span>\n<span class="output">' + e(x.degree) + ' @ ' + e(x.school) + '</span></div>';
  }).join('');
  var experience = (data.experience||[]).filter(function(x){return x.company;}).map(function(x){
    return '<div class="term-line"><span class="prompt">$ work --at "' + e(x.company) + '" --role "' + e(x.role) + '"</span>\n<span class="output">' + e(x.duration) + '</span>' + (x.description?'\n<span class="output dim">' + e(x.description) + '</span>':'') + '</div>';
  }).join('');
  var languages = (data.languages||[]).filter(function(l){return l.language;}).map(function(l){
    return '  ' + e(l.language).padEnd(16,' ') + ' [' + e(l.level) + ']';
  }).join('\n');
  var achievements = (data.achievements||[]).filter(function(a){return a.title;}).map(function(a){
    return '  ✦ ' + e(a.title) + (a.issuer ? ' — ' + e(a.issuer) : '');
  }).join('\n');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(data.name) + ' — Terminal</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}'
    + 'body{font-family:"JetBrains Mono",monospace;background:#0C0C0C;color:#00FF41;-webkit-font-smoothing:antialiased;'
    + 'font-size:' + (data.fontSize || 13) + 'px;'
    + 'line-height:' + (data.lineHeight || 1.8) + ';'
    + 'font-weight:' + (data.fontWeight || 400) + ';'
    + 'letter-spacing:' + (data.letterSpacing || 0) + 'px;}'
    + 'a{color:#00FF41;text-decoration:underline}a:hover{color:#33FF66}'
    + '.term{max-width:800px;margin:0 auto;padding:40px 24px}'
    + '.term-header{padding:8px 16px;background:#1a1a1a;border-radius:8px 8px 0 0;display:flex;align-items:center;gap:8px;margin-bottom:0}'
    + '.dot{width:12px;height:12px;border-radius:50%;display:inline-block}'
    + '.dot-r{background:#FF5F56}.dot-y{background:#FFBD2E}.dot-g{background:#27C93F}'
    + '.term-title{color:#666;font-size:12px;margin-left:auto}'
    + '.term-body{background:#111;border:1px solid #222;border-top:none;border-radius:0 0 8px 8px;padding:24px;white-space:pre-wrap;word-break:break-word}'
    + '.section{margin-bottom:32px}'
    + '.section-title{color:#555;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;border-bottom:1px solid #1a1a1a;padding-bottom:8px}'
    + '.prompt{color:#00FF41;font-weight:700}'
    + '.prompt::before{content:"❯ ";color:#00FF41}'
    + '.output{color:#ccc;display:block;padding-left:18px}'
    + '.output.dim{color:#666}'
    + '.cursor{display:inline-block;width:8px;height:15px;background:#00FF41;animation:blink 1s step-end infinite;vertical-align:middle;margin-left:4px}'
    + '@keyframes blink{50%{opacity:0}}'
    + '.ascii{color:#333;font-size:11px;text-align:center;margin:32px 0}'
    + '.term-block{margin-bottom:16px}'
    + '.term-line{margin-bottom:12px}'
    + '.highlight{color:#FFBD2E}'
    + '.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
    + '.info-label{color:#555}'
    + '.info-value{color:#00FF41}'
    + 'footer{text-align:center;color:#333;padding:24px;font-size:11px}'
    + '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    + '@media(max-width:600px){.info-grid{grid-template-columns:1fr}}'
    + '</style></head><body>'
    + '<div class="term">'
    + '<div class="term-header"><span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span><span class="term-title">' + e(data.name||'portfolio') + '@terminal</span></div>'
    + '<div class="term-body">'

    // Header
    + '<div class="section">'
    + '<span class="prompt">whoami</span>\n'
    + '<span class="output" style="color:#00FF41;font-size:20px;font-weight:700">' + e(data.name||'Anonymous') + '</span>\n'
    + (data.jobTitle ? '<span class="output highlight">' + e(data.jobTitle) + '</span>\n' : '')
    + (data.bio ? '<span class="output dim">' + e(data.bio) + '</span>\n' : '')
    + '</div>'

    + '<div class="ascii">═══════════════════════════════════════════════</div>'

    // Skills
    + (skills ? '<div class="section"><div class="section-title">// Skills</div><span class="prompt">npm install --save-dev</span>\n' + skills + '\n<span class="output" style="color:#27C93F">✓ All packages installed</span></div>' : '')

    // Education
    + (education ? '<div class="section"><div class="section-title">// Education</div>' + education + '</div>' : '')

    // Experience
    + (experience ? '<div class="section"><div class="section-title">// Experience</div>' + experience + '</div>' : '')

    // Projects
    + (projects ? '<div class="section"><div class="section-title">// Projects</div>' + projects + '</div>' : '')

    // Languages
    + (languages ? '<div class="section"><div class="section-title">// Languages</div><span class="prompt">cat /etc/languages.conf</span>\n' + languages + '</div>' : '')

    // Achievements
    + (achievements ? '<div class="section"><div class="section-title">// Achievements</div><span class="prompt">ls ~/achievements/</span>\n' + achievements + '</div>' : '')

    // Contact
    + '<div class="section"><div class="section-title">// Contact</div>'
    + '<div class="info-grid">'
    + (data.email ? '<div><span class="info-label">email:</span> <span class="info-value">' + e(data.email) + '</span></div>' : '')
    + (data.phone ? '<div><span class="info-label">phone:</span> <span class="info-value">' + e(data.phone) + '</span></div>' : '')
    + (data.location ? '<div><span class="info-label">location:</span> <span class="info-value">' + e(data.location) + '</span></div>' : '')
    + (data.github ? '<div><span class="info-label">github:</span> <a href="' + e(data.github) + '">' + e(data.github.replace('https://github.com/','')) + '</a></div>' : '')
    + (data.linkedin ? '<div><span class="info-label">linkedin:</span> <a href="' + e(data.linkedin) + '">Profile</a></div>' : '')
    + (data.website ? '<div><span class="info-label">website:</span> <a href="' + e(data.website) + '">' + e(data.website.replace('https://','')) + '</a></div>' : '')
    + '</div></div>'
    + '<div id="gh-placeholder" style="margin-top:20px"></div>'
    + '<script>'
    + 'if(window.parent.getGitHubWidgetHTML) {'
    + '  window.parent.getGitHubWidgetHTML("' + e(data.github) + '", "#00FF41").then(html => {'
    + '    if(html) document.getElementById("gh-placeholder").innerHTML = html;'
    + '  });'
    + '}'
    + '</script>'
    + '\n<span class="prompt">exit</span><span class="cursor"></span>'
    + '</div></div>'
    + '<footer>Generated with Portfolio Terminal v1.0</footer></body></html>';
}

function _escT(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
