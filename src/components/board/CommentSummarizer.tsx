import React, { useState } from "react";
import { Modal, Upload, message, Typography, Button, Skeleton } from "antd";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { Inbox, WandSparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addNewTaskComment } from "../../store/slices/taskCommentSlice";
import { generateText } from "../../services/genAiService";
import { ScanLine, Logs, Lightbulb } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.REACT_APP_PUBLIC_PDF_EXTRACT_URL}/pdf.worker.min.js`;

const { Dragger } = Upload;
const { Text, Paragraph } = Typography;

interface IProps {
  open: boolean;
  onClose: () => void;
}

const CommentSummarizer = ({ open, onClose }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTask } = useSelector((state: RootState) => state.task);

  const [loading, setLoading] = useState(false);
  const [extractedContent, setExtractedContent] = useState<string>("");
  const [AILoading, setAILoading] = useState(false);
  const [summarize, setSummarize] = useState<string[]>([]);

  const handleFile = (file: File) => {
    const type = file.type;
    setLoading(true);
    setExtractedContent("");

    if (type === "application/pdf") extractTextFromPDF(file);
    else if (
      type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      type === "application/vnd.ms-excel"
    )
      extractDataFromExcel(file);
    else if (type === "text/csv") extractDataFromCSV(file);
    else if (type.startsWith("image/")) extractTextFromImage(file);
    else {
      message.error("Unsupported file type");
      setLoading(false);
    }

    return false; // prevent default upload
  };

  const extractTextFromPDF = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        setExtractedContent(text);
      } catch (err) {
        message.error("Failed to extract PDF content");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const extractDataFromExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const text = json.map((row: any) => row.join(", ")).join("\n");
        setExtractedContent(text);
      } catch {
        message.error("Failed to extract Excel content");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const extractDataFromCSV = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        const text = results.data.map((row: any) => row.join(", ")).join("\n");
        setExtractedContent(text);
        setLoading(false);
      },
      error: () => {
        message.error("Failed to extract CSV content");
        setLoading(false);
      },
    });
  };

  const extractTextFromImage = (file: File) => {
    Tesseract.recognize(file, "eng")
      .then(({ data: { text } }) => {
        setExtractedContent(text);
      })
      .catch(() => message.error("Failed to extract image text"))
      .finally(() => setLoading(false));
  };

  const reset = () => {
    setLoading(false);
    setAILoading(false);
    setExtractedContent("");
    setSummarize([]);
  };

  const summarizeComments = async () => {
    setSummarize([]);
    setAILoading(true);
    const prompt = `
    ${extractedContent}


    Give me the comments list based on the content provided above for this task.
    I want to add comments below the task descriptions. Comments need to be like chat.
    Add all comments in single tasks just like chats and keep it in simple one line and use the above content.
    Ignore date and time and names of person. Provide it as array
    `.trim();

    try {
      const text = await generateText(prompt);
      const parsed = JSON.parse(
        text
          .replace(/```json|```/g, "")
          .trim()
          .replace(/\n/g, "")
      );

      setSummarize(parsed);
    } catch (err) {
      console.error("Error generating labels:", err);
    } finally {
      setAILoading(false);
    }
  };

  const addComments = async () => {
    for (const comment of summarize) {
      if (!selectedTask?._id) return;
      await dispatch(
        addNewTaskComment({
          taskId: selectedTask._id,
          comment,
          attachments: [],
          mentionedMembers: [],
        })
      ).unwrap();
    }
    onClose();
    setLoading(false);
    setAILoading(false);
    setExtractedContent("");
    setSummarize([]);
  };

  return (
    <Modal
      title={
        <div className="scanner-modal-title">
          <ScanLine size={20} /> Scan Document
        </div>
      }
      open={open}
      onCancel={() => {
        onClose();
        reset();
      }}
      footer={null}
      width={600}
    >
      {!loading && !extractedContent && (
        <Dragger
          beforeUpload={handleFile}
          accept=".pdf,.xlsx,.xls,.csv,image/*"
          maxCount={1}
          showUploadList={false}
        >
          <Inbox size={34} />
          <p className="ant-upload-text">Click or drag file to scan</p>
          <p className="ant-upload-hint">
            Supports PDF, Excel, CSV, and Image files.
          </p>
        </Dragger>
      )}

      {loading && (
        <div className="scanning-box">
          <div className="scanning-line" />
          <div className="scanning-text">Scanning...</div>
        </div>
      )}

      {!loading && extractedContent && (
        <div className="marginTop20">
          <Text className="scan-sub-title">
            <Logs size={18} /> Extracted Content:
          </Text>
          <Paragraph className="extracted-text">{extractedContent}</Paragraph>

          {AILoading ? (
            <Skeleton active className="paddingBottom10" />
          ) : (
            summarize.length > 0 && (
              <>
                <Text className="scan-sub-title">
                  <Lightbulb size={18} /> Suggested Comments:
                </Text>
                <div className="summarize-comments">
                  {summarize?.map((comment) => (
                    <Text key={comment}>- {comment}</Text>
                  ))}
                </div>
              </>
            )
          )}

          <div className="footer-btns">
            <Button
              type="default"
              className="button small-btn"
              size="small"
              danger
              onClick={reset}
            >
              Change Document
            </Button>
            <div className="ai-btns">
              <Button
                type="default"
                className="button small-btn"
                size="small"
                onClick={summarizeComments}
              >
                <WandSparkles size={16} /> Summarize
              </Button>
              {summarize.length > 0 && (
                <Button
                  type="primary"
                  className="button small-btn"
                  size="small"
                  onClick={addComments}
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CommentSummarizer;
