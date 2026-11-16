import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Plus,
  X,
  Menu,
  Check,
  Search,
  Bookmark,
  Send,
  ShieldCheck,
  Clock,
  Briefcase,
  Layers,
  FileCheck,
  Users,
  Download,
} from "lucide-react";
import { companies, features, rules } from "./content";
import {
  Button,
  Brand,
  FlickerText,
  GridDrawing,
  Tabs,
  SectionHeading,
  Crosshair,
  PlusMinus,
  ScrollPrompt,
  FigmaAsset,
} from "./ui";
import { useMotion } from "./motion";
import { useCharacterGaze } from "./useCharacterGaze";
import "lenis/dist/lenis.css";
import "./styles.css";
import "./light-design.css";

const journeySteps = [
  {
    title: "Put yourself out there.",
    body: "One thoughtful application. A real role, a visible salary, and a clear picture of what comes next.",
    label: "Application sent",
    icon: Send,
  },
  {
    title: "Be seen. By a person.",
    body: "A real recruiter reviews your work. You know when they’ve seen it, and when you’ll hear back.",
    label: "Viewed by a recruiter",
    icon: Users,
  },
  {
    title: "Get a real answer.",
    body: "A yes starts a conversation. A no comes with a reason. Every employer replies within ten days.",
    label: "A reply. Guaranteed.",
    icon: Check,
  },
  {
    title: "Make your next move.",
    body: "Interview, learn from feedback, or get recommended to another team. Every route moves you forward.",
    label: "Your next chapter",
    icon: ArrowUpRight,
  },
];
const benefits = [
  {
    title: "A reply. Every time.",
    body: "A reply within 10 days. Yes or no. Every employer signs the promise, and every application goes on the record.",
    icon: Send,
    num: "01",
    link: "See our promise",
    anchor: "#promise",
  },
  {
    title: "Know where you stand.",
    body: "See your application, its status and your next step. No refresh marathon. No more disappearing into the void.",
    icon: Layers,
    num: "02",
    link: "Follow the journey",
    anchor: "#journey",
  },
  {
    title: "The whole picture.",
    body: "Public employer grades, real reply rates and salaries upfront. Find out what a company is like before you apply.",
    icon: ShieldCheck,
    num: "03",
    link: "Meet the employers",
    anchor: "#employers",
  },
  {
    title: "Work that fits you.",
    body: "Proven skills and a useful match score. Find the roles where your experience, priorities and potential line up.",
    icon: Briefcase,
    num: "04",
    link: "Find your next role",
    anchor: "#jobs",
  },
];

function Assembly({ stage }) {
  const characterRef = useRef(null);
  useCharacterGaze(characterRef);
  return (
    <div
      className={`assembly assembly-stage-${stage}`}
      aria-label={`Application progress: ${journeySteps[stage].label}`}
    >
      <div className="assembly-guides" data-line-draw>
        <FigmaAsset section="50:224" name="imgAssemblyTechnicalGuides" />
      </div>
      <span className="assembly-coordinate">
        FIG. 003 / A BETTER WAY FORWARD
      </span>
      <div className="journey-character" ref={characterRef}>
        <div className="character-rig">
          <FigmaAsset
            className="character-body"
            section="50:224"
            name="img0E4898D695E09Ff317Afb818C7E67829BackgroundRemoved1"
            alt="A friendly illustrated job seeker who looks toward your cursor"
          />
          <div className="character-head" aria-hidden="true">
            <FigmaAsset
              className="character-head-image"
              section="50:224"
              name="img0E4898D695E09Ff317Afb818C7E67829BackgroundRemoved1"
            />
            {["left", "right"].map((eye) => (
              <span className={`character-eye character-eye-${eye}`} key={eye}>
                <span className="character-eye-cover" />
                <span className="character-eye-look">
                  <span className="character-pupil" />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployerCarousel({ onExplore }) {
  const [index, setIndex] = useState(0),
    track = useRef(null),
    drag = useRef(null);
  useEffect(() => {
    const visuals = track.current?.querySelectorAll(".employer-visual") || [];
    const resize = () =>
      visuals.forEach((el) =>
        el.style.setProperty("--report-scale", String(el.clientWidth / 610)),
      );
    resize();
    const observer = new ResizeObserver(resize);
    visuals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const go = (i) => {
    const n = (i + companies.length) % companies.length;
    setIndex(n);
    const el = track.current?.children[n];
    if (el)
      track.current.scrollTo({
        left: el.offsetLeft - (track.current.clientWidth - el.clientWidth) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  const update = () => {
    const t = track.current;
    if (!t) return;
    const center = t.scrollLeft + t.clientWidth / 2;
    let nearest = 0,
      d = Infinity;
    [...t.children].forEach((el, i) => {
      const dist = Math.abs(el.offsetLeft + el.clientWidth / 2 - center);
      if (dist < d) {
        d = dist;
        nearest = i;
      }
    });
    setIndex(nearest);
  };
  return (
    <section className="employers" id="employers">
      <div className="container">
        <SectionHeading title="Good employers. On the record." center />
        <p className="section-intro">
          Graded by the people they hired, and didn’t.
        </p>
      </div>
      <div
        className="employer-track"
        ref={track}
        onScroll={update}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(index - 1);
          }
        }}
        tabIndex={0}
        aria-label="Employer reports. Use arrow keys or swipe to browse."
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.target.closest("button,a")) return;
          drag.current = { x: e.clientX, scroll: track.current.scrollLeft };
          track.current.classList.add("dragging");
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          if (e.buttons !== 1) {
            drag.current = null;
            track.current.classList.remove("dragging");
            return;
          }
          track.current.scrollLeft =
            drag.current.scroll - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          drag.current = null;
          track.current.classList.remove("dragging");
        }}
        onPointerLeave={() => {
          drag.current = null;
          track.current.classList.remove("dragging");
        }}
      >
        {companies.map((c, i) => (
          <article
            className={`employer-card corner-frame ${index === i ? "active" : ""}`}
            key={c.name}
            aria-label={`${i === 0 ? "Figma" : c.name}, grade ${c.grade}`}
          >
            <div className="employer-visual">
              <div className="employer-blueprint">
                <FigmaAsset
                  section="50:297"
                  name="imgReportConstructionDrawing"
                />
              </div>
              <span className="report-id">
                EMPLOYER REPORT / {String(i + 1).padStart(3, "0")}
              </span>
              {i === 0 ? (
                <div className="employer-logo">
                  <FigmaAsset
                    section="50:297"
                    name="img2875C21F72Ab5155Ecea7D1F83Faad6DBackgroundRemoved1"
                    alt="Colorful sculpted Figma logo"
                  />
                </div>
              ) : (
                <div
                  className={`report-grade ${c.grade === "D" ? "grade-low" : ""}`}
                >
                  <span>PROGRIZE GRADE</span>
                  <strong>{c.grade}</strong>
                  <span>ACCOUNTABILITY. IN THE OPEN.</span>
                </div>
              )}
            </div>
            <div className="employer-card-info">
              <div className="employer-card-title">
                <h3>{i === 0 ? "Figma" : c.name}</h3>
                <span className="mono">{String(i + 1).padStart(3, "0")}</span>
              </div>
              <p>{c.line}</p>
              <div className="employer-details">
                <span>
                  Reply rate <b>{c.rate}</b>
                </span>
                <span>
                  Average reply <b>{c.time}</b>
                </span>
                <span>
                  Open role <b>{c.role}</b>
                </span>
              </div>
              <Button
                secondary
                onClick={() => onExplore(i === 0 ? { ...c, name: "Figma" } : c)}
              >
                View open role
              </Button>
            </div>
          </article>
        ))}
      </div>
      <div className="carousel-controls">
        <button
          className="icon-button"
          aria-label="Previous employer"
          onClick={() => go(index - 1)}
        >
          <FigmaAsset section="50:297" name="imgArrowLeft" />
        </button>
        {companies.map((c, i) => (
          <button
            className={`carousel-dot ${index === i ? "active" : ""}`}
            key={c.name}
            aria-label={`View ${i === 0 ? "Figma" : c.name}`}
            aria-pressed={index === i}
            onClick={() => go(i)}
          />
        ))}
        <button
          className="icon-button"
          aria-label="Next employer"
          onClick={() => go(index + 1)}
        >
          <FigmaAsset section="50:297" name="imgArrowRight" />
        </button>
      </div>
    </section>
  );
}

function JobBrowser({ onApply }) {
  const [tab, setTab] = useState("All roles"),
    [query, setQuery] = useState(""),
    [saved, setSaved] = useState([]);
  const jobs = companies.filter(
    (c) =>
      (tab === "All roles" ||
        (tab === "Design"
          ? c.role.includes("Designer")
          : c.role.includes("Engineer"))) &&
      `${c.name} ${c.role}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="jobs container section" id="jobs">
      <SectionHeading
        title={
          <>
            A rejection that
            <br />
            <span>opens a door.</span>
          </>
        }
      >
        <p>
          A “no” doesn’t have to be the end. Get useful feedback, a
          recommendation, or a fresh start with a team that fits.
        </p>
      </SectionHeading>
      <div className="job-workspace" data-reveal>
        <div className="workspace-top">
          <div className="window-lights">
            <i />
            <i />
            <i />
          </div>
          <span className="mono">YOUR NEXT CHAPTER</span>
          <span className="mono">Progrize</span>
        </div>
        <div className="job-toolbar">
          <Tabs
            items={["All roles", "Design", "Engineering"]}
            value={tab}
            onChange={setTab}
            label="Filter jobs"
          />
          <label className="search">
            <FigmaAsset section="50:593" name="imgSearch" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles or companies"
              aria-label="Search roles or companies"
            />
          </label>
        </div>
        <div className="job-list">
          {jobs.length ? (
            jobs.map((c) => (
              <article className="job-row" key={c.name}>
                <div
                  className={`company-monogram company-image ${c.name === "Northwind Labs" ? "company-image-cropped" : ""}`}
                >
                  <FigmaAsset
                    section="50:593"
                    name={
                      {
                        "Northwind Labs": "imgImage3",
                        "Brightside Health": "imgImage4",
                        "Koto Finance": "imgImage5",
                        "Margo Group": "imgImage6",
                      }[c.name]
                    }
                    alt={`${c.name} company image`}
                  />
                </div>
                <button className="job-description" onClick={() => onApply(c)}>
                  <h3>{c.role}</h3>
                  <p>
                    {c.name} <span>· London / Hybrid</span>
                  </p>
                </button>
                <span className="job-grade">
                  {c.grade}
                  <small>GRADE</small>
                </span>
                <span className="job-salary">
                  {c.salary}
                  <small>PER YEAR</small>
                </span>
                <button
                  className={`icon-button bookmark ${saved.includes(c.name) ? "saved" : ""}`}
                  aria-label={`${saved.includes(c.name) ? "Unsave" : "Save"} ${c.role}`}
                  onClick={() =>
                    setSaved((s) =>
                      s.includes(c.name)
                        ? s.filter((n) => n !== c.name)
                        : [...s, c.name],
                    )
                  }
                >
                  {saved.includes(c.name) ? (
                    <Bookmark size={16} fill="currentColor" />
                  ) : (
                    <FigmaAsset section="50:593" name="imgBookmark" />
                  )}
                </button>
                <button
                  className="icon-button apply-icon"
                  onClick={() => onApply(c)}
                  aria-label={`Apply for ${c.role}`}
                >
                  <FigmaAsset section="50:593" name="imgArrowUpRight1" />
                </button>
              </article>
            ))
          ) : (
            <p className="empty-state">
              No roles match that search. Try a different title or company.
            </p>
          )}
        </div>
        <div className="workspace-footer">
          <span>
            <i />
            {jobs.length} REAL ROLES. ZERO GUESSWORK.
          </span>
          <span>{saved.length} SAVED</span>
        </div>
      </div>
    </section>
  );
}

function Profile({ onJoin }) {
  const [skill, setSkill] = useState("Design"),
    [tab, setTab] = useState("Profile");
  const tags =
    skill === "Design"
      ? ["Product design", "Design systems", "Prototyping"]
      : skill === "Development"
        ? ["React", "TypeScript", "Accessibility"]
        : ["Brand strategy", "Research", "Storytelling"];
  return (
    <section className="profile-section container section" id="profile">
      <div className="profile-copy">
        <h2 data-heading-reveal>
          Skills you’ve proven.
          <br />
          <span>Not just listed.</span>
        </h2>
        <p>
          A profile that does the talking. Real work, challenges and projects
          that show how you think. Give people a reason to look past the job
          title.
        </p>
        <div className="skill-options">
          {["Design", "Development", "Strategy"].map((s) => (
            <button
              key={s}
              className={s === skill ? "active" : ""}
              onClick={() => setSkill(s)}
            >
              <FlickerText>{s}</FlickerText>
              <FigmaAsset
                section="50:693"
                name={s === "Design" ? "imgArrowUpRight" : "imgArrowUpRight1"}
              />
            </button>
          ))}
        </div>
        <Button secondary onClick={onJoin}>
          Create your profile
        </Button>
      </div>
      <div className="profile-card corner-frame active" data-reveal>
        <div className="profile-card-top">
          <div className="avatar">
            <div className="profile-portrait">
              <FigmaAsset
                section="50:693"
                name="imgImage1"
                alt="Rohith’s profile portrait"
              />
            </div>
          </div>
          <div>
            <span className="mono">OPEN TO GOOD WORK</span>
            <h3>Rohith X.</h3>
            <p>
              {skill === "Design"
                ? "Product designer"
                : skill === "Development"
                  ? "Frontend developer"
                  : "Brand strategist"}{" "}
              · London, UK
            </p>
          </div>
          <span className="available-dot" title="Available for work" />
        </div>
        <div className="profile-tags">
          {tags.map((s, index) => (
            <span key={s}>
              {s}
              <FigmaAsset
                section="50:693"
                name={index === 2 ? "imgCheck1" : "imgCheck"}
              />
            </span>
          ))}
        </div>
        <Tabs
          items={["Profile", "Proven skills", "Experience"]}
          value={tab}
          onChange={setTab}
          label="Profile sections"
        />
        <div className="profile-content">
          {tab === "Profile" ? (
            <>
              <p>
                I make complex things feel simple.
                <br />
                Thoughtful digital experiences for real people.
              </p>
              <span className="verified">
                <FigmaAsset section="50:693" name="imgShieldCheck" />
                Identity verified <b>Work speaks louder.</b>
              </span>
            </>
          ) : tab === "Proven skills" ? (
            ["Craft", "Problem solving", "Systems thinking"].map((x, i) => (
              <div className="profile-line" key={x}>
                <span>{x}</span>
                <span>
                  {[94, 89, 92][i]} / 100 <Check size={12} />
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="profile-line">
                <span>
                  Senior{" "}
                  {skill === "Design"
                    ? "Product Designer"
                    : skill === "Development"
                      ? "Developer"
                      : "Strategist"}
                </span>
                <span>2023 — NOW</span>
              </div>
              <div className="profile-line">
                <span>Creative Technologist</span>
                <span>2020 — 2023</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Promise({ onEmployer }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="promise container section" id="promise">
      <SectionHeading
        title={
          <>
            Three rules.
            <br />
            <span>Every employer signs.</span>
          </>
        }
      >
        <Button secondary onClick={onEmployer}>
          Are you an employer?
        </Button>
      </SectionHeading>
      <div className="promise-layout">
        <div className="promise-graphic" data-reveal>
          <FigmaAsset section="50:766" name="imgPromiseTechnicalVerification" />
          <span className="mono">SIGNED. NOT JUST SAID.</span>
        </div>
        <div className="promise-rules">
          {rules.map(([title, body], i) => (
            <div
              className={`promise-rule ${open === i ? "open" : ""}`}
              key={title}
            >
              <button
                aria-expanded={open === i}
                aria-controls={`promise-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="mono">0{i + 1}</span>
                <h3>{title}</h3>
                <PlusMinus open={open === i} />
              </button>
              <div id={`promise-${i}`} hidden={open !== i}>
                <p>{body}</p>
                <span className="mono">
                  <FigmaAsset section="50:693" name="imgCheck" /> ON THE RECORD.
                  EVERY TIME.
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="accountability-strip">
        <span>
          <Clock size={15} /> Promise a date. Keep it. Get graded for it.
        </span>
        <span className="mono">NO SMALL PRINT. NO CROSSED FINGERS.</span>
      </div>
    </section>
  );
}

function FeatureList({ onJoin }) {
  const [filter, setFilter] = useState("All"),
    [open, setOpen] = useState(null);
  return (
    <section className="feature-section container section" id="features">
      <SectionHeading
        title={
          <>
            Everything Progrize does.
            <br />
            <span>On one page.</span>
          </>
        }
      >
        <Tabs
          items={["All", "Job search", "Your profile", "Employers"]}
          value={filter}
          onChange={setFilter}
          label="Filter features"
        />
      </SectionHeading>
      <div className="feature-list">
        {features
          .filter((f) => filter === "All" || f[2] === filter)
          .map(([name, desc, cat], i) => (
            <div className="feature-item" key={name}>
              <button
                onClick={() => setOpen(open === name ? null : name)}
                aria-expanded={open === name}
              >
                <span className="feature-number mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{name}</h3>
                <p>{desc}</p>
                <span className="feature-category mono">{cat}</span>
                <PlusMinus open={open === name} section="50:850" />
              </button>
              {open === name && (
                <div className="feature-expanded">
                  <p>
                    {desc} Part of a job hunt that respects your time, with more
                    transparency and less guesswork.
                  </p>
                  <Button secondary onClick={onJoin}>
                    Get started
                  </Button>
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}

function App() {
  const root = useRef(null),
    dialog = useRef(null),
    returnFocus = useRef(null);
  const [stage, setStage] = useState(0),
    [menu, setMenu] = useState(false),
    [dropdown, setDropdown] = useState(false),
    [modal, setModal] = useState(null),
    [submitted, setSubmitted] = useState(false),
    [newsletter, setNewsletter] = useState("");
  useMotion(root, setStage);
  const openModal = (type) => {
    returnFocus.current = document.activeElement;
    setSubmitted(false);
    setModal(type);
    setMenu(false);
    setDropdown(false);
  };
  const closeModal = () => {
    dialog.current?.close();
    setModal(null);
    returnFocus.current?.focus();
  };
  useEffect(() => {
    if (!modal) return;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);
  const apply = (c) => openModal(`Apply for ${c.role} at ${c.name}`);
  const download = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="650" height="840"><rect width="650" height="840" rx="12" fill="#e1ff76"/><text x="45" y="75" fill="#172014" font-family="Arial" font-size="24">Progrize / YOUR PASSPORT</text><text x="45" y="240" fill="#172014" font-family="Arial" font-size="52">Your ghosting, fixed.</text><text x="45" y="305" fill="#4d5846" font-family="Arial" font-size="52">In 23 days.</text><path d="M45 360h560M45 600h560" stroke="#cfd6c7"/><text x="45" y="455" fill="#172014" font-family="Arial" font-size="72">84 / 84</text><text x="45" y="510" fill="#4d5846" font-family="monospace" font-size="20">APPLICATIONS / REAL ANSWERS</text><text x="45" y="750" fill="#172014" font-family="Arial" font-size="22">Every application gets an answer.</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "progrize-passport.svg";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div ref={root}>
      <header className={`site-header ${menu ? "menu-open" : ""}`}>
        <Brand />
        <nav aria-label="Main navigation">
          <div className="nav-dropdown" onMouseLeave={() => setDropdown(false)}>
            <button
              className="nav-link"
              onMouseEnter={() => setDropdown(true)}
              onClick={() => setDropdown(!dropdown)}
              aria-expanded={dropdown}
            >
              <FlickerText>What we do</FlickerText>
              <Plus size={12} className={dropdown ? "rotated" : ""} />
            </button>
            <div className={`dropdown-panel ${dropdown ? "open" : ""}`}>
              {benefits.map((b) => (
                <a
                  href={b.anchor}
                  key={b.num}
                  onClick={() => {
                    setDropdown(false);
                    setMenu(false);
                  }}
                >
                  <b.icon size={20} />
                  <span>{b.title}</span>
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </div>
          <a
            className="nav-link"
            href="#employers"
            onClick={() => setMenu(false)}
          >
            <FlickerText>Employers</FlickerText>
          </a>
          <a className="nav-link" href="#jobs" onClick={() => setMenu(false)}>
            <FlickerText>Find work</FlickerText>
          </a>
          <a
            className="nav-link"
            href="#profile"
            onClick={() => setMenu(false)}
          >
            <FlickerText>Your profile</FlickerText>
          </a>
          <a
            className="nav-link"
            href="#promise"
            onClick={() => setMenu(false)}
          >
            <FlickerText>Our promise</FlickerText>
          </a>
        </nav>
        <div className="nav-actions">
          <button className="nav-login" onClick={() => openModal("Log in")}>
            <FlickerText>Log in</FlickerText>
          </button>
          <Button header onClick={() => openModal("Join Progrize")}>
            Get started
          </Button>
        </div>
        <button
          className="mobile-menu"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      <main>
        <section className="hero" id="home">
          <GridDrawing />
          <div className="hero-center">
            <div className="hero-banner">
              <span className="banner-icon">
                <FigmaAsset section="50:115" name="imgArrowUpRight1" />
              </span>
              <span>Your next chapter. A real answer.</span>
              <a href="#promise">
                <FlickerText>Our promise</FlickerText>
                <FigmaAsset section="50:115" name="imgArrowUpRight2" />
              </a>
            </div>
            <h1 className="hero-title">
              <FlickerText>Every application</FlickerText>
              <br />
              <FlickerText>gets an answer.</FlickerText>
            </h1>
            <div className="hero-description">
              <p>Good work starts with a little respect.</p>
              <p>
                Real roles, real people, and a reply to every application.
                <br />
                No more wondering. No more waiting forever.
              </p>
            </div>
            <div className="hero-actions">
              <Button href="#jobs">Find your next job</Button>
            </div>
          </div>
          <ScrollPrompt />
        </section>
        <section
          className="process container"
          id="journey"
          aria-label="How Progrize works"
        >
          <div className="process-track" style={{ borderRadius: "10px" }}>
            <div className="process-steps">
              {journeySteps.map((item, i) => (
                <article
                  className={`process-step ${stage === i ? "is-current" : ""}`}
                  key={item.title}
                >
                  <span
                    className="process-step-label mono"
                    style={
                      i === 1
                        ? { backgroundColor: "rgb(255, 255, 255)" }
                        : undefined
                    }
                  >
                    {String(i + 1).padStart(2, "0")} / {item.label}
                  </span>
                  <h2 data-heading-reveal>
                    {i === 0 ? (
                      <>
                        Put <span className="journey-emphasis">yourself</span>{" "}
                        out there.
                      </>
                    ) : (
                      item.title
                    )}
                  </h2>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
            <div className="process-sticky">
              <Assembly stage={stage} />
            </div>
          </div>
        </section>
        <EmployerCarousel onExplore={apply} />
        <section className="benefits container section" id="how-it-works">
          <SectionHeading
            title={
              <>
                A better way to find
                <br />
                what comes next.
              </>
            }
          >
            <Button secondary onClick={() => openModal("Join Progrize")}>
              Get started
            </Button>
          </SectionHeading>
          <div className="benefit-grid">
            {benefits.map((b) => (
              <article className="benefit corner-frame" key={b.num} data-reveal>
                <div className="benefit-content">
                  <div className="benefit-icon">
                    <FigmaAsset
                      section="50:381"
                      name={
                        "img" +
                        {
                          "01": "Send",
                          "02": "Layers",
                          "03": "ShieldCheck",
                          "04": "Briefcase",
                        }[b.num]
                      }
                    />
                  </div>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </div>
                <Button secondary href={b.anchor}>
                  {b.link}
                </Button>
              </article>
            ))}
          </div>
        </section>
        <section className="impact container section">
          <SectionHeading
            title={
              <>
                Less guesswork.
                <br />
                Better possibilities.
              </>
            }
          >
            <p>
              A job hunt that respects your time.
              <br />
              Here’s what changes with Progrize.
            </p>
          </SectionHeading>
          <div className="impact-grid">
            <article className="impact-card" data-reveal>
              <div className="impact-visual">
                <FigmaAsset section="50:438" name="imgClock" />
                <strong>
                  <span data-count="10">10</span>
                </strong>
                <small>DAYS</small>
              </div>
              <h3>A reply within 10 days.</h3>
              <p>
                A deadline that means something. Every employer agrees to it.
              </p>
            </article>
            <article className="impact-card" data-reveal>
              <div className="impact-visual">
                <FigmaAsset section="50:438" name="imgBriefcase" />
                <strong>
                  £<span data-count="0">0</span>
                </strong>
              </div>
              <h3>Always free to apply.</h3>
              <p>Your next opportunity should never come with an entry fee.</p>
            </article>
            <article className="impact-card" data-reveal>
              <div className="impact-visual">
                <FigmaAsset section="50:438" name="imgFileCheck" />
                <strong>
                  <span data-count="1">1</span>
                </strong>
                <small>REASON</small>
              </div>
              <h3>A reason with every no.</h3>
              <p>
                Real feedback to help you move forward, instead of a dead end.
              </p>
            </article>
            <article className="match-card" data-reveal>
              <div className="match-summary">
                <span className="mono">KNOW YOUR ODDS BEFORE YOU APPLY.</span>
                <h3>
                  Strong chance.
                  <br />
                  <span>Apply.</span>
                </h3>
                <p>
                  Your skills, experience and priorities meet what the team
                  needs. A score that tells you something useful.
                </p>
                <Button secondary href="#jobs">
                  Find your match
                </Button>
              </div>
              <div className="match-score">
                <strong>
                  <span data-count="86">86</span>
                  <small>/100</small>
                </strong>
                <span className="mono">YOUR WORTH-IT SCORE</span>
                {[
                  ["Your skills", 92],
                  ["Experience", 88],
                  ["Salary & needs", 100],
                  ["Ways of working", 81],
                ].map(([name, v]) => (
                  <div className="score-row" key={name}>
                    <span>{name}</span>
                    <div>
                      <i style={{ width: `${v}%` }} />
                    </div>
                    <span>{v}%</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
        <section className="mission">
          <GridDrawing type="mission" />
          <div className="mission-content">
            <span className="section-tag">
              A little respect goes a long way
            </span>
            <h2 data-heading-reveal>
              Know your odds.
              <br />
              Prove your skills.
              <br />
              <span>Get your answer.</span>
            </h2>
            <p>
              Every application is someone putting themselves out there.
              <br />
              We believe that deserves a response.
            </p>
            <Button onClick={() => openModal("Join Progrize")}>
              Get started with Progrize
            </Button>
          </div>
        </section>
        <JobBrowser onApply={apply} />
        <Profile onJoin={() => openModal("Create your profile")} />
        <Promise onEmployer={() => openModal("Employer early access")} />
        <section className="passport-section container section">
          <div className="passport-panel">
            <div>
              <h2 data-heading-reveal>
                Your job hunt.
                <br />
                <span>In one card.</span>
              </h2>
              <p>
                A small record of a big step. Your applications, answers and
                everything you put into finding what’s next. Keep it. Share it.
                Make it yours.
              </p>
              <Button onClick={download}>Get my card</Button>
            </div>
            <div className="passport-visual" data-reveal>
              <div className="passport-card">
                <div className="passport-top mono">
                  <span>Progrize</span>
                  <FigmaAsset section="50:816" name="imgArrowUpRight1" />
                </div>
                <h3>
                  Your ghosting, fixed.
                  <br />
                  <span>In 23 days.</span>
                </h3>
                <div className="passport-stats">
                  {[
                    ["84", "Applications"],
                    ["84", "Real answers"],
                    ["6", "Interviews"],
                    ["0", "Black holes"],
                  ].map(([n, l]) => (
                    <div key={l}>
                      <strong>{n}</strong>
                      <span className="mono">{l}</span>
                    </div>
                  ))}
                </div>
                <div className="passport-bottom mono">
                  <span>
                    EVERY APPLICATION.
                    <br />
                    AN ANSWER. AT LAST.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FeatureList onJoin={() => openModal("Join Progrize")} />
        <section className="final-cta">
          <GridDrawing type="cta" />
          <div className="final-cta-content">
            <span className="section-tag">Your next chapter starts here</span>
            <h2 data-heading-reveal>
              Next Era of job hunting
            </h2>
            <p>
              Real roles. Clear salaries. An answer to every application.
              <br />
              Let’s make work a little more human.
            </p>
            <Button onClick={() => openModal("Join Progrize")}>
              Get started
            </Button>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-about">
            <Brand large />
            <p>
              Every application is someone’s next chapter. Progrize brings a
              little accountability to hiring — real roles, clear salaries,
              useful feedback, and a reply to every application.
            </p>
            <p>
              A better way to find good work.
              <br />A better way to move forward.
            </p>
            <div className="footer-copyright mono">
              © {new Date().getFullYear()} Progrize{" "}
              <span>GOOD WORK. REAL ANSWERS.</span>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <span className="footer-label">[Navigation]</span>
              <a href="#home">Home</a>
              <a href="#employers">Employers</a>
              <a href="#jobs">Find work</a>
              <a href="#promise">Our promise</a>
              <a href="#features">All features</a>
            </div>
            <div className="newsletter">
              <span className="footer-label">[Newsletter]</span>
              <h3>Stay in the loop</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openModal(`Newsletter preview for ${newsletter}`);
                  setNewsletter("");
                }}
              >
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter email…"
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  required
                />
                <button
                  className="icon-button"
                  aria-label="Subscribe to newsletter"
                >
                  <FigmaAsset section="50:593" name="imgArrowUpRight1" />
                </button>
              </form>
              <span className="newsletter-note">
                Preview only. No email is sent or stored.
              </span>
            </div>
            <div>
              <span className="footer-label">[For people]</span>
              <button onClick={() => openModal("Create your profile")}>
                Create a profile
              </button>
              <a href="#profile">Proven skills</a>
              <a href="#jobs">Explore roles</a>
            </div>
            <div>
              <span className="footer-label">[For employers]</span>
              <button onClick={() => openModal("Employer early access")}>
                Hire thoughtfully
              </button>
              <a href="#promise">The Progrize promise</a>
              <a href="#employers">Public grades</a>
            </div>
          </div>
        </div>
      </footer>
      {modal && (
        <dialog
          className="modal"
          data-lenis-prevent
          ref={dialog}
          aria-label={modal}
          onCancel={(e) => {
            e.preventDefault();
            closeModal();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <button
            className="modal-close icon-button"
            onClick={closeModal}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
          {submitted ? (
            <div className="success">
              <div className="success-mark">
                <Check size={28} />
              </div>
              <h2>Thanks for your interest.</h2>
              <p>
                This is a local preview. No details have been sent, and no
                account has been created. You can keep exploring the site.
              </p>
              <Button onClick={closeModal}>Keep exploring</Button>
            </div>
          ) : (
            <>
              <Brand />
              <h2>
                {modal.includes("Apply for")
                  ? "Make your next move."
                  : modal === "Log in"
                    ? "Welcome back."
                    : modal === "Employer early access"
                      ? "Set a better standard."
                      : modal.startsWith("Newsletter")
                        ? "Stay in the loop."
                        : "Get started with Progrize."}
              </h2>
              <p>
                {modal.includes("Apply for")
                  ? modal
                  : modal.startsWith("Newsletter")
                    ? "Preview the newsletter sign-up below."
                    : "Join the people making work a little more human."}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                {modal !== "Log in" && (
                  <label>
                    Your name
                    <input
                      autoComplete="name"
                      name="name"
                      required
                      placeholder="Alex Morgan"
                    />
                  </label>
                )}
                <label>
                  Email address
                  <input
                    name="email"
                    autoComplete="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                  />
                </label>
                {modal === "Employer early access" && (
                  <label>
                    Company name
                    <input name="company" required placeholder="Your company" />
                  </label>
                )}
                <Button>
                  {modal === "Log in"
                    ? "Continue with email"
                    : "Register your interest"}
                </Button>
                <small>
                  Interactive preview. No account is created or email sent.
                </small>
              </form>
            </>
          )}
        </dialog>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
