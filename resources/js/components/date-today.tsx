export function DateToday({ className = "", ...props }) {
  return (
    <span
      className={`text-sidebar-accent-foreground ${className}`}
      {...props}
    >
      {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  );
}
