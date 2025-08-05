import React from "react";
import {
  calculateAverage,
  formatLatency,
  formatSize,
} from "../../utils/averageCalculator";

type Props = {
  base64DirectLatencies: number[];
  base64ObjectUrlLatencies: number[];
  binaryObjectUrlLatencies: number[];
  base64Sizes: number[];
  binarySizes: number[];
};

const PerformanceStats: React.FC<Props> = ({
  base64DirectLatencies,
  base64ObjectUrlLatencies,
  binaryObjectUrlLatencies,
  base64Sizes,
  binarySizes,
}) => {
  const base64DirectAvgLatency = calculateAverage(base64DirectLatencies);
  const base64ObjectUrlAvgLatency = calculateAverage(base64ObjectUrlLatencies);
  const binaryObjectUrlAvgLatency = calculateAverage(binaryObjectUrlLatencies);
  const base64AvgSize = calculateAverage(base64Sizes);
  const binaryAvgSize = calculateAverage(binarySizes);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        margin: "20px 0",
      }}
    >
      <h3 style={{ marginBottom: "16px", color: "#333" }}>
        렌더링 성능 통계 (평균값)
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {/* Base64 직접 사용 */}
        {base64DirectLatencies.length > 0 && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "2px solid #1890ff",
            }}
          >
            <h4 style={{ marginBottom: "12px", color: "#1890ff" }}>
              Base64 직접 사용
            </h4>
            <div style={{ marginBottom: "8px" }}>
              <strong>평균 지연시간:</strong>{" "}
              {formatLatency(base64DirectAvgLatency)}
              <span
                style={{ marginLeft: "8px", fontSize: "12px", color: "#666" }}
              >
                ({base64DirectLatencies.length}회 측정)
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              data URL 직접 사용, 브라우저 최적화 적용
            </div>
          </div>
        )}

        {/* Base64 → ObjectURL */}
        {base64ObjectUrlLatencies.length > 0 && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "2px solid #722ed1",
            }}
          >
            <h4 style={{ marginBottom: "12px", color: "#722ed1" }}>
              Base64 → ObjectURL
            </h4>
            <div style={{ marginBottom: "8px" }}>
              <strong>평균 지연시간:</strong>{" "}
              {formatLatency(base64ObjectUrlAvgLatency)}
              <span
                style={{ marginLeft: "8px", fontSize: "12px", color: "#666" }}
              >
                ({base64ObjectUrlLatencies.length}회 측정)
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Base64 디코딩 + Blob 생성 + ObjectURL 변환
            </div>
          </div>
        )}

        {/* Binary → ObjectURL */}
        {binaryObjectUrlLatencies.length > 0 && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "2px solid #52c41a",
            }}
          >
            <h4 style={{ marginBottom: "12px", color: "#52c41a" }}>
              Binary → ObjectURL
            </h4>
            <div style={{ marginBottom: "8px" }}>
              <strong>평균 지연시간:</strong>{" "}
              {formatLatency(binaryObjectUrlAvgLatency)}
              <span
                style={{ marginLeft: "8px", fontSize: "12px", color: "#666" }}
              >
                ({binaryObjectUrlLatencies.length}회 측정)
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              ArrayBuffer → Blob 생성 + ObjectURL 변환
            </div>
          </div>
        )}
      </div>

      {/* 데이터 크기 정보 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {base64AvgSize > 0 && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e6f7ff",
              borderRadius: "4px",
              border: "1px solid #1890ff",
            }}
          >
            <strong>Base64 데이터 크기:</strong>
            <br />
            {formatSize(base64AvgSize)}
          </div>
        )}

        {binaryAvgSize > 0 && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f6ffed",
              borderRadius: "4px",
              border: "1px solid #52c41a",
            }}
          >
            <strong>Binary 데이터 크기:</strong>
            <br />
            {formatSize(binaryAvgSize)}
          </div>
        )}
      </div>

      {/* 비교 결과 */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#f0f0f0",
          borderRadius: "6px",
        }}
      >
        <h5 style={{ marginBottom: "12px" }}>성능 비교</h5>

        {/* 데이터 크기 비교 */}
        {base64AvgSize > 0 && binaryAvgSize > 0 && (
          <div style={{ marginBottom: "8px", fontSize: "14px" }}>
            <strong>데이터 크기:</strong>{" "}
            {base64AvgSize < binaryAvgSize ? (
              <span style={{ color: "#1890ff" }}>
                Base64가 {formatSize(binaryAvgSize - base64AvgSize)} 더 작음
              </span>
            ) : (
              <span style={{ color: "#52c41a" }}>
                Binary가 {formatSize(base64AvgSize - binaryAvgSize)} 더 작음
              </span>
            )}
          </div>
        )}

        {/* 성능 비교 */}
        {base64DirectAvgLatency > 0 && base64ObjectUrlAvgLatency > 0 && (
          <div style={{ marginBottom: "8px", fontSize: "14px" }}>
            <strong>Base64 방식:</strong>{" "}
            {base64DirectAvgLatency < base64ObjectUrlAvgLatency ? (
              <span style={{ color: "#1890ff" }}>
                직접 사용이 ObjectURL보다{" "}
                {formatLatency(
                  base64ObjectUrlAvgLatency - base64DirectAvgLatency
                )}{" "}
                빠름
              </span>
            ) : (
              <span style={{ color: "#722ed1" }}>
                ObjectURL이 직접 사용보다{" "}
                {formatLatency(
                  base64DirectAvgLatency - base64ObjectUrlAvgLatency
                )}{" "}
                빠름
              </span>
            )}
          </div>
        )}

        {/* Base64 ObjectURL vs Binary ObjectURL */}
        {base64ObjectUrlAvgLatency > 0 && binaryObjectUrlAvgLatency > 0 && (
          <div style={{ fontSize: "14px" }}>
            <strong>ObjectURL 방식:</strong>{" "}
            {base64ObjectUrlAvgLatency < binaryObjectUrlAvgLatency ? (
              <span style={{ color: "#722ed1" }}>
                Base64가 Binary보다{" "}
                {formatLatency(
                  binaryObjectUrlAvgLatency - base64ObjectUrlAvgLatency
                )}{" "}
                빠름
              </span>
            ) : (
              <span style={{ color: "#52c41a" }}>
                Binary가 Base64보다{" "}
                {formatLatency(
                  base64ObjectUrlAvgLatency - binaryObjectUrlAvgLatency
                )}{" "}
                빠름
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceStats;
