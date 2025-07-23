// import { AdsenseTrigger } from "@/components/AdsenseTrigger";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* <AdsenseTrigger /> */}
    </>
  );
}
