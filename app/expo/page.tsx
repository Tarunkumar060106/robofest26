import styles from "./ExpoPage.module.css";

export default function ExpoPage() {
  return (
    <main className={styles.page}>
      <div className={styles.grain} aria-hidden />

      <header className={styles.hero}>
        <div className={styles.heroPanel}>
          <p className={styles.eyebrow}>RoboFest 2.0 — Special Event</p>
          <h1 className={styles.title}>Robotics Expo</h1>
          <p className={styles.lede}>
            As part of RoboFest 2.0, we are excited to present the Robotics
            Expo, a platform for{" "}
            <span className={styles.highlight}>innovators</span>, makers,
            researchers, startups, and students to showcase their{" "}
            <span className={styles.highlight}>cutting-edge projects</span> and
            technological creations.
          </p>
          <p className={styles.lede}>
            Whether it&apos;s a robotics prototype, AI-powered system, IoT
            solution, automation project, drone, embedded system, research
            model, or any innovative engineering product — this expo is your
            <span className={styles.highlight}>opportunity</span> to present
            your work to a wide audience including industry professionals,
            mentors, faculty members, and fellow innovators.
          </p>

          <div className={styles.factsRow} aria-label="Quick facts">
            {[
              ["Date", "21 August 2026"],
              ["Venue", "702 TP2"],
              ["Entry Fee", "₹200"],
              ["Team Size", "Up to 3"],
              ["Prize Pool", "₹25,000"],
            ].map(([k, v]) => (
              <div key={k} className={styles.factChip}>
                <div className={styles.factKey}>{k}</div>
                <div className={styles.factVal}>{v}</div>
              </div>
            ))}
          </div>

          <div className={styles.funTiles} aria-label="Highlights">
            <div className={styles.funTile}>
              <div className={styles.funTileTitle}>Show</div>
              <div className={styles.funTileText}>
                Demo your project live at your own booth.
              </div>
            </div>
            <div className={styles.funTile}>
              <div className={styles.funTileTitle}>Meet</div>
              <div className={styles.funTileText}>
                Get feedback from mentors, judges, and visitors.
              </div>
            </div>
            <div className={styles.funTile}>
              <div className={styles.funTileTitle}>Win</div>
              <div className={styles.funTileText}>
                Compete for prizes, recognition, and certificates.
              </div>
            </div>
          </div>

          <div className={styles.heroCtas}>
            <a
              className={styles.primaryCta}
              href="https://forms.gle/raCUZjCLGn9NMtDC9"
              target="_blank"
              rel="noreferrer"
            >
              Register Here →
            </a>
            <a className={styles.secondaryCta} href="#details">
              See Event Details
            </a>
          </div>
        </div>
      </header>

      <section id="details" className={styles.section}>
        <h2 className={styles.sectionTitle}>Event Details</h2>
        <div className={styles.card}>
          <dl className={styles.detailsTable}>
            {[
              ["Event Name", "Robotics Expo"],
              ["Date", "21 August 2026"],
              ["Venue", "702 TP2"],
              ["Entry Fee", "₹200 per team"],
              ["Prize Pool", "₹25,000"],
              ["Maximum Team Size", "3 Members"],
              ["Faculty Coordinator", "Dr. R Lavanya"],
              ["Student SPOC", "Harshil Malhotra"],
            ].map(([label, value]) => (
              <div key={label} className={styles.detailsRow}>
                <dt className={styles.detailsKey}>{label}</dt>
                <dd className={styles.detailsVal}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About the Expo</h2>
        <div className={styles.card}>
          <p className={styles.paragraph}>
            The Robotics Expo is designed to encourage innovation, creativity,
            and practical engineering applications. Participants will be
            provided with a dedicated exhibition space to demonstrate and
            explain their projects to visitors, judges, industry experts, and
            mentors.
          </p>
          <p className={styles.paragraph}>
            This is an excellent opportunity to:
          </p>
          <ul className={styles.list}>
            <li>Showcase your innovation and technical skills</li>
            <li>Gain exposure among industry mentors and professionals</li>
            <li>Receive valuable feedback on your project</li>
            <li>Network with robotics enthusiasts and innovators</li>
            <li>Compete for exciting prizes and recognition</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Project Domains</h2>
        <div className={styles.card}>
          <p className={styles.paragraph}>
            Participants are free to present projects from any domain related
            to:
          </p>
          <ul className={styles.pillList}>
            {[
              "Robotics",
              "Artificial Intelligence",
              "Automation",
              "IoT Systems",
              "Embedded Systems",
              "Drones & UAVs",
              "Smart Systems",
              "Industrial Solutions",
              "Research & Innovation Projects",
              "Assistive Technologies",
              "Sustainable Tech Solutions",
              "Open Innovation Concepts",
            ].map((item) => (
              <li key={item} className={styles.pill}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Rules &amp; Guidelines</h2>
        <div className={styles.card}>
          <ul className={styles.list}>
            <li>A maximum of 3 members is allowed per team.</li>
            <li>
              Participants must bring their own project/product/setup required
              for demonstration.
            </li>
            <li>
              Dedicated exhibition space and basic power supply will be
              provided.
            </li>
            <li>
              Teams are responsible for the safety and handling of their
              equipment.
            </li>
            <li>
              Projects must be original or significantly modified by the
              participating team.
            </li>
            <li>
              Any unsafe, hazardous, or offensive demonstration will lead to
              immediate disqualification.
            </li>
            <li>
              Teams should be prepared to explain the working, application, and
              innovation behind their project.
            </li>
          </ul>

          <div className={styles.evalBlock}>
            <p className={styles.evalTitle}>
              Industry mentors and judges will evaluate projects based on:
            </p>
            <ul className={styles.evalList}>
              <li>Innovation</li>
              <li>Technical Implementation</li>
              <li>Practical Applications</li>
              <li>Presentation &amp; Demonstration</li>
              <li>Impact &amp; Creativity</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Participate?</h2>
        <div className={styles.card}>
          <ul className={styles.list}>
            <li>Showcase your project on an international robotics platform</li>
            <li>Interact directly with industry mentors and experts</li>
            <li>Build valuable connections with innovators and participants</li>
            <li>Gain recognition and certificates</li>
            <li>Win exciting cash prizes</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.card}>
          <p className={styles.paragraph}>
            For queries regarding the Robotics Expo:
          </p>
          <div className={styles.contactRows}>
            <div className={styles.contactRow}>
              <span className={styles.contactKey}>Student SPOC</span>
              <span className={styles.contactVal}>Harshil Malhotra</span>
            </div>
            <div className={styles.contactRow}>
              <span className={styles.contactKey}>Faculty Coordinator</span>
              <span className={styles.contactVal}>Dr. R. Lavanya</span>
            </div>
            <div className={styles.contactRow}>
              <span className={styles.contactKey}>Participant Support</span>
              <span className={styles.contactVal}>
                <a className={styles.link} href="mailto:contact@robofest.in">
                  contact@robofest.in
                </a>
              </span>
            </div>
            <div className={styles.contactRow}>
              <span className={styles.contactKey}>Official Event Mail</span>
              <span className={styles.contactVal}>
                <a className={styles.link} href="mailto:robofest@srmist.edu.in">
                  robofest@srmist.edu.in
                </a>
              </span>
            </div>
          </div>

          <div className={styles.bottomCta}>
            <a
              className={styles.primaryCta}
              href="https://forms.gle/raCUZjCLGn9NMtDC9"
              target="_blank"
              rel="noreferrer"
            >
              Register Here →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
