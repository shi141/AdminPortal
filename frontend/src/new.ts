import {jwtDecode} from 'jwt-decode' ;
import "core-js/stable/atob";
const url = 'http://127.0.0.1:80';
// import jwt_decode from 'jwt-decode';



// export const userListUrl = `${baseUrl}/api/users`;
export async function getdataa<T>(url:string): Promise<T[]> {
// try{
const token = localStorage.getItem('access_token');
  const response = await fetch('http://127.0.0.1:800', {
    // method: 'GET', // or POST/PUT depending on your use case
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Include JWT token in the Authorization header
    }
  });
  if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
  }
  
  const data = await response.json() as T[];
  return data;
// }
  // finally {
    
  //   window.location.reload();
  //   }
}






    // const headerContent: HeadersInit = { 'Content-Type': 'application/json' };
  
    // // if (token) {
    // //   headerContent.authorization = Bearer ${token};
    // // }
  
    // const response = await fetch("c", {
    //   method: 'GET',
    // //   headers: headerContent,
    // });
  
    // if (!response.ok) {
    //   throw new Error('Failed to fetch data. Status: ${response.status}');
    // //   throw new Error('Failed to fetch data. Status:',(response.status));
    
  
  //   const data = (await response.json()) as T[];
  //   console.log("hello")
  //   console.log(data)
  //   return data;
  // }
  
//     async function postData(URL:String) {
//     const body = data ? JSON.stringify(data) : null;
//     const headerContent: HeadersInit = { 'Content-Type': 'application/json' };
    
//         // if (token) {
//         //   headerContent.authorization = Bearer ${token};
//         // }
    
//     const response = await fetch("http://127.0.0.1:800", {
//     method: 'POST',
//       headers: headerContent,
//       body,
//     });
  
//     return response;
//   }