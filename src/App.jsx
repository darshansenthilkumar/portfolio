import React, { useState, useEffect, useRef } from 'react';
import TiltCard from './components/TiltCard';
import WorkflowSection from './components/WorkflowSection';
import Aurora from './components/Aurora';
import AnimatedContent from './components/AnimatedContent';
import GradientText from './components/GradientText';
import GlassSurface from './components/GlassSurface';

// Web Audio synthesizer for tactile sci-fi sound feedback
let audioCtx = null;
function playBeep(freq = 800, type = 'sine', duration = 0.05, enabled = true) {
  if (!enabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Fallback
  }
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ping, setPing] = useState(13);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchSkill, setSearchSkill] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('ALL');
  const [simulatingProject, setSimulatingProject] = useState(null);
  const [simResult, setSimResult] = useState({});
  const [selectedModalProject, setSelectedModalProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hologramMode, setHologramMode] = useState(false);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: 'INITIALIZING DARSHAN_SHELL v2.6.4...' },
    { type: 'sys', text: 'AUTH: OPERATOR_LEVEL_0 // BIOMETRIC SIGNATURE IDENTIFIED' },
    { type: 'info', text: "Type 'help' to view available subroutines, or use quick action chips below." }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalContainerRef = useRef(null);
  const profilePhotoRef = useRef(null);

  // Contact form
  const [formStatus, setFormStatus] = useState('idle');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    playBeep(theme === 'dark' ? 1200 : 700, 'triangle', 0.08, soundEnabled);
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const triggerSound = (freq = 900) => {
    playBeep(freq, 'sine', 0.05, soundEnabled);
  };

  // Custom Cyber Cursor & Global Ripple
  useEffect(() => {
    const dot = document.getElementById('cursor-dot');
    const halo = document.getElementById('cursor-halo');
    if (!dot || !halo) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let haloX = mouseX;
    let haloY = mouseY;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    let animationFrameId;
    const updateHalo = () => {
      haloX += (mouseX - haloX) * 0.16;
      haloY += (mouseY - haloY) * 0.16;
      halo.style.left = `${haloX}px`;
      halo.style.top = `${haloY}px`;
      animationFrameId = requestAnimationFrame(updateHalo);
    };
    animationFrameId = requestAnimationFrame(updateHalo);

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, .glass-panel, .badge');
      if (target) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    };

    const handleGlobalClick = (e) => {
      playBeep(900, 'sine', 0.04, soundEnabled);
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleGlobalClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [soundEnabled]);

  // Scroll Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const percent = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;

      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
      }

      setShowScrollTop(currentScroll > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ping jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 5) + 11);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Ensure page always starts at top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto scroll terminal inner container only (does NOT scroll the page window)
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Projects
  const projects = [
    {
      id: 'sec-encryption',
      category: 'SECURITY',
      title: 'Visual Cryptography & Pixel Permutation Engine',
      tagline: 'Cybersecurity // Spatial Matrix Bit-Diffusion',
      description: 'Ultra-high-entropy image cipher algorithm utilizing dynamic pseudo-random matrix permutation coupled with AES-256 GCM block diffusion. Guarantees near-ideal entropy (>7.999 bits/byte) preventing differential cryptanalysis attacks while sustaining 100% lossless pixel restoration.',
      metrics: [
        { label: 'INFORMATION ENTROPY', value: '7.9994 / 8.0' },
        { label: 'CORRELATION COEFF.', value: '< 0.0011' },
        { label: 'CIPHER PROTOCOL', value: 'AES-256-GCM + Permutation' }
      ],
      tags: ['Python', 'NumPy', 'Cryptography', 'C++ Scrambler', 'SHA-512'],
      architecture: 'Raw Pixel Buffer -> 2D Spatial Chaos Permutation -> Dynamic XOR Keystream -> AES-256 GCM Block Diffusion -> Cipher Output',
      simulationOutput: 'DIFFUSION VERIFIED: Entropy 7.9998 bits/byte. NPCR: 99.64%, UACI: 33.48%. Correlation coefficient collapsed to 0.0009.'
    },
    {
      id: 'net-cisco',
      category: 'NETWORKING',
      title: 'Enterprise Multi-Tier Cisco Topology & Automated Failover',
      tagline: 'Enterprise Cisco Networking // CCNA Architecture',
      description: 'Production-grade enterprise multi-tier campus network infrastructure engineered with Cisco 3850 Multilayer Core/Distribution layers, OSPF multi-area routing, 802.1Q VLAN trunking, Access Control Lists (ACLs), and sub-second Rapid PVST+ convergence times.',
      metrics: [
        { label: 'ROUTING PROTOCOL', value: 'OSPF Multi-Area + BGP' },
        { label: 'FAILOVER TIME', value: '< 850 ms (Rapid PVST+)' },
        { label: 'PACKET RETENTION', value: '0.00% Drop Rate' }
      ],
      tags: ['Cisco IOS', 'OSPF / BGP', 'VLAN Trunking', 'Wireshark', 'Linux Networking', 'NAT / PAT'],
      architecture: 'Dual Core Cisco 3850 (Area 0) <-> Distribution Switches (VLAN 10/20/30) <-> Access Layer Switches <-> Firewall DMZ & NAT Gateway',
      simulationOutput: 'TRACEROUTE VERIFIED: 10.0.0.1 -> 10.1.20.1 -> 192.168.1.1 (0.84ms RTT). Failover simulated: PVST+ rerouted in 420ms.'
    },
    {
      id: 'cv-microplastics',
      category: 'AI_CV',
      title: 'AI Holographic Microplastic Detection System',
      tagline: 'Computer Vision // Environmental Deep Learning Research',
      description: 'Autonomous computer vision inference framework designed to segment, delineate, and categorize microscopic synthetic marine polymers down to 20 micrometers in real-time fluid flows. Trained custom YOLOv8 with feature pyramid attention networks.',
      metrics: [
        { label: 'mAP@50 ACCURACY', value: '98.4%' },
        { label: 'FRAME INFERENCE', value: '< 13.8 ms' },
        { label: 'POLYMER CLASSES', value: 'PET, PP, PS, PE, PVC' }
      ],
      tags: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'CUDA', 'TensorRT'],
      architecture: 'YOLOv8s Backbone -> CSPDarknet53 -> Feature Pyramid Network (PANet) -> Decoupled Detection Head -> Edge TPU Export',
      simulationOutput: 'SCAN COMPLETE: 142 microplastic particles detected. Dominant: Polyethylene (84%), Polystyrene (16%). Confidence: 99.1%.'
    }
  ];

  const filteredProjects = activeCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const handleRunSimulation = (proj) => {
    triggerSound(1200);
    setSimulatingProject(proj.id);
    setTimeout(() => {
      setSimResult(prev => ({ ...prev, [proj.id]: proj.simulationOutput }));
      setSimulatingProject(null);
      triggerSound(1600);
    }, 1200);
  };

  // Skills
  const skillsData = [
    { name: 'Cryptographic Ciphers (AES-256)', category: 'SECURITY', level: 96, desc: 'Block diffusion, spatial permutations, zero-trust' },
    { name: 'Cisco IOS Routing & Switching', category: 'NETWORKING', level: 96, desc: 'CCNA Certified, Layer 2/3 topologies, interface tuning' },
    { name: 'OSPF, EIGRP & BGP Protocols', category: 'NETWORKING', level: 91, desc: 'Multi-area design, route redistribution, metric tuning' },
    { name: 'VLANs, 802.1Q & Spanning Tree', category: 'NETWORKING', level: 95, desc: 'Rapid PVST+, EtherChannel LACP, inter-VLAN routing' },
    { name: 'Wireshark Packet Analysis', category: 'NETWORKING', level: 94, desc: 'Deep packet inspection, TCP handshake debug, latency traces' },
    { name: 'Python (NumPy, SciPy, FastAPI)', category: 'LANGUAGES', level: 97, desc: 'High-performance async services, matrix computing' },
    { name: 'PyTorch & Computer Vision', category: 'AI', level: 93, desc: 'Custom architectures, loss formulation, transfer learning' },
    { name: 'YOLO Object Detection', category: 'AI', level: 95, desc: 'YOLOv5/v8 custom dataset fine-tuning, anchor optimization' },
    { name: 'C / C++ Systems Programming', category: 'LANGUAGES', level: 88, desc: 'Memory manipulation, bitwise math, low-level algorithms' },
    { name: 'JavaScript / TypeScript & React', category: 'LANGUAGES', level: 92, desc: 'Reactive modern web interfaces, component architecture' },
    { name: 'Linux Server Administration', category: 'DEVOPS', level: 94, desc: 'Ubuntu/Debian, iptables, systemd daemons, shell scripts' },
    { name: 'Docker & Containerization', category: 'DEVOPS', level: 91, desc: 'Multi-stage builds, GPU container passthrough, Docker Compose' }
  ];

  const filteredSkills = skillsData.filter(s => {
    const matchesCat = selectedSkillCategory === 'ALL' || s.category === selectedSkillCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchSkill.toLowerCase()) || s.desc.toLowerCase().includes(searchSkill.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Terminal commands
  const executeTerminalCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    triggerSound(1000);
    setTerminalHistory(prev => [...prev, { type: 'user', text: `> ${raw}` }]);

    if (!cmd) return;
    switch (cmd) {
      case 'help':
        setTerminalHistory(prev => [
          ...prev,
          {
            type: 'resp',
            text: `Available subroutines:
  - bio         : System operator dossier & profile
  - workflow    : Jump to defensive engineering pipeline
  - projects    : Core engineering artifacts & research
  - skills      : Cybersecurity, Cisco networking & languages
  - credentials : CCNA & defensive security certifications
  - theme       : Toggle Light / Dark appearance
  - photo       : Toggle holographic portrait overlay
  - contact     : Transmit dispatch packet
  - whoami      : Current identity & authentication
  - date        : Display real-time UTC timestamp
  - clear       : Clear terminal viewport`
          }
        ]);
        break;

      case 'workflow':
        document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
        setTerminalHistory(prev => [...prev, { type: 'resp', text: 'Navigated to Defensive Engineering Workflow section.' }]);
        break;

      case 'theme':
        toggleTheme();
        setTerminalHistory(prev => [
          ...prev,
          { type: 'resp', text: `[THEME] Switched theme mode to: ${theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}` }
        ]);
        break;

      case 'bio':
        setTerminalHistory(prev => [
          ...prev,
          {
            type: 'resp',
            text: `OPERATOR: DARSHAN S
TITLE: Cybersecurity Enthusiast & Cisco CCNA Software Engineer
FOCUS: Cryptographic algorithms, defensive security architectures, and enterprise Cisco topologies.
STATUS: Active for mission-critical software engineering opportunities.`
          }
        ]);
        break;

      case 'projects':
        setTerminalHistory(prev => [
          ...prev,
          {
            type: 'resp',
            text: `FEATURED ARTIFACTS:
1. [SEC]   Visual Cryptography & Pixel Permutation Engine (AES-256)
2. [CCNA]  Enterprise Multi-Tier Cisco Topology & Automated Failover
3. [AI/CV] Microplastic Holographic Detection System (98.4% mAP)`
          }
        ]);
        break;

      case 'skills':
        setTerminalHistory(prev => [
          ...prev,
          {
            type: 'resp',
            text: `CORE CAPABILITIES:
- Defensive Sec   : Cryptography, AES-256, Permutation, ACLs
- Enterprise Cisco: Cisco IOS, OSPF, BGP, VLANs, Wireshark, PVST+
- Languages       : Python, C++, TypeScript, SQL, Bash`
          }
        ]);
        break;

      case 'credentials':
        setTerminalHistory(prev => [
          ...prev,
          {
            type: 'resp',
            text: `AUTHENTICATED CREDENTIALS:
- Cisco Certified Network Associate (CCNA) [VERIFIED ACTIVE]
- Applied Cryptography & Defensive Architecture Research`
          }
        ]);
        break;

      case 'photo':
        setHologramMode(prev => !prev);
        setTerminalHistory(prev => [
          ...prev,
          { type: 'resp', text: `[HUD] Holographic overlay: ${!hologramMode ? 'ENABLED' : 'DISABLED'}` }
        ]);
        break;

      case 'contact':
        setTerminalHistory(prev => [
          ...prev,
          {
            type: 'resp',
            text: `COMMUNICATIONS DISPATCH:
Email   : darshan.dev.portfolio@gmail.com
Status  : Open for Engineering Roles & Cybersecurity Inquiries`
          }
        ]);
        break;

      case 'whoami':
        setTerminalHistory(prev => [
          ...prev,
          { type: 'resp', text: 'guest_visitor@darshan-workstation [role: guest_analyst // permissions: read_only]' }
        ]);
        break;

      case 'date':
        setTerminalHistory(prev => [
          ...prev,
          { type: 'resp', text: new Date().toUTCString() }
        ]);
        break;

      case 'clear':
        setTerminalHistory([]);
        break;

      default:
        setTerminalHistory(prev => [
          ...prev,
          { type: 'err', text: `Command not recognized: '${raw}'. Type 'help' for available subroutines.` }
        ]);
        break;
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    executeTerminalCommand(terminalInput);
    setTerminalInput('');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    triggerSound(1100);
    setFormStatus('sending');

    setTimeout(() => {
      setFormStatus('success');
      triggerSound(1500);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 6000);
    }, 1200);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('darshan.dev.portfolio@gmail.com');
    setCopiedEmail(true);
    triggerSound(1400);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerSound(700);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Background Aurora Canvas from React Bits */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Aurora
          colorStops={["#7cff67", "#B497CF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none"></div>
      </div>

      {/* Floating Navigation Bar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl transition-all">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={999}
          distortionScale={-180}
          displace={0.4}
          backgroundOpacity={0.12}
          className="border border-zinc-800/90 shadow-2xl shadow-black/90 px-4 sm:px-6 py-1.5"
        >
          <div className="w-full flex items-center justify-between">
            <a href="#hero" onClick={() => triggerSound(900)} className="group flex items-center gap-3 text-decoration-none">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-700 shadow-sm flex-shrink-0">
                <img src="/profile.jpg" alt="Darshan S" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-[var(--text-primary)] text-sm tracking-wide">
                  DARSHAN S
                </div>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
              <a href="#overview" onClick={() => triggerSound(850)} className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all">Overview</a>
              <a href="#workflow" onClick={() => triggerSound(850)} className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all">Workflow</a>
              <a href="#projects" onClick={() => triggerSound(850)} className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all">Projects</a>
              <a href="#skills" onClick={() => triggerSound(850)} className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all">Skills</a>
              <a href="#credentials" onClick={() => triggerSound(850)} className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all">Credentials</a>
              <a href="#terminal-section" onClick={() => triggerSound(850)} className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all">CLI</a>
              <a href="#contact" onClick={() => triggerSound(850)} className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all">Contact</a>
            </nav>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setSoundEnabled(!soundEnabled); triggerSound(800); }}
                className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800/50 cursor-pointer transition-colors text-xs font-mono"
                title="Toggle UI audio effects"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>

              <a 
                href="#contact" 
                onClick={() => triggerSound(1100)}
                className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-heading font-bold text-xs tracking-wider transition-all shadow-md cursor-pointer"
              >
                CONNECT NOW
              </a>
              
              <button 
                onClick={() => { setMobileMenuOpen(!mobileMenuOpen); triggerSound(800); }} 
                className="md:hidden p-1.5 rounded-full border border-zinc-800 text-zinc-300 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
              </button>
            </div>
          </div>
        </GlassSurface>
      </header>

      {mobileMenuOpen && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm rounded-2xl border border-zinc-800 bg-black/90 backdrop-blur-2xl p-4 space-y-2 font-mono text-xs shadow-2xl animate-fadeIn md:hidden">
          <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white">01. Overview</a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white">02. Workflow</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white">03. Projects</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white">04. Skills</a>
          <a href="#credentials" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white">05. Credentials</a>
          <a href="#terminal-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white">06. CLI Terminal</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white">07. Contact</a>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-28">

        {/* Hero Section - Focused Only on Text */}
        <AnimatedContent distance={60} direction="vertical" duration={0.85} ease="power3.out">
          <section id="hero" className="pt-24 pb-6 sm:pt-28 sm:pb-10 relative max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <GlassSurface
                width="auto"
                height="auto"
                borderRadius={999}
                distortionScale={-140}
                displace={0.4}
                backgroundOpacity={0.14}
                className="border border-zinc-800/90 shadow-lg inline-flex"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 text-zinc-300 font-mono text-xs tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  SEC_ENG // CYBERSECURITY ENTHUSIAST &amp; CISCO CCNA CERTIFIED
                </div>
              </GlassSurface>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight leading-[1.15]">
              Engineering{' '}
              <GradientText
                colors={["#7cff67", "#B497CF", "#5227FF"]}
                animationSpeed={6}
                variant="flow"
                glow={0.4}
              >
                Hardened Security
              </GradientText>{' '}
              &amp; High-Availability Networks.
            </h1>

            <p className="font-sans text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Hi, I'm <strong className="text-[var(--text-primary)] font-semibold">Darshan S</strong>. I am a cybersecurity enthusiast and CCNA-certified software engineer specializing in cryptographic data pipelines, defensive security architectures, and mission-critical enterprise network resilience.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-3xl mx-auto">
              <TiltCard maxTilt={8} className="glass-panel p-3.5 rounded-xl border border-zinc-800 bg-[var(--card-bg)]/85">
                <div className="font-mono text-sm text-white font-bold">&lt; 13.8ms</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-1">Inference Latency</div>
              </TiltCard>
              <TiltCard maxTilt={8} className="glass-panel p-3.5 rounded-xl border border-zinc-800 bg-[var(--card-bg)]/85">
                <div className="font-mono text-sm text-white font-bold">98.4% mAP</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-1">Detection Precision</div>
              </TiltCard>
              <TiltCard maxTilt={8} className="glass-panel p-3.5 rounded-xl border border-zinc-800 bg-[var(--card-bg)]/85">
                <div className="font-mono text-sm text-white font-bold">CCNA Tier-3</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-1">Cisco Enterprise</div>
              </TiltCard>
              <TiltCard maxTilt={8} className="glass-panel p-3.5 rounded-xl border border-zinc-800 bg-[var(--card-bg)]/85">
                <div className="font-mono text-sm text-white font-bold">99.99%</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-1">Fault Resilience</div>
              </TiltCard>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <a 
                href="#workflow" 
                onClick={() => triggerSound(1100)}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-heading font-semibold text-sm transition-all shadow-xl shadow-white/10 hover:shadow-white/20 border border-white flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE WORKFLOW PIPELINE</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </a>
              <a 
                href="#projects" 
                onClick={() => triggerSound(850)}
                className="px-5 py-3.5 rounded-full glass-panel hover:bg-zinc-800 text-white font-mono text-xs transition-all border border-zinc-700 flex items-center gap-2 cursor-pointer"
              >
                <span>&gt; CASE_STUDIES</span>
              </a>
              <a 
                href="#terminal-section" 
                onClick={() => triggerSound(950)}
                className="px-4 py-3.5 rounded-full border border-zinc-700 hover:border-white text-zinc-400 hover:text-white font-mono text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>[&gt;_ OPEN CLI]</span>
              </a>
            </div>
          </section>
        </AnimatedContent>

        {/* Profile Photo Presentation Card (Moved Down) */}
        <AnimatedContent distance={70} direction="vertical" duration={0.9} delay={0.1} threshold={0.15}>
          <section id="profile-presentation" className="flex justify-center -mt-6 sm:-mt-10 scroll-mt-28">
            <TiltCard maxTilt={8} className="w-full max-w-lg">
              <div className="relative glass-panel rounded-2xl border border-zinc-700 bg-[var(--card-bg)]/90 p-5 shadow-2xl shadow-black/80 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    BIOMETRIC_PROFILE: #0xDS
                  </span>
                  <span className="text-zinc-500">CLEARANCE: LEVEL_0</span>
                </div>

                <div className="relative mt-4 rounded-xl overflow-hidden border border-zinc-700 bg-black group">
                  <img 
                    ref={profilePhotoRef}
                    src="/profile.jpg" 
                    alt="Darshan S - Software Developer & Cybersecurity Enthusiast" 
                    className="w-full h-96 object-cover object-top transition-all duration-700 group-hover:scale-105"
                  />

                  <div className="absolute bottom-3 left-3 right-3">
                    <GlassSurface
                      backdrop={profilePhotoRef}
                      width="100%"
                      height="auto"
                      borderRadius={10}
                      distortionScale={-160}
                      displace={0.35}
                      backgroundOpacity={0.18}
                      className="border border-zinc-700/90 shadow-xl"
                    >
                      <div className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono">
                        <div>
                          <div className="text-[var(--text-primary)] font-bold flex items-center gap-1.5">
                            DARSHAN S
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          </div>
                          <div className="text-[10px] text-zinc-400">CYBERSECURITY ENTHUSIAST &amp; CISCO CCNA</div>
                        </div>
                        <span className="text-[10px] text-white bg-zinc-900/90 border border-zinc-700 px-2 py-0.5 rounded font-semibold">
                          AVAILABLE
                        </span>
                      </div>
                    </GlassSurface>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>CERTIFIED: CISCO CCNA (ACTIVE &amp; VERIFIED)</span>
                  <span className="text-white font-mono">#CCNA-0x9B41</span>
                </div>
              </div>
            </TiltCard>
          </section>
        </AnimatedContent>

        {/* SECTION 01: OVERVIEW */}
        <AnimatedContent distance={80} direction="vertical" duration={0.85} threshold={0.15}>
          <section id="overview" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-300 font-semibold">01. // CORE COMPETENCIES</span>
              <div className="h-px bg-zinc-800 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TiltCard maxTilt={8} className="glass-panel rounded-xl p-6 border border-zinc-800 bg-[var(--card-bg)]/80 hover:border-zinc-600 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)] mb-2">Applied Cryptography &amp; Security</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Constructing high-entropy encryption mechanisms, bitwise pixel permutation matrix algorithms, zero-loss restoration, and automated payload sanitization.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
                  <span className="badge">AES-256</span>
                  <span className="badge">Matrix Cipher</span>
                  <span className="badge">Entropy &gt;7.99</span>
                  <span className="badge">SHA-512</span>
                </div>
              </TiltCard>

              <TiltCard maxTilt={8} className="glass-panel rounded-xl p-6 border border-zinc-800 bg-[var(--card-bg)]/80 hover:border-zinc-600 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)] mb-2">Enterprise Networking (CCNA)</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Certified expertise in Cisco routing architectures, OSPF/BGP routing protocols, VLAN trunking, NAT configurations, packet capture diagnostics, and multi-tier network topologies.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
                  <span className="badge">Cisco CCNA</span>
                  <span className="badge">OSPF / BGP</span>
                  <span className="badge">Wireshark</span>
                  <span className="badge">VLAN / Trunking</span>
                </div>
              </TiltCard>

              <TiltCard maxTilt={8} className="glass-panel rounded-xl p-6 border border-zinc-800 bg-[var(--card-bg)]/80 hover:border-zinc-600 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)] mb-2">Computer Vision &amp; Deep Learning</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Developing real-time semantic segmentation, micro-particle classification, feature extraction, and edge inference deployment pipelines with PyTorch, CUDA, and TensorRT.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
                  <span className="badge">PyTorch</span>
                  <span className="badge">OpenCV</span>
                  <span className="badge">YOLOv8</span>
                  <span className="badge">TensorRT</span>
                </div>
              </TiltCard>
            </div>
          </section>
        </AnimatedContent>

        {/* NEW SECTION: WORKFLOW PIPELINE COMPONENT */}
        <AnimatedContent distance={80} direction="vertical" duration={0.85} threshold={0.15}>
          <WorkflowSection triggerSound={triggerSound} />
        </AnimatedContent>

        {/* SECTION 03: FEATURED PROJECTS */}
        <AnimatedContent distance={80} direction="vertical" duration={0.85} threshold={0.15}>
          <section id="projects" className="space-y-10 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-zinc-300 font-semibold">03. // MISSION-CRITICAL ARTIFACTS</span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">Featured Engineering Projects</h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--surface-low)] border border-zinc-800 font-mono text-xs overflow-x-auto">
              {['ALL', 'SECURITY', 'NETWORKING', 'AI_CV'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setActiveCategory(cat); triggerSound(800); }}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${activeCategory === cat ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-[var(--text-primary)]'}`}
                >
                  {cat === 'AI_CV' ? 'AI / CV' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {filteredProjects.map((proj) => (
              <TiltCard key={proj.id} maxTilt={6}>
                <article className="glass-panel rounded-2xl border border-zinc-800 bg-[var(--card-bg)]/85 overflow-hidden hover:border-zinc-600 transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          {proj.tagline}
                        </div>
                        <h3 className="font-heading font-bold text-2xl text-[var(--text-primary)]">{proj.title}</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed">{proj.description}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                        {proj.metrics.map((m, idx) => (
                          <div key={idx} className="bg-[var(--surface-low)] p-3 rounded-lg border border-zinc-800">
                            <span className="text-zinc-500 block text-[10px]">{m.label}</span>
                            <span className="text-white font-semibold">{m.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800/80">
                        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                          {proj.tags.map((t, idx) => (
                            <span key={idx} className="badge">{t}</span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2.5 font-mono text-xs">
                          <button 
                            onClick={() => handleRunSimulation(proj)}
                            disabled={simulatingProject === proj.id}
                            className="px-3.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 hover:border-white text-white font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:bg-zinc-800"
                          >
                            {simulatingProject === proj.id ? <span>[ SCANNING... ]</span> : <span>[ RUN SIMULATION ]</span>}
                          </button>

                          <button 
                            onClick={() => { setSelectedModalProject(proj); triggerSound(900); }}
                            className="px-3 py-1.5 rounded-md border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          >
                            [ ARCHITECTURE ]
                          </button>
                        </div>
                      </div>

                      {simResult[proj.id] && (
                        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg font-mono text-xs text-zinc-200 animate-fadeIn">
                          &gt; {simResult[proj.id]}
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-5 bg-black border-t lg:border-t-0 lg:border-l border-zinc-800 p-6 flex flex-col justify-center relative overflow-hidden">
                      <div className="w-full aspect-[4/3] rounded-xl border border-zinc-700 bg-black p-4 relative flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                          <span className="text-white font-semibold">STATUS: ACTIVE_FEED</span>
                          <span>TELEMETRY: VERIFIED</span>
                        </div>

                        <div className="relative flex-1 my-3 rounded bg-[#09090b] border border-zinc-800 p-3 font-mono flex flex-col justify-center items-center overflow-hidden">
                          <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none"></div>

                          {proj.category === 'SECURITY' && (
                            <div className="w-full h-full flex flex-col justify-center font-mono text-[10px] text-zinc-300 space-y-1">
                              <div className="opacity-30">01000001 01000101 01010011 00101101</div>
                              <div className="text-white font-bold">&gt; ENTROPY: 7.9998 bits/byte [MAX]</div>
                              <div className="text-zinc-400">&gt; SEED: 0x8F3A29B1E40C77D2</div>
                              <div className="opacity-30">11010110 00101001 10101111 01010010</div>
                            </div>
                          )}

                          {proj.category === 'NETWORKING' && (
                            <div className="w-full h-full flex flex-col justify-between font-mono text-[10px] text-zinc-300">
                              <div className="text-center bg-zinc-800 border border-zinc-600 px-2 py-0.5 rounded text-white w-fit mx-auto">
                                [ CORE_ROUTER_01 ] 10.0.0.1
                              </div>
                              <div className="flex justify-around text-zinc-400 text-[9px]">
                                <span>↓ OSPF-AREA 0</span>
                                <span>↓ OSPF-AREA 0</span>
                              </div>
                              <div className="flex justify-between text-[9px]">
                                <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">DIST_SW_A (VLAN 10)</span>
                                <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">DIST_SW_B (VLAN 20)</span>
                              </div>
                            </div>
                          )}

                          {proj.category === 'AI_CV' && (
                            <div className="w-full h-full flex flex-col justify-between relative z-10 text-[10px]">
                              <div className="border border-zinc-600 bg-zinc-900 px-2 py-1 rounded text-white w-fit">
                                POLYETHYLENE (PE) [99.2%]
                              </div>
                              <div className="text-center text-white font-bold text-sm">
                                <span className="animate-pulse">2,410</span> PARTICLES QUANTIFIED
                              </div>
                              <div className="border border-zinc-600 bg-zinc-900 px-2 py-1 rounded text-zinc-300 w-fit self-end">
                                POLYPROPYLENE (PP) [96.8%]
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                          <span>PARITY: 100% OK</span>
                          <span className="text-white font-semibold">PASSED: READY</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>
        </section>
        </AnimatedContent>

        {/* Modal Drawer */}
        {selectedModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-zinc-700 bg-[var(--surface)] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                  [SPEC_VIEW] // {selectedModalProject.title}
                </h3>
                <button 
                  onClick={() => setSelectedModalProject(null)}
                  className="text-zinc-400 hover:text-[var(--text-primary)] font-mono text-sm px-2 py-1 rounded"
                >
                  [CLOSE ✕]
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-zinc-300 font-semibold block mb-1">PIPELINE ARCHITECTURE:</span>
                  <div className="bg-[var(--surface-low)] p-3 rounded-lg border border-zinc-800 text-[var(--text-primary)]">
                    {selectedModalProject.architecture}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-300 font-semibold block mb-1">SPECIFICATION DETAILS:</span>
                  <p className="text-zinc-300 font-sans text-sm leading-relaxed">
                    {selectedModalProject.description}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => setSelectedModalProject(null)}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-heading font-semibold text-xs"
                  >
                    DISMISS DRAWER
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 04: SKILLS */}
        <AnimatedContent distance={80} direction="vertical" duration={0.85} threshold={0.15}>
          <section id="skills" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-white font-semibold">04. // TECHNICAL CAPABILITIES</span>
              <h2 className="font-heading font-extrabold text-3xl text-[var(--text-primary)]">Skills Matrix &amp; Technologies</h2>
            </div>

            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                placeholder="Search skills (e.g. AES, CCNA)..."
                className="w-full bg-[var(--surface-low)] border border-zinc-700/80 rounded-lg px-3.5 py-2 text-xs font-mono text-[var(--text-primary)] placeholder-zinc-500 focus:border-white focus:outline-none transition-colors"
              />
              {searchSkill && (
                <button onClick={() => setSearchSkill('')} className="absolute right-2.5 top-2 text-zinc-500 hover:text-[var(--text-primary)] text-xs">✕</button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {['ALL', 'SECURITY', 'NETWORKING', 'LANGUAGES', 'AI', 'DEVOPS'].map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedSkillCategory(cat); triggerSound(800); }}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${selectedSkillCategory === cat ? 'bg-white text-black font-semibold border-white shadow-sm' : 'border-zinc-800 bg-[var(--surface-low)] text-zinc-400 hover:border-zinc-600 hover:text-[var(--text-primary)]'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((s, idx) => (
              <TiltCard key={idx} maxTilt={6} className="glass-panel rounded-xl p-4 border border-zinc-800 bg-[var(--card-bg)]/80 hover:border-white/50 transition-all space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[var(--text-primary)] font-bold">{s.name}</span>
                  <span className="text-white font-semibold">{s.level}%</span>
                </div>

                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-zinc-500 to-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${s.level}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-normal">{s.desc}</p>
              </TiltCard>
            ))}
          </div>
        </section>
        </AnimatedContent>

        {/* SECTION 05: CREDENTIALS */}
        <AnimatedContent distance={80} direction="vertical" duration={0.85} threshold={0.15}>
          <section id="credentials" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-white font-semibold">05. // VERIFIED CREDENTIALS</span>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TiltCard maxTilt={8} className="glass-panel rounded-xl p-6 border border-zinc-700 bg-[var(--card-bg)]/85 flex gap-5 items-start">
              <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-600 flex items-center justify-center font-mono font-bold text-white text-sm flex-shrink-0 shadow-lg">
                CCNA
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-300 font-semibold">
                  <span className="text-white">CISCO SYSTEMS</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-200 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px]">OFFICIALLY CERTIFIED</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">Cisco Certified Network Associate (CCNA)</h3>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Demonstrated mastery across enterprise IP services, network security fundamentals, subnet architecture, VLAN configuration, dynamic routing protocols (OSPF, BGP), and network programmability.
                </p>
                <div className="font-mono text-[11px] text-zinc-500 pt-1 flex items-center gap-2">
                  <span>STATUS: ACTIVE &amp; VERIFIED</span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-white font-semibold">HASH: #CCNA-0x9B41</span>
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={8} className="glass-panel rounded-xl p-6 border border-zinc-800 bg-[var(--card-bg)]/85 flex gap-5 items-start">
              <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-600 flex items-center justify-center font-mono font-bold text-white text-sm flex-shrink-0 shadow-lg">
                SEC
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-300 font-semibold">
                  <span className="text-white">CYBERSECURITY &amp; DEFENSIVE SYSTEMS</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-200 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px]">APPLIED CRYPTOGRAPHY</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">Cybersecurity Enthusiast &amp; Cryptographic Architecture</h3>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Hands-on implementations of high-entropy cryptographic ciphers (AES-256 GCM), spatial pixel permutation diffusion, access control lists (ACLs), Wireshark packet auditing, and zero-trust security postures.
                </p>
                <div className="font-mono text-[11px] text-zinc-500 pt-1 flex items-center gap-2">
                  <span>STATUS: ACTIVE DEFENSIVE RESEARCH</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </section>
        </AnimatedContent>

        {/* SECTION 06: CLI TERMINAL */}
        <AnimatedContent distance={80} direction="vertical" duration={0.85} threshold={0.15}>
          <section id="terminal-section" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white font-semibold">&gt; INTERACTIVE_TERMINAL // DARSHAN_SHELL</span>
            <span className="font-mono text-[11px] text-zinc-500">TYPE 'help' FOR SUBROUTINES</span>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-black shadow-2xl p-4 font-mono text-xs text-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-zinc-700"></span>
                <span className="w-3 h-3 rounded-full bg-zinc-500"></span>
                <span className="w-3 h-3 rounded-full bg-white"></span>
                <span className="ml-2 text-zinc-400 font-bold">darshan@workstation:~$</span>
              </div>
              <span className="text-white font-semibold">REACT_SHELL_EMULATOR</span>
            </div>

            <div ref={terminalContainerRef} className="py-3 space-y-1.5 max-h-64 overflow-y-auto font-mono text-xs text-zinc-300">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={line.type === 'err' ? 'text-zinc-400 font-bold underline' : line.type === 'user' ? 'text-white font-bold' : line.type === 'sys' ? 'text-zinc-500' : 'text-zinc-200'}>
                  <pre className="font-mono whitespace-pre-wrap">{line.text}</pre>
                </div>
              ))}
            </div>

            <div className="pt-2 pb-2 flex flex-wrap gap-1.5 border-t border-zinc-800/80 text-[11px]">
              <span className="text-zinc-500 mr-1 self-center">QUICK EXEC:</span>
              {['help', 'bio', 'workflow', 'projects', 'skills', 'credentials', 'theme', 'photo', 'contact', 'clear'].map(cmd => (
                <button 
                  key={cmd}
                  onClick={() => executeTerminalCommand(cmd)}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 hover:border-white text-zinc-300 transition-colors cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <span className="text-white font-bold">&gt;</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="bg-transparent flex-1 outline-none text-white font-mono text-xs placeholder-zinc-600"
                placeholder="Type command (e.g. 'workflow', 'bio', 'theme', 'help')..."
                autoComplete="off"
                spellCheck="false"
              />
              <button type="submit" className="text-[11px] text-zinc-400 hover:text-white font-mono cursor-pointer">[EXEC]</button>
            </form>
          </div>
        </section>
        </AnimatedContent>

        {/* SECTION 07: CONTACT */}
        <AnimatedContent distance={80} direction="vertical" duration={0.85} threshold={0.15}>
          <section id="contact" className="space-y-8 scroll-mt-24 pt-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-white font-semibold">07. // INITIALIZE COMMUNICATIONS</span>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-heading font-extrabold text-3xl text-[var(--text-primary)]">Let's Build Mission-Critical Tech Together.</h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Available for software engineering roles, cybersecurity initiatives, and networking infrastructure consulting. Feel free to initiate a handshake.
              </p>

              <div className="space-y-3 font-mono text-xs pt-3">
                <div className="p-3.5 rounded-lg bg-[var(--surface-low)] border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">DIRECT EMAIL DISPATCH</span>
                    <span className="text-[var(--text-primary)] font-semibold">darshan.dev.portfolio@gmail.com</span>
                  </div>
                  <button 
                    onClick={copyEmailToClipboard}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-white hover:text-black border border-zinc-700 text-white text-[11px] transition-colors cursor-pointer"
                  >
                    {copiedEmail ? 'COPIED! ✓' : 'COPY'}
                  </button>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--surface-low)] border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">CURRENT AVAILABILITY</span>
                  <span className="text-white flex items-center gap-1.5 font-semibold mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    ACTIVE FOR OPPORTUNITIES (REMOTE &amp; HYBRID)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--surface-low)] border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">CORE ACCREDITATION</span>
                  <span className="text-zinc-300">Cisco Certified Network Associate (CCNA)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <TiltCard maxTilt={5}>
                <div className="glass-panel rounded-2xl border border-zinc-800 bg-[var(--card-bg)]/90 p-6 sm:p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 block" htmlFor="form-name">DISPATCHER_NAME</label>
                        <input 
                          type="text" 
                          id="form-name"
                          required 
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-[var(--surface-low)] border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-[var(--text-primary)] focus:border-white focus:outline-none transition-colors" 
                          placeholder="e.g. Alex Mercer"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 block" htmlFor="form-email">RETURN_EMAIL</label>
                        <input 
                          type="email" 
                          id="form-email"
                          required 
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-[var(--surface-low)] border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-[var(--text-primary)] focus:border-white focus:outline-none transition-colors" 
                          placeholder="a.mercer@enterprise.io"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 block" htmlFor="form-subject">INITIATIVE_SUBJECT</label>
                      <input 
                        type="text" 
                        id="form-subject"
                        required 
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full bg-[var(--surface-low)] border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-[var(--text-primary)] focus:border-white focus:outline-none transition-colors" 
                        placeholder="Software Role / Cybersecurity & Infrastructure Inquiry"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 block" htmlFor="form-message">TRANSMISSION_PAYLOAD</label>
                      <textarea 
                        id="form-message"
                        rows="4" 
                        required 
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-[var(--surface-low)] border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-[var(--text-primary)] focus:border-white focus:outline-none transition-colors resize-none" 
                        placeholder="Project requirements, role description, or collaboration context..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={formStatus === 'sending'}
                      className="w-full py-3.5 rounded-lg bg-white hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-heading font-bold text-xs tracking-wider transition-all shadow-lg border border-white cursor-pointer flex items-center justify-center gap-2"
                    >
                      {formStatus === 'sending' ? (
                        <span>TRANSMITTING DISPATCH PACKET...</span>
                      ) : (
                        <span>TRANSMIT DISPATCH PACKET [SEND]</span>
                      )}
                    </button>

                    {formStatus === 'success' && (
                      <div className="bg-zinc-900 border border-white p-3 rounded-lg text-center text-white font-mono text-xs animate-fadeIn">
                        ✓ DISPATCH PACKET DELIVERED SUCCESSFULLY. Thank you, Darshan will reply within 24 hours.
                      </div>
                    )}
                  </form>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>
        </AnimatedContent>

      </main>

      {/* Floating Scroll Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-xl bg-white hover:bg-zinc-200 text-black shadow-xl border border-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all animate-bounce cursor-pointer"
          title="Return to top"
        >
          <span>↑ TOP</span>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[var(--surface)] mt-24 py-8 font-mono text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span>© 2026 DARSHAN S. ALL ARCHITECTURAL RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#hero" onClick={() => triggerSound(700)} className="hover:text-white transition-colors">TOP_OF_PAGE ↑</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GITHUB</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LINKEDIN</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
