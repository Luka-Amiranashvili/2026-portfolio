import { existsSync } from "node:fs";
import path from "node:path";
import { Interview } from "@/components/Interview";

export default function Page() {
  // Show the PDF download link only once public/cv.pdf exists.
  const hasCv = existsSync(path.join(process.cwd(), "public", "cv.pdf"));
  return <Interview hasCv={hasCv} />;
}
