import { useNavigate } from "react-router";

const actions = [
  {
    title: "Create Problem",
    description: "Add a new coding problem for your users.",
    button: "Create",
    href: "/admin/create-problem",
  },
  {
    title: "Update Problem",
    description: "Edit an existing coding problem.",
    button: "Update",
    href: "/admin/update-problem",
  },
  {
    title: "Delete Problem",
    description: "Remove a coding problem permanently.",
    button: "Delete",
    href: "/admin/delete-problem",
  },
];

export default function AdminFront() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Admin Panel</h2>
      <div className="flex flex-wrap gap-6 md:flex-row md:gap-8 justify-center">
        {actions.map(({ title, description, button, href }, i) => (
          <div
            key={title}
            className="flex flex-col justify-between rounded-xl shadow bg-white p-6 min-w-[230px] max-w-[350px] w-full hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
            <button
              className={`mt-6 rounded-lg px-4 py-2 text-white font-medium ${
                i === 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : i === 1
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-red-600 hover:bg-red-700"
              } transition`}
              onClick={() => navigate(href)}
            >
              {button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
