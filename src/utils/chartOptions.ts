import type { EChartsOption } from "echarts";

type SeriesData = {
  base64Data: number[];
  arrayBufferData: number[];
  xAxisData: string[];
};

const baseOption: EChartsOption = {
  animation: false,
  grid: { left: 30, right: 10, top: 10, bottom: 20 },
  legend: {
    show: true,
    top: 0,
    left: "center",
  },
};

export function createLatencyOption({
  base64Data,
  arrayBufferData,
  xAxisData,
}: SeriesData): EChartsOption {
  return {
    ...baseOption,

    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
      name: "Latency (ms)",
    },
    series: [
      {
        name: "Base64",
        type: "line",
        data: base64Data,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#5470C6" },
      },
      {
        name: "Binary",
        type: "line",
        data: arrayBufferData,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#91CC75" },
      },
    ],
  };
}

export function createSizeOption({
  base64Data,
  arrayBufferData,
  xAxisData,
}: SeriesData): EChartsOption {
  return {
    ...baseOption,
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
      name: "Size (KB)",
    },
    series: [
      {
        name: "Base64",
        type: "line",
        data: base64Data,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#5470C680" },
      },
      {
        name: "Binary",
        type: "line",
        data: arrayBufferData,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#91CC7580" },
      },
    ],
  };
}
