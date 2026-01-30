import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../shared/InputField";
import { useDispatch } from "react-redux";
import { authenticateSignInUser } from "../../store/actions";
import toast from "react-hot-toast";
import Spinners from "../shared/Spinners";

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  
  const [loginAs, setLoginAs] = useState("USER"); 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const loginHandler = async (data) => {
    
    dispatch(
      authenticateSignInUser(data, toast, reset, navigate, setLoader, loginAs)
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-teal-50/30">
      <form
        onSubmit={handleSubmit(loginHandler)}
        className="sm:w-[450px] w-[360px] bg-white shadow-xl py-8 sm:px-8 px-4 rounded-xl border border-teal-100"
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-teal-100 p-4 rounded-full">
            <AiOutlineLogin className="text-teal-600 text-5xl" />
          </div>
          <h1 className="text-teal-900 text-center font-montserrat lg:text-3xl text-2xl font-extrabold tracking-tight">
            Pharmacy Login
          </h1>
          <p className="text-teal-600 text-sm font-medium">
            Login as User or Admin
          </p>
        </div>

        <hr className="mt-6 mb-6 border-teal-50" />
        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setLoginAs("USER")}
            className={`flex-1 py-2 rounded-lg font-bold border transition-all ${
              loginAs === "USER"
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-teal-700 border-teal-200 hover:bg-teal-50"
            }`}
          >
            User
          </button>

          <button
            type="button"
            onClick={() => setLoginAs("ADMIN")}
            className={`flex-1 py-2 rounded-lg font-bold border transition-all ${
              loginAs === "ADMIN"
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-teal-700 border-teal-200 hover:bg-teal-50"
            }`}
          >
            Admin
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <InputField
            label="Username"
            required
            id="username"
            type="text"
            message="*Username is required"
            placeholder="Enter your username"
            register={register}
            errors={errors}
          />

          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="Enter your password"
            register={register}
            errors={errors}
          />
        </div>

        <button
          disabled={loader}
          className="bg-teal-600 flex gap-2 items-center justify-center font-bold text-white w-full py-3 hover:bg-teal-700 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] mt-8 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
        >
          {loader ? (
            <>
              <Spinners /> <span className="ml-2">Verifying...</span>
            </>
          ) : (
            <>Sign In</>
          )}
        </button>

        <p className="text-center text-sm text-teal-800 mt-4">
          Don't have an account?{" "}
          <Link
            className="text-teal-600 font-bold underline hover:text-teal-800 transition-colors"
            to="/register"
          >
            <span>Sign Up</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LogIn;
