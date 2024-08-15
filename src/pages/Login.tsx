import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { loginValidationSchema } from "../validationSchema/loginValidationSchema";
import { axiosInstance } from "../axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/features/userSlice";
import { toast } from "sonner";

interface LoginData {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues: LoginData = {
    email: "",
    password: "",
  };

  const handleSubmit = async (loginData: LoginData) => {
    try {
      let response = await axiosInstance.post("/log-in", loginData);
		console.log(response,"ress");
      if (response.data.success) {
        const userData = await axiosInstance.get("/fetch-user-data");
        dispatch(setUserData(userData.data.user));

        toast.success("Login successful!");


        navigate("/chat");
      } else {

        toast.error( response?.data?.error  || response.data.message || "Login failed! Please check your credentials.");
      }
    } catch (error: any) {

      const errorMessage = error.response?.data?.error  || error.response?.data?.message || "An unexpected error occurred!";
      toast.error(errorMessage);
      console.error("Login errors---", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-9 px-4">
      {/* Logo */}
      <div className="mb-6">
        <img
          src="/love.png"
          alt="Name"
          className="h-48 -mb-9"
        />
      </div>
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <div className="bg-green-500 rounded-t-lg p-4">
            <h2 className="text-center text-white text-xl font-bold">Sign In</h2>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email
              </label>
              <Field
                type="text"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              <ErrorMessage name="email" component="small" className="text-red-500" />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              <ErrorMessage name="password" component="small" className="text-red-500" />
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
          </Form>
        </Formik>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <Link to={"/signup"} className="text-green-600 hover:text-green-500 font-medium">
              SIGN UP NOW
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
