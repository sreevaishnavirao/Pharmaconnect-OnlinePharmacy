import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItemContent from "./ItemContent";
import CartEmpty from "./CartEmpty";
import { formatPrice } from "../../utils/formatPrice";


const BACKEND = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop";

const resolveImageUrl = (img) => {
  const s = String(img ?? "").trim();

  
  if (!s || s.toLowerCase() === "default.png" || s === "null" || s === "undefined") {
    return PLACEHOLDER_IMG;
  }

  
  if (/^https?:\/\//i.test(s) || s.startsWith("data:")) return s;

  
  if (s.startsWith("/")) return `${BACKEND}${s}`;

  
  return `${BACKEND}/images/${s}`;
};

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.carts);
  const newCart = { ...cart };

  newCart.totalPrice = cart?.reduce(
    (acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity),
    0
  );

  if (!cart || cart.length === 0) return <CartEmpty />;

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10 bg-slate-50/30 min-h-screen">
      
      <div className="flex flex-col items-center mb-12">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
          <MdShoppingCart size={32} className="text-teal-600" />
        </div>
        <h1 className="text-4xl font-black text-[#1e2f2e] tracking-tight">
          Your Cart
        </h1>
        <p className="text-lg text-slate-500 font-medium mt-1">
          Review your selected healthcare items
        </p>
      </div>

      
      <div className="grid md:grid-cols-5 grid-cols-4 gap-4 pb-4 border-b border-slate-200 font-bold items-center uppercase text-[11px] tracking-widest text-teal-600">
        <div className="md:col-span-2 justify-self-start lg:ps-4">Product</div>
        <div className="justify-self-center">Price</div>
        <div className="justify-self-center">Quantity</div>
        <div className="justify-self-center">Total</div>
      </div>

      
      <div className="mt-4">
        {cart &&
          cart.length > 0 &&
          cart.map((item, i) => {
           
            const fixedItem = {
              ...item,
              imageUrl: resolveImageUrl(item?.imageUrl || item?.image),
            };

            return <ItemContent key={i} {...fixedItem} />;
          })}
      </div>
      <div className="mt-10 border-t-[1.5px] border-slate-200 py-8 flex sm:flex-row sm:px-0 px-2 flex-col sm:justify-between gap-8">
        <div>
          <Link
            className="flex gap-2 items-center text-teal-600 hover:text-teal-700 font-bold transition-all"
            to="/products"
          >
            <MdArrowBack size={20} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="flex text-sm gap-3 flex-col bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 min-w-[320px]">
          <div className="flex justify-between w-full md:text-xl text-lg font-black text-[#1e2f2e]">
            <span>Subtotal</span>
            <span className="text-teal-600">
              {formatPrice(newCart?.totalPrice)}
            </span>
          </div>

          <p className="text-slate-400 font-medium">
            Taxes and shipping calculated at checkout
          </p>

          <Link className="w-full mt-2" to="/checkout">
            <button
              onClick={() => {}}
              className="font-black w-full py-4 px-4 rounded-2xl bg-[#198881] text-white flex items-center justify-center gap-3 hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-900/10 active:scale-[0.98]"
            >
              <MdShoppingCart size={22} />
              Checkout Now
            </button>
          </Link>

          <div className="flex items-center gap-2 justify-center mt-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
