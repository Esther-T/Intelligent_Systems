import { useState, useEffect } from "react";
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

  
function Currency() {
	const [currency, setCurrency] = useState("")

	useEffect(() => {
		getCurrency();
	  }, []);



	const getCurrency = async () => {
		try {
		  const res = await fetch("https://chatbotback-7zvm.onrender.com/currency"); 
		  if (res.ok) {
			const data = await res.json();   
			setCurrency(data.currency);   
		  } 
		} catch (error) {
		}
	  };
	  
  return (
    <div className="Currency">
      <Alert key="currency" variant="warning">
		Projected MYR to USD Rate at Month End: {currency == "" ? <Spinner size="sm" role="currency" style={{ verticalAlign: 'middle' }}/> : currency}
	  </Alert>
    </div>
  );
}

export default Currency;
