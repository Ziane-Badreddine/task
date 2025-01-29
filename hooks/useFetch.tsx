import { Task } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const useFetch = (url: string, interval = 1000) => {


    const [data, setData] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId;
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(url)
                setData(response.data);
                setError(null)

            } catch (error) {
                setError("Something be wrong");
            } finally {
                setLoading(false);

            }
        }
        fetchData();
        intervalId = setInterval(fetchData, interval);

        return () => {
            clearInterval(intervalId)
        };
    }, [url, interval])

    return { data, error, loading }
};


export default useFetch