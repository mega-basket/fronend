const ProductsCard = ({ items }) => {
  return (
    <div>
      <div
        className="p-2 bg-white rounded-lg cursor-pointer 
                   transition-transform duration-300 ease-in-out 
                   hover:scale-105"
      >
        <div className="rounded-lg">
          <img src={items.thumbnail} alt="image" className="rounded-lg" />
        </div>
        <div className="font-poppins text-black">
          <h3 className="font-semibold">{items.productName}</h3>
          <p>
            Price: <span className="font-bold"> RS.{items.price}</span>{" "}
          </p>
          <p>
            Discount:<span className="font-bold"> {items.discountPrice}</span>{" "}
          </p>
          <p>Buy It Now </p>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
