/**
 * Unit tests for geocoding service
 */
import { getCoords } from "../server/geocode"

// Mock fetch globally
global.fetch = jest.fn()

describe("Geocoding Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should geocode a valid place", async () => {
    const mockResponse = [
      {
        display_name: "Salem, Essex County, Massachusetts, USA",
        lat: "42.5195",
        lon: "-70.8967",
        address: { country: "United States" },
      },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await getCoords("Salem, Massachusetts")

    expect(result).toEqual({
      name: "Salem, Essex County, Massachusetts, USA",
      lat: 42.5195,
      lon: -70.8967,
      country: "United States",
    })
  })

  it("should return null for unknown place", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    const result = await getCoords("Nonexistent Place XYZ")
    expect(result).toBeNull()
  })

  it("should handle API errors gracefully", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const result = await getCoords("Salem")
    expect(result).toBeNull()
  })

  it("should cache results", async () => {
    const mockResponse = [
      {
        display_name: "Test Location",
        lat: "40.0",
        lon: "-70.0",
        address: {},
      },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    // First call
    await getCoords("Test Location")

    // Second call should use cache
    const result = await getCoords("Test Location")

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(result?.name).toBe("Test Location")
  })
})
