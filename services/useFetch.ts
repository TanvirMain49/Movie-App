import { useEffect, useState } from "react";

const useFetch=<T>(fetchFunction :()=> Promise<T>, autoFetch= true)=>{
    const [data, setData] = useState<T | null>(null);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async() =>{
        try {
            setLoader(true);
            setError(null);

            const result = await fetchFunction()
            setData(result);
            
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurs'))
        } finally{
            setLoader(false);
        }
    }

    const reset = ()=>{
        setData(null);
        setLoader(false);
        setError(null)
    }

    useEffect(()=>{
        if(autoFetch){
            fetchData();
        }
    }, []);

    return {data, loader, error, refetch: fetchData, reset}
}

export default useFetch;