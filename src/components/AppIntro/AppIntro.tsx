const stats = [
  { value: "19k+", label: "React Devs" },
  { value: "3.2k", label: "Posts Shared" },
  { value: "540", label: "Libraries" },
  { value: "120", label: "Meetups" },
  { value: "24/7", label: "Community" },
];

function AppIntro() {
  return (
    <div className="order-2 w-full lg:order-1 lg:max-w-xl">
      <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">
        React Posts
      </h1>

      <p className="mt-4 text-2xl font-medium leading-snug text-slate-800 dark:text-slate-100">
        The social home for React developers to share hooks, patterns, and ship logs.
      </p>

      <div className="brand-card">
        <p className="brand-label">About React Posts</p>

        <p className="brand-title">Your React developer community</p>

        <p className="brand-description">
          Welcome to React Posts — discover tutorials, compare libraries, debate
          architecture, and connect with developers building with React around the
          world.
        </p>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppIntro;