import React from 'react'

const Navbar = () => {
  return (
    <div className='px-2 py-3 bg-black text-white flex items-center justify-between'>
        <div className='flex items-center'>
        <input type="text"  className='bg-slate-300 rounded-l-lg'/>
        <button className='px-2  bg-slate-400 rounded-r-lg'>search</button>

        </div>
        <div className='flex items-center'>
        <input type="text" className='bg-slate-300 rounded-l-lg' />
        <button className='px-2  bg-slate-400 rounded-r-lg'> barcode search</button>

        </div>
        
        <button className='px-2 py-2 bg-slate-400 rounded-lg'>Sorting</button>
        <button className='px-2 py-2 bg-slate-400 rounded-lg'>Filter</button>
    </div>
  )
}

export default Navbar