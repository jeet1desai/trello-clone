import React, { useEffect, useState } from "react";
import { Popover, Button, Collapse, Divider } from "antd";
import { CaretDownOutlined, CloseOutlined } from '@ant-design/icons';
import {
    X,
    Ellipsis,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import {
    changebackground,
    deleteUserBackground,
    postUserBackground,
} from "../../../../store/slices/boardSlice";
import { removeStatusBackground, updateStatus } from "../../../../store/slices/statusSlice";

interface IProps {
  statusId: string;
  activeColor: string;
}

const COLORS = [
    '#FFF', '#0079BF', '#D29034', '#519839', '#B04632', '#89609E',
    '#CD5A91', '#4BBF6B', '#00AECC', '#838C91', '#F2D600', '#FFAB00'
];

const { Panel } = Collapse;

const TaskMenu = ({ activeColor, statusId }: IProps) => {
    const [visible, setVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(activeColor);
    const dispatch = useDispatch<AppDispatch>();

    const handleColorSelect = async (color: string) => {
        await dispatch(
            updateStatus({
                statusId: statusId,
                background: color
            })
        );
        setSelectedColor(color);
    };

    const handleRemoveColor = async () => {
    setSelectedColor("#FFF");
    await dispatch(removeStatusBackground(statusId));
  };

    useEffect(() => {
        setSelectedColor(activeColor);
    }, [activeColor]);

    const content = (
        <div style={{ width: 250 }}>
            <Divider style={{ margin: "0 0 5px 0" }} />
            <Collapse expandIconPosition="end" defaultActiveKey={['0']}
                expandIcon={({ isActive }) => (
                    <ChevronDown size={20}
                        className={`collapse-arrow-icon ${isActive ? 'rotate' : ''}`}
                    />
                )}
                className="color-selector-collapse">
                <Panel header="Change list color" key="1">
                    <div className="color-grid-menu">
                        {COLORS.map((color) => (
                            <div
                                className={`color-box-wrapper ${selectedColor === color ? 'selected' : ''}`}
                                onClick={() => handleColorSelect(color)}
                            >
                                <div
                                    className={`color-box-menu ${color === "#FFF" ? "white-color" : ""}`}
                                    style={{ backgroundColor: color }}
                                />
                            </div>
                        ))}
                    </div>
                    <Button
                        icon={<CloseOutlined />}
                        danger
                        block
                        onClick={handleRemoveColor}
                        className="remove-color-btn"
                        disabled={selectedColor === "#FFF"}
                    >
                        Remove color
                    </Button>
                </Panel>
            </Collapse>
            <Divider style={{ margin: "5px 0 0 0" }} />
        </div>
    );

    return (
        <Popover
            content={content}
            overlayClassName="change-background-popover"
            title={
                <div className="popover-header">
                    <span style={{ flexGrow: 1, fontWeight: "bold" }}>
                        List actions
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
            }}
            placement="bottomLeft"
        >
            <Button
                type="text"
                size="small"
                icon={<Ellipsis size={16} />}
            />
        </Popover>
    );
};

export default TaskMenu;