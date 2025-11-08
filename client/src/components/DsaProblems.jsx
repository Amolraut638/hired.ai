import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import DsaQuestions from "../assets/DsaQuestions";
import LeetCode_logo_black from "../assets/LeetCode_logo_black.png";
import GG_Logo from "../assets/GG_Logo.png";

const platformLogos = {
  leetcode: LeetCode_logo_black,
  gfg: GG_Logo,
};

const getAllProblems = (problemsObj) =>
  Object.values(problemsObj).flatMap((subcats) =>
    Object.values(subcats).flat()
  );

const allProblems = getAllProblems(DsaQuestions);
const totalQuestionCount = allProblems.length;

const DsaProblems = () => {
  const [problems, setProblems] = useState(DsaQuestions);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [stats, setStats] = useState({ total: totalQuestionCount, solved: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  // Load solved state from localStorage
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("dsaProgress")) || {};
    if (Object.keys(savedProgress).length > 0) {
      setProblems(savedProgress);
      updateStats(savedProgress);
    }
  }, []);

  // Save solved progress to localStorage
  useEffect(() => {
    localStorage.setItem("dsaProgress", JSON.stringify(problems));
  }, [problems]);

  const updateStats = (problemsData) => {
    const solvedCount = Object.values(problemsData)
      .flatMap((sub) => Object.values(sub).flat())
      .filter((p) => p.userStatus === "Solved").length;
    setStats((prev) => ({ ...prev, solved: solvedCount }));
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleSubCategory = (category, subCategory) => {
    const key = `${category}-${subCategory}`;
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleProblem = (category, subCategory, problemId) => {
    setProblems((prev) => {
      const updated = { ...prev };
      updated[category][subCategory] = updated[category][subCategory].map(
        (p) =>
          p._id === problemId
            ? { ...p, userStatus: p.userStatus === "Solved" ? "Unsolved" : "Solved" }
            : p
      );
      updateStats(updated);
      return updated;
    });
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border border-green-500";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-500";
      case "Hard":
        return "bg-red-100 text-red-700 border border-red-500";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  // Filtering
  const matchesFilter = (problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      filterDifficulty === "All" || problem.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-16 lg:px-24 xl:px-40 pb-20">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 mt-10">
        <h1 className="text-4xl md:text-5xl font-semibold text-center">
          <span className="text-purple-600 font-bold">DSA</span> Practice Tracker
        </h1>

        <div className="flex flex-wrap gap-6 text-lg font-medium mt-6 justify-center">
          <span>Total: {stats.total}</span>
          <span>Solved: {stats.solved}</span>
          <span>
            Progress:{" "}
            {stats.total ? ((stats.solved / stats.total) * 100).toFixed(1) : 0}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-3 mt-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all"
            style={{
              width: `${(stats.solved / stats.total) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {Object.entries(problems).map(([category, subCats]) => (
          <div key={category}>
            {/* Category Header */}
            <div
              className="flex items-center cursor-pointer bg-purple-100 hover:bg-purple-200 p-3 rounded-xl transition"
              onClick={() => toggleCategory(category)}
            >
              {expandedCategories[category] ? (
                <ChevronDown className="mr-2 text-purple-600" />
              ) : (
                <ChevronRight className="mr-2 text-purple-600" />
              )}
              <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
            </div>

            {/* Subcategories */}
            {expandedCategories[category] &&
              Object.entries(subCats).map(([sub, problemsList]) => {
                const filtered = problemsList.filter(matchesFilter);
                if (filtered.length === 0) return null;
                const solvedCount = filtered.filter(
                  (p) => p.userStatus === "Solved"
                ).length;

                return (
                  <div key={sub} className="ml-4 mt-2">
                    <div
                      className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg cursor-pointer transition"
                      onClick={() => toggleSubCategory(category, sub)}
                    >
                      <div className="flex items-center">
                        {expandedCategories[`${category}-${sub}`] ? (
                          <ChevronDown className="mr-2 text-purple-600" />
                        ) : (
                          <ChevronRight className="mr-2 text-purple-600" />
                        )}
                        <h3 className="font-medium text-gray-800">{sub}</h3>
                      </div>

                      {/* Progress bar per subcategory */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {solvedCount}/{filtered.length}
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 transition-all"
                            style={{
                              width: `${(solvedCount / filtered.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Problems */}
                    {expandedCategories[`${category}-${sub}`] && (
                      <div className="divide-y border-l-2 border-purple-200 ml-4 mt-2">
                        {filtered.map((p) => (
                          <div
                            key={p._id}
                            className={`flex items-center justify-between p-3 text-sm transition ${
                              p.userStatus === "Solved"
                                ? "bg-purple-50 border-l-4 border-purple-400"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={p.userStatus === "Solved"}
                                onChange={() =>
                                  handleToggleProblem(category, sub, p._id)
                                }
                                className="accent-purple-600 h-4 w-4 rounded cursor-pointer"
                              />
                              <span className="text-gray-800">{p.title}</span>
                            </div>

                            <div className="flex items-center gap-4">
                              <span
                                className={`px-2 py-0.5 rounded-md text-xs font-medium ${getDifficultyClass(
                                  p.difficulty
                                )}`}
                              >
                                {p.difficulty}
                              </span>

                              {p.link ? (
                                <a
                                  href={p.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:scale-110 transition-transform"
                                >
                                  {platformLogos[p.platform] ? (
                                    <img
                                      src={platformLogos[p.platform]}
                                      alt={p.platform}
                                      className="w-6 h-6"
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-500">N/A</span>
                                  )}
                                </a>
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DsaProblems;
