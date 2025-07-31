type Metric = {
  label: string;
  value: number;
  unit?: string;
  description: string;
};

type Props = {
  title: string;
  renderItem: React.ReactNode;
  metrics: Metric[];
};

const ImageRendererView = ({ title, renderItem, metrics }: Props) => {
  const formatValue = (value: number) => {
    return Number.isInteger(value) ? value : value?.toFixed(2);
  };

  return (
    <section
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "24px",
        width: "fit-content",
      }}
    >
      <header style={{ marginBottom: "12px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{title}</h2>
      </header>

      <div style={{ marginBottom: "16px" }}>{renderItem}</div>

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
    </section>
  );
};

export default ImageRendererView;
