import React from "react";
import { CheckOutlined } from "@ant-design/icons";

const colors = [
  "bisque",
  "black",
  "#1e3a1e",
  "#594d00",
  "#7f2d00",
  "#601d1d",
  "#4b3862",
  "#237a52",
  "#ffb900",
  "#ff7a00",
  "red",
  "#ff3d3d",
  "#bda4f4",
  "#00b894",
  "yellow",
  "#f0932b",
  "#a29bfe",
  "gray",
  "#273c75",
  "#40739e",
  "#44bd32",
  "#c23616",
  "#718093",
  "#3498db",
  "#74b9ff",
  "#55efc4",
  "blue",
  "#fd79a8",
  "#b2bec3",
  "green",
];

const ColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => {

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 43px)",
        gap: 8,
      }}
    >
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => onChange(color)}
          style={{
            width: 44,
            height: 26,
            borderRadius: 4,
            backgroundColor: color,
            border: value === color ? "1px solid #fff" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {value === color && (
            <CheckOutlined style={{ color: "#fff", fontSize: 12 }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;
