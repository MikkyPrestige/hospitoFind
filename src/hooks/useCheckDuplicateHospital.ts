import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiAlertTriangle, FiCheck  } from "react-icons/fi";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export const useCheckDuplicateHospital = () => {
    const [dupCheckLoading, setDupCheckLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const checkDuplicate = async (name: string, city: string, currentId?: string) => {
        if (!name || !city) {
            toast.warn("Enter Name and City first to check for duplicates.");
            return;
        }

        setDupCheckLoading(true);
        try {
            const { data } = await axiosPrivate.get(
                `/hospitals/check-duplicate?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}&currentId=${currentId || ""}`
            );

        if (data.isDuplicate) {
                 toast.error(data.message, {  icon: () => React.createElement(FiAlertTriangle)});
        } else {
                toast.success("No duplicates found in this city.", { icon: () => React.createElement(FiCheck)});
        }
            return data;
        } catch (err) {
            toast.error("Duplicate check unavailable. Please try again later.");
        } finally {
            setDupCheckLoading(false);
        }
    };

    return { checkDuplicate, dupCheckLoading };
};