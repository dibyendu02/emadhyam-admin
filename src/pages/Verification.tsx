// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { CardContent, Card } from "@/components/ui/card";
// // import {
// //   InputOTP,
// //   InputOTPGroup,
// //   InputOTPSlot,
// // } from "@/components/ui/input-otp";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   verificationStart,
//   verificationSuccess,
//   verificationFailure,
// } from "@/redux/authSlice"; // Ensure to import these actions
// import { postData } from "../global/server";
// import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation to access the navigation state
//

// export default function Verification() {
//   const [otp, setOtp] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Extract phone number from the navigation state
//   const { phoneNumber } = location.state || {};

//   // const handleOtpChange = (index: number, value: string) => {
//   //   console.log(otp);
//   //   console.log("handling input change");
//   //   setOtp((prevOtp) => ({
//   //     ...prevOtp,
//   //     [`otp${index + 1}`]: value,
//   //   }));
//   // };

//   const handleVerify = async () => {
//     // const fullOtp = `${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}${otp.otp5}${otp.otp6}`;

//     console.log(otp);

//     if (otp.length === 6) {
//       try {
//         dispatch(verificationStart()); // Dispatch verification start action
//         const response = await postData(
//           "/api/auth/verify-otp",
//           { phone: phoneNumber, otp: otp },
//           null,
//           null
//         );
//         console.log(response);

//         if (response?.success) {
//           // // Store the token in AsyncStorage
//           // await storeData("token", response.token);
//           // await storeData("userId", response.user._id);

//           //store token in localstorage
//           localStorage.setItem("userId", response.user._id);
//           localStorage.setItem("authToken", response.token);

//           dispatch(verificationSuccess(response));

//           navigate("/product");
//         } else {
//           dispatch(verificationFailure(response?.message)); // Dispatch verification failure action
//           alert("OTP verification failed. Please try again.");
//         }
//       } catch (error: any) {
//         dispatch(verificationFailure(error)); // Dispatch verification failure action
//         console.error(
//           "OTP verification error:",
//           error.response ? error.response.data : error.message
//         );
//       }
//     } else {
//       alert("Please enter the complete OTP.");
//     }
//   };

//   return (
//     <div className="mx-auto max-w-[450px] min-h-screen space-y-6 flex flex-col justify-center ">
//       <div className="space-y-2 text-center">
//         <h1 className="text-3xl font-bold">Get Started as an Admin</h1>
//         <p className="text-gray-500 dark:text-gray-400">
//           Enter your OTP to continue
//         </p>
//       </div>
//       <Card>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="otp">OTP</Label>
//             {/* <InputOTP maxLength={6}>
//               <InputOTPGroup>
//                 {Array.from({ length: 6 }).map((_, index) => (
//                   <InputOTPSlot
//                     key={index}
//                     index={index}
//                     value={otp[`otp${index + 1}`]}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       handleOtpChange(index, e.target.value)
//                     }
//                   />
//                 ))}
//               </InputOTPGroup>
//             </InputOTP> */}
//             <Input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="123456"
//               autoComplete="true"
//             />
//           </div>

//           <Button className="w-full" type="submit" onClick={handleVerify}>
//             Verify
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

const Verification = () => {
  return <div></div>;
};

export default Verification;
