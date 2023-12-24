import axios from "axios"

type response = {
  id: string,
  status: string
}

const pay_to_email = process.env.PAY_TO_EMAIL
export async function getCheckoutId(amount: string) {
  const referenceId = Math.floor(100000 + Math.random() * 900000)
  try {
    const apiUrl = "https://api.sumup.com/v0.1/checkouts"

    const response = await fetch(apiUrl, { // Ensure the path is correct based on your file structure
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer sup_sk_om3EX5ZZhebf3h5esIYDaaNi8YT1I0ZKb"
      },
      body: JSON.stringify({ 
        checkout_reference: referenceId,
        amount,
        currency: "EUR",
        pay_to_email: pay_to_email,
        description: "Payment for booking boat"
       })
    });
    
    const res = await response.json();

    return res
  } 
  catch (error: any)
   {
    console.error("Error while processing payment", error.message);
    return { error: error.message };
  }
}