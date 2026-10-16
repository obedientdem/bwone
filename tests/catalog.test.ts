import assert from "node:assert/strict";
import test from "node:test";
import { reviews } from "../src/data/demo.ts";
import { articleForLocale, filterReviews, validScore } from "../src/lib/catalog.ts";

test("search finds a shared article by its Chinese or English game name", () => {
  assert.equal(filterReviews(reviews, { query: "森间来信" })[0]?.id, "review-forest");
  assert.equal(filterReviews(reviews, { query: "  LETTERS FROM THE WOODS  " })[0]?.id, "review-forest");
  assert.equal(filterReviews(reviews, { query: "不存在的游戏" }).length, 0);
});

test("genre, platform and minimum score combine rather than override each other", () => {
  assert.deepEqual(filterReviews(reviews, { genre: "adventure", platform: "Switch", minScore: 8.5 }).map(item => item.id), ["review-forest"]);
  assert.equal(filterReviews(reviews, { genre: "puzzle", platform: "Switch", minScore: 8 }).length, 0);
});

test("30-day popularity does not sort by lifetime totals or editorial score", () => {
  const result = filterReviews(reviews, { sort: "popular" });
  assert.equal(result[0].id, "review-tram");
  assert.equal(result.at(-1)?.id, "review-coast");
  assert.equal(filterReviews(reviews, { sort: "score" })[0].id, "review-stairs");
});

test("editorial ties favour the newer publication without mutating the source", () => {
  const original = reviews.map(item => item.id);
  const result = filterReviews(reviews, { sort: "score" });
  assert.ok(result.findIndex(item => item.id === "review-forest") < result.findIndex(item => item.id === "review-coast"));
  assert.deepEqual(reviews.map(item => item.id), original);
});

test("a missing translation uses the original text and preserves article identity", () => {
  const source = reviews.find(item => item.id === "review-stairs")!;
  const result = articleForLocale(source, "en");
  assert.equal(result.fallback, true);
  assert.equal(result.language, "zh");
  assert.equal(result.value.title, source.copy.zh.title);
  assert.equal(result.id, articleForLocale(source, "zh").id);
});

test("an available English edition uses the same article with its own copy", () => {
  const result = articleForLocale(reviews[0], "en");
  assert.equal(result.fallback, false);
  assert.equal(result.language, "en");
  assert.equal(result.id, "review-forest");
  assert.notEqual(result.value.title, reviews[0].copy.zh.title);
});

test("all illustrative scores obey the agreed range and half-point step", () => {
  assert.ok(reviews.every(item => validScore(item.score) && validScore(item.playerScore)));
  assert.ok(validScore(0) && validScore(10) && validScore(8.5));
  assert.ok(!validScore(8.7) && !validScore(-.5) && !validScore(10.5) && !validScore(NaN));
});
