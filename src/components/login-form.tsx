import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (username === "" || password === "") {
      toast.error("Username/Password cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ username, password });
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the useAuth hook
    } finally {
      setIsSubmitting(false);
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
          Enter your username below to login to your account
        </p>
      </motion.div>
      
      <motion.div className="grid gap-6" variants={itemVariants}>
        <motion.div className="grid gap-3" variants={itemVariants}>
          <Label htmlFor="username">Username</Label>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-gray-400"
              disabled={isSubmitting}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-400"
              disabled={isSubmitting}
            />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
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