// OffscreenCanvas WebWorker
self.onmessage = function (e) {
  const { type, data } = e.data;

  switch (type) {
    case "INIT_CANVAS":
      initOffscreenCanvas(data);
      break;
    case "RENDER_IMAGE":
      renderImageOnCanvas(data);
      break;
    case "CLEANUP":
      cleanup();
      break;
    default:
      console.warn("[OffscreenWorker] Unknown message type:", type);
  }
};

let offscreenCanvas = null;
let ctx = null;

function initOffscreenCanvas({ canvas, width, height }) {
  try {
    offscreenCanvas = canvas;
    ctx = offscreenCanvas.getContext("2d");

    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    console.log("[OffscreenWorker] Canvas initialized:", width, "x", height);

    self.postMessage({
      type: "CANVAS_READY",
      success: true,
    });
  } catch (error) {
    console.error("[OffscreenWorker] Canvas init failed:", error);
    self.postMessage({
      type: "CANVAS_READY",
      success: false,
      error: error.message,
    });
  }
}

function renderImageOnCanvas({ imageData, mimeType = "image/jpeg" }) {
  if (!offscreenCanvas || !ctx) {
    self.postMessage({
      type: "RENDER_ERROR",
      error: "Canvas not initialized",
    });
    return;
  }

  const startTime = performance.now();

  try {
    let blob;

    // 데이터 타입에 따라 Blob 생성
    if (typeof imageData === "string") {
      // Base64 데이터 처리
      console.log(
        "[OffscreenWorker] Processing Base64 data, length:",
        imageData.length
      );
      const binaryString = atob(imageData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      blob = new Blob([bytes], { type: mimeType });
    } else if (imageData instanceof ArrayBuffer) {
      // Binary 데이터 처리
      console.log(
        "[OffscreenWorker] Processing Binary data, size:",
        imageData.byteLength
      );
      blob = new Blob([imageData], { type: mimeType });
    } else {
      throw new Error("Unsupported image data type");
    }

    const blobTime = performance.now();
    console.log(
      "[OffscreenWorker] Blob creation time:",
      (blobTime - startTime).toFixed(2),
      "ms"
    );

    // Blob을 이미지로 로드
    createImageBitmap(blob)
      .then((imageBitmap) => {
        const loadTime = performance.now();
        console.log(
          "[OffscreenWorker] Image load time:",
          (loadTime - blobTime).toFixed(2),
          "ms"
        );

        // Canvas 크기 조정
        offscreenCanvas.width = imageBitmap.width;
        offscreenCanvas.height = imageBitmap.height;

        // 캔버스 클리어
        ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // 이미지 그리기
        ctx.drawImage(imageBitmap, 0, 0);

        // 추가 이미지 처리 작업 시뮬레이션
        performImageProcessing();

        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const renderTime = endTime - loadTime;

        console.log(
          "[OffscreenWorker] Render time:",
          renderTime.toFixed(2),
          "ms"
        );
        console.log(
          "[OffscreenWorker] Total processing time:",
          totalTime.toFixed(2),
          "ms"
        );

        // ImageBitmap 정리
        imageBitmap.close();

        // 렌더링 완료 알림
        self.postMessage({
          type: "RENDER_COMPLETE",
          timing: {
            blobCreation: blobTime - startTime,
            imageLoad: loadTime - blobTime,
            rendering: renderTime,
            total: totalTime,
          },
          dimensions: {
            width: offscreenCanvas.width,
            height: offscreenCanvas.height,
          },
        });
      })
      .catch((error) => {
        console.error("[OffscreenWorker] Image load failed:", error);
        self.postMessage({
          type: "RENDER_ERROR",
          error: error.message,
        });
      });
  } catch (error) {
    console.error("[OffscreenWorker] Render failed:", error);
    self.postMessage({
      type: "RENDER_ERROR",
      error: error.message,
    });
  }
}

// 이미지 처리 작업 시뮬레이션 (픽셀 분석 등)
function performImageProcessing() {
  if (!ctx || !offscreenCanvas) return;

  const startProcessing = performance.now();

  try {
    // 이미지 데이터 읽기
    const imageData = ctx.getImageData(
      0,
      0,
      offscreenCanvas.width,
      offscreenCanvas.height
    );
    const data = imageData.data;

    // 픽셀 분석 시뮬레이션 (밝기 계산)
    let totalBrightness = 0;
    const sampleSize = Math.min(data.length, 40000); // 성능을 위해 샘플링

    for (let i = 0; i < sampleSize; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalBrightness += (r + g + b) / 3;
    }

    const avgBrightness = totalBrightness / (sampleSize / 4);
    const processingTime = performance.now() - startProcessing;

    console.log(
      "[OffscreenWorker] Image processing completed in:",
      processingTime.toFixed(2),
      "ms"
    );
    console.log(
      "[OffscreenWorker] Average brightness:",
      avgBrightness.toFixed(1)
    );

    // 처리 결과를 메인 스레드로 전송
    self.postMessage({
      type: "PROCESSING_COMPLETE",
      result: {
        avgBrightness: avgBrightness,
        processingTime: processingTime,
        pixelsAnalyzed: sampleSize / 4,
      },
    });
  } catch (error) {
    console.error("[OffscreenWorker] Image processing failed:", error);
  }
}

function cleanup() {
  if (offscreenCanvas) {
    offscreenCanvas = null;
    ctx = null;
    console.log("[OffscreenWorker] Cleanup completed");
  }

  self.postMessage({
    type: "CLEANUP_COMPLETE",
  });
}

// Worker 시작 알림
self.postMessage({
  type: "WORKER_READY",
});

console.log("[OffscreenWorker] Worker initialized and ready");
