/**
 * Unit tests for timeline extraction
 */
import { extractTimelineBlocks } from "../server/timeline"

describe("Timeline Extraction", () => {
  it("should extract single timeline block", () => {
    const text = `Some narrative text.
##TIMELINE## {"year":1692,"title":"The Trials Begin","desc":"Accusations spread","place":"Salem"}
More text.`

    const items = extractTimelineBlocks(text)
    expect(items).toHaveLength(1)
    expect(items[0].year).toBe(1692)
    expect(items[0].title).toBe("The Trials Begin")
  })

  it("should extract multiple timeline blocks", () => {
    const text = `
##TIMELINE## {"year":1692,"title":"Event 1","desc":"First event"}
##TIMELINE## {"year":1693,"title":"Event 2","desc":"Second event"}
##TIMELINE## {"year":1694,"title":"Event 3","desc":"Third event"}
`

    const items = extractTimelineBlocks(text)
    expect(items).toHaveLength(3)
    expect(items[0].year).toBe(1692)
    expect(items[2].year).toBe(1694)
  })

  it("should sort timeline items by year", () => {
    const text = `
##TIMELINE## {"year":1700,"title":"Event C","desc":"Third"}
##TIMELINE## {"year":1650,"title":"Event A","desc":"First"}
##TIMELINE## {"year":1675,"title":"Event B","desc":"Second"}
`

    const items = extractTimelineBlocks(text)
    expect(items[0].year).toBe(1650)
    expect(items[1].year).toBe(1675)
    expect(items[2].year).toBe(1700)
  })

  it("should deduplicate by title and year", () => {
    const text = `
##TIMELINE## {"year":1692,"title":"Same Event","desc":"First"}
##TIMELINE## {"year":1692,"title":"Same Event","desc":"Duplicate"}
##TIMELINE## {"year":1693,"title":"Different","desc":"Unique"}
`

    const items = extractTimelineBlocks(text)
    expect(items).toHaveLength(2)
  })

  it("should handle invalid JSON gracefully", () => {
    const text = `
##TIMELINE## {"year":1692,"title":"Valid","desc":"Good"}
##TIMELINE## {invalid json}
##TIMELINE## {"year":1693,"title":"Also Valid","desc":"Good"}
`

    const items = extractTimelineBlocks(text)
    expect(items).toHaveLength(2)
  })

  it("should validate schema and reject invalid items", () => {
    const text = `
##TIMELINE## {"year":"not a number","title":"Invalid","desc":"Bad"}
##TIMELINE## {"year":1692,"title":"Valid","desc":"Good"}
`

    const items = extractTimelineBlocks(text)
    expect(items).toHaveLength(1)
    expect(items[0].title).toBe("Valid")
  })
})
