"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { IoMdArrowRoundBack } from "react-icons/io";

function CityList() {
    const [cityList, setCityList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageRef = useRef(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=cou_name_en&limit=100&offset=${pageRef.current}`);
            const data = await response.json();
            if (searchTerm !== "") {
                console.log(data)
                setCityList([]);
            }
            const uniqueCities = new Set();
            data.results.forEach(city => uniqueCities.add(city.ascii_name));

            const uniqueCityList = Array.from(uniqueCities).map(cityName => data.results.find(city => city.ascii_name === cityName));

            setCityList(prevCityList => [...prevCityList, ...uniqueCityList]);
            setHasMore(data.results.length > 0);
            pageRef.current += 200;
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    const handleSearch = useCallback(async () => {
        setCityList([]); // Clear existing city list
        pageRef.current = 1; // Reset page number
        try {
            setLoading(true);
            const response = await fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchTerm}&offset=${pageRef.current}`);
            const data = await response.json();
            console.log(data)
            const uniqueCities = new Set();
            data.records.forEach(record => uniqueCities.add(record.fields.ascii_name));

            const uniqueCityList = Array.from(uniqueCities).map(cityName => data.records.find(record => record.fields.ascii_name === cityName).fields);

            setCityList(prevCityList => [...prevCityList, ...uniqueCityList]);
            setHasMore(data.records.length > 0);
            pageRef.current += 1;
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    const handlesearchchange = useCallback((e) => {
        setSearchTerm(e.target.value)
        handleSearch();
    }, [handleSearch]);

    useEffect(() => {
        const observerCallback = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !loading && hasMore && searchTerm === "") {
                    fetchData();
                }
            });
        };

        const observerOptions = { threshold: 0.5 };
        const loadMoreTrigger = document.querySelector('#loadMoreTrigger');

        if (loadMoreTrigger) {
            const observer = new IntersectionObserver(observerCallback, observerOptions);
            observer.observe(loadMoreTrigger);
            return () => observer.disconnect();
        } else {
            console.warn("Load more trigger element not found.");
        }
    }, [loading, hasMore, fetchData, searchTerm]);

    return (
        <div className="mx-3">
            <div className='flex items-center border-2 border-black mx-auto  rounded-lg  w-3/4 mb-11 lg:w-1/2'>
                <input
                    type="text"
                    className='w-full p-3  rounded-l-lg outline-none '
                    placeholder='Enter city'
                    value={searchTerm}
                    onChange={handlesearchchange}
                />

                <button className='p-3 hover:bg-[#f79d61] bg-white font-bold rounded-r-lg' onClick={handleSearch}>Search</button>
            </div>
            <table className=' font-700 lg:text-xl   '>
                <thead className='h-[60px] border-b-2 border-black bg-[#ff5e00c6] '>
                    <tr className=''>
                        <th className='border-2 border-black'>Code</th>
                        <th className='border-2 border-black'>City </th>
                        <th className='border-2 border-black'>Country </th>
                        <th className='border-2 border-black'>Population</th>
                        <th className='border-2 border-black'> zone</th>
                    </tr>
                </thead>
                <tbody>
                    {cityList.map((city, index) => (
                        <tr key={index} className='h-[50px] text-center hover:bg-white cursor-pointer hover:m-3'>

                            <td className=''>
                                <a href={`/Weather/${city.ascii_name}/${city.coordinates.lon}/${city.coordinates.lat}`} className='flex items-center h-[50px] w-full justify-center border-2 border-black'>
                                    {city.country_code}
                                </a>
                            </td>

                            <td >
                                <a href={`/Weather/${city.ascii_name}/${city.coordinates.lon}/${city.coordinates.lat}`} className='flex items-center h-[50px] w-full justify-center border-2 border-black'>
                                    {city.ascii_name}
                                </a>
                            </td>

                            <td>
                                <a href={`/Weather/${city.ascii_name}/${city.coordinates.lon}/${city.coordinates.lat}`} className='flex items-center h-[50px] w-full justify-center border-2 border-black'>
                                    {city.cou_name_en}
                                </a>
                            </td>

                            <td >
                                <a href={`/Weather/${city.ascii_name}/${city.coordinates.lon}/${city.coordinates.lat}`} className='flex items-center h-[50px] w-full justify-center border-2 border-black'>
                                    {city.population}
                                </a>
                            </td>

                            <td >
                                <a href={`/Weather/${city.ascii_name}/${city.coordinates.lon}/${city.coordinates.lat}`} className='flex items-center h-[50px] w-full justify-center border-2 border-black'>
                                    {city.timezone}
                                </a>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <p className='text-center my-6 font-semibold '><ClipLoader
                color="black"
                loading={loading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
            /></p>}
            {!loading && hasMore && <p id="loadMoreTrigger" className='my-3 text-center'>Load more...</p>}
            {!hasMore && <p className='my-5'>No more cities to load.</p>}
        </div>
    );
}

export default CityList;
