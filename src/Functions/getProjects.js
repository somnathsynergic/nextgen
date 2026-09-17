import axios from "axios";
import { url } from "../Address/BaseUrl";

export const getProjects = async (id, offset , limit) => {
    try {
        const response = await axios.post(
            url + "/api/getproject_pg",
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
};