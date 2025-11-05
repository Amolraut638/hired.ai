// components/DsaProblems.jsx
import { ChevronDown, ChevronRight } from "lucide-react";
import DsaQuestions from "../assets/DsaQuestions";
import React, { useState } from "react";
import LeetCode_logo_black from '../assets/LeetCode_logo_black.png'
import GG_Logo from '../assets/GG_Logo.png'

const platformLogos = {
    leetcode: LeetCode_logo_black,
    gfg: GG_Logo,
}

const getAllProblems = (problemsObj) =>
    Object.values(problemsObj).flatMap((subcats) =>
        Object.values(subcats).flat()
    );

const allProblems = getAllProblems(DsaQuestions);
const totalQuestionCount = allProblems.length;

const DsaProblems = () => {
    const [problems, setProblems] = useState(DsaQuestions);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [stats, setStats] = useState({
        total: totalQuestionCount,
        solved: 0,
    });

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
        setProblems((prevProblems) => {
            const updated = { ...prevProblems };
            updated[category][subCategory] = updated[category][subCategory].map(
                (problem) =>
                    problem._id === problemId
                        ? {
                            ...problem,
                            userStatus:
                                problem.userStatus === "Solved" ? "Unsolved" : "Solved",
                        }
                        : problem
            );

            const solvedCount = Object.values(updated)
                .flatMap((sub) => Object.values(sub).flat())
                .filter((p) => p.userStatus === "Solved").length;

            setStats((prev) => ({ ...prev, solved: solvedCount }));

            return updated;
        });
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case "Easy":
                return "bg-green-100 text-green-600 border border-green-600";
            case "Medium":
                return "bg-yellow-100 text-yellow-600 border border-yellow-600";
            case "Hard":
                return "bg-red-100 text-red-600 border border-red-600";
            default:
                return "";
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-16 lg:px-24 xl:px-40 ">
            {/* Stats Header */}
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl md:text-5xl text-center mt-10 font-medium">
                    <span className="text-purple-600 font-semibold">DSA</span> Practice Sheet
                </h1>
                <div className="text-lg font-medium flex gap-6 items-center justify-center mt-5">
                    <div>
                        <span>Total:</span> {stats.total}
                    </div>
                    <div>
                        <span>Solved:</span> {stats.solved}
                    </div>
                    <div>
                        <span>Progress:</span>{" "}
                        {stats.total ? ((stats.solved / stats.total) * 100).toFixed(1) : 0}%
                    </div>
                </div>
            </div>

            {/* Problems List */}
            <div className="space-y-3 rounded-2xl rounded-t-2xl">
                {Object.entries(problems).map(([category, subCategories]) => (
                    <div key={category} className="border-none">
                        {/* Category Header */}
                        <div
                            className="flex items-center cursor-pointer p-3 bg-purple-100 rounded-xl hover:bg-purple-300 transition "
                            onClick={() => toggleCategory(category)}
                        >
                            {expandedCategories[category] ? (
                                <ChevronDown className="mr-2 text-purple-600" />
                            ) : (
                                <ChevronRight className="mr-2 text-purple-600" />
                            )}
                            <h2 className="font-semibold text-lg text-gray-800">{category}</h2>
                        </div>

                        {/* Subcategories */}
                        {expandedCategories[category] &&
                            Object.entries(subCategories).map(
                                ([subCategory, problemsList]) => (
                                    <div key={subCategory} className="border-t">
                                        <div
                                            className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition"
                                            onClick={() => toggleSubCategory(category, subCategory)}
                                        >
                                            <div className="flex items-center">
                                                {expandedCategories[`${category}-${subCategory}`] ? (
                                                    <ChevronDown className="mr-2 text-purple-600" />
                                                ) : (
                                                    <ChevronRight className="mr-2 text-purple-600" />
                                                )}
                                                <h3 className="font-medium text-gray-700">{subCategory}</h3>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {problemsList.filter((p) => p.userStatus === "Solved").length}/
                                                {problemsList.length}
                                            </span>
                                        </div>

                                        {/* Problems Table */}
                                        {expandedCategories[`${category}-${subCategory}`] && (
                                            <div className="divide-y">
                                                {/* Table Header */}
                                                <div className="flex bg-gray-200 p-2 font-semibold text-sm text-gray-700">
                                                    <div className="w-11"></div>
                                                    <div className="flex-1">Problem</div>
                                                    <div className="w-28">Difficulty</div>
                                                    <div className="w-17">Practice</div>
                                                </div>

                                                {/* Table Rows */}
                                                {problemsList.map((problem) => (
                                                    <div
                                                        key={problem._id}
                                                        className={`flex items-center p-3 transition rounded-md ${problem.userStatus === "Solved"
                                                            ? "bg-purple-50"
                                                            : "hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        <div className="w-10">
                                                            <input
                                                                type="checkbox"
                                                                checked={problem.userStatus === "Solved"}
                                                                onChange={() =>
                                                                    handleToggleProblem(category, subCategory, problem._id)
                                                                }
                                                                className="h-4 w-4 transition-shadow duration-200 rounded-lg hover:shadow-[0_4px_6px_-1px_rgba(91,33,182,0.5)] inline-block border-gray-300 cursor-pointer accent-purple-600"
                                                            />
                                                        </div>

                                                        <div className="flex-1 flex flex-col text-gray-800">
                                                            <span>{problem.title}</span>
                                                        </div>
                                                        <div className="w-50 flex items-center justify-center">
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyClass(
                                                                    problem.difficulty
                                                                )}`}
                                                            >
                                                                {problem.difficulty}
                                                            </span>
                                                        </div>
                                                        <div className="w-12 flex items-center justify-center">
                                                            {problem.link ? (
                                                                <a
                                                                    href={problem.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-purple-600 hover:text-purple-800"
                                                                >
                                                                    {platformLogos[problem.platform] ? (
                                                                        <img
                                                                            src={platformLogos[problem.platform]}
                                                                            alt={problem.platform}
                                                                            className="w-6 h-6"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-sm text-gray-500">N/A</span>
                                                                    )}
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">Coming Soon</span>
                                                            )}
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DsaProblems;
