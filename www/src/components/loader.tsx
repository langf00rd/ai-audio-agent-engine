import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function Loader() {
  return (
    <motion.div
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="w-full h-full py-32 items-center justify-center flex"
    >
      <Loader2 className="animate-spin" />
    </motion.div>
  );
}
