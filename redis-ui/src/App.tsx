import { useEffect, useState } from 'react';

interface Document{
  store: string;
  value: string;
  resource_id: string;
  section: string;
  language: string;
  retailer: string;
  type: string;
  endpoint: string;
}
interface Documents {
  Id: string
  Properties: Document;
}
function App() {
  const fetchDocuments = async () => {
    try {
      const responseData = await fetch("/api/hello")
      .then(res => res.json());
     setMessage(responseData.message);

    } catch (err) {console.log("error fetching", err)}}
  const [message, setMessage] = useState<Documents[]>([]);
  useEffect(() => {
    fetchDocuments();
  },[fetch]);
  return (
    <div><h1>React + go app</h1><p>
      {message.map((value, index) => 
        <div>
          <p>{value.Id}</p>
          <div>
            <p>{value.Properties.endpoint}</p>
            <p>{value.Properties.language}</p>
            <p>{value.Properties.resource_id}</p>
            <p>{value.Properties.retailer}</p>
            <p>{value.Properties.section}</p>
            <p>{value.Properties.store}</p>
            <p>{value.Properties.type}</p>
            <p>{value.Properties.value}</p>
          </div>
        </div>
      )}</p></div>
  );
}

export default App;
