'use client'

import BasicLineChart from '@/components/BasiLineChart';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Page() {
    const params = useParams();
    const shortLink = params.shortLink;

    const [linkData, setLinkData] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/link?id=${shortLink}`);
          console.log("User Links:", response.data.data); 
          setLinkData(response.data.data);
        } catch (error) {
          console.error("Error details: ", error);
          console.error("Error fetching user links:", error);
        }
      };
    
      fetchData(); // Call the async function
    }, [shortLink]);
    

  return (
    <div className='bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2'>
        <h1>Analytics Page {shortLink}</h1>
        <BasicLineChart/>
    </div>
  )
}

export default Page;