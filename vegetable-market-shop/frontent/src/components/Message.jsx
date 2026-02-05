export default function Message({ variant = 'info', children }) {
  return (
    <div className={`message message-${variant}`}>
      {children}
    </div>
  );
}
