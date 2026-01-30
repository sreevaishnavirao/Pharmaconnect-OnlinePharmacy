
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddresses, getUserCart } from "../../store/actions";
import { placeOrder } from "../../store/actions/orderActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft, MapPin, ClipboardList, CreditCard } from "lucide-react";

import AddressInfoModal from "./AddressInfoModal";
import AddAddressForm from "./AddAddressForm";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const steps = ["Address", "Payment", "Review & Place Order"];
  const [activeStep, setActiveStep] = useState(0);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  
  const [card, setCard] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const addressesRaw = useSelector((state) => state?.auth?.address);
  const addresses = Array.isArray(addressesRaw) ? addressesRaw : [];

  const cartsCart = useSelector((state) => state?.carts?.cart);
  const cartCart = useSelector((state) => state?.cart?.cart);
  const cartsTotal = useSelector((state) => state?.carts?.totalPrice);
  const cartTotal = useSelector((state) => state?.cart?.totalPrice);

  const cartItems = Array.isArray(cartsCart)
    ? cartsCart
    : Array.isArray(cartCart)
    ? cartCart
    : [];

  const totalPrice =
    typeof cartsTotal === "number"
      ? cartsTotal
      : typeof cartTotal === "number"
      ? cartTotal
      : Number(cartsTotal ?? cartTotal ?? 0);

  
  useEffect(() => {
    dispatch(getUserAddresses());
    dispatch(getUserCart());
  }, [dispatch]);

  
  useEffect(() => {
    if (!openAddressModal) dispatch(getUserAddresses());
  }, [openAddressModal, dispatch]);

 
  useEffect(() => {
    if (
      (selectedAddressId === null || selectedAddressId === undefined) &&
      addresses.length > 0
    ) {
      const firstId = addresses[0]?.addressId ?? addresses[0]?.id ?? null;
      setSelectedAddressId(firstId);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = useMemo(() => {
    const id = Number(selectedAddressId);
    return addresses.find((a) => Number(a?.addressId ?? a?.id) === id);
  }, [addresses, selectedAddressId]);

  const cartCount = useMemo(
    () =>
      (cartItems || []).reduce((sum, it) => sum + Number(it?.quantity || 0), 0),
    [cartItems]
  );

  const canProceedFromAddress =
    selectedAddressId !== null && selectedAddressId !== undefined;

 
  const onlyDigits = (s) => String(s || "").replace(/\D/g, "");
  const isValidCardNumber = (n) => onlyDigits(n).length >= 12 && onlyDigits(n).length <= 19;
  const isValidExpiry = (exp) => {
    const s = String(exp || "").trim();
    
    const m1 = /^(\d{2})\/(\d{2})$/.exec(s);
    const m2 = /^(\d{2})\/(\d{4})$/.exec(s);
    const m = m1 || m2;
    if (!m) return false;
    const mm = Number(m[1]);
    return mm >= 1 && mm <= 12;
  };
  const isValidCVV = (c) => onlyDigits(c).length === 3 || onlyDigits(c).length === 4;

  const canProceedFromPayment =
    card.nameOnCard.trim() &&
    isValidCardNumber(card.cardNumber) &&
    isValidExpiry(card.expiry) &&
    isValidCVV(card.cvv);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!canProceedFromAddress) return toast.error("Please select an address.");
      setActiveStep(1);
      return;
    }
    if (activeStep === 1) {
      if (!canProceedFromPayment) {
        toast.error("Please enter valid card details.");
        return;
      }
      setActiveStep(2);
      return;
    }
  };

  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return toast.error("Please select an address.");
    if (!cartItems || cartItems.length === 0) return toast.error("Your cart is empty.");
    if (!canProceedFromPayment) return toast.error("Please enter valid card details.");

    setPlacingOrder(true);

    
    const payload = {
      addressId: Number(selectedAddressId),
      paymentMethod: "CARD",
      pgName: "CARD",
      pgPaymentId: `TEST-${Date.now()}`,
      pgStatus: "SUCCESS",
      pgResponseMessage: "Payment captured (demo)",
    };

    const result = await dispatch(placeOrder(payload));
    setPlacingOrder(false);

    if (result?.success) {
      toast.success("Order placed successfully!");
      dispatch(getUserCart());
      setTimeout(() => navigate("/"), 200);
    } else {
      toast.error(result?.error || "Place order failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-slate-50/30 min-h-screen">
     
      <div className="flex items-center justify-between mb-12 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        {steps.map((s, idx) => (
          <div key={s} className="flex-1 flex items-center last:flex-none">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                idx <= activeStep
                  ? "bg-[#168880] text-white shadow-lg shadow-teal-900/20"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {idx < activeStep ? <Check size={18} /> : idx + 1}
            </div>

            <div
              className={`ml-3 text-xs uppercase tracking-widest font-black ${
                idx <= activeStep ? "text-[#1e2f2e]" : "text-slate-400"
              }`}
            >
              {s}
            </div>

            {idx !== steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-6 rounded-full transition-all duration-700 ${
                  idx < activeStep ? "bg-teal-500" : "bg-slate-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

     
      {activeStep === 0 && (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-teal-500" size={28} />
              <h2 className="text-2xl font-black text-[#1e2f2e]">
                Select Delivery Address
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setOpenAddressModal(true)}
              className="px-6 py-3 rounded-2xl bg-teal-50 text-teal-700 font-black hover:bg-teal-100 transition-all active:scale-95"
            >
              + Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-[2rem] text-slate-500 font-medium">
              No addresses found. Please add a delivery address to proceed.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((a) => {
                const id = a?.addressId ?? a?.id;
                const isSelected = Number(id) === Number(selectedAddressId);

                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setSelectedAddressId(id)}
                    className={`text-left border-2 rounded-[2rem] p-6 transition-all duration-300 relative ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/30 ring-4 ring-teal-500/10"
                        : "border-slate-100 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-teal-500 text-white p-1 rounded-full">
                        <Check size={14} />
                      </div>
                    )}

                    <div className="font-black text-[#24938b] text-lg mb-2">
                      {a?.buildingName || "Home"}
                    </div>

                    <div className="text-slate-500 font-medium leading-relaxed">
                      {a?.street}, {a?.city}
                      <br />
                      {a?.state}, {a?.pincode}
                      <br />
                      {a?.country}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      
      {activeStep === 1 && (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100 flex justify-center">
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-center gap-3 mb-8">
              <CreditCard className="text-teal-500" size={28} />
              <h2 className="text-2xl font-black text-[#19817a]">
                Enter Card Details
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-black text-slate-600">Name on Card</label>
                <input
                  value={card.nameOnCard}
                  onChange={(e) => setCard((p) => ({ ...p, nameOnCard: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-200"
                  placeholder="Name on card"
                />
              </div>

              <div>
                <label className="text-sm font-black text-slate-600">Card Number</label>
                <input
                  value={card.cardNumber}
                  onChange={(e) => setCard((p) => ({ ...p, cardNumber: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-200"
                  placeholder="16 digit number "
                  inputMode="numeric"
                />
                
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-black text-slate-600">Expiry</label>
                  <input
                    value={card.expiry}
                    onChange={(e) => setCard((p) => ({ ...p, expiry: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="MM/YY"
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-600">CVV</label>
                  <input
                    value={card.cvv}
                    onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="CVV"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div
                className={`mt-2 p-4 rounded-2xl border text-sm font-bold ${
                  canProceedFromPayment
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {canProceedFromPayment
                  ? "Card details look valid "
                  : "Please enter valid card details to continue."}
              </div>
            </div>
          </div>
        </div>
      )}

     
      {activeStep === 2 && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100">
              <h3 className="text-xl font-black text-[#1f8780] mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-teal-500" /> Delivery Address
              </h3>

              <div className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl">
                <p className="font-black text-[#166e68] mb-1">
                  {selectedAddress?.buildingName}
                </p>
                <p>
                  {selectedAddress?.street}, {selectedAddress?.city}
                </p>
                <p>
                  {selectedAddress?.state}, {selectedAddress?.pincode},{" "}
                  {selectedAddress?.country}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100">
              <h3 className="text-xl font-black text-[#156c66] mb-6 flex items-center gap-2">
                <ClipboardList size={20} className="text-teal-500" /> Order Items ({cartCount})
              </h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map((p) => (
                  <div
                    key={p?.productId}
                    className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <img
                      src={p?.imageUrl || p?.image || PLACEHOLDER_IMG}
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                      alt={p?.productName}
                      className="h-16 w-16 rounded-xl object-cover shadow-sm"
                    />

                    <div className="flex-1">
                      <div className="font-black text-[#197069]">
                        {p?.productName}
                      </div>
                      <div className="text-teal-600 font-bold">
                        {p?.quantity} x $
                        {Number(p?.specialPrice ?? p?.price ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="font-black text-[#186c66]">
                      $
                      {(
                        Number(p?.quantity || 0) *
                        Number(p?.specialPrice ?? p?.price ?? 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

         
          <div className="bg-[#1e2f2e] rounded-[2.5rem] shadow-2xl p-8 h-fit text-white sticky top-10">
            <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">
              Order Summary
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-teal-100/70 font-medium">
                <span>Subtotal</span>
                <span className="text-white">
                  ${Number(totalPrice || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-teal-100/70 font-medium">
                <span>Tax (0%)</span>
                <span className="text-white">$0.00</span>
              </div>

              <div className="flex justify-between text-teal-100/70 font-medium">
                <span>Shipping</span>
                <span className="text-teal-400 font-black">FREE</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-lg font-black">Total</span>
                <span className="text-3xl font-black text-teal-400">
                  ${Number(totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-3 rounded-2xl bg-teal-500 text-[#edf6f5] font-black text-base hover:bg-teal-400 transition-all shadow-xl shadow-teal-900/40 active:scale-[0.98] disabled:opacity-50"
            >
              {placingOrder ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      )}

      
      <div className="flex items-center justify-between mt-12">
        <button
          type="button"
          onClick={activeStep === 0 ? () => navigate("/cart") : handleBack}
          disabled={placingOrder}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-[#155d58] bg-white border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
        >
          <ArrowLeft size={18} /> {activeStep === 0 ? "Back to Cart" : "Previous Step"}
        </button>

        {activeStep < 2 && (
          <button
            type="button"
            onClick={handleNext}
            disabled={
              placingOrder ||
              (activeStep === 0 && !canProceedFromAddress) ||
              (activeStep === 1 && !canProceedFromPayment)
            }
            className="px-10 py-4 rounded-2xl bg-[#29918a] text-white font-black hover:bg-teal-600 shadow-xl shadow-teal-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            Continue to {activeStep === 0 ? "Payment" : "Review"}
          </button>
        )}
      </div>
      <AddressInfoModal open={openAddressModal} setOpen={setOpenAddressModal}>
        <AddAddressForm address={null} setOpenAddressModal={setOpenAddressModal} />
      </AddressInfoModal>
    </div>
  );
};

export default Checkout;
