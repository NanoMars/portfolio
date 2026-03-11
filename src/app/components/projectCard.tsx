import React from "react";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  url: string;
  slug?: string | null;
  description?: string;
  headerImage?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  url,
  slug,
  description = "",
  headerImage,
}) => {
  const href = slug ? `/projects/${slug}#content` : url || "#";

  return (
    <Link
      href={href}
      className="border-2 border-black flex flex-col bg-white overflow-hidden h-[280px]"
    >
      {/* Header */}
      <div
        className="w-full relative shrink-0 h-[140px]"
        style={{
          background: headerImage
            ? `url(${headerImage}) center/cover`
            : "url(https://czxrgkpzsfztyahycugs.supabase.co/storage/v1/object/public/project-headers//defaultbg.png) center/cover",
        }}
      />

      {/* Text Content */}
      <div className="p-4 flex flex-col gap-1 border-t-2 border-black flex-1 overflow-hidden">
        <h2 className="m-0 text-xl font-bold font-sans truncate shrink-0">
          {title}
        </h2>
        {description && (
          <p
            className="m-0 text-gray-600 text-[1rem] leading-snug font-sans flex-1"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
