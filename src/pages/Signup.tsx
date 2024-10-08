import { axiosInstance } from "../axios";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { signUpValidation } from "../validationSchema/signUpValidation";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner"; // Importing the toast from Sonner


interface FormValues {
    username: string;
    email: string;
    password: string;
    cpassword: string;
}

function Signup() {

    const navigate = useNavigate();

    const initialValues: FormValues = {
        username: "",
        email: "",
        password: "",
        cpassword: "",
    };

    const handleSubmit = async (userData: FormValues) => {
        try {
            let response = await axiosInstance.post("/sign-up", userData);

            if (response.data.success) {
                toast.success("Account created successfully!");
		
                navigate("/");
            } else {
                toast.error( response?.data?.error || "Sign-up failed. Please try again.");
            }
        } catch (error: any) {
            toast.error( error.response?.data?.error  || error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center -mt-9 px-4">
            {/* Logo */}

            {/* Name as Image */}
            <div className="mb-6">
                <img
                    src="/love.png" // Replace "name.png" with the path to your name image
                    alt="Name"
                    className="h-48 -mb-9"
                />
            </div>
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                    <div className="bg-green-500 rounded-t-lg p-4">
                        <h2 className="text-center text-white text-xl font-bold">
                            Sign Up
                        </h2>
                    </div>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={signUpValidation}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-zinc-700"
                            >
                                Username
                            </label>
                            <Field
                                type="text"
                                id="username"
                                name="username"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="username"
                                component="small"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-zinc-700"
                            >
                                Email
                            </label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="email"
                                component="small"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-zinc-700"
                            >
                                Password
                            </label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="password"
                                component="small"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="cpassword"
                                className="block text-sm font-medium text-zinc-700"
                            >
                                Confirm Password
                            </label>
                            <Field
                                type="password"
                                id="cpassword"
                                name="cpassword"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="cpassword"
                                component="small"
                                className="text-red-500"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                SIGN UP
                            </button>
                        </div>
                    </Form>
                </Formik>
                <div className="mt-6 text-center">
                    <p className="text-sm">
                        Already have an account?{" "}
                        <Link
                            to={"/"}
                            className="text-green-600 hover:text-green-500 font-medium"
                        >
                            SIGN IN
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
