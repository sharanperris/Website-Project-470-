import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const BrowseItem = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [filteredItems, setFilteredItems] = useState([])

  const { token, backendUrl } = useContext(ShopContext)

  // Categories for filtering
  const categories = [
    'all', 'electronics', 'furniture', 'clothing', 'books', 
    'toys', 'kitchen', 'sports', 'other'
  ]

  // Fetch items from backend
  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/api/items`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setItems(data.items)
        setFilteredItems(data.items)
      } else {
        toast.error(data.message || 'Failed to fetch items')
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Error loading items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter items based on search and category
  useEffect(() => {
    let filtered = items

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    setFilteredItems(filtered)
  }, [searchTerm, categoryFilter, items])

  // Load items on component mount
  useEffect(() => {
    fetchItems()
  }, [])

  // Handle item claim/request
  const handleClaimItem = async (itemId) => {
    try {
      const response = await fetch(`${backendUrl}/api/items/${itemId}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Item claimed successfully!')
        fetchItems() // Refresh the list
      } else {
        toast.error(data.message || 'Failed to claim item')
      }
    } catch (error) {
      console.error('Error claiming item:', error)
      toast.error('Error claiming item. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">
            Browse Available <span className="text-orange-500">Items</span>
          </h1>
          <p className="text-lg text-slate-600">Discover treasures that others are giving away for free</p>
          <div className="w-24 h-1 bg-orange-400 mx-auto mt-6"></div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Items</label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-orange-500">{filteredItems.length}</span> items
            </p>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-slate-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m0 0V3" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-3">No items found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('all')
              }}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <Link key={item._id} to={`/items/${item._id}`} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Item Image */}
                <div className="h-48 bg-slate-200 relative">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span>📍 {item.location}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleClaimItem(item._id)}
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
                  >
                    Claim Item
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseItem