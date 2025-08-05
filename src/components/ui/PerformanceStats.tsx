import React from "react";
import {
  calculateAverage,
  formatLatency,
  formatSize,
} from "../../utils/averageCalculator";
import LatencyChart from "./LatencyChart";

type Props = {
  base64DirectLatencies: number[];
  base64ObjectUrlLatencies: number[];
  binaryObjectUrlLatencies: number[];
  base64OffscreenLatencies: number[];
  binaryOffscreenLatencies: number[];
  base64Sizes: number[];
  binarySizes: number[];
};

const PerformanceStats: React.FC<Props> = ({
  base64DirectLatencies,
  base64ObjectUrlLatencies,
  binaryObjectUrlLatencies,
  base64OffscreenLatencies,
  binaryOffscreenLatencies,
  base64Sizes,
  binarySizes,
}) => {
  const base64DirectAvgLatency = calculateAverage(base64DirectLatencies);
  const base64ObjectUrlAvgLatency = calculateAverage(base64ObjectUrlLatencies);
  const binaryObjectUrlAvgLatency = calculateAverage(binaryObjectUrlLatencies);
  const base64OffscreenAvgLatency = calculateAverage(base64OffscreenLatencies);
  const binaryOffscreenAvgLatency = calculateAverage(binaryOffscreenLatencies);
  const base64AvgSize = calculateAverage(base64Sizes);
  const binaryAvgSize = calculateAverage(binarySizes);

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ marginBottom: "8px", color: "#333", fontSize: "16px" }}>
        렌더링 성능 통계 (평균값)
      </h3>

      {/* 컴팩트한 가로 배치 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        {/* Base64 직접 사용 */}
        {base64DirectLatencies.length > 0 && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "2px solid #1890ff",
            }}
          >
            <h4
              style={{
                marginBottom: "4px",
                color: "#1890ff",
                fontSize: "14px",
              }}
            >
              Base64 직접
            </h4>
            <div style={{ fontSize: "12px", marginBottom: "2px" }}>
              <strong>{formatLatency(base64DirectAvgLatency)}</strong>
              <span
                style={{ marginLeft: "4px", color: "#666", fontSize: "10px" }}
              >
                ({base64DirectLatencies.length}회)
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "#666" }}>
              data URL 직접 사용
            </div>
          </div>
        )}

        {/* Base64 → ObjectURL */}
        {base64ObjectUrlLatencies.length > 0 && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "2px solid #722ed1",
            }}
          >
            <h4
              style={{
                marginBottom: "4px",
                color: "#722ed1",
                fontSize: "14px",
              }}
            >
              Base64→URL
            </h4>
            <div style={{ fontSize: "12px", marginBottom: "2px" }}>
              <strong>{formatLatency(base64ObjectUrlAvgLatency)}</strong>
              <span
                style={{ marginLeft: "4px", color: "#666", fontSize: "10px" }}
              >
                ({base64ObjectUrlLatencies.length}회)
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "#666" }}>
              디코딩 + Blob + URL
            </div>
          </div>
        )}

        {/* Binary → ObjectURL */}
        {binaryObjectUrlLatencies.length > 0 && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "2px solid #52c41a",
            }}
          >
            <h4
              style={{
                marginBottom: "4px",
                color: "#52c41a",
                fontSize: "14px",
              }}
            >
              Binary→URL
            </h4>
            <div style={{ fontSize: "12px", marginBottom: "2px" }}>
              <strong>{formatLatency(binaryObjectUrlAvgLatency)}</strong>
              <span
                style={{ marginLeft: "4px", color: "#666", fontSize: "10px" }}
              >
                ({binaryObjectUrlLatencies.length}회)
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "#666" }}>
              ArrayBuffer + URL
            </div>
          </div>
        )}

        {/* Base64 → OffscreenCanvas */}
        {base64OffscreenLatencies.length > 0 && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "2px solid #fa8c16",
            }}
          >
            <h4
              style={{
                marginBottom: "4px",
                color: "#fa8c16",
                fontSize: "14px",
              }}
            >
              Base64→Canvas
            </h4>
            <div style={{ fontSize: "12px", marginBottom: "2px" }}>
              <strong>{formatLatency(base64OffscreenAvgLatency)}</strong>
              <span
                style={{ marginLeft: "4px", color: "#666", fontSize: "10px" }}
              >
                ({base64OffscreenLatencies.length}회)
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "#666" }}>
              🚀 OffscreenCanvas + WebWorker
            </div>
          </div>
        )}

        {/* Binary → OffscreenCanvas */}
        {binaryOffscreenLatencies.length > 0 && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "2px solid #eb2f96",
            }}
          >
            <h4
              style={{
                marginBottom: "4px",
                color: "#eb2f96",
                fontSize: "14px",
              }}
            >
              Binary→Canvas
            </h4>
            <div style={{ fontSize: "12px", marginBottom: "2px" }}>
              <strong>{formatLatency(binaryOffscreenAvgLatency)}</strong>
              <span
                style={{ marginLeft: "4px", color: "#666", fontSize: "10px" }}
              >
                ({binaryOffscreenLatencies.length}회)
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "#666" }}>
              ⚡ Binary + OffscreenCanvas
            </div>
          </div>
        )}
      </div>

      {/* 데이터 크기 정보 - 컴팩트 */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "8px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {base64AvgSize > 0 && (
          <div
            style={{
              padding: "4px 8px",
              backgroundColor: "#e6f7ff",
              borderRadius: "4px",
              border: "1px solid #1890ff",
              fontSize: "11px",
            }}
          >
            <strong>Base64:</strong> {formatSize(base64AvgSize)}
          </div>
        )}

        {binaryAvgSize > 0 && (
          <div
            style={{
              padding: "4px 8px",
              backgroundColor: "#f6ffed",
              borderRadius: "4px",
              border: "1px solid #52c41a",
              fontSize: "11px",
            }}
          >
            <strong>Binary:</strong> {formatSize(binaryAvgSize)}
          </div>
        )}

        {/* 간단한 비교 */}
        {base64AvgSize > 0 && binaryAvgSize > 0 && (
          <div
            style={{
              padding: "4px 8px",
              backgroundColor: "#fff1f0",
              borderRadius: "4px",
              border: "1px solid #ff4d4f",
              fontSize: "11px",
              color: "#666",
            }}
          >
            크기 차이: {formatSize(Math.abs(base64AvgSize - binaryAvgSize))}
          </div>
        )}
      </div>

      {/* 성능 비교 - 한 줄로 */}
      {(base64DirectAvgLatency > 0 ||
        base64ObjectUrlAvgLatency > 0 ||
        binaryObjectUrlAvgLatency > 0) && (
        <div
          style={{
            padding: "6px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            fontSize: "11px",
            color: "#666",
            textAlign: "center",
          }}
        >
          {base64DirectAvgLatency > 0 && base64ObjectUrlAvgLatency > 0 && (
            <span style={{ marginRight: "12px" }}>
              Base64:{" "}
              {base64DirectAvgLatency < base64ObjectUrlAvgLatency
                ? "직접"
                : "URL"}{" "}
              방식이 더 빠름
            </span>
          )}
          {base64ObjectUrlAvgLatency > 0 && binaryObjectUrlAvgLatency > 0 && (
            <span>
              ObjectURL:{" "}
              {base64ObjectUrlAvgLatency < binaryObjectUrlAvgLatency
                ? "Base64"
                : "Binary"}{" "}
              방식이 더 빠름
            </span>
          )}
        </div>
      )}

      {/* 실시간 레이턴시 차트 */}
      {(base64DirectLatencies.length > 0 ||
        base64ObjectUrlLatencies.length > 0 ||
        binaryObjectUrlLatencies.length > 0 ||
        base64OffscreenLatencies.length > 0 ||
        binaryOffscreenLatencies.length > 0) && (
        <div style={{ marginTop: "16px" }}>
          <LatencyChart
            base64DirectLatencies={base64DirectLatencies}
            base64ObjectUrlLatencies={base64ObjectUrlLatencies}
            binaryObjectUrlLatencies={binaryObjectUrlLatencies}
            base64OffscreenLatencies={base64OffscreenLatencies}
            binaryOffscreenLatencies={binaryOffscreenLatencies}
            maxDataPoints={30}
          />
        </div>
      )}
    </div>
  );
};

export default PerformanceStats;
