import { Navbar } from "@/components";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
