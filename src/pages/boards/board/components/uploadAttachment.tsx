import React, { useState, useEffect } from 'react';
import { Modal, Button, Upload, UploadFile, Form } from 'antd';
import { RcFile } from 'antd/es/upload';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import CustomUploadItem from './uploadItems';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { addNewAttachment, addNewTaskAttachment } from '../../../../store/slices/taskAttachmentSlice';
import { toNativeFile } from './taskModal';
import socketService from '../../../../services/socketService';
import { updateAttachmentCount } from '../../../../store/slices/taskSlice';
import { CirclePlay, File, FileImage, FileX, Plus } from 'lucide-react';

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/svg+xml',
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.google-apps.spreadsheet',
  'video/mp4',
  'video/quicktime', // mov
  'video/webm',
  'video/x-msvideo', // avi
  'video/x-matroska', // mkv
];

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_COUNT = 25;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const FileUploadModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTask } = useSelector((state: RootState) => state.task);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null);
  const [uploadFileError, setUploadFileError] = useState<string>('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewTitle(file.name ?? file.url?.substring(file.url.lastIndexOf('/') + 1) ?? 'Preview');

    if (file.type?.startsWith('image/')) {
      setPreviewContent(<img alt="preview" className="img-preview-container" src={file.url ?? file.preview} />);
    } else if (file.type?.startsWith('video/')) {
      setPreviewContent(
        <video controls className="attachment-width" src={file.url ?? (file.preview as string)}>
          <track kind="captions" srcLang="en" label="English captions" src="path-to-captions.vtt" default />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      setPreviewContent(<p>Preview not available for this file type.</p>);
    }

    setPreviewOpen(true);
  };

  const beforeUpload = (file: RcFile) => {
    const isAllowedType = allowedTypes.includes(file.type);
    const isWithinSizeLimit = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;
    const isWithinCountLimit = fileList.length < MAX_FILE_COUNT;

    if (!isAllowedType) {
      setUploadFileError(`"${file.name}" is not a valid file. Allowed types: images, pdf, excel sheets, and videos.`);
      return Upload.LIST_IGNORE;
    }

    if (!isWithinSizeLimit) {
      setUploadFileError(`"${file.name}" exceeds the size limit of ${MAX_FILE_SIZE_MB}MB.`);
      return Upload.LIST_IGNORE;
    }

    if (!isWithinCountLimit) {
      setUploadFileError(`You can only upload up to ${MAX_FILE_COUNT} files.`);
      return Upload.LIST_IGNORE;
    }

    setUploadFileError('');
    return true;
  };

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
    setUploadFileError('');
  };

  const customUpload = async (options: RcCustomRequestOptions) => {
    const { onSuccess, onError, file } = options;

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (onSuccess) onSuccess('ok', file);
    } catch (err) {
      if (onError) onError(err as Error);
    }
  };

  const normFile = (e: { fileList: UploadFile[] }) => {
    return Array.isArray(e) ? e : e?.fileList;
  };

  const getFileIcon = (file: UploadFile) => {
    const iconClass = 'font-size-20';

    if (!file.type) return <File size={20} className={iconClass} />;

    if (file.type.startsWith('image/')) {
      return <FileImage size={20} className={`${iconClass} img-color`} />;
    }

    if (file.type.startsWith('video/')) {
      return <CirclePlay size={20} className={`${iconClass} video-color`} />;
    }

    if (file.type === 'application/pdf') {
      return <File size={20} className={`${iconClass} pdf-color`} />;
    }

    if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)) {
      return <FileX size={20} className={`${iconClass} excel-color`} />;
    }

    return <File size={20} className={iconClass} />;
  };

  const handleClose = () => {
    setShowUploadModal(false);
    setFileList([]);
  };

  const handleAdd = () => {
    const isUploading = fileList.some((file) => file.status === 'uploading');

    if (isUploading) {
      setUploadFileError('Please wait until all files are uploaded.');
      return;
    }

    const files: File[] = fileList
      .map((f) => f.originFileObj)
      .filter((f): f is RcFile => !!f)
      .map(toNativeFile); // ✅ native File[]
    if (selectedTask?._id) {
      dispatch(
        addNewTaskAttachment({
          taskId: selectedTask?._id ?? '',
          attachments: files,
        })
      );
      handleClose();
    }
  };

  useEffect(() => {
    socketService.on('upload-attachment-task', (payload) => {
      dispatch(addNewAttachment(payload));
      dispatch(updateAttachmentCount(payload));
    });

    return () => {
      socketService.off('upload-attachment-task');
    };
  });

  return (
    <>
      <Button type="primary" size="small" className="button small-btn" onClick={() => setShowUploadModal(true)}>
        Add
      </Button>

      <Modal title="Upload Attachments" open={showUploadModal} onCancel={() => handleClose()} footer={null} width={500}>
        <Form.Item name="attachments" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload
            listType="picture-card"
            accept={'image/*'}
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={customUpload}
            onPreview={handlePreview}
            multiple
            showUploadList={{
              showPreviewIcon: false,
              showRemoveIcon: false,
            }}
            itemRender={(originNode, file, fileList, { remove }) => (
              <CustomUploadItem
                originNode={originNode}
                file={file}
                remove={remove}
                getFileIcon={getFileIcon}
                handlePreview={() => handlePreview(file)}
              />
            )}
          >
            {fileList.length < MAX_FILE_COUNT && (
              <div>
                <Plus size={20} />
                <div className="upload-btn-text">Upload</div>
              </div>
            )}
          </Upload>
          {uploadFileError && <div className="upload-attachment-error">{uploadFileError}</div>}
        </Form.Item>

        <div className="attachment-action-btn">
          <Button className="button small-btn" onClick={() => handleAdd()} type="primary">
            Save
          </Button>
          <Button className="button small-btn" onClick={() => handleClose()}>
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        {previewContent}
      </Modal>
    </>
  );
};

export default FileUploadModal;
