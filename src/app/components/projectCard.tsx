import React from "react";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  url: string;
  slug?: string | null;
  description?: string;
  headerImage?: string;
  technologyIcons?: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  url,
  slug,
  description = "",
  headerImage,
  technologyIcons,
}) => {
  const href = slug ? `/projects/${slug}` : url || "#";

  return (
    <Link
      href={href}
      className="border-2 border-black"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        width: "100%",
        height: "319px",
        borderRadius: "0",
        overflow: "hidden",
        fontFamily: "sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <div style={{}}>
        {/* Header */}
        <div
          style={{
            paddingTop: "40%",
            background: headerImage
              ? `url(${headerImage}) center/cover`
              : "url(https://czxrgkpzsfztyahycugs.supabase.co/storage/v1/object/public/project-headers//defaultbg.png) center/cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        ></div>

        {/* Text Content */}
        <div
          style={{
            padding: "20px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                marginTop: "5px",
                color: "#555",
                fontSize: "1.1rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </p>
            {technologyIcons && technologyIcons.length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                {technologyIcons.map((icon, index) => (
                  <img
                    key={index}
                    src={icon}
                    alt="technology icon"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginTop: "10px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
