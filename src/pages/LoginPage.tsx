import { LoginForm } from "@/components/login-form";
import {
  IconChalkboardTeacher,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 overflow-hidden">
      <motion.div 
        className="flex flex-col gap-4 p-6 md:p-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="flex justify-center gap-2 md:justify-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a href="#" className="flex items-center gap-2 font-medium">
            <motion.div 
              className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <IconChalkboardTeacher className="size-4" />
            </motion.div>
            Student Management Portal
          </a>
        </motion.div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
        <div className="flex items-center justify-center text-center text-sm text-muted-foreground w-full">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-medium text-blue-900 mb-1">Demo Credentials - 
           Username: <span className="font-mono font-semibold">admin  ,</span>
                       <span className="font-medium text-blue-900 mb-1">Password: </span>
               <span className="font-mono font-semibold">admin02</span></p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-gray-950 relative hidden lg:block overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-1/4 right-0 w-32 h-32 bg-white rounded-full translate-x-16"
            animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-white rounded-full"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 270, 540] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-36 h-36 bg-white rounded-full translate-y-18"
            animate={{ scale: [1, 1.08, 1], rotate: [0, -270, -540] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20  }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              
            </motion.div>
            
          </div>
        </motion.div>
      </motion.div>
      
    </div>
  );
}