export const scrollToSectionWithOffset = (id?: string) => {
  let element,
    offsetPosition = 0;
  if (id) {
    element = document.getElementById(id);
  }
  const header = document.getElementById('header-id');
  const offset = header?.offsetHeight ?? 120;
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    offsetPosition = elementPosition - offset - 20;
  }
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

export function formatString(template: string, params: Record<string, string | number>) {
  return template.replace(/{(.*?)}/g, (_, key) => String(params[key] ?? ''));
}
