export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  leetcode_number: number;
  title: string;
  difficulty: Difficulty;
  leetcode_url: string;
  github_url?: string;
  docs_url?: string;
  youtube_url?: string;
  order_number: number;
  pattern_slug: string;
}

export interface Pattern {
  number: number;
  name: string;
  slug: string;
  description: string;
  core_idea: string;
  when_to_use: string[];
  recognition_signals: string[];
  complexity: string;
  common_mistakes: string[];
  cheat_sheet: string;
  problems: Problem[];
}

type Raw = [number, string, "E" | "M" | "H"];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-");

const diffMap = { E: "Easy", M: "Medium", H: "Hard" } as const;

function def(
  number: number,
  name: string,
  info: Omit<Pattern, "number" | "name" | "slug" | "problems">,
  raw: Raw[],
): Pattern {
  const slug = slugify(name);
  return {
    number,
    name,
    slug,
    ...info,
    problems: raw.map(([n, title, d], i) => ({
      id: String(n),
      leetcode_number: n,
      title,
      difficulty: diffMap[d],
      leetcode_url: `https://leetcode.com/problems/${slugify(title)}/`,
      youtube_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`leetcode ${n} ${title}`)}`,
      order_number: i + 1,
      pattern_slug: slug,
    })),
  };
}

export const patterns: Pattern[] = [
  def(1, "Two Pointers", {
    description: "Walk two indices toward each other or in tandem to avoid nested loops.",
    core_idea: "left →          ← right",
    when_to_use: ["Sorted arrays", "Palindrome checks", "Pair searching", "In-place operations"],
    recognition_signals: ["Input is sorted or can be sorted", "Find a pair / triplet with a target", "Modify array in place with O(1) space"],
    complexity: "O(n) time · O(1) space",
    common_mistakes: ["Forgetting to skip duplicates in 3Sum", "Off-by-one when pointers cross", "Moving the wrong pointer"],
    cheat_sheet: "while (l < r) {\n  if (ok(l, r)) return;\n  sum < target ? l++ : r--;\n}",
  }, [[125, "Valid Palindrome", "E"], [344, "Reverse String", "E"], [26, "Remove Duplicates from Sorted Array", "E"], [977, "Squares of a Sorted Array", "E"], [283, "Move Zeroes", "E"], [167, "Two Sum II - Input Array Is Sorted", "M"], [15, "3Sum", "M"], [11, "Container With Most Water", "M"], [75, "Sort Colors", "M"], [42, "Trapping Rain Water", "H"]]),
  def(2, "Sliding Window", {
    description: "Maintain a contiguous window that grows and shrinks as you scan.",
    core_idea: "[ l ····· r ] →",
    when_to_use: ["Contiguous subarrays / substrings", "Longest or shortest window with a property", "Running aggregates"],
    recognition_signals: ["\"Longest / shortest substring\"", "\"Subarray of size k\"", "Constraint that can be checked incrementally"],
    complexity: "O(n) time · O(k) space",
    common_mistakes: ["Shrinking with if instead of while", "Updating the answer at the wrong moment", "Not cleaning up the frequency map"],
    cheat_sheet: "for (r = 0; r < n; r++) {\n  add(a[r]);\n  while (invalid()) remove(a[l++]);\n  best = max(best, r - l + 1);\n}",
  }, [[643, "Maximum Average Subarray I", "E"], [121, "Best Time to Buy and Sell Stock", "E"], [3, "Longest Substring Without Repeating Characters", "M"], [424, "Longest Repeating Character Replacement", "M"], [567, "Permutation in String", "M"], [209, "Minimum Size Subarray Sum", "M"], [1004, "Max Consecutive Ones III", "M"], [438, "Find All Anagrams in a String", "M"], [76, "Minimum Window Substring", "H"], [239, "Sliding Window Maximum", "H"]]),
  def(3, "Prefix Sum", {
    description: "Precompute running totals so any range sum is a subtraction.",
    core_idea: "sum(i..j) = P[j+1] − P[i]",
    when_to_use: ["Many range-sum queries", "Subarrays summing to k", "Balance / equal-count problems"],
    recognition_signals: ["\"Subarray sum equals\"", "Repeated range queries", "Negative numbers break sliding window"],
    complexity: "O(n) build · O(1) query",
    common_mistakes: ["Forgetting map[0] = 1", "Off-by-one in prefix indexing", "Integer overflow"],
    cheat_sheet: "seen = {0: 1}; s = 0\nfor x in a:\n  s += x\n  ans += seen[s - k]\n  seen[s]++",
  }, [[1480, "Running Sum of 1d Array", "E"], [303, "Range Sum Query - Immutable", "E"], [724, "Find Pivot Index", "E"], [560, "Subarray Sum Equals K", "M"], [238, "Product of Array Except Self", "M"], [525, "Contiguous Array", "M"], [974, "Subarray Sums Divisible by K", "M"], [304, "Range Sum Query 2D - Immutable", "M"]]),
  def(4, "Hashing", {
    description: "Trade memory for speed with constant-time lookups.",
    core_idea: "value → index / count",
    when_to_use: ["Membership checks", "Counting frequencies", "Grouping by a key"],
    recognition_signals: ["\"Have I seen this before?\"", "Anagrams / grouping", "O(n²) brute force on pairs"],
    complexity: "O(n) time · O(n) space",
    common_mistakes: ["Checking the map after inserting the current item", "Using mutable keys", "Ignoring collisions in custom keys"],
    cheat_sheet: "for i, x in enumerate(a):\n  if target - x in seen: return\n  seen[x] = i",
  }, [[1, "Two Sum", "E"], [217, "Contains Duplicate", "E"], [242, "Valid Anagram", "E"], [205, "Isomorphic Strings", "E"], [290, "Word Pattern", "E"], [49, "Group Anagrams", "M"], [128, "Longest Consecutive Sequence", "M"], [380, "Insert Delete GetRandom O(1)", "M"]]),
  def(5, "Fast & Slow Pointers", {
    description: "Two pointers moving at different speeds reveal cycles and midpoints.",
    core_idea: "slow +1 · fast +2",
    when_to_use: ["Cycle detection", "Finding the middle", "Implicit linked lists"],
    recognition_signals: ["Linked list with possible loop", "\"Middle of the list\"", "Sequence that may repeat"],
    complexity: "O(n) time · O(1) space",
    common_mistakes: ["Null checks on fast.next", "Wrong reset when finding cycle start"],
    cheat_sheet: "while (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow === fast) return true;\n}",
  }, [[141, "Linked List Cycle", "E"], [876, "Middle of the Linked List", "E"], [202, "Happy Number", "E"], [234, "Palindrome Linked List", "E"], [142, "Linked List Cycle II", "M"], [287, "Find the Duplicate Number", "M"], [143, "Reorder List", "M"], [457, "Circular Array Loop", "M"]]),
  def(6, "Linked List Reversal", {
    description: "Re-wire next pointers in place, one node at a time.",
    core_idea: "prev ← curr   next →",
    when_to_use: ["Reverse whole or part of a list", "Reorder nodes", "k-group operations"],
    recognition_signals: ["\"Reverse\" with a linked list", "O(1) extra space", "Swap adjacent nodes"],
    complexity: "O(n) time · O(1) space",
    common_mistakes: ["Losing the next reference", "Not using a dummy head", "Forgetting to reconnect sublists"],
    cheat_sheet: "prev = null\nwhile (cur) {\n  nxt = cur.next; cur.next = prev;\n  prev = cur; cur = nxt;\n}",
  }, [[206, "Reverse Linked List", "E"], [21, "Merge Two Sorted Lists", "E"], [92, "Reverse Linked List II", "M"], [24, "Swap Nodes in Pairs", "M"], [61, "Rotate List", "M"], [19, "Remove Nth Node From End of List", "M"], [2, "Add Two Numbers", "M"], [25, "Reverse Nodes in k-Group", "H"]]),
  def(7, "Stack", {
    description: "Last in, first out — perfect for nesting and undo.",
    core_idea: "push ↓   ↑ pop",
    when_to_use: ["Matching brackets", "Expression evaluation", "Nested structures"],
    recognition_signals: ["Parentheses", "\"Most recent\" element matters", "Decode nested strings"],
    complexity: "O(n) time · O(n) space",
    common_mistakes: ["Popping an empty stack", "Leaving unmatched items at the end"],
    cheat_sheet: "for c in s:\n  if opener(c): st.push(c)\n  elif not st or st.pop() != pair[c]: return False\nreturn not st",
  }, [[20, "Valid Parentheses", "E"], [232, "Implement Queue using Stacks", "E"], [155, "Min Stack", "M"], [150, "Evaluate Reverse Polish Notation", "M"], [71, "Simplify Path", "M"], [394, "Decode String", "M"], [22, "Generate Parentheses", "M"], [32, "Longest Valid Parentheses", "H"]]),
  def(8, "Monotonic Stack", {
    description: "Keep a stack sorted to answer next-greater / next-smaller in one pass.",
    core_idea: "▁▃▅▇ pop while broken",
    when_to_use: ["Next greater / smaller element", "Spans and histograms", "Remove digits greedily"],
    recognition_signals: ["\"Next warmer day\"", "Largest rectangle", "Nearest element to the left/right"],
    complexity: "O(n) time · O(n) space",
    common_mistakes: ["Storing values instead of indices", "Wrong comparison (< vs ≤)", "Forgetting leftovers"],
    cheat_sheet: "for i, x in enumerate(a):\n  while st and a[st[-1]] < x:\n    ans[st.pop()] = x\n  st.append(i)",
  }, [[496, "Next Greater Element I", "E"], [739, "Daily Temperatures", "M"], [503, "Next Greater Element II", "M"], [901, "Online Stock Span", "M"], [402, "Remove K Digits", "M"], [907, "Sum of Subarray Minimums", "M"], [84, "Largest Rectangle in Histogram", "H"], [85, "Maximal Rectangle", "H"]]),
  def(9, "Binary Search", {
    description: "Halve the search space every step on sorted or monotonic data.",
    core_idea: "lo ··· mid ··· hi",
    when_to_use: ["Sorted arrays", "Rotated arrays", "Boundaries (first/last)"],
    recognition_signals: ["\"Sorted\" + O(log n)", "Find first/last occurrence", "Peak finding"],
    complexity: "O(log n) time · O(1) space",
    common_mistakes: ["Infinite loop with lo = mid", "Overflow in (lo+hi)/2", "Wrong invariant"],
    cheat_sheet: "lo, hi = 0, n - 1\nwhile lo <= hi:\n  mid = lo + (hi - lo) // 2\n  ...",
  }, [[704, "Binary Search", "E"], [35, "Search Insert Position", "E"], [278, "First Bad Version", "E"], [34, "Find First and Last Position of Element in Sorted Array", "M"], [74, "Search a 2D Matrix", "M"], [33, "Search in Rotated Sorted Array", "M"], [153, "Find Minimum in Rotated Sorted Array", "M"], [162, "Find Peak Element", "M"], [4, "Median of Two Sorted Arrays", "H"]]),
  def(10, "Binary Search on Answer", {
    description: "Binary search over the range of possible answers with a feasibility check.",
    core_idea: "can(x)?  ✗✗✗✓✓✓",
    when_to_use: ["Minimize the maximum", "Maximize the minimum", "Capacity / speed problems"],
    recognition_signals: ["\"Minimum speed / capacity / days\"", "Monotonic feasibility", "Huge answer range"],
    complexity: "O(n log R)",
    common_mistakes: ["Wrong search bounds", "Non-monotonic check", "Off-by-one in final answer"],
    cheat_sheet: "lo, hi = minAns, maxAns\nwhile lo < hi:\n  mid = (lo + hi) // 2\n  if can(mid): hi = mid\n  else: lo = mid + 1",
  }, [[69, "Sqrt(x)", "E"], [875, "Koko Eating Bananas", "M"], [1011, "Capacity To Ship Packages Within D Days", "M"], [1283, "Find the Smallest Divisor Given a Threshold", "M"], [1482, "Minimum Number of Days to Make m Bouquets", "M"], [2187, "Minimum Time to Complete Trips", "M"], [410, "Split Array Largest Sum", "H"]]),
  def(11, "Cyclic Sort", {
    description: "Place each number at its own index when values lie in 1..n.",
    core_idea: "a[i] → index a[i]-1",
    when_to_use: ["Values in range 1..n", "Missing / duplicate numbers", "O(1) space required"],
    recognition_signals: ["\"Numbers from 1 to n\"", "Find missing / duplicate", "No extra space"],
    complexity: "O(n) time · O(1) space",
    common_mistakes: ["Incrementing i after a swap", "Infinite swaps on duplicates"],
    cheat_sheet: "i = 0\nwhile i < n:\n  j = a[i] - 1\n  if 0 <= j < n and a[i] != a[j]: swap(i, j)\n  else: i += 1",
  }, [[268, "Missing Number", "E"], [448, "Find All Numbers Disappeared in an Array", "E"], [645, "Set Mismatch", "E"], [442, "Find All Duplicates in an Array", "M"], [41, "First Missing Positive", "H"]]),
  def(12, "Merge Intervals", {
    description: "Sort by start, then sweep and merge overlaps.",
    core_idea: "[──]  [───]  →  [──────]",
    when_to_use: ["Overlapping ranges", "Scheduling", "Interval intersection"],
    recognition_signals: ["List of [start, end]", "\"Overlap\"", "Meeting rooms / calendars"],
    complexity: "O(n log n) time",
    common_mistakes: ["Not sorting first", "Using < vs ≤ for touching intervals"],
    cheat_sheet: "a.sort()\nfor s, e in a:\n  if out and s <= out[-1][1]: out[-1][1] = max(out[-1][1], e)\n  else: out.append([s, e])",
  }, [[56, "Merge Intervals", "M"], [57, "Insert Interval", "M"], [435, "Non-overlapping Intervals", "M"], [986, "Interval List Intersections", "M"], [452, "Minimum Number of Arrows to Burst Balloons", "M"], [1094, "Car Pooling", "M"]]),
  def(13, "Top K Elements", {
    description: "Use a heap of size k to track the best k items.",
    core_idea: "heap(k) ⇅",
    when_to_use: ["K largest / smallest / most frequent", "Streaming data", "Scheduling with priorities"],
    recognition_signals: ["\"Top k\" / \"kth\"", "Frequency ranking", "Closest points"],
    complexity: "O(n log k)",
    common_mistakes: ["Using a max-heap when a min-heap of size k is needed", "Sorting everything"],
    cheat_sheet: "for x in a:\n  heappush(h, x)\n  if len(h) > k: heappop(h)",
  }, [[703, "Kth Largest Element in a Stream", "E"], [1046, "Last Stone Weight", "E"], [215, "Kth Largest Element in an Array", "M"], [347, "Top K Frequent Elements", "M"], [973, "K Closest Points to Origin", "M"], [451, "Sort Characters By Frequency", "M"], [621, "Task Scheduler", "M"], [767, "Reorganize String", "M"]]),
  def(14, "Two Heaps", {
    description: "Split data into a low max-heap and a high min-heap to track the middle.",
    core_idea: "max-heap | min-heap",
    when_to_use: ["Running median", "Balancing two halves", "Greedy with two priorities"],
    recognition_signals: ["\"Median\" of a stream", "Sliding window median", "Pick best capital/profit"],
    complexity: "O(log n) per insert",
    common_mistakes: ["Not rebalancing after each insert", "Lazy deletion bugs"],
    cheat_sheet: "push to low; move low.top to high\nif len(high) > len(low): move back",
  }, [[295, "Find Median from Data Stream", "H"], [480, "Sliding Window Median", "H"], [502, "IPO", "H"], [436, "Find Right Interval", "M"]]),
  def(15, "K-way Merge", {
    description: "Merge k sorted sources with a min-heap of their heads.",
    core_idea: "k lists → heap → 1 list",
    when_to_use: ["Merging sorted lists", "Kth smallest across sorted rows", "Smallest range"],
    recognition_signals: ["Multiple sorted inputs", "\"Merge k\""],
    complexity: "O(N log k)",
    common_mistakes: ["Pushing nulls into the heap", "Comparing nodes without a tiebreaker"],
    cheat_sheet: "heap = [(l.val, i, l) for l in lists if l]\nwhile heap: pop, append, push next",
  }, [[88, "Merge Sorted Array", "E"], [378, "Kth Smallest Element in a Sorted Matrix", "M"], [373, "Find K Pairs with Smallest Sums", "M"], [23, "Merge k Sorted Lists", "H"], [632, "Smallest Range Covering Elements from K Lists", "H"]]),
  def(16, "Tree BFS", {
    description: "Traverse a tree level by level with a queue.",
    core_idea: "queue · level by level",
    when_to_use: ["Level order output", "Shortest depth", "Right / left views"],
    recognition_signals: ["\"Level\"", "\"Minimum depth\"", "Zigzag"],
    complexity: "O(n) time · O(w) space",
    common_mistakes: ["Not snapshotting the level size", "Pushing null children"],
    cheat_sheet: "q = [root]\nwhile q:\n  for _ in range(len(q)):\n    node = q.popleft(); ...",
  }, [[637, "Average of Levels in Binary Tree", "E"], [111, "Minimum Depth of Binary Tree", "E"], [102, "Binary Tree Level Order Traversal", "M"], [107, "Binary Tree Level Order Traversal II", "M"], [103, "Binary Tree Zigzag Level Order Traversal", "M"], [199, "Binary Tree Right Side View", "M"], [116, "Populating Next Right Pointers in Each Node", "M"], [662, "Maximum Width of Binary Tree", "M"]]),
  def(17, "Tree DFS", {
    description: "Recurse down the tree, combining answers on the way back up.",
    core_idea: "solve(left) + solve(right)",
    when_to_use: ["Path sums", "Depth / diameter", "Subtree properties"],
    recognition_signals: ["\"Path\" in a tree", "Answer depends on children", "Serialize trees"],
    complexity: "O(n) time · O(h) space",
    common_mistakes: ["Confusing what to return vs. what to record globally", "Missing base case"],
    cheat_sheet: "def dfs(node):\n  if not node: return 0\n  l, r = dfs(node.left), dfs(node.right)\n  return 1 + max(l, r)",
  }, [[104, "Maximum Depth of Binary Tree", "E"], [226, "Invert Binary Tree", "E"], [100, "Same Tree", "E"], [101, "Symmetric Tree", "E"], [112, "Path Sum", "E"], [543, "Diameter of Binary Tree", "E"], [236, "Lowest Common Ancestor of a Binary Tree", "M"], [124, "Binary Tree Maximum Path Sum", "H"], [297, "Serialize and Deserialize Binary Tree", "H"]]),
  def(18, "Binary Search Tree", {
    description: "Exploit left < node < right ordering for searching and validation.",
    core_idea: "left < node < right",
    when_to_use: ["Search / insert / delete", "Validate ordering", "Inorder = sorted"],
    recognition_signals: ["\"BST\" in the title", "Kth smallest", "Range bounds"],
    complexity: "O(h) per operation",
    common_mistakes: ["Only checking direct children when validating", "Forgetting duplicates"],
    cheat_sheet: "def valid(n, lo, hi):\n  if not n: return True\n  return lo < n.val < hi and valid(n.left, lo, n.val) and valid(n.right, n.val, hi)",
  }, [[700, "Search in a Binary Search Tree", "E"], [108, "Convert Sorted Array to Binary Search Tree", "E"], [98, "Validate Binary Search Tree", "M"], [230, "Kth Smallest Element in a BST", "M"], [235, "Lowest Common Ancestor of a Binary Search Tree", "M"], [701, "Insert into a Binary Search Tree", "M"], [450, "Delete Node in a BST", "M"], [173, "Binary Search Tree Iterator", "M"]]),
  def(19, "Graph Traversal", {
    description: "Explore grids and graphs with BFS or DFS and a visited set.",
    core_idea: "visit · mark · expand",
    when_to_use: ["Connected components", "Grid flood fill", "Multi-source spread"],
    recognition_signals: ["2D grid of cells", "\"Islands\" / \"regions\"", "Spread over time"],
    complexity: "O(V + E)",
    common_mistakes: ["Marking visited too late", "Out-of-bounds checks", "Recursion depth on big grids"],
    cheat_sheet: "def dfs(r, c):\n  if out or grid[r][c] != '1': return\n  grid[r][c] = '#'\n  for dr, dc in dirs: dfs(r+dr, c+dc)",
  }, [[733, "Flood Fill", "E"], [200, "Number of Islands", "M"], [695, "Max Area of Island", "M"], [133, "Clone Graph", "M"], [994, "Rotting Oranges", "M"], [417, "Pacific Atlantic Water Flow", "M"], [130, "Surrounded Regions", "M"], [127, "Word Ladder", "H"]]),
  def(20, "Topological Sort", {
    description: "Order nodes of a DAG so every edge points forward.",
    core_idea: "indegree 0 → queue",
    when_to_use: ["Prerequisites", "Build orders", "Cycle detection in directed graphs"],
    recognition_signals: ["\"Course schedule\"", "Dependencies", "\"Order of tasks\""],
    complexity: "O(V + E)",
    common_mistakes: ["Edge direction reversed", "Not checking processed count for cycles"],
    cheat_sheet: "q = [v for v in V if indeg[v] == 0]\nwhile q: v = pop; for u in adj[v]: indeg[u] -= 1; if 0: push",
  }, [[207, "Course Schedule", "M"], [210, "Course Schedule II", "M"], [802, "Find Eventual Safe States", "M"], [310, "Minimum Height Trees", "M"], [2115, "Find All Possible Recipes from Given Supplies", "M"], [329, "Longest Increasing Path in a Matrix", "H"]]),
  def(21, "Union Find", {
    description: "Track connected groups with near-constant-time union and find.",
    core_idea: "find(x) · union(a, b)",
    when_to_use: ["Dynamic connectivity", "Redundant edges", "Grouping equivalences"],
    recognition_signals: ["\"Connected\" / \"provinces\"", "Merge groups", "Detect cycle in undirected graph"],
    complexity: "≈ O(α(n)) per op",
    common_mistakes: ["No path compression", "Forgetting to count components"],
    cheat_sheet: "def find(x):\n  while p[x] != x: p[x] = p[p[x]]; x = p[x]\n  return x",
  }, [[547, "Number of Provinces", "M"], [684, "Redundant Connection", "M"], [990, "Satisfiability of Equality Equations", "M"], [721, "Accounts Merge", "M"], [1319, "Number of Operations to Make Network Connected", "M"], [947, "Most Stones Removed with Same Row or Column", "M"]]),
  def(22, "Shortest Path", {
    description: "Dijkstra, Bellman-Ford and friends for weighted graphs.",
    core_idea: "relax(u → v, w)",
    when_to_use: ["Weighted shortest path", "Limited stops", "Minimum spanning tree"],
    recognition_signals: ["Edge weights / costs", "\"Minimum effort / time\"", "\"Within k stops\""],
    complexity: "O(E log V)",
    common_mistakes: ["Not skipping stale heap entries", "Using BFS on weighted edges"],
    cheat_sheet: "pq = [(0, src)]\nwhile pq:\n  d, u = pop\n  if d > dist[u]: continue\n  for v, w in adj[u]: relax",
  }, [[743, "Network Delay Time", "M"], [787, "Cheapest Flights Within K Stops", "M"], [1631, "Path With Minimum Effort", "M"], [1091, "Shortest Path in Binary Matrix", "M"], [1514, "Path with Maximum Probability", "M"], [1584, "Min Cost to Connect All Points", "M"], [778, "Swim in Rising Water", "H"]]),
  def(23, "Backtracking", {
    description: "Build candidates step by step and undo choices that fail.",
    core_idea: "choose → explore → unchoose",
    when_to_use: ["Generate all combinations", "Constraint puzzles", "Word search on grids"],
    recognition_signals: ["\"All possible\"", "Small n (≤ 20)", "Place items under constraints"],
    complexity: "Exponential",
    common_mistakes: ["Forgetting to undo state", "Appending references instead of copies"],
    cheat_sheet: "def bt(path):\n  if done: res.append(path[:]); return\n  for c in choices:\n    path.append(c); bt(path); path.pop()",
  }, [[46, "Permutations", "M"], [77, "Combinations", "M"], [39, "Combination Sum", "M"], [17, "Letter Combinations of a Phone Number", "M"], [79, "Word Search", "M"], [131, "Palindrome Partitioning", "M"], [51, "N-Queens", "H"], [37, "Sudoku Solver", "H"]]),
  def(24, "Subsets", {
    description: "Enumerate the power set and its variations, handling duplicates.",
    core_idea: "take ✓  /  skip ✗",
    when_to_use: ["Power set", "Combinations with duplicates", "Case permutations"],
    recognition_signals: ["\"All subsets\"", "Input contains duplicates", "Include / exclude decisions"],
    complexity: "O(n · 2ⁿ)",
    common_mistakes: ["Not sorting before skipping duplicates", "Skipping at the wrong depth"],
    cheat_sheet: "for i in range(start, n):\n  if i > start and a[i] == a[i-1]: continue\n  bt(i + 1)",
  }, [[78, "Subsets", "M"], [90, "Subsets II", "M"], [47, "Permutations II", "M"], [40, "Combination Sum II", "M"], [784, "Letter Case Permutation", "M"]]),
  def(25, "Trie", {
    description: "A prefix tree for fast word and prefix lookups.",
    core_idea: "root → c → a → t •",
    when_to_use: ["Prefix search", "Autocomplete", "Many-word grid search"],
    recognition_signals: ["\"Starts with\"", "Dictionary of words", "Wildcard matching"],
    complexity: "O(L) per word",
    common_mistakes: ["Forgetting the end-of-word flag", "Not pruning found words in Word Search II"],
    cheat_sheet: "node = root\nfor ch in word:\n  node = node.children.setdefault(ch, Node())\nnode.end = True",
  }, [[14, "Longest Common Prefix", "E"], [208, "Implement Trie (Prefix Tree)", "M"], [211, "Design Add and Search Words Data Structure", "M"], [648, "Replace Words", "M"], [1268, "Search Suggestions System", "M"], [212, "Word Search II", "H"]]),
  def(26, "Greedy", {
    description: "Make the locally best choice and prove it stays globally optimal.",
    core_idea: "best now → best overall",
    when_to_use: ["Reachability", "Scheduling", "Partitioning with local rules"],
    recognition_signals: ["Sorting unlocks the answer", "\"Minimum number of\"", "Exchange argument works"],
    complexity: "Usually O(n log n)",
    common_mistakes: ["Assuming greedy works without a proof", "Wrong sort key"],
    cheat_sheet: "reach = 0\nfor i, x in enumerate(a):\n  if i > reach: return False\n  reach = max(reach, i + x)",
  }, [[455, "Assign Cookies", "E"], [55, "Jump Game", "M"], [45, "Jump Game II", "M"], [134, "Gas Station", "M"], [846, "Hand of Straights", "M"], [763, "Partition Labels", "M"], [678, "Valid Parenthesis String", "M"], [135, "Candy", "H"]]),
  def(27, "1D Dynamic Programming", {
    description: "Answer depends on a few previous states along one dimension.",
    core_idea: "dp[i] = f(dp[i-1], dp[i-2])",
    when_to_use: ["Counting ways", "Max / min along a sequence", "Choose or skip each item"],
    recognition_signals: ["\"Number of ways\"", "Overlapping subproblems", "Brute force is exponential"],
    complexity: "O(n) time · O(1)–O(n) space",
    common_mistakes: ["Wrong base cases", "Iterating in the wrong order"],
    cheat_sheet: "a, b = base0, base1\nfor i in range(2, n+1): a, b = b, f(a, b)",
  }, [[70, "Climbing Stairs", "E"], [746, "Min Cost Climbing Stairs", "E"], [198, "House Robber", "M"], [213, "House Robber II", "M"], [322, "Coin Change", "M"], [300, "Longest Increasing Subsequence", "M"], [139, "Word Break", "M"], [152, "Maximum Product Subarray", "M"], [91, "Decode Ways", "M"]]),
  def(28, "2D Dynamic Programming", {
    description: "States indexed by two variables — grids, two strings, or item × capacity.",
    core_idea: "dp[i][j] ← dp[i-1][j], dp[i][j-1]",
    when_to_use: ["Grid paths", "Comparing two strings", "Knapsack"],
    recognition_signals: ["Two sequences", "Grid with moves right/down", "Capacity constraint"],
    complexity: "O(n · m)",
    common_mistakes: ["Off-by-one with padded tables", "Wrong loop order in knapsack"],
    cheat_sheet: "for i in 1..n:\n  for j in 1..m:\n    dp[i][j] = a[i-1]==b[j-1] ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1])",
  }, [[62, "Unique Paths", "M"], [64, "Minimum Path Sum", "M"], [1143, "Longest Common Subsequence", "M"], [72, "Edit Distance", "M"], [518, "Coin Change II", "M"], [416, "Partition Equal Subset Sum", "M"], [5, "Longest Palindromic Substring", "M"], [312, "Burst Balloons", "H"], [10, "Regular Expression Matching", "H"]]),
  def(29, "Bit Manipulation", {
    description: "Use XOR, masks and shifts to solve problems at the bit level.",
    core_idea: "a ^ a = 0 · n & (n-1)",
    when_to_use: ["Find the unique element", "Count set bits", "Arithmetic without operators"],
    recognition_signals: ["\"Appears once, others twice\"", "Powers of two", "O(1) space tricks"],
    complexity: "O(n) or O(bits)",
    common_mistakes: ["Signed shifts in JS / Java", "Operator precedence with &"],
    cheat_sheet: "x = 0\nfor n in a: x ^= n\n# n & (n-1) clears lowest set bit",
  }, [[136, "Single Number", "E"], [191, "Number of 1 Bits", "E"], [338, "Counting Bits", "E"], [190, "Reverse Bits", "E"], [371, "Sum of Two Integers", "M"], [137, "Single Number II", "M"], [201, "Bitwise AND of Numbers Range", "M"]]),
  def(30, "Design", {
    description: "Combine data structures into systems with clear APIs and complexity guarantees.",
    core_idea: "hashmap + linked list = O(1)",
    when_to_use: ["Caches", "Custom collections", "Time-indexed stores"],
    recognition_signals: ["\"Design a class\"", "Every op must be O(1)", "Multiple operations to support"],
    complexity: "Per-operation targets",
    common_mistakes: ["Not keeping two structures in sync", "Ignoring edge cases like capacity 0"],
    cheat_sheet: "get: move node to front\nput: insert front; if over cap evict tail",
  }, [[705, "Design HashSet", "E"], [706, "Design HashMap", "E"], [146, "LRU Cache", "M"], [355, "Design Twitter", "M"], [981, "Time Based Key-Value Store", "M"], [622, "Design Circular Queue", "M"], [1396, "Design Underground System", "M"], [460, "LFU Cache", "H"]]),
];

export const allProblems: Problem[] = patterns.flatMap((p) => p.problems);
export const TOTAL_PROBLEMS = allProblems.length;
export const problemById = new Map(allProblems.map((p) => [p.id, p]));
export const patternBySlug = new Map(patterns.map((p) => [p.slug, p]));
export const pad2 = (n: number) => String(n).padStart(2, "0");
