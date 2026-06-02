export type HackerNewsData = {
    by: string;
    descendants: number;
    id: number;
    kids?: number[];
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
}[]


export async function getHackerNews(): Promise<HackerNewsData> {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
  );

  let ids: number[] = await response.json();

  ids = ids.slice(0, 5);
  return Promise.all(
    ids.map(async (id, index) => {
      let response;
      try {
        response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        );
      } catch (error: any) {
        console.log(
          `error while fetching hacker-news story number ${index}:\n${error.cause}`,
        );
        throw error;
      }
      return response.json();
    }),
  );
}
