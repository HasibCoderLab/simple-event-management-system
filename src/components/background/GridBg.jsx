export default function GridBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(20,184,166,0.055) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(20,184,166,0.055) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}
