// ========================================================
// OBSIDIAN CYBERNETIC PORTFOLIO - LOGIC ENGINE
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Latency / Ping Simulation
  const pingEl = document.getElementById('ping-metric');
  if (pingEl) {
    setInterval(() => {
      const ping = Math.floor(Math.random() * 5) + 11;
      pingEl.textContent = `${ping}ms`;
    }, 3500);
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. Interactive HUD Visualizer State Cycle
  const hudCycleBtn = document.getElementById('hud-cycle-btn');
  const hudDisplay = document.getElementById('hud-display');
  let hudState = 0;
  const hudStates = [
    { model: 'RESNET_YOLO_HYBRID', feed: 'MICROSCOPIC_SAMPLE_4B', target: 'OBJ_01: POLYETHYLENE [99.2%]' },
    { model: 'TRANSFORMER_ViT_B16', feed: 'SEDIMENT_CORE_ANALYSIS', target: 'OBJ_03: POLYSTYRENE [97.5%]' },
    { model: 'CUSTOM_EDGE_TPU_INT8', feed: 'AQUATIC_EFFLUENT_FLOW', target: 'OBJ_07: POLYVINYL_CHLORIDE [98.1%]' }
  ];

  if (hudCycleBtn && hudDisplay) {
    hudCycleBtn.addEventListener('click', () => {
      hudState = (hudState + 1) % hudStates.length;
      const current = hudStates[hudState];
      const modelBadge = hudDisplay.querySelector('.text-slate-400');
      if (modelBadge) {
        modelBadge.innerHTML = `<span>MODEL_WEIGHTS: ${current.model}</span>`;
      }
      hudDisplay.classList.add('border-cyan-400');
      setTimeout(() => hudDisplay.classList.remove('border-cyan-400'), 400);
    });
  }

  // 4. Project Simulation Demonstrations
  const demoButtons = document.querySelectorAll('.project-demo-btn');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.getAttribute('data-project');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="text-cyan-300 font-bold">[ EXECUTING... ]</span>`;

      setTimeout(() => {
        if (type === 'microplastics') {
          btn.innerHTML = `<span class="text-emerald-400 font-bold">[ 148 PARTICLES SCANNED (98.9% mAP) ]</span>`;
        } else if (type === 'encryption') {
          btn.innerHTML = `<span class="text-emerald-400 font-bold">[ DIFFUSED 256-BIT SEED: 0x9AF03C... ]</span>`;
        } else if (type === 'network') {
          btn.innerHTML = `<span class="text-emerald-400 font-bold">[ 0% PACKET LOSS // RTT: 1.2ms ]</span>`;
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 3000);
      }, 800);
    });
  });

  // 5. Interactive CLI Terminal
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalSection = document.getElementById('terminal-section');
  const terminalTriggers = [
    document.getElementById('terminal-toggle-top'),
    document.getElementById('terminal-trigger-btn')
  ];

  terminalTriggers.forEach(trigger => {
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        terminalSection.scrollIntoView({ behavior: 'smooth' });
        terminalInput.focus();
      });
    }
  });

  const commands = {
    help: () => `
Available commands:
  - <span class="text-cyan-400 font-bold">bio</span>        : System operator dossier & profile
  - <span class="text-cyan-400 font-bold">projects</span>   : Core engineering artifacts & research
  - <span class="text-cyan-400 font-bold">skills</span>     : AI/ML, networking & backend capabilities
  - <span class="text-cyan-400 font-bold">credentials</span>: CCNA & deep learning certifications
  - <span class="text-cyan-400 font-bold">contact</span>    : Initialize communications channel
  - <span class="text-cyan-400 font-bold">clear</span>      : Reset terminal output
  - <span class="text-cyan-400 font-bold">whoami</span>     : Display current session identity
  - <span class="text-cyan-400 font-bold">date</span>       : Display real-time UTC timestamp
`,
    bio: () => `
<span class="text-cyan-300 font-bold">OPERATOR DOSSIER: DARSHAN S</span>
Role: Applied AI/ML Practitioner & Cisco-Certified Software Engineer
Focus: High-concurrency computer vision architectures, low-level cryptographic pipelines, and enterprise fault-tolerant networking.
Philosophy: Clean telemetry, predictable latency, deterministic security.
`,
    projects: () => `
<span class="text-cyan-300 font-bold">DEPLOYED ENGINEERING ARTIFACTS:</span>
1. [CV-01] Microplastic Holographic Detection System (YOLOv8, 98.4% mAP)
2. [SEC-02] Pixel Matrix Cipher & Image Encryption Engine (AES-256 GCM)
3. [NET-03] Enterprise Multi-Tier Cisco Topology & OSPF Routing (CCNA)
Type 'contact' to discuss or inspect full codebases.
`,
    skills: () => `
<span class="text-cyan-300 font-bold">TECHNICAL CAPABILITY MATRIX:</span>
- AI/ML       : PyTorch, OpenCV, YOLO, TensorRT, CUDA, Edge TPU
- Networking  : Cisco IOS, OSPF, BGP, VLANs, Wireshark, Subnetting (CCNA)
- Languages   : Python, C/C++, TypeScript, SQL, Bash
- DevOps/Cloud: Docker, Linux SysAdmin, Git CI/CD, GCP
`,
    credentials: () => `
<span class="text-cyan-300 font-bold">VERIFIED CREDENTIALS:</span>
- Cisco Certified Network Associate (CCNA) #VERIFIED
- Specialized Neural Architecture & Computer Vision Research
`,
    contact: () => `
<span class="text-cyan-300 font-bold">COMMUNICATIONS DISPATCH:</span>
Email   : <a href="mailto:darshan.dev.portfolio@gmail.com" class="text-cyan-400 underline">darshan.dev.portfolio@gmail.com</a>
Location: Global / Remote
Status  : Open for Engineering Roles & Research Inquiries
`,
    whoami: () => `visitor@darshan-workstation [role: authorized_guest]`,
    date: () => new Date().toISOString() + ' (UTC)',
    clear: () => {
      terminalOutput.innerHTML = '';
      return null;
    }
  };

  if (terminalForm && terminalInput && terminalOutput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawInput = terminalInput.value.trim();
      if (!rawInput) return;

      const cmd = rawInput.toLowerCase();
      terminalInput.value = '';

      // Print input line
      const userLine = document.createElement('div');
      userLine.innerHTML = `<span class="text-cyan-400 font-bold">&gt; ${escapeHtml(rawInput)}</span>`;
      terminalOutput.appendChild(userLine);

      // Process command
      if (commands[cmd]) {
        const response = commands[cmd]();
        if (response !== null) {
          const respLine = document.createElement('div');
          respLine.innerHTML = response;
          terminalOutput.appendChild(respLine);
        }
      } else {
        const errLine = document.createElement('div');
        errLine.innerHTML = `<span class="text-red-400">Command not recognized: '${escapeHtml(rawInput)}'. Type <span class="text-white font-bold">'help'</span> for reference.</span>`;
        terminalOutput.appendChild(errLine);
      }

      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // 6. Contact Form Transmission
  const contactForm = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && contactSubmitBtn && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const originalText = contactSubmitBtn.textContent;
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = 'TRANSMITTING DISPATCH PACKET...';

      setTimeout(() => {
        contactSubmitBtn.textContent = 'PACKET DELIVERED [ACK]';
        formFeedback.classList.remove('hidden');
        contactForm.reset();

        setTimeout(() => {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.textContent = originalText;
        }, 5000);
      }, 1200);
    });
  }
});
