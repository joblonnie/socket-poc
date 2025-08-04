import BinaryImageRenderer from "./components/data-format-test/BinaryImageRenderer";
import { useWebSocketReceiverBase64 } from "./hooks/useWebSocketReceiverBase64";
import { useWebSocketReceiverBinary } from "./hooks/useWebSocketReceiverBinary";
import Base64ImageRenderer from "./components/data-format-test/Base64ImageRenderer";
import { useState } from "react";
import MultiLineChart from "./components/ui/MultiLineChart";
import { createLatencyOption, createSizeOption } from "./utils/chartOptions";

function App() {
  const [format, setFormat] = useState<"base64" | "binary">("base64");

  const [base64Latencies, setBase64Latencies] = useState<number[]>([]);
  const [binaryLatencies, setBinaryLatencies] = useState<number[]>([]);
  const [base64SizeData, setBase64SizeData] = useState<number[]>([]);
  const [binarySizeData, setBinarySizeData] = useState<number[]>([]);

  if (format === "base64") {
    useWebSocketReceiverBase64(import.meta.env.VITE_WS_URL_BASE64);
  } else {
    useWebSocketReceiverBinary(import.meta.env.VITE_WS_URL_BINARY);
  }

  const latencyXAxisData = Array.from(
    { length: Math.max(base64Latencies.length, binaryLatencies.length) },
    (_, i) => i.toString()
  );

  const sizeXAxisData = Array.from(
    { length: Math.max(base64SizeData.length, binarySizeData.length) },
    (_, i) => i.toString()
  );

  const latencyOption = createLatencyOption({
    base64Data: format === "base64" ? base64Latencies : [],
    arrayBufferData: format === "binary" ? binaryLatencies : [],
    xAxisData: latencyXAxisData,
  });

  const sizeOption = createSizeOption({
    base64Data: format === "base64" ? base64SizeData : [],
    arrayBufferData: format === "binary" ? binarySizeData : [],
    xAxisData: sizeXAxisData,
  });

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button onClick={() => setFormat("base64")}>Base64 테스트</button>
        <button onClick={() => setFormat("binary")}>Binary 테스트</button>
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ flex: 1 }}>
          {format === "base64" ? (
            <Base64ImageRenderer
              onLatencyUpdate={setBase64Latencies}
              onImageSizeUpdate={setBase64SizeData}
            />
          ) : (
            <BinaryImageRenderer
              onLatencyUpdate={setBinaryLatencies}
              onImageSizeUpdate={setBinarySizeData}
            />
          )}
        </div>
        <div style={{ flex: 2 }}>
          <MultiLineChart option={latencyOption} />
          <MultiLineChart option={sizeOption} />
        </div>
      </div>
    </div>
  );
}
export default App;
