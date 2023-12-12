const errorTolerance = 0.8;
const tagRegex = /^[a-zA-Z ]+$/;

import stringSimilarity from "string-similarity-js";

export function tagFormatter(toFormatTag: string): string {
  const splicedBySpace = toFormatTag.split(" ");
  const capitalized = splicedBySpace.map((word) => {
    return word[0].toUpperCase() + word.slice(1, word.length).toLowerCase();
  });
  const tag = capitalized.join(" ");
  return tag;
}

export function tagValidator(toValidateTag: string): boolean {
  return toValidateTag === "" || tagRegex.test(toValidateTag);
}

export function tagFindSimilars(tags: string[], newTag: string) {
  const tagSimilarities = tags.map((tag) => {
    return [stringSimilarity(tag, newTag), tag];
  });
  return tagSimilarities
    .sort((a: Array<number | string>, b: Array<number | string>) => (a[0] > b[0] ? 1 : 0))
    .reverse()
    .filter((sim: Array<number | string>) => typeof sim[0] === "number" && sim[0] > errorTolerance)
    .map((sim) => sim[1]);
}
