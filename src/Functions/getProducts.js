import axios from "axios";
import { url } from "../Address/BaseUrl";

export const getProducts = async (id, offset , limit) => {
    try {
        const response = await axios.post(
            url + "/api/getproduct_pg",
            {
                id:id,
                limit:limit,
                offset:offset
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}