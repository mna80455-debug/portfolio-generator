/* ================================================================
   Portfolio Generator — app.js
   Professional-level application logic
   ================================================================ */

// ============================================
// 🔑 API KEYS — ضعي المفاتيح هنا
// ============================================
const CONFIG = {
  CLAUDE_API_KEY: 'YOUR_CLAUDE_API_KEY',   // console.anthropic.com
  GITHUB_TOKEN:   '',                       // github.com/settings/tokens (اختياري)
};
// ============================================

function hasClaudeKey() {
  return CONFIG.CLAUDE_API_KEY !== 'YOUR_CLAUDE_API_KEY'
      && CONFIG.CLAUDE_API_KEY.length > 10;
}

async function callClaude(prompt, maxTokens) {
  maxTokens = maxTokens || 500;
  if (!hasClaudeKey()) throw new Error('NO_API_KEY');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CONFIG.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'API Error');
  return data.content[0].text.trim();
}

function setButtonLoading(btn, isLoading, loadingText) {
  if (!btn) return;
  if (isLoading) {
    btn._originalText = btn.textContent;
    btn.textContent = loadingText;
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.textContent = btn._originalText || loadingText;
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

function triggerDownload(blob, filename) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
}

function slugify(name) {
  return (name || 'portfolio').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

(function() {
  'use strict';

  // ─── State ───
  let uploadedPhotoBase64 = null;
  let outputType = 'portfolio'; // 'portfolio' or 'cv'
  const state = {
    skills: [],
    projects: [{ name: '', description: '', url: '' }],
    education: [],
    experience: [],
    languages: [],
    achievements: [],
    template: 'midnight'
  };

  // ─── Template Definitions ───
  const portfolioTemplates = [
    { id: 'midnight',  name: 'Midnight',  badge: '🌙 Dark' },
    { id: 'paper',     name: 'Paper',     badge: '📰 Light' },
    { id: 'neon',      name: 'Neon',      badge: '⚡ Bold' },
    { id: 'aurora',    name: 'Aurora',    badge: '🌈 Gradient' },
    { id: 'terminal',  name: 'Terminal',  badge: '💻 Dev' },
    { id: 'magazine',  name: 'Magazine',  badge: '🗞️ Editorial' },
  ];

  const cvTemplates = [
    { id: 'cv-classic',    name: 'Classic',      badge: '🏢 Corporate' },
    { id: 'cv-modern',     name: 'Modern',       badge: '✨ Clean' },
    { id: 'cv-ats',        name: 'ATS Master',   badge: '🤖 Global' },
    { id: 'cv-executive',  name: 'Executive',    badge: '💎 Elite' },
  ];

  // ─── DOM Refs ───
  const $ = id => document.getElementById(id);
  const fullName      = $('fullName');
  const jobTitle      = $('jobTitle');
  const bio           = $('bio');
  const bioCount      = $('bioCount');
  const location_     = $('location');
  const email         = $('email');
  const phone         = $('phone');
  const skillInput    = $('skillInput');
  const skillsWrap    = $('skillsWrapper');
  const projContainer = $('projectsContainer');
  const addProjBtn    = $('addProjectBtn');
  const eduContainer  = $('educationContainer');
  const addEduBtn     = $('addEduBtn');
  const expContainer  = $('experienceContainer');
  const addExpBtn     = $('addExpBtn');
  const langContainer = $('languagesContainer');
  const addLangBtn    = $('addLangBtn');
  const achContainer  = $('achievementsContainer');
  const addAchBtn     = $('addAchBtn');
  const github        = $('github');
  const linkedin      = $('linkedin');
  const twitter       = $('twitter');
  const website       = $('website');
  const primaryColor  = $('primaryColor');
  const colorHex      = $('colorHex');
  const fontSelect    = $('fontSelect');
  const fontSize      = $('fontSize');
  const fontWeight    = $('fontWeight');
  const lineHeight    = $('lineHeight');
  const letterSpacing = $('letterSpacing');
  const generateBtn   = $('generateBtn');
  const downloadBtn   = $('downloadBtn');
  const downloadPdfBtn = $('downloadPdfBtn');
  const resetBtn      = $('resetBtn');
  const previewFrame  = $('previewFrame');
  const previewCol    = $('previewColumn');
  const formCol       = $('formColumn');
  const progressFill  = $('progressFill');
  const progressText  = $('progressText');

  // ─── Debounce ───
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay || 300);
    };
  }
  const debouncedUpdatePreview = debounce(function() {
    try {
      var html = generateCurrentTemplate();
      if (!html) throw new Error('Generated HTML is empty');
      previewFrame.srcdoc = html;
      
      // Force opacity back if onload takes too long or fails
      const resetOpacity = () => {
        previewFrame.style.opacity = '1';
        previewFrame.style.transform = 'scale(1)';
      };
      
      previewFrame.onload = resetOpacity;
      setTimeout(resetOpacity, 1000); 
    } catch (err) {
      console.error('Preview error:', err);
      previewFrame.style.opacity = '1';
    }
  }, 300);

  // ═══════════════════════════════════════════
  //  Toast Notifications
  // ═══════════════════════════════════════════
  function showToast(message, type) {
    type = type || 'success';
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' toast-error' : '');
    toast.innerHTML = '<span class="toast-icon">' + (type === 'success' ? '✅' : '❌') + '</span><span>' + message + '</span>';
    $('toastContainer').appendChild(toast);
    setTimeout(function() { toast.classList.add('show'); }, 10);
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  // ═══════════════════════════════════════════
  //  Photo Upload
  // ═══════════════════════════════════════════
  function initPhotoUpload() {
    const area = $('photoUploadArea');
    const input = $('photoInput');
    const preview = $('photoPreviewImg');
    const placeholder = $('uploadPlaceholder');
    const removeBtn = $('removePhotoBtn');

    area.addEventListener('click', function(e) {
      if (e.target !== removeBtn && !removeBtn.contains(e.target)) input.click();
    });

    area.addEventListener('dragover', function(e) {
      e.preventDefault();
      area.classList.add('drag-over');
    });
    area.addEventListener('dragleave', function() { area.classList.remove('drag-over'); });
    area.addEventListener('drop', function(e) {
      e.preventDefault();
      area.classList.remove('drag-over');
      var file = e.dataTransfer.files[0];
      if (file) handlePhotoFile(file);
    });

    input.addEventListener('change', function() {
      if (input.files[0]) handlePhotoFile(input.files[0]);
    });

    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      uploadedPhotoBase64 = null;
      preview.style.display = 'none';
      placeholder.style.display = 'flex';
      removeBtn.style.display = 'none';
      input.value = '';
      updatePreview();
    });
  }

  function handlePhotoFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file only', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error');
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      uploadedPhotoBase64 = e.target.result;
      var preview = $('photoPreviewImg');
      var placeholder = $('uploadPlaceholder');
      var removeBtn = $('removePhotoBtn');
      preview.src = uploadedPhotoBase64;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      removeBtn.style.display = 'flex';
      updatePreview();
      showToast('Photo uploaded!');
    };
    reader.readAsDataURL(file);
  }

  // ─── Progress Bar ───
  function updateProgress() {
    var filled = 0, total = 7;
    if (fullName.value.trim()) filled++;
    if (email.value.trim()) filled++;
    if (state.skills.length > 0) filled++;
    if (jobTitle.value.trim()) filled++;
    if (bio.value.trim()) filled++;
    if (state.education.length > 0 && state.education.some(function(e){return e.school;})) filled++;
    if (state.projects.some(function(p){return p.name;})) filled++;
    var pct = Math.round((filled / total) * 100);
    progressFill.style.width = pct + '%';
    progressText.textContent = pct + '%';
  }

  // ─── Collect form data ───
  function collectData() {
    return {
      name:        fullName.value.trim(),
      jobTitle:    jobTitle.value.trim(),
      bio:         bio.value.trim(),
      photo:       uploadedPhotoBase64 || '',
      location:    location_.value.trim(),
      email:       email.value.trim(),
      phone:       phone.value.trim(),
      skills:      state.skills.slice(),
      projects:    state.projects.map(function(p){ return {name:p.name, description:p.description, url:p.url}; }),
      education:   state.education.map(function(e){ return {school:e.school, degree:e.degree, year:e.year}; }),
      experience:  state.experience.map(function(e){ return {company:e.company, role:e.role, duration:e.duration, description:e.description}; }),
      languages:   state.languages.map(function(l){ return {language:l.language, level:l.level}; }),
      achievements:state.achievements.map(function(a){ return {title:a.title, issuer:a.issuer}; }),
      github:      github.value.trim(),
      linkedin:    linkedin.value.trim(),
      twitter:     twitter.value.trim(),
      website:     website.value.trim(),
      template:    state.template,
      outputType:  outputType,
      accentColor: primaryColor.value,
      font:        fontSelect.value,
      fontSize:    fontSize.value,
      fontWeight:  fontWeight.value,
      lineHeight:  lineHeight.value,
      letterSpacing: letterSpacing.value,
      language:    cvLanguage
    };
  }

  // ─── Generate template ───
  function generateCurrentTemplate() {
    var data = collectData();
    var pc   = primaryColor.value;
    var font = fontSelect.value;
    switch (state.template) {
      case 'paper':      return generatePaperHTML(data, pc, font);
      case 'neon':       return generateNeonHTML(data, pc, font);
      case 'aurora':     return generateAuroraHTML(data, pc, font);
      case 'terminal':   return generateTerminalHTML(data, pc, font);
      case 'magazine':   return generateMagazineHTML(data, pc, font);
      case 'cv-classic':   return generateCVClassicHTML(data, pc, font);
      case 'cv-modern':    return generateCVModernHTML(data, pc, font);
      case 'cv-ats':       return generateCVATSHTML(data, pc, font);
      case 'cv-executive': return generateCVExecutiveHTML(data, pc, font);
      default:           return generateMidnightHTML(data, pc, font);
    }
  }

  // ─── Update preview ───
  function updatePreview() {
    previewFrame.style.opacity = '0.4';
    previewFrame.style.transform = 'scale(0.99)';
    debouncedUpdatePreview();
    updateProgress();
    updateScoreUI();
  }

  // ─── Bio ───
  bio.addEventListener('input', function() {
    var count = bio.value.length;
    bioCount.textContent = count;
    var el = bio.closest('.field').querySelector('.char-count');
    if (count > 280) el.classList.add('near-limit');
    else el.classList.remove('near-limit');
  });

  // ─── Color ───
  primaryColor.addEventListener('input', function() {
    colorHex.textContent = primaryColor.value.toUpperCase();
  });

  // Typography sliders update labels and preview
  [fontSize, fontWeight, lineHeight, letterSpacing].forEach(input => {
    input.addEventListener('input', function() {
      const valSpan = $('val' + input.id.charAt(0).toUpperCase() + input.id.slice(1));
      if (valSpan) valSpan.textContent = input.value;
      updatePreview();
    });
  });
  fontSelect.addEventListener('change', updatePreview);

  // ═══════════════════════════════════════════
  //  Output Type Selector + Dynamic Template Grid
  // ═══════════════════════════════════════════
  function setOutputType(type) {
    outputType = type;
    document.querySelectorAll('.output-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    // Reset template to first of the new type
    var templates = type === 'portfolio' ? portfolioTemplates : cvTemplates;
    state.template = templates[0].id;
    renderTemplateGrid();
    updatePreview();
  }

  function renderTemplateGrid() {
    var grid = $('templateGrid');
    var templates = outputType === 'portfolio' ? portfolioTemplates : cvTemplates;

    grid.innerHTML = templates.map(function(t) {
      return '<div class="template-card ' + (state.template === t.id ? 'active' : '') + '" data-template="' + t.id + '" tabindex="0" role="radio" aria-checked="' + (state.template === t.id) + '">'
        + '<div class="template-thumbnail ' + t.id + '-thumb"></div>'
        + '<div class="template-info">'
        + '<span class="template-name">' + t.name + '</span>'
        + '<span class="template-badge">' + t.badge + '</span>'
        + '</div></div>';
    }).join('');

    // Bind click events
    grid.querySelectorAll('.template-card').forEach(function(card) {
      card.addEventListener('click', function() {
        selectTemplate(card.dataset.template);
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });
    });
  }

  function selectTemplate(templateId) {
    state.template = templateId;
    renderTemplateGrid();
    updatePreview();
  }

  // Output type button listeners
  document.querySelectorAll('.output-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setOutputType(btn.dataset.type);
    });
  });

  // ═══════════════════════════════════════════
  //  Skills
  // ═══════════════════════════════════════════
  function addSkill(text) {
    text = text.trim();
    if (!text || state.skills.indexOf(text) !== -1) return;
    state.skills.push(text);
    renderSkills();
    updatePreview();
  }
  function removeSkill(idx) {
    state.skills.splice(idx, 1);
    renderSkills();
    updatePreview();
  }
  function renderSkills() {
    skillsWrap.querySelectorAll('.skill-tag').forEach(function(t){t.remove();});
    state.skills.forEach(function(skill, i) {
      var tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.innerHTML = escHTML(skill) + ' <button type="button" class="remove-tag" aria-label="Remove ' + escHTML(skill) + '">&times;</button>';
      tag.querySelector('.remove-tag').addEventListener('click', function(){removeSkill(i);});
      skillsWrap.insertBefore(tag, skillInput);
    });
    if (state.skills.length > 0) $('skillsField').classList.remove('has-error');
  }
  skillInput.addEventListener('keydown', function(e) {
    if (e.key==='Enter'||e.key===',') {
      e.preventDefault();
      addSkill(skillInput.value.replace(/,/g,''));
      skillInput.value = '';
    }
    if (e.key==='Backspace' && !skillInput.value && state.skills.length) removeSkill(state.skills.length-1);
  });
  skillsWrap.addEventListener('click', function(){skillInput.focus();});

  // ═══════════════════════════════════════════
  //  Repeatable Section Helpers
  // ═══════════════════════════════════════════
  function bindInputs(container, selector, arr, prop) {
    container.querySelectorAll(selector).forEach(function(el) {
      el.addEventListener('input', function(e) {
        arr[+e.target.dataset.idx][prop] = e.target.value;
        updatePreview();
      });
    });
  }

  // ── Education ──
  function renderEducation() {
    eduContainer.innerHTML = '';
    state.education.forEach(function(edu, i) {
      var b = document.createElement('div'); b.className = 'project-block';
      b.innerHTML = '<div class="project-block-header"><span>Education ' + (i+1) + '</span><button type="button" class="btn-remove-project" data-idx="' + i + '">✕</button></div>'
        + '<div class="field"><label>School / University</label><input type="text" class="edu-school form-input" data-idx="' + i + '" value="' + escAttr(edu.school) + '" placeholder="e.g. Cairo University"></div>'
        + '<div class="field"><label>Degree</label><input type="text" class="edu-degree form-input" data-idx="' + i + '" value="' + escAttr(edu.degree) + '" placeholder="e.g. BSc Computer Science"></div>'
        + '<div class="field"><label>Year</label><input type="text" class="edu-year form-input" data-idx="' + i + '" value="' + escAttr(edu.year) + '" placeholder="e.g. 2020 - 2024"></div>';
      eduContainer.appendChild(b);
      b.querySelector('.btn-remove-project').addEventListener('click', function(){state.education.splice(i,1);renderEducation();updatePreview();});
    });
    bindInputs(eduContainer, '.edu-school', state.education, 'school');
    bindInputs(eduContainer, '.edu-degree', state.education, 'degree');
    bindInputs(eduContainer, '.edu-year', state.education, 'year');
    addEduBtn.style.display = state.education.length >= 3 ? 'none' : '';
  }
  addEduBtn.addEventListener('click', function(){if(state.education.length<3){state.education.push({school:'',degree:'',year:''});renderEducation();}});

  // ── Experience ──
  function renderExperience() {
    expContainer.innerHTML = '';
    state.experience.forEach(function(exp, i) {
      var b = document.createElement('div'); b.className = 'project-block';
      b.innerHTML = '<div class="project-block-header"><span>Experience ' + (i+1) + '</span><button type="button" class="btn-remove-project" data-idx="' + i + '">✕</button></div>'
        + '<div class="field"><label>Company</label><input type="text" class="exp-company form-input" data-idx="' + i + '" value="' + escAttr(exp.company) + '" placeholder="e.g. Google"></div>'
        + '<div class="field"><label>Role</label><input type="text" class="exp-role form-input" data-idx="' + i + '" value="' + escAttr(exp.role) + '" placeholder="e.g. Software Engineer"></div>'
        + '<div class="field"><label>Duration</label><input type="text" class="exp-duration form-input" data-idx="' + i + '" value="' + escAttr(exp.duration) + '" placeholder="e.g. Jan 2022 – Present"></div>'
        + '<div class="field"><label>Description</label><textarea class="exp-desc form-input" data-idx="' + i + '" rows="2" placeholder="What did you do?">' + escHTML(exp.description) + '</textarea></div>';
      expContainer.appendChild(b);
      b.querySelector('.btn-remove-project').addEventListener('click', function(){state.experience.splice(i,1);renderExperience();updatePreview();});
    });
    bindInputs(expContainer, '.exp-company', state.experience, 'company');
    bindInputs(expContainer, '.exp-role', state.experience, 'role');
    bindInputs(expContainer, '.exp-duration', state.experience, 'duration');
    bindInputs(expContainer, '.exp-desc', state.experience, 'description');
    addExpBtn.style.display = state.experience.length >= 4 ? 'none' : '';
  }
  addExpBtn.addEventListener('click', function(){if(state.experience.length<4){state.experience.push({company:'',role:'',duration:'',description:''});renderExperience();}});

  // ── Projects ──
  function renderProjects() {
    projContainer.innerHTML = '';
    state.projects.forEach(function(proj, i) {
      var b = document.createElement('div'); b.className = 'project-block';
      b.innerHTML = '<div class="project-block-header"><span>Project ' + (i+1) + '</span>' + (i>0?'<button type="button" class="btn-remove-project" data-idx="'+i+'">✕</button>':'') + '</div>'
        + '<div class="field"><label>Name</label><input type="text" class="proj-name form-input" data-idx="' + i + '" value="' + escAttr(proj.name) + '" placeholder="e.g. My App"></div>'
        + '<div class="field"><label>Description</label><textarea class="proj-desc form-input" data-idx="' + i + '" rows="2" placeholder="Brief description…">' + escHTML(proj.description) + '</textarea></div>'
        + '<div class="field"><label>URL</label><input type="url" class="proj-url form-input" data-idx="' + i + '" value="' + escAttr(proj.url) + '" placeholder="https://github.com/…"></div>';
      projContainer.appendChild(b);
      var rm = b.querySelector('.btn-remove-project');
      if (rm) rm.addEventListener('click', function(){state.projects.splice(i,1);renderProjects();updatePreview();});
    });
    bindInputs(projContainer, '.proj-name', state.projects, 'name');
    bindInputs(projContainer, '.proj-desc', state.projects, 'description');
    bindInputs(projContainer, '.proj-url', state.projects, 'url');
    addProjBtn.style.display = state.projects.length >= 4 ? 'none' : '';
  }
  addProjBtn.addEventListener('click', function(){if(state.projects.length<4){state.projects.push({name:'',description:'',url:''});renderProjects();}});

  // ── Languages ──
  function renderLanguages() {
    langContainer.innerHTML = '';
    state.languages.forEach(function(lang, i) {
      var r = document.createElement('div'); r.className = 'lang-row';
      r.innerHTML = '<div class="field"><label>Language</label><input type="text" class="lang-name form-input" data-idx="' + i + '" value="' + escAttr(lang.language) + '" placeholder="e.g. English"></div>'
        + '<div class="field"><label>Level</label><select class="lang-level form-input" data-idx="' + i + '">'
        + '<option value="Native"' + (lang.level==='Native'?' selected':'') + '>Native</option>'
        + '<option value="Fluent"' + (lang.level==='Fluent'?' selected':'') + '>Fluent</option>'
        + '<option value="Advanced"' + (lang.level==='Advanced'?' selected':'') + '>Advanced</option>'
        + '<option value="Intermediate"' + (lang.level==='Intermediate'?' selected':'') + '>Intermediate</option>'
        + '<option value="Beginner"' + (lang.level==='Beginner'?' selected':'') + '>Beginner</option>'
        + '</select></div>'
        + '<button type="button" class="btn-remove-project" data-idx="' + i + '">✕</button>';
      langContainer.appendChild(r);
      r.querySelector('.btn-remove-project').addEventListener('click', function(){state.languages.splice(i,1);renderLanguages();updatePreview();});
    });
    bindInputs(langContainer, '.lang-name', state.languages, 'language');
    langContainer.querySelectorAll('.lang-level').forEach(function(el) {
      el.addEventListener('change', function(e){state.languages[+e.target.dataset.idx].level=e.target.value;updatePreview();});
    });
    addLangBtn.style.display = state.languages.length >= 6 ? 'none' : '';
  }
  addLangBtn.addEventListener('click', function(){if(state.languages.length<6){state.languages.push({language:'',level:'Fluent'});renderLanguages();}});

  // ── Achievements ──
  function renderAchievements() {
    achContainer.innerHTML = '';
    state.achievements.forEach(function(ach, i) {
      var b = document.createElement('div'); b.className = 'achievement-block';
      b.innerHTML = '<div class="project-block-header"><span>Achievement ' + (i+1) + '</span><button type="button" class="btn-remove-project" data-idx="' + i + '">✕</button></div>'
        + '<div class="field"><label>Title</label><input type="text" class="ach-title form-input" data-idx="' + i + '" value="' + escAttr(ach.title) + '" placeholder="e.g. AWS Certified"></div>'
        + '<div class="field"><label>Issuer</label><input type="text" class="ach-issuer form-input" data-idx="' + i + '" value="' + escAttr(ach.issuer) + '" placeholder="e.g. Amazon"></div>';
      achContainer.appendChild(b);
      b.querySelector('.btn-remove-project').addEventListener('click', function(){state.achievements.splice(i,1);renderAchievements();updatePreview();});
    });
    bindInputs(achContainer, '.ach-title', state.achievements, 'title');
    bindInputs(achContainer, '.ach-issuer', state.achievements, 'issuer');
    addAchBtn.style.display = state.achievements.length >= 6 ? 'none' : '';
  }
  addAchBtn.addEventListener('click', function(){if(state.achievements.length<6){state.achievements.push({title:'',issuer:''});renderAchievements();}});

  // ═══════════════════════════════════════════
  //  Validation
  // ═══════════════════════════════════════════
  function validate() {
    var valid = true;
    var nf = fullName.closest('.field');
    if (!fullName.value.trim()) { nf.classList.add('has-error'); valid = false; } else nf.classList.remove('has-error');
    var ef = email.closest('.field');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { ef.classList.add('has-error'); valid = false; } else ef.classList.remove('has-error');
    if (state.skills.length === 0) { $('skillsField').classList.add('has-error'); valid = false; } else $('skillsField').classList.remove('has-error');
    if (!valid) {
      var first = document.querySelector('.has-error');
      if (first) first.scrollIntoView({behavior:'smooth',block:'center'});
      showToast('Please fix the highlighted fields','error');
    }
    return valid;
  }

  // ═══════════════════════════════════════════
  //  FEATURE 1: AI Bio Generator (Offline)
  // ═══════════════════════════════════════════
  var bioTemplates = [
    function(n,t,s){ return 'I\'m ' + n + ', a ' + t + ' who builds clean, scalable solutions' + (s ? ' with ' + s : '') + '. I turn ideas into real products that users love.'; },
    function(n,t,s){ return t + ' with a focus on' + (s ? ' ' + s + ' and' : '') + ' delivering high-quality work. I help teams ship faster and build smarter.'; },
    function(n,t,s){ return 'Hi, I\'m ' + n + '. As a ' + t + ', I craft' + (s ? ' ' + s + '-powered' : '') + ' solutions that make a real impact. Let\'s build something great.'; },
    function(n,t,s){ return n + ' here — ' + t + ' specialized in' + (s ? ' ' + s + '.' : ' building modern digital products.') + ' I focus on quality, performance, and clean code.'; },
    function(n,t,s){ return 'I design and build digital experiences as a ' + t + '.' + (s ? ' My toolkit includes ' + s + '.' : '') + ' Every project I touch gets better.'; },
    function(n,t,s){ return t + ' who turns complex problems into elegant solutions.' + (s ? ' Skilled in ' + s + '.' : '') + ' Currently open to exciting new opportunities.'; },
    function(n,t,s){ return 'I\'m ' + n + ' — a results-driven ' + t + (s ? ' working with ' + s : '') + '. I believe great products come from great attention to detail.'; },
    function(n,t,s){ return 'Creative ' + t + ' with a keen eye for detail.' + (s ? ' Experienced in ' + s + '.' : '') + ' I build things that work beautifully and perform flawlessly.'; }
  ];

  $('aiBioBtn').addEventListener('click', function() {
    var name = fullName.value.trim();
    var title = jobTitle.value.trim();
    var btn = $('aiBioBtn');

    if (!name || !title) {
      showToast('Enter your name and job title first ✍️', 'error');
      return;
    }

    var topSkills = state.skills.slice(0, 3).join(', ') || '';
    var tmpl = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
    var bioText = tmpl(name, title, topSkills);
    if (bioText.length > 300) bioText = bioText.substring(0, 297) + '...';

    btn.classList.add('loading');
    btn.querySelector('.ai-text').textContent = 'Writing...';

    setTimeout(function() {
      bio.value = '';
      var idx = 0;
      var typeInterval = setInterval(function() {
        if (idx < bioText.length) {
          bio.value += bioText[idx];
          bioCount.textContent = bio.value.length;
          idx++;
        } else {
          clearInterval(typeInterval);
          updatePreview();
          showToast('Bio generated ✨');
          btn.classList.remove('loading');
          btn.querySelector('.ai-text').textContent = 'Write with AI';
        }
      }, 25);
    }, 400);
  });

  // ═══════════════════════════════════════════
  //  FEATURE 2: Portfolio Score (ALL fields)
  // ═══════════════════════════════════════════
  function calculateScore() {
    var score = 0;
    var tips = [];

    var fields = {
      name:     fullName.value.trim(),
      title:    jobTitle.value.trim(),
      bio:      bio.value.trim(),
      email:    email.value.trim(),
      phone:    phone.value.trim(),
      location: location_.value.trim(),
      github:   github.value.trim(),
      linkedin: linkedin.value.trim(),
      twitter:  twitter.value.trim(),
      website:  website.value.trim(),
    };

    // Required — high value
    if (fields.name)                              score += 20;
    else tips.push({ icon: '👤', text: 'أضيفي اسمك الكامل (+20 نقطة)', field: 'fullName' });

    if (fields.title)                             score += 15;
    else tips.push({ icon: '💼', text: 'أضيفي مسماك الوظيفي (+15 نقطة)', field: 'jobTitle' });

    if (fields.bio && fields.bio.length > 80)     score += 15;
    else if (fields.bio)                          { score += 7; tips.push({ icon: '✍️', text: 'البايو قصير — اكتبي أكتر (+8 نقط)', field: 'bio' }); }
    else tips.push({ icon: '✍️', text: 'أضيفي نبذة عنك (+15 نقطة)', field: 'bio' });

    if (uploadedPhotoBase64)                      score += 10;
    else tips.push({ icon: '📸', text: 'أضيفي صورتك الشخصية (+10 نقط)', field: 'photoUploadArea' });

    if (fields.email)                             score += 8;
    else tips.push({ icon: '📧', text: 'أضيفي إيميلك (+8 نقط)', field: 'email' });

    // Skills
    if (state.skills.length >= 6)                 score += 12;
    else if (state.skills.length >= 3)            { score += 7; tips.push({ icon: '🛠️', text: 'أضيفي ' + (6 - state.skills.length) + ' مهارات أكتر (+5 نقط)', field: 'skillInput' }); }
    else if (state.skills.length > 0)             { score += 3; tips.push({ icon: '🛠️', text: 'أضيفي مهارات أكتر (+9 نقط)', field: 'skillInput' }); }
    else tips.push({ icon: '🛠️', text: 'أضيفي مهاراتك (+12 نقطة)', field: 'skillInput' });

    // Projects
    var filledProjects = state.projects.filter(function(p){ return p.name && p.description; }).length;
    if (filledProjects >= 3)                      score += 10;
    else if (filledProjects >= 1)                 { score += 5; tips.push({ icon: '🚀', text: 'أضيفي ' + (3 - filledProjects) + ' مشاريع أكتر (+5 نقط)', field: 'projectsContainer' }); }
    else tips.push({ icon: '🚀', text: 'أضيفي مشروع واحد على الأقل (+10 نقط)', field: 'projectsContainer' });

    // Social
    var socials = [fields.github, fields.linkedin, fields.twitter, fields.website].filter(Boolean).length;
    if (socials >= 2)                             score += 10;
    else if (socials === 1)                       { score += 5; tips.push({ icon: '🔗', text: 'أضيفي رابط سوشيال تاني (+5 نقط)', field: 'github' }); }
    else tips.push({ icon: '🔗', text: 'أضيفي GitHub أو LinkedIn (+10 نقط)', field: 'github' });

    // Bonus
    if (fields.location)                          score += 3;
    else tips.push({ icon: '📍', text: 'أضيفي موقعك الجغرافي (+3 نقط)', field: 'location' });

    if (fields.phone)                             score += 2;

    return { score: Math.min(score, 100), tips: tips };
  }

  function animateNumber(el, from, to, duration) {
    var start = performance.now();
    function update(time) {
      var progress = Math.min((time - start) / duration, 1);
      el.textContent = Math.round(from + (to - from) * progress);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function updateScoreUI() {
    var result = calculateScore();
    var score = result.score;
    var tips = result.tips;
    var scoreEl = $('scoreNumber');
    var barEl = $('scoreBar');
    var tipsEl = $('scoreTips');
    var labelEl = $('scoreLabel');

    var current = parseInt(scoreEl.textContent) || 0;
    animateNumber(scoreEl, current, score, 400);

    var color, label;
    if (score < 40)      { color = '#FC8181'; label = 'Beginner'; }
    else if (score < 70) { color = '#F6AD55'; label = 'Good'; }
    else if (score < 90) { color = '#68D391'; label = 'Professional'; }
    else                 { color = '#68D391'; label = '⭐ Excellent!'; }

    barEl.style.width = score + '%';
    barEl.style.background = color;
    labelEl.textContent = label;
    labelEl.style.color = color;

    // Clickable tips
    tipsEl.innerHTML = tips.slice(0, 3).map(function(t) {
      return '<div class="score-tip" onclick="window._focusField(\'' + t.field + '\')" role="button">'
        + '<span class="tip-icon">' + t.icon + '</span>'
        + '<span>' + t.text + '</span>'
        + '<span class="tip-arrow">→</span>'
        + '</div>';
    }).join('');

    // Update FAB score
    var fab = $('fabScore');
    if (fab) {
      fab.textContent = score + '%';
      fab.style.background = score > 70 ? 'var(--success)' : score > 40 ? 'var(--warning)' : 'var(--danger)';
    }

    // Update progress bar
    if (progressFill) progressFill.style.width = score + '%';
    if (progressText) progressText.textContent = score + '%';
  }

  // Focus field from tip click
  window._focusField = function(fieldId) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function() { el.focus(); }, 400);
  };

  // ═══════════════════════════════════════════
  //  FEATURE 3: Version History
  // ═══════════════════════════════════════════
  var VERSION_KEY = 'portfolio_versions';
  var MAX_VERSIONS = 5;

  function getVersions() {
    try {
      return JSON.parse(localStorage.getItem(VERSION_KEY)) || [];
    } catch(e) { return []; }
  }

  function saveVersion() {
    var data = collectData();
    var versions = getVersions();
    var newVersion = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      data: data,
      preview: (data.name || 'Untitled') + ' — ' + (data.jobTitle || 'No title')
    };
    versions.unshift(newVersion);
    var trimmed = versions.slice(0, MAX_VERSIONS);
    localStorage.setItem(VERSION_KEY, JSON.stringify(trimmed));
    renderVersionHistory();
  }

  function restoreVersion(id) {
    var versions = getVersions();
    var version = null;
    for (var i = 0; i < versions.length; i++) {
      if (versions[i].id === id) { version = versions[i]; break; }
    }
    if (!version) return;
    fillFormWithData(version.data);
    updatePreview();
    updateScoreUI();
    showToast('Version restored ✅');
  }

  function deleteVersion(id) {
    var versions = getVersions().filter(function(v) { return v.id !== id; });
    localStorage.setItem(VERSION_KEY, JSON.stringify(versions));
    renderVersionHistory();
    showToast('Version deleted');
  }

  function renderVersionHistory() {
    var versions = getVersions();
    var list = $('versionList');
    var count = $('versionCount');
    count.textContent = versions.length;

    if (versions.length === 0) {
      list.innerHTML = '<p class="no-versions">No saved versions yet</p>';
      return;
    }

    list.innerHTML = versions.map(function(v, i) {
      return '<div class="version-item">'
        + '<div class="version-info">'
        + '<span class="version-name">' + escHTML(v.preview || 'Version ' + (i+1)) + '</span>'
        + '<span class="version-time">' + escHTML(v.timestamp) + '</span>'
        + '</div>'
        + '<div class="version-actions">'
        + '<button class="btn-restore" data-vid="' + v.id + '">Restore</button>'
        + '<button class="btn-delete-v" data-vid="' + v.id + '">✕</button>'
        + '</div></div>';
    }).join('');

    list.querySelectorAll('.btn-restore').forEach(function(btn) {
      btn.addEventListener('click', function() { restoreVersion(+btn.dataset.vid); });
    });
    list.querySelectorAll('.btn-delete-v').forEach(function(btn) {
      btn.addEventListener('click', function() { deleteVersion(+btn.dataset.vid); });
    });
  }

  $('versionHeaderBtn').addEventListener('click', function() {
    var list = $('versionList');
    var arrow = $('versionArrow');
    list.classList.toggle('hidden');
    arrow.classList.toggle('open');
  });

  // ─── Fill form from data ───
  function fillFormWithData(data) {
    fullName.value = data.name || '';
    jobTitle.value = data.jobTitle || '';
    bio.value = data.bio || '';
    bioCount.textContent = (data.bio || '').length;
    location_.value = data.location || '';
    email.value = data.email || '';
    phone.value = data.phone || '';
    github.value = data.github || '';
    linkedin.value = data.linkedin || '';
    twitter.value = data.twitter || '';
    website.value = data.website || '';

    if (data.photo) {
      uploadedPhotoBase64 = data.photo;
      $('photoPreviewImg').src = data.photo;
      $('photoPreviewImg').style.display = 'block';
      $('uploadPlaceholder').style.display = 'none';
      $('removePhotoBtn').style.display = 'flex';
    } else {
      uploadedPhotoBase64 = null;
      $('photoPreviewImg').style.display = 'none';
      $('uploadPlaceholder').style.display = 'flex';
      $('removePhotoBtn').style.display = 'none';
    }

    state.skills = (data.skills || []).slice();
    renderSkills();

    state.projects = (data.projects && data.projects.length > 0)
      ? data.projects.map(function(p){return {name:p.name||'',description:p.description||'',url:p.url||''};})
      : [{name:'',description:'',url:''}];
    renderProjects();

    state.education = (data.education || []).map(function(e){return {school:e.school||'',degree:e.degree||'',year:e.year||''};});
    renderEducation();

    state.experience = (data.experience || []).map(function(e){return {company:e.company||'',role:e.role||'',duration:e.duration||'',description:e.description||''};});
    renderExperience();

    state.languages = (data.languages || []).map(function(l){return {language:l.language||'',level:l.level||'Fluent'};});
    renderLanguages();

    state.achievements = (data.achievements || []).map(function(a){return {title:a.title||'',issuer:a.issuer||''};});
    renderAchievements();

    // Template and customization
    if (data.outputType) {
      outputType = data.outputType;
      document.querySelectorAll('.output-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.type === outputType);
      });
    }
    if (data.template) {
      state.template = data.template;
    }
    renderTemplateGrid();

    if (data.accentColor) {
      primaryColor.value = data.accentColor;
      colorHex.textContent = data.accentColor.toUpperCase();
    }
    if (data.font) {
      fontSelect.value = data.font;
    }
  }

  // ═══════════════════════════════════════════
  //  FEATURE 4: Shareable Link
  // ═══════════════════════════════════════════
  function generateShareableLink() {
    var data = collectData();
    if (data.photo && data.photo.length > 100000) {
      showToast('Photo too large for link — link will work without photo', 'error');
      data.photo = '';
    }

    try {
      var json = JSON.stringify(data);
      var compressed = btoa(unescape(encodeURIComponent(json)));
      var url = window.location.origin + window.location.pathname + '?p=' + compressed;

      $('shareBox').style.display = 'flex';
      $('shareUrl').value = url;
      
      // Generate QR Code
      generateQRCode(url);

      navigator.clipboard.writeText(url).then(function() {
        showToast('Link copied! 🔗');
      }).catch(function() {
        showToast('Link generated — copy it manually', 'success');
      });
    } catch(e) {
      console.error(e);
      showToast('Could not generate share link', 'error');
    }
  }

  function checkForSharedPortfolio() {
    var params = new URLSearchParams(window.location.search);
    var encoded = params.get('p');
    if (!encoded) return;

    try {
      var json = decodeURIComponent(escape(atob(encoded)));
      var data = JSON.parse(json);
      fillFormWithData(data);
      updatePreview();
      updateScoreUI();
      showToast('Shared portfolio loaded ✅');
      $('sharedBanner').style.display = 'flex';
    } catch (e) {
      console.error('Invalid share link', e);
    }
  }

  window._clearSharedPortfolio = function() {
    window.history.replaceState({}, '', window.location.pathname);
    $('sharedBanner').style.display = 'none';
    resetBtn.click();
  };

  $('copyShareBtn').addEventListener('click', function() {
    generateShareableLink();
  });

  // ═══════════════════════════════════════════
  //  Generate & Download
  // ═══════════════════════════════════════════
  generateBtn.addEventListener('click', function() {
    if (!validate()) return;
    generateBtn.classList.add('loading');
    generateBtn.textContent = '⏳ Generating...';
    setTimeout(function() {
      updatePreview();
      saveVersion();
      downloadBtn.classList.remove('hidden');
      downloadPdfBtn.classList.remove('hidden');
      generateBtn.classList.remove('loading');
      generateBtn.textContent = '✨ Generate Portfolio';
      showToast('Portfolio generated successfully!');
      generateShareableLink();
    }, 600);
  });

  downloadBtn.addEventListener('click', function() {
    var html = generateCurrentTemplate();
    var name = fullName.value.trim() || 'portfolio';
    var suffix = (outputType === 'cv') ? '-cv' : '-portfolio';
    var blob = new Blob([html], {type:'text/html'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name.replace(/\s+/g,'-').toLowerCase() + suffix + '.html';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('HTML file downloaded!');
  });

  downloadPdfBtn.addEventListener('click', function() {
    var html = generateCurrentTemplate();
    var w = window.open('','_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(function(){ w.print(); }, 500);
  });

  // ═══════════════════════════════════════════
  //  Reset
  // ═══════════════════════════════════════════
  resetBtn.addEventListener('click', function() {
    fullName.value=''; jobTitle.value=''; bio.value=''; bioCount.textContent='0';
    location_.value=''; email.value=''; phone.value='';
    github.value=''; linkedin.value=''; twitter.value=''; website.value='';
    primaryColor.value='#63B3ED'; colorHex.textContent='#63B3ED'; fontSelect.value='Inter';
    uploadedPhotoBase64=null;
    $('photoPreviewImg').style.display='none';
    $('uploadPlaceholder').style.display='flex';
    $('removePhotoBtn').style.display='none';
    $('photoInput').value='';
    state.skills=[]; renderSkills();
    state.projects=[{name:'',description:'',url:''}]; renderProjects();
    state.education=[]; renderEducation();
    state.experience=[]; renderExperience();
    state.languages=[]; renderLanguages();
    state.achievements=[]; renderAchievements();
    outputType='portfolio';
    state.template='midnight';
    document.querySelectorAll('.output-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.type === 'portfolio');
    });
    renderTemplateGrid();
    downloadBtn.classList.add('hidden');
    downloadPdfBtn.classList.add('hidden');
    $('shareBox').style.display='none';
    document.querySelectorAll('.has-error').forEach(function(el){el.classList.remove('has-error');});
    updatePreview();
    showToast('Form reset!');
  });

  // ─── Live update ───
  [fullName, jobTitle, bio, location_, email, phone, github, linkedin, twitter, website, primaryColor, fontSelect].forEach(function(f) {
    if (f) f.addEventListener('input', function(){updatePreview();});
  });

  // ═══════════════════════════════════════════
  //  FINAL UPGRADES: Theme, Import, QR, GitHub, Cover Letter
  // ═══════════════════════════════════════════

  // --- Theme ---
  window.initTheme = function() {
    const saved = localStorage.getItem('theme') || 'dark';
    window.applyTheme(saved);
  };
  window.toggleTheme = function() {
    const current = document.documentElement.dataset.theme || 'dark';
    window.applyTheme(current === 'dark' ? 'light' : 'dark');
  };
  window.applyTheme = function(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    const icon = document.getElementById('themeToggle')?.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  };

  // --- Import JSON ---
  window.triggerImportJSON = function() {
    document.getElementById('jsonImportInput').click();
  };
  window.handleJSONImport = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      showToast('يرجى اختيار ملف JSON فقط ❌', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        fillFormWithData(data);
        updatePreview();
        updateScoreUI();
        saveVersion();
        showToast('تم استيراد البيانات بنجاح ✅', 'success');
      } catch (err) {
        showToast('الملف تالف أو غير صحيح ❌', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // --- QR Code ---
  window.generateQRCode = function(url) {
    if (!url) return;
    const qrSection = document.getElementById('qrSection');
    const qrImg = document.getElementById('qrCodeImg');
    const encodedUrl = encodeURIComponent(url);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&bgcolor=ffffff&color=0a0a0a&margin=10`;
    qrImg.src = qrApiUrl;
    qrImg.onload = () => { qrSection.style.display = 'block'; };
    qrImg.onerror = () => { qrSection.style.display = 'none'; };
  };
  window.downloadQRCode = function() {
    const qrImg = document.getElementById('qrCodeImg');
    const data = collectData();
    const a = document.createElement('a');
    a.href = qrImg.src;
    a.download = `${slugify(data.name || 'portfolio')}-qr.png`;
    a.click();
    showToast('تم تنزيل الـ QR Code 📱', 'success');
  };

  // --- AI Cover Letter ---
  window.generateCoverLetter = async function() {
    const jd = document.getElementById('jobDescInput')?.value.trim();
    const data = collectData();
    const btn = document.getElementById('coverLetterBtn');
    if (!hasClaudeKey()) { showToast('أضيفي Claude API Key 🔑', 'error'); return; }
    if (!data.name || !data.jobTitle) { showToast('أكملي بياناتك الأساسية الأول ✍️', 'error'); return; }
    if (!jd) { showToast('أكتبي الـ Job Description الأول 📋', 'error'); return; }
    setButtonLoading(btn, true, '⏳ جاري الكتابة...');
    const lang = cvLanguage === 'ar' ? 'Arabic' : 'English';
    const prompt = `Write a professional cover letter in ${lang}.\n\nCandidate:\n- Name: ${data.name}\n- Title: ${data.jobTitle}\n- Bio: ${data.bio || ''}\n- Skills: ${data.skills?.join(', ') || ''}\n- Projects: ${data.projects?.filter(p=>p.name).map(p => p.name + ': ' + p.description).join(' | ') || ''}\n- Email: ${data.email || ''}\n\nJob Description:\n${jd.slice(0, 1200)}\n\nRules:\n- 3 paragraphs: opening, value proposition, closing\n- Mention 2-3 specific skills that match the job\n- Professional but warm tone\n- Max 250 words\n- Return ONLY the cover letter text.`;
    try {
      const letter = await callClaude(prompt, 600);
      renderCoverLetter(letter, data.name);
      showToast('تم كتابة الـ Cover Letter ✅', 'success');
    } catch(e) {
      showToast('خطأ في الكتابة — جربي تاني', 'error');
    } finally {
      setButtonLoading(btn, false, '💌 اكتب Cover Letter');
    }
  };
  function renderCoverLetter(letter, name) {
    const panel = document.getElementById('coverLetterPanel');
    panel.style.display = 'block';
    panel.innerHTML = `<div class="cover-letter-box"><div class="cover-letter-header"><span class="cover-letter-title">💌 Cover Letter</span><div class="cover-letter-actions"><button class="cl-btn" onclick="copyCoverLetter()" type="button">📋 نسخ</button><button class="cl-btn" onclick="downloadCoverLetter()" type="button">⬇️ تنزيل</button></div></div><div class="cover-letter-text" id="coverLetterText">${letter.replace(/\n/g, '<br>')}</div><div class="cover-letter-footer"><span class="cl-word-count">${letter.split(' ').length} كلمة</span><span class="cl-tip">💡 راجعيها وعدلي عليها</span></div></div>`;
  }
  window.copyCoverLetter = function() {
    const text = document.getElementById('coverLetterText')?.innerText;
    navigator.clipboard.writeText(text).then(() => showToast('تم النسخ 📋', 'success'));
  };
  window.downloadCoverLetter = function() {
    const text = document.getElementById('coverLetterText')?.innerText;
    const data = collectData();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    triggerDownload(blob, `${slugify(data.name || 'cover')}-letter.txt`);
  };

  // --- GitHub Username & Stats ---
  function extractGitHubUsername(url) {
    if (!url) return null;
    const match = url.match(/github\.com\/([^\/\?]+)/);
    return match ? match[1] : (url.includes('/') ? null : url);
  }
  async function fetchGitHubStats(username) {
    if (!username) return null;
    try {
      const resp = await fetch(`https://api.github.com/users/${username}`);
      if (!resp.ok) return null;
      const user = await resp.json();
      const reposResp = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`);
      const repos = reposResp.ok ? await reposResp.json() : [];
      const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      return { username, name: user.name, avatar: user.avatar_url, repos: user.public_repos, stars, followers: user.followers };
    } catch (e) { return null; }
  }
  // --- GitHub Widget for Templates ---
  window.getGitHubWidgetHTML = async function(githubUrl, accentColor) {
    const username = extractGitHubUsername(githubUrl);
    if (!username) return '';
    const stats = await fetchGitHubStats(username);
    if (!stats) return '';
    return `
      <div class="gh-widget" style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin:20px 0;animation:fadeIn 0.6s ease both">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <img src="${stats.avatar}" style="width:48px;height:48px;border-radius:50%;border:2px solid ${accentColor}" />
          <div>
            <div style="font-weight:700;color:#fff">${stats.name || stats.username}</div>
            <a href="https://github.com/${stats.username}" target="_blank" style="color:${accentColor};font-size:12px">@${stats.username}</a>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          <div style="text-align:center;background:rgba(255,255,255,0.05);padding:10px;border-radius:8px">
            <div style="font-size:18px">📦</div>
            <div style="font-size:20px;font-weight:800;color:${accentColor}">${stats.repos}</div>
            <div style="font-size:10px;color:#888">Repos</div>
          </div>
          <div style="text-align:center;background:rgba(255,255,255,0.05);padding:10px;border-radius:8px">
            <div style="font-size:18px">⭐</div>
            <div style="font-size:20px;font-weight:800;color:${accentColor}">${stats.stars}</div>
            <div style="font-size:10px;color:#888">Stars</div>
          </div>
          <div style="text-align:center;background:rgba(255,255,255,0.05);padding:10px;border-radius:8px">
            <div style="font-size:18px">👥</div>
            <div style="font-size:20px;font-weight:800;color:${accentColor}">${stats.followers}</div>
            <div style="font-size:10px;color:#888">Followers</div>
          </div>
        </div>
      </div>`;
  };

  github?.addEventListener('blur', async function() {
    const username = extractGitHubUsername(this.value);
    if (!username) return;
    const statsEl = document.getElementById('githubStatsPreview');
    if (!statsEl) return;
    statsEl.innerHTML = '<span style="color:var(--text-muted);font-size:12px">⏳ جاري جلب الإحصائيات...</span>';
    statsEl.style.display = 'block';
    const stats = await fetchGitHubStats(username);
    if (stats) {
      statsEl.innerHTML = `<div class="gh-mini-stats"><img src="${stats.avatar}" class="gh-mini-avatar" /><div class="gh-mini-info"><span class="gh-mini-name">${stats.name || username}</span><span class="gh-mini-numbers">📦 ${stats.repos} repos &nbsp; ⭐ ${stats.stars} stars &nbsp; 👥 ${stats.followers} followers</span></div><span class="gh-mini-badge">✓ متصل</span></div>`;
    } else {
      statsEl.innerHTML = '<span style="color:var(--danger);font-size:12px">❌ مش لاقي الـ username ده</span>';
    }
  });

  // --- Global Error Handling ---
  window.addEventListener('error', (e) => {
    console.error('App error:', e.error);
    showToast('حصل خطأ غير متوقع — جربي تحديث الصفحة', 'error');
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise:', e.reason);
    if (e.reason?.message !== 'NO_API_KEY') showToast('خطأ في الاتصال — تأكدي من الإنترنت', 'error');
  });

  // --- Lifecycle Boot ---
  window.addEventListener('load', () => {
    window.initTheme();
    renderVersionHistory();
    checkForSharedPortfolio();
    updateScoreUI();
    setTimeout(() => {
      document.getElementById('appLoader')?.classList.add('hidden');
      setTimeout(() => document.getElementById('appLoader')?.remove(), 450);
    }, 600);
  });

  // ═══════════════════════════════════════════
  //  Mobile Tab Bar
  // ═══════════════════════════════════════════
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var tab = btn.dataset.tab;
      if (tab === 'form') {
        formCol.classList.remove('tab-hidden');
        previewCol.classList.add('tab-hidden');
      } else if (tab === 'preview') {
        formCol.classList.add('tab-hidden');
        previewCol.classList.remove('tab-hidden');
        updatePreview();
      } else if (tab === 'download') {
        formCol.classList.remove('tab-hidden');
        previewCol.classList.add('tab-hidden');
        if (!validate()) return;
        generateBtn.click();
      }
    });
  });

  // ─── Mobile accordion ───
  document.querySelectorAll('.section-header').forEach(function(header) {
    header.addEventListener('click', function() {
      if (window.innerWidth > 768) return;
      var section = header.dataset.section;
      var bodyId = 'body' + section.charAt(0).toUpperCase() + section.slice(1);
      var body = document.getElementById(bodyId);
      var toggle = header.querySelector('.section-header-toggle');
      if (body) body.classList.toggle('collapsed');
      if (toggle) toggle.classList.toggle('collapsed');
    });
  });

  // ─── Helpers ───
  function escHTML(s){return s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):'';} 
  function escAttr(s){return s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';} 

  // ─── Expose for onclick handlers ───
  window.getCurrentFormData = collectData;
  window.addKeywordToSkills = function(kw) {
    if (state.skills.indexOf(kw) === -1) {
      state.skills.push(kw);
      renderSkills();
      updatePreview();
      updateScoreUI();
      showToast('تمت إضافة "' + kw + '" للمهارات ✅');
    }
  };

  // ═══════════════════════════════════════════
  //  FEATURE: ATS Score Analyzer
  // ═══════════════════════════════════════════
  window.analyzeATS = async function() {
    var data = collectData();
    var btn = document.getElementById('atsBtn');
    if (!hasClaudeKey()) { showToast('أضيفي Claude API Key أولاً 🔑', 'error'); return; }
    if (!data.name || !data.jobTitle) { showToast('أكملي البيانات الأساسية الأول ✍️', 'error'); return; }
    setButtonLoading(btn, true, '⏳ جاري التحليل...');
    var prompt = 'You are an ATS expert. Analyze this CV and return ONLY valid JSON:\n'
      + 'Name: ' + data.name + '\nTitle: ' + data.jobTitle + '\nBio: ' + (data.bio||'empty')
      + '\nSkills: ' + (data.skills.join(', ')||'none')
      + '\nProjects: ' + (data.projects.filter(function(p){return p.name;}).map(function(p){return p.name+': '+p.description;}).join(' | ')||'none')
      + '\nHas Photo: ' + (data.photo?'yes':'no') + '\nHas Email: ' + (data.email?'yes':'no')
      + '\nHas LinkedIn: ' + (data.linkedin?'yes':'no') + '\nHas GitHub: ' + (data.github?'yes':'no')
      + '\n\nReturn: {"score":<0-100>,"grade":"<A+|A|B+|B|C|D>","summary":"<Arabic>","issues":[{"severity":"high|medium|low","text":"<Arabic>","fix":"<Arabic>","impact":<num>}],"keywords_missing":["kw"],"keywords_found":["kw"],"strengths":["<Arabic>"]}. Max 5 issues sorted by severity.';
    try {
      var raw = await callClaude(prompt, 800);
      var json = JSON.parse(raw.replace(/```json|```/g, '').trim());
      renderATSResults(json);
      showToast('تم تحليل الـ CV ✅');
    } catch(e) {
      console.error(e);
      showToast('حصل خطأ في التحليل — جربي تاني', 'error');
    } finally {
      setButtonLoading(btn, false, '🤖 تحليل ATS Score');
    }
  };

  function renderATSResults(r) {
    var panel = document.getElementById('atsPanel');
    var gc = {'A+':'#68D391','A':'#68D391','B+':'#F6AD55','B':'#F6AD55','C':'#FC8181','D':'#FC8181'};
    var color = gc[r.grade] || '#FC8181';
    panel.style.display = 'block';
    panel.innerHTML = '<div class="ats-header"><div class="ats-score-circle" style="--score-color:'+color+'"><span class="ats-score-num">'+r.score+'</span><span class="ats-score-label">/ 100</span></div><div class="ats-overview"><div class="ats-grade" style="color:'+color+'">Grade: '+r.grade+'</div><p class="ats-summary">'+r.summary+'</p></div></div>'
      + '<div class="ats-section"><div class="ats-section-title">✅ نقاط القوة</div>' + r.strengths.map(function(s){return '<div class="ats-strength">✓ '+s+'</div>';}).join('') + '</div>'
      + '<div class="ats-section"><div class="ats-section-title">⚠️ مشاكل تحتاج إصلاح</div>' + r.issues.map(function(i){return '<div class="ats-issue ats-'+i.severity+'"><div class="ats-issue-header"><span class="ats-severity-badge">'+(i.severity==='high'?'🔴 عالي':i.severity==='medium'?'🟡 متوسط':'🟢 منخفض')+'</span><span class="ats-impact">+'+i.impact+' نقطة</span></div><p class="ats-issue-text">'+i.text+'</p><p class="ats-fix">💡 '+i.fix+'</p></div>';}).join('') + '</div>'
      + '<div class="ats-keywords"><div class="ats-section-title">🔍 Keywords</div><div class="keywords-row"><span class="kw-label found">موجودة:</span>' + r.keywords_found.map(function(k){return '<span class="kw-chip found">'+k+'</span>';}).join('') + '</div><div class="keywords-row" style="margin-top:8px"><span class="kw-label missing">ناقصة:</span>' + r.keywords_missing.map(function(k){return '<span class="kw-chip missing" onclick="addKeywordToSkills(\''+k+'\')">'+k+' +</span>';}).join('') + '</div></div>';
  }

  // ═══════════════════════════════════════════
  //  FEATURE: Job Description Matcher
  // ═══════════════════════════════════════════
  window.toggleJDMatcher = function() {
    var body = document.getElementById('jdMatcherBody');
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
  };

  window.matchJobDescription = async function() {
    var jd = document.getElementById('jobDescInput').value.trim();
    if (!jd) { showToast('الصق الـ Job Description الأول 📋', 'error'); return; }
    if (!hasClaudeKey()) { showToast('أضيفي Claude API Key 🔑', 'error'); return; }
    var data = collectData();
    var btn = document.querySelector('.btn-match');
    setButtonLoading(btn, true, '⏳ جاري المقارنة...');
    var prompt = 'Compare this CV with the job description. Return ONLY valid JSON.\nCV Title: '+data.jobTitle+'\nSkills: '+data.skills.join(', ')+'\nBio: '+data.bio+'\nProjects: '+data.projects.filter(function(p){return p.name;}).map(function(p){return p.name;}).join(', ')
      + '\n\nJob Description:\n'+jd.slice(0,1500)
      + '\n\nReturn: {"match_percent":<0-100>,"verdict":"<hired|maybe|rejected>","verdict_text":"<Arabic>","keywords_matched":["kw"],"keywords_missing":["kw"],"suggestions":{"title":"<title>","bio_tip":"<Arabic>","skills_to_add":["skill"],"project_tip":"<Arabic>"},"red_flags":["<Arabic>"]}';
    try {
      var raw = await callClaude(prompt, 700);
      var result = JSON.parse(raw.replace(/```json|```/g, '').trim());
      renderJDResults(result);
      var badge = document.getElementById('jdMatchBadge');
      badge.style.display = 'inline';
      badge.textContent = result.match_percent + '%';
      badge.style.background = result.match_percent > 70 ? 'var(--success)' : result.match_percent > 40 ? 'var(--warning)' : 'var(--danger)';
      showToast('تم التحليل ✅');
    } catch(e) {
      showToast('خطأ في التحليل — جربي تاني', 'error');
    } finally {
      setButtonLoading(btn, false, '🎯 تحليل التطابق');
    }
  };

  function renderJDResults(r) {
    var el = document.getElementById('jdResults');
    var vc = r.verdict==='hired'?'var(--success)':r.verdict==='maybe'?'var(--warning)':'var(--danger)';
    el.style.display = 'block';
    el.innerHTML = '<div class="jd-verdict" style="border-color:'+vc+';color:'+vc+'"><span class="jd-percent">'+r.match_percent+'%</span><span>'+r.verdict_text+'</span></div>'
      + '<div class="jd-suggestions"><div class="jd-tip-title">💡 اعمل كده عشان تزيد فرصتك:</div>'
      + (r.suggestions.bio_tip ? '<div class="jd-tip">✍️ البايو: '+r.suggestions.bio_tip+'</div>' : '')
      + (r.suggestions.project_tip ? '<div class="jd-tip">🚀 المشاريع: '+r.suggestions.project_tip+'</div>' : '')
      + (r.suggestions.skills_to_add && r.suggestions.skills_to_add.length ? '<div class="jd-tip">🛠️ أضيفي المهارات دي: '+r.suggestions.skills_to_add.map(function(s){return '<span class="kw-chip missing" onclick="addKeywordToSkills(\''+s+'\')">'+s+' +</span>';}).join('')+'</div>' : '')
      + '</div>'
      + (r.red_flags && r.red_flags.length ? '<div class="jd-redflags"><div class="jd-tip-title">🚩 تحذيرات:</div>'+r.red_flags.map(function(f){return '<div class="jd-tip danger">'+f+'</div>';}).join('')+'</div>' : '');
  }

  // ═══════════════════════════════════════════
  //  FEATURE: Multi-Format Export
  // ═══════════════════════════════════════════
  window.exportHTML = function() {
    var html = generateCurrentTemplate();
    var data = collectData();
    triggerDownload(new Blob([html], {type:'text/html'}), slugify(data.name) + '-portfolio.html');
    showToast('تم تصدير HTML ✅');
  };
  window.exportPDF = function() {
    showToast('جاري تجهيز الـ PDF... 📄');
    setTimeout(function() {
      previewFrame.contentWindow.focus();
      previewFrame.contentWindow.print();
    }, 300);
  };
  window.exportJSON = function() {
    var data = collectData();
    data.exportedAt = new Date().toISOString();
    data.version = '1.0';
    triggerDownload(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}), slugify(data.name) + '-data.json');
    showToast('تم تصدير JSON ✅');
  };
  window.exportTXT = function() {
    var d = collectData();
    var txt = d.name + '\n' + d.jobTitle + '\n' + (d.email||'') + ' | ' + (d.phone||'') + ' | ' + (d.location||'')
      + '\n' + (d.linkedin||'') + ' | ' + (d.github||'')
      + '\n\nSUMMARY\n' + (d.bio||'')
      + '\n\nSKILLS\n' + (d.skills.join(', ')||'')
      + '\n\nPROJECTS\n' + d.projects.filter(function(p){return p.name;}).map(function(p){return p.name + '\n' + (p.description||'') + '\n' + (p.url||'');}).join('\n\n');
    triggerDownload(new Blob([txt.trim()], {type:'text/plain'}), slugify(d.name) + '-cv.txt');
    showToast('تم تصدير TXT ✅ — مناسب للـ ATS');
  };

  // ═══════════════════════════════════════════
  //  FEATURE: Multi-Language Toggle
  // ═══════════════════════════════════════════
  window.cvLanguage = 'ar';
  window.setLanguage = function(lang) {
    window.cvLanguage = lang;
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    updatePreview();
    showToast(lang === 'ar' ? 'تم التحويل للعربية 🇪🇬' : 'Switched to English 🇺🇸');
  };

  // ═══════════════════════════════════════════
  //  FEATURE: Profile Type
  // ═══════════════════════════════════════════
  window.profileType = 'developer';
  window.setProfileType = function(type) {
    window.profileType = type;
    document.querySelectorAll('.profile-type-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    var tips = {
      developer: ['أضيفي GitHub Stats', 'اذكري الـ frameworks', 'أضيفي مشاريع Open Source'],
      student: ['أضيفي الـ GPA لو فوق 3.5', 'اذكري المشاريع الجامعية', 'الأنشطة والـ clubs مهمة'],
      designer: ['أضيفي Behance أو Dribbble', 'اذكري الـ tools زي Figma', 'صورك مهمة جداً'],
      freelancer: ['أضيفي الـ hourly rate', 'اذكري عدد العملاء', 'الـ testimonials بتفرق كتير']
    };
    var el = document.getElementById('profileTips');
    if (el) el.innerHTML = (tips[type]||[]).map(function(t){return '<div class="profile-tip">💡 '+t+'</div>';}).join('');
    updatePreview();
  };

  // ═══════════════════════════════════════════
  //  FEATURE: Interview Prep (Free + AI)
  // ═══════════════════════════════════════════
  window.generateInterviewPrep = async function() {
    var data = collectData();
    var btn = document.getElementById('interviewBtn');
    if (!data.name || !data.skills.length) { showToast('أكمل بياناتك الأول ✍️', 'error'); return; }

    // If Claude key exists, use AI
    if (hasClaudeKey()) {
      setButtonLoading(btn, true, '⏳ جاري التجهيز...');
      var prompt = 'Expert interview coach. Generate interview prep for:\nTitle: '+data.jobTitle+'\nSkills: '+data.skills.join(', ')+'\nBio: '+data.bio+'\nProjects: '+data.projects.filter(function(p){return p.name;}).map(function(p){return p.name+': '+p.description;}).join(' | ')
        + '\n\nReturn ONLY valid JSON: {"questions":[{"q":"<Arabic>","type":"technical|behavioral|situational","ideal_answer":"<Arabic 3-4 sentences>","tip":"<Arabic>"}],"elevator_pitch":"<Arabic 30-sec pitch>","weakness_answer":"<Arabic>","salary_tip":"<Arabic>"}. Generate 5 questions: 2 technical, 2 behavioral, 1 situational.';
      try {
        var raw = await callClaude(prompt, 1000);
        var result = JSON.parse(raw.replace(/```json|```/g, '').trim());
        renderInterviewPrep(result);
        showToast('جاهز للـ Interview! 🎤');
      } catch(e) {
        showToast('خطأ — جرب تاني', 'error');
      } finally {
        setButtonLoading(btn, false, '🎤 جهزني للـ Interview');
      }
      return;
    }

    // FREE fallback — local question bank
    var title = data.jobTitle || 'Software Developer';
    var sk = data.skills.slice(0, 3).join(' و ');
    var questions = [
      {q: 'احكيلي عن نفسك وخبرتك في مجال ' + title, type: 'behavioral', ideal_answer: 'ابدأ بمقدمة قصيرة عن خلفيتك الأكاديمية، ثم اذكر خبرتك العملية الأساسية مع التركيز على المهارات المطلوبة في الوظيفة. اختم بما يميزك عن غيرك.', tip: 'اجعل إجابتك 60-90 ثانية فقط'},
      {q: 'إيه خبرتك في ' + sk + '؟', type: 'technical', ideal_answer: 'اذكر مشاريع محددة استخدمت فيها هذه المهارات. استخدم طريقة STAR (الموقف، المهمة، الإجراء، النتيجة) لتوضيح تأثيرك.', tip: 'استخدم أرقام ونتائج ملموسة'},
      {q: 'إيه أكبر تحدي واجهته في شغلك وإزاي حليته؟', type: 'situational', ideal_answer: 'اختار تحدي حقيقي واشرح السياق والخطوات اللي اتخذتها والنتيجة النهائية. ركز على مهاراتك في حل المشكلات والعمل الجماعي.', tip: 'اختار مثال يبرز مهاراتك القيادية'},
      {q: 'ليه عايز تشتغل معانا؟', type: 'behavioral', ideal_answer: 'ابحث عن الشركة مسبقاً واذكر حاجات محددة تعجبك (المنتج، الثقافة، التكنولوجيا). اربط أهدافك المهنية برؤية الشركة.', tip: 'لازم تكون عارف عن الشركة كويس'},
      {q: 'إزاي بتتعامل مع الضغط والـ deadlines الضيقة؟', type: 'situational', ideal_answer: 'اذكر استراتيجياتك في إدارة الوقت وتحديد الأولويات. أعطِ مثال محدد عن موقف ضغط ونجحت فيه.', tip: 'أظهر إنك بتفكر بشكل منظم'}
    ];
    var result = {
      questions: questions,
      elevator_pitch: 'أنا ' + (data.name||'محترف') + '، ' + title + ' عندي خبرة في ' + sk + '. بركز على تقديم حلول عملية وعالية الجودة وبساعد الفرق تشتغل أسرع وأذكى.',
      weakness_answer: 'نقطة ضعفي هي إني أحياناً بقضي وقت أكتر من اللازم في تحسين التفاصيل الدقيقة. بتعامل مع ده بإني بحدد time-box لكل مهمة وبركز على الأولويات.',
      salary_tip: 'ابحث عن متوسط الرواتب في مجالك ومنطقتك. قدم نطاق (مثلاً 8,000-12,000) مش رقم ثابت. لو سألوك الأول قول "حابب أعرف أكتر عن المسؤوليات قبل ما نتكلم عن الأرقام".'
    };
    renderInterviewPrep(result);
    showToast('جاهز للـ Interview! 🎤 (نسخة مجانية)');
  };

  function renderInterviewPrep(r) {
    var panel = document.getElementById('interviewPanel');
    var tl = {technical:'⚙️ تقني', behavioral:'🧠 سلوكي', situational:'🎯 موقفي'};
    panel.classList.remove('hidden');
    panel.innerHTML = '<div class="interview-section"><div class="interview-title">🗣️ الـ Elevator Pitch</div><div class="elevator-pitch">"'+r.elevator_pitch+'"</div></div>'
      + '<div class="interview-section"><div class="interview-title">❓ أسئلة محتملة</div>'
      + r.questions.map(function(q,i){return '<div class="question-card"><div class="question-header"><span class="q-num">س'+(i+1)+'</span><span class="q-type">'+(tl[q.type]||q.type)+'</span></div><p class="question-text">'+q.q+'</p><details class="answer-details"><summary>اعرض الإجابة المثالية</summary><div class="ideal-answer">'+q.ideal_answer+'</div><div class="q-tip">💡 '+q.tip+'</div></details></div>';}).join('')
      + '</div>'
      + '<div class="interview-section two-col"><div class="interview-card"><div class="interview-title">😅 سؤال الـ Weakness</div><p class="interview-text">'+r.weakness_answer+'</p></div>'
      + '<div class="interview-card"><div class="interview-title">💰 نصيحة الراتب</div><p class="interview-text">'+r.salary_tip+'</p></div></div>';
  }

  // ═══════════════════════════════════════════
  //  FEATURE: ATS Score Analyzer (Free — Local)
  // ═══════════════════════════════════════════
  window.analyzeATS = function() {
    var data = collectData();
    var score = 0; var tips = []; var max = 100;

    // Name (10 pts)
    if (data.name && data.name.length > 2) { score += 10; } else { tips.push({icon:'👤', text:'أضف اسمك الكامل', pts:10}); }
    // Email (10 pts)
    if (data.email && data.email.includes('@')) { score += 10; } else { tips.push({icon:'📧', text:'أضف بريدك الإلكتروني', pts:10}); }
    // Phone (5 pts)
    if (data.phone && data.phone.length > 5) { score += 5; } else { tips.push({icon:'📱', text:'أضف رقم الهاتف', pts:5}); }
    // Location (5 pts)
    if (data.location) { score += 5; } else { tips.push({icon:'📍', text:'أضف الموقع', pts:5}); }
    // Job Title (10 pts)
    if (data.jobTitle && data.jobTitle.length > 2) { score += 10; } else { tips.push({icon:'💼', text:'أضف المسمى الوظيفي', pts:10}); }
    // Bio (15 pts)
    if (data.bio && data.bio.length > 50) { score += 15; }
    else if (data.bio && data.bio.length > 10) { score += 8; tips.push({icon:'📝', text:'اكتب بايو أطول (50+ حرف)', pts:7}); }
    else { tips.push({icon:'📝', text:'اكتب نبذة شخصية', pts:15}); }
    // Skills (15 pts)
    var skillCount = (data.skills||[]).length;
    if (skillCount >= 5) { score += 15; }
    else if (skillCount >= 3) { score += 10; tips.push({icon:'🛠', text:'أضف مهارات أكتر (5+)', pts:5}); }
    else if (skillCount > 0) { score += 5; tips.push({icon:'🛠', text:'أضف مهارات (3+ على الأقل)', pts:10}); }
    else { tips.push({icon:'🛠', text:'أضف مهارات وظيفية', pts:15}); }
    // Education (10 pts)
    var hasEdu = (data.education||[]).some(function(e){return e.school;});
    if (hasEdu) { score += 10; } else { tips.push({icon:'🎓', text:'أضف التعليم', pts:10}); }
    // Experience (10 pts)
    var hasExp = (data.experience||[]).some(function(e){return e.company;});
    if (hasExp) { score += 10; } else { tips.push({icon:'🏢', text:'أضف الخبرة العملية', pts:10}); }
    // Projects (10 pts)
    var hasProj = (data.projects||[]).some(function(p){return p.name;});
    if (hasProj) { score += 10; } else { tips.push({icon:'🚀', text:'أضف مشاريع', pts:10}); }

    // Render
    var color = score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)';
    var label = score >= 80 ? 'ممتاز 🏆' : score >= 60 ? 'جيد 👍' : score >= 40 ? 'مقبول ⚠️' : 'ضعيف ❌';
    var panel = document.getElementById('atsPanel');
    panel.classList.remove('hidden');
    panel.innerHTML = '<div class="ats-result">'
      + '<div class="ats-header"><div class="ats-score-circle" style="border-color:'+color+'"><span class="ats-score-num" style="color:'+color+'">'+score+'</span><span class="ats-score-label">/100</span></div>'
      + '<div class="ats-info"><h3 class="ats-grade" style="color:'+color+'">'+label+'</h3><p class="ats-desc">تحليل مبني على معايير أنظمة التتبع ATS</p></div></div>'
      + (tips.length ? '<div class="ats-tips-title">💡 نصائح لتحسين الـ Score:</div><div class="ats-tips-list">'
        + tips.sort(function(a,b){return b.pts-a.pts;}).map(function(t){return '<div class="ats-tip-item"><span class="ats-tip-icon">'+t.icon+'</span><span class="ats-tip-text">'+t.text+'</span><span class="ats-tip-pts">+'+t.pts+' نقطة</span></div>';}).join('')
        + '</div>' : '<p class="ats-perfect">🎉 بورتفوليو ممتاز! كل الأقسام مكتملة.</p>')
      + '</div>';
    showToast('تم تحليل الـ ATS Score: ' + score + '/100');
  };

  // ═══════════════════════════════════════════
  //  FEATURE: JD Matcher (Free — Local)
  // ═══════════════════════════════════════════
  window.toggleJDMatcher = function() {
    var body = document.getElementById('jdMatcherBody');
    var arrow = document.querySelector('.jd-arrow');
    body.classList.toggle('hidden');
    if (arrow) arrow.textContent = body.classList.contains('hidden') ? '▼' : '▲';
  };

  window.matchJobDescription = function() {
    var jdText = (document.getElementById('jobDescInput').value || '').toLowerCase();
    if (!jdText || jdText.length < 20) { showToast('الصق الـ Job Description الأول ✏️', 'error'); return; }

    var data = collectData();
    // Extract meaningful words from JD
    var stopWords = ['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','shall','would','should','can','could','may','might','must','and','but','or','if','in','on','at','to','for','of','with','by','from','as','into','about','between','through','during','before','after','above','below','under','over','up','down','out','off','then','than','that','this','these','those','it','its','we','our','you','your','they','their','he','she','his','her','i','my','me','no','not','don','t','s','re','ll','ve','d','m','all','each','every','both','few','more','most','other','some','such','only','own','same','so','very','just','because','also','like','well','even','made','after','going','looking','experience','work','working','ability','responsible','responsibilities','requirements','required','required','including','role','team','strong','key','new','good','make','using','used','years','year','join','etc','ideal','candidate','position','job','company','apply'];
    var jdWords = jdText.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '').split(/\s+/).filter(function(w) {
      return w.length > 2 && !stopWords.includes(w);
    });

    // Get unique keywords
    var kwMap = {};
    jdWords.forEach(function(w) { kwMap[w] = (kwMap[w]||0) + 1; });
    var keywords = Object.keys(kwMap).sort(function(a,b){return kwMap[b]-kwMap[a];}).slice(0, 30);

    // Compare with user data
    var userText = [data.name, data.jobTitle, data.bio, data.skills.join(' '),
      data.experience.map(function(e){return e.role+' '+e.company+' '+e.description;}).join(' '),
      data.projects.map(function(p){return p.name+' '+p.description;}).join(' ')
    ].join(' ').toLowerCase();

    var matched = []; var missing = [];
    keywords.forEach(function(kw) {
      if (userText.includes(kw)) matched.push(kw);
      else missing.push(kw);
    });

    var pct = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;
    var color = pct >= 70 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--danger)';

    // Show badge
    var badge = document.getElementById('jdMatchBadge');
    if (badge) { badge.textContent = pct + '%'; badge.classList.remove('hidden'); badge.style.background = color; }

    // Render results
    var panel = document.getElementById('jdResults');
    panel.classList.remove('hidden');
    panel.innerHTML = '<div class="jd-result">'
      + '<div class="jd-score" style="color:'+color+'">'+pct+'% تطابق</div>'
      + '<div class="jd-matched-section"><h4>✅ كلمات موجودة عندك ('+matched.length+')</h4><div class="jd-tags">' + matched.map(function(k){return '<span class="jd-tag matched">'+k+'</span>';}).join('') + '</div></div>'
      + (missing.length ? '<div class="jd-missing-section"><h4>❌ كلمات ناقصة ('+missing.length+')</h4><div class="jd-tags">' + missing.map(function(k){return '<span class="jd-tag missing">'+k+'</span>';}).join('') + '</div><p class="jd-advice">💡 حاول تضيف الكلمات دي في المهارات أو البايو أو وصف الخبرة</p></div>' : '')
      + '</div>';
    showToast('تطابق الـ JD: ' + pct + '%');
  };

  // ═══════════════════════════════════════════
  //  FEATURE: Cover Letter (Free + AI)
  // ═══════════════════════════════════════════
  window.generateCoverLetter = async function() {
    var data = collectData();
    var jdText = (document.getElementById('jobDescInput').value || '').trim();
    var btn = document.getElementById('coverLetterBtn');

    if (!data.name) { showToast('أكمل بياناتك الأول ✍️', 'error'); return; }

    if (hasClaudeKey() && jdText.length > 20) {
      setButtonLoading(btn, true, '⏳ جاري الكتابة...');
      try {
        var prompt = 'Write a professional cover letter in Arabic for:\nName: '+data.name+'\nTitle: '+data.jobTitle+'\nSkills: '+data.skills.join(', ')+'\nBio: '+data.bio+'\nJob Description: '+jdText.substring(0,800)+'\n\nWrite 3-4 paragraphs. Professional tone. Return plain text only.';
        var letter = await callClaude(prompt, 800);
        renderCoverLetter(letter);
        showToast('تم كتابة الـ Cover Letter! 💌');
      } catch(e) {
        generateFreeCoverLetter(data, jdText);
      } finally {
        setButtonLoading(btn, false, '💌 اكتب Cover Letter');
      }
    } else {
      generateFreeCoverLetter(data, jdText);
    }
  };

  function generateFreeCoverLetter(data, jd) {
    var name = data.name || 'المتقدم';
    var title = data.jobTitle || 'الوظيفة';
    var skills = data.skills.slice(0,5).join('، ') || 'مهارات متنوعة';
    var letter = 'السلام عليكم ورحمة الله وبركاته،\n\n'
      + 'أكتب إليكم للتعبير عن اهتمامي بوظيفة ' + title + '. أنا ' + name + '، ولدي خبرة في ' + skills + '.\n\n'
      + (data.bio ? data.bio.substring(0,200) + '\n\n' : '')
      + 'أعتقد أن مهاراتي وخبرتي تجعلني مرشحاً مناسباً لهذه الوظيفة. أتطلع لفرصة مناقشة كيف يمكنني المساهمة في نجاح فريقكم.\n\n'
      + 'مع خالص التقدير،\n' + name;
    renderCoverLetter(letter);
    showToast('تم إنشاء Cover Letter مجاني 💌');
  }

  function renderCoverLetter(text) {
    var panel = document.getElementById('coverLetterPanel');
    panel.classList.remove('hidden');
    panel.innerHTML = '<div class="cover-letter-result">'
      + '<div class="cl-header"><span>💌 Cover Letter</span><button class="btn-copy-cl" onclick="navigator.clipboard.writeText(document.querySelector(\'.cl-text\').textContent);showToast(\'تم نسخ الـ Cover Letter! 📋\')">📋 نسخ</button></div>'
      + '<div class="cl-text" style="white-space:pre-wrap;direction:rtl;text-align:right;padding:16px;background:var(--bg-secondary);border-radius:8px;font-size:0.9rem;line-height:1.8;color:var(--text-primary);border:1px solid var(--border)">' + text.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>'
      + '</div>';
  }

  // ═══════════════════════════════════════════
  //  FEATURE: AI Content Editor
  // ═══════════════════════════════════════════
  window.aiEditContent = async function() {
    var promptInput = document.getElementById('aiPromptInput');
    var instruction = (promptInput ? promptInput.value : '').trim();
    var btn = document.getElementById('aiEditBtn');
    var resultPanel = document.getElementById('aiResultPanel');

    if (!instruction) { showToast('اكتب التعديل اللي عايزه أولاً ✏️', 'error'); return; }

    var data = collectData();

    if (hasClaudeKey()) {
      setButtonLoading(btn, true, '⏳ جاري التعديل...');
      try {
        var prompt = 'You are a portfolio optimizer. Current portfolio data:\n'
          + 'Name: ' + data.name + '\nTitle: ' + data.jobTitle + '\nBio: ' + data.bio + '\nSkills: ' + data.skills.join(', ')
          + '\n\nUser instruction: "' + instruction + '"'
          + '\n\nReturn ONLY valid JSON with the fields to update: {"bio":"...", "jobTitle":"...", "skills":["..."]}. Only include fields that need changing. Write in the same language the user used.';
        var raw = await callClaude(prompt, 600);
        var changes = JSON.parse(raw.replace(/```json|```/g, '').trim());

        // Apply changes
        var applied = [];
        if (changes.bio !== undefined) {
          document.getElementById('bio').value = changes.bio;
          applied.push('✅ تم تعديل البايو');
        }
        if (changes.jobTitle !== undefined) {
          document.getElementById('jobTitle').value = changes.jobTitle;
          applied.push('✅ تم تعديل المسمى الوظيفي');
        }
        if (changes.skills && Array.isArray(changes.skills)) {
          state.skills = changes.skills;
          renderSkills();
          applied.push('✅ تم تعديل المهارات');
        }

        resultPanel.classList.remove('hidden');
        resultPanel.innerHTML = '<div class="ai-result-card success"><div class="ai-result-title">🎉 تم التعديل بنجاح!</div>' + applied.map(function(a){return '<div class="ai-change">'+a+'</div>';}).join('') + '</div>';
        updatePreview();
        showToast('تم تطبيق التعديلات! ✨');
      } catch(e) {
        showFreeAITips(instruction, resultPanel);
      } finally {
        setButtonLoading(btn, false, '✨ نفّذ التعديل');
      }
    } else {
      showFreeAITips(instruction, resultPanel);
    }
  };

  function showFreeAITips(instruction, panel) {
    var tips = [
      '📝 <strong>نصيحة للبايو:</strong> اكتب 2-3 جمل تذكر فيها خبرتك الأساسية والقيمة اللي بتقدمها',
      '🎯 <strong>للمسمى الوظيفي:</strong> استخدم مسمى واضح ومحدد (مثل "Frontend Developer" بدل "Developer")',
      '🛠 <strong>للمهارات:</strong> اذكر 5-8 مهارات محددة ومطلوبة في سوق العمل',
      '💡 <strong>للتحسين:</strong> أضف أرقام ونتائج ملموسة (مثل "حسنت الأداء بنسبة 40%")',
      '🔑 <strong>لاستخدام الـ AI:</strong> أضف Claude API Key في أول الكود لتفعيل التعديل التلقائي'
    ];
    panel.classList.remove('hidden');
    panel.innerHTML = '<div class="ai-result-card info"><div class="ai-result-title">💡 نصائح لتحسين بورتفوليوك</div><p class="ai-note">طلبت: "'+instruction.replace(/</g,'&lt;')+'"</p><div class="ai-tips-list">' + tips.map(function(t){return '<div class="ai-tip">'+t+'</div>';}).join('') + '</div></div>';
    showToast('اطلع على النصائح المجانية 💡');
  }

  // ═══════════════════════════════════════════
  //  FEATURE: Onboarding
  // ═══════════════════════════════════════════
  function initOnboarding() {
    var seen = localStorage.getItem('ob_seen');
    if (seen) return;
    var screen = $('onboardingScreen');
    var mainApp = $('mainApp');
    if (screen) screen.style.display = 'flex';
    if (mainApp) mainApp.style.display = 'none';
    var fab = $('fabContainer');
    if (fab) fab.style.display = 'none';
  }

  window.startOnboarding = function(type) {
    setOutputType(type);
    var screen = $('onboardingScreen');
    screen.style.opacity = '0';
    screen.style.transform = 'scale(1.03)';
    setTimeout(function() {
      screen.style.display = 'none';
      var mainApp = $('mainApp');
      if (mainApp) mainApp.style.display = '';
      var fab = $('fabContainer');
      if (fab) fab.style.display = 'flex';
      localStorage.setItem('ob_seen', '1');
      var msg = type === 'portfolio'
        ? '🌐 هنعمل Portfolio شخصي — ابدأ بكتابة اسمك!'
        : '📄 هنعمل CV احترافي — ابدأ بكتابة اسمك!';
      setTimeout(function() { showToast(msg, 'success'); }, 600);
      setTimeout(function() { if (fullName) fullName.focus(); }, 800);
    }, 350);
  };

  // ═══════════════════════════════════════════
  //  FEATURE: Progress Steps Wizard
  // ═══════════════════════════════════════════
  var STEPS = [
    { id:1, icon:'👤', title:'بياناتك', desc:'الاسم والمعلومات الأساسية', sections:['sectionPersonal'] },
    { id:2, icon:'🛠️', title:'مهاراتك', desc:'المهارات والخبرات', sections:['sectionSkills','sectionExperience','sectionEducation'] },
    { id:3, icon:'🚀', title:'مشاريعك', desc:'المشاريع والإنجازات', sections:['sectionProjects','sectionAchievements','sectionLanguages'] },
    { id:4, icon:'🎨', title:'الشكل', desc:'القالب والألوان', sections:['sectionCustomize','sectionSocial'] }
  ];
  var currentStep = 1;

  function renderProgressWizard() {
    var track = document.querySelector('.steps-track');
    if (!track) return;
    track.innerHTML = STEPS.map(function(step) {
      var cls = (step.id === currentStep ? 'active' : '') + (step.id < currentStep ? ' done' : '');
      var dot = step.id < currentStep ? '✓' : step.icon;
      var line = step.id < STEPS.length ? '<div class="step-line' + (step.id < currentStep ? ' done' : '') + '"></div>' : '';
      return '<div class="step-indicator ' + cls + '" onclick="goToStep(' + step.id + ')"><div class="step-dot">' + dot + '</div><span class="step-label">' + step.title + '</span></div>' + line;
    }).join('');

    var current = STEPS[currentStep - 1];
    var stepTitle = $('stepTitle');
    var stepDesc = $('stepDesc');
    var stepCounter = $('stepCounter');
    if (stepTitle) stepTitle.textContent = current.icon + ' ' + current.title;
    if (stepDesc) stepDesc.textContent = current.desc;
    if (stepCounter) stepCounter.textContent = currentStep + ' / ' + STEPS.length;

    var prevBtn = $('prevBtn');
    if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';

    var nextBtn = $('nextBtn');
    if (nextBtn) {
      if (currentStep === STEPS.length) {
        nextBtn.textContent = '✨ Generate';
        nextBtn.classList.add('final');
        nextBtn.onclick = function() { generateBtn.click(); };
      } else {
        nextBtn.textContent = 'التالي ←';
        nextBtn.classList.remove('final');
        nextBtn.onclick = goToNextStep;
      }
    }
  }

  function showCurrentStepSections() {
    // Hide all form sections
    STEPS.forEach(function(step) {
      step.sections.forEach(function(sectionId) {
        var el = $(sectionId);
        if (el) { el.style.display = 'none'; el.style.animation = 'none'; }
      });
    });
    // Also hide profile type on non-step-1
    var profileSection = document.querySelector('.profile-type-selector');
    if (profileSection) profileSection.closest('.form-section').style.display = currentStep === 1 ? 'block' : 'none';

    // Show current step sections
    var current = STEPS[currentStep - 1];
    current.sections.forEach(function(sectionId, i) {
      var el = $(sectionId);
      if (el) {
        el.style.display = 'block';
        el.style.animation = 'fadeUp 0.4s ease ' + (i * 0.08) + 's both';
      }
    });

    // Show/hide actions and AI tools based on step
    var actionsContainer = document.querySelector('.actions-container');
    if (actionsContainer) actionsContainer.style.display = currentStep === STEPS.length ? 'block' : 'none';
  }

  window.goToNextStep = function() {
    if (currentStep < STEPS.length) {
      currentStep++;
      renderProgressWizard();
      showCurrentStepSections();
      scrollWizardToTop();
      updateScoreUI();
    }
  };

  window.goToPrevStep = function() {
    if (currentStep > 1) {
      currentStep--;
      renderProgressWizard();
      showCurrentStepSections();
      scrollWizardToTop();
    }
  };

  window.goToStep = function(step) {
    currentStep = step;
    renderProgressWizard();
    showCurrentStepSections();
    scrollWizardToTop();
  };

  function scrollWizardToTop() {
    var wiz = $('progressWizard');
    if (wiz) wiz.scrollIntoView({ behavior: 'smooth' });
  }

  // ═══════════════════════════════════════════
  //  FEATURE: Smart Preview Placeholder
  // ═══════════════════════════════════════════
  var DEMO_DATA = {
    name: 'Sarah Ahmed', jobTitle: 'Frontend Developer',
    bio: 'I build beautiful, fast web experiences that users love. Passionate about clean code and creative UI.',
    email: 'sarah@example.com', location: 'Cairo, Egypt', phone: '+20 100 123 4567',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Figma'],
    github: 'https://github.com/sarah', linkedin: 'https://linkedin.com/in/sarah',
    twitter: '', website: '',
    projects: [
      { name: 'Portfolio Generator', description: 'An AI-powered tool to create portfolios in minutes', url: '#' },
      { name: 'Todo App', description: 'A clean task manager with dark mode', url: '#' }
    ],
    education: [], experience: [], languages: [], achievements: [],
    photo: null, outputType: 'portfolio'
  };
  var userHasStartedTyping = false;

  function initSmartPreview() {
    if (fullName && fullName.value.trim()) { userHasStartedTyping = true; return; }
    showDemoPreview();
    if (fullName) {
      fullName.addEventListener('input', function() {
        if (!userHasStartedTyping && this.value.length > 0) {
          userHasStartedTyping = true;
          hideDemoPreview();
          showToast('✨ الـ Preview بيتحدث لحظة بلحظة!', 'success');
        }
      });
    }
  }

  function showDemoPreview() {
    try {
      var html = generateMidnightHTML(DEMO_DATA, '#63B3ED', 'Inter');
      if (html) {
        var watermark = '<div style="position:fixed;top:12px;right:12px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 10px;border-radius:99px;font-size:11px;font-family:sans-serif;pointer-events:none;z-index:9999">👀 مثال توضيحي</div>';
        previewFrame.srcdoc = html.replace('</body>', watermark + '</body>');
      }
    } catch(e) { /* silent fail, demo is optional */ }
    var banner = $('demoBanner');
    if (banner) banner.style.display = 'flex';
  }

  window.hideDemoPreview = function() {
    var banner = $('demoBanner');
    if (banner) {
      banner.style.opacity = '0';
      setTimeout(function() { banner.style.display = 'none'; }, 300);
    }
    updatePreview();
  };

  // ═══════════════════════════════════════════
  //  FEATURE: Smart Empty States
  // ═══════════════════════════════════════════
  var EMPTY_STATE_MESSAGES = {
    skills: { icon:'🛠️', title:'مفيش مهارات لسه', desc:'المهارات بتزيد فرصتك في الـ ATS بنسبة 40%', action:'أضف مهارة', tip:'ابدأ بـ: HTML, CSS, JavaScript' },
    projects: { icon:'🚀', title:'مفيش مشاريع لسه', desc:'المشاريع هي أقوى حاجة في الـ CV بتاعك', action:'أضف مشروع', tip:'حتى مشروع واحد بيفرق كتير!' },
    experience: { icon:'💼', title:'مفيش خبرة مضافة', desc:'طالب؟ — أضف مشاريع أكاديمية أو تدريب', action:'أضف خبرة', tip:'Internship أو Part-time يحسب!' },
    education: { icon:'🎓', title:'مفيش تعليم مضاف', desc:'الجامعة والتخصص مهمين جداً للـ HR', action:'أضف تعليمك', tip:'أضف الجامعة والكلية على الأقل' },
    achievements: { icon:'🏆', title:'مفيش إنجازات', desc:'الإنجازات بتفرقك عن باقي المتقدمين', action:'أضف إنجاز', tip:'جايزة، مسابقة، أو شهادة — أي حاجة!' }
  };

  window.renderEmptyState = function(sectionKey, containerId, onAddClick) {
    var msg = EMPTY_STATE_MESSAGES[sectionKey];
    if (!msg) return;
    var container = $(containerId);
    if (!container) return;
    container.innerHTML = '<div class="empty-state">'
      + '<div class="empty-icon">' + msg.icon + '</div>'
      + '<div class="empty-title">' + msg.title + '</div>'
      + '<div class="empty-desc">' + msg.desc + '</div>'
      + '<button class="empty-action-btn" onclick="' + onAddClick + '">+ ' + msg.action + '</button>'
      + '<div class="empty-tip">💡 ' + msg.tip + '</div>'
      + '</div>';
  };

  // ─── Init ───
  initOnboarding();
  initPhotoUpload();
  renderTemplateGrid();
  renderProjects();
  renderEducation();
  renderExperience();
  renderLanguages();
  renderAchievements();
  renderVersionHistory();
  renderProgressWizard();
  showCurrentStepSections();
  initSmartPreview();
  updateScoreUI();
  checkForSharedPortfolio();

  // FAB visibility on resize
  window.addEventListener('resize', function() {
    var fab = $('fabContainer');
    if (fab) fab.style.display = window.innerHeight < 500 ? 'none' : 'flex';
  });

})();
