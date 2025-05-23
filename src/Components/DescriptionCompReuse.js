import React from 'react'

function DescriptionCompReuse({items,title}) {
  return (
     <div class="relative overflow-x-auto shadow-md sm:rounded-lg my-4 mb-6">
        <h2 className='bg-green-900 text-white p-2'>{title}</h2>
            <table className="w-full border-separate border  border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
              <tbody>
                {items.map(e=>
                <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white w-1/4"
                  >
                    {e.label}
                  </th>
                  <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                    {e.children}
                  </td>
                </tr>
                )
}
              

              </tbody>
            </table>
          </div>
  )
}

export default DescriptionCompReuse