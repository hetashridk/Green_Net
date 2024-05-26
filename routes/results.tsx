import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import ShareButton from "../islands/ShareButton.tsx";


export const handler: Handlers<PlantData[]> = {
  GET(req, ctx) {
    // get data
    const url = new URL(req.url);
    const data = url.searchParams.get("data") || "";
    const latitude = url.searchParams.get("latitude") || "";
    const longitude = url.searchParams.get("longitude") || "";

    // if no data redirect
    if (!data || data.trim().length == 0) {
      return ctx.renderNotFound();
    }

    try {
      // interpret data
      const results: PlantData[] = JSON.parse(
        decodeURIComponent(atob(data)),
      );

      // return data along with latitude and longitude
      return ctx.render({ results, latitude, longitude });
    } catch {
      return ctx.renderNotFound();
    }
  },
};

/**
 * Results page for plants
 */
// Results Type
interface PlantData {
  emoji: string;
  name: string;
  note: string;
  growth_time: string;
}

// Page Props Type
interface ResultsProps {
  results: PlantData[];
  latitude: string;
  longitude: string;
}

/**
 * Results page for plants
 */
export default function Results({ data }: PageProps<ResultsProps>) {
  const { results, latitude, longitude } = data;

  return (
    <>
      {/* Meta Tags  */}
      <Head>
        <title>Your Results</title>
      </Head>

      {/* Hero  */}
      <div className="select-none py-10 h-fit bg-[#22c55ed3]">
        <div className="my-16 text-center">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-5xl text-green-950 font-extrabold break-words">
                Plantation Suggested
              </h1>
              <div className="grid place-items-center">
                <p className="select-text max-w-lg py-6 break-words text-green-900 font-medium text-sm md:text-md md:font-bold tracking-tight">
                  Welcome to your <strong>personalized</strong>
                  plant recommendations, powered by
                  {" "} <strong>AI</strong>! By growing these plants,
                  you're not only enhancing your surroundings but also
                  {" "}<strong>contributing</strong>{" "}
                  to the well-being of our planet. Remember, plants are our
                  {" "}<strong>best friends</strong>. These
                  {" "}<strong>recommendations</strong>{" "}
                  are tailored to your location and local weather, so you can
                  nurture these green companions with confidence. Let's
                  {" "}<strong>grow together</strong>{" "} and make a
                  {" "}<strong>positive</strong>{" "}
                  impact on Earth! Scroll Down {":)"}
                </p>
              </div>
            </div>
            {/* Share Button  */}
            <ShareButton />
          </div>
        </div>
      </div>
      {/* Hero end  */}

      {/* Map Section */}
      <section className="my-10 grid place-items-center">
        <div className="w-full md:w-3/4">
          <iframe
            src={`map.html?latitude=${latitude}&longitude=${longitude}`}
            width="100%"
            height="500px"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      </section>

      {/* Results Starts  */}
      <section className="my-10 grid  place-items-center">
        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((x: PlantData) => (
            <div className="w-full hover:shadow-2xl md:hover:scale-105 transition card py-2 md:w-96 select-none bg-base-300 shadow-xl" key={x.name}>
              <figure>
                <h2 className="select-none text-9xl rounded-full my-1 bg-white/5 px-1.5 py-2 aspect-square">
                  {x.emoji}
                </h2>
              </figure>
              <div className="card-body">
                <h2 className="card-title underline underline-offset-8 select-text">
                  {x.name}
                </h2>
                <h3 className="tracking-tight font-5xl font-bold mt-4 border-white border w-fit rounded-md px-3 py-1">
                  ⏰ {x.growth_time}
                </h3>
                <p className="mt-2 select-all mb-4 opacity-90 font-semibold tracking-wide break-words">
                  {x.note}
                </p>
                <div className="card-actions justify-center">
                  <a
                    target="_blank"
                    href={`https://google.com/search?q=How to grow ${x.name} at home?`}
                    className="select-none text-center inline rounded-lg hover:scale-105 transition ease-in-out hover:shadow-xl cursor-pointer text-xl w-full font-bold tracking-tight font-xl bg-[#22c55e] text-green-950 border-green-950 border-2 px-5 py-1.5"
                    aria-label="how-to-grow"
                  >
                    Guide To Grow
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Results End  */}
    </>
  );
}
