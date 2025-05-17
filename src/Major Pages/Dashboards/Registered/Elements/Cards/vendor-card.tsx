import { useNavigate } from "react-router-dom";
import { Button, Card } from "../../../../../Layout/combined-ui";
import { Clock, Star } from "lucide-react";
import { cn } from "../../../../../lib/utils";

interface VendorCardProps {
  id: number;
  name: string;
  location: string;
  price: number | string;
  ratings: number;
  image: string;
  timeSlot: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showHireButton?: boolean;
  onClick?: (id: number) => void; // Updated to accept id as a parameter
}

export function VendorCard({
  id,
  name,
  location,
  price,
  ratings,
  image,
  timeSlot,
  isFavorite = false,
  onToggleFavorite,
  showHireButton = true,
  onClick,
}: VendorCardProps) {
  const navigate = useNavigate();

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(id); // Call the onClick prop with the id
    } else {
      navigate(`/organizers/${id}`); // Default navigation if onClick is not provided
    }
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
        <div className="relative">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 p-0 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              onToggleFavorite?.();
            }}
          >
            <Star
              className={cn(
                "h-5 w-5",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
              )}
            />
          </Button>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{location}</p>

          {/* Time Slot */}
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 ">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500 " />
              <span>{timeSlot}</span>
            </div>
          </div>

          {/* Price and Ratings */}
          <div className="mt-2 flex flex-col gap-3">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium text-gray-900 ">PHP {price}</span>
              <span className="text-gray-500 ">• {ratings} ratings</span>
            </div>

            {/* HIRE Button */}
            {showHireButton && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md w-full py-2 font-semibold mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/organizers/${id}`);
                }}
              >
                Hire
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
