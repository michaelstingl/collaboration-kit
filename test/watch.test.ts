// Unit test for watch.ts ref extraction (the network part is exercised live, not here).
import { test, expect } from "bun:test";
import { refsFromText } from "../watch.ts";

test("refsFromText extracts org/repo#n and github issue/pull URLs, deduped", () => {
  const refs = refsFromText(`
    see foo/bar#12 and again foo/bar#12
    pr https://github.com/octo/repo/pull/34
    issue https://github.com/octo/repo/issues/56
    a plain a/b without a number is not a ref
  `);
  expect(refs).toContain("foo/bar#12");
  expect(refs).toContain("octo/repo#34");
  expect(refs).toContain("octo/repo#56");
  expect(refs.filter((r) => r === "foo/bar#12").length).toBe(1); // deduped
  expect(refs.some((r) => r.startsWith("a/b#"))).toBe(false);    // no number → ignored
});
