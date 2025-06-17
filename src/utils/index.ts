import { AVATAR_COLORS, GRADIENT_COMBOS } from '../config';

export const getRandomColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id?.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const generateGradient = (name: string) => {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }

  return GRADIENT_COMBOS[sum % GRADIENT_COMBOS.length];
};

export const fetchImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      } else {
        reject(new Error(`Failed to load image: ${xhr.status}`));
      }
    };

    xhr.onerror = reject;
    xhr.send();
  });
};
