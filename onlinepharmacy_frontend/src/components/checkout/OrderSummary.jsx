import React from 'react'
import { formatPriceCalculation } from '../../utils/formatPrice'
import { MapPin, CreditCard, ShoppingBag, ReceiptText } from "lucide-react";

const OrderSummary = ({ totalPrice, cart, address, paymentMethod}) => {
  return (
    <div className="container mx-auto px-4 mb-8">
     <div className="flex flex-wrap gap-y-6">
      <div className="w-full lg:w-8/12 lg:pr-6">
       <div className="space-y-6">
    
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
            <h2 className='text-xl font-black text-[#1e2f2e] mb-4 flex items-center gap-2'>
                <MapPin size={20} className="text-teal-500" /> Billing Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-50 text-slate-600">
                <p><strong className="text-[#1e2f2e]">Building: </strong> {address?.buildingName}</p>
                <p><strong className="text-[#1e2f2e]">Street: </strong> {address?.street}</p>
                <p><strong className="text-[#1e2f2e]">City: </strong> {address?.city}</p>
                <p><strong className="text-[#1e2f2e]">State: </strong> {address?.state}</p>
                <p><strong className="text-[#1e2f2e]">Pincode: </strong> {address?.pincode}</p>
                <p><strong className="text-[#1e2f2e]">Country: </strong> {address?.country}</p>
            </div>
        </div>
        <div className='p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm'>
            <h2 className='text-xl font-black text-[#1e2f2e] mb-4 flex items-center gap-2'>
                <CreditCard size={20} className="text-teal-500" /> Payment Method
            </h2>
            <div className="flex items-center gap-3 bg-teal-50/50 p-4 rounded-xl border border-teal-100 w-fit">
                <strong className="text-[#1e2f2e]">Method: </strong>
                <span className="capitalize font-bold text-teal-700">{paymentMethod}</span>
            </div>
        </div>
        <div className='p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm mb-6'>
            <h2 className='text-xl font-black text-[#1e2f2e] mb-4 flex items-center gap-2'>
                <ShoppingBag size={20} className="text-teal-500" /> Order Items
            </h2>
            <div className='space-y-4'>
                {cart?.map((item) => (
                    <div key={item?.productId} className='flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors'>
                        <img src={`${import.meta.env.VITE_BACK_END_URL}/images/${item?.image}`}
                             alt='Product'
                             className='w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm' 
                        />
                        <div className='flex-1'>
                            <p className="font-bold text-[#1e2f2e]">{item?.productName}</p>
                            <p className="text-sm text-slate-500 font-medium">
                                <span className="text-teal-600 font-bold">{item?.quantity}</span> x ${item?.specialPrice}
                            </p>
                        </div>
                        <div className="font-black text-[#1e2f2e]">
                            ${formatPriceCalculation(item?.quantity, item?.specialPrice)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
       </div>
      </div>
      <div className="w-full lg:w-4/12 mt-4 lg:mt-0">
          <div className="bg-[#1f837c] text-white rounded-[2.5rem] shadow-2xl p-8 sticky top-6">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <ReceiptText size={24} className="text-teal-400" /> Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-teal-100/70 font-medium">
                <span>Products Total</span>
                <span className="text-white">${formatPriceCalculation(totalPrice, 1)}</span>
              </div>
              <div className="flex justify-between text-teal-100/70 font-medium">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-teal-100/70 font-medium">
                <span>Shipping</span>
                <span className="text-teal-400 font-black tracking-widest text-xs uppercase">Free</span>
              </div>
              
              <div className="flex justify-between pt-5 border-t border-white/10 items-center">
                <span className="text-lg font-black">SubTotal</span>
                <span className="text-3xl font-black text-teal-400">
                    ${formatPriceCalculation(totalPrice, 1)}
                </span>
              </div>
            </div>
<div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                 <p className="text-[10px] font-bold text-teal-100/50 uppercase tracking-[0.2em]">
                    Secure Health-Care Checkout
                 </p>
            </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default OrderSummary