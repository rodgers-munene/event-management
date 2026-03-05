import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Loader2 } from "lucide-react";
import { authAPI } from "../../api/index.js";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ user_name: "", user_email: "", password: "", confirmPassword: "" });

  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.user_name?.trim() || form.user_name.trim().length < 2) { toast.error("Name must be at least 2 characters"); return false; }
    if (!form.user_email || !/\S+@\S+\.\S+/.test(form.user_email))   { toast.error("Enter a valid email"); return false; }
    if (!form.password || form.password.length < 8)                   { toast.error("Password must be at least 8 characters"); return false; }
    if (!/[A-Za-z]/.test(form.password))                              { toast.error("Password must contain a letter"); return false; }
    if (!/\d/.test(form.password))                                    { toast.error("Password must contain a number"); return false; }
    if (form.password !== form.confirmPassword)                       { toast.error("Passwords don't match"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await authAPI.register(data);
      if (res.data.success) {
        toast.success("Account created! Please log in.");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "user_name",       label: "Full Name",        type: "text",     placeholder: "Jane Doe"         },
    { id: "user_email",      label: "Email",            type: "email",    placeholder: "you@example.com"  },
    { id: "password",        label: "Password",         type: "password", placeholder: "••••••••"         },
    { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••"         },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
            <Calendar size={17} className="text-yellow-300" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">EventHub</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-7">
          <div className="mb-6">
            <p className="text-lg font-bold text-gray-900">Create an account</p>
            <p className="text-[13px] text-gray-400 mt-0.5">Join thousands of event-goers on EventHub</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  {label}
                </label>
                <input
                  id={id} type={type} name={id}
                  placeholder={placeholder}
                  value={form[id]} onChange={change} required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
                />
              </div>
            ))}

            <button
              type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Creating account…</> : "Create Account"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] text-gray-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-gray-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;