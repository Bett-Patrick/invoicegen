import { useEffect, useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getInvoicesByUser } from "../../../../../firebase";
import edit from "../../assets/images/PencilSquare.svg";
import { useNavigate } from "react-router-dom";
import menuicon from "../../assets/images/menu-icon.svg";
import "dayjs/locale/en";
import { FormContext } from "../../../../Context/FormContext";

const Invoice = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("Paid");
  const [user, loading] = useAuthState(auth);
  const { setFormInfo, setFromdata, setTodata, setDescription, setCurrentInvoiceId, currentInvoiceId } = useContext(FormContext);

  const formatInvoiceDate = (invoice: any) => {
    if (invoice?.forminfo?.date) {
      return typeof invoice.forminfo.date === "string"
        ? invoice.forminfo.date
        : invoice.forminfo.date.toDate
        ? invoice.forminfo.date.toDate().toISOString().split("T")[0]
        : String(invoice.forminfo.date);
    }
    if (invoice?.createdAt) {
      return typeof invoice.createdAt === "string"
        ? invoice.createdAt.split("T")[0]
        : invoice.createdAt.toDate
        ? invoice.createdAt.toDate().toISOString().split("T")[0]
        : invoice.createdAt.seconds
        ? new Date(invoice.createdAt.seconds * 1000).toISOString().split("T")[0]
        : String(invoice.createdAt);
    }
    return "No date";
  };

  useEffect(() => {
    if (!loading && user) {
      const loadInvoices = async () => {
        try {
          const results = await getInvoicesByUser(user.uid);
          setInvoices(results);
        } catch (error) {
          console.error("Failed to load invoices:", error);
        }
      };
      loadInvoices();
    }
  }, [user, loading]);

  return (
    <div className="h-500 w-full bg-gray-200">
      <div className="flex mx-auto ">
        <div
          onClick={() => {
            if (!currentInvoiceId) {
              alert("Select an invoice first (click an invoice row).");
              return;
            }
            const selected = invoices.find((inv) => inv.id === currentInvoiceId);
            if (selected) {
              setFormInfo(selected?.forminfo || {});
              setFromdata(selected?.fromdata || {});
              setTodata(selected?.todata || {});
              setDescription(selected?.description || []);
              navigate("/invoicePreview");
            } else {
              alert("Selected invoice not found");
            }
          }}
          className="center mt-3 mx-5"
        >
          <img src={menuicon} alt="menu" width={30} height={30} />
        </div>
        <div className=" w-3/4 border-2 border-grey-200 bg-white mx-5">
          <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
            <li className="w-full">
              <button
                onClick={() => setFilter("Paid")}
                className={`inline-block w-full p-4 ${
                  filter === "Paid"
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:text-gray-700 hover:bg-gray-50 text-gray-500"
                } focus:bg-blue-500 focus:text-white focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
              >
                Paid
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={() => setFilter("Partially Paid")}
                className={`inline-block w-full p-4 ${
                  filter === "Partially Paid"
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:text-gray-700 hover:bg-gray-50 text-gray-500"
                } focus:bg-blue-500 focus:text-white focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
              >
                Partially Paid
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={() => setFilter("Pending")}
                className={`inline-block w-full p-4 ${
                  filter === "Pending"
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:text-gray-700 hover:bg-gray-50 text-gray-500"
                } focus:bg-blue-500 focus:text-white focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
              >
                Pending
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="container px-8 mx-9">
        {invoices.length === 0 ? (
          <p className="mt-10 text-lg text-gray-700">No invoices found. Save one from the generate invoice page.</p>
        ) : invoices.filter((invoice) => (invoice?.status || "Pending") === filter).length === 0 ? (
          <p className="mt-10 text-lg text-gray-700">No {filter} invoices found.</p>
        ) : (
          <ul className="grid my-5 list-disc list-inside">
            {invoices
              .filter((invoice) => (invoice?.status || "Pending") === filter)
              .map((invoice) => (
              <li
                key={invoice.id}
                onClick={() => {
                  setCurrentInvoiceId(invoice?.id || null);
                  setFormInfo(invoice?.forminfo || {});
                  setFromdata(invoice?.fromdata || {});
                  setTodata(invoice?.todata || {});
                  setDescription(invoice?.description || []);
                }}
                className={`flex justify-between h-20 w-4/5 my-1 items-center p-5 mx-5 bg-white border border-gray-100 rounded rounded-md ${
                  currentInvoiceId === invoice.id ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <div>
                  <a href="/">{invoice?.forminfo?.number || "Untitled"}</a>
                  <h3>{formatInvoiceDate(invoice)}</h3>
                </div>
                <div>
                  <h1>From : {invoice?.fromdata?.name || "Unknown"}</h1>
                  <h2> To : {invoice?.todata?.name || "Unknown"}</h2>
                </div>
                  <div className="gap-4 flex">
                  <img src={edit} alt="edit" width={25} height={25} />
                  <button
                    onClick={() => {
                      // Populate form context with the selected invoice before navigating
                      setFormInfo(invoice?.forminfo || {});
                      setFromdata(invoice?.fromdata || {});
                      setTodata(invoice?.todata || {});
                      setDescription(invoice?.description || []);
                      setCurrentInvoiceId(invoice?.id || null);
                      // Update forminfo with the latest status from Firestore
                      setFormInfo((prev:any) => ({ ...prev, status: invoice?.status || invoice?.forminfo?.status || "Pending" }));
                      navigate("/invoicecard");
                    }}
                    className="bg-blue-500 text-white p-2 rounded rounded-lg"
                  >
                    Mark as Paid
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Invoice;
