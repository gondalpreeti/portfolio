export const LINKS = {
  email: 'preetigondal2024.it@mmcoe.edu.in',
  github: 'https://github.com/gondalpreeti',
  linkedin: 'https://www.linkedin.com/in/preeti-gondal-649990310/',
  resume: 'resume-preeti-gondal.pdf',
}

export const NAV = [
  { id: 'highlights', label: 'Highlights' },
  { id: 'work', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'community', label: 'Leadership' },
  { id: 'contact', label: 'Contact' },
]

export const STATS = [
  { to: 9.53, dec: 2, suf: '', label: 'CGPA out of 10 after the second year of B.Tech' },
  { to: 2, dec: 0, suf: 'nd', label: 'place at Innoverse 2025, with a ₹5,000 cash prize' },
  { to: 5, dec: 0, suf: '', label: 'projects built across AI, web and design' },
]

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI and ML' },
  { id: 'web', label: 'Web and full stack' },
  { id: 'design', label: 'Design' },
]

export const PROJECTS = [
  { title: 'Chanakya', meta: 'Project-based internship, education consultancy website', cat: 'web', tags: ['HTML', 'CSS', 'JavaScript'],
    bullets: ['A responsive web platform for an education consultancy, supporting college discovery, comparisons, admission services and student enquiries. Client requirements were translated into working web features.'] },
  { title: 'Enterprise Employee Expense Reimbursement System', meta: 'Fluid Controls Pvt Ltd', cat: 'web', tags: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT auth', 'Docker'],
    bullets: ['An enterprise reimbursement system for Fluid Controls Pvt. Ltd., built under faculty guidance, with role-based workflows for employees, HOD, Finance, Accounts and Admin.', 'Authentication, claim approval, receipt validation, reporting and settlement modules that digitise the end-to-end reimbursement process.'] },
  { title: 'AdaptInfer', meta: 'Adaptive local LLM inference dashboard', cat: 'ai', tags: ['Python', 'Streamlit', 'DistilGPT-2', 'Quantization'],
    bullets: ['A Streamlit dashboard for benchmarking local DistilGPT-2 inference using FP16 and INT8 dynamic quantization with system telemetry. It analyses latency, memory usage, tokens per second and perplexity.'] },
  { title: 'KrishiSakhi', meta: 'Smart agriculture assistant', cat: 'ai', tags: ['AI', 'Voice', 'Agriculture'],
    bullets: ['An AI-powered agriculture assistant supporting farmers with crop recommendations, weather insights, government schemes and sustainable farming practices.', 'Multilingual voice support, farm logbook management, crop failure assistance and off-season livelihood guidance to improve accessibility.'] },
  { title: 'Dough-Re-Mi', meta: 'AI cookbook experience, UI/UX', cat: 'design', tags: ['Wireframes', 'Prototypes', 'UI/UX'],
    bullets: ['An AI-powered cookbook experience with wireframes, user flows and interactive prototypes, focused on recipe discovery, personalised assistance, accessibility and intuitive navigation.'] },
]

export const SKILLS = [
  ['Programming', ['C', 'C++', 'Python', 'JavaScript']],
  ['Frontend', ['HTML', 'CSS', 'React', 'Tailwind CSS']],
  ['Backend', ['Flask', 'FastAPI', 'Node.js', 'Express.js']],
  ['Databases', ['SQLite', 'Firebase', 'MySQL', 'MongoDB']],
  ['Tools', ['Git', 'GitHub', 'VS Code', 'Docker', 'Kubernetes']],
  ['Domains', ['Artificial Intelligence', 'Machine Learning', 'NLP', 'Full Stack Development']],
]

export const POSITIONS = [
  { role: 'Chairperson', org: 'ACM Students’ Chapter, MMCOE', star: true,
    bullets: ['Leads the student chapter’s technical activities, event planning and member engagement.', 'Coordinates with student teams and faculty to organise technical events, workshops and initiatives.'] },
  { role: 'Logistics Head', org: 'Vaarithon 2026 Hackathon',
    bullets: ['Led logistics planning and on-ground coordination for the hackathon.', 'Coordinated participants, resources, venues, schedules and event operations to ensure smooth execution.'] },
  { role: 'Logistics Coordinator', org: 'TEDx Club',
    bullets: ['Coordinated logistics and operational activities for TEDx events and initiatives.', 'Assisted in planning, organising and executing speaker sessions and club activities.'] },
  { role: 'Member', org: 'ACM Students’ Chapter', bullets: ['Participated in technical workshops, coding activities and community-driven initiatives.'] },
  { role: 'Member', org: 'IT Tech Club', bullets: ['Contributed to technical events, learning sessions and collaborative project activities.'] },
]

export const ACTIVITIES = [
  { title: 'Coffee with Alumni Initiative', meta: 'Host and coordinator',
    bullets: ['Hosted and coordinated alumni sessions connecting students with professionals across industries.', 'Managed speaker outreach, session planning and event execution on careers and higher education.', 'Moderated live interactions and Q&A sessions, building communication and stakeholder management skills.'] },
  { title: 'ICSFT 2026', meta: 'Volunteer and anchor',
    bullets: ['Volunteered for the Information Technology track of an international conference technically co-sponsored by the IEEE Pune Section.', 'Anchored sessions and managed on-stage proceedings.', 'Coordinated logistics with faculty members and student volunteers.'] },
  { title: 'GameX Innovate: Hacksprint v7.0', meta: 'Guest coordinator',
    bullets: ['Served as Guest Coordinator for a 24-hour game development hackathon organised by the ACM and ISTE student chapters.', 'Assisted with evaluation planning, event logistics, participant engagement and social media promotion.'] },
  { title: 'TechSpark 2026', meta: 'Volunteer',
    bullets: ['Volunteered in organising and running a student project competition.', 'Supported participant coordination, event logistics and evaluation.'] },
]
