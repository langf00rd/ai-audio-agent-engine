export function Logo() {
  return (
    <div className="flex items-center justify-center gap-1">
      <h2 className="text-[28px] bold-heading text-primary">TOOW</h2>
    </div>
  );
  // return <Image src="/logo.png" alt="toow logo" width={120} height={0} />;
  // return (
  //   <div>
  //     <Link href={ROUTES.app.index}>
  //       <div className="flex items-center w-full gap-2 scale-[0.5]">
  //         <div className="flex flex-col gap-[2px]">
  //           <div className="w-[40px] h-[20px] rounded-[4px] bg-primary" />
  //           <div className="w-[40px] h-[8px] rounded-[4px] bg-primary" />
  //           <div className="w-[40px] h-[5px] rounded-[4px] bg-primary" />
  //         </div>
  //         {props?.type !== "icon" && (
  //           <h2 className="text-primary text-[52px] bold-heading">TOOW</h2>
  //         )}
  //       </div>
  //     </Link>
  //   </div>
  // );
}
