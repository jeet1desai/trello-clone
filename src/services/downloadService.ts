import axios from 'axios';

export const handleDownload = async (fileUrl: string, fileName: string) => {
  try {
    const response = await axios.get(fileUrl, {
      responseType: 'blob',
    });

    const blobUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
  }
};
