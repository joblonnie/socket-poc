import { useEffect, useRef } from "react";
import useBinaryImageStore from "../../store/useBinaryStore";
import ImageRendererView from "../ui/ImageRendererView";
import useImageLatencyTracker from "../../hooks/useImageLatencyTracker";
import { useImageSizeTracker } from "../../hooks/useImageSizeTracker";
import { useBinaryToObjectURL } from "../../hooks/useBinaryToObjectURL";

type Props = {
  onLatencyUpdate?: (latencies: number[]) => void;
  onImageSizeUpdate?: (size: number[]) => void;
};

const CanvasObjectURLImageRenderer = ({
  onLatencyUpdate,
  onImageSizeUpdate,
}: Props) => {
  const binaryImageData = useBinaryImageStore((state) => state.binary);
  const { latencies, start, end } = useImageLatencyTracker();
  const { sizes, addSize } = useImageSizeTracker();

  const objectURL = useBinaryToObjectURL(binaryImageData || null, "image/jpeg");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (binaryImageData) {
      // 이미지 크기 계산
      addSize(binaryImageData.byteLength / 1024); // KB 단위로 변환
    }
  }, [binaryImageData, addSize]);

  useEffect(() => {
    if (onLatencyUpdate) {
      onLatencyUpdate(latencies);
    }
  }, [latencies, onLatencyUpdate]);

  useEffect(() => {
    if (onImageSizeUpdate) {
      onImageSizeUpdate(sizes);
    }
  }, [sizes, onImageSizeUpdate]);

  useEffect(() => {
    if (!objectURL || !binaryImageData) {
      console.log("[Canvas Binary] Skipping - no objectURL or binaryImageData");
      return;
    }

    console.log("[Canvas Binary] Starting latency measurement and image load");
    console.log("[Canvas Binary] ObjectURL:", objectURL);
    console.log("[Canvas Binary] BinaryData size:", binaryImageData.byteLength);

    let isCancelled = false;
    start(); // objectURL이 준비되고 실제 이미지 로딩 시작할 때 측정 시작

    const img = new Image();

    // 이미지 로딩 타임아웃 설정
    const timeoutId = setTimeout(() => {
      if (!isCancelled) {
        console.error("[Canvas Binary] 이미지 로딩 타임아웃");
        isCancelled = true;
        img.src = ""; // 로딩 중단
        end(); // 타임아웃 시에도 측정 종료
      }
    }, 5000);

    img.onload = () => {
      if (isCancelled) return;

      clearTimeout(timeoutId);
      console.log(
        "[Canvas Binary] Image loaded successfully, starting canvas render"
      );

      // 더 현실적인 렌더링 지연을 위해 setTimeout 추가
      setTimeout(() => {
        if (isCancelled) return;

        requestAnimationFrame(() => {
          if (isCancelled) return;

          requestAnimationFrame(() => {
            if (isCancelled) return;

            const canvas = canvasRef.current;
            if (!canvas) {
              console.warn("[Canvas Binary] Canvas ref is null");
              end();
              return;
            }

            try {
              canvas.width = img.width;
              canvas.height = img.height;

              const ctx = canvas.getContext("2d");
              if (!ctx) {
                console.error("[Canvas Binary] Failed to get 2d context");
                end();
                return;
              }

              // Canvas 렌더링
              ctx.drawImage(img, 0, 0);

              // 추가 작업 시뮬레이션 (ImageData 읽기)
              const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              );

              // Canvas 작업 완료를 시뮬레이션하기 위한 추가 처리
              const data = imageData.data;
              let sum = 0;
              for (let i = 0; i < Math.min(data.length, 10000); i += 4) {
                sum += data[i]; // 일부 픽셀 값 처리 시뮬레이션
              }

              // 다음 프레임에서 측정 종료 (실제 렌더링이 완전히 끝난 후)
              setTimeout(() => {
                if (!isCancelled) {
                  console.log(
                    "[Canvas Binary] Canvas render complete, ending latency measurement"
                  );
                  end();
                }
              }, 15); // 15ms 추가 지연
            } catch (error) {
              console.error("[Canvas Binary] Canvas rendering error:", error);
              end();
            }
          });
        });
      }, 10); // 10ms 초기 지연
    };

    img.onerror = (error) => {
      if (isCancelled) return;

      clearTimeout(timeoutId);
      console.error("[Canvas Binary] 이미지 로딩 실패:", error);
      console.error(
        "[Canvas Binary] ObjectURL이 유효하지 않거나 해제됨:",
        objectURL
      );
      // 로딩 실패 시 측정 종료
      end();
    };

    try {
      img.src = objectURL;
    } catch (error) {
      console.error("[Canvas Binary] Error setting image src:", error);
      clearTimeout(timeoutId);
      end();
    }

    // cleanup 함수
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      if (img.src) {
        img.src = ""; // 이미지 로딩 중단
      }
    };
  }, [objectURL, binaryImageData, start, end]);

  return (
    <ImageRendererView
      renderItem={
        <canvas
          ref={canvasRef}
          style={{ width: "200px", height: "auto", maxHeight: "150px" }}
        />
      }
    />
  );
};

export default CanvasObjectURLImageRenderer;
