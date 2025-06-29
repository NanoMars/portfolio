export default function GreetingCard() {
  const textWidthPercent = 70;
  return (
    <div>
      
      <div className="mt-8 w-fit border-2 border-black p-4 mx-auto">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2" style={{ width: `${textWidthPercent}%` }}>
            <h1 className="text-3xl font-bold w-fit">Hi, I&#39;m [Armand]</h1>
            <p className="font-semibold break-words w-full max-w-full text-justify">
              I’m an 18 y/o builder from Sydney, currently in SF for Hack Club, working on experimental hardware, software, and games. I care about building fast, creative problem solving, and learning new things. I build to learn, iterate, and see what sticks.
            </p>
          </div>
          <div className="flex flex-col gap-2" style={{ width: `${100 - textWidthPercent}%` }}>
            <img
              className="w-full h-auto"
              src="https://czxrgkpzsfztyahycugs.supabase.co/storage/v1/object/public/random-images//dither-cat.png"
              alt="Dithered Cat"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
