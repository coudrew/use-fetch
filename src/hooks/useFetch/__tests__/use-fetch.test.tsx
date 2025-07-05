import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import createFetchMock from "vitest-fetch-mock";
import { useFetch } from "../use-fetch";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe("useFetch", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
  });

  const TEST_URL = "http://any.com/";

  it("fetches from the supplied endpoint with a GET method", async () => {
    fetchMocker.mockOnce("actual");
    renderHook(() => useFetch<string>({ url: TEST_URL }));

    expect(fetchMocker).toHaveBeenCalledWith(
      TEST_URL,
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("returns a null data object and isLoading true immediately, then resolves when fetch completes", async () => {
    fetchMocker.mockOnce("actual");

    const { result } = renderHook(() => useFetch<string>({ url: TEST_URL }));

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);

    waitFor(() => {
      expect(result.current.data).toBe("actual");
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("returns an error object when request is rejected", async () => {
    fetchMocker.mockResponse(JSON.stringify({ error: "Not Found" }), {
      status: 404,
    });

    const { result } = renderHook(() => useFetch<string>({ url: TEST_URL }));

    waitFor(() => {
      expect(result.current.error).toEqual("Error: 404");
    });
  });

  it("returns an error object when return has wrong shape", async () => {
    fetchMocker.mockOnce(JSON.stringify("fail"));

    const { result } = renderHook(() =>
      useFetch<{ key: string }>({ url: TEST_URL }),
    );

    waitFor(() => {
      expect(result.current.error).toEqual("Unexpected response type");
    });
  });

  it("returns an error object when a network error occurs", async () => {
    fetchMocker.mockReject(new Error("Network error"));

    const { result } = renderHook(() => useFetch<string>({ url: TEST_URL }));

    waitFor(() => {
      expect(result.current.error).toEqual("Unknown error");
    });
  });
});
