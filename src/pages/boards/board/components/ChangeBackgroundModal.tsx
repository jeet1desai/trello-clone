import React, { useMemo, useRef, useState } from "react";
import { Popover, Button } from "antd";
import {
  Palette,
  Image as ImageIcon,
  ArrowLeft,
  X,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import {
  changebackground,
  deleteUserBackground,
  postUserBackground,
} from "../../../../store/slices/boardSlice";
import { BOARD_BACKGROUND_TYPE } from "../../../../utils/enums/board";

const gradientColors = [
  { bg: "linear-gradient(to right, #a1c4fd, #c2e9fb)", emoji: "🫧" },
  { bg: "linear-gradient(to right, #2980b9, #6dd5fa)", emoji: "❄️" },
  { bg: "linear-gradient(to right, #0052d4, #4364f7)", emoji: "🌊" },
  { bg: "linear-gradient(to right, #a18cd1, #fbc2eb)", emoji: "🪷" },
  { bg: "linear-gradient(to right, #fc67fa, #f4c4f3)", emoji: "🌈" },
  { bg: "linear-gradient(to right, #f7971e, #ffd200)", emoji: "🥭" },
  { bg: "linear-gradient(to right, #fbc2eb, #a6c1ee)", emoji: "🌸" },
  { bg: "linear-gradient(to right, #11998e, #38ef7d)", emoji: "🌍" },
  { bg: "linear-gradient(to right, #2c3e50, #4ca1af)", emoji: "👽" },
  { bg: "linear-gradient(to right, #e52d27, #b31217)", emoji: "🍄" },
];

const solidColors = [
  "#0079bf",
  "#d29034",
  "#519839",
  "#b04632",
  "#89609e",
  "#cd5a91",
  "#4bbf6b",
  "#00aecc",
  "#838c91",
  "#f2d600",
];

const ChangeBackgroundPopover = () => {
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const { background, userBackround, selectedBoard } = useSelector(
    (state: RootState) => state.board
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(postUserBackground([file]));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const imageGrid = useMemo(
    () => (
      <div className="photos">
        {background.map((item) => (
          <div
            key={item._id}
            onClick={() =>
              dispatch(
                changebackground({
                  boardId: selectedBoard?._id ?? "",
                  backgroundType: BOARD_BACKGROUND_TYPE.IMAGE,
                  background: item.imageUrl,
                  imageId: item._id,
                })
              )
            }
            className="photos-grid"
          >
            <img
              src={item.imageUrl}
              alt={item.imageName}
              className="photos-image"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    ),
    [background]
  );

  const content = (
    <div style={{ width: 300 }}>
      {selectedOption === "" ? (
        <>
          <div className="custom-options">
            <Button
              className={`custom-tab-button button`}
              onClick={() => setSelectedOption("photos")}
              icon={<ImageIcon />}
            >
              Photos
            </Button>
            <Button
              className={`custom-tab-button button`}
              onClick={() => setSelectedOption("colors")}
              icon={<Palette />}
            >
              Colors
            </Button>
          </div>

          <div>
            <div style={{ marginTop: 16 }}>
              <h4>Custom</h4>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <div className="photos">
                <Button className="custom-button" onClick={triggerFileUpload}>
                  +
                </Button>

                {userBackround.map((item) => (
                  <div
                    key={item._id}
                    className="photo-box"
                    onClick={() =>
                      dispatch(
                        changebackground({
                          boardId: selectedBoard?._id ?? "",
                          backgroundType: BOARD_BACKGROUND_TYPE.CUSTOM,
                          background: item.imageUrl,
                          imageId: item._id,
                        })
                      )
                    }
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.imageName}
                      className="custom-image"
                    />
                    <Button
                      type="text"
                      size="small"
                      className="delete-icon"
                      style={{ marginLeft: 0, display: "none" }}
                      danger
                      icon={<Trash2 size={16} />}
                      onClick={(event) => {
                        event.stopPropagation();
                        dispatch(
                          deleteUserBackground({
                            imageId: item._id,
                            boardId: selectedBoard?._id ?? "",
                          })
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : selectedOption === "photos" ? (
        <div className="photos">{imageGrid}</div>
      ) : (
        <>
          <div className="color-grid">
            {gradientColors.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  dispatch(
                    changebackground({
                      boardId: selectedBoard?._id ?? "",
                      backgroundType: BOARD_BACKGROUND_TYPE.COLOR,
                      background: item.bg,
                      imageId: "",
                    })
                  )
                }
                className="color-linear"
                style={{
                  background: item.bg,
                }}
              >
                {item.emoji}
              </div>
            ))}
          </div>
          <div className="color-grid">
            {solidColors.map((color, idx) => (
              <div
                onClick={() =>
                  dispatch(
                    changebackground({
                      boardId: selectedBoard?._id ?? "",
                      backgroundType: BOARD_BACKGROUND_TYPE.COLOR,
                      background: color,
                      imageId: "",
                    })
                  )
                }
                key={idx}
                className="static-color"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      overlayClassName="change-background-popover"
      title={
        <div className="popover-header">
          {selectedOption && (
            <ArrowLeft
              onClick={() => setSelectedOption("")}
              className="back-arrow-popover"
            />
          )}
          <span style={{ flexGrow: 1, fontWeight: "bold" }}>
            {selectedOption === "photos" ? "Photos" : "Colors"}
          </span>
          <X
            size={16}
            style={{ cursor: "pointer" }}
            onClick={() => setVisible(false)}
          />
        </div>
      }
      trigger="click"
      open={visible}
      onOpenChange={(open) => {
        setVisible(open);
        if (!open) {
          setSelectedOption("");
        }
      }}
      placement="bottomLeft"
    >
      <div className="filter-icon">
        <Palette size={20} />
      </div>
    </Popover>
  );
};

export default ChangeBackgroundPopover;
