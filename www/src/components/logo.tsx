export function Logo(props?: { type?: "icon" | "default" }) {
  return (
    <div>
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col gap-[2px] scale-[0.7]">
          <div className="w-[40px] h-[20px] rounded-[4px] bg-primary" />
          <div className="w-[40px] h-[8px] rounded-[4px] bg-primary" />
          <div className="w-[40px] h-[5px] rounded-[4px] bg-primary" />
        </div>
        {props?.type !== "icon" && (
          <h2 className="font-bold text-primary">AI VOICE AGENT</h2>
        )}
      </div>
    </div>
  );
}

function LogoMain() {
  return (
    <div className="flex items-center w-full gap-2">
      <div className="flex flex-col gap-[2px] scale-[0.7]">
        <div className="w-[40px] h-[20px] rounded-[4px] bg-primary" />
        <div className="w-[40px] h-[8px] rounded-[4px] bg-primary" />
        <div className="w-[40px] h-[5px] rounded-[4px] bg-primary" />
      </div>
      <h2 className="font-bold text-primary">AI VOICE AGENT</h2>
    </div>
  );
}
