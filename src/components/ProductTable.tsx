'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import {
    deleteProduct,
    deleteAllProducts,
    setEditingProduct
} from '@/store/productSlice'
import { useState } from 'react'
import Image from 'next/image'

export default function ProductTable() {
    const products = useSelector((state: RootState) => state.products.products)
    const dispatch = useDispatch<AppDispatch>()

    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState<'title' | 'total' | null>(null)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const itemsPerPage = 5

    const categories = Array.from(new Set(products.map((p) => p.category)))

    const filtered = products
        .filter(
            (p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((p) => categoryFilter === 'All' || p.category === categoryFilter)

    // Sorting-
    if (sortBy) {
        filtered.sort((a, b) => {
            if (sortBy === 'title') {
                
                return sortOrder === 'asc'
                    ? a.title.localeCompare(b.title)   // تصاعدي
                    : b.title.localeCompare(a.title)   // تنازلي
            } else {
                
                return sortOrder === 'asc'
                    ? a.total - b.total   // تصاعدي
                    : b.total - a.total   // تنازلي
            }
        })
    }


    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const currentProducts = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleExport = () => {
        const json = JSON.stringify(products, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'products.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <input
                type="text"
                placeholder="Search by title or category..."
                className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                }}
            />
            {filtered.length > 0 ? (
                <>
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                        {/* Export & Delete */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleExport}
                                className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded"
                            >
                                Export JSON
                            </button>
                            <button
                                onClick={() => dispatch(deleteAllProducts())}
                                className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded"
                            >
                                Delete All ({filtered.length})
                            </button>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="bg-gray-700 text-white px-3 py-2 rounded"
                        >
                            <option value="All">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {/* Sorting */}
                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value as 'title' | 'total' | ''
                                    setSortBy(value || null)
                                }}
                                className="bg-gray-700 text-white px-3 py-2 rounded"
                            >
                                <option value="">Sort By</option>
                                <option value="title">Title</option>
                                <option value="total">Price</option>
                            </select>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="bg-gray-600 text-white px-3 py-2 rounded"
                            >
                                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    {/* Table Wrapper for mobile */}
<div className="hidden sm:block overflow-x-auto">
  {/* Table for tablet and desktop */}
  <table className="min-w-full text-left border border-gray-700 text-sm bg-gray-800 text-white">
    <thead>
      <tr className="bg-gray-700 text-purple-300">
        <th className="p-2 border">#</th>
        <th className="p-2 border">Title</th>
        <th className="p-2 border">Total</th>
        <th className="p-2 border">Category</th>
        <th className="p-2 border">Image</th>
        <th className="p-2 border">Update</th>
        <th className="p-2 border">Delete</th>
      </tr>
    </thead>
    <tbody>
      {currentProducts.map((prod, index) => (
        <tr key={prod.id} className="border-t border-gray-600">
          <td className="p-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
          <td className="p-2 border">{prod.title}</td>
          <td className="p-2 border text-green-400">{prod.total}</td>
          <td className="p-2 border">{prod.category}</td>
          <td className="p-2 border">
            {prod.image && (
              <Image
                src={prod.image}
                alt={prod.title}
                width={40}
                height={40}
                className="object-cover rounded"
              />
            )}
          </td>
          <td className="p-2 border">
            <button
              onClick={() => dispatch(setEditingProduct(prod))}
              className="bg-yellow-500 text-black px-2 py-1 rounded text-xs"
            >
              Update
            </button>
          </td>
          <td className="p-2 border">
            <button
              onClick={() => dispatch(deleteProduct(prod.id))}
              className="bg-red-500 px-2 py-1 rounded text-xs"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Mobile stacked view */}
<div className="sm:hidden space-y-4">
  {currentProducts.map((prod, index) => (
    <div key={prod.id} className="border border-gray-700 bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between mb-2 text-purple-300 text-xs">
        <span>#{(currentPage - 1) * itemsPerPage + index + 1}</span>
        <span> category: {prod.category}</span>
      </div>
      <h2 className="text-white font-semibold break-words"> titel: {prod.title}</h2>
      <p className="text-green-400">Total: {prod.total}</p>
      {prod.image && (
        <div className="mt-2 w-24 h-24 relative">
          <Image
            src={prod.image}
            alt={prod.title}
           fill
            className="object-cover rounded"
          />
        </div>
      )}
      <div className="flex  gap-2 mt-4">
        <button
          onClick={() => dispatch(setEditingProduct(prod))}
          className="bg-yellow-500 text-black px-2 py-1 rounded text-xs"
        >
          Update
        </button>
        <button
          onClick={() => dispatch(deleteProduct(prod.id))}
          className="bg-red-500 px-2 py-1 rounded text-xs"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>



                    {/* Pagination */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => setCurrentPage(num)}
                                className={`px-3 py-1 rounded ${num === currentPage
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-600 text-gray-300'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-400">No matching products found.</p>
            )}
        </div>
    )
}