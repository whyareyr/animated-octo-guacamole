import React from "react";

const DataTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left border-b border-gray-300">ID</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Title
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Description
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Word Count
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-300">{item._id}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                {item.title}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {item.description}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {item.wordCount !== undefined ? (
                  item.wordCount
                ) : (
                  <div>Loading</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
