export function AppProvider({ children }: { children: React.ReactNode }) {
  // Add any providers you need here (Theme, Auth, etc.)
  return <>{children}</>;
}
