import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import App from "./App";
import TodoHeader from "./components/TodoHeader";
import { AuthController } from "./controller/AuthController";
import SignOutBanner from "./components/SignOut";

export default function Auth() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [signedIn, setSignedIn] = useState(false)
  const [userDetails, setUserDetails] = useState(null);

  type FormValues = {
    userEmail: string;
    password: string;
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    let user = null; 
    if (user = await AuthController.signInHandler(formData)) {
      setUserDetails(user);
      setSignedIn(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (await AuthController.getCurrentUser()) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    };
  
    fetchData();
  }, [signedIn]);  
  if (!signedIn) {
    return (
      <div className="flex flex-col items-center justify-center mt-6">
        <TodoHeader title="TODO" />

        <div className="flex flex-col mt-6 mb-4 w-full max-w-lg">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="userEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email"
                    {...register("userEmail", { required: true })}
                    id="userEmail" 
                    className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.userEmail ? 'border-red-500' : ''}`}
                    placeholder="name@company.com" />
                  {errors.userEmail && <p className="text-red-500">Email is required</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password"
                    {...register("password", { required: true })}
                    id="password"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••" />
                  {errors.password && <p className="text-red-500">Password is required</p>}
                </div>
                <button type="submit" className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Sign In</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <SignOutBanner />
        <App userDetails={userDetails} />
      </>
    );
  }
}
