import hero from "../../assets/images/illustration-hero.svg";
import { useNavigate} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../../firebase";

const Introduction = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  return (
    <div className="mx-auto flex flex-col items-center justify-center px-4 md:flex-row-reverse md:justify-between md:gap-16 md:px-8">
      <div className="width-fill-available banner-1 flex-[1.08]">
        <img
          src={hero}
          alt=""
          aria-hidden="true"
          width={657}
          height={466}
          className="mx-auto rwd:max-w-[125%]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-[1.625rem] text-center md:text-left">
        <h1 className="mt-8 text-[1.5rem] font-[500] leading-[1.05] text-very-dark-blue md:mt-0 md:text-[3rem]">
          Invoice Generator Application
        </h1>
        <p className="text-very-dark-blue/50 md:text-normal">
          A clean and simple interface to generate your customised invoices.
          {user ? (
            " Continue to your invoices and manage your billing from the generate invoice page."
          ) : (
            " Sign up then login to InvoiceGen and generate and track your invoices instantly. Try it for free now."
          )}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-[0.75rem] md:my-[0.5625rem] md:flex-row md:justify-start">
          {loading ? (
            <button
              disabled
              className="rounded-md border-[0.188rem] border-gray-300 bg-gray-200 py-[0.655rem] px-[1.521rem] text-[0.875rem] font-bold text-gray-700"
            >
              Checking session...
            </button>
          ) : user ? (
            <>
              <button
                onClick={() => navigate("/Invoices")}
                className="rounded-md border-[0.188rem] border-blue-500 bg-blue-500 py-[0.655rem] px-[1.521rem] text-[0.875rem] font-bold text-white transition duration-300 hover:bg-white hover:text-blue-500 hover:cursor-pointer"
              >
                My Invoices
              </button>
              <button
                onClick={() => navigate("/generate-invoice")}
                className="rounded-md border-[0.188rem] border-blue-500 bg-white py-[0.655rem] px-[1.521rem] text-[0.875rem] font-bold text-blue-500 shadow-2xl transition duration-300 hover:border-very-dark-blue"
              >
                Generate Invoice
              </button>
            </>
          ) : (
            <>
              <a
                onClick={() => navigate("/SignUp")}
                className="rounded-md border-[0.188rem] border-blue-500 bg-blue-500 py-[0.655rem] px-[1.521rem] text-[0.875rem] font-bold text-white transition duration-300 hover:bg-white hover:text-blue-500"
              >
                Sign Up
              </a>
              <button
                onClick={() => navigate("/InvoiceLayout")}
                className="rounded-md border-[0.188rem] border-blue-500 bg-white py-[0.655rem] px-[1.521rem] text-[0.875rem] font-bold text-blue-500 shadow-2xl transition duration-300 hover:border-very-dark-blue"
              >
                Try Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
