# 📑 Snippets Index

This document lists all built-in snippets, grouped by language and category.

👉 To add your own, use the **Custom** folder (shown in sidebar when creating snippets).

---
## 🔗 Quick Navigation
- [CPP](#🖥️-cpp)
- [JAVA](#🖥️-java)
- [JS](#🖥️-js)
- [PYTHON](#🖥️-python)
- [Custom](#✨-custom)

---

## 🖥️ CPP

<details>
<summary>📂 algorithms/backtracking</summary>

- **Backtracking - Combinations of k elements** — `cppbtcombination`: Combinations of k elements
- **Backtracking - 0/1 Knapsack** — `cppbtknapsack`: 0/1 Knapsack using backtracking
- **Backtracking - N-Queens problem** — `cppbtnqueens`: N-Queens Problem
- **Backtracking - Permutations of an array** — `cppbtpermute`: Permutations of an array
- **Backtracking - All subsets of a set** — `cppbtsubsets`: All subsets of a set
- **Backtracking - Solve Sudoku** — `cppbtsudoku`: Solve Sudoku (Backtracking)

</details>

<details>
<summary>📂 algorithms/bit_manipulation</summary>

- **Bitwise - Check if i-th bit is set** — `cpbitcheck`: Check if i-th bit is set
- **Bitwise - Clear i-th bit** — `cpbitclear`: Clear the i-th bit
- **Bitwise - Count set bits** — `cpbitcount`: Count number of set bits using __builtin_popcount
- **Bitwise - Count set bits (long long)** — `cpbitcountll`: Count set bits for long long
- **Bitwise - Base structure for Bitmask DP** — `cpbitdpbase`: Base structure for Bitmask DP
- **Bitwise - Check Even or Odd** — `cpbiteven`: Check if number is even or odd using bitwise AND
- **Bitwise - Generate subsets using bitmask** — `cpbitgenmask`: Generate all subsets using bitmask
- **Bitwise - Check if power of two** — `cpbitispow2`: Check if number is power of two
- **Bitwise - Get lowest set bit (LSB)** — `cpbitlsb`: Get lowest set bit (LSB)
- **Bitwise - Set i-th bit** — `cpbitset`: Set the i-th bit
- **Bitwise - Toggle i-th bit** — `cpbittoggle`: Toggle the i-th bit
- **Bitwise - Unset LSB** — `cpbitunsetlsb`: Unset lowest set bit
- **Bitwise - XOR from 1 to n** — `cpbitxor1ton`: XOR of 1 to n

</details>

<details>
<summary>📂 algorithms/combinatorics</summary>

- **Combinatorics - Bell Numbers (set partitions)** — `cpcombbell`: Bell numbers (number of ways to partition a set)
- **Combinatorics - nCr % MOD (using factorials)** — `cpcombcombmod`: nCr % MOD using factorials
- **Combinatorics - Derangement D(n)** — `cpcombderangement`: Derangement formula D(n)
- **Combinatorics - Precompute Factorials + Inverses** — `cpcombfactpre`: Precompute factorials and inverse factorials
- **Combinatorics - Modular Inverse (Fermat's Theorem)** — `cpcombmodinv`: Modular inverse using Fermat's Little Theorem
- **Combinatorics - Permutations with Repetition (n^k)** — `cpcombpermrep`: n^k permutations with repetition
- **Combinatorics - Next Permutation (STL)** — `cpcombpermute`: Next permutation using STL
- **Combinatorics - Stars and Bars** — `cpcombstarsbars`: Stars and Bars: ways to split n into k non-negative integers

</details>

<details>
<summary>📂 algorithms/disjoint_set</summary>

- **Union Find - Count connected components** — `cpufcomponents`: Find number of connected components using Union-Find
- **Union Find - Find with path compression** — `cpuffind`: Find with path compression
- **Union Find - Initialize parent and rank** — `cpufinit`: Union-Find Initialization with parent and rank arrays
- **Union Find - Offline queries for dynamic connectivity** — `cpufofflinequeries`: Union-Find offline queries with dynamic connections
- **Union Find - Union by size** — `cpufsize`: Union-Find with union by size
- **Union Find - Union by rank** — `cpufunion`: Union by rank

</details>

<details>
<summary>📂 algorithms/distance</summary>

- **Distance - 0-1 BFS (Deque)** — `cpdist0_1bfs`: 0-1 BFS for graphs with weights 0 or 1
- **Distance - Bellman-Ford Algorithm** — `cpdistbellman`: Bellman-Ford for negative weights
- **Distance - BFS (Unweighted Graph)** — `cpdistbfs`: BFS for shortest path in unweighted graph
- **Distance - Dijkstra's Algorithm (PQ)** — `cpdistdijk`: Dijkstra's shortest path using priority queue
- **Distance - Floyd Warshall (All Pairs)** — `cpdistfw`: Floyd-Warshall for all-pairs shortest paths
- **Distance - BFS on 2D Grid** — `cpdistmatrixbfs`: BFS in a 2D grid with 4 directions
- **Distance - Multi-source BFS** — `cpdistmulti`: Multi-source BFS for shortest distance from multiple nodes
- **Distance - Detect Negative Cycle (Bellman)** — `cpdistnegcycle`: Detect negative cycle using Bellman-Ford
- **Distance - SPFA (Shortest Path Faster Algo)** — `cpdistspfa`: SPFA (Shortest Path Faster Algorithm)

</details>

<details>
<summary>📂 algorithms/dynamic_programming</summary>

- **DP - 1D Bottom-Up** — `cpdp1d`: 1D Bottom-Up DP template
- **DP - 2D Bottom-Up** — `cpdp2d`: 2D Bottom-Up DP template
- **DP - Coin Change (Count Ways)** — `cpdpcoinchange`: Coin Change (number of ways)
- **DP - 0/1 Knapsack (Tabulation)** — `cpdpknapsack01`: 0/1 Knapsack - Tabulation
- **DP - Longest Common Subsequence** — `cpdplcs`: Longest Common Subsequence (LCS)
- **DP - Longest Increasing Subsequence (LIS)** — `cpdplis`: Longest Increasing Subsequence (LIS)
- **DP - Top-Down Memoization** — `cpdpmemo`: Top-Down Memoization template
- **DP - Space Optimized 1D** — `cpdpoptspace`: Space optimized 1D DP
- **DP - Subset Sum** — `cpdpsubsum`: Subset sum problem
- **DP - Tabulation (Fibonacci)** — `cpdptabfib`: Tabulation for Fibonacci

</details>

<details>
<summary>📂 algorithms/game_theory</summary>

- **Game - Grundy Number (Recursive)** — `cpgamegrundy`: Grundy number computation (basic recursive)
- **Game - MEX Calculation** — `cpgamemex`: Calculate mex (minimum excludant) from a set
- **Game - Grundy With Move Options** — `cpgamemoveoptions`: Grundy Number with custom move options
- **Game - Nim XOR** — `cpgamenim`: Nim Game (XOR of all piles)
- **Game - Grundy Table (Bottom-Up)** — `cpgamesgtable`: Grundy Table for multiple positions (bottom-up)
- **Game - Sprague-Grundy XOR Multi-Game** — `cpgamesprague`: Sprague-Grundy Theorem for multi-game
- **Game - Check Winning Position** — `cpgamewinningposition`: Check if position is winning using Grundy number

</details>

<details>
<summary>📂 algorithms/geometry</summary>

- **Geometry - Angle Between Two Vectors** — `cpgeoangle`: Angle between vectors using dot product
- **Geometry - Convex Hull (Monotone Chain)** — `cpgeoconvex`: Convex Hull (Monotone Chain / Andrew’s algorithm)
- **Geometry - Cross Product of 2D Vectors** — `cpgeocross`: Cross product of 2D vectors
- **Geometry - Dot Product of 2D Vectors** — `cpgeodot`: Dot product of 2D vectors
- **Geometry - Check Line Segment Intersection** — `cpgeolineintersect`: Check if two lines intersect (bounding box + orientation)
- **Geometry - Orientation Test (CCW / CW / Colinear)** — `cpgeoorient`: Orientation test (CCW, CW, colinear)
- **Geometry - Distance Between Two Points** — `cpgeopointdist`: Distance between two points (Euclidean)

</details>

<details>
<summary>📂 algorithms/graph</summary>

- **Graph - BFS Traversal** — `cpgraphbfs`: Standard BFS traversal
- **Graph - BFS for Shortest Distances** — `cpgraphbfsdist`: BFS to compute shortest distances in unweighted graph
- **Graph - Count Connected Components** — `cpgraphcomp`: DFS to count connected components
- **Graph - Cycle Detection (BFS, Undirected)** — `cpgraphcyclebfs`: Detect cycle using BFS (undirected)
- **Graph - Cycle Detection (DFS, Undirected)** — `cpgraphcycleundirected`: Detect cycle in undirected graph using DFS
- **Graph - DFS Recursive Traversal** — `cpgraphdfs`: Standard DFS traversal
- **Graph - DFS Iterative Traversal (Stack)** — `cpgraphdfsstack`: Iterative DFS using stack
- **Graph - Topological Sort (DFS)** — `cpgraphtoposort`: Topological sort using DFS

</details>

<details>
<summary>📂 algorithms/greedy</summary>

- **Greedy - Activity Selection (End Time Based)** — `cppgreactivity`: Activity Selection Problem (end time based)
- **Greedy - Fractional Knapsack** — `cppgrefractionalknapsack`: Fractional Knapsack using Greedy
- **Greedy - Huffman Encoding (Min Cost Merge)** — `cppgrehuff`: Huffman Encoding (Greedy)
- **Greedy - Merge Overlapping Intervals** — `cppgreintervalmerge`: Merge Overlapping Intervals
- **Greedy - Job Sequencing Problem** — `cppgrejobseq`: Job Sequencing Problem
- **Greedy - Max Chain Length (Pairs)** — `cppgremaxchain`: Maximum Length Chain of Pairs
- **Greedy - Minimum Coins (Canonical Denominations)** — `cppgremincoin`: Min Coins (Greedy, works for canonical denominations)

</details>

<details>
<summary>📂 algorithms/minimum_spanning_tree</summary>

- **Check Cycle Before Adding Edge (Kruskal)** — `cpmstcheckcycle`: Check cycle before adding edge (Kruskal)
- **Kruskal Algorithm using Union-Find** — `cpmstkruskal`: Kruskal's Algorithm using Union-Find
- **Prim's Algorithm using Priority Queue** — `cpmstprim`: Prim's Algorithm using Priority Queue
- **Store MST Edges in Kruskal** — `cpmststore`: Store MST edges in Kruskal

</details>

<details>
<summary>📂 algorithms/miscellaneous</summary>

- **Count Set Bits** — `cpmisbitcount`: Count number of set bits in integer
- **Ceil Division** — `cpmisceildiv`: Ceil division of two integers
- **Leading and Trailing Zeros** — `cpmisclzctz`: Count leading/trailing zeros
- **Fast Modular Exponentiation** — `cpmisfastpow`: Fast modular exponentiation
- **Floor of Log2** — `cpmislog2floor`: Compute floor(log2(x))
- **Least Significant Bit** — `cpmislsb`: Get least significant bit
- **Modular Multiplication (64-bit safe)** — `cpmismodmul`: Modular Multiplication without overflow (64-bit safe)
- **Next Permutation (Lexicographically)** — `cpmisnextperm`: Next permutation (lexicographically)
- **Random Number in Range** — `cpmisrandrange`: Generate random number in range [l, r]
- **Reverse Bits of 32-bit Integer** — `cpmisreversebits`: Reverse bits of a 32-bit integer
- **Benchmark Code Execution Time** — `cpmistimefn`: Timer utility for benchmarking functions
- **Generate Unique ID Using __COUNTER__** — `cpmisuniqid`: Generate unique ID/hash using __COUNTER__

</details>

<details>
<summary>📂 algorithms/number_theory</summary>

- **Chinese Remainder Theorem (CRT)** — `cpnumcrt`: Chinese Remainder Theorem
- **Extended Euclidean Algorithm** — `cpnumextgcd`: Extended Euclidean Algorithm
- **Prime Factorization using SPF** — `cpnumfactorize`: Prime factorization using SPF
- **GCD (Euclidean Algorithm)** — `cpnumgcd`: Calculate GCD using Euclidean Algorithm
- **LCM (via Euclidean GCD)** — `cpnumlcm`: Calculate LCM using Euclidean GCD (self-contained)
- **Modular Exponentiation (iterative)** — `cpnummodexp`: Modular exponentiation (iterative)
- **Modular Inverse (Extended Euclidean)** — `cpnummodinv`: Modular inverse using Extended Euclidean
- **Precompute Modular Inverses (1 to n)** — `cpnummodinvrange`: Precompute modular inverses from 1 to n
- **Euler's Totient Function (phi)** — `cpnumphi`: Euler's Totient Function (phi)
- **Sieve with Smallest Prime Factor (SPF)** — `cpnumspf`: Sieve of Eratosthenes with SPF (smallest prime factor)

</details>

<details>
<summary>📂 algorithms/prefix_sum</summary>

- **1D Prefix Sum Array** — `cppre1d`: 1D Prefix Sum Array
- **1D Range Sum Query** — `cppre1dq`: 1D Range Sum Query using Prefix Sum
- **2D Prefix Sum Array** — `cppre2d`: 2D Prefix Sum Array
- **2D Range Sum Query** — `cppre2dq`: 2D Range Sum Query using Prefix Sum
- **Prefix XOR Array** — `cpprebit`: Prefix XOR Array
- **Range XOR Query** — `cpprebitq`: Range XOR Query using Prefix XOR

</details>

<details>
<summary>📂 algorithms/recursion</summary>

- **Basic Recursion Template** — `cprecbase`: Basic recursive function template
- **Generate Binary Strings** — `cprecbinstr`: Generate all binary strings of length n
- **Generate Combinations** — `cpreccomb`: Generate combinations
- **Recursive Factorial** — `cprecfact`: Factorial using recursion
- **Recursive Fibonacci** — `cprecfib`: Fibonacci using recursion
- **Recursion with Global Value** — `cprecglobal`: Recursion with global max/min
- **Generate Permutations** — `cprecperm`: Generate permutations
- **Recursive Linear Search** — `cprecsearch`: Recursive linear search
- **Reverse String Recursively** — `cprecstringrev`: Reverse a string using recursion
- **Generate Subsets** — `cprecsubsets`: Generate all subsets

</details>

<details>
<summary>📂 algorithms/searching</summary>

- **Binary Search on Sorted Array** — `cpbin`: Classic Binary Search on sorted array
- **First Occurrence in Sorted Array** — `cpbinfirst`: Find first occurrence of a value
- **Binary Search for Kth Value (Custom Condition)** — `cpbinkth`: Binary search to find K-th smallest (in custom conditions)
- **Last Occurrence in Sorted Array** — `cpbinlast`: Find last occurrence of a value
- **Lower Bound Binary Search** — `cpbinlb`: Lower Bound using Binary Search
- **Binary Search Integer Square Root** — `cpbinsqrt`: Binary search for square root (integer part)
- **Upper Bound Binary Search** — `cpbinub`: Upper Bound using Binary Search
- **Binary Search in Rotated Sorted Array** — `cprotsrch`: Search in rotated sorted array

</details>

<details>
<summary>📂 algorithms/segment_tree</summary>

- **Build Segment Tree (Recursive)** — `cpsegbuild`: Build Segment Tree (Recursive)
- **Iterative Segment Tree (Build + Query + Update)** — `cpsegiter`: Iterative Segment Tree (Build + Query + Update)
- **Segment Tree with Lazy Propagation** — `cpseglazy`: Segment Tree with Lazy Propagation (Range Update + Query)
- **Generic Merge Segment Tree** — `cpsegmerge`: Generic Merge Segment Tree (custom merge function)
- **Range Query on Segment Tree (Recursive)** — `cpsegquery`: Range Query on Segment Tree (Recursive)
- **Point Update on Segment Tree (Recursive)** — `cpsegupdate`: Point Update on Segment Tree (Recursive)

</details>

<details>
<summary>📂 algorithms/sliding_window</summary>

- **Fixed-size Sliding Window Sum** — `cppswfix`: Fixed-size Sliding Window Sum
- **Sliding Window Frequency Counter** — `cppswfreq`: Sliding Window Frequency Counter (for maps)
- **Max in Sliding Window using Deque** — `cppswmaxdq`: Max in Sliding Window using Deque
- **Min in Sliding Window using Deque** — `cppswmin`: Minimum in Sliding Window using Deque
- **Minimum Length Subarray with Sum ≥ Target** — `cppswminlen`: Minimum length subarray with sum ≥ target

</details>

<details>
<summary>📂 algorithms/sorting</summary>

- **Counting Sort for Integers** — `cpcountsort`: Counting sort for small integer range
- **Merge Sort (Recursive)** — `cpmergesort`: Recursive Merge Sort (vector)
- **Quick Sort (Recursive)** — `cpquicksort`: Recursive Quick Sort (vector)
- **Custom Comparator Sort** — `cpsortcustom`: Sort with custom comparator function
- **Sort Vector Descending** — `cpsortdesc`: Sort a vector in descending order using greater<>
- **Sort Pairs by First Element** — `cpsortpairfirst`: Sort vector of pairs by first element (ascending)
- **Sort Pairs by Second Element** — `cpsortpairsecond`: Sort vector of pairs by second element
- **Sort String Characters** — `cpsortstring`: Sort characters in string
- **Sort Vector Ascending** — `cpsortvec`: Sort a vector in ascending order using std::sort
- **Sort Vector of Vectors by Index** — `cpsortvecvec`: Sort vector of vectors by specific index
- **Stable Sort with Comparator** — `cpstablesort`: Stable sort with custom comparator

</details>

<details>
<summary>📂 algorithms/suffix_sum</summary>

- **1D Suffix Sum Array** — `cppsuf1d`: 1D Suffix Sum Array
- **1D Suffix Sum Query** — `cppsuf1dq`: 1D Range Sum Query using Suffix Sum
- **2D Suffix Sum Matrix** — `cppsuf2d`: 2D Suffix Sum Matrix

</details>

<details>
<summary>📂 algorithms/trie</summary>

- **Basic TrieNode class definition** — `cptrieclass`: Basic TrieNode class definition
- **TrieNode with prefix count (structure only)** — `cptriecountprefix`: Trie with prefix count (structure only)
- **Delete word from Trie (recursive)** — `cptriedelete`: Delete word from Trie (recursive)
- **Erase word from Trie with prefix count** — `cptrieerasecount`: Erase from Trie with prefix count
- **Insert word into Trie** — `cptrieinsert`: Insert word into Trie
- **Insert word into Trie with prefix count** — `cptrieinsertcount`: Insert into Trie with prefix count
- **Search word in Trie** — `cptriesearch`: Search word in Trie
- **Check prefix exists in Trie** — `cptriestarts`: Prefix startsWith check in Trie

</details>

<details>
<summary>📂 algorithms/two_pointer</summary>

- **Two Pointer - At Most K Unique Elements** — `cpptpkuniq`: Longest subarray with at most k unique elements
- **Two Pointer - Check Palindrome in String** — `cpptppal`: Check if string is palindrome using two pointers
- **Two Pointer - Target Sum in Sorted Array** — `cpptpsum`: Two Pointer on Sorted Array to Find Pair with Target Sum
- **Two Pointer - Standard Template** — `cpptptemplate`: Standard Two Pointer Template

</details>

<details>
<summary>📂 custom/custom</summary>

- **test** — `cptest`: just testing

</details>

<details>
<summary>📂 data_structures/bit</summary>

- **Check if any bit is set** — `cpbitany`: Check if any bit is set
- **Count number of 1s in bitset** — `cpbitcount`: Count number of 1s in bitset
- **Define bitset of size n** — `cpbitdef`: Define bitset of size n
- **Reset bits in bitset** — `cpbitres`: Reset bits in bitset
- **Set bits in bitset** — `cpbitset`: Set bits in bitset
- **Test bit in bitset** — `cpbittest`: Test bit in bitset

</details>

<details>
<summary>📂 data_structures/comparator</summary>

- **sortVectorInDescendingOrder** — `cpcompdesc`: Sort vector<int> in descending order
- **sortUsingLambdaComparator** — `cpcomplambda`: Sort using lambda comparator
- **setWithLambdaComparator** — `cpcomplambdaset`: Set with lambda comparator
- **multisetWithCustomComparator** — `cpcompmset`: Multiset with custom comparator
- **setWithCustomComparator** — `cpcompset`: Set with custom comparator
- **setOfStructsWithCustomOperator** — `cpcompstruct`: Set of structs with custom operator<

</details>

<details>
<summary>📂 data_structures/graph</summary>

- **addEdgeUndirectedGraph** — `cpgradd`: Add edge to undirected graph
- **addEdgeDirectedGraph** — `cpgraddd`: Add edge to directed graph
- **adjacencyListGraph** — `cpgradj`: Adjacency list representation of graph
- **bfsTraversalGraph** — `cpgrbfs`: BFS traversal of graph
- **dfsTraversalGraph** — `cpgrdfs`: DFS traversal of graph

</details>

<details>
<summary>📂 data_structures/linear_ds</summary>

- **Deque front and back access** — `cpdeqaccess`: Access front/back in deque
- **Initialize deque** — `cpdeqinit`: Initialize a deque
- **Deque not empty check** — `cpdeqnempty`: Check if deque is not empty
- **Deque push and pop** — `cpdeqops`: Push/pop front and back in deque
- **Initialize queue** — `cpqueinit`: Initialize a queue
- **Queue not empty check** — `cpquenempty`: Check if queue is not empty
- **Queue push and pop** — `cpquepop`: Push and pop in queue
- **Queue front and back access** — `cpquetop`: Access front and back of queue
- **Initialize stack** — `cpstkinit`: Initialize a stack
- **Stack not empty check** — `cpstknempty`: Check if stack is not empty
- **Stack push and pop** — `cpstkpq`: Push and pop from stack
- **Stack top access** — `cpstktop`: Access top element of stack

</details>

<details>
<summary>📂 data_structures/linked_list</summary>

- **Insert at beginning of linked list** — `cpllinsert`: Insert at beginning of linked list
- **Print all nodes in linked list** — `cpllprint`: Print all nodes in linked list
- **Singly Linked List Node Structure** — `cpllstruct`: Singly Linked List Node Structure

</details>

<details>
<summary>📂 data_structures/map</summary>

- **Check if key exists using count** — `cpmapcount`: Check if key exists using count
- **Erase key from map** — `cpmaperase`: Erase key from map
- **Find element in map and check if it exists** — `cpmapfind`: Find element in map and check if it exists
- **Initialize map with key-value pairs** — `cpmapinit`: Initialize map with key-value pairs
- **Iterate through a map** — `cpmapiterate`: Iterate through a map
- **Insert and iterate multimap** — `cpmmultimap`: Insert and iterate multimap
- **Unordered_map with custom hash for better performance** — `cpumapcustomhash`: Unordered_map with custom hash for better performance
- **Frequency map using unordered_map** — `cpumapfreq`: Frequency map using unordered_map
- **Initialize unordered_map with key-value pairs** — `cpumapinit`: Initialize unordered_map with key-value pairs

</details>

<details>
<summary>📂 data_structures/pair</summary>

- **Declare and use a pair** — `cppair`: Declare and use a pair
- **Declare and use a tuple** — `cptuple`: Declare and use a tuple

</details>

<details>
<summary>📂 data_structures/priority_queue</summary>

- **Loop over all elements in priority_queue** — `cppqloop`: Loop over all elements in priority_queue
- **Max heap using priority_queue** — `cppqmax`: Max heap using priority_queue
- **Min heap using priority_queue** — `cppqmin`: Min heap using priority_queue
- **Custom comparator for priority_queue (min-heap)** — `cppqpcomp`: Custom comparator for priority_queue (min-heap)
- **Pop top element from priority_queue** — `cppqpop`: Pop top element from priority_queue
- **Custom comparator with struct for objects** — `cppqpstruct`: Custom comparator with struct for objects
- **Push element into priority_queue** — `cppqpush`: Push element into priority_queue
- **Access top element of priority_queue** — `cppqtop`: Access top element of priority_queue

</details>

<details>
<summary>📂 data_structures/set</summary>

- **Count frequency in multiset** — `cpmscount`: Count frequency in multiset
- **Delete one occurrence from multiset** — `cpmsdelone`: Delete one occurrence from multiset
- **Use multiset to store duplicates** — `cpmultiset`: Use multiset to store duplicates
- **Check if value exists in set** — `cpsetcheck`: Check if value exists in set
- **Erase value from set** — `cpseterase`: Erase value from set
- **Initialize a set and insert elements** — `cpsetinit`: Initialize a set and insert elements
- **Iterate through a set** — `cpsetiterate`: Iterate through a set
- **Unordered_set with custom hash for better performance** — `cpusetcustomhash`: Unordered_set with custom hash for better performance
- **Create unordered_set to remove duplicates** — `cpusetfreq`: Create unordered_set to remove duplicates
- **Initialize unordered_set and insert** — `cpusetinit`: Initialize unordered_set and insert

</details>

<details>
<summary>📂 data_structures/string</summary>

- **Append to a string** — `cpstrappend`: Append to a string
- **Access characters in a string** — `cpstrchar`: Access characters in a string
- **Input a string using cin** — `cpstrcin`: Input a string using cin
- **Compare two strings** — `cpstrcomp`: Compare two strings
- **Find substring in string** — `cpstrfind`: Find substring in string
- **Input a line with spaces using getline** — `cpstrgetline`: Input a line with spaces using getline
- **Initialize a string** — `cpstrinit`: Initialize a string
- **Check if character is alphabetic** — `cpstrisalpha`: Check if character is alphabetic
- **Check if character is digit** — `cpstrisdigit`: Check if character is digit
- **Reverse a string** — `cpstrreverse`: Reverse a string
- **Get length of a string** — `cpstrsize`: Get length of a string
- **Sort characters in a string** — `cpstrsort`: Sort characters in a string
- **Convert entire string to lowercase** — `cpstrtolower`: Convert entire string to lowercase
- **Convert entire string to uppercase** — `cpstrtoupper`: Convert entire string to uppercase
- **Extract substring** — `cpsubstr`: Extract substring

</details>

<details>
<summary>📂 data_structures/tree</summary>

- **DFS traversal of tree** — `cptrdfs`: DFS traversal of tree
- **Convert unrooted tree to rooted** — `cptrrooted`: Convert unrooted tree to rooted
- **Subtree size calculation** — `cptrsize`: Subtree size calculation

</details>

<details>
<summary>📂 data_structures/vector</summary>

- **2D vector declaration and initialization** — `cpvec2d`: Declare and initialize 2D vector
- **2D vector input** — `cpvec2dinput`: Input for 2D vector
- **Binary search on sorted vector** — `cpvecbinarysearch`: Binary search on sorted vector
- **Find element using std::find** — `cpvecfind`: Find element using std::find
- **Range-based for loop over vector** — `cpvecforeach`: Range-based for loop over vector
- **Initialize vector of size n** — `cpvecinit`: Initialize a vector of size n
- **Input vector of n integers** — `cpvecinput`: Input a vector of n integers
- **Lower bound in sorted vector** — `cpveclowerbound`: Lower bound index in sorted vector
- **Prefix sum of vector** — `cpvecprefixsum`: Prefix sum of vector
- **Print vector elements** — `cpvecprint`: Print all elements of a vector
- **Resize vector with default value** — `cpvecresize`: Resize vector to size n with default value
- **Sort vector ascending** — `cpvecsortasc`: Sort vector in ascending order
- **Sort vector descending** — `cpvecsortdesc`: Sort vector in descending order
- **Remove duplicates from sorted vector** — `cpvecunique`: Remove duplicates from sorted vector
- **Upper bound in sorted vector** — `cpvecupperbound`: Upper bound index in sorted vector

</details>

<details>
<summary>📂 misc/basics</summary>

- **Input 2D Array** — `cp2din`: Input 2D array
- **Output 2D Array** — `cp2dout`: Print 2D array
- **Input Array** — `cparrayin`: Input integer array
- **Output Array** — `cparrayout`: Print array space-separated
- **Define Constants** — `cpconst`: Useful constants
- **Debug Print** — `cpdbg`: Print variable with label (debug)
- **Fast IO** — `cpfastio`: Setup fast IO for competitive programming
- **For Loop** — `cpfor`: Standard for loop
- **Input Integer** — `cpintin`: Input a single integer
- **Input Multiple Integers** — `cpints`: Input multiple integers
- **Main Function** — `cpmain`: Basic main function with return 0
- **Define Pair** — `cppair`: Define pair and take input
- **While Loop** — `cpwhile`: Standard while loop
- **Print Yes/No** — `cpyn`: Print Yes or No based on boolean

</details>


## 🖥️ JAVA

<details>
<summary>📂 misc/java</summary>

*(No snippets in this category)*

</details>


## 🖥️ JS

<details>
<summary>📂 misc/js</summary>

*(No snippets in this category)*

</details>


## 🖥️ PYTHON

<details>
<summary>📂 misc/py</summary>

*(No snippets in this category)*

</details>

---

## ✨ Custom

The **Custom** folder is reserved for user-created snippets.
These are not listed here since they vary per user.
