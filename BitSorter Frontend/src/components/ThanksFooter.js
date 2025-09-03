import { useSelector } from "react-redux";
export default function ThanksFooter() {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  return (
    <>
      <div className={`${isDark?'bg-gray-900':'bg-white'} flex w-full flex-col`}>
        <div className="divider divider-start divider-primary text-primary">Thanks</div>
        <div className="divider divider-warning text-warning">For</div>
        <div className="divider divider-end divider-accent text-accent">Visiting</div>
      </div>
    </>
  );
}
