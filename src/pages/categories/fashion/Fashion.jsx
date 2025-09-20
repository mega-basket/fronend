/* eslint-disable react-refresh/only-export-components */
import FashionCard from "./components/FashionCard";
import { useNavigate } from "react-router-dom";
import { GetProductApi } from "../../../api/component/productApi";

const Fashion = () => {
  const navigate = useNavigate();
  const { data } = GetProductApi();
  console.log("data: =>", data);

  return (
    <div
      className="grid gap-4 
                 grid-cols-1 sm:grid-cols-2 
                 md:grid-cols-3 lg:grid-cols-4 
                 mt-10 mx-10"
    >
      {data?.map((items, index) => (
        <div key={index} onClick={() => navigate(`/fashion/${items._id}`)}>
          <FashionCard items={items} />
        </div>
      ))}
    </div>
  );
};

export default Fashion;
