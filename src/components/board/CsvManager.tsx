import React, { useState } from "react";
import {
  Button,
  Modal,
  Upload,
  Typography,
  Space,
  message,
  Tooltip,
} from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import axiosInstance from "../../helper/axiosInstance";
import { saveAs } from "file-saver";

interface CsvRow {
  [key: string]: string;
}

interface ValidationError {
  row: number;
  errors: string[];
}

const CsvManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showImportModal = () => setIsModalOpen(true);
  const hideImportModal = () => setIsModalOpen(false);

  const validateData = (
    rows: CsvRow[]
  ): { valid: CsvRow[]; errors: ValidationError[] } => {
    const valid: CsvRow[] = [];
    const errors: ValidationError[] = [];

    rows.forEach((row, index) => {
      const rowErrors: string[] = [];

      if (!row.title || row.title.trim() === "")
        rowErrors.push("title required");
      if (!row.status || row.status.trim() === "")
        rowErrors.push("status required");

      if (rowErrors.length > 0) {
        errors.push({ row: index + 2, errors: rowErrors });
      } else {
        valid.push(row);
      }
    });

    return { valid, errors };
  };

  const handleFileUpload = async (file: File) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const { errors } = validateData(result.data);
        if (errors.length > 0) {
          message.warning(`${errors.length} rows have errors`);
        } else {
          const formData = new FormData();
          if (file) {
            formData.append("board_id", "683d91c169fdb2200b52bb1c");
            formData.append("file", file);
          }
          await axiosInstance.post(`/task/import-csv`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          message.success("CSV successfully imported");
          hideImportModal();
        }
      },
      error: (err) => {
        message.error("Error parsing CSV: " + err.message);
      },
    });

    return false;
  };

  const handleExport = async () => {
    const response = await axiosInstance.get(
      `/task/export-csv/683d91c169fdb2200b52bb1c`
    );
    const blob = new Blob([response.data], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "tasks.csv");
    message.success("CSV file downloaded");
  };

  return (
    <div
      style={{
        padding: "15px 15px 0 0",
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Space style={{ marginBottom: 16 }}>
        <Tooltip title="Import CSV">
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={showImportModal}
          >
            Import
          </Button>
        </Tooltip>

        <Tooltip title="Export CSV">
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Tooltip>
      </Space>

      <Modal
        title="Import CSV File"
        open={isModalOpen}
        onCancel={hideImportModal}
        footer={null}
        destroyOnClose
      >
        <Upload
          beforeUpload={handleFileUpload}
          accept=".csv"
          showUploadList={false}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select CSV File</Button>
        </Upload>
        <Typography.Paragraph type="secondary" style={{ marginTop: 10 }}>
          CSV must contain <b>title</b>, <b>status</b> columns.
        </Typography.Paragraph>
      </Modal>
    </div>
  );
};

export default CsvManager;
