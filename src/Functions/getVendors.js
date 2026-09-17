import axios from "axios";
import { url } from "../Address/BaseUrl";

export const getVendors = async (id, offset , limit) => {
    try {
        const response = await axios.post(
            url + "/api/getvendor_pg",
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