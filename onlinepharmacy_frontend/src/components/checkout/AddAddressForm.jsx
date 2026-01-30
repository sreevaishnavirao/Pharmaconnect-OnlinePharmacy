import React, { useEffect } from 'react'
import InputField from '../shared/InputField'
import { useForm } from 'react-hook-form';
import { FaAddressCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Spinners from '../shared/Spinners';
import toast from 'react-hot-toast';
import { addUpdateUserAddress } from '../../store/actions';

const AddAddressForm = ({ address, setOpenAddressModal }) => {
    const dispatch = useDispatch();
    const { btnLoader } = useSelector((state) => state.errors);
    const {
            register,
            handleSubmit,
            reset,
            setValue,
            formState: {errors},
        } = useForm({
            mode: "onTouched",
        });

        const onSaveAddressHandler = async (data) => {
            const payload = address?.addressId ? { ...data, addressId: address.addressId } : data;
            dispatch(addUpdateUserAddress(payload, toast, () => setOpenAddressModal(false)));
        };

        useEffect(() => {
            if (address?.addressId) {
                setValue("buildingName", address?.buildingName);
                setValue("city", address?.city);
                setValue("street", address?.street);
                setValue("state", address?.state);
                setValue("pincode", address?.pincode);
                setValue("country", address?.country);
            }
        }, [address]);

  return (
    <div className="bg-white p-2">
            <form
                onSubmit={handleSubmit(onSaveAddressHandler)}
                className="space-y-6">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-3">
                            <FaAddressCard size={28}/>
                        </div>
                        <h2 className="text-2xl font-black text-[#1c7a74] tracking-tight">
                            {!address?.addressId ? "Add New Address" : "Update Address"}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">Please provide your delivery details</p>
                    </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField
                    label="Building Name"
                    required
                    id="buildingName"
                    type="text"
                    message="*Building Name is required"
                    placeholder="building name"
                    register={register}
                    errors={errors}
                    className="text-teal-600" 
                    />

                <InputField
                    label="Street"
                    required
                    id="street"
                    type="text"
                    message="*Street is required"
                    placeholder="street no."
                    register={register}
                    errors={errors}
                    /> 

                <InputField
                    label="City"
                    required
                    id="city"
                    type="text"
                    message="*City is required"
                    placeholder="city"
                    register={register}
                    errors={errors}
                    />

                <InputField
                    label="State"
                    required
                    id="state"
                    type="text"
                    message="*State is required"
                    placeholder="state"
                    register={register}
                    errors={errors}
                    />

                <InputField
                    label="Pincode"
                    required
                    id="pincode"
                    type="text"
                    message="*Pincode is required"
                    placeholder="6-digit Pincode"
                    register={register}
                    errors={errors}
                    />    
                  

                <InputField
                    label="Country"
                    required
                    id="country"
                    type="text"
                    message="*Country is required"
                    placeholder="country"
                    register={register}
                    errors={errors}
                    />        
            </div>
            <button
                disabled={btnLoader}
                className="w-full bg-[#146661] text-white py-4 rounded-2xl font-black text-lg hover:bg-teal-600 shadow-xl shadow-teal-900/10 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] mt-4 disabled:opacity-70"
                type="submit">
                {btnLoader ? (
                    <>
                    <Spinners /> <span className="ml-2">Saving Details...</span>
                    </>
                ) : (
                    <>Save Address</>
                )}
            </button>
            </form>
        </div>
  )
}

export default AddAddressForm