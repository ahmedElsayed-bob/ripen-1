"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    console.log({ email, password });
    setErrors({ email: "", password: "" });

    if (!email || !password) {
      setErrors({
        ...errors,
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
    } else {
      router.push("/fields/dashboards");
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 h-screen p-6 gap-6">
          <div className="flex flex-col gap-6 justify-center">
            <div className="max-w-[360px]">
              <Image
                src="/ai71-logo.svg"
                alt="ai71-logo"
                className="mb-4"
                width={100}
                height={100}
              />

              <p className="text-[30px]/[36px] font-bold mb-3 font-myfont text-[#736E68]">
                Sign in
              </p>
              <p className="mb-6 text-sm text-col text-[#6B6661]">
                Log in to unlock tailored content and stay connected with your
                community.
              </p>

              <div className="flex flex-col mb-4">
                <Label
                  className={`block text-sm font-medium mb-2 text-[#212D45] ${
                    errors.email ? "text-red-500" : ""
                  }`}
                >
                  Email
                </Label>
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <Label
                  className={`block text-sm font-medium mb-2  text-[#212D45] ${
                    errors.password ? "text-red-500" : ""
                  }`}
                >
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="terms" />
                  <Label htmlFor="terms">Keep me signed in</Label>
                </div>
                <span className="text-[#6B6661] text-sm underline">
                  Forgot password?
                </span>
              </div>

              <Button
                className="w-full bg-[#0D826B] mb-4"
                onClick={handleLogin}
              >
                Sign in
              </Button>
              <p className="text-sm text-center ">
                Don't have an account?
                <a href="#" className="text-[#0D826B] ms-2">
                  Sign up
                </a>
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden">
            <Image
              src="/signin.png"
              alt="login-right"
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
