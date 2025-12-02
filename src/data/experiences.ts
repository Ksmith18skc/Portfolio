import { Experience } from '../types';

export const experiences: Experience[] = [
    {
    id: '1',
    company: 'University of Arizona IT Services',
    role: 'AI/IT Business Strategy Analyst',
    period: 'Jan 2025 - Present',
    description: 'Designed and deployed enterprise AI and automation solutions to streamline IT workflows and enhance cloud readiness across university systems. Led cross-functional strategy initiatives, enabling organization wide adoption of automation platforms and generative AI tools.',
    technologies: ['Microsoft Power Platform', 'DataVerse', 'Power Automate', 'Business Analysis']
  },
  {
    id: '2',
    company: 'University of Arizona IT Services',
    role: 'Frontline Technology Specialist',
    period: 'June 2023 - Jan 2025',
    description: 'Diagnosed and resolved complex hardware and software malfunctions, enhancing system reliability and performance. Managed configurations in Microsoft Active Directory, evaluated endpoint security, and significantly reduced malware incidents.',
    technologies: ['Microsoft Active Directory', 'Sophos Central', 'Endpoint Security', 'Technical Support']
  },
    {
    id: '3',
    company: 'Breault Research Organization',
    role: 'Software Engineering Intern (cybersecurity & compliance)',
    period: 'July 2024 - Jan 2025',
    // description: 'Aided cybersecurity solutions for Cyber Resilient Weapon Systems (CRWS) and Cyber Physical Systems (CPS). Conducted vulnerability assessments and penetration testing to ensure the security of artificial intelligence systems. Collaborated with cross-functional teams to enhance enterprise cybersecurity measures and mitigate potential risks.',
      description: 'Developed a real-time Intrusion Detection System (IDS) using Snort on Ubuntu and automated compliance checks with Python, streamlining threat analysis and audits. Automated user migration, software deployment, and security policy enforcement, reducing manual interventions and improving IT infrastructure efficiency. Designed and integrated security automation tools for SaaS platforms supporting government and domestic contracts, ensuring secure and compliant deployments.',
    technologies: ['Azure','Intrusion Detection', 'Vulnerability Assessment', 'AI Security']
  },
  {
    id: '4',
    company: 'Proof of Beauty',
    role: 'Hash Historian',
    period: 'December 2021 - March 2022',
    description: 'Inspected blockchain transactions to verify hash history and provided non-technical insights on historical significance for broader audiences.',
    technologies: ['Blockchain Analysis', 'Hash Verification', 'Data Contextualization']
  },
  {
    id: '5',
    company: 'Independent',
    role: 'Penetration Tester',
    period: 'May 2020 - August 2022',
    description: 'Performed penetration testing and vulnerability assessments on infrastructure and database servers. Identified SQL injection vulnerabilities, verified SSL authentication, and developed scripts to automate intrusion processes.',
    technologies: ['SQL', 'Burp Suite', 'SSL Authentication', 'Security Automation']
  },
];
