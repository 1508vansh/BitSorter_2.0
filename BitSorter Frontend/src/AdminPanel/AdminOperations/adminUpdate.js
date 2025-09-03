import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { useParams } from "react-router";
import Loader from "../../Ui/Loader";

// Enum arrays for dropdowns and autocomplete
const difficulties = ["beginner", "easy", "medium", "hard"];
const tagsOptions = [
  "Arrays", "String", "LinkedList", "Graph", "Tree", "Sorting", "Searching", "DP", "Recursion"
];
const languages = ["C++", "Java", "JavaScript"]; // Add more languages as you like

export default function AdminUpdate() {

  //destruct id as problemId...
  const {id:problemId} = useParams();
  const [isUpdating,setIsUpdating] = useState();
  useEffect(()=>{
     const getData = async()=>{
        try{
           const response = await axiosClient.get(`/problem/getProblem/${problemId}`);
           setForm(response?.data);
           console.log("This is update data res ",response?.data);
        }catch(err){
            alert("Server Error!");
        }
     }
     getData();
  },[])
 // Suppose `existingProblem` is the current problem details fetched already
const [form, setForm] = useState({
  // fallback default values if none provided
  title: "",
  description: "",
  difficulty: "",
  tags: "",
  visibleTestCases: [{ input: "", output: "", explanation: "" }],
  hiddenTestCases: [{ input: "", output: "", explanation: "" }],
  referenceSolution: [{ language: "", completeCode: "" }],
  startCode: [{ language: "", initialCode: "" }],
});

// Rest of form handlers remain unchanged


  // Generic input change handler for simple fields (title, description, difficulty)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Special change handler for tags, since tags allows multiple selection
    const handleTagChange = (e) => {
    // Grab all selected options as an array of values
    const options = e.target.value;
    setForm((prev) => ({ ...prev, tags: options }));
  };

  // Handles edits to a visible/hidden test case field
  // - which: "visibleTestCases" or "hiddenTestCases"
  // - idx: the test case array index
  // - e: the synthetic event from the input
  const handleTestCaseChange = (which, idx, e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = prev[which].slice();       // Clone the correct test cases array
      updated[idx][name] = value;                // Update the correct field (input/output/explanation)
      return { ...prev, [which]: updated };      // Store the new array in the form state
    });
  };

  // Adds a new empty test case to the selected test case array
  const addTestCase = (which) => {
    setForm((prev) => ({
      ...prev,
      [which]: [...prev[which], { input: "", output: "", explanation: "" }]
    }));
  };

  // Handles field changes for code/language objects (both reference and starter code)
  // - which: "referenceSolution" or "startCode"
  // - idx: array index
  // - e: event
  const handleSolutionChange = (which, idx, e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = prev[which].slice();        // Clone the appropriate array
      updated[idx][name] = value;                 // Update the correct property
      return { ...prev, [which]: updated };       // Store it back in the state
    });
  };

  // Adds an empty code/language object to either referenceSolution or startCode
  const addSolution = (which) => {
    setForm((prev) => ({
      ...prev,
      [which]: [
        ...prev[which],
        which === "referenceSolution"
          ? { language: "", completeCode: "" }
          : { language: "", initialCode: "" }
      ],
    }));
  };

  // Handles the form submission; replace with API integration as needed
  const handleSubmit = async(e) => {
    e.preventDefault();

     try{
      const response = await axiosClient.put(`/problem/update/${problemId}`,{...form});
      alert("Problem updated successfully!");
      console.log("Problem creation status ",response?.data);
    }catch(err){
       console.error(err);
       alert("Error updating problem. Please try again.");
    }
    // For demo: Log form state to console
    console.log(form);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input type="text" name="title" value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required />
        </div>
        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" rows={4} value={form.description}
            onChange={handleChange} required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        {/* Difficulty (single select) */}
        <div>
          <label className="block font-semibold mb-1">Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select difficulty</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {/* Tags (multi-select) */}
        <div>
          <label className="block font-semibold mb-1">Tags</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.tags}
            onChange={handleTagChange}
            name="tags"
          >
            {tagsOptions.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <span className="text-xs text-gray-500">Hold Ctrl (Cmd) to select multiple</span>
        </div>
        {/* Visible Test Cases (dynamic array) */}
        <div>
          <label className="block font-semibold mb-1">Visible Testcases</label>
          {form?.visibleTestCases?.map((tc, i) => (
            <div className="mb-2 flex flex-col md:flex-row gap-2" key={i}>
              {/* Each field is dynamically generated for test case[i] */}
              <input
                type="text"
                name="input"
                placeholder="Input"
                value={tc.input}
                onChange={e => handleTestCaseChange("visibleTestCases", i, e)}
                className="flex-1 border rounded px-2 py-1"
                required
              />
              <input
                type="text"
                name="output"
                placeholder="Output"
                value={tc.output}
                onChange={e => handleTestCaseChange("visibleTestCases", i, e)}
                className="flex-1 border rounded px-2 py-1"
                required
              />
              <input
                type="text"
                name="explanation"
                placeholder="Explanation"
                value={tc.explanation}
                onChange={e => handleTestCaseChange("visibleTestCases", i, e)}
                className="flex-1 border rounded px-2 py-1"
                required
              />
            </div>
          ))}
          {/* Button to add extra visible test case fields */}
          <button
            type="button"
            onClick={() => addTestCase("visibleTestCases")}
            className="text-blue-600 text-sm underline"
          >Add Test Case</button>
        </div>
        {/* Hidden Test Cases (dynamic array) */}
        <div>
          <label className="block font-semibold mb-1">Hidden Testcases</label>
          {form.hiddenTestCases?.map((tc, i) => (
            <div className="mb-2 flex flex-col md:flex-row gap-2" key={i}>
              <input
                type="text"
                name="input"
                placeholder="Input"
                value={tc.input}
                onChange={e => handleTestCaseChange("hiddenTestCases", i, e)}
                className="flex-1 border rounded px-2 py-1"
                required
              />
              <input
                type="text"
                name="output"
                placeholder="Output"
                value={tc.output}
                onChange={e => handleTestCaseChange("hiddenTestCases", i, e)}
                className="flex-1 border rounded px-2 py-1"
                required
              />
              <input
                type="text"
                name="explanation"
                placeholder="Explanation"
                value={tc.explanation}
                onChange={e => handleTestCaseChange("hiddenTestCases", i, e)}
                className="flex-1 border rounded px-2 py-1"
                required
              />
            </div>
          ))}
          {/* Button to add extra hidden test case fields */}
          <button
            type="button"
            onClick={() => addTestCase("hiddenTestCases")}
            className="text-blue-600 text-sm underline"
          >Add Test Case</button>
        </div>
        {/* Reference Solution (dynamic array) */}
        <div>
          <label className="block font-semibold mb-1">Reference Solution</label>
          {form.referenceSolution?.map((rs, i) => (
            <div className="mb-2 flex flex-col md:flex-row gap-2" key={i}>
              <select
                name="language"
                value={rs.language}
                onChange={e => handleSolutionChange("referenceSolution", i, e)}
                className="flex-1 border rounded px-2 py-1"
                required
              >
                <option value="">Language</option>
                {languages.map(l => (
                  <option value={l} key={l}>{l}</option>
                ))}
              </select>
              <textarea
                name="completeCode"
                placeholder="Complete code"
                value={rs.completeCode}
                onChange={e => handleSolutionChange("referenceSolution", i, e)}
                className="flex-1 border rounded px-2 py-1"
                rows={2}
                required
              />
            </div>
          ))}
          {/* Button to add another reference solution */}
          <button
            type="button"
            onClick={() => addSolution("referenceSolution")}
            className="text-blue-600 text-sm underline"
          >Add Solution</button>
        </div>
        {/* Start Code (dynamic array) */}
        <div>
          <label className="block font-semibold mb-1">Starter Code</label>
          {form.startCode?.map((rs, i) => (
            <div className="mb-2 flex flex-col md:flex-row gap-2" key={i}>
              <select
                name="language"
                value={rs.language}
                onChange={e => handleSolutionChange("startCode", i, e)}
                className="flex-1 border rounded px-2 py-1"
                required
              >
                <option value="">Language</option>
                {languages.map(l => (
                  <option value={l} key={l}>{l}</option>
                ))}
              </select>
              <textarea
                name="initialCode"
                placeholder="Initial code"
                value={rs.initialCode}
                onChange={e => handleSolutionChange("startCode", i, e)}
                className="flex-1 border rounded px-2 py-1"
                rows={2}
                required
              />
            </div>
          ))}
          {/* Button to add another starter code */}
          <button
            type="button"
            onClick={() => addSolution("startCode")}
            className="text-blue-600 text-sm underline"
          >Add Starter Code</button>
        </div>
        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700"
        >
          Update Problem
        </button>
      </form>
    </div>
  );
}
