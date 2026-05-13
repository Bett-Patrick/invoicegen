import { useContext, useEffect } from "react";
import InvoiceEdit from "../Pages/InvoiceEdit/InvoiceEdit";
import { FormContext } from "../Context/FormContext";
import InvoicePreview from "../Pages/InvoicePreview/InvoicePreview";
import InvoiceHeader from "./InvoiceHeader";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const InvoiceLayout = () => {
  const { selectedoptions } = useContext(FormContext);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/generate-invoice");
    }
  }, [user, loading, navigate]);

  return (
    <div>
    <div className=" max-w-full md:w-full justify-center flex container mx-0 gap-6 md:mx-20 px-2 md:px-0 py-1 md:py-5 ">
      <div className="flex flex-col md:flex-row w-full">
        <div className=" flex flex-col w-full md:w-4/5">
          <InvoiceHeader />
          {selectedoptions === "Edit" ? <InvoiceEdit /> : <InvoicePreview />}
        </div>
       {/*<div className="flex flex-col w-full md:w-1/4">
         <SideBar/>
        </div>
        */} 
      </div>
    </div>
    </div>
  );
};

export default InvoiceLayout;
