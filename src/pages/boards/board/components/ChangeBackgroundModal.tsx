import React, { useRef, useState } from 'react';
import { Modal, Button, UploadFile, Upload } from 'antd';
import { Palette, Image as ImageIcon, ArrowLeft, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

const gradientColors = [
  { bg: 'linear-gradient(to right, #a1c4fd, #c2e9fb)', emoji: '🫧' },
  { bg: 'linear-gradient(to right, #2980b9, #6dd5fa)', emoji: '❄️' },
  { bg: 'linear-gradient(to right, #0052d4, #4364f7)', emoji: '🌊' },
  { bg: 'linear-gradient(to right, #a18cd1, #fbc2eb)', emoji: '🪷' },
  { bg: 'linear-gradient(to right, #fc67fa, #f4c4f3)', emoji: '🌈' },
  { bg: 'linear-gradient(to right, #f7971e, #ffd200)', emoji: '🍑' },
  { bg: 'linear-gradient(to right, #fbc2eb, #a6c1ee)', emoji: '🌸' },
  { bg: 'linear-gradient(to right, #11998e, #38ef7d)', emoji: '🌍' },
  { bg: 'linear-gradient(to right, #2c3e50, #4ca1af)', emoji: '👽' },
  { bg: 'linear-gradient(to right, #e52d27, #b31217)', emoji: '🍄' },
];

const solidColors = [
  '#0079bf', '#d29034', '#519839', '#b04632',
  '#89609e', '#cd5a91', '#4bbf6b', '#00aecc',
  '#838c91', '#f2d600'
];

const ChangeBackgroundModal = () => {
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const uploadRef = useRef<any>(null);

  const { background } = useSelector((state: RootState) => state.board);

  const triggerUpload = () => {
  if (uploadRef.current) {
    uploadRef.current?.click();
  }
};

  const showModal = () => {
    setVisible(true);
    setSelectedOption("");
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedOption("");
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };


  return (
    <div>
      <div
        onClick={showModal}
        style={{
          background: "white",
          padding: "8px 8px 0 8px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        className='filter-icon'
      >
        <Palette size={20} />
      </div>

      <Modal
        title={null}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        className="modal"
        closeIcon={false}
      >
        <div className="modal-header">
          {selectedOption !== "" && (
            <ArrowLeft onClick={() => setSelectedOption("")} className="back-arrow" />
          )}
          <div className="custom-pellet-popup">
            <h3 className="modal-title">
              {selectedOption === 'photos' ? "Photos" : "Colors"}
            </h3>
            <X
              size={16}
              style={{ cursor: "pointer" }}
              onClick={handleCancel}
            />
          </div>
        </div>

        <div className="modal-content">
          {selectedOption === "" ? (
            <div className="options">
              <Button onClick={() => handleOptionClick('photos')} className="option-button">
                <ImageIcon /> Photos
              </Button>
              <Button onClick={() => handleOptionClick('colors')} className="option-button">
                <Palette /> Colors
              </Button>
            </div>
          ) : selectedOption === 'photos' ? (
            <div className="photos">
              {background.map((item) => (
                <div className="image-placeholder photo-box" key={item._id}>
                  <img src={item.imageUrl} alt={item.imageName} style={{width: "inherit", height: "inherit"}} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="color-grid">
                {gradientColors.map((item, index) => (
                  <div
                    key={index}
                    className="color-box"
                    style={{ background: item.bg }}
                  >
                    <span className="emoji">{item.emoji}</span>
                  </div>
                ))}
              </div>
              <div className="color-grid solid">
                {solidColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="color-box"
                    style={{ background: color }}
                  />
                ))}
              </div>
            </>
          )}

          {selectedOption === "" && (
            <>
              <h3>Custom</h3>
              <Upload
                showUploadList={false}
                listType="picture-card"
                fileList={fileList}
                accept="image/*"
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
                style={{ display: 'none', opacity: 0 }} // Hide the actual uploader
              >
               <Button className="custom-button" ref={uploadRef} onClick={triggerUpload}>+</Button> 
              </Upload>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ChangeBackgroundModal;
