import React from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaEdit,
  FaStreetView,
  FaTrash,
} from "react-icons/fa";
import { MdLocationCity, MdPinDrop, MdPublic } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { selectUserCheckoutAddress } from "../../store/actions";

const AddressList = ({
  addresses,
  setSelectedAddress,
  setOpenAddressModal,
  setOpenDeleteModal,
}) => {
  const dispatch = useDispatch();
  const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);

  const onEditButtonHandler = (address, e) => {
    e.stopPropagation();
    setSelectedAddress(address);
    setOpenAddressModal(true);
  };

  const onDeleteButtonHandler = (address, e) => {
    e.stopPropagation();
    setSelectedAddress(address);
    setOpenDeleteModal(true);
  };

  const handleAddressSelection = (address) => {
    dispatch(selectUserCheckoutAddress(address));
  };

  return (
    <div className="space-y-4">
      {(addresses || []).map((address) => {
        const isSelected =
          selectedUserCheckoutAddress?.addressId === address.addressId;

        return (
          <div
            key={address.addressId}
            onClick={() => handleAddressSelection(address)}
            className={`p-6 border-2 rounded-[1.5rem] cursor-pointer relative transition-all duration-300 ${
              isSelected 
                ? "bg-teal-50/50 border-teal-500 ring-4 ring-teal-500/10" 
                : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${isSelected ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                    <FaBuilding size={14} />
                </div>
                <p className={`font-black text-lg ${isSelected ? "text-[#1e2f2e]" : "text-slate-700"}`}>
                    {address.buildingName}
                </p>
                {isSelected && (
                    <FaCheckCircle className="text-teal-600 ml-2" size={18} />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-11">
                <div className="flex items-center text-slate-500 font-medium text-sm">
                    <FaStreetView size={14} className="mr-2 text-teal-500/70" />
                    <p>{address.street}</p>
                </div>

                <div className="flex items-center text-slate-500 font-medium text-sm">
                    <MdLocationCity size={14} className="mr-2 text-teal-500/70" />
                    <p>{address.city}, {address.state}</p>
                </div>

                <div className="flex items-center text-slate-500 font-medium text-sm">
                    <MdPinDrop size={14} className="mr-2 text-teal-500/70" />
                    <p>{address.pincode}</p>
                </div>

                <div className="flex items-center text-slate-500 font-medium text-sm">
                    <MdPublic size={14} className="mr-2 text-teal-500/70" />
                    <p>{address.country}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 absolute top-6 right-4">
              <button 
                onClick={(e) => onEditButtonHandler(address, e)} 
                type="button"
                className="p-2 rounded-xl bg-white border border-slate-100 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors shadow-sm"
                title="Edit Address"
              >
                <FaEdit size={14} />
              </button>
              <button 
                onClick={(e) => onDeleteButtonHandler(address, e)} 
                type="button"
                className="p-2 rounded-xl bg-white border border-slate-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-sm"
                title="Delete Address"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddressList;