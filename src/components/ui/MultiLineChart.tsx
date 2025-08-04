import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

type MultiLineChartProps = {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
};

const MultiLineChart = ({ option, style }: MultiLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    chartInstance.current.setOption(option, {
      notMerge: true,
      lazyUpdate: true,
    });
  }, [option]);

  useEffect(() => {
    const resizeHandler = () => chartInstance.current?.resize();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div ref={chartRef} style={{ width: "100%", height: 200, ...style }} />
  );
};

export default MultiLineChart;
