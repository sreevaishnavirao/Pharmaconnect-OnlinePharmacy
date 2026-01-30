import { useState, useMemo } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import SetQuantity from "./SetQuantity";
import { useDispatch } from "react-redux";
import {
  decreaseCartQuantity,
  increaseCartQuantity,
  removeFromCart,
} from "../../store/actions";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/formatPrice";
import truncateText from "../../utils/truncateText";


const BACKEND = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";


const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop";


const resolveImageUrl = (img) => {
  const s = String(img ?? "").trim();

  
  if (
    !s ||
    s.toLowerCase() === "default.png" ||
    s === "null" ||
    s === "undefined"
  ) {
    return PLACEHOLDER_IMG;
  }

 
  if (/^https?:\/\//i.test(s) || s.startsWith("data:")) return s;

 
  if (s.startsWith("/")) return `${BACKEND}${s}`;


  return `${BACKEND}/images/${s}`;
};

const ItemContent = ({
  productId,
  productName,
  imageUrl, 
  image,    
  description,
  quantity,
  price,
  discount,
  specialPrice,
}) => {
  const dispatch = useDispatch();
  const [currentQuantity, setCurrentQuantity] = useState(Number(quantity || 1));


  const imgSrc = useMemo(
    () => resolveImageUrl(imageUrl || image),
    [imageUrl, image]
  );

  
  const cartItem = useMemo(
    () => ({
      productId,
      productName,
      
      image: imageUrl || image || "",
      description,
      price,
      discount,
      specialPrice,
      quantity: currentQuantity,
    }),
    [
      productId,
      productName,
      imageUrl,
      image,
      description,
      price,
      discount,
      specialPrice,
      currentQuantity,
    ]
  );

  const handleQtyIncrease = () => {
    dispatch(
      increaseCartQuantity(cartItem, toast, currentQuantity, setCurrentQuantity)
    );
  };

  const handleQtyDecrease = () => {
    dispatch(
      decreaseCartQuantity(cartItem, toast, currentQuantity, setCurrentQuantity)
    );
  };

  const removeItemFromCart = () => {
    dispatch(removeFromCart(cartItem, toast));
  };

  return (
    <div className="grid md:grid-cols-5 grid-cols-4 md:text-md text-sm gap-4 items-center border border-slate-200 rounded-md lg:px-4 py-4 p-2">
      <div className="md:col-span-2 justify-self-start flex flex-col gap-2">
        <div className="flex md:flex-row flex-col lg:gap-4 sm:gap-3 gap-0 items-start">
          <h3 className="lg:text-[17px] text-sm font-semibold text-slate-600">
            {truncateText(productName)}
          </h3>
        </div>

        <div className="md:w-36 sm:w-24 w-12">
          <img
            src={imgSrc}
            alt={productName}
            className="md:h-36 sm:h-24 h-12 w-full object-cover rounded-md"
            
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMG;
            }}
          />

          <div className="flex items-start gap-5 mt-3">
            <button
              onClick={removeItemFromCart}
              className="flex items-center font-semibold space-x-2 px-4 py-1 text-xs border border-rose-600 text-rose-600 rounded-md hover:bg-red-50 transition-colors duration-200"
            >
              <HiOutlineTrash size={16} className="text-rose-600" />
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
        {formatPrice(Number(specialPrice))}
      </div>

      <div className="justify-self-center">
        <SetQuantity
          quantity={currentQuantity}
          cardCounter={true}
          handeQtyIncrease={handleQtyIncrease}
          handleQtyDecrease={handleQtyDecrease}
        />
      </div>

      <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
        {formatPrice(Number(currentQuantity) * Number(specialPrice))}
      </div>
    </div>
  );
};

export default ItemContent;
