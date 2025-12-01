import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = (e: any) => {
    e.preventDefault();
    const user = state.customers.find(
      (u: any) => u.email === form.email && u.password === form.password
    );
    if (!user) {
      alert("Invalid email/password");
      return;
    }
    dispatch({ type: "LOGIN", payload: user });
    navigate("/customer/dashboard");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-semibold text-center mb-6">
          Co-Working Space Login
        </h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Email</label>
            <input
              type="email"
              className="border rounded-md px-3 py-2"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Password</label>
            <input
              type="password"
              className="border rounded-md px-3 py-2"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full mt-2 cursor-pointer">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
