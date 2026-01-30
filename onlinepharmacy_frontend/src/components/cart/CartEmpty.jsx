import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

const CartEmpty = () => {
 return (
    <div className="min-h-[800px] flex flex-col items-center justify-center bg-slate-50/30">
        <div className="flex flex-col items-center">
          
            <div className="p-8 bg-teal-50 rounded-full mb-6">
                <MdShoppingCart size={80} className="text-teal-600/40"/>
            </div>
            <div className="text-3xl font-black text-[#1e2f2e] tracking-tight">
                Your cart is empty
            </div>
            <div className="text-lg text-slate-500 mt-2 font-medium">
                Add some products to get started
            </div>
        </div>
        
        <div className="mt-8">
            <Link
                to="/"
                className="flex gap-2 items-center px-8 py-3 bg-[#19827b] text-white rounded-2xl hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-900/10 active:scale-95"
            >
                    <MdArrowBack size={20} />
                    <span className="font-bold">Start Shopping</span>
            </Link>
        </div>
    </div>
 )   
}

export default CartEmpty;