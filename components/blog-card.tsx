import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";

interface Props {
  title: string;
  image: string;
  publishedDate: string;
  tags: string[];
}

const BlogCard = (props: Props) => {
  return (
    <div className="flex flex-col gap-8 group">
      <AspectRatio
        ratio={1.4}
        className="bg-muted rounded-3xl relative overflow-hidden"
      >
        <Image
          src={props.image}
          alt="Photo by Drew Beamer"
          fill
          className="h-full w-full rounded-3xl object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="z-10 absolute top-4 left-4 flex gap-2">
          {props.tags.map((tag, index) => (
            <Badge
              key={index}
              className="h-6 min-w-6 rounded-full font-mono tabular-nums px-3 text-sm"
              variant="outline"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </AspectRatio>

      <div className="flex gap-4">
        <span className="opacity-[0.3] text-md whitespace-nowrap">
          {getTimeAgo(props.publishedDate)}
        </span>

        <h3 className="text-md">{props.title}</h3>
      </div>
    </div>
  );
};

export default BlogCard;

function getTimeAgo(date: string) {
  const now = new Date();
  const publishedDate = new Date(date);
  const diffInMs = now.getTime() - publishedDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  }
}
