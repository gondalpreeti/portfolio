import { useEffect, useRef, useState } from 'react'
import { LINKS, NAV, STATS, FILTERS, PROJECTS, SKILLS, POSITIONS, ACTIVITIES } from './data'

const BASE = import.meta.env.BASE_URL
const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches
const cx = (...a) => a.filter(Boolean).join(' ')

/* true once the element has scrolled into view */
function useIn(threshold = 0.15) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return [ref, on]
}

function Loader() {
  const [gone, setGone] = useState(false)
  const root = useRef(null), bar = useRef(null), cnt = useRef(null), exitRef = useRef(() => {})
  useEffect(() => {
    const html = document.documentElement
    const open = () => { html.classList.remove('ld-lock'); html.classList.add('ready') }
    if (reduced()) { open(); setGone(true); return }
    let fin = false, loaded = false, raf, done
    const t0 = performance.now(), MIN = 2300
    Promise.all([document.fonts && document.fonts.ready, new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }))]).then(() => { loaded = true })
    const exit = () => {
      if (fin) return
      fin = true; cancelAnimationFrame(raf)
      bar.current.style.transform = 'scaleX(1)'; cnt.current.textContent = '100'
      root.current.classList.add('out'); open()
      setTimeout(() => setGone(true), 1400)
    }
    exitRef.current = exit
    const frame = t => {
      const p = Math.min(1, (t - t0) / MIN), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      const v = loaded ? e : Math.min(e, 0.92)
      bar.current.style.transform = `scaleX(${v})`; cnt.current.textContent = Math.round(v * 100)
      if (p >= 1 && loaded) { if (!done) done = setTimeout(exit, 250); return }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const key = () => exit()
    addEventListener('keydown', key, { once: true })
    const safety = setTimeout(exit, 9000)
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); clearTimeout(done); removeEventListener('keydown', key) }
  }, [])
  if (gone) return null
  return (
    <div id="loader" ref={root} role="status" aria-label="Loading portfolio" onClick={() => exitRef.current()}>
      <div className="ld-glow" aria-hidden="true"><i /><i /></div>
      <div className="ld-inner">
        <div className="ld-mono" aria-hidden="true">PG</div>
        <div className="ld-name">Preeti Gondal</div>
        <div className="ld-bar"><i ref={bar} /></div>
        <div className="ld-count"><span ref={cnt}>0</span>%</div>
      </div>
      <button className="ld-skip" type="button">Skip</button>
    </div>
  )
}

/* gold sidebar rail with a bead that follows the scroll */
function Thread() {
  const bead = useRef(null), bar = useRef(null), links = useRef([])
  useEffect(() => {
    const secs = NAV.map(n => document.getElementById(n.id))
    const span = () => Math.max(1, document.documentElement.scrollHeight - innerHeight)
    const y = v => 20 + (v / span()) * (innerHeight - 40)
    const place = () => {
      const gap = 100, t = secs.map(s => y(s.offsetTop))
      for (let i = 1; i < t.length; i++) t[i] = Math.max(t[i], t[i - 1] + gap)
      const lim = innerHeight - 110
      if (t[t.length - 1] > lim) { t[t.length - 1] = lim; for (let j = t.length - 2; j >= 0; j--) t[j] = Math.min(t[j], t[j + 1] - gap) }
      links.current.forEach((a, i) => { a.style.top = t[i] + 'px' })
    }
    const tick = () => {
      const s = scrollY
      bead.current.style.top = y(s) + 'px'
      bar.current.style.transform = `scaleX(${Math.min(1, s / span())})`
      let cur = -1
      secs.forEach((el, i) => { if (s + innerHeight * 0.45 >= el.offsetTop) cur = i })
      links.current.forEach((a, i) => a.classList.toggle('on', i === cur))
    }
    const update = () => { place(); tick() }
    addEventListener('scroll', tick, { passive: true })
    addEventListener('resize', update)
    const ro = new ResizeObserver(update); ro.observe(document.body)
    document.fonts && document.fonts.ready.then(update)
    update()
    return () => { removeEventListener('scroll', tick); removeEventListener('resize', update); ro.disconnect() }
  }, [])
  return (
    <>
      <nav className="thread" aria-label="Sections">
        <div className="line" /><div className="bead" ref={bead} />
        {NAV.map((n, i) => <a key={n.id} href={`#${n.id}`} ref={el => (links.current[i] = el)}>{n.label}</a>)}
      </nav>
      <div className="bar" aria-hidden="true"><i ref={bar} /></div>
    </>
  )
}

function Title({ children }) {
  const [ref, on] = useIn(0.6)
  return <h2 ref={ref} className={on ? 'in' : ''}>{children}</h2>
}

function Card({ title, meta, bullets, tags, cat, hidden, role, org, star, pos }) {
  const [ref, on] = useIn()
  const [open, setOpen] = useState(false)
  const glow = e => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--y', e.clientY - r.top + 'px')
  }
  const more = bullets.length > 1
  return (
    <article ref={ref} data-c={cat} onPointerMove={glow} className={cx('card rv', pos && 'pos', star && 'star', on && 'in', open && 'open', hidden && 'off')}>
      {pos ? (
        <>
          <p className="meta">{org}</p><h3>{role}</h3>
          <ul className="b">{bullets.map(b => <li key={b}>{b}</li>)}</ul>
        </>
      ) : (
        <>
          <h3>{title}</h3><p className="meta">{meta}</p><p className="one">{bullets[0]}</p>
          {more && (
            <>
              <div className="more"><ul className="b">{bullets.slice(1).map(b => <li key={b}>{b}</li>)}</ul></div>
              <button className="tg" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? 'Less' : 'Details'}</button>
            </>
          )}
          {tags && <ul className="tags">{tags.map(t => <li key={t}>{t}</li>)}</ul>}
        </>
      )}
    </article>
  )
}

function Stat({ to, dec, suf, label }) {
  const [ref, on] = useIn()
  const [val, setVal] = useState(to)
  useEffect(() => {
    if (!on || reduced()) return
    let raf; const t0 = performance.now()
    const f = t => { const p = Math.min(1, (t - t0) / 1100); setVal(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(f) }
    setVal(0); raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [on, to])
  return (
    <div ref={ref} className={cx('stat rv', on && 'in')}>
      <b className="num">{val.toFixed(dec)}{suf}</b><span>{label}</span>
    </div>
  )
}

function Buttons({ solidFirst }) {
  return (
    <div className="btns">
      {solidFirst}
      <a className="btn" href={`mailto:${LINKS.email}`}>Email</a>
      <a className="btn" href={LINKS.github}>GitHub</a>
      <a className="btn" href={LINKS.linkedin}>LinkedIn</a>
      <a className="btn" href={BASE + LINKS.resume} download={LINKS.resume}>Download resume</a>
    </div>
  )
}

function Hero() {
  const move = e => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
  }
  return (
    <header className="hero" id="home" onPointerMove={move}>
      <div className="wrap hero-grid">
        <div className="hero-text">
          <h1>Preeti Gondal</h1>
          <p className="role">Information Technology engineering student building <b>software, AI/ML and systems</b>.</p>
          <p className="sub">Chairperson of the ACM Student Chapter at MMCOE, Pune.</p>
          <Buttons solidFirst={<a className="btn solid" href="#work">View projects</a>} />
        </div>
        <figure className="portrait" aria-label="Portrait of Preeti Gondal">
          <div className="pframe"><div className="pimg">
            <span className="mono" aria-hidden="true">PG</span>
            <img src={BASE + 'preeti.jpg'} alt="Preeti Gondal" width="800" height="1000" decoding="async" />
          </div></div>
          <figcaption><b>Preeti Gondal</b><span>MMCOE, Pune</span></figcaption>
        </figure>
        <dl className="facts">
          <div><dt>Studying</dt><dd>B.Tech Information Technology, 2024 to 2028, MMCOE Pune. CGPA 9.53/10</dd></div>
          <div><dt>Leading</dt><dd>ACM Student Chapter, as chairperson</dd></div>
        </dl>
      </div>
      <a className="cue" href="#highlights" aria-label="Scroll to highlights"><span>Scroll</span><i /></a>
    </header>
  )
}

function Projects() {
  const [f, setF] = useState('all')
  const filteredProjects = f === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === f)
  return (
    <section id="work">
      <div className="wrap">
        <Title>Projects</Title>
        <p className="intro">Filter by area, and open Details on any card for the full story.</p>
        <div className="filters" role="group" aria-label="Filter projects">
          {FILTERS.map(x => <button key={x.id} className="chip" aria-pressed={f === x.id} onClick={() => setF(x.id)}>{x.label}</button>)}
        </div>
        <div className="grid">
          {filteredProjects.map(p => <Card key={p.title} {...p} />)}
        </div>
      </div>
    </section>
  )
}

function Timeline() {
  const [g, setG] = useState('all')
  const showPos = g === 'all' || g === 'pos'
  const showAct = g === 'all' || g === 'act'
  return (
    <section id="community">
      <div className="wrap">
        <Title>Leadership and activities</Title>
        <div className="filters" role="group" aria-label="Filter timeline">
          {[['all', 'All'], ['pos', 'Positions'], ['act', 'Activities']].map(([id, l]) =>
            <button key={id} className="tlf" aria-pressed={g === id} onClick={() => setG(id)}>{l}</button>)}
        </div>
        <ol className="tl">
          {showPos && (
            <>
              <li className="tl-lab">Positions of responsibility</li>
              {POSITIONS.map((x, i) => (
                <li key={'pos' + i} className="tl-item">
                  <span className="dot" />
                  <Card {...x} pos />
                </li>
              ))}
            </>
          )}
          {showAct && (
            <>
              <li className="tl-lab">Activities</li>
              {ACTIVITIES.map((x, i) => (
                <li key={'act' + i} className="tl-item">
                  <span className="dot" />
                  <Card {...x} />
                </li>
              ))}
            </>
          )}
        </ol>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <Loader />
      <Thread />
      <main>
        <Hero />
        <section id="highlights">
          <div className="wrap">
            <Title>Highlights</Title>
            <div className="stats">{STATS.map(s => <Stat key={s.label} {...s} />)}</div>
          </div>
        </section>
        <Projects />
        <section id="skills">
          <div className="wrap">
            <Title>Technical skills</Title>
            <div className="grid3">
              {SKILLS.map(([name, list]) => <SkillCard key={name} name={name} list={list} />)}
            </div>
          </div>
        </section>
        <Timeline />
        <section className="contact" id="contact">
          <div className="wrap">
            <div className="about">
              <div>
                <Title>About</Title>
                <p>I am a third-year IT engineering student who likes building tools with a clear use, such as AI-powered and student-focused applications.</p>
                <p>I work across AI and frontend development, and I enjoy the design and leadership side of tech communities.</p>
              </div>
              <div>
                <Title>Contact</Title>
                <Buttons solidFirst={<a className="btn solid" href={`mailto:${LINKS.email}`}>Email me</a>} />
                <p style={{ marginTop: '1rem', opacity: 0.75, fontSize: '.95rem' }}>{LINKS.email}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer><div className="wrap">Preeti Gondal, Information Technology, MMCOE Pune</div></footer>
    </>
  )
}

function SkillCard({ name, list }) {
  const [ref, on] = useIn()
  return (
    <article ref={ref} className={cx('card sk rv', on && 'in')}>
      <h3>{name}</h3>
      <div className="chips">{list.map(x => <span key={x}>{x}</span>)}</div>
    </article>
  )
}
