export default function getNextUrl(): string {
  const nextUrl = sessionStorage.getItem("next_url");

  if (nextUrl === null) {
    throw new Error(
      `No "next_url" found in sessionStorage, please set the next page url in sessionStorage!`
    );
  }

  return nextUrl;
}
