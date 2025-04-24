import { useEffect, useState } from "react";

export const useActiveSection = (
  sectionIds: string[],
  headerId: string,
  defaultKey: string = ""
) => {
  const [activeKey, setActiveKey] = useState(defaultKey);

  useEffect(() => {
    const header = document.getElementById(headerId);
    const offset = header?.offsetHeight ?? 120;
    const observerOptions = {
      root: null,
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      let topMostSection: string | null = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (
            !topMostSection ||
            entry.target.getBoundingClientRect().top <
              document.getElementById(topMostSection)?.getBoundingClientRect()
                .top!
          ) {
            topMostSection = entry.target.id;
          }
        }
      });

      if (topMostSection) setActiveKey(topMostSection);
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, headerId]);

  return [activeKey, setActiveKey] as const;
};
