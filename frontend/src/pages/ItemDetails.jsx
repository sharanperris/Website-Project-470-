import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const ItemDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, backendUrl, userData } = useContext(ShopContext)
  
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [requesting, setRequesting] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Fetch item details
  const fetchItem = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/api/items/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setItem(data.item)
        console.log('Item data:', data.item)
        console.log('User request:', data.item.userRequest)
        // Check if user has already requested this item
        if (data.item.userRequest && data.item.userRequest.status === 'pending') {
          setHasRequested(true)
          console.log('User has requested this item')
        } else {
          setHasRequested(false)
          console.log('User has not requested this item')
        }
      } else {
        toast.error(data.message || 'Item not found')
        navigate('/browse-items')
      }
    } catch (error) {
      console.error('Error fetching item:', error)
      toast.error('Error loading item details')
      navigate('/browse-items')
    } finally {
      setLoading(false)
    }
  }

  // Handle item request
  const handleRequestItem = async () => {
    try {
      setRequesting(true)
      const response = await fetch(`${backendUrl}/api/items/${id}/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Request sent successfully!')
        setHasRequested(true) // Update local state
      } else {
        // Check if the error is because user already requested
        if (data.message && data.message.includes('already requested')) {
          setHasRequested(true) // Set to true if already requested
        }
        toast.error(data.message || 'Failed to send request')
      }
    } catch (error) {
      console.error('Error requesting item:', error)
      toast.error('Error sending request. Please try again.')
    } finally {
      setRequesting(false)
    }
  }

  // Handle item status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true)
      const response = await fetch(`${backendUrl}/api/items/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Item status updated successfully!')
        // Refresh item data
        fetchItem()
      } else {
        toast.error(data.message || 'Failed to update item status')
      }
    } catch (error) {
      console.error('Error updating item status:', error)
      toast.error('Error updating item status. Please try again.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  useEffect(() => {
    fetchItem()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading item details...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Item not found</h2>
          <Link 
            to="/browse-items" 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  // Check if user can request this item
  const canRequest = item.status === 'Available' && 
                    item.postedBy._id !== userData?._id && 
                    !hasRequested

  console.log('Button logic:', {
    itemStatus: item?.status,
    isOwner: item?.postedBy?._id === userData?._id,
    hasRequested,
    canRequest
  })

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/browse-items" 
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Browse
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="p-8">
              {item.images && item.images.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div className="mb-4">
                    <img
                      src={item.images[currentImageIndex]}
                      alt={item.title}
                      className="w-full h-96 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {item.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {item.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                            currentImageIndex === index 
                              ? 'border-orange-500' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${item.title} ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-slate-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="p-8">
              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : item.status === 'Claimed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>


              {/* Title */}
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{item.title}</h1>

              {/* Category and Condition */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-slate-600">
                  <span className="font-medium mr-2">Category:</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center text-slate-600">
                  <span className="font-medium mr-2">Condition:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {item.condition}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Pickup Location</h3>
                <div className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {item.location}
                </div>
              </div>

              {/* Posted By */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Posted By</h3>
                <div className="flex items-center text-slate-600">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium">
                      {item.postedBy?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{item.postedBy?.name || 'Unknown User'}</p>
                    <p className="text-sm text-slate-500">
                      Posted on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Claimed Info */}
              {item.status === 'Claimed' && item.claimedBy && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Item Claimed</h3>
                  <p className="text-red-600">
                    This item has been claimed by {item.claimedBy.name} on{' '}
                    {new Date(item.claimedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Requested Info */}
              {hasRequested && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Request Sent</h3>
                  <p className="text-blue-600">
                    Your request for this item has been sent. The owner will review your request soon.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-6 border-t border-gray-200">
                {canRequest ? (
                  <button
                    onClick={handleRequestItem}
                    disabled={requesting}
                    className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {requesting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Request To Claim</span>
                      </>
                    )}
                  </button>
                ) : hasRequested ? (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Requested</span>
                  </button>
                ) : item.postedBy?._id === userData?._id ? (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium mb-3">This is your item</p>
                    <Link
                      to="/requests"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                    >
                      View Requests
                    </Link>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 font-medium">This item is no longer available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetails