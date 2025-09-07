
import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const Requests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingRequest, setProcessingRequest] = useState(null)

  const { token, backendUrl } = useContext(ShopContext)

  // Fetch requests for user's items
  const fetchRequests = async () => {
    try {
      setLoading(true)
      console.log('Fetching requests from:', `${backendUrl}/api/requests/owner`)
      console.log('Token:', token ? 'Present' : 'Missing')
      
      const response = await fetch(`${backendUrl}/api/requests/owner`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        setRequests(data.requests)
        console.log('Requests loaded:', data.requests.length)
      } else {
        console.error('Failed to fetch requests:', data.message)
        toast.error(data.message || 'Failed to fetch requests')
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Error loading requests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle request status update
  const handleRequestUpdate = async (requestId, status) => {
    try {
      setProcessingRequest(requestId)
      
      // Map status to correct endpoint
      const endpoint = status === 'accepted' ? 'accept' : 'reject'
      
      const response = await fetch(`${backendUrl}/api/requests/${requestId}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        // Optimistically update the local state instead of refetching all requests
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request._id === requestId 
              ? { ...request, status: status }
              : request
          )
        )
      } else {
        toast.error(data.message || 'Failed to update request')
      }
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error('Error updating request. Please try again.')
    } finally {
      setProcessingRequest(null)
    }
  }


  useEffect(() => {
    if (token) {
      fetchRequests()
    }
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">
            Item <span className="text-orange-500">Requests</span>
          </h1>
          <p className="text-lg text-slate-600">Manage requests for your posted items</p>
          <div className="w-24 h-1 bg-orange-400 mx-auto mt-6"></div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-slate-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m0 0V3" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-3">No requests yet</h3>
            <p className="text-slate-600 mb-6">When people request your items, they'll appear here</p>
            <Link 
              to="/post-items"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
            >
              Post an Item
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* Item Image */}
                        <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                          {request.item.images && request.item.images.length > 0 ? (
                            <img
                              src={request.item.images[0]}
                              alt={request.item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', request.item.images[0]);
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="w-full h-full flex items-center justify-center text-slate-400"
                            style={{ display: request.item.images && request.item.images.length > 0 ? 'none' : 'flex' }}
                          >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>

                        {/* Request Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {request.item.title}
                          </h3>
                          <p className="text-slate-600 mb-2">
                            Requested by <span className="font-medium">{request.requester.name}</span>
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(request.createdAt).toLocaleDateString()} at{' '}
                            {new Date(request.createdAt).toLocaleTimeString()}
                          </p>
                          
                          {/* Status Badge */}
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {request.status === 'pending' && (
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-3">
                        <button
                          onClick={() => handleRequestUpdate(request._id, 'accepted')}
                          disabled={processingRequest === request._id}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingRequest === request._id ? 'Accepting...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleRequestUpdate(request._id, 'rejected')}
                          disabled={processingRequest === request._id}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingRequest === request._id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Requests
