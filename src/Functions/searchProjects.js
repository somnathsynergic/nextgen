import axios from "axios";
import { url } from "../Address/BaseUrl";

export const searchProjects = async (searchVal) => {
    try {
        const response = await axios.post(
            url + "/api/searchproject",
            {
               searchVal: searchVal
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};