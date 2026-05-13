import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { useContext } from "react";
import InvoiceTop from "../../layout/InvoiceTop";
import InvoiceEdit from "../../Pages/InvoiceEdit/InvoiceEdit";
import { FormContext } from "../../Context/FormContext";
import InvoicePreview from "../../Pages/InvoicePreview/InvoicePreview";
import SideBar from "../../components/Sidebar/SideBar";
import { useNavigate } from "react-router-dom";


const GenerateInvoice = () => {
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate("/Login");
    }
  }, [user, loading, navigate]);

  const { selectedoptions } = useContext(FormContext);
    
  

  return (
    <div className="max-w-full md:w-4/5 flex container mx-0 gap-6 md:mx-20 px-2 md:px-0 py-1 md:py-5">
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex flex-col w-full md:w-4/5">
          <InvoiceTop />
          {selectedoptions === "Edit" ? <InvoiceEdit /> : <InvoicePreview />}
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoice;
