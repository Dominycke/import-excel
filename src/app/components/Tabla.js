'use client'
import { Button, FileInput, Label, Table, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'

const HiSearch = () => (
  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
  </svg>
)

const Add = () => (
  <svg class="h-4 w-4 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
  </svg>
)
const Sinc = () => (
  <svg class="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
    <path d="M17 9a1 1 0 0 0-1 1 6.994 6.994 0 0 1-11.89 5H7a1 1 0 0 0 0-2H2.236a1 1 0 0 0-.585.07c-.019.007-.037.011-.055.018-.018.007-.028.006-.04.014-.028.015-.044.042-.069.06A.984.984 0 0 0 1 14v5a1 1 0 1 0 2 0v-2.32A8.977 8.977 0 0 0 18 10a1 1 0 0 0-1-1ZM2 10a6.994 6.994 0 0 1 11.89-5H11a1 1 0 0 0 0 2h4.768a.992.992 0 0 0 .581-.07c.019-.007.037-.011.055-.018.018-.007.027-.006.04-.014.028-.015.044-.042.07-.06A.985.985 0 0 0 17 6V1a1 1 0 1 0-2 0v2.32A8.977 8.977 0 0 0 0 10a1 1 0 1 0 2 0Z" />
  </svg>
)
const Import = () => (
  <svg className="w-4 h-4 mr-2 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
  </svg>
)

function Tabla() {
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
    <section className='dark:bg-gray-900 h-screen'>
      <div className="flex flex-col px-4 pt-4 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex items-center flex-1 space-x-4">
          <TextInput className='max-w-md' icon={HiSearch} id='Search' placeholder='Buscar' type='text' />
        </div>
        {/* <FileInput type='file' accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' name='excel' onChange={handleFileChange} /> */}
        {/* <Button color='blue' type='file' type='button' accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' name='excel' onChange={handleFileChange}>
          <svg className="w-4 h-4 mr-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
          </svg>
          Importar Excel
        </Button> */}
        <Button color='blue'>
          <Add />
          Agregar nuevo cliente
        </Button>
        <Button color='gray' className='flex flex-row tex-gray-900 dark:text-white'>
          <Sinc />
          Sincronizar cambios
        </Button>
        <Button color='gray' >
          <Label htmlFor='file-input' className='flex flex-row tex-gray-900 dark:text-white'>
            <Import />
            Importar Excel
          </Label>
          <FileInput id='file-input' type='file' accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' name='excel' onChange={handleFileChange} className='hidden' />
        </Button>
      </div>
      <section className='p-4'>
        <Table>
          <Table.Head>
            <Table.HeadCell>
              DK
            </Table.HeadCell>
            <Table.HeadCell>
              Name
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">
                Edit
              </span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {table.map((row, rowIndex) => (
              <Table.Row key={rowIndex} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>{row.dk}</Table.Cell>
                <Table.Cell className=''>{row.name}</Table.Cell>
                <Table.Cell>
                  <a className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" href="/tables">
                    <p>Edit</p>
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>
    </section >
  )
}

export default Tabla