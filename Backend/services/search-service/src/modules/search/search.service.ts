import { SearchResult, SearchInput } from "./search.types.js";
import {
  searchAll,
  countSearchResults
} from "./search.repository.js";

/* =======================
   SEARCH
   ======================= */
export const searchService = async (
  input: SearchInput
): Promise<{ results: SearchResult[], total: number }> => {
  const results = await searchAll(input);
  const total = await countSearchResults(input);
  
  return { results, total };
};