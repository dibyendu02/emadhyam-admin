import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";

import {
  signupFailure,
  signupStart,
  signupSuccess,
  updateUser,
} from "@/redux/authSlice";
import logo from "../assets/logo.png";
import { postData } from "@/global/server";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  // If token and userId are already in localStorage, directly update the Redux slice
  useEffect(() => {
    if (token && userId) {
      dispatch(updateUser({ token, user: { id: userId } }));
      navigate("/orders"); // Redirect the user directly
    }
  }, [token, userId, dispatch, navigate]);

  const handleLogin = async () => {
    dispatch(signupStart());
    try {
      // Make the API call for email and password login
      const response = await postData(
        "/api/user/login",
        { email, password },
        null,
        null
      );

      // Dispatch success action with token and admin details
      dispatch(signupSuccess({ token: response.token, admin: response.user }));

      // Store the response token and userId in localStorage
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userId", response.user.id);

      // Redirect to the users page upon successful login
      navigate("/orders");
    } catch (err) {
      dispatch(signupFailure(err));
      console.log(err);
    }
  };

  return (
    <div className="mx-auto max-w-[450px] min-h-screen space-y-6 flex flex-col justify-center">
      <div className="flex justify-center">
        <img src={logo} alt="logo" className="w-60" />
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Get Started as an Admin</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email and password to continue
        </p>
      </div>
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="true"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="true"
              type="password"
            />
          </div>

          <Button className="w-full" onClick={handleLogin} type="submit">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
