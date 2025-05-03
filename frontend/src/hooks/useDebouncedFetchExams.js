// src/hooks/useDebouncedFetchExams.js
import { useRef } from "react";
import { setLoading } from "../features/state/stateApiSlice";
import { fetchPublicExams } from "../features/exam/examSlice";

const useDebouncedFetchExams = (dispatch, delay = 500) => {
    const timeoutRef = useRef(null);

    const debouncedFetch = (params) => {
        dispatch(setLoading(true));

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            dispatch(fetchPublicExams(params))
                .finally(() => {
                    dispatch(setLoading(false));
                });
        }, delay);
    };

    return debouncedFetch;
};

export default useDebouncedFetchExams;
