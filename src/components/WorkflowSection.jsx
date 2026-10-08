import React, { useState, useEffect } from 'react';
import TiltCard from './TiltCard';

export default function WorkflowSection({ triggerSound }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutomating, setIsAutomating] = useState(false);

  const workflowSteps = [
    {
      step: '01',
      title: 'Threat Modeling & Surface Reconnaissance',
      phase: 'RECON & DISCOVERY',
      summary: 'Automated vulnerability scanning, attack vector taxonomy, and active telemetry enumeration across all perimeter endpoints.',
      metrics: {
        riskScore: 'LOW (0.04)',
        vectorCount: '18 Monitored Vectors',
        scanLatency: '1.4ms Real-time'
      },
      codeSnippet: `def audit_perimeter(target_cidr="10.0.0.0/24"):
    active_hosts = arp_scan(target_cidr)
    threat_surface = [h for h in active_hosts if h.ports.open]
    return evaluate_cve_surface(threat_surface)`,
      status: 'AUDITED // SECURE'
    },
    {
      step: '02',
      title: 'Cryptographic Architecture & Key Diffusion',
      phase: 'DIFFUSION & HARDENING',
      summary: 'Implementation of spatial pixel permutation and AES-256 GCM block diffusion ensuring information entropy >7.999 bits/byte.',
      metrics: {
        entropy: '7.9998 bits/byte',
        cipher: 'AES-256-GCM',
        npcrRate: '99.64% (Near-Ideal)'
      },
      codeSnippet: `key = derive_ephemeral_key(master_secret, salt)
cipher = AES.new(key, AES.MODE_GCM)
ciphertext, auth_tag = cipher.encrypt_and_digest(matrix_buffer)
verify_entropy(ciphertext) # > 7.999`,
      status: 'ENCRYPTED // VERIFIED'
    },
    {
      step: '03',
      title: 'Cisco Enterprise VLAN Isolation & Routing',
      phase: 'NETWORK SEGMENTATION',
      summary: 'Subnet segregation via 802.1Q trunking, OSPF Multi-Area routing, and rigid ACL boundary enforcement on Cisco Core switches.',
      metrics: {
        convergence: '< 850ms (PVST+)',
        vlanCount: '6 Isolated Segments',
        packetLoss: '0.00% Verified'
      },
      codeSnippet: `interface GigabitEthernet0/1/0
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
 ip access-group SEC_CORE_IN in
 spanning-tree portfast`,
      status: 'ISOLATED // ACTIVE'
    },
    {
      step: '04',
      title: 'Adversarial Defense & Model Validation',
      phase: 'AI & EDGE VERIFICATION',
      summary: 'Sanitizing incoming sensor and computer vision frames against adversarial attacks, gradient noise, and corrupted payloads.',
      metrics: {
        precision: '98.4% mAP',
        noiseFilter: 'Active Spatial Blur',
        inference: '< 13.8ms Edge'
      },
      codeSnippet: `def sanitize_input_frame(frame_tensor):
    denoised = gaussian_bilateral_filter(frame_tensor)
    if detect_adversarial_noise(denoised) > THRESHOLD:
        raise SecurityException("Adversarial attack dropped")
    return model.infer(denoised)`,
      status: 'PROTECTED // VALID'
    },
    {
      step: '05',
      title: 'Continuous Telemetry & Red Team Validation',
      phase: 'MONITORING & CI/CD',
      summary: 'Deep packet inspection with Wireshark, automated synthetic exploits, and sub-second failover orchestration.',
      metrics: {
        uptime: '99.99% Guaranteed',
        rtt: '0.84ms Average',
        auditLog: 'Immutable SHA-256'
      },
      codeSnippet: `while True:
    telemetry = sniffer.capture_stream(timeout=1.0)
    audit_log.append(hashlib.sha256(telemetry).hexdigest())
    if detect_anomaly(telemetry):
        trigger_subsecond_failover()`,
      status: 'CONTINUOUS // HARDENED'
    }
  ];

  // Auto-run simulation workflow
  const runAutomatedWorkflow = () => {
    if (isAutomating) return;
    setIsAutomating(true);
    triggerSound?.(1200);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < workflowSteps.length) {
        setActiveStep(step);
        triggerSound?.(1000 + step * 100);
      } else {
        clearInterval(interval);
        setIsAutomating(false);
        triggerSound?.(1800);
      }
    }, 1400);
  };

  const current = workflowSteps[activeStep];

  return (
    <section id="workflow" className="space-y-8 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs text-cyan-400 font-semibold">
            02. // HARDENED METHODOLOGY
          </span>
          <h2 className="font-heading font-extrabold text-3xl text-[var(--text-primary)]">
            Cybersecurity &amp; Engineering Workflow
          </h2>
        </div>

        <button
          onClick={runAutomatedWorkflow}
          disabled={isAutomating}
          className="px-4 py-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 font-mono text-xs transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span className={`w-2 h-2 rounded-full ${isAutomating ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`}></span>
          <span>{isAutomating ? 'EXECUTING PIPELINE...' : '[ SIMULATE COMPLETE PIPELINE ]'}</span>
        </button>
      </div>

      {/* Interactive Step Navigator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {workflowSteps.map((ws, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveStep(idx);
              triggerSound?.(900 + idx * 80);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              activeStep === idx
                ? 'bg-blue-600/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-[var(--surface-low)] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold ${activeStep === idx ? 'text-cyan-400' : 'text-slate-500'}`}>
                STAGE {ws.step}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-60"></span>
            </div>
            <div className="text-xs font-semibold truncate text-[var(--text-primary)]">
              {ws.phase}
            </div>
          </button>
        ))}
      </div>

      {/* Main Active Stage Interactive Telemetry Display */}
      <TiltCard maxTilt={5}>
        <div className="glass-panel rounded-2xl border border-slate-800 bg-[var(--card-bg)]/90 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                ACTIVE PIPELINE STAGE // {current.phase}
              </div>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[var(--text-primary)] mt-1">
                {current.title}
              </h3>
            </div>
            <span className="font-mono text-xs px-3 py-1 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-semibold self-start sm:self-auto">
              {current.status}
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            {current.summary}
          </p>

          {/* Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {Object.entries(current.metrics).map(([key, val], i) => (
              <div key={i} className="bg-[var(--surface-low)] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">{key}</span>
                <span className="text-cyan-400 font-semibold">{val}</span>
              </div>
            ))}
          </div>

          {/* Interactive Code Viewer for this Stage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span className="text-cyan-400">&gt; HARDENED_EXECUTION_MODULE:</span>
              <span>SYNCHRONOUS COMPILATION</span>
            </div>
            <div className="bg-[#050914] rounded-xl border border-slate-800 p-4 font-mono text-xs text-cyan-300/90 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre">{current.codeSnippet}</pre>
            </div>
          </div>
        </div>
      </TiltCard>
    </section>
  );
}
