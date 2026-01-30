import React, { useEffect, useState } from "react";
import Skeleton from "../shared/Skeleton";
import { FaAddressBook } from "react-icons/fa";
import AddressInfoModal from "./AddressInfoModal";
import AddAddressForm from "./AddAddressForm";
import { useDispatch, useSelector } from "react-redux";
import AddressList from "./AddressList";
import { DeleteModal } from "./DeleteModal";
import toast from "react-hot-toast";
import { deleteUserAddress, selectUserCheckoutAddress } from "../../store/actions";

const AddressInfo = ({ address }) => {
  const dispatch = useDispatch();

  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { isLoading, btnLoader } = useSelector((state) => state.errors);
  const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);

  const noAddressExist = !address || address.length === 0;

  useEffect(() => {
    if (!noAddressExist && !selectedUserCheckoutAddress?.addressId) {
      dispatch(selectUserCheckoutAddress(address[0]));
    }
  }, [address, noAddressExist, selectedUserCheckoutAddress?.addressId, dispatch]);

  const addNewAddressHandler = () => {
    setSelectedAddress(null);
    setOpenAddressModal(true);
  };

  const deleteAddressHandler = () => {
    if (!selectedAddress?.addressId) return;
    dispatch(deleteUserAddress(selectedAddress.addressId, toast));
    setOpenDeleteModal(false);
  };

  return (
    <div className="pt-4">
      {noAddressExist ? (
        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 max-w-md mx-auto flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center mb-6">
            <FaAddressBook size={40} className="text-teal-600/60" />
          </div>
          <h1 className="mb-2 text-[#1e2f2e] text-center font-black text-2xl tracking-tight">
            No Address Added Yet
          </h1>
          <p className="mb-8 text-slate-500 text-center font-medium leading-relaxed">
            Please add your delivery address to complete your healthcare purchase.
          </p>

          <button
            onClick={addNewAddressHandler}
            className="w-full px-6 py-4 bg-[#1e2f2e] text-white font-black rounded-2xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-900/10 active:scale-95"
          >
            + Add New Address
          </button>
        </div>
      ) : (
        <div className="relative p-6 max-w-2xl mx-auto">
         
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
                <h1 className="text-[#1e2f2e] font-black text-3xl tracking-tight">Select Address</h1>
                <div className="h-1 w-12 bg-teal-500 rounded-full" />
            </div>

            <button
              onClick={addNewAddressHandler}
              className="px-5 py-2.5 bg-teal-50 text-teal-700 font-black rounded-xl hover:bg-teal-100 transition-all flex items-center gap-2 border border-teal-100"
            >
              <span className="text-xl">+</span> Add More
            </button>
          </div>

          {isLoading ? (
            <div className="py-4 px-8">
              <Skeleton />
            </div>
          ) : (
            <div className="space-y-4">
              <AddressList
                addresses={address}
                setSelectedAddress={setSelectedAddress}
                setOpenAddressModal={setOpenAddressModal}
                setOpenDeleteModal={setOpenDeleteModal}
              />
            </div>
          )}
        </div>
      )}

     
      <AddressInfoModal open={openAddressModal} setOpen={setOpenAddressModal}>
        <AddAddressForm
          address={selectedAddress}
          setOpenAddressModal={setOpenAddressModal}
        />
      </AddressInfoModal>

      <DeleteModal
        open={openDeleteModal}
        loader={btnLoader}
        setOpen={setOpenDeleteModal}
        title="Delete Address"
        onDeleteHandler={deleteAddressHandler}
      />
    </div>
  );
};

export default AddressInfo;