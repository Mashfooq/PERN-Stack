// src/Auth.tsx

import { FormEvent, useEffect, useState } from "react"
import { remult } from "remult"
import App from "./App"
import TodoHeader from "./components/TodoHeader"

export default function Auth() {
  const initialFormData = {
    userEmail: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [signedIn, setSignedIn] = useState(false)

  const signIn = async (e: FormEvent) => {
    console.log("signin");
    console.log(formData.userEmail);
    console.log(formData.password);

    e.preventDefault()
    const result = await fetch("http://backend:3002/api/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "userEmail": formData.userEmail, "password": formData.password })
    })
    console.log("signin 2");
    console.log(result);
    if (result.ok) {
      console.log("result ok");
      remult.user = await result.json()
      setSignedIn(true)
      setFormData(initialFormData);
    } else {
      alert(await result.json())
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const signOut = async () => {
    await fetch("/api/signOut", {
      method: "POST"
    })
    remult.user = undefined
    setSignedIn(false)
  }
  useEffect(() => {
    fetch("http://backend:3002/api/currentUser").then(async r => {
      remult.user = await r.json()
      if (remult.user) setSignedIn(true)
    })
  }, [])

  if (!signedIn)
    return (
      <div className="flex flex-col items-center justify-center mt-6">
        <TodoHeader title="TODO" />

        <div className="flex flex-col mt-6 mb-4 w-full max-w-lg">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={signIn}>
                <div>
                  <label htmlFor="userEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email"
                    value={formData.userEmail}
                    onChange={handleChange}
                    name="userEmail" id="userEmail" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="name@company.com" required={true} />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password" id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••" required={true} />
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required={true} />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div> */}
                <button type="submit" className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Sign In</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* <form onSubmit={signIn}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username, try Steve or Jane"
            />
            <button>Sign in</button>
          </form> */}
      </div>
    )
  return (
    <>
      <header>
        Hello {remult.user!.name} <button onClick={signOut}>Sign Out</button>
      </header>
      <App />
    </>
  )
}