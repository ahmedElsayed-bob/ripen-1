export function ReadinessOverlay({
  title = "Readiness overlay",
}: {
  title?: string;
}) {
  return (
    <div
      className="flex flex-col gap-2 bg-white rounded-xl p-4"
      style={{ width: "300px" }}
    >
      <p>{title}</p>
      <div
        className="rounded-full w-full"
        style={{
          height: "10px",
          background:
            "linear-gradient(90deg, rgba(224, 23, 34, 1) 0%, rgba(253, 180, 0, 1) 50%, rgba(45, 134, 34, 1) 100%)",
        }}
      ></div>
      <div className="flex justify-between">
        <p className="text-sm">Low</p>
        <p className="text-sm">High</p>
      </div>
    </div>
  );
}
