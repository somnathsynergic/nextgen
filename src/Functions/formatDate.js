import moment from "moment"
export const formatDate=(dt,format)=>{
    return moment(dt).format(!format?'DD/MM/YYYY':format)
}