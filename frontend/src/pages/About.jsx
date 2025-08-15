import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className='min-h-screen bg-slate-50 py-12'>
      <div className='max-w-4xl mx-auto px-6'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-2xl md:text-3xl font-bold text-slate-700 mb-4'>
            About <span className='text-orange-500'>Trash to Treasure</span>
          </h1>
          <div className='w-24 h-1 bg-orange-400 mx-auto mb-6'></div>
        </div>

        {/* Main Description */}
        <div className='bg-white rounded-lg shadow-lg p-10 mb-8'>
          <p className='text-base text-slate-600 leading-relaxed mb-8'>
            Trash to Treasure is a community-driven donation platform where users can give away unused items for free to others who may need them. The platform is designed to promote sustainability, reduce waste, and encourage a culture of sharing.
          </p>
          <p className='text-base text-slate-600 leading-relaxed'>
            Every day, countless usable items are discarded — while others go without the resources they need. Trash to Treasure connects people who want to give with those who could benefit, helping items find a new home instead of ending up in landfills.
          </p>
        </div>

        {/* How It Works Section */}
        <div className='bg-white rounded-lg shadow-lg p-10 mb-8'>
          <h2 className='text-2xl font-bold text-slate-700 mb-8 text-center'>How It Works</h2>
          <p className='text-base text-slate-600 text-center mb-8'>Simple steps to turn trash into treasure</p>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-8 bg-orange-50 rounded-lg'>
              <div className='w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-xl font-bold'>1</span>
              </div>
              <h3 className='text-lg font-semibold text-slate-700 mb-4'>Post an Item</h3>
              <p className='text-sm text-slate-500'>List things you no longer need, such as books, clothes, electronics, or furniture.</p>
            </div>
            
            <div className='text-center p-8 bg-blue-50 rounded-lg'>
              <div className='w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-xl font-bold'>2</span>
              </div>
              <h3 className='text-lg font-semibold text-slate-700 mb-4'>Browse & Request</h3>
              <p className='text-sm text-slate-500'>Explore available items posted by others and request the ones you're interested in.</p>
            </div>
            
            <div className='text-center p-8 bg-slate-100 rounded-lg'>
              <div className='w-20 h-20 bg-slate-400 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-xl font-bold'>3</span>
              </div>
              <h3 className='text-lg font-semibold text-slate-700 mb-4'>Claim & Connect</h3>
              <p className='text-sm text-slate-500'>Coordinate with the giver to collect the item — no payment required.</p>
            </div>
          </div>
        </div>

        {/* Who Can Use It Section */}
        <div className='bg-white rounded-lg shadow-lg p-10 mb-8'>
          <h2 className='text-2xl font-bold text-slate-700 mb-8 text-center'>Who Can Use It?</h2>
          <div className='bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg p-8'>
            <p className='text-base text-slate-600 text-center leading-relaxed'>
              Anyone with an account can use Trash to Treasure — whether to give or receive. It's ideal for students, families, or anyone looking to declutter while helping someone else.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <h2 className='text-2xl font-bold text-slate-700 mb-8 text-center'>Our Mission</h2>
          <p className='text-base text-slate-600 text-center mb-8'>We believe in:</p>
          
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='flex items-start space-x-6 p-6 bg-orange-50 rounded-lg'>
              <div className='text-3xl'>♻️</div>
              <div>
                <h3 className='text-lg font-semibold text-slate-700 mb-3'>Sustainability</h3>
                <p className='text-sm text-slate-500'>Giving items a second life</p>
              </div>
            </div>
            
            <div className='flex items-start space-x-6 p-6 bg-blue-50 rounded-lg'>
              <div className='text-3xl'>🤝</div>
              <div>
                <h3 className='text-lg font-semibold text-slate-700 mb-3'>Community</h3>
                <p className='text-sm text-slate-500'>Connecting people through kindness</p>
              </div>
            </div>
            
            <div className='flex items-start space-x-6 p-6 bg-slate-100 rounded-lg'>
              <div className='text-3xl'>💚</div>
              <div>
                <h3 className='text-lg font-semibold text-slate-700 mb-3'>Generosity</h3>
                <p className='text-sm text-slate-500'>Helping without expecting anything in return</p>
              </div>
            </div>
            
            <div className='flex items-start space-x-6 p-6 bg-yellow-50 rounded-lg'>
              <div className='text-3xl'>🛠️</div>
              <div>
                <h3 className='text-lg font-semibold text-slate-700 mb-3'>Simplicity</h3>
                <p className='text-sm text-slate-500'>Making the process easy and accessible for everyone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className='text-center mt-12'>
          <div className='bg-gradient-to-r from-orange-400 to-blue-300 rounded-lg p-12 text-white'>
            <h3 className='text-2xl font-bold mb-6'>Ready to Make a Difference?</h3>
            <p className='text-base mb-8'>Join our community and start giving items a second life today!</p>
            <Link 
              to="/login?mode=signup" 
              className='inline-block bg-white text-orange-400 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-200'
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About