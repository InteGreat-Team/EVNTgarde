import type React from "react";
import { Check, X, Send, Users } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | String;
  type: "total" | "going" | "notGoing" | "pending";
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, type }) => {
  const getCardStyles = () => {
    switch (type) {
      case "total":
        return {
          bg: "bg-white",
          icon: <Users className="h-5 w-5 text-gray-600" />,
          textColor: "text-gray-800",
        };
      case "going":
        return {
          bg: "bg-green-500",
          icon: <Check className="h-5 w-5 text-white" />,
          textColor: "text-white",
        };
      case "notGoing":
        return {
          bg: "bg-red-400",
          icon: <X className="h-5 w-5 text-white" />,
          textColor: "text-white",
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          icon: <Send className="h-5 w-5 text-yellow-500" />,
          textColor: "text-yellow-700",
        };
      default:
        return {
          bg: "bg-white",
          icon: null,
          textColor: "text-gray-800",
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div className={`${styles.bg} p-4 rounded shadow items-center`}>
      <div className="text-sm uppercase font-medium mb-2">{title}</div>
      <div className="flex items-center justify-between">
        <div className={`text-3xl font-bold ${styles.textColor}`}>{value}</div>
        <div className="ml-2 text-xl">{styles.icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
