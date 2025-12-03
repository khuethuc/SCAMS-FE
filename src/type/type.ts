export type MainLayoutProps = {
  children: React.ReactNode;
};

export interface HeaderProps {
  currentPage?: "login" | "register";
  isAuthenticated?: boolean;
  user?: { name: string; email: string };
  onLogout?: () => void;
}