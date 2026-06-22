import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Smooth fade-in transition for page navigation.
 * Prevents abrupt white flashes between route changes.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to ensure the initial render is committed
    // before triggering the opacity transition
    const raf = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="w-full h-full"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease-in',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;