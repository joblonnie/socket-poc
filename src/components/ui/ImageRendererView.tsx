type Metric = {
  label: string;
  value: number;
  unit?: string;
  description: string;
};

type Props = {
  renderItem: React.ReactNode;
  metrics?: Metric[];
};

const ImageRendererView = ({ renderItem, metrics }: Props) => {
  const formatValue = (value: number) => {
    return Number.isInteger(value) ? value : value?.toFixed(2);
  };

  return (
    <section
      style={{
        padding: "16px",
        marginBottom: "24px",
        width: "fit-content",
      }}
    >
      <div style={{ marginBottom: "16px" }}>{renderItem}</div>

      {metrics && (
        <div>
          {metrics.map(({ label, value, unit, description }) => (
            <div key={label} style={{ marginBottom: "0.5rem" }}>
              <strong>{label}:</strong> {formatValue(value)}
              {unit ? ` ${unit}` : ""}
              <div style={{ fontSize: "0.75rem", color: "#666" }}>
                {description}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ImageRendererView;
