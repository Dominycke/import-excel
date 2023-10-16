'use client'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'

function Test() {
  const [table, setTable] = useState([
    {
      dk: '008800',
      name: 'sin nombre',
    },
    {
      dk: '008085',
      name: 'sin nombre',
    },
    {
      dk: '006416',
      name: 'JUAN EDUARDO NUÑEZ PEREZ',
    },
    {
      dk: '008754',
      name: 'VSS',
    }
  ])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      console.dir(excelData, { depth: null })

      setTable((prevTable) =>
        prevTable.map((row) => {
          const matchingRow = excelData.find((excelRow) => excelRow[1] === row.dk)

          if (matchingRow) {
            return {
              dk: row.dk,
              name: matchingRow[2]
            }
          }
          return row
        })
      )
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <input type="file" accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' name='excel' onChange={handleFileChange} />
      <table className="mt-4 w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          <tr >
            <th>DK</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
              <td className="px-6 py-4">{row.dk}</td>
              <td className="px-6 py-4">{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Test