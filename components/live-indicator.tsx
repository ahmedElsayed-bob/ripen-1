export function LiveIndicator({
  isLive,
  onClick,
}: {
  isLive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center gap-2 bg-white h-9 px-4 rounded-md border border-gray-200 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`w-3 h-3 rounded-full ${
          isLive ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      />
      <span className="text-sm">Live</span>
    </div>
  );
}
