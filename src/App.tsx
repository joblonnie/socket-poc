import BinaryImageRenderer from "./components/data-format-test/BinaryImageRenderer";
import { useWebSocketReceiverBase64 } from "./hooks/useWebSocketReceiverBase64";
import { useWebSocketReceiverBinary } from "./hooks/useWebSocketReceiverBinary";
import Base64ImageRenderer from "./components/data-format-test/Base64ImageRenderer";
import { useState } from "react";
import MultiLineChart from "./components/ui/MultiLineChart";
import { createLatencyOption, createSizeOption } from "./utils/chartOptions";
import ObjectURLImageRenderer from "./components/data-format-test/ObjectURLImageRenderer";

function App() {
  const [base64Latencies, setBase64Latencies] = useState<number[]>([]);
  const [binaryLatencies, setBinaryLatencies] = useState<number[]>([]);

  const [base64SizeData, setBase64SizeData] = useState<number[]>([]);
  const [binarySizeData, setBinarySizeData] = useState<number[]>([]);

  useWebSocketReceiverBase64(import.meta.env.VITE_WS_URL_BASE64);
  useWebSocketReceiverBinary(import.meta.env.VITE_WS_URL_BINARY);

  const latencylength = Math.max(
    base64Latencies.length,
    base64Latencies.length
  );
  const latencyXAxisData = Array.from({ length: latencylength }, (_, i) =>
    i.toString()
  );

  const sizeLength = Math.max(base64SizeData.length, binarySizeData.length);
  const sizeXAxisData = Array.from({ length: sizeLength }, (_, i) =>
    i.toString()
  );

  const latencyOption = createLatencyOption({
    base64Data: base64Latencies,
    arrayBufferData: binaryLatencies,
    xAxisData: latencyXAxisData,
  });

  const sizeOption = createSizeOption({
    base64Data: base64SizeData,
    arrayBufferData: binarySizeData,
    xAxisData: sizeXAxisData,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 1,
        }}
      >
        <Base64ImageRenderer
          onLatencyUpdate={setBase64Latencies}
          onImageSizeUpdate={setBase64SizeData}
        />
        <BinaryImageRenderer
          onLatencyUpdate={setBinaryLatencies}
          onImageSizeUpdate={setBinarySizeData}
        />
      </div>

      <div
        style={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 2,
        }}
      >
        <MultiLineChart option={latencyOption} />
        <MultiLineChart option={sizeOption} />
      </div>
    </div>
  );
}
export default App;
