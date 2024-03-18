import { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from 'react-apexcharts';

const Reqchart = () => {
    const [requestData, setRequestData] = useState([]);
    const [hotelData, setHotelData] = useState([]);
    const [totalRequests,setTotalRequests] = useState(0);
    const [uniqueDepartments,setUniqueDepartments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://checkinn.co/api/v1/int/requests")
                setRequestData(response.data.requests);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const countHotelOccurrences = () => {
            const hotelCounts = {};
            const departmentSet = new Set();

            requestData.forEach(request => {
                const hotelName = request.hotel.name;
                hotelCounts[hotelName] = (hotelCounts[hotelName] || 0) + 1;
                departmentSet.add(request.desk.name);
            });
            console.log(departmentSet)
            setTotalRequests(requestData.length);
            setHotelData(Object.entries(hotelCounts));
            setUniqueDepartments(Array.from(departmentSet));
        };

        if (requestData.length > 0) {
            countHotelOccurrences();
        }
    }, [requestData]);

    const chartOptions = {
        chart: {
            height: 350,
            type: 'line', 
            zoom: {
              enabled: false
            },
            toolbar:{
              show:false,
            }
        },
        title: {
          text: 'Requests per Hotel',
          align: 'center'
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: hotelData.map(([hotelName, _]) => hotelName),
            labels: {
                style: {
                    fontSize: '12px'
                }
            },
            title: {
              text: undefined,
              offsetX: 0,
              offsetY: 0,
              style: {
                  color: undefined,
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  cssClass: 'apexcharts-xaxis-title',
              },
          },
            
        },
        yaxis: {
            title: {
                style: {
                    fontSize: '14px'
                }
            },
            min: 0,
            tickAmount: 4
        },
    
    };

    const chartSeries = [{
      name: 'Number of Requests', 
      data: hotelData.map(([_, count]) => count)
  }];

    return (
      <div className="container">
      <div id="chart">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={320} width={680} />
          <p id="heading" >Total Requests: {totalRequests}</p>
          <p>List of <i>unique</i> department names across all Hotels: {uniqueDepartments.join(', ')}</p>
      </div>
  </div>
    );
};

export default Reqchart;
