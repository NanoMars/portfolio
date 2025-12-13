import ContactTag from "./contactTag";
import ClientIcon from "./ClientIcon";
export default function GreetingCard() {

  return (
    <div>

      <div className="mt-8 w-fit min-w-[356px] border-2 border-black p-4 mx-auto">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2 w-full md:w-[70%]">
            <h1 className="text-3xl font-bold w-fit">Hi, I&#39;m [Armand]</h1>
            <p className="font-semibold break-words w-full max-w-full text-justify">
              I’m an 18 y/o builder from Sydney working on hardware, software, games, and websites. I care about building fast, creative problem solving, and learning new things. I build to learn, iterate, and see what sticks.
            </p>
            <div className="flex flex-row gap-2 mt-4">
              <ContactTag
                imgSrc="https://cdn.simpleicons.org/instagram/000000"
                label="Instagram"
                href="https://www.instagram.com/nvmarmand/"
              />
              <ContactTag
                imgSrc="https://cdn.simpleicons.org/github/000000"
                label="GitHub"
                href="https://github.com/NanoMars"
              />
              <ContactTag
                imgSrc="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMjAuNDQ3IDIwLjQ1MmgtMy41NTR2LTUuNTY5YzAtMS4zMjgtLjAyNy0zLjAzNy0xLjg1Mi0zLjAzN2MtMS44NTMgMC0yLjEzNiAxLjQ0NS0yLjEzNiAyLjkzOXY1LjY2N0g5LjM1MVY5aDMuNDE0djEuNTYxaC4wNDZjLjQ3Ny0uOSAxLjYzNy0xLjg1IDMuMzctMS44NWMzLjYwMSAwIDQuMjY3IDIuMzcgNC4yNjcgNS40NTV2Ni4yODZ6TTUuMzM3IDcuNDMzYTIuMDYgMi4wNiAwIDAgMS0yLjA2My0yLjA2NWEyLjA2NCAyLjA2NCAwIDEgMSAyLjA2MyAyLjA2NW0xLjc4MiAxMy4wMTlIMy41NTVWOWgzLjU2NHpNMjIuMjI1IDBIMS43NzFDLjc5MiAwIDAgLjc3NCAwIDEuNzI5djIwLjU0MkMwIDIzLjIyNy43OTIgMjQgMS43NzEgMjRoMjAuNDUxQzIzLjIgMjQgMjQgMjMuMjI3IDI0IDIyLjI3MVYxLjcyOUMyNCAuNzc0IDIzLjIgMCAyMi4yMjIgMHoiLz48L3N2Zz4="
                label="LinkedIn"
                href="https://www.linkedin.com/in/armand-packham-mcguiness?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              />
              <ContactTag
                icon={<ClientIcon />}
                label="Email"
                href="mailto:me@armandpm.com"
              />
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-2 flex-1">
            <img
              className="aspect-square h-full object-cover"
              src="https://czxrgkpzsfztyahycugs.supabase.co/storage/v1/object/public/random-images//dither-cat.png"
              alt="Dithered Cat"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
