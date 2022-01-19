import React from 'react'

import TableRow from './tab-row'

const Table = ({ data }) => {
  return (
    <table className="container bg-gray-200 h-2/4 rounded shadow-2xl">
      <thead>
        <tr>
          <th>№</th>
          <th>Title</th>
          <th>Image</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Total</th>
          <th>Currency</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {data.map((id, index) => (
          <TableRow key={id} id={id} n={index + 1} />
        ))}
      </tbody>
    </table>
  )
}

export default Table
