import GreetingCard from "./components/greetingCard";
import ProjectsView from "./components/ProjectsView";

export default async function Home() {

  return (
    <div className="flex flex-col gap-12 w-full max-w-[800px] mx-auto px-4">
      <GreetingCard />
      <div className="flex flex-col gap-4 mt-8 w-full">
        <h4 className="text-3xl font-bold w-fit mx-auto">[projects]</h4>
        <ProjectsView />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Armand Packham-McGuiness | Games, Software & Hardware",
  description:
    "Portfolio of Armand Packham-McGuiness—creative tech projects across games, software, and hardware. Developer, builder, and experimental maker.",
};