'use client'
import React, { Component } from 'react'
import * as XLSX from 'xlsx'

const table = [
  {
    dk: '008800',
    name: 'sin nombre',
  },
  {
    dk: '008085',
    name: 'sin nombre'
  },
  {
    dk: '006416',
    name: 'JUAN EDUARDO NUÑEZ PEREZ',
  }
]
const columnNames = Object.keys(table[0])

export default class Excel extends Component {

  state = {
    woorksheets: [],
    rows: [],
    columns: [],
    status: false
  }

  selectSheet = React.createRef()

  readRows = (i) => {
    var sheet = this.state.woorksheets[i]
    var rows = XLSX.utils.sheet_to_row_object_array(sheet.data)
    this.state.rows = []
    this.state.rows = rows
  }

  readColumns = (i) => {
    var sheet = this.state.woorksheets[i]
    this.state.columns = []

    for (let key in sheet.data) {
      let regEx = new RegExp('^\(\\w\)\(1\){1}$')
      if (regEx.test(key) == true) {
        this.state.columns.push(sheet.data[key].v)
      }
    }
  }

  changeSheet = () => {
    this.readColumns(this.selectSheet.current.value)
    this.readRows(this.selectSheet.current.value)
    this.setState({
      rows: this.state.rows,
      columns: this.state.columns
    })
  }

  readExcel = (e) => {
    e.preventDefault()
    const fromData = new FormData(e.currentTarget)
    var excel = fromData.get('excel')
    var listWorkSheet = []

    var reader = new FileReader()
    reader.readAsArrayBuffer(excel)
    reader.onloadend = (e) => {
      var data = new Uint8Array(e.target.result)
      var excelRead = XLSX.read(data, { type: 'array' })
      excelRead.SheetNames.forEach(function (sheetName, i) {
        listWorkSheet.push({
          data: excelRead.Sheets[sheetName],
          name: sheetName,
          i: i
        })
      })

      this.state.woorksheets = listWorkSheet
      this.setState({ woorksheets: this.state.woorksheets })

      this.readColumns(0)
      this.readRows(0)
      this.setState({
        rows: this.state.rows,
        columns: this.state.columns,
        status: true
      })
    }
  }


  //   render() {
  //     return (
  //       <div className="m-2 relative overflow-x-auto shadow-md sm:rounded-lg">
  //         <h1 className='pb-2'>Leer Documento de Excel</h1>

  //         <input accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' name='excel' class="block w-96 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />


  //         <table className="mt-4 w-full text-sm text-left text-gray-500 dark:text-gray-400">
  //           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
  //             <tr>
  //               {columnNames.map((columnName, index) => (
  //                 <th key={index} scope="col" className="px-6 py-3">
  //                   {columnName}
  //                 </th>
  //               ))}
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {table.map((row, rowIndex) => (
  //               <tr key={rowIndex} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
  //                 {columnNames.map((columnName, colIndex) => (
  //                   <td key={colIndex} className="px-6 py-4">
  //                     {row[columnName]}
  //                   </td>
  //                 ))}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div >
  //     )
  //   }
  // }



  render() {
    return (

      <div className='container'>
        <h1 className='my-5'>Leer Excel</h1>
        <form onSubmit={this.readExcel}>
          <input type="file" accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' name='excel'
            className="mb-2 w-96 block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"></input>
          <button className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>Convertir</button>
        </form>

        {this.state.status &&
          <>
            <form>
              <label>Hojas: </label>
              <select ref={this.selectSheet} onChange={this.changeSheet}>
                {
                  this.state.woorksheets.map((sheet, i) => {
                    return (<option key={i} value={i}>{sheet.name}</option>)
                  })
                }
              </select>
            </form>

            <table className='mt-3'>
              <thead >
                <tr>
                  {
                    this.state.columns.map((columns, i) => {
                      return (<th key={i} className='p-2 border-x-2 border-gray-500'>{columns}</th>)
                    })
                  }
                </tr>
              </thead>

              <tbody>
                {this.state.rows.map((row, i) => {
                  return (
                    <tr key={i}>{this.state.columns.map((column, i2) => {
                      return <td key={i2} className='p-2 border-x-2 border-y-2 border-gray-500'>{row[column]}</td>
                    })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        }
      </div>
    )
  }
}