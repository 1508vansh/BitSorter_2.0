import { MdArrowDropDownCircle } from "react-icons/md";
import { IoMdArrowDropupCircle } from "react-icons/io";
export default function Dropdown({ arr, isOpen, setIsOpen, state, setState }) {
  const toggleDropdown = (isOpen, setIsOpen) => setIsOpen(!isOpen);

  const handleOptionClick = (state, selectedState, setIsOpen) => {
    selectedState(state);
    setIsOpen(false);
  };

  return (
    <div className="relative text-left">
      {/* Dropdown Button */}
      <button
        onClick={() => toggleDropdown(isOpen, setIsOpen)}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700
         transition-all duration-300 text-white sm:px-4 sm:py-2 px-2 py-1 rounded-md shadow-md flex items-center gap-2"
      >
        <span>{state}</span>
        {isOpen ? (
          <IoMdArrowDropupCircle className="text-lg" />
        ) : (
          <MdArrowDropDownCircle className="text-lg" />
        )}
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200">
          {arr.map((d) => (
            <div
              key={d}
              onClick={() => handleOptionClick(d, setState, setIsOpen)}
              className="px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer text-sm"
            >
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
