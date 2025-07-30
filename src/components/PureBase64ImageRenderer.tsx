const PureBase64ImageRenderer = ({ image }: { image: string }) => {
  const base64Image = `data:image/jpeg;base64,${image}`;

  return (
    <img
      src={base64Image}
      alt="WebSocket Stream"
      style={{ width: "1000px", height: "auto" }}
    />
  );
};

export default PureBase64ImageRenderer;
