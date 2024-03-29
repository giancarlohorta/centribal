import { useState } from "react";
import axios from "axios";
import constants from "../constants/constants";
// import { useNavigate } from "react-router-dom";

const { FETCH_STATUS } = constants;

const useOrderManagement = () => {
  const [order, setOrder] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.INITIAL);

  const fetchOrder = async (orderId) => {
    try {
      setFetchStatus(FETCH_STATUS.LOADING);
      const response = await axios.get(
        `http://localhost:3000/orders/${orderId}`
      );
      setOrder(response.data);
      setFetchStatus(FETCH_STATUS.DONE);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setFetchStatus(FETCH_STATUS.ERROR);
    }
  };

  const loading = fetchStatus === FETCH_STATUS.LOADING;
  const done = fetchStatus === FETCH_STATUS.DONE;
  const error = fetchStatus === FETCH_STATUS.ERROR;

  return {
    order,
    loading,
    done,
    error,
    fetchOrder,
  };
};

export default useOrderManagement;
