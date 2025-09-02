import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (Username === "" || password === "") {
      toast.error("Email/Password cannot be empty");
      return;
    }

    if (Username === "admin@gmail.com" && password === "admin02") {
      navigate("/dashboard");
      toast.success("Logged in Successfully");
    } else {
      toast.error("Incorrect Login Details");
    }
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <form
      onSubmit={handleLogin}   //form handles submit
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <motion.div 
        className="flex flex-col items-center gap-2 text-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </motion.div>
      
      <motion.div className="grid gap-6" variants={itemVariants}>
        <motion.div className="grid gap-3" variants={itemVariants}>
          <Label htmlFor="email">Email</Label>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              id="email"
              type="email"
              placeholder="admin@gmail.com"
              onChange={(e) => setUsername(e.target.value)}
              className="border-gray-400"
            />
          </motion.div>
        </motion.div>
        
        <motion.div className="grid gap-3" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-400"
            />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="text-center text-sm"
        variants={itemVariants}
      >
        Don&apos;t have an account?{" "}
        <motion.a 
          href="#" 
          className="underline underline-offset-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          Sign up
        </motion.a>
      </motion.div>
    </form>
  );
}