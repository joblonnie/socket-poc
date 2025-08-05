import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface LatencyChartProps {
  base64DirectLatencies: number[];
  base64ObjectUrlLatencies: number[];
  binaryObjectUrlLatencies: number[];
  maxDataPoints?: number;
}

const LatencyChart: React.FC<LatencyChartProps> = ({
  base64DirectLatencies,
  base64ObjectUrlLatencies,
  binaryObjectUrlLatencies,
  maxDataPoints = 50,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // ECharts 인스턴스 생성
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    // 최근 데이터만 표시 (성능 최적화)
    const getRecentData = (data: number[]) => {
      return data.slice(-maxDataPoints);
    };

    const base64Direct = getRecentData(base64DirectLatencies);
    const base64ObjectUrl = getRecentData(base64ObjectUrlLatencies);
    const binaryObjectUrl = getRecentData(binaryObjectUrlLatencies);

    // 가장 긴 배열의 길이를 기준으로 x축 생성
    const maxLength = Math.max(
      base64Direct.length,
      base64ObjectUrl.length,
      binaryObjectUrl.length
    );

    const xAxisData = Array.from({ length: maxLength }, (_, i) => i + 1);

    const option = {
      title: {
        text: "실시간 레이턴시 측정",
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          let tooltipText = `측정 #${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            if (param.value !== null && param.value !== undefined) {
              tooltipText += `${param.seriesName}: ${param.value.toFixed(2)}ms<br/>`;
            }
          });
          return tooltipText;
        },
      },
      legend: {
        data: ["Base64 직접", "Base64→ObjectURL", "Binary→ObjectURL"],
        bottom: 0,
        textStyle: {
          fontSize: 10,
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        top: "15%",
        bottom: "20%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        name: "측정 순서",
        nameLocation: "middle",
        nameGap: 25,
        nameTextStyle: {
          fontSize: 10,
        },
        axisLabel: {
          fontSize: 10,
          interval: Math.max(1, Math.floor(maxLength / 10)), // 라벨 간격 조정
        },
      },
      yAxis: {
        type: "value",
        name: "레이턴시 (ms)",
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: {
          fontSize: 10,
        },
        axisLabel: {
          fontSize: 10,
          formatter: "{value}ms",
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            opacity: 0.3,
          },
        },
      },
      series: [
        {
          name: "Base64 직접",
          type: "line",
          data: base64Direct,
          itemStyle: {
            color: "#1890ff",
          },
          lineStyle: {
            width: 2,
          },
          symbol: "circle",
          symbolSize: 4,
          smooth: true,
          connectNulls: false,
        },
        {
          name: "Base64→ObjectURL",
          type: "line",
          data: base64ObjectUrl,
          itemStyle: {
            color: "#722ed1",
          },
          lineStyle: {
            width: 2,
          },
          symbol: "circle",
          symbolSize: 4,
          smooth: true,
          connectNulls: false,
        },
        {
          name: "Binary→ObjectURL",
          type: "line",
          data: binaryObjectUrl,
          itemStyle: {
            color: "#52c41a",
          },
          lineStyle: {
            width: 2,
          },
          symbol: "circle",
          symbolSize: 4,
          smooth: true,
          connectNulls: false,
        },
      ],
      animation: true,
      animationDuration: 300,
      animationEasing: "cubicOut" as const,
    };

    chart.setOption(option);

    // 화면 크기 변경 시 차트 리사이즈
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    base64DirectLatencies,
    base64ObjectUrlLatencies,
    binaryObjectUrlLatencies,
    maxDataPoints,
  ]);

  // 컴포넌트 언마운트 시 차트 정리
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#fafafa",
        border: "1px solid #d9d9d9",
        borderRadius: "6px",
        padding: "8px",
      }}
    >
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default LatencyChart;
