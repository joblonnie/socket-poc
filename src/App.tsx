import BinaryImageRenderer from "./components/data-format-test/BinaryImageRenderer";
import { useWebSocketReceiverBase64 } from "./hooks/useWebSocketReceiverBase64";
import { useWebSocketReceiverBinary } from "./hooks/useWebSocketReceiverBinary";
import Base64ImageRenderer from "./components/data-format-test/Base64ImageRenderer";
import ObjectURLImageRenderer from "./components/data-format-test/ObjectURLImageRenderer";
import OffscreenCanvasBase64Renderer from "./components/data-render-test/OffscreenCanvasBase64Renderer";
import OffscreenCanvasBinaryRenderer from "./components/data-render-test/OffscreenCanvasBinaryRenderer";
import { useState } from "react";
import PerformanceStats from "./components/ui/PerformanceStats";

type ComparisonType =
  | "base64-direct"
  | "base64-objecturl"
  | "binary-objecturl"
  | "base64-offscreen"
  | "binary-offscreen";

interface ComparisonConfig {
  type: ComparisonType;
  label: string;
  color: string;
  description: string;
}

function App() {
  const [viewMode, setViewMode] = useState<"single" | "comparison">(
    "comparison"
  );
  const [singleType, setSingleType] = useState<ComparisonType>("base64-direct");

  // Available comparison configurations
  const availableConfigs: ComparisonConfig[] = [
    {
      type: "base64-direct",
      label: "Base64 직접 사용",
      color: "#1890ff",
      description: "Base64 data URL로 직접 IMG 태그에 사용",
    },
    {
      type: "base64-objecturl",
      label: "Base64 → ObjectURL",
      color: "#722ed1",
      description: "Base64를 ObjectURL로 변환 후 IMG 태그에 사용",
    },
    {
      type: "binary-objecturl",
      label: "Binary → ObjectURL",
      color: "#52c41a",
      description: "Binary 데이터를 ObjectURL로 변환 후 IMG 태그에 사용",
    },
    {
      type: "base64-offscreen",
      label: "Base64 → OffscreenCanvas",
      color: "#fa8c16",
      description: "Base64 데이터를 OffscreenCanvas WebWorker로 렌더링",
    },
    {
      type: "binary-offscreen",
      label: "Binary → OffscreenCanvas",
      color: "#eb2f96",
      description: "Binary 데이터를 OffscreenCanvas WebWorker로 렌더링",
    },
  ];

  // For comparison mode, track which configurations are enabled
  const [enabledConfigs, setEnabledConfigs] = useState<ComparisonConfig[]>([
    availableConfigs[0], // Base64 직접 사용
    availableConfigs[2], // Binary → ObjectURL
    availableConfigs[3], // Base64 → OffscreenCanvas
    availableConfigs[4], // Binary → OffscreenCanvas
  ]);

  const [base64DirectLatencies, setBase64DirectLatencies] = useState<number[]>(
    []
  );
  const [base64ObjectUrlLatencies, setBase64ObjectUrlLatencies] = useState<
    number[]
  >([]);
  const [binaryObjectUrlLatencies, setBinaryObjectUrlLatencies] = useState<
    number[]
  >([]);
  const [base64OffscreenLatencies, setBase64OffscreenLatencies] = useState<
    number[]
  >([]);
  const [binaryOffscreenLatencies, setBinaryOffscreenLatencies] = useState<
    number[]
  >([]);
  const [base64SizeData, setBase64SizeData] = useState<number[]>([]);
  const [binarySizeData, setBinarySizeData] = useState<number[]>([]);

  // Always call hooks to avoid conditional hook calls
  // Base64 WebSocket - active when needed
  const shouldConnectBase64 =
    (viewMode === "comparison" &&
      enabledConfigs.some((config) => config.type.includes("base64"))) ||
    (viewMode === "single" && singleType.includes("base64"));
  useWebSocketReceiverBase64(
    shouldConnectBase64 ? import.meta.env.VITE_WS_URL_BASE64 : null
  );

  // Binary WebSocket - active when needed
  const shouldConnectBinary =
    (viewMode === "comparison" &&
      enabledConfigs.some((config) => config.type.includes("binary"))) ||
    (viewMode === "single" && singleType.includes("binary"));
  useWebSocketReceiverBinary(
    shouldConnectBinary ? import.meta.env.VITE_WS_URL_BINARY : null
  );

  const toggleConfig = (config: ComparisonConfig) => {
    setEnabledConfigs((prev) => {
      const exists = prev.find((c) => c.type === config.type);
      if (exists) {
        return prev.filter((c) => c.type !== config.type);
      } else {
        return [...prev, config];
      }
    });
  };

  // Helper function to render appropriate component
  const renderComponent = (type: ComparisonType) => {
    switch (type) {
      case "base64-direct":
        return (
          <Base64ImageRenderer
            onLatencyUpdate={setBase64DirectLatencies}
            onImageSizeUpdate={setBase64SizeData}
          />
        );
      case "base64-objecturl":
        return (
          <ObjectURLImageRenderer
            onLatencyUpdate={setBase64ObjectUrlLatencies}
            onImageSizeUpdate={setBase64SizeData}
          />
        );
      case "binary-objecturl":
        return (
          <BinaryImageRenderer
            onLatencyUpdate={setBinaryObjectUrlLatencies}
            onImageSizeUpdate={setBinarySizeData}
          />
        );
      case "base64-offscreen":
        return (
          <OffscreenCanvasBase64Renderer
            onLatencyUpdate={setBase64OffscreenLatencies}
            onImageSizeUpdate={setBase64SizeData}
          />
        );
      case "binary-offscreen":
        return (
          <OffscreenCanvasBinaryRenderer
            onLatencyUpdate={setBinaryOffscreenLatencies}
            onImageSizeUpdate={setBinarySizeData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header Controls */}
      <div style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
        <div style={{ marginBottom: "12px" }}>
          <button
            onClick={() => setViewMode("single")}
            style={{
              backgroundColor:
                viewMode === "single" ? "#007acc" : "transparent",
              color: viewMode === "single" ? "white" : "black",
              padding: "8px 16px",
              border: "1px solid #007acc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            단일 비교
          </button>
          <button
            onClick={() => setViewMode("comparison")}
            style={{
              backgroundColor:
                viewMode === "comparison" ? "#007acc" : "transparent",
              color: viewMode === "comparison" ? "white" : "black",
              padding: "8px 16px",
              border: "1px solid #007acc",
              borderRadius: "4px",
              marginLeft: "8px",
              cursor: "pointer",
            }}
          >
            다중 비교
          </button>
        </div>

        {viewMode === "single" && (
          <div style={{ marginBottom: "12px" }}>
            <label style={{ marginRight: "12px" }}>렌더링 방식:</label>
            <select
              value={singleType}
              onChange={(e) => setSingleType(e.target.value as ComparisonType)}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              {availableConfigs.map((config) => (
                <option key={config.type} value={config.type}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {viewMode === "comparison" && (
          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>비교할 렌더링 방식 선택:</h4>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {availableConfigs.map((config) => {
                const isEnabled = enabledConfigs.some(
                  (c) => c.type === config.type
                );
                return (
                  <button
                    key={config.type}
                    onClick={() => toggleConfig(config)}
                    style={{
                      backgroundColor: isEnabled ? config.color : "transparent",
                      color: isEnabled ? "white" : config.color,
                      padding: "8px 12px",
                      border: `1px solid ${config.color}`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                    title={config.description}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Video Area - 더 작게 */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f8f9fa",
            overflow: "auto",
          }}
        >
          {viewMode === "single" ? (
            <div>
              <h3
                style={{
                  margin: "0 0 16px 0",
                  textAlign: "center",
                  fontSize: "18px",
                }}
              >
                {availableConfigs.find((c) => c.type === singleType)?.label}
              </h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {renderComponent(singleType)}
              </div>
            </div>
          ) : (
            <div>
              <h3
                style={{
                  margin: "0 0 16px 0",
                  textAlign: "center",
                  fontSize: "18px",
                }}
              >
                렌더링 방식 비교
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // 최소 크기 줄임
                  gap: "12px", // 간격 줄임
                  maxWidth: "1200px",
                  margin: "0 auto",
                }}
              >
                {enabledConfigs.map((config) => (
                  <div
                    key={config.type}
                    style={{
                      border: `2px solid ${config.color}`,
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: config.color,
                        color: "white",
                        padding: "6px 10px", // 패딩 줄임
                        fontWeight: "bold",
                        fontSize: "12px", // 폰트 크기 줄임
                      }}
                    >
                      {config.label}
                    </div>
                    <div style={{ padding: "8px" }}>
                      {" "}
                      {/* 패딩 줄임 */}
                      {renderComponent(config.type)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Statistics - 더 큰 영역 */}
        <div
          style={{
            flex: 1, // 남은 공간 모두 사용
            padding: "12px 16px",
            backgroundColor: "#fafafa",
            borderTop: "1px solid #ddd",
            overflow: "auto",
          }}
        >
          <PerformanceStats
            base64DirectLatencies={
              (viewMode === "comparison" &&
                enabledConfigs.some(
                  (config) => config.type === "base64-direct"
                )) ||
              (viewMode === "single" && singleType === "base64-direct")
                ? base64DirectLatencies
                : []
            }
            base64ObjectUrlLatencies={
              (viewMode === "comparison" &&
                enabledConfigs.some(
                  (config) => config.type === "base64-objecturl"
                )) ||
              (viewMode === "single" && singleType === "base64-objecturl")
                ? base64ObjectUrlLatencies
                : []
            }
            binaryObjectUrlLatencies={
              (viewMode === "comparison" &&
                enabledConfigs.some(
                  (config) => config.type === "binary-objecturl"
                )) ||
              (viewMode === "single" && singleType === "binary-objecturl")
                ? binaryObjectUrlLatencies
                : []
            }
            base64OffscreenLatencies={
              (viewMode === "comparison" &&
                enabledConfigs.some(
                  (config) => config.type === "base64-offscreen"
                )) ||
              (viewMode === "single" && singleType === "base64-offscreen")
                ? base64OffscreenLatencies
                : []
            }
            binaryOffscreenLatencies={
              (viewMode === "comparison" &&
                enabledConfigs.some(
                  (config) => config.type === "binary-offscreen"
                )) ||
              (viewMode === "single" && singleType === "binary-offscreen")
                ? binaryOffscreenLatencies
                : []
            }
            base64Sizes={
              (viewMode === "comparison" &&
                enabledConfigs.some((config) =>
                  config.type.includes("base64")
                )) ||
              (viewMode === "single" && singleType.includes("base64"))
                ? base64SizeData
                : []
            }
            binarySizes={
              (viewMode === "comparison" &&
                enabledConfigs.some((config) =>
                  config.type.includes("binary")
                )) ||
              (viewMode === "single" && singleType.includes("binary"))
                ? binarySizeData
                : []
            }
          />
        </div>
      </div>
    </div>
  );
}

export default App;
