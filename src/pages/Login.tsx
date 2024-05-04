import React from 'react'

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <div className="bg-green-500 rounded-t-lg p-4">
          <h2 className="text-center text-white text-xl font-bold">Sign In</h2>
        </div>
      </div>
      <form action="#" method="POST">
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-zinc-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center justify-between mb-6">
          <a href="#" className="text-sm text-green-600 hover:text-green-500">
            Forgot Username / Password?
          </a>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            SIGN IN
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm">
          Don’t have an account?{' '}
          <a href="#" className="text-green-600 hover:text-green-500 font-medium">
            SIGN UP NOW
          </a>
        </p>
      </div>
    </div>
  </div>
  )
}

export default Login